import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleAdminRequest } from "./admin.server";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
  }
  const protocol = req.headers["x-forwarded-proto"] === "http" ? "http" : "https";
  const request = new Request(`${protocol}://${req.headers.host}${req.url}`, {
    method: req.method || "GET",
    headers,
    ...(req.method === "GET" || req.method === "HEAD"
      ? {}
      : { body: typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {}) }),
  });
  const response = await handleAdminRequest(request);
  if (!response) return res.status(404).end();
  response.headers.forEach((value, name) => res.setHeader(name, value));
  return res.status(response.status).send(await response.text());
}
