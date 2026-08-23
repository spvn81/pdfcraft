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
    let frameId: number;

    // We use requestAnimationFrame to safely queue the ad request after React
    // has committed and the browser has painted the new route's DOM. 
    // This avoids arbitrary setTimeout delays and ensures any new
    // <EzoicAdPlaceholder /> components are present in the DOM for Ezoic to scan.
    frameId = requestAnimationFrame(() => {
      ezstandalone.cmd.push(function () {
        try {
          if (typeof ezstandalone.showAds === 'function') {
            // Request ads for newly rendered placeholders.
            // Note: We do NOT use destroyAll() here because it would destroy
            // persistent layout ads. EzoicAdPlaceholder handles its own cleanup.
            ezstandalone.showAds();
            ezstandalone.hasDisplayedAds = true;
          }
        } catch (error) {
          console.error('[EzoicAds] Failed to process ads on route change:', error);
        }
      });
    });

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [pathname, searchParams]);

  return null;
}
