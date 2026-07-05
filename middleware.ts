import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ROLES } from "@/lib/roles";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/dashboard(.*)",
  "/deposits(.*)",
  "/withdrawals(.*)",
  "/transfers(.*)",
  "/trading(.*)",
  "/my-plans(.*)",
  "/settings(.*)",
  "/daily-tasks(.*)",
  "/earnings(.*)",
  "/referrals(.*)",
  "/notifications(.*)",
  "/support-center(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return;

  await auth.protect();

  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();
    const metadata = (sessionClaims?.publicMetadata ?? sessionClaims?.metadata ?? {}) as {
      role?: string;
    };
    if (metadata.role !== ROLES.OWNER) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
