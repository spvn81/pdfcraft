'use client';

import { useEffect, useState } from 'react';

export function GoogleAdSense() {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
    
    // Push the ad after a short delay to ensure the script is loaded
    const timeout = setTimeout(() => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error', e);
      }
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  // Return an empty div matching the ad height to prevent layout shift before hydration
  if (!isRendered) {
    return <div style={{ display: 'block', minHeight: '90px' }} />;
  }

  return (
    <div key="google-ad-sense">
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-fe-f+2h-5z+6n"
        data-ad-client="ca-pub-5961281650555057"
        data-ad-slot="1108330390" />
    </div>
  );
}
