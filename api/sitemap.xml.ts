import { sitemapResponse } from "../src/lib/sitemap.server";

export default {
  async fetch() {
    return sitemapResponse();
  },
};
