export function runEzoic(fn: () => void) {
  if (typeof window === "undefined") return;
  
  // Use any to bypass strict window interface checks for the initial polyfill setup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.ezstandalone = w.ezstandalone || {};
  w.ezstandalone.cmd = w.ezstandalone.cmd || [];
  w.ezstandalone.cmd.push(fn);
}
