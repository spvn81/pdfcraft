const fs = require('fs');

const path = 'D:/pdfcraft/src/config/tool-content/en.ts';
let content = fs.readFileSync(path, 'utf8');

const h1Updates = {
  'merge-pdf': 'Merge PDF Files',
  'compress-pdf': 'Compress PDF Files',
  'jpg-to-pdf': 'JPG to PDF Converter',
  'pdf-to-jpg': 'PDF to JPG Converter',
  'word-to-pdf': 'Word to PDF Converter',
  'pdf-to-docx': 'PDF to Word Converter'
};

for (const [id, h1] of Object.entries(h1Updates)) {
  const blockStart = "'" + id + "': {";
  const startIndex = content.indexOf(blockStart);
  if (startIndex === -1) {
    console.log('Skipping ' + id);
    continue;
  }
  
  // Find title line
  const titleIndex = content.indexOf('title:', startIndex);
  if (titleIndex === -1) {
      continue;
  }
  const endOfTitleLine = content.indexOf(',', titleIndex);
  
  const block = content.substring(titleIndex, endOfTitleLine + 1);
  if (!content.substring(startIndex, startIndex + 500).includes('h1:')) {
       const newBlock = block + "\\r\\n    h1: '" + h1 + "',";
       content = content.substring(0, titleIndex) + newBlock + content.substring(endOfTitleLine + 1);
       console.log('Updated ' + id);
  } else {
       console.log('Already updated ' + id);
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
