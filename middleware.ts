import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROLES } from "@/lib/roles";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (pathname.startsWith("/admin") && token.role !== ROLES.OWNER) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/deposits/:path*",
    "/withdrawals/:path*",
    "/transfers/:path*",
    "/trading/:path*",
    "/my-plans/:path*",
    "/settings/:path*",
    "/daily-tasks/:path*",
    "/earnings/:path*",
    "/referrals/:path*",
    "/notifications/:path*",
    "/support-center/:path*",
  ],
};
