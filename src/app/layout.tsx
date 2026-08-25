import type { Metadata } from 'next';
import Script from 'next/script';
// import EzoicRouteHandler from '@/components/common/EzoicRouteHandler';
import '@/app/globals.css';

import { BASE_PATH } from '@/lib/utils/path';
import { GoogleAdSense } from '@/components/common/GoogleAdSense';

export const metadata: Metadata = {
  title: 'SPVN Tech PDF Tools - Professional PDF Tools',
  description: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files. All processing happens in your browser for maximum privacy.',
  icons: {
    icon: `${BASE_PATH}/favicon.svg`,
    shortcut: `${BASE_PATH}/favicon.svg`,
    apple: `${BASE_PATH}/favicon.svg`,
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
        {/* Temporarily disabled Google AdSense */}
        {/* <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5961281650555057" crossOrigin="anonymous" /> */}


        {/* Ezoic Privacy Scripts */}
        {/*
        <Script
          id="ezoic-cmp"
          src="https://cmp.gatekeeperconsent.com/min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />
        <Script
          id="ezoic-cmp-2"
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />
        */}

        {/* Ezoic Header Scripts */}
        {/*
        <Script async src="//www.ezojs.com/ezoic/sa.min.js" strategy="afterInteractive" />
        <Script strategy="afterInteractive">
          {\`
            window.ezstandalone = window.ezstandalone || {};
            window.ezstandalone.cmd = window.ezstandalone.cmd || [];
            \`}
        </Script>
        <Script src="//ezoicanalytics.com/analytics.js" strategy="afterInteractive" />
        */}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* <EzoicRouteHandler /> */}
        {/* Temporarily disabled Google AdSense */}
        {/* <GoogleAdSense /> */}
        {children}

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
