import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const user = cookieStore.get("session_user");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const file = req.nextUrl.searchParams.get("file") ?? "logs/access.log";

  // !! VULNERABLE: no path traversal sanitization !!
  // Developer intended to restrict reads to public/logs/ but forgot to
  // strip or validate "../" sequences in the file parameter.
  const fullPath = join(process.cwd(), "public", file);

  try {
    const content = readFileSync(fullPath, "utf-8");
    return NextResponse.json({ content, path: fullPath });
  } catch {
    return NextResponse.json(
      { error: `Cannot read file: public/${file}` },
      { status: 404 }
    );
  }
}
