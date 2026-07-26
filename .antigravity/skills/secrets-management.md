---
name: secrets-management
description: Como segredos (chaves, tokens, passwords) devem ser geridos no código
---

## Nunca no código nem no git
- API keys, tokens, passwords, chaves privadas, connection strings com
  credenciais — nunca hardcoded, nunca commitados, mesmo em branches
  temporários ou ficheiros de exemplo com valores "fake" que se parecem
  reais demais
- Ficheiros `.env` com valores reais nunca vão para o git — só
  `.env.example` com placeholders (`API_KEY=your_key_here`)

## Onde devem viver
- Variáveis de ambiente, ou um secret manager dedicado (Vault, AWS
  Secrets Manager, etc.) se o projeto já usar um
- Confirma qual o mecanismo já estabelecido no projeto antes de propor
  um novo — não introduzir uma segunda forma de gerir segredos

## Ao encontrar um segredo exposto
1. Sinaliza imediatamente como crítico, independentemente do que mais
   estiveres a fazer
2. Não te limites a remover do ficheiro atual — um segredo commitado
   está no histórico do git e continua exposto; recomenda rotação
   do segredo (invalidar e gerar um novo), não só a remoção
3. Verifica se o mesmo segredo aparece noutros ficheiros (logs,
   configs de exemplo, testes)

## Regras
- Nunca logar segredos, mesmo em `debug` (ver `sensitive-data-redaction`)
- Nunca incluir segredos em mensagens de commit, PR descriptions, ou
  issues, mesmo "temporariamente para debugging"
- Testes que precisem de credenciais usam sempre valores fake/mock,
  nunca credenciais reais, mesmo de ambientes de desenvolvimento