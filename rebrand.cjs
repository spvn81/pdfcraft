const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\pdfcraft';
const includeDirs = [
  'messages',
  'src/config/tool-content',
  'extension'
];
const includeFiles = [
  'README.md',
  'DEPLOYMENT.md'
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Regex to find PDF Craft, PDFCraft, pdf-craft, pdf craft
  const regex = /pdf\s*[-]*\s*craft/ig;

  content = content.replace(regex, (match) => {
    // If it's all lowercase and no spaces/dashes, it might be a technical ID like pdfcraft_localstorage
    // We skip replacing it to be safe, except in README/DEPLOYMENT where we want to replace it.
    const isTechId = match === 'pdfcraft' || match === 'pdf-craft';
    const isMdFile = filePath.endsWith('.md');
    
    // In extension/manifest.json we might have a technical id? 
    // Wait, extension ID or URL might use pdfcraft.
    if (isTechId && !isMdFile) {
      return match;
    }

    return 'SPVN Tech';
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else {
      const ext = path.extname(file);
      if (['.json', '.ts', '.tsx', '.js', '.html', '.md'].includes(ext)) {
        replaceInFile(fullPath);
      }
    }
  }
}

for (const dir of includeDirs) {
  const fullPath = path.join(rootDir, dir);
  if (fs.existsSync(fullPath)) {
    processDir(fullPath);
  }
}

for (const file of includeFiles) {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    replaceInFile(fullPath);
  }
}

console.log('Rebranding script completed.');
