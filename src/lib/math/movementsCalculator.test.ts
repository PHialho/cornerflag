import { describe, it, expect } from 'vitest';
import { calculateCashflowSummary, calculateNetMovementsBalance } from './movementsCalculator';
import type { BankrollMovement } from '../../types';

describe('movementsCalculator', () => {
  it('calculates cashflow metrics correctly', () => {
    const mockMovements: BankrollMovement[] = [
      {
        id: 'm1',
        bankroll_id: 'b1',
        type: 'DEPOSIT',
        amount: 500,
        payment_method: 'MB WAY',
        created_at: '2026-08-01',
      },
      {
        id: 'm2',
        bankroll_id: 'b1',
        type: 'DEPOSIT',
        amount: 250,
        payment_method: 'Skrill',
        created_at: '2026-08-02',
      },
      {
        id: 'm3',
        bankroll_id: 'b1',
        type: 'WITHDRAWAL',
        amount: 300,
        payment_method: 'Transferência Bancária',
        created_at: '2026-08-05',
      },
      {
        id: 'm4',
        bankroll_id: 'b1',
        type: 'BONUS',
        amount: 50,
        created_at: '2026-08-06',
      },
    ];

    const summary = calculateCashflowSummary(mockMovements, 'b1');

    expect(summary.totalDeposits).toBe(750);
    expect(summary.totalWithdrawals).toBe(300);
    expect(summary.totalBonuses).toBe(50);
    expect(summary.netCashflow).toBe(-450); // Withdrawn 300 - Deposited 750 = -450 (Net 450€ invested)
    expect(summary.netInvestedCapital).toBe(450);
    expect(summary.movementCount).toBe(4);
  });

  it('calculates net movements balance correctly for bankroll reconciliation', () => {
    const mockMovements: BankrollMovement[] = [
      {
        id: 'm1',
        bankroll_id: 'b1',
        type: 'DEPOSIT',
        amount: 1000,
        created_at: '2026-08-01',
      },
      {
        id: 'm2',
        bankroll_id: 'b1',
        type: 'WITHDRAWAL',
        amount: 400,
        created_at: '2026-08-02',
      },
      {
        id: 'm3',
        bankroll_id: 'b1',
        type: 'BONUS',
        amount: 100,
        created_at: '2026-08-03',
      },
    ];

    // Net balance impact = +1000 - 400 + 100 = +700
    const netImpact = calculateNetMovementsBalance(mockMovements, 'b1');
    expect(netImpact).toBe(700);
  });
});
