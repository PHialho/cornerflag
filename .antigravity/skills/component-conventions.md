---
name: component-conventions
description: Convenções de estrutura, props e consistência visual de componentes de UI
---

## Estrutura de props
- Props com nomes claros e consistentes com o resto do projeto
  (ex: sempre `onClick`, nunca misturar com `handleClick` como prop
  pública)
- Valores por defeito sensatos para props opcionais — um componente
  não deve exigir configuração extensa para o caso de uso mais comum
- Booleans nomeados como afirmações (`isDisabled`, `isLoading`), não
  ambíguos (`disabled` sozinho é aceitável se for a convenção nativa
  do elemento HTML equivalente)

## Consistência visual
- Reutilizar tokens de design já existentes (cores, espaçamento,
  tipografia) em vez de valores mágicos novos — confirmar se o
  projeto já tem um design system/tokens antes de inventar valores
- Estados visuais completos: default, hover, focus, active, disabled,
  loading, erro — não implementar só o estado "feliz"
- Espaçamento consistente com a escala já usada no projeto (ex: escala
  de 4px/8px), não valores arbitrários por componente

## Composição
- Preferir composição (slots/children) a props que controlam
  variantes internas complexas, quando a flexibilidade justificar
- Componentes com uma responsabilidade clara — um componente que faz
  "tudo" com muitas props condicionais é candidato a dividir
- Lógica de negócio fora de componentes de apresentação puros, quando
  a arquitetura do projeto já fizer essa separação

## Regras
- Nunca duplicar um componente já existente com pequenas variações —
  estender ou parametrizar o existente
- Novo componente visual segue os mesmos tokens/convenções dos
  componentes já existentes, nunca introduz um estilo isolado
- Todo o componente interativo cumpre `accessibility-standards`