'use client';

import { useEffect, useRef, useState } from 'react';

export type AdFormat = 
  | '160x300'
  | '160x600'
  | '300x250'
  | '320x50'
  | '468x60'
  | '728x90'
  | 'native';

interface PublisherAdProps {
  format: AdFormat;
  className?: string;
}

const AD_CONFIGS: Record<Exclude<AdFormat, 'native'>, { key: string; width: number; height: number }> = {
  '160x300': { key: 'd14fc5609780cffc045ad91e43c6941f', width: 160, height: 300 },
  '160x600': { key: 'd0c5d54473dc597c119492eaad7112a5', width: 160, height: 600 },
  '300x250': { key: 'ca9256559b3a3adea203b5f9d065a4ba', width: 300, height: 250 },
  '320x50': { key: 'f2671a0962f1896a392d2c99fd2421ba', width: 320, height: 50 },
  '468x60': { key: '1a51cafeea6241dbcebeb7b6e85b063e', width: 468, height: 60 },
  '728x90': { key: '462cb48f160123a7266291ece2c78103', width: 728, height: 90 },
};

export function PublisherAd({ format, className = '' }: PublisherAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  // We only render ads on the client to avoid hydration mismatch
  useEffect(() => {
    setIsRendered(true);
  }, []);

  useEffect(() => {
    if (!isRendered || format !== 'native') return;

    // Native Banner specific injection
    // Ensures exactly one script execution for the container
    const scriptId = 'native-banner-script';
    
    // Check if another native banner script already exists on the page
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = 'https://pl31035586.profitableratecpmnetwork.com/e6efce44c8b7216385f49f87f70366ae/invoke.js';
    script.setAttribute('data-cfasync', 'false');

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup if the component unmounts
      if (containerRef.current && containerRef.current.contains(script)) {
        containerRef.current.removeChild(script);
      }
    };
  }, [isRendered, format]);

  if (!isRendered) {
    // Return empty placeholder with correct dimensions during SSR
    if (format === 'native') return <div className={`min-h-[100px] ${className}`} />;
    const config = AD_CONFIGS[format];
    return <div className={className} style={{ width: config.width, height: config.height }} />;
  }

  if (format === 'native') {
    return (
      <div className={`w-full flex justify-center ${className}`}>
        <div ref={containerRef}>
          <div id="container-e6efce44c8b7216385f49f87f70366ae"></div>
        </div>
      </div>
    );
  }

  const config = AD_CONFIGS[format];
  
  // Use srcDoc to perfectly isolate atOptions variables and prevent document.write issues
  const iframeHtml = `<!DOCTYPE html>
<html>
  <head>
    <style>body { margin: 0; padding: 0; overflow: hidden; background: transparent; }</style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '${config.key}',
        'format' : 'iframe',
        'height' : ${config.height},
        'width' : ${config.width},
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highrevenueformat.com/${config.key}/invoke.js"></script>
  </body>
</html>`;

  return (
    <div className={`flex justify-center overflow-hidden ${className}`}>
      <iframe
        title={`Ad ${format}`}
        width={config.width}
        height={config.height}
        srcDoc={iframeHtml}
        style={{ border: 'none', overflow: 'hidden' }}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      />
    </div>
  );
}
