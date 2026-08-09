import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'pt' | 'en' | 'es';
export type Theme = 'dark' | 'light' | 'system';
export type Currency = 'EUR' | 'USD' | 'GBP' | 'BRL';
export type OddsFormat = 'decimal' | 'fractional' | 'american';

export interface NumberFormatConfig {
  preset: 'pt-PT' | 'en-US' | 'de-DE' | 'custom';
  decimalSeparator: ',' | '.';
  thousandsSeparator: '.' | ',' | ' ' | '';
}

export interface SettingsState {
  language: Language;
  theme: Theme;
  currency: Currency;
  oddsFormat: OddsFormat;
  numberFormat: NumberFormatConfig;
  defaultUnitPercent: number;

  // Actions
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: Currency) => void;
  setOddsFormat: (format: OddsFormat) => void;
  setNumberFormatPreset: (preset: 'pt-PT' | 'en-US' | 'de-DE' | 'custom') => void;
  setCustomNumberSeparators: (decimal: ',' | '.', thousands: '.' | ',' | ' ' | '') => void;
  setDefaultUnitPercent: (percent: number) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  language: 'pt' as Language,
  theme: 'dark' as Theme,
  currency: 'EUR' as Currency,
  oddsFormat: 'decimal' as OddsFormat,
  numberFormat: {
    preset: 'pt-PT' as const,
    decimalSeparator: ',' as const,
    thousandsSeparator: '.' as const,
  },
  defaultUnitPercent: 1.0,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setLanguage: (language: Language) => set({ language }),

      setTheme: (theme: Theme) => set({ theme }),

      setCurrency: (currency: Currency) => set({ currency }),

      setOddsFormat: (oddsFormat: OddsFormat) => set({ oddsFormat }),

      setNumberFormatPreset: (preset) => {
        let decimalSeparator: ',' | '.' = ',';
        let thousandsSeparator: '.' | ',' | ' ' | '' = '.';

        if (preset === 'en-US') {
          decimalSeparator = '.';
          thousandsSeparator = ',';
        } else if (preset === 'de-DE') {
          decimalSeparator = ',';
          thousandsSeparator = ' ';
        } else if (preset === 'pt-PT') {
          decimalSeparator = ',';
          thousandsSeparator = '.';
        }

        set(() => ({
          numberFormat: {
            preset,
            decimalSeparator,
            thousandsSeparator,
          },
        }));
      },

      setCustomNumberSeparators: (decimalSeparator, thousandsSeparator) => {
        set(() => ({
          numberFormat: {
            preset: 'custom',
            decimalSeparator,
            thousandsSeparator,
          },
        }));
      },

      setDefaultUnitPercent: (defaultUnitPercent) => set({ defaultUnitPercent }),

      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'cornerflag_user_settings',
    }
  )
);
