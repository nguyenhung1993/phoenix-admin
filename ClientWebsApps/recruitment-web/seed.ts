import { prisma } from './src/lib/prisma';

const companies = [
    { code: 'HL', name: 'Hải Long' },
    { code: 'PH', name: 'Phượng Hoàng' },
    { code: 'TS', name: 'Thiên Sơn' },
    { code: 'ST', name: 'Sơn Thành' },
];

const departmentNames = [
    'Kỹ thuật', 'Công nghệ thông tin', 'Development', 'QA - QC - Đào tạo',
    'Hành chính nhân sự', 'HR', 'Phát triển nhân lực',
    'Marketing',
    'Kho',
    'Kinh doanh 1H - Dụng cụ', 'Kinh doanh 2H - Lining', 'Kinh doanh 1P - Adidas',
    'Kinh doanh 2P - Ping Golf', 'Kinh doanh 3P - Asics / Lecoq / Puma',
    'Kinh doanh 1T - Max Miền Bắc', 'Kinh doanh 2T - Max Miền Nam', 'Kinh doanh 4T - Online', 'Kinh doanh 15 - 361'
];

async function main() {
    console.log('Bắt đầu khởi tạo dữ liệu...');
    for (const comp of companies) {
        let createdComp = await prisma.company.findUnique({ where: { code: comp.code } });
        if (!createdComp) {
            createdComp = await prisma.company.create({ data: comp });
            console.log(`Đã tạo Pháp nhân: ${comp.name}`);
        } else {
            console.log(`Pháp nhân đã tồn tại: ${comp.name}`);
        }

        for (let i = 0; i < departmentNames.length; i++) {
            const name = departmentNames[i];
            const code = `${comp.code}_DEP_${i}`;
            const existingDep = await prisma.department.findFirst({ where: { name, companyId: createdComp.id } });

            if (!existingDep) {
                // Ensure code is unique in case of duplicates or reruns
                const codeUnique = `${comp.code}_DEP_${i}_${Date.now().toString().slice(-4)}`;
                try {
                    await prisma.department.create({
                        data: {
                            name,
                            code: codeUnique,
                            companyId: createdComp.id
                        }
                    });
                } catch (err: any) {
                    console.log(`Lỗi khi tạo phòng ban ${name}:`, err.message);
                }
            }
        }
        console.log(`Đã đồng bộ phòng ban cho ${comp.name}`);
    }
    console.log("Hoàn tất!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
