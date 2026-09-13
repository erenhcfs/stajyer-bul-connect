import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated } from "./_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const ok = isAuthenticated(req.headers.cookie);
  return res.status(200).json({ authenticated: ok });
}
