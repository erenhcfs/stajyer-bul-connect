import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createSessionCookie } from "./_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body ?? {};
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: "Sunucu yapılandırması eksik." });
  }

  if (typeof password !== "string" || password !== adminPassword) {
    return res.status(401).json({ error: "Şifre yanlış." });
  }

  res.setHeader("Set-Cookie", createSessionCookie());
  return res.status(200).json({ ok: true });
}
