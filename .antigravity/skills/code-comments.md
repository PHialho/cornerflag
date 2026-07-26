---
name: code-comments
description: Convenções para comentários de código e docstrings
---

## Quando comentar
- Explicar o "porquê", não o "quê" (o código já mostra o quê)
- Documentar decisões não óbvias (ex: workarounds, limitações de
  bibliotecas externas, ordem de operações que importa)
- Funções e classes públicas têm sempre docstring; funções privadas
  simples normalmente não precisam

## Formato de docstrings
Segue o formato já usado no projeto (ex: JSDoc, Google style em Python,
rustdoc) — confirmar qual antes de introduzir um novo. Estrutura mínima:
- Descrição de uma linha do que a função faz
- Parâmetros com tipo e propósito
- Valor de retorno
- Exceções lançadas, se relevante

## O que evitar
- Comentários que ficam desatualizados facilmente (ex: repetir a
  assinatura da função em português)
- Código comentado ("dead code") deixado no repositório — remover ou
  explicar porque está ali
- Comentários que compensam nomes de variáveis/funções pouco claros —
  preferir renomear em vez de comentar