'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdSenseProps {
  className?: string;
}

export function GoogleAdSense({ className = "my-6" }: GoogleAdSenseProps = {}) {
  const initialized = useRef(false);

  useEffect(() => {
    // We only want to push to adsbygoogle once per component mount
    if (!initialized.current) {
      initialized.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense initialization error', e);
      }
    }
  }, []);

  return (
    <div className={className}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-format="fluid"
           data-ad-layout-key="-feF-f+2h-5z+6n"
           data-ad-client="ca-pub-5961281650555057"
           data-ad-slot="1108330390"></ins>
    </div>
  );
}
