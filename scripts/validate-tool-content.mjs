import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const TOOL_CONTENT_DIR = path.join(process.cwd(), 'src', 'config', 'tool-content');
const INDIAN_LOCALES = ['hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'ur'];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseLocaleTs(locale) {
  const tsFile = path.join(TOOL_CONTENT_DIR, `${locale}.ts`);
  if (!fs.existsSync(tsFile)) return null;
  
  const code = fs.readFileSync(tsFile, 'utf8');
  let jsCode = code.replace(/import\s+.*?;/g, '');
  const varName = `toolContent${capitalizeFirstLetter(locale)}`;
  const regex = new RegExp(`export\\s+const\\s+${varName}\\s*:\\s*Record<string,\\s*ToolContent>\\s*=\\s*`);
  jsCode = jsCode.replace(regex, 'module.exports = ');
  
  const tempFile = path.join(TOOL_CONTENT_DIR, `.temp-val-${locale}.cjs`);
  fs.writeFileSync(tempFile, jsCode);
  
  try {
    delete require.cache[require.resolve(tempFile)];
    const obj = require(tempFile);
    fs.unlinkSync(tempFile);
    return obj;
  } catch (e) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    throw e;
  }
}

const ALLOWED_IDENTICAL_TERMS = new Set(['PDF', 'OCR', 'API', 'JSON', 'HTML', 'CSS', 'JavaScript', 'ZIP']);

function isTechnicalOrAllowed(text) {
  if (ALLOWED_IDENTICAL_TERMS.has(text)) return true;
  if (!Number.isNaN(Number(text))) return true;
  if (text.startsWith('http://') || text.startsWith('https://')) return true;
  return false;
}

function extractTranslatable(obj, prefix = '', res = {}) {
  const validKeys = new Set(['title', 'metaDescription', 'description', 'question', 'answer']);
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string' && validKeys.has(key)) {
      res[fullPath] = value;
    } else if (typeof value === 'object' && value !== null) {
      extractTranslatable(value, fullPath, res);
    }
  }
  return res;
}

function validate() {
  console.log('Validating tool content...');
  
  const enData = parseLocaleTs('en');
  if (!enData) {
    console.error('❌ Failed to load en.ts tool content.');
    process.exit(1);
  }
  const enFlat = extractTranslatable(enData);
  const enTools = Object.keys(enData);
  
  let hasErrors = false;
  
  for (const locale of INDIAN_LOCALES) {
    const localeData = parseLocaleTs(locale);
    
    if (!localeData) {
      console.error(`❌ [${locale}] Missing or invalid ${locale}.ts file.`);
      hasErrors = true;
      continue;
    }
    
    let missingTools = 0;
    let extraTools = 0;
    let bootstrapWarnings = 0;
    
    const localeTools = Object.keys(localeData);
    
    for (const t of enTools) {
      if (!localeTools.includes(t)) {
        console.error(`❌ [${locale}] Missing tool: ${t}`);
        missingTools++;
        hasErrors = true;
      }
    }
    
    for (const t of localeTools) {
      if (!enTools.includes(t)) {
        console.error(`❌ [${locale}] Extra tool found: ${t}`);
        extraTools++;
        hasErrors = true;
      }
    }
    
    const localeFlat = extractTranslatable(localeData);
    
    for (const [key, enValue] of Object.entries(enFlat)) {
      const locValue = localeFlat[key];
      if (locValue === undefined) {
        console.error(`❌ [${locale}] Missing string at path: ${key}`);
        hasErrors = true;
      } else if (locValue === enValue && !isTechnicalOrAllowed(enValue)) {
        bootstrapWarnings++;
      }
    }
    
    if (missingTools === 0 && extraTools === 0 && bootstrapWarnings === 0) {
      console.log(`✅ ${locale}: Perfect tool match.`);
    } else {
      console.log(`✅ ${locale}: Structural match. ⚠️ ${bootstrapWarnings} untranslated bootstrap strings.`);
    }
  }
  
  if (hasErrors) {
    console.error(`\n❌ Tool content validation failed.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 Tool content validation passed successfully!`);
  }
}

validate();
