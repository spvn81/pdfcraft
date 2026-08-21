import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';

const basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: 'SPVN Tech PDF Tools - Professional PDF Tools',
  description: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files. All processing happens in your browser for maximum privacy.',
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
    apple: `${basePath}/favicon.svg`,
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
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
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

        {/* Google AdSense */}
        <script
          id="adsbygoogle-init"
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5961281650555057"
        ></script>
      </body>
    </html>
  );
}
