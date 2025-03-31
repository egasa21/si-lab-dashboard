import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    let userResponse = await fetch("http://localhost:8080/v1/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok && refreshToken) {
        console.log("Access token expired, attempting refresh...");
        const refreshResponse = await fetch("http://localhost:8080/v1/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
            const newToken = await refreshResponse.json();
            req.cookies.set("access_token", newToken.data.access_token);
            return NextResponse.next();
        }

        console.log("Refresh token expired, redirecting to login.");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!userResponse.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const userData = await userResponse.json();
    const isAdmin = userData.data.roles.some((role: any) => role.name === "admin");
    if (!isAdmin) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

// Apply middleware to dashboard routes
export const config = {
    matcher: ["/dashboard/:path*"],
};
