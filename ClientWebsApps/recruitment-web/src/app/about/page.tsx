import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target, Eye, Heart, Users, Award, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Về chúng tôi',
    description: 'Tìm hiểu về Phoenix - Thương hiệu thể thao hàng đầu với sứ mệnh mang đến sản phẩm chất lượng và cơ hội phát triển cho mọi người.',
};

const coreValues = [
    {
        icon: Heart,
        title: 'Tận tâm',
        description: 'Đặt khách hàng và nhân viên làm trọng tâm trong mọi quyết định.',
    },
    {
        icon: Zap,
        title: 'Đổi mới',
        description: 'Không ngừng sáng tạo và cải tiến để dẫn đầu xu hướng.',
    },
    {
        icon: Users,
        title: 'Hợp tác',
        description: 'Teamwork là sức mạnh, cùng nhau chinh phục mọi thử thách.',
    },
    {
        icon: Award,
        title: 'Xuất sắc',
        description: 'Cam kết chất lượng cao nhất trong mọi sản phẩm và dịch vụ.',
    },
];

const teamMembers = [
    { name: 'Nguyễn Văn A', role: 'CEO', image: '/team/ceo.jpg' },
    { name: 'Trần Thị B', role: 'HR Director', image: '/team/hr.jpg' },
    { name: 'Lê Văn C', role: 'Operations Manager', image: '/team/ops.jpg' },
    { name: 'Phạm Thị D', role: 'Marketing Lead', image: '/team/marketing.jpg' },
];

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/5 via-background to-background py-16 md:py-24">
                <div className="container text-center">
                    <Badge variant="secondary" className="mb-4">
                        Về chúng tôi
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Phoenix
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Là nhà phân phối chính thức của thương hiệu thể thao Phoenix tại Việt Nam,
                        chúng tôi tự hào mang đến những sản phẩm chất lượng cao và trải nghiệm
                        mua sắm tuyệt vời cho khách hàng.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-primary/20">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Sứ mệnh</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    Mang đến cho người Việt Nam những sản phẩm thể thao chất lượng quốc tế
                                    với giá cả hợp lý. Khuyến khích lối sống năng động, lành mạnh và
                                    đồng hành cùng mọi người trên hành trình chinh phục mục tiêu thể thao.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/20">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Eye className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Tầm nhìn</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    Trở thành thương hiệu thể thao được yêu thích nhất tại Việt Nam,
                                    nơi mà mỗi vận động viên - từ nghiệp dư đến chuyên nghiệp - đều
                                    tìm thấy sản phẩm phù hợp để phát huy tối đa tiềm năng.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 bg-muted/50">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Những giá trị định hướng mọi hoạt động và quyết định của chúng tôi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((value, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <value.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <CardTitle>{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{value.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl md:text-5xl font-bold">50+</p>
                            <p className="text-sm opacity-80 mt-2">Cửa hàng toàn quốc</p>
                        </div>
                        <div>
                            <p className="text-4xl md:text-5xl font-bold">500+</p>
                            <p className="text-sm opacity-80 mt-2">Nhân viên</p>
                        </div>
                        <div>
                            <p className="text-4xl md:text-5xl font-bold">10+</p>
                            <p className="text-sm opacity-80 mt-2">Năm kinh nghiệm</p>
                        </div>
                        <div>
                            <p className="text-4xl md:text-5xl font-bold">1M+</p>
                            <p className="text-sm opacity-80 mt-2">Khách hàng</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="py-16">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Đội ngũ lãnh đạo</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Những người dẫn dắt Phoenix với tầm nhìn và sự cam kết.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-muted rounded-full mb-4 flex items-center justify-center">
                                    <Users className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
