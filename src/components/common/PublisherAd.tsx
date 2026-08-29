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

// Global queue to prevent atOptions collision when multiple ads load simultaneously
let isAdLoading = false;

interface QueueItem {
  id: string;
  isCancelled: () => boolean;
  execute: () => void;
}
const adQueue: QueueItem[] = [];

function processAdQueue() {
  if (isAdLoading || adQueue.length === 0) return;
  
  let nextAd: QueueItem | undefined;
  while (adQueue.length > 0) {
    const item = adQueue.shift();
    if (item && !item.isCancelled()) {
      nextAd = item;
      break;
    }
  }

  if (nextAd) {
    isAdLoading = true;
    nextAd.execute();
  }
}

export function PublisherAd({ format, className = '' }: PublisherAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  useEffect(() => {
    if (!isRendered) return;
    
    let active = true;
    const instanceId = Math.random().toString(36).substring(7);
    const dynamicScripts: HTMLScriptElement[] = [];

    if (format === 'native') {
      if (!containerRef.current) return;
      if (containerRef.current.dataset.loaded === 'true') return;
      containerRef.current.dataset.loaded = 'true';

      // We use an iframe to isolate the exact container ID and script execution,
      // allowing multiple native banners safely without duplicating IDs in the main document.
      // This satisfies the requirement to safely instantiate without changing the Adsterra ID.
      const iframe = document.createElement('iframe');
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100px'; 
      iframe.style.overflow = 'hidden';
      
      containerRef.current.appendChild(iframe);
      
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head><style>body { margin: 0; padding: 0; display: flex; justify-content: center; background: transparent; }</style></head>
          <body>
            <div id="container-e6efce44c8b7216385f49f87f70366ae"></div>
            <script async="async" data-cfasync="false" src="https://mittengulped.com/e6efce44c8b7216385f49f87f70366ae/invoke.js"></script>
          </body>
          </html>
        `);
        doc.close();
      }
      return () => {
        active = false;
        if (containerRef.current) {
          containerRef.current.dataset.loaded = 'false';
          containerRef.current.innerHTML = '';
        }
      };
    }

    // Standard Adsterra Banners
    if (!containerRef.current) return;
    if (containerRef.current.dataset.loaded === 'true') return;
    containerRef.current.dataset.loaded = 'true';

    const config = AD_CONFIGS[format];

    const loadAd = () => {
      if (!active) {
        isAdLoading = false;
        processAdQueue();
        return;
      }
      
      if (!containerRef.current) {
        isAdLoading = false;
        processAdQueue();
        return;
      }

      // 1. Assign correct configuration exactly before the script is appended and executed
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      `;

      // 2. Load the official invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `https://www.highrevenueformat.com/${config.key}/invoke.js`;
      
      dynamicScripts.push(confScript, invokeScript);

      const releaseQueue = () => {
        isAdLoading = false;
        processAdQueue();
      };

      // 3. Advance queue when script completely loads or fails
      invokeScript.onload = () => releaseQueue();
      invokeScript.onerror = () => releaseQueue();

      containerRef.current.appendChild(confScript);
      containerRef.current.appendChild(invokeScript);
    };

    adQueue.push({
      id: instanceId,
      isCancelled: () => !active,
      execute: loadAd
    });
    processAdQueue();
    
    return () => {
      active = false;
      // Clean up dynamically created scripts if they were appended to the DOM
      dynamicScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      // Reset container state for Strict Mode remount
      if (containerRef.current) {
        containerRef.current.dataset.loaded = 'false';
      }
    };

  }, [isRendered, format]);

  if (!isRendered) {
    if (format === 'native') return <div className={`min-h-[100px] ${className}`} />;
    const config = AD_CONFIGS[format];
    return <div className={className} style={{ width: config.width, height: config.height }} />;
  }

  if (format === 'native') {
    return (
      <div 
        className={`w-full flex justify-center overflow-hidden ${className}`} 
        ref={containerRef} 
      />
    );
  }

  const config = AD_CONFIGS[format];

  return (
    <div 
      className={`flex justify-center items-center overflow-hidden ${className}`}
      style={{ width: config.width, height: config.height, margin: '0 auto' }}
      ref={containerRef}
    />
  );
}
