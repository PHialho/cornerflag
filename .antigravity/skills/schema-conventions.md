---
name: schema-conventions
description: Convenções de modelação e nomenclatura de esquema de base de dados
---

## Nomenclatura
- Tabelas no plural (`users`, `orders`), colunas no singular
- `snake_case` para tabelas/colunas (ou o padrão já usado no projeto —
  confirmar antes de assumir)
- Chaves estrangeiras nomeadas `<tabela_singular>_id` (ex: `user_id`
  na tabela `orders`)
- Timestamps consistentes: `created_at`, `updated_at` (e `deleted_at`
  se o projeto usar soft delete)

## Tipos e constraints
- Usar o tipo mais restrito que representa corretamente o dado (não
  `TEXT` para tudo, não `VARCHAR(255)` por hábito sem pensar no limite
  real)
- Constraints de integridade na base de dados, não só na aplicação —
  `NOT NULL`, `UNIQUE`, `FOREIGN KEY` sempre que a regra de negócio o
  exigir. A aplicação pode validar primeiro, mas a base de dados é a
  última linha de defesa
- Chaves estrangeiras com `ON DELETE`/`ON UPDATE` explícitos
  (`CASCADE`, `RESTRICT`, `SET NULL`) — nunca deixar o comportamento
  por defeito implícito sem confirmar que é o pretendido

## Normalização
- Normalizar por defeito; desnormalizar apenas com justificação
  explícita de performance, documentada no código/migração
- Evitar colunas que armazenam listas/JSON quando uma tabela
  relacionada representaria melhor a relação — exceto quando o projeto
  já usa JSON deliberadamente para dados semi-estruturados

## Regras
- Toda a tabela nova tem chave primária explícita — nunca depender
  apenas de uma coluna "quase única"
- Índices em toda a coluna usada frequentemente em `WHERE`, `JOIN` ou
  `ORDER BY`, mas sem indexar tudo indiscriminadamente (custo de escrita)