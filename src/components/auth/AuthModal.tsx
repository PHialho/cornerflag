import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signIn' | 'signUp';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signIn' }: AuthModalProps) {
  const [mode, setMode] = useState<'signIn' | 'signUp'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { signIn, signUp, isLoading, clearError } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    clearError();

    if (mode === 'signUp') {
      if (!fullName.trim()) {
        setFeedback({ type: 'error', text: 'Por favor, insira o seu nome completo.' });
        return;
      }
      const result = await signUp(email, password, fullName);
      if (result.success) {
        setFeedback({ type: 'success', text: result.message || 'Conta criada com sucesso!' });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFeedback({ type: 'error', text: result.message || 'Erro ao criar conta.' });
      }
    } else {
      const result = await signIn(email, password);
      if (result.success) {
        setFeedback({ type: 'success', text: 'Autenticado com sucesso!' });
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setFeedback({ type: 'error', text: result.message || 'Credenciais inválidas.' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#121721] border border-[#1E2638] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
            {mode === 'signIn' ? (
              <LogIn className="w-6 h-6 text-emerald-400" />
            ) : (
              <UserPlus className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'signIn' ? 'Aceder ao Corner Flag' : 'Criar Nova Conta'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {mode === 'signIn'
              ? 'Introduza as suas credenciais para gerir as suas bancas.'
              : 'Registe-se para sincronizar bancas e calcular valor (+EV).'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-[#0B0E14] p-1 rounded-xl border border-[#1E2638] mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signIn');
              setFeedback(null);
            }}
            className={`py-2 rounded-lg transition-colors ${
              mode === 'signIn'
                ? 'bg-[#121721] text-emerald-400 border border-[#1E2638]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signUp');
              setFeedback(null);
            }}
            className={`py-2 rounded-lg transition-colors ${
              mode === 'signUp'
                ? 'bg-[#121721] text-emerald-400 border border-[#1E2638]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Feedback Messages */}
        {feedback && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 mb-4 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signUp' && (
            <div>
              <label className="text-gray-400 block mb-1 font-medium">Nome Completo:</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ex: Paulo Fialho"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-400 block mb-1 font-medium">Endereço de E-mail:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-medium">Palavra-passe:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold text-gray-950 py-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>A processar...</span>
            ) : mode === 'signIn' ? (
              <>
                <LogIn className="w-4 h-4" /> Entrar na Conta
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Finalizar Registo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
