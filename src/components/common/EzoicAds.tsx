'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      showAds: (placeholders?: Record<string, unknown> | number, ...args: number[]) => void;
      destroyPlaceholders?: (...args: number[]) => void;
      destroyAll?: () => void;
    };
  }
}

export function EzoicAds() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ezstandalone && window.ezstandalone.cmd) {
      window.ezstandalone.cmd.push(function () {
        try {
          if (window.ezstandalone && typeof window.ezstandalone.showAds === 'function') {
            window.ezstandalone.showAds();
          }
        } catch (error) {
          console.error('[EzoicAds] Failed to show ads:', error);
        }
      });
    }
  }, [pathname]);

  return null;
}
