import test from "node:test";
import assert from "node:assert/strict";
import { EXTERNAL_JOB_LISTINGS } from "../src/lib/external-listings.ts";

const allowedHosts = new Set([
  "kariyer.tusas.com",
  "www.aselsan.com",
  "careers.turkishairlines.com",
  "kariyer.roketsan.com.tr",
  "ulusalstajprogrami.iskur.gov.tr",
]);

test("curated opportunities are unique and use first-party career sources", () => {
  assert.ok(EXTERNAL_JOB_LISTINGS.length >= 5);
  assert.equal(
    new Set(EXTERNAL_JOB_LISTINGS.map((listing) => listing.slug)).size,
    EXTERNAL_JOB_LISTINGS.length,
  );
  for (const listing of EXTERNAL_JOB_LISTINGS) {
    const source = new URL(listing.source_url);
    assert.equal(source.protocol, "https:");
    assert.ok(allowedHosts.has(source.hostname), source.hostname);
    assert.equal(listing.external, true);
    assert.equal(listing.status, "active");
    assert.match(listing.verified_at, /^\d{4}-\d{2}-\d{2}$/);
    assert.doesNotMatch(listing.source_url, /linkedin\.com/i);
  }
});
