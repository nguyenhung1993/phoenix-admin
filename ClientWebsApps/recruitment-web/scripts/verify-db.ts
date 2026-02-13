import dotenv from 'dotenv';
// Load .env.local
dotenv.config({ path: '.env.local' });

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
console.log('Connecting to:', connectionString?.replace(/:[^:@]*@/, ':****@')); // Hide password

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);
        const admin = await prisma.user.findUnique({ where: { email: 'admin@phoenix.com' } });
        console.log('Admin user found:', admin ? 'YES' : 'NO');
        if (admin) {
            console.log('Admin Role:', admin.role);
            console.log('Admin Password Hash:', admin.password.substring(0, 10) + '...');
        }
    } catch (e) {
        console.error('DB Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
