const fs = require('fs');

const data = JSON.parse(fs.readFileSync('D:/pdfcraft/scratch/seo_report_data.json', 'utf8'));

let md = `# SEO Keyword Implementation & Priority Roadmap

## User Review Required
> [!IMPORTANT]
> Please review this SEO keyword mapping and cluster strategy. This report serves as the source of truth for all SEO metadata updates and content creation. Do these mappings align with your expectations? 

## 1. Top 50 Relevant Keywords
Below are the top 50 keywords from the research dataset, prioritized by volume and relevance to our tools.

| Keyword | Volume | CPC | Competition | Intent |
|---|---|---|---|---|
${data.top50.map(k => `| ${k.keyword} | ${k.volume.toLocaleString()} | ${k.cpc} | ${k.competition} | ${k.intent} |`).join('\n')}

## 2. & 3. Keyword Clusters and Tool-to-Keyword Mapping
We have mapped keywords to the most relevant existing PDF tools to avoid creating duplicate "doorway" pages.

${Object.keys(data.clusters).sort((a,b) => data.clusters[b].totalVolume - data.clusters[a].totalVolume).map(tool => {
    const cluster = data.clusters[tool];
    if (!cluster.primary) return '';
    return `### Tool: \`${tool}\`
**Total Cluster Volume**: ${cluster.totalVolume.toLocaleString()}

**Primary Keyword**:
- \`${cluster.primary.keyword}\` (${cluster.primary.volume.toLocaleString()})

**Secondary Keywords**:
${cluster.secondaries.map(s => `- \`${s.keyword}\` (${s.volume.toLocaleString()})`).join('\n')}
`;
}).join('\n')}

## 4. & 6. Article-to-Keyword Mapping & New Articles Recommended
We identified high-volume informational keywords formatted as questions or guides. These should be built out as educational articles that naturally link to our tools.

| Article Topic (Target Keyword) | Search Volume | Target Tool to Link |
|---|---|---|
${data.articles.map(a => `| ${a.keyword} | ${a.volume.toLocaleString()} | \`${a.relatedTool || 'pdf-multi-tool'}\` |`).join('\n')}

## 5. Existing Pages That Should Be Optimized
Based on the mappings, the following canonical tool pages need immediate SEO optimization (Title, Meta, H1, FAQ, structured data):

${Object.keys(data.clusters).slice(0, 15).map(tool => `- **${tool}** (\`/tools/${tool}\`) -> target: *${data.clusters[tool].primary?.keyword}*`).join('\n')}
*(And all other mapped tools above)*

## 7. Competitor Keywords Excluded
> [!NOTE]
> The following keywords contain competitor brands (e.g., iLovePDF, Adobe, Foxit, 11zon) and have been excluded from our primary tool pages to avoid spam. We will only target these via legitimate comparison articles.

| Competitor Keyword | Volume |
|---|---|
${data.competitorsExcluded.map(c => `| ${c.keyword} | ${c.volume.toLocaleString()} |`).join('\n')}

## 8. Duplicate/Thin Page Risks
> [!WARNING]
> Do **NOT** create separate pages for:
> - \`/merge-pdf-online\` or \`/merge-pdf-free\` (use \`/merge-pdf\`)
> - \`/jpg-to-pdf-converter\` or \`/image-to-pdf\` (use \`/jpg-to-pdf\`)
> - \`/pdf-size-reducer\` or \`/pdf-compressor\` (use \`/compress-pdf\`)
> 
> Consolidate these keyword variations as secondary keywords into the canonical tool pages.

## 9. Internal Linking Recommendations
Build topic clusters to distribute authority:
- **Convert PDF**: Link \`/jpg-to-pdf\`, \`/pdf-to-jpg\`, \`/pdf-to-docx\`, \`/pdf-to-excel\` together under a unified conversion hub.
- **Organize PDF**: Link \`/merge-pdf\`, \`/split-pdf\`, \`/delete-pages\`, \`/organize-pdf\`.
- **Optimize PDF**: Link \`/compress-pdf\`, \`/linearize-pdf\`.
Use descriptive, varied anchor text (e.g., "reduce your PDF size", "compress documents") rather than just exact-match keywords.

## 10. Final SEO Priority Roadmap
### Phase 1: Tier 1 Tool Optimization (High Priority)
- Update Title, Meta Description, H1, and intro content for top volume tools: \`jpg-to-pdf\`, \`pdf-to-docx\`, \`pdf-to-jpg\`, \`merge-pdf\`, \`compress-pdf\`.
- Implement natural usage of primary and secondary keywords.
- Add/update FAQ sections to target long-tail queries.

### Phase 2: Tier 2 Tool Optimization
- Apply the same optimization framework to medium-volume tools (e.g., \`split-pdf\`, \`pdf-multi-tool\`, \`sign-pdf\`, \`pdf-to-excel\`).

### Phase 3: Content Creation (Tier 3)
- Write and publish high-quality blog articles for informational "How-to" queries (e.g., "how to make pdf file", "how to compress a pdf").
- Add internal links from these articles to the respective tools.

### Phase 4: Competitor Comparisons (Tier 4)
- Draft honest comparison articles targeting competitor keywords (e.g., "SPVN Tech PDF Tools vs Adobe Reader").

## Proposed Changes
No files have been modified yet. Awaiting your approval on this SEO strategy and keyword mapping.

### Next Steps
1. Upon approval, I will systematically update the metadata (Title, Description, H1) and content (Intro, FAQ) for the top Tier 1 tools in the ` + "`src/config/tools.ts`" + ` or their respective page components.
2. I will prepare templates for the new blog articles.

## Verification Plan
- Ensure ` + "`next build`" + ` passes without errors.
- Verify that no duplicate pages/routes were inadvertently created.
- Review a sample tool page in the browser (or via HTML output) to confirm metadata and H1s are correctly rendering.
`;

fs.writeFileSync('C:/Users/dsaip/.gemini/antigravity-ide/brain/e2980853-5a17-4f4f-8d52-f2c5085fb89c/implementation_plan.md', md);
console.log("implementation_plan.md generated!");
