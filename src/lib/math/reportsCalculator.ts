import type { Bet } from '../../types';
import { round } from './calculator';

export interface ReportSummaryMetrics {
  totalBets: number;
  settledBetsCount: number;
  pendingBetsCount: number;
  wonBetsCount: number;
  lostBetsCount: number;
  voidBetsCount: number;
  totalStaked: number;
  totalPayout: number;
  netProfit: number;
  roi: number;
  winRate: number;
  profitFactor: number;
  maxDrawdownAmount: number;
  maxDrawdownPercent: number;
  avgOdd: number;
  avgStake: number;
  avgProfitPerBet: number;
  clvAvg: number;
  evProfitTotal: number;
}

export interface GroupedReportRow {
  key: string;
  label: string;
  totalBets: number;
  wonBets: number;
  lostBets: number;
  voidBets: number;
  totalStaked: number;
  totalPayout: number;
  netProfit: number;
  winRate: number;
  roi: number;
  avgOdd: number;
}

export interface OddsBucketRow extends GroupedReportRow {
  rangeMin: number;
  rangeMax: number;
}

export interface TimeSeriesPoint {
  date: string;
  formattedDate: string;
  profit: number;
  cumulativeProfit: number;
  staked: number;
  betsCount: number;
}

export interface MonthlyReportRow {
  monthKey: string; // YYYY-MM
  monthLabel: string;
  totalBets: number;
  staked: number;
  profit: number;
  roi: number;
  winRate: number;
}

export interface DayOfWeekRow extends GroupedReportRow {
  dayIndex: number; // 0 = Domingo, 1 = Segunda, ...
}

/**
  Calculates comprehensive overall summary metrics across a set of bets.
 */
export function calculateReportSummary(bets: Bet[]): ReportSummaryMetrics {
  const totalBets = bets.length;
  const settledBets = bets.filter((b) => b.result !== 'PENDING');
  const pendingBetsCount = totalBets - settledBets.length;

  let wonBetsCount = 0;
  let lostBetsCount = 0;
  let voidBetsCount = 0;

  let totalStaked = 0;
  let totalPayout = 0;
  let netProfit = 0;
  let grossWin = 0;
  let grossLoss = 0;

  let sumOdds = 0;
  let sumCLV = 0;
  let clvCount = 0;
  let evProfitTotal = 0;

  settledBets.forEach((b) => {
    totalStaked += b.stake;
    totalPayout += b.payout;
    netProfit += b.profit;
    sumOdds += b.odd;

    if (b.profit > 0) {
      grossWin += b.profit;
      wonBetsCount++;
    } else if (b.profit < 0) {
      grossLoss += Math.abs(b.profit);
      lostBetsCount++;
    } else {
      voidBetsCount++;
    }

    if (b.closing_odd && b.closing_odd > 1.0) {
      const clv = ((b.odd / b.closing_odd) - 1) * 100;
      sumCLV += clv;
      clvCount++;
    }

    if (b.estimated_probability && b.estimated_probability > 0) {
      const evRatio = (b.odd * b.estimated_probability) - 1;
      evProfitTotal += b.stake * evRatio;
    }
  });

  const settledBetsCount = settledBets.length;
  const roi = totalStaked > 0 ? round((netProfit / totalStaked) * 100, 2) : 0;
  const winRate = settledBetsCount > 0 ? round((wonBetsCount / settledBetsCount) * 100, 2) : 0;
  const profitFactor = grossLoss > 0 ? round(grossWin / grossLoss, 2) : grossWin > 0 ? 999 : 0;
  const avgOdd = settledBetsCount > 0 ? round(sumOdds / settledBetsCount, 2) : 0;
  const avgStake = settledBetsCount > 0 ? round(totalStaked / settledBetsCount, 2) : 0;
  const avgProfitPerBet = settledBetsCount > 0 ? round(netProfit / settledBetsCount, 2) : 0;
  const clvAvg = clvCount > 0 ? round(sumCLV / clvCount, 2) : 0;

  // Calculate Max Drawdown
  const { maxDrawdownAmount, maxDrawdownPercent } = calculateDrawdown(settledBets);

  return {
    totalBets,
    settledBetsCount,
    pendingBetsCount,
    wonBetsCount,
    lostBetsCount,
    voidBetsCount,
    totalStaked: round(totalStaked, 2),
    totalPayout: round(totalPayout, 2),
    netProfit: round(netProfit, 2),
    roi,
    winRate,
    profitFactor,
    maxDrawdownAmount: round(maxDrawdownAmount, 2),
    maxDrawdownPercent: round(maxDrawdownPercent, 2),
    avgOdd,
    avgStake,
    avgProfitPerBet,
    clvAvg,
    evProfitTotal: round(evProfitTotal, 2),
  };
}

/**
  Calculates Peak-to-Trough Maximum Drawdown in absolute amount and percentage.
 */
export function calculateDrawdown(settledBets: Bet[]): { maxDrawdownAmount: number; maxDrawdownPercent: number } {
  if (settledBets.length === 0) {
    return { maxDrawdownAmount: 0, maxDrawdownPercent: 0 };
  }

  // Sort chronological (oldest to newest)
  const sorted = [...settledBets].sort(
    (a, b) => new Date(a.settled_at || a.created_at).getTime() - new Date(b.settled_at || b.created_at).getTime()
  );

  let peak = 0;
  let currentBalance = 0;
  let maxDrawdownAmount = 0;
  let maxDrawdownPercent = 0;

  sorted.forEach((bet) => {
    currentBalance += bet.profit;
    if (currentBalance > peak) {
      peak = currentBalance;
    }
    const drawdownAmount = peak - currentBalance;
    if (drawdownAmount > maxDrawdownAmount) {
      maxDrawdownAmount = drawdownAmount;
      maxDrawdownPercent = peak > 0 ? (drawdownAmount / peak) * 100 : 0;
    }
  });

  return { maxDrawdownAmount, maxDrawdownPercent };
}

/**
  Aggregates bets chronologically for a Cumulative Profit Chart.
 */
export function generateCumulativeProfitData(bets: Bet[]): TimeSeriesPoint[] {
  const settled = bets.filter((b) => b.result !== 'PENDING');
  if (settled.length === 0) return [];

  const sorted = [...settled].sort(
    (a, b) => new Date(a.settled_at || a.created_at).getTime() - new Date(b.settled_at || b.created_at).getTime()
  );

  let cumulativeProfit = 0;

  return sorted.map((b, index) => {
    cumulativeProfit = round(cumulativeProfit + b.profit, 2);
    const dateObj = new Date(b.settled_at || b.created_at);
    const formattedDate = dateObj.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
    });

    return {
      date: dateObj.toISOString(),
      formattedDate: `${formattedDate} (#${index + 1})`,
      profit: b.profit,
      cumulativeProfit,
      staked: b.stake,
      betsCount: index + 1,
    };
  });
}

/**
  Groups settled bets by a custom key property (e.g. 'sport', 'strategy', 'bet_type').
 */
export function groupByProperty(bets: Bet[], property: keyof Bet, defaultLabel: string = 'Não Especificado'): GroupedReportRow[] {
  const settled = bets.filter((b) => b.result !== 'PENDING');
  const groups: Record<string, GroupedReportRow> = {};

  settled.forEach((b) => {
    const rawVal = b[property];
    const key = (typeof rawVal === 'string' && rawVal.trim()) ? rawVal.trim() : defaultLabel;

    if (!groups[key]) {
      groups[key] = {
        key,
        label: key,
        totalBets: 0,
        wonBets: 0,
        lostBets: 0,
        voidBets: 0,
        totalStaked: 0,
        totalPayout: 0,
        netProfit: 0,
        winRate: 0,
        roi: 0,
        avgOdd: 0,
      };
    }

    const g = groups[key];
    g.totalBets++;
    g.totalStaked += b.stake;
    g.totalPayout += b.payout;
    g.netProfit += b.profit;

    if (b.profit > 0) g.wonBets++;
    else if (b.profit < 0) g.lostBets++;
    else g.voidBets++;
  });

  return Object.values(groups).map((g) => {
    const netProfit = round(g.netProfit, 2);
    const totalStaked = round(g.totalStaked, 2);
    const totalPayout = round(g.totalPayout, 2);
    const roi = totalStaked > 0 ? round((netProfit / totalStaked) * 100, 2) : 0;
    const winRate = g.totalBets > 0 ? round((g.wonBets / g.totalBets) * 100, 2) : 0;
    const avgOdd = g.totalBets > 0 ? round(
      settled
        .filter((b) => (b[property] || defaultLabel) === g.key)
        .reduce((sum, b) => sum + b.odd, 0) / g.totalBets,
      2
    ) : 0;

    return {
      ...g,
      netProfit,
      totalStaked,
      totalPayout,
      roi,
      winRate,
      avgOdd,
    };
  }).sort((a, b) => b.netProfit - a.netProfit);
}

/**
  Groups settled bets into Odds Buckets (< 1.50, 1.50-1.80, 1.81-2.20, 2.21-3.00, > 3.00).
 */
export function groupByOddsBuckets(bets: Bet[]): OddsBucketRow[] {
  const buckets: { min: number; max: number; label: string }[] = [
    { min: 1.0, max: 1.499, label: '< 1.50 (Muito Baixas)' },
    { min: 1.5, max: 1.8, label: '1.50 - 1.80 (Favoritos)' },
    { min: 1.81, max: 2.2, label: '1.81 - 2.20 (Odds Médias / Valor)' },
    { min: 2.21, max: 3.0, label: '2.21 - 3.00 (Underdogs Moderados)' },
    { min: 3.001, max: 999.0, label: '> 3.00 (High Odds / Longshots)' },
  ];

  const settled = bets.filter((b) => b.result !== 'PENDING');

  return buckets.map((bucket) => {
    const bucketBets = settled.filter((b) => b.odd >= bucket.min && b.odd <= bucket.max);
    const totalBets = bucketBets.length;
    let wonBets = 0;
    let lostBets = 0;
    let voidBets = 0;
    let totalStaked = 0;
    let totalPayout = 0;
    let netProfit = 0;
    let sumOdds = 0;

    bucketBets.forEach((b) => {
      totalStaked += b.stake;
      totalPayout += b.payout;
      netProfit += b.profit;
      sumOdds += b.odd;

      if (b.profit > 0) wonBets++;
      else if (b.profit < 0) lostBets++;
      else voidBets++;
    });

    const roi = totalStaked > 0 ? round((netProfit / totalStaked) * 100, 2) : 0;
    const winRate = totalBets > 0 ? round((wonBets / totalBets) * 100, 2) : 0;
    const avgOdd = totalBets > 0 ? round(sumOdds / totalBets, 2) : 0;

    return {
      key: bucket.label,
      label: bucket.label,
      rangeMin: bucket.min,
      rangeMax: bucket.max,
      totalBets,
      wonBets,
      lostBets,
      voidBets,
      totalStaked: round(totalStaked, 2),
      totalPayout: round(totalPayout, 2),
      netProfit: round(netProfit, 2),
      roi,
      winRate,
      avgOdd,
    };
  });
}

/**
  Groups settled bets by Day of Week (Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo).
 */
export function groupByDayOfWeek(bets: Bet[]): DayOfWeekRow[] {
  const daysMap = [
    { index: 0, label: 'Domingo' },
    { index: 1, label: 'Segunda-feira' },
    { index: 2, label: 'Terça-feira' },
    { index: 3, label: 'Quarta-feira' },
    { index: 4, label: 'Quinta-feira' },
    { index: 5, label: 'Sexta-feira' },
    { index: 6, label: 'Sábado' },
  ];

  const settled = bets.filter((b) => b.result !== 'PENDING');

  return daysMap.map((day) => {
    const dayBets = settled.filter((b) => {
      const d = new Date(b.settled_at || b.created_at);
      return d.getDay() === day.index;
    });

    const totalBets = dayBets.length;
    let wonBets = 0;
    let lostBets = 0;
    let voidBets = 0;
    let totalStaked = 0;
    let totalPayout = 0;
    let netProfit = 0;
    let sumOdds = 0;

    dayBets.forEach((b) => {
      totalStaked += b.stake;
      totalPayout += b.payout;
      netProfit += b.profit;
      sumOdds += b.odd;

      if (b.profit > 0) wonBets++;
      else if (b.profit < 0) lostBets++;
      else voidBets++;
    });

    const roi = totalStaked > 0 ? round((netProfit / totalStaked) * 100, 2) : 0;
    const winRate = totalBets > 0 ? round((wonBets / totalBets) * 100, 2) : 0;
    const avgOdd = totalBets > 0 ? round(sumOdds / totalBets, 2) : 0;

    return {
      key: day.label,
      label: day.label,
      dayIndex: day.index,
      totalBets,
      wonBets,
      lostBets,
      voidBets,
      totalStaked: round(totalStaked, 2),
      totalPayout: round(totalPayout, 2),
      netProfit: round(netProfit, 2),
      roi,
      winRate,
      avgOdd,
    };
  });
}

/**
  Groups settled bets by Month (YYYY-MM).
 */
export function groupByMonth(bets: Bet[]): MonthlyReportRow[] {
  const settled = bets.filter((b) => b.result !== 'PENDING');
  const monthMap: Record<string, { staked: number; profit: number; totalBets: number; wonBets: number }> = {};

  settled.forEach((b) => {
    const d = new Date(b.settled_at || b.created_at);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { staked: 0, profit: 0, totalBets: 0, wonBets: 0 };
    }

    monthMap[monthKey].staked += b.stake;
    monthMap[monthKey].profit += b.profit;
    monthMap[monthKey].totalBets++;
    if (b.profit > 0) monthMap[monthKey].wonBets++;
  });

  const months = Object.keys(monthMap).sort();

  return months.map((mKey) => {
    const item = monthMap[mKey];
    const [year, monthNum] = mKey.split('-');
    const monthDate = new Date(parseInt(year, 10), parseInt(monthNum, 10) - 1, 1);
    const monthLabel = monthDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

    const profit = round(item.profit, 2);
    const staked = round(item.staked, 2);
    const roi = staked > 0 ? round((profit / staked) * 100, 2) : 0;
    const winRate = item.totalBets > 0 ? round((item.wonBets / item.totalBets) * 100, 2) : 0;

    return {
      monthKey: mKey,
      monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
      totalBets: item.totalBets,
      staked,
      profit,
      roi,
      winRate,
    };
  });
}

/**
  Converts bets report rows to a CSV downloadable string.
 */
export function exportReportToCSV(bets: Bet[]): string {
  const headers = [
    'ID',
    'Data Criacao',
    'Data Fecho',
    'Jogo',
    'Liga',
    'Desporto',
    'Estrategia',
    'Mercado',
    'Selecao',
    'Odd Apostada',
    'Odd Fecho',
    'Stake',
    'Resultado',
    'Lucro/Prejuizo',
    'Retorno Total',
  ];

  const rows = bets.map((b) => [
    b.id,
    b.created_at,
    b.settled_at || '',
    `"${(b.match || '').replace(/"/g, '""')}"`,
    `"${(b.league || '').replace(/"/g, '""')}"`,
    `"${(b.sport || '').replace(/"/g, '""')}"`,
    `"${(b.strategy || '').replace(/"/g, '""')}"`,
    `"${(b.market || '').replace(/"/g, '""')}"`,
    `"${(b.selection || '').replace(/"/g, '""')}"`,
    b.odd,
    b.closing_odd || '',
    b.stake,
    b.result,
    b.profit,
    b.payout,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
