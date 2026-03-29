import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublicPath =
        path.startsWith("/signin") ||
        path.startsWith("/signup") ||
        path.startsWith("/auth-test") ||
        path.startsWith("/_next") ||
        path.startsWith("/api") ||
        path.startsWith("/v1") ||
        path.startsWith("/v2") ||
        path.startsWith("/v3") ||
        path === "/favicon.ico";

    const token = request.cookies.get("user_session")?.value;

    if (!isPublicPath && !token) {
        const url = request.nextUrl.clone();
        url.pathname = "/signin";
        url.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(url);
    }

    if (token && (path.startsWith("/signin") || path.startsWith("/signup"))) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
