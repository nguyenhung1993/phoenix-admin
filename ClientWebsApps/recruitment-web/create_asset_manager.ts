import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Use the project's configured Prisma client which includes the pg adapter
import { prisma } from './src/lib/prisma';

async function main() {
    console.log('Bắt đầu tạo tài khoản test Asset Manager...');

    const email = 'assetmanager@phoenix.com';
    const password = await bcrypt.hash('123456', 10);

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'TEST QUẢN LÝ TÀI SẢN',
                email: email,
                password: password,
                // @ts-ignore (because type definition might take a bit to catch up)
                role: 'ASSET_MANAGER',
                status: 'ACTIVE',
            }
        });
        console.log(`Đã tạo tài khoản thành công: ${email} | Pass: 123456`);
    } else {
        // Update to ensure the exact role and password
        user = await prisma.user.update({
            where: { email },
            data: {
                password: password,
                // @ts-ignore
                role: 'ASSET_MANAGER',
                name: 'TEST QUẢN LÝ TÀI SẢN'
            }
        });
        console.log(`Đã cập nhật lại tài khoản: ${email} | Pass: 123456`);
    }

    console.log('Quá trình hoàn tất!');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
