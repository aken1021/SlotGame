System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, amount, ClientError, _crd;

  /** Exact integer arithmetic even when the ledger has finer precision than UI. */
  function formatAmount(value, minorDigits, displayDigits) {
    if (minorDigits === void 0) {
      minorDigits = 4;
    }

    if (displayDigits === void 0) {
      displayDigits = 2;
    }

    (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
      error: Error()
    }), amount) : amount)(value);

    if (!Number.isInteger(minorDigits) || minorDigits < 0 || minorDigits > 12 || !Number.isInteger(displayDigits) || displayDigits < 0 || displayDigits > minorDigits) {
      throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
        error: Error()
      }), ClientError) : ClientError)('Invalid money precision', 'INVALID_PRECISION');
    }

    var divisor = BigInt(10) ** BigInt(minorDigits - displayDigits);
    var rounded = (BigInt(value) + divisor / BigInt(2)) / divisor;
    var scale = BigInt(10) ** BigInt(displayDigits);
    var whole = rounded / scale;
    return displayDigits === 0 ? "" + whole : whole + "." + ("" + rounded % scale).padStart(displayDigits, '0');
  }

  function validateBet(lineBet, bets, balance) {
    (_crd && amount === void 0 ? (_reportPossibleCrUseOfamount({
      error: Error()
    }), amount) : amount)(lineBet, 'lineBet');
    var bet = bets.find(item => item.lineBet === lineBet);
    if (!bet) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
      error: Error()
    }), ClientError) : ClientError)('Bet is not offered by server', 'INVALID_BET');
    if (bet.totalBet > balance) throw new (_crd && ClientError === void 0 ? (_reportPossibleCrUseOfClientError({
      error: Error()
    }), ClientError) : ClientError)('Insufficient displayed balance', 'INSUFFICIENT_BALANCE');
    return bet;
  }

  function _reportPossibleCrUseOfamount(extras) {
    _reporterNs.report("amount", "./model", _context.meta, extras);
  }

  function _reportPossibleCrUseOfClientError(extras) {
    _reporterNs.report("ClientError", "./model", _context.meta, extras);
  }

  _export({
    formatAmount: formatAmount,
    validateBet: validateBet
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      amount = _unresolved_2.amount;
      ClientError = _unresolved_2.ClientError;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "503cfvY0yFC2IqUc5XH0n9N", "money", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=493f56920106b0184d8e2d09063da3c409cbb5a6.js.map