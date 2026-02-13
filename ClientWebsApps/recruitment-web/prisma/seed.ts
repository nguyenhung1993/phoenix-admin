import dotenv from 'dotenv';
// Load .env.local first, then .env as fallback
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

// Use DIRECT_URL for seeding (pgbouncer doesn't support all Prisma operations)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // ==================== USERS ====================
    const adminPassword = await hash('123', 10);
    const managerPassword = await hash('123', 10);
    const employeePassword = await hash('123', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@phoenix.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@phoenix.com',
            password: adminPassword,
            role: 'SUPER_ADMIN',
            status: 'ACTIVE',
            image: 'https://avatar.vercel.sh/admin',
        },
    });

    const managerUser = await prisma.user.upsert({
        where: { email: 'manager@phoenix.com' },
        update: {},
        create: {
            name: 'HR Manager',
            email: 'manager@phoenix.com',
            password: managerPassword,
            role: 'HR_MANAGER',
            status: 'ACTIVE',
            image: 'https://avatar.vercel.sh/manager',
        },
    });

    const employeeUser = await prisma.user.upsert({
        where: { email: 'employee@phoenix.com' },
        update: {},
        create: {
            name: 'Nguyễn Văn Minh',
            email: 'employee@phoenix.com',
            password: employeePassword,
            role: 'EMPLOYEE',
            status: 'ACTIVE',
            image: 'https://avatar.vercel.sh/employee',
        },
    });

    console.log('✅ Users created:', adminUser.email, managerUser.email, employeeUser.email);

    // ==================== CONTRACT TYPES ====================
    const contractTypes = await Promise.all([
        prisma.contractType.upsert({
            where: { code: 'PROBATION' },
            update: {},
            create: { code: 'PROBATION', name: 'Thử việc', durationMonths: 2, isSystem: true },
        }),
        prisma.contractType.upsert({
            where: { code: 'DEFINITE_1Y' },
            update: {},
            create: { code: 'DEFINITE_1Y', name: 'HĐLĐ xác định thời hạn 1 năm', durationMonths: 12 },
        }),
        prisma.contractType.upsert({
            where: { code: 'DEFINITE_3Y' },
            update: {},
            create: { code: 'DEFINITE_3Y', name: 'HĐLĐ xác định thời hạn 3 năm', durationMonths: 36 },
        }),
        prisma.contractType.upsert({
            where: { code: 'INDEFINITE' },
            update: {},
            create: { code: 'INDEFINITE', name: 'HĐLĐ không xác định thời hạn', durationMonths: 0, isSystem: true },
        }),
    ]);
    console.log('✅ Contract types created:', contractTypes.length);

    // ==================== SHIFT TYPES ====================
    const shiftTypes = await Promise.all([
        prisma.shiftType.upsert({
            where: { code: 'SHIFT_DAY' },
            update: {},
            create: { code: 'SHIFT_DAY', name: 'Ca Hành Chính', startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00', workDays: ['T2', 'T3', 'T4', 'T5', 'T6'], isDefault: true },
        }),
        prisma.shiftType.upsert({
            where: { code: 'SHIFT_FLEX' },
            update: {},
            create: { code: 'SHIFT_FLEX', name: 'Ca Linh Hoạt', startTime: '07:00', endTime: '16:00', workDays: ['T2', 'T3', 'T4', 'T5', 'T6'] },
        }),
        prisma.shiftType.upsert({
            where: { code: 'SHIFT_NIGHT' },
            update: {},
            create: { code: 'SHIFT_NIGHT', name: 'Ca Đêm', startTime: '22:00', endTime: '06:00', workDays: ['T2', 'T3', 'T4', 'T5', 'T6'] },
        }),
    ]);
    console.log('✅ Shift types created:', shiftTypes.length);

    // ==================== DEPARTMENTS ====================
    const departments = await Promise.all([
        prisma.department.upsert({
            where: { code: 'ENGINEERING' },
            update: {},
            create: { code: 'ENGINEERING', name: 'Phòng Kỹ Thuật' },
        }),
        prisma.department.upsert({
            where: { code: 'HR' },
            update: {},
            create: { code: 'HR', name: 'Phòng Nhân Sự' },
        }),
        prisma.department.upsert({
            where: { code: 'MARKETING' },
            update: {},
            create: { code: 'MARKETING', name: 'Phòng Marketing' },
        }),
        prisma.department.upsert({
            where: { code: 'FINANCE' },
            update: {},
            create: { code: 'FINANCE', name: 'Phòng Tài Chính' },
        }),
        prisma.department.upsert({
            where: { code: 'SALES' },
            update: {},
            create: { code: 'SALES', name: 'Phòng Kinh Doanh' },
        }),
        prisma.department.upsert({
            where: { code: 'QA' },
            update: {},
            create: { code: 'QA', name: 'Phòng QA' },
        }),
    ]);
    console.log('✅ Departments created:', departments.length);

    // ==================== POSITIONS ====================
    const positions = await Promise.all([
        prisma.position.upsert({
            where: { code: 'SE' },
            update: {},
            create: { code: 'SE', name: 'Software Engineer', level: 'SENIOR', departmentId: departments[0].id, minSalary: 20000000, maxSalary: 40000000 },
        }),
        prisma.position.upsert({
            where: { code: 'HR_SPEC' },
            update: {},
            create: { code: 'HR_SPEC', name: 'HR Specialist', level: 'SENIOR', departmentId: departments[1].id, minSalary: 15000000, maxSalary: 25000000 },
        }),
        prisma.position.upsert({
            where: { code: 'MARKETING_EXEC' },
            update: {},
            create: { code: 'MARKETING_EXEC', name: 'Marketing Executive', level: 'JUNIOR', departmentId: departments[2].id, minSalary: 10000000, maxSalary: 18000000 },
        }),
        prisma.position.upsert({
            where: { code: 'ACCOUNTANT' },
            update: {},
            create: { code: 'ACCOUNTANT', name: 'Accountant', level: 'SENIOR', departmentId: departments[3].id, minSalary: 15000000, maxSalary: 25000000 },
        }),
        prisma.position.upsert({
            where: { code: 'SALES_EXEC' },
            update: {},
            create: { code: 'SALES_EXEC', name: 'Sales Executive', level: 'JUNIOR', departmentId: departments[4].id, minSalary: 12000000, maxSalary: 20000000 },
        }),
        prisma.position.upsert({
            where: { code: 'QA_ENGINEER' },
            update: {},
            create: { code: 'QA_ENGINEER', name: 'QA Engineer', level: 'SENIOR', departmentId: departments[5].id, minSalary: 18000000, maxSalary: 35000000 },
        }),
        prisma.position.upsert({
            where: { code: 'TEAM_LEAD' },
            update: {},
            create: { code: 'TEAM_LEAD', name: 'Team Lead', level: 'LEAD', departmentId: departments[0].id, minSalary: 35000000, maxSalary: 55000000 },
        }),
    ]);
    console.log('✅ Positions created:', positions.length);

    // ==================== EMPLOYEES ====================
    const employees = await Promise.all([
        prisma.employee.upsert({
            where: { employeeCode: 'EMP001' },
            update: {},
            create: {
                employeeCode: 'EMP001', fullName: 'Nguyễn Văn An', email: 'an.nguyen@phoenix.com', phone: '0901234001',
                dob: new Date('1990-03-15'), gender: 'MALE', departmentId: departments[0].id, positionId: positions[0].id,
                hireDate: new Date('2022-01-15'), status: 'ACTIVE', address: '123 Nguyễn Huệ, Q1, TP.HCM',
                identityCard: '079090001234', taxCode: '8123456001', bankAccount: '19001234501', bankName: 'Vietcombank',
                contractTypeId: contractTypes[3].id, shiftTypeId: shiftTypes[0].id,
            },
        }),
        prisma.employee.upsert({
            where: { employeeCode: 'EMP002' },
            update: {},
            create: {
                employeeCode: 'EMP002', fullName: 'Trần Thị Bình', email: 'binh.tran@phoenix.com', phone: '0901234002',
                dob: new Date('1992-07-20'), gender: 'FEMALE', departmentId: departments[1].id, positionId: positions[1].id,
                hireDate: new Date('2021-06-01'), status: 'ACTIVE', address: '456 Lê Lợi, Q3, TP.HCM',
                identityCard: '079092005678', taxCode: '8123456002', bankAccount: '19001234502', bankName: 'Techcombank',
                contractTypeId: contractTypes[3].id, shiftTypeId: shiftTypes[0].id,
            },
        }),
        prisma.employee.upsert({
            where: { employeeCode: 'EMP003' },
            update: {},
            create: {
                employeeCode: 'EMP003', fullName: 'Lê Minh Châu', email: 'chau.le@phoenix.com', phone: '0901234003',
                dob: new Date('1995-11-10'), gender: 'MALE', departmentId: departments[0].id, positionId: positions[6].id,
                hireDate: new Date('2020-03-01'), status: 'ACTIVE', address: '789 Điện Biên Phủ, Bình Thạnh, TP.HCM',
                identityCard: '079095009012', taxCode: '8123456003', bankAccount: '19001234503', bankName: 'VPBank',
                contractTypeId: contractTypes[3].id, shiftTypeId: shiftTypes[0].id,
            },
        }),
        prisma.employee.upsert({
            where: { employeeCode: 'EMP004' },
            update: {},
            create: {
                employeeCode: 'EMP004', fullName: 'Phạm Thị Dung', email: 'dung.pham@phoenix.com', phone: '0901234004',
                dob: new Date('1993-05-25'), gender: 'FEMALE', departmentId: departments[2].id, positionId: positions[2].id,
                hireDate: new Date('2023-02-15'), status: 'ACTIVE', address: '321 Cách Mạng Tháng 8, Q10, TP.HCM',
                contractTypeId: contractTypes[1].id, shiftTypeId: shiftTypes[0].id,
            },
        }),
        prisma.employee.upsert({
            where: { employeeCode: 'EMP005' },
            update: {},
            create: {
                employeeCode: 'EMP005', fullName: 'Hoàng Văn Em', email: 'em.hoang@phoenix.com', phone: '0901234005',
                dob: new Date('1998-09-30'), gender: 'MALE', departmentId: departments[3].id, positionId: positions[3].id,
                hireDate: new Date('2023-08-01'), status: 'ACTIVE', address: '654 Hai Bà Trưng, Q1, TP.HCM',
                contractTypeId: contractTypes[0].id, shiftTypeId: shiftTypes[0].id,
            },
        }),
    ]);
    console.log('✅ Employees created:', employees.length);

    // ==================== JOBS ====================
    const jobs = await Promise.all([
        prisma.job.upsert({
            where: { slug: 'senior-react-developer' },
            update: {},
            create: {
                slug: 'senior-react-developer', title: 'Senior React Developer', departmentId: departments[0].id,
                location: 'TP. Hồ Chí Minh', type: 'FULL_TIME', experienceLevel: '3-5 years',
                salaryMin: 25000000, salaryMax: 45000000, status: 'PUBLISHED',
                description: 'We are looking for an experienced React Developer to join our frontend team.',
                requirements: ['3+ years React/Next.js experience', 'Strong TypeScript skills', 'Experience with REST APIs and GraphQL'],
                benefits: ['13th month salary', 'Health insurance', 'Flexible working hours', 'MacBook provided'],
                applicants: 12,
            },
        }),
        prisma.job.upsert({
            where: { slug: 'hr-specialist' },
            update: {},
            create: {
                slug: 'hr-specialist', title: 'HR Specialist', departmentId: departments[1].id,
                location: 'TP. Hồ Chí Minh', type: 'FULL_TIME', experienceLevel: '2-4 years',
                salaryMin: 15000000, salaryMax: 25000000, status: 'PUBLISHED',
                description: 'Join our HR team to manage recruitment, employee relations, and HR operations.',
                requirements: ['Bachelor degree in HR or related field', '2+ years HR experience', 'Proficient with HR software'],
                benefits: ['13th month salary', 'Premium healthcare', 'Training budget', 'Team building activities'],
                applicants: 8,
            },
        }),
        prisma.job.upsert({
            where: { slug: 'qa-automation-engineer' },
            update: {},
            create: {
                slug: 'qa-automation-engineer', title: 'QA Automation Engineer', departmentId: departments[5].id,
                location: 'Hà Nội / Remote', type: 'FULL_TIME', experienceLevel: '2-4 years',
                salaryMin: 20000000, salaryMax: 35000000, status: 'PUBLISHED',
                description: 'We need a QA Automation Engineer to ensure the quality of our products.',
                requirements: ['Experience with Cypress/Playwright', 'API testing skills', 'CI/CD knowledge'],
                benefits: ['13th month salary', 'Remote work option', 'Equipment provided'],
                applicants: 5,
            },
        }),
        prisma.job.upsert({
            where: { slug: 'marketing-intern' },
            update: {},
            create: {
                slug: 'marketing-intern', title: 'Marketing Intern', departmentId: departments[2].id,
                location: 'TP. Hồ Chí Minh', type: 'INTERNSHIP',
                salaryMin: 4000000, salaryMax: 6000000, status: 'DRAFT',
                description: 'An exciting internship opportunity for marketing students.',
                requirements: ['Currently pursuing Marketing/Communication degree', 'Good communication skills'],
                benefits: ['Mentorship program', 'Lunch provided', 'Certificate on completion'],
                applicants: 0,
            },
        }),
    ]);
    console.log('✅ Jobs created:', jobs.length);

    // ==================== CANDIDATES ====================
    const candidates = await Promise.all([
        prisma.candidate.create({
            data: {
                name: 'Ngô Thanh Hà', email: 'ha.ngo@email.com', phone: '0911222001', jobId: jobs[0].id,
                status: 'INTERVIEW', source: 'LINKEDIN', rating: 4,
                cvUrl: 'https://example.com/cv/ha-ngo.pdf',
                appliedDate: new Date('2024-12-15'),
            },
        }),
        prisma.candidate.create({
            data: {
                name: 'Vũ Quốc Bảo', email: 'bao.vu@email.com', phone: '0911222002', jobId: jobs[0].id,
                status: 'SCREENING', source: 'REFERRAL', rating: 3,
                cvUrl: 'https://example.com/cv/bao-vu.pdf',
                appliedDate: new Date('2025-01-05'),
            },
        }),
        prisma.candidate.create({
            data: {
                name: 'Đỗ Minh Tâm', email: 'tam.do@email.com', phone: '0911222003', jobId: jobs[1].id,
                status: 'NEW', source: 'WEBSITE',
                appliedDate: new Date('2025-01-20'),
            },
        }),
        prisma.candidate.create({
            data: {
                name: 'Mai Hương Giang', email: 'giang.mai@email.com', phone: '0911222004', jobId: jobs[2].id,
                status: 'OFFER', source: 'JOB_BOARD', rating: 5,
                cvUrl: 'https://example.com/cv/giang-mai.pdf',
                appliedDate: new Date('2024-11-28'),
            },
        }),
    ]);
    console.log('✅ Candidates created:', candidates.length);

    // ==================== SALARY COMPONENTS ====================
    await Promise.all([
        prisma.salaryComponent.upsert({ where: { code: 'BASE_SALARY' }, update: {}, create: { code: 'BASE_SALARY', name: 'Lương cơ bản', type: 'EARNING', method: 'FIXED', isSystem: true, order: 1 } }),
        prisma.salaryComponent.upsert({ where: { code: 'LUNCH_ALLOWANCE' }, update: {}, create: { code: 'LUNCH_ALLOWANCE', name: 'Phụ cấp ăn trưa', type: 'EARNING', method: 'FIXED', order: 2 } }),
        prisma.salaryComponent.upsert({ where: { code: 'TRANSPORT_ALLOWANCE' }, update: {}, create: { code: 'TRANSPORT_ALLOWANCE', name: 'Phụ cấp xăng xe', type: 'EARNING', method: 'FIXED', order: 3 } }),
        prisma.salaryComponent.upsert({ where: { code: 'PHONE_ALLOWANCE' }, update: {}, create: { code: 'PHONE_ALLOWANCE', name: 'Phụ cấp điện thoại', type: 'EARNING', method: 'FIXED', order: 4 } }),
        prisma.salaryComponent.upsert({ where: { code: 'OVERTIME' }, update: {}, create: { code: 'OVERTIME', name: 'Lương tăng ca', type: 'EARNING', method: 'FORMULA', formula: '[BASE_SALARY] / 26 / 8 * [OT_HOURS] * 1.5', isSystem: true, order: 5 } }),
        prisma.salaryComponent.upsert({ where: { code: 'PIT' }, update: {}, create: { code: 'PIT', name: 'Thuế TNCN', type: 'TAX', method: 'FORMULA', isSystem: true, order: 10 } }),
    ]);
    console.log('✅ Salary components created');

    // ==================== TAX BRACKETS ====================
    await Promise.all([
        prisma.taxBracket.create({ data: { minIncome: 0, maxIncome: 5000000, taxRate: 5, subtractAmount: 0, order: 1 } }),
        prisma.taxBracket.create({ data: { minIncome: 5000000, maxIncome: 10000000, taxRate: 10, subtractAmount: 250000, order: 2 } }),
        prisma.taxBracket.create({ data: { minIncome: 10000000, maxIncome: 18000000, taxRate: 15, subtractAmount: 750000, order: 3 } }),
        prisma.taxBracket.create({ data: { minIncome: 18000000, maxIncome: 32000000, taxRate: 20, subtractAmount: 1650000, order: 4 } }),
        prisma.taxBracket.create({ data: { minIncome: 32000000, maxIncome: 52000000, taxRate: 25, subtractAmount: 3250000, order: 5 } }),
        prisma.taxBracket.create({ data: { minIncome: 52000000, maxIncome: 80000000, taxRate: 30, subtractAmount: 5850000, order: 6 } }),
        prisma.taxBracket.create({ data: { minIncome: 80000000, taxRate: 35, subtractAmount: 9850000, order: 7 } }),
    ]);
    console.log('✅ Tax brackets created');

    // ==================== INSURANCE RATES ====================
    await Promise.all([
        prisma.insuranceRate.create({ data: { type: 'BHXH', employeeRate: 8, employerRate: 17.5, capBaseSalary: 36000000, effectiveDate: new Date('2024-01-01') } }),
        prisma.insuranceRate.create({ data: { type: 'BHYT', employeeRate: 1.5, employerRate: 3, capBaseSalary: 36000000, effectiveDate: new Date('2024-01-01') } }),
        prisma.insuranceRate.create({ data: { type: 'BHTN', employeeRate: 1, employerRate: 1, capBaseSalary: 36000000, effectiveDate: new Date('2024-01-01') } }),
        prisma.insuranceRate.create({ data: { type: 'UNION', employeeRate: 1, employerRate: 2, effectiveDate: new Date('2024-01-01') } }),
    ]);
    console.log('✅ Insurance rates created');

    // ==================== PUBLIC HOLIDAYS ====================
    await Promise.all([
        prisma.publicHoliday.create({ data: { name: 'Tết Dương lịch', date: new Date('2025-01-01'), daysOff: 1 } }),
        prisma.publicHoliday.create({ data: { name: 'Tết Nguyên Đán', date: new Date('2025-01-28'), daysOff: 5 } }),
        prisma.publicHoliday.create({ data: { name: 'Giỗ Tổ Hùng Vương', date: new Date('2025-04-07'), daysOff: 1 } }),
        prisma.publicHoliday.create({ data: { name: 'Ngày Giải phóng miền Nam', date: new Date('2025-04-30'), daysOff: 1 } }),
        prisma.publicHoliday.create({ data: { name: 'Ngày Quốc tế Lao động', date: new Date('2025-05-01'), daysOff: 1 } }),
        prisma.publicHoliday.create({ data: { name: 'Quốc Khánh', date: new Date('2025-09-02'), daysOff: 2 } }),
    ]);
    console.log('✅ Public holidays created');

    // ==================== COURSE CATEGORIES ====================
    await Promise.all([
        prisma.courseCategory.create({ data: { name: 'Kỹ năng mềm', description: 'Soft skills & communication', courseCount: 3 } }),
        prisma.courseCategory.create({ data: { name: 'Công nghệ', description: 'Technical & IT courses', courseCount: 5 } }),
        prisma.courseCategory.create({ data: { name: 'Quản lý', description: 'Management & leadership', courseCount: 2 } }),
        prisma.courseCategory.create({ data: { name: 'An toàn lao động', description: 'Safety & compliance', courseCount: 1 } }),
    ]);
    console.log('✅ Course categories created');

    // ==================== EMAIL TEMPLATES ====================
    await Promise.all([
        prisma.emailTemplate.create({
            data: {
                key: 'WELCOME_EMAIL', name: 'Email chào mừng', subject: 'Chào mừng bạn đến với Phoenix',
                description: 'Gửi cho nhân viên mới khi được tạo tài khoản',
                body: '<h1>Chào mừng {{name}}!</h1><p>Bạn đã được thêm vào hệ thống Phoenix HRMS.</p>',
            },
        }),
        prisma.emailTemplate.create({
            data: {
                key: 'LEAVE_APPROVED', name: 'Phê duyệt nghỉ phép', subject: 'Đơn nghỉ phép đã được phê duyệt',
                description: 'Gửi khi đơn nghỉ phép được duyệt',
                body: '<p>Xin chào {{name}},</p><p>Đơn nghỉ phép từ {{startDate}} đến {{endDate}} đã được phê duyệt.</p>',
            },
        }),
        prisma.emailTemplate.create({
            data: {
                key: 'INTERVIEW_INVITE', name: 'Mời phỏng vấn', subject: 'Lời mời phỏng vấn tại Phoenix',
                description: 'Gửi cho ứng viên khi được mời phỏng vấn',
                body: '<h1>Xin chào {{candidateName}},</h1><p>Chúng tôi mời bạn tham gia phỏng vấn vị trí {{jobTitle}} vào {{interviewDate}}.</p>',
            },
        }),
    ]);
    console.log('✅ Email templates created');

    // ==================== SECURITY CONFIG ====================
    await prisma.securityConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            passwordMinLength: 8,
            requireSpecialChar: true,
            requireNumber: true,
            sessionTimeoutMinutes: 30,
            mfaEnabled: false,
            loginRetries: 5,
        },
    });
    console.log('✅ Security config created');

    // ==================== RECRUITMENT: CANDIDATE ACTIVITIES ====================
    await Promise.all([
        // Ngô Thanh Hà - Interview candidate (candidates[0])
        prisma.candidateActivity.create({
            data: { candidateId: candidates[0].id, type: 'STATUS_CHANGE', title: 'Ứng tuyển mới', content: 'Ứng viên nộp hồ sơ qua LinkedIn.', createdBy: 'System', createdAt: new Date('2024-12-15') },
        }),
        prisma.candidateActivity.create({
            data: { candidateId: candidates[0].id, type: 'STATUS_CHANGE', title: 'Chuyển sang Sàng lọc', content: 'CV đạt yêu cầu, chuyển sang vòng sàng lọc.', createdBy: 'HR Manager', createdAt: new Date('2024-12-17') },
        }),
        prisma.candidateActivity.create({
            data: { candidateId: candidates[0].id, type: 'EMAIL', title: 'Gửi email mời phỏng vấn', content: 'Đã gửi email mời phỏng vấn vòng 1 - Technical Interview.', createdBy: 'HR Manager', createdAt: new Date('2024-12-20') },
        }),
        prisma.candidateActivity.create({
            data: { candidateId: candidates[0].id, type: 'STATUS_CHANGE', title: 'Chuyển sang Phỏng vấn', content: 'Ứng viên xác nhận tham gia phỏng vấn.', createdBy: 'HR Manager', createdAt: new Date('2024-12-22') },
        }),
        // Mai Hương Giang - Offer candidate (candidates[3])
        prisma.candidateActivity.create({
            data: { candidateId: candidates[3].id, type: 'STATUS_CHANGE', title: 'Ứng tuyển mới', content: 'Ứng viên nộp hồ sơ qua Job Board.', createdBy: 'System', createdAt: new Date('2024-11-28') },
        }),
        prisma.candidateActivity.create({
            data: { candidateId: candidates[3].id, type: 'NOTE', title: 'Đánh giá CV', content: 'CV rất ấn tượng - 5 năm kinh nghiệm QA Automation, từng làm Lead ở công ty lớn.', createdBy: 'HR Manager', createdAt: new Date('2024-11-30') },
        }),
        prisma.candidateActivity.create({
            data: { candidateId: candidates[3].id, type: 'STATUS_CHANGE', title: 'Chuyển sang Đề xuất', content: 'Phỏng vấn xuất sắc, đề xuất offer mức 35M/tháng.', createdBy: 'HR Manager', createdAt: new Date('2024-12-10') },
        }),
        // Vũ Quốc Bảo - Screening candidate (candidates[1])
        prisma.candidateActivity.create({
            data: { candidateId: candidates[1].id, type: 'STATUS_CHANGE', title: 'Ứng tuyển mới', content: 'Ứng viên được giới thiệu bởi nhân viên nội bộ.', createdBy: 'System', createdAt: new Date('2025-01-05') },
        }),
        prisma.candidateActivity.create({
            data: { candidateId: candidates[1].id, type: 'STATUS_CHANGE', title: 'Chuyển sang Sàng lọc', content: 'CV đạt yêu cầu cơ bản, cần kiểm tra kỹ năng.', createdBy: 'HR Manager', createdAt: new Date('2025-01-08') },
        }),
    ]);
    console.log('✅ Candidate activities created');

    // ==================== INTERVIEWS ====================
    await Promise.all([
        // Interview for Trần Minh Anh (candidates[0]) - COMPLETED with feedback
        prisma.interview.create({
            data: {
                candidateId: candidates[0].id,
                jobId: jobs[0].id,
                type: 'VIDEO',
                status: 'COMPLETED',
                scheduledAt: new Date('2024-12-25T09:00:00'),
                duration: 60,
                meetingLink: 'https://meet.google.com/abc-defg-hij',
                interviewers: [{ name: 'Nguyễn Văn Quản Lý', role: 'Engineering Manager' }],
                feedback: { rating: 4, recommendation: 'HIRE', notes: 'Ứng viên có kiến thức vững về React, TypeScript. Giao tiếp tốt.' },
            },
        }),
        // Interview for Mai Hương Giang (candidates[3]) - COMPLETED, recommended for next round
        prisma.interview.create({
            data: {
                candidateId: candidates[3].id,
                jobId: jobs[3].id,
                type: 'ONSITE',
                status: 'COMPLETED',
                scheduledAt: new Date('2024-12-15T14:00:00'),
                duration: 90,
                location: 'Phòng họp A, tầng 5',
                interviewers: [{ name: 'Lê Thị HR', role: 'HR Manager' }, { name: 'Trần QA Lead', role: 'QA Lead' }],
                feedback: { rating: 5, recommendation: 'HIRE', notes: 'Kinh nghiệm automation testing xuất sắc. Đề xuất offer ngay.' },
            },
        }),
        // Interview for Vũ Quốc Bảo (candidates[1]) - SCHEDULED (upcoming)
        prisma.interview.create({
            data: {
                candidateId: candidates[1].id,
                jobId: jobs[1].id,
                type: 'PHONE',
                status: 'SCHEDULED',
                scheduledAt: new Date('2025-02-20T10:00:00'),
                duration: 45,
                interviewers: [{ name: 'Phạm Marketing Dir', role: 'Marketing Director' }],
                notes: 'Vòng 1 - Phỏng vấn sàng lọc qua điện thoại',
            },
        }),
    ]);
    console.log('✅ Interviews created');

    // ==================== OFFERS ====================
    await Promise.all([
        // Offer for Trần Minh Anh (candidates[0]) - SENT
        prisma.offer.create({
            data: {
                candidateId: candidates[0].id,
                jobId: jobs[0].id,
                status: 'SENT',
                salaryBase: 30000000,
                salaryBonus: 5000000,
                salaryAllowance: 2000000,
                startDate: new Date('2025-03-01'),
                expiryDate: new Date('2025-02-25'),
                benefits: ['Bảo hiểm sức khỏe', 'Laptop công ty', '13 ngày phép/năm', 'Thưởng tháng 13'],
                notes: 'Offer cho vị trí Senior Frontend Developer. Đã thông qua phỏng vấn vòng cuối.',
                sentAt: new Date('2025-02-10'),
            },
        }),
        // Offer for Mai Hương Giang (candidates[3]) - DRAFT
        prisma.offer.create({
            data: {
                candidateId: candidates[3].id,
                jobId: jobs[3].id,
                status: 'DRAFT',
                salaryBase: 35000000,
                salaryBonus: 3000000,
                startDate: new Date('2025-03-15'),
                expiryDate: new Date('2025-03-01'),
                benefits: ['Bảo hiểm sức khỏe', 'Laptop công ty', 'Remote 2 ngày/tuần'],
            },
        }),
    ]);
    console.log('✅ Offers created');

    // ==================== ONBOARDING ====================
    // Onboarding for Mai Hương Giang (candidates[3]) - IN_PROGRESS
    // Assuming she accepted the offer and is now onboarding
    const onboarding = await prisma.onboarding.create({
        data: {
            candidateId: candidates[3].id,
            employeeName: candidates[3].name,
            employeeEmail: candidates[3].email,
            jobTitle: jobs[3].title, // QA Engineer
            department: departments[0].id, // Engineering
            startDate: new Date('2025-03-30'), // Future date
            buddyName: employees[1].fullName, // Trần Minh Quản Lý
            status: 'IN_PROGRESS',
            tasks: {
                create: [
                    { title: 'Nộp CMND/CCCD', description: 'Bản photo công chứng', category: 'DOCUMENTS', isRequired: true, dueDay: 1, status: 'COMPLETED', completedAt: new Date(), completedBy: 'HR' },
                    { title: 'Nộp sổ hộ khẩu', description: 'Bản photo', category: 'DOCUMENTS', isRequired: true, dueDay: 1, status: 'COMPLETED', completedAt: new Date(), completedBy: 'HR' },
                    { title: 'Ảnh 3x4', description: '4 tấm nền trắng', category: 'DOCUMENTS', isRequired: true, dueDay: 1, status: 'PENDING' },
                    { title: 'Cấp laptop', description: 'Liên hệ IT', category: 'IT_SETUP', isRequired: true, dueDay: 1, assignedTo: 'IT', status: 'IN_PROGRESS' },
                    { title: 'Tạo email công ty', description: '@phoenix.com.vn', category: 'IT_SETUP', isRequired: true, dueDay: 1, assignedTo: 'IT', status: 'PENDING' },
                    { title: 'Hướng dẫn quy trình', description: 'HR giới thiệu', category: 'TRAINING', isRequired: true, dueDay: 2, assignedTo: 'HR', status: 'PENDING' },
                    { title: 'Tour văn phòng', description: 'Giới thiệu các phòng ban', category: 'INTRODUCTION', isRequired: true, dueDay: 1, status: 'PENDING' },
                    { title: 'Ký hợp đồng', description: 'HĐLĐ thử việc', category: 'ADMIN', isRequired: true, dueDay: 1, status: 'PENDING' },
                ]
            }
        },
    });
    console.log('✅ Onboarding created');

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
