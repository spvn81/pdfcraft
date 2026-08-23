/**
 * Robots.txt Generation
 * Configures crawling rules for search engines
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

import { getBasePath } from '@/lib/utils/path';

// Required for static export
export const dynamic = 'force-static';

const basePath = getBasePath();
const cleanBasePath = basePath.replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
        ],
      },
    ],
    sitemap: `${siteConfig.url}${cleanBasePath}/sitemap.xml`,
  };
}
