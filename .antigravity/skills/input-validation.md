---
name: input-validation
description: Regras de validação de input em qualquer boundary externa
---

## Onde validar
Toda a fronteira onde dados entram vindos de fora do controlo direto
da aplicação: endpoints de API, formulários, argumentos de CLI,
ficheiros carregados, mensagens de filas/eventos, respostas de
serviços externos. Nunca assumir que o cliente (frontend, outro
serviço) já validou — validar sempre também no servidor.

## O que verificar
- Tipo e formato (ex: email válido, data no formato esperado)
- Limites (tamanho máximo de string, range numérico, tamanho de
  upload) — nunca aceitar tamanho ilimitado
- Whitelist em vez de blacklist sempre que possível (definir o que é
  permitido, não tentar enumerar tudo o que é proibido)

## Vetores comuns a prevenir
- **Injeção SQL** — usar sempre queries parametrizadas/prepared
  statements, nunca concatenar input diretamente numa query
- **XSS** — escapar/sanitizar output que inclui input do utilizador
  antes de renderizar em HTML
- **Path traversal** — nunca construir paths de ficheiro diretamente
  a partir de input do utilizador sem validar contra `../` e
  equivalentes
- **Command injection** — nunca passar input do utilizador diretamente
  para execução de shell; usar APIs que não invoquem uma shell, ou
  escapar rigorosamente

## Regras
- Rejeitar input inválido explicitamente (erro claro), nunca tentar
  "corrigir" silenciosamente e continuar com um valor adivinhado
- Validação de negócio (ex: saldo suficiente) é separada da validação
  de formato — não misturar as duas camadas
- Mensagens de erro de validação nunca devem revelar detalhes internos
  da implementação (ver `error-messages`)