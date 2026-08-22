import fs from 'fs';
import path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const INDIAN_LOCALES = ['hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'ur'];
const LOCALES = ['en', 'ja', ...INDIAN_LOCALES];

const SAMPLE_KEYS = {
  'Home Title': 'metadata.home.title',
  'Home Desc': 'metadata.home.description',
  'Navigation (Home)': 'common.navigation.home',
  'Upload Button': 'common.buttons.upload',
  'Download Button': 'common.buttons.download',
  'Merge PDF': 'tools.merge-pdf.title',
  'Split PDF': 'tools.split-pdf.title',
  'Compress PDF': 'tools.compress-pdf.title',
  'OCR PDF': 'tools.ocr-pdf.title',
  'Privacy': 'common.navigation.privacy',
  'FAQ': 'common.navigation.faq',
  'Legal': 'common.navigation.legal'
};

function getNested(obj, pathStr) {
  return pathStr.split('.').reduce((o, k) => (o || {})[k], obj);
}

function generateSummary() {
  console.log('# Translation Review Summary\n');
  
  for (const locale of LOCALES) {
    const localePath = path.join(MESSAGES_DIR, `${locale}.json`);
    if (!fs.existsSync(localePath)) {
      console.log(`## Locale: ${locale.toUpperCase()} (File Missing)\n`);
      continue;
    }
    
    const data = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    
    console.log(`## Locale: ${locale.toUpperCase()}`);
    console.log('| Key | Translated Value |');
    console.log('|-----|------------------|');
    
    for (const [label, keyPath] of Object.entries(SAMPLE_KEYS)) {
      const val = getNested(data, keyPath);
      // Clean up newlines for markdown table
      const cleanVal = typeof val === 'string' ? val.replace(/\n/g, ' ') : String(val);
      console.log(`| **${label}** | ${cleanVal} |`);
    }
    console.log('\n');
  }
}

generateSummary();
