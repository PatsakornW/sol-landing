import type { MetadataRoute } from 'next';

/* A static export writes this once at build time; the route has to say so. */
export const dynamic = 'force-static';
import { AppConfig } from '@/configs/configs';
import { REVISIONS } from '@/lib/revisions';

/** The two designs, which is every page this site has. */
export default function sitemap(): MetadataRoute.Sitemap {
  return REVISIONS.map((revision, index) => ({
    url: `${AppConfig.baseUrl}${revision.path}`,
    changeFrequency: 'weekly' as const,
    priority: index === 0 ? 1 : 0.7,
  }));
}
