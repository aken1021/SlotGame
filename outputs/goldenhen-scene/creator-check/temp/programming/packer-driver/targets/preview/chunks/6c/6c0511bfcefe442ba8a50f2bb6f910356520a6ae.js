System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, SpecialGameRouter, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSnapshot(extras) {
    _reporterNs.report("Snapshot", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialState(extras) {
    _reporterNs.report("SpecialState", "./model", _context.meta, extras);
  }

  _export("SpecialGameRouter", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ClientError = _unresolved_2.ClientError;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1dc44nYK8JNe7oysGHepwbD", "special", undefined);

      /** IDs and feature-specific sg_map semantics belong to the game, not the common layer. */
      _export("SpecialGameRouter", SpecialGameRouter = class SpecialGameRouter {
        constructor() {
          this.games = new Map();
          this.active = null;
          this.disposed = false;
        }

        register(game) {
          if (this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Router disposed', 'DISPOSED');
          if (!Number.isSafeInteger(game.id) || game.id < 0 || this.games.has(game.id)) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Duplicate/invalid special game', 'INVALID_SPECIAL');
          this.games.set(game.id, game);
          return () => {
            if (this.active === game) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Cannot unregister active special game', 'INVALID_STATE');
            if (this.games.get(game.id) === game) this.games.delete(game.id);
          };
        }

        sync(snapshot) {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (_this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Router disposed', 'DISPOSED');
            var next = snapshot.special ? _this.games.get(snapshot.special.id) : null;
            if (snapshot.special && !next) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)("No handler for special game " + snapshot.special.id, 'UNSUPPORTED_SPECIAL');

            if (next !== _this.active) {
              var old = _this.active;
              _this.active = null;
              if (old) yield old.exit();
              if (_this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
                error: Error()
              }), ClientError) : ClientError)('Router disposed', 'DISPOSED');

              if (next && snapshot.special) {
                _this.active = next;
                yield next.enter(snapshot.special, snapshot);
              }
            } else if (next && snapshot.special) yield next.updateState(snapshot.special, snapshot);
          })();
        }

        dispose() {
          if (this.disposed) return;
          this.disposed = true;

          for (var game of this.games.values()) {
            try {
              game.dispose();
            } catch (_unused) {
              /* Complete cleanup of remaining panels. */
            }
          }

          this.active = null;
          this.games.clear();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6c0511bfcefe442ba8a50f2bb6f910356520a6ae.js.map