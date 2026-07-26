---
name: codebase-map
description: Mapa da estrutura e arquitetura do projeto PHinances, para orientar exploração rápida
---

## Diretórios principais

- `frontend/` — SPA em Vite + React + TypeScript
- `backend/` — API REST em Node.js + Express + TypeScript
- `.antigravity/` — Configuração de agentes e skills

## Pontos de entrada

- `frontend/src/main.tsx` — ponto de entrada do React
- `backend/src/index.ts` — ponto de entrada do servidor Express

## Frontend (`frontend/src/`)

- `lib/supabase.ts` — cliente Supabase (anon key, seguro para o browser)
- `components/` — componentes React reutilizáveis
- `pages/` — páginas da aplicação (uma por rota)
- `types/` — tipos TypeScript partilhados no frontend

## Backend (`backend/src/`)

- `app.ts` — configuração do Express (middleware, rotas)
- `index.ts` — arranque do servidor
- `lib/supabase.ts` — cliente Supabase (service role key, apenas servidor)
- `routes/` — handlers de rotas HTTP (um ficheiro por domínio)
- `services/` — lógica de negócio (sem conhecimento de HTTP)
- `middleware/` — autenticação, validação, tratamento de erros
- `types/` — tipos TypeScript partilhados no backend

## Convenções de nomenclatura

- Ficheiros de componentes React: `PascalCase.tsx`
- Ficheiros de serviços e utilitários: `camelCase.ts`
- Ficheiros de rotas: `camelCase.routes.ts`
- Ficheiros de serviços de negócio: `camelCase.service.ts`

## Onde procurar o quê

- Configuração: `backend/.env`, `frontend/.env.local`, `vite.config.ts`
- Rotas API: `backend/src/routes/`
- Lógica de negócio: `backend/src/services/`
- Componentes de UI: `frontend/src/components/`
- Páginas: `frontend/src/pages/`
- Cliente base de dados: `backend/src/lib/supabase.ts`
- Tipos partilhados: `*/src/types/`

## Variáveis de ambiente

**Backend** (`backend/.env`):
- `SUPABASE_URL` — URL do projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — chave de serviço (nunca expor no cliente)
- `PORT` — porta do servidor (default: 3000)

**Frontend** (`frontend/.env.local`):
- `VITE_SUPABASE_URL` — URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` — chave pública anon (segura para o browser)
- `VITE_API_URL` — URL do backend (default: http://localhost:3000)