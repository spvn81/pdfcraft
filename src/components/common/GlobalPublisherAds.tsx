'use client';

import Script from 'next/script';

// Toggle these flags to easily enable or disable global ad scripts.
// The requirements dictate these should be disabled by default.
const ENABLE_POPUNDER = false;
const ENABLE_SOCIALBAR = false;

/**
 * GlobalPublisherAds handles the injection of global ad scripts like Popunder and SocialBar.
 * It uses next/script with strategy="afterInteractive" to ensure they are loaded
 * exactly once per application lifecycle and do not reload during App Router client navigation.
 */
export function GlobalPublisherAds() {
  return (
    <>
      {ENABLE_POPUNDER && (
        <Script
          id="publisher-popunder"
          src="https://pl31035583.profitableratecpmnetwork.com/64/70/0c/64700ce6ef26ce3fc7373f87741f5b3b.js"
          strategy="afterInteractive"
        />
      )}
      
      {ENABLE_SOCIALBAR && (
        <Script
          id="publisher-socialbar"
          src="https://pl31035584.profitableratecpmnetwork.com/e0/40/c0/e040c03e2f9ba00f31edafbb8ecc7ff3.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
