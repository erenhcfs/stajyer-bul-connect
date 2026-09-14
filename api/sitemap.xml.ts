import { sitemapResponse } from "../src/lib/sitemap.server.ts";

export default {
  async fetch() {
    return sitemapResponse();
  },
};
