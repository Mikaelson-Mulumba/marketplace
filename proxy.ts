import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  // Protect kampala, kamuli, and super routes
  if (
    path.startsWith("/kampala") ||
    path.startsWith("/kamuli") ||
    path.startsWith("/super")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        role: string;
      };

      // ✅ Kampala routes
      if (path.startsWith("/kampala")) {
        if (decoded.role === "kampala") {
          return NextResponse.next(); // full access
        }
        if (decoded.role === "kampalauser") {
          if (
            path.startsWith("/kampala/users") ||
            path.startsWith("/kampala/reports") ||
            path.startsWith("/kampala/categories") ||
            path.startsWith("/kampala/stock/add") ||
            path.startsWith("/kampala/stock/edit") ||
            path.startsWith("/kampala/products/edit") ||
            path.startsWith("/kampala/products/add")
          ) {
            return NextResponse.redirect(new URL("/kampala", req.url));
          }
          return NextResponse.next(); // view-only allowed
        }
      }

      // ✅ Kamuli routes
      if (path.startsWith("/kamuli")) {
        if (decoded.role === "kamuli") {
          return NextResponse.next(); // full access
        }
        if (decoded.role === "kamuliuser") {
          if (
            path.startsWith("/kamuli/users") ||
            path.startsWith("/kamuli/reports") ||
            path.startsWith("/kamuli/categories") ||
            path.startsWith("/kamuli/stock/add") ||
            path.startsWith("/kamuli/products/add")
          ) {
            return NextResponse.redirect(new URL("/kamuli", req.url));
          }
          return NextResponse.next(); // view-only allowed
        }
      }

      // ✅ Super routes
      if (path.startsWith("/super")) {
        if (decoded.role === "superadmin") {
          return NextResponse.next(); // unrestricted
        }
      }

      // ❌ Role mismatch
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
