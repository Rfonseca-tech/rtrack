# Guia de Contribuição

Obrigado por considerar contribuir ao **Rtrack**! Este documento descreve como você pode ajudar a melhorar o projeto.

## Como Começar

1. **Fork** o repositório no GitHub.
2. **Clone** o seu fork:
   ```bash
   git clone https://github.com/SEU_USUARIO/Rtrack.git
   cd Rtrack
   ```
3. Crie uma **branch** para sua feature ou correção:
   ```bash
   git checkout -b nome-da-branch
   ```

## Boas Práticas

- Siga o padrão de código existente (ESLint, Prettier).
- Escreva testes unitários para novas funcionalidades.
- Atualize a documentação quando necessário.
- Mantenha os commits pequenos e claros.

## Submetendo Pull Requests

1. Commit suas alterações:
   ```bash
   git add .
   git commit -m "Descrição clara da mudança"
   ```
2. Envie a branch para o GitHub:
   ```bash
   git push origin nome-da-branch
   ```
3. Abra um **Pull Request** no repositório original.
   - Descreva o que foi alterado e por quê.
   - Relacione o PR a issues existentes, se houver.

> **Dica:** Antes de abrir o PR, execute `npm test` para garantir que todos os testes passem.
