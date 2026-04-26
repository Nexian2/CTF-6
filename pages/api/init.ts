import type { NextApiRequest, NextApiResponse } from "next";
import { initDb } from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = req.query.secret;
  if (secret !== process.env.INIT_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    await initDb();
    res.json({ ok: true, message: "DB initialized!" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
