'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function EzoicAds() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run on the client and when Ezoic is available
    if (typeof window === 'undefined' || !window.ezstandalone || !window.ezstandalone.cmd) {
      return;
    }

    const ezstandalone = window.ezstandalone;

    // Use a short timeout to ensure React has fully mounted the new page's
    // DOM (including the <EzoicAdPlaceholder /> components) before Ezoic scans it.
    const timer = setTimeout(() => {
      ezstandalone.cmd.push(function () {
        try {
          // Clean up previous ads to prevent memory leaks during SPA navigation
          if (typeof ezstandalone.destroyAll === 'function' && ezstandalone.hasDisplayedAds) {
            ezstandalone.destroyAll();
          }

          // Re-initialize Ezoic to detect placeholders on the new route
          if (typeof ezstandalone.init === 'function') {
            ezstandalone.init();
          }

          // Show ads in the detected placeholders
          if (typeof ezstandalone.showAds === 'function') {
            ezstandalone.showAds();
            ezstandalone.hasDisplayedAds = true;
          }
        } catch (error) {
          console.error('[EzoicAds] Failed to process ads on route change:', error);
        }
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
