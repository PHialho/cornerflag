import type { Language } from '../store/useSettingsStore';

export const translations = {
  pt: {
    // Navigation
    dashboard: 'Dashboard',
    bets: 'Apostas',
    bankrolls: 'Bancas',
    movements: 'Movimentos & Cashflow',
    strategies: 'Estratégias & Objetivos',
    reports: 'Relatórios',
    calculator: 'Calculadora +EV',
    settings: 'Configurações',
    activeBankroll: 'Banca Ativa',
    signOut: 'Terminar Sessão',
    navigation: 'Navegação',

    // Strategies & Goals
    strategiesTitle: 'Estratégias, Sugestões & Objetivos',
    strategiesSubtitle: 'Gestão de estratégias de apostas, sugestões inteligentes automatizadas, metas de recuperação de investimento e desafios de banca.',


    // Settings General
    settingsTitle: 'Configurações',
    settingsSubtitle: 'Personalize o idioma, separadores regionais de vírgula e ponto, temas visuais e preferências de gestão.',
    tabGeneral: 'Geral & Idioma',
    tabAppearance: 'Aparência & Tema',
    tabBetting: 'Preferências de Apostas',
    tabAccount: 'Conta & Dados',

    // Language & Region
    languageSection: 'Idioma da Plataforma',
    languageDesc: 'Selecione a língua para toda a interface do Corner Flag Analytics.',
    numberFormatSection: 'Definições Regionais de Números',
    numberFormatDesc: 'Escolha a convenção regional para os separadores de vírgula (,) e ponto (.) nos decimais e milhares.',
    decimalSeparatorLabel: 'Separador Decimal',
    thousandsSeparatorLabel: 'Separador de Milhares',
    presetEuropean: 'Europeu (1.234,56 € - Vírgula decimal, Ponto milhar)',
    presetAnglo: 'Anglo-saxónico (1,234.56 $ - Ponto decimal, Vírgula milhar)',
    presetSwiss: 'Espaçado (1 234,56 € - Vírgula decimal, Espaço milhar)',
    presetCustom: 'Personalizado',
    previewTitle: 'Exemplo de Previsão ao Vivo:',

    // Appearance & Theme
    themeSection: 'Modo de Apresentação Visual',
    themeDesc: 'Escolha o tema para a interface. O modo escuro foi otimizado para longas sessões de trading.',
    themeDark: 'Modo Escuro (Dark)',
    themeDarkDesc: 'Visual escuro de alto contraste profissional.',
    themeLight: 'Modo Claro (Light)',
    themeLightDesc: 'Interface nítida e luminosa para ambientes claros.',
    themeSystem: 'Modo Sistema',
    themeSystemDesc: 'Sincronizar automaticamente com o seu sistema operativo.',

    // Betting Preferences
    bettingSection: 'Parâmetros & Formato de Apostas',
    oddsFormatLabel: 'Formato de Odds',
    oddsFormatDecimal: 'Decimal (ex: 2.00)',
    oddsFormatFractional: 'Fracionário (ex: 1/1)',
    oddsFormatAmerican: 'Americano (ex: +100)',
    currencyLabel: 'Moeda Principal',
    defaultUnitLabel: 'Stake Padrão por Unidade (%)',
    defaultUnitDesc: 'Percentagem base da banca recomendada para cálculo de Kelly e stakes.',

    // Account & Data
    accountSection: 'Perfil & Gestão de Dados',
    exportData: 'Exportar Definições & Dados',
    exportDesc: 'Faça backup das suas preferências e registos em ficheiro JSON.',
    resetDefaults: 'Repor Definições Padrão',
    resetDesc: 'Restaurar todas as opções regionais e visuais de fábrica.',
    resetSuccess: 'Definições restauradas com sucesso!',

    // Actions & Badges
    saveChanges: 'Guardar Alterações',
    savedNotification: 'Definições guardadas automaticamente.',
  },

  en: {
    // Navigation
    dashboard: 'Dashboard',
    bets: 'Bets',
    bankrolls: 'Bankrolls',
    movements: 'Movements & Cashflow',
    strategies: 'Strategies & Goals',
    reports: 'Reports',
    calculator: 'EV+ Calculator',
    settings: 'Settings',
    activeBankroll: 'Active Bankroll',
    signOut: 'Sign Out',
    navigation: 'Navigation',

    // Strategies & Goals
    strategiesTitle: 'Strategies, Suggestions & Goals',
    strategiesSubtitle: 'Manage betting strategies, automated smart suggestions, investment recovery goals, and bankroll challenges.',


    // Settings General
    settingsTitle: 'System Settings',
    settingsSubtitle: 'Customize your language, regional decimal & thousands separator format, visual themes, and risk preferences.',
    tabGeneral: 'General & Language',
    tabAppearance: 'Appearance & Theme',
    tabBetting: 'Betting Preferences',
    tabAccount: 'Account & Data',

    // Language & Region
    languageSection: 'Platform Language',
    languageDesc: 'Select the language for the Corner Flag Analytics user interface.',
    numberFormatSection: 'Regional Number Formatting',
    numberFormatDesc: 'Choose the regional convention for decimal comma (,) and thousands dot (.) separators.',
    decimalSeparatorLabel: 'Decimal Separator',
    thousandsSeparatorLabel: 'Thousands Separator',
    presetEuropean: 'European (1.234,56 € - Decimal comma, Thousands dot)',
    presetAnglo: 'Anglo-Saxon (1,234.56 $ - Decimal dot, Thousands comma)',
    presetSwiss: 'Space-Separated (1 234,56 € - Decimal comma, Thousands space)',
    presetCustom: 'Custom',
    previewTitle: 'Live Preview Example:',

    // Appearance & Theme
    themeSection: 'Visual Presentation Theme',
    themeDesc: 'Choose your preferred theme. Dark mode is optimized for intense analysis and trading sessions.',
    themeDark: 'Dark Mode',
    themeDarkDesc: 'High-contrast sleek dark theme.',
    themeLight: 'Light Mode',
    themeLightDesc: 'Clean, bright interface for daylight environments.',
    themeSystem: 'System Mode',
    themeSystemDesc: 'Automatically sync with your operating system preferences.',

    // Betting Preferences
    bettingSection: 'Betting Parameters & Formatting',
    oddsFormatLabel: 'Odds Format',
    oddsFormatDecimal: 'Decimal (e.g. 2.00)',
    oddsFormatFractional: 'Fractional (e.g. 1/1)',
    oddsFormatAmerican: 'American (e.g. +100)',
    currencyLabel: 'Default Currency',
    defaultUnitLabel: 'Default Unit Stake (%)',
    defaultUnitDesc: 'Base percentage of active bankroll used for stake suggestions.',

    // Account & Data
    accountSection: 'Account & Data Management',
    exportData: 'Export Settings & Data',
    exportDesc: 'Download a full JSON backup of your preferences and logs.',
    resetDefaults: 'Reset to Factory Defaults',
    resetDesc: 'Restore all regional, number formatting, and visual options to default.',
    resetSuccess: 'Settings successfully restored to default!',

    // Actions & Badges
    saveChanges: 'Save Changes',
    savedNotification: 'Settings saved automatically.',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.pt;
}
