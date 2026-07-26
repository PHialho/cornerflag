---
name: release-process
description: Convenções de versionamento e processo de release do Corner Flag
---

## Esquema de Versionamento
- **Merge para `develop`**: Cada merge em `develop` cria uma versão minor incremental de 3 dígitos (ex: `v0.001`, `v0.002`, `v0.003`).
- **Merge de Correção (`fix`)**: Cada merge de `fix` adiciona um sufixo à versão atual de `develop` (ex: `v0.001.1`, `v0.001.2`).
- **Release Final para `master`**: O merge de uma branch de release (`release/*`) para a branch `master` promove o projeto para uma nova Major version estável e final (ex: `v1.000`, `v2.000`).

## Processo de Release
1. A partir de `develop`, cria a branch `release/vX.000` (ex: `release/v1.000`).
2. Confirma que todos os testes passam na branch de release.
3. Gera as notas de release a partir dos commits desde a última release, agrupadas no `CHANGELOG.md`:
   - ✨ Funcionalidades novas
   - 🐛 Correções
   - 📝 Documentação
   - ⚠️ Breaking changes
4. Faz o Pull Request e merge da branch `release/*` exclusivamente para a branch `master`.
5. Cria a tag no Git: `git tag -a v1.000 -m "Release v1.000"` e publica no GitHub com `gh release create v1.000`.

## Regras
- Apenas branches `release/*` criadas a partir de `develop` podem ser merged na `master`.
- Nunca reutilizar ou apagar uma tag já publicada.