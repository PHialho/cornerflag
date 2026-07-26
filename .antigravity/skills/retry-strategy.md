---
name: retry-strategy
description: Quando e como fazer retry, backoff e fallback perante falhas
---

## Quando fazer retry
- Só para erros transitórios/de sistema (timeout, conexão recusada,
  rate limit) — nunca para erros de validação ou de negócio, que vão
  falhar sempre da mesma forma
- Confirma que a operação é idempotente antes de repetir automaticamente
  (ex: nunca repetir um pagamento sem uma idempotency key)

## Como fazer retry
- Backoff exponencial com jitter, não intervalos fixos (evita
  sobrecarregar um serviço já com problemas)
- Limite máximo de tentativas explícito (ex: 3), nunca retry infinito
- Registar cada tentativa falhada em `debug`, e a exaustão final em
  `warn` ou `error` conforme `log-levels`

## Fallback
- Definir explicitamente o que acontece quando todas as tentativas
  falham: valor por defeito seguro, resposta em cache, ou erro
  propagado — nunca deixar isto implícito
- Um fallback silencioso (ex: devolver lista vazia sem indicar que
  houve falha) pode esconder problemas reais — só usar quando o
  impacto de esconder for genuinamente aceitável

## Regras
- Nunca envolver toda uma função grande num retry — isolar só a
  chamada externa que pode falhar de forma transitória
- Timeouts explícitos em qualquer chamada externa (rede, base de
  dados) — nunca confiar no timeout por defeito da biblioteca sem
  confirmar que é adequado
- Circuit breaker (parar de tentar temporariamente após falhas
  repetidas) é preferível a retry ilimitado quando o serviço externo
  está claramente em baixo