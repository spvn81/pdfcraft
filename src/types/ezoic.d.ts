declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      showAds: (placeholders?: Record<string, unknown> | number, ...args: number[]) => void;
      destroyPlaceholders?: (...args: number[]) => void;
      destroyAll?: () => void;
      init?: () => void;
      define?: (...args: (number | number[])[]) => void;
      hasDisplayedAds?: boolean;
    };
  }
}

export {};
