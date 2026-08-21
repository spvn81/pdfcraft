/**
 * Web App Manifest Generation
 * Configures PWA settings for the application
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */

import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

// Required for static export
export const dynamic = 'force-static';

const basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'SPVN Tech PDF Tools',
    description: siteConfig.description,
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: `${basePath}/favicon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: `${basePath}/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${basePath}/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: `${basePath}/screenshots/home.png`,
        sizes: '1280x720',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Merge PDF',
        short_name: 'Merge',
        description: 'Combine multiple PDF files',
        url: `${basePath}/en/tools/merge-pdf`,
        icons: [{ src: `${basePath}/icons/merge.png`, sizes: '96x96' }],
      },
      {
        name: 'Split PDF',
        short_name: 'Split',
        description: 'Split PDF into multiple files',
        url: `${basePath}/en/tools/split-pdf`,
        icons: [{ src: `${basePath}/icons/split.png`, sizes: '96x96' }],
      },
      {
        name: 'Compress PDF',
        short_name: 'Compress',
        description: 'Reduce PDF file size',
        url: `${basePath}/en/tools/compress-pdf`,
        icons: [{ src: `${basePath}/icons/compress.png`, sizes: '96x96' }],
      },
    ],
  };
}
