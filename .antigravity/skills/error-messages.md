---
name: error-messages
description: Como escrever mensagens de erro — distinção entre mensagem interna e mensagem para o utilizador
---

## Mensagem interna vs. mensagem para o utilizador

- **Mensagem interna** (logs, traces) — técnica, detalhada, inclui contexto
  de debugging (ex: stack trace, id da operação, valor do input que falhou).
  Nunca exposta diretamente ao utilizador final
- **Mensagem para o utilizador** — clara, não técnica, acionável. Diz o que
  correu mal e, quando possível, o que o utilizador pode fazer a seguir.
  Nunca deve conter detalhes de infraestrutura (ex: nome de tabela, caminho
  de ficheiro interno, mensagem de exceção em bruto)

## Como escrever mensagens para o utilizador

- Usa linguagem simples, na perspetiva do utilizador — não da implementação
  (❌ "Foreign key constraint failed"; ✅ "Não foi possível eliminar esta
  categoria porque ainda tem transações associadas")
- Indica o que aconteceu + o que fazer a seguir, quando possível
  (ex: "O ficheiro é demasiado grande. O limite é 5 MB.")
- Evita "Erro desconhecido" ou "Algo correu mal" sem mais contexto —
  se realmente não há contexto útil, pelo menos indica uma ação de
  recuperação (ex: "Tenta novamente. Se o problema persistir, contacta
  o suporte.")
- Nunca uses linguagem de culpa ("O utilizador não preencheu…") — prefere
  o impessoal ("O campo X é obrigatório.")

## Regras

- Nunca propagar a mensagem de uma exceção de sistema diretamente para
  o utilizador final — mapeia sempre para uma mensagem controlada
- Erros de validação devem identificar o campo concreto que falhou,
  não apenas "input inválido"
- Em APIs, a mensagem para o utilizador vai no campo `message` da resposta
  de erro; o detalhe técnico (se houver) vai num campo separado apenas
  acessível a developers (ex: `debug`, `internal_code`)
- Manter as mensagens para o utilizador em ficheiros de localização/i18n
  quando o projeto suporta múltiplos idiomas — nunca hardcoded espalhadas
  pelo código