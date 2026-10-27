System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, EventBus, HttpError, decodeEnvelope, SpecialGameRouter, validateBet, SlotClient, _crd;

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
        constructor(network, reels, awards, specials = new (_crd && SpecialGameRouter === void 0 ? (_reportPossibleCrUseOfSpecialGameRouter({
          error: Error()
        }), SpecialGameRouter) : SpecialGameRouter)(), decode = _crd && decodeEnvelope === void 0 ? (_reportPossibleCrUseOfdecodeEnvelope({
          error: Error()
        }), decodeEnvelope) : decodeEnvelope) {
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
          const bet = this.selectedBet;
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

          const bet = this.current.bets.find(item => item.lineBet === lineBet);
          if (!bet) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Bet not offered', 'INVALID_BET');
          this.lineBet = lineBet;
          this.events.emit('bet', bet);
          this.events.emit('input', this.input);
        }

        async connect() {
          if (!['disconnected', 'faulted', 'ready', 'special'].includes(this.state)) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Cannot connect now', 'BUSY');
          const generation = ++this.generation;
          const pending = this.network.pending();
          this.setState(pending ? 'recovering' : 'connecting');

          try {
            var _this$current$version, _this$current2;

            // Replaying an uncertain debit/selection always keeps its original request ID.
            if (pending) {
              const replay = await this.network.replay();
              this.accept(replay, generation);
            } // Replay may be an old cached result. Fetch fresh state before unlocking controls.


            const response = await this.network.execute('START_GAME', {}, (_this$current$version = (_this$current2 = this.current) == null ? void 0 : _this$current2.version) != null ? _this$current$version : 0);
            const snapshot = this.accept(response, generation);
            this.reels.restore(snapshot);
            await this.specials.sync(snapshot);
            this.assertAlive(generation);
            this.ready(snapshot);
          } catch (error) {
            this.fail(error, generation);
            throw error;
          }
        }

        async spin() {
          if (!this.input.canSpin || !this.current || this.lineBet === null) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Spin unavailable', 'INVALID_STATE');
          await this.spinInternal();
        }

        acquireAutoSpin() {
          if (this.automation || !this.input.canSpin) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Auto spin unavailable', 'INVALID_STATE');
          const owner = Symbol('autospin');
          this.automation = owner;
          this.events.emit('input', this.input);

          const canSpin = () => this.automation === owner && this.state === 'ready' && !!this.selectedBet && !!this.current && this.selectedBet.totalBet <= this.current.balance;

          return {
            canSpin,
            spin: async () => {
              if (!canSpin()) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
                error: Error()
              }), ClientError) : ClientError)('Auto spin unavailable', 'INVALID_STATE');
              await this.spinInternal();
            },
            release: () => {
              if (this.automation === owner) {
                this.automation = null;
                this.events.emit('input', this.input);
              }
            }
          };
        }

        async spinInternal() {
          if (!this.current || this.lineBet === null) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Not initialized', 'INVALID_STATE');
          (_crd && validateBet === void 0 ? (_reportPossibleCrUseOfvalidateBet({
            error: Error()
          }), validateBet) : validateBet)(this.lineBet, this.current.bets, this.current.balance);
          await this.perform('SPIN', {
            line_bet: this.lineBet
          }, true);
        }

        async nextSpecial(data = null) {
          var _this$current3;

          if (!this.input.canSpecialAction || !((_this$current3 = this.current) != null && _this$current3.special)) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('No active special game', 'INVALID_STATE');
          const special = this.current.special; // Counts distinguish a reel-based special from e.g. a pick game. Games can still supply custom presentation.

          await this.perform('NEXT_FEVER', {
            sg_id: special.id,
            data
          }, special.remaining !== null && special.stage !== 'init');
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

        async perform(action, payload, spinReels) {
          const generation = this.generation;
          const previous = this.current;
          this.quickStopRequested = false;
          this.setState('requesting');

          try {
            if (spinReels) this.reels.begin(previous.fakeStrips);
            const result = await this.network.execute(action, payload, previous.version);
            const snapshot = this.accept(result, generation);

            if (spinReels) {
              this.setState('stopping');
              await this.reels.present(snapshot, this.fast || this.quickStopRequested);
            }

            this.assertAlive(generation);
            this.setState('awarding');
            await this.awards.present(snapshot);
            this.assertAlive(generation);
            await this.specials.sync(snapshot);
            this.assertAlive(generation);
            this.ready(snapshot);
          } catch (error) {
            // Definitive 4xx did not apply. Restore old reels; reconciliation is still required before another action.
            if (error instanceof (_crd && HttpError === void 0 ? (_reportPossibleCrUseOfHttpError({
              error: Error()
            }), HttpError) : HttpError) && !error.retryable) this.reels.restore(previous);
            this.fail(error, generation);
            throw error;
          }
        }

        accept(result, generation) {
          var _this$current$version2, _this$current4;

          this.assertAlive(generation);
          const snapshot = this.decode(result.response, result.command.request_id);
          const mutation = result.command.action === 'SPIN' || result.command.action === 'NEXT_FEVER';
          if (snapshot.version < ((_this$current$version2 = (_this$current4 = this.current) == null ? void 0 : _this$current4.version) != null ? _this$current$version2 : 0) || mutation && snapshot.version <= result.command.expected_version) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
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