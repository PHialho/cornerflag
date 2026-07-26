import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Wallet,
  PieChart,
  Percent,
  PlusCircle,
  Calculator,
  CornerDownRight,
  ShieldAlert,
  Activity,
  LogIn,
  LogOut,
  UserCheck,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useCornerFlagStore } from './store/useCornerFlagStore';
import { useAuthStore } from './store/useAuthStore';
import { calculateROI, calculateEV, calculateKellyStake, type BetResult } from './lib/math/calculator';

export function App() {
  const {
    bankrolls,
    activeBankrollId,
    bets,
    isLoading: isStoreLoading,
    loadInitialData,
    addBet,
  } = useCornerFlagStore();

  const { user, isLoading: isAuthLoading, signIn, signUp, signOut } = useAuthStore();

  // Auth Form State for Landing Page
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [match, setMatch] = useState('');
  const [league, setLeague] = useState('');
  const [selection, setSelection] = useState('');
  const [odd, setOdd] = useState<number>(1.90);
  const [stake, setStake] = useState<number>(50);
  const [result, setResult] = useState<BetResult | 'PENDING'>('WIN');

  // Calculator State
  const [calcProbability, setCalcProbability] = useState<number>(58);
  const [calcOdd, setCalcOdd] = useState<number>(1.95);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

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

  const totalStaked = bets.reduce((acc, bet) => acc + (bet.result !== 'PENDING' ? bet.stake : 0), 0);
  const totalProfit = bets.reduce((acc, bet) => acc + bet.profit, 0);
  const totalWon = bets.filter((b) => b.result === 'WIN' || b.result === 'HALF_WIN').length;
  const totalSettled = bets.filter((b) => b.result !== 'PENDING').length;
  const winRate = totalSettled > 0 ? ((totalWon / totalSettled) * 100).toFixed(1) : '0.0';
  const overallROI = calculateROI(totalProfit, totalStaked);

  // Growth chart data
  let cumulative = activeBankroll ? activeBankroll.initial_balance : 1000;
  const chartData = [...bets]
    .reverse()
    .filter((b) => b.result !== 'PENDING')
    .map((b, idx) => {
      cumulative += b.profit;
      return {
        step: `Aposta #${idx + 1}`,
        balance: cumulative,
        profit: b.profit,
      };
    });

  const handleCreateBet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBankrollId || !match || stake <= 0 || odd <= 1.0) return;

    await addBet({
      bankroll_id: activeBankrollId,
      match,
      league: league || 'Geral',
      market: 'OVER_UNDER',
      selection: selection || 'Over 2.5 Gols',
      odd,
      stake,
      result,
    });

    setMatch('');
    setSelection('');
  };

  const calculatedEV = calculateEV(calcOdd, calcProbability / 100);
  const calculatedKelly = calculateKellyStake(calcOdd, calcProbability / 100, 0.25);

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
                CORNER FLAG <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">Pro v0.003</span>
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
                  <Calculator className="w-5 h-5" />
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
          Corner Flag Pro v0.003 — Gestão de Banca, Risco & Precificação (+EV) © {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  // AUTHENTICATED USER: FULL DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 font-sans pb-12">
      {/* Top Navbar */}
      <header className="border-b border-[#1E2638] bg-[#121721]/90 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
            <CornerDownRight className="text-emerald-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              CORNER FLAG <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">Pro v0.003</span>
            </h1>
            <p className="text-xs text-gray-400">Gestão de Banca, Risco & Precificação (+EV)</p>
          </div>
        </div>

        {/* Bankroll & Auth Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 rounded-lg text-sm">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-xs">Banca:</span>
            <span className="font-semibold text-white">{activeBankroll?.name}</span>
          </div>

          <div className="flex items-center gap-3 bg-[#0B0E14] border border-[#1E2638] pl-3 pr-2 py-1 rounded-xl text-xs">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-300 font-medium">{user.user_metadata?.full_name || user.email}</span>
            <button
              onClick={() => signOut()}
              title="Terminar Sessão"
              className="p-1.5 hover:bg-[#1E2638] text-gray-400 hover:text-rose-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* Metric Cards KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card 1: Saldo Atual */}
          <div className="bg-[#121721] border border-[#1E2638] p-5 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400">Saldo Atual da Banca</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  € {activeBankroll?.current_balance.toFixed(2)}
                </h3>
              </div>
              <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Inicial: € {activeBankroll?.initial_balance.toFixed(2)}
            </p>
          </div>

          {/* Card 2: Lucro / Prejuízo */}
          <div className="bg-[#121721] border border-[#1E2638] p-5 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400">Lucro / Prejuízo Total</p>
                <h3 className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalProfit >= 0 ? '+' : ''}€ {totalProfit.toFixed(2)}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl border ${totalProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                <TrendingUp className={`w-5 h-5 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Total Apostado: € {totalStaked.toFixed(2)}
            </p>
          </div>

          {/* Card 3: ROI % */}
          <div className="bg-[#121721] border border-[#1E2638] p-5 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400">ROI / Yield (%)</p>
                <h3 className={`text-2xl font-bold mt-1 ${overallROI >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(2)}%
                </h3>
              </div>
              <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Percent className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Retorno sobre o total investido
            </p>
          </div>

          {/* Card 4: Win Rate */}
          <div className="bg-[#121721] border border-[#1E2638] p-5 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400">Taxa de Acerto (Win Rate)</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {winRate}%
                </h3>
              </div>
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <PieChart className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {totalWon} ganhas de {totalSettled} apostas
            </p>
          </div>
        </div>

        {/* Middle Section: Chart & EV Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Evolução da Banca
            </h3>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                    <XAxis dataKey="step" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#1E2638', borderRadius: '12px', color: '#FFF' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 text-sm">
                <ShieldAlert className="w-8 h-8 mb-2 text-gray-600" />
                Sem histórico de apostas liquidadas para gerar gráfico.
              </div>
            )}
          </div>

          {/* Calculator +EV (1 Col) */}
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <h3 className="text-md font-semibold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" /> Calculadora +EV & Kelly
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Odd Oferecida:</label>
                <input
                  type="number"
                  step="0.01"
                  value={calcOdd}
                  onChange={(e) => setCalcOdd(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Probabilidade Estimada (%):</label>
                <input
                  type="number"
                  value={calcProbability}
                  onChange={(e) => setCalcProbability(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="pt-2 border-t border-[#1E2638] space-y-2">
                <div className="flex justify-between items-center bg-[#0B0E14] p-2.5 rounded-lg border border-[#1E2638]">
                  <span className="text-gray-400">Valor Esperado (+EV):</span>
                  <span className={`font-mono font-bold text-sm ${calculatedEV > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculatedEV > 0 ? '+' : ''}{calculatedEV}%
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#0B0E14] p-2.5 rounded-lg border border-[#1E2638]">
                  <span className="text-gray-400">Stake Kelly Recomendada (1/4):</span>
                  <span className="font-mono font-bold text-sm text-purple-400">
                    {calculatedKelly}% da Banca
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Register Bet & History Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bet Form (1 Col) */}
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Registo de Aposta
            </h3>
            <form onSubmit={handleCreateBet} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Jogo / Confronto:</label>
                <input
                  type="text"
                  placeholder="Ex: Real Madrid vs Barcelona"
                  value={match}
                  onChange={(e) => setMatch(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 block mb-1">Liga:</label>
                  <input
                    type="text"
                    placeholder="Ex: La Liga"
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Seleção / Mercado:</label>
                  <input
                    type="text"
                    placeholder="Ex: Over 2.5 Gols / Handicap"
                    value={selection}
                    onChange={(e) => setSelection(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 block mb-1">Odd:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={odd}
                    onChange={(e) => setOdd(parseFloat(e.target.value) || 1.0)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Stake (€):</label>
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Resultado:</label>
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value as BetResult | 'PENDING')}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-lg px-3 py-2 text-white"
                >
                  <option value="WIN">Ganha (Win)</option>
                  <option value="HALF_WIN">Meio Ganha (Half Win)</option>
                  <option value="VOID">Anulada (Void / Push)</option>
                  <option value="HALF_LOSS">Meio Perdida (Half Loss)</option>
                  <option value="LOSS">Perdida (Loss)</option>
                  <option value="PENDING">Pendente</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold text-gray-950 py-2.5 rounded-lg transition-colors text-xs"
              >
                Registar Aposta
              </button>
            </form>
          </div>

          {/* Bet History Table (2 Cols) */}
          <div className="lg:col-span-2 bg-[#121721] border border-[#1E2638] p-6 rounded-2xl">
            <h3 className="text-md font-semibold text-white mb-4">Histórico de Apostas Registadas</h3>
            {bets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#0B0E14] text-gray-400 border-b border-[#1E2638]">
                    <tr>
                      <th className="p-3">Jogo / Liga</th>
                      <th className="p-3">Mercado</th>
                      <th className="p-3">Odd</th>
                      <th className="p-3">Stake</th>
                      <th className="p-3">Resultado</th>
                      <th className="p-3 text-right">P&L (€)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2638]">
                    {bets.map((bet) => (
                      <tr key={bet.id} className="hover:bg-[#19202e] transition-colors">
                        <td className="p-3 font-medium text-white">
                          {bet.match}
                          <span className="block text-[10px] text-gray-500">{bet.league}</span>
                        </td>
                        <td className="p-3 text-gray-400">{bet.selection}</td>
                        <td className="p-3 font-mono">{bet.odd.toFixed(2)}</td>
                        <td className="p-3 font-mono">€ {bet.stake.toFixed(2)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
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
                            {bet.result}
                          </span>
                        </td>
                        <td className={`p-3 text-right font-mono font-bold ${bet.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {bet.profit >= 0 ? '+' : ''}€ {bet.profit.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 text-sm">
                Nenhuma aposta registrada ainda. Adicione a sua primeira aposta no formulário.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
