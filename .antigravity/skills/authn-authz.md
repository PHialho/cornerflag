---
name: authn-authz
description: Convenções de autenticação e autorização
---

## Autenticação (quem és tu)
- Passwords sempre com hash forte e salted (bcrypt, argon2) — nunca
  MD5/SHA1 sem salt, nunca texto plano
- Tokens de sessão/JWT com expiração definida; nunca sem expiração
- Confirma o mecanismo já estabelecido no projeto (sessions, JWT,
  OAuth) antes de introduzir um novo

## Autorização (o que podes fazer)
- Verificar permissões no servidor, sempre — nunca confiar só em
  esconder botões/rotas no frontend
- Verificar a permissão específica da ação, não só "está autenticado"
  (ex: confirmar que o utilizador é dono do recurso antes de o editar,
  não só que está logado)
- Aplicar o princípio do menor privilégio por defeito — negar acesso
  a menos que explicitamente permitido, não o inverso

## Vulnerabilidades comuns a verificar
- **IDOR** (Insecure Direct Object Reference) — endpoints que aceitam
  um ID e não confirmam que o utilizador autenticado tem permissão
  sobre esse recurso específico
- **Escalação de privilégios** — um utilizador comum a conseguir
  atingir ações reservadas a admin através de manipulação de input
- **Sessões que não expiram** ao fazer logout ou trocar password

## Regras
- Nunca implementar criptografia ou hashing customizado — usar sempre
  bibliotecas estabelecidas e revistas (nunca "inventar" um algoritmo)
- Comparação de tokens/hashes sempre em tempo constante quando a
  linguagem/biblioteca o oferecer, para evitar timing attacks
- Erros de autenticação não devem revelar se foi o email/username ou a
  password que estava errada — mensagem genérica em ambos os casos