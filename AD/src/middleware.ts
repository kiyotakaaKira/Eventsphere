import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/dashboard/my-tickets(.*)",
  "/dashboard/profile(.*)",
  "/dashboard/settings(.*)",
  "/dashboard/wishlist(.*)",
  "/dashboard/tickets(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
