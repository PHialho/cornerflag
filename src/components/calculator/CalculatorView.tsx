import React, { useState, useMemo } from 'react';
import {
  Calculator as CalcIcon,
  Percent,
  TrendingUp,
  Scale,
  Layers,
  Shield,
  Gift,
  Target,
  Grid,
  Activity,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import {
  calculateEVAdv,
  calculateKellyAdv,
  convertOddsFromDecimal,
  calculateArbitrage,
  calculateDutching,
  calculateHedge,
  calculateMatchedBetting,
  calculateAsianHandicap,
  calculateParlay,
  calculatePoissonMatrix,
} from '../../lib/math/bettingCalculators';
import { MetricCard } from '../dashboard/MetricCard';

type CalcMode =
  | 'ev'
  | 'kelly'
  | 'converter'
  | 'surebet'
  | 'dutching'
  | 'hedge'
  | 'matched'
  | 'handicap'
  | 'parlay'
  | 'poisson';

export const CalculatorView: React.FC = () => {
  const { bankrolls, activeBankrollId } = useCornerFlagStore();
  const activeBankroll = bankrolls.find((b) => b.id === activeBankrollId) || bankrolls[0];

  const currencySymbol = activeBankroll?.currency === 'USD' ? '$' : activeBankroll?.currency === 'GBP' ? '£' : '€';
  const activeBalance = activeBankroll ? activeBankroll.current_balance : 1000;

  const [activeMode, setActiveMode] = useState<CalcMode>('ev');

  // --- 1. +EV State ---
  const [evOdd, setEvOdd] = useState<number>(2.1);
  const [evProb, setEvProb] = useState<number>(55);
  const evResult = useMemo(() => calculateEVAdv(evOdd, evProb), [evOdd, evProb]);

  // --- 2. Kelly State ---
  const [kellyOdd, setKellyOdd] = useState<number>(2.0);
  const [kellyProb, setKellyProb] = useState<number>(55);
  const [kellyFraction, setKellyFraction] = useState<number>(0.25);
  const kellyResult = useMemo(
    () => calculateKellyAdv(activeBalance, kellyOdd, kellyProb, kellyFraction),
    [activeBalance, kellyOdd, kellyProb, kellyFraction]
  );

  // --- 3. Converter State ---
  const [convDecimal, setConvDecimal] = useState<number>(2.5);
  const convResult = useMemo(() => convertOddsFromDecimal(convDecimal), [convDecimal]);

  // --- 4. Surebet State ---
  const [surebetOdds, setSurebetOdds] = useState<number[]>([2.1, 2.1]);
  const [surebetInvestment, setSurebetInvestment] = useState<number>(100);
  const surebetResult = useMemo(
    () => calculateArbitrage(surebetOdds, surebetInvestment),
    [surebetOdds, surebetInvestment]
  );

  // --- 5. Dutching State ---
  const [dutchOdds, setDutchOdds] = useState<number[]>([3.0, 4.0, 5.0]);
  const [dutchInvestment, setDutchInvestment] = useState<number>(100);
  const dutchResult = useMemo(
    () => calculateDutching(dutchOdds, dutchInvestment),
    [dutchOdds, dutchInvestment]
  );

  // --- 6. Hedge State ---
  const [hedgeOrigStake, setHedgeOrigStake] = useState<number>(50);
  const [hedgeOrigOdd, setHedgeOrigOdd] = useState<number>(3.0);
  const [hedgeCurrentOdd, setHedgeCurrentOdd] = useState<number>(1.8);
  const hedgeResult = useMemo(
    () => calculateHedge(hedgeOrigStake, hedgeOrigOdd, hedgeCurrentOdd),
    [hedgeOrigStake, hedgeOrigOdd, hedgeCurrentOdd]
  );

  // --- 7. Matched Betting State ---
  const [matchedBonus, setMatchedBonus] = useState<number>(50);
  const [matchedBackOdd, setMatchedBackOdd] = useState<number>(2.0);
  const [matchedLayOdd, setMatchedLayOdd] = useState<number>(2.05);
  const [matchedComm, setMatchedComm] = useState<number>(2.0);
  const [matchedIsSNR, setMatchedIsSNR] = useState<boolean>(true);
  const matchedResult = useMemo(
    () => calculateMatchedBetting(matchedBonus, matchedBackOdd, matchedLayOdd, matchedComm, matchedIsSNR),
    [matchedBonus, matchedBackOdd, matchedLayOdd, matchedComm, matchedIsSNR]
  );

  // --- 8. Asian Handicap State ---
  const [ahStake, setAhStake] = useState<number>(100);
  const [ahOdd, setAhOdd] = useState<number>(1.95);
  const [ahLine, setAhLine] = useState<number>(-0.25);
  const [ahHomeGoals, setAhHomeGoals] = useState<number>(1);
  const [ahAwayGoals, setAhAwayGoals] = useState<number>(0);
  const ahResult = useMemo(
    () => calculateAsianHandicap(ahStake, ahOdd, ahLine, ahHomeGoals, ahAwayGoals),
    [ahStake, ahOdd, ahLine, ahHomeGoals, ahAwayGoals]
  );

  // --- 9. Parlay State ---
  const [parlayOdds, setParlayOdds] = useState<number[]>([1.8, 1.9, 1.5]);
  const [parlayStake, setParlayStake] = useState<number>(20);
  const parlayResult = useMemo(() => calculateParlay(parlayOdds, parlayStake), [parlayOdds, parlayStake]);

  // --- 10. Poisson State ---
  const [poissonHomeXG, setPoissonHomeXG] = useState<number>(1.65);
  const [poissonAwayXG, setPoissonAwayXG] = useState<number>(1.1);
  const poissonResult = useMemo(
    () => calculatePoissonMatrix(poissonHomeXG, poissonAwayXG),
    [poissonHomeXG, poissonAwayXG]
  );

  const calcModes: { id: CalcMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'ev', label: 'Precificação +EV', icon: TrendingUp },
    { id: 'kelly', label: 'Critério de Kelly', icon: Percent },
    { id: 'converter', label: 'Conversor de Odds', icon: Scale },
    { id: 'surebet', label: 'Surebet / Arbitragem', icon: Shield },
    { id: 'dutching', label: 'Dutching', icon: Layers },
    { id: 'hedge', label: 'Hedging / Cash Out', icon: Activity },
    { id: 'matched', label: 'Matched Betting (Bónus)', icon: Gift },
    { id: 'handicap', label: 'Handicap Asiático', icon: Target },
    { id: 'parlay', label: 'Múltiplas / Parlay', icon: Grid },
    { id: 'poisson', label: 'Modelo Poisson (xG)', icon: CalcIcon },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header - Standard Corner Flag Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <CalcIcon className="w-6 h-6 text-emerald-400" /> Calculadoras de Apostas
          </h2>
          <p className="text-xs text-gray-400">
            Suite quantitativa para precificação +EV, dimensionamento de banca e otimização financeira de apostas.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#121721] border border-[#1E2638] px-4 py-2 rounded-xl text-xs">
          <span className="text-gray-400">Banca Conectada:</span>
          <span className="font-bold text-white">{activeBankroll?.name}</span>
          <span className="text-emerald-400 font-mono font-bold">
            ({currencySymbol} {activeBalance.toFixed(2)})
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {calcModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                  : 'bg-[#121721] text-gray-400 border border-[#1E2638] hover:text-white hover:bg-[#1A212E]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
              <span className="truncate">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. CALCULADORA +EV */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'ev' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2638] pb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Parâmetros da Aposta
              </h3>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Odd Oferecida pela Casa:</label>
                <input
                  type="number"
                  step="0.01"
                  value={evOdd}
                  onChange={(e) => setEvOdd(parseFloat(e.target.value) || 1.01)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 font-medium mb-1">
                  <span>Probabilidade Estimada de Sucesso:</span>
                  <span className="text-emerald-400 font-bold">{evProb}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="99"
                  value={evProb}
                  onChange={(e) => setEvProb(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <MetricCard
                title="Valor Esperado (+EV %)"
                value={`${evResult.evPercent >= 0 ? '+' : ''}${evResult.evPercent}%`}
                subtext={`Lucro esperado por cada ${currencySymbol}100: ${currencySymbol} ${evResult.expectedProfitPer100}`}
                icon={TrendingUp}
                iconColorClass={evResult.isPositiveEV ? 'text-emerald-400' : 'text-rose-400'}
                iconBgClass={evResult.isPositiveEV ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}
                valueColorClass={evResult.isPositiveEV ? 'text-emerald-400' : 'text-rose-400'}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121721] border border-[#1E2638] p-4 rounded-2xl">
                  <span className="text-xs text-gray-400 block">Odd Justa de Mercado</span>
                  <span className="text-xl font-black text-cyan-400 font-mono mt-1 block">@{evResult.fairOdd}</span>
                </div>
                <div className="bg-[#121721] border border-[#1E2638] p-4 rounded-2xl">
                  <span className="text-xs text-gray-400 block">Probabilidade Implícita</span>
                  <span className="text-xl font-black text-purple-400 font-mono mt-1 block">{evResult.impliedProbabilityPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. CRITÉRIO DE KELLY */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'kelly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2638] pb-3">
                <Percent className="w-4 h-4 text-emerald-400" /> Otimizador de Stake de Kelly
              </h3>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Odd Apostada:</label>
                <input
                  type="number"
                  step="0.01"
                  value={kellyOdd}
                  onChange={(e) => setKellyOdd(parseFloat(e.target.value) || 1.01)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Probabilidade Real Estimada (%):</label>
                <input
                  type="number"
                  value={kellyProb}
                  onChange={(e) => setKellyProb(parseFloat(e.target.value) || 1)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Fração de Kelly (Gestão de Risco):</label>
                <select
                  value={kellyFraction}
                  onChange={(e) => setKellyFraction(parseFloat(e.target.value))}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value={0.25}>1/4 Kelly (Recomendado Conservador)</option>
                  <option value={0.5}>1/2 Kelly (Moderado)</option>
                  <option value={1.0}>Full Kelly (Agressivo / Alto Risco)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <MetricCard
                title="Stake Sugerida em Euros"
                value={`${currencySymbol} ${kellyResult.suggestedStakeAmount.toFixed(2)}`}
                subtext={`${kellyResult.suggestedKellyPercent}% da banca (${currencySymbol} ${activeBalance.toFixed(2)})`}
                icon={Percent}
                iconColorClass="text-emerald-400"
                iconBgClass="bg-emerald-500/10 border-emerald-500/20"
                valueColorClass="text-emerald-400"
              />

              <div className="bg-[#121721] border border-[#1E2638] p-5 rounded-2xl grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Full Kelly %</span>
                  <span className="text-lg font-black text-purple-400 font-mono mt-1 block">{kellyResult.fullKellyPercent}%</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Crescimento Esperado de Banca</span>
                  <span className="text-lg font-black text-cyan-400 font-mono mt-1 block">+{kellyResult.expectedGrowthPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. CONVERSOR DE ODDS */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'converter' && (
        <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2638] pb-3">
            <Scale className="w-4 h-4 text-emerald-400" /> Conversor Instantâneo de Formatos de Odds
          </h3>

          <div className="max-w-md">
            <label className="text-xs text-gray-400 font-medium block mb-1">Introduzir Odd Decimal:</label>
            <input
              type="number"
              step="0.01"
              value={convDecimal}
              onChange={(e) => setConvDecimal(parseFloat(e.target.value) || 1.01)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Decimal (EU)</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{convResult.decimal.toFixed(2)}</span>
            </div>
            <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Fracionário (UK)</span>
              <span className="text-xl font-black text-blue-400 font-mono">{convResult.fractional}</span>
            </div>
            <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Americano (US)</span>
              <span className="text-xl font-black text-purple-400 font-mono">{convResult.american}</span>
            </div>
            <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Probabilidade Implícita</span>
              <span className="text-xl font-black text-amber-400 font-mono">{convResult.impliedProbabilityPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. SUREBET / ARBITRAGEM */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'surebet' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Calculadora de Arbitragem (Surebet Sem Risco)
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => setSurebetOdds([2.1, 2.1])}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    surebetOdds.length === 2 ? 'bg-emerald-500 text-gray-950' : 'bg-[#0B0E14] text-gray-400'
                  }`}
                >
                  2 Saídas
                </button>
                <button
                  onClick={() => setSurebetOdds([3.4, 3.5, 3.4])}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    surebetOdds.length === 3 ? 'bg-emerald-500 text-gray-950' : 'bg-[#0B0E14] text-gray-400'
                  }`}
                >
                  3 Saídas (1X2)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Investimento Total Desejado:</label>
              <input
                type="number"
                value={surebetInvestment}
                onChange={(e) => setSurebetInvestment(parseFloat(e.target.value) || 10)}
                className="w-full md:w-64 bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {surebetOdds.map((odd, idx) => (
                <div key={idx} className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl space-y-2">
                  <label className="text-xs text-gray-400 font-medium block">Odd Opção {idx + 1}:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={odd}
                    onChange={(e) => {
                      const newArr = [...surebetOdds];
                      newArr[idx] = parseFloat(e.target.value) || 1.01;
                      setSurebetOdds(newArr);
                    }}
                    className="w-full bg-[#121721] border border-[#1E2638] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                  {surebetResult.stakes[idx] !== undefined && (
                    <div className="pt-2 border-t border-[#1E2638] text-xs">
                      <span className="text-gray-400 block">Stake Sugerida:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {currencySymbol} {surebetResult.stakes[idx]}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#1E2638] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 block">Margem de Lucro Sem Risco:</span>
                <span
                  className={`text-2xl font-black font-mono ${
                    surebetResult.isSurebet ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {surebetResult.profitMarginPercent > 0 ? '+' : ''}
                  {surebetResult.profitMarginPercent}% ({currencySymbol} {surebetResult.totalProfit})
                </span>
              </div>

              <div
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  surebetResult.isSurebet
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                {surebetResult.isSurebet ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> SUREBET ENCONTRADA (LUCRO GARANTIDO)
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> SEM ARBITRAGEM (MARGEM DA CASA)
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. DUTCHING */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'dutching' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Calculadora de Dutching (Múltiplas Seleções)
              </h3>
              <button
                onClick={() => setDutchOdds([...dutchOdds, 4.0])}
                className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Seleção
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Investimento Total Proposto:</label>
              <input
                type="number"
                value={dutchInvestment}
                onChange={(e) => setDutchInvestment(parseFloat(e.target.value) || 10)}
                className="w-full md:w-64 bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dutchOdds.map((odd, idx) => (
                <div key={idx} className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl space-y-2 relative">
                  {dutchOdds.length > 2 && (
                    <button
                      onClick={() => setDutchOdds(dutchOdds.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 text-gray-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <label className="text-xs text-gray-400 font-medium block">Seleção {idx + 1} (Odd):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={odd}
                    onChange={(e) => {
                      const newArr = [...dutchOdds];
                      newArr[idx] = parseFloat(e.target.value) || 1.01;
                      setDutchOdds(newArr);
                    }}
                    className="w-full bg-[#121721] border border-[#1E2638] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <div className="pt-2 border-t border-[#1E2638] text-xs">
                    <span className="text-gray-400 block">Stake Alocada:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {currencySymbol} {dutchResult.individualStakes[idx] || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#1E2638] grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Retorno Igual Garantido:</span>
                <span className="text-lg font-black text-white font-mono">{currencySymbol} {dutchResult.equalPayout}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Lucro Líquido:</span>
                <span className={`text-lg font-black font-mono ${dutchResult.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {dutchResult.netProfit >= 0 ? '+' : ''}{currencySymbol} {dutchResult.netProfit}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">ROI do Dutching:</span>
                <span className={`text-lg font-black font-mono ${dutchResult.roiPercent >= 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                  {dutchResult.roiPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. HEDGING / CASHOUT */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'hedge' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2638] pb-3">
                <Activity className="w-4 h-4 text-emerald-400" /> Parâmetros de Cobertura (Hedge)
              </h3>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Stake da Aposta Original:</label>
                <input
                  type="number"
                  value={hedgeOrigStake}
                  onChange={(e) => setHedgeOrigStake(parseFloat(e.target.value) || 1)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Odd da Aposta Original:</label>
                <input
                  type="number"
                  step="0.01"
                  value={hedgeOrigOdd}
                  onChange={(e) => setHedgeOrigOdd(parseFloat(e.target.value) || 1.01)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Odd Atual para Cobertura / Lay:</label>
                <input
                  type="number"
                  step="0.01"
                  value={hedgeCurrentOdd}
                  onChange={(e) => setHedgeCurrentOdd(parseFloat(e.target.value) || 1.01)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <MetricCard
                title="Stake Sugerida para Cobertura"
                value={`${currencySymbol} ${hedgeResult.hedgeStake.toFixed(2)}`}
                subtext={`Investimento total em risco: ${currencySymbol} ${(hedgeOrigStake + hedgeResult.hedgeStake).toFixed(2)}`}
                icon={Activity}
                iconColorClass="text-emerald-400"
                iconBgClass="bg-emerald-500/10 border-emerald-500/20"
                valueColorClass="text-emerald-400"
              />

              <div className="bg-[#121721] border border-[#1E2638] p-5 rounded-2xl grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Lucro Garantido (Com Cobertura)</span>
                  <span className={`text-lg font-black font-mono mt-1 block ${hedgeResult.guaranteedProfitIfHedged >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {hedgeResult.guaranteedProfitIfHedged >= 0 ? '+' : ''}{currencySymbol} {hedgeResult.guaranteedProfitIfHedged}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block">Lucro se Não Cobrir (Sem Hedge)</span>
                  <span className="text-lg font-black text-cyan-400 font-mono mt-1 block">+{currencySymbol} {hedgeResult.originalProfitIfWon}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 7. MATCHED BETTING */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'matched' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2638] pb-3">
                <Gift className="w-4 h-4 text-emerald-400" /> Calculadora de Retenção de Bónus / Freebet
              </h3>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Valor do Bónus / Freebet:</label>
                <input
                  type="number"
                  value={matchedBonus}
                  onChange={(e) => setMatchedBonus(parseFloat(e.target.value) || 1)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Odd Back (Casa):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={matchedBackOdd}
                    onChange={(e) => setMatchedBackOdd(parseFloat(e.target.value) || 1.01)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Odd Lay (Bolsa):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={matchedLayOdd}
                    onChange={(e) => setMatchedLayOdd(parseFloat(e.target.value) || 1.01)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Comissão da Bolsa (%):</label>
                  <input
                    type="number"
                    value={matchedComm}
                    onChange={(e) => setMatchedComm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Tipo de Freebet:</label>
                  <select
                    value={matchedIsSNR ? 'snr' : 'sr'}
                    onChange={(e) => setMatchedIsSNR(e.target.value === 'snr')}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="snr">SNR (Sem Devolução de Stake)</option>
                    <option value="sr">SR (Com Devolução de Stake)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <MetricCard
                title="Stake Lay a Colocar na Bolsa"
                value={`${currencySymbol} ${matchedResult.layStake.toFixed(2)}`}
                subtext={`Responsabilidade (Lay Liability): ${currencySymbol} ${matchedResult.layLiability.toFixed(2)}`}
                icon={Gift}
                iconColorClass="text-emerald-400"
                iconBgClass="bg-emerald-500/10 border-emerald-500/20"
                valueColorClass="text-emerald-400"
              />

              <div className="bg-[#121721] border border-[#1E2638] p-5 rounded-2xl grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Lucro Retido em Dinheiro</span>
                  <span className="text-lg font-black text-emerald-400 font-mono mt-1 block">+{currencySymbol} {matchedResult.guaranteedProfit}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Taxa de Retenção do Bónus</span>
                  <span className="text-lg font-black text-purple-400 font-mono mt-1 block">{matchedResult.retentionPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 8. HANDICAP ASIÁTICO */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'handicap' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2638] pb-3">
              <Target className="w-4 h-4 text-emerald-400" /> Simulador & Calculadora de Handicaps Asiáticos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Linha de Handicap Asiático:</label>
                <select
                  value={ahLine}
                  onChange={(e) => setAhLine(parseFloat(e.target.value))}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value={-2.0}>-2.00</option>
                  <option value={-1.75}>-1.75 (-1.5, -2.0)</option>
                  <option value={-1.5}>-1.50</option>
                  <option value={-1.25}>-1.25 (-1.0, -1.5)</option>
                  <option value={-1.0}>-1.00</option>
                  <option value={-0.75}>-0.75 (-0.5, -1.0)</option>
                  <option value={-0.5}>-0.50</option>
                  <option value={-0.25}>-0.25 (0, -0.5)</option>
                  <option value={0}>0.00 (Draw No Bet / DNB)</option>
                  <option value={0.25}>+0.25 (0, +0.5)</option>
                  <option value={0.5}>+0.50</option>
                  <option value={0.75}>+0.75 (+0.5, +1.0)</option>
                  <option value={1.0}>+1.00</option>
                  <option value={1.25}>+1.25 (+1.0, +1.5)</option>
                  <option value={1.5}>+1.50</option>
                  <option value={1.75}>+1.75 (+1.5, +2.0)</option>
                  <option value={2.0}>+2.00</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Stake:</label>
                <input
                  type="number"
                  value={ahStake}
                  onChange={(e) => setAhStake(parseFloat(e.target.value) || 10)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Odd Apostada:</label>
                <input
                  type="number"
                  step="0.01"
                  value={ahOdd}
                  onChange={(e) => setAhOdd(parseFloat(e.target.value) || 1.01)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Golos Equipa da Aposta:</label>
                <input
                  type="number"
                  value={ahHomeGoals}
                  onChange={(e) => setAhHomeGoals(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Golos Equipa Adversária:</label>
                <input
                  type="number"
                  value={ahAwayGoals}
                  onChange={(e) => setAhAwayGoals(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E2638] flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 block">Resultado do Handicap:</span>
                <span className="text-xl font-bold text-white flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-black ${
                      ahResult.outcome === 'WIN'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : ahResult.outcome === 'HALF_WIN'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : ahResult.outcome === 'VOID'
                        ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        : ahResult.outcome === 'HALF_LOSS'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {ahResult.outcome}
                  </span>
                  <span className="text-xs text-gray-400">{ahResult.description}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block">Lucro / Prejuízo Líquido:</span>
                <span
                  className={`text-2xl font-black font-mono ${
                    ahResult.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {ahResult.profit >= 0 ? '+' : ''}{currencySymbol} {ahResult.profit}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 9. MÚLTIPLAS / PARLAY */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'parlay' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-400" /> Calculadora de Apostas Múltiplas / Acumuladas
              </h3>
              <button
                onClick={() => setParlayOdds([...parlayOdds, 1.8])}
                className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Pernas
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Stake Total da Múltipla:</label>
              <input
                type="number"
                value={parlayStake}
                onChange={(e) => setParlayStake(parseFloat(e.target.value) || 1)}
                className="w-full md:w-64 bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {parlayOdds.map((odd, idx) => (
                <div key={idx} className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl space-y-2 relative">
                  {parlayOdds.length > 2 && (
                    <button
                      onClick={() => setParlayOdds(parlayOdds.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 text-gray-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <label className="text-xs text-gray-400 font-medium block">Odd Perna #{idx + 1}:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={odd}
                    onChange={(e) => {
                      const newArr = [...parlayOdds];
                      newArr[idx] = parseFloat(e.target.value) || 1.01;
                      setParlayOdds(newArr);
                    }}
                    className="w-full bg-[#121721] border border-[#1E2638] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#1E2638] grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Odd Combinada Total:</span>
                <span className="text-xl font-black text-amber-400 font-mono">@{parlayResult.combinedOdd}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Retorno Potencial:</span>
                <span className="text-xl font-black text-white font-mono">{currencySymbol} {parlayResult.totalPayout}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Lucro Potencial:</span>
                <span className="text-xl font-black text-emerald-400 font-mono">+{currencySymbol} {parlayResult.netProfit}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 10. POISSON MODEL (xG) */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'poisson' && (
        <div className="space-y-6">
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2638] pb-3">
              <CalcIcon className="w-4 h-4 text-emerald-400" /> Modelo Poisson & Probabilidades por Golos Esperados (xG)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">xG Equipa da Casa (Home xG):</label>
                <input
                  type="number"
                  step="0.05"
                  value={poissonHomeXG}
                  onChange={(e) => setPoissonHomeXG(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">xG Equipa Visitante (Away xG):</label>
                <input
                  type="number"
                  step="0.05"
                  value={poissonAwayXG}
                  onChange={(e) => setPoissonAwayXG(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl text-xs space-y-1">
                <span className="text-gray-400 block font-bold">Probabilidades 1X2</span>
                <div className="flex justify-between text-gray-300">
                  <span>Vitória Casa (1):</span>
                  <span className="font-bold text-emerald-400 font-mono">{poissonResult.prob1X2.homeWinProb}%</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Empate (X):</span>
                  <span className="font-bold text-amber-400 font-mono">{poissonResult.prob1X2.drawProb}%</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Vitória Fora (2):</span>
                  <span className="font-bold text-blue-400 font-mono">{poissonResult.prob1X2.awayWinProb}%</span>
                </div>
              </div>

              <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl text-xs space-y-1">
                <span className="text-gray-400 block font-bold">Mercado Over/Under 2.5</span>
                <div className="flex justify-between text-gray-300">
                  <span>Over 2.5 Golos:</span>
                  <span className="font-bold text-purple-400 font-mono">{poissonResult.probOverUnder25.over25Prob}%</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Under 2.5 Golos:</span>
                  <span className="font-bold text-cyan-400 font-mono">{poissonResult.probOverUnder25.under25Prob}%</span>
                </div>
              </div>

              <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl text-xs space-y-1">
                <span className="text-gray-400 block font-bold">Mercado Ambas Marcam (BTTS)</span>
                <div className="flex justify-between text-gray-300">
                  <span>BTTS Sim:</span>
                  <span className="font-bold text-emerald-400 font-mono">{poissonResult.probBTTS.bttsYesProb}%</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>BTTS Não:</span>
                  <span className="font-bold text-rose-400 font-mono">{poissonResult.probBTTS.bttsNoProb}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
