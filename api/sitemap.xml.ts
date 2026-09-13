import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sitemapResponse } from "../src/lib/sitemap.server";
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const response = await sitemapResponse();
  response.headers.forEach((value, name) => res.setHeader(name, value));
  return res.status(response.status).send(await response.text());
}
