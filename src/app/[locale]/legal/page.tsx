import { type Locale } from '@/lib/i18n/config';
import { generateBaseMetadata } from '@/lib/seo/metadata';
import LegalPageClient from './LegalPageClient';

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
  return <LegalPageClient locale={locale as Locale} />;
}
