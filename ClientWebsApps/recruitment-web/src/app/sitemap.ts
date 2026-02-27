import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://phoenix-admin.vercel.app';

    // Base routes that are statically available
    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/careers`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
    ];

    try {
        // Dynamic routes from published jobs
        const jobs = await prisma.job.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true },
        });

        const jobRoutes = jobs.map((job) => ({
            url: `${baseUrl}/careers/${job.slug}`,
            lastModified: job.updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }));

        return [...routes, ...jobRoutes];
    } catch (error) {
        console.error('Failed to generate sitemap for jobs:', error);
        return routes;
    }
}
