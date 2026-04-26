import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "../../lib/session";
import { sql } from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.userId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const result = await sql`SELECT id, name, message, created_at FROM feedbacks ORDER BY id DESC LIMIT 30`;
    return res.json({ feedbacks: result.rows });
  }

  if (req.method === "POST") {
    const { name, message } = req.body;
    // INTENTIONALLY not sanitizing — stored XSS vulnerability
    await sql`INSERT INTO feedbacks (name, message) VALUES (${name}, ${message})`;
    return res.json({ ok: true });
  }

  res.status(405).end();
}
