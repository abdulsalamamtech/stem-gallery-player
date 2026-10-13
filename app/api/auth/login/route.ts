import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const logPath = path.join(process.cwd(), "log.json");
    const contents = await fs.readFile(logPath, "utf8");
    const data = JSON.parse(contents) as { users?: Array<{ username: string; password: string }> };
    const valid = data.users?.some(
      (user) => user.username === body.username?.trim() && user.password === body.password,
    );

    return NextResponse.json({ authenticated: Boolean(valid) }, { status: valid ? 200 : 401 });
  } catch {
    return NextResponse.json({ authenticated: false, error: "Login unavailable" }, { status: 500 });
  }
}

export const runtime = "nodejs";
