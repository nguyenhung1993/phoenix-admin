import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Heart, Target, Briefcase } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Đang tuyển dụng
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Gia nhập đội ngũ
            <span className="text-primary block mt-2">Li-Ning Vietnam</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Khám phá cơ hội nghề nghiệp tại thương hiệu thể thao hàng đầu.
            Phát triển bản thân, tỏa sáng và chinh phục đỉnh cao cùng chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/careers">
                Xem vị trí đang tuyển
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Tìm hiểu về chúng tôi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tại sao chọn Li-Ning Vietnam?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi tin rằng mỗi cá nhân đều có tiềm năng vô hạn.
              Hãy để Li-Ning trở thành bệ phóng cho sự nghiệp của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Đội ngũ năng động</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Làm việc cùng những đồng nghiệp nhiệt huyết, sáng tạo và luôn sẵn sàng hỗ trợ nhau.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Phát triển bản thân</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cơ hội học hỏi, đào tạo liên tục và phát triển career path rõ ràng.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Phúc lợi hấp dẫn</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Mức lương cạnh tranh, bảo hiểm đầy đủ, và nhiều quyền lợi đặc biệt khác.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Thương hiệu quốc tế</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Làm việc cho thương hiệu thể thao hàng đầu thế giới với mạng lưới toàn cầu.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình mới?
          </h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">
            Khám phá các vị trí đang tuyển và gửi CV của bạn ngay hôm nay.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/careers">
              Xem tất cả vị trí
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
