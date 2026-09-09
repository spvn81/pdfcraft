const fs = require('fs');

const path = 'D:/pdfcraft/src/config/tool-content/en.ts';
let content = fs.readFileSync(path, 'utf8');

const updates = {
  'jpg-to-pdf': {
    title: "JPG to PDF Converter Online | Free Image to PDF Tool | SPVN Tech",
    metaDescription: "Convert JPG, PNG, and other images to PDF online for free. Easily merge multiple images into a single PDF file with SPVN Tech.",
    keywords: ['jpg to pdf', 'image to pdf', 'jpg to pdf converter', 'image to pdf converter', 'merge jpg to pdf'],
    description: `
      <p>The JPG to PDF Converter transforms your images into professional PDF documents quickly and easily. Whether you have a single photo or multiple images, this free online tool creates perfectly formatted PDF files.</p>
      <p>You can combine multiple JPG, PNG, or other image files into a single PDF, arrange them in any order, and customize page size and orientation. The conversion preserves image quality while creating compact, easily shareable PDF files.</p>
      <p>All image to PDF conversion happens directly in your browser, ensuring your photos remain completely private and secure.</p>
    `,
    faq: [
      { question: 'How many images can I convert to PDF at once?', answer: 'You can convert and merge up to 100 JPG or PNG images into a single PDF document in one go.' },
      { question: 'Will my images lose quality?', answer: 'No, our JPG to PDF converter preserves the original quality and resolution of your images during the conversion process.' },
      { question: 'Are my photos secure?', answer: 'Yes, all processing happens locally in your browser. Your images are never uploaded to our servers, guaranteeing complete privacy.' }
    ]
  },
  'pdf-to-docx': {
    title: "PDF to Word Converter Online | Free PDF to DOCX | SPVN Tech",
    metaDescription: "Convert PDF to Word documents online for free. Accurately transform your PDFs into editable Word files with SPVN Tech.",
    keywords: ['pdf to word', 'pdf to word converter', 'convert pdf to docx', 'pdf to doc', 'editable pdf'],
    description: `
      <p>Our PDF to Word Converter accurately transforms your PDF documents into editable Microsoft Word (DOCX) files. The tool preserves the original layout, formatting, images, and text flow of your document.</p>
      <p>Easily edit your PDF content in Word without retyping. Perfect for contracts, reports, resumes, and any document where you need to make quick textual changes.</p>
      <p>All conversion happens locally in your browser using advanced WebAssembly technology, ensuring your sensitive documents never leave your device.</p>
    `,
    faq: [
      { question: 'Is the original formatting preserved when converting PDF to Word?', answer: 'Yes, the tool aims to preserve the layout, fonts, and images as closely as possible to the original PDF.' },
      { question: 'Can I convert scanned PDFs to Word?', answer: 'Currently, the tool extracts text from native PDFs. For scanned documents, you may need an OCR-enabled tool to recognize the text before editing.' },
      { question: 'Is my data safe during conversion?', answer: 'Absolutely. The conversion happens entirely on your device, meaning your files are never uploaded or stored on any external servers.' }
    ]
  },
  'pdf-to-jpg': {
    title: "PDF to JPG Converter Online | Convert PDF Pages to Images",
    metaDescription: "Convert PDF files to high-quality JPG images online for free. Extract images or convert entire PDF pages to pictures.",
    keywords: ['pdf to jpg', 'pdf to jpeg', 'convert pdf to image', 'extract pdf images', 'pdf to jpg converter'],
    description: `
      <p>The PDF to JPG Converter allows you to turn PDF document pages into high-quality JPG images effortlessly. You can extract all pages or select specific pages to convert, with customizable resolution and quality settings.</p>
      <p>This tool is perfect for extracting images from PDFs, creating page thumbnails, or converting documents into picture formats for web use and social media sharing.</p>
      <p>All PDF to image conversion happens securely within your browser, ensuring your documents remain completely private.</p>
    `,
    faq: [
      { question: 'What image quality settings are available?', answer: 'You can set the DPI (resolution) from 72 for web use up to 300 for high-quality printing, and adjust the JPEG quality from 1-100.' },
      { question: 'Can I extract images instead of converting the whole page?', answer: 'Yes, if you want to extract embedded images rather than rasterizing the entire page, you can use our dedicated Extract Images tool.' },
      { question: 'Is there a limit on the number of pages I can convert?', answer: 'You can convert documents of any length. However, converting very large PDFs to high-resolution JPGs may require more processing time and memory.' }
    ]
  },
  'merge-pdf': {
    title: "Merge PDF Online Free | Combine PDF Files | SPVN Tech",
    metaDescription: "Merge multiple PDF files online for free. Upload, reorder, and combine your PDFs into one document with SPVN Tech.",
    keywords: ['merge pdf', 'pdf merge', 'combine pdf', 'merge pdf online', 'join pdf'],
    description: `
      <p>Merge PDF allows you to combine multiple PDF documents into a single file quickly and easily. Whether you're consolidating reports, combining scanned documents, or assembling a presentation, this free online tool makes the process seamless.</p>
      <p>Simply upload your files, arrange them in your desired order using drag-and-drop, and merge them into one cohesive document. The tool preserves the quality of your original files and can optionally maintain bookmarks from each source document.</p>
      <p>All merging happens locally in your browser, ensuring complete privacy and security for your sensitive documents.</p>
    `,
    faq: [
      { question: 'How many PDF files can I merge at once?', answer: 'You can merge up to 100 PDF files at once, with a total combined size of up to 500MB.' },
      { question: 'Can I rearrange PDF files before merging?', answer: 'Yes, after uploading your files, you can easily drag and drop the thumbnails to reorder them exactly how you want.' },
      { question: 'Can I merge password-protected PDFs?', answer: 'Password-protected PDFs need to be decrypted first. Use our Decrypt PDF tool to remove the password before merging.' }
    ]
  },
  'compress-pdf': {
    title: "Compress PDF Online | Reduce PDF Size Free | SPVN Tech",
    metaDescription: "Compress PDF files online to reduce file size without losing quality. Free PDF compressor tool by SPVN Tech.",
    keywords: ['compress pdf', 'pdf compressor', 'pdf size reducer', 'reduce pdf size', 'compress pdf online'],
    description: `
      <p>Our Compress PDF tool allows you to significantly reduce your PDF file size while maintaining excellent document quality. It's the perfect solution when you need to send large documents via email or upload them to web portals with strict size limits.</p>
      <p>Choose from multiple compression levels to find the perfect balance between file size and quality. The tool optimizes images and removes unnecessary metadata to shrink your files as much as possible.</p>
      <p>Like all our tools, the PDF compressor runs entirely in your browser, meaning your private documents are never uploaded to external servers.</p>
    `,
    faq: [
      { question: 'How much can I reduce the PDF file size?', answer: 'Compression results vary based on the PDF content. Image-heavy PDFs can often be reduced by 50-80%, while text-only PDFs may see smaller reductions.' },
      { question: 'Will compressing my PDF reduce its quality?', answer: 'You can choose the compression level. Low compression maintains the highest quality, while high compression significantly reduces the file size but may slightly reduce image clarity.' },
      { question: 'Is there a limit on the file size I can compress?', answer: 'You can compress PDF files up to 500MB in size directly within your browser.' }
    ]
  },
  'word-to-pdf': {
    title: "Word to PDF Converter Online | Convert DOCX to PDF",
    metaDescription: "Convert Word documents (DOCX) to PDF online for free. Preserve formatting and layout in your converted documents.",
    keywords: ['word to pdf', 'word to pdf converter', 'docx to pdf', 'convert word to pdf', 'microsoft word to pdf'],
    description: `
      <p>The Word to PDF Converter allows you to transform Microsoft Word documents into PDF format while flawlessly preserving the original formatting, layout, and content structure.</p>
      <p>Upload your DOCX files and instantly get high-quality PDF output suitable for sharing, printing, or archiving. The conversion maintains text formatting, paragraph styles, and basic document structure without any changes.</p>
      <p>All conversion happens locally in your browser, ensuring your documents remain completely private and secure without being uploaded to any servers.</p>
    `,
    faq: [
      { question: 'Is .doc format supported?', answer: 'Currently only .docx format is supported. Please convert .doc files to .docx first using Microsoft Word or LibreOffice.' },
      { question: 'Will my fonts and layout change after conversion?', answer: 'No, the converter is designed to strictly preserve your original layout, fonts, and styling exactly as they appear in Word.' },
      { question: 'Can I convert multiple Word documents at once?', answer: 'Yes, you can upload and batch convert multiple Word documents to PDFs simultaneously.' }
    ]
  }
};

function escapeStr(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\\n/g, '\\n');
}

function escapeDesc(str) {
  return str.trim();
}

function replaceField(block, field, newValue) {
  let regex;
  if (field === 'keywords' || field === 'faq') {
    // Array fields
    regex = new RegExp(field + ":\\\\s*\\\\[[\\\\s\\\\S]*?\\\\],");
    return block.replace(regex, field + ': ' + JSON.stringify(newValue, null, 6) + ',');
  } else if (field === 'description') {
    // Description backticks
    regex = new RegExp(field + ":\\\\s*`[\\\\s\\\\S]*?`,");
    return block.replace(regex, field + ': \\`\\n' + escapeDesc(newValue) + '\\n      \\`,');
  } else {
    // String fields
    regex = new RegExp(field + ":\\\\s*(['\\"])[\\\\s\\\\S]*?\\\\1,");
    return block.replace(regex, field + ": '" + escapeStr(newValue) + "',");
  }
}

for (const [id, data] of Object.entries(updates)) {
  const blockStart = "'" + id + "': {";
  const startIndex = content.indexOf(blockStart);
  
  if (startIndex === -1) {
    console.error('Could not find block for ' + id);
    continue;
  }
  
  let endIndex = content.indexOf('\\n  },', startIndex);
  if (endIndex === -1) endIndex = content.indexOf('\\n  }', startIndex);
  
  if (endIndex === -1) {
    console.error('Could not find end of block for ' + id);
    continue;
  }
  
  let block = content.substring(startIndex, endIndex + 5);
  
  // Replace fields
  block = replaceField(block, 'title', data.title);
  block = replaceField(block, 'metaDescription', data.metaDescription);
  block = replaceField(block, 'keywords', data.keywords);
  block = replaceField(block, 'description', data.description);
  block = replaceField(block, 'faq', data.faq);
  
  // Put block back
  content = content.substring(0, startIndex) + block + content.substring(endIndex + 5);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated en.ts');
