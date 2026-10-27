System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, SpecialGameRouter, _crd;

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

        async sync(snapshot) {
          if (this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Router disposed', 'DISPOSED');
          const next = snapshot.special ? this.games.get(snapshot.special.id) : null;
          if (snapshot.special && !next) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)(`No handler for special game ${snapshot.special.id}`, 'UNSUPPORTED_SPECIAL');

          if (next !== this.active) {
            const old = this.active;
            this.active = null;
            if (old) await old.exit();
            if (this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Router disposed', 'DISPOSED');

            if (next && snapshot.special) {
              this.active = next;
              await next.enter(snapshot.special, snapshot);
            }
          } else if (next && snapshot.special) await next.updateState(snapshot.special, snapshot);
        }

        dispose() {
          if (this.disposed) return;
          this.disposed = true;

          for (const game of this.games.values()) {
            try {
              game.dispose();
            } catch {
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
//# sourceMappingURL=5927ec5ec9dac04b8c4f8c90818d7bbd00b421c2.js.map