---
name: issue-triage
description: Convenções para classificar e etiquetar issues no GitHub
---

## Labels de tipo
- `bug` — comportamento incorreto confirmado
- `feature` — pedido de funcionalidade nova
- `question` — dúvida, não requer alteração de código
- `duplicate` — já reportado noutra issue (referenciar com `#numero`)

## Labels de prioridade
- `priority:critical` — bloqueia produção ou perda de dados
- `priority:high` — afeta muitos utilizadores, sem workaround
- `priority:medium` — impacto limitado ou com workaround
- `priority:low` — cosmético ou edge case raro

## Ao triar uma issue nova
1. Confirma se há informação suficiente para reproduzir (se não, pede
   detalhes em vez de assumir)
2. Verifica se já existe uma issue semelhante antes de etiquetar como nova
3. Atribui tipo + prioridade
4. Se for um bug crítico, menciona o responsável definido no CODEOWNERS
   (se existir) em vez de assumir quem deve tratar

## O que não fazer
- Não fechar issues sem explicação, mesmo que pareçam duplicadas ou
  inválidas — explicar sempre o motivo
- Não atribuir prioridade `critical` sem confirmar impacto real