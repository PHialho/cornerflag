---
name: branch-strategy
description: Convenções de nomenclatura e gestão de branches no Corner Flag
---

## Estrutura de Branches
- `master` — Branch principal por defeito (código estável de produção)
- `develop` — Branch principal de trabalho e integração de funcionalidades
- `release/<versao>` — Branch de release criada a partir de `develop` (ex: `release/v1.0.0`)

## Nomenclatura de Trabalhos
- `feat/<descricao-curta>` — Nova funcionalidade
- `fix/<descricao-curta>` — Correção de bug
- `refactor/<descricao-curta>` — Refatoração de código sem alteração funcional
- `docs/<descricao-curta>` — Alterações de documentação
- `test/<descricao-curta>` — Adição ou alteração de testes
- `chore/<descricao-curta>` — Manutenção e tarefas auxiliares
- Usar hífens, minúsculas, sem espaços ou caracteres especiais

## Fluxo de Merge & PR
- **Destino dos PRs de Trabalho**: Todas as branches (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`) devem fazer Pull Request e merge para a branch `develop`.
- **Fluxo de Release**: Apenas a partir de `develop` se cria a branch `release/*`. Apenas e exclusivamente a branch de release pode fazer merge para a `master`.

## Versionamento por Merge
- **Merge para `develop`**: Gera uma versão minor incremental de 3 dígitos (ex: `v0.001`, `v0.002`, `v0.003`).
- **Merge de `fix`**: Adiciona um sufixo à versão atual de `develop` (ex: `v0.001.1`, `v0.001.2`).
- **Release para `master`**: Gera uma Major version estável e final (ex: `v1.000`, `v2.000`).

## Regras e Limpeza
- Manter as branches de trabalho atualizadas com `develop` antes de abrir o PR para evitar conflitos.
- Apagar a branch remota de trabalho após o merge no `develop`.
- **Proibido**: Nunca fazer commit ou merge direto na branch `master` sem passar pelo fluxo de `develop` e `release/*`.