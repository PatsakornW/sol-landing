import type { MetadataRoute } from 'next';

/* A static export writes this once at build time; the route has to say so. */
export const dynamic = 'force-static';
import { AppConfig } from '@/configs/configs';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${AppConfig.baseUrl}/sitemap.xml`,
  };
}
