---
name: test-structure
description: Estrutura e nomenclatura de testes
---

## Padrão AAA
Cada teste segue Arrange / Act / Assert, com separação clara (por
espaço em branco ou comentário se a framework não o fizer visualmente):

```
test("devolve erro quando o email já existe", () => {
  // Arrange
  const existingUser = createUser({ email: "a@b.com" });

  // Act
  const result = registerUser({ email: "a@b.com" });

  // Assert
  expect(result.error).toBe("EMAIL_TAKEN");
});
```

## Nomenclatura
- Descrição do teste em linguagem natural, descrevendo comportamento
  esperado, não a implementação (`"devolve erro quando..."`, não
  `"testa a função validateEmail"`)
- Agrupar testes do mesmo módulo/função num bloco `describe`/`context`
  com o nome da unidade a testar

## Regras
- Um teste, uma asserção lógica — se precisares de testar vários
  comportamentos não relacionados, são testes separados
- Sem lógica condicional (`if`/loop) dentro de um teste — se precisares
  disso, provavelmente são casos de teste separados ou testes
  parametrizados
- Setup repetido entre testes vai para `beforeEach`/fixture, não
  duplicado em cada teste
- Cada teste deve poder correr isoladamente e em qualquer ordem, sem
  depender do estado deixado por outro teste