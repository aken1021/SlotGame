System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, deepFreeze, delay, throwIfAborted, HttpError, FetchTransport, CommandClient, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfAction(extras) {
    _reporterNs.report("Action", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCommand(extras) {
    _reporterNs.report("Command", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdeepFreeze(extras) {
    _reporterNs.report("deepFreeze", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPendingStore(extras) {
    _reporterNs.report("PendingStore", "./storage", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdelay(extras) {
    _reporterNs.report("delay", "./timing", _context.meta, extras);
  }

  function _reportPossibleCrUseOfthrowIfAborted(extras) {
    _reporterNs.report("throwIfAborted", "./timing", _context.meta, extras);
  }

  _export({
    HttpError: void 0,
    FetchTransport: void 0,
    CommandClient: void 0
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ClientError = _unresolved_2.ClientError;
      deepFreeze = _unresolved_2.deepFreeze;
    }, function (_unresolved_3) {
      delay = _unresolved_3.delay;
      throwIfAborted = _unresolved_3.throwIfAborted;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "066c1atzlBABL8q7ceiQINX", "network", undefined);

      _export("HttpError", HttpError = class HttpError extends (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
        error: Error()
      }), ClientError) : ClientError) {
        constructor(status, message, code) {
          if (code === void 0) {
            code = 'HTTP_ERROR';
          }

          super(message, code);
          this.status = status;
        }

        get retryable() {
          return this.status === 408 || this.status === 429 || this.status >= 500;
        }

      });

      _export("FetchTransport", FetchTransport = class FetchTransport {
        constructor(endpoint, fetcher) {
          if (fetcher === void 0) {
            fetcher = globalThis.fetch.bind(globalThis);
          }

          this.endpoint = endpoint;
          this.fetcher = fetcher;
        }

        send(command, signal) {
          var _this = this;

          return _asyncToGenerator(function* () {
            var response = yield _this.fetcher(_this.endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(command),
              signal
            });
            if (!response.ok) throw new HttpError(response.status, "Command failed (" + response.status + ")");
            return response.json();
          })();
        }

      });

      _export("CommandClient", CommandClient = class CommandClient {
        constructor(transport, store, options) {
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
          this.newId = (_options$newId = options.newId) != null ? _options$newId : () => globalThis.crypto.randomUUID();

          if (!options.gameId || !options.playerId || !Number.isInteger(this.attempts) || this.attempts < 1 || !Number.isFinite(this.timeout) || this.timeout <= 0 || !Number.isFinite(this.retryDelay) || this.retryDelay < 0) {
            throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Invalid request options', 'INVALID_OPTIONS');
          }

          this.pending(); // Refuse to silently discard a different player's unfinished command.
        }

        pending() {
          var value = this.store.load();

          if (value && (value.game_id !== this.options.gameId || value.player_id !== this.options.playerId)) {
            throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Pending request belongs to a different session', 'PENDING_OWNER_MISMATCH');
          }

          return value;
        }

        execute(action, payload, version) {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            _this2.assertAvailable();

            if (_this2.pending()) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Reconcile pending command first', 'PENDING_REQUEST');
            if (!Number.isSafeInteger(version) || version < 0) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Invalid version', 'INVALID_VERSION');
            var command = (_crd && deepFreeze === void 0 ? (_reportPossibleCrUseOfdeepFreeze({
              error: Error()
            }), deepFreeze) : deepFreeze)({
              schema: 'gh-client-v1',
              game_id: _this2.options.gameId,
              player_id: _this2.options.playerId,
              request_id: _this2.newId(),
              action,
              expected_version: version,
              payload: JSON.parse(JSON.stringify(payload))
            });
            if (!command.request_id) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('Request ID is empty', 'INVALID_ID'); // Persist BEFORE any I/O. Failure to persist means nothing is sent.

            _this2.store.save(command);

            return _this2.send(command);
          })();
        }

        replay() {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            _this3.assertAvailable();

            var command = _this3.pending();

            if (!command) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
              error: Error()
            }), ClientError) : ClientError)('No pending request', 'NO_PENDING');
            return _this3.send(command);
          })();
        }

        acknowledge(requestId) {
          var _this$pending;

          if (((_this$pending = this.pending()) == null ? void 0 : _this$pending.request_id) !== requestId) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Wrong acknowledgement', 'INVALID_ACK');
          this.store.clear();
        }

        dispose() {
          var _this$active;

          this.disposed = true;
          (_this$active = this.active) == null || _this$active.abort();
        }

        assertAvailable() {
          if (this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Client disposed', 'DISPOSED');
          if (this.active) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Request already in flight', 'BUSY');
        }

        send(command) {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            var lifetime = new AbortController();
            _this4.active = lifetime;

            try {
              var _loop = function* _loop() {
                (_crd && throwIfAborted === void 0 ? (_reportPossibleCrUseOfthrowIfAborted({
                  error: Error()
                }), throwIfAborted) : throwIfAborted)(lifetime.signal);
                var controller = new AbortController();

                var cancel = () => controller.abort();

                lifetime.signal.addEventListener('abort', cancel, {
                  once: true
                });
                var timer;

                try {
                  // Promise race enforces timeout even for custom transports ignoring AbortSignal.
                  var timeout = new Promise((_, reject) => {
                    timer = setTimeout(() => {
                      reject(new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
                        error: Error()
                      }), ClientError) : ClientError)('Request timed out; outcome is unknown', 'TIMEOUT'));
                      controller.abort();
                    }, _this4.timeout);
                  });
                  var cancelled = new Promise((_, reject) => {
                    controller.signal.addEventListener('abort', () => reject(new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
                      error: Error()
                    }), ClientError) : ClientError)('Request cancelled; reconcile on resume', 'CANCELLED')), {
                      once: true
                    });
                  });
                  var response = yield Promise.race([_this4.transport.send(command, controller.signal), timeout, cancelled]);
                  return {
                    v: {
                      command,
                      response
                    }
                  };
                } catch (error) {
                  if (error instanceof HttpError && !error.retryable) {
                    // API contract: definitive 4xx means transaction was not applied.
                    _this4.acknowledge(command.request_id);

                    throw error;
                  }

                  if (attempt + 1 === _this4.attempts || lifetime.signal.aborted) throw error;
                } finally {
                  if (timer !== undefined) clearTimeout(timer);
                  lifetime.signal.removeEventListener('abort', cancel);
                }

                yield (_crd && delay === void 0 ? (_reportPossibleCrUseOfdelay({
                  error: Error()
                }), delay) : delay)(_this4.retryDelay, lifetime.signal);
              },
                  _ret;

              for (var attempt = 0; attempt < _this4.attempts; attempt++) {
                _ret = yield* _loop();
                if (_ret) return _ret.v;
              }

              throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
                error: Error()
              }), ClientError) : ClientError)('No request attempt', 'INVALID_OPTIONS');
            } finally {
              _this4.active = null;
            }
          })();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9e6f0f0c9643dac00e1943726c34f23f15092631.js.map