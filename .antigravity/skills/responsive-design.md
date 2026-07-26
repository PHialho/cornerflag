---
name: responsive-design
description: Convenções para layouts responsivos e adaptação a diferentes ecrãs
---

## Abordagem
- Mobile-first: estilos base para o ecrã mais pequeno, breakpoints
  adicionam complexidade para ecrãs maiores — não o inverso
- Usar unidades relativas (`rem`, `%`, `vw`/`vh`, `fr` em grid) em vez
  de pixels fixos para dimensões que devem escalar

## Breakpoints
- Confirmar os breakpoints já definidos no projeto (design tokens,
  config do Tailwind, etc.) antes de introduzir valores novos
- Não criar um breakpoint novo para um único componente sem motivo —
  reutilizar a escala já estabelecida

## Padrões de layout
- Grid/flexbox para reflow de conteúdo, não posicionamento absoluto
  frágil que quebra com conteúdo dinâmico
- Imagens e media sempre responsivas (`max-width: 100%` ou
  equivalente), nunca dimensões fixas que causam overflow
- Texto nunca corta ou fica ilegível em ecrãs pequenos — testar com
  conteúdo real (nomes longos, várias línguas), não só texto de
  exemplo curto

## Regras
- Testar sempre em pelo menos 3 larguras: mobile pequeno (~375px),
  tablet (~768px), desktop (~1280px+)
- Elementos tocáveis (botões, links) com área mínima de toque
  adequada em mobile (orientação: ~44x44px), não só do tamanho visual
  do ícone/texto
- Scroll horizontal indesejado é sempre um bug a corrigir, nunca
  aceitável como comportamento normal