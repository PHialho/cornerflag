import { describe, it, expect } from 'vitest';
import { calculateStrategyPerformance, calculateGoalProgressPct } from './strategiesCalculator';
import type { Bet, BettingGoal } from '../../types';

describe('strategiesCalculator', () => {
  it('calculates strategy performance metrics correctly', () => {
    const mockBets: Bet[] = [
      {
        id: '1',
        bankroll_id: 'b1',
        match: 'Benfica vs Porto',
        league: 'Liga Portugal',
        market: 'Cantos',
        selection: 'Over 9.5',
        odd: 2.0,
        stake: 100,
        result: 'WIN',
        profit: 100,
        payout: 200,
        strategy: 'Cantos (Corners)',
        created_at: '2026-08-01',
      },
      {
        id: '2',
        bankroll_id: 'b1',
        match: 'Sporting vs Braga',
        league: 'Liga Portugal',
        market: 'Cantos',
        selection: 'Over 10.5',
        odd: 1.8,
        stake: 100,
        result: 'LOSS',
        profit: -100,
        payout: 0,
        strategy: 'Cantos (Corners)',
        created_at: '2026-08-02',
      },
    ];

    const stats = calculateStrategyPerformance(['Cantos (Corners)', 'Over/Under Gols'], mockBets);

    expect(stats.length).toBe(2);
    const cantosStats = stats.find((s) => s.name === 'Cantos (Corners)');
    expect(cantosStats).toBeDefined();
    expect(cantosStats?.totalBets).toBe(2);
    expect(cantosStats?.wins).toBe(1);
    expect(cantosStats?.winRate).toBe(50);
    expect(cantosStats?.totalStake).toBe(200);
    expect(cantosStats?.totalProfit).toBe(0);
    expect(cantosStats?.roi).toBe(0);
    expect(cantosStats?.avgOdd).toBe(1.9);

    const emptyStats = stats.find((s) => s.name === 'Over/Under Gols');
    expect(emptyStats?.totalBets).toBe(0);
    expect(emptyStats?.winRate).toBe(0);
  });

  it('calculates recovery goal progress percentage correctly', () => {
    const recoveryGoal: BettingGoal = {
      id: 'g1',
      title: 'Recuperar 200€',
      type: 'RECOVERY',
      initial_amount: 0,
      target_amount: 200,
      current_amount: 100,
      status: 'IN_PROGRESS',
      created_at: '2026-08-01',
    };

    const pct = calculateGoalProgressPct(recoveryGoal);
    expect(pct).toBe(50);
  });

  it('calculates challenge goal progress percentage correctly', () => {
    const challengeGoal: BettingGoal = {
      id: 'g2',
      title: 'Desafio 100€ a 1000€',
      type: 'CHALLENGE',
      initial_amount: 100,
      target_amount: 1000,
      current_amount: 550,
      status: 'IN_PROGRESS',
      created_at: '2026-08-01',
    };

    // Range is 900 (100 to 1000). Current diff is 450 (550 - 100).
    // Pct is (450 / 900) * 100 = 50%
    const pct = calculateGoalProgressPct(challengeGoal);
    expect(pct).toBe(50);
  });
});
