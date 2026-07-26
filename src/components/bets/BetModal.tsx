import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Trash2,
  Layers,
  FileText,
  Target,
  Trophy,
  Wallet,
  Plus,
  Check,
} from 'lucide-react';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import type { BetResult } from '../../lib/math/calculator';
import type { BetType, BetLeg } from '../../types';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose }) => {
  const {
    bankrolls,
    activeBankrollId,
    sports,
    strategies,
    addBet,
    addSport,
    addStrategy,
  } = useCornerFlagStore();

  const [bankrollId, setBankrollId] = useState(activeBankrollId || bankrolls[0]?.id || '');
  const [betType, setBetType] = useState<BetType>('SIMPLE');
  const [sport, setSport] = useState(sports[0] || 'Futebol');
  const [strategy, setStrategy] = useState(strategies[0] || 'Over/Under Gols');

  // Inline Add New Sport / Strategy States
  const [isAddingSport, setIsAddingSport] = useState(false);
  const [newSportName, setNewSportName] = useState('');

  const [isAddingStrategy, setIsAddingStrategy] = useState(false);
  const [newStrategyName, setNewStrategyName] = useState('');

  // Simple Bet State
  const [match, setMatch] = useState('');
  const [league, setLeague] = useState('');
  const [market, setMarket] = useState('');
  const [selection, setSelection] = useState('');
  const [odd, setOdd] = useState<number>(1.90);

  // Multiple Bet Legs State
  const [legs, setLegs] = useState<BetLeg[]>([
    { match: '', league: '', market: 'Over 2.5', selection: 'Over 2.5 Gols', odd: 1.50 },
    { match: '', league: '', market: 'Match Odds', selection: 'Vitória Casa', odd: 1.60 },
  ]);

  // Shared State
  const [stake, setStake] = useState<number>(50);
  const [result, setResult] = useState<BetResult | 'PENDING'>('WIN');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Compute combined odd for Multiple Bet
  const computedMultipleOdd = legs.reduce((acc, leg) => acc * (Number(leg.odd) || 1), 1);
  const finalOdd = betType === 'SIMPLE' ? odd : Math.round(computedMultipleOdd * 100) / 100;
  const estimatedPayout = Math.round(stake * finalOdd * 100) / 100;

  const handleConfirmAddSport = () => {
    const trimmed = newSportName.trim();
    if (trimmed) {
      addSport(trimmed);
      setSport(trimmed);
      setNewSportName('');
    }
    setIsAddingSport(false);
  };

  const handleConfirmAddStrategy = () => {
    const trimmed = newStrategyName.trim();
    if (trimmed) {
      addStrategy(trimmed);
      setStrategy(trimmed);
      setNewStrategyName('');
    }
    setIsAddingStrategy(false);
  };

  const handleAddLeg = () => {
    setLegs([
      ...legs,
      { match: '', league: '', market: 'Mercado', selection: 'Seleção', odd: 1.50 },
    ]);
  };

  const handleRemoveLeg = (index: number) => {
    if (legs.length <= 2) return;
    setLegs(legs.filter((_, i) => i !== index));
  };

  const handleLegChange = (index: number, field: keyof BetLeg, value: any) => {
    const updated = [...legs];
    updated[index] = { ...updated[index], [field]: value };
    setLegs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankrollId || stake <= 0) return;

    if (betType === 'SIMPLE') {
      if (!match || odd <= 1.0) return;
      await addBet({
        bankroll_id: bankrollId,
        bet_type: 'SIMPLE',
        sport,
        strategy,
        match,
        league: league || 'Geral',
        market: market || 'OVER_UNDER',
        selection: selection || 'Seleção',
        odd,
        stake,
        result,
        notes,
      });
    } else {
      // Multiple Bet
      const validLegs = legs.filter((l) => l.match && l.odd > 1.0);
      if (validLegs.length < 2) return;

      const summaryMatch = `Múltipla (${validLegs.length} Seleções)`;
      const summarySelection = validLegs.map((l) => l.selection).join(' + ');

      await addBet({
        bankroll_id: bankrollId,
        bet_type: 'MULTIPLE',
        sport,
        strategy,
        match: summaryMatch,
        league: 'Múltiplas',
        market: 'MULTIPLE',
        selection: summarySelection,
        odd: finalOdd,
        stake,
        result,
        notes,
        legs: validLegs,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121721] border border-[#1E2638] w-full max-w-2xl p-6 rounded-3xl shadow-2xl space-y-6 relative my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Registar Nova Aposta</h3>
              <p className="text-xs text-gray-400">
                Aposta simples ou múltipla com estratégia e desporto
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Bet Type Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-[#0B0E14] p-1.5 rounded-2xl border border-[#1E2638]">
            <button
              type="button"
              onClick={() => setBetType('SIMPLE')}
              className={`py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                betType === 'SIMPLE'
                  ? 'bg-[#121721] text-emerald-400 border border-[#1E2638] shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" /> Aposta Simples
            </button>
            <button
              type="button"
              onClick={() => setBetType('MULTIPLE')}
              className={`py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                betType === 'MULTIPLE'
                  ? 'bg-[#121721] text-emerald-400 border border-[#1E2638] shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> Aposta Múltipla
            </button>
          </div>

          {/* Top Row: Bankroll, Sport, Strategy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Bankroll Dropdown */}
            <div>
              <label className="text-gray-400 block mb-1 font-medium flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Banca:
              </label>
              <select
                value={bankrollId}
                onChange={(e) => setBankrollId(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
              >
                {bankrolls.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (€ {b.current_balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {/* Sport Dropdown with Add New Option */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-400 font-medium flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Desporto:
                </label>
                {!isAddingSport && (
                  <button
                    type="button"
                    onClick={() => setIsAddingSport(true)}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] flex items-center gap-0.5 font-semibold"
                  >
                    <Plus className="w-3 h-3" /> Novo
                  </button>
                )}
              </div>

              {isAddingSport ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Nome do desporto..."
                    value={newSportName}
                    onChange={(e) => setNewSportName(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-emerald-500 rounded-xl px-2.5 py-2 text-white"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleConfirmAddSport}
                    className="p-2 bg-emerald-500 text-gray-950 rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSport(false)}
                    className="p-2 bg-[#0B0E14] text-gray-400 rounded-xl hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <select
                  value={sport}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsAddingSport(true);
                    } else {
                      setSport(e.target.value);
                    }
                  }}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                >
                  {sports.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="__NEW__">+ Adicionar Novo Desporto...</option>
                </select>
              )}
            </div>

            {/* Strategy Dropdown with Add New Option */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-400 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" /> Estratégia:
                </label>
                {!isAddingStrategy && (
                  <button
                    type="button"
                    onClick={() => setIsAddingStrategy(true)}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] flex items-center gap-0.5 font-semibold"
                  >
                    <Plus className="w-3 h-3" /> Nova
                  </button>
                )}
              </div>

              {isAddingStrategy ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Nome da estratégia..."
                    value={newStrategyName}
                    onChange={(e) => setNewStrategyName(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-purple-500 rounded-xl px-2.5 py-2 text-white"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleConfirmAddStrategy}
                    className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingStrategy(false)}
                    className="p-2 bg-[#0B0E14] text-gray-400 rounded-xl hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <select
                  value={strategy}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsAddingStrategy(true);
                    } else {
                      setStrategy(e.target.value);
                    }
                  }}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                >
                  {strategies.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                  <option value="__NEW__">+ Adicionar Nova Estratégia...</option>
                </select>
              )}
            </div>
          </div>

          {/* Simple Bet Form Fields */}
          {betType === 'SIMPLE' && (
            <div className="space-y-3 bg-[#0B0E14] p-4 rounded-2xl border border-[#1E2638]">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-emerald-400">
                Dados do Evento
              </h4>

              <div>
                <label className="text-gray-400 block mb-1 font-medium">Jogo / Confronto:</label>
                <input
                  type="text"
                  placeholder="Ex: Real Madrid vs Barcelona"
                  value={match}
                  onChange={(e) => setMatch(e.target.value)}
                  className="w-full bg-[#121721] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Liga / Torneio:</label>
                  <input
                    type="text"
                    placeholder="Ex: La Liga"
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    className="w-full bg-[#121721] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Mercado:</label>
                  <input
                    type="text"
                    placeholder="Ex: Cantos Asiáticos"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className="w-full bg-[#121721] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Seleção:</label>
                  <input
                    type="text"
                    placeholder="Ex: Over 9.5 Cantos"
                    value={selection}
                    onChange={(e) => setSelection(e.target.value)}
                    className="w-full bg-[#121721] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-medium">Odd:</label>
                <input
                  type="number"
                  step="0.01"
                  value={odd}
                  onChange={(e) => setOdd(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-[#121721] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white font-mono"
                  required
                />
              </div>
            </div>
          )}

          {/* Multiple Bet Form Fields (Legs) */}
          {betType === 'MULTIPLE' && (
            <div className="space-y-4 bg-[#0B0E14] p-4 rounded-2xl border border-[#1E2638]">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-emerald-400">
                  Seleções da Múltipla ({legs.length})
                </h4>
                <button
                  type="button"
                  onClick={handleAddLeg}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Seleção
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {legs.map((leg, idx) => (
                  <div
                    key={idx}
                    className="bg-[#121721] border border-[#1E2638] p-3 rounded-xl space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-400">
                        Seleção #{idx + 1}
                      </span>
                      {legs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLeg(idx)}
                          className="p-1 text-gray-500 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Jogo (Ex: Benfica vs Porto)"
                        value={leg.match}
                        onChange={(e) => handleLegChange(idx, 'match', e.target.value)}
                        className="bg-[#0B0E14] border border-[#1E2638] rounded-lg px-2.5 py-2 text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Seleção (Ex: Over 2.5)"
                        value={leg.selection}
                        onChange={(e) => handleLegChange(idx, 'selection', e.target.value)}
                        className="bg-[#0B0E14] border border-[#1E2638] rounded-lg px-2.5 py-2 text-white"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Odd (Ex: 1.60)"
                        value={leg.odd}
                        onChange={(e) =>
                          handleLegChange(idx, 'odd', parseFloat(e.target.value) || 1.0)
                        }
                        className="bg-[#0B0E14] border border-[#1E2638] rounded-lg px-2.5 py-2 text-white font-mono"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Odd Summary */}
              <div className="flex items-center justify-between bg-[#121721] p-3 rounded-xl border border-emerald-500/30">
                <span className="text-gray-300 font-medium">Odd Total Combinada:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {finalOdd.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Stake & Result Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 block mb-1 font-medium">Stake / Valor (€):</label>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1 font-medium">Resultado:</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value as BetResult | 'PENDING')}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white font-medium"
              >
                <option value="WIN">Ganha</option>
                <option value="HALF_WIN">Meio Ganha</option>
                <option value="VOID">Anulada</option>
                <option value="HALF_LOSS">Meio Perdida</option>
                <option value="LOSS">Perdida</option>
                <option value="PENDING">Pendente</option>
              </select>
            </div>
          </div>

          {/* Estimated Payout Display */}
          <div className="flex justify-between items-center bg-[#0B0E14] p-3 rounded-xl border border-[#1E2638] text-xs">
            <span className="text-gray-400">Retorno Potencial / Payout:</span>
            <span className="font-mono font-bold text-sm text-emerald-400">
              € {estimatedPayout.toFixed(2)}
            </span>
          </div>

          {/* Notes */}
          <div>
            <label className="text-gray-400 block mb-1 font-medium">Observações / Notas:</label>
            <textarea
              placeholder="Ex: Entrada com boa liquidez, odd de valor no Live"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2 text-white resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#1E2638] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 font-bold text-gray-950 px-6 py-3 rounded-xl transition-all text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Registar Aposta {betType === 'MULTIPLE' ? 'Múltipla' : 'Simples'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
