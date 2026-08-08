import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Layers,
  Percent,
  DollarSign,
  Activity,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import {
  calculateReportSummary,
  generateCumulativeProfitData,
  groupByProperty,
  groupByOddsBuckets,
  groupByDayOfWeek,
  groupByMonth,
} from '../../lib/math/reportsCalculator';

import { MetricCard } from '../dashboard/MetricCard';

type ReportTab = 'overview' | 'sports' | 'strategies' | 'odds' | 'time' | 'betType';

export const ReportsView: React.FC = () => {
  const { bets, bankrolls, activeBankrollId } = useCornerFlagStore();

  const [selectedTab, setSelectedTab] = useState<ReportTab>('overview');
  const [bankrollFilter, setBankrollFilter] = useState<'active' | 'all'>('active');
  const [timePeriodFilter, setTimePeriodFilter] = useState<'all' | '30days' | 'currentMonth' | 'thisYear'>('all');

  const activeBankroll = bankrolls.find((b) => b.id === activeBankrollId);
  const currencySymbol = activeBankroll?.currency === 'USD' ? '$' : activeBankroll?.currency === 'GBP' ? '£' : '€';

  // Filter bets based on active bankroll and period filter
  const filteredBets = useMemo(() => {
    let list = bankrollFilter === 'active' && activeBankrollId
      ? bets.filter((b) => b.bankroll_id === activeBankrollId)
      : bets;

    if (timePeriodFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      list = list.filter((b) => new Date(b.created_at) >= thirtyDaysAgo);
    } else if (timePeriodFilter === 'currentMonth') {
      const now = new Date();
      list = list.filter((b) => {
        const d = new Date(b.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (timePeriodFilter === 'thisYear') {
      const now = new Date();
      list = list.filter((b) => new Date(b.created_at).getFullYear() === now.getFullYear());
    }

    return list;
  }, [bets, bankrollFilter, activeBankrollId, timePeriodFilter]);

  // Derived Analytics Data
  const summary = useMemo(() => calculateReportSummary(filteredBets), [filteredBets]);
  const cumulativeData = useMemo(() => generateCumulativeProfitData(filteredBets), [filteredBets]);
  const sportsData = useMemo(() => groupByProperty(filteredBets, 'sport', 'Outro'), [filteredBets]);
  const strategiesData = useMemo(() => groupByProperty(filteredBets, 'strategy', 'Sem Estratégia'), [filteredBets]);
  const oddsData = useMemo(() => groupByOddsBuckets(filteredBets), [filteredBets]);
  const dayOfWeekData = useMemo(() => groupByDayOfWeek(filteredBets), [filteredBets]);
  const monthData = useMemo(() => groupByMonth(filteredBets), [filteredBets]);
  const betTypeData = useMemo(() => groupByProperty(filteredBets, 'bet_type', 'Simples'), [filteredBets]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header - Padronizado com Gestão de Apostas / Bancas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-400" /> Relatórios & Analíticas
          </h2>
          <p className="text-xs text-gray-400">
            Análise de desempenho multi-dimensional, distribuição de odds, rentabilidade por modalidade e métricas +EV para a banca{' '}
            <span className="text-emerald-400 font-semibold">{activeBankroll?.name || 'Ativa'}</span>.
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Bankroll Scope */}
          <div className="flex items-center bg-[#0B0E14] border border-[#1E2638] rounded-xl p-1 text-xs">
            <button
              onClick={() => setBankrollFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                bankrollFilter === 'active'
                  ? 'bg-emerald-500 text-gray-950 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Banca Ativa
            </button>
            <button
              onClick={() => setBankrollFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                bankrollFilter === 'all'
                  ? 'bg-emerald-500 text-gray-950 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Todas as Bancas
            </button>
          </div>

          {/* Time Period Filter */}
          <div className="relative">
            <select
              value={timePeriodFilter}
              onChange={(e) => setTimePeriodFilter(e.target.value as any)}
              className="bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">Todo o Histórico</option>
              <option value="currentMonth">Mês Corrente</option>
              <option value="30days">Últimos 30 Dias</option>
              <option value="thisYear">Este Ano</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid - Padronizado com MetricCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Lucro Líquido */}
        <MetricCard
          title="Lucro Líquido"
          value={`${summary.netProfit >= 0 ? '+' : ''}${currencySymbol} ${summary.netProfit.toFixed(2)}`}
          subtext={`${summary.settledBetsCount} apostas liquidadas`}
          icon={DollarSign}
          iconColorClass={summary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
          iconBgClass={summary.netProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}
          valueColorClass={summary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
        />

        {/* Metric 2: ROI / Yield */}
        <MetricCard
          title="ROI / Yield Acumulado"
          value={`${summary.roi >= 0 ? '+' : ''}${summary.roi.toFixed(2)}%`}
          subtext={`Staked: ${currencySymbol} ${summary.totalStaked.toFixed(2)}`}
          icon={Percent}
          iconColorClass="text-purple-400"
          iconBgClass="bg-purple-500/10 border-purple-500/20"
          valueColorClass={summary.roi >= 0 ? 'text-purple-400' : 'text-rose-400'}
        />

        {/* Metric 3: Win Rate */}
        <MetricCard
          title="Taxa de Acerto (Win Rate)"
          value={`${summary.winRate.toFixed(1)}%`}
          subtext={`${summary.wonBetsCount}G / ${summary.lostBetsCount}P / ${summary.voidBetsCount}V`}
          icon={Target}
          iconColorClass="text-blue-400"
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          valueColorClass="text-blue-400"
        />

        {/* Metric 4: Profit Factor / Drawdown */}
        <MetricCard
          title="Profit Factor / Max Drawdown"
          value={summary.profitFactor >= 999 ? '∞' : summary.profitFactor.toFixed(2)}
          subtext={`Drawdown: -${currencySymbol} ${summary.maxDrawdownAmount.toFixed(2)}`}
          icon={Activity}
          iconColorClass="text-amber-400"
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          valueColorClass="text-amber-400"
        />
      </div>

      {/* Tabs Navigation (Segmented Bar) */}
      <div className="flex flex-wrap gap-2 border-b border-[#1E2638] pb-3">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'overview'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Visão Geral & Evolução
        </button>

        <button
          onClick={() => setSelectedTab('sports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'sports'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <Layers className="w-4 h-4" /> Por Desporto
        </button>

        <button
          onClick={() => setSelectedTab('strategies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'strategies'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <Target className="w-4 h-4" /> Por Estratégia / Mercado
        </button>

        <button
          onClick={() => setSelectedTab('odds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'odds'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <PieChart className="w-4 h-4" /> Faixas de Odds
        </button>

        <button
          onClick={() => setSelectedTab('time')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'time'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <Calendar className="w-4 h-4" /> Análise Temporal
        </button>

        <button
          onClick={() => setSelectedTab('betType')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'betType'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <Activity className="w-4 h-4" /> Simples vs Múltiplas
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW & CUMULATIVE PROFIT */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Cumulative Profit Line Chart */}
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Curva de Lucro Acumulado (P&L Timeline)
            </h3>

            {cumulativeData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                    <XAxis dataKey="formattedDate" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${currencySymbol}${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#1E2638', borderRadius: '0.75rem' }}
                      labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                      formatter={(val: any) => [`${currencySymbol} ${Number(val).toFixed(2)}`, 'Lucro Acumulado']}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulativeProfit"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 3, fill: '#10B981' }}
                      activeDot={{ r: 6, fill: '#34D399' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-gray-500 border border-dashed border-[#1E2638] rounded-xl">
                Sem apostas liquidadas no período selecionado.
              </div>
            )}
          </div>

          {/* Secondary Grid: Monthly Performance Bars */}
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Resultado Mensal Acumulado
            </h3>
            {monthData.length > 0 ? (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                    <XAxis dataKey="monthLabel" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${currencySymbol}${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#1E2638', borderRadius: '0.75rem' }}
                      formatter={(val: any) => [`${currencySymbol} ${Number(val).toFixed(2)}`, 'Lucro Mensal']}
                    />
                    <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                      {monthData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.profit >= 0 ? '#10B981' : '#F43F5E'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-xs text-gray-500 border border-dashed border-[#1E2638] rounded-xl">
                Sem registos mensais disponíveis.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: POR DESPORTO */}
      {selectedTab === 'sports' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Comparativo de Lucro por Desporto
            </h3>
            {sportsData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sportsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                    <XAxis dataKey="label" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${currencySymbol}${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#1E2638', borderRadius: '0.75rem' }}
                      formatter={(val: any) => [`${currencySymbol} ${Number(val).toFixed(2)}`, 'Lucro']}
                    />
                    <Bar dataKey="netProfit" radius={[6, 6, 0, 0]}>
                      {sportsData.map((entry, idx) => (
                        <Cell key={`sport-cell-${idx}`} fill={entry.netProfit >= 0 ? '#10B981' : '#F43F5E'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-8">Sem dados desportivos no período selecionado.</p>
            )}
          </div>

          {/* Breakdown Table */}
          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#1E2638] bg-[#171D2A] font-bold text-xs text-white">
              Tabela Detalhada por Modalidade Desportiva
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0B0E14] text-gray-400 font-semibold border-b border-[#1E2638]">
                  <tr>
                    <th className="p-3.5">Desporto</th>
                    <th className="p-3.5">Apostas</th>
                    <th className="p-3.5">G / P / V</th>
                    <th className="p-3.5">Total Staked</th>
                    <th className="p-3.5">Win Rate</th>
                    <th className="p-3.5">Odd Média</th>
                    <th className="p-3.5 text-right">Lucro Líquido</th>
                    <th className="p-3.5 text-right">ROI %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]">
                  {sportsData.map((row) => (
                    <tr key={row.key} className="hover:bg-[#1A212E] transition-colors">
                      <td className="p-3.5 font-bold text-white">{row.label}</td>
                      <td className="p-3.5">{row.totalBets}</td>
                      <td className="p-3.5 text-gray-400">
                        {row.wonBets}G / {row.lostBets}P / {row.voidBets}V
                      </td>
                      <td className="p-3.5">{currencySymbol} {row.totalStaked.toFixed(2)}</td>
                      <td className="p-3.5 font-medium text-blue-400">{row.winRate.toFixed(1)}%</td>
                      <td className="p-3.5">@{row.avgOdd.toFixed(2)}</td>
                      <td className={`p-3.5 text-right font-bold ${row.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.netProfit >= 0 ? '+' : ''}{currencySymbol} {row.netProfit.toFixed(2)}
                      </td>
                      <td className={`p-3.5 text-right font-bold ${row.roi >= 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                        {row.roi >= 0 ? '+' : ''}{row.roi.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: POR ESTRATÉGIA / MERCADO */}
      {selectedTab === 'strategies' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#1E2638] bg-[#171D2A] font-bold text-xs text-white flex items-center justify-between">
              <span>Desempenho por Estratégia de Aposta</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0B0E14] text-gray-400 font-semibold border-b border-[#1E2638]">
                  <tr>
                    <th className="p-3.5">Estratégia</th>
                    <th className="p-3.5">Volume Apostas</th>
                    <th className="p-3.5">Total Staked</th>
                    <th className="p-3.5">Win Rate</th>
                    <th className="p-3.5">Odd Média</th>
                    <th className="p-3.5 text-right">Lucro Acumulado</th>
                    <th className="p-3.5 text-right">ROI / Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]">
                  {strategiesData.map((row) => (
                    <tr key={row.key} className="hover:bg-[#1A212E] transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {row.label}
                      </td>
                      <td className="p-3.5">{row.totalBets}</td>
                      <td className="p-3.5">{currencySymbol} {row.totalStaked.toFixed(2)}</td>
                      <td className="p-3.5 text-blue-400 font-semibold">{row.winRate.toFixed(1)}%</td>
                      <td className="p-3.5">@{row.avgOdd.toFixed(2)}</td>
                      <td className={`p-3.5 text-right font-bold ${row.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.netProfit >= 0 ? '+' : ''}{currencySymbol} {row.netProfit.toFixed(2)}
                      </td>
                      <td className={`p-3.5 text-right font-bold ${row.roi >= 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                        {row.roi >= 0 ? '+' : ''}{row.roi.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: FAIXAS DE ODDS */}
      {selectedTab === 'odds' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Distribuição de Lucro por Intervalo de Odds
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={oddsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                  <XAxis dataKey="label" stroke="#6B7280" fontSize={10} />
                  <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${currencySymbol}${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#1E2638', borderRadius: '0.75rem' }}
                    formatter={(val: any) => [`${currencySymbol} ${Number(val).toFixed(2)}`, 'Lucro']}
                  />
                  <Bar dataKey="netProfit" radius={[6, 6, 0, 0]}>
                    {oddsData.map((entry, idx) => (
                      <Cell key={`odds-cell-${idx}`} fill={entry.netProfit >= 0 ? '#10B981' : '#F43F5E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#1E2638] bg-[#171D2A] font-bold text-xs text-white">
              Tabela de Intervalos de Odds (StakeToys Standard)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0B0E14] text-gray-400 font-semibold border-b border-[#1E2638]">
                  <tr>
                    <th className="p-3.5">Intervalo de Odd</th>
                    <th className="p-3.5">Apostas</th>
                    <th className="p-3.5">Win Rate</th>
                    <th className="p-3.5">Total Staked</th>
                    <th className="p-3.5 text-right">Lucro Líquido</th>
                    <th className="p-3.5 text-right">ROI %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]">
                  {oddsData.map((row) => (
                    <tr key={row.key} className="hover:bg-[#1A212E] transition-colors">
                      <td className="p-3.5 font-bold text-white">{row.label}</td>
                      <td className="p-3.5">{row.totalBets}</td>
                      <td className="p-3.5 text-blue-400 font-semibold">{row.winRate.toFixed(1)}%</td>
                      <td className="p-3.5">{currencySymbol} {row.totalStaked.toFixed(2)}</td>
                      <td className={`p-3.5 text-right font-bold ${row.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.netProfit >= 0 ? '+' : ''}{currencySymbol} {row.netProfit.toFixed(2)}
                      </td>
                      <td className={`p-3.5 text-right font-bold ${row.roi >= 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                        {row.roi >= 0 ? '+' : ''}{row.roi.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ANÁLISE TEMPORAL */}
      {selectedTab === 'time' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Rentabilidade por Dia da Semana (Segunda a Domingo)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                  <XAxis dataKey="label" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${currencySymbol}${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#1E2638', borderRadius: '0.75rem' }}
                    formatter={(val: any) => [`${currencySymbol} ${Number(val).toFixed(2)}`, 'Lucro ']}
                  />
                  <Bar dataKey="netProfit" radius={[6, 6, 0, 0]}>
                    {dayOfWeekData.map((entry, idx) => (
                      <Cell key={`day-cell-${idx}`} fill={entry.netProfit >= 0 ? '#10B981' : '#F43F5E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#1E2638] bg-[#171D2A] font-bold text-xs text-white">
              Histórico Mensal Detalhado
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0B0E14] text-gray-400 font-semibold border-b border-[#1E2638]">
                  <tr>
                    <th className="p-3.5">Mês</th>
                    <th className="p-3.5">Apostas</th>
                    <th className="p-3.5">Win Rate</th>
                    <th className="p-3.5">Total Staked</th>
                    <th className="p-3.5 text-right">Lucro Mensal</th>
                    <th className="p-3.5 text-right">ROI %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]">
                  {monthData.map((row) => (
                    <tr key={row.monthKey} className="hover:bg-[#1A212E] transition-colors">
                      <td className="p-3.5 font-bold text-white">{row.monthLabel}</td>
                      <td className="p-3.5">{row.totalBets}</td>
                      <td className="p-3.5 text-blue-400 font-semibold">{row.winRate.toFixed(1)}%</td>
                      <td className="p-3.5">{currencySymbol} {row.staked.toFixed(2)}</td>
                      <td className={`p-3.5 text-right font-bold ${row.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.profit >= 0 ? '+' : ''}{currencySymbol} {row.profit.toFixed(2)}
                      </td>
                      <td className={`p-3.5 text-right font-bold ${row.roi >= 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                        {row.roi >= 0 ? '+' : ''}{row.roi.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: SIMPLES VS MÚLTIPLAS */}
      {selectedTab === 'betType' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {betTypeData.map((row) => (
              <div key={row.key} className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Apostas {row.label === 'MULTIPLE' ? 'Múltiplas (Acumuladas)' : 'Simples'}
                  </h4>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
                    {row.totalBets} registos
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#0B0E14] border border-[#1E2638] p-3.5 rounded-xl">
                    <span className="text-gray-400 block mb-1">Lucro Acumulado</span>
                    <span className={`text-base font-black ${row.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.netProfit >= 0 ? '+' : ''}{currencySymbol} {row.netProfit.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#0B0E14] border border-[#1E2638] p-3.5 rounded-xl">
                    <span className="text-gray-400 block mb-1">ROI %</span>
                    <span className={`text-base font-black ${row.roi >= 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                      {row.roi >= 0 ? '+' : ''}{row.roi.toFixed(2)}%
                    </span>
                  </div>

                  <div className="bg-[#0B0E14] border border-[#1E2638] p-3.5 rounded-xl">
                    <span className="text-gray-400 block mb-1">Win Rate</span>
                    <span className="text-base font-black text-blue-400">
                      {row.winRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="bg-[#0B0E14] border border-[#1E2638] p-3.5 rounded-xl">
                    <span className="text-gray-400 block mb-1">Odd Média</span>
                    <span className="text-base font-black text-amber-400">
                      @{row.avgOdd.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
