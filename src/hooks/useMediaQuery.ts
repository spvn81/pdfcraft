import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    // Set the initial value
    setMatches(mediaQueryList.matches);

    // Watch for changes
    if (mediaQueryList.addListener) {
      mediaQueryList.addListener(documentChangeHandler); // For legacy browsers
    } else {
      mediaQueryList.addEventListener('change', documentChangeHandler);
    }

    return () => {
      if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(documentChangeHandler);
      } else {
        mediaQueryList.removeEventListener('change', documentChangeHandler);
      }
    };
  }, [query]);

  return matches;
}
