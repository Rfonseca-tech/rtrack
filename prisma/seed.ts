import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Areas
  console.log('Creating Areas...');
  const areasData = [
    { name: "Societária", description: "Societária" },
    { name: "Tributária", description: "Tributária" },
    { name: "Fiscal", description: "Fiscal" },
    { name: "Trabalhista", description: "Trabalhista" },
    { name: "Cível", description: "Cível" },
    { name: "LGPD", description: "LGPD" },
    { name: "Finanças", description: "Finanças" },
    { name: "RDES - Direito Empresarial da Saúde", description: "RDES - Direito Empresarial da Saúde" },
  ];

  for (const area of areasData) {
    await prisma.area.upsert({
      where: { name: area.name },
      update: {},
      create: area,
    });
  }

  // 2. Create Product Families
  console.log('Creating Product Families...');
  const familiesData = [
    { code: "SOC.01", name: "Planejamento Patrimonial Sucessório", description: "" },
    { code: "SOC.02", name: "Governança Societária", description: "" },
    { code: "SOC.03", name: "Assessoria Extrajudicial Societária", description: "" },
    { code: "SOC.04", name: "Assessoria Jurídica em M&A", description: "" },
    { code: "SOC.05", name: "Due Dilligence Societária", description: "" },
    { code: "SOC.06", name: "Gestão de Riscos Legais Societários", description: "" },
    { code: "SOC.07", name: "Consultoria Societária Permanente", description: "" },
    { code: "SOC.08", name: "Assessoria em Processos Administrativos", description: "" },
    { code: "SOC.09", name: "Assessoria em Processos Judiciais", description: "" },
    { code: "TRI.01", name: "Assessoria Extrajudicial Tributária", description: "" },
    { code: "TRI.02", name: "Regimes Especiais de Tributação (RET)", description: "" },
    { code: "TRI.03", name: "Planejamento Tributário", description: "" },
    { code: "TRI.04", name: "Renegociação Tributária", description: "" },
    { code: "TRI.05", name: "Recuperação de Crédito Tributário", description: "" },
    { code: "TRI.06", name: "Teses Tributárias", description: "" },
    { code: "TRI.07", name: "Estruturação de Cost Sharing", description: "" },
    { code: "TRI.08", name: "Estruturação de Centro de Serviços Compartilhados", description: "" },
    { code: "TRI.09", name: "Due Diligence Tributária", description: "" },
    { code: "TRI.10", name: "Gestão de Riscos Fiscais", description: "" },
    { code: "TRI.11", name: "Gestão de Riscos Contábeis", description: "" },
    { code: "TRI.12", name: "Equiparação Hospitalar", description: "" },
    { code: "TRI.13", name: "Pagamento por Serviços Ambientais", description: "" },
    { code: "TRI.14", name: "Revisão e Declaração do IRPF", description: "" },
    { code: "TRI.15", name: "Assessoria em Processos Administrativos", description: "" },
    { code: "TRI.16", name: "Assessoria em Processos Judiciais", description: "" },
    { code: "TRI.17", name: "Consultoria Tributária Permanente", description: "" },
    { code: "TRI.18", name: "Assessoria em Juros Sobre Capital Próprio (JCP)", description: "" },
    { code: "TRI.19", name: "Tributação de Dividendos", description: "" },
    { code: "TRI.20", name: "Recuperação de Créditos de IPI", description: "" },
    { code: "TRI.21", name: "Dedução de IRPJ e CSLL Sobre Taxa SELIC", description: "" },
    { code: "TRA.01", name: "Governança Trabalhista", description: "" },
    { code: "TRA.02", name: "Assessoria Extrajudicial Trabalhista", description: "" },
    { code: "TRA.03", name: "Gestão de Riscos Legais Trabalhistas", description: "" },
    { code: "TRA.04", name: "Auditoria Trabalhista", description: "" },
    { code: "TRA.05", name: "Due Diligence Trabalhista", description: "" },
    { code: "TRA.06", name: "Revisão de FOPAG", description: "" },
    { code: "TRA.07", name: "Revisão de RAT e FAP", description: "" },
    { code: "TRA.08", name: "Assessoria em Processos Administrativos", description: "" },
    { code: "TRA.09", name: "Assessoria em Processos Judiciais", description: "" },
    { code: "TRA.10", name: "Consultoria Trabalhista Permanente", description: "" },
    { code: "TRA.11", name: "Consultoria Trabalhista Soft para Transportadoras", description: "" },
    { code: "TRA.12", name: "Governança de Pessoas e Compliance Trabalhista", description: "" },
    { code: "CIV.01", name: "Gestão de Riscos Legais Cíveis", description: "" },
    { code: "CIV.02", name: "Programa de Compliance", description: "" },
    { code: "CIV.03", name: "Assessoria Extrajudicial Cível", description: "" },
    { code: "CIV.04", name: "Adequação LC 213/2025", description: "" },
    { code: "CIV.05", name: "Due Diligence Cível", description: "" },
    { code: "CIV.06", name: "Proteção da Propriedade Intelectual", description: "" },
    { code: "CIV.07", name: "Assessoria em Processos Judiciais", description: "" },
    { code: "CIV.08", name: "Assessoria em Processos Administrativos", description: "" },
    { code: "CIV.09", name: "Consultoria Cível Permanente", description: "" },
    { code: "LGP.01", name: "Assessoria Extrajudicial LGPD", description: "" },
    { code: "LGP.02", name: "Gestão de Riscos Legais LGPD", description: "" },
    { code: "LGP.03", name: "Implantação LGPD", description: "" },
    { code: "LGP.04", name: "Assessoria em Processos Judiciais", description: "" },
    { code: "LGP.05", name: "Assessoria em Processos Administrativos", description: "" },
    { code: "F&E.01", name: "Governança Corporativa", description: "" },
    { code: "F&E.02", name: "Planejamento Estratégico", description: "" },
    { code: "F&E.03", name: "Governança Financeira", description: "" },
    { code: "F&E.04", name: "Análise de Viabilidade de Negócios", description: "" },
    { code: "F&E.05", name: "Captação de recursos e reestruturação de dívidas", description: "" },
    { code: "F&E.06", name: "Assessoria Financeira em M&A", description: "" },
    { code: "F&E.07", name: "Valuation", description: "" },
    { code: "F&E.08", name: "Due Diligence Financeira", description: "" },
    { code: "F&E.09", name: "Wealth Management", description: "" },
    { code: "F&E.10", name: "Parceria Contábil", description: "" },
    { code: "DES.01", name: "Direito Empresarial da Saúde", description: "" },
    { code: "FIS.01", name: "Auditoria Fiscal Preventiva", description: "" },
    { code: "FIS.02", name: "Revisão de SPED Fiscal e Contábil", description: "" },
  ];

  for (const fam of familiesData) {
    await prisma.productFamily.upsert({
      where: { code: fam.code },
      update: {},
      create: fam,
    });
  }

  // 3. Create Products
  console.log('Creating Products...');
  const productsData = [
    { code: "SOC.01.1", name: "Planejamento Patrimonial Sucessório - Simplificado", description: "Holding e Acordo de Sócios", familyCode: "SOC.01" },
    { code: "SOC.01.2", name: "Planejamento Patrimonial Sucessório - com Governança Familiar", description: "Holding, Acordo de Sócios, Protocolo de Família e Conselho de Família", familyCode: "SOC.01" },
    { code: "SOC.01.3", name: "Planejamento Patrimonial Sucessório - Internacional", description: "", familyCode: "SOC.01" },
    { code: "SOC.02.1", name: "Governança Societária - Planejamento Societário", description: "", familyCode: "SOC.02" },
    { code: "SOC.02.2", name: "Governança Societária - Planejamento Societário Internacional", description: "", familyCode: "SOC.02" },
    { code: "SOC.02.3", name: "Governança Societária - Compliance Societário", description: "Elaboração e revisão de contratos sociais e acordos de sócios. Escopo que pode ser contratado a parte, mas já está incluído em Planejamento Societário", familyCode: "SOC.02" },
    { code: "SOC.02.4", name: "Governança Societária - Programa de Incentivo (Partnership)", description: "", familyCode: "SOC.02" },
    { code: "SOC.03.1", name: "Assessoria Extrajudicial Societária", description: "Compra e venda, incorporação e fusão de empresas", familyCode: "SOC.03" },
    { code: "SOC.04.1", name: "Assessoria Jurídica em M&A", description: "Compra e venda, incorporação e fusão de empresas", familyCode: "SOC.04" },
    { code: "SOC.05.1", name: "Due Dilligence Societária", description: "", familyCode: "SOC.05" },
    { code: "SOC.06.1", name: "Gestão de Riscos Legais Societários", description: "", familyCode: "SOC.06" },
    { code: "SOC.07.1", name: "Consultoria Societária Permanente", description: "Sempre vinculado a contratos por prazo indeterminado", familyCode: "SOC.07" },
    { code: "SOC.08.1", name: "Assessoria em Processos Administrativos", description: "", familyCode: "SOC.08" },
    { code: "SOC.09.1", name: "Assessoria em Processos Judiciais", description: "", familyCode: "SOC.09" },
    { code: "TRI.01.1", name: "Assessoria Extrajudicial Tributária - Parecer", description: "Pontual", familyCode: "TRI.01" },
    { code: "TRI.02.1", name: "Regimes Especiais de Tributação (RET) - Diagnóstico", description: "", familyCode: "TRI.02" },
    { code: "TRI.02.2", name: "Regimes Especiais de Tributação (RET) - Adesão CD Geral", description: "", familyCode: "TRI.02" },
    { code: "TRI.02.3", name: "Regimes Especiais de Tributação (RET) - Adesão E-commerce", description: "", familyCode: "TRI.02" },
    { code: "TRI.02.4", name: "Regimes Especiais de Tributação (RET) - Adesão Corredor de Importação", description: "", familyCode: "TRI.02" },
    { code: "TRI.03.1", name: "Planejamento Tributário - Diagnóstico", description: "", familyCode: "TRI.03" },
    { code: "TRI.03.2", name: "Planejamento Tributário - Planejamento", description: "", familyCode: "TRI.03" },
    { code: "TRI.03.3", name: "Planejamento Tributário - Planejamento Internacional", description: "Geralmente vinculado ao planejamento societário", familyCode: "TRI.03" },
    { code: "TRI.03.4", name: "Planejamento Tributário - Planejamento Reforma Tributária", description: "", familyCode: "TRI.03" },
    { code: "TRI.03.5", name: "Planejamento Tributário - Gestão de Eficiência Tributária", description: "", familyCode: "TRI.03" },
    { code: "TRI.04.1", name: "Renegociação Tributária - Diagnóstico", description: "", familyCode: "TRI.04" },
    { code: "TRI.04.2", name: "Renegociação Tributária - Parcelamentos Convencionais", description: "", familyCode: "TRI.04" },
    { code: "TRI.04.3", name: "Renegociação Tributária - Transação Tributária por Adesão", description: "", familyCode: "TRI.04" },
    { code: "TRI.04.4", name: "Renegociação Tributária - Transação Tributária Customizada", description: "", familyCode: "TRI.04" },
    { code: "TRI.05.1", name: "Recuperação de Crédito Tributário", description: "", familyCode: "TRI.05" },
    { code: "TRI.06.1", name: "Teses Tributárias - Exclusão do ISS da base do PIS/COFINS", description: "", familyCode: "TRI.06" },
    { code: "TRI.06.2", name: "Teses Tributárias - Exclusão do PIS/COFINS das próprias bases", description: "", familyCode: "TRI.06" },
    { code: "TRI.06.3", name: "Teses Tributárias - Exclusão do ICMS ST da base do PIS/COFINS", description: "", familyCode: "TRI.06" },
    { code: "TRI.06.4", name: "Teses Tributárias - Manutenção do ICMS na base de créditos do PIS/COFINS", description: "", familyCode: "TRI.06" },
    { code: "TRI.07.1", name: "Estruturação de Cost Sharing", description: "", familyCode: "TRI.07" },
    { code: "TRI.08.1", name: "Estruturação de Centro de Serviços Compartilhados - CSC", description: "", familyCode: "TRI.08" },
    { code: "TRI.09.1", name: "Due Diligence Tributária", description: "", familyCode: "TRI.09" },
    { code: "TRI.10.1", name: "Gestão de Riscos Fiscais", description: "", familyCode: "TRI.10" },
    { code: "TRI.11.1", name: "Gestão de Riscos Contábeis", description: "", familyCode: "TRI.11" },
    { code: "TRI.12.1", name: "Equiparação Hospitalar", description: "", familyCode: "TRI.12" },
    { code: "TRI.13.1", name: "Pagamento por Serviços Ambientais - PSA", description: "", familyCode: "TRI.13" },
    { code: "TRI.14.1", name: "Revisão e Declaração do IRPF", description: "", familyCode: "TRI.14" },
    { code: "TRI.15.1", name: "Assessoria em Processos Administrativos", description: "", familyCode: "TRI.15" },
    { code: "TRI.16.1", name: "Assessoria em Processos Judiciais", description: "", familyCode: "TRI.16" },
    { code: "TRI.17.1", name: "Consultoria Tributária Permanente", description: "Sempre vinculado a contratos por prazo indeterminado", familyCode: "TRI.17" },
    { code: "TRI.18.1", name: "Assessoria em Juros Sobre Capital Próprio (JCP)", description: "Serviço de análise, cálculo e elaboração da documentação necessária para pagamento de Juros sobre Capital Próprio, garantindo conformidade tributária e societária.", familyCode: "TRI.18" },
    { code: "TRI.19.1", name: "Tributação de Dividendos", description: "Análise e elaboração dos procedimentos necessários para distribuição regular de dividendos, garantindo conformidade com normas societárias e tributárias.", familyCode: "TRI.19" },
    { code: "TRI.20.1", name: "Recuperação de Créditos de IPI", description: "Recuperação de créditos de IPI em âmbito administrativo e/ou Judicial.", familyCode: "TRI.20" },
    { code: "TRI.21.1", name: "Dedução de IRPJ e CSLL Sobre Taxa SELIC", description: "Dedução de IRPJ e CSLL sobre Taxa Selic.", familyCode: "TRI.21" },
    { code: "TRA.01.1", name: "Governança Trabalhista", description: "Construção de Manual de Cultura, Código de Conduta, Políticas e Treinamento", familyCode: "TRA.01" },
    { code: "TRA.02.1", name: "Assessoria Extrajudicial Trabalhista", description: "Pontual", familyCode: "TRA.02" },
    { code: "TRA.03.1", name: "Gestão de Riscos Legais Trabalhistas", description: "", familyCode: "TRA.03" },
    { code: "TRA.04.1", name: "Auditoria Trabalhista", description: "", familyCode: "TRA.04" },
    { code: "TRA.05.1", name: "Due Diligence Trabalhista", description: "", familyCode: "TRA.05" },
    { code: "TRA.06.1", name: "Revisão de FOPAG", description: "", familyCode: "TRA.06" },
    { code: "TRA.07.1", name: "Revisão de RAT e FAP", description: "", familyCode: "TRA.07" },
    { code: "TRA.08.1", name: "Assessoria em Processos Administrativos", description: "", familyCode: "TRA.08" },
    { code: "TRA.09.1", name: "Assessoria em Processos Judiciais", description: "", familyCode: "TRA.09" },
    { code: "TRA.10.1", name: "Consultoria Trabalhista Permanente", description: "Sempre vinculado a contratos por prazo indeterminado", familyCode: "TRA.10" },
    { code: "TRA.11.1", name: "Consultoria Trabalhista Soft para Transportadoras", description: "Serviço contínuo de acompanhamento trabalhista voltado ao setor de transporte, com foco preventivo em rotinas, riscos e adequações legais.", familyCode: "TRA.11" },
    { code: "TRA.12.1", name: "Governança de Pessoas e Compliance Trabalhista", description: "Estruturação e acompanhamento de boas práticas de gestão de pessoas, políticas internas e compliance trabalhista para reduzir riscos e melhorar processos de RH.", familyCode: "TRA.12" },
    { code: "CIV.01.1", name: "Gestão de Riscos Legais Cíveis", description: "", familyCode: "CIV.01" },
    { code: "CIV.02.1", name: "Programa de Compliance", description: "", familyCode: "CIV.02" },
    { code: "CIV.03.1", name: "Assessoria Extrajudicial Cível", description: "Pontual - elaboração e revisão de documentos jurídicos, participação em negociações, acordo, etc", familyCode: "CIV.03" },
    { code: "CIV.04.1", name: "Adequação LC 213/2025", description: "", familyCode: "CIV.04" },
    { code: "CIV.05.1", name: "Due Diligence Cível", description: "", familyCode: "CIV.05" },
    { code: "CIV.06.1", name: "Proteção da Propriedade Intelectual - Registro de Marcas", description: "", familyCode: "CIV.06" },
    { code: "CIV.06.2", name: "Proteção da Propriedade Intelectual - Registro Internacional de Marcas", description: "Assessoria completa para registro de marca em outros países, incluindo análise de viabilidade, busca de anterioridade e condução do processo junto a organismos internacionais.", familyCode: "CIV.06" },
    { code: "CIV.06.3", name: "Proteção da Propriedade Intelectual - Registro de Patentes", description: "", familyCode: "CIV.06" },
    { code: "CIV.07.1", name: "Assessoria em Processos Judiciais", description: "", familyCode: "CIV.07" },
    { code: "CIV.08.1", name: "Assessoria em Processos Administrativos", description: "", familyCode: "CIV.08" },
    { code: "CIV.09.1", name: "Consultoria Cível Permanente", description: "Sempre vinculado a contratos por prazo indeterminado", familyCode: "CIV.09" },
    { code: "LGP.01.1", name: "Assessoria Extrajudicial LGPD", description: "Pontual", familyCode: "LGP.01" },
    { code: "LGP.02.1", name: "Gestão de Riscos Legais LGPD", description: "", familyCode: "LGP.02" },
    { code: "LGP.03.1", name: "Implantação LGPD", description: "", familyCode: "LGP.03" },
    { code: "LGP.04.1", name: "Assessoria em Processos Judiciais", description: "", familyCode: "LGP.04" },
    { code: "LGP.05.1", name: "Assessoria em Processos Administrativos", description: "", familyCode: "LGP.05" },
    { code: "F&E.01.1", name: "Governança Corporativa", description: "", familyCode: "F&E.01" },
    { code: "F&E.02.1", name: "Planejamento Estratégico", description: "", familyCode: "F&E.02" },
    { code: "F&E.03.1", name: "Governança Financeira", description: "", familyCode: "F&E.03" },
    { code: "F&E.04.1", name: "Análise de Viabilidade de Negócios", description: "", familyCode: "F&E.04" },
    { code: "F&E.05.1", name: "Captação de recursos e reestruturação de dívidas", description: "", familyCode: "F&E.05" },
    { code: "F&E.06.1", name: "Assessoria Financeira em M&A", description: "", familyCode: "F&E.06" },
    { code: "F&E.07.1", name: "Valuation", description: "", familyCode: "F&E.07" },
    { code: "F&E.08.1", name: "Due Diligence Financeira", description: "", familyCode: "F&E.08" },
    { code: "F&E.09.1", name: "Wealth Management", description: "", familyCode: "F&E.09" },
    { code: "F&E.10.1", name: "Parceria Contábil", description: "", familyCode: "F&E.10" },
    { code: "DES.01.1", name: "Direito Empresarial da Saúde", description: "Assessoria jurídica multidisciplinar voltada para empresas da área da saúde.", familyCode: "DES.01" },
    { code: "FIS.01.1", name: "Auditoria Fiscal Preventiva", description: "Revisão completa das obrigações fiscais e procedimentos tributários da empresa para identificar riscos, inconsistências e oportunidades de economia lícita.", familyCode: "FIS.01" },
    { code: "FIS.02.1", name: "Revisão de SPED Fiscal e Contábil", description: "Análise técnica dos arquivos SPED (Fiscal e Contábil) para identificação de erros, cruzamentos inconsistentes e riscos de autuação.", familyCode: "FIS.02" },
  ];

  for (const prod of productsData) {
    const family = await prisma.productFamily.findUnique({
      where: { code: prod.familyCode },
    });

    if (family) {
      await prisma.product.upsert({
        where: { code: prod.code },
        update: {
          name: prod.name,
          description: prod.description,
          familyId: family.id,
        },
        create: {
          code: prod.code,
          name: prod.name,
          description: prod.description,
          familyId: family.id,
        },
      });
    }
  }

  // 4. Create Users (ROOT)
  console.log('Creating ROOT User...');
  const rootEmail = 'saironbusatto@gmail.com';
  // Check if root exists

  // Note: we can't create trigger-based Auth users here easily without Supabase Admin API
  // checking functionality. For now, we will just ensure the PUBLIC user entry exists
  // assuming the Auth user will be created separately or synced. 
  // actually, for local dev, we might want to just insert into public table.

  await prisma.user.upsert({
    where: { email: rootEmail },
    update: { role: UserRole.ROOT },
    create: {
      email: rootEmail,
      name: 'Sairon Busatto',
      role: UserRole.ROOT,
      isActive: true,
      id: 'user_root_seed_id', // Fixed ID for seed
    },
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
