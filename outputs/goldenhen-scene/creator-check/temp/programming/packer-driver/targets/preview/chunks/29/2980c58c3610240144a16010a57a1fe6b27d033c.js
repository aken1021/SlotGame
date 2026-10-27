System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, ResourceCache, AudioController, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

        get(key) {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (_this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Resource cache disposed', 'DISPOSED');

            var entry = _this.entries.get(key);

            if (!entry) {
              entry = Promise.resolve().then(() => _this.loadAsset(key));

              _this.entries.set(key, entry);

              entry.catch(() => {
                if (_this.entries.get(key) === entry) _this.entries.delete(key);
              });
            }

            var value = yield entry;
            if (_this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Resource cache disposed while loading', 'DISPOSED');
            return value;
          })();
        }

        dispose() {
          if (this.disposed) return;
          this.disposed = true;

          for (var entry of this.entries.values()) void entry.then(value => this.releaseAsset(value), () => {});

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