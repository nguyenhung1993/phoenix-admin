# Hướng dẫn Deploy lên Vercel

## 1. Chuẩn bị Environement Variables (@Vercel Environment Variables)

Bạn cần cấu hình các biến môi trường sau trên Vercel Project Settings:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_URL` | Connection string tới Supabase/PostgreSQL | `postgres://user:pass@host:6543/db?pgbouncer=true` |
| `AUTH_SECRET` | Secret key cho NextAuth | (Generate bằng `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `...` |
| `NEXTAUTH_URL` | Domain của app trên Vercel | `https://your-project.vercel.app` |
| `ADMIN_EMAILS` | Email admin (để bảo vệ route admin) | `admin@example.com` |
| `RESEND_API_KEY` | (Optional) API Key gửi email | `re_...` |

## 2. Cấu hình Google Cloud Console

1. Vào [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Chọn project và vào Credentials -> OAuth 2.0 Client IDs.
3. Thêm URI của Vercel vào **Authorized redirect URIs**:
   - `https://your-project.vercel.app/api/auth/callback/google`

## 3. Deploy

1. Push code lên GitHub.
2. Vào Vercel Dashboard -> Add New -> Project -> Import Repository.
3. Framework Preset: **Next.js**.
4. Build Command: `prisma generate && next build` (Mặc định).
5. Install Command: `npm install` (Mặc định).
6. Nhập Environment Variables ở bước 1.
7. Click **Deploy**.

## ⚠️ Lưu ý quan trọng về File Upload

Hiện tại chức năng **Upload CV** đang lưu file trực tiếp vào thư mục `public/uploads/cv` của server.

- **Trên Vercel**: File system là **Ephemeral** (tạm thời). File upload sẽ bị mất sau khi server function kết thúc hoặc redeploy.
- **Giải pháp Production**: Cần tích hợp AWS S3, Vercel Blob, hoặc Uploadthing để lưu trữ file lâu dài. (Có thể thực hiện ở Phase sau).
