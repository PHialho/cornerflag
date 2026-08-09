import type { Language } from '../store/useSettingsStore';

export const translations = {
  pt: {
    // Navigation
    dashboard: 'Dashboard',
    bets: 'Apostas',
    bankrolls: 'Bancas',
    reports: 'Relatórios',
    calculator: 'Calculadora +EV',
    settings: 'Configurações',
    activeBankroll: 'Banca Ativa',
    signOut: 'Terminar Sessão',
    navigation: 'Navegação',

    // Settings General
    settingsTitle: 'Definições do Sistema',
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
    reports: 'Reports',
    calculator: 'EV+ Calculator',
    settings: 'Settings',
    activeBankroll: 'Active Bankroll',
    signOut: 'Sign Out',
    navigation: 'Navigation',

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

  es: {
    // Navigation
    dashboard: 'Panel Principal',
    bets: 'Apuestas',
    bankrolls: 'Bancas',
    reports: 'Informes',
    calculator: 'Calculadora +EV',
    settings: 'Configuración',
    activeBankroll: 'Banca Activa',
    signOut: 'Cerrar Sesión',
    navigation: 'Navegación',

    // Settings General
    settingsTitle: 'Configuración del Sistema',
    settingsSubtitle: 'Personalice el idioma, formatos regionales de comas y puntos, temas visuales y preferencias de riesgo.',
    tabGeneral: 'General e Idioma',
    tabAppearance: 'Apariencia y Tema',
    tabBetting: 'Preferencias de Apuestas',
    tabAccount: 'Cuenta y Datos',

    // Language & Region
    languageSection: 'Idioma de la Plataforma',
    languageDesc: 'Seleccione el idioma para la interfaz de Corner Flag Analytics.',
    numberFormatSection: 'Formato Regional de Números',
    numberFormatDesc: 'Elija la convención regional para separadores decimales (coma/punto) y millares.',
    decimalSeparatorLabel: 'Separador Decimal',
    thousandsSeparatorLabel: 'Separador de Millares',
    presetEuropean: 'Europeo (1.234,56 € - Coma decimal, Punto millares)',
    presetAnglo: 'Anglosajón (1,234.56 $ - Punto decimal, Coma millares)',
    presetSwiss: 'Con Espacio (1 234,56 € - Coma decimal, Espacio millares)',
    presetCustom: 'Personalizado',
    previewTitle: 'Vista Previa en Vivo:',

    // Appearance & Theme
    themeSection: 'Tema Visual de la Interfaz',
    themeDesc: 'Elija su tema preferido. El modo oscuro está optimizado para largas sesiones de análisis.',
    themeDark: 'Modo Oscuro',
    themeDarkDesc: 'Diseño oscuro profesional de alto contraste.',
    themeLight: 'Modo Claro',
    themeLightDesc: 'Interfaz limpia y clara para entornos iluminados.',
    themeSystem: 'Modo Sistema',
    themeSystemDesc: 'Sincronizar automáticamente con las preferencias del sistema.',

    // Betting Preferences
    bettingSection: 'Parámetros y Formato de Apuestas',
    oddsFormatLabel: 'Formato de Cuotas (Odds)',
    oddsFormatDecimal: 'Decimal (ej: 2.00)',
    oddsFormatFractional: 'Fraccionario (ej: 1/1)',
    oddsFormatAmerican: 'Americano (ej: +100)',
    currencyLabel: 'Moneda Principal',
    defaultUnitLabel: 'Stake Predeterminado por Unidad (%)',
    defaultUnitDesc: 'Porcentaje base recomendado de la banca para apuestas.',

    // Account & Data
    accountSection: 'Perfil y Gestión de Datos',
    exportData: 'Exportar Configuración y Datos',
    exportDesc: 'Descargue una copia de seguridad en formato JSON.',
    resetDefaults: 'Restablecer Configuración',
    resetDesc: 'Restaurar todas las opciones a los valores por defecto.',
    resetSuccess: '¡Configuración restablecida con éxito!',

    // Actions & Badges
    saveChanges: 'Guardar Cambios',
    savedNotification: 'Configuración guardada automáticamente.',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.pt;
}
