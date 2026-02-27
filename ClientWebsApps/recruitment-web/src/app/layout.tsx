import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { BackToTop } from "@/components/ui/back-to-top";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://phoenix-admin.vercel.app'),
  title: {
    default: "Phoenix Careers - Tuyển dụng",
    template: "%s | Phoenix Careers",
  },
  description: "Gia nhập đội ngũ Phoenix - Khám phá cơ hội nghề nghiệp và phát triển bản thân cùng thương hiệu thể thao hàng đầu.",
  keywords: ["Phoenix", "tuyển dụng", "việc làm", "careers", "thể thao", "retail", "việc làm Hà Nội", "việc làm Hồ Chí Minh"],
  authors: [{ name: "Phoenix HR Team" }],
  creator: "Phoenix",
  openGraph: {
    title: "Phoenix Careers - Nền tảng tuyển dụng",
    description: "Gia nhập đội ngũ Phoenix - Khám phá cơ hội nghề nghiệp và phát triển bản thân cùng thương hiệu thể thao hàng đầu.",
    url: '/',
    siteName: "Phoenix Careers",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Phoenix Tuyển dụng',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phoenix Careers",
    description: "Khám phá cơ hội nghề nghiệp tại Phoenix.",
    creator: "@phoenix",
  }
};

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
          >
            <SmoothScrollProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <BackToTop />
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  duration: 4000,
                }}
              />
            </SmoothScrollProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
