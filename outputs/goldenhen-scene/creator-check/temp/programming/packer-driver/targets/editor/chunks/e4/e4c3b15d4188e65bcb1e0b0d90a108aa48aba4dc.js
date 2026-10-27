System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, deepFreeze, MemoryPendingStore, PersistentPendingStore, _crd;

  function _reportPossibleCrUseOfAction(extras) {
    _reporterNs.report("Action", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCommand(extras) {
    _reporterNs.report("Command", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdeepFreeze(extras) {
    _reporterNs.report("deepFreeze", "./model", _context.meta, extras);
  }

  _export({
    MemoryPendingStore: void 0,
    PersistentPendingStore: void 0
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ClientError = _unresolved_2.ClientError;
      deepFreeze = _unresolved_2.deepFreeze;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5b67dPDFXxHC4cvYyYSzKSN", "storage", undefined);

      _export("MemoryPendingStore", MemoryPendingStore = class MemoryPendingStore {
        constructor() {
          this.value = null;
        }

        load() {
          return this.value;
        }

        save(value) {
          this.value = value;
        }

        clear() {
          this.value = null;
        }

      });

      /** Storage key must be scoped by game AND player. No balances are trusted from storage. */
      _export("PersistentPendingStore", PersistentPendingStore = class PersistentPendingStore {
        constructor(storage, key) {
          this.storage = storage;
          this.key = key;
        }

        load() {
          const value = this.storage.getItem(this.key);
          if (value === null) return null;

          try {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object') throw new Error('not object');
            const v = parsed;
            const actions = ['START_GAME', 'SPIN', 'NEXT_FEVER', 'CHECK_CMD'];
            if (v.schema !== 'gh-client-v1' || !actions.includes(v.action) || typeof v.game_id !== 'string' || !v.game_id || typeof v.player_id !== 'string' || !v.player_id || typeof v.request_id !== 'string' || !v.request_id || !Number.isSafeInteger(v.expected_version) || v.expected_version < 0 || !v.payload || typeof v.payload !== 'object' || Array.isArray(v.payload)) throw new Error('invalid command');
            return (_crd && deepFreeze === void 0 ? (_reportPossibleCrUseOfdeepFreeze({
              error: Error()
            }), deepFreeze) : deepFreeze)(v);
          } catch {
            throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Pending request is corrupt; reconcile with server before clearing it', 'CORRUPT_PENDING');
          }
        }

        save(value) {
          this.storage.setItem(this.key, JSON.stringify(value));
        }

        clear() {
          this.storage.removeItem(this.key);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e4c3b15d4188e65bcb1e0b0d90a108aa48aba4dc.js.map