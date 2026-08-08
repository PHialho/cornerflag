import { describe, it, expect } from 'vitest';
import type { Bet } from '../../types';
import {
  calculateReportSummary,
  calculateDrawdown,
  groupByProperty,
  groupByOddsBuckets,
  groupByDayOfWeek,
  groupByMonth,
} from './reportsCalculator';

const sampleBets: Bet[] = [
  {
    id: '1',
    bankroll_id: 'b1',
    match: 'Benfica vs Porto',
    league: 'Primeira Liga',
    sport: 'Futebol',
    strategy: 'Match Odds (1X2)',
    market: '1X2',
    selection: 'Benfica',
    odd: 2.0,
    closing_odd: 1.9,
    stake: 100,
    result: 'WIN',
    profit: 100,
    payout: 200,
    created_at: '2026-07-01T10:00:00Z',
    settled_at: '2026-07-01T12:00:00Z',
  },
  {
    id: '2',
    bankroll_id: 'b1',
    match: 'Lakers vs Celtics',
    league: 'NBA',
    sport: 'Basquetebol',
    strategy: 'Over/Under Gols',
    market: 'Total Pontos',
    selection: 'Over 210.5',
    odd: 1.8,
    closing_odd: 1.85,
    stake: 50,
    result: 'LOSS',
    profit: -50,
    payout: 0,
    created_at: '2026-07-02T10:00:00Z',
    settled_at: '2026-07-02T12:00:00Z',
  },
  {
    id: '3',
    bankroll_id: 'b1',
    match: 'Alcaraz vs Sinner',
    league: 'Wimbledon',
    sport: 'Ténis',
    strategy: 'Match Odds (1X2)',
    market: 'Vencedor',
    selection: 'Alcaraz',
    odd: 1.45,
    closing_odd: 1.4,
    stake: 100,
    result: 'WIN',
    profit: 45,
    payout: 145,
    created_at: '2026-07-03T10:00:00Z',
    settled_at: '2026-07-03T12:00:00Z',
  },
  {
    id: '4',
    bankroll_id: 'b1',
    match: 'Real Madrid vs Barca',
    league: 'La Liga',
    sport: 'Futebol',
    strategy: 'Cantos (Corners)',
    market: 'Over Cantos',
    selection: 'Over 9.5',
    odd: 2.5,
    stake: 50,
    result: 'VOID',
    profit: 0,
    payout: 50,
    created_at: '2026-07-04T10:00:00Z',
    settled_at: '2026-07-04T12:00:00Z',
  },
];

describe('reportsCalculator', () => {
  it('calculates overall summary metrics correctly', () => {
    const summary = calculateReportSummary(sampleBets);

    expect(summary.totalBets).toBe(4);
    expect(summary.settledBetsCount).toBe(4);
    expect(summary.totalStaked).toBe(300);
    expect(summary.netProfit).toBe(95);
    expect(summary.wonBetsCount).toBe(2);
    expect(summary.lostBetsCount).toBe(1);
    expect(summary.voidBetsCount).toBe(1);
    expect(summary.roi).toBe(31.67);
    expect(summary.winRate).toBe(50.0);
    expect(summary.profitFactor).toBe(2.9); // 145 gross win / 50 gross loss
  });

  it('calculates drawdown correctly', () => {
    const drawdown = calculateDrawdown(sampleBets);
    expect(drawdown.maxDrawdownAmount).toBe(50);
  });

  it('groups by sport correctly', () => {
    const bySport = groupByProperty(sampleBets, 'sport');
    expect(bySport.length).toBe(3);

    const futebol = bySport.find((s) => s.key === 'Futebol');
    expect(futebol).toBeDefined();
    expect(futebol?.totalBets).toBe(2);
    expect(futebol?.netProfit).toBe(100);
  });

  it('groups by odds buckets correctly', () => {
    const byOdds = groupByOddsBuckets(sampleBets);
    const lowBucket = byOdds.find((b) => b.rangeMax < 1.5);
    expect(lowBucket?.totalBets).toBe(1);
    expect(lowBucket?.netProfit).toBe(45);
  });

  it('groups by month correctly', () => {
    const byMonth = groupByMonth(sampleBets);
    expect(byMonth.length).toBe(1);
    expect(byMonth[0].monthKey).toBe('2026-07');
    expect(byMonth[0].totalBets).toBe(4);
    expect(byMonth[0].profit).toBe(95);
  });

  it('groups by day of week correctly', () => {
    const byDay = groupByDayOfWeek(sampleBets);
    expect(byDay.length).toBe(7);
  });
});
