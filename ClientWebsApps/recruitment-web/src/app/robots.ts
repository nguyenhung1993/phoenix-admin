import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://phoenix-admin.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/portal/', '/api/', '/login', '/api/auth/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
