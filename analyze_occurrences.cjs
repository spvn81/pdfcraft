const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\pdfcraft';
const excludeDirs = ['.git', 'node_modules', '.next', 'out', 'deploy', 'nix', 'patches', 'scripts', 'scratch'];
const allowedExts = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.html', '.css', '.yml', '.yaml', '.toml', '.xml', '.env', '.example', '']; // empty string for files without extension like Dockerfile
const matchRegex = /pdf\s*[-]*\s*craft/ig;

let stats = { total: 0, byExt: {}, byFile: {} };

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (excludeDirs.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(file);
      // Skip very large files or non-source files
      if (stat.size > 5 * 1024 * 1024) continue; // skip files > 5MB
      if (!allowedExts.includes(ext) && file !== 'Dockerfile' && file !== 'LICENSE') continue;
      
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(matchRegex);
        if (matches) {
          stats.total += matches.length;
          stats.byExt[ext] = (stats.byExt[ext] || 0) + matches.length;
          stats.byFile[fullPath] = matches.length;
        }
      } catch (e) {
        // ignore read errors for weird files
      }
    }
  }
}

walk(rootDir);

console.log(`Total occurrences: ${stats.total}`);
console.log('By Extension:');
for (const [ext, count] of Object.entries(stats.byExt).sort((a, b) => b[1] - a[1])) {
  console.log(`${ext || 'no-extension'}: ${count}`);
}

const topFiles = Object.entries(stats.byFile).sort((a, b) => b[1] - a[1]).slice(0, 30);
console.log('\nTop 30 Files:');
for (const [file, count] of topFiles) {
  console.log(`${file}: ${count}`);
}
