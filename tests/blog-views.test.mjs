import test from "node:test";
import assert from "node:assert/strict";
import { blogViewResponse } from "../src/lib/blog-views.server.ts";
import { recordBlogView } from "../src/lib/blog-views.ts";
import { STATIC_BLOG_POSTS, mergeBlogPosts } from "../src/lib/blog-posts.ts";

process.env.SUPABASE_URL = "https://database.test";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only";
globalThis.sessionStorage = undefined;

const slug = STATIC_BLOG_POSTS[0].slug;
const request = (method = "POST", value = slug, origin = "https://site.test") =>
  new Request(`https://site.test/api/blog-view?slug=${value}`, { method, headers: { origin } });
const reply = (body, status = 200) => Response.json(body, { status });
function database(t, handler) {
  t.mock.method(globalThis, "fetch", handler);
}
function storage(t) {
  const values = new Map();
  t.mock.property(globalThis, "sessionStorage", {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  });
  return values;
}

test("bundled post is inserted without overwriting existing edits before atomic increment", async (t) => {
  const calls = [];
  database(t, async (url, options) => {
    calls.push({ url: String(url), options });
    return String(url).includes("/rpc/") ? reply(8) : new Response(null, { status: 201 });
  });
  const result = await blogViewResponse(request());
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { count: 8 });
  assert.match(calls[0].options.headers.get("prefer"), /resolution=ignore-duplicates/);
  const row = JSON.parse(calls[0].options.body);
  assert.equal(row.slug, slug);
  assert.equal(row.view_count, 0);
  assert.equal(row.id, undefined);
  assert.equal(row.sources, undefined);
  assert.equal(row.faqs, undefined);
  assert.match(calls[1].url, /rpc\/increment_blog_view/);
});

test("unknown slugs cannot create posts; drafts and missing rows cannot increment", async (t) => {
  const calls = [];
  database(t, async (url) => {
    calls.push(String(url));
    return reply(null);
  });
  assert.equal((await blogViewResponse(request("POST", "unknown-post"))).status, 404);
  assert.equal(calls.length, 1);
  assert.match(calls[0], /rpc\/increment_blog_view/);
});

test("read requests do not increment and failures never report zero", async (t) => {
  database(t, async (url, options) => {
    assert.equal(options.method, "GET");
    assert.match(String(url), /published=eq.true/);
    return reply({ view_count: 23 });
  });
  assert.deepEqual(await (await blogViewResponse(request("GET"))).json(), { count: 23 });
  t.mock.method(globalThis, "fetch", async () => reply({ code: "PGRST205" }, 404));
  const failed = await blogViewResponse(request("GET"));
  assert.equal(failed.status, 503);
  assert.equal((await failed.json()).count, undefined);
});

test("cross-origin requests, invalid slugs and unsupported methods are rejected", async () => {
  assert.equal(
    (await blogViewResponse(request("POST", slug, "https://elsewhere.test"))).status,
    403,
  );
  assert.equal((await blogViewResponse(request("POST", "bad_slug"))).status, 400);
  assert.equal((await blogViewResponse(request("DELETE"))).status, 405);
});

test("client retries after failure, coalesces remounts and reads count after success", async (t) => {
  const values = storage(t);
  const methods = [];
  let success = false;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    methods.push(options.method);
    return success ? reply({ count: 12 }) : reply({ error: "Unavailable" }, 503);
  });
  assert.equal(await recordBlogView(slug), null);
  assert.equal(values.size, 0);
  success = true;
  const first = recordBlogView(slug);
  assert.equal(recordBlogView(slug), first);
  assert.equal(await first, 12);
  assert.equal(values.get(`blog-viewed:v2:${slug}`), "1");
  assert.equal(await recordBlogView(slug), 12);
  assert.deepEqual(methods, ["POST", "POST", "GET"]);
});

test("blocked storage and network errors do not break the article", async (t) => {
  t.mock.property(globalThis, "sessionStorage", {
    getItem() {
      throw Error("blocked");
    },
    setItem() {
      throw Error("blocked");
    },
  });
  t.mock.method(globalThis, "fetch", async () => reply({ count: 5 }));
  assert.equal(await recordBlogView("other-post"), 5);
  t.mock.method(globalThis, "fetch", async () => {
    throw Error("offline");
  });
  assert.equal(await recordBlogView("other-post"), null);
});

test("database counters retain editorial references, FAQs and administrator edits", () => {
  const editorial = STATIC_BLOG_POSTS[0];
  assert.equal(editorial.view_count, null);
  const { sources, faqs, ...row } = editorial;
  const merged = mergeBlogPosts([
    { ...row, id: "database-id", title: "Edited title", view_count: 42 },
  ]).find((post) => post.slug === slug);
  assert.equal(merged.view_count, 42);
  assert.equal(merged.title, "Edited title");
  assert.deepEqual(merged.sources, sources);
  assert.deepEqual(merged.faqs, faqs);
});
