System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCInteger, CCString, Component, Label, Sprite, SpriteFrame, ReelMotion, delay, throwIfAborted, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, CocosReelColumn;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfReelMotion(extras) {
    _reporterNs.report("ReelMotion", "../presentation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdelay(extras) {
    _reporterNs.report("delay", "../timing", _context.meta, extras);
  }

  function _reportPossibleCrUseOfthrowIfAborted(extras) {
    _reporterNs.report("throwIfAborted", "../timing", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCInteger = _cc.CCInteger;
      CCString = _cc.CCString;
      Component = _cc.Component;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
    }, function (_unresolved_2) {
      ReelMotion = _unresolved_2.ReelMotion;
    }, function (_unresolved_3) {
      delay = _unresolved_3.delay;
      throwIfAborted = _unresolved_3.throwIfAborted;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f2dc8kNjBVAT4h8O5oJI188", "CocosReelColumn", undefined);

      __checkObsolete__(['_decorator', 'CCInteger', 'CCString', 'Component', 'Label', 'Sprite', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);
      /** Label placeholders can be replaced by symbol sprites without changing the common flow. */

      _export("CocosReelColumn", CocosReelColumn = (_dec = ccclass('AISlotReelColumn'), _dec2 = property([Label]), _dec3 = property([Sprite]), _dec4 = property([CCInteger]), _dec5 = property([SpriteFrame]), _dec6 = property([CCString]), _dec7 = property(Label), _dec8 = property(Sprite), _dec(_class = (_class2 = class CocosReelColumn extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "cells", _descriptor, this);

          _initializerDefineProperty(this, "symbolSprites", _descriptor2, this);

          _initializerDefineProperty(this, "symbolIds", _descriptor3, this);

          _initializerDefineProperty(this, "symbolFrames", _descriptor4, this);

          _initializerDefineProperty(this, "symbolNames", _descriptor5, this);

          _initializerDefineProperty(this, "bufferCell", _descriptor6, this);

          _initializerDefineProperty(this, "bufferSprite", _descriptor7, this);

          _initializerDefineProperty(this, "speed", _descriptor8, this);

          _initializerDefineProperty(this, "cellHeight", _descriptor9, this);

          _initializerDefineProperty(this, "stopDuration", _descriptor10, this);

          this.motion = null;
          this.homes = [];
          this.bufferHome = null;
        }

        begin(strip) {
          this.homes = this.cells.map(cell => ({
            x: cell.node.position.x,
            y: cell.node.position.y,
            z: cell.node.position.z
          }));

          if (this.bufferCell) {
            var p = this.bufferCell.node.position;
            this.bufferHome = {
              x: p.x,
              y: p.y,
              z: p.z
            };
            this.bufferCell.node.active = true;
          }

          this.motion = new (_crd && ReelMotion === void 0 ? (_reportPossibleCrUseOfReelMotion({
            error: Error()
          }), ReelMotion) : ReelMotion)(strip, this.cellHeight, this.speed);
        }

        update(dt) {
          if (!this.motion || !this.cells.length) return;
          var frame = this.motion.tick(dt, this.cells.length);
          this.cells.forEach((cell, index) => {
            this.renderSymbol(cell, this.symbolSprites[index], frame.symbols[this.cells.length - 1 - index]);
            var home = this.homes[index];
            if (home) cell.node.setPosition(home.x, home.y - frame.offset, home.z);
          });

          if (this.bufferCell && this.bufferHome) {
            var _this$bufferSprite;

            this.renderSymbol(this.bufferCell, (_this$bufferSprite = this.bufferSprite) != null ? _this$bufferSprite : undefined, frame.symbols[this.cells.length]);
            this.bufferCell.node.setPosition(this.bufferHome.x, this.bufferHome.y - frame.offset, this.bufferHome.z);
          }
        }

        stopAt(symbols, signal) {
          var _this = this;

          return _asyncToGenerator(function* () {
            yield (_crd && delay === void 0 ? (_reportPossibleCrUseOfdelay({
              error: Error()
            }), delay) : delay)(_this.stopDuration * 1000, signal);
            (_crd && throwIfAborted === void 0 ? (_reportPossibleCrUseOfthrowIfAborted({
              error: Error()
            }), throwIfAborted) : throwIfAborted)(signal);

            _this.snap(symbols);
          })();
        }

        snap(symbols) {
          this.cancel();
          if (symbols.length !== this.cells.length) throw new Error('Reel visible row count differs from scene labels');
          this.cells.forEach((cell, index) => this.renderSymbol(cell, this.symbolSprites[index], symbols[index]));
        }

        cancel() {
          this.motion = null;
          this.cells.forEach((cell, index) => {
            var home = this.homes[index];
            if (home) cell.node.setPosition(home.x, home.y, home.z);
          });
          this.homes = [];

          if (this.bufferCell) {
            if (this.bufferHome) this.bufferCell.node.setPosition(this.bufferHome.x, this.bufferHome.y, this.bufferHome.z);
            this.bufferCell.node.active = false;
          }

          this.bufferHome = null;
        }

        renderSymbol(label, sprite, id) {
          var index = this.symbolIds.indexOf(id);
          var frame = this.symbolFrames[index];
          label.string = this.symbolNames[index] || String(id);
          label.enabled = !sprite || !frame;

          if (sprite) {
            sprite.enabled = !!frame;
            if (frame) sprite.spriteFrame = frame;
          }
        }

        onDestroy() {
          this.cancel();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cells", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "symbolSprites", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "symbolIds", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "symbolFrames", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "symbolNames", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "bufferCell", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "bufferSprite", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 900;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "cellHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 120;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "stopDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9a9e203bfb01cb26e9f168a6f207c6ac9711cb81.js.map