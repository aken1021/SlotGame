System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, amount, ClientError, deepFreeze, _crd;

  function object(value, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(label);
    return value;
  }

  function fail(label) {
    throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
      error: Error()
    }), ClientError) : ClientError)(`Invalid protocol field: ${label}`, 'INVALID_RESPONSE');
  }

  function integer(value, label, min = 0) {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min) fail(label);
    return value;
  }

  function array(value, label) {
    if (!Array.isArray(value)) fail(label);
    return value;
  }

  function matrix(value, columns, height, label) {
    const reels = array(value, label);
    if (reels.length !== columns) fail(label);
    return reels.map((item, i) => {
      const cells = array(item, `${label}[${i}]`);
      if (cells.length !== height) fail(label);
      return cells.map(cell => integer(cell, label));
    });
  }
  /** Strict gh-client-v1 codec. Legacy numeric sg_map requires a separate game adapter. */


  function decodeSnapshot(value) {
    const data = object(value, 'snapshot');
    const layout = object(data.layout, 'layout');
    const reels = integer(layout.reels, 'layout.reels', 1);
    const rows = integer(layout.rows, 'layout.rows', 1);
    const bufferTop = integer(layout.bufferTop, 'layout.bufferTop');
    const bufferBottom = integer(layout.bufferBottom, 'layout.bufferBottom');
    if (reels > 32 || rows > 64 || bufferTop > 64 || bufferBottom > 64) fail('layout bounds');
    const bets = array(data.bets, 'bets').map(item => {
      const bet = object(item, 'bet');
      const lineBet = (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
        error: Error()
      }), amount) : amount)(bet.lineBet, 'bet.lineBet');
      const totalBet = (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
        error: Error()
      }), amount) : amount)(bet.totalBet, 'bet.totalBet');
      if (lineBet === 0 || totalBet === 0) fail('zero bet');
      return {
        lineBet,
        totalBet
      };
    });
    if (!bets.length || new Set(bets.map(bet => bet.lineBet)).size !== bets.length) fail('bets');
    const selectedLineBet = (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
      error: Error()
    }), amount) : amount)(data.selectedLineBet, 'selectedLineBet');
    if (!bets.some(bet => bet.lineBet === selectedLineBet)) fail('selectedLineBet');
    const fakeStrips = array(data.fakeStrips, 'fakeStrips').map(item => array(item, 'strip').map(cell => integer(cell, 'strip symbol')));
    if (fakeStrips.length !== reels || fakeStrips.some(strip => !strip.length)) fail('fakeStrips');
    const wins = array(data.wins, 'wins').map(item => {
      const win = object(item, 'win');
      const positions = array(win.positions, 'positions');
      if (positions.length !== reels) fail('positions');
      return {
        symbolId: integer(win.symbolId, 'symbolId'),
        amount: (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
          error: Error()
        }), amount) : amount)(win.amount),
        positions: positions.map(reel => {
          const cells = array(reel, 'positions reel');
          if (cells.length !== rows || cells.some(cell => typeof cell !== 'boolean')) fail('positions cells');
          return [...cells];
        })
      };
    });
    let special = null;

    if (data.special !== null) {
      const sg = object(data.special, 'special');
      if (sg.stage !== 'init' && sg.stage !== 'process' && sg.stage !== 'recovery') fail('special.stage');
      const remaining = sg.remaining === null ? null : integer(sg.remaining, 'remaining');
      const total = sg.total === null ? null : integer(sg.total, 'total');
      if (remaining === null !== (total === null) || remaining !== null && total !== null && remaining > total) fail('special counts');
      const picks = sg.picks === null ? null : array(sg.picks, 'picks').map(item => integer(item, 'pick', -1));
      special = {
        id: integer(sg.id, 'special.id'),
        stage: sg.stage,
        remaining,
        total,
        picks,
        data: JSON.parse(JSON.stringify(object(sg.data, 'special.data')))
      };
    }

    if (data.roundId !== null && (typeof data.roundId !== 'string' || !data.roundId)) fail('roundId');
    return (_crd && deepFreeze === void 0 ? (_reportPossibleCrUseOfdeepFreeze({
      error: Error()
    }), deepFreeze) : deepFreeze)({
      version: integer(data.version, 'version'),
      roundId: data.roundId,
      balance: (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
        error: Error()
      }), amount) : amount)(data.balance, 'balance'),
      layout: {
        reels,
        rows,
        bufferTop,
        bufferBottom
      },
      bets,
      selectedLineBet,
      board: matrix(data.board, reels, bufferTop + rows + bufferBottom, 'board'),
      fakeStrips,
      wins,
      lastWin: (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
        error: Error()
      }), amount) : amount)(data.lastWin, 'lastWin'),
      totalWin: (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
        error: Error()
      }), amount) : amount)(data.totalWin, 'totalWin'),
      winType: integer(data.winType, 'winType'),
      special
    });
  }

  function decodeEnvelope(value, requestId) {
    const envelope = object(value, 'response');
    if (envelope.schema !== 'gh-client-v1' || envelope.request_id !== requestId) fail('response correlation');
    const cmd = object(envelope.cmd_data, 'cmd_data');
    return decodeSnapshot(cmd.data);
  }

  function _reportPossibleCrUseOfamount(extras) {
    _reporterNs.report("amount", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfdeepFreeze(extras) {
    _reporterNs.report("deepFreeze", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSnapshot(extras) {
    _reporterNs.report("Snapshot", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialState(extras) {
    _reporterNs.report("SpecialState", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWin(extras) {
    _reporterNs.report("Win", "./model", _context.meta, extras);
  }

  _export({
    decodeSnapshot: decodeSnapshot,
    decodeEnvelope: decodeEnvelope
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      amount = _unresolved_2.amount;
      ClientError = _unresolved_2.ClientError;
      deepFreeze = _unresolved_2.deepFreeze;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e8db4PoU6RAuLzz74cGMxLx", "protocol", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e1a49ebde7a78852f5d4a084a74b4f942d9bb75b.js.map