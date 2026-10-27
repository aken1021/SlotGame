System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ClientError, visibleBoard, delay, isAbort, throwIfAborted, ReelController, AwardController, ReelMotion, _crd;

  function assertLayoutMatches(layout, reelCount, rows) {
    if (layout.reels !== reelCount || layout.rows !== rows) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
      error: Error()
    }), ClientError) : ClientError)('View layout differs from server', 'LAYOUT_MISMATCH');
  }

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayout(extras) {
    _reporterNs.report("Layout", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSnapshot(extras) {
    _reporterNs.report("Snapshot", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfvisibleBoard(extras) {
    _reporterNs.report("visibleBoard", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdelay(extras) {
    _reporterNs.report("delay", "./timing", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisAbort(extras) {
    _reporterNs.report("isAbort", "./timing", _context.meta, extras);
  }

  function _reportPossibleCrUseOfthrowIfAborted(extras) {
    _reporterNs.report("throwIfAborted", "./timing", _context.meta, extras);
  }

  _export({
    ReelController: void 0,
    AwardController: void 0,
    ReelMotion: void 0,
    assertLayoutMatches: assertLayoutMatches
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ClientError = _unresolved_2.ClientError;
      visibleBoard = _unresolved_2.visibleBoard;
    }, function (_unresolved_3) {
      delay = _unresolved_3.delay;
      isAbort = _unresolved_3.isAbort;
      throwIfAborted = _unresolved_3.throwIfAborted;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5b3caG689JFcZohbwoLqoWp", "presentation", undefined);

      _export("ReelController", ReelController = class ReelController {
        constructor(view, timing = {
          stopGapMs: 400,
          resultDelayMs: 250
        }) {
          this.phase = 'idle';
          this.stop = null;
          this.disposed = false;
          this.view = view;
          this.timing = timing;
          if (![timing.stopGapMs, timing.resultDelayMs].every(v => Number.isFinite(v) && v >= 0)) throw new RangeError('Invalid reel timing');
        }

        begin(strips) {
          if (this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Reels disposed', 'DISPOSED');
          if (this.phase !== 'idle') throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Reels already active', 'BUSY');
          this.phase = 'spinning';

          try {
            this.view.begin(strips);
          } catch (error) {
            this.phase = 'idle';
            throw error;
          }
        }

        async present(snapshot, fast = false) {
          if (this.phase !== 'spinning') throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Reels not spinning', 'INVALID_STATE');
          this.phase = 'stopping';
          const stop = new AbortController();
          this.stop = stop;
          const board = (_crd && visibleBoard === void 0 ? (_reportPossibleCrUseOfvisibleBoard({
            error: Error()
          }), visibleBoard) : visibleBoard)(snapshot);

          try {
            if (!fast) await (_crd && delay === void 0 ? (_reportPossibleCrUseOfdelay({
              error: Error()
            }), delay) : delay)(this.timing.resultDelayMs, stop.signal);

            for (let index = 0; index < board.length; index++) {
              (_crd && throwIfAborted === void 0 ? (_reportPossibleCrUseOfthrowIfAborted({
                error: Error()
              }), throwIfAborted) : throwIfAborted)(stop.signal);
              if (!fast && index > 0) await (_crd && delay === void 0 ? (_reportPossibleCrUseOfdelay({
                error: Error()
              }), delay) : delay)(this.timing.stopGapMs, stop.signal);
              await this.view.stopReel(index, board[index], stop.signal);
            }
          } catch (error) {
            if (!(_crd && isAbort === void 0 ? (_reportPossibleCrUseOfisAbort({
              error: Error()
            }), isAbort) : isAbort)(error) || !stop.signal.aborted) throw error;
          } finally {
            this.stop = null;
            this.phase = 'idle';
            if (!this.disposed) this.view.snap(board);
          }
        }

        fastStop() {
          var _this$stop;

          (_this$stop = this.stop) == null || _this$stop.abort();
        }

        restore(snapshot) {
          this.cancel();
          this.view.snap((_crd && visibleBoard === void 0 ? (_reportPossibleCrUseOfvisibleBoard({
            error: Error()
          }), visibleBoard) : visibleBoard)(snapshot));
        }

        cancel() {
          var _this$stop2;

          (_this$stop2 = this.stop) == null || _this$stop2.abort();
          this.view.cancel();
          if (!this.stop) this.phase = 'idle';
        }

        dispose() {
          this.disposed = true;
          this.cancel();
        }

      });

      _export("AwardController", AwardController = class AwardController {
        constructor(view) {
          this.active = null;
          this.disposed = false;
          this.view = view;
        }

        async present(snapshot) {
          if (this.disposed) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Awards disposed', 'DISPOSED');
          if (this.active) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
            error: Error()
          }), ClientError) : ClientError)('Award already active', 'BUSY');
          const active = new AbortController();
          this.active = active;

          try {
            if (snapshot.lastWin > 0) await this.view.show(snapshot, active.signal);
          } catch (error) {
            if (!(_crd && isAbort === void 0 ? (_reportPossibleCrUseOfisAbort({
              error: Error()
            }), isAbort) : isAbort)(error) || !active.signal.aborted) throw error;
          } finally {
            this.active = null;
            if (!this.disposed) this.view.finish(snapshot);
          }
        }

        skip() {
          var _this$active;

          (_this$active = this.active) == null || _this$active.abort();
        }

        dispose() {
          var _this$active2;

          this.disposed = true;
          (_this$active2 = this.active) == null || _this$active2.abort();
        }

      });
      /** Cosmetic deterministic reel loop; never selects a result or award. */


      _export("ReelMotion", ReelMotion = class ReelMotion {
        constructor(strip, cellSize, speed = 900) {
          this.offset = 0;
          this.cursor = 0;
          this.strip = strip;
          this.cellSize = cellSize;
          this.speed = speed;
          if (!strip.length || !Number.isFinite(cellSize) || cellSize <= 0 || !Number.isFinite(speed) || speed < 0) throw new RangeError('Invalid reel motion');
        }

        tick(dt, visibleRows) {
          if (!Number.isFinite(dt) || dt < 0 || !Number.isSafeInteger(visibleRows) || visibleRows < 1) throw new RangeError('Invalid frame');
          const advance = this.offset + Math.min(dt, 0.1) * this.speed;
          const crossed = Math.floor(advance / this.cellSize);
          this.cursor = (this.cursor + crossed) % this.strip.length;
          this.offset = advance % this.cellSize;
          return {
            offset: this.offset,
            symbols: Array.from({
              length: visibleRows + 1
            }, (_, i) => this.strip[(this.cursor + i) % this.strip.length])
          };
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b1048dd1d90539a323f742bc862dab6932784976.js.map