import { DefaultSession } from "next-auth";
import { Role } from "@/lib/rbac";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: Role;
        } & DefaultSession["user"];
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id?: string;
        role?: Role;
    }
}
