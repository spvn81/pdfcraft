import { type Locale } from '@/lib/i18n/config';
import { generateBaseMetadata } from '@/lib/seo/metadata';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/JsonLd';
import LegalPageClient from './LegalPageClient';
import { siteConfig } from '@/config/site';
import { getBasePath } from '@/lib/utils/path';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return generateBaseMetadata({
    locale: locale as Locale,
    path: '/legal',
    title: 'Open Source & Legal Information',
    description: 'Open Source licenses, attributions, and source code availability for SPVN Tech PDF Tools.',
    keywords: ['open source', 'legal', 'license', 'AGPL', 'attribution'],
  });
}

export default async function LegalPage({ params }: Props) {
  const { locale } = await params;

  const basePath = getBasePath();
  const cleanBasePath = basePath.replace(/\/$/, '');
  const url = `${siteConfig.url}${cleanBasePath}/${locale}/legal/`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Open Source & Legal Information',
    description: 'Open Source licenses, attributions, and source code availability for SPVN Tech PDF Tools.',
    url,
  };

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', path: '' },
      { name: 'Legal', path: '/legal' },
    ],
    locale as Locale
  );

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <LegalPageClient locale={locale as Locale} />
    </>
  );
}
