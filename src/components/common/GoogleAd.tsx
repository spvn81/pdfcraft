'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  className?: string;
}

export function GoogleAd({ className = '' }: GoogleAdProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const insElement = insRef.current;
    if (!insElement) return;

    // Check if this specific element has already been initialized
    if (insElement.getAttribute('data-ad-initialized') === 'true') return;
    if (insElement.getAttribute('data-adsbygoogle-status') === 'done') return;
    if (insElement.innerHTML.trim() !== '') return;

    try {
      insElement.setAttribute('data-ad-initialized', 'true');
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GoogleAd] Initialized for path=${pathname}`);
      }
    } catch (error) {
      console.warn(`[GoogleAd] Initialization error on path ${pathname}:`, error);
    }
  }, [pathname]);

  return (
    <div 
      key={pathname}
      className={`w-full overflow-hidden flex justify-center items-center ${className}`} 
      aria-hidden="true"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-5961281650555057"
        data-ad-slot="6934978931"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
