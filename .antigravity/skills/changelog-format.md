---
name: changelog-format
description: Formato do CHANGELOG.md, baseado em Keep a Changelog
---

## Estrutura
```
## [Unreleased]
### Added
### Changed
### Fixed
### Removed

## [1.2.0] - 2026-07-11
### Added
- Descrição da funcionalidade nova
```

## Regras
- Cada entrada começa com verbo no passado ou substantivo claro, nunca
  com a mensagem de commit em bruto
- Agrupar sempre por categoria (`Added`, `Changed`, `Fixed`, `Removed`,
  `Deprecated`, `Security`) — nunca uma lista plana
- Breaking changes destacados com `⚠️` no início da linha, com nota de
  migração se aplicável
- Manter `[Unreleased]` sempre no topo, atualizado a cada PR relevante,
  e mover o conteúdo para uma versão nova apenas no momento do release
- Não incluir alterações puramente internas sem impacto para quem usa
  o projeto (ex: refactors sem mudança de comportamento)