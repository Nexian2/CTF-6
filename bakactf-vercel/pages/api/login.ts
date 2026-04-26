import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "../../lib/session";
import { sql } from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;
  try {
    const result = await sql`
      SELECT id, username, role FROM users
      WHERE username = ${username} AND password = md5(${password})
    `;
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Username atau password salah." });
    }
    const user = result.rows[0];
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    session.userId = user.id;
    session.username = user.username;
    session.role = user.role;
    await session.save();
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
