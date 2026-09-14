import { sitemapResponse } from "../server-runtime/sitemap.server.js";

export default {
  async fetch() {
    return sitemapResponse();
  },
};
