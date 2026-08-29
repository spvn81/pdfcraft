'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  format?: 'auto' | 'fluid' | 'multiplex';
  slot: string;
  layoutKey?: string;
  layout?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function GoogleAd({
  format = 'auto',
  slot,
  layoutKey,
  layout,
  fullWidthResponsive,
  className = '',
  style,
}: GoogleAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lastInitializedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Strict Mode / Navigation duplicate protection
    if (lastInitializedPath.current === pathname) return;
    
    // Safety check: ensure the DOM element exists and doesn't already have an ad
    const container = containerRef.current;
    if (!container) return;
    
    const insElement = container.querySelector('ins');
    if (!insElement) return;
    
    if (insElement.getAttribute('data-adsbygoogle-status') === 'done') return;
    if (insElement.innerHTML.trim() !== '') return;

    try {
      lastInitializedPath.current = pathname;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GoogleAd] Initialized slot=${slot} for path=${pathname}`);
      }
    } catch (error) {
      // Catch "All ins elements... already have ads in them" or similar
      console.warn(`[GoogleAd] Initialization error for slot ${slot} on path ${pathname}:`, error);
    }
  }, [pathname, slot]); // Re-run if path or slot changes

  return (
    <div 
      key={pathname} // Force recreating the DOM node on navigation
      className={`w-full overflow-hidden flex justify-center items-center ${className}`} 
      ref={containerRef}
      aria-hidden="true"
    >
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', width: '100%' }}
        data-ad-client="ca-pub-5961281650555057"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(fullWidthResponsive !== undefined ? { 'data-full-width-responsive': fullWidthResponsive.toString() } : {})}
      />
    </div>
  );
}
