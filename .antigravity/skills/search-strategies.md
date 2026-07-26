---
name: search-strategies
description: Estratégias eficientes de pesquisa na codebase com Grep e Glob
---

## Ordem de exploração recomendada
1. Começar amplo: `Glob` por nome de ficheiro/padrão antes de `Grep`
   por conteúdo — é mais barato e reduz o espaço de pesquisa
2. Se souberes o conceito mas não o nome exato, procura sinónimos comuns
   em inglês e português (ex: "user", "utilizador", "cliente")
3. Para perceber "quem chama isto", `Grep` pelo nome exato da
   função/classe em vez de assumir pela estrutura de pastas
4. Para perceber "como isto funciona", lê a definição completa, não só
   a primeira ocorrência — segue imports/chamadas relevantes

## Padrões úteis
- Procurar definições: `function nome`, `def nome`, `class Nome`,
  `const nome =`, `interface Nome`
- Procurar usos: apenas o nome, sem a keyword de definição
- Procurar configuração: `grep -ri` por variáveis de ambiente ou chaves
  de config mencionadas na pergunta

## Regras
- Não leias ficheiros inteiros de bibliotecas em `node_modules`,
  `vendor/`, ou equivalente — não fazem parte do código do projeto
- Se uma pesquisa não devolver resultados, tenta um termo diferente antes
  de concluir que "não existe"
- Prioriza precisão sobre velocidade: confirma sempre lendo o código,
  nunca assumas comportamento só pelo nome do ficheiro ou função