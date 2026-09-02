// SPVN Tech Chrome Extension - Background Service Worker

const SPVN Tech_URL = 'https://pdfcraft.devtoolcafe.com/en';

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    // Create main context menu item
    chrome.contextMenus.create({
        id: 'pdfcraft-open',
        title: 'Open with SPVN Tech',
        contexts: ['link', 'page']
    });

    // Create submenu for specific tools
    chrome.contextMenus.create({
        id: 'pdfcraft-merge',
        parentId: 'pdfcraft-open',
        title: 'Merge PDFs',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdfcraft-compress',
        parentId: 'pdfcraft-open',
        title: 'Compress PDF',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdfcraft-convert',
        parentId: 'pdfcraft-open',
        title: 'Convert to PDF',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdfcraft-all-tools',
        parentId: 'pdfcraft-open',
        title: 'All Tools →',
        contexts: ['link', 'page']
    });

    console.log('SPVN Tech context menus created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    let url = SPVN Tech_URL;

    switch (info.menuItemId) {
        case 'pdfcraft-merge':
            url = `${SPVN Tech_URL}/tools/merge-pdf`;
            break;
        case 'pdfcraft-compress':
            url = `${SPVN Tech_URL}/tools/compress-pdf`;
            break;
        case 'pdfcraft-convert':
            url = `${SPVN Tech_URL}/tools/jpg-to-pdf`;
            break;
        case 'pdfcraft-all-tools':
        case 'pdfcraft-open':
            url = SPVN Tech_URL;
            break;
        default:
            url = SPVN Tech_URL;
    }

    // Open SPVN Tech in a new tab
    chrome.tabs.create({ url: url });
});

// Log when service worker starts
console.log('SPVN Tech background service worker started');
