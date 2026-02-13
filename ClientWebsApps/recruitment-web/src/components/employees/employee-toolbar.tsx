'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Search, FileDown } from 'lucide-react';
import { useRef, useCallback } from 'react';

interface EmployeeToolbarProps {
    departments: { id: string; name: string }[];
    positions: { id: string; name: string }[];
}

export function EmployeeToolbar({ departments, positions }: EmployeeToolbarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }, [searchParams, pathname, replace]);

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            handleSearch(term);
        }, 500);
    };

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm nhân viên..."
                        className="w-full bg-background pl-8"
                        defaultValue={searchParams.get('q')?.toString()}
                        onChange={onSearchChange}
                    />
                </div>
                <Select
                    defaultValue={searchParams.get('dept') || 'all'}
                    onValueChange={(val) => handleFilter('dept', val)}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả phòng ban</SelectItem>
                        {departments.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                                {d.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    defaultValue={searchParams.get('pos') || 'all'}
                    onValueChange={(val) => handleFilter('pos', val)}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Chức vụ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả chức vụ</SelectItem>
                        {positions.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    <span className="hidden sm:inline">Xuất Excel</span>
                </Button>
                <Button asChild className="gap-2">
                    <Link href="/admin/employees/new">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Thêm nhân viên</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
