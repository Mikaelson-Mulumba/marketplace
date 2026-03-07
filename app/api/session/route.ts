import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      username: string;
      role: string;
    };

    return NextResponse.json({
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
