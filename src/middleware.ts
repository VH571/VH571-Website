import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
const PUBLIC_POST_ALLOWLIST = new Set<string>(["/api/public/resume-pdf"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (pathname.startsWith("/api/public/auth/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const isAdmin = token?.role === "admin";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  if (pathname.startsWith("/api/public")) {
    if (method === "OPTIONS") return NextResponse.next();

    const isAllowlistedPost =
      method === "POST" && PUBLIC_POST_ALLOWLIST.has(pathname);

    const isSafe = method === "GET" || method === "HEAD";

    if (!(isAllowlistedPost || isSafe)) {
      return new NextResponse("Method Not Allowed", { status: 405 });
    }
  }

  if (pathname.startsWith("/api/admin")) {
    if (method === "OPTIONS") return NextResponse.next();
    const isAdmin = token?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/api/public/:path*",
    "/api/admin/:path*",
  ],
};
