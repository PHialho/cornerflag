export type BetResult = 'WIN' | 'HALF_WIN' | 'VOID' | 'HALF_LOSS' | 'LOSS' | 'CASHOUT';

export interface SettlementInput {
  stake: number;
  odd: number;
  result: BetResult;
  cashoutAmount?: number;
}

export interface SettlementOutput {
  profit: number;
  payout: number;
  roiContribution: number;
}

/**
 * Round a number to a specified number of decimal places for financial accuracy.
 */
export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates profit and payout for a single settled bet.
 */
export function settleBet(input: SettlementInput): SettlementOutput {
  const { stake, odd, result, cashoutAmount } = input;

  if (stake <= 0) {
    throw new Error('Stake deve ser maior que 0.');
  }
  if (odd <= 1.0) {
    throw new Error('Odd deve ser maior que 1.00.');
  }

  let profit = 0;
  let payout = 0;

  switch (result) {
    case 'WIN':
      profit = stake * (odd - 1);
      payout = stake * odd;
      break;
    case 'HALF_WIN':
      profit = (stake / 2) * (odd - 1);
      payout = stake + profit;
      break;
    case 'VOID':
      profit = 0;
      payout = stake;
      break;
    case 'HALF_LOSS':
      profit = -stake / 2;
      payout = stake / 2;
      break;
    case 'LOSS':
      profit = -stake;
      payout = 0;
      break;
    case 'CASHOUT':
      const cashout = cashoutAmount ?? stake;
      profit = cashout - stake;
      payout = cashout;
      break;
  }

  return {
    profit: round(profit, 2),
    payout: round(payout, 2),
    roiContribution: round((profit / stake) * 100, 2),
  };
}

/**
 * Calculates overall ROI (%) across multiple bets.
 */
export function calculateROI(totalProfit: number, totalStaked: number): number {
  if (totalStaked <= 0) return 0;
  return round((totalProfit / totalStaked) * 100, 2);
}

/**
 * Calculates Yield (%) across total bets placed.
 */
export function calculateYield(totalProfit: number, totalStaked: number): number {
  return calculateROI(totalProfit, totalStaked);
}

/**
 * Calculates Closing Line Value (CLV %).
 * Measures edge obtained against closing market odds.
 */
export function calculateCLV(betOdd: number, closingOdd: number): number {
  if (closingOdd <= 1.0) return 0;
  return round(((betOdd / closingOdd) - 1) * 100, 2);
}

/**
 * Calculates Expected Value (+EV %).
 */
export function calculateEV(betOdd: number, probability: number): number {
  if (probability < 0 || probability > 1) {
    throw new Error('Probabilidade deve estar entre 0 e 1 (ex: 0.55).');
  }
  return round(((betOdd * probability) - 1) * 100, 2);
}

/**
 * Calculates optimal stake percentage according to Fractional Kelly Criterion.
 * @param fractionalMultiplier - e.g. 0.25 for 1/4 Kelly, 0.5 for 1/2 Kelly
 */
export function calculateKellyStake(
  betOdd: number,
  estimatedProbability: number,
  fractionalMultiplier: number = 0.25
): number {
  if (betOdd <= 1.0 || estimatedProbability <= 0) return 0;
  const b = betOdd - 1;
  const p = estimatedProbability;
  const q = 1 - p;

  const fullKelly = (b * p - q) / b;
  if (fullKelly <= 0) return 0;

  const suggestedPercentage = fullKelly * fractionalMultiplier * 100;
  return round(suggestedPercentage, 2);
}
