import type { Bet, BettingGoal } from '../../types';

export interface StrategyPerformance {
  name: string;
  totalBets: number;
  wins: number;
  winRate: number;
  totalStake: number;
  totalProfit: number;
  roi: number;
  yieldVal: number;
  avgOdd: number;
}

/**
 * Computes metrics for a list of strategies given bet records
 */
export function calculateStrategyPerformance(
  strategyNames: string[],
  bets: Bet[]
): StrategyPerformance[] {
  return strategyNames.map((stratName) => {
    const stratBets = bets.filter((b) => b.strategy === stratName);
    const totalBets = stratBets.length;
    const settledBets = stratBets.filter((b) => b.result !== 'PENDING');
    const wins = settledBets.filter((b) => b.result === 'WIN' || b.result === 'HALF_WIN').length;
    const winRate = settledBets.length > 0 ? (wins / settledBets.length) * 100 : 0;
    const totalStake = stratBets.reduce((acc, b) => acc + b.stake, 0);
    const totalProfit = settledBets.reduce((acc, b) => acc + b.profit, 0);
    const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;
    const yieldVal = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;
    const avgOdd =
      totalBets > 0 ? stratBets.reduce((acc, b) => acc + b.odd, 0) / totalBets : 0;

    return {
      name: stratName,
      totalBets,
      wins,
      winRate,
      totalStake,
      totalProfit,
      roi,
      yieldVal,
      avgOdd,
    };
  });
}

/**
 * Computes progress percentage for a betting goal
 */
export function calculateGoalProgressPct(goal: BettingGoal): number {
  if (!goal.target_amount || goal.target_amount === 0) return 0;
  if (goal.type === 'CHALLENGE') {
    const range = goal.target_amount - goal.initial_amount;
    if (range <= 0) return 100;
    const currentDiff = goal.current_amount - goal.initial_amount;
    return Math.min(100, Math.max(0, (currentDiff / range) * 100));
  }
  return Math.min(100, Math.max(0, (goal.current_amount / goal.target_amount) * 100));
}
