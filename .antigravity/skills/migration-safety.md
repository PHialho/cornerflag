---
name: migration-safety
description: Regras de segurança ao criar e aplicar migrações de base de dados
---

## Princípios gerais
- Toda a migração tem de ser reversível (`up`/`down`), ou explicitamente
  justificada como não-reversível com aviso claro
- Migrações nunca alteram dados de produção diretamente no mesmo passo
  que alteram esquema — separar migração de esquema de migração de dados
- Testar sempre a migração numa cópia/staging antes de aplicar em
  produção, nunca aplicar diretamente sem validação

## Operações de risco elevado (exigem confirmação explícita)
- `DROP TABLE`, `DROP COLUMN` — dados perdidos de forma irreversível
- Alterar tipo de coluna com dados existentes (risco de truncar/perder
  precisão)
- Adicionar constraint `NOT NULL` a coluna existente sem definir
  primeiro um valor por defeito para as linhas atuais
- Renomear coluna/tabela usada por código em produção sem período de
  transição (deploy que quebra se migração e código não estiverem
  sincronizados)

## Migrações em tabelas grandes
- Adicionar índice em tabela grande deve usar a opção não-bloqueante
  da base de dados (ex: `CONCURRENTLY` em Postgres), nunca bloquear a
  tabela em produção sem avaliar o impacto
- Alterações de esquema em tabelas grandes preferem passos incrementais
  (adicionar coluna nullable → backfill → tornar not null) em vez de
  uma operação única bloqueante

## Regras
- Nunca editar uma migração já aplicada em produção — criar uma nova
  migração para corrigir, mesmo que o erro seja trivial
- Nomear migrações de forma descritiva e ordenável (timestamp ou
  sequência), nunca com nomes genéricos como `fix.sql`
- Toda a migração de risco elevado exige confirmação explícita do
  utilizador antes de ser aplicada, mesmo que tecnicamente correta