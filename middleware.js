import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/for-sale",
    "/rent",
    "/agent-finder",
    "/api/webhook",
    "/sign-in",
    "/sign-up"
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};