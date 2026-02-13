import type { NextAuthConfig } from "next-auth";
import { Role } from "./rbac";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login page on error
    },
    providers: [], // Providers added in auth.ts (Node)
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnPortal = nextUrl.pathname.startsWith("/portal");



            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isOnPortal) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users
            }

            return true;
        },
        // Simple callbacks that don't depend on DB - extended in auth.ts
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // user.role might be passed from authorize in auth.ts
                if ('role' in user) {
                    token.role = user.role as Role;
                }
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token.role) {
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
