---
name: secure-defaults
description: Configuração segura por defeito — CORS, headers, dependências
---

## CORS
- Nunca `Access-Control-Allow-Origin: *` em endpoints que exigem
  autenticação ou lidam com dados sensíveis
- Lista explícita de origens permitidas, não um wildcard "temporário"
  que fica esquecido em produção

## Headers de segurança
- `Content-Security-Policy` definido, não ausente
- `X-Content-Type-Options: nosniff`
- Cookies de sessão com `HttpOnly`, `Secure`, e `SameSite` apropriados
- Nunca expor headers com informação de versão/stack desnecessária
  (ex: `X-Powered-By`)

## Dependências e configuração
- Nenhuma dependência com vulnerabilidade crítica/alta conhecida sem
  plano de mitigação (ver também `dependency-auditor`)
- Ambientes de desenvolvimento/debug nunca ativos em produção (ex:
  stack traces detalhados expostos ao utilizador, debug mode ligado)
- TLS obrigatório para qualquer comunicação com dados sensíveis —
  nunca aceitar fallback silencioso para HTTP

## Regras
- Qualquer exceção a estas regras (ex: CORS aberto num endpoint
  público por design) deve estar comentada no código explicando
  porquê, não deixada sem justificação
- Configuração insegura "só para testar localmente" nunca deve ser o
  valor por defeito do repositório — deve exigir opt-in explícito