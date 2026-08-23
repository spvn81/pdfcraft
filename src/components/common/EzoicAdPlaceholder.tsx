'use client';

import { useEffect, useState } from 'react';
import { runEzoic } from '@/lib/ezoic';

interface EzoicAdPlaceholderProps {
  /**
   * The placeholder ID provided by the Ezoic dashboard.
   */
  id: number;
  /**
   * Optional CSS classes for layout positioning (e.g., margins, centering).
   */
  className?: string;
  /**
   * Optional inline styles.
   */
  style?: React.CSSProperties;
}

/**
 * Reusable Ezoic Ad Placeholder component.
 * Render this component wherever an ad should appear.
 * Uses client-side mounting to guarantee hydration safety.
 */
export function EzoicAdPlaceholder({ id, className, style }: EzoicAdPlaceholderProps) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);

    // Officially supported pattern to immediately request the ad for this slot
    runEzoic(() => {
      if (typeof window.ezstandalone?.showAds === 'function') {
        window.ezstandalone.showAds(id);
      }
    });

    // Clean up only this specific placeholder when the component unmounts.
    // This allows persistent layout ads to remain unaffected during navigation.
    return () => {
      runEzoic(() => {
        if (typeof window.ezstandalone?.destroyPlaceholders === 'function') {
          window.ezstandalone.destroyPlaceholders(id);
        }
      });
    };
  }, [id]);

  return (
    <div className={className} style={style}>
      {isRendered && <div id={`ezoic-pub-ad-placeholder-${id}`} />}
    </div>
  );
}
