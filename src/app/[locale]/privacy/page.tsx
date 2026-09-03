import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generatePrivacyMetadata } from '@/lib/seo';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/JsonLd';
import PrivacyPageClient from './PrivacyPageClient';
import { siteConfig } from '@/config/site';
import { getBasePath } from '@/lib/utils/path';

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

  return generatePrivacyMetadata(validLocale, {
    title: t('privacy.title'),
    description: t('privacy.description'),
  });
}

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale: locale as Locale, namespace: 'metadata' });
  const basePath = getBasePath();
  const cleanBasePath = basePath.replace(/\/$/, '');
  const url = `${siteConfig.url}${cleanBasePath}/${locale}/privacy/`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('privacy.title') || 'Privacy Policy',
    description: t('privacy.description') || 'Privacy Policy for SPVN Tech PDF Tools',
    url,
  };

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', path: '' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    locale as Locale
  );

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <PrivacyPageClient locale={locale as Locale} />
    </>
  );
}
