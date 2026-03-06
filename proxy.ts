import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect kampala, kamuli, and super routes
  if (
    path.startsWith("/kampala") ||
    path.startsWith("/kamuli") ||
    path.startsWith("/super")
  ) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        role: string;
      };

      // Role-based access control
      if (
        (path.startsWith("/kampala") &&
          (decoded.role === "kampala" || decoded.role === "kampalauser")) ||
        (path.startsWith("/kamuli") &&
          (decoded.role === "kamuli" || decoded.role === "kamuliuser")) ||
        (path.startsWith("/super") && decoded.role === "superadmin")
      ) {
        return NextResponse.next();
      }

      // ❌ Role mismatch — redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/kampala/:path*", "/kamuli/:path*", "/super/:path*"],
};
