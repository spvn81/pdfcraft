import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { Cache, IndicTrans2Provider, LANG_MAP, isTechnicalOrAllowed, extractPlaceholders, extractTags, flattenObj, unflattenObj } from './translation/utils.mjs';

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const EN_LOCALE = 'en';
const INDIAN_LOCALES = ['hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'ur'];

async function processTranslations(locales, resume = false) {
  const batchSize = parseInt(process.env.TRANSLATION_BATCH_SIZE || '32', 10);
  const cache = new Cache();
  
  console.log('Translation Provider: indictrans2');
  
  const provider = new IndicTrans2Provider();
  await provider.init();
  
  const enData = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, `${EN_LOCALE}.json`), 'utf8'));
  const flatEn = flattenObj(enData);
  
  for (const locale of locales) {
    console.log(`\n=== Processing Locale: ${locale} ===`);
    const localePath = path.join(MESSAGES_DIR, `${locale}.json`);
    
    let targetData = {};
    if (fs.existsSync(localePath)) {
      targetData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    }
    
    const flatTarget = flattenObj(targetData);
    const uniqueStrings = new Map();
    
    for (const [key, enValue] of Object.entries(flatEn)) {
      const targetValue = flatTarget[key];
      if (resume && targetValue !== undefined) {
        if (targetValue !== enValue) continue; 
        if (isTechnicalOrAllowed(enValue)) continue;
      }
      if (!uniqueStrings.has(enValue)) uniqueStrings.set(enValue, []);
      uniqueStrings.get(enValue).push(key);
    }
    
    const stringsToTranslate = Array.from(uniqueStrings.keys());
    console.log(`Found ${stringsToTranslate.length} unique strings to translate.`);
    
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
          for (const key of uniqueStrings.get(text)) flatTarget[key] = cached;
          successCount++;
        } else {
          itemsToTranslate.push({ key: text, text: text });
        }
      }
      
      if (itemsToTranslate.length === 0) {
        const newTargetData = unflattenObj(flatTarget);
        fs.writeFileSync(localePath, JSON.stringify(newTargetData, null, 2));
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
              for (const key of mappedKeys) flatTarget[key] = tgtText;
            } else {
              console.error(`⚠️ srcText not found in uniqueStrings: "${srcText}"`);
            }
            successCount++;
          }
          
          cache.save();
          const newTargetData = unflattenObj(flatTarget);
          fs.writeFileSync(localePath, JSON.stringify(newTargetData, null, 2));
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
    console.log(`Finished locale: ${locale}. Translated ${successCount}/${stringsToTranslate.length} unique strings.`);
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

processTranslations(localesToProcess, values.resume).catch(e => {
  console.error(e);
  process.exit(1);
});
