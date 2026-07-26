---
name: sensitive-data-redaction
description: O que nunca deve aparecer em logs
---

## Nunca logar em texto legível
- Passwords, tokens de sessão, API keys, chaves privadas
- Números completos de cartão de crédito, IBAN completo, CVV
- Dados pessoais identificáveis desnecessários (nome completo, morada,
  email) quando um identificador interno (ex: `user_id`) já basta
- Corpo completo de pedidos/respostas HTTP que possam conter o acima
  (ex: logar `req.body` inteiro sem filtrar)

## O que fazer em alternativa
- Usar identificadores internos (`user_id`, `order_id`) em vez dos
  dados pessoais associados
- Mascarar parcialmente quando o valor precisa de ser reconhecível
  para debugging (ex: `****1234` para os últimos 4 dígitos de um cartão)
- Se uma biblioteca de logging de terceiros capturar automaticamente
  headers ou payloads, configurar explicitamente uma lista de campos
  a redigir (`authorization`, `cookie`, `password`, `token`, etc.)

## Ao rever ou adicionar logs
1. Antes de adicionar um log novo, pergunta: "se isto for parar a um
   sistema de observabilidade de terceiros, ou for lido por alguém sem
   acesso à base de dados, ainda é seguro?"
2. Ao encontrares um log existente que viole isto, sinaliza como
   `blocking:` numa revisão — isto não é uma sugestão opcional
3. Isto aplica-se também a logs de erro/stack traces — exceções podem
   conter dados sensíveis nos seus argumentos