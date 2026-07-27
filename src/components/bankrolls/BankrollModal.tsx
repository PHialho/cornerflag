import React, { useState, useEffect } from 'react';
import { X, Wallet, DollarSign, Percent, FileText, CheckCircle2 } from 'lucide-react';
import type { Bankroll } from '../../types';

interface BankrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    initialBalance: number;
    currentBalance?: number;
    currency: string;
    targetUnitPercent: number;
    description: string;
  }) => Promise<void>;
  editingBankroll?: Bankroll | null;
}

export const BankrollModal: React.FC<BankrollModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingBankroll,
}) => {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [initialBalance, setInitialBalance] = useState<number | ''>(1000);
  const [currentBalance, setCurrentBalance] = useState<number | ''>(1000);
  const [targetUnitPercent, setTargetUnitPercent] = useState<number | ''>(1);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingBankroll) {
      setName(editingBankroll.name);
      setCurrency(editingBankroll.currency || 'EUR');
      setInitialBalance(editingBankroll.initial_balance);
      setCurrentBalance(editingBankroll.current_balance);
      setTargetUnitPercent(editingBankroll.target_unit_percent ?? 1);
      setDescription(editingBankroll.description || '');
    } else {
      setName('');
      setCurrency('EUR');
      setInitialBalance(1000);
      setCurrentBalance(1000);
      setTargetUnitPercent(1);
      setDescription('');
    }
    setErrorMsg('');
  }, [editingBankroll, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, insira o nome da banca.');
      return;
    }

    const initBalNum = Number(initialBalance);
    if (isNaN(initBalNum) || initBalNum <= 0) {
      setErrorMsg('O saldo inicial deve ser um número superior a 0.');
      return;
    }

    const unitPercentNum = Number(targetUnitPercent);
    if (isNaN(unitPercentNum) || unitPercentNum <= 0 || unitPercentNum > 100) {
      setErrorMsg('A % por unidade deve situar-se entre 0.1% e 100%.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        initialBalance: initBalNum,
        currentBalance: editingBankroll ? Number(currentBalance) : undefined,
        currency,
        targetUnitPercent: unitPercentNum,
        description: description.trim(),
      });
      onClose();
    } catch {
      setErrorMsg('Ocorreu um erro ao guardar a banca.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121721] border border-[#1E2638] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#1E2638] flex items-center justify-between bg-[#161C28]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {editingBankroll ? 'Editar Banca' : 'Criar Nova Banca'}
              </h3>
              <p className="text-xs text-gray-400">
                {editingBankroll
                  ? 'Atualize os detalhes e saldo da sua banca.'
                  : 'Configure uma nova banca para gerir a sua carteira.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Nome da Banca */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1.5">Nome da Banca *</label>
            <input
              type="text"
              placeholder="Ex: Banca Principal, Pinnacle, Bet365..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Saldo Inicial */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">Saldo Inicial *</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="1000"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Moeda */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">Moeda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BRL">BRL (R$)</option>
              </select>
            </div>
          </div>

          {/* Saldo Atual (Apenas em Edição) */}
          {editingBankroll && (
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">Saldo Atual Recalibrado (€)</label>
              <input
                type="number"
                step="0.01"
                placeholder="1000"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Permite recalibrar o saldo atual caso tenhas efetuado um depósito ou levantamento manual.
              </p>
            </div>
          )}

          {/* Unidade Padrão (%) */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1.5">Unidade Padrão de Aposta (% da Banca)</label>
            <div className="relative">
              <Percent className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                placeholder="1"
                value={targetUnitPercent}
                onChange={(e) => setTargetUnitPercent(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Normalmente 1% (conservador), 2% (moderado) ou 3% (agressivo).
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1.5">Descrição / Anotações (Opcional)</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <textarea
                rows={2}
                placeholder="Ex: Banca dedicada a ligas principais com gestão Kelly fracionada..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1E2638]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-[#0B0E14] border border-[#1E2638] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-gray-950 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'A guardar...' : editingBankroll ? 'Guardar Alterações' : 'Criar Banca'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
