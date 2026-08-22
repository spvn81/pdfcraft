/**
 * Utility to handle basePath for subpath deployments.
 * Next.js handles basePath for Link and Image, but manual fetch calls need this.
 */

export const BASE_PATH = '/pdf-tools';

export function withBasePath(path: string): string {
  if (!path) return BASE_PATH;
  if (path.startsWith('http') || path.startsWith('//')) return path;

  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) {
    return path;
  }

  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getBasePath(): string {
  return BASE_PATH;
}
