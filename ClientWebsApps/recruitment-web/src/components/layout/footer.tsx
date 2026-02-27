import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">Phoenix</h3>
                        <p className="text-sm text-muted-foreground">
                            Gia nhập đội ngũ Phoenix Việt Nam - Nơi bạn được phát triển và tỏa sáng.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Liên kết nhanh</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary">Trang chủ</Link></li>
                            <li><Link href="/about" className="hover:text-primary">Về chúng tôi</Link></li>
                            <li><Link href="/careers" className="hover:text-primary">Tuyển dụng</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Công ty</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" target="_blank" className="hover:text-primary">Phoenix Vietnam</Link></li>
                            <li><Link href="#" className="hover:text-primary">Chính sách bảo mật</Link></li>
                            <li><Link href="#" className="hover:text-primary">Điều khoản sử dụng</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Liên hệ</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>hr@phoenix-vn.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>0123 456 789</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5" />
                                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2026 Phoenix Vietnam</p>
                </div>
            </div>
        </footer>
    );
}
