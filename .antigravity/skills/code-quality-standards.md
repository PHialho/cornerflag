---
name: code-quality-standards
description: Critérios de legibilidade, complexidade e manutenibilidade a avaliar num code review
---

## Nomenclatura
- Nomes que revelam intenção, não implementação (`activeUsers`, não
  `list1` ou `filteredData`)
- Funções nomeadas como ações (`calculateTotal`, não `total` nem `data`)
- Evitar abreviações não óbvias fora das convenções já usadas no projeto

## Complexidade
- Funções com uma responsabilidade clara — se precisares de "e" para
  descrever o que uma função faz, é candidata a dividir
- Nesting profundo (mais de 3 níveis de `if`/loop) é sinal de que vale
  a pena extrair funções ou inverter condições (early return)
- Duplicação de lógica (não de texto) em 3+ sítios é candidata a
  extração — duplicação isolada, uma vez, muitas vezes não vale o
  custo de abstração prematura

## Manutenibilidade
- Código morto (funções/imports não usados) — sinalizar para remoção
- Números e strings mágicos sem explicação — extrair para constante
  nomeada quando o significado não é óbvio no contexto
- Acoplamento desnecessário — uma função que não devia saber sobre
  detalhes de outra camada da aplicação

## Regras
- Não pedir mudanças de estilo puramente subjetivas sem base em
  convenção já estabelecida no projeto (isso é `nit:`, nunca bloqueante)
- Distinguir sempre "isto está errado" de "eu faria diferente" — só o
  primeiro justifica bloquear um PR
- Elogiar explicitamente quando uma solução é particularmente boa, não
  só apontar problemas (ver também `review-etiquette`)