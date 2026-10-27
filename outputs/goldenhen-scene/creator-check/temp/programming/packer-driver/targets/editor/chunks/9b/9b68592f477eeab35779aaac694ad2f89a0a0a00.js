System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, EventBus, Scope, _crd;

  _export({
    EventBus: void 0,
    Scope: void 0
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2629050mndNM4qQk0nKoWrp", "events", undefined);

      /** Scoped subscriptions; observer exceptions never change a settled game action. */
      _export("EventBus", EventBus = class EventBus {
        constructor() {
          this.listeners = new Map();
        }

        on(key, listener) {
          let group = this.listeners.get(key);

          if (!group) {
            group = new Set();
            this.listeners.set(key, group);
          }

          const entry = listener;
          group.add(entry);
          let subscribed = true;
          return () => {
            if (!subscribed) return;
            subscribed = false;
            group.delete(entry);
            if (!group.size && this.listeners.get(key) === group) this.listeners.delete(key);
          };
        }

        once(key, listener) {
          const off = this.on(key, value => {
            off();
            listener(value);
          });
          return off;
        }

        emit(key, value) {
          const errors = [];

          for (const listener of [...((_this$listeners$get = this.listeners.get(key)) != null ? _this$listeners$get : [])]) {
            var _this$listeners$get;

            try {
              listener(value);
            } catch (error) {
              errors.push(error);
            }
          }

          return errors;
        }

        clear() {
          this.listeners.clear();
        }

      });

      _export("Scope", Scope = class Scope {
        constructor() {
          this.callbacks = [];
          this.closed = false;
        }

        add(dispose) {
          if (this.closed) dispose();else this.callbacks.push(dispose);
        }

        dispose() {
          if (this.closed) return;
          this.closed = true;
          const errors = [];

          for (const callback of this.callbacks.splice(0).reverse()) {
            try {
              callback();
            } catch (error) {
              errors.push(error);
            }
          }

          if (errors.length) throw new Error(`Scope cleanup failed (${errors.length})`);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9b68592f477eeab35779aaac694ad2f89a0a0a00.js.map