---
name: release-process
description: Convenções de versionamento e notas de release
---

## Versionamento
Semantic Versioning (`MAJOR.MINOR.PATCH`):
- `MAJOR` — breaking changes
- `MINOR` — funcionalidade nova, retrocompatível
- `PATCH` — correções de bugs, retrocompatível

## Processo de release
1. Confirma que todos os testes passam antes de criar a tag
2. Gera as notas de release a partir dos commits desde a última tag
   (`git log <ultima-tag>..HEAD --oneline`), agrupadas por tipo:
   - ✨ Funcionalidades novas
   - 🐛 Correções
   - 📝 Documentação
   - ⚠️ Breaking changes (destacar sempre no topo, com instruções de migração)
3. Cria a tag: `git tag -a vX.Y.Z -m "..."` e faz push da tag
4. Publica a release no GitHub com `gh release create`, incluindo as notas

## Regras
- Nunca reutilizar ou apagar uma tag já publicada
- Breaking changes exigem confirmação explícita do utilizador antes do
  bump de MAJOR version
- Se não houver commits desde a última tag, não criar release vazia