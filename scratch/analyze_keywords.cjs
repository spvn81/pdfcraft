const fs = require('fs');

const csv = fs.readFileSync('D:/pdfcraft/keyword-research.csv', 'utf8');
const lines = csv.split('\n').map(l => l.trim()).filter(l => l);

const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
const data = lines.slice(1).map(line => {
    // Basic CSV parse
    const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!match) return null;
    const values = match.map(v => v.replace(/^"|"$/g, ''));
    
    // Some lines might not match cleanly if they have empty commas
    const parts = line.split(',');
    return {
        keyword: parts[0].replace(/"/g, ''),
        volume: parseInt(parts[1].replace(/"/g, '')) || 0,
        cpc: parseFloat(parts[2].replace(/"/g, '')) || 0,
        competition: parseFloat(parts[3].replace(/"/g, '')) || 0,
        score: parseInt(parts[4].replace(/"/g, '')) || 0,
        intent: parts[5] ? parts[5].replace(/"/g, '') : 'informational'
    };
}).filter(Boolean);

data.sort((a, b) => b.volume - a.volume);

const availableTools = [
    'pdf-multi-tool', 'merge-pdf', 'split-pdf', 'compress-pdf', 'edit-pdf', 'jpg-to-pdf', 'sign-pdf', 'crop-pdf', 'extract-pages', 'organize-pdf', 'delete-pages', 'bookmark', 'table-of-contents', 'page-numbers', 'add-watermark', 'header-footer', 'invert-colors', 'background-color', 'text-color', 'add-stamps', 'remove-annotations', 'form-filler', 'form-creator', 'remove-blank-pages', 'image-to-pdf', 'png-to-pdf', 'webp-to-pdf', 'svg-to-pdf', 'bmp-to-pdf', 'heic-to-pdf', 'tiff-to-pdf', 'txt-to-pdf', 'json-to-pdf', 'psd-to-pdf', 'word-to-pdf', 'excel-to-pdf', 'pptx-to-pdf', 'xps-to-pdf', 'rtf-to-pdf', 'epub-to-pdf', 'mobi-to-pdf', 'djvu-to-pdf', 'fb2-to-pdf', 'pdf-to-jpg', 'pdf-to-png', 'pdf-to-webp', 'pdf-to-bmp', 'pdf-to-tiff', 'pdf-to-cbz', 'pdf-to-svg', 'pdf-to-greyscale', 'pdf-to-json', 'pdf-to-docx', 'pdf-to-pptx', 'pdf-to-excel', 'pdf-to-markdown', 'ocr-pdf', 'alternate-merge', 'add-attachments', 'extract-attachments', 'extract-images', 'edit-attachments', 'divide-pages', 'add-blank-page', 'reverse-pages', 'rotate-custom', 'rotate-pdf', 'overlay-pdf', 'add-page-labels', 'timestamp-pdf', 'n-up-pdf', 'grid-combine', 'combine-single-page', 'view-metadata', 'edit-metadata', 'pdf-to-zip', 'compare-pdfs', 'posterize-pdf', 'fix-page-size', 'linearize-pdf', 'page-dimensions', 'remove-restrictions', 'repair-pdf', 'encrypt-pdf', 'sanitize-pdf', 'find-and-redact', 'decrypt-pdf', 'flatten-pdf', 'remove-metadata', 'change-permissions', 'digital-sign-pdf', 'validate-signature', 'deskew-pdf', 'pdf-booklet', 'rasterize-pdf', 'markdown-to-pdf', 'email-to-pdf', 'cbz-to-pdf', 'pdf-to-pdfa', 'font-to-outline', 'extract-tables', 'ocg-manager', 'pdf-reader', 'ai-pdf-reflower', 'citation-linker', 'vector-extractor', 'deep-sanitize', 'booklet-folding-simulator', 'pdf-to-slide', 'form-logic-designer', 'eink-optimizer', 'cert-cryptor', 'passport-id-composer', 'annotation-exporter', 'batch-watermark-remover', 'smart-data-redactor', 'bookmarks-auto-generator', 'batch-barcode-injector', 'signature-ink-optimizer', 'dead-link-debugger', 'interactive-toc-generator', 'global-invoice-parser', 'pdf-deskew-aligner', 'pdf-two-column-reflower', 'pdf-page-resizer-uniform', 'handwriting-ink-contrast-booster', 'pdf-spine-bookbinder', 'pdf-signature-anchor-helper', 'pdf-lossless-slicer', 'pdf-scratchpad-canvas', 'photo-tiling-prepress'
];

const competitorBrands = ['ilovepdf', 'i love pdf', 'adobe', 'foxit', '11zon', 'sejda', 'pi7'];

// Exclude competitors from primary clustering unless specifically for comparisons
const isCompetitor = (kw) => competitorBrands.some(brand => kw.toLowerCase().includes(brand));

let mappings = {};
let clusters = {};
let articles = [];
let competitorsExcluded = [];

data.forEach(row => {
    let kw = row.keyword.toLowerCase();
    
    if (isCompetitor(kw)) {
        competitorsExcluded.push(row);
        return;
    }
    
    let matchedTool = null;
    
    // Heuristic matching based on the prompt's examples and names
    if (kw.includes('jpg to pdf') || kw.includes('image to pdf') || kw.includes('photo to pdf')) matchedTool = 'jpg-to-pdf';
    else if (kw.includes('pdf to word') || kw.includes('word to pdf converter offline')) matchedTool = 'pdf-to-docx';
    else if (kw.includes('word to pdf')) matchedTool = 'word-to-pdf';
    else if (kw.includes('pdf to jpg')) matchedTool = 'pdf-to-jpg';
    else if (kw.includes('merge pdf') || kw.includes('pdf merge') || kw.includes('combine pdf')) matchedTool = 'merge-pdf';
    else if (kw.includes('compress pdf') || kw.includes('pdf compressor') || kw.includes('pdf size reducer') || kw.includes('reduce pdf size')) matchedTool = 'compress-pdf';
    else if (kw.includes('split pdf')) matchedTool = 'split-pdf';
    else if (kw.includes('pdf to excel')) matchedTool = 'pdf-to-excel';
    else if (kw.includes('excel to pdf')) matchedTool = 'excel-to-pdf';
    else if (kw.includes('edit pdf') || kw.includes('pdf editor')) matchedTool = 'edit-pdf';
    else if (kw.includes('sign pdf')) matchedTool = 'sign-pdf';
    else if (kw.includes('crop pdf')) matchedTool = 'crop-pdf';
    else if (kw.includes('organize pdf')) matchedTool = 'organize-pdf';
    else if (kw.includes('delete pages')) matchedTool = 'delete-pages';
    else if (kw.includes('pdf reader') || kw.includes('pdf app') || kw.includes('pdf file') || kw.includes('what is pdf') || kw.includes('how to make pdf') || kw.includes('pdf full form')) {
        // These are often informational / general, map to articles or reader tool
        if (kw.includes('reader')) matchedTool = 'pdf-reader';
    } else if (kw.includes('pdf converter')) {
        // generic converter, maybe map to 'pdf-multi-tool' or create a category for it
        matchedTool = 'pdf-multi-tool';
    }
    
    // Fallback: check available tools directly
    if (!matchedTool) {
        let bestMatch = null;
        for (let tool of availableTools) {
            let toolNameClean = tool.replace(/-/g, ' ');
            if (kw.includes(toolNameClean)) {
                bestMatch = tool;
                break;
            }
        }
        matchedTool = bestMatch;
    }

    if (row.intent === 'informational' && kw.includes('how to')) {
        articles.push({...row, relatedTool: matchedTool});
    } else if (matchedTool) {
        if (!clusters[matchedTool]) {
            clusters[matchedTool] = {
                primary: null,
                secondaries: [],
                totalVolume: 0
            };
        }
        clusters[matchedTool].totalVolume += row.volume;
        
        // Assign primary vs secondary
        if (!clusters[matchedTool].primary) {
            clusters[matchedTool].primary = row;
        } else {
            clusters[matchedTool].secondaries.push(row);
        }
    }
});

const report = {
    top50: data.slice(0, 50),
    clusters,
    articles,
    competitorsExcluded: competitorsExcluded.slice(0, 20)
};

fs.writeFileSync('D:/pdfcraft/scratch/seo_report_data.json', JSON.stringify(report, null, 2));
console.log("Report generated at scratch/seo_report_data.json");
