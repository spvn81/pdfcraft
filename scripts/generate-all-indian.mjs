import { execSync } from 'child_process';

const indianLocales = ['te', 'hi', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'ur'];

console.log('Starting batch generation for Indian languages...');

for (const locale of indianLocales) {
  console.log(`\n======================================================`);
  console.log(`🚀 Processing locale: ${locale}`);
  console.log(`======================================================\n`);
  
  try {
    console.log(`[${locale}] Generating translations...`);
    execSync(`node scripts/generate-translations.mjs --locale ${locale}`, { stdio: 'inherit' });
    
    console.log(`\n[${locale}] Generating tool content...`);
    execSync(`node scripts/generate-tool-content.mjs --locale ${locale}`, { stdio: 'inherit' });
    
    console.log(`\n✅ Successfully processed ${locale}`);
  } catch (error) {
    console.error(`\n❌ Error processing ${locale}:`, error.message);
    console.log('Continuing with the next locale...');
  }
}

console.log('\n🎉 All Indian languages processed!');
