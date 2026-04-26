import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "../../lib/session";
import { sql } from "../../lib/db";

const VALID_KEY = "XSS_K3Y_8f3a9c";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { access_key, username, password } = req.body;

  if (access_key !== VALID_KEY) {
    return res.status(401).json({ error: "Access key tidak valid." });
  }

  const result = await sql`
    SELECT id, username FROM users
    WHERE username = ${username} AND password = md5(${password}) AND role = 'admin'
  `;

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Username atau password admin salah." });
  }

  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.adminLoggedIn = true;
  session.adminUser = result.rows[0].username;
  await session.save();
  res.json({ ok: true });
}
