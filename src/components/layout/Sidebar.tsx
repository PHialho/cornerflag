import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Calculator,
  Wallet,
  Settings,
  LogOut,
  CornerDownRight,
  UserCheck,
  ChevronDown,
  X,
  BarChart3,
  ArrowDownUp,
  Target,
} from 'lucide-react';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { Currency } from '../../store/useSettingsStore';
import { getTranslation } from '../../lib/i18n';
import { formatCurrency } from '../../lib/formatters';

export type NavTab =
  | 'dashboard'
  | 'bets'
  | 'bankrolls'
  | 'movements'
  | 'strategies'
  | 'reports'
  | 'calculator'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile,
}) => {
  const { bankrolls, activeBankrollId, setActiveBankroll } = useCornerFlagStore();
  const { user, signOut } = useAuthStore();
  const { language, currency, numberFormat } = useSettingsStore();
  const t = getTranslation(language);

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'bets', label: t.bets, icon: Receipt },
    { id: 'bankrolls', label: t.bankrolls, icon: Wallet },
    { id: 'movements', label: t.movements, icon: ArrowDownUp },
    { id: 'strategies', label: t.strategies, icon: Target },
    { id: 'reports', label: t.reports, icon: BarChart3 },
    { id: 'calculator', label: t.calculator, icon: Calculator },
    { id: 'settings', label: t.settings, icon: Settings },
  ];



  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-[#121721] border-r border-[#1E2638] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="p-6 border-b border-[#1E2638] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <CornerDownRight className="text-emerald-400 w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  CORNER FLAG
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">
                    PRO
                  </span>
                </h1>
                <p className="text-[11px] text-gray-400">Gestão de Banca & Risco</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1E2638]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bankroll Switcher */}
          <div className="p-4 mx-3 my-4 bg-[#0B0E14] border border-[#1E2638] rounded-xl">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
              {t.activeBankroll}
            </label>
            <div className="relative">
              <select
                value={activeBankrollId || ''}
                onChange={(e) => setActiveBankroll(e.target.value)}
                className="w-full bg-[#121721] border border-[#1E2638] rounded-lg text-xs font-semibold text-white px-3 py-2 appearance-none focus:outline-none focus:border-emerald-500 transition-colors pr-8 cursor-pointer"
              >
                {bankrolls.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (
                    {formatCurrency(
                      b.current_balance,
                      (b.currency as Currency) || currency,
                      {
                        decimalSeparator: numberFormat.decimalSeparator,
                        thousandsSeparator: numberFormat.thousandsSeparator,
                      }
                    )}
                    )
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {t.navigation}
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A212E]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Footer */}
        <div className="p-4 border-t border-[#1E2638] space-y-3">
          <div className="flex items-center justify-between bg-[#0B0E14] border border-[#1E2638] p-3 rounded-xl">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.user_metadata?.full_name || user?.email || 'Apostador'}
                </p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              title={t.signOut}
              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-[#1E2638] rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
