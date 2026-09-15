import test from "node:test";
import assert from "node:assert/strict";
import { STATIC_BLOG_POSTS } from "../src/lib/blog-posts.ts";

test("editorial blog ships ten unique, indexable articles", () => {
  assert.equal(STATIC_BLOG_POSTS.length, 10);
  assert.equal(new Set(STATIC_BLOG_POSTS.map((post) => post.slug)).size, 10);
  for (const post of STATIC_BLOG_POSTS) {
    assert.equal(post.published, true);
    assert.ok(post.title.length > 20);
    assert.ok(post.seo_description && post.seo_description.length <= 180);
    assert.ok(post.content.length > 700);
  }
});

test("future MESEM article labels projections and cites official sources", () => {
  const article = STATIC_BLOG_POSTS.find(
    (post) => post.slug === "2027-mesem-maaslari-ne-kadar-olacak",
  );
  assert.ok(article);
  assert.match(article.content, /henüz resmî olarak açıklanmadı/i);
  assert.match(article.content, /yalnızca hesap örneğidir/i);
  assert.ok(article.sources?.some((source) => source.url.includes("csgb.gov.tr")));
  assert.ok(article.sources?.some((source) => source.url.includes("meb.gov.tr")));
});
