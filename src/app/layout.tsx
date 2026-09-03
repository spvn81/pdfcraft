import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';

import { BASE_PATH } from '@/lib/utils/path';

export const metadata: Metadata = {
  title: 'SPVN Tech PDF Tools - Professional PDF Tools',
  description: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files. All processing happens in your browser for maximum privacy.',
  icons: {
    icon: 'https://ik.imagekit.io/055kfcm3m/tpvn_tech_logo-removebg-preview.png?updatedAt=1720062820933',
    shortcut: 'https://ik.imagekit.io/055kfcm3m/tpvn_tech_logo-removebg-preview.png?updatedAt=1720062820933',
    apple: 'https://ik.imagekit.io/055kfcm3m/tpvn_tech_logo-removebg-preview.png?updatedAt=1720062820933',
  },
};

// Root layout - provides the basic HTML structure
// The actual layout with i18n is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <style dangerouslySetInnerHTML={{ __html: 'html{scrollbar-gutter:stable}' }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />

        {/* 
          Google AdSense Loader
          The script is loaded globally only once to prevent duplicate loading of adsbygoogle.js 
          across multiple ad components. This ensures better performance and avoids Core Web Vitals degradation.
        */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5961281650555057"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M5TZZCGR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {children}

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-M5TZZCGR');
            `,
          }}
        />

        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-L05YKLL1JN"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
            
              gtag('js', new Date());
            
              gtag('config', 'G-L05YKLL1JN');
            `,
          }}
        />

      </body>
    </html>
  );
}
