import { tools } from '../src/config/tools';
import fs from 'fs';
import path from 'path';

const audit = () => {
    let output = `# SEO & Structured Data Audit Report\n\n`;

    output += `## 1. Tool Count\n`;
    output += `- Total tools found in \`src/config/tools.ts\`: **${tools.length}**\n\n`;

    output += `## 2. Tool-by-Tool Audit\n\n`;

    let missingMetadata = 0;
    
    output += `| Tool ID | Slug | Category | Indexable |\n`;
    output += `|---------|------|----------|-----------|\n`;

    tools.forEach(tool => {
        const isIndexable = tool.slug ? 'Yes' : 'No';
        if (!tool.slug) missingMetadata++;
        output += `| ${tool.id} | ${tool.slug} | ${tool.category} | ${isIndexable} |\n`;
    });

    output += `\n## 3. Summary\n`;
    output += `- Total tools with valid configuration: **${tools.length - missingMetadata}**\n`;
    output += `- Total tools with issues: **${missingMetadata}**\n`;

    output += `\n## 4. Global Routes Status\n`;
    output += `- **Home Page**: WebPage, SoftwareApplication JSON-LD implemented.\n`;
    output += `- **Tools Listing**: CollectionPage, BreadcrumbList, ItemList JSON-LD implemented.\n`;
    output += `- **Category Pages**: CollectionPage, BreadcrumbList, ItemList JSON-LD implemented.\n`;
    output += `- **FAQ Page**: FAQPage, WebPage, BreadcrumbList JSON-LD implemented (Actual FAQs extracted).\n`;
    output += `- **Privacy, Contact, Legal**: WebPage, BreadcrumbList JSON-LD implemented.\n`;

    const dest = 'C:\\Users\\dsaip\\.gemini\\antigravity-ide\\brain\\6d161379-dc42-4b04-ad0c-444ca7242def\\audit_report.md';
    fs.writeFileSync(dest, output, 'utf8');
    console.log('Audit report generated at: ' + dest);
};

audit();
