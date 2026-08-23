'use client';

import { useEffect } from 'react';

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
 * Safe for SSR and Next.js App Router hydration.
 */
export function EzoicAdPlaceholder({ id, className, style }: EzoicAdPlaceholderProps) {
  useEffect(() => {
    // When this specific placeholder unmounts (e.g., during navigation),
    // cleanly destroy it in Ezoic to free resources and prevent memory leaks.
    // This allows persistent layout ads to remain unaffected.
    return () => {
      if (typeof window !== 'undefined' && window.ezstandalone && window.ezstandalone.cmd) {
        window.ezstandalone.cmd.push(() => {
          if (typeof window.ezstandalone!.destroyPlaceholders === 'function') {
            window.ezstandalone!.destroyPlaceholders(id);
          }
        });
      }
    };
  }, [id]);

  return (
    <div 
      id={`ezoic-pub-ad-placeholder-${id}`} 
      className={className} 
      style={style}
    />
  );
}
