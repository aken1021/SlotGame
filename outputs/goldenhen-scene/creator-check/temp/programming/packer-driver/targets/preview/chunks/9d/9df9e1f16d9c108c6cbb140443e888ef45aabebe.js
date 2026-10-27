System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, throwIfAborted, AutoSpinController, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

        run(count, signal) {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (_this.active) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Auto spin already active', 'BUSY');
            if (!Number.isSafeInteger(count) || count < 1 || count > 10000) throw new RangeError('Invalid auto spin count');

            var lease = _this.client.acquireAutoSpin();

            _this.active = true;
            _this.stopped = false;
            var completed = 0;

            try {
              while (completed < count && !_this.stopped) {
                (_crd && throwIfAborted === void 0 ? (_reportPossibleCrUseOfthrowIfAborted({
                  error: Error()
                }), throwIfAborted) : throwIfAborted)(signal);
                if (!lease.canSpin()) break;
                yield lease.spin();
                completed++;
                if (_this.client.state !== 'ready') break;
              }

              return completed;
            } finally {
              _this.active = false;
              lease.release();
            }
          })();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9df9e1f16d9c108c6cbb140443e888ef45aabebe.js.map