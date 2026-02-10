"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Heart, Target, Briefcase, Building } from 'lucide-react';
import { AuroraBackground } from '@/components/react-bits/AuroraBackground';
import { SplitText } from '@/components/react-bits/SplitText';
import { TiltedCard } from '@/components/react-bits/TiltedCard';
import { motion } from 'framer-motion';

interface LandingPageProps {
    isLoggedIn: boolean;
}

export function LandingPage({ isLoggedIn }: LandingPageProps) {
    return (
        <>
            {/* Hero Section with Aurora Background */}
            <AuroraBackground>
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                    <div className="container text-center z-10">
                        <Badge variant="secondary" className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-foreground">
                            🚀 Đang tuyển dụng
                        </Badge>
                        <h1 className="text-4xl md:text-7xl font-bold dark:text-white text-center mb-6">
                            Gia nhập đội ngũ <br />
                            <span className="text-primary block mt-2">
                                Phoenix
                            </span>
                        </h1>
                        <div className="text-lg md:text-xl text-muted-foreground py-4 max-w-2xl mx-auto mb-8">
                            <SplitText
                                text="Khám phá cơ hội nghề nghiệp tại thương hiệu thể thao hàng đầu. Phát triển bản thân, tỏa sáng và chinh phục đỉnh cao cùng chúng tôi."
                                className="text-center"
                                delay={50}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isLoggedIn ? (
                                <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
                                    <Link href="/portal">
                                        Truy cập Portal Nhân viên
                                        <Building className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
                                    <Link href="/careers">
                                        Xem vị trí đang tuyển
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            )}

                            <Button size="lg" variant="outline" className="border-neutral-300 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800" asChild>
                                <Link href="/about">Tìm hiểu về chúng tôi</Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AuroraBackground>

            {/* Why Join Us with Tilted Cards */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Tại sao chọn Phoenix?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Chúng tôi tin rằng mỗi cá nhân đều có tiềm năng vô hạn.
                            Hãy để Phoenix trở thành bệ phóng cho sự nghiệp của bạn.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="h-[300px]">
                            <TiltedCard className="h-full">
                                <div className="flex flex-col items-center text-center h-full justify-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                        <Users className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Đội ngũ năng động</h3>
                                    <p className="text-muted-foreground">
                                        Làm việc cùng những đồng nghiệp nhiệt huyết, sáng tạo và luôn sẵn sàng hỗ trợ nhau.
                                    </p>
                                </div>
                            </TiltedCard>
                        </div>

                        <div className="h-[300px]">
                            <TiltedCard className="h-full">
                                <div className="flex flex-col items-center text-center h-full justify-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                        <Target className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Phát triển bản thân</h3>
                                    <p className="text-muted-foreground">
                                        Cơ hội học hỏi, đào tạo liên tục và phát triển career path rõ ràng.
                                    </p>
                                </div>
                            </TiltedCard>
                        </div>

                        <div className="h-[300px]">
                            <TiltedCard className="h-full">
                                <div className="flex flex-col items-center text-center h-full justify-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                        <Heart className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Phúc lợi hấp dẫn</h3>
                                    <p className="text-muted-foreground">
                                        Mức lương cạnh tranh, bảo hiểm đầy đủ, và nhiều quyền lợi đặc biệt khác.
                                    </p>
                                </div>
                            </TiltedCard>
                        </div>

                        <div className="h-[300px]">
                            <TiltedCard className="h-full">
                                <div className="flex flex-col items-center text-center h-full justify-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                        <Briefcase className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Thương hiệu quốc tế</h3>
                                    <p className="text-muted-foreground">
                                        Làm việc cho thương hiệu thể thao hàng đầu thế giới với mạng lưới toàn cầu.
                                    </p>
                                </div>
                            </TiltedCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Keep simple for contrast */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Sẵn sàng bắt đầu hành trình mới?
                        </h2>
                        <p className="text-xl opacity-90 max-w-xl mx-auto mb-10">
                            Khám phá các vị trí đang tuyển và gửi CV của bạn ngay hôm nay.
                        </p>
                        <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                            <Link href="/careers">
                                Xem tất cả vị trí
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
