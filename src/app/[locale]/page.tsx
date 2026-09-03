import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import HomePageClient from './HomePageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { getBasePath } from '@/lib/utils/path';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get localized content for tools
  const { tools } = await import('@/config/tools');
  const { getToolContent } = await import('@/config/tool-content');

  const localizedToolContent = tools.reduce((acc, tool) => {
    const content = getToolContent(locale as Locale, tool.id);
    // Use metaDescription for the card description as it's short and summary-like
    // Use title from the content
    if (content) {
      acc[tool.id] = {
        title: content.title,
        description: content.metaDescription
      };
    }
    return acc;
  }, {} as Record<string, { title: string; description: string }>);

  const basePath = getBasePath();
  const cleanBasePath = basePath.replace(/\/$/, '');
  const url = `${siteConfig.url}${cleanBasePath}/${locale}/`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'SPVN Tech PDF Tools',
    description: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files.',
    url: url,
  };
  
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SPVN Tech PDF Tools',
    description: 'A suite of free, private, browser-based PDF tools.',
    url: url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <JsonLd data={[webPageSchema, softwareAppSchema]} />
      <HomePageClient locale={locale as Locale} localizedToolContent={localizedToolContent} />
    </>
  );
}
