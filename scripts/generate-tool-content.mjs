import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { parseArgs } from 'util';
import { Cache, IndicTrans2Provider, LANG_MAP, extractPlaceholders, extractTags } from './translation/utils.mjs';

const TOOL_CONTENT_DIR = path.join(process.cwd(), 'src', 'config', 'tool-content');
const INDIAN_LOCALES = ['hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'ur'];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseEnTs() {
  const code = fs.readFileSync(path.join(TOOL_CONTENT_DIR, 'en.ts'), 'utf8');
  let jsCode = code.replace(/import\s+.*?;/g, '');
  jsCode = jsCode.replace(/export\s+const\s+toolContentEn\s*:\s*Record<string,\s*ToolContent>\s*=\s*/, 'module.exports = ');
  
  const tempFile = path.join(TOOL_CONTENT_DIR, '.temp-en.cjs');
  fs.writeFileSync(tempFile, jsCode);
  delete require.cache[require.resolve(tempFile)];
  const obj = require(tempFile);
  fs.unlinkSync(tempFile);
  return obj;
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

function setNested(obj, pathStr, value) {
  const keys = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function formatAsTs(locale, dataObj) {
  const varName = `toolContent${capitalizeFirstLetter(locale)}`;
  let tsCode = `/**\n * ${capitalizeFirstLetter(locale)} tool content\n * Auto-generated via scripts/generate-tool-content.mjs\n */\n\n`;
  tsCode += `import { ToolContent } from '@/types/tool';\n\n`;
  tsCode += `export const ${varName}: Record<string, ToolContent> = ${JSON.stringify(dataObj, null, 2)};\n`;
  return tsCode;
}

async function generateToolContent(locales, resume = false) {
  const batchSize = parseInt(process.env.TRANSLATION_BATCH_SIZE || '32', 10);
  const cache = new Cache();
  
  console.log('Translation Provider: indictrans2');
  const provider = new IndicTrans2Provider();
  await provider.init();
  
  console.log('Parsing en.ts...');
  const enData = parseEnTs();
  const flatEn = extractTranslatable(enData);
  
  for (const locale of locales) {
    console.log(`\n=== Processing Tool Content: ${locale} ===`);
    const tsFile = path.join(TOOL_CONTENT_DIR, `${locale}.ts`);
    const tempFile = path.join(TOOL_CONTENT_DIR, `.temp-${locale}.cjs`);
    
    let targetData = JSON.parse(JSON.stringify(enData));
    let flatTarget = {};
    
    if (resume && fs.existsSync(tsFile)) {
      const code = fs.readFileSync(tsFile, 'utf8');
      let jsCode = code.replace(/import\s+.*?;/g, '');
      const varName = `toolContent${capitalizeFirstLetter(locale)}`;
      const regex = new RegExp(`export\\s+const\\s+${varName}\\s*:\\s*Record<string,\\s*ToolContent>\\s*=\\s*`);
      jsCode = jsCode.replace(regex, 'module.exports = ');
      fs.writeFileSync(tempFile, jsCode);
      try {
        delete require.cache[require.resolve(tempFile)];
        targetData = require(tempFile);
      } catch (e) {
        console.warn('Failed to parse existing locale file. Starting from en structure.');
      }
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
    
    flatTarget = extractTranslatable(targetData);
    const uniqueStrings = new Map();
    
    for (const [key, enValue] of Object.entries(flatEn)) {
      const targetValue = flatTarget[key];
      if (resume && targetValue !== undefined) {
        if (targetValue !== enValue) continue; 
      }
      if (!uniqueStrings.has(enValue)) uniqueStrings.set(enValue, []);
      uniqueStrings.get(enValue).push(key);
    }
    
    const stringsToTranslate = Array.from(uniqueStrings.keys());
    console.log(`Found ${stringsToTranslate.length} unique fields to translate.`);
    
    if (stringsToTranslate.length === 0) {
      console.log('Nothing to do for this locale.');
      continue;
    }
    
    let successCount = 0;
    const tgtLangCode = LANG_MAP[locale];
    if (!tgtLangCode) {
      console.error(`❌ No mapping found for locale ${locale}`);
      continue;
    }
    
    for (let i = 0; i < stringsToTranslate.length; i += batchSize) {
      const batchTexts = stringsToTranslate.slice(i, i + batchSize);
      const itemsToTranslate = [];
      
      for (const text of batchTexts) {
        const cached = cache.get(locale, text);
        if (cached) {
          for (const key of uniqueStrings.get(text)) setNested(targetData, key, cached);
          successCount++;
        } else {
          itemsToTranslate.push({ key: text, text: text });
        }
      }
      
      if (itemsToTranslate.length === 0) {
        fs.writeFileSync(tsFile, formatAsTs(locale, targetData));
        continue;
      }
      
      console.log(`Translating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(stringsToTranslate.length/batchSize)}...`);
      
      let attempt = 0;
      const maxRetries = 3;
      let success = false;
      
      while (attempt < maxRetries && !success) {
        try {
          const results = await provider.translateBatch(itemsToTranslate, 'eng_Latn', tgtLangCode);
          
          for (const item of results) {
            const srcText = item.key;
            const tgtText = item.text;
            
            if (extractPlaceholders(srcText).join(',') !== extractPlaceholders(tgtText).join(',')) {
              console.error(`❌ Placeholder mismatch for: "${srcText}" -> "${tgtText}"`);
              continue;
            }
            if (extractTags(srcText).join(',') !== extractTags(tgtText).join(',')) {
              console.error(`❌ Tag mismatch for: "${srcText}" -> "${tgtText}"`);
              continue;
            }
            
            cache.set(locale, srcText, tgtText);
            const mappedKeys = uniqueStrings.get(srcText);
            if (mappedKeys) {
              for (const key of mappedKeys) setNested(targetData, key, tgtText);
            } else {
              console.error(`⚠️ srcText not found in uniqueStrings: "${srcText}"`);
            }
            successCount++;
          }
          
          cache.save();
          fs.writeFileSync(tsFile, formatAsTs(locale, targetData));
          success = true;
          
        } catch (e) {
          attempt++;
          console.error(`Batch failed (Attempt ${attempt}/${maxRetries}): ${e.message}`);
          if (attempt >= maxRetries) {
            console.error('❌ Max retries reached for batch. Skipping.');
          }
        }
      }
    }
    console.log(`Finished tool content: ${locale}. Translated ${successCount}/${stringsToTranslate.length} unique fields.`);
  }
  
  provider.close();
}

const { values } = parseArgs({
  options: {
    locale: { type: 'string', short: 'l' },
    all: { type: 'boolean' },
    resume: { type: 'boolean', short: 'r' }
  },
  strict: false
});

let localesToProcess = values.locale ? [values.locale] : [];
if (values.all) localesToProcess = INDIAN_LOCALES;
if (localesToProcess.length === 0) {
  console.log("Please specify --locale <lang> or --all");
  process.exit(1);
}

generateToolContent(localesToProcess, values.resume).catch(e => {
  console.error(e);
  process.exit(1);
});
