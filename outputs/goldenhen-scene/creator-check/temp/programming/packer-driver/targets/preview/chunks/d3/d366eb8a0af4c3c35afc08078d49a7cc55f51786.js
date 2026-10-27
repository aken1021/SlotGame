System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, ClientError, _crd;

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

      for (var item of Object.values(value)) deepFreeze(item);
    }

    return value;
  }

  function visibleBoard(snapshot) {
    return snapshot.board.map(reel => reel.slice(snapshot.layout.bufferTop, snapshot.layout.bufferTop + snapshot.layout.rows));
  }

  _export({
    ClientError: void 0,
    amount: amount,
    deepFreeze: deepFreeze,
    visibleBoard: visibleBoard
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "66606fEKP9P8bM75HB71grF", "model", undefined);
      /** Amounts are server minor units; no client-side payout calculation. */

      /** Every gh-client-v1 response contains an authoritative full snapshot. */


      _export("ClientError", ClientError = class ClientError extends Error {
        constructor(message, code) {
          super(message);
          this.code = code;
          this.name = 'ClientError';
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d366eb8a0af4c3c35afc08078d49a7cc55f51786.js.map