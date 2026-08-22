/**
 * Site configuration
 */
export const siteConfig = {
  name: 'SPVN Tech PDF Tools',
  description: 'Professional PDF Tools - Free, Private & Browser-Based. Merge, split, compress, convert, and edit PDF files online without uploading to servers.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://spvntech.in',
  ogImage: '/images/og-image.png',
  links: {
    github: '',
    twitter: '',
  },
  creator: 'SPVN Tech',
  keywords: [
    'PDF tools',
    'PDF editor',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'convert PDF',
    'free PDF tools',
    'online PDF editor',
    'browser-based PDF',
    'private PDF processing',
  ],
  // SEO-related settings
  seo: {
    titleTemplate: '%s | SPVN Tech PDF Tools',
    defaultTitle: 'SPVN Tech PDF Tools - Professional PDF Tools',
    twitterHandle: '',
    locale: 'en_US',
  },
};

/**
 * Navigation configuration
 */
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Tools', href: '/tools' },
    { title: 'FAQ', href: '/faq' },
  ],
  footerNav: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Contact', href: '/contact' },
  ],
};
