---
name: accessibility-standards
description: Requisitos mínimos de acessibilidade (WCAG) para componentes de UI
---

## Semântica
- Usar elementos HTML nativos com o significado correto (`<button>`
  para ações, `<a>` para navegação) em vez de `<div>` com `onClick` —
  o nativo já traz foco de teclado e leitura por screen reader
- Hierarquia de headings (`h1`-`h6`) lógica e sem saltos, refletindo a
  estrutura real do conteúdo
- `alt` descritivo em imagens informativas; `alt=""` em imagens
  puramente decorativas (não omitir o atributo)

## Teclado e foco
- Toda a funcionalidade acessível só com teclado, sem depender do rato
- Ordem de foco (`tab`) segue a ordem visual/lógica do conteúdo
- Foco visível sempre (nunca `outline: none` sem substituir por um
  indicador de foco alternativo igualmente visível)
- Modais/dropdowns fazem "focus trap" enquanto abertos e devolvem o
  foco ao elemento que os abriu ao fechar

## Contraste e leitura
- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
  (WCAG AA)
- Nunca usar cor como único indicador de estado/erro — acompanhar
  sempre de texto ou ícone
- Formulários com `label` associado a cada campo (via `for`/`id` ou
  aninhamento), nunca só placeholder como label

## Regras
- Componentes interativos custom (dropdowns, tabs, accordions) usam
  os atributos ARIA corretos (`role`, `aria-expanded`, `aria-selected`,
  etc.) consistentes com o padrão APG da WAI-ARIA
- Mensagens de erro em formulários associadas ao campo via
  `aria-describedby`, não só visualmente próximas
- Nunca sacrificar acessibilidade por preferência visual sem
  alternativa equivalente