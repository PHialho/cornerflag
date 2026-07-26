import { describe, it, expect } from 'vitest';
import {
  settleBet,
  calculateROI,
  calculateCLV,
  calculateEV,
  calculateKellyStake,
} from './calculator';

describe('Financial Math & Settlement Logic', () => {
  it('calculates full WIN settlement correctly', () => {
    const result = settleBet({ stake: 100, odd: 1.90, result: 'WIN' });
    expect(result.profit).toBe(90);
    expect(result.payout).toBe(190);
    expect(result.roiContribution).toBe(90);
  });

  it('calculates HALF_WIN settlement correctly', () => {
    const result = settleBet({ stake: 100, odd: 1.80, result: 'HALF_WIN' });
    expect(result.profit).toBe(40);
    expect(result.payout).toBe(140);
    expect(result.roiContribution).toBe(40);
  });

  it('calculates VOID settlement correctly', () => {
    const result = settleBet({ stake: 100, odd: 2.10, result: 'VOID' });
    expect(result.profit).toBe(0);
    expect(result.payout).toBe(100);
    expect(result.roiContribution).toBe(0);
  });

  it('calculates HALF_LOSS settlement correctly', () => {
    const result = settleBet({ stake: 100, odd: 2.00, result: 'HALF_LOSS' });
    expect(result.profit).toBe(-50);
    expect(result.payout).toBe(50);
    expect(result.roiContribution).toBe(-50);
  });

  it('calculates full LOSS settlement correctly', () => {
    const result = settleBet({ stake: 100, odd: 1.95, result: 'LOSS' });
    expect(result.profit).toBe(-100);
    expect(result.payout).toBe(0);
    expect(result.roiContribution).toBe(-100);
  });

  it('calculates overall ROI correctly', () => {
    expect(calculateROI(150, 1000)).toBe(15.0);
    expect(calculateROI(-50, 500)).toBe(-10.0);
  });

  it('calculates Closing Line Value (CLV %) correctly', () => {
    // Bet at 2.00, closed at 1.80 -> +11.11% CLV
    expect(calculateCLV(2.00, 1.80)).toBe(11.11);
  });

  it('calculates Expected Value (+EV %) correctly', () => {
    // Odd 2.00 with 55% estimated probability -> +10.00% +EV
    expect(calculateEV(2.00, 0.55)).toBe(10.00);
  });

  it('calculates Fractional Kelly stake percentage correctly', () => {
    // Odd 2.00 with 60% probability, 1/4 Kelly -> (0.6*2 - 1)/(2-1) * 0.25 = 0.2 * 0.25 = 5%
    expect(calculateKellyStake(2.00, 0.60, 0.25)).toBe(5.0);
  });
});
