---
name: test-coverage-priorities
description: O que priorizar ao decidir que casos testar
---

## Ordem de prioridade
1. **Caminho normal (happy path)** — o comportamento esperado com
   input válido típico
2. **Casos de fronteira** — valores vazios, nulos, zero, negativos,
   strings muito longas, coleções vazias ou com um único elemento
3. **Casos de erro esperados** — input inválido, recursos não
   encontrados, permissões insuficientes — confirmar que o erro
   correto é devolvido/lançado (ver `error-taxonomy`)
4. **Interações entre partes** — se a função depende de outras, testar
   que a integração se comporta corretamente, não só cada parte isolada

## O que não vale a pena testar exaustivamente
- Getters/setters triviais sem lógica
- Código gerado automaticamente ou de bibliotecas de terceiros (testa
  a tua integração com elas, não o comportamento interno delas)
- Combinações exaustivas de inputs quando um representante de cada
  categoria já cobre o comportamento (não precisas de testar 50
  emails válidos diferentes, um chega)

## Regras
- 100% de cobertura de linhas não é o objetivo — cobertura de
  comportamento relevante é. Prioriza sempre lógica de negócio e
  código com histórico de bugs sobre código trivial
- Se encontrares um bug ao escrever testes, escreve primeiro o teste
  que o reproduz (falha), antes de sugerir a correção
- Testes de regressão obrigatórios para qualquer bug corrigido — sem
  isso, o mesmo bug pode voltar sem ser detetado