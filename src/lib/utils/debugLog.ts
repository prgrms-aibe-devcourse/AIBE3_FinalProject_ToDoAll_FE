export function debugLog(...messages: any[]) {
  if (import.meta.env.DEV) {
    console.log('[dev mode] ', ...messages);
  }
}
