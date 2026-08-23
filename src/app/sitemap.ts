/**
 * Sitemap Generation
 * Generates sitemap.xml for all pages across all supported locales
 * 
 * Source of truth:
 * - Tools: getAllTools() from @/config/tools (auto-excludes disabled tools)
 * - Locales: SITEMAP_LOCALES below (subset of i18n locales approved for indexing)
 * - Categories: TOOL_CATEGORIES from @/types/tool
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAllTools } from '@/config/tools';
import { TOOL_CATEGORIES } from '@/types/tool';
import { getBasePath } from '@/lib/utils/path';

// Required for static export
export const dynamic = 'force-static';

const basePath = getBasePath();
const cleanBasePath = basePath.replace(/\/$/, '');

/**
 * Locales included in the sitemap.
 * This is intentionally a curated subset of the full i18n locale list.
 * Only locales that are publicly indexed and fully supported are included.
 */
const SITEMAP_LOCALES = [
  'en', 'ja', 'ko', 'es', 'fr', 'de', 'zh', 'zh-TW', 'pt', 'ar',
  'it', 'id', 'vi', 'ro', 'hi', 'te', 'ta', 'kn', 'ml', 'bn',
  'mr', 'gu', 'pa', 'or', 'ur'
] as const;

type SitemapLocale = (typeof SITEMAP_LOCALES)[number];

/**
 * Priority values for different page types
 */
const PRIORITY = {
  root: 1.0,
  home: 1.0,
  tools: 0.9,
  toolPage: 0.8,
  category: 0.7,
  static: 0.6,
} as const;

/**
 * Change frequency for different page types
 */
const CHANGE_FREQUENCY = {
  root: 'daily',
  home: 'daily',
  tools: 'weekly',
  toolPage: 'weekly',
  category: 'weekly',
  static: 'monthly',
} as const;

/**
 * Static pages that exist for each locale
 */
const STATIC_PAGES = [
  { path: '', priority: PRIORITY.home, changeFrequency: CHANGE_FREQUENCY.home },
  { path: '/tools', priority: PRIORITY.tools, changeFrequency: CHANGE_FREQUENCY.tools },
  { path: '/faq', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/privacy', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/contact', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/legal', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
];

/**
 * Build a canonical sitemap URL with trailing slash.
 * basePath (e.g. /pdf-tools) is prepended from the env-driven cleanBasePath.
 * The siteConfig.url provides the host (https://spvntech.in).
 */
function buildUrl(path: string): string {
  // Ensure trailing slash for consistency with next.config trailingSlash: true
  const normalized = path.endsWith('/') ? path : `${path}/`;
  return `${siteConfig.url}${cleanBasePath}${normalized}`;
}

/**
 * Generate sitemap entries for a specific locale
 */
function generateLocaleEntries(locale: SitemapLocale, lastModified: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  
  // Static pages (home, tools index, faq, privacy, contact, legal)
  for (const page of STATIC_PAGES) {
    entries.push({
      url: buildUrl(`/${locale}${page.path}`),
      lastModified,
      changeFrequency: page.changeFrequency as 'daily' | 'weekly' | 'monthly',
      priority: page.priority,
    });
  }
  
  // Tool pages — dynamically discovered from the tool registry
  const tools = getAllTools();
  for (const tool of tools) {
    entries.push({
      url: buildUrl(`/${locale}/tools/${tool.slug}`),
      lastModified,
      changeFrequency: CHANGE_FREQUENCY.toolPage,
      priority: PRIORITY.toolPage,
    });
  }

  // Category pages
  for (const category of TOOL_CATEGORIES) {
    entries.push({
      url: buildUrl(`/${locale}/tools/category/${category}`),
      lastModified,
      changeFrequency: CHANGE_FREQUENCY.category,
      priority: PRIORITY.category,
    });
  }
  
  return entries;
}

/**
 * Generate the complete sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];

  // Root landing page: /pdf-tools/
  allEntries.push({
    url: buildUrl('/'),
    lastModified,
    changeFrequency: CHANGE_FREQUENCY.root as 'daily',
    priority: PRIORITY.root,
  });
  
  // Generate entries for each supported locale
  for (const locale of SITEMAP_LOCALES) {
    const localeEntries = generateLocaleEntries(locale, lastModified);
    allEntries.push(...localeEntries);
  }
  
  return allEntries;
}

/**
 * Get total number of URLs in sitemap
 * Useful for testing and validation
 */
export function getSitemapUrlCount(): number {
  const tools = getAllTools();
  const staticPagesCount = STATIC_PAGES.length;
  const toolPagesCount = tools.length;
  const categoryPagesCount = TOOL_CATEGORIES.length;
  const localesCount = SITEMAP_LOCALES.length;
  
  // 1 root page + (static + tools + categories) * locales
  return 1 + (staticPagesCount + toolPagesCount + categoryPagesCount) * localesCount;
}
