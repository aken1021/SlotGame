System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Rect, ResolutionPolicy, SpriteFrame, view, CocosReelColumn, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, executeInEditMode, executionOrder, GoldenHenReelSkin;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCocosReelColumn(extras) {
    _reporterNs.report("CocosReelColumn", "../../scripts/common/cocos/CocosReelColumn", _context.meta, extras);
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
      Rect = _cc.Rect;
      ResolutionPolicy = _cc.ResolutionPolicy;
      SpriteFrame = _cc.SpriteFrame;
      view = _cc.view;
    }, function (_unresolved_2) {
      CocosReelColumn = _unresolved_2.CocosReelColumn;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "28698xfCN5JvYpkG/j9Vy7B", "GoldenHenReelSkin", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Rect', 'ResolutionPolicy', 'SpriteFrame', 'view']);

      ({
        ccclass,
        property,
        executeInEditMode,
        executionOrder
      } = _decorator);
      /** Atlas rectangles are Cocos sprite frames; the original AI bitmap is never modified. */

      _export("GoldenHenReelSkin", GoldenHenReelSkin = (_dec = ccclass('GoldenHenReelSkin'), _dec2 = executionOrder(-100), _dec3 = property(SpriteFrame), _dec4 = property([_crd && CocosReelColumn === void 0 ? (_reportPossibleCrUseOfCocosReelColumn({
        error: Error()
      }), CocosReelColumn) : CocosReelColumn]), _dec(_class = executeInEditMode(_class = _dec2(_class = (_class2 = class GoldenHenReelSkin extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "sheet", _descriptor, this);

          _initializerDefineProperty(this, "columns", _descriptor2, this);

          this.frames = [];
        }

        onLoad() {
          var _this$sheet;

          if (!((_this$sheet = this.sheet) != null && _this$sheet.texture)) return;
          view.setDesignResolutionSize(1280, 720, ResolutionPolicy.SHOW_ALL);
          var texture = this.sheet.texture;
          var w = texture.width / 3,
              h = texture.height / 2;
          if (!Number.isInteger(w) || !Number.isInteger(h)) throw new Error('Symbol sheet must be a 3 by 2 grid');
          this.frames = Array.from({
            length: 6
          }, (_, index) => {
            var frame = new SpriteFrame();
            frame.texture = texture; // Exclude atlas tile edges where generated neighboring highlights can bleed.

            var inset = 32;
            frame.rect = new Rect(index % 3 * w + inset, Math.floor(index / 3) * h + inset, w - inset * 2, h - inset * 2);
            frame.packable = false;
            return frame;
          });
          var ids = [15, 16, 17, 18, 14, 1, 19, 20, 21, 22, 23, 24, 2, 10, 11, 12, 13];
          var names = ['', '', '', '', '', '', 'A', 'K', 'Q', 'J', '10', '9', 'SCATTER', '金雞(金)', '玉佩(金)', '元寶(金)', '鞭炮(金)'];
          var preview = [[15, 14, 17], [16, 1, 18], [14, 15, 16], [17, 18, 14], [1, 16, 15]];
          this.columns.forEach((column, index) => {
            var _preview$index;

            column.symbolIds = [...ids];
            column.symbolNames = [...names];
            column.symbolFrames = this.frames;
            column.snap((_preview$index = preview[index]) != null ? _preview$index : [15, 16, 17]);
          });
        }

        onDestroy() {
          this.columns.forEach(column => {
            column.symbolFrames = [];
          });
          this.frames.forEach(frame => frame.destroy());
          this.frames = [];
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sheet", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "columns", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d7a7ab810e479205b16159b542f75f749330d8e4.js.map