import React, { useState, useMemo } from 'react';
import {
  ArrowDownUp,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Sliders,
  Trash2,
  X,
  Filter,
} from 'lucide-react';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatCurrency } from '../../lib/formatters';
import { MetricCard } from '../dashboard/MetricCard';
import { calculateCashflowSummary } from '../../lib/math/movementsCalculator';
import type { MovementType } from '../../types';

const PAYMENT_METHODS = [

  'MB WAY',
  'Transferência Bancária',
  'Cartão de Crédito/Débito',
  'Skrill',
  'Neteller',
  'Paypal',
  'Cryptomoeda',
  'Revolut',
  'Outro',
];

export const MovementsView: React.FC = () => {
  const {
    movements,
    bankrolls,
    activeBankrollId,
    addMovement,
    deleteMovement,
  } = useCornerFlagStore();

  const { currency, numberFormat } = useSettingsStore();

  // Filters State
  const [bankrollFilter, setBankrollFilter] = useState<'active' | 'all'>('active');
  const [typeFilter, setTypeFilter] = useState<MovementType | 'ALL'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<MovementType>('DEPOSIT');
  const [selectedBankrollId, setSelectedBankrollId] = useState<string>(activeBankrollId || bankrolls[0]?.id || '');
  const [amountInput, setAmountInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MB WAY');
  const [notesInput, setNotesInput] = useState('');

  const activeBankroll = bankrolls.find((b) => b.id === activeBankrollId) || bankrolls[0];

  // Filtered Movements based on scope and type
  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      const matchBankroll = bankrollFilter === 'all' || m.bankroll_id === activeBankrollId;
      const matchType = typeFilter === 'ALL' || m.type === typeFilter;
      return matchBankroll && matchType;
    });
  }, [movements, bankrollFilter, activeBankrollId, typeFilter]);

  // Compute Cashflow KPI Summary
  const targetBankrollId = bankrollFilter === 'active' ? activeBankrollId || undefined : undefined;
  const cashflow = useMemo(() => {
    return calculateCashflowSummary(movements, targetBankrollId);
  }, [movements, targetBankrollId]);

  // Form Submit Handler
  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0 || !selectedBankrollId) return;

    addMovement({
      bankroll_id: selectedBankrollId,
      type: modalType,
      amount: val,
      payment_method: paymentMethod,
      notes: notesInput.trim() || undefined,
    });

    setAmountInput('');
    setNotesInput('');
    setIsModalOpen(false);
  };

  const handleOpenModal = (type: MovementType) => {
    setModalType(type);
    setSelectedBankrollId(activeBankrollId || bankrolls[0]?.id || '');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header - Padronizado com Gestão de Bancas / Apostas / Relatórios */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <ArrowDownUp className="w-6 h-6 text-emerald-400" /> Movimentos & Cashflow
          </h2>
          <p className="text-xs text-gray-400">
            Registe depósitos, levantamentos, bónus e acompanhe o cashflow financeiro da banca{' '}
            <span className="text-emerald-400 font-semibold">{activeBankroll?.name || 'Ativa'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal('DEPOSIT')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-gray-950 px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Novo Depósito</span>
          </button>
          <button
            onClick={() => handleOpenModal('WITHDRAWAL')}
            className="flex items-center gap-2 bg-[#121721] hover:bg-[#1E2638] border border-[#1E2638] text-rose-400 hover:text-rose-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
            <span>Novo Levantamento</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS - Padronizado com MetricCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Depositado"
          value={formatCurrency(cashflow.totalDeposits, currency, numberFormat)}
          subtext="Capital introduzido em bancas"
          icon={ArrowDownLeft}
          iconColorClass="text-emerald-400"
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
        />

        <MetricCard
          title="Total Levantado"
          value={formatCurrency(cashflow.totalWithdrawals, currency, numberFormat)}
          subtext="Lucros/Capital retirados"
          icon={ArrowUpRight}
          iconColorClass="text-rose-400"
          iconBgClass="bg-rose-500/10 border-rose-500/20"
        />

        <MetricCard
          title="Cashflow Líquido"
          value={`${cashflow.netCashflow > 0 ? '+' : ''}${formatCurrency(cashflow.netCashflow, currency, numberFormat)}`}
          subtext={cashflow.netCashflow >= 0 ? 'Retorno positivo acumulado' : 'Capital investido nas casas'}
          icon={ArrowDownUp}
          iconColorClass={cashflow.netCashflow >= 0 ? 'text-emerald-400' : 'text-amber-400'}
          iconBgClass={cashflow.netCashflow >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}
          valueColorClass={cashflow.netCashflow >= 0 ? 'text-emerald-400' : 'text-amber-400'}
        />

        <MetricCard
          title="Total de Movimentos"
          value={cashflow.movementCount}
          subtext={`${cashflow.totalBonuses > 0 ? `+${formatCurrency(cashflow.totalBonuses, currency, numberFormat)} em bónus` : 'Histórico de transações'}`}
          icon={Gift}
          iconColorClass="text-purple-400"
          iconBgClass="bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* GLOBAL FILTERS */}
      <div className="bg-[#121721] border border-[#1E2638] p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Filtros de Registos:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Scope Filter */}
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

          {/* Movement Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="ALL">Todos os Tipos</option>
            <option value="DEPOSIT">Depósitos (+)</option>
            <option value="WITHDRAWAL">Levantamentos (-)</option>
            <option value="BONUS">Bónus / Freebets (+)</option>
            <option value="ADJUSTMENT">Ajustes Manuais</option>
          </select>
        </div>
      </div>

      {/* MOVEMENTS DATA TABLE */}
      <div className="bg-[#121721] border border-[#1E2638] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1E2638] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Histórico de Transações de Banca</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Lista cronológica de entradas e saídas de capital com atualização imediata de saldos.
            </p>
          </div>
          <span className="text-xs bg-[#0B0E14] border border-[#1E2638] text-gray-400 px-3 py-1 rounded-lg">
            {filteredMovements.length} movimentos encontrados
          </span>
        </div>

        {filteredMovements.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            Nenhum movimento registado para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E2638] bg-[#0B0E14]/50 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Banca</th>
                  <th className="py-3.5 px-4">Tipo de Movimento</th>
                  <th className="py-3.5 px-4 text-right">Valor (€)</th>
                  <th className="py-3.5 px-4">Método</th>
                  <th className="py-3.5 px-4">Notas / Observações</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638] text-xs">
                {filteredMovements.map((mov) => {
                  const bName = bankrolls.find((b) => b.id === mov.bankroll_id)?.name || 'Banca';
                  const dateFormatted = new Date(mov.created_at).toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });

                  return (
                    <tr key={mov.id} className="hover:bg-[#1A212E]/50 transition-colors">
                      <td className="py-3.5 px-4 text-gray-300 font-mono text-[11px]">
                        {dateFormatted}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{bName}</td>
                      <td className="py-3.5 px-4">
                        {mov.type === 'DEPOSIT' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowDownLeft className="w-3 h-3" /> Depósito
                          </span>
                        )}
                        {mov.type === 'WITHDRAWAL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ArrowUpRight className="w-3 h-3" /> Levantamento
                          </span>
                        )}
                        {mov.type === 'BONUS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Gift className="w-3 h-3" /> Bónus
                          </span>
                        )}
                        {mov.type === 'ADJUSTMENT' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Sliders className="w-3 h-3" /> Ajuste Manual
                          </span>
                        )}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold text-sm ${
                          mov.type === 'WITHDRAWAL'
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {mov.type === 'WITHDRAWAL' ? '-' : '+'}
                        {formatCurrency(mov.amount, currency, numberFormat)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        {mov.payment_method || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 italic max-w-xs truncate">
                        {mov.notes || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => deleteMovement(mov.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-[#1E2638] rounded-lg transition-colors"
                          title="Eliminar movimento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FOR ADDING MOVEMENTS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121721] border border-[#1E2638] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4 text-emerald-400" />
                {modalType === 'DEPOSIT' && 'Registar Novo Depósito'}
                {modalType === 'WITHDRAWAL' && 'Registar Novo Levantamento'}
                {modalType === 'BONUS' && 'Registar Bónus / Oferta'}
                {modalType === 'ADJUSTMENT' && 'Registar Ajuste Manual'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMovement} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Tipo de Movimento:</label>
                <select
                  value={modalType}
                  onChange={(e) => setModalType(e.target.value as MovementType)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="DEPOSIT">Depósito (+ Entradas de Capital)</option>
                  <option value="WITHDRAWAL">Levantamento (- Saídas de Capital)</option>
                  <option value="BONUS">Bónus / Freebet (+ Ofertas)</option>
                  <option value="ADJUSTMENT">Ajuste de Saldo (+/- Correção)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Banca Afetada:</label>
                <select
                  value={selectedBankrollId}
                  onChange={(e) => setSelectedBankrollId(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  {bankrolls.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Saldo: {formatCurrency(b.current_balance, currency, numberFormat)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Valor (€):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Ex: 250.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Método de Pagamento:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Notas / Observações:</label>
                <textarea
                  rows={2}
                  placeholder="Observações opcionais sobre o depósito/levantamento..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E2638]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#0B0E14] text-gray-300 hover:text-white rounded-xl font-semibold border border-[#1E2638]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-gray-950 font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Confirmar Movimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementsView;
