import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// ── "Database" ──────────────────────────────────────────────────────────────
const USERS = [
  { id: 1, username: "admin",  password: "Adm!n_S3cr3t_2024" },
  { id: 2, username: "guest",  password: "guest" },
  { id: 3, username: "alice",  password: "alice123" },
];

/**
 * VULNERABLE: Simulates raw SQL string interpolation.
 *
 * Equivalent PHP query:
 *   SELECT * FROM users WHERE username='$username' AND password='$password'
 *
 * Classic bypass:
 *   username = ' OR '1'='1' --
 *   password = anything
 */
function runQuery(username: string, password: string) {
  // Build the WHERE clause exactly like vulnerable PHP would
  const whereClause = `username='${username}' AND password='${password}'`;

  for (const user of USERS) {
    if (evalWhere(whereClause, user)) return user;
  }
  return null;
}

function evalWhere(clause: string, row: { username: string; password: string }): boolean {
  // 1. Strip SQL line comments
  let expr = clause.replace(/--.*$/, "").replace(/#.*$/, "").trim();

  // 2. Substitute column values
  expr = expr
    .replace(/\busername\b/g, `'${row.username}'`)
    .replace(/\bpassword\b/g, `'${row.password}'`);

  // 3. Evaluate OR branches first (lowest precedence)
  const orParts = splitTopLevel(expr, " OR ");
  return orParts.some((part) => evalAndExpr(part.trim()));
}

function evalAndExpr(expr: string): boolean {
  const andParts = splitTopLevel(expr, " AND ");
  return andParts.every((part) => evalAtom(part.trim()));
}

function evalAtom(expr: string): boolean {
  // Match: 'a'='b'  or  'a'!='b'
  const eq = expr.match(/^'([^']*)'\s*=\s*'([^']*)'$/);
  if (eq) return eq[1] === eq[2];
  const neq = expr.match(/^'([^']*)'\s*!=\s*'([^']*)'$/);
  if (neq) return neq[1] !== neq[2];
  // Literal true/false
  if (expr === "1=1" || expr === "'1'='1'") return true;
  if (expr === "1=0" || expr === "'1'='0'") return false;
  return false;
}

/** Split string by delimiter only at top level (not inside quotes) */
function splitTopLevel(expr: string, delim: string): string[] {
  const parts: string[] = [];
  let depth = 0, inQuote = false, buf = "";
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "'" && expr[i - 1] !== "\\") inQuote = !inQuote;
    if (!inQuote) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (depth === 0 && expr.slice(i).toUpperCase().startsWith(delim.toUpperCase())) {
        parts.push(buf);
        buf = "";
        i += delim.length - 1;
        continue;
      }
    }
    buf += ch;
  }
  parts.push(buf);
  return parts;
}

// ── Route Handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { username = "", password = "" } = await req.json().catch(() => ({}));

  const user = runQuery(username, password);

  if (user) {
    // Simple session cookie (not signed — another vuln but not the focus)
    const cookieStore = await cookies();
    cookieStore.set("session_user", user.username, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, message: "Username atau password salah." }, { status: 401 });
}
