-- SQL Seed generated from Produto_Reformatributaria.txt
-- Creates Project: "Reforma Tributária - Completo"
-- Creates Hierarchy: Groups (1) -> Tasks (1.1) -> Subtasks (1.1.1)

DO $$
DECLARE
    v_project_id text;
    v_client_id text;
    v_group_1_id text;
    v_group_2_id text;
    v_group_3_id text;
    v_group_4_id text;
    v_group_5_id text;
    v_group_6_id text;
    v_group_7_id text;
    
    -- Variables for Level 1 tasks to link subtasks
    v_task_1_1_id text;
    
BEGIN
    -- 1. Ensure Client Exists (using the one created earlier or new one)
    SELECT id INTO v_client_id FROM clients WHERE "cnpj" = '12345678000199';
    IF v_client_id IS NULL THEN
        INSERT INTO clients ("id", "razaoSocial", "cnpj", "emailDomain", "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), 'Empresa Modelo S.A.', '12345678000199', 'modelo.com.br', true, now(), now())
        RETURNING id INTO v_client_id;
    END IF;

    -- 2. Create Project
    INSERT INTO projects ("id", "name", "familyCode", "clientId", "isActive", "progress", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), 'Reforma Tributária - Completo', 'TEST.01', v_client_id, true, 0, now(), now())
    RETURNING id INTO v_project_id;

    -- =============================================
    -- GROUP 1: ESTUDO DE IMPACTOS DA REFORMA TRIBUTÁRIA
    -- =============================================
    INSERT INTO tasks ("id", "projectId", "title", "status", "order", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_project_id, '1. ESTUDO DE IMPACTOS DA REFORMA TRIBUTÁRIA', 'PENDING'::"TaskStatus", 10, now(), now())
    RETURNING id INTO v_group_1_id;

        -- 1.1 Liberação da procuração
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.1 Liberação da procuração eletrônica ou Upload de arquivos', 'Contabilidade', 'COMPLETED'::"TaskStatus", 11, now(), now())
        RETURNING id INTO v_task_1_1_id;
            
            -- 1.1.1
            INSERT INTO tasks ("id", "projectId", "parentId", "title", "status", "order", "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), v_project_id, v_task_1_1_id, '1.1.1 - subtarefa', 'PENDING'::"TaskStatus", 1, now(), now());
            
            -- 1.1.2
            INSERT INTO tasks ("id", "projectId", "parentId", "title", "status", "order", "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), v_project_id, v_task_1_1_id, '1.1.2 - subtarefa', 'PENDING'::"TaskStatus", 2, now(), now());

        -- 1.2 Definição de premissas
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.2 Definição de premissas para cálculo', 'Contabilidade', 'COMPLETED'::"TaskStatus", 12, now(), now());

        -- 1.3 Identificação de compras
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.3 Identificação de compras sem documentação fiscal integral', 'Cliente', 'COMPLETED'::"TaskStatus", 13, now(), now());

        -- 1.4 Identificação de vendas
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.4 Identificação de vendas sem documentação fiscal integral', 'Cliente', 'COMPLETED'::"TaskStatus", 14, now(), now());

        -- 1.5 Regime Fornecedor
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.5 Identificação do regime tributário de cada Fornecedor', 'Contabilidade', 'COMPLETED'::"TaskStatus", 15, now(), now());

        -- 1.6 Regime Cliente
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.6 Identificação do regime tributário de cada Cliente', 'Contabilidade', 'COMPLETED'::"TaskStatus", 16, now(), now());

        -- 1.7 Dados não contabilizados
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.7 Preparação de dados não contabilizados', 'Contabilidade', 'COMPLETED'::"TaskStatus", 17, now(), now());
        
        -- 1.8 Bases de cálculo não tributadas
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.8 Bases de cálculo não tributadas (Comodato, Locação...)', 'Contabilidade', 'COMPLETED'::"TaskStatus", 18, now(), now());

        -- 1.9 Análise de impactos
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.9 Análises dos impactos de preços líquidos x custos', 'Contabilidade', 'COMPLETED'::"TaskStatus", 19, now(), now());

        -- 1.10 Levantamento e análise
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.10 Levantamento e análise da perda de benefícios', 'Contabilidade', 'COMPLETED'::"TaskStatus", 20, now(), now());

        -- 1.11 Segregar aquisições
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.11 Segregar aquisições não geradoras de créditos', 'Contabilidade', 'COMPLETED'::"TaskStatus", 21, now(), now());

        -- 1.12 Simulações (Numero reptido no txt como 1.11, ajustado para sequencia)
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.12 Simulações de Créditos e Débitos', 'Contabilidade', 'COMPLETED'::"TaskStatus", 22, now(), now());

        -- 1.13 Simulação AR x DDR
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.13 Simulação de cenários AR x DDR', 'Contabilidade', 'COMPLETED'::"TaskStatus", 23, now(), now());

        -- 1.14 Multidimensionais
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.14 Análise dos impactos multidimensionais', 'Contabilidade', 'COMPLETED'::"TaskStatus", 24, now(), now());

        -- 1.15 Capital de Giro
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.15 Entendimento da necessidade de Capital de Giro', 'Contabilidade', 'COMPLETED'::"TaskStatus", 25, now(), now());

        -- 1.16 Preparação de Caixa
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.16 Preparação de Caixa e Soluções Financeiras', 'Cliente', 'COMPLETED'::"TaskStatus", 26, now(), now());
        
        -- 1.17 Comitê
        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), v_project_id, v_group_1_id, '1.17 Criação do Comitê de Reforma Tributária', 'Contabilidade', 'PENDING'::"TaskStatus", 27, now(), now());


    -- =============================================
    -- GROUP 2: SANEAMENTO DE CADASTROS E POLÍTICAS
    -- =============================================
    INSERT INTO tasks ("id", "projectId", "title", "status", "order", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_project_id, '2. SANEAMENTO DE CADASTROS E POLÍTICAS', 'PENDING'::"TaskStatus", 30, now(), now())
    RETURNING id INTO v_group_2_id;

        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt") VALUES
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.1 Saneamento de cadastro de Itens', 'Cliente', 'PENDING'::"TaskStatus", 31, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.2 Saneamento de cadastro de Fornecedores', 'Cliente', 'PENDING'::"TaskStatus", 32, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.3 Saneamento de cadastro de Clientes', 'Cliente', 'PENDING'::"TaskStatus", 33, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.4 Determinação do novo padrão de contratos com fornecedores', 'Jurídico', 'PENDING'::"TaskStatus", 34, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.5 Acompanhamento de regularidade tributária dos fornecedores', 'Jurídico', 'PENDING'::"TaskStatus", 35, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.6 Mudança nas políticas de compras e prazos de pagamento', 'Cliente', 'PENDING'::"TaskStatus", 36, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.7 Reavaliação de troca de Fornecedores', 'Cliente', 'PENDING'::"TaskStatus", 37, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.8 Reavaliação de Importações', 'Cliente', 'PENDING'::"TaskStatus", 38, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.9 Reavaliação de Exportações', 'Cliente', 'PENDING'::"TaskStatus", 39, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.10 Workshop para Fornecedores e Clientes', 'Contabilidade', 'PENDING'::"TaskStatus", 40, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_2_id, '2.11 Treinamento para Time Interno', 'Contabilidade', 'PENDING'::"TaskStatus", 41, now(), now());

    -- =============================================
    -- GROUP 3: DESDOBRAMENTOS EM VENDAS
    -- =============================================
    INSERT INTO tasks ("id", "projectId", "title", "status", "order", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_project_id, '3. DESDOBRAMENTOS EM VENDAS', 'PENDING'::"TaskStatus", 50, now(), now())
    RETURNING id INTO v_group_3_id;

        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt") VALUES
        (gen_random_uuid(), v_project_id, v_group_3_id, '3.1 Análise de competidores', 'Cliente', 'PENDING'::"TaskStatus", 51, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_3_id, '3.2 Alinhamento com Entidades e Associações', 'Cliente', 'PENDING'::"TaskStatus", 52, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_3_id, '3.3 Mudança no modelo de premiação e comissões sobre vendas', 'RH', 'PENDING'::"TaskStatus", 53, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_3_id, '3.4 Ajuste da formação do preço de venda', 'Vendas', 'PENDING'::"TaskStatus", 54, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_3_id, '3.5 Ajuste no modelo de contratos com clientes', 'Jurídico', 'PENDING'::"TaskStatus", 55, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_3_id, '3.6 Planejamento Estratégico Ano a Ano na Reforma', 'Cliente', 'PENDING'::"TaskStatus", 56, now(), now());

    -- =============================================
    -- GROUP 4: SISTEMAS DE GESTÃO
    -- =============================================
    INSERT INTO tasks ("id", "projectId", "title", "status", "order", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_project_id, '4. SISTEMAS DE GESTÃO', 'PENDING'::"TaskStatus", 60, now(), now())
    RETURNING id INTO v_group_4_id;

        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt") VALUES
        (gen_random_uuid(), v_project_id, v_group_4_id, '4.1 Definição de orçamento para investir em tecnologia', 'Tecnologia', 'PENDING'::"TaskStatus", 61, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_4_id, '4.2 Preparação de novos campos para atender obrigações acessórias do IBS e da CBS', 'Tecnologia', 'PENDING'::"TaskStatus", 62, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_4_id, '4.3 Preparação para escrituração completa de entradas', 'Financeiro', 'PENDING'::"TaskStatus", 63, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_4_id, '4.4 Implementação da solução para escrituração completa de entradas', 'Tecnologia', 'PENDING'::"TaskStatus", 64, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_4_id, '4.5 Mudança na emissão de notas fiscais', 'Tecnologia', 'PENDING'::"TaskStatus", 65, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_4_id, '4.6 Conciliação entre Split Payment e Apurações por Competência', 'Contabilidade', 'PENDING'::"TaskStatus", 66, now(), now());

    -- =============================================
    -- GROUP 5: PREPARAÇÃO FINANCEIRA
    -- =============================================
    INSERT INTO tasks ("id", "projectId", "title", "status", "order", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_project_id, '5. PREPARAÇÃO FINANCEIRA', 'PENDING'::"TaskStatus", 70, now(), now())
    RETURNING id INTO v_group_5_id;

        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt") VALUES
        (gen_random_uuid(), v_project_id, v_group_5_id, '5.1 Análise de impacto em capital de giro', 'Financeiro', 'PENDING'::"TaskStatus", 71, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_5_id, '5.2 Análise e renegociação de dívidas', 'Financeiro', 'PENDING'::"TaskStatus", 72, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_5_id, '5.3 Implementação de controles internos', 'Financeiro', 'PENDING'::"TaskStatus", 73, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_5_id, '5.4 Renegociação de prazos', 'Financeiro', 'PENDING'::"TaskStatus", 74, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_5_id, '5.5 Preparação do orçamento a partir dos impactos', 'Financeiro', 'PENDING'::"TaskStatus", 75, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_5_id, '5.6 Planejamento Tributário', 'Contabilidade', 'PENDING'::"TaskStatus", 76, now(), now());

     -- =============================================
    -- GROUP 6: POTENCIALIZAÇÃO DE CRÉDITOS TRIBUTÁRIOS
    -- =============================================
    INSERT INTO tasks ("id", "projectId", "title", "status", "order", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_project_id, '6. POTENCIALIZAÇÃO DE CRÉDITOS TRIBUTÁRIOS', 'PENDING'::"TaskStatus", 80, now(), now())
    RETURNING id INTO v_group_6_id;

        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt") VALUES
        (gen_random_uuid(), v_project_id, v_group_6_id, '6.1 Estratégia para créditos de abertura na transição', 'Contabilidade', 'PENDING'::"TaskStatus", 81, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_6_id, '6.2 Validar benefícios em convenção coletiva', 'RH', 'PENDING'::"TaskStatus", 82, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_6_id, '6.3 Análise de créditos tributários em potencial dos últimos 5 anos', 'Contabilidade', 'PENDING'::"TaskStatus", 83, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_6_id, '6.4 Implementação de créditos', 'Contabilidade', 'PENDING'::"TaskStatus", 84, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_6_id, '6.5 Gestão de ressercimento de eventuais créditos já acumulados', 'Contabilidade', 'PENDING'::"TaskStatus", 85, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_6_id, '6.6 Planejamento tributário para eventuais créditos acumulados', 'Contabilidade', 'PENDING'::"TaskStatus", 86, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_6_id, '6.7 Determinação dos melhores modelos para ampliar o creditamento', 'Contabilidade', 'PENDING'::"TaskStatus", 87, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_6_id, '6.8 Determinação do melhor momento para troca de créditos', 'Contabilidade', 'PENDING'::"TaskStatus", 88, now(), now());

    -- =============================================
    -- GROUP 7: LOGÍSTICA (O txt pular para 8.1?? Vou usar 7.x como lógico ou manter o 8.1?)
    -- O txt diz "(7) LOGÍSTICA" e depois "8.1 ...". Vou assumir que é erro de digitação no txt e usar 7.x para ser consistente com o grupo 7.
    -- =============================================
    INSERT INTO tasks ("id", "projectId", "title", "status", "order", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_project_id, '7. LOGÍSTICA', 'PENDING'::"TaskStatus", 90, now(), now())
    RETURNING id INTO v_group_7_id;

        INSERT INTO tasks ("id", "projectId", "parentId", "title", "assignedTo", "status", "order", "createdAt", "updatedAt") VALUES
        (gen_random_uuid(), v_project_id, v_group_7_id, '7.1 Análise do impacto tributário na cadeia de valor', 'Logística', 'PENDING'::"TaskStatus", 91, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_7_id, '7.2 Armazenagem, transporte, produção, distribuição, etc.', 'Logística', 'PENDING'::"TaskStatus", 92, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_7_id, '7.3 Redesenho das operações, com impacto financeiro efetivo', 'Financeiro', 'PENDING'::"TaskStatus", 93, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_7_id, '7.4 Mudança da estrutura logística', 'Logística', 'PENDING'::"TaskStatus", 94, now(), now()),
        (gen_random_uuid(), v_project_id, v_group_7_id, '7.5 Mudança de local de fábricas, x-docking e centros de distribuição', 'Logística', 'PENDING'::"TaskStatus", 95, now(), now());

END $$;
