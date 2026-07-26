---
name: review-etiquette
description: Tom e critérios ao comentar ou rever pull requests de terceiros
---

## Tom dos comentários
- Comentar o código, nunca a pessoa ("esta função pode ter um edge case
  não tratado", não "não pensaste nisto")
- Distinguir claramente bloqueante vs sugestão opcional (prefixar com
  `blocking:` ou `nit:`)
- Elogiar boas soluções explicitamente, não só apontar problemas

## Quando aprovar vs pedir alterações
- **Approve** — sem problemas bloqueantes, mesmo que existam `nit:` por resolver
- **Request changes** — bugs, problemas de segurança, ou quebra de
  convenções acordadas da equipa
- **Comment** — dúvidas ou sugestões que não bloqueiam o merge

## Regras
- Nunca aprovar um PR sem ter lido de facto o diff completo
- Se o PR for grande demais para rever com confiança, dizer isso
  explicitamente e sugerir dividir em PRs mais pequenos
- Não fazer merge de um PR próprio sem pelo menos uma aprovação, salvo
  indicação explícita em contrário