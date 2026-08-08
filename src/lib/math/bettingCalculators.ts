import { round } from './calculator';

// ---------------------------------------------------------------------------
// 1. +EV (EXPECTED VALUE) CALCULATOR
// ---------------------------------------------------------------------------
export interface EVCalculationResult {
  evPercent: number;
  expectedProfitPer100: number;
  fairOdd: number;
  impliedProbabilityPercent: number;
  isPositiveEV: boolean;
}

export function calculateEVAdv(betOdd: number, estimatedProbabilityPercent: number): EVCalculationResult {
  if (betOdd <= 1.0 || estimatedProbabilityPercent <= 0) {
    return { evPercent: 0, expectedProfitPer100: 0, fairOdd: 0, impliedProbabilityPercent: 0, isPositiveEV: false };
  }

  const p = estimatedProbabilityPercent / 100;
  const evRatio = (betOdd * p) - 1;
  const evPercent = round(evRatio * 100, 2);
  const expectedProfitPer100 = round(100 * evRatio, 2);
  const fairOdd = round(1 / p, 2);
  const impliedProbabilityPercent = round((1 / betOdd) * 100, 2);

  return {
    evPercent,
    expectedProfitPer100,
    fairOdd,
    impliedProbabilityPercent,
    isPositiveEV: evPercent > 0,
  };
}

// ---------------------------------------------------------------------------
// 2. KELLY CRITERION CALCULATOR
// ---------------------------------------------------------------------------
export interface KellyCalculationResult {
  fullKellyPercent: number;
  suggestedKellyPercent: number;
  suggestedStakeAmount: number;
  expectedGrowthPercent: number;
}

export function calculateKellyAdv(
  bankrollBalance: number,
  betOdd: number,
  estimatedProbabilityPercent: number,
  fractionalMultiplier: number = 0.25
): KellyCalculationResult {
  if (betOdd <= 1.0 || estimatedProbabilityPercent <= 0 || bankrollBalance <= 0) {
    return { fullKellyPercent: 0, suggestedKellyPercent: 0, suggestedStakeAmount: 0, expectedGrowthPercent: 0 };
  }

  const b = betOdd - 1;
  const p = estimatedProbabilityPercent / 100;
  const q = 1 - p;

  const fullKellyDecimal = (b * p - q) / b;
  if (fullKellyDecimal <= 0) {
    return { fullKellyPercent: 0, suggestedKellyPercent: 0, suggestedStakeAmount: 0, expectedGrowthPercent: 0 };
  }

  const fullKellyPercent = round(fullKellyDecimal * 100, 2);
  const suggestedKellyPercent = round(fullKellyDecimal * fractionalMultiplier * 100, 2);
  const suggestedStakeAmount = round(bankrollBalance * (suggestedKellyPercent / 100), 2);
  const expectedGrowthPercent = round(p * Math.log(1 + b * (suggestedKellyPercent / 100)) + q * Math.log(1 - (suggestedKellyPercent / 100)), 4);

  return {
    fullKellyPercent,
    suggestedKellyPercent,
    suggestedStakeAmount,
    expectedGrowthPercent,
  };
}

// ---------------------------------------------------------------------------
// 3. ODDS CONVERTER & IMPLIED PROBABILITY
// ---------------------------------------------------------------------------
export interface OddsConversionResult {
  decimal: number;
  fractional: string;
  american: string;
  impliedProbabilityPercent: number;
}

export function convertOddsFromDecimal(decimalOdd: number): OddsConversionResult {
  if (decimalOdd <= 1.0) {
    return { decimal: 1.0, fractional: '0/1', american: '+0', impliedProbabilityPercent: 100 };
  }

  const impliedProb = round((1 / decimalOdd) * 100, 2);

  // American
  let americanStr = '';
  if (decimalOdd >= 2.0) {
    const americanVal = Math.round((decimalOdd - 1) * 100);
    americanStr = `+${americanVal}`;
  } else {
    const americanVal = Math.round(-100 / (decimalOdd - 1));
    americanStr = `${americanVal}`;
  }

  // Fractional (Approximation)
  const net = decimalOdd - 1;
  const tolerance = 1e-4;
  let num = 1;
  let den = 1;

  for (let d = 1; d <= 100; d++) {
    const n = Math.round(net * d);
    if (Math.abs(net - n / d) < tolerance) {
      num = n;
      den = d;
      break;
    }
  }

  return {
    decimal: round(decimalOdd, 2),
    fractional: `${num}/${den}`,
    american: americanStr,
    impliedProbabilityPercent: impliedProb,
  };
}

// ---------------------------------------------------------------------------
// 4. SUREBET / ARBITRAGE CALCULATOR (2 & 3 WAY)
// ---------------------------------------------------------------------------
export interface ArbitrageResult {
  arbitragePercentage: number; // Sum of 1/Odds
  isSurebet: boolean;
  profitMarginPercent: number;
  totalProfit: number;
  stakes: number[];
  payouts: number[];
}

export function calculateArbitrage(odds: number[], totalInvestment: number): ArbitrageResult {
  if (odds.length < 2 || totalInvestment <= 0 || odds.some((o) => o <= 1.0)) {
    return { arbitragePercentage: 1, isSurebet: false, profitMarginPercent: 0, totalProfit: 0, stakes: [], payouts: [] };
  }

  const arbSum = odds.reduce((acc, o) => acc + 1 / o, 0);
  const isSurebet = arbSum < 1.0;
  const profitMarginPercent = round(((1 / arbSum) - 1) * 100, 2);

  const stakes = odds.map((o) => round((totalInvestment / (o * arbSum)), 2));
  const payouts = stakes.map((s, idx) => round(s * odds[idx], 2));

  const minPayout = Math.min(...payouts);
  const totalProfit = round(minPayout - totalInvestment, 2);

  return {
    arbitragePercentage: round(arbSum, 4),
    isSurebet,
    profitMarginPercent,
    totalProfit,
    stakes,
    payouts,
  };
}

// ---------------------------------------------------------------------------
// 5. DUTCHING CALCULATOR
// ---------------------------------------------------------------------------
export interface DutchingResult {
  totalStake: number;
  individualStakes: number[];
  equalPayout: number;
  netProfit: number;
  roiPercent: number;
}

export function calculateDutching(odds: number[], targetTotalInvestment: number): DutchingResult {
  if (odds.length < 2 || targetTotalInvestment <= 0 || odds.some((o) => o <= 1.0)) {
    return { totalStake: 0, individualStakes: [], equalPayout: 0, netProfit: 0, roiPercent: 0 };
  }

  const invSum = odds.reduce((acc, o) => acc + 1 / o, 0);
  const equalPayout = round(targetTotalInvestment / invSum, 2);
  const individualStakes = odds.map((o) => round(equalPayout / o, 2));
  const netProfit = round(equalPayout - targetTotalInvestment, 2);
  const roiPercent = round((netProfit / targetTotalInvestment) * 100, 2);

  return {
    totalStake: targetTotalInvestment,
    individualStakes,
    equalPayout,
    netProfit,
    roiPercent,
  };
}

// ---------------------------------------------------------------------------
// 6. HEDGING / CASHOUT CALCULATOR
// ---------------------------------------------------------------------------
export interface HedgeResult {
  hedgeStake: number;
  guaranteedProfitIfHedged: number;
  originalProfitIfWon: number;
  originalLossIfLost: number;
  roiPercent: number;
}

export function calculateHedge(
  originalStake: number,
  originalOdd: number,
  currentHedgeOdd: number
): HedgeResult {
  if (originalStake <= 0 || originalOdd <= 1.0 || currentHedgeOdd <= 1.0) {
    return { hedgeStake: 0, guaranteedProfitIfHedged: 0, originalProfitIfWon: 0, originalLossIfLost: 0, roiPercent: 0 };
  }

  const originalReturn = originalStake * originalOdd;
  const hedgeStake = round(originalReturn / currentHedgeOdd, 2);
  const totalInvestment = originalStake + hedgeStake;
  const guaranteedProfitIfHedged = round(originalReturn - totalInvestment, 2);
  const originalProfitIfWon = round(originalStake * (originalOdd - 1), 2);
  const originalLossIfLost = round(-originalStake, 2);
  const roiPercent = round((guaranteedProfitIfHedged / totalInvestment) * 100, 2);

  return {
    hedgeStake,
    guaranteedProfitIfHedged,
    originalProfitIfWon,
    originalLossIfLost,
    roiPercent,
  };
}

// ---------------------------------------------------------------------------
// 7. MATCHED BETTING / BONUS CALCULATOR (FREEBET SNR & SR)
// ---------------------------------------------------------------------------
export interface MatchedBettingResult {
  layStake: number;
  layLiability: number;
  guaranteedProfit: number;
  retentionPercent: number;
}

export function calculateMatchedBetting(
  bonusStake: number,
  backOdd: number,
  layOdd: number,
  exchangeCommissionPercent: number = 0,
  isSNR: boolean = true // SNR = Stake Not Returned (Standard Freebet)
): MatchedBettingResult {
  if (bonusStake <= 0 || backOdd <= 1.0 || layOdd <= 1.0) {
    return { layStake: 0, layLiability: 0, guaranteedProfit: 0, retentionPercent: 0 };
  }

  const commDecimal = exchangeCommissionPercent / 100;

  let layStake = 0;
  if (isSNR) {
    layStake = (bonusStake * (backOdd - 1)) / (layOdd - commDecimal);
  } else {
    layStake = (bonusStake * backOdd) / (layOdd - commDecimal);
  }

  layStake = round(layStake, 2);
  const layLiability = round(layStake * (layOdd - 1), 2);

  let guaranteedProfit = 0;
  if (isSNR) {
    guaranteedProfit = round(layStake * (1 - commDecimal), 2);
  } else {
    guaranteedProfit = round(bonusStake * backOdd - layLiability - bonusStake, 2);
  }

  const retentionPercent = round((guaranteedProfit / bonusStake) * 100, 2);

  return {
    layStake,
    layLiability,
    guaranteedProfit,
    retentionPercent,
  };
}

// ---------------------------------------------------------------------------
// 8. ASIAN HANDICAP RESOLUTION MATRIX
// ---------------------------------------------------------------------------
export type AsianHandicapOutcome = 'WIN' | 'HALF_WIN' | 'VOID' | 'HALF_LOSS' | 'LOSS';

export interface AsianHandicapResult {
  outcome: AsianHandicapOutcome;
  profit: number;
  payout: number;
  description: string;
}

export function calculateAsianHandicap(
  stake: number,
  odd: number,
  handicapLine: number, // e.g. -0.25, -0.5, -0.75, -1.0, 0, +0.25, +0.5, etc.
  homeGoals: number,
  awayGoals: number
): AsianHandicapResult {
  if (stake <= 0 || odd <= 1.0) {
    return { outcome: 'VOID', profit: 0, payout: stake, description: 'Valores inválidos.' };
  }

  const diff = homeGoals - awayGoals;
  const netScore = diff + handicapLine;

  let outcome: AsianHandicapOutcome = 'VOID';
  let profit = 0;
  let payout = 0;
  let description = '';

  if (netScore > 0.25) {
    outcome = 'WIN';
    profit = round(stake * (odd - 1), 2);
    payout = round(stake * odd, 2);
    description = 'Aposta totalmente ganha.';
  } else if (netScore === 0.25) {
    outcome = 'HALF_WIN';
    profit = round((stake / 2) * (odd - 1), 2);
    payout = round(stake + profit, 2);
    description = 'Metade da aposta ganha, metade anulada.';
  } else if (netScore === 0) {
    outcome = 'VOID';
    profit = 0;
    payout = stake;
    description = 'Aposta totalmente devolvida (Push/Void).';
  } else if (netScore === -0.25) {
    outcome = 'HALF_LOSS';
    profit = round(-stake / 2, 2);
    payout = round(stake / 2, 2);
    description = 'Metade da aposta perdida, metade devolvida.';
  } else {
    outcome = 'LOSS';
    profit = round(-stake, 2);
    payout = 0;
    description = 'Aposta totalmente perdida.';
  }

  return {
    outcome,
    profit,
    payout,
    description,
  };
}

// ---------------------------------------------------------------------------
// 9. PARLAY / ACCUMULATOR CALCULATOR
// ---------------------------------------------------------------------------
export interface ParlayResult {
  combinedOdd: number;
  totalPayout: number;
  netProfit: number;
  roiPercent: number;
}

export function calculateParlay(odds: number[], totalStake: number): ParlayResult {
  if (odds.length === 0 || totalStake <= 0 || odds.some((o) => o <= 1.0)) {
    return { combinedOdd: 1.0, totalPayout: totalStake, netProfit: 0, roiPercent: 0 };
  }

  const combinedOdd = round(odds.reduce((acc, o) => acc * o, 1), 3);
  const totalPayout = round(totalStake * combinedOdd, 2);
  const netProfit = round(totalPayout - totalStake, 2);
  const roiPercent = round((netProfit / totalStake) * 100, 2);

  return {
    combinedOdd,
    totalPayout,
    netProfit,
    roiPercent,
  };
}

// ---------------------------------------------------------------------------
// 10. POISSON EXPECTED GOALS (xG) MODEL
// ---------------------------------------------------------------------------
export interface PoissonMatrixResult {
  prob1X2: { homeWinProb: number; drawProb: number; awayWinProb: number };
  probOverUnder25: { over25Prob: number; under25Prob: number };
  probBTTS: { bttsYesProb: number; bttsNoProb: number };
  matrix: number[][]; // 6x6 score matrix
}

function poissonPMF(k: number, lambda: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function calculatePoissonMatrix(homeXG: number, awayXG: number): PoissonMatrixResult {
  if (homeXG < 0 || awayXG < 0) {
    return {
      prob1X2: { homeWinProb: 0, drawProb: 0, awayWinProb: 0 },
      probOverUnder25: { over25Prob: 0, under25Prob: 0 },
      probBTTS: { bttsYesProb: 0, bttsNoProb: 0 },
      matrix: [],
    };
  }

  const maxGoals = 5;
  const matrix: number[][] = [];

  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;
  let under25Prob = 0;
  let bttsYesProb = 0;

  for (let h = 0; h <= maxGoals; h++) {
    matrix[h] = [];
    const pHome = poissonPMF(h, homeXG);

    for (let a = 0; a <= maxGoals; a++) {
      const pAway = poissonPMF(a, awayXG);
      const prob = pHome * pAway;
      matrix[h][a] = round(prob * 100, 2);

      if (h > a) homeWinProb += prob;
      else if (h === a) drawProb += prob;
      else awayWinProb += prob;

      if (h + a < 2.5) under25Prob += prob;
      if (h > 0 && a > 0) bttsYesProb += prob;
    }
  }

  return {
    prob1X2: {
      homeWinProb: round(homeWinProb * 100, 1),
      drawProb: round(drawProb * 100, 1),
      awayWinProb: round(awayWinProb * 100, 1),
    },
    probOverUnder25: {
      over25Prob: round((1 - under25Prob) * 100, 1),
      under25Prob: round(under25Prob * 100, 1),
    },
    probBTTS: {
      bttsYesProb: round(bttsYesProb * 100, 1),
      bttsNoProb: round((1 - bttsYesProb) * 100, 1),
    },
    matrix,
  };
}
