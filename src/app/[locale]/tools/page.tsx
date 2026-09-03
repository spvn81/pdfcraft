import type { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateToolsListMetadata } from '@/lib/seo';
import { generateCollectionPageSchema, generateItemListSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { getBasePath } from '@/lib/utils/path';
import ToolsPageClient from './ToolsPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  return generateToolsListMetadata(validLocale, {
    title: t('tools.title'),
    description: t('tools.description'),
  });
}

interface ToolsPageProps {
  params: Promise<{ locale: string }>;
}

function ToolsPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-[hsl(var(--color-muted-foreground))]">
        Loading...
      </div>
    </div>
  );
}

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get localized content for tools
  const { tools } = await import('@/config/tools');
  const { getToolContent } = await import('@/config/tool-content');

  const localizedToolContent = tools.reduce((acc, tool) => {
    const content = getToolContent(locale as Locale, tool.id);
    if (content) {
      acc[tool.id] = {
        title: content.title,
        description: content.metaDescription
      };
    }
    return acc;
  }, {} as Record<string, { title: string; description: string }>);

  const t = await getTranslations({ locale: locale as Locale, namespace: 'metadata' });
  const basePath = getBasePath();
  const cleanBasePath = basePath.replace(/\/$/, '');

  const collectionSchema = generateCollectionPageSchema(
    t('tools.title') || 'All PDF Tools',
    t('tools.description') || 'Browse all PDF tools.',
    '/tools',
    locale as Locale
  );

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', path: '' },
      { name: 'Tools', path: '/tools' },
    ],
    locale as Locale
  );

  const itemList = tools.map((tool) => ({
    name: localizedToolContent[tool.id]?.title || tool.id,
    description: localizedToolContent[tool.id]?.description,
    url: `${siteConfig.url}${cleanBasePath}/${locale}/tools/${tool.slug}/`,
  }));

  const itemListSchema = generateItemListSchema(itemList);

  // Note: searchParams are handled client-side in ToolsPageClient
  // because static export doesn't support server-side searchParams
  return (
    <>
      <JsonLd data={[collectionSchema, breadcrumbSchema, itemListSchema]} />
      <Suspense fallback={<ToolsPageFallback />}>
        <ToolsPageClient locale={locale as Locale} localizedToolContent={localizedToolContent} />
      </Suspense>
    </>
  );
}
