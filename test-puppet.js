import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('request', request => {
    if (request.method() === 'POST' || request.url().includes('libreoffice-wasm')) {
      console.log(`[REQUEST] ${request.method()} ${request.url()}`);
    }
  });

  page.on('requestfailed', request => {
    console.log(`[FAILED] ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });

  page.on('console', msg => console.log(`[CONSOLE] ${msg.text()}`));

  console.log('Navigating to PPTX to PDF tool...');
  await page.goto('https://spvntech.in/pdf-tools/en/tools/pptx-to-pdf/', { waitUntil: 'networkidle2' });

  // Find file input and upload
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    console.log('Uploading test.pptx...');
    await fileInput.uploadFile('d:\\pdfcraft\\test.pptx');
    
    console.log('Waiting 15 seconds to monitor network requests...');
    await new Promise(r => setTimeout(r, 15000));
  } else {
    console.log('Could not find file input element.');
  }

  await browser.close();
})();
