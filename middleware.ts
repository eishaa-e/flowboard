import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

    const { pathname } = req.nextUrl;

    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
    const isProtectedRoute = pathname.startsWith("/workspace") || pathname.startsWith("/board");

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        try {
            await jwtVerify(token, secret);
        } catch (err) {
            // Token invalid
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    if (isAuthRoute && token) {
        try {
            await jwtVerify(token, secret);
            return NextResponse.redirect(new URL("/workspace", req.url));
        } catch (err) {
            // Token invalid, stay on login
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/workspace/:path*", "/board/:path*", "/login", "/signup"],
};
