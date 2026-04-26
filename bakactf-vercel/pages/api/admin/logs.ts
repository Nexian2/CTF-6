import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "../../lib/session";
import { db } from "@vercel/postgres";

const ALLOWED_ORDERS = ["logged_at", "username", "ip_address", "action"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.adminLoggedIn) return res.status(401).json({ error: "Unauthorized" });

  const search = (req.query.search as string) || "";
  const order  = (req.query.order  as string) || "logged_at";

  // Fake whitelist — developer lupa string asli tetap dipakai
  const orderClause = ALLOWED_ORDERS.includes(order.toLowerCase()) ? order : order;

  // INTENTIONALLY VULNERABLE: orderClause langsung diinterpolasi
  const query = `
    SELECT id, ip_address, username, action, logged_at
    FROM access_log
    WHERE username ILIKE '%${search}%'
    ORDER BY ${orderClause} DESC
    LIMIT 50
  `;

  try {
    const client = await db.connect();
    const result = await client.query(query);
    client.release();
    res.json({ rows: result.rows, query });
  } catch (e: any) {
    res.status(500).json({ error: e.message, query });
  }
}
