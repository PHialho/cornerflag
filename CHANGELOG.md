# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao esquema de versionamento do **Corner Flag**:
- **Merge para `develop`**: `v0.001`, `v0.002`... (Versão minor de 3 dígitos)
- **Merge de `fix`**: `v0.001.1`, `v0.001.2`... (Sufixo de correção)
- **Release para `master`**: `v1.000`, `v2.000`... (Major version final)

---

## [Unreleased]

## [v0.009] - 2026-08-09 *(Branch originária: `strategies_and_goal` ➔ `develop`)*

### Added
- **Módulo Dedicado de Gestão de Estratégias, Sugestões & Objetivos/Challenges (`StrategiesView.tsx`)** em [src/components/strategies/StrategiesView.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/strategies/StrategiesView.tsx): Vista para gestão de estratégias de apostas, sugestões inteligentes automatizadas, acompanhamento de recuperação de investimento e desafios de banca.
- **Motor de Estatísticas de Estratégia e Progresso de Objetivos (`strategiesCalculator.ts`)** em [src/lib/math/strategiesCalculator.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/strategiesCalculator.ts): Algoritmos para cálculo de rendimento por estratégia (Win Rate, Stake Total, Lucro/Prejuízo, ROI %, Yield %, Odd Média) e percentagem de progresso de metas e desafios.
- **Sugestões Automatizadas de Apostas (+EV & Risk Alerts)**: Motor automatizado de recomendações que identifica estratégias +EV lucrativas, emite alertas de drawdown e sugere dimensionamentos de risco.
- **Navegação Lateral no Menu**: Item de menu *"Estratégias & Objetivos"* com o ícone `Target` posicionado entre *"Bancas"* e *"Relatórios"* em [src/components/layout/Sidebar.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/layout/Sidebar.tsx).
- **Suite de Testes Unitários de Estratégias**: Testes automatizados em [src/lib/math/strategiesCalculator.test.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/strategiesCalculator.test.ts) utilizando Vitest (total de 29 testes a passar).

---

## [v0.008.1] - 2026-08-09 *(Branch originária: `feature/settings-menu` ➔ `develop`)*

### Added
- **Módulo Dedicado de Configurações (`SettingsView.tsx`)** em [src/components/settings/SettingsView.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/settings/SettingsView.tsx): Módulo de personalização do sistema para gestão de idioma da plataforma, formatos regionais de separadores de vírgulas e pontos, temas visuais, preferências de apostas e gestão de perfil/dados.
- **Sistema de Internacionalização (i18n)** em [src/lib/i18n.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/i18n.ts): Suporte multi-idioma (Português e Inglês) em toda a interface do Corner Flag Pro.
- **Formatadores Regionais de Números e Moedas** em [src/lib/formatters.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/formatters.ts): Suporte a separadores numéricos (Europeu `1.234,56 €`, Anglo-saxónico `1,234.56 $`, Espaçado `1 234,56 €` e Personalizado).
- **Gestão de Temas e Preferências no Zustand** em [src/store/useSettingsStore.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/store/useSettingsStore.ts): Persistência em local storage para tema visual (Dark, Light, System), formato de odds (Decimal, Fracionário, Americano), moeda padrão e percentual base de unidade.

---

## [v0.008] - 2026-07-29 *(Branch originária: `calculator` ➔ `develop`)*



### Added
- **Suite Profissional de 10 Calculadoras de Apostas (`CalculatorView.tsx`)** em [src/components/calculator/CalculatorView.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/calculator/CalculatorView.tsx): Módulo completo integrando 10 ferramentas quantitativas para apostadores profissionais (+EV Expected Value, Critério de Kelly & Stake Sizing, Conversor de Odds & Probabilidade Implícita, Surebet / Arbitragem 2 e 3 saídas, Dutching, Hedging / Cash Out, Matched Betting SNR/SR, Handicaps Asiáticos, Múltiplas / Parlay e Modelo Poisson xG).
- **Motor de Algoritmos Financeiros & Matemáticos (`bettingCalculators.ts`)** em [src/lib/math/bettingCalculators.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/bettingCalculators.ts): Algoritmos para precificação, arbitragem sem risco, retenção de bónus, resolução das 14 linhas de Handicap Asiático e matrizes de Poisson.
- **Suite de 10 Testes Unitários de Calculadoras**: Testes automatizados para todas as 10 calculadoras adicionados em [src/lib/math/bettingCalculators.test.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/bettingCalculators.test.ts) utilizando Vitest (total de 26 testes a passar).
- **Conexão com a Banca Ativa**: As calculadoras de Kelly e Stake Sizing carregam automaticamente o saldo da banca ativa em tempo real.

---

## [v0.007] - 2026-07-28 *(Branch originária: `reports` ➔ `develop`)*

### Added
- **Módulo Dedicado de Relatórios & Analíticas (`ReportsView.tsx`)** em [src/components/reports/ReportsView.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/reports/ReportsView.tsx): Analíticas avançadas baseadas nas plataformas StakeToys e BetDiary, com indicadores KPI de Lucro Líquido, ROI/Yield %, Win Rate %, Profit Factor, Max Drawdown e Odds/Stakes Médias.
- **Motor de Cálculo e Agrupamento Estatístico (`reportsCalculator.ts`)** em [src/lib/math/reportsCalculator.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/reportsCalculator.ts): Algoritmos para apuração de Peak-to-Trough Drawdown, agrupamentos por desporto, estratégia, faixas de odds (`< 1.50`, `1.50-1.80`, `1.81-2.20`, `2.21-3.00`, `> 3.00`), dia da semana, mês e tipo de aposta (Simples vs Múltiplas).
- **Suite de Testes Unitários para Relatórios**: 6 testes automatizados adicionados em [src/lib/math/reportsCalculator.test.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/reportsCalculator.test.ts) utilizando Vitest.
- **Filtros por Escopo e Período**: Seleção dinâmica de escopo (Banca Ativa vs. Todas as Bancas) e período temporal (Todo o Histórico, Mês Corrente, Últimos 30 Dias, Este Ano).
- **Navegação Modular de Relatórios**: Adicionado item de menu *"Relatórios"* com o ícone `BarChart3` em [src/components/layout/Sidebar.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/layout/Sidebar.tsx) e integração no [src/App.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/App.tsx).

---

## [v0.006] - 2026-07-27 *(Branch originária: `bankrolls` ➔ `develop`)*

### Added
- **Módulo Dedicado de Gestão de Bancas (`BankrollsView.tsx`)** em [src/components/bankrolls/BankrollsView.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/bankrolls/BankrollsView.tsx): Tabela interativa e cartões KPI de património (Património Total, Saldo Inicial vs. Saldo Atual, Lucro/Prejuízo € e %, ROI % e Bancas Registadas).
- **Guia de Staking & Risco em Tempo Real**: Dimensionamento automático de unidades (0.25u, 0.50u, 1.00u, 2.00u) recalculado com base no saldo da banca ativa e recomendações do Critério de Kelly Fracionado (Half-Kelly).
- **Modal Interativo de Gestão de Bancas (`BankrollModal.tsx`)** em [src/components/bankrolls/BankrollModal.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/bankrolls/BankrollModal.tsx): Criação e edição de bancas (Nome, Saldo Inicial, Saldo Recalibrado, Moeda EUR/USD/GBP/BRL, % de Unidade Alvo e Descrição).
- **Ações de Edição e Eliminação no Store**: Métodos `updateBankroll` e `deleteBankroll` adicionados em [src/store/useCornerFlagStore.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/store/useCornerFlagStore.ts) com suporte a persistência no Supabase.
- **Suite de Testes Unitários de Staking & Gestão de Risco**: Suite de testes automatizados para verificação do dimensionamento de stakes e recálculos em [src/lib/math/calculator.test.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/calculator.test.ts) utilizando Vitest.

### Fixed
- **Recálculo Determinístico do Saldo da Banca**: Recálculo exato do saldo de cada banca com base no lucro acumulado de apostas liquidadas em [src/store/useCornerFlagStore.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/store/useCornerFlagStore.ts), corrigindo acumulações ao alternar resultados (*Ganha*, *Meio Ganha*, *Anulada*, *Meio Perdida*, *Perdida*).
- **Garantia de Identificadores UUID Válidos**: Atualização do ID da banca inicial para formato UUID e geração de IDs de bancas e apostas com `crypto.randomUUID()`, prevenindo erros de chave externa no PostgreSQL/Supabase.
- **Isolamento de Apostas por Banca Ativa**: Filtragem estrita por `activeBankrollId` nas métricas do [src/components/dashboard/Dashboard.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/dashboard/Dashboard.tsx) e na tabela de [src/components/bets/BetsView.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/bets/BetsView.tsx).
- **Reordenação e Padronização Visual do Menu Lateral**: Item *"Bancas"* posicionado acima da *"Calculadora +EV"* em [src/components/layout/Sidebar.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/layout/Sidebar.tsx) e cabeçalho padronizado em [src/components/bankrolls/BankrollsView.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/bankrolls/BankrollsView.tsx).

---

## [v0.005] - 2026-07-26 *(Branch originária: `bets` ➔ `develop`)*

### Added
- **Módulo Dedicado de Apostas (`BetsView.tsx`)** em [src/components/bets/BetsView.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/bets/BetsView.tsx): Tabela completa de apostas registadas com indicadores KPI (Total, Win Rate %, Lucro Acumulado € e ROI %), suporte a expansão de pernas de apostas múltiplas e eliminação de apostas.
- **Suporte a Apostas Simples e Múltiplas (`BetModal.tsx`)** em [src/components/bets/BetModal.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/bets/BetModal.tsx): Formatações para apostas simples e acumuladas múltiplas com cálculo automático da odd combinada.
- **Adição Dinâmica de Desportos e Estratégias**: Possibilidade de criar novos desportos e novas estratégias em tempo real diretamente na modal de registo.
- **Ícones de Fecho de Aposta**: Adicionados ícones de liquidação para *Ganha*, *Meio Ganha*, *Anulada*, *Meio Perdida* e *Perdida*.
- **Ação de Eliminar Aposta**: Possibilidade de eliminar apostas com recálculo automático e imediato do saldo da banca no estado reativo em [src/store/useCornerFlagStore.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/store/useCornerFlagStore.ts) e no Supabase.

---

## [v0.004] - 2026-07-26 *(Branch originária: `dashboard` ➔ `develop`)*

### Added
- **Menu Lateral (Sidebar Navigation)** em [src/components/layout/Sidebar.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/layout/Sidebar.tsx) com alternância de bancas ativas, navegação modular e perfil do utilizador.
- **Filtro de Período de Análise** em [src/components/dashboard/PeriodFilter.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/dashboard/PeriodFilter.tsx) com opções em linha única: *Hoje*, *Ontem*, *Mês Corrente* (padrão), *Mês Anterior*, *Últimos 30 Dias*, *Este Ano*, *Todo o Histórico* e *Personalizado*.
- **Popover Flutuante em Hover/Clique** para seleção de intervalo de datas (De / Até) com suporte a ponte contínua de cursor.
- **Métricas Chave Recalculadas por Período**: Resultado do Período, Lucro Médio por aposta, ROI % e Saldo Final acumulado.
- Botão **"+ Nova Aposta"** no topo da página e Modal interativo de registo em [src/components/dashboard/Dashboard.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/dashboard/Dashboard.tsx).

---

## [v0.003] - 2026-07-26 *(Branch originária: `authentication` ➔ `develop`)*

### Added
- Sistema completo de **Autenticação (Sign Up / Sign In / Sign Out)** com **Supabase Auth**.
- Store global reativa de autenticação em [src/store/useAuthStore.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/store/useAuthStore.ts).
- Componente modal [src/components/auth/AuthModal.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/components/auth/AuthModal.tsx) no estilo *Trading Dark Mode* com validação de formulários e feedback.
- Migração SQL em [supabase/migrations/20260726000001_create_profiles_table.sql](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/supabase/migrations/20260726000001_create_cornerflag_tables.sql) para criação da tabela `profiles` e trigger automático no registo de utilizadores.
- Controlo de sessão e avatar de utilizador na Top Navbar em [src/App.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/App.tsx).

---

## [v0.002] - 2026-07-26 *(Branch originária: `project_init` ➔ `develop`)*

### Added
- Inicialização da aplicação Web (React 19 + TypeScript + Vite 6) na branch `project_init`.
- Interface Dashboard em *Trading Dark Mode* com Tailwind CSS v4 e Lucide Icons em [src/App.tsx](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/App.tsx).
- Motor de cálculo matemático e estatístico financeiro em [src/lib/math/calculator.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/calculator.ts) (ROI, Yield, CLV %, +EV %, Critério de Kelly e liquidação de apostas).
- Suite de 9 testes unitários em [src/lib/math/calculator.test.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/math/calculator.test.ts) utilizando Vitest.
- Store global reativa com Zustand em [src/store/useCornerFlagStore.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/store/useCornerFlagStore.ts) e interfaces em [src/types/index.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/types/index.ts).
- Integração com **Supabase** (`@supabase/supabase-js`) em [src/lib/supabase.ts](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/src/lib/supabase.ts) e ficheiro `.env` com credenciais configuradas.
- Script de migração PostgreSQL para o Supabase em [supabase/migrations/20260726000000_create_cornerflag_tables.sql](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/supabase/migrations/20260726000000_create_cornerflag_tables.sql).

### Removed
- Removida a biblioteca `dexie` (IndexedDB local) em favor da persistência com Supabase e estado reativo.

---

## [v0.001] - 2026-07-26 *(Branch originária: `agent_setup` ➔ `develop`)*

### Added
- Diretrizes gerais do agente principal no [ANTIGRAVITY.md](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/ANTIGRAVITY.md).
- Configuração de 12 agentes especializados em `.antigravity/agents/` e 37 skills em `.antigravity/skills/`.
- Ficheiro [.gitignore](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/.gitignore) padronizado para ecossistema Node.js / React / Vite.
- Workflow de Integração Contínua em [.github/workflows/ci.yml](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/.github/workflows/ci.yml).

### Changed
- Estratégia de branches definida no projeto: `master` como produção por defeito, `develop` como integração de trabalho e `release/*` para releases.
- Atualizado o padrão de versionamento em `ANTIGRAVITY.md`, `branch-strategy.md` e `release-process.md`:
  - Incremental `v0.001` para merges na `develop`.
  - Sub-patch `v0.001.1` para correções (`fix`).
  - Versão major `v1.000` para releases na `master`.
