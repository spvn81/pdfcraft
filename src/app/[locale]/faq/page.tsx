import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateFaqMetadata } from '@/lib/seo';
import { generateFAQPageSchema, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/JsonLd';
import FAQPageClient from './FAQPageClient';
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

  return generateFaqMetadata(validLocale, {
    title: t('faq.title'),
    description: t('faq.description'),
  });
}

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale: locale as Locale, namespace: 'faqPage' });
  const tCommon = await getTranslations({ locale: locale as Locale, namespace: 'common' });

  // Replicate the FAQ generation logic from the client to generate server-side JSON-LD
  const getCategoryFaqs = (categoryKey: string) => {
    const categoryMapping: Record<string, string[]> = {
      'general': ['whatIs', 'isFree', 'account'],
      'privacy': ['uploaded', 'safe', 'storage'],
      'features': ['operations', 'merge', 'images', 'edit'],
      'technical': ['browsers', 'sizeLimit', 'slow', 'offline'],
      'languages': ['supported', 'change']
    };

    const keys = categoryMapping[categoryKey] || [];
    return keys.map(key => ({
      question: t(`sections.${categoryKey}.${key}.question`),
      answer: t(`sections.${categoryKey}.${key}.answer`)
    }));
  };

  const faqs = [
    ...getCategoryFaqs('general'),
    ...getCategoryFaqs('privacy'),
    ...getCategoryFaqs('features'),
    ...getCategoryFaqs('technical'),
    ...getCategoryFaqs('languages'),
  ];

  const faqSchema = generateFAQPageSchema(faqs);
  
  const basePath = getBasePath();
  const cleanBasePath = basePath.replace(/\/$/, '');
  const url = `${siteConfig.url}${cleanBasePath}/${locale}/faq/`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title') || 'FAQ',
    description: t('subtitle', { brand: tCommon('brand') }) || 'Frequently Asked Questions',
    url,
  };

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', path: '' },
      { name: 'FAQ', path: '/faq' },
    ],
    locale as Locale
  );

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema]} />
      <FAQPageClient locale={locale as Locale} />
    </>
  );
}
