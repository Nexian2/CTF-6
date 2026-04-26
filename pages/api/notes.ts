import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "../../lib/session";
import { sql } from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.userId) return res.status(401).json({ error: "Unauthorized" });

  const result = await sql`
    SELECT id, title, content, created_at FROM notes WHERE user_id = ${session.userId}
  `;
  res.json({ notes: result.rows, username: session.username });
}
