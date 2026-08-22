import fs from 'fs';
import path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const EN_LOCALE = 'en';
const INDIAN_LOCALES = ['hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'ur'];
// The user requested validation specifically for these locales
const ALL_LOCALES = [EN_LOCALE, ...INDIAN_LOCALES];

// Utility to recursively flatten a JSON object into a Map of key paths -> values
function flattenObject(obj, prefix = '') {
  let flat = new Map();
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nested = flattenObject(value, newKey);
      for (const [nKey, nValue] of nested) {
        flat.set(nKey, nValue);
      }
    } else {
      flat.set(newKey, value);
    }
  }
  return flat;
}

// Extract placeholders {name}
function extractPlaceholders(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{[^}]+\}/g);
  return matches ? [...new Set(matches)].sort() : [];
}

// Extract HTML/React tags like <br/>, <Heart />, <strong>, </strong>
function extractTags(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/<\/?[a-zA-Z0-9]+[^>]*>/g);
  return matches ? [...new Set(matches)].sort() : [];
}

const ALLOWED_IDENTICAL_TERMS = new Set([
  'PDF', 'OCR', 'API', 'JSON', 'HTML', 'CSS', 'JavaScript', 'ZIP'
]);

function isTechnicalOrAllowed(text) {
  if (ALLOWED_IDENTICAL_TERMS.has(text)) return true;
  if (!Number.isNaN(Number(text))) return true;
  if (text.startsWith('http://') || text.startsWith('https://')) return true;
  if (/^\.[a-z0-9]+$/i.test(text)) return true;
  return false;
}

let hasErrors = false;

function validate() {
  console.log(`Validating translations...`);
  
  const enPath = path.join(MESSAGES_DIR, `${EN_LOCALE}.json`);
  let enData;
  try {
    enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  } catch (err) {
    console.error(`❌ Failed to read or parse canonical ${EN_LOCALE}.json: ${err.message}`);
    process.exit(1);
  }

  const enFlat = flattenObject(enData);
  console.log(`✅ Loaded canonical English translation with ${enFlat.size} keys.`);

  for (const locale of ALL_LOCALES) {
    if (locale === EN_LOCALE) continue;

    const localePath = path.join(MESSAGES_DIR, `${locale}.json`);
    let localeData;
    let localeFlat;
    
    try {
      if (!fs.existsSync(localePath)) {
        console.error(`❌ Locale file missing: ${locale}.json`);
        hasErrors = true;
        continue;
      }
      localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
      localeFlat = flattenObject(localeData);
    } catch (err) {
      console.error(`❌ Failed to read or parse ${locale}.json: ${err.message}`);
      hasErrors = true;
      continue;
    }

    let missingKeys = 0;
    let extraKeys = 0;
    let placeholderErrors = 0;
    let tagErrors = 0;
    let emptyErrors = 0;
    let bootstrapWarnings = 0;

    // Check against English
    for (const [key, enValue] of enFlat) {
      if (!localeFlat.has(key)) {
        console.error(`[${locale}] Missing key: ${key}`);
        missingKeys++;
        hasErrors = true;
        continue;
      }

      const localeValue = localeFlat.get(key);

      if (typeof localeValue === 'string' && localeValue.trim() === '') {
        console.error(`[${locale}] Empty value for key: ${key}`);
        emptyErrors++;
        hasErrors = true;
      }

      // Validate placeholders
      const enPlaceholders = extractPlaceholders(enValue);
      const locPlaceholders = extractPlaceholders(localeValue);
      if (enPlaceholders.join(',') !== locPlaceholders.join(',')) {
        console.error(`[${locale}] Placeholder mismatch at '${key}'. EN: ${enPlaceholders.join(',')}, LOC: ${locPlaceholders.join(',')}`);
        placeholderErrors++;
        hasErrors = true;
      }

      // Validate HTML tags
      const enTags = extractTags(enValue);
      const locTags = extractTags(localeValue);
      if (enTags.join(',') !== locTags.join(',')) {
        console.error(`[${locale}] Tag mismatch at '${key}'. EN: ${enTags.join(',')}, LOC: ${locTags.join(',')}`);
        tagErrors++;
        hasErrors = true;
      }
      
      // Detect obvious English bootstrap
      if (INDIAN_LOCALES.includes(locale)) {
        if (localeValue === enValue && !isTechnicalOrAllowed(enValue)) {
          // Warning instead of error so the build doesn't hard-crash while translations are pending
          // But it serves as an explicit detection as requested.
          bootstrapWarnings++;
        }
      }
    }

    // Check for extra keys
    for (const [key] of localeFlat) {
      if (!enFlat.has(key)) {
        console.error(`[${locale}] Extra key found: ${key}`);
        extraKeys++;
        hasErrors = true;
      }
    }

    if (missingKeys === 0 && extraKeys === 0 && placeholderErrors === 0 && tagErrors === 0 && emptyErrors === 0) {
      console.log(`✅ ${locale}: Perfect structural match (${localeFlat.size} keys). ${bootstrapWarnings > 0 ? `⚠️ ${bootstrapWarnings} untranslated bootstrap values.` : ''}`);
    } else {
      console.log(`❌ ${locale}: ${missingKeys} missing, ${extraKeys} extra, ${placeholderErrors} placeholder errs, ${tagErrors} tag errs, ${emptyErrors} empty, ${bootstrapWarnings} untranslated.`);
    }
  }

  if (hasErrors) {
    console.error(`\n❌ Translation validation failed.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 Translation validation passed successfully!`);
    process.exit(0);
  }
}

validate();
