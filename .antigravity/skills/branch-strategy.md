---
name: branch-strategy
description: Convenções de nomenclatura e gestão de branches
---

## Nomenclatura
- `feature/<descricao-curta>` — funcionalidade nova
- `fix/<descricao-curta>` — correção de bug
- `chore/<descricao-curta>` — manutenção, sem impacto funcional
- Usar hífens, minúsculas, sem espaços ou caracteres especiais

## Base
- Ramificar sempre a partir de `main` (ou `develop`, se o projeto usar
  esse fluxo — confirmar qual é o branch de integração antes de assumir)
- Manter o branch atualizado com rebase ou merge do branch base antes
  de abrir o PR, para evitar conflitos tardios

## Limpeza
- Apagar o branch remoto depois do merge do PR (mas nunca sem confirmação
  explícita se o branch tiver sido criado por outra pessoa)
- Não deixar branches órfãos sem PR associado por mais de uma semana
  sem sinalizar ao utilizador

## O que não fazer
- Nunca commitar diretamente em `main`/`production`
- Nunca fazer force-push num branch partilhado por mais do que uma pessoa
  sem confirmação explícita