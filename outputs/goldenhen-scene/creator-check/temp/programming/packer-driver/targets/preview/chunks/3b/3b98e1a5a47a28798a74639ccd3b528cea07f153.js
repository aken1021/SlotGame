System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Button, Color, Component, Graphics, Label, Node, UITransform, CocosSlotDriver, formatAmount, Scope, _dec, _class, _crd, ccclass, GoldenHenGameControls;

  function _reportPossibleCrUseOfCocosSlotDriver(extras) {
    _reporterNs.report("CocosSlotDriver", "../../scripts/common/cocos/CocosSlotDriver", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSnapshot(extras) {
    _reporterNs.report("Snapshot", "../../scripts/common/model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfformatAmount(extras) {
    _reporterNs.report("formatAmount", "../../scripts/common/money", _context.meta, extras);
  }

  function _reportPossibleCrUseOfScope(extras) {
    _reporterNs.report("Scope", "../../scripts/common/events", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Button = _cc.Button;
      Color = _cc.Color;
      Component = _cc.Component;
      Graphics = _cc.Graphics;
      Label = _cc.Label;
      Node = _cc.Node;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      CocosSlotDriver = _unresolved_2.CocosSlotDriver;
    }, function (_unresolved_3) {
      formatAmount = _unresolved_3.formatAmount;
    }, function (_unresolved_4) {
      Scope = _unresolved_4.Scope;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0c554vBUm1NFYTnxGRFCiur", "GoldenHenGameControls", undefined);

      __checkObsolete__(['_decorator', 'Button', 'Color', 'Component', 'Graphics', 'Label', 'Node', 'UITransform']);

      ({
        ccclass
      } = _decorator);
      /** Minimal local-development controls. Decisions and payouts remain on the Go server. */

      _export("GoldenHenGameControls", GoldenHenGameControls = (_dec = ccclass('GoldenHenGameControls'), _dec(_class = class GoldenHenGameControls extends Component {
        constructor() {
          super(...arguments);
          this.scope = new (_crd && Scope === void 0 ? (_reportPossibleCrUseOfScope({
            error: Error()
          }), Scope) : Scope)();
          this.driver = null;
          this.overlay = null;
          this.title = null;
          this.advance = null;
          this.bet = null;
          this.betText = null;
          this.eggs = [];
          this.eggLabels = [];
          this.generated = [];
        }

        start() {
          var _this$driver,
              _this = this;

          this.driver = this.getComponent(_crd && CocosSlotDriver === void 0 ? (_reportPossibleCrUseOfCocosSlotDriver({
            error: Error()
          }), CocosSlotDriver) : CocosSlotDriver);
          var client = (_this$driver = this.driver) == null ? void 0 : _this$driver.client;
          if (!client) throw new Error('GoldenHen controls require an initialized AISlotDriver');
          var bet = this.button(this.node, 'ChangeBet', -365, -255, 240, 34, '切換押注', () => {
            var _this$driver2;

            var state = client.snapshot;
            if (!state || !client.input.canChangeBet) return;
            var index = state.bets.findIndex(b => {
              var _client$selectedBet;

              return b.lineBet === ((_client$selectedBet = client.selectedBet) == null ? void 0 : _client$selectedBet.lineBet);
            });
            var next = state.bets[(index + 1) % state.bets.length];
            if (next) (_this$driver2 = this.driver) == null || _this$driver2.chooseBet(next.lineBet);
          });
          this.bet = bet.button;
          this.betText = bet.label;
          this.generated.push(bet.node);
          this.overlay = this.makeNode(this.node, 'DevelopmentSpecialControls', 0, -18, 990, 430);
          this.generated.push(this.overlay);
          var backdrop = this.overlay.addComponent(Graphics);
          backdrop.fillColor = new Color(35, 8, 10, 245);
          backdrop.roundRect(-495, -215, 990, 430, 18);
          backdrop.fill();
          this.title = this.text(this.overlay, 'SpecialTitle', 0, 170, 900, 44, '', 28);
          var advance = this.button(this.overlay, 'NextSpecial', 0, -35, 300, 65, '開始', () => {
            var _this$driver3;

            void ((_this$driver3 = this.driver) == null ? void 0 : _this$driver3.nextSpecial(null));
          });
          this.advance = advance.button;

          var _loop = function _loop(i) {
            var egg = _this.button(_this.overlay, "Egg_" + i, (i % 6 - 2.5) * 145, 85 - Math.floor(i / 6) * 100, 125, 78, "\u91D1\u86CB " + (i + 1), () => {
              var _this$driver5;

              void ((_this$driver5 = _this.driver) == null ? void 0 : _this$driver5.nextSpecial({
                '1': i
              }));
            });

            _this.eggs.push(egg.button);

            _this.eggLabels.push(egg.label);
          };

          for (var i = 0; i < 18; i++) {
            _loop(i);
          }

          this.overlay.active = false;

          var render = () => this.render(client.snapshot);

          this.scope.add(client.events.on('state', render));
          this.scope.add(client.events.on('settled', render));
          this.scope.add(client.events.on('bet', render));
          this.scope.add(client.events.on('input', render));
          this.scope.add(client.events.on('error', error => {
            var _this$driver4;

            var status = (_this$driver4 = this.driver) == null ? void 0 : _this$driver4.statusLabel;
            if (status) status.string = "\u9023\u7DDA\uFF0F\u64CD\u4F5C\u5931\u6557\uFF1A" + (error instanceof Error ? error.message : String(error)) + " \xB7 \u6309\u9023\u7DDA\u91CD\u8A66";
          }));
          render();
        }

        render(snapshot) {
          var _this$driver6, _this$advance$node$ge;

          var client = (_this$driver6 = this.driver) == null ? void 0 : _this$driver6.client;
          if (!client || !this.overlay || !this.advance || !this.title || !this.bet || !this.betText) return;
          this.bet.interactable = client.input.canChangeBet;
          this.betText.string = client.selectedBet ? "\u62BC\u6CE8 " + (_crd && formatAmount === void 0 ? (_reportPossibleCrUseOfformatAmount({
            error: Error()
          }), formatAmount) : formatAmount)(client.selectedBet.totalBet) + " \xB7 \u5207\u63DB" : '等待連線';
          var sg = snapshot == null ? void 0 : snapshot.special;
          this.overlay.active = !!sg;
          if (!sg) return;
          var backdrop = this.overlay.getComponent(Graphics);
          if (backdrop) backdrop.enabled = sg.id === 1;
          this.title.node.setPosition(0, sg.id === 0 ? 220 : 170);
          this.advance.node.setPosition(0, sg.id === 0 ? -237 : -35);
          var actionable = client.input.canSpecialAction;
          this.advance.node.active = sg.id === 0 || sg.stage === 'init';
          this.advance.interactable = actionable;
          var caption = (_this$advance$node$ge = this.advance.node.getChildByName('Text')) == null ? void 0 : _this$advance$node$ge.getComponent(Label);
          if (caption) caption.string = sg.stage === 'init' ? '開始特殊遊戲' : '下一次免費旋轉';
          this.title.string = sg.id === 0 ? "\u514D\u8CBB\u65CB\u8F49 \xB7 \u5269\u9918 " + sg.remaining + " / " + sg.total : '砸金蛋 · 同色集滿 3 個得獎';
          this.eggs.forEach((egg, index) => {
            var _sg$picks$index, _sg$picks, _tier;

            egg.node.active = sg.id === 1 && sg.stage !== 'init';
            var tier = (_sg$picks$index = (_sg$picks = sg.picks) == null ? void 0 : _sg$picks[index]) != null ? _sg$picks$index : -1;
            egg.interactable = actionable && tier === -1;
            var label = this.eggLabels[index];
            if (label) label.string = tier < 0 ? "\u91D1\u86CB " + (index + 1) : (_tier = ['GRAND', 'MAJOR', 'MINOR', 'MINI'][tier]) != null ? _tier : '?';
          });
        }

        makeNode(parent, name, x, y, w, h) {
          var node = new Node(name);
          node.layer = parent.layer;
          node.setParent(parent);
          node.setPosition(x, y);
          node.addComponent(UITransform).setContentSize(w, h);
          return node;
        }

        text(parent, name, x, y, w, h, value, size) {
          var label = this.makeNode(parent, name, x, y, w, h).addComponent(Label);
          label.string = value;
          label.fontSize = size;
          label.lineHeight = size + 4;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          label.color = new Color(255, 222, 151);
          return label;
        }

        button(parent, name, x, y, w, h, text, onClick) {
          var node = this.makeNode(parent, name, x, y, w, h);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = new Color(130, 35, 22);
          graphics.roundRect(-w / 2, -h / 2, w, h, 8);
          graphics.fill();
          var button = node.addComponent(Button);
          button.transition = Button.Transition.NONE;
          var label = this.text(node, 'Text', 0, 0, w - 8, h, text, h < 40 ? 16 : 20);
          node.on(Button.EventType.CLICK, onClick);
          return {
            node,
            button,
            label
          };
        }

        onDestroy() {
          this.scope.dispose();
          this.generated.forEach(node => node.destroy());
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3b98e1a5a47a28798a74639ccd3b528cea07f153.js.map