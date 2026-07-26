---
name: performance-checklist
description: O que verificar em código para problemas de performance comuns
---

## Padrões a procurar
- **N+1 queries** — query dentro de um loop que devia ser uma única
  query com join/batch (o mais comum e mais caro em código de negócio)
- **Alocação desnecessária em loops** — criar objetos/arrays dentro de
  um loop quando podiam ser criados uma vez fora dele
- **Operações síncronas bloqueantes** em código que devia ser
  assíncrono (I/O de rede ou disco a bloquear a thread principal)
- **Falta de paginação** em endpoints que devolvem coleções que podem
  crescer sem limite
- **Falta de índice** em queries filtradas/ordenadas por uma coluna
  sem índice, quando a tabela pode crescer

## Como avaliar
- Não otimizar prematuramente código que não está num caminho quente
  (hot path) — sinalizar como `nit:`, não bloqueante, a menos que o
  impacto seja claramente significativo
- Pedir sempre para confirmar com dados reais (profiling, EXPLAIN de
  query) antes de assumir que uma otimização proposta é necessária,
  quando a alteração sugerida aumenta a complexidade do código

## Regras
- Só bloquear um PR por performance quando o impacto é claro e
  provável em produção (ex: N+1 numa rota de alto tráfego), não por
  micro-otimizações especulativas
- Complexidade de código legível vale mais do que ganhos marginais de
  performance em código que não é um gargalo conhecido