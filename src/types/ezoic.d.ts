declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      showAds: (...args: number[]) => void;
      destroyPlaceholders: (...args: number[]) => void;
      hasDisplayedAds?: boolean;
    };
  }
}

export {};
