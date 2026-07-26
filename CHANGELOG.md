# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao esquema de versionamento do **Corner Flag**:
- **Merge para `develop`**: `v0.001`, `v0.002`... (Versão minor de 3 dígitos)
- **Merge de `fix`**: `v0.001.1`, `v0.001.2`... (Sufixo de correção)
- **Release para `master`**: `v1.000`, `v2.000`... (Major version final)

---

## [Unreleased]

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
