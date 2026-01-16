# Guia de Início Rápido

Bem‑vindo ao **Rtrack**! Este guia ajudará você a configurar o ambiente de desenvolvimento e executar o projeto localmente.

## Pré‑requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 13+)
- **Git**

## Passos

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/Rtrack.git
   cd Rtrack
   ```
2. **Instalar dependências**
   ```bash
   npm install
   ```
3. **Configurar variáveis de ambiente**
   Copie o arquivo `.env.example` para `.env` e ajuste as credenciais do banco de dados.
4. **Executar migrações**
   ```bash
   npm run migrate
   ```
5. **Iniciar o servidor**
   ```bash
   npm run dev
   ```
   O aplicativo estará disponível em `http://localhost:3000`.

> **Dica:** Consulte a seção de arquitetura para entender a estrutura do projeto.
