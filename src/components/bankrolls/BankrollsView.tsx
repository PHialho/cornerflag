import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Trash2,
  Award,
  Zap,
  Target,
  DollarSign,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import { BankrollModal } from './BankrollModal';
import { MetricCard } from '../dashboard/MetricCard';
import type { Bankroll } from '../../types';

export const BankrollsView: React.FC = () => {
  const {
    bankrolls,
    activeBankrollId,
    bets,
    setActiveBankroll,
    createBankroll,
    updateBankroll,
    deleteBankroll,
  } = useCornerFlagStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBankroll, setEditingBankroll] = useState<Bankroll | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeBankroll = bankrolls.find((b) => b.id === activeBankrollId) || bankrolls[0];

  // Helper for Currency Symbols
  const getCurrencySymbol = (code: string = 'EUR') => {
    switch (code.toUpperCase()) {
      case 'USD':
        return '$';
      case 'GBP':
        return '£';
      case 'BRL':
        return 'R$';
      default:
        return '€';
    }
  };

  // Metrics across all bankrolls
  const totalBalance = bankrolls.reduce((acc, b) => acc + b.current_balance, 0);
  const totalInitial = bankrolls.reduce((acc, b) => acc + b.initial_balance, 0);
  const totalProfit = totalBalance - totalInitial;
  const totalProfitPercent = totalInitial > 0 ? (totalProfit / totalInitial) * 100 : 0;

  // Staking Guide Values for Active Bankroll
  const activeCurrencySymbol = getCurrencySymbol(activeBankroll?.currency);
  const activeUnitPercent = activeBankroll?.target_unit_percent ?? 1;
  const activeUnitValue = activeBankroll ? (activeBankroll.current_balance * activeUnitPercent) / 100 : 0;

  const handleOpenCreateModal = () => {
    setEditingBankroll(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: Bankroll) => {
    setEditingBankroll(b);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: {
    name: string;
    initialBalance: number;
    currentBalance?: number;
    currency: string;
    targetUnitPercent: number;
    description: string;
  }) => {
    if (editingBankroll) {
      await updateBankroll(editingBankroll.id, {
        name: data.name,
        initial_balance: data.initialBalance,
        current_balance: data.currentBalance ?? editingBankroll.current_balance,
        currency: data.currency,
        target_unit_percent: data.targetUnitPercent,
        description: data.description,
      });
    } else {
      await createBankroll(
        data.name,
        data.initialBalance,
        data.currency,
        data.targetUnitPercent,
        data.description
      );
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteBankroll(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-emerald-400" /> Gestão de Bancas
          </h2>
          <p className="text-xs text-gray-400">
            Gerencie múltiplas bancas, estabeleça o dimensionamento de unidades e utilize o guia de risco para as suas apostas.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-gray-950 px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nova Banca</span>
        </button>
      </div>

      {/* Metric Cards KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Património Total"
          value={`€ ${totalBalance.toFixed(2)}`}
          subtext={`Total Inicial: € ${totalInitial.toFixed(2)}`}
          icon={Wallet}
          iconColorClass="text-emerald-400"
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
        />

        <MetricCard
          title="Banca Ativa"
          value={`${activeCurrencySymbol} ${activeBankroll?.current_balance.toFixed(2)}`}
          subtext={activeBankroll?.name}
          icon={CheckCircle2}
          iconColorClass="text-emerald-400"
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          badgeText={activeBankroll?.currency || 'EUR'}
        />

        <MetricCard
          title="Lucro Total Consolidado"
          value={`${totalProfit >= 0 ? '+' : ''}€ ${totalProfit.toFixed(2)}`}
          subtext={`${totalProfitPercent >= 0 ? '+' : ''}${totalProfitPercent.toFixed(2)}% sobre investimento`}
          icon={totalProfit >= 0 ? TrendingUp : TrendingDown}
          iconColorClass={totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
          iconBgClass={totalProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}
          valueColorClass={totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
        />

        <MetricCard
          title="Bancas Registadas"
          value={bankrolls.length}
          subtext="Prontas para operação isolada"
          icon={Award}
          iconColorClass="text-purple-400"
          iconBgClass="bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Main Content Grid: Bankrolls Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            As Suas Bancas ({bankrolls.length})
          </h3>
          <span className="text-xs text-gray-400">
            Clique em "Ativar" para selecionar a banca guia para apostas.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bankrolls.map((b) => {
            const isActive = b.id === activeBankrollId;
            const currencySymbol = getCurrencySymbol(b.currency);
            const pnl = b.current_balance - b.initial_balance;
            const pnlPercent = b.initial_balance > 0 ? (pnl / b.initial_balance) * 100 : 0;
            const bankrollBets = bets.filter((bet) => bet.bankroll_id === b.id);
            const totalBetsCount = bankrollBets.length;
            const settledBets = bankrollBets.filter((bet) => bet.result !== 'PENDING');
            const totalStake = settledBets.reduce((acc, bet) => acc + bet.stake, 0);
            const totalProfitBets = settledBets.reduce((acc, bet) => acc + bet.profit, 0);
            const roiPercent = totalStake > 0 ? (totalProfitBets / totalStake) * 100 : 0;
            const unitPercent = b.target_unit_percent ?? 1;
            const unitValue = (b.current_balance * unitPercent) / 100;

            return (
              <div
                key={b.id}
                className={`bg-[#121721] rounded-2xl border transition-all flex flex-col justify-between overflow-hidden relative ${
                  isActive
                    ? 'border-emerald-500/50 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'border-[#1E2638] hover:border-gray-700'
                }`}
              >
                {/* Header Card */}
                <div className="p-5 border-b border-[#1E2638] bg-[#161C28]/50 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-white truncate max-w-[160px]">
                        {b.name}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ATIVA
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                      {b.description || `Banca em ${b.currency}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(b)}
                      title="Editar Banca"
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#1E2638] rounded-xl transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {bankrolls.length > 1 && (
                      <button
                        onClick={() => setDeletingId(b.id)}
                        title="Eliminar Banca"
                        className="p-2 text-gray-400 hover:text-rose-400 hover:bg-[#1E2638] rounded-xl transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Metrics */}
                <div className="p-5 space-y-4 text-xs">
                  {/* Balance Showcase */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                        Saldo Atual
                      </span>
                      <span className="text-xl font-black text-white">
                        {currencySymbol} {b.current_balance.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                        P&L Total
                      </span>
                      <span
                        className={`text-sm font-black ${
                          pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {pnl >= 0 ? '+' : ''}
                        {currencySymbol} {pnl.toFixed(2)} ({pnlPercent >= 0 ? '+' : ''}
                        {pnlPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {/* Grid details */}
                  <div className="grid grid-cols-2 gap-2 bg-[#0B0E14] p-3 rounded-xl border border-[#1E2638] text-[11px]">
                    <div>
                      <span className="text-gray-500 block">Saldo Inicial:</span>
                      <span className="font-semibold text-gray-300">
                        {currencySymbol} {b.initial_balance.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">1 Unidade Base ({unitPercent}%):</span>
                      <span className="font-bold text-emerald-400">
                        {currencySymbol} {unitValue.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Total de Apostas:</span>
                      <span className="font-semibold text-gray-300">{totalBetsCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">ROI %:</span>
                      <span
                        className={`font-bold ${
                          roiPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {roiPercent >= 0 ? '+' : ''}
                        {roiPercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-[#1E2638] bg-[#0B0E14]/40">
                  {isActive ? (
                    <div className="w-full text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Banca Selecionada como Guia
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveBankroll(b.id)}
                      className="w-full text-xs font-bold text-gray-300 hover:text-white bg-[#161C28] hover:bg-[#1E2638] border border-[#1E2638] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Target className="w-4 h-4 text-emerald-400" /> Ativar Como Banca Guia
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Staking & Risk Management Strategy Guide */}
      <div className="bg-[#121721] border border-[#1E2638] rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Guia de Staking & Risco — {activeBankroll?.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Dimensionamento de unidades recalculado em tempo real com base no saldo de{' '}
                <strong className="text-emerald-400">
                  {activeCurrencySymbol} {activeBankroll?.current_balance.toFixed(2)}
                </strong>
              </p>
            </div>
          </div>

          <div className="bg-[#0B0E14] border border-[#1E2638] px-4 py-2 rounded-xl flex items-center gap-3 text-xs">
            <span className="text-gray-400">1 Unidade Base ({activeUnitPercent}%):</span>
            <span className="font-extrabold text-emerald-400 text-sm">
              {activeCurrencySymbol} {activeUnitValue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Staking Scale Grid */}
        <div>
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Tabela de Dimensionamento de Stake
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 0.25 Unit */}
            <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <span className="font-bold">0.25 Unidade</span>
                <span className="text-[10px] bg-[#1E2638] px-2 py-0.5 rounded text-gray-300">
                  Teste / Baixo EV
                </span>
              </div>
              <p className="text-lg font-black text-white">
                {activeCurrencySymbol} {(activeUnitValue * 0.25).toFixed(2)}
              </p>
              <p className="text-[11px] text-gray-500">Apostas de exploração ou mercados de alta variação.</p>
            </div>

            {/* 0.50 Unit */}
            <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <span className="font-bold">0.50 Unidade</span>
                <span className="text-[10px] bg-[#1E2638] px-2 py-0.5 rounded text-gray-300">
                  Conservador
                </span>
              </div>
              <p className="text-lg font-black text-white">
                {activeCurrencySymbol} {(activeUnitValue * 0.5).toFixed(2)}
              </p>
              <p className="text-[11px] text-gray-500">Confiança moderada ou odds mais elevadas.</p>
            </div>

            {/* 1.00 Unit */}
            <div className="bg-[#0B0E14] border border-emerald-500/30 p-4 rounded-2xl space-y-1 bg-emerald-500/5">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="font-bold">1.00 Unidade (Padrão)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  Standard
                </span>
              </div>
              <p className="text-lg font-black text-emerald-400">
                {activeCurrencySymbol} {activeUnitValue.toFixed(2)}
              </p>
              <p className="text-[11px] text-gray-400">Aposta padrão para seleções com +EV comprovado.</p>
            </div>

            {/* 2.00 Units */}
            <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <span className="font-bold">2.00 Unidades</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  Alta Confiança
                </span>
              </div>
              <p className="text-lg font-black text-white">
                {activeCurrencySymbol} {(activeUnitValue * 2).toFixed(2)}
              </p>
              <p className="text-[11px] text-gray-500">Máxima confiança com desvio positivo significativo (CLV).</p>
            </div>
          </div>
        </div>

        {/* Risk Management Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h5 className="font-bold text-white">Regra de Proteção contra Drawdown</h5>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Em momentos de variância negativa (reds seguidos), mantém o valor fixo da unidade ou recalibra proporcionalmente ao novo saldo. Nunca aumentes stakes para tentar recuperar perdas.
              </p>
            </div>
          </div>

          <div className="bg-[#0B0E14] border border-[#1E2638] p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h5 className="font-bold text-white">Critério de Kelly Fracionado</h5>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                O Corner Flag Analytics recomenda a aplicação de <strong>Half-Kelly (50%)</strong> para mitigar a volatilidade inerente aos mercados desportivos mantendo um crescimento exponencial do capital.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Eliminar Banca</h4>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Tem a certeza de que deseja eliminar esta banca? Esta ação removerá a banca da sua conta.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-[#0B0E14] border border-[#1E2638]"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Confirmar Eliminação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <BankrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingBankroll={editingBankroll}
      />
    </div>
  );
};
