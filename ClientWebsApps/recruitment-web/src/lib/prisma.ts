import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Ensure env vars are loaded (Next.js loads them, but this is a safety fallback for early imports)
if (!process.env.DATABASE_URL) {
    dotenv.config({ path: '.env.local' });
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.warn('⚠️ DATABASE_URL not set. Using placeholder Prisma client.');
        return new Proxy({} as PrismaClient, {
            get(_target, prop) {
                if (prop === '$connect' || prop === '$disconnect') {
                    return () => Promise.resolve();
                }
                throw new Error('Database not available. Please set DATABASE_URL in .env.local');
            },
        });
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
