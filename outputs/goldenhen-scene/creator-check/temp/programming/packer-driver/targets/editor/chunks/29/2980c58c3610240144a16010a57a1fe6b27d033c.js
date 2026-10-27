System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, ResourceCache, AudioController, _crd;

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  _export({
    ResourceCache: void 0,
    AudioController: void 0
  });

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

      _cclegacy._RF.push({}, "dca970g4fhGn4NqiErNnDLJ", "resources", undefined);

      /** Shared loads, explicit ownership, failed loads retryable; late assets released after dispose. */
      _export("ResourceCache", ResourceCache = class ResourceCache {
        constructor(loadAsset, releaseAsset) {
          this.entries = new Map();
          this.disposed = false;
          this.loadAsset = loadAsset;
          this.releaseAsset = releaseAsset;
        }

        async get(key) {
          if (this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Resource cache disposed', 'DISPOSED');
          let entry = this.entries.get(key);

          if (!entry) {
            entry = Promise.resolve().then(() => this.loadAsset(key));
            this.entries.set(key, entry);
            entry.catch(() => {
              if (this.entries.get(key) === entry) this.entries.delete(key);
            });
          }

          const value = await entry;
          if (this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Resource cache disposed while loading', 'DISPOSED');
          return value;
        }

        dispose() {
          if (this.disposed) return;
          this.disposed = true;

          for (const entry of this.entries.values()) void entry.then(value => this.releaseAsset(value), () => {});

          this.entries.clear();
        }

      });

      _export("AudioController", AudioController = class AudioController {
        constructor(port) {
          this.current = null;
          this.muted = false;
          this.port = port;
        }

        playMusic(key) {
          if (key === this.current) return;
          this.current = key;
          this.port.music(key, true);
        }

        playEffect(key) {
          if (!this.muted) this.port.effect(key);
        }

        setMuted(value) {
          this.muted = value;
          this.port.setMuted(value);
        }

        dispose() {
          this.current = null;
          this.port.stopMusic();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2980c58c3610240144a16010a57a1fe6b27d033c.js.map