import type { Bet } from '../../types';
import { calculateROI, round } from '../math/calculator';

export type PeriodType =
  | 'TODAY'
  | 'YESTERDAY'
  | 'CURRENT_MONTH'
  | 'PREVIOUS_MONTH'
  | 'LAST_30_DAYS'
  | 'THIS_YEAR'
  | 'ALL_TIME'
  | 'CUSTOM';

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface PeriodOption {
  id: PeriodType;
  label: string;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  { id: 'TODAY', label: 'Hoje' },
  { id: 'YESTERDAY', label: 'Ontem' },
  { id: 'CURRENT_MONTH', label: 'Mês Corrente' },
  { id: 'PREVIOUS_MONTH', label: 'Mês Anterior' },
  { id: 'LAST_30_DAYS', label: 'Últimos 30 Dias' },
  { id: 'THIS_YEAR', label: 'Este Ano' },
  { id: 'ALL_TIME', label: 'Todo o Histórico' },
  { id: 'CUSTOM', label: 'Personalizado' },
];

export function getBetDate(bet: Bet): Date {
  return new Date(bet.settled_at || bet.created_at);
}

export function isBetInPeriod(
  bet: Bet,
  period: PeriodType,
  customRange?: DateRange,
  referenceDate: Date = new Date()
): boolean {
  if (period === 'ALL_TIME') return true;

  const betDate = getBetDate(bet);
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  switch (period) {
    case 'TODAY':
      return (
        betDate.getFullYear() === refYear &&
        betDate.getMonth() === refMonth &&
        betDate.getDate() === referenceDate.getDate()
      );

    case 'YESTERDAY': {
      const yesterday = new Date(referenceDate);
      yesterday.setDate(yesterday.getDate() - 1);
      return (
        betDate.getFullYear() === yesterday.getFullYear() &&
        betDate.getMonth() === yesterday.getMonth() &&
        betDate.getDate() === yesterday.getDate()
      );
    }

    case 'CURRENT_MONTH':
      return betDate.getFullYear() === refYear && betDate.getMonth() === refMonth;

    case 'PREVIOUS_MONTH': {
      const prevMonthDate = new Date(refYear, refMonth - 1, 1);
      return (
        betDate.getFullYear() === prevMonthDate.getFullYear() &&
        betDate.getMonth() === prevMonthDate.getMonth()
      );
    }

    case 'LAST_30_DAYS': {
      const thirtyDaysAgo = new Date(referenceDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      return betDate >= thirtyDaysAgo && betDate <= referenceDate;
    }

    case 'THIS_YEAR':
      return betDate.getFullYear() === refYear;

    case 'CUSTOM': {
      if (!customRange) return true;

      const start = customRange.startDate
        ? new Date(`${customRange.startDate}T00:00:00`)
        : new Date(0);

      const end = customRange.endDate
        ? new Date(`${customRange.endDate}T23:59:59.999`)
        : new Date(8640000000000000);

      return betDate >= start && betDate <= end;
    }

    default:
      return true;
  }
}

export interface PeriodMetrics {
  periodProfit: number;
  lucroMedio: number;
  roi: number;
  saldoFinal: number;
  totalStaked: number;
  settledCount: number;
  wonCount: number;
  winRate: number;
  betsInPeriod: Bet[];
}

export function calculatePeriodMetrics(
  allBets: Bet[],
  initialBalance: number,
  period: PeriodType,
  customRange?: DateRange,
  referenceDate: Date = new Date()
): PeriodMetrics {
  // Sort bets chronologically (oldest first) to compute running balance correctly
  const sortedAscending = [...allBets].sort(
    (a, b) => getBetDate(a).getTime() - getBetDate(b).getTime()
  );

  // Filter bets in the selected period
  const betsInPeriod = allBets.filter((bet) =>
    isBetInPeriod(bet, period, customRange, referenceDate)
  );

  // Settled bets in the selected period
  const settledInPeriod = betsInPeriod.filter((b) => b.result !== 'PENDING');

  const periodProfit = settledInPeriod.reduce((acc, bet) => acc + bet.profit, 0);
  const totalStaked = settledInPeriod.reduce((acc, bet) => acc + bet.stake, 0);
  const settledCount = settledInPeriod.length;
  const wonCount = settledInPeriod.filter(
    (b) => b.result === 'WIN' || b.result === 'HALF_WIN'
  ).length;

  const lucroMedio = settledCount > 0 ? round(periodProfit / settledCount, 2) : 0;
  const roi = calculateROI(periodProfit, totalStaked);
  const winRate = settledCount > 0 ? round((wonCount / settledCount) * 100, 1) : 0;

  // Calculate Saldo Final:
  // We calculate the cumulative bankroll up to the end of the selected period
  let runningBalance = initialBalance;

  // Determine period end date
  let periodEndDate: Date | null = null;
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  if (period === 'TODAY' || period === 'LAST_30_DAYS' || period === 'THIS_YEAR') {
    periodEndDate = referenceDate;
  } else if (period === 'YESTERDAY') {
    const yesterday = new Date(referenceDate);
    yesterday.setDate(yesterday.getDate() - 1);
    periodEndDate = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      23,
      59,
      59,
      999
    );
  } else if (period === 'CURRENT_MONTH') {
    periodEndDate = new Date(refYear, refMonth + 1, 0, 23, 59, 59, 999);
  } else if (period === 'PREVIOUS_MONTH') {
    periodEndDate = new Date(refYear, refMonth, 0, 23, 59, 59, 999);
  } else if (period === 'CUSTOM' && customRange?.endDate) {
    periodEndDate = new Date(`${customRange.endDate}T23:59:59.999`);
  }

  for (const bet of sortedAscending) {
    if (bet.result !== 'PENDING') {
      const betDate = getBetDate(bet);
      if (!periodEndDate || betDate <= periodEndDate) {
        runningBalance += bet.profit;
      }
    }
  }

  const saldoFinal = round(runningBalance, 2);

  return {
    periodProfit: round(periodProfit, 2),
    lucroMedio,
    roi,
    saldoFinal,
    totalStaked: round(totalStaked, 2),
    settledCount,
    wonCount,
    winRate,
    betsInPeriod,
  };
}
