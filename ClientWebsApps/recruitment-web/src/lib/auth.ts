import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { Role } from "./rbac";

// User role mapping by email - can extend from database later
const userRoles: Record<string, Role> = {
    // Add specific user emails and their roles here
    // Example: "admin@company.com": "SUPER_ADMIN",
};

// Admin emails - can add multiple separated by comma
const getAdminEmails = (): string[] => {
    const emails = process.env.ADMIN_EMAILS || "";
    return emails.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
};

export const isAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const adminEmails = getAdminEmails();
    return adminEmails.includes(email.toLowerCase());
};

// Get user role - checks userRoles map first, then falls back to admin check
export const getUserRole = (email: string | null | undefined): Role => {
    if (!email) return "EMPLOYEE";
    const normalizedEmail = email.toLowerCase();

    // Check specific role mapping first
    if (userRoles[normalizedEmail]) {
        return userRoles[normalizedEmail];
    }

    // Fall back to admin check
    if (isAdmin(email)) {
        return "SUPER_ADMIN";
    }

    return "EMPLOYEE";
};

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            // Add role to session using RBAC
            const role = getUserRole(session.user?.email);
            session.user.role = role;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
});
