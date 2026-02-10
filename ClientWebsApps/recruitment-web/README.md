# Li-Ning VN Recruitment & HRM System

Hệ thống quản lý Tuyển dụng và Nhân sự (HRM) nội bộ cho Li-Ning Việt Nam.

## Tính năng chính

### 1. Quản trị Nhân sự (HRM Core)
- **Quản lý Nhân viên**: Hồ sơ chi tiết, hợp đồng, quá trình làm việc.
- **Cơ cấu tổ chức**: Quản lý phòng ban, chức vụ.
- **Cài đặt hệ thống**: Loại hợp đồng, ca làm việc, ngày nghỉ lễ.

### 2. C&B (Lương & Phúc lợi)
- **Chấm công (Timekeeping)**: Lịch làm việc, theo dõi đi muộn/về sớm.
- **Nghỉ phép (Leave Management)**: Quy trình tạo và duyệt đơn nghỉ phép.
- **Lương (Payroll)**: Cấu hình bảng lương, các khoản phụ cấp/khấu trừ.

### 3. Đào tạo & Đánh giá (Training & Performance)
- **E-Learning**: Quản lý khóa học, bài giảng và theo dõi tiến độ học tập.
- **KPI Review**: Đánh giá năng lực nhân viên định kỳ.

### 4. Quản lý Tài sản (Asset Management)
- Theo dõi cấp phát, thu hồi thiết bị làm việc.

### 5. Báo cáo (Reports)
- Dashboard tổng quan.
- Xuất báo cáo Excel/PDF (Danh sách nhân viên, Thuế, Bảo hiểm...).

## Công nghệ sử dụng
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn UI
- **State Management**: React Hooks (Context/Reducers)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Cài đặt và Chạy dự án

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy môi trường development:
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Triển khai (Deployment)
Dự án có thể dễ dàng triển khai lên Vercel hoặc Netlify.
```bash
npm run build
npm start
```
