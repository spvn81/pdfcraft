import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateContactMetadata } from '@/lib/seo';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/JsonLd';
import ContactPageClient from './ContactPageClient';
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

  return generateContactMetadata(validLocale, {
    title: t('contact.title'),
    description: t('contact.description'),
  });
}

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale: locale as Locale, namespace: 'metadata' });
  const basePath = getBasePath();
  const cleanBasePath = basePath.replace(/\/$/, '');
  const url = `${siteConfig.url}${cleanBasePath}/${locale}/contact/`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('contact.title') || 'Contact Us',
    description: t('contact.description') || 'Contact SPVN Tech PDF Tools',
    url,
  };

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', path: '' },
      { name: 'Contact', path: '/contact' },
    ],
    locale as Locale
  );

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <ContactPageClient locale={locale as Locale} />
    </>
  );
}
