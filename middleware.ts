// middleware.ts
import {NextResponse} from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const {auth} = NextAuth(authConfig);

export default auth((req) => {
    const {nextUrl} = req;
    const pathname = nextUrl.pathname;
    // --- 1. Skip internal Next.js routes and public assets ---
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/public") ||
        pathname.match(/\.(png|jpg|jpeg|svg|gif|ico|css|js)$/)
    ) {
        return;
    }
    // --- 2. Allow NextAuth API routes ---
    if (pathname.startsWith("/api/auth")) {
        return;
    }
    // --- 3. Protect all API routes ---
    if (pathname.startsWith("/api/") && !req.auth) {
        const isBrowser = req.headers.get("accept")?.includes("text/html");
        if (isBrowser) {
            const signInUrl = new URL("/sign-in", nextUrl);
            signInUrl.searchParams.set("callbackUrl", nextUrl.href);
            return NextResponse.redirect(signInUrl);
        }
        // Programmatic request → return 401 JSON
        return new NextResponse(JSON.stringify({error: "Unauthorized"}), {
            status: 401,
            headers: {"Content-Type": "application/json"},
        });
    }
    return;
});
// --- 4. Matcher only runs middleware where needed ---
export const config = {
    matcher: [
        "/api/:path*",
        "/((?!_next|favicon.ico|.*\\..*).*)",
    ],
};

