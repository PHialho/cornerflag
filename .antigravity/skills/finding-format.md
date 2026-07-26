---
name: finding-format
description: Como reportar descobertas de exploração da codebase
---

## Formato de resposta
- Referência sempre `ficheiro:linha` para cada afirmação factual
  (ex: `src/auth/session.ts:42`)
- Se a pergunta tiver várias partes, responde a cada uma em secção
  separada, na mesma ordem em que foi perguntada
- Prioriza a resposta direta primeiro, detalhes de suporte depois —
  quem lê pode não precisar de todo o contexto de exploração

## O que incluir
- Localização exata (ficheiro + linha) de cada elemento relevante
- Citação mínima do código apenas quando essencial para a resposta,
  nunca o ficheiro inteiro
- Se houver múltiplas implementações/definições com o mesmo nome,
  listar todas com a sua localização, não escolher uma arbitrariamente

## O que evitar
- Não sugerir alterações ao código — a função deste agente é reportar
  factos verificados, não prescrever soluções
- Não afirmar comportamento sem o teres confirmado a ler o código
  (nunca inferir só pelo nome de uma função ou ficheiro)
- Não incluir passos de exploração que não levaram a nada relevante