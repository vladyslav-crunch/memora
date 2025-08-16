// middleware.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const {auth} = NextAuth(authConfig);

export default auth((req) => {
    const {pathname} = req.nextUrl;

    // Allow the Auth.js endpoints through
    if (pathname.startsWith("/api/auth")) return;

    // Block every other API route if not signed in
    if (pathname.startsWith("/api/") && !req.auth) {
        // If it's a browser hitting an API, you may prefer a redirect to sign-in:
        const acceptsHtml = req.headers.get("accept")?.includes("text/html");
        if (acceptsHtml) {
            const url = new URL("/sign-in", req.nextUrl);
            url.searchParams.set("callbackUrl", req.nextUrl.href);
            return Response.redirect(url);
        }
        // Otherwise respond with 401 for programmatic calls
        return new Response("Unauthorized", {status: 401});
    }

    // (Optional) also protect tRPC or other RPC paths:
    // if (pathname.startsWith("/trpc/") && !req.auth) return new Response("Unauthorized", { status: 401 });
});

export const config = {
    // Only run on APIs (and optionally tRPC) for performance
    matcher: [
        "/api/:path*",
        // "/trpc/:path*", // uncomment if you use tRPC
    ],
};
