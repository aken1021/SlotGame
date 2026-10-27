import {amount, ClientError} from './model';

/** Exact integer arithmetic even when the ledger has finer precision than UI. */
export function formatAmount(value: number, minorDigits = 4, displayDigits = 2): string {
  amount(value);
  if (!Number.isInteger(minorDigits) || minorDigits < 0 || minorDigits > 12 ||
      !Number.isInteger(displayDigits) || displayDigits < 0 || displayDigits > minorDigits) {
    throw new ClientError('Invalid money precision', 'INVALID_PRECISION');
  }
  const divisor = BigInt(10) ** BigInt(minorDigits - displayDigits);
  const rounded = (BigInt(value) + divisor / BigInt(2)) / divisor;
  const scale = BigInt(10) ** BigInt(displayDigits);
  const whole = rounded / scale;
  return displayDigits === 0 ? `${whole}` : `${whole}.${`${rounded % scale}`.padStart(displayDigits, '0')}`;
}
export function validateBet(lineBet: number, bets: readonly { lineBet: number; totalBet: number }[], balance: number) {
  amount(lineBet, 'lineBet');
  const bet = bets.find(item => item.lineBet === lineBet);
  if (!bet) throw new ClientError('Bet is not offered by server', 'INVALID_BET');
  if (bet.totalBet > balance) throw new ClientError('Insufficient displayed balance', 'INSUFFICIENT_BALANCE');
  return bet;
}
