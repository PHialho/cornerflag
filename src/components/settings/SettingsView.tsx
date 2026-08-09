import React, { useState } from 'react';
import {
  Globe,
  Palette,
  Settings,
  SlidersHorizontal,
  UserCheck,
  Check,
  Sparkles,
  Download,
  RotateCcw,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  DollarSign,
  Euro,
  PoundSterling,
  Percent,
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { Language, Currency, OddsFormat } from '../../store/useSettingsStore';
import { getTranslation } from '../../lib/i18n';
import { formatCurrency, formatNumber, formatOdds } from '../../lib/formatters';
import { useAuthStore } from '../../store/useAuthStore';
import { useCornerFlagStore } from '../../store/useCornerFlagStore';

export const SettingsView: React.FC = () => {
  const {
    language,
    theme,
    currency,
    oddsFormat,
    numberFormat,
    defaultUnitPercent,
    setLanguage,
    setTheme,
    setCurrency,
    setOddsFormat,
    setNumberFormatPreset,
    setCustomNumberSeparators,
    setDefaultUnitPercent,
    resetSettings,
  } = useSettingsStore();

  const { user } = useAuthStore();
  const { bankrolls, bets } = useCornerFlagStore();

  const t = getTranslation(language);
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'appearance' | 'betting' | 'account'>('general');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handlePresetChange = (preset: 'pt-PT' | 'en-US' | 'de-DE') => {
    setNumberFormatPreset(preset);
    showNotification(t.savedNotification);
  };

  const handleExportData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      user: { email: user?.email, id: user?.id },
      settings: { language, theme, currency, oddsFormat, numberFormat, defaultUnitPercent },
      bankrollsCount: bankrolls.length,
      betsCount: bets.length,
      bankrolls,
      bets,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cornerflag_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification(language === 'pt' ? 'Ficheiro JSON descarregado com sucesso!' : 'JSON file exported successfully!');
  };

  const sampleAmount = 145892.75;
  const sampleOdds = 2.25;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-emerald-400" /> {t.settingsTitle}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{t.settingsSubtitle}</p>
        </div>

        {notification && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#1E2638] pb-4">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'general'
              ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20'
              : 'bg-[#121721] text-gray-400 hover:text-white border border-[#1E2638]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{t.tabGeneral}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('appearance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'appearance'
              ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20'
              : 'bg-[#121721] text-gray-400 hover:text-white border border-[#1E2638]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{t.tabAppearance}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('betting')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'betting'
              ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20'
              : 'bg-[#121721] text-gray-400 hover:text-white border border-[#1E2638]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.tabBetting}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('account')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'account'
              ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20'
              : 'bg-[#121721] text-gray-400 hover:text-white border border-[#1E2638]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.tabAccount}</span>
        </button>
      </div>

      {/* TAB 1: GERAL & IDIOMA */}
      {activeSubTab === 'general' && (
        <div className="space-y-8">
          {/* Platform Language */}
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                {t.languageSection}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{t.languageDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { code: 'pt', label: 'Português', flag: '🇵🇹' },
                { code: 'en', label: 'English', flag: '🇬🇧' },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code as Language);
                    showNotification(t.savedNotification);
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    language === item.code
                      ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                      : 'bg-[#0B0E14] border-[#1E2638] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.flag}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {language === item.code && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-gray-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Regional Decimal & Thousands Separators */}
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                {t.numberFormatSection}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{t.numberFormatDesc}</p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handlePresetChange('pt-PT')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                  numberFormat.preset === 'pt-PT'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-[#0B0E14] border-[#1E2638] text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Padrão Europeu</span>
                  {numberFormat.preset === 'pt-PT' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-sm font-black text-white">1.234,56 €</p>
                <p className="text-[11px] text-gray-400">Vírgula decimal (,), Ponto milhar (.)</p>
              </button>

              <button
                onClick={() => handlePresetChange('en-US')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                  numberFormat.preset === 'en-US'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-[#0B0E14] border-[#1E2638] text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">Padrão Anglo-Saxónico</span>
                  {numberFormat.preset === 'en-US' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-sm font-black text-white">1,234.56 $</p>
                <p className="text-[11px] text-gray-400">Ponto decimal (.), Vírgula milhar (,)</p>
              </button>

              <button
                onClick={() => handlePresetChange('de-DE')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                  numberFormat.preset === 'de-DE'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-[#0B0E14] border-[#1E2638] text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Padrão com Espaço</span>
                  {numberFormat.preset === 'de-DE' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-sm font-black text-white">1 234,56 €</p>
                <p className="text-[11px] text-gray-400">Vírgula decimal (,), Espaço milhar ( )</p>
              </button>
            </div>

            {/* Custom Separator Selectors */}
            <div className="pt-4 border-t border-[#1E2638] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-2">
                  {t.decimalSeparatorLabel}
                </label>
                <select
                  value={numberFormat.decimalSeparator}
                  onChange={(e) => {
                    setCustomNumberSeparators(
                      e.target.value as ',' | '.',
                      numberFormat.thousandsSeparator
                    );
                    showNotification(t.savedNotification);
                  }}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value=",">Vírgula ( , )</option>
                  <option value=".">Ponto ( . )</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-2">
                  {t.thousandsSeparatorLabel}
                </label>
                <select
                  value={numberFormat.thousandsSeparator}
                  onChange={(e) => {
                    setCustomNumberSeparators(
                      numberFormat.decimalSeparator,
                      e.target.value as '.' | ',' | ' ' | ''
                    );
                    showNotification(t.savedNotification);
                  }}
                  className="w-full bg-[#0B0E14] border border-[#1E2638] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value=".">Ponto ( . )</option>
                  <option value=",">Vírgula ( , )</option>
                  <option value=" ">Espaço ( )</option>
                  <option value="">Nenhum</option>
                </select>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="bg-[#0B0E14] border border-emerald-500/30 p-5 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                {t.previewTitle}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div>
                  <p className="text-xs text-gray-400">Valor Monetário Formatado:</p>
                  <p className="text-2xl font-black text-emerald-400">
                    {formatCurrency(sampleAmount, currency, {
                      decimalSeparator: numberFormat.decimalSeparator,
                      thousandsSeparator: numberFormat.thousandsSeparator,
                    })}
                  </p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-[#1E2638] pt-2 sm:pt-0 sm:pl-6">
                  <p className="text-xs text-gray-400">Número Padrão (Sem Moeda):</p>
                  <p className="text-xl font-bold text-white">
                    {formatNumber(sampleAmount, {
                      decimals: 2,
                      decimalSeparator: numberFormat.decimalSeparator,
                      thousandsSeparator: numberFormat.thousandsSeparator,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APARÊNCIA & TEMA */}
      {activeSubTab === 'appearance' && (
        <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-400" />
              {t.themeSection}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{t.themeDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dark Theme Card */}
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                showNotification(t.savedNotification);
              }}
              className={`p-5 rounded-2xl border text-left transition-all space-y-4 relative theme-preview-dark ${
                theme === 'dark'
                  ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-xl'
                  : 'hover:border-gray-500 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 preview-emerald-text">
                  <Moon className="w-5 h-5" />
                  <span className="font-bold text-sm preview-title">{t.themeDark}</span>
                </div>
                {theme === 'dark' && <Check className="w-5 h-5 preview-emerald-text" />}
              </div>
              <p className="text-xs preview-desc leading-relaxed">{t.themeDarkDesc}</p>

              {/* Authentic Dark Mock Visual */}
              <div className="h-20 preview-inner-box rounded-xl p-3 flex flex-col justify-between border">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-2 rounded bg-emerald-500" />
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                </div>
                <div className="w-full h-8 rounded-lg bg-[#0B0E14] border border-[#1E2638]" />
              </div>
            </button>

            {/* Light Theme Card */}
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                showNotification(t.savedNotification);
              }}
              className={`p-5 rounded-2xl border text-left transition-all space-y-4 relative theme-preview-light ${
                theme === 'light'
                  ? 'ring-2 ring-orange-500 border-orange-500 shadow-xl'
                  : 'hover:border-slate-400 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 preview-orange-text">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-sm preview-title">{t.themeLight}</span>
                </div>
                {theme === 'light' && <Check className="w-5 h-5 preview-orange-text" />}
              </div>
              <p className="text-xs preview-desc leading-relaxed">{t.themeLightDesc}</p>

              {/* Authentic Light Mock Visual */}
              <div className="h-20 preview-inner-box rounded-xl p-3 flex flex-col justify-between border">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-2 rounded bg-orange-500" />
                  <div className="w-4 h-4 rounded-full bg-orange-500/20 border border-orange-500/30" />
                </div>
                <div className="w-full h-8 rounded-lg bg-white border border-slate-200" />
              </div>
            </button>

            {/* System Theme Card */}
            <button
              type="button"
              onClick={() => {
                setTheme('system');
                showNotification(t.savedNotification);
              }}
              className={`p-5 rounded-2xl border text-left transition-all space-y-4 relative theme-preview-system ${
                theme === 'system'
                  ? 'ring-2 ring-blue-500 border-blue-500 shadow-xl'
                  : 'hover:border-slate-500 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                  <Laptop className="w-5 h-5" />
                  <span className="font-bold text-sm system-title">{t.themeSystem}</span>
                </div>
                {theme === 'system' && <Check className="w-5 h-5 text-blue-400" />}
              </div>
              <p className="text-xs system-desc leading-relaxed">{t.themeSystemDesc}</p>

              {/* Split Dual Visual */}
              <div className="h-20 rounded-xl border border-slate-600 overflow-hidden flex">
                <div className="w-1/2 p-2 flex flex-col justify-between border-r border-slate-700 split-dark-half">
                  <div className="w-8 h-1.5 rounded split-dark-accent" />
                  <div className="w-full h-5 rounded border split-dark-box" />
                </div>
                <div className="w-1/2 p-2 flex flex-col justify-between split-light-half">
                  <div className="w-8 h-1.5 rounded split-light-accent" />
                  <div className="w-full h-5 rounded border split-light-box" />
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PREFERÊNCIAS DE APOSTAS */}
      {activeSubTab === 'betting' && (
        <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              {t.bettingSection}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Odds Format */}
            <div className="bg-[#0B0E14] border border-[#1E2638] p-5 rounded-xl space-y-3">
              <label className="text-xs font-bold text-gray-300 block">{t.oddsFormatLabel}</label>
              <div className="space-y-2">
                {[
                  { id: 'decimal', label: t.oddsFormatDecimal },
                  { id: 'fractional', label: t.oddsFormatFractional },
                  { id: 'american', label: t.oddsFormatAmerican },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOddsFormat(item.id as OddsFormat);
                      showNotification(t.savedNotification);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      oddsFormat === item.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'border-[#1E2638] text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-2 text-center text-xs text-gray-400 border-t border-[#1E2638]">
                Exemplo: <span className="font-bold text-white">{formatOdds(sampleOdds, oddsFormat)}</span>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="bg-[#0B0E14] border border-[#1E2638] p-5 rounded-xl space-y-3">
              <label className="text-xs font-bold text-gray-300 block">{t.currencyLabel}</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'EUR', symbol: '€', icon: Euro },
                  { id: 'USD', symbol: '$', icon: DollarSign },
                  { id: 'GBP', symbol: '£', icon: PoundSterling },
                  { id: 'BRL', symbol: 'R$', icon: DollarSign },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrency(item.id as Currency);
                        showNotification(t.savedNotification);
                      }}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg text-xs font-bold border transition-all ${
                        currency === item.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'border-[#1E2638] text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Default Unit Percent */}
            <div className="bg-[#0B0E14] border border-[#1E2638] p-5 rounded-xl space-y-3">
              <label className="text-xs font-bold text-gray-300 block">{t.defaultUnitLabel}</label>
              <p className="text-[11px] text-gray-400">{t.defaultUnitDesc}</p>

              <div className="relative pt-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={defaultUnitPercent}
                  onChange={(e) => {
                    setDefaultUnitPercent(parseFloat(e.target.value) || 1.0);
                    showNotification(t.savedNotification);
                  }}
                  className="w-full bg-[#121721] border border-[#1E2638] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Percent className="w-4 h-4 text-gray-500 absolute right-3.5 top-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTA & DADOS */}
      {activeSubTab === 'account' && (
        <div className="space-y-6">
          {/* User Details */}
          <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              {t.accountSection}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0B0E14] border border-[#1E2638] p-4 rounded-xl text-xs">
              <div>
                <p className="text-gray-400 font-medium">Utilizador Autenticado:</p>
                <p className="font-bold text-white text-sm mt-0.5">
                  {user?.user_metadata?.full_name || 'Apostador Pro'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-medium">E-mail Registado:</p>
                <p className="font-bold text-emerald-400 text-sm mt-0.5">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Backup & Reset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  {t.exportData}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{t.exportDesc}</p>
              </div>

              <button
                onClick={handleExportData}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Download className="w-4 h-4" /> Descarregar Backup JSON
              </button>
            </div>

            <div className="bg-[#121721] border border-[#1E2638] p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  {t.resetDefaults}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{t.resetDesc}</p>
              </div>

              <button
                onClick={() => {
                  resetSettings();
                  showNotification(t.resetSuccess);
                }}
                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
              >
                <RotateCcw className="w-4 h-4" /> Restaurar Padrões
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
