---
name: changelog-format
description: Formato do CHANGELOG.md, baseado em Keep a Changelog
---

## Estrutura
```
## [Unreleased]

## [v0.002] - 2026-07-26 *(Branch originária: `project_init` ➔ `develop`)*
### Added
### Changed
### Fixed

## [v0.001] - 2026-07-26 *(Branch originária: `agent_setup` ➔ `develop`)*
### Added
- Descrição da funcionalidade nova
```

## Regras
- Identificar sempre no cabeçalho de cada versão a **branch originária** e a branch destino do merge (ex: `project_init` ➔ `develop`).
- Cada entrada começa com verbo no passado ou substantivo claro, nunca com a mensagem de commit em bruto.
- Agrupar sempre por categoria (`Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`, `Security`).
- Manter `[Unreleased]` sempre no topo para acomodar alterações em curso.
- Breaking changes destacados com `⚠️` no início da linha, com nota de
  migração se aplicável
- Manter `[Unreleased]` sempre no topo, atualizado a cada PR relevante,
  e mover o conteúdo para uma versão nova apenas no momento do release
- Não incluir alterações puramente internas sem impacto para quem usa
  o projeto (ex: refactors sem mudança de comportamento)