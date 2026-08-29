'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export type AdVariant = 'display' | 'in-feed' | 'in-article' | 'new-in-article' | 'fluid' | 'autorelaxed' | 'multiplex';

interface GoogleAdProps {
  variant: AdVariant;
  className?: string;
}

const AD_CONFIGS = {
  'display': { slot: '6211361108', format: 'auto', fullWidthResponsive: true, style: { display: 'block', width: '100%' } },
  'in-feed': { slot: '1108330390', format: 'fluid', layoutKey: '-fe-f+2h-5z+6n', style: { display: 'block', width: '100%' } },
  'in-article': { slot: '1193898794', format: 'fluid', layout: 'in-article', style: { display: 'block', textAlign: 'center', width: '100%' } },
  'new-in-article': { slot: '9559930821', format: 'fluid', layout: 'in-article', style: { display: 'block', textAlign: 'center', width: '100%' } },
  'fluid': { slot: '2088634914', format: 'fluid', layoutKey: '-ef+6k-30-ac+ty', style: { display: 'block', width: '100%' } },
  'autorelaxed': { slot: '9775553248', format: 'autorelaxed', style: { display: 'block', width: '100%' } },
  'multiplex': { slot: '4957049834', format: 'autorelaxed', style: { display: 'block', width: '100%' } },
} as const;

export function GoogleAd({
  variant,
  className = '',
}: GoogleAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isPushed = useRef(false);

  const config = AD_CONFIGS[variant];

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Strict Mode duplicate protection for this component instance
    if (isPushed.current) return;
    
    // Safety check: ensure the DOM element exists and doesn't already have an ad
    const container = containerRef.current;
    if (!container) return;
    
    const insElement = container.querySelector('ins');
    if (!insElement) return;
    
    if (insElement.getAttribute('data-adsbygoogle-status') === 'done') return;
    if (insElement.innerHTML.trim() !== '') return;

    try {
      isPushed.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GoogleAd] Initialized slot=${config.slot} for path=${pathname}`);
      }
    } catch (error) {
      // Catch "All ins elements... already have ads in them" or similar
      console.warn(`[GoogleAd] Initialization error for slot ${config.slot} on path ${pathname}:`, error);
    }
  }, [pathname, config.slot]); // Re-run if path or slot changes

  return (
    <div 
      key={`${pathname}-${config.slot}`} // Force recreating the DOM node on navigation or slot change
      className={`w-full overflow-hidden flex justify-center items-center ${className}`} 
      ref={containerRef}
      aria-hidden="true"
    >
      <ins
        className="adsbygoogle"
        style={config.style as React.CSSProperties}
        data-ad-client="ca-pub-5961281650555057"
        data-ad-slot={config.slot}
        {...('format' in config && config.format ? { 'data-ad-format': config.format } : {})}
        {...('layoutKey' in config && config.layoutKey ? { 'data-ad-layout-key': config.layoutKey } : {})}
        {...('layout' in config && config.layout ? { 'data-ad-layout': config.layout } : {})}
        {...('fullWidthResponsive' in config && config.fullWidthResponsive !== undefined ? { 'data-full-width-responsive': config.fullWidthResponsive.toString() } : {})}
      />
    </div>
  );
}
