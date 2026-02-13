import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Building2, ArrowRight } from 'lucide-react';
import { PublicJobItem, jobTypeLabels } from '@/lib/schemas/recruitment';
import { formatCurrency } from '@/lib/utils';

interface JobCardProps {
    job: PublicJobItem;
}

const workModeLabels: Record<string, string> = {
    ONSITE: 'Tại văn phòng',
    REMOTE: 'Từ xa',
    HYBRID: 'Hybrid',
};

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="group hover:shadow-lg transition-all hover:border-primary/50">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            <Link href={`/careers/${job.slug}`}>{job.title}</Link>
                        </CardTitle>
                        <CardDescription className="mt-1">{job.department}</CardDescription>
                    </div>
                    <Badge variant="secondary">{jobTypeLabels[job.type] || job.type}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {workModeLabels[job.workMode] || job.workMode}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)}
                        </span>
                    </div>

                    <div className="pt-2">
                        <Button variant="outline" size="sm" asChild className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Link href={`/careers/${job.slug}`}>
                                Xem chi tiết
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
