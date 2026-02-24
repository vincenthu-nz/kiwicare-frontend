/**
 * Next.js Instrumentation Hook
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * `register()` is called once when the server starts, before any route module
 * is imported or any request is handled. We use it here to patch the broken
 * Web Storage globals that Node.js ≥ 22 provides when `--localstorage-file` is
 * supplied with an invalid path (which Next.js 15 does internally).
 *
 * In that situation `localStorage` / `sessionStorage` exist as stubs on
 * `globalThis` but their methods (getItem, setItem, …) are not functions.
 * Browser-only libraries such as mapbox-gl call these methods during module
 * initialisation, crashing the server before any request is ever served.
 *
 * Replacing the stubs with safe no-ops lets those libraries load without
 * error. The no-op always returns `null` / `undefined`, which is the same
 * result a browser returns for keys that have never been set — so no library
 * should behave incorrectly because of this.
 */
export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const noopStorage: Storage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };

  if (
    typeof globalThis.localStorage !== 'undefined' &&
    typeof globalThis.localStorage.getItem !== 'function'
  ) {
    Object.defineProperty(globalThis, 'localStorage', {
      value: noopStorage,
      writable: true,
      configurable: true,
    });
  }

  if (
    typeof globalThis.sessionStorage !== 'undefined' &&
    typeof globalThis.sessionStorage.getItem !== 'function'
  ) {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: noopStorage,
      writable: true,
      configurable: true,
    });
  }
}
