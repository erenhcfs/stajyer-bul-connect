import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { handleAdminRequest, authenticated } from "../src/lib/admin.server.ts";
import { slugify } from "../src/lib/blog-helpers.ts";

process.env.ADMIN_PASSWORD = "test-password";
process.env.ADMIN_SESSION_SECRET = "test-only-session-secret-long-enough";
const call = (path, method = "GET", body, cookie, origin) =>
  handleAdminRequest(
    new Request(`https://example.test/api/${path}`, {
      method,
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(origin ? { origin } : {}),
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
  );
async function login() {
  const response = await call("admin-login", "POST", {
    username: "admin",
    password: "test-password",
  });
  assert.equal(response.status, 200);
  return response.headers.get("set-cookie").split(";")[0];
}

test("management and blog writes require a server session", async () => {
  for (const path of ["admin-data", "blog-posts", "blog-generate"]) {
    assert.equal((await call(path, "POST", {})).status, 401);
  }
  assert.equal((await call("admin-check")).status, 200);
  assert.equal((await (await call("admin-check")).json()).authenticated, false);
});
test("wrong and malformed passwords never establish a session", async () => {
  for (const password of ["wrong", 123, null, "ş".repeat(13)])
    assert.equal((await call("admin-login", "POST", { password })).status, 401);
  assert.equal((await call("admin-login", "POST", null)).status, 401);
  assert.equal(
    (
      await call("admin-login", "POST", {
        username: "someone-else",
        password: "test-password",
      })
    ).status,
    401,
  );
});
test("valid cookie is HttpOnly, Secure, and recognized by both panels", async () => {
  const response = await call("admin-login", "POST", {
    username: "admin",
    password: "test-password",
  });
  assert.match(response.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/);
  assert.match(response.headers.get("set-cookie"), /Secure/);
  const cookie = response.headers.get("set-cookie").split(";")[0];
  assert.equal(
    (await (await call("admin-check", "GET", undefined, cookie)).json()).authenticated,
    true,
  );
});
test("forged, expired, malformed cookies are rejected", () => {
  for (const value of [
    "true",
    "%E0%A4%A",
    "1.abc",
    "123." + "a".repeat(64),
    "1." + "a".repeat(64) + ".extra",
  ])
    assert.equal(authenticated(`admin_session=${value}`), false);
  const payload = String(Date.now() - 1000);
  const sig = createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(payload).digest("hex");
  assert.equal(authenticated(`admin_session=${payload}.${sig}`), false);
});
test("cross-origin mutations are rejected and logout only accepts POST", async () => {
  const cookie = await login();
  assert.equal(
    (await call("admin-data", "PATCH", {}, cookie, "https://attacker.test")).status,
    403,
  );
  assert.equal((await call("admin-logout", "GET", undefined, cookie)).status, 405);
  const response = await call("admin-logout", "POST", {}, cookie);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
});
test("missing server configuration is explicit", async () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  delete process.env.ADMIN_SESSION_SECRET;
  try {
    assert.equal((await call("admin-login", "POST", { password: "test-password" })).status, 503);
  } finally {
    process.env.ADMIN_SESSION_SECRET = secret;
  }
});
test("publishing retries collisions and preserves draft, slug and image", async () => {
  const cookie = await login();
  process.env.SUPABASE_URL = "https://database.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  const original = globalThis.fetch;
  const inserted = [];
  globalThis.fetch = async (_url, options) => {
    inserted.push(JSON.parse(options.body));
    if (inserted.length === 1)
      return Response.json({ code: "23505", message: "duplicate slug" }, { status: 409 });
    return Response.json({ id: "test-id", ...inserted.at(-1) }, { status: 201 });
  };
  try {
    const response = await call(
      "blog-posts",
      "POST",
      {
        title: "İlk Staj",
        slug: "Özel Başlık",
        excerpt: "Özet",
        content: "İçerik",
        category: "Staj Süreçleri",
        published: false,
        image_url: "https://example.test/photo.png",
      },
      cookie,
    );
    assert.equal(response.status, 201);
    assert.equal(inserted[0].slug, "ozel-baslik");
    const post = (await response.json()).post;
    assert.equal(post.slug, "ozel-baslik-2");
    assert.equal(post.published, false);
    assert.equal(post.image_url, "https://example.test/photo.png");
  } finally {
    globalThis.fetch = original;
  }
});
test("invalid blog input is rejected before writing", async () => {
  const cookie = await login();
  assert.equal((await call("blog-posts", "POST", { title: 42 }, cookie)).status, 400);
  assert.equal(
    (
      await call(
        "blog-posts",
        "POST",
        { title: "A", excerpt: "B", content: "C", category: "D", image_url: "javascript:alert(1)" },
        cookie,
      )
    ).status,
    400,
  );
});
test("Turkish slugs remain stable", () =>
  assert.equal(slugify("İŞ Görüşmesi: Çığ ÖÜ"), "is-gorusmesi-cig-ou"));
