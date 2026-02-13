import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import prisma from "./prisma";
import { Role } from "./rbac";
import { authConfig } from "./auth.config";

// Admin emails from env
const getAdminEmails = (): string[] => {
    const emails = process.env.ADMIN_EMAILS || "";
    return emails.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
};

export const isAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const adminEmails = getAdminEmails();
    return adminEmails.includes(email.toLowerCase());
};

// Get user role from database or fallback
export const getUserRole = async (email: string | null | undefined): Promise<Role> => {
    if (!email) return "EMPLOYEE";

    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { role: true },
        });

        if (user?.role) {
            return user.role as Role;
        }
    } catch {
        // DB not available, fall back
    }

    // Fall back to admin emails env
    if (isAdmin(email)) {
        return "SUPER_ADMIN";
    }

    return "VIEWER";
};

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const email = credentials?.email as string;
                const password = credentials?.password as string;

                if (!email || !password) return null;

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: email.toLowerCase() },
                    });

                    if (!user || !user.password) return null;

                    const isValid = await compare(password, user.password);
                    if (!isValid) return null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role, // Pass role to token
                    };
                } catch {
                    // DB not available, fall back to mock for development
                    const mockUsers = [
                        { id: "usr_admin", name: "Admin User", email: "admin@phoenix.com", password: "123", image: "https://avatar.vercel.sh/admin", role: "SUPER_ADMIN" },
                        { id: "usr_manager", name: "HR Manager", email: "manager@phoenix.com", password: "123", image: "https://avatar.vercel.sh/manager", role: "HR_MANAGER" },
                        { id: "usr_employee", name: "Nguyễn Văn Minh", email: "employee@phoenix.com", password: "123", image: "https://avatar.vercel.sh/employee", role: "EMPLOYEE" },
                    ];

                    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
                    if (mockUser) {
                        return { id: mockUser.id, name: mockUser.name, email: mockUser.email, image: mockUser.image, role: mockUser.role as Role };
                    }
                    return null;
                }
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            if (token.role) {
                session.user.role = token.role as Role;
            } else if (session.user.email) {
                // Determine role if not in token (e.g. OAuth first login)
                const role = await getUserRole(session.user.email);
                session.user.role = role;
                // We should also update the token with the role so subsequent requests have it? 
                // Creating a session doesn't update the token. 
                // The jwt callback runs before session.
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                if ('role' in user) {
                    token.role = user.role as Role;
                }
            }
            // If role is missing (e.g. OAuth login), try to fetch it
            if (!token.role && token.email) {
                const role = await getUserRole(token.email);
                token.role = role;
            }
            return token;
        },
    }
});
