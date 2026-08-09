import React, { useEffect, useState } from 'react';
import {
  CornerDownRight,
  Activity,
  LogIn,
  UserCheck,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Zap,
  BarChart3,
  Calculator as CalcIcon,
  ShieldCheck,
  Percent,
  Menu,
  Wallet,
} from 'lucide-react';
import { useCornerFlagStore } from './store/useCornerFlagStore';
import { useAuthStore } from './store/useAuthStore';
import { useSettingsStore } from './store/useSettingsStore';
import { Sidebar, type NavTab } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { BankrollsView } from './components/bankrolls/BankrollsView';
import { BetsView } from './components/bets/BetsView';
import { StrategiesView } from './components/strategies/StrategiesView';
import { ReportsView } from './components/reports/ReportsView';
import { CalculatorView } from './components/calculator/CalculatorView';
import { SettingsView } from './components/settings/SettingsView';


export function App() {
  const {
    bankrolls,
    activeBankrollId,
    isLoading: isStoreLoading,
    loadInitialData,
  } = useCornerFlagStore();

  const { user, isLoading: isAuthLoading, initializeAuth, signIn, signUp } = useAuthStore();
  const { theme } = useSettingsStore();

  // Navigation & Layout state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Apply Theme Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Auth Form State for Landing Page
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initializeAuth();
    loadInitialData();
  }, [initializeAuth, loadInitialData]);

  const handleLandingAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    setIsSubmitting(true);

    if (authMode === 'signUp') {
      if (!fullName.trim()) {
        setAuthFeedback({ type: 'error', text: 'Por favor, insira o seu nome completo.' });
        setIsSubmitting(false);
        return;
      }
      const res = await signUp(email, password, fullName);
      if (res.success) {
        setAuthFeedback({ type: 'success', text: res.message || 'Conta criada com sucesso!' });
      } else {
        setAuthFeedback({ type: 'error', text: res.message || 'Erro ao criar conta.' });
      }
    } else {
      const res = await signIn(email, password);
      if (res.success) {
        setAuthFeedback({ type: 'success', text: 'Autenticado com sucesso!' });
      } else {
        setAuthFeedback({ type: 'error', text: res.message || 'Credenciais inválidas.' });
      }
    }
    setIsSubmitting(false);
  };

  const activeBankroll = bankrolls.find((b) => b.id === activeBankrollId);

  if (isStoreLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-gray-200 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Activity className="animate-spin text-emerald-400" />
          <span className="font-semibold text-lg">A carregar Corner Flag Analytics...</span>
        </div>
      </div>
    );
  }

  // UNAUTHENTICATED PAGE: LANDING / SIGN IN HOMEPAGE
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-gray-100 font-sans flex flex-col justify-between">
        {/* Header */}
        <header className="border-b border-[#1E2638] bg-[#121721]/90 backdrop-blur px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-500/30">
              <CornerDownRight className="text-emerald-400 w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                CORNER FLAG <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">Pro v0.009</span>
              </h1>

              <p className="text-xs text-gray-400">Plataforma Profissional de Gestão de Banca & Precificação (+EV)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthMode('signIn');
                setAuthFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                authMode === 'signIn'
                  ? 'bg-emerald-500 text-gray-950 font-bold'
                  : 'bg-[#121721] text-gray-300 border border-[#1E2638] hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setAuthMode('signUp');
                setAuthFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                authMode === 'signUp'
                  ? 'bg-emerald-500 text-gray-950 font-bold'
                  : 'bg-[#121721] text-gray-300 border border-[#1E2638] hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>
        </header>

        {/* Main Content Hero */}
        <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">
              <Zap className="w-3.5 h-3.5" /> Gestão de Banca & Risco Avançada
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Tome Decisões com <span className="text-emerald-400">Precisão Matemática</span> nas Suas Apostas.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
              O Corner Flag Analytics fornece ferramentas quantitativas para calcular o Valor Esperado (+EV), 
              otimizar stakes pelo Critério de Kelly Fracionado e monitorizar o seu ROI/Yield real na cloud com Supabase Auth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-[#121721] border border-[#1E2638] p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Curva de Evolução</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Gráficos de crescimento de banca e P&L acumulado em tempo real.</p>
                </div>
              </div>

              <div className="bg-[#121721] border border-[#1E2638] p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <CalcIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Calculadora +EV & Kelly</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Precificação exata de odd justa e dimensionamento inteligente de banca.</p>
                </div>
              </div>

              <div className="bg-[#121721] border border-[#1E2638] p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sincronização Cloud</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Dados protegidos no Supabase com Row Level Security (RLS).</p>
                </div>
              </div>

              <div className="bg-[#121721] border border-[#1E2638] p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Métricas de Rendimento</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Cálculo de ROI %, Yield %, Win Rate e liquidação minuciosa de apostas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Sign In / Sign Up Form */}
          <div className="lg:col-span-5 bg-[#121721] border border-[#1E2638] p-8 rounded-3xl shadow-2xl relative">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {authMode === 'signIn' ? 'Aceder à Sua Conta' : 'Criar Nova Conta'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {authMode === 'signIn'
                  ? 'Insira os seus dados de acesso para entrar na plataforma.'
                  : 'Registe-se gratuitamente para começar a gerir a sua banca.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-[#0B0E14] p-1 rounded-xl border border-[#1E2638] mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signIn');
                  setAuthFeedback(null);
                }}
                className={`py-2 rounded-lg transition-colors ${
                  authMode === 'signIn'
                    ? 'bg-[#121721] text-emerald-400 border border-[#1E2638]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signUp');
                  setAuthFeedback(null);
                }}
                className={`py-2 rounded-lg transition-colors ${
                  authMode === 'signUp'
                    ? 'bg-[#121721] text-emerald-400 border border-[#1E2638]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Feedback Notifications */}
            {authFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 mb-5 ${
                  authFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {authFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{authFeedback.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLandingAuthSubmit} className="space-y-4 text-xs">
              {authMode === 'signUp' && (
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Nome Completo:</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Ex: Paulo Fialho"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-10 pr-3 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-gray-400 block mb-1 font-medium">E-mail:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-10 pr-3 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-medium">Palavra-passe:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl pl-10 pr-3 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold text-gray-950 py-3.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>A autenticar...</span>
                ) : authMode === 'signIn' ? (
                  <>
                    <LogIn className="w-4 h-4" /> Entrar na Plataforma
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" /> Criar Conta Gratuita
                  </>
                )}
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1E2638] text-center text-xs text-gray-500 py-6">
          Corner Flag Pro v0.009 — Gestão de Banca, Risco & Precificação (+EV) © {new Date().getFullYear()}
        </footer>

      </div>
    );
  }

  // AUTHENTICATED LAYOUT WITH SIDEBAR
  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden border-b border-[#1E2638] bg-[#121721] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-white rounded-lg bg-[#0B0E14] border border-[#1E2638]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm text-white flex items-center gap-1">
              CORNER FLAG <span className="text-[10px] text-emerald-400 font-semibold">PRO</span>
            </span>
          </div>

          <div className="text-xs bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white truncate max-w-[120px]">
              {activeBankroll?.name}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'bets' && <BetsView />}
          {activeTab === 'bankrolls' && <BankrollsView />}
          {activeTab === 'strategies' && <StrategiesView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'calculator' && <CalculatorView />}
          {activeTab === 'settings' && <SettingsView />}

        </main>
      </div>
    </div>
  );
}

export default App;
