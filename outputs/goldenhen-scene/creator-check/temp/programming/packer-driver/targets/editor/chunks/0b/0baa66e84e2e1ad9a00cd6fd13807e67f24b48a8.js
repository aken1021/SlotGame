System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  function abortError() {
    const error = new Error('Operation cancelled');
    error.name = 'AbortError';
    return error;
  }

  function throwIfAborted(signal) {
    if (signal != null && signal.aborted) throw abortError();
  }

  function isAbort(error) {
    return error instanceof Error && error.name === 'AbortError';
  }

  function delay(ms, signal) {
    if (!Number.isFinite(ms) || ms < 0) return Promise.reject(new RangeError('Invalid delay'));
    return new Promise((resolve, reject) => {
      if (signal != null && signal.aborted) {
        reject(abortError());
        return;
      }

      const timer = setTimeout(() => {
        cleanup();
        resolve();
      }, ms);

      const cancel = () => {
        clearTimeout(timer);
        cleanup();
        reject(abortError());
      };

      const cleanup = () => signal == null ? void 0 : signal.removeEventListener('abort', cancel);

      signal == null || signal.addEventListener('abort', cancel, {
        once: true
      });
    });
  }

  _export({
    abortError: abortError,
    throwIfAborted: throwIfAborted,
    isAbort: isAbort,
    delay: delay
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d02bcr5rmlKkY5TmtmiJvav", "timing", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0baa66e84e2e1ad9a00cd6fd13807e67f24b48a8.js.map