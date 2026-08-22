/**
 * Tool content exports for all languages
 * Requirements: 3.1 - Multi-language support
 */

export { toolContentEn } from './en';
export { toolContentJa } from './ja';
export { toolContentKo } from './ko';
export { toolContentEs } from './es';
export { toolContentFr } from './fr';
export { toolContentDe } from './de';
export { toolContentZh } from './zh';
export { toolContentZhTW } from './zh-TW';
export { toolContentPt } from './pt';
export { toolContentAr } from './ar';
export { toolContentIt } from './it';
export { toolContentId } from './id';
export { toolContentVn } from './vi';

import { toolContentEn } from './en';
import { toolContentJa } from './ja';
import { toolContentKo } from './ko';
import { toolContentEs } from './es';
import { toolContentFr } from './fr';
import { toolContentDe } from './de';
import { toolContentZh } from './zh';
import { toolContentZhTW } from './zh-TW';
import { toolContentPt } from './pt';
import { toolContentAr } from './ar';
import { toolContentIt } from './it';
import { toolContentId } from './id';
import { toolContentVn } from './vi';
import { toolContentHi } from './hi';
import { toolContentTe } from './te';
import { toolContentTa } from './ta';
import { toolContentKn } from './kn';
import { toolContentMl } from './ml';
import { toolContentBn } from './bn';
import { toolContentMr } from './mr';
import { toolContentGu } from './gu';
import { toolContentPa } from './pa';
import { toolContentOr } from './or';
import { toolContentUr } from './ur';
import { ToolContent } from '@/types/tool';

import type { Locale } from '@/lib/i18n/config';
export type { Locale };

/**
 * Get tool content for a specific locale
 * Falls back to English if translation not found
 * zh-TW falls back to zh (Simplified Chinese) content
 * ar falls back to en content for now
 */
export function getToolContent(locale: Locale, toolId: string): ToolContent | undefined {
  const contentMap: Record<string, Record<string, ToolContent>> = {
    en: toolContentEn,
    ja: toolContentJa,
    ko: toolContentKo,
    es: toolContentEs,
    fr: toolContentFr,
    de: toolContentDe,
    zh: toolContentZh,
    'zh-TW': toolContentZhTW,
    pt: toolContentPt,
    ar: toolContentAr,
    it: toolContentIt,
    id: toolContentId,
    vi: toolContentVn,
    ro: toolContentEn, // Fallback to English for Romanian tool content for now
    hi: toolContentHi,
    te: toolContentTe,
    ta: toolContentTa,
    kn: toolContentKn,
    ml: toolContentMl,
    bn: toolContentBn,
    mr: toolContentMr,
    gu: toolContentGu,
    pa: toolContentPa,
    or: toolContentOr,
    ur: toolContentUr,
  };

  const localeContent = contentMap[locale];
  if (localeContent && localeContent[toolId]) {
    return localeContent[toolId];
  }

  // Fallback to English
  return toolContentEn[toolId];
}

