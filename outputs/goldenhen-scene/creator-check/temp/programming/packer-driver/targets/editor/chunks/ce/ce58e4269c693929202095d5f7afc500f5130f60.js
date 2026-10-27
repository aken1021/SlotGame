System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, CocosSpecialPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSnapshot(extras) {
    _reporterNs.report("Snapshot", "../model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialState(extras) {
    _reporterNs.report("SpecialState", "../model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialGame(extras) {
    _reporterNs.report("SpecialGame", "../special", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2c4beQliyxONIYsWdJ2v09P", "CocosSpecialPanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);
      /** Register one panel per server special ID. Game scripts subscribe to the semantic events. */

      _export("CocosSpecialPanel", CocosSpecialPanel = (_dec = ccclass('AISlotSpecialPanel'), _dec2 = property(Label), _dec(_class = (_class2 = class CocosSpecialPanel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "id", _descriptor, this);

          _initializerDefineProperty(this, "counter", _descriptor2, this);
        }

        async enter(state, snapshot) {
          this.node.active = true;
          this.render(state);
          this.node.emit('slot-special-enter', state, snapshot);
        }

        async updateState(state, snapshot) {
          this.render(state);
          this.node.emit('slot-special-update', state, snapshot);
        }

        async exit() {
          this.node.emit('slot-special-exit');
          this.node.active = false;
        }

        dispose() {
          this.node.active = false;
        }

        render(state) {
          var _state$total;

          if (this.counter) this.counter.string = state.remaining === null ? '' : `${((_state$total = state.total) != null ? _state$total : 0) - state.remaining}/${state.total}`;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "counter", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ce58e4269c693929202095d5f7afc500f5130f60.js.map