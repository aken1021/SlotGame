System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, throwIfAborted, AutoSpinController, _crd;

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSlotClient(extras) {
    _reporterNs.report("SlotClient", "./host", _context.meta, extras);
  }

  function _reportPossibleCrUseOfthrowIfAborted(extras) {
    _reporterNs.report("throwIfAborted", "./timing", _context.meta, extras);
  }

  _export("AutoSpinController", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ClientError = _unresolved_2.ClientError;
    }, function (_unresolved_3) {
      throwIfAborted = _unresolved_3.throwIfAborted;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "46662GBfypFC57iVcA0lKvI", "autospin", undefined);

      /** Never automatically retries an uncertain spin or advances an unknown special game. */
      _export("AutoSpinController", AutoSpinController = class AutoSpinController {
        constructor(client) {
          this.active = false;
          this.stopped = false;
          this.client = client;
        }

        stop() {
          this.stopped = true;
        }

        async run(count, signal) {
          if (this.active) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Auto spin already active', 'BUSY');
          if (!Number.isSafeInteger(count) || count < 1 || count > 10000) throw new RangeError('Invalid auto spin count');
          const lease = this.client.acquireAutoSpin();
          this.active = true;
          this.stopped = false;
          let completed = 0;

          try {
            while (completed < count && !this.stopped) {
              (_crd && throwIfAborted === void 0 ? (_reportPossibleCrUseOfthrowIfAborted({
                error: Error()
              }), throwIfAborted) : throwIfAborted)(signal);
              if (!lease.canSpin()) break;
              await lease.spin();
              completed++;
              if (this.client.state !== 'ready') break;
            }

            return completed;
          } finally {
            this.active = false;
            lease.release();
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9df9e1f16d9c108c6cbb140443e888ef45aabebe.js.map