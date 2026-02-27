'use client';

import dynamic from 'next/dynamic';

export const DynamicBarChart = dynamic(() => import('@/components/admin/reports/charts').then(mod => mod.DynamicBarChart), {
    loading: () => <div className="h-[350px] flex items-center justify-center text-muted-foreground">Đang tải...</div>,
    ssr: false
});

export const DynamicLineChart = dynamic(() => import('@/components/admin/reports/charts').then(mod => mod.DynamicLineChart), {
    loading: () => <div className="h-[350px] flex items-center justify-center text-muted-foreground">Đang tải...</div>,
    ssr: false
});

export const DynamicPieChart = dynamic(() => import('@/components/admin/reports/charts').then(mod => mod.DynamicPieChart), {
    loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground">Đang tải...</div>,
    ssr: false
});
