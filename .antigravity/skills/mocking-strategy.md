---
name: mocking-strategy
description: Quando mockar dependências vs usar a implementação real
---

## Quando mockar
- Chamadas de rede a serviços externos (APIs de terceiros, outros
  microserviços) — nunca depender de um serviço externo real estar
  disponível para um teste passar
- Tempo/data atual, quando o comportamento depende disso — mockar o
  relógio, não usar `Date.now()` real e assumir margens de tolerância
- Operações não determinísticas (números aleatórios, ordem de
  concorrência) quando o teste precisa de resultado previsível

## Quando NÃO mockar
- Lógica de negócio pura da própria aplicação — mockar isto esconde
  bugs reais de integração entre as partes
- Base de dados em testes de integração (usar uma instância de teste
  real ou in-memory, não mockar as queries) — testes unitários da
  lógica podem mockar a camada de acesso a dados, mas testes de
  integração devem validar a query real
- Mocks tão elaborados que reimplementam a lógica que supostamente
  estão a substituir — se o mock tem tanta lógica quanto o real, algo
  está mal desenhado

## Regras
- Mock o mínimo necessário para isolar o que estás a testar — mockar
  em excesso faz o teste validar os mocks, não o código
- Nunca deixar um mock desatualizado em relação à interface real que
  substitui — se a assinatura da função real mudar, o mock tem de
  mudar também
- Preferir fakes/stubs simples e explícitos a bibliotecas de mocking
  complexas, quando a diferença de esforço for pequena