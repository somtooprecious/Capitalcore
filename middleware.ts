import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return;

  // Require sign-in for protected routes. Role checks (e.g. admin vs user)
  // are handled in the page/API layer where we can read the database reliably.
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
