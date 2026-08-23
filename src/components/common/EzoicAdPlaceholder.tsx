'use client';

interface EzoicAdPlaceholderProps {
  /**
   * The placeholder ID provided by the Ezoic dashboard.
   */
  id: number;
  /**
   * Optional CSS classes for layout positioning (e.g., margins, centering).
   * Avoid setting fixed dimensions that might clip the ad.
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
  const placeholderId = `ezoic-pub-ad-placeholder-${id}`;

  return (
    <div 
      id={placeholderId} 
      className={className} 
      style={style}
      // Suppress hydration warning in case Ezoic scripts modify this element
      // before React hydration completes, though unlikely with ezstandalone.
      suppressHydrationWarning
    />
  );
}
