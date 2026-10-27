System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Button, Component, Label, sys, Scope, SlotClient, formatAmount, CommandClient, FetchTransport, AwardController, ReelController, assertLayoutMatches, PersistentPendingStore, SpecialGameRouter, delay, CocosReelColumn, CocosSpecialPanel, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _crd, ccclass, property, CocosSlotDriver;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfScope(extras) {
    _reporterNs.report("Scope", "../events", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSlotClient(extras) {
    _reporterNs.report("SlotClient", "../host", _context.meta, extras);
  }

  function _reportPossibleCrUseOfformatAmount(extras) {
    _reporterNs.report("formatAmount", "../money", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCommandClient(extras) {
    _reporterNs.report("CommandClient", "../network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFetchTransport(extras) {
    _reporterNs.report("FetchTransport", "../network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAwardController(extras) {
    _reporterNs.report("AwardController", "../presentation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAwardView(extras) {
    _reporterNs.report("AwardView", "../presentation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfReelController(extras) {
    _reporterNs.report("ReelController", "../presentation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfReelView(extras) {
    _reporterNs.report("ReelView", "../presentation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfassertLayoutMatches(extras) {
    _reporterNs.report("assertLayoutMatches", "../presentation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPersistentPendingStore(extras) {
    _reporterNs.report("PersistentPendingStore", "../storage", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialGameRouter(extras) {
    _reporterNs.report("SpecialGameRouter", "../special", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdelay(extras) {
    _reporterNs.report("delay", "../timing", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCocosReelColumn(extras) {
    _reporterNs.report("CocosReelColumn", "./CocosReelColumn", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCocosSpecialPanel(extras) {
    _reporterNs.report("CocosSpecialPanel", "./CocosSpecialPanel", _context.meta, extras);
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
      Component = _cc.Component;
      Label = _cc.Label;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      Scope = _unresolved_2.Scope;
    }, function (_unresolved_3) {
      SlotClient = _unresolved_3.SlotClient;
    }, function (_unresolved_4) {
      formatAmount = _unresolved_4.formatAmount;
    }, function (_unresolved_5) {
      CommandClient = _unresolved_5.CommandClient;
      FetchTransport = _unresolved_5.FetchTransport;
    }, function (_unresolved_6) {
      AwardController = _unresolved_6.AwardController;
      ReelController = _unresolved_6.ReelController;
      assertLayoutMatches = _unresolved_6.assertLayoutMatches;
    }, function (_unresolved_7) {
      PersistentPendingStore = _unresolved_7.PersistentPendingStore;
    }, function (_unresolved_8) {
      SpecialGameRouter = _unresolved_8.SpecialGameRouter;
    }, function (_unresolved_9) {
      delay = _unresolved_9.delay;
    }, function (_unresolved_10) {
      CocosReelColumn = _unresolved_10.CocosReelColumn;
    }, function (_unresolved_11) {
      CocosSpecialPanel = _unresolved_11.CocosSpecialPanel;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "94a46EeY0lNNLQeHfLY8bMc", "CocosSlotDriver", undefined);

      __checkObsolete__(['_decorator', 'Button', 'Component', 'Label', 'sys']);

      ({
        ccclass,
        property
      } = _decorator);
      /** H5 bridge. Scene references must be bound and validated inside Creator 3.8.8. */

      _export("CocosSlotDriver", CocosSlotDriver = (_dec = ccclass('AISlotDriver'), _dec2 = property([_crd && CocosReelColumn === void 0 ? (_reportPossibleCrUseOfCocosReelColumn({
        error: Error()
      }), CocosReelColumn) : CocosReelColumn]), _dec3 = property([_crd && CocosSpecialPanel === void 0 ? (_reportPossibleCrUseOfCocosSpecialPanel({
        error: Error()
      }), CocosSpecialPanel) : CocosSpecialPanel]), _dec4 = property(Button), _dec5 = property(Button), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(Label), _dec(_class = (_class2 = class CocosSlotDriver extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "endpoint", _descriptor, this);

          _initializerDefineProperty(this, "playerId", _descriptor2, this);

          _initializerDefineProperty(this, "gameId", _descriptor3, this);

          _initializerDefineProperty(this, "autoConnect", _descriptor4, this);

          _initializerDefineProperty(this, "columns", _descriptor5, this);

          _initializerDefineProperty(this, "specialPanels", _descriptor6, this);

          _initializerDefineProperty(this, "spinButton", _descriptor7, this);

          _initializerDefineProperty(this, "skipButton", _descriptor8, this);

          _initializerDefineProperty(this, "balanceLabel", _descriptor9, this);

          _initializerDefineProperty(this, "winLabel", _descriptor10, this);

          _initializerDefineProperty(this, "statusLabel", _descriptor11, this);

          this.client = null;
          this.scope = new (_crd && Scope === void 0 ? (_reportPossibleCrUseOfScope({
            error: Error()
          }), Scope) : Scope)();
        }

        onLoad() {
          const view = {
            begin: strips => this.columns.forEach((column, index) => {
              var _strips$index;

              return column.begin((_strips$index = strips[index]) != null ? _strips$index : []);
            }),
            stopReel: async (index, symbols, signal) => {
              const column = this.columns[index];
              if (!column) throw new Error('Missing reel column');
              await column.stopAt(symbols, signal);
            },
            snap: board => {
              if (board.length !== this.columns.length) throw new Error('Scene reel count differs from server');
              this.columns.forEach((column, index) => column.snap(board[index]));
            },
            cancel: () => this.columns.forEach(column => column.cancel())
          };
          const award = {
            show: async (snapshot, signal) => {
              if (this.winLabel) this.winLabel.string = (_crd && formatAmount === void 0 ? (_reportPossibleCrUseOfformatAmount({
                error: Error()
              }), formatAmount) : formatAmount)(snapshot.lastWin);
              this.node.emit('slot-award-start', snapshot);
              await (_crd && delay === void 0 ? (_reportPossibleCrUseOfdelay({
                error: Error()
              }), delay) : delay)(snapshot.winType >= 4 ? 1000 : 650, signal);
            },
            finish: snapshot => {
              if (this.winLabel) this.winLabel.string = (_crd && formatAmount === void 0 ? (_reportPossibleCrUseOfformatAmount({
                error: Error()
              }), formatAmount) : formatAmount)(snapshot.lastWin);
              this.node.emit('slot-award-finish', snapshot);
            }
          };
          const router = new (_crd && SpecialGameRouter === void 0 ? (_reportPossibleCrUseOfSpecialGameRouter({
            error: Error()
          }), SpecialGameRouter) : SpecialGameRouter)();
          this.specialPanels.forEach(panel => {
            panel.node.active = false;
            router.register(panel);
          });
          const store = new (_crd && PersistentPendingStore === void 0 ? (_reportPossibleCrUseOfPersistentPendingStore({
            error: Error()
          }), PersistentPendingStore) : PersistentPendingStore)(sys.localStorage, `slot-pending:${this.gameId}:${this.playerId}`);
          const network = new (_crd && CommandClient === void 0 ? (_reportPossibleCrUseOfCommandClient({
            error: Error()
          }), CommandClient) : CommandClient)(new (_crd && FetchTransport === void 0 ? (_reportPossibleCrUseOfFetchTransport({
            error: Error()
          }), FetchTransport) : FetchTransport)(this.endpoint), store, {
            gameId: this.gameId,
            playerId: this.playerId
          });
          this.client = new (_crd && SlotClient === void 0 ? (_reportPossibleCrUseOfSlotClient({
            error: Error()
          }), SlotClient) : SlotClient)(network, new (_crd && ReelController === void 0 ? (_reportPossibleCrUseOfReelController({
            error: Error()
          }), ReelController) : ReelController)(view), new (_crd && AwardController === void 0 ? (_reportPossibleCrUseOfAwardController({
            error: Error()
          }), AwardController) : AwardController)(award), router);
          this.scope.add(this.client.events.on('input', input => {
            if (this.spinButton) this.spinButton.interactable = input.canSpin;
          }));
          this.scope.add(this.client.events.on('state', state => {
            if (this.statusLabel) this.statusLabel.string = state;
          }));
          this.scope.add(this.client.events.on('settled', snapshot => {
            var _this$columns$0$cells, _this$columns$;

            (_crd && assertLayoutMatches === void 0 ? (_reportPossibleCrUseOfassertLayoutMatches({
              error: Error()
            }), assertLayoutMatches) : assertLayoutMatches)(snapshot.layout, this.columns.length, (_this$columns$0$cells = (_this$columns$ = this.columns[0]) == null ? void 0 : _this$columns$.cells.length) != null ? _this$columns$0$cells : 0);
            if (this.balanceLabel) this.balanceLabel.string = (_crd && formatAmount === void 0 ? (_reportPossibleCrUseOfformatAmount({
              error: Error()
            }), formatAmount) : formatAmount)(snapshot.balance);
            this.node.emit('slot-settled', snapshot);
          }));
          this.scope.add(this.client.events.on('error', error => this.node.emit('slot-error', error)));

          if (this.spinButton) {
            this.spinButton.interactable = false;
            this.spinButton.node.on(Button.EventType.CLICK, this.spin, this);
            this.scope.add(() => {
              var _this$spinButton;

              return (_this$spinButton = this.spinButton) == null ? void 0 : _this$spinButton.node.off(Button.EventType.CLICK, this.spin, this);
            });
          }

          if (this.skipButton) {
            this.skipButton.node.on(Button.EventType.CLICK, this.skip, this);
            this.scope.add(() => {
              var _this$skipButton;

              return (_this$skipButton = this.skipButton) == null ? void 0 : _this$skipButton.node.off(Button.EventType.CLICK, this.skip, this);
            });
          }
        }

        start() {
          if (this.autoConnect) void this.reconnect();
        }

        async reconnect() {
          try {
            var _this$client;

            await ((_this$client = this.client) == null ? void 0 : _this$client.connect());
          } catch (error) {
            this.node.emit('slot-error', error);
          }
        }

        async spin() {
          try {
            var _this$client2;

            await ((_this$client2 = this.client) == null ? void 0 : _this$client2.spin());
          } catch (error) {
            this.node.emit('slot-error', error);
          }
        }

        skip() {
          var _this$client3;

          (_this$client3 = this.client) == null || _this$client3.skip();
        }

        chooseBet(lineBet) {
          var _this$client4;

          (_this$client4 = this.client) == null || _this$client4.chooseBet(lineBet);
        }

        async nextSpecial(data = null) {
          try {
            var _this$client5;

            await ((_this$client5 = this.client) == null ? void 0 : _this$client5.nextSpecial(data));
          } catch (error) {
            this.node.emit('slot-error', error);
          }
        }

        onDestroy() {
          try {
            this.scope.dispose();
          } finally {
            var _this$client6;

            (_this$client6 = this.client) == null || _this$client6.dispose();
            this.client = null;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "endpoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'http://127.0.0.1:8080/api/v1/game/command';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "playerId", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'local-player';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "gameId", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'GoldenHen';
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "autoConnect", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "columns", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "specialPanels", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "spinButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "skipButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "balanceLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "winLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec8], {
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
//# sourceMappingURL=015da9225ac61458d2c62fcd081d70d8c5696b9d.js.map