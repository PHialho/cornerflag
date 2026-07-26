---
name: data-integrity
description: Como garantir consistência de dados em operações e queries
---

## Transações
- Operações que alteram múltiplas tabelas de forma relacionada correm
  sempre dentro de uma transação — nunca alterações parciais que podem
  deixar dados inconsistentes se uma falhar a meio
- Nível de isolamento explícito quando o comportamento por defeito da
  base de dados não for suficiente para o caso de uso (ex: condições
  de corrida em contadores/saldos)

## Queries
- Queries parametrizadas sempre, nunca concatenação de input do
  utilizador (ver também `input-validation`)
- Evitar `SELECT *` em código de produção — listar colunas explícitas,
  reduz acoplamento a mudanças de esquema e volume de dados transferido
- Confirmar que `JOIN`s não duplicam linhas inesperadamente (verificar
  cardinalidade da relação antes de assumir)

## Concorrência
- Operações de leitura-modificação-escrita (ex: decrementar stock)
  precisam de locking explícito ou operações atómicas da base de dados
  — nunca ler, calcular em memória, e escrever de volta sem proteção
  contra condições de corrida
- Idempotência em operações que podem ser repetidas (retries, eventos
  duplicados) — usar chaves de idempotência quando a operação tem
  efeitos externos (ex: pagamentos)

## Regras
- Nunca confiar só na aplicação para garantir integridade que a base
  de dados pode garantir estruturalmente (constraints, foreign keys)
- Migrações de dados (backfills) em produção correm em lotes pequenos
  com possibilidade de pausa/retomar, nunca uma operação única sobre
  toda a tabela sem medir o impacto primeiro
- Verificar sempre o plano de execução (`EXPLAIN`) antes de assumir
  que uma query nova é performante em volume de produção