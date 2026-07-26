---
name: error-taxonomy
description: Quando lançar exceção, devolver valor de erro, ou usar cada categoria de erro
---

## Exceção vs valor de retorno
- **Lançar exceção** — situação verdadeiramente excecional, que quebra
  a pré-condição da função e não deve ser ignorada silenciosamente
  (ex: ficheiro de configuração obrigatório em falta)
- **Devolver valor de erro** (`Result`/`Either`, `null` + verificação,
  tuplo `(valor, erro)`) — situação esperada como parte do fluxo normal
  (ex: utilizador não encontrado numa pesquisa, validação de input que
  falha). Quem chama deve poder decidir o que fazer sem `try/catch`
- Segue sempre o padrão já dominante no projeto — não misturar os dois
  estilos na mesma camada da aplicação sem motivo forte

## Categorias de erro
- **Erros de validação** — input do utilizador/cliente inválido.
  Recuperáveis, esperados, não devem gerar log `error` (ver `log-levels`)
- **Erros de sistema** — falha de infraestrutura (rede, disco, timeout).
  Normalmente recuperável via retry (ver `retry-strategy`)
- **Erros de programação** — invariante interna violada (ex: null
  inesperado onde a tipagem garantia que não seria). Nunca devem ser
  "engolidos" silenciosamente — indicam um bug a corrigir, não um
  caso a tratar graciosamente
- **Erros de negócio** — regra de domínio violada (ex: saldo
  insuficiente). Tratar como parte do fluxo normal, com mensagem clara

## Regras
- Nunca capturar uma exceção genérica (`except Exception`, `catch (e)`)
  sem re-lançar ou tratar explicitamente — esconde erros de programação
  reais
- Cada tipo de erro de negócio relevante deve ter uma classe/tipo
  próprio, não strings mágicas comparadas por igualdade
- Erros de programação nunca devem ser convertidos em erros "amigáveis"
  para o utilizador sem também serem reportados/logados como bug