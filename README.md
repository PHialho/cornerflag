# Corner Flag ⚽🚩

Plataforma profissional de apoio a apostadores desportivos focada em **Gestão de Banca**, **Controlo de Risco** e **Precificação de Valor Esperado (+EV)**.

[![Continuous Integration](https://github.com/PHialho/cornerflag/actions/workflows/ci.yml/badge.svg)](https://github.com/PHialho/cornerflag/actions/workflows/ci.yml)
![Versão](https://img.shields.io/badge/vers%C3%A3o-v0.007-emerald)
![License](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

---

## 🌟 Funcionalidades Principais

- **Estética *Trading Dark Mode***: Interface inspirada em software quantitativo e financeiro de alto desempenho.
- **Relatórios & Analíticas Avançadas (`ReportsView.tsx`)**:
  - Analíticas inspiradas no **StakeToys** e **BetDiary** com métricas de **Profit Factor**, **Max Drawdown (€/%)**, **Win Rate %**, **ROI / Yield %** e **Odds/Stakes Médias**.
  - Agrupamentos por **Desporto**, **Estratégia/Mercado**, **Faixas de Odds** (`< 1.50`, `1.50-1.80`, `1.81-2.20`, `2.21-3.00`, `> 3.00`), **Dia da Semana** e **Mensal**.
  - Comparativo de rentabilidade entre apostas **Simples vs. Múltiplas**.
- **Gestão de Bancas & Risco (`BankrollsView.tsx`)**:
  - Suporte a múltiplas bancas, calibragem de saldo e dimensionamento automático de unidades (0.25u, 0.50u, 1.00u, 2.00u) pelo Critério de Kelly Fracionado.
- **Motor Financeiro de Precisão**:
  - Liquidação rigorosa de apostas (*Win*, *Half Win*, *Void / Push*, *Half Loss*, *Loss*, *Cashout*).
  - Cálculo automático de **ROI (%)**, **Yield (%)** e **CLV (Closing Line Value %)**.
  - Calculadora em tempo real de **Valor Esperado (+EV %)** e **Critério de Kelly Fracionado (1/4 Kelly)**.
- **Persistência de Dados**: Sincronização cloud com **Supabase** (PostgreSQL) com Row Level Security (RLS) e migrações DDL.
- **Gráficos Analytics Interativos**: Curva de crescimento de banca e variação de património com **Recharts**.

---

## 🛠️ Stack Técnica

- **Core**: React 19, TypeScript (Strict Mode), Vite 6
- **UI / Styling**: Tailwind CSS v4, Lucide React Icons
- **Gestão de Estado**: Zustand
- **Persistência Cloud**: Supabase (`@supabase/supabase-js`)
- **Testes & Qualidade**: Vitest, Oxlint

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- **Node.js** v20 ou superior
- **npm** v10 ou superior

### Passos
1. Clonar o repositório:
   ```bash
   git clone https://github.com/PHialho/cornerflag.git
   cd cornerflag
   ```

2. Instalar as dependências:
   ```bash
   npm install
   ```

3. Arrancar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Aceda a **[http://localhost:5173](http://localhost:5173)** no seu navegador.

---

## 🧪 Testes e Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Arrancar o servidor de desenvolvimento local (Vite) |
| `npx vitest run` | Executar a suite de testes unitários do motor matemático |
| `npm run build` | Compilar o projeto TypeScript para produção na pasta `dist/` |
| `npm run preview` | Previsualizar a compilação de produção localmente |

---

## ⚙️ Configuração do Supabase (Opcional)

1. Duplicar o ficheiro de modelo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Adicionar as suas chaves do Supabase no ficheiro `.env`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
3. Executar o script SQL em [supabase/migrations/20260726000000_create_cornerflag_tables.sql](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/supabase/migrations/20260726000000_create_cornerflag_tables.sql) no **SQL Editor** do Supabase.

---

## 🌿 Estratégia de Git & Versionamento

Este projeto adere rigorosamente à convenção de branches e versionamento do **Corner Flag**:

- `master` — Branch principal por defeito (versão estável de produção).
- `develop` — Branch principal de trabalho e integração.
- `release/*` — Branch de release criada a partir de `develop` (única autorizada a dar merge na `master`).

### Versões:
- **Merge para `develop`**: Versão minor de 3 dígitos (ex: `v0.001`, `v0.002`).
- **Merge de `fix`**: Sub-patch de correção (ex: `v0.001.1`).
- **Release para `master`**: Versão major final (ex: `v1.000`).

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.
