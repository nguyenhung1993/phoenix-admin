import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockJobs, mockCandidates } from '@/lib/mocks';
import { Briefcase, Users, UserCheck, Clock } from 'lucide-react';

export default function AdminDashboard() {
    const activeJobs = mockJobs.filter(j => j.status === 'PUBLISHED').length;
    const totalCandidates = mockCandidates.length;
    const newCandidates = mockCandidates.filter(c => c.status === 'NEW').length;
    const interviewCandidates = mockCandidates.filter(c => c.status === 'INTERVIEW').length;

    const stats = [
        {
            title: 'Vị trí đang tuyển',
            value: activeJobs,
            icon: Briefcase,
            color: 'text-blue-600 bg-blue-100',
        },
        {
            title: 'Tổng ứng viên',
            value: totalCandidates,
            icon: Users,
            color: 'text-purple-600 bg-purple-100',
        },
        {
            title: 'Ứng viên mới',
            value: newCandidates,
            icon: Clock,
            color: 'text-yellow-600 bg-yellow-100',
        },
        {
            title: 'Đợi phỏng vấn',
            value: interviewCandidates,
            icon: UserCheck,
            color: 'text-green-600 bg-green-100',
        },
    ];

    const recentCandidates = mockCandidates.slice(0, 5);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Tổng quan tuyển dụng</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Candidates */}
            <Card>
                <CardHeader>
                    <CardTitle>Ứng viên gần đây</CardTitle>
                    <CardDescription>5 ứng viên mới nhất</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentCandidates.map((candidate) => (
                            <div key={candidate.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div>
                                    <p className="font-medium">{candidate.name}</p>
                                    <p className="text-sm text-muted-foreground">{candidate.jobTitle}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${candidate.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                        candidate.status === 'INTERVIEW' ? 'bg-purple-100 text-purple-800' :
                                            candidate.status === 'OFFER' ? 'bg-green-100 text-green-800' :
                                                candidate.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {candidate.status === 'NEW' ? 'Mới' :
                                            candidate.status === 'INTERVIEW' ? 'Phỏng vấn' :
                                                candidate.status === 'OFFER' ? 'Đề xuất' :
                                                    candidate.status === 'REJECTED' ? 'Từ chối' : 'Đang xem'}
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(candidate.appliedDate).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
