// ============================================================
// Descrições / explicações dos critérios PAAC
// Renderizadas como tooltip/popover ao passar o mouse (desktop)
// ou tocar no ícone (mobile) ao lado de cada critério.
// ============================================================
//
// O texto deve ajudar o gestor a saber EXATAMENTE o que observar
// para atribuir N (Não atende), A (Atende) ou S (Supera).
// ============================================================

export const CRITERIA_DESCRIPTIONS = {
  // 1.1 — Conhecimento Técnico
  '1.1.1':
    'Avalia se o representante domina o mecanismo de ação dos produtos do portfólio Arese — como cada molécula atua no organismo e por que é eficaz para a indicação proposta. Domínio técnico transmite credibilidade ao médico.',
  '1.1.2':
    'Sabe a posologia recomendada (dose, frequência, duração), as apresentações disponíveis (mg, comprimidos por caixa) e os preços de mercado dos produtos. Informação básica que precisa estar na ponta da língua.',
  '1.1.3':
    'Conhece os concorrentes diretos: nomes comerciais, princípios ativos, posicionamento de mercado, pontos fortes e fracos. Sem essa visão, não há como argumentar diferenciais.',
  '1.1.4':
    'Participa ativamente das atividades da Academia Arese (cursos, treinamentos, simulações) e aplica o que aprende no dia-a-dia em campo.',

  // 1.2 — Roteiros e Média de Visitação
  '1.2.1':
    'Conhece o território (geografia, especialidades, perfil dos médicos), segue o roteiro definido pela empresa e faz boa programação semanal/mensal das visitas.',
  '1.2.2':
    'A média de visitas por dia/semana está dentro da meta do ciclo. Se está abaixo, há perda de oportunidades de prescrição.',

  // 1.3 — Planejamento Estratégico
  '1.3.1':
    'O painel de médicos no Portal está atualizado: nomes corretos, especialidades, endereços, telefones, horários de atendimento e dias preferenciais. Painel desatualizado significa visitas perdidas.',
  '1.3.2':
    'O painel contém quantidade adequada de médicos de alto potencial prescritivo — não é só quantidade, é qualidade do mix.',
  '1.3.3':
    'Tem identificados e registrados os principais médicos-alvo de cada produto do portfólio, com prioridade clara.',
  '1.3.4':
    'Avalia o orçamento disponível (amostras, brindes, eventos) e apresenta propostas de investimento com retorno esperado. Não gasta por gastar.',

  // 1.4 — Empreendedorismo
  '1.4.1':
    'Trata o setor como se fosse uma empresa própria — entende custos, retornos, oportunidades e desafios. Tem mentalidade de dono.',
  '1.4.2':
    'Está atento ao que acontece no setor e identifica chances de alavancar demanda (eventos, lançamentos, sazonalidade, ações da concorrência).',
  '1.4.3':
    'Em vez de esperar instruções, propõe ideias e ações para melhorar resultados. É proativo.',
  '1.4.4':
    'Quando há um desafio difícil, assume a responsabilidade em vez de transferir. Vê problemas como oportunidades de crescer.',
  '1.4.5':
    'Não fica na zona de conforto — estabelece metas ambiciosas e está disposto a tentar abordagens novas, mesmo correndo riscos.',

  // 2.1 — Pré-Visita
  '2.1.1':
    'Antes de entrar no consultório, sabe claramente o objetivo da visita — o que quer falar, quais argumentos usar, qual compromisso quer obter.',
  '2.1.2':
    'Consulta o histórico do médico no Portal antes de cada visita. Verifica o "Falado pelo Médico" da última visita para dar continuidade ao diálogo.',
  '2.1.3':
    'Conhece os hábitos prescritivos do médico (o que prescreve, em que situações, para que perfil de paciente) e os motivos das preferências.',
  '2.1.4':
    'Verifica o AUDIT (relatório de auditoria de prescrição/vendas) antes da visita e usa essa informação para definir a estratégia da abordagem.',
  '2.1.5':
    'Antes da visita, sabe quais concorrentes o médico costuma prescrever, pesquisa diferenciais e prepara argumentos específicos para neutralizá-los.',

  // 2.2.1 — Sintonia e Atitude
  '2.2.1.1':
    'Cria conexão genuína com o médico, conquistando interesse desde os primeiros segundos da visita. Não é "mais um propagandista".',
  '2.2.1.2':
    'Mesmo quando o médico desvia o assunto, sabe redirecionar a conversa de forma natural para os tópicos de interesse comercial.',
  '2.2.1.3':
    'A argumentação foca no benefício para o paciente — mostra como o produto Arese resolve a necessidade clínica melhor que alternativas.',
  '2.2.1.4':
    'Mantém postura confiante e não se intimida com o status do médico. Equilibra respeito profissional com segurança técnica. (Pontuar inverso: intimidação = N.)',
  '2.2.1.5':
    'Traz criatividade para a abordagem — não é robotizado. Adapta materiais promocionais com inovação para se diferenciar.',

  // 2.2.2 — Sondagens
  '2.2.2.1':
    'Faz perguntas estratégicas que revelam necessidades e preferências do médico. Aprofunda quando a resposta é superficial.',
  '2.2.2.2':
    'Sabe ouvir ativamente e captar informações relevantes. Identifica necessidades latentes que o médico nem mencionou diretamente.',

  // 2.2.3 — Apresentação e Argumentação
  '2.2.3.1':
    'Usa a grade de produtos com lógica e fluência — não pula etapas, não enrola.',
  '2.2.3.2':
    'Aplica o posicionamento estratégico e os "segredos de venda" definidos pela empresa para cada produto do ciclo.',
  '2.2.3.3':
    'Utiliza o material promocional vigente de forma adequada — não improvisa nem usa material velho. Explora os argumentos visuais.',
  '2.2.3.4':
    'A propaganda é fluente, com ênfase nas marcas, sem erros de terminologia médica/farmacológica.',
  '2.2.3.5':
    'Distribui amostras grátis estrategicamente — não como brinde, mas como ferramenta de prescrição. Documenta entrega.',

  // 2.2.4 — Compromisso
  '2.2.4.1':
    'Conecta o que ouviu nas sondagens com a solução Arese — mostra que prestou atenção, não apenas falou.',
  '2.2.4.2':
    'Lê os sinais de compra do médico e constrói raciocínio que conduz ao compromisso de prescrição.',
  '2.2.4.3':
    'Sintetiza a conversa e propõe acordos de prescrição claros e específicos — quantos pacientes, em quais situações.',
  '2.2.4.4':
    'Nas visitas seguintes, retoma o acordo combinado anteriormente para verificar se foi cumprido.',
  '2.2.4.5':
    'Cobra de forma firme e respeitosa o compromisso assumido. Não deixa promessa sem follow-up.',

  // 2.4 — Pós-Visita
  '2.4.1':
    'Logo após a visita, sintetiza as informações e sinais mais importantes captados — antes de esquecer detalhes.',
  '2.4.2':
    'Registra o "Falado pelo Médico" no Portal em tempo real (no mesmo dia da visita). Não deixa para depois.',
  '2.4.3':
    'Define um Objetivo da Próxima Visita (OPV) específico e registra no Portal — assim a próxima visita já começa com plano.',

  // 3.1 — Ferramentas de Análises
  '3.1.1':
    'Sabe interpretar o relatório "Análise de Demanda" — entende quais produtos estão evoluindo, quais estão estagnados e quais ações tomar.',
  '3.1.2':
    'Conhece as campanhas vigentes, busca atingir os melhores resultados e entende as regras dos regulamentos.',

  // ============================================================
  // PAAC PDV
  // ============================================================

  // 1.1 — Pré-Visita — Planejamento
  '1.1.1.pdv':
    'Antes de entrar no PDV, consulta no Portal: categoria do PDV, unidades vendidas no último mês, comentários da última visita.',

  // 1.2 — Definição de Prioridades
  '1.2.1.pdv':
    'Com base no histórico do Portal, define quais produtos serão prioritários nesta visita e que ações tomar para explorar o potencial.',

  // 2.1 — Os 4 Pilares do PDV
  '2.1.1':
    'Disponibilidade — o estoque tem volume adequado e o mix de produtos correto para a categoria do PDV.',
  '2.1.2':
    'Visibilidade — produtos estão expostos em local de destaque e na categoria correta (cardio na seção certa, etc.).',
  '2.1.3':
    'Educacional — mensagem assertiva passada aos balconistas, com treinamentos efetivos quando necessário.',
  '2.1.4':
    'Negociação Comercial — contribui efetivamente para o faturamento do PDV, melhorando ticket médio e margem.',

  // 3.1 — Cadastros de PDVs
  // (3.1.1 e 3.1.2 já estão acima, mas com sentido diferente — usar prefixo)
  '3.1.1.pdv':
    'A maioria dos PDVs cadastrados são de categoria alta (A, B). A agenda é ajustada conforme as atualizações de potencial.',
  '3.1.2.pdv':
    'Cadastro do PDV está atualizado: nomes dos principais influenciadores (gerentes, balconistas-chave), endereços, contatos e horários.',

  // 4.1 — Agentes do PDV
  '4.1.1':
    'Com base nos objetivos da visita, identifica quem são os agentes-chave do PDV (gerente, balconista, técnico) e prioriza a abordagem com cada um.',
  '4.1.2':
    'Vê o PDV como sistema — identifica oportunidades concretas de melhorar conversão (vendas/atendimento), reduzir trocas e gerar recomendações ativas.',
  '4.1.3':
    'Usa material promocional adequado nas abordagens com balconistas e gerentes — não vai "no improviso".',

  // 5.1 — Estratégia e Abordagem
  '5.1.1':
    'A abordagem segue uma estrutura: Desperta Interesse, faz Perguntas Relevantes, Apresenta Soluções com entusiasmo e convicção genuínos.',
  '5.1.2':
    'Fecha compromissos claros e específicos com os agentes do PDV — não sai sem um próximo passo combinado.',
};

/**
 * Resolve a descrição de um critério.
 * Algumas chaves se repetem entre PAAC Demanda e PDV (ex: 1.1.1, 2.1.1).
 * Para PDV, tenta primeiro a chave com sufixo `.pdv`, depois cai pra chave base.
 */
export function getCriteriaDescription(key, type = 'demanda') {
  if (!key) return null;
  if (type === 'pdv') {
    const pdvKey = `${key}.pdv`;
    if (CRITERIA_DESCRIPTIONS[pdvKey]) return CRITERIA_DESCRIPTIONS[pdvKey];
  }
  return CRITERIA_DESCRIPTIONS[key] || null;
}
