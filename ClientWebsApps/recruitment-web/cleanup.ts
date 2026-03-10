import { prisma } from './src/lib/prisma';

async function main() {
    console.log('Bắt đầu dọn dẹp dữ liệu Asset bị lệch đồng bộ...');
    // Tìm các Asset đang có trạng thái IN_USE hoặc có người giữ
    // Dữ liệu này bị cũ do user sửa tay qua UI thay vì qua Cấp phát
    const assets = await prisma.asset.findMany({
        where: {
            OR: [
                { status: 'IN_USE' },
                { holderId: { not: null } }
            ]
        },
        include: {
            allocations: {
                where: { status: 'ALLOCATED' }
            }
        }
    });

    let fixedCount = 0;
    for (const asset of assets) {
        // Nếu Asset đang được gắn cho ai đó nhưng không hề có Allocation Record nào đang active
        if (asset.allocations.length === 0) {
            console.log(`Tiến hành sửa lỗi Asset: ${asset.code} - ${asset.name} (Đang lưu holder: ${asset.holderName || 'null'})`);
            await prisma.asset.update({
                where: { id: asset.id },
                data: {
                    status: 'AVAILABLE',
                    holderId: null,
                    holderName: null,
                    assignedDate: null
                }
            });
            fixedCount++;
        }
    }
    console.log(`Hoàn tất. Đã sửa ${fixedCount} tài sản bị lệch.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
