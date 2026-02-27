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

    // ==================== CLEANUP OLD DATA ====================
    console.log('🧹 Cleaning up old data...');
    // Delete in order of dependencies (children first)
    await prisma.candidateActivity.deleteMany();
    await prisma.onboardingTask.deleteMany();
    await prisma.onboarding.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.candidate.deleteMany();
    await prisma.attendanceRecord.deleteMany();
    await prisma.leaveRequest.deleteMany();
    await prisma.leaveBalance.deleteMany();
    await prisma.overtimeRequest.deleteMany();
    await prisma.insuranceRecord.deleteMany();
    await prisma.payrollSlip.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.resignationRequest.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.material.deleteMany();
    await prisma.trainingClass.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.evaluation.deleteMany();
    await prisma.reviewCycle.deleteMany();
    await prisma.kPI.deleteMany();
    await prisma.evaluationTemplate.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.post.deleteMany();
    await prisma.workplaceEvent.deleteMany();
    await prisma.approvalRequest.deleteMany();
    await prisma.approvalWorkflow.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.emailTemplate.deleteMany();
    await prisma.taxBracket.deleteMany();
    await prisma.insuranceRate.deleteMany();
    await prisma.publicHoliday.deleteMany();
    await prisma.course.deleteMany();
    await prisma.courseCategory.deleteMany();
    console.log('✅ Cleanup completed');

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

    // ==================== CONTRACTS ====================
    const contracts = await Promise.all([
        prisma.contract.create({
            data: { employeeId: employees[0].id, contractTypeId: contractTypes[3].id, startDate: new Date('2022-01-15'), salary: 30000000, status: 'ACTIVE' },
        }),
        prisma.contract.create({
            data: { employeeId: employees[1].id, contractTypeId: contractTypes[3].id, startDate: new Date('2021-06-01'), salary: 22000000, status: 'ACTIVE' },
        }),
        prisma.contract.create({
            data: { employeeId: employees[2].id, contractTypeId: contractTypes[3].id, startDate: new Date('2020-03-01'), salary: 45000000, status: 'ACTIVE' },
        }),
        prisma.contract.create({
            data: { employeeId: employees[3].id, contractTypeId: contractTypes[1].id, startDate: new Date('2023-02-15'), endDate: new Date('2024-02-14'), salary: 15000000, status: 'ACTIVE' },
        }),
        prisma.contract.create({
            data: { employeeId: employees[4].id, contractTypeId: contractTypes[0].id, startDate: new Date('2023-08-01'), endDate: new Date('2023-10-01'), salary: 10000000, status: 'EXPIRED' },
        }),
        prisma.contract.create({
            data: { employeeId: employees[4].id, contractTypeId: contractTypes[1].id, startDate: new Date('2023-10-01'), endDate: new Date('2024-10-01'), salary: 18000000, status: 'ACTIVE' },
        }),
    ]);
    console.log('✅ Contracts created:', contracts.length);

    // ==================== ATTENDANCE RECORDS ====================
    const today = new Date();
    const attendanceData = [];
    for (let i = 0; i < employees.length; i++) {
        for (let d = 1; d <= 20; d++) {
            const date = new Date(2026, 1, d); // Feb 2026
            if (date.getDay() === 0 || date.getDay() === 6) continue;
            const isLate = Math.random() < 0.15;
            const isEarly = Math.random() < 0.1;
            attendanceData.push({
                employeeId: employees[i].id,
                date,
                shiftName: 'Ca Hành Chính',
                shiftStart: '08:00',
                shiftEnd: '17:00',
                checkIn: isLate ? `08:${String(Math.floor(Math.random() * 30 + 5)).padStart(2, '0')}` : '08:00',
                checkOut: isEarly ? `16:${String(Math.floor(Math.random() * 30 + 15)).padStart(2, '0')}` : '17:00',
                status: isLate ? 'LATE' as const : isEarly ? 'EARLY_LEAVE' as const : 'PRESENT' as const,
                minutesLate: isLate ? Math.floor(Math.random() * 30 + 5) : 0,
                minutesEarly: isEarly ? Math.floor(Math.random() * 30 + 10) : 0,
                workHours: isLate || isEarly ? 7.5 : 8,
            });
        }
    }
    await prisma.attendanceRecord.createMany({ data: attendanceData, skipDuplicates: true });
    console.log('✅ Attendance records created:', attendanceData.length);

    // ==================== LEAVE REQUESTS ====================
    await Promise.all([
        prisma.leaveRequest.create({
            data: { employeeId: employees[0].id, leaveType: 'ANNUAL', startDate: new Date('2026-03-10'), endDate: new Date('2026-03-14'), totalDays: 5, reason: 'Nghỉ phép đi du lịch cùng gia đình', status: 'APPROVED', approverId: employees[2].id, approverName: employees[2].fullName, approvedAt: new Date('2026-02-20') },
        }),
        prisma.leaveRequest.create({
            data: { employeeId: employees[1].id, leaveType: 'SICK', startDate: new Date('2026-02-24'), endDate: new Date('2026-02-25'), totalDays: 2, reason: 'Bị cảm sốt, cần nghỉ điều trị', status: 'APPROVED', approverId: employees[2].id, approverName: employees[2].fullName, approvedAt: new Date('2026-02-24') },
        }),
        prisma.leaveRequest.create({
            data: { employeeId: employees[3].id, leaveType: 'ANNUAL', startDate: new Date('2026-03-20'), endDate: new Date('2026-03-21'), totalDays: 2, reason: 'Nghỉ giải quyết việc cá nhân', status: 'PENDING' },
        }),
        prisma.leaveRequest.create({
            data: { employeeId: employees[4].id, leaveType: 'UNPAID', startDate: new Date('2026-04-01'), endDate: new Date('2026-04-03'), totalDays: 3, reason: 'Về quê giải quyết việc gia đình', status: 'PENDING' },
        }),
    ]);
    console.log('✅ Leave requests created');

    // ==================== LEAVE BALANCES ====================
    await Promise.all([
        prisma.leaveBalance.create({ data: { employeeId: employees[0].id, year: 2026, annualTotal: 14, annualUsed: 5, annualRemaining: 9, sickTotal: 30, sickUsed: 1 } }),
        prisma.leaveBalance.create({ data: { employeeId: employees[1].id, year: 2026, annualTotal: 14, annualUsed: 2, annualRemaining: 12, sickTotal: 30, sickUsed: 2 } }),
        prisma.leaveBalance.create({ data: { employeeId: employees[2].id, year: 2026, annualTotal: 16, annualUsed: 3, annualRemaining: 13, sickTotal: 30, sickUsed: 0 } }),
        prisma.leaveBalance.create({ data: { employeeId: employees[3].id, year: 2026, annualTotal: 12, annualUsed: 0, annualRemaining: 12, sickTotal: 30, sickUsed: 0 } }),
        prisma.leaveBalance.create({ data: { employeeId: employees[4].id, year: 2026, annualTotal: 12, annualUsed: 1, annualRemaining: 11, sickTotal: 30, sickUsed: 0 } }),
    ]);
    console.log('✅ Leave balances created');

    // ==================== OVERTIME REQUESTS ====================
    await Promise.all([
        prisma.overtimeRequest.create({ data: { employeeId: employees[0].id, date: new Date('2026-02-15'), startTime: '18:00', endTime: '21:00', hours: 3, reason: 'Hoàn thành deadline dự án Alpha', status: 'APPROVED', approverId: employees[2].id, approverName: employees[2].fullName, approvedAt: new Date('2026-02-14') } }),
        prisma.overtimeRequest.create({ data: { employeeId: employees[2].id, date: new Date('2026-02-20'), startTime: '18:00', endTime: '22:00', hours: 4, reason: 'Review code và deploy production', status: 'APPROVED', approverName: 'Admin', approvedAt: new Date('2026-02-19') } }),
        prisma.overtimeRequest.create({ data: { employeeId: employees[1].id, date: new Date('2026-03-01'), startTime: '18:00', endTime: '20:00', hours: 2, reason: 'Xử lý hồ sơ nhân sự cuối tháng', status: 'PENDING' } }),
        prisma.overtimeRequest.create({ data: { employeeId: employees[3].id, date: new Date('2026-03-05'), startTime: '18:00', endTime: '21:00', hours: 3, reason: 'Chuẩn bị chiến dịch marketing Q2', status: 'PENDING' } }),
    ]);
    console.log('✅ Overtime requests created');

    // ==================== INSURANCE RECORDS ====================
    for (const emp of employees) {
        const contract = contracts.find(c => c.employeeId === emp.id && c.status === 'ACTIVE');
        const baseSalary = contract ? contract.salary : 15000000;
        await Promise.all([
            prisma.insuranceRecord.create({ data: { employeeId: emp.id, type: 'BHXH', startDate: new Date('2024-01-01'), status: 'ACTIVE', employeeRate: 8, companyRate: 17.5, baseSalary, monthlyContribution: baseSalary * 0.08, insuranceNumber: `BH${emp.id.slice(-6)}` } }),
            prisma.insuranceRecord.create({ data: { employeeId: emp.id, type: 'BHYT', startDate: new Date('2024-01-01'), status: 'ACTIVE', employeeRate: 1.5, companyRate: 3, baseSalary, monthlyContribution: baseSalary * 0.015, insuranceNumber: `BH${emp.id.slice(-6)}` } }),
            prisma.insuranceRecord.create({ data: { employeeId: emp.id, type: 'BHTN', startDate: new Date('2024-01-01'), status: 'ACTIVE', employeeRate: 1, companyRate: 1, baseSalary, monthlyContribution: baseSalary * 0.01, insuranceNumber: `BH${emp.id.slice(-6)}` } }),
        ]);
    }
    console.log('✅ Insurance records created');

    // ==================== PAYROLL SLIPS ====================
    for (const emp of employees) {
        const contract = contracts.find(c => c.employeeId === emp.id && c.status === 'ACTIVE');
        const baseSalary = contract ? contract.salary : 15000000;
        const actualDays = Math.floor(Math.random() * 4) + 22;
        const otHours = Math.floor(Math.random() * 8);
        const salaryByWorkDays = Math.round((baseSalary / 26) * actualDays);
        const otPay = Math.round((baseSalary / 26 / 8) * otHours * 1.5);
        const allowances = 2000000;
        const totalIncome = salaryByWorkDays + otPay + allowances;
        const bhxh = Math.round(baseSalary * 0.08);
        const bhyt = Math.round(baseSalary * 0.015);
        const bhtn = Math.round(baseSalary * 0.01);
        const taxableIncome = totalIncome - bhxh - bhyt - bhtn - 11000000;
        const tax = taxableIncome > 0 ? Math.round(taxableIncome * 0.1) : 0;
        const totalDeductions = bhxh + bhyt + bhtn + tax;
        const netSalary = totalIncome - totalDeductions;

        await prisma.payrollSlip.create({
            data: {
                employeeId: emp.id, month: 1, year: 2026,
                standardWorkDays: 26, actualWorkDays: actualDays,
                baseSalary, salaryByWorkDays, overtimeHours: otHours, overtimePay: otPay,
                allowances, bonus: 0, totalIncome,
                bhxh, bhyt, bhtn, tax, totalDeductions, netSalary,
                status: 'CONFIRMED',
            },
        });
    }
    console.log('✅ Payroll slips created');

    // ==================== COURSES & TRAINING ====================
    const courseCategories = await prisma.courseCategory.findMany();

    const courses = await Promise.all([
        prisma.course.create({
            data: {
                title: 'React & Next.js Nâng cao', description: 'Khóa học toàn diện về React Server Components, App Router, và tối ưu hiệu năng.',
                instructor: 'Lê Minh Châu', duration: '40 giờ', totalModules: 3, totalLessons: 12,
                categoryId: courseCategories[1]?.id, level: 'ADVANCED', students: 15, rating: 4.8, status: 'PUBLISHED',
                modules: JSON.stringify([
                    { id: 'm1', title: 'Module 1: React Fundamentals', lessons: [{ id: 'l1', title: 'JSX & Components', duration: '45 phút', type: 'video' }, { id: 'l2', title: 'Hooks Deep Dive', duration: '60 phút', type: 'video' }, { id: 'l3', title: 'State Management', duration: '50 phút', type: 'video' }, { id: 'l4', title: 'Quiz: React Basics', duration: '15 phút', type: 'quiz' }] },
                    { id: 'm2', title: 'Module 2: Next.js App Router', lessons: [{ id: 'l5', title: 'Server Components', duration: '55 phút', type: 'video' }, { id: 'l6', title: 'Data Fetching', duration: '50 phút', type: 'video' }, { id: 'l7', title: 'Middleware & Auth', duration: '45 phút', type: 'video' }, { id: 'l8', title: 'Lab: Mini Project', duration: '120 phút', type: 'lab' }] },
                    { id: 'm3', title: 'Module 3: Performance', lessons: [{ id: 'l9', title: 'Code Splitting', duration: '40 phút', type: 'video' }, { id: 'l10', title: 'Image Optimization', duration: '35 phút', type: 'video' }, { id: 'l11', title: 'Caching Strategies', duration: '45 phút', type: 'video' }, { id: 'l12', title: 'Final Project', duration: '180 phút', type: 'lab' }] },
                ]),
            },
        }),
        prisma.course.create({
            data: {
                title: 'Kỹ năng Giao tiếp Hiệu quả', description: 'Phát triển kỹ năng giao tiếp, thuyết trình, và làm việc nhóm.',
                instructor: 'Trần Thị Bình', duration: '16 giờ', totalModules: 2, totalLessons: 8,
                categoryId: courseCategories[0]?.id, level: 'BEGINNER', students: 25, rating: 4.5, status: 'PUBLISHED',
                modules: JSON.stringify([
                    { id: 'm1', title: 'Giao tiếp cơ bản', lessons: [{ id: 'l1', title: 'Lắng nghe chủ động', duration: '30 phút', type: 'video' }, { id: 'l2', title: 'Ngôn ngữ cơ thể', duration: '25 phút', type: 'video' }, { id: 'l3', title: 'Phản hồi hiệu quả', duration: '30 phút', type: 'video' }, { id: 'l4', title: 'Thực hành', duration: '45 phút', type: 'lab' }] },
                    { id: 'm2', title: 'Thuyết trình', lessons: [{ id: 'l5', title: 'Chuẩn bị bài trình bày', duration: '35 phút', type: 'video' }, { id: 'l6', title: 'Kỹ thuật thuyết trình', duration: '40 phút', type: 'video' }, { id: 'l7', title: 'Xử lý Q&A', duration: '25 phút', type: 'video' }, { id: 'l8', title: 'Workshop: Thuyết trình thực tế', duration: '90 phút', type: 'lab' }] },
                ]),
            },
        }),
        prisma.course.create({
            data: {
                title: 'Quản lý Dự án Agile', description: 'Khóa học về Scrum, Kanban và các phương pháp quản lý dự án linh hoạt.',
                instructor: 'Nguyễn Văn An', duration: '24 giờ', totalModules: 2, totalLessons: 8,
                categoryId: courseCategories[2]?.id, level: 'INTERMEDIATE', students: 18, rating: 4.3, status: 'PUBLISHED',
            },
        }),
        prisma.course.create({
            data: {
                title: 'An toàn Lao động Cơ bản', description: 'Đào tạo bắt buộc về an toàn lao động cho nhân viên mới.',
                instructor: 'Phạm Thị Dung', duration: '8 giờ', totalModules: 1, totalLessons: 4,
                categoryId: courseCategories[3]?.id, level: 'BEGINNER', students: 40, rating: 4.0, status: 'PUBLISHED',
            },
        }),
    ]);
    console.log('✅ Courses created:', courses.length);

    // Training Classes
    await Promise.all([
        prisma.trainingClass.create({ data: { courseId: courses[0].id, code: 'CLS-REACT-001', startDate: new Date('2026-03-01'), endDate: new Date('2026-04-15'), instructor: 'Lê Minh Châu', capacity: 20, enrolled: 15, status: 'UPCOMING', location: 'Phòng họp A, tầng 5' } }),
        prisma.trainingClass.create({ data: { courseId: courses[1].id, code: 'CLS-COMM-001', startDate: new Date('2026-02-10'), endDate: new Date('2026-02-28'), instructor: 'Trần Thị Bình', capacity: 30, enrolled: 25, status: 'IN_PROGRESS', location: 'Online - Google Meet' } }),
        prisma.trainingClass.create({ data: { courseId: courses[3].id, code: 'CLS-SAFE-001', startDate: new Date('2025-12-01'), endDate: new Date('2025-12-15'), instructor: 'Phạm Thị Dung', capacity: 50, enrolled: 40, status: 'COMPLETED', location: 'Hội trường tầng 1' } }),
    ]);
    console.log('✅ Training classes created');

    // Materials
    await Promise.all([
        prisma.material.create({ data: { title: 'React 19 Cheatsheet.pdf', courseId: courses[0].id, type: 'PDF', url: '/materials/react-cheatsheet.pdf', size: '2.5 MB' } }),
        prisma.material.create({ data: { title: 'Next.js App Router Video', courseId: courses[0].id, type: 'VIDEO', url: '/materials/nextjs-approuter.mp4', size: '150 MB' } }),
        prisma.material.create({ data: { title: 'Slide Giao tiếp Hiệu quả', courseId: courses[1].id, type: 'SLIDE', url: '/materials/communication-slides.pptx', size: '12 MB' } }),
        prisma.material.create({ data: { title: 'Tài liệu ATLĐ 2026', courseId: courses[3].id, type: 'PDF', url: '/materials/safety-guide-2026.pdf', size: '5 MB' } }),
    ]);
    console.log('✅ Materials created');

    // Enrollments
    await Promise.all([
        prisma.enrollment.create({ data: { userId: employees[0].id, courseId: courses[0].id, userName: employees[0].fullName, courseName: courses[0].title, progress: 65, status: 'IN_PROGRESS' } }),
        prisma.enrollment.create({ data: { userId: employees[1].id, courseId: courses[1].id, userName: employees[1].fullName, courseName: courses[1].title, progress: 100, score: 92, status: 'COMPLETED', completedAt: new Date('2026-02-28') } }),
        prisma.enrollment.create({ data: { userId: employees[2].id, courseId: courses[0].id, userName: employees[2].fullName, courseName: courses[0].title, progress: 30, status: 'IN_PROGRESS' } }),
        prisma.enrollment.create({ data: { userId: employees[3].id, courseId: courses[3].id, userName: employees[3].fullName, courseName: courses[3].title, progress: 100, score: 85, status: 'COMPLETED', completedAt: new Date('2025-12-15') } }),
        prisma.enrollment.create({ data: { userId: employees[4].id, courseId: courses[3].id, userName: employees[4].fullName, courseName: courses[3].title, progress: 50, status: 'IN_PROGRESS' } }),
    ]);
    console.log('✅ Enrollments created');

    // Exams
    await Promise.all([
        prisma.exam.create({ data: { title: 'Kiểm tra React/Next.js', durationMinutes: 60, totalQuestions: 30, passScore: 70, status: 'ACTIVE' } }),
        prisma.exam.create({ data: { title: 'Kiểm tra An toàn Lao động', durationMinutes: 30, totalQuestions: 20, passScore: 80, status: 'ACTIVE' } }),
        prisma.exam.create({ data: { title: 'Đánh giá Kỹ năng Mềm', durationMinutes: 45, totalQuestions: 25, passScore: 60, status: 'DRAFT' } }),
    ]);
    console.log('✅ Exams created');

    // ==================== PERFORMANCE ====================
    const kpis = await Promise.all([
        prisma.kPI.create({ data: { code: 'KPI-REV-001', name: 'Doanh thu quý', description: 'Tổng doanh thu đạt được trong quý', unit: 'CURRENCY', target: 5000000000, weight: 30, category: 'FINANCIAL', departmentId: departments[4].id } }),
        prisma.kPI.create({ data: { code: 'KPI-SAT-001', name: 'CSAT Score', description: 'Điểm hài lòng khách hàng', unit: 'RATING', target: 4.5, weight: 20, category: 'CUSTOMER', departmentId: departments[4].id } }),
        prisma.kPI.create({ data: { code: 'KPI-DEL-001', name: 'Tỷ lệ giao hàng đúng hạn', description: 'Percent dự án hoàn thành đúng deadline', unit: 'PERCENTAGE', target: 90, weight: 25, category: 'INTERNAL', departmentId: departments[0].id } }),
        prisma.kPI.create({ data: { code: 'KPI-TRN-001', name: 'Giờ đào tạo/NV', description: 'Số giờ đào tạo trung bình mỗi nhân viên', unit: 'NUMBER', target: 40, weight: 15, category: 'LEARNING' } }),
        prisma.kPI.create({ data: { code: 'KPI-REC-001', name: 'Time to Hire', description: 'Thời gian trung bình từ mở tin đến tuyển xong', unit: 'NUMBER', target: 30, weight: 10, category: 'INTERNAL', departmentId: departments[1].id } }),
    ]);
    console.log('✅ KPIs created:', kpis.length);

    // Review Cycles
    const reviewCycles = await Promise.all([
        prisma.reviewCycle.create({ data: { name: 'Đánh giá Năm 2025', startDate: new Date('2025-12-01'), endDate: new Date('2026-01-31'), status: 'COMPLETED', type: 'ANNUAL', participants: 5 } }),
        prisma.reviewCycle.create({ data: { name: 'Đánh giá Q1/2026', startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31'), status: 'PLANNING', type: 'QUARTERLY', participants: 5 } }),
    ]);
    console.log('✅ Review cycles created');

    // Evaluations
    await Promise.all([
        prisma.evaluation.create({
            data: {
                reviewCycleId: reviewCycles[0].id, employeeId: employees[0].id, reviewerId: employees[2].id,
                status: 'APPROVED', selfScore: 4.2, managerScore: 4.0, finalScore: 4.1,
                kpiResults: JSON.stringify([{ kpiName: 'Hoàn thành dự án', target: 100, actual: 95, score: 4.2, weight: 40 }, { kpiName: 'Chất lượng code', target: 90, actual: 88, score: 3.9, weight: 30 }]),
                strengths: 'Kỹ năng technical tốt, tự học nhanh, chủ động trong công việc.',
                weaknesses: 'Cần cải thiện kỹ năng communication với stakeholders.',
                developmentPlan: 'Tham gia khóa Communication Skills Q2/2026.',
                submittedAt: new Date('2026-01-15'), reviewedAt: new Date('2026-01-20'),
            },
        }),
        prisma.evaluation.create({
            data: {
                reviewCycleId: reviewCycles[0].id, employeeId: employees[1].id, reviewerId: employees[2].id,
                status: 'REVIEWED', selfScore: 4.5, managerScore: 4.3, finalScore: 4.4,
                strengths: 'Tỉ mỉ, cẩn thận, am hiểu luật lao động.',
                weaknesses: 'Cần phát triển kỹ năng data analysis.',
                submittedAt: new Date('2026-01-16'), reviewedAt: new Date('2026-01-22'),
            },
        }),
        prisma.evaluation.create({
            data: {
                reviewCycleId: reviewCycles[0].id, employeeId: employees[3].id,
                status: 'DRAFT', selfScore: null,
            },
        }),
    ]);
    console.log('✅ Evaluations created');

    // Evaluation Templates
    await Promise.all([
        prisma.evaluationTemplate.create({
            data: {
                name: 'Đánh giá KPI Hàng quý', description: 'Mẫu đánh giá dựa trên KPI cho chu kỳ đánh giá hàng quý.',
                type: 'KPI', status: 'ACTIVE',
                sections: JSON.stringify([
                    { id: 's1', name: 'Hiệu suất công việc', weight: 60, criteria: [{ id: 'c1', name: 'Hoàn thành KPI', weight: 40, ratingScale: 5 }, { id: 'c2', name: 'Chất lượng công việc', weight: 20, ratingScale: 5 }] },
                    { id: 's2', name: 'Thái độ làm việc', weight: 40, criteria: [{ id: 'c3', name: 'Chủ động & Sáng tạo', weight: 20, ratingScale: 5 }, { id: 'c4', name: 'Hợp tác nhóm', weight: 20, ratingScale: 5 }] },
                ]),
            },
        }),
        prisma.evaluationTemplate.create({
            data: {
                name: 'Đánh giá Năng lực Toàn diện', description: 'Mẫu đánh giá kết hợp KPI và năng lực.',
                type: 'MIXED', status: 'ACTIVE',
                sections: JSON.stringify([
                    { id: 's1', name: 'KPI & Hiệu suất', weight: 50, criteria: [{ id: 'c1', name: 'Đạt KPI', weight: 30, ratingScale: 5 }, { id: 'c2', name: 'Mục tiêu phụ', weight: 20, ratingScale: 5 }] },
                    { id: 's2', name: 'Năng lực chuyên môn', weight: 30, criteria: [{ id: 'c3', name: 'Kiến thức chuyên môn', weight: 15, ratingScale: 5 }, { id: 'c4', name: 'Giải quyết vấn đề', weight: 15, ratingScale: 5 }] },
                    { id: 's3', name: 'Phát triển', weight: 20, criteria: [{ id: 'c5', name: 'Tự học & Phát triển', weight: 10, ratingScale: 5 }, { id: 'c6', name: 'Đóng góp cho team', weight: 10, ratingScale: 5 }] },
                ]),
            },
        }),
    ]);
    console.log('✅ Evaluation templates created');

    // ==================== ASSETS ====================
    await Promise.all([
        prisma.asset.create({ data: { code: 'AST001', name: 'MacBook Pro M3 14"', type: 'LAPTOP', status: 'IN_USE', purchaseDate: new Date('2024-06-15'), price: 52000000, holderId: employees[0].id, holderName: employees[0].fullName, assignedDate: new Date('2024-06-20'), description: 'MacBook Pro M3 Pro, 18GB RAM, 512GB SSD' } }),
        prisma.asset.create({ data: { code: 'AST002', name: 'Dell XPS 15', type: 'LAPTOP', status: 'IN_USE', purchaseDate: new Date('2024-03-10'), price: 38000000, holderId: employees[1].id, holderName: employees[1].fullName, assignedDate: new Date('2024-03-15') } }),
        prisma.asset.create({ data: { code: 'AST003', name: 'LG UltraFine 27" 4K', type: 'MONITOR', status: 'IN_USE', purchaseDate: new Date('2024-06-15'), price: 12000000, holderId: employees[0].id, holderName: employees[0].fullName, assignedDate: new Date('2024-06-20') } }),
        prisma.asset.create({ data: { code: 'AST004', name: 'Dell U2723QE 27"', type: 'MONITOR', status: 'AVAILABLE', purchaseDate: new Date('2024-08-01'), price: 11500000, description: 'Còn trong kho' } }),
        prisma.asset.create({ data: { code: 'AST005', name: 'iPhone 15 Pro', type: 'PHONE', status: 'IN_USE', purchaseDate: new Date('2024-10-01'), price: 28000000, holderId: employees[2].id, holderName: employees[2].fullName, assignedDate: new Date('2024-10-05') } }),
        prisma.asset.create({ data: { code: 'AST006', name: 'Herman Miller Aeron', type: 'FURNITURE', status: 'IN_USE', purchaseDate: new Date('2023-01-15'), price: 35000000, holderId: employees[2].id, holderName: employees[2].fullName, assignedDate: new Date('2023-01-20') } }),
        prisma.asset.create({ data: { code: 'AST007', name: 'ThinkPad X1 Carbon', type: 'LAPTOP', status: 'MAINTENANCE', purchaseDate: new Date('2022-05-20'), price: 32000000, description: 'Đang sửa chữa - thay pin + bàn phím' } }),
        prisma.asset.create({ data: { code: 'AST008', name: 'Toyota Camry 2024', type: 'VEHICLE', status: 'IN_USE', purchaseDate: new Date('2024-01-01'), price: 1200000000, description: 'Xe công ty dùng cho đi công tác' } }),
    ]);
    console.log('✅ Assets created');

    // ==================== POSTS ====================
    await Promise.all([
        prisma.post.create({ data: { authorId: adminUser.id, authorName: 'Admin', authorRole: 'SUPER_ADMIN', type: 'ANNOUNCEMENT', content: '🎉 Chúc mừng năm mới 2026! Chúc tất cả thành viên Phoenix một năm mới thành công và hạnh phúc. Công ty sẽ tổ chức tiệc Year-End Party vào ngày 15/01.', images: [], likes: 24, comments: 8 } }),
        prisma.post.create({ data: { authorId: adminUser.id, authorName: 'Admin', authorRole: 'SUPER_ADMIN', type: 'ANNOUNCEMENT', content: '📢 Thông báo: Từ tháng 3/2026, công ty sẽ áp dụng chính sách làm việc hybrid 3 ngày onsite + 2 ngày remote. Chi tiết sẽ được gửi qua email.', images: [], likes: 45, comments: 15 } }),
        prisma.post.create({ data: { authorId: managerUser.id, authorName: 'HR Manager', authorRole: 'HR_MANAGER', type: 'EVENT', content: '🏆 Team Building Q1/2026 sẽ diễn ra vào ngày 22-23/03 tại Vũng Tàu. Đăng ký tham gia trước 10/03 nhé!', images: [], likes: 32, comments: 12 } }),
    ]);
    console.log('✅ Posts created');

    // ==================== WORKPLACE EVENTS ====================
    await Promise.all([
        prisma.workplaceEvent.create({ data: { type: 'BIRTHDAY', title: 'Sinh nhật: Nguyễn Văn An', date: new Date('2026-03-15'), targetId: employees[0].id, description: 'Chúc mừng sinh nhật!' } }),
        prisma.workplaceEvent.create({ data: { type: 'NEW_HIRE', title: 'Chào mừng nhân viên mới: Mai Hương Giang', date: new Date('2026-03-30'), description: 'QA Automation Engineer - Phòng Kỹ Thuật' } }),
        prisma.workplaceEvent.create({ data: { type: 'COMPANY_EVENT', title: 'Team Building Q1/2026', date: new Date('2026-03-22'), description: '2 ngày 1 đêm tại Vũng Tàu' } }),
    ]);
    console.log('✅ Workplace events created');

    // ==================== APPROVAL REQUESTS ====================
    await Promise.all([
        prisma.approvalRequest.create({
            data: {
                code: 'REQ-2026-001', type: 'LEAVE', requesterId: employees[0].id, requesterName: employees[0].fullName,
                department: 'Phòng Kỹ Thuật', title: 'Xin nghỉ phép 5 ngày', description: 'Nghỉ phép đi du lịch cùng gia đình từ 10/03 - 14/03.',
                status: 'APPROVED', currentStepOrder: 2, totalSteps: 2,
                steps: [{ id: 's1', order: 1, role: 'MANAGER', label: 'Trưởng phòng duyệt', status: 'APPROVED', approvedBy: employees[2].fullName, approvedAt: new Date('2026-02-20').toISOString(), comment: 'Đồng ý' },
                { id: 's2', order: 2, role: 'HR', label: 'HR xác nhận', status: 'APPROVED', approvedBy: 'HR Manager', approvedAt: new Date('2026-02-21').toISOString(), comment: 'OK' }],
            },
        }),
        prisma.approvalRequest.create({
            data: {
                code: 'REQ-2026-002', type: 'OVERTIME', requesterId: employees[1].id, requesterName: employees[1].fullName,
                department: 'Phòng Nhân Sự', title: 'Đăng ký tăng ca 2 giờ', description: 'Xử lý hồ sơ nhân sự cuối tháng, cần thêm 2 giờ.',
                status: 'PENDING', currentStepOrder: 1, totalSteps: 1,
                steps: [{ id: 's1', order: 1, role: 'MANAGER', label: 'Trưởng phòng duyệt', status: 'PENDING' }],
            },
        }),
        prisma.approvalRequest.create({
            data: {
                code: 'REQ-2026-003', type: 'ASSET_REQUEST', requesterId: employees[3].id, requesterName: employees[3].fullName,
                department: 'Phòng Marketing', title: 'Yêu cầu cấp Laptop mới', description: 'Laptop hiện tại đã cũ, cần thay để phục vụ thiết kế đồ họa.',
                metadata: { preferredModel: 'MacBook Pro 16"', budget: 55000000 },
                status: 'PENDING', currentStepOrder: 1, totalSteps: 2,
                steps: [{ id: 's1', order: 1, role: 'MANAGER', label: 'Trưởng phòng duyệt', status: 'PENDING' },
                { id: 's2', order: 2, role: 'HR', label: 'HR & IT xác nhận', status: 'PENDING' }],
            },
        }),
        prisma.approvalRequest.create({
            data: {
                code: 'REQ-2026-004', type: 'LEAVE', requesterId: employees[4].id, requesterName: employees[4].fullName,
                department: 'Phòng Tài Chính', title: 'Xin nghỉ phép 3 ngày', description: 'Về quê giải quyết việc gia đình từ 01/04 - 03/04.',
                status: 'PENDING', currentStepOrder: 1, totalSteps: 2,
                steps: [{ id: 's1', order: 1, role: 'MANAGER', label: 'Trưởng phòng duyệt', status: 'PENDING' },
                { id: 's2', order: 2, role: 'HR', label: 'HR xác nhận', status: 'PENDING' }],
            },
        }),
    ]);
    console.log('✅ Approval requests created');

    // ==================== NOTIFICATIONS ====================
    await Promise.all([
        prisma.notification.create({ data: { userId: adminUser.id, title: 'Yêu cầu nghỉ phép mới', message: `${employees[3].fullName} đã gửi đơn xin nghỉ phép 2 ngày (20-21/03).`, type: 'LEAVE_REQUEST', priority: 'HIGH', actionUrl: '/admin/requests' } }),
        prisma.notification.create({ data: { userId: adminUser.id, title: 'Yêu cầu tăng ca mới', message: `${employees[1].fullName} đăng ký tăng ca 2 giờ ngày 01/03.`, type: 'OVERTIME_REQUEST', priority: 'MEDIUM', actionUrl: '/admin/requests' } }),
        prisma.notification.create({ data: { userId: adminUser.id, title: 'Hợp đồng sắp hết hạn', message: `Hợp đồng của ${employees[4].fullName} sẽ hết hạn vào 01/10/2024. Vui lòng gia hạn.`, type: 'CONTRACT_EXPIRY', priority: 'HIGH', isRead: true, actionUrl: '/admin/contracts' } }),
        prisma.notification.create({ data: { userId: adminUser.id, title: 'Sinh nhật nhân viên', message: `Ngày mai là sinh nhật của ${employees[0].fullName}. Hãy gửi lời chúc!`, type: 'BIRTHDAY', priority: 'LOW', senderName: 'System' } }),
        prisma.notification.create({ data: { userId: adminUser.id, title: 'Ứng viên mới nộp hồ sơ', message: 'Có 3 ứng viên mới nộp hồ sơ cho vị trí Senior React Developer.', type: 'TASK_ASSIGNMENT', priority: 'MEDIUM', actionUrl: '/admin/candidates' } }),
    ]);
    console.log('✅ Notifications created');

    // ==================== RESIGNATION REQUESTS ====================
    // Note: We won't add any active resignation for demo - keeping team stable
    // But add one old rejected one for history
    await prisma.resignationRequest.create({
        data: {
            employeeId: employees[4].id, managerId: employees[2].id,
            reason: 'Muốn chuyển sang môi trường làm việc mới để phát triển bản thân.',
            lastWorkingDate: new Date('2026-05-01'),
            status: 'REJECTED', handoverStatus: 'PENDING',
            feedback: 'Đã trao đổi lại, điều chỉnh mức lương và vị trí phù hợp hơn. NV đồng ý ở lại.',
        },
    });
    console.log('✅ Resignation request created');

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
