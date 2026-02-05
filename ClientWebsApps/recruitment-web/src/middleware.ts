import { auth } from "@/lib/auth";
import { hasPermission, Role } from "@/lib/rbac";
import { NextResponse } from "next/server";

// Roles that can access admin area (have at least dashboard:view permission)
const adminAccessRoles: Role[] = [
    'SUPER_ADMIN',
    'HR_MANAGER',
    'HR_STAFF',
    'RECRUITER',
    'DEPARTMENT_HEAD',
    'VIEWER',
];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role as Role | undefined;

    // Protect /admin routes
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            // Redirect to login if not logged in
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Check if user has permission to access admin area
        if (!userRole || !hasPermission(userRole, 'dashboard:view')) {
            // Redirect to unauthorized page if no dashboard access
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*"],
};
