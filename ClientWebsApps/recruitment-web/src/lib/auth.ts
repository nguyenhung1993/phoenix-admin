import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { Role } from "./rbac";

// User role mapping by email
const userRoles: Record<string, Role> = {
    // MOCK ACCOUNTS
    "admin@phoenix.com": "SUPER_ADMIN",
    "manager@phoenix.com": "HR_MANAGER",
    "employee@phoenix.com": "EMPLOYEE",
};

// Mock Users Database
const mockUsers = [
    {
        id: "usr_admin",
        name: "Admin User",
        email: "admin@phoenix.com",
        password: "123", // Simple mock password
        image: "https://avatar.vercel.sh/admin",
    },
    {
        id: "usr_manager",
        name: "HR Manager",
        email: "manager@phoenix.com",
        password: "123",
        image: "https://avatar.vercel.sh/manager",
    },
    {
        id: "usr_employee",
        name: "Nguyễn Văn Minh", // Matching ID 1 in mocks/cb.ts
        email: "employee@phoenix.com",
        baseSalary: 30000000, // Linked to payroll mock
        password: "123",
        image: "https://avatar.vercel.sh/employee",
    },
];

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

// Get user role
export const getUserRole = (email: string | null | undefined): Role => {
    if (!email) return "EMPLOYEE";
    const normalizedEmail = email.toLowerCase();

    // Check specific role mapping first
    if (userRoles[normalizedEmail]) {
        return userRoles[normalizedEmail];
    }

    // Fall back to admin emails env
    if (isAdmin(email)) {
        return "SUPER_ADMIN";
    }

    return "VIEWER";
};

export const { handlers, signIn, signOut, auth } = NextAuth({
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

                // Find mock user
                const user = mockUsers.find(u => u.email === email && u.password === password);

                if (user) {
                    return {
                        id: user.id === "usr_employee" ? "1" : user.id, // Map employee to "1" for payroll mock connection
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    };
                }

                return null;
            }
        })
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
