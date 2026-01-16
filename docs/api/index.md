# Referência da API

Esta seção contém a documentação da API do **Rtrack**, focada no acompanhamento jurídico, financeiro e recomendações de IA.

## Endpoints

- `GET /api/status` – Verifica a saúde da aplicação.
- `GET /api/dashboard/{clientId}` – Retorna dados do dashboard para o cliente, incluindo progresso dos processos e status financeiro.
- `POST /api/processes` – Cria um novo processo jurídico.
- `GET /api/processes/{processId}` – Obtém detalhes e etapas de um processo.
- `POST /api/payments` – Registra um pagamento ou custo associado ao processo.
- `GET /api/payments/{processId}` – Lista pagamentos relacionados a um processo.
- `GET /api/ai/recommendations/{clientId}` – Retorna recomendações de produtos/serviços baseadas em IA.
- `GET /api/content/videos` – Lista vídeos disponíveis na plataforma **rcast**.
- `GET /api/content/articles` – Lista artigos de blog relevantes.

> Cada endpoint inclui parâmetros de consulta, exemplos de payload e códigos de erro típicos.
