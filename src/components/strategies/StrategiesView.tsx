import React, { useState } from 'react';
import {
  Target,
  Plus,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
  CheckCircle2,
  BarChart2,
  Trash2,
  X,
  PieChart,
  Lightbulb,
  Clock,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatCurrency, formatPercent, formatNumber } from '../../lib/formatters';
import { MetricCard } from '../dashboard/MetricCard';
import type { GoalType } from '../../types';

export const StrategiesView: React.FC = () => {
  const {
    bets,
    strategies,
    goals,
    addStrategy,
    addGoal,
    deleteGoal,
    updateGoalProgress,
  } = useCornerFlagStore();
  const { currency, numberFormat } = useSettingsStore();

  const [activeSubTab, setActiveSubTab] = useState<'strategies' | 'recovery' | 'challenges'>('strategies');
  const [isAddStrategyModalOpen, setIsAddStrategyModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [newStrategyName, setNewStrategyName] = useState('');

  // Modal Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('RECOVERY');
  const [goalInitial, setGoalInitial] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalStrategy, setGoalStrategy] = useState('');
  const [goalNotes, setGoalNotes] = useState('');

  // Quick Update Progress State
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [quickProgressValue, setQuickProgressValue] = useState('');

  // CALCULATE STRATEGY PERFORMANCE METRICS FROM BETS
  const strategyStats = strategies.map((stratName) => {
    const stratBets = bets.filter((b) => b.strategy === stratName);
    const totalBets = stratBets.length;
    const settledBets = stratBets.filter((b) => b.result !== 'PENDING');
    const wins = settledBets.filter((b) => b.result === 'WIN' || b.result === 'HALF_WIN').length;
    const winRate = settledBets.length > 0 ? (wins / settledBets.length) * 100 : 0;
    const totalStake = stratBets.reduce((acc, b) => acc + b.stake, 0);
    const totalProfit = settledBets.reduce((acc, b) => acc + b.profit, 0);
    const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;
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
      avgOdd,
    };
  });

  // SMART SUGGESTIONS GENERATOR BASED ON DATA
  const generateSmartSuggestions = () => {
    const suggestions: { type: 'success' | 'warning' | 'info' | 'tip'; title: string; text: string; stratName?: string }[] = [];

    // Find best performing strategy
    const activeStrats = strategyStats.filter((s) => s.totalBets >= 3);
    if (activeStrats.length > 0) {
      const bestStrat = [...activeStrats].sort((a, b) => b.roi - a.roi)[0];
      if (bestStrat.roi > 5) {
        suggestions.push({
          type: 'success',
          title: `Excelente Desempenho: ${bestStrat.name}`,
          text: `A tua estratégia "${bestStrat.name}" apresenta um ROI impressionante de +${formatPercent(bestStrat.roi, 1)} com odd média de ${formatNumber(bestStrat.avgOdd, { decimals: 2, decimalSeparator: numberFormat.decimalSeparator, thousandsSeparator: numberFormat.thousandsSeparator })}. Considera afetar maior volume de banca a esta estratégia.`,

          stratName: bestStrat.name,
        });
      }

      // Check drawdown warning
      const worstStrat = [...activeStrats].sort((a, b) => a.roi - b.roi)[0];
      if (worstStrat.roi < -10) {
        suggestions.push({
          type: 'warning',
          title: `Alerta de Risk/Drawdown: ${worstStrat.name}`,
          text: `A estratégia "${worstStrat.name}" regista um ROI negativo de ${formatPercent(worstStrat.roi, 1)}. Recomendado reduzir a stake para metade ou rever o critério de seleção antes de efetuar novas apostas.`,
          stratName: worstStrat.name,
        });
      }
    }

    // Investment Recovery suggestion
    const recoveryGoals = goals.filter((g) => g.type === 'RECOVERY' && g.status === 'IN_PROGRESS');
    if (recoveryGoals.length > 0) {
      const mainRecovery = recoveryGoals[0];
      const remaining = mainRecovery.target_amount - mainRecovery.current_amount;
      suggestions.push({
        type: 'info',
        title: `Estimativa de Recuperação: ${mainRecovery.title}`,
        text: `Faltam ${formatCurrency(remaining, currency, numberFormat)} para atingir a recuperação total. Manter apostas disciplinadas com stake contínua de 1-2% da banca para atingir o objetivo com segurança.`,
      });
    }

    // Default tip if suggestions are low
    if (suggestions.length < 3) {
      suggestions.push({
        type: 'tip',
        title: 'Sugestão de Gestão de Risco',
        text: 'Diversificar entre 2 a 3 estratégias de valor esperado positivo (+EV) reduz a variância da tua banca global no longo prazo.',
      });
    }

    return suggestions;
  };

  const smartSuggestions = generateSmartSuggestions();

  // FILTERED GOALS
  const recoveryGoals = goals.filter((g) => g.type === 'RECOVERY');
  const challengeGoals = goals.filter((g) => g.type === 'CHALLENGE' || g.type === 'PROFIT_TARGET');

  // SUBMIT HANDLERS
  const handleAddStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrategyName.trim()) return;
    addStrategy(newStrategyName.trim());
    setNewStrategyName('');
    setIsAddStrategyModalOpen(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || !goalTarget) return;

    const initial = parseFloat(goalInitial) || 0;
    const target = parseFloat(goalTarget) || 100;
    const current = parseFloat(goalCurrent) || initial;

    addGoal({
      title: goalTitle.trim(),
      type: goalType,
      initial_amount: initial,
      target_amount: target,
      current_amount: current,
      deadline: goalDeadline || undefined,
      strategy_name: goalStrategy || undefined,
      notes: goalNotes.trim() || undefined,
      status: current >= target ? 'COMPLETED' : 'IN_PROGRESS',
    });

    setGoalTitle('');
    setGoalInitial('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDeadline('');
    setGoalStrategy('');
    setGoalNotes('');
    setIsAddGoalModalOpen(false);
  };

  const handleSaveQuickProgress = (goalId: string) => {
    const val = parseFloat(quickProgressValue);
    if (!isNaN(val)) {
      updateGoalProgress(goalId, val);
    }
    setEditingGoalId(null);
    setQuickProgressValue('');
  };

  // PRESET CHALLENGES QUICK CREATOR
  const createPresetChallenge = (title: string, initial: number, target: number, notes: string) => {
    addGoal({
      title,
      type: 'CHALLENGE',
      initial_amount: initial,
      target_amount: target,
      current_amount: initial,
      status: 'IN_PROGRESS',
      notes,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const globalSettledBets = bets.filter((b) => b.result !== 'PENDING');
  const globalWonBets = globalSettledBets.filter((b) => b.result === 'WIN' || b.result === 'HALF_WIN').length;
  const globalWinRatePct = globalSettledBets.length > 0 ? (globalWonBets / globalSettledBets.length) * 100 : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header - Padronizado com Gestão de Bancas / Apostas / Relatórios */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <Target className="w-6 h-6 text-emerald-400" /> Gestão de Estratégias & Objetivos
          </h2>
          <p className="text-xs text-gray-400">
            Gerencie estratégias de apostas, receba sugestões inteligentes automatizadas e acompanhe a recuperação de capital e desafios de banca.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddStrategyModalOpen(true)}
            className="flex items-center gap-2 bg-[#121721] hover:bg-[#1E2638] border border-[#1E2638] text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>Nova Estratégia</span>
          </button>
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-gray-950 px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Novo Objetivo / Challenge</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS - Padronizado com MetricCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Estratégias Ativas"
          value={strategies.length}
          subtext={`${bets.length} apostas registadas`}
          icon={PieChart}
          iconColorClass="text-indigo-400"
          iconBgClass="bg-indigo-500/10 border-indigo-500/20"
        />

        <MetricCard
          title="Desafios & Metas"
          value={goals.length}
          subtext={`${goals.filter((g) => g.status === 'IN_PROGRESS').length} em curso | ${goals.filter((g) => g.status === 'COMPLETED').length} concluídos`}
          icon={Award}
          iconColorClass="text-amber-400"
          iconBgClass="bg-amber-500/10 border-amber-500/20"
        />

        <MetricCard
          title="Sugestões Inteligentes"
          value={smartSuggestions.length}
          subtext="Insights baseados no teu histórico"
          icon={Sparkles}
          iconColorClass="text-emerald-400"
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
        />

        <MetricCard
          title="Win Rate Global"
          value={formatPercent(globalWinRatePct, 1)}
          subtext="Taxa de acerto em apostas liquidadas"
          icon={TrendingUp}
          iconColorClass="text-purple-400"
          iconBgClass="bg-purple-500/10 border-purple-500/20"
        />
      </div>


      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-[#1E2638] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('strategies')}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'strategies'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Estratégias & Sugestões
        </button>

        <button
          onClick={() => setActiveSubTab('recovery')}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'recovery'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Recuperação de Investimento ({recoveryGoals.length})
        </button>

        <button
          onClick={() => setActiveSubTab('challenges')}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'challenges'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#121721]'
          }`}
        >
          <Flame className="w-4 h-4" />
          Desafios & Challenges ({challengeGoals.length})
        </button>
      </div>

      {/* TAB 1: ESTRATÉGIAS & SUGESTÕES */}
      {activeSubTab === 'strategies' && (
        <div className="space-y-8">
          {/* SMART SUGGESTIONS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Sugestões Automatizadas de Apostas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {smartSuggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    sug.type === 'success'
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : sug.type === 'warning'
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : sug.type === 'info'
                      ? 'bg-blue-500/5 border-blue-500/30'
                      : 'bg-[#121721] border-[#1E2638]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        sug.type === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : sug.type === 'warning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : sug.type === 'info'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{sug.title}</h4>
                      <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed">
                        {sug.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STRATEGIES ANALYTICS TABLE */}
          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#1E2638] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Desempenho por Estratégia</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Métricas agregadas a partir do registo real de apostas efetuadas.
                </p>
              </div>
              <button
                onClick={() => setIsAddStrategyModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Estratégia
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1E2638] bg-[#0B0E14]/50 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Estratégia</th>
                    <th className="py-3.5 px-4 text-center">Apostas</th>
                    <th className="py-3.5 px-4 text-center">Win Rate</th>
                    <th className="py-3.5 px-4 text-right">Stake Total</th>
                    <th className="py-3.5 px-4 text-right">Lucro / Prejuízo</th>
                    <th className="py-3.5 px-4 text-right">ROI %</th>
                    <th className="py-3.5 px-4 text-center">Odd Média</th>
                    <th className="py-3.5 px-4 text-center">Avaliação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638] text-xs">
                  {strategyStats.map((strat) => (
                    <tr key={strat.name} className="hover:bg-[#1A212E]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        {strat.name}
                      </td>
                      <td className="py-3.5 px-4 text-center text-gray-300">{strat.totalBets}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-200">
                        {formatPercent(strat.winRate, 1)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-300">
                        {formatCurrency(strat.totalStake, currency, numberFormat)}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-bold ${
                          strat.totalProfit > 0
                            ? 'text-emerald-400'
                            : strat.totalProfit < 0
                            ? 'text-rose-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {strat.totalProfit > 0 ? '+' : ''}
                        {formatCurrency(strat.totalProfit, currency, numberFormat)}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-bold ${
                          strat.roi > 0
                            ? 'text-emerald-400'
                            : strat.roi < 0
                            ? 'text-rose-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {strat.roi > 0 ? '+' : ''}
                        {formatPercent(strat.roi, 1)}
                      </td>
                      <td className="py-3.5 px-4 text-center text-gray-300">
                        {strat.totalBets > 0
                          ? formatNumber(strat.avgOdd, {
                              decimals: 2,
                              decimalSeparator: numberFormat.decimalSeparator,
                              thousandsSeparator: numberFormat.thousandsSeparator,
                            })
                          : '-'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {strat.totalBets === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            Sem Dados
                          </span>
                        ) : strat.roi > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            +EV Lucrativo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                            Ajustar Risco
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECUPERAÇÃO DE INVESTIMENTO */}
      {activeSubTab === 'recovery' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Gestão de Objetivos de Recuperação de Investimento
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Estipule metas claras para recuperar perdas de capital ou drawdowns anteriores de forma estruturada.
              </p>
            </div>
            <button
              onClick={() => {
                setGoalType('RECOVERY');
                setIsAddGoalModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-500 text-gray-950 font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" /> Criar Meta de Recuperação
            </button>
          </div>

          {recoveryGoals.length === 0 ? (
            <div className="bg-[#121721] border border-[#1E2638] rounded-2xl p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Nenhum Objetivo de Recuperação Ativo</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mt-2">
                Crie um objetivo para rastrear a recuperação de banca e obter projeções de quantas apostas são necessárias.
              </p>
              <button
                onClick={() => {
                  setGoalType('RECOVERY');
                  setIsAddGoalModalOpen(true);
                }}
                className="mt-5 px-4 py-2 bg-emerald-500 text-gray-950 font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Criar Meta Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recoveryGoals.map((goal) => {
                const progressPct = Math.min(
                  100,
                  Math.max(0, (goal.current_amount / goal.target_amount) * 100)
                );
                const isEditingThis = editingGoalId === goal.id;

                return (
                  <div
                    key={goal.id}
                    className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4 hover:border-[#2E3B54] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          Recuperação de Capital
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5">{goal.title}</h3>
                        {goal.notes && <p className="text-xs text-gray-400 mt-1">{goal.notes}</p>}
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-[#1E2638] rounded-lg transition-colors"
                        title="Eliminar Meta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Progresso de Recuperação</span>
                        <span className="font-bold text-white">{formatPercent(progressPct, 1)}</span>
                      </div>
                      <div className="w-full bg-[#0B0E14] h-3 rounded-full overflow-hidden p-0.5 border border-[#1E2638]">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                        <span>Atual: <strong className="text-emerald-400">{formatCurrency(goal.current_amount, currency, numberFormat)}</strong></span>
                        <span>Meta: <strong className="text-white">{formatCurrency(goal.target_amount, currency, numberFormat)}</strong></span>
                      </div>
                    </div>

                    {/* QUICK UPDATE PROGRESS */}
                    <div className="border-t border-[#1E2638] pt-4 flex items-center justify-between">
                      {isEditingThis ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="number"
                            placeholder="Novo valor..."
                            value={quickProgressValue}
                            onChange={(e) => setQuickProgressValue(e.target.value)}
                            className="bg-[#0B0E14] border border-[#1E2638] text-white text-xs px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={() => handleSaveQuickProgress(goal.id)}
                            className="px-3 py-1.5 bg-emerald-500 text-gray-950 font-bold text-xs rounded-lg hover:bg-emerald-600 transition-colors"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingGoalId(null)}
                            className="px-2 py-1.5 text-gray-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-[11px] text-gray-400">
                            Faltam: <strong className="text-gray-200">{formatCurrency(Math.max(0, goal.target_amount - goal.current_amount), currency, numberFormat)}</strong>
                          </span>
                          <button
                            onClick={() => {
                              setEditingGoalId(goal.id);
                              setQuickProgressValue(goal.current_amount.toString());
                            }}
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                          >
                            Atualizar Progresso <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DESAFIOS & CHALLENGES */}
      {activeSubTab === 'challenges' && (
        <div className="space-y-8">
          {/* PRESET CHALLENGES QUICK START BANNER */}
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Desafios Predefinidos Recomendados
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Ative rapidamente desafios clássicos de alavancagem disciplinada e construção de banca.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Preset 1 */}
              <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Challenge 100€ ➔ 1000€</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] text-gray-400">Alavancagem gradual de 100€ iniciais até atingir os 1000€ com gestão rigorosa.</p>
                <button
                  onClick={() => createPresetChallenge('Desafio 100€ ➔ 1000€', 100, 1000, 'Alavancagem gradual com stake limite de 2.5%')}
                  className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors"
                >
                  Aceitar Desafio
                </button>
              </div>

              {/* Preset 2 */}
              <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">50 Apostas Flat Stake</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-gray-400">Desafio de constância: 50 apostas seguidas respeitando a mesma unidade de banca.</p>
                <button
                  onClick={() => createPresetChallenge('Desafio 50 Apostas Flat Stake', 0, 50, 'Manter estritamente stake de 1 unidade por aposta')}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-colors"
                >
                  Aceitar Desafio
                </button>
              </div>

              {/* Preset 3 */}
              <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400">Duplicar Banca em 90 Dias</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-[11px] text-gray-400">Meta de dobrar o valor da banca ativa com ROI sustentável em 3 meses.</p>
                <button
                  onClick={() => createPresetChallenge('Duplicar Banca em 90 Dias', 500, 1000, 'Meta de ROI +100% num horizonte temporal de 90 dias')}
                  className="w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold transition-colors"
                >
                  Aceitar Desafio
                </button>
              </div>
            </div>
          </div>

          {/* USER ACTIVE CHALLENGES GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Os Seus Desafios Ativos
              </h3>
              <button
                onClick={() => {
                  setGoalType('CHALLENGE');
                  setIsAddGoalModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-500 text-gray-950 font-bold rounded-lg text-xs hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Criar Challenge Personalizado
              </button>
            </div>

            {challengeGoals.length === 0 ? (
              <div className="bg-[#121721] border border-[#1E2638] rounded-2xl p-10 text-center text-gray-400">
                Nenhum desafio ativo. Escolha um dos desafios predefinidos acima ou crie o seu próprio!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challengeGoals.map((ch) => {
                  const pct = Math.min(
                    100,
                    Math.max(0, ((ch.current_amount - ch.initial_amount) / (ch.target_amount - ch.initial_amount)) * 100)
                  );
                  const isCompleted = ch.current_amount >= ch.target_amount;

                  return (
                    <div
                      key={ch.id}
                      className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {isCompleted ? 'Desafio Concluído' : 'Em Curso'}
                            </span>
                            {ch.deadline && (
                              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                Limite: {ch.deadline}
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-white mt-2">{ch.title}</h4>
                          {ch.notes && <p className="text-xs text-gray-400 mt-1">{ch.notes}</p>}
                        </div>

                        <button
                          onClick={() => deleteGoal(ch.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-[#1E2638] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* MILESTONE TIMELINE */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Progresso do Desafio</span>
                          <span className="font-bold text-emerald-400">{formatPercent(isNaN(pct) ? 0 : pct, 1)}</span>
                        </div>
                        <div className="w-full bg-[#0B0E14] h-3 rounded-full overflow-hidden p-0.5 border border-[#1E2638]">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${isNaN(pct) ? 0 : pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Inicial: <strong>{formatCurrency(ch.initial_amount, currency, numberFormat)}</strong></span>
                          <span>Atual: <strong className="text-emerald-400">{formatCurrency(ch.current_amount, currency, numberFormat)}</strong></span>
                          <span>Meta: <strong className="text-white">{formatCurrency(ch.target_amount, currency, numberFormat)}</strong></span>
                        </div>
                      </div>

                      {/* QUICK UPDATE PROGRESS */}
                      <div className="border-t border-[#1E2638] pt-4 flex items-center justify-between">
                        {editingGoalId === ch.id ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="number"
                              placeholder="Novo progresso..."
                              value={quickProgressValue}
                              onChange={(e) => setQuickProgressValue(e.target.value)}
                              className="bg-[#0B0E14] border border-[#1E2638] text-white text-xs px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              onClick={() => handleSaveQuickProgress(ch.id)}
                              className="px-3 py-1.5 bg-emerald-500 text-gray-950 font-bold text-xs rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingGoalId(null)}
                              className="px-2 py-1.5 text-gray-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingGoalId(ch.id);
                              setQuickProgressValue(ch.current_amount.toString());
                            }}
                            className="w-full py-2 bg-[#0B0E14] hover:bg-[#1E2638] border border-[#1E2638] text-gray-200 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                          >
                            Atualizar Valor Atual
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW STRATEGY */}
      {isAddStrategyModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Adicionar Nova Estratégia
              </h3>
              <button
                onClick={() => setIsAddStrategyModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStrategy} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Nome da Estratégia:</label>
                <input
                  type="text"
                  placeholder="Ex: Lay ao Favorito Fora, HT Over 0.5..."
                  value={newStrategyName}
                  onChange={(e) => setNewStrategyName(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStrategyModalOpen(false)}
                  className="px-4 py-2 bg-[#0B0E14] text-gray-300 hover:text-white rounded-xl font-semibold border border-[#1E2638]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-gray-950 font-bold rounded-xl hover:bg-emerald-600"
                >
                  Guardar Estratégia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD GOAL OR CHALLENGE */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> Criar Novo Objetivo / Challenge
              </h3>
              <button
                onClick={() => setIsAddGoalModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Título do Objetivo:</label>
                <input
                  type="text"
                  placeholder="Ex: Recuperação Drawdown Maio, Desafio 100€ a 1000€..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Tipo de Objetivo:</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value as GoalType)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="RECOVERY">Recuperação de Investimento</option>
                    <option value="CHALLENGE">Desafio / Challenge de Banca</option>
                    <option value="PROFIT_TARGET">Meta de Lucro Específico</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Data Limite (Opcional):</label>
                  <input
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Valor Inicial (€):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={goalInitial}
                    onChange={(e) => setGoalInitial(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Valor Atual (€):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Meta Target (€):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="1000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Notas / Regras do Desafio:</label>
                <textarea
                  rows={2}
                  placeholder="Defina regras de stake, notas de disciplina ou observações..."
                  value={goalNotes}
                  onChange={(e) => setGoalNotes(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E2638]">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2 bg-[#0B0E14] text-gray-300 hover:text-white rounded-xl font-semibold border border-[#1E2638]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-gray-950 font-bold rounded-xl hover:bg-emerald-600"
                >
                  Guardar Objetivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategiesView;
