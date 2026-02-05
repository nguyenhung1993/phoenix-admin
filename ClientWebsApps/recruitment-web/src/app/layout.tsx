import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { PublicShell } from "@/components/layout/public-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { BackToTop } from "@/components/ui/back-to-top";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: {
    default: "Li-Ning VN Careers - Tuyển dụng",
    template: "%s | Li-Ning VN Careers",
  },
  description: "Gia nhập đội ngũ Li-Ning Việt Nam - Khám phá cơ hội nghề nghiệp và phát triển bản thân cùng thương hiệu thể thao hàng đầu.",
  keywords: ["Li-Ning", "tuyển dụng", "việc làm", "careers", "thể thao", "retail"],
  openGraph: {
    title: "Li-Ning VN Careers - Tuyển dụng",
    description: "Gia nhập đội ngũ Li-Ning Việt Nam - Khám phá cơ hội nghề nghiệp và phát triển bản thân.",
    type: "website",
    locale: "vi_VN",
    siteName: "Li-Ning VN Careers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
          >
            <PublicShell
              header={<Header />}
              footer={<Footer />}
            >
              {children}
            </PublicShell>
            <BackToTop />
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
