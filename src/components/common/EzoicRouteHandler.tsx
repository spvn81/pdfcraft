'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { runEzoic } from '@/lib/ezoic';

export default function EzoicRouteHandler() {
  const pathname = usePathname();

  useEffect(() => {
    let frameId: number;

    runEzoic(() => {
      // Use requestAnimationFrame to safely queue the global ad request after React
      // has committed the new route's DOM.
      frameId = requestAnimationFrame(() => {
        if (typeof window.ezstandalone?.showAds === 'function') {
          // Request ads for newly rendered placeholders globally.
          // Note: We explicitly do NOT call destroyPlaceholders() here,
          // as that would destroy persistent layout advertisements.
          // Individual placeholders handle their own destruction on unmount.
          window.ezstandalone.showAds();
        }
      });
    });

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [pathname]);

  return null;
}
