'use client';

import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JobCard } from '@/components/cards';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { PublicJobItem, jobTypeLabels } from '@/lib/schemas/recruitment';

// Mock data for filters, eventually could be from API
const jobTypes = Object.entries(jobTypeLabels).map(([value, label]) => ({ value, label }));

const workModes = [
    { value: 'ONSITE', label: 'Tại văn phòng' },
    { value: 'REMOTE', label: 'Từ xa' },
    { value: 'HYBRID', label: 'Hybrid' },
];

export default function CareersPage() {
    const [jobs, setJobs] = useState<PublicJobItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Derived filters from actual data
    const [departments, setDepartments] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);

    const [selectedDepartment, setSelectedDepartment] = useState('Tất cả');
    const [selectedLocation, setSelectedLocation] = useState('Tất cả');
    const [selectedType, setSelectedType] = useState('ALL');
    const [selectedWorkMode, setSelectedWorkMode] = useState('ALL');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/public/jobs');
                const data = await res.json();
                const fetchedJobs = data.data || [];
                setJobs(fetchedJobs);

                // Extract unique departments and locations for filters
                const uniqueDepts = Array.from(new Set(fetchedJobs.map((j: PublicJobItem) => j.department))).filter(Boolean) as string[];
                const uniqueLocs = Array.from(new Set(fetchedJobs.map((j: PublicJobItem) => j.location))).filter(Boolean) as string[];
                setDepartments(uniqueDepts.sort());
                setLocations(uniqueLocs.sort());
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
            const matchesDepartment = selectedDepartment === 'Tất cả' || job.department === selectedDepartment;
            const matchesLocation = selectedLocation === 'Tất cả' || job.location === selectedLocation;
            const matchesType = selectedType === 'ALL' || job.type === selectedType;
            const matchesWorkMode = selectedWorkMode === 'ALL' || job.workMode === selectedWorkMode;

            return matchesSearch && matchesDepartment && matchesLocation && matchesType && matchesWorkMode;
        });
    }, [jobs, search, selectedDepartment, selectedLocation, selectedType, selectedWorkMode]);

    const clearFilters = () => {
        setSearch('');
        setSelectedDepartment('Tất cả');
        setSelectedLocation('Tất cả');
        setSelectedType('ALL');
        setSelectedWorkMode('ALL');
    };

    const hasActiveFilters = search || selectedDepartment !== 'Tất cả' || selectedLocation !== 'Tất cả' ||
        selectedType !== 'ALL' || selectedWorkMode !== 'ALL';

    return (
        <>
            {/* Hero Section */}
            <section className="bg-linear-to-br from-primary/5 via-background to-background py-12 md:py-16">
                <div className="container text-center">
                    <Badge variant="secondary" className="mb-4">
                        🔥 {loading ? '...' : jobs.length} vị trí đang tuyển
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Cơ hội nghề nghiệp tại Phoenix
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Tìm kiếm vị trí phù hợp và bắt đầu hành trình sự nghiệp cùng chúng tôi.
                    </p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="py-8 border-b">
                <div className="container">
                    {/* Search Bar */}
                    <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm vị trí..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Bộ lọc
                            {hasActiveFilters && (
                                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    !
                                </Badge>
                            )}
                        </Button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <Card className="mt-4">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Department */}
                                    <div className="space-y-2">
                                        <Label>Phòng ban</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant={selectedDepartment === 'Tất cả' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedDepartment('Tất cả')}
                                            >
                                                Tất cả
                                            </Button>
                                            {departments.map((dept) => (
                                                <Button
                                                    key={dept}
                                                    variant={selectedDepartment === dept ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setSelectedDepartment(dept)}
                                                >
                                                    {dept}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <Label>Địa điểm</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant={selectedLocation === 'Tất cả' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedLocation('Tất cả')}
                                            >
                                                Tất cả
                                            </Button>
                                            {locations.map((loc) => (
                                                <Button
                                                    key={loc}
                                                    variant={selectedLocation === loc ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setSelectedLocation(loc)}
                                                >
                                                    {loc}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Job Type */}
                                    <div className="space-y-2">
                                        <Label>Loại hình</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant={selectedType === 'ALL' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedType('ALL')}
                                            >
                                                Tất cả
                                            </Button>
                                            {jobTypes.map((type) => (
                                                <Button
                                                    key={type.value}
                                                    variant={selectedType === type.value ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setSelectedType(type.value)}
                                                >
                                                    {type.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Work Mode */}
                                    <div className="space-y-2">
                                        <Label>Hình thức</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant={selectedWorkMode === 'ALL' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedWorkMode('ALL')}
                                            >
                                                Tất cả
                                            </Button>
                                            {workModes.map((mode) => (
                                                <Button
                                                    key={mode.value}
                                                    variant={selectedWorkMode === mode.value ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setSelectedWorkMode(mode.value)}
                                                >
                                                    {mode.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {hasActiveFilters && (
                                    <div className="mt-4 pt-4 border-t flex justify-end">
                                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                                            <X className="h-4 w-4" />
                                            Xóa bộ lọc
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-12">
                <div className="container">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-muted-foreground">
                            Hiển thị <span className="font-medium text-foreground">{filteredJobs.length}</span> vị trí
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">Không tìm thấy vị trí phù hợp.</p>
                            <Button variant="link" onClick={clearFilters} className="mt-2">
                                Xóa bộ lọc và thử lại
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
