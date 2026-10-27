export function abortError(): Error {
  const error = new Error('Operation cancelled'); error.name = 'AbortError'; return error;
}
export function throwIfAborted(signal?: AbortSignal): void { if (signal?.aborted) throw abortError(); }
export function isAbort(error: unknown): boolean { return error instanceof Error && error.name === 'AbortError'; }
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (!Number.isFinite(ms) || ms < 0) return Promise.reject(new RangeError('Invalid delay'));
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(abortError()); return; }
    const timer = setTimeout(() => { cleanup(); resolve(); }, ms);
    const cancel = () => { clearTimeout(timer); cleanup(); reject(abortError()); };
    const cleanup = () => signal?.removeEventListener('abort', cancel);
    signal?.addEventListener('abort', cancel, { once: true });
  });
}
