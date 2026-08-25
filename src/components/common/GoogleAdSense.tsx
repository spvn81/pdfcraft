'use client';

import { useEffect, useState } from 'react';

interface GoogleAdSenseProps {
  slotId?: string;
  client?: string;
  layoutKey?: string;
  format?: string;
  className?: string;
}

export function GoogleAdSense({
  slotId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_ID || "1108330390",
  client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-5961281650555057",
  layoutKey = "-fe-f+2h-5z+6n",
  format = "fluid",
  className = "my-6",
}: GoogleAdSenseProps = {}) {
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
    <div key={`google-ad-sense-${slotId}`} className={className}>
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format={format}
        data-ad-layout-key={layoutKey}
        data-ad-client={client}
        data-ad-slot={slotId} />
    </div>
  );
}
