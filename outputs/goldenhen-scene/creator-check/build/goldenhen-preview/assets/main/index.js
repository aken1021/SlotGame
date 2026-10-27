System.register("chunks:///_virtual/autospin.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './model.ts', './timing.ts'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy, ClientError, throwIfAborted;
  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ClientError = module.ClientError;
    }, function (module) {
      throwIfAborted = module.throwIfAborted;
    }],
    execute: function () {
      cclegacy._RF.push({}, "46662GBfypFC57iVcA0lKvI", "autospin", undefined);

      /** Never automatically retries an uncertain spin or advances an unknown special game. */
      var AutoSpinController = exports('AutoSpinController', /*#__PURE__*/function () {
        function AutoSpinController(client) {
          this.active = false;
          this.stopped = false;
          this.client = client;
        }
        var _proto = AutoSpinController.prototype;
        _proto.stop = function stop() {
          this.stopped = true;
        };
        _proto.run = /*#__PURE__*/function () {
          var _run = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(count, signal) {
            var lease, completed;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!this.active) {
                    _context.next = 2;
                    break;
                  }
                  throw new ClientError('Auto spin already active', 'BUSY');
                case 2:
                  if (!(!Number.isSafeInteger(count) || count < 1 || count > 10000)) {
                    _context.next = 4;
                    break;
                  }
                  throw new RangeError('Invalid auto spin count');
                case 4:
                  lease = this.client.acquireAutoSpin();
                  this.active = true;
                  this.stopped = false;
                  completed = 0;
                  _context.prev = 8;
                case 9:
                  if (!(completed < count && !this.stopped)) {
                    _context.next = 20;
                    break;
                  }
                  throwIfAborted(signal);
                  if (lease.canSpin()) {
                    _context.next = 13;
                    break;
                  }
                  return _context.abrupt("break", 20);
                case 13:
                  _context.next = 15;
                  return lease.spin();
                case 15:
                  completed++;
                  if (!(this.client.state !== 'ready')) {
                    _context.next = 18;
                    break;
                  }
                  return _context.abrupt("break", 20);
                case 18:
                  _context.next = 9;
                  break;
                case 20:
                  return _context.abrupt("return", completed);
                case 21:
                  _context.prev = 21;
                  this.active = false;
                  lease.release();
                  return _context.finish(21);
                case 25:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[8,, 21, 25]]);
          }));
          function run(_x, _x2) {
            return _run.apply(this, arguments);
          }
          return run;
        }();
        return AutoSpinController;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CocosReelColumn.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './presentation.ts', './timing.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, Label, Sprite, CCInteger, SpriteFrame, CCString, Component, ReelMotion, throwIfAborted, delay;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Sprite = module.Sprite;
      CCInteger = module.CCInteger;
      SpriteFrame = module.SpriteFrame;
      CCString = module.CCString;
      Component = module.Component;
    }, function (module) {
      ReelMotion = module.ReelMotion;
    }, function (module) {
      throwIfAborted = module.throwIfAborted;
      delay = module.delay;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;
      cclegacy._RF.push({}, "f2dc8kNjBVAT4h8O5oJI188", "CocosReelColumn", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /** Label placeholders can be replaced by symbol sprites without changing the common flow. */
      var CocosReelColumn = exports('CocosReelColumn', (_dec = ccclass('AISlotReelColumn'), _dec2 = property([Label]), _dec3 = property([Sprite]), _dec4 = property([CCInteger]), _dec5 = property([SpriteFrame]), _dec6 = property([CCString]), _dec7 = property(Label), _dec8 = property(Sprite), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(CocosReelColumn, _Component);
        function CocosReelColumn() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "cells", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "symbolSprites", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "symbolIds", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "symbolFrames", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "symbolNames", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "bufferCell", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "bufferSprite", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "speed", _descriptor8, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "cellHeight", _descriptor9, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "stopDuration", _descriptor10, _assertThisInitialized(_this));
          _this.motion = null;
          _this.homes = [];
          _this.bufferHome = null;
          return _this;
        }
        var _proto = CocosReelColumn.prototype;
        _proto.begin = function begin(strip) {
          this.homes = this.cells.map(function (cell) {
            return {
              x: cell.node.position.x,
              y: cell.node.position.y,
              z: cell.node.position.z
            };
          });
          if (this.bufferCell) {
            var p = this.bufferCell.node.position;
            this.bufferHome = {
              x: p.x,
              y: p.y,
              z: p.z
            };
            this.bufferCell.node.active = true;
          }
          this.motion = new ReelMotion(strip, this.cellHeight, this.speed);
        };
        _proto.update = function update(dt) {
          var _this2 = this;
          if (!this.motion || !this.cells.length) return;
          var frame = this.motion.tick(dt, this.cells.length);
          this.cells.forEach(function (cell, index) {
            _this2.renderSymbol(cell, _this2.symbolSprites[index], frame.symbols[_this2.cells.length - 1 - index]);
            var home = _this2.homes[index];
            if (home) cell.node.setPosition(home.x, home.y - frame.offset, home.z);
          });
          if (this.bufferCell && this.bufferHome) {
            var _this$bufferSprite;
            this.renderSymbol(this.bufferCell, (_this$bufferSprite = this.bufferSprite) != null ? _this$bufferSprite : undefined, frame.symbols[this.cells.length]);
            this.bufferCell.node.setPosition(this.bufferHome.x, this.bufferHome.y - frame.offset, this.bufferHome.z);
          }
        };
        _proto.stopAt = /*#__PURE__*/function () {
          var _stopAt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(symbols, signal) {
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return delay(this.stopDuration * 1000, signal);
                case 2:
                  throwIfAborted(signal);
                  this.snap(symbols);
                case 4:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function stopAt(_x, _x2) {
            return _stopAt.apply(this, arguments);
          }
          return stopAt;
        }();
        _proto.snap = function snap(symbols) {
          var _this3 = this;
          this.cancel();
          if (symbols.length !== this.cells.length) throw new Error('Reel visible row count differs from scene labels');
          this.cells.forEach(function (cell, index) {
            return _this3.renderSymbol(cell, _this3.symbolSprites[index], symbols[index]);
          });
        };
        _proto.cancel = function cancel() {
          var _this4 = this;
          this.motion = null;
          this.cells.forEach(function (cell, index) {
            var home = _this4.homes[index];
            if (home) cell.node.setPosition(home.x, home.y, home.z);
          });
          this.homes = [];
          if (this.bufferCell) {
            if (this.bufferHome) this.bufferCell.node.setPosition(this.bufferHome.x, this.bufferHome.y, this.bufferHome.z);
            this.bufferCell.node.active = false;
          }
          this.bufferHome = null;
        };
        _proto.renderSymbol = function renderSymbol(label, sprite, id) {
          var index = this.symbolIds.indexOf(id);
          var frame = this.symbolFrames[index];
          label.string = this.symbolNames[index] || String(id);
          label.enabled = !sprite || !frame;
          if (sprite) {
            sprite.enabled = !!frame;
            if (frame) sprite.spriteFrame = frame;
          }
        };
        _proto.onDestroy = function onDestroy() {
          this.cancel();
        };
        return CocosReelColumn;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cells", [_dec2], {
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
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CocosSlotDriver.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './events.ts', './host.ts', './money.ts', './network.ts', './presentation.ts', './storage.ts', './special.ts', './timing.ts', './CocosReelColumn.ts', './CocosSpecialPanel.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, Button, Label, sys, Component, Scope, SlotClient, formatAmount, CommandClient, FetchTransport, ReelController, AwardController, assertLayoutMatches, PersistentPendingStore, SpecialGameRouter, delay, CocosReelColumn, CocosSpecialPanel;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Button = module.Button;
      Label = module.Label;
      sys = module.sys;
      Component = module.Component;
    }, function (module) {
      Scope = module.Scope;
    }, function (module) {
      SlotClient = module.SlotClient;
    }, function (module) {
      formatAmount = module.formatAmount;
    }, function (module) {
      CommandClient = module.CommandClient;
      FetchTransport = module.FetchTransport;
    }, function (module) {
      ReelController = module.ReelController;
      AwardController = module.AwardController;
      assertLayoutMatches = module.assertLayoutMatches;
    }, function (module) {
      PersistentPendingStore = module.PersistentPendingStore;
    }, function (module) {
      SpecialGameRouter = module.SpecialGameRouter;
    }, function (module) {
      delay = module.delay;
    }, function (module) {
      CocosReelColumn = module.CocosReelColumn;
    }, function (module) {
      CocosSpecialPanel = module.CocosSpecialPanel;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11;
      cclegacy._RF.push({}, "94a46EeY0lNNLQeHfLY8bMc", "CocosSlotDriver", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /** H5 bridge. Scene references must be bound and validated inside Creator 3.8.8. */
      var CocosSlotDriver = exports('CocosSlotDriver', (_dec = ccclass('AISlotDriver'), _dec2 = property([CocosReelColumn]), _dec3 = property([CocosSpecialPanel]), _dec4 = property(Button), _dec5 = property(Button), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(CocosSlotDriver, _Component);
        function CocosSlotDriver() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "endpoint", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "playerId", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "gameId", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "autoConnect", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "columns", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "specialPanels", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "spinButton", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "skipButton", _descriptor8, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "balanceLabel", _descriptor9, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "winLabel", _descriptor10, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "statusLabel", _descriptor11, _assertThisInitialized(_this));
          _this.client = null;
          _this.scope = new Scope();
          return _this;
        }
        var _proto = CocosSlotDriver.prototype;
        _proto.onLoad = function onLoad() {
          var _this2 = this;
          var view = {
            begin: function begin(strips) {
              return _this2.columns.forEach(function (column, index) {
                var _strips$index;
                return column.begin((_strips$index = strips[index]) != null ? _strips$index : []);
              });
            },
            stopReel: function () {
              var _stopReel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(index, symbols, signal) {
                var column;
                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      column = _this2.columns[index];
                      if (column) {
                        _context.next = 3;
                        break;
                      }
                      throw new Error('Missing reel column');
                    case 3:
                      _context.next = 5;
                      return column.stopAt(symbols, signal);
                    case 5:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }));
              function stopReel(_x, _x2, _x3) {
                return _stopReel.apply(this, arguments);
              }
              return stopReel;
            }(),
            snap: function snap(board) {
              if (board.length !== _this2.columns.length) throw new Error('Scene reel count differs from server');
              _this2.columns.forEach(function (column, index) {
                return column.snap(board[index]);
              });
            },
            cancel: function cancel() {
              return _this2.columns.forEach(function (column) {
                return column.cancel();
              });
            }
          };
          var award = {
            show: function () {
              var _show = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(snapshot, signal) {
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      if (_this2.winLabel) _this2.winLabel.string = formatAmount(snapshot.lastWin);
                      _this2.node.emit('slot-award-start', snapshot);
                      _context2.next = 4;
                      return delay(snapshot.winType >= 4 ? 1000 : 650, signal);
                    case 4:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              }));
              function show(_x4, _x5) {
                return _show.apply(this, arguments);
              }
              return show;
            }(),
            finish: function finish(snapshot) {
              if (_this2.winLabel) _this2.winLabel.string = formatAmount(snapshot.lastWin);
              _this2.node.emit('slot-award-finish', snapshot);
            }
          };
          var router = new SpecialGameRouter();
          this.specialPanels.forEach(function (panel) {
            panel.node.active = false;
            router.register(panel);
          });
          var store = new PersistentPendingStore(sys.localStorage, "slot-pending:" + this.gameId + ":" + this.playerId);
          var network = new CommandClient(new FetchTransport(this.endpoint), store, {
            gameId: this.gameId,
            playerId: this.playerId
          });
          this.client = new SlotClient(network, new ReelController(view), new AwardController(award), router);
          this.scope.add(this.client.events.on('input', function (input) {
            if (_this2.spinButton) _this2.spinButton.interactable = input.canSpin;
          }));
          this.scope.add(this.client.events.on('state', function (state) {
            if (_this2.statusLabel) _this2.statusLabel.string = state;
          }));
          this.scope.add(this.client.events.on('settled', function (snapshot) {
            var _this2$columns$0$cell, _this2$columns$;
            assertLayoutMatches(snapshot.layout, _this2.columns.length, (_this2$columns$0$cell = (_this2$columns$ = _this2.columns[0]) == null ? void 0 : _this2$columns$.cells.length) != null ? _this2$columns$0$cell : 0);
            if (_this2.balanceLabel) _this2.balanceLabel.string = formatAmount(snapshot.balance);
            _this2.node.emit('slot-settled', snapshot);
          }));
          this.scope.add(this.client.events.on('error', function (error) {
            return _this2.node.emit('slot-error', error);
          }));
          if (this.spinButton) {
            this.spinButton.interactable = false;
            this.spinButton.node.on(Button.EventType.CLICK, this.spin, this);
            this.scope.add(function () {
              var _this2$spinButton;
              return (_this2$spinButton = _this2.spinButton) == null ? void 0 : _this2$spinButton.node.off(Button.EventType.CLICK, _this2.spin, _this2);
            });
          }
          if (this.skipButton) {
            this.skipButton.node.on(Button.EventType.CLICK, this.skip, this);
            this.scope.add(function () {
              var _this2$skipButton;
              return (_this2$skipButton = _this2.skipButton) == null ? void 0 : _this2$skipButton.node.off(Button.EventType.CLICK, _this2.skip, _this2);
            });
          }
        };
        _proto.start = function start() {
          if (this.autoConnect) void this.reconnect();
        };
        _proto.reconnect = /*#__PURE__*/function () {
          var _reconnect = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
            var _this$client;
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.prev = 0;
                  _context3.next = 3;
                  return (_this$client = this.client) == null ? void 0 : _this$client.connect();
                case 3:
                  _context3.next = 8;
                  break;
                case 5:
                  _context3.prev = 5;
                  _context3.t0 = _context3["catch"](0);
                  this.node.emit('slot-error', _context3.t0);
                case 8:
                case "end":
                  return _context3.stop();
              }
            }, _callee3, this, [[0, 5]]);
          }));
          function reconnect() {
            return _reconnect.apply(this, arguments);
          }
          return reconnect;
        }();
        _proto.spin = /*#__PURE__*/function () {
          var _spin = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
            var _this$client2;
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.prev = 0;
                  _context4.next = 3;
                  return (_this$client2 = this.client) == null ? void 0 : _this$client2.spin();
                case 3:
                  _context4.next = 8;
                  break;
                case 5:
                  _context4.prev = 5;
                  _context4.t0 = _context4["catch"](0);
                  this.node.emit('slot-error', _context4.t0);
                case 8:
                case "end":
                  return _context4.stop();
              }
            }, _callee4, this, [[0, 5]]);
          }));
          function spin() {
            return _spin.apply(this, arguments);
          }
          return spin;
        }();
        _proto.skip = function skip() {
          var _this$client3;
          (_this$client3 = this.client) == null || _this$client3.skip();
        };
        _proto.chooseBet = function chooseBet(lineBet) {
          var _this$client4;
          (_this$client4 = this.client) == null || _this$client4.chooseBet(lineBet);
        };
        _proto.nextSpecial = /*#__PURE__*/function () {
          var _nextSpecial = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
            var _this$client5;
            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  if (data === void 0) {
                    data = null;
                  }
                  _context5.prev = 1;
                  _context5.next = 4;
                  return (_this$client5 = this.client) == null ? void 0 : _this$client5.nextSpecial(data);
                case 4:
                  _context5.next = 9;
                  break;
                case 6:
                  _context5.prev = 6;
                  _context5.t0 = _context5["catch"](1);
                  this.node.emit('slot-error', _context5.t0);
                case 9:
                case "end":
                  return _context5.stop();
              }
            }, _callee5, this, [[1, 6]]);
          }));
          function nextSpecial(_x6) {
            return _nextSpecial.apply(this, arguments);
          }
          return nextSpecial;
        }();
        _proto.onDestroy = function onDestroy() {
          try {
            this.scope.dispose();
          } finally {
            var _this$client6;
            (_this$client6 = this.client) == null || _this$client6.dispose();
            this.client = null;
          }
        };
        return CocosSlotDriver;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "endpoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'http://127.0.0.1:8080/api/v1/game/command';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "playerId", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'local-player';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "gameId", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'GoldenHen';
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "autoConnect", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "columns", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "specialPanels", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "spinButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "skipButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "balanceLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "winLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CocosSpecialPanel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, Label, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "2c4beQliyxONIYsWdJ2v09P", "CocosSpecialPanel", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /** Register one panel per server special ID. Game scripts subscribe to the semantic events. */
      var CocosSpecialPanel = exports('CocosSpecialPanel', (_dec = ccclass('AISlotSpecialPanel'), _dec2 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(CocosSpecialPanel, _Component);
        function CocosSpecialPanel() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "id", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "counter", _descriptor2, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = CocosSpecialPanel.prototype;
        _proto.enter = /*#__PURE__*/function () {
          var _enter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(state, snapshot) {
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  this.node.active = true;
                  this.render(state);
                  this.node.emit('slot-special-enter', state, snapshot);
                case 3:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function enter(_x, _x2) {
            return _enter.apply(this, arguments);
          }
          return enter;
        }();
        _proto.updateState = /*#__PURE__*/function () {
          var _updateState = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(state, snapshot) {
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  this.render(state);
                  this.node.emit('slot-special-update', state, snapshot);
                case 2:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this);
          }));
          function updateState(_x3, _x4) {
            return _updateState.apply(this, arguments);
          }
          return updateState;
        }();
        _proto.exit = /*#__PURE__*/function () {
          var _exit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  this.node.emit('slot-special-exit');
                  this.node.active = false;
                case 2:
                case "end":
                  return _context3.stop();
              }
            }, _callee3, this);
          }));
          function exit() {
            return _exit.apply(this, arguments);
          }
          return exit;
        }();
        _proto.dispose = function dispose() {
          this.node.active = false;
        };
        _proto.render = function render(state) {
          var _state$total;
          if (this.counter) this.counter.string = state.remaining === null ? '' : ((_state$total = state.total) != null ? _state$total : 0) - state.remaining + "/" + state.total;
        };
        return CocosSpecialPanel;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "counter", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/events.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2629050mndNM4qQk0nKoWrp", "events", undefined);
      /** Scoped subscriptions; observer exceptions never change a settled game action. */
      var EventBus = exports('EventBus', /*#__PURE__*/function () {
        function EventBus() {
          this.listeners = new Map();
        }
        var _proto = EventBus.prototype;
        _proto.on = function on(key, listener) {
          var _this = this;
          var group = this.listeners.get(key);
          if (!group) {
            group = new Set();
            this.listeners.set(key, group);
          }
          var entry = listener;
          group.add(entry);
          var subscribed = true;
          return function () {
            if (!subscribed) return;
            subscribed = false;
            group["delete"](entry);
            if (!group.size && _this.listeners.get(key) === group) _this.listeners["delete"](key);
          };
        };
        _proto.once = function once(key, listener) {
          var off = this.on(key, function (value) {
            off();
            listener(value);
          });
          return off;
        };
        _proto.emit = function emit(key, value) {
          var errors = [];
          for (var _i = 0, _arr = [].concat((_this$listeners$get = this.listeners.get(key)) != null ? _this$listeners$get : []); _i < _arr.length; _i++) {
            var _this$listeners$get;
            var listener = _arr[_i];
            try {
              listener(value);
            } catch (error) {
              errors.push(error);
            }
          }
          return errors;
        };
        _proto.clear = function clear() {
          this.listeners.clear();
        };
        return EventBus;
      }());
      var Scope = exports('Scope', /*#__PURE__*/function () {
        function Scope() {
          this.callbacks = [];
          this.closed = false;
        }
        var _proto2 = Scope.prototype;
        _proto2.add = function add(dispose) {
          if (this.closed) dispose();else this.callbacks.push(dispose);
        };
        _proto2.dispose = function dispose() {
          if (this.closed) return;
          this.closed = true;
          var errors = [];
          for (var _iterator = _createForOfIteratorHelperLoose(this.callbacks.splice(0).reverse()), _step; !(_step = _iterator()).done;) {
            var callback = _step.value;
            try {
              callback();
            } catch (error) {
              errors.push(error);
            }
          }
          if (errors.length) throw new Error("Scope cleanup failed (" + errors.length + ")");
        };
        return Scope;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GoldenHenGameControls.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './CocosSlotDriver.ts', './money.ts', './events.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Graphics, Color, Label, Node, UITransform, Button, Component, CocosSlotDriver, formatAmount, Scope;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Graphics = module.Graphics;
      Color = module.Color;
      Label = module.Label;
      Node = module.Node;
      UITransform = module.UITransform;
      Button = module.Button;
      Component = module.Component;
    }, function (module) {
      CocosSlotDriver = module.CocosSlotDriver;
    }, function (module) {
      formatAmount = module.formatAmount;
    }, function (module) {
      Scope = module.Scope;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "0c554vBUm1NFYTnxGRFCiur", "GoldenHenGameControls", undefined);
      var ccclass = _decorator.ccclass;

      /** Minimal local-development controls. Decisions and payouts remain on the Go server. */
      var GoldenHenGameControls = exports('GoldenHenGameControls', (_dec = ccclass('GoldenHenGameControls'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GoldenHenGameControls, _Component);
        function GoldenHenGameControls() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.scope = new Scope();
          _this.driver = null;
          _this.overlay = null;
          _this.title = null;
          _this.advance = null;
          _this.bet = null;
          _this.betText = null;
          _this.eggs = [];
          _this.eggLabels = [];
          _this.generated = [];
          return _this;
        }
        var _proto = GoldenHenGameControls.prototype;
        _proto.start = function start() {
          var _this$driver,
            _this2 = this;
          this.driver = this.getComponent(CocosSlotDriver);
          var client = (_this$driver = this.driver) == null ? void 0 : _this$driver.client;
          if (!client) throw new Error('GoldenHen controls require an initialized AISlotDriver');
          var bet = this.button(this.node, 'ChangeBet', -365, -255, 240, 34, '切換押注', function () {
            var _this2$driver;
            var state = client.snapshot;
            if (!state || !client.input.canChangeBet) return;
            var index = state.bets.findIndex(function (b) {
              var _client$selectedBet;
              return b.lineBet === ((_client$selectedBet = client.selectedBet) == null ? void 0 : _client$selectedBet.lineBet);
            });
            var next = state.bets[(index + 1) % state.bets.length];
            if (next) (_this2$driver = _this2.driver) == null || _this2$driver.chooseBet(next.lineBet);
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
          var advance = this.button(this.overlay, 'NextSpecial', 0, -35, 300, 65, '開始', function () {
            var _this2$driver2;
            void ((_this2$driver2 = _this2.driver) == null ? void 0 : _this2$driver2.nextSpecial(null));
          });
          this.advance = advance.button;
          var _loop = function _loop(i) {
            var egg = _this2.button(_this2.overlay, "Egg_" + i, (i % 6 - 2.5) * 145, 85 - Math.floor(i / 6) * 100, 125, 78, "\u91D1\u86CB " + (i + 1), function () {
              var _this2$driver4;
              void ((_this2$driver4 = _this2.driver) == null ? void 0 : _this2$driver4.nextSpecial({
                '1': i
              }));
            });
            _this2.eggs.push(egg.button);
            _this2.eggLabels.push(egg.label);
          };
          for (var i = 0; i < 18; i++) {
            _loop(i);
          }
          this.overlay.active = false;
          var render = function render() {
            return _this2.render(client.snapshot);
          };
          this.scope.add(client.events.on('state', render));
          this.scope.add(client.events.on('settled', render));
          this.scope.add(client.events.on('bet', render));
          this.scope.add(client.events.on('input', render));
          this.scope.add(client.events.on('error', function (error) {
            var _this2$driver3;
            var status = (_this2$driver3 = _this2.driver) == null ? void 0 : _this2$driver3.statusLabel;
            if (status) status.string = "\u9023\u7DDA\uFF0F\u64CD\u4F5C\u5931\u6557\uFF1A" + (error instanceof Error ? error.message : String(error)) + " \xB7 \u6309\u9023\u7DDA\u91CD\u8A66";
          }));
          render();
        };
        _proto.render = function render(snapshot) {
          var _this$driver2,
            _this$advance$node$ge,
            _this3 = this;
          var client = (_this$driver2 = this.driver) == null ? void 0 : _this$driver2.client;
          if (!client || !this.overlay || !this.advance || !this.title || !this.bet || !this.betText) return;
          this.bet.interactable = client.input.canChangeBet;
          this.betText.string = client.selectedBet ? "\u62BC\u6CE8 " + formatAmount(client.selectedBet.totalBet) + " \xB7 \u5207\u63DB" : '等待連線';
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
          this.eggs.forEach(function (egg, index) {
            var _sg$picks$index, _sg$picks, _tier;
            egg.node.active = sg.id === 1 && sg.stage !== 'init';
            var tier = (_sg$picks$index = (_sg$picks = sg.picks) == null ? void 0 : _sg$picks[index]) != null ? _sg$picks$index : -1;
            egg.interactable = actionable && tier === -1;
            var label = _this3.eggLabels[index];
            if (label) label.string = tier < 0 ? "\u91D1\u86CB " + (index + 1) : (_tier = ['GRAND', 'MAJOR', 'MINOR', 'MINI'][tier]) != null ? _tier : '?';
          });
        };
        _proto.makeNode = function makeNode(parent, name, x, y, w, h) {
          var node = new Node(name);
          node.layer = parent.layer;
          node.setParent(parent);
          node.setPosition(x, y);
          node.addComponent(UITransform).setContentSize(w, h);
          return node;
        };
        _proto.text = function text(parent, name, x, y, w, h, value, size) {
          var label = this.makeNode(parent, name, x, y, w, h).addComponent(Label);
          label.string = value;
          label.fontSize = size;
          label.lineHeight = size + 4;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          label.color = new Color(255, 222, 151);
          return label;
        };
        _proto.button = function button(parent, name, x, y, w, h, text, onClick) {
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
            node: node,
            button: button,
            label: label
          };
        };
        _proto.onDestroy = function onDestroy() {
          this.scope.dispose();
          this.generated.forEach(function (node) {
            return node.destroy();
          });
        };
        return GoldenHenGameControls;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GoldenHenReelSkin.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './CocosReelColumn.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, SpriteFrame, view, ResolutionPolicy, Rect, Component, CocosReelColumn;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      view = module.view;
      ResolutionPolicy = module.ResolutionPolicy;
      Rect = module.Rect;
      Component = module.Component;
    }, function (module) {
      CocosReelColumn = module.CocosReelColumn;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "28698xfCN5JvYpkG/j9Vy7B", "GoldenHenReelSkin", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property,
        executeInEditMode = _decorator.executeInEditMode,
        executionOrder = _decorator.executionOrder;

      /** Atlas rectangles are Cocos sprite frames; the original AI bitmap is never modified. */
      var GoldenHenReelSkin = exports('GoldenHenReelSkin', (_dec = ccclass('GoldenHenReelSkin'), _dec2 = executionOrder(-100), _dec3 = property(SpriteFrame), _dec4 = property([CocosReelColumn]), _dec(_class = executeInEditMode(_class = _dec2(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GoldenHenReelSkin, _Component);
        function GoldenHenReelSkin() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "sheet", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "columns", _descriptor2, _assertThisInitialized(_this));
          _this.frames = [];
          return _this;
        }
        var _proto = GoldenHenReelSkin.prototype;
        _proto.onLoad = function onLoad() {
          var _this$sheet,
            _this2 = this;
          if (!((_this$sheet = this.sheet) != null && _this$sheet.texture)) return;
          view.setDesignResolutionSize(1280, 720, ResolutionPolicy.SHOW_ALL);
          var texture = this.sheet.texture;
          var w = texture.width / 3,
            h = texture.height / 2;
          if (!Number.isInteger(w) || !Number.isInteger(h)) throw new Error('Symbol sheet must be a 3 by 2 grid');
          this.frames = Array.from({
            length: 6
          }, function (_, index) {
            var frame = new SpriteFrame();
            frame.texture = texture;
            // Exclude atlas tile edges where generated neighboring highlights can bleed.
            var inset = 32;
            frame.rect = new Rect(index % 3 * w + inset, Math.floor(index / 3) * h + inset, w - inset * 2, h - inset * 2);
            frame.packable = false;
            return frame;
          });
          var ids = [15, 16, 17, 18, 14, 1, 19, 20, 21, 22, 23, 24, 2, 10, 11, 12, 13];
          var names = ['', '', '', '', '', '', 'A', 'K', 'Q', 'J', '10', '9', 'SCATTER', '金雞(金)', '玉佩(金)', '元寶(金)', '鞭炮(金)'];
          var preview = [[15, 14, 17], [16, 1, 18], [14, 15, 16], [17, 18, 14], [1, 16, 15]];
          this.columns.forEach(function (column, index) {
            var _preview$index;
            column.symbolIds = [].concat(ids);
            column.symbolNames = [].concat(names);
            column.symbolFrames = _this2.frames;
            column.snap((_preview$index = preview[index]) != null ? _preview$index : [15, 16, 17]);
          });
        };
        _proto.onDestroy = function onDestroy() {
          this.columns.forEach(function (column) {
            column.symbolFrames = [];
          });
          this.frames.forEach(function (frame) {
            return frame.destroy();
          });
          this.frames = [];
        };
        return GoldenHenReelSkin;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sheet", [_dec3], {
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
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/host.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './model.ts', './events.ts', './network.ts', './protocol.ts', './special.ts', './money.ts'], function (exports) {
  var _createClass, _asyncToGenerator, _regeneratorRuntime, cclegacy, ClientError, EventBus, HttpError, decodeEnvelope, SpecialGameRouter, validateBet;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ClientError = module.ClientError;
    }, function (module) {
      EventBus = module.EventBus;
    }, function (module) {
      HttpError = module.HttpError;
    }, function (module) {
      decodeEnvelope = module.decodeEnvelope;
    }, function (module) {
      SpecialGameRouter = module.SpecialGameRouter;
    }, function (module) {
      validateBet = module.validateBet;
    }],
    execute: function () {
      cclegacy._RF.push({}, "58b573ormVLSa8eVK2nce0C", "host", undefined);
      var SlotClient = exports('SlotClient', /*#__PURE__*/function () {
        function SlotClient(network, reels, awards, specials, decode) {
          if (specials === void 0) {
            specials = new SpecialGameRouter();
          }
          if (decode === void 0) {
            decode = decodeEnvelope;
          }
          this.events = new EventBus();
          this.currentState = 'disconnected';
          this.current = null;
          this.lineBet = null;
          this.generation = 0;
          this.fast = false;
          this.automation = null;
          this.quickStopRequested = false;
          this.network = network;
          this.reels = reels;
          this.awards = awards;
          this.specials = specials;
          this.decode = decode;
        }
        var _proto = SlotClient.prototype;
        _proto.setFastMode = function setFastMode(value) {
          this.fast = value;
        };
        _proto.chooseBet = function chooseBet(lineBet) {
          if (!this.input.canChangeBet || !this.current) throw new ClientError('Bet controls locked', 'INVALID_STATE');
          // A larger offered bet can be selected even when balance is insufficient; spin remains disabled.
          var bet = this.current.bets.find(function (item) {
            return item.lineBet === lineBet;
          });
          if (!bet) throw new ClientError('Bet not offered', 'INVALID_BET');
          this.lineBet = lineBet;
          this.events.emit('bet', bet);
          this.events.emit('input', this.input);
        };
        _proto.connect = /*#__PURE__*/function () {
          var _connect = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
            var generation, pending, _this$current$version, _this$current, replay, response, snapshot;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (['disconnected', 'faulted', 'ready', 'special'].includes(this.state)) {
                    _context.next = 2;
                    break;
                  }
                  throw new ClientError('Cannot connect now', 'BUSY');
                case 2:
                  generation = ++this.generation;
                  pending = this.network.pending();
                  this.setState(pending ? 'recovering' : 'connecting');
                  _context.prev = 5;
                  if (!pending) {
                    _context.next = 11;
                    break;
                  }
                  _context.next = 9;
                  return this.network.replay();
                case 9:
                  replay = _context.sent;
                  this.accept(replay, generation);
                case 11:
                  _context.next = 13;
                  return this.network.execute('START_GAME', {}, (_this$current$version = (_this$current = this.current) == null ? void 0 : _this$current.version) != null ? _this$current$version : 0);
                case 13:
                  response = _context.sent;
                  snapshot = this.accept(response, generation);
                  this.reels.restore(snapshot);
                  _context.next = 18;
                  return this.specials.sync(snapshot);
                case 18:
                  this.assertAlive(generation);
                  this.ready(snapshot);
                  _context.next = 26;
                  break;
                case 22:
                  _context.prev = 22;
                  _context.t0 = _context["catch"](5);
                  this.fail(_context.t0, generation);
                  throw _context.t0;
                case 26:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[5, 22]]);
          }));
          function connect() {
            return _connect.apply(this, arguments);
          }
          return connect;
        }();
        _proto.spin = /*#__PURE__*/function () {
          var _spin = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(!this.input.canSpin || !this.current || this.lineBet === null)) {
                    _context2.next = 2;
                    break;
                  }
                  throw new ClientError('Spin unavailable', 'INVALID_STATE');
                case 2:
                  _context2.next = 4;
                  return this.spinInternal();
                case 4:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this);
          }));
          function spin() {
            return _spin.apply(this, arguments);
          }
          return spin;
        }();
        _proto.acquireAutoSpin = function acquireAutoSpin() {
          var _this = this;
          if (this.automation || !this.input.canSpin) throw new ClientError('Auto spin unavailable', 'INVALID_STATE');
          var owner = Symbol('autospin');
          this.automation = owner;
          this.events.emit('input', this.input);
          var canSpin = function canSpin() {
            return _this.automation === owner && _this.state === 'ready' && !!_this.selectedBet && !!_this.current && _this.selectedBet.totalBet <= _this.current.balance;
          };
          return {
            canSpin: canSpin,
            spin: function () {
              var _spin2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
                return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      if (canSpin()) {
                        _context3.next = 2;
                        break;
                      }
                      throw new ClientError('Auto spin unavailable', 'INVALID_STATE');
                    case 2:
                      _context3.next = 4;
                      return _this.spinInternal();
                    case 4:
                    case "end":
                      return _context3.stop();
                  }
                }, _callee3);
              }));
              function spin() {
                return _spin2.apply(this, arguments);
              }
              return spin;
            }(),
            release: function release() {
              if (_this.automation === owner) {
                _this.automation = null;
                _this.events.emit('input', _this.input);
              }
            }
          };
        };
        _proto.spinInternal = /*#__PURE__*/function () {
          var _spinInternal = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  if (!(!this.current || this.lineBet === null)) {
                    _context4.next = 2;
                    break;
                  }
                  throw new ClientError('Not initialized', 'INVALID_STATE');
                case 2:
                  validateBet(this.lineBet, this.current.bets, this.current.balance);
                  _context4.next = 5;
                  return this.perform('SPIN', {
                    line_bet: this.lineBet
                  }, true);
                case 5:
                case "end":
                  return _context4.stop();
              }
            }, _callee4, this);
          }));
          function spinInternal() {
            return _spinInternal.apply(this, arguments);
          }
          return spinInternal;
        }();
        _proto.nextSpecial = /*#__PURE__*/function () {
          var _nextSpecial = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
            var _this$current2;
            var special;
            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  if (data === void 0) {
                    data = null;
                  }
                  if (!(!this.input.canSpecialAction || !((_this$current2 = this.current) != null && _this$current2.special))) {
                    _context5.next = 3;
                    break;
                  }
                  throw new ClientError('No active special game', 'INVALID_STATE');
                case 3:
                  special = this.current.special; // Counts distinguish a reel-based special from e.g. a pick game. Games can still supply custom presentation.
                  _context5.next = 6;
                  return this.perform('NEXT_FEVER', {
                    sg_id: special.id,
                    data: data
                  }, special.remaining !== null && special.stage !== 'init');
                case 6:
                case "end":
                  return _context5.stop();
              }
            }, _callee5, this);
          }));
          function nextSpecial(_x) {
            return _nextSpecial.apply(this, arguments);
          }
          return nextSpecial;
        }();
        _proto.skip = function skip() {
          if (this.state === 'requesting') this.quickStopRequested = true;
          if (this.state === 'stopping') this.reels.fastStop();
          if (this.state === 'awarding') this.awards.skip();
        };
        _proto.dispose = function dispose() {
          if (this.state === 'disposed') return;
          ++this.generation;
          this.automation = null;
          this.network.dispose();
          this.reels.dispose();
          this.awards.dispose();
          this.specials.dispose();
          this.setState('disposed');
          this.events.clear();
        };
        _proto.perform = /*#__PURE__*/function () {
          var _perform = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(action, payload, spinReels) {
            var generation, previous, result, snapshot;
            return _regeneratorRuntime().wrap(function _callee6$(_context6) {
              while (1) switch (_context6.prev = _context6.next) {
                case 0:
                  generation = this.generation;
                  previous = this.current;
                  this.quickStopRequested = false;
                  this.setState('requesting');
                  _context6.prev = 4;
                  if (spinReels) this.reels.begin(previous.fakeStrips);
                  _context6.next = 8;
                  return this.network.execute(action, payload, previous.version);
                case 8:
                  result = _context6.sent;
                  snapshot = this.accept(result, generation);
                  if (!spinReels) {
                    _context6.next = 14;
                    break;
                  }
                  this.setState('stopping');
                  _context6.next = 14;
                  return this.reels.present(snapshot, this.fast || this.quickStopRequested);
                case 14:
                  this.assertAlive(generation);
                  this.setState('awarding');
                  _context6.next = 18;
                  return this.awards.present(snapshot);
                case 18:
                  this.assertAlive(generation);
                  _context6.next = 21;
                  return this.specials.sync(snapshot);
                case 21:
                  this.assertAlive(generation);
                  this.ready(snapshot);
                  _context6.next = 30;
                  break;
                case 25:
                  _context6.prev = 25;
                  _context6.t0 = _context6["catch"](4);
                  // Definitive 4xx did not apply. Restore old reels; reconciliation is still required before another action.
                  if (_context6.t0 instanceof HttpError && !_context6.t0.retryable) this.reels.restore(previous);
                  this.fail(_context6.t0, generation);
                  throw _context6.t0;
                case 30:
                case "end":
                  return _context6.stop();
              }
            }, _callee6, this, [[4, 25]]);
          }));
          function perform(_x2, _x3, _x4) {
            return _perform.apply(this, arguments);
          }
          return perform;
        }();
        _proto.accept = function accept(result, generation) {
          var _this$current$version2, _this$current3;
          this.assertAlive(generation);
          var snapshot = this.decode(result.response, result.command.request_id);
          var mutation = result.command.action === 'SPIN' || result.command.action === 'NEXT_FEVER';
          if (snapshot.version < ((_this$current$version2 = (_this$current3 = this.current) == null ? void 0 : _this$current3.version) != null ? _this$current$version2 : 0) || mutation && snapshot.version <= result.command.expected_version) throw new ClientError('Stale response', 'STALE_RESPONSE');
          // Store authoritative data first. If acknowledgement fails, fault and replay the SAME request.
          this.current = snapshot;
          this.lineBet = snapshot.selectedLineBet;
          this.network.acknowledge(result.command.request_id);
          this.events.emit('snapshot', snapshot);
          this.assertAlive(generation);
          return snapshot;
        };
        _proto.ready = function ready(snapshot) {
          this.setState(snapshot.special ? 'special' : 'ready');
          this.events.emit('settled', snapshot);
        };
        _proto.setState = function setState(state) {
          if (this.state === 'disposed' && state !== 'disposed') throw new ClientError('Session disposed', 'DISPOSED');
          this.currentState = state;
          this.events.emit('state', state);
          this.events.emit('input', this.input);
        };
        _proto.assertAlive = function assertAlive(generation) {
          if (this.state === 'disposed' || generation !== this.generation) throw new ClientError('Session no longer active', 'DISPOSED');
        };
        _proto.fail = function fail(error, generation) {
          if (this.state === 'disposed' || generation !== this.generation) return;
          this.reels.cancel();
          this.setState('faulted');
          this.events.emit('error', error);
        };
        _createClass(SlotClient, [{
          key: "state",
          get: function get() {
            return this.currentState;
          }
        }, {
          key: "snapshot",
          get: function get() {
            return this.current;
          }
        }, {
          key: "selectedBet",
          get: function get() {
            var _this$current$bets$fi,
              _this$current4,
              _this2 = this;
            return (_this$current$bets$fi = (_this$current4 = this.current) == null ? void 0 : _this$current4.bets.find(function (bet) {
              return bet.lineBet === _this2.lineBet;
            })) != null ? _this$current$bets$fi : null;
          }
        }, {
          key: "input",
          get: function get() {
            var bet = this.selectedBet;
            return {
              canSpin: this.automation === null && this.state === 'ready' && !!bet && !!this.current && bet.totalBet <= this.current.balance,
              canChangeBet: this.automation === null && this.state === 'ready',
              canSpecialAction: this.automation === null && this.state === 'special'
            };
          }
        }]);
        return SlotClient;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index.ts", ['cc', './model.ts', './events.ts', './money.ts', './timing.ts', './protocol.ts', './storage.ts', './network.ts', './presentation.ts', './special.ts', './host.ts', './autospin.ts', './resources.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      var _setter = {};
      _setter.ClientError = module.ClientError;
      _setter.amount = module.amount;
      _setter.deepFreeze = module.deepFreeze;
      _setter.visibleBoard = module.visibleBoard;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.EventBus = module.EventBus;
      _setter.Scope = module.Scope;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.formatAmount = module.formatAmount;
      _setter.validateBet = module.validateBet;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.abortError = module.abortError;
      _setter.delay = module.delay;
      _setter.isAbort = module.isAbort;
      _setter.throwIfAborted = module.throwIfAborted;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.decodeEnvelope = module.decodeEnvelope;
      _setter.decodeSnapshot = module.decodeSnapshot;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.MemoryPendingStore = module.MemoryPendingStore;
      _setter.PersistentPendingStore = module.PersistentPendingStore;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.CommandClient = module.CommandClient;
      _setter.FetchTransport = module.FetchTransport;
      _setter.HttpError = module.HttpError;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.AwardController = module.AwardController;
      _setter.ReelController = module.ReelController;
      _setter.ReelMotion = module.ReelMotion;
      _setter.assertLayoutMatches = module.assertLayoutMatches;
      exports(_setter);
    }, function (module) {
      exports('SpecialGameRouter', module.SpecialGameRouter);
    }, function (module) {
      exports('SlotClient', module.SlotClient);
    }, function (module) {
      exports('AutoSpinController', module.AutoSpinController);
    }, function (module) {
      var _setter = {};
      _setter.AudioController = module.AudioController;
      _setter.ResourceCache = module.ResourceCache;
      exports(_setter);
    }],
    execute: function () {
      cclegacy._RF.push({}, "197ef4qWY9Hiaza1emWP6aZ", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./GoldenHenGameControls.ts', './GoldenHenReelSkin.ts', './autospin.ts', './CocosReelColumn.ts', './CocosSlotDriver.ts', './CocosSpecialPanel.ts', './events.ts', './host.ts', './index.ts', './model.ts', './money.ts', './network.ts', './presentation.ts', './protocol.ts', './resources.ts', './special.ts', './storage.ts', './timing.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/model.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _wrapNativeSuper, cclegacy;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _wrapNativeSuper = module.wrapNativeSuper;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        amount: amount,
        deepFreeze: deepFreeze,
        visibleBoard: visibleBoard
      });
      cclegacy._RF.push({}, "66606fEKP9P8bM75HB71grF", "model", undefined);
      /** Amounts are server minor units; no client-side payout calculation. */
      /** Every gh-client-v1 response contains an authoritative full snapshot. */
      var ClientError = exports('ClientError', /*#__PURE__*/function (_Error) {
        _inheritsLoose(ClientError, _Error);
        function ClientError(message, code) {
          var _this;
          _this = _Error.call(this, message) || this;
          _this.code = code;
          _this.name = 'ClientError';
          return _this;
        }
        return ClientError;
      }( /*#__PURE__*/_wrapNativeSuper(Error)));
      function amount(value, label) {
        if (label === void 0) {
          label = 'amount';
        }
        if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
          throw new ClientError(label + " must be a nonnegative safe integer", 'INVALID_AMOUNT');
        }
        return value;
      }
      function deepFreeze(value) {
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
          Object.freeze(value);
          for (var _i = 0, _Object$values = Object.values(value); _i < _Object$values.length; _i++) {
            var item = _Object$values[_i];
            deepFreeze(item);
          }
        }
        return value;
      }
      function visibleBoard(snapshot) {
        return snapshot.board.map(function (reel) {
          return reel.slice(snapshot.layout.bufferTop, snapshot.layout.bufferTop + snapshot.layout.rows);
        });
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/money.ts", ['cc', './model.ts'], function (exports) {
  var cclegacy, amount, ClientError;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      amount = module.amount;
      ClientError = module.ClientError;
    }],
    execute: function () {
      exports({
        formatAmount: formatAmount,
        validateBet: validateBet
      });
      cclegacy._RF.push({}, "503cfvY0yFC2IqUc5XH0n9N", "money", undefined);

      /** Exact integer arithmetic even when the ledger has finer precision than UI. */
      function formatAmount(value, minorDigits, displayDigits) {
        if (minorDigits === void 0) {
          minorDigits = 4;
        }
        if (displayDigits === void 0) {
          displayDigits = 2;
        }
        amount(value);
        if (!Number.isInteger(minorDigits) || minorDigits < 0 || minorDigits > 12 || !Number.isInteger(displayDigits) || displayDigits < 0 || displayDigits > minorDigits) {
          throw new ClientError('Invalid money precision', 'INVALID_PRECISION');
        }
        var divisor = Math.pow(BigInt(10), BigInt(minorDigits - displayDigits));
        var rounded = (BigInt(value) + divisor / BigInt(2)) / divisor;
        var scale = Math.pow(BigInt(10), BigInt(displayDigits));
        var whole = rounded / scale;
        return displayDigits === 0 ? "" + whole : whole + "." + ("" + rounded % scale).padStart(displayDigits, '0');
      }
      function validateBet(lineBet, bets, balance) {
        amount(lineBet, 'lineBet');
        var bet = bets.find(function (item) {
          return item.lineBet === lineBet;
        });
        if (!bet) throw new ClientError('Bet is not offered by server', 'INVALID_BET');
        if (bet.totalBet > balance) throw new ClientError('Insufficient displayed balance', 'INSUFFICIENT_BALANCE');
        return bet;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/network.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './model.ts', './timing.ts'], function (exports) {
  var _inheritsLoose, _createClass, _asyncToGenerator, _regeneratorRuntime, cclegacy, ClientError, deepFreeze, delay, throwIfAborted;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ClientError = module.ClientError;
      deepFreeze = module.deepFreeze;
    }, function (module) {
      delay = module.delay;
      throwIfAborted = module.throwIfAborted;
    }],
    execute: function () {
      cclegacy._RF.push({}, "066c1atzlBABL8q7ceiQINX", "network", undefined);
      var HttpError = exports('HttpError', /*#__PURE__*/function (_ClientError) {
        _inheritsLoose(HttpError, _ClientError);
        function HttpError(status, message, code) {
          var _this;
          if (code === void 0) {
            code = 'HTTP_ERROR';
          }
          _this = _ClientError.call(this, message, code) || this;
          _this.status = status;
          return _this;
        }
        _createClass(HttpError, [{
          key: "retryable",
          get: function get() {
            return this.status === 408 || this.status === 429 || this.status >= 500;
          }
        }]);
        return HttpError;
      }(ClientError));
      var FetchTransport = exports('FetchTransport', /*#__PURE__*/function () {
        function FetchTransport(endpoint, fetcher) {
          if (fetcher === void 0) {
            fetcher = globalThis.fetch.bind(globalThis);
          }
          this.endpoint = endpoint;
          this.fetcher = fetcher;
        }
        var _proto = FetchTransport.prototype;
        _proto.send = /*#__PURE__*/function () {
          var _send = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(command, signal) {
            var response, message, code, _body$error, _body$error2, body;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.fetcher(this.endpoint, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(command),
                    signal: signal
                  });
                case 2:
                  response = _context.sent;
                  if (response.ok) {
                    _context.next = 16;
                    break;
                  }
                  message = "Command failed (" + response.status + ")", code = 'HTTP_ERROR';
                  _context.prev = 5;
                  _context.next = 8;
                  return response.json();
                case 8:
                  body = _context.sent;
                  if (typeof ((_body$error = body.error) == null ? void 0 : _body$error.code) === 'string') code = body.error.code;
                  if (typeof ((_body$error2 = body.error) == null ? void 0 : _body$error2.message) === 'string') message = body.error.message;
                  _context.next = 15;
                  break;
                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](5);
                case 15:
                  throw new HttpError(response.status, message, code);
                case 16:
                  return _context.abrupt("return", response.json());
                case 17:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[5, 13]]);
          }));
          function send(_x, _x2) {
            return _send.apply(this, arguments);
          }
          return send;
        }();
        return FetchTransport;
      }());
      var CommandClient = exports('CommandClient', /*#__PURE__*/function () {
        function CommandClient(transport, store, options) {
          var _options$timeoutMs, _options$maxAttempts, _options$retryDelayMs, _options$newId;
          this.timeout = void 0;
          this.attempts = void 0;
          this.retryDelay = void 0;
          this.newId = void 0;
          this.active = null;
          this.disposed = false;
          this.transport = transport;
          this.store = store;
          this.options = options;
          this.timeout = (_options$timeoutMs = options.timeoutMs) != null ? _options$timeoutMs : 10000;
          this.attempts = (_options$maxAttempts = options.maxAttempts) != null ? _options$maxAttempts : 2;
          this.retryDelay = (_options$retryDelayMs = options.retryDelayMs) != null ? _options$retryDelayMs : 250;
          this.newId = (_options$newId = options.newId) != null ? _options$newId : function () {
            return globalThis.crypto.randomUUID();
          };
          if (!options.gameId || !options.playerId || !Number.isInteger(this.attempts) || this.attempts < 1 || !Number.isFinite(this.timeout) || this.timeout <= 0 || !Number.isFinite(this.retryDelay) || this.retryDelay < 0) {
            throw new ClientError('Invalid request options', 'INVALID_OPTIONS');
          }
          this.pending(); // Refuse to silently discard a different player's unfinished command.
        }

        var _proto2 = CommandClient.prototype;
        _proto2.pending = function pending() {
          var value = this.store.load();
          if (value && (value.game_id !== this.options.gameId || value.player_id !== this.options.playerId)) {
            throw new ClientError('Pending request belongs to a different session', 'PENDING_OWNER_MISMATCH');
          }
          return value;
        };
        _proto2.execute = /*#__PURE__*/function () {
          var _execute = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(action, payload, version) {
            var command;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  this.assertAvailable();
                  if (!this.pending()) {
                    _context2.next = 3;
                    break;
                  }
                  throw new ClientError('Reconcile pending command first', 'PENDING_REQUEST');
                case 3:
                  if (!(!Number.isSafeInteger(version) || version < 0)) {
                    _context2.next = 5;
                    break;
                  }
                  throw new ClientError('Invalid version', 'INVALID_VERSION');
                case 5:
                  command = deepFreeze({
                    schema: 'gh-client-v1',
                    game_id: this.options.gameId,
                    player_id: this.options.playerId,
                    request_id: this.newId(),
                    action: action,
                    expected_version: version,
                    payload: JSON.parse(JSON.stringify(payload))
                  });
                  if (command.request_id) {
                    _context2.next = 8;
                    break;
                  }
                  throw new ClientError('Request ID is empty', 'INVALID_ID');
                case 8:
                  // Persist BEFORE any I/O. Failure to persist means nothing is sent.
                  this.store.save(command);
                  return _context2.abrupt("return", this.send(command));
                case 10:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this);
          }));
          function execute(_x3, _x4, _x5) {
            return _execute.apply(this, arguments);
          }
          return execute;
        }();
        _proto2.replay = /*#__PURE__*/function () {
          var _replay = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
            var command;
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  this.assertAvailable();
                  command = this.pending();
                  if (command) {
                    _context3.next = 4;
                    break;
                  }
                  throw new ClientError('No pending request', 'NO_PENDING');
                case 4:
                  return _context3.abrupt("return", this.send(command));
                case 5:
                case "end":
                  return _context3.stop();
              }
            }, _callee3, this);
          }));
          function replay() {
            return _replay.apply(this, arguments);
          }
          return replay;
        }();
        _proto2.acknowledge = function acknowledge(requestId) {
          var _this$pending;
          if (((_this$pending = this.pending()) == null ? void 0 : _this$pending.request_id) !== requestId) throw new ClientError('Wrong acknowledgement', 'INVALID_ACK');
          this.store.clear();
        };
        _proto2.dispose = function dispose() {
          var _this$active;
          this.disposed = true;
          (_this$active = this.active) == null || _this$active.abort();
        };
        _proto2.assertAvailable = function assertAvailable() {
          if (this.disposed) throw new ClientError('Client disposed', 'DISPOSED');
          if (this.active) throw new ClientError('Request already in flight', 'BUSY');
        };
        _proto2.send = /*#__PURE__*/function () {
          var _send2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(command) {
            var _this2 = this;
            var lifetime, _loop, _ret, attempt;
            return _regeneratorRuntime().wrap(function _callee4$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  lifetime = new AbortController();
                  this.active = lifetime;
                  _context5.prev = 2;
                  _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                    var controller, cancel, timer, timeout, cancelled, response;
                    return _regeneratorRuntime().wrap(function _loop$(_context4) {
                      while (1) switch (_context4.prev = _context4.next) {
                        case 0:
                          throwIfAborted(lifetime.signal);
                          controller = new AbortController();
                          cancel = function cancel() {
                            return controller.abort();
                          };
                          lifetime.signal.addEventListener('abort', cancel, {
                            once: true
                          });
                          _context4.prev = 4;
                          // Promise race enforces timeout even for custom transports ignoring AbortSignal.
                          timeout = new Promise(function (_, reject) {
                            timer = setTimeout(function () {
                              reject(new ClientError('Request timed out; outcome is unknown', 'TIMEOUT'));
                              controller.abort();
                            }, _this2.timeout);
                          });
                          cancelled = new Promise(function (_, reject) {
                            controller.signal.addEventListener('abort', function () {
                              return reject(new ClientError('Request cancelled; reconcile on resume', 'CANCELLED'));
                            }, {
                              once: true
                            });
                          });
                          _context4.next = 9;
                          return Promise.race([_this2.transport.send(command, controller.signal), timeout, cancelled]);
                        case 9:
                          response = _context4.sent;
                          return _context4.abrupt("return", {
                            v: {
                              command: command,
                              response: response
                            }
                          });
                        case 13:
                          _context4.prev = 13;
                          _context4.t0 = _context4["catch"](4);
                          if (!(_context4.t0 instanceof HttpError && !_context4.t0.retryable)) {
                            _context4.next = 18;
                            break;
                          }
                          // API contract: definitive 4xx means transaction was not applied.
                          _this2.acknowledge(command.request_id);
                          throw _context4.t0;
                        case 18:
                          if (!(attempt + 1 === _this2.attempts || lifetime.signal.aborted)) {
                            _context4.next = 20;
                            break;
                          }
                          throw _context4.t0;
                        case 20:
                          _context4.prev = 20;
                          if (timer !== undefined) clearTimeout(timer);
                          lifetime.signal.removeEventListener('abort', cancel);
                          return _context4.finish(20);
                        case 24:
                          _context4.next = 26;
                          return delay(_this2.retryDelay, lifetime.signal);
                        case 26:
                        case "end":
                          return _context4.stop();
                      }
                    }, _loop, null, [[4, 13, 20, 24]]);
                  });
                  attempt = 0;
                case 5:
                  if (!(attempt < this.attempts)) {
                    _context5.next = 13;
                    break;
                  }
                  return _context5.delegateYield(_loop(), "t0", 7);
                case 7:
                  _ret = _context5.t0;
                  if (!_ret) {
                    _context5.next = 10;
                    break;
                  }
                  return _context5.abrupt("return", _ret.v);
                case 10:
                  attempt++;
                  _context5.next = 5;
                  break;
                case 13:
                  throw new ClientError('No request attempt', 'INVALID_OPTIONS');
                case 14:
                  _context5.prev = 14;
                  this.active = null;
                  return _context5.finish(14);
                case 17:
                case "end":
                  return _context5.stop();
              }
            }, _callee4, this, [[2,, 14, 17]]);
          }));
          function send(_x6) {
            return _send2.apply(this, arguments);
          }
          return send;
        }();
        return CommandClient;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/presentation.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './model.ts', './timing.ts'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy, ClientError, visibleBoard, isAbort, throwIfAborted, delay;
  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ClientError = module.ClientError;
      visibleBoard = module.visibleBoard;
    }, function (module) {
      isAbort = module.isAbort;
      throwIfAborted = module.throwIfAborted;
      delay = module.delay;
    }],
    execute: function () {
      exports('assertLayoutMatches', assertLayoutMatches);
      cclegacy._RF.push({}, "5b3caG689JFcZohbwoLqoWp", "presentation", undefined);
      var ReelController = exports('ReelController', /*#__PURE__*/function () {
        function ReelController(view, timing) {
          if (timing === void 0) {
            timing = {
              stopGapMs: 400,
              resultDelayMs: 250
            };
          }
          this.phase = 'idle';
          this.stop = null;
          this.disposed = false;
          this.view = view;
          this.timing = timing;
          if (![timing.stopGapMs, timing.resultDelayMs].every(function (v) {
            return Number.isFinite(v) && v >= 0;
          })) throw new RangeError('Invalid reel timing');
        }
        var _proto = ReelController.prototype;
        _proto.begin = function begin(strips) {
          if (this.disposed) throw new ClientError('Reels disposed', 'DISPOSED');
          if (this.phase !== 'idle') throw new ClientError('Reels already active', 'BUSY');
          this.phase = 'spinning';
          try {
            this.view.begin(strips);
          } catch (error) {
            this.phase = 'idle';
            throw error;
          }
        };
        _proto.present = /*#__PURE__*/function () {
          var _present = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(snapshot, fast) {
            var stop, board, _index;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (fast === void 0) {
                    fast = false;
                  }
                  if (!(this.phase !== 'spinning')) {
                    _context.next = 3;
                    break;
                  }
                  throw new ClientError('Reels not spinning', 'INVALID_STATE');
                case 3:
                  this.phase = 'stopping';
                  stop = new AbortController();
                  this.stop = stop;
                  board = visibleBoard(snapshot);
                  _context.prev = 7;
                  if (fast) {
                    _context.next = 11;
                    break;
                  }
                  _context.next = 11;
                  return delay(this.timing.resultDelayMs, stop.signal);
                case 11:
                  _index = 0;
                case 12:
                  if (!(_index < board.length)) {
                    _context.next = 22;
                    break;
                  }
                  throwIfAborted(stop.signal);
                  if (!(!fast && _index > 0)) {
                    _context.next = 17;
                    break;
                  }
                  _context.next = 17;
                  return delay(this.timing.stopGapMs, stop.signal);
                case 17:
                  _context.next = 19;
                  return this.view.stopReel(_index, board[_index], stop.signal);
                case 19:
                  _index++;
                  _context.next = 12;
                  break;
                case 22:
                  _context.next = 28;
                  break;
                case 24:
                  _context.prev = 24;
                  _context.t0 = _context["catch"](7);
                  if (!(!isAbort(_context.t0) || !stop.signal.aborted)) {
                    _context.next = 28;
                    break;
                  }
                  throw _context.t0;
                case 28:
                  _context.prev = 28;
                  this.stop = null;
                  this.phase = 'idle';
                  if (!this.disposed) this.view.snap(board);
                  return _context.finish(28);
                case 33:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[7, 24, 28, 33]]);
          }));
          function present(_x, _x2) {
            return _present.apply(this, arguments);
          }
          return present;
        }();
        _proto.fastStop = function fastStop() {
          var _this$stop;
          (_this$stop = this.stop) == null || _this$stop.abort();
        };
        _proto.restore = function restore(snapshot) {
          this.cancel();
          this.view.snap(visibleBoard(snapshot));
        };
        _proto.cancel = function cancel() {
          var _this$stop2;
          (_this$stop2 = this.stop) == null || _this$stop2.abort();
          this.view.cancel();
          if (!this.stop) this.phase = 'idle';
        };
        _proto.dispose = function dispose() {
          this.disposed = true;
          this.cancel();
        };
        return ReelController;
      }());
      var AwardController = exports('AwardController', /*#__PURE__*/function () {
        function AwardController(view) {
          this.active = null;
          this.disposed = false;
          this.view = view;
        }
        var _proto2 = AwardController.prototype;
        _proto2.present = /*#__PURE__*/function () {
          var _present2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(snapshot) {
            var active;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (!this.disposed) {
                    _context2.next = 2;
                    break;
                  }
                  throw new ClientError('Awards disposed', 'DISPOSED');
                case 2:
                  if (!this.active) {
                    _context2.next = 4;
                    break;
                  }
                  throw new ClientError('Award already active', 'BUSY');
                case 4:
                  active = new AbortController();
                  this.active = active;
                  _context2.prev = 6;
                  if (!(snapshot.lastWin > 0)) {
                    _context2.next = 10;
                    break;
                  }
                  _context2.next = 10;
                  return this.view.show(snapshot, active.signal);
                case 10:
                  _context2.next = 16;
                  break;
                case 12:
                  _context2.prev = 12;
                  _context2.t0 = _context2["catch"](6);
                  if (!(!isAbort(_context2.t0) || !active.signal.aborted)) {
                    _context2.next = 16;
                    break;
                  }
                  throw _context2.t0;
                case 16:
                  _context2.prev = 16;
                  this.active = null;
                  if (!this.disposed) this.view.finish(snapshot);
                  return _context2.finish(16);
                case 20:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this, [[6, 12, 16, 20]]);
          }));
          function present(_x3) {
            return _present2.apply(this, arguments);
          }
          return present;
        }();
        _proto2.skip = function skip() {
          var _this$active;
          (_this$active = this.active) == null || _this$active.abort();
        };
        _proto2.dispose = function dispose() {
          var _this$active2;
          this.disposed = true;
          (_this$active2 = this.active) == null || _this$active2.abort();
        };
        return AwardController;
      }());
      /** Cosmetic deterministic reel loop; never selects a result or award. */
      var ReelMotion = exports('ReelMotion', /*#__PURE__*/function () {
        function ReelMotion(strip, cellSize, speed) {
          if (speed === void 0) {
            speed = 900;
          }
          this.offset = 0;
          this.cursor = 0;
          this.strip = strip;
          this.cellSize = cellSize;
          this.speed = speed;
          if (!strip.length || !Number.isFinite(cellSize) || cellSize <= 0 || !Number.isFinite(speed) || speed < 0) throw new RangeError('Invalid reel motion');
        }
        var _proto3 = ReelMotion.prototype;
        _proto3.tick = function tick(dt, visibleRows) {
          var _this = this;
          if (!Number.isFinite(dt) || dt < 0 || !Number.isSafeInteger(visibleRows) || visibleRows < 1) throw new RangeError('Invalid frame');
          var advance = this.offset + Math.min(dt, 0.1) * this.speed;
          var crossed = Math.floor(advance / this.cellSize);
          this.cursor = (this.cursor + crossed) % this.strip.length;
          this.offset = advance % this.cellSize;
          return {
            offset: this.offset,
            symbols: Array.from({
              length: visibleRows + 1
            }, function (_, i) {
              return _this.strip[(_this.cursor + i) % _this.strip.length];
            })
          };
        };
        return ReelMotion;
      }());
      function assertLayoutMatches(layout, reelCount, rows) {
        if (layout.reels !== reelCount || layout.rows !== rows) throw new ClientError('View layout differs from server', 'LAYOUT_MISMATCH');
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/protocol.ts", ['cc', './model.ts'], function (exports) {
  var cclegacy, amount, deepFreeze, ClientError;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      amount = module.amount;
      deepFreeze = module.deepFreeze;
      ClientError = module.ClientError;
    }],
    execute: function () {
      exports({
        decodeEnvelope: decodeEnvelope,
        decodeSnapshot: decodeSnapshot
      });
      cclegacy._RF.push({}, "e8db4PoU6RAuLzz74cGMxLx", "protocol", undefined);
      function object(value, label) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) fail(label);
        return value;
      }
      function fail(label) {
        throw new ClientError("Invalid protocol field: " + label, 'INVALID_RESPONSE');
      }
      function integer(value, label, min) {
        if (min === void 0) {
          min = 0;
        }
        if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min) fail(label);
        return value;
      }
      function array(value, label) {
        if (!Array.isArray(value)) fail(label);
        return value;
      }
      function matrix(value, columns, height, label) {
        var reels = array(value, label);
        if (reels.length !== columns) fail(label);
        return reels.map(function (item, i) {
          var cells = array(item, label + "[" + i + "]");
          if (cells.length !== height) fail(label);
          return cells.map(function (cell) {
            return integer(cell, label);
          });
        });
      }
      /** Strict gh-client-v1 codec. Legacy numeric sg_map requires a separate game adapter. */
      function decodeSnapshot(value) {
        var data = object(value, 'snapshot');
        var layout = object(data.layout, 'layout');
        var reels = integer(layout.reels, 'layout.reels', 1);
        var rows = integer(layout.rows, 'layout.rows', 1);
        var bufferTop = integer(layout.bufferTop, 'layout.bufferTop');
        var bufferBottom = integer(layout.bufferBottom, 'layout.bufferBottom');
        if (reels > 32 || rows > 64 || bufferTop > 64 || bufferBottom > 64) fail('layout bounds');
        var bets = array(data.bets, 'bets').map(function (item) {
          var bet = object(item, 'bet');
          var lineBet = amount(bet.lineBet, 'bet.lineBet');
          var totalBet = amount(bet.totalBet, 'bet.totalBet');
          if (lineBet === 0 || totalBet === 0) fail('zero bet');
          return {
            lineBet: lineBet,
            totalBet: totalBet
          };
        });
        if (!bets.length || new Set(bets.map(function (bet) {
          return bet.lineBet;
        })).size !== bets.length) fail('bets');
        var selectedLineBet = amount(data.selectedLineBet, 'selectedLineBet');
        if (!bets.some(function (bet) {
          return bet.lineBet === selectedLineBet;
        })) fail('selectedLineBet');
        var fakeStrips = array(data.fakeStrips, 'fakeStrips').map(function (item) {
          return array(item, 'strip').map(function (cell) {
            return integer(cell, 'strip symbol');
          });
        });
        if (fakeStrips.length !== reels || fakeStrips.some(function (strip) {
          return !strip.length;
        })) fail('fakeStrips');
        var wins = array(data.wins, 'wins').map(function (item) {
          var win = object(item, 'win');
          var positions = array(win.positions, 'positions');
          if (positions.length !== reels) fail('positions');
          return {
            symbolId: integer(win.symbolId, 'symbolId'),
            amount: amount(win.amount),
            positions: positions.map(function (reel) {
              var cells = array(reel, 'positions reel');
              if (cells.length !== rows || cells.some(function (cell) {
                return typeof cell !== 'boolean';
              })) fail('positions cells');
              return [].concat(cells);
            })
          };
        });
        var special = null;
        if (data.special !== null) {
          var sg = object(data.special, 'special');
          if (sg.stage !== 'init' && sg.stage !== 'process' && sg.stage !== 'recovery') fail('special.stage');
          var remaining = sg.remaining === null ? null : integer(sg.remaining, 'remaining');
          var total = sg.total === null ? null : integer(sg.total, 'total');
          if (remaining === null !== (total === null) || remaining !== null && total !== null && remaining > total) fail('special counts');
          var picks = sg.picks === null ? null : array(sg.picks, 'picks').map(function (item) {
            return integer(item, 'pick', -1);
          });
          special = {
            id: integer(sg.id, 'special.id'),
            stage: sg.stage,
            remaining: remaining,
            total: total,
            picks: picks,
            data: JSON.parse(JSON.stringify(object(sg.data, 'special.data')))
          };
        }
        if (data.roundId !== null && (typeof data.roundId !== 'string' || !data.roundId)) fail('roundId');
        return deepFreeze({
          version: integer(data.version, 'version'),
          roundId: data.roundId,
          balance: amount(data.balance, 'balance'),
          layout: {
            reels: reels,
            rows: rows,
            bufferTop: bufferTop,
            bufferBottom: bufferBottom
          },
          bets: bets,
          selectedLineBet: selectedLineBet,
          board: matrix(data.board, reels, bufferTop + rows + bufferBottom, 'board'),
          fakeStrips: fakeStrips,
          wins: wins,
          lastWin: amount(data.lastWin, 'lastWin'),
          totalWin: amount(data.totalWin, 'totalWin'),
          winType: integer(data.winType, 'winType'),
          special: special
        });
      }
      function decodeEnvelope(value, requestId) {
        var envelope = object(value, 'response');
        if (envelope.schema !== 'gh-client-v1' || envelope.request_id !== requestId) fail('response correlation');
        var cmd = object(envelope.cmd_data, 'cmd_data');
        return decodeSnapshot(cmd.data);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/resources.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './model.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, ClientError;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ClientError = module.ClientError;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dca970g4fhGn4NqiErNnDLJ", "resources", undefined);

      /** Shared loads, explicit ownership, failed loads retryable; late assets released after dispose. */
      var ResourceCache = exports('ResourceCache', /*#__PURE__*/function () {
        function ResourceCache(loadAsset, releaseAsset) {
          this.entries = new Map();
          this.disposed = false;
          this.loadAsset = loadAsset;
          this.releaseAsset = releaseAsset;
        }
        var _proto = ResourceCache.prototype;
        _proto.get = /*#__PURE__*/function () {
          var _get = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(key) {
            var _this = this;
            var entry, value;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!this.disposed) {
                    _context.next = 2;
                    break;
                  }
                  throw new ClientError('Resource cache disposed', 'DISPOSED');
                case 2:
                  entry = this.entries.get(key);
                  if (!entry) {
                    entry = Promise.resolve().then(function () {
                      return _this.loadAsset(key);
                    });
                    this.entries.set(key, entry);
                    entry["catch"](function () {
                      if (_this.entries.get(key) === entry) _this.entries["delete"](key);
                    });
                  }
                  _context.next = 6;
                  return entry;
                case 6:
                  value = _context.sent;
                  if (!this.disposed) {
                    _context.next = 9;
                    break;
                  }
                  throw new ClientError('Resource cache disposed while loading', 'DISPOSED');
                case 9:
                  return _context.abrupt("return", value);
                case 10:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function get(_x) {
            return _get.apply(this, arguments);
          }
          return get;
        }();
        _proto.dispose = function dispose() {
          var _this2 = this;
          if (this.disposed) return;
          this.disposed = true;
          for (var _iterator = _createForOfIteratorHelperLoose(this.entries.values()), _step; !(_step = _iterator()).done;) {
            var entry = _step.value;
            void entry.then(function (value) {
              return _this2.releaseAsset(value);
            }, function () {});
          }
          this.entries.clear();
        };
        return ResourceCache;
      }());
      var AudioController = exports('AudioController', /*#__PURE__*/function () {
        function AudioController(port) {
          this.current = null;
          this.muted = false;
          this.port = port;
        }
        var _proto2 = AudioController.prototype;
        _proto2.playMusic = function playMusic(key) {
          if (key === this.current) return;
          this.current = key;
          this.port.music(key, true);
        };
        _proto2.playEffect = function playEffect(key) {
          if (!this.muted) this.port.effect(key);
        };
        _proto2.setMuted = function setMuted(value) {
          this.muted = value;
          this.port.setMuted(value);
        };
        _proto2.dispose = function dispose() {
          this.current = null;
          this.port.stopMusic();
        };
        return AudioController;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/special.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './model.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, ClientError;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ClientError = module.ClientError;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1dc44nYK8JNe7oysGHepwbD", "special", undefined);
      /** IDs and feature-specific sg_map semantics belong to the game, not the common layer. */
      var SpecialGameRouter = exports('SpecialGameRouter', /*#__PURE__*/function () {
        function SpecialGameRouter() {
          this.games = new Map();
          this.active = null;
          this.disposed = false;
        }
        var _proto = SpecialGameRouter.prototype;
        _proto.register = function register(game) {
          var _this = this;
          if (this.disposed) throw new ClientError('Router disposed', 'DISPOSED');
          if (!Number.isSafeInteger(game.id) || game.id < 0 || this.games.has(game.id)) throw new ClientError('Duplicate/invalid special game', 'INVALID_SPECIAL');
          this.games.set(game.id, game);
          return function () {
            if (_this.active === game) throw new ClientError('Cannot unregister active special game', 'INVALID_STATE');
            if (_this.games.get(game.id) === game) _this.games["delete"](game.id);
          };
        };
        _proto.sync = /*#__PURE__*/function () {
          var _sync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(snapshot) {
            var next, old;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!this.disposed) {
                    _context.next = 2;
                    break;
                  }
                  throw new ClientError('Router disposed', 'DISPOSED');
                case 2:
                  next = snapshot.special ? this.games.get(snapshot.special.id) : null;
                  if (!(snapshot.special && !next)) {
                    _context.next = 5;
                    break;
                  }
                  throw new ClientError("No handler for special game " + snapshot.special.id, 'UNSUPPORTED_SPECIAL');
                case 5:
                  if (!(next !== this.active)) {
                    _context.next = 19;
                    break;
                  }
                  old = this.active;
                  this.active = null;
                  if (!old) {
                    _context.next = 11;
                    break;
                  }
                  _context.next = 11;
                  return old.exit();
                case 11:
                  if (!this.disposed) {
                    _context.next = 13;
                    break;
                  }
                  throw new ClientError('Router disposed', 'DISPOSED');
                case 13:
                  if (!(next && snapshot.special)) {
                    _context.next = 17;
                    break;
                  }
                  this.active = next;
                  _context.next = 17;
                  return next.enter(snapshot.special, snapshot);
                case 17:
                  _context.next = 22;
                  break;
                case 19:
                  if (!(next && snapshot.special)) {
                    _context.next = 22;
                    break;
                  }
                  _context.next = 22;
                  return next.updateState(snapshot.special, snapshot);
                case 22:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function sync(_x) {
            return _sync.apply(this, arguments);
          }
          return sync;
        }();
        _proto.dispose = function dispose() {
          if (this.disposed) return;
          this.disposed = true;
          for (var _iterator = _createForOfIteratorHelperLoose(this.games.values()), _step; !(_step = _iterator()).done;) {
            var game = _step.value;
            try {
              game.dispose();
            } catch (_unused) {/* Complete cleanup of remaining panels. */}
          }
          this.active = null;
          this.games.clear();
        };
        return SpecialGameRouter;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/storage.ts", ['cc', './model.ts'], function (exports) {
  var cclegacy, deepFreeze, ClientError;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      deepFreeze = module.deepFreeze;
      ClientError = module.ClientError;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5b67dPDFXxHC4cvYyYSzKSN", "storage", undefined);
      var MemoryPendingStore = exports('MemoryPendingStore', /*#__PURE__*/function () {
        function MemoryPendingStore() {
          this.value = null;
        }
        var _proto = MemoryPendingStore.prototype;
        _proto.load = function load() {
          return this.value;
        };
        _proto.save = function save(value) {
          this.value = value;
        };
        _proto.clear = function clear() {
          this.value = null;
        };
        return MemoryPendingStore;
      }());
      /** Storage key must be scoped by game AND player. No balances are trusted from storage. */
      var PersistentPendingStore = exports('PersistentPendingStore', /*#__PURE__*/function () {
        function PersistentPendingStore(storage, key) {
          this.storage = storage;
          this.key = key;
        }
        var _proto2 = PersistentPendingStore.prototype;
        _proto2.load = function load() {
          var value = this.storage.getItem(this.key);
          if (value === null) return null;
          try {
            var parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object') throw new Error('not object');
            var v = parsed;
            var actions = ['START_GAME', 'SPIN', 'NEXT_FEVER', 'CHECK_CMD'];
            if (v.schema !== 'gh-client-v1' || !actions.includes(v.action) || typeof v.game_id !== 'string' || !v.game_id || typeof v.player_id !== 'string' || !v.player_id || typeof v.request_id !== 'string' || !v.request_id || !Number.isSafeInteger(v.expected_version) || v.expected_version < 0 || !v.payload || typeof v.payload !== 'object' || Array.isArray(v.payload)) throw new Error('invalid command');
            return deepFreeze(v);
          } catch (_unused) {
            throw new ClientError('Pending request is corrupt; reconcile with server before clearing it', 'CORRUPT_PENDING');
          }
        };
        _proto2.save = function save(value) {
          this.storage.setItem(this.key, JSON.stringify(value));
        };
        _proto2.clear = function clear() {
          this.storage.removeItem(this.key);
        };
        return PersistentPendingStore;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/timing.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        abortError: abortError,
        delay: delay,
        isAbort: isAbort,
        throwIfAborted: throwIfAborted
      });
      cclegacy._RF.push({}, "d02bcr5rmlKkY5TmtmiJvav", "timing", undefined);
      function abortError() {
        var error = new Error('Operation cancelled');
        error.name = 'AbortError';
        return error;
      }
      function throwIfAborted(signal) {
        if (signal != null && signal.aborted) throw abortError();
      }
      function isAbort(error) {
        return error instanceof Error && error.name === 'AbortError';
      }
      function delay(ms, signal) {
        if (!Number.isFinite(ms) || ms < 0) return Promise.reject(new RangeError('Invalid delay'));
        return new Promise(function (resolve, reject) {
          if (signal != null && signal.aborted) {
            reject(abortError());
            return;
          }
          var timer = setTimeout(function () {
            cleanup();
            resolve();
          }, ms);
          var cancel = function cancel() {
            clearTimeout(timer);
            cleanup();
            reject(abortError());
          };
          var cleanup = function cleanup() {
            return signal == null ? void 0 : signal.removeEventListener('abort', cancel);
          };
          signal == null || signal.addEventListener('abort', cancel, {
            once: true
          });
        });
      }
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});
//# sourceMappingURL=index.js.map