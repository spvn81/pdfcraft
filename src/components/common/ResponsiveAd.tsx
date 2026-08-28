'use client';

import { useState, useEffect } from 'react';
import { PublisherAd, AdFormat } from './PublisherAd';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export type AdPlacement = 'hero' | 'content' | 'sidebar';

interface ResponsiveAdProps {
  placement: AdPlacement;
  className?: string;
}

export function ResponsiveAd({ placement, className = '' }: ResponsiveAdProps) {
  // Prevent hydration mismatch by only rendering after client mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  // isMobile is implicitly anything under 768px

  if (!mounted) {
    // Return empty div with minimal height to prevent major layout shifts, 
    // but without initializing the ad script yet.
    return <div className={`min-h-[50px] w-full ${className}`} />;
  }

  let format: AdFormat;

  if (placement === 'hero') {
    if (isDesktop) format = '728x90';
    else if (isTablet) format = '468x60';
    else format = '320x50';
  } else if (placement === 'content') {
    if (isDesktop) format = '300x250'; // Alternatively 'native' could be injected here, but default to 300x250
    else if (isTablet) format = '300x250';
    else format = '320x50'; // 300x250 can sometimes be too wide on very narrow 320px screens, so defaulting to 320x50 for mobile content to be safe and avoid horizontal scroll.
  } else if (placement === 'sidebar') {
    if (isDesktop) format = '160x600';
    else format = '300x250'; // Should theoretically not be rendered as a sidebar on mobile, but fallback to 300x250
  } else {
    format = '320x50';
  }

  // Ensure 728x90 and 160x600/300 are never rendered on mobile
  if (!isDesktop && !isTablet && ((format as string) === '728x90' || (format as string) === '160x600' || (format as string) === '160x300')) {
    format = '320x50';
  }

  return (
    <div className={`flex justify-center w-full overflow-hidden ${className}`}>
      <PublisherAd format={format} />
    </div>
  );
}
