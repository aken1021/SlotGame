System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, EventBus, HttpError, decodeEnvelope, SpecialGameRouter, validateBet, SlotClient, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfAction(extras) {
    _reporterNs.report("Action", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHostState(extras) {
    _reporterNs.report("HostState", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSnapshot(extras) {
    _reporterNs.report("Snapshot", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBet(extras) {
    _reporterNs.report("Bet", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCommand(extras) {
    _reporterNs.report("Command", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventBus(extras) {
    _reporterNs.report("EventBus", "./events", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCommandClient(extras) {
    _reporterNs.report("CommandClient", "./network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHttpError(extras) {
    _reporterNs.report("HttpError", "./network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdecodeEnvelope(extras) {
    _reporterNs.report("decodeEnvelope", "./protocol", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAwardController(extras) {
    _reporterNs.report("AwardController", "./presentation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfReelController(extras) {
    _reporterNs.report("ReelController", "./presentation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialGameRouter(extras) {
    _reporterNs.report("SpecialGameRouter", "./special", _context.meta, extras);
  }

  function _reportPossibleCrUseOfvalidateBet(extras) {
    _reporterNs.report("validateBet", "./money", _context.meta, extras);
  }

  _export("SlotClient", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ClientError = _unresolved_2.ClientError;
    }, function (_unresolved_3) {
      EventBus = _unresolved_3.EventBus;
    }, function (_unresolved_4) {
      HttpError = _unresolved_4.HttpError;
    }, function (_unresolved_5) {
      decodeEnvelope = _unresolved_5.decodeEnvelope;
    }, function (_unresolved_6) {
      SpecialGameRouter = _unresolved_6.SpecialGameRouter;
    }, function (_unresolved_7) {
      validateBet = _unresolved_7.validateBet;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "58b573ormVLSa8eVK2nce0C", "host", undefined);

      _export("SlotClient", SlotClient = class SlotClient {
        constructor(network, reels, awards, specials, decode) {
          if (specials === void 0) {
            specials = new (_crd && SpecialGameRouter === void 0 ? (_reportPossibleCrUseOfSpecialGameRouter({
              error: Error()
            }), SpecialGameRouter) : SpecialGameRouter)();
          }

          if (decode === void 0) {
            decode = _crd && decodeEnvelope === void 0 ? (_reportPossibleCrUseOfdecodeEnvelope({
              error: Error()
            }), decodeEnvelope) : decodeEnvelope;
          }

          this.events = new (_crd && EventBus === void 0 ? (_reportPossibleCrUseOfEventBus({
            error: Error()
          }), EventBus) : EventBus)();
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

        get state() {
          return this.currentState;
        }

        get snapshot() {
          return this.current;
        }

        get selectedBet() {
          var _this$current$bets$fi, _this$current;

          return (_this$current$bets$fi = (_this$current = this.current) == null ? void 0 : _this$current.bets.find(bet => bet.lineBet === this.lineBet)) != null ? _this$current$bets$fi : null;
        }

        get input() {
          var bet = this.selectedBet;
          return {
            canSpin: this.automation === null && this.state === 'ready' && !!bet && !!this.current && bet.totalBet <= this.current.balance,
            canChangeBet: this.automation === null && this.state === 'ready',
            canSpecialAction: this.automation === null && this.state === 'special'
          };
        }

        setFastMode(value) {
          this.fast = value;
        }

        chooseBet(lineBet) {
          if (!this.input.canChangeBet || !this.current) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Bet controls locked', 'INVALID_STATE'); // A larger offered bet can be selected even when balance is insufficient; spin remains disabled.

          var bet = this.current.bets.find(item => item.lineBet === lineBet);
          if (!bet) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Bet not offered', 'INVALID_BET');
          this.lineBet = lineBet;
          this.events.emit('bet', bet);
          this.events.emit('input', this.input);
        }

        connect() {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (!['disconnected', 'faulted', 'ready', 'special'].includes(_this.state)) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Cannot connect now', 'BUSY');
            var generation = ++_this.generation;

            var pending = _this.network.pending();

            _this.setState(pending ? 'recovering' : 'connecting');

            try {
              var _this$current$version, _this$current2;

              // Replaying an uncertain debit/selection always keeps its original request ID.
              if (pending) {
                var replay = yield _this.network.replay();

                _this.accept(replay, generation);
              } // Replay may be an old cached result. Fetch fresh state before unlocking controls.


              var response = yield _this.network.execute('START_GAME', {}, (_this$current$version = (_this$current2 = _this.current) == null ? void 0 : _this$current2.version) != null ? _this$current$version : 0);

              var snapshot = _this.accept(response, generation);

              _this.reels.restore(snapshot);

              yield _this.specials.sync(snapshot);

              _this.assertAlive(generation);

              _this.ready(snapshot);
            } catch (error) {
              _this.fail(error, generation);

              throw error;
            }
          })();
        }

        spin() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            if (!_this2.input.canSpin || !_this2.current || _this2.lineBet === null) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Spin unavailable', 'INVALID_STATE');
            yield _this2.spinInternal();
          })();
        }

        acquireAutoSpin() {
          var _this3 = this;

          if (this.automation || !this.input.canSpin) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Auto spin unavailable', 'INVALID_STATE');
          var owner = Symbol('autospin');
          this.automation = owner;
          this.events.emit('input', this.input);

          var canSpin = () => this.automation === owner && this.state === 'ready' && !!this.selectedBet && !!this.current && this.selectedBet.totalBet <= this.current.balance;

          return {
            canSpin,
            spin: function () {
              var _spin = _asyncToGenerator(function* () {
                if (!canSpin()) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
                  error: Error()
                }), ClientError) : ClientError)('Auto spin unavailable', 'INVALID_STATE');
                yield _this3.spinInternal();
              });

              function spin() {
                return _spin.apply(this, arguments);
              }

              return spin;
            }(),
            release: () => {
              if (this.automation === owner) {
                this.automation = null;
                this.events.emit('input', this.input);
              }
            }
          };
        }

        spinInternal() {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            if (!_this4.current || _this4.lineBet === null) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Not initialized', 'INVALID_STATE');
            (_crd && validateBet === void 0 ? (_reportPossibleCrUseOfvalidateBet({
              error: Error()
            }), validateBet) : validateBet)(_this4.lineBet, _this4.current.bets, _this4.current.balance);
            yield _this4.perform('SPIN', {
              line_bet: _this4.lineBet
            }, true);
          })();
        }

        nextSpecial(data) {
          var _this5 = this;

          return _asyncToGenerator(function* () {
            var _this5$current;

            if (data === void 0) {
              data = null;
            }

            if (!_this5.input.canSpecialAction || !((_this5$current = _this5.current) != null && _this5$current.special)) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('No active special game', 'INVALID_STATE');
            var special = _this5.current.special; // Counts distinguish a reel-based special from e.g. a pick game. Games can still supply custom presentation.

            yield _this5.perform('NEXT_FEVER', {
              sg_id: special.id,
              data
            }, special.remaining !== null && special.stage !== 'init');
          })();
        }

        skip() {
          if (this.state === 'requesting') this.quickStopRequested = true;
          if (this.state === 'stopping') this.reels.fastStop();
          if (this.state === 'awarding') this.awards.skip();
        }

        dispose() {
          if (this.state === 'disposed') return;
          ++this.generation;
          this.automation = null;
          this.network.dispose();
          this.reels.dispose();
          this.awards.dispose();
          this.specials.dispose();
          this.setState('disposed');
          this.events.clear();
        }

        perform(action, payload, spinReels) {
          var _this6 = this;

          return _asyncToGenerator(function* () {
            var generation = _this6.generation;
            var previous = _this6.current;
            _this6.quickStopRequested = false;

            _this6.setState('requesting');

            try {
              if (spinReels) _this6.reels.begin(previous.fakeStrips);
              var result = yield _this6.network.execute(action, payload, previous.version);

              var snapshot = _this6.accept(result, generation);

              if (spinReels) {
                _this6.setState('stopping');

                yield _this6.reels.present(snapshot, _this6.fast || _this6.quickStopRequested);
              }

              _this6.assertAlive(generation);

              _this6.setState('awarding');

              yield _this6.awards.present(snapshot);

              _this6.assertAlive(generation);

              yield _this6.specials.sync(snapshot);

              _this6.assertAlive(generation);

              _this6.ready(snapshot);
            } catch (error) {
              // Definitive 4xx did not apply. Restore old reels; reconciliation is still required before another action.
              if (error instanceof (_crd && HttpError === void 0 ? (_reportPossibleCrUseOfHttpError({
                error: Error()
              }), HttpError) : HttpError) && !error.retryable) _this6.reels.restore(previous);

              _this6.fail(error, generation);

              throw error;
            }
          })();
        }

        accept(result, generation) {
          var _this$current$version2, _this$current3;

          this.assertAlive(generation);
          var snapshot = this.decode(result.response, result.command.request_id);
          var mutation = result.command.action === 'SPIN' || result.command.action === 'NEXT_FEVER';
          if (snapshot.version < ((_this$current$version2 = (_this$current3 = this.current) == null ? void 0 : _this$current3.version) != null ? _this$current$version2 : 0) || mutation && snapshot.version <= result.command.expected_version) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Stale response', 'STALE_RESPONSE'); // Store authoritative data first. If acknowledgement fails, fault and replay the SAME request.

          this.current = snapshot;
          this.lineBet = snapshot.selectedLineBet;
          this.network.acknowledge(result.command.request_id);
          this.events.emit('snapshot', snapshot);
          this.assertAlive(generation);
          return snapshot;
        }

        ready(snapshot) {
          this.setState(snapshot.special ? 'special' : 'ready');
          this.events.emit('settled', snapshot);
        }

        setState(state) {
          if (this.state === 'disposed' && state !== 'disposed') throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Session disposed', 'DISPOSED');
          this.currentState = state;
          this.events.emit('state', state);
          this.events.emit('input', this.input);
        }

        assertAlive(generation) {
          if (this.state === 'disposed' || generation !== this.generation) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Session no longer active', 'DISPOSED');
        }

        fail(error, generation) {
          if (this.state === 'disposed' || generation !== this.generation) return;
          this.reels.cancel();
          this.setState('faulted');
          this.events.emit('error', error);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=954845470460aa96b7865edda38d9faf62bc32df.js.map