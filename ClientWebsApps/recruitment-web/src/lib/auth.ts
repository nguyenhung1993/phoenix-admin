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
    if (!email) return "VIEWER";

    // First check if user is an admin
    if (isAdmin(email)) {
        return "SUPER_ADMIN";
    }

    try {
        // Check if the user has an explicit role in User table
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { role: true },
        });

        if (user?.role && user.role !== "EMPLOYEE") {
            return user.role as Role;
        }

        // Verify if they are an actual employee
        const employee = await prisma.employee.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true },
        });

        if (employee) {
            return "EMPLOYEE";
        }
    } catch {
        // DB not available, fall back
    }

    // Default for external users like Google login without an employee record
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
            }
            return session;
        },
        async jwt({ token, user, trigger }) {
            // "user" is only passed on the initial sign-in
            if (user) {
                token.id = user.id;

                // Recalculate true role instead of trusting the DB default "EMPLOYEE" 
                // when user is first created by OAuth
                if (user.email) {
                    const realRole = await getUserRole(user.email);
                    token.role = realRole;

                    const userRole = 'role' in user ? user.role : undefined;

                    // Sync the real role back to the DB to override the default "EMPLOYEE"
                    if (user.id && userRole !== realRole) {
                        try {
                            await prisma.user.update({
                                where: { id: user.id },
                                data: { role: realRole }
                            });
                        } catch (error) {
                            console.error("Failed to sync role to db:", error);
                        }
                    }
                }
            }

            // Fallback if role is somewhy missing
            if (!token.role && token.email) {
                token.role = await getUserRole(token.email);
            }

            return token;
        },
    }
});
