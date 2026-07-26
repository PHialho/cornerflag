# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao esquema de versionamento do **Corner Flag**:
- **Merge para `develop`**: `v0.001`, `v0.002`... (Versão minor de 3 dígitos)
- **Merge de `fix`**: `v0.001.1`, `v0.001.2`... (Sufixo de correção)
- **Release para `master`**: `v1.000`, `v2.000`... (Major version final)

---

## [Unreleased]

## [v0.001] - 2026-07-26

### Added
- Diretrizes gerais do agente principal no [ANTIGRAVITY.md](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/ANTIGRAVITY.md).
- Configuração de 12 agentes especializados em `.antigravity/agents/` e 37 skills em `.antigravity/skills/`.
- Ficheiro [.gitignore](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/.gitignore) padronizado para ecossistema Node.js / React / Vite.
- Workflow de Integração Contínua em [.github/workflows/ci.yml](file:///c:/Users/paulo/Documents/GitHub/CornerFlag/cornerflag/.github/workflows/ci.yml).

### Changed
- Estratégia de branches definida no projeto: `master` como produção por defeito, `develop` como integração de trabalho e `release/*` para releases.
- Atualizado o padrão de versionamento em `ANTIGRAVITY.md`, `branch-strategy.md` e `release-process.md`:
  - Incremental `v0.001` para merges na `develop`.
  - Sub-patch `v0.001.1` para correções (`fix`).
  - Versão major `v1.000` para releases na `master`.
