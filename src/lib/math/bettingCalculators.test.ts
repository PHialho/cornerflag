import { describe, it, expect } from 'vitest';
import {
  calculateEVAdv,
  calculateKellyAdv,
  convertOddsFromDecimal,
  calculateArbitrage,
  calculateDutching,
  calculateHedge,
  calculateMatchedBetting,
  calculateAsianHandicap,
  calculateParlay,
  calculatePoissonMatrix,
} from './bettingCalculators';

describe('bettingCalculators Suite', () => {
  it('1. +EV Calculator works correctly', () => {
    const res = calculateEVAdv(2.10, 55);
    expect(res.evPercent).toBe(15.5);
    expect(res.fairOdd).toBe(1.82);
    expect(res.isPositiveEV).toBe(true);
  });

  it('2. Kelly Criterion works correctly', () => {
    const res = calculateKellyAdv(1000, 2.0, 55, 0.25);
    expect(res.fullKellyPercent).toBe(10);
    expect(res.suggestedKellyPercent).toBe(2.5);
    expect(res.suggestedStakeAmount).toBe(25);
  });

  it('3. Odds Converter works correctly', () => {
    const res = convertOddsFromDecimal(2.5);
    expect(res.decimal).toBe(2.5);
    expect(res.fractional).toBe('3/2');
    expect(res.american).toBe('+150');
    expect(res.impliedProbabilityPercent).toBe(40);
  });

  it('4. Arbitrage Calculator works correctly', () => {
    const res = calculateArbitrage([2.1, 2.1], 100);
    expect(res.isSurebet).toBe(true);
    expect(res.profitMarginPercent).toBe(5);
    expect(res.stakes[0]).toBe(50);
  });

  it('5. Dutching Calculator works correctly', () => {
    const res = calculateDutching([3.0, 4.0], 100);
    expect(res.netProfit).toBe(71.43);
    expect(res.equalPayout).toBe(171.43);
  });

  it('6. Hedging / Cash Out Calculator works correctly', () => {
    const res = calculateHedge(50, 3.0, 1.8);
    expect(res.hedgeStake).toBe(83.33);
    expect(res.guaranteedProfitIfHedged).toBe(16.67);
  });

  it('7. Matched Betting Calculator works correctly', () => {
    const res = calculateMatchedBetting(50, 2.0, 2.0, 0, true);
    expect(res.layStake).toBe(25);
    expect(res.guaranteedProfit).toBe(25);
    expect(res.retentionPercent).toBe(50);
  });

  it('8. Asian Handicap Calculator works correctly', () => {
    const winRes = calculateAsianHandicap(100, 2.0, -0.25, 1, 0);
    expect(winRes.outcome).toBe('WIN');
    expect(winRes.profit).toBe(100);

    const halfLossRes = calculateAsianHandicap(100, 2.0, -0.25, 0, 0);
    expect(halfLossRes.outcome).toBe('HALF_LOSS');
    expect(halfLossRes.profit).toBe(-50);
  });

  it('9. Parlay / Accumulator Calculator works correctly', () => {
    const res = calculateParlay([1.5, 2.0, 1.8], 100);
    expect(res.combinedOdd).toBe(5.4);
    expect(res.netProfit).toBe(440);
  });

  it('10. Poisson Expected Goals Model works correctly', () => {
    const res = calculatePoissonMatrix(1.5, 1.0);
    expect(res.prob1X2.homeWinProb).toBeGreaterThan(40);
    expect(res.matrix.length).toBe(6);
  });
});
