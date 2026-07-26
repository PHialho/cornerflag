---
name: log-format
description: Estrutura e formato das mensagens de log
---

## Formato
Logs estruturados (JSON ou key-value), não strings livres concatenadas —
facilita pesquisa e agregação em produção.

```
{"level":"error","msg":"falha ao processar pagamento","order_id":"...","reason":"timeout","duration_ms":3021}
```

Não:
```
console.log("Erro ao processar pagamento para a encomenda " + orderId + ": timeout depois de 3021ms")
```

## Campos recomendados
- `timestamp` — sempre em UTC, formato ISO 8601
- `level` — ver `log-levels`
- `msg` — descrição curta e estável (não interpolar valores dinâmicos
  diretamente na mensagem; usar campos separados)
- `request_id`/`trace_id` — para correlacionar logs do mesmo pedido
  através de vários serviços/funções
- Contexto relevante ao evento (ids, durações, contadores) como campos
  próprios, não embutidos na mensagem

## Regras
- A mesma ação deve gerar sempre o mesmo `msg`, com os valores variáveis
  nos campos — isto permite agrupar/contar ocorrências do mesmo tipo
- Nunca uses `print`/`console.log` diretamente em código de produção —
  usa sempre o logger configurado do projeto, para garantir formato e
  destino consistentes
- Inclui sempre `request_id`/`trace_id` quando disponível no contexto,
  mesmo em logs de nível `debug`