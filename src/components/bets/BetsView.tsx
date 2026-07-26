import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trophy,
  Target,
  Layers,
  ChevronDown,
  ChevronUp,
  Receipt,
  FileText,
  TrendingUp,
  PieChart,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import { calculateROI } from '../../lib/math/calculator';
import type { BetType } from '../../types';
import { BetModal, SPORTS, STRATEGIES } from './BetModal';
import { MetricCard } from '../dashboard/MetricCard';

export const BetsView: React.FC = () => {
  const { bets, bankrolls, activeBankrollId, settleBetResult } = useCornerFlagStore();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | BetType>('ALL');
  const [sportFilter, setSportFilter] = useState<string>('ALL');
  const [strategyFilter, setStrategyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Expanded legs state for multiple bets
  const [expandedBetIds, setExpandedBetIds] = useState<Record<string, boolean>>({});

  const toggleExpandLegs = (betId: string) => {
    setExpandedBetIds((prev) => ({ ...prev, [betId]: !prev[betId] }));
  };

  const activeBankroll = bankrolls.find((b) => b.id === activeBankrollId);

  // Filter bets list
  const filteredBets = bets.filter((b) => {
    // Type filter
    if (typeFilter !== 'ALL') {
      const bType = b.bet_type || 'SIMPLE';
      if (bType !== typeFilter) return false;
    }

    // Sport filter
    if (sportFilter !== 'ALL' && b.sport !== sportFilter) return false;

    // Strategy filter
    if (strategyFilter !== 'ALL' && b.strategy !== strategyFilter) return false;

    // Status filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'WIN' && (b.result !== 'WIN' && b.result !== 'HALF_WIN')) return false;
      if (statusFilter === 'LOSS' && (b.result !== 'LOSS' && b.result !== 'HALF_LOSS')) return false;
      if (statusFilter === 'PENDING' && b.result !== 'PENDING') return false;
      if (statusFilter === 'VOID' && b.result !== 'VOID') return false;
    }

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchText = (b.match || '').toLowerCase();
      const selText = (b.selection || '').toLowerCase();
      const leagueText = (b.league || '').toLowerCase();
      const strategyText = (b.strategy || '').toLowerCase();
      return (
        matchText.includes(term) ||
        selText.includes(term) ||
        leagueText.includes(term) ||
        strategyText.includes(term)
      );
    }

    return true;
  });

  // Calculate Metrics for filtered bets
  const totalSettled = filteredBets.filter((b) => b.result !== 'PENDING').length;
  const totalWon = filteredBets.filter((b) => b.result === 'WIN' || b.result === 'HALF_WIN').length;
  const totalProfit = filteredBets.reduce((acc, b) => acc + b.profit, 0);
  const totalStaked = filteredBets.reduce((acc, b) => acc + (b.result !== 'PENDING' ? b.stake : 0), 0);
  const winRate = totalSettled > 0 ? ((totalWon / totalSettled) * 100).toFixed(1) : '0.0';
  const roi = calculateROI(totalProfit, totalStaked);

  const simpleBetsCount = filteredBets.filter((b) => !b.bet_type || b.bet_type === 'SIMPLE').length;
  const multipleBetsCount = filteredBets.filter((b) => b.bet_type === 'MULTIPLE').length;

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-emerald-400" /> Gestão de Apostas
          </h2>
          <p className="text-xs text-gray-400">
            Registo e controlo analítico de apostas simples e múltiplas para a banca{' '}
            <span className="text-emerald-400 font-semibold">{activeBankroll?.name}</span>.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-gray-950 px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nova Aposta</span>
        </button>
      </div>

      {/* Metric Cards KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Apostas"
          value={filteredBets.length}
          subtext={`${simpleBetsCount} Simples | ${multipleBetsCount} Múltiplas`}
          icon={Receipt}
          iconColorClass="text-emerald-400"
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
        />

        <MetricCard
          title="Taxa de Acerto (Win Rate)"
          value={`${winRate}%`}
          subtext={`${totalWon} ganhas de ${totalSettled} liquidadas`}
          icon={PieChart}
          iconColorClass="text-amber-400"
          iconBgClass="bg-amber-500/10 border-amber-500/20"
        />

        <MetricCard
          title="Lucro / Prejuízo Total"
          value={`${totalProfit >= 0 ? '+' : ''}€ ${totalProfit.toFixed(2)}`}
          subtext={`Staked: € ${totalStaked.toFixed(2)}`}
          icon={TrendingUp}
          iconColorClass={totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
          iconBgClass={totalProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}
          valueColorClass={totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
        />

        <MetricCard
          title="ROI / Yield do Filtro"
          value={`${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`}
          subtext="Retorno sobre o total investido"
          icon={Target}
          iconColorClass="text-purple-400"
          iconBgClass="bg-purple-500/10 border-purple-500/20"
          valueColorClass={roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}
        />
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#121721] border border-[#1E2638] p-4 rounded-2xl space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Pesquisar por jogo, liga, mercado ou estratégia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick Type Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#0B0E14] p-1 rounded-xl border border-[#1E2638] text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === 'ALL'
                  ? 'bg-emerald-500 text-gray-950 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setTypeFilter('SIMPLE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                typeFilter === 'SIMPLE'
                  ? 'bg-emerald-500 text-gray-950 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" /> Simples
            </button>
            <button
              onClick={() => setTypeFilter('MULTIPLE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                typeFilter === 'MULTIPLE'
                  ? 'bg-emerald-500 text-gray-950 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Múltiplas
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-[#1E2638]">
          <div>
            <label className="text-gray-400 block mb-1 font-medium text-[11px] flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Desporto:
            </label>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="ALL">Todos os Desportos</option>
              {SPORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-medium text-[11px] flex items-center gap-1">
              <FileText className="w-3 h-3 text-purple-400" /> Estratégia:
            </label>
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="ALL">Todas as Estratégias</option>
              {STRATEGIES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-medium text-[11px] flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-400" /> Resultado / Estado:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="ALL">Todos os Resultados</option>
              <option value="WIN">Ganhas (Win)</option>
              <option value="LOSS">Perdidas (Loss)</option>
              <option value="PENDING">Pendentes</option>
              <option value="VOID">Anuladas (Void)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bets Table */}
      <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-white">
            Lista de Apostas ({filteredBets.length})
          </h3>
        </div>

        {filteredBets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B0E14] text-gray-400 border-b border-[#1E2638]">
                <tr>
                  <th className="p-3">Tipo / Desporto</th>
                  <th className="p-3">Jogo / Seleção</th>
                  <th className="p-3">Estratégia</th>
                  <th className="p-3">Odd</th>
                  <th className="p-3">Stake</th>
                  <th className="p-3">Resultado</th>
                  <th className="p-3 text-right">P&L (€)</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638]">
                {filteredBets.map((bet) => {
                  const isMultiple = bet.bet_type === 'MULTIPLE';
                  const isExpanded = !!expandedBetIds[bet.id];

                  return (
                    <React.Fragment key={bet.id}>
                      <tr className="hover:bg-[#19202e] transition-colors">
                        {/* Type & Sport Badge */}
                        <td className="p-3">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                isMultiple
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {isMultiple ? <Layers className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                              {isMultiple ? 'Múltipla' : 'Simples'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {bet.sport || 'Futebol'}
                            </span>
                          </div>
                        </td>

                        {/* Match & Selection */}
                        <td className="p-3 font-medium text-white">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span>{bet.match}</span>
                              {isMultiple && (
                                <button
                                  onClick={() => toggleExpandLegs(bet.id)}
                                  className="text-emerald-400 hover:text-emerald-300 text-[10px] flex items-center gap-0.5 underline font-semibold"
                                >
                                  {isExpanded ? (
                                    <>Ocultar Pernas <ChevronUp className="w-3 h-3" /></>
                                  ) : (
                                    <>Ver Pernas ({bet.legs?.length || 0}) <ChevronDown className="w-3 h-3" /></>
                                  )}
                                </button>
                              )}
                            </div>
                            <p className="text-gray-400 text-[11px]">{bet.selection}</p>
                            <span className="block text-[10px] text-gray-500">{bet.league}</span>
                          </div>
                        </td>

                        {/* Strategy */}
                        <td className="p-3">
                          <span className="bg-[#0B0E14] border border-[#1E2638] px-2 py-1 rounded text-[10px] text-gray-300 font-medium">
                            {bet.strategy || 'Geral'}
                          </span>
                        </td>

                        {/* Odd & Stake */}
                        <td className="p-3 font-mono font-bold text-white">{bet.odd.toFixed(2)}</td>
                        <td className="p-3 font-mono">€ {bet.stake.toFixed(2)}</td>

                        {/* Result Badge */}
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 ${
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
                            {bet.result === 'WIN' && <CheckCircle2 className="w-3 h-3" />}
                            {bet.result === 'LOSS' && <XCircle className="w-3 h-3" />}
                            {bet.result === 'PENDING' && <Clock className="w-3 h-3" />}
                            {bet.result}
                          </span>
                        </td>

                        {/* P&L */}
                        <td
                          className={`p-3 text-right font-mono font-bold text-sm ${
                            bet.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {bet.profit >= 0 ? '+' : ''}€ {bet.profit.toFixed(2)}
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => settleBetResult(bet.id, 'WIN')}
                              title="Marcar como Ganha"
                              className={`p-1.5 rounded transition-colors ${
                                bet.result === 'WIN'
                                  ? 'bg-emerald-500 text-gray-950 font-bold'
                                  : 'text-gray-400 hover:text-emerald-400 hover:bg-[#0B0E14]'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => settleBetResult(bet.id, 'LOSS')}
                              title="Marcar como Perdida"
                              className={`p-1.5 rounded transition-colors ${
                                bet.result === 'LOSS'
                                  ? 'bg-rose-500 text-white font-bold'
                                  : 'text-gray-400 hover:text-rose-400 hover:bg-[#0B0E14]'
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => settleBetResult(bet.id, 'VOID')}
                              title="Marcar como Anulada"
                              className={`p-1.5 rounded transition-colors ${
                                bet.result === 'VOID'
                                  ? 'bg-amber-500 text-gray-950 font-bold'
                                  : 'text-gray-400 hover:text-amber-400 hover:bg-[#0B0E14]'
                              }`}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Multiple Bet Expanded Legs Row */}
                      {isMultiple && isExpanded && bet.legs && (
                        <tr className="bg-[#0E121B]">
                          <td colSpan={8} className="p-4">
                            <div className="bg-[#121721] border border-[#1E2638] rounded-xl p-3 space-y-2">
                              <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                                Pernas da Aposta Múltipla ({bet.legs.length} seleções):
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {bet.legs.map((leg, lIdx) => (
                                  <div
                                    key={lIdx}
                                    className="bg-[#0B0E14] border border-[#1E2638] p-2.5 rounded-lg text-xs"
                                  >
                                    <p className="font-semibold text-white truncate">
                                      #{lIdx + 1}. {leg.match}
                                    </p>
                                    <p className="text-gray-400 text-[11px] truncate">
                                      {leg.selection}
                                    </p>
                                    <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500 font-mono">
                                      <span>Odd: <strong>{leg.odd.toFixed(2)}</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500 text-sm space-y-2">
            <Receipt className="w-8 h-8 mx-auto text-gray-600" />
            <p>Nenhuma aposta encontrada com os filtros selecionados.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-emerald-400 font-semibold underline text-xs hover:text-emerald-300"
            >
              Registar Nova Aposta
            </button>
          </div>
        )}
      </div>

      {/* Shared Bet Registration Modal */}
      <BetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
