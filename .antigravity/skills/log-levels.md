---
name: log-levels
description: Quando usar cada nível de log
---

## Níveis

- **`debug`** — detalhe útil apenas em desenvolvimento (valores de
  variáveis intermédias, entrada/saída de funções internas). Nunca
  ativo por defeito em produção
- **`info`** — eventos normais do ciclo de vida da aplicação (arranque,
  pedido processado com sucesso, job concluído). Não deve ser ruidoso
  ao ponto de esconder o que importa
- **`warn`** — algo inesperado mas recuperável (retry necessário,
  fallback ativado, configuração em falta a usar valor por defeito)
- **`error`** — falha que impede a operação pedida de completar. Deve
  incluir contexto suficiente para diagnosticar sem precisar de
  reproduzir o problema
- **`fatal`/`critical`** (se a stack o suportar) — falha que obriga a
  aplicação a parar

## Regras
- Um `error` sem contexto (ex: só "Erro!") é praticamente inútil —
  inclui sempre o que se estava a tentar fazer e com que inputs
  (sem expor dados sensíveis — ver `sensitive-data-redaction`)
- Não uses `error` para situações esperadas e tratadas (ex: validação
  de input do utilizador que falha) — isso é `warn` ou `info`, no máximo
- Não dupliques o mesmo evento em vários níveis (ex: logar o mesmo erro
  como `warn` e depois `error` mais abaixo na stack)