import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Percent,
  ShieldAlert,
  Coins,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import {
  PERIOD_OPTIONS,
  calculatePeriodMetrics,
  getBetDate,
  type PeriodType,
  type DateRange,
} from '../../lib/utils/period';
import { PeriodFilter } from './PeriodFilter';
import { MetricCard } from './MetricCard';
import { BetModal } from '../bets/BetModal';

export const Dashboard: React.FC = () => {
  const { bankrolls, activeBankrollId, bets } = useCornerFlagStore();

  // Date Range Defaults
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const firstDayOfMonthStr = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];

  // Period Filter State (Default: CURRENT_MONTH)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('CURRENT_MONTH');
  const [customRange, setCustomRange] = useState<DateRange>({
    startDate: firstDayOfMonthStr,
    endDate: todayStr,
  });

  // Modal State for New Bet Form
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);

  const activeBankroll = bankrolls.find((b) => b.id === activeBankrollId);
  const initialBalance = activeBankroll ? activeBankroll.initial_balance : 1000;

  // Filter bets specifically for the active bankroll
  const activeBets = bets.filter((b) => b.bankroll_id === activeBankrollId);

  // Compute metrics for the selected period & custom date range
  const periodMetrics = calculatePeriodMetrics(
    activeBets,
    initialBalance,
    selectedPeriod,
    customRange
  );

  // Compute chart data for the selected period
  let cumulative = initialBalance;

  // Filter and sort bets in selected period ascending for chart
  const periodBetsAscending = [...periodMetrics.betsInPeriod]
    .filter((b) => b.result !== 'PENDING')
    .sort((a, b) => getBetDate(a).getTime() - getBetDate(b).getTime());

  const chartData = periodBetsAscending.map((b, idx) => {
    cumulative += b.profit;
    return {
      step: `#${idx + 1}`,
      match: b.match,
      balance: cumulative,
      profit: b.profit,
    };
  });

  const selectedPeriodLabel =
    selectedPeriod === 'CUSTOM'
      ? `Intervalo Personalizado (${customRange.startDate || '...'} a ${customRange.endDate || '...'})`
      : PERIOD_OPTIONS.find((p) => p.id === selectedPeriod)?.label || 'Período';

  return (
    <div className="space-y-8">
      {/* Top Header: Title, Nova Aposta Button & Period Selector */}
      <div className="space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Dashboard</h2>
            
            {/* Top Action: Nova Aposta Button */}
            <button
              onClick={() => setIsBetModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-gray-950 px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nova Aposta</span>
            </button>
          </div>

          <PeriodFilter
            selectedPeriod={selectedPeriod}
            onChangePeriod={setSelectedPeriod}
            customRange={customRange}
            onChangeCustomRange={setCustomRange}
          />
        </div>

        {/* Metric Cards Grid - Highlighted 4 Key Requested Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Resultado do Período */}
          <MetricCard
            title={`Resultado (${selectedPeriodLabel})`}
            value={`${periodMetrics.periodProfit >= 0 ? '+' : ''}€ ${periodMetrics.periodProfit.toFixed(2)}`}
            subtext={`Total Apostado: € ${periodMetrics.totalStaked.toFixed(2)}`}
            icon={TrendingUp}
            iconColorClass={periodMetrics.periodProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
            iconBgClass={
              periodMetrics.periodProfit >= 0
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-rose-500/10 border-rose-500/20'
            }
            valueColorClass={periodMetrics.periodProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
            badgeText={`${periodMetrics.settledCount} apostas`}
          />

          {/* Card 2: Lucro Médio */}
          <MetricCard
            title="Lucro Médio por Aposta"
            value={`${periodMetrics.lucroMedio >= 0 ? '+' : ''}€ ${periodMetrics.lucroMedio.toFixed(2)}`}
            subtext="Média de ganho/perda por entrada"
            icon={Coins}
            iconColorClass="text-amber-400"
            iconBgClass="bg-amber-500/10 border-amber-500/20"
            valueColorClass={periodMetrics.lucroMedio >= 0 ? 'text-emerald-300' : 'text-rose-300'}
          />

          {/* Card 3: ROI (%) */}
          <MetricCard
            title="ROI / Yield do Período"
            value={`${periodMetrics.roi >= 0 ? '+' : ''}${periodMetrics.roi.toFixed(2)}%`}
            subtext="Retorno s/ capital investido"
            icon={Percent}
            iconColorClass="text-purple-400"
            iconBgClass="bg-purple-500/10 border-purple-500/20"
            valueColorClass={periodMetrics.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}
          />

          {/* Card 4: Saldo Final */}
          <MetricCard
            title="Saldo Final do Período"
            value={`€ ${periodMetrics.saldoFinal.toFixed(2)}`}
            subtext={`Banca Inicial: € ${initialBalance.toFixed(2)}`}
            icon={Wallet}
            iconColorClass="text-blue-400"
            iconBgClass="bg-blue-500/10 border-blue-500/20"
            valueColorClass="text-white"
            badgeText={activeBankroll?.currency || 'EUR'}
          />
        </div>
      </div>

      {/* Middle Section: Growth Chart (Full Width) */}
      <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Evolução no Período ({selectedPeriodLabel})
          </h3>
          <span className="text-xs text-gray-500 font-mono">
            Win Rate: <strong className="text-emerald-400">{periodMetrics.winRate}%</strong> ({periodMetrics.wonCount}/{periodMetrics.settledCount})
          </span>
        </div>

        {chartData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalancePeriod" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                <XAxis dataKey="step" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B0E14',
                    borderColor: '#1E2638',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                  formatter={(val: any) => [`€ ${Number(val || 0).toFixed(2)}`, 'Saldo']}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalancePeriod)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500 text-sm">
            <ShieldAlert className="w-8 h-8 mb-2 text-gray-600" />
            Sem histórico de apostas liquidadas no período selecionado.
          </div>
        )}
      </div>

      {/* Bottom Section: Bet History Table (Full Width) */}
      <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold text-white">
            Apostas do Período ({selectedPeriodLabel})
          </h3>
          <span className="text-xs text-gray-400">
            Total: <strong>{periodMetrics.betsInPeriod.length}</strong> apostas
          </span>
        </div>

        {periodMetrics.betsInPeriod.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B0E14] text-gray-400 border-b border-[#1E2638]">
                <tr>
                  <th className="p-3">Jogo / Liga</th>
                  <th className="p-3">Mercado</th>
                  <th className="p-3">Odd</th>
                  <th className="p-3">Stake</th>
                  <th className="p-3">Resultado</th>
                  <th className="p-3 text-right">P&L (€)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638]">
                {periodMetrics.betsInPeriod.map((bet) => (
                  <tr key={bet.id} className="hover:bg-[#19202e] transition-colors">
                    <td className="p-3 font-medium text-white">
                      {bet.match}
                      <span className="block text-[10px] text-gray-500">{bet.league}</span>
                    </td>
                    <td className="p-3 text-gray-400">{bet.selection}</td>
                    <td className="p-3 font-mono">{bet.odd.toFixed(2)}</td>
                    <td className="p-3 font-mono">€ {bet.stake.toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          bet.result === 'WIN'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : bet.result === 'HALF_WIN'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : bet.result === 'VOID'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : bet.result === 'HALF_LOSS'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : bet.result === 'LOSS'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {bet.result}
                      </span>
                    </td>
                    <td
                      className={`p-3 text-right font-mono font-bold ${
                        bet.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {bet.profit >= 0 ? '+' : ''}€ {bet.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 text-sm">
            Nenhuma aposta registada para o período selecionado ({selectedPeriodLabel}).
          </div>
        )}
      </div>

      {/* Shared Bet Registration Modal */}
      <BetModal isOpen={isBetModalOpen} onClose={() => setIsBetModalOpen(false)} />
    </div>
  );
};
