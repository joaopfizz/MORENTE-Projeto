// Gera dois documentos Word para a reunião com Wagner.
// Rode com: node docs/generate-docs.cjs

const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  PageBreak,
} = require('docx');

const OUT_DIR = path.join(__dirname);

// ============================================================
// DESIGN TOKENS
// ============================================================

const FONT = 'Arial';
const COLOR_INK = '0B1120';
const COLOR_GOLD = 'B58A2B';
const COLOR_MUTED = '666666';
const COLOR_BG_HEADER = 'F4F1EA';
const COLOR_BORDER = 'CCCCCC';

// 1 polegada = 1440 DXA. US Letter content width with 1" margins = 9360 DXA
const PAGE_W = 12240;
const PAGE_H = 15840;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ============================================================
// HELPERS
// ============================================================

const styles = {
  default: {
    document: { run: { font: FONT, size: 22 } }, // 11pt
  },
  paragraphStyles: [
    {
      id: 'Title',
      name: 'Title',
      basedOn: 'Normal',
      next: 'Normal',
      run: { font: FONT, size: 44, bold: true, color: COLOR_INK },
      paragraph: { spacing: { before: 0, after: 120 }, alignment: AlignmentType.LEFT },
    },
    {
      id: 'Subtitle',
      name: 'Subtitle',
      basedOn: 'Normal',
      next: 'Normal',
      run: { font: FONT, size: 22, color: COLOR_MUTED, italics: true },
      paragraph: { spacing: { before: 0, after: 360 } },
    },
    {
      id: 'Heading1',
      name: 'Heading 1',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: { font: FONT, size: 32, bold: true, color: COLOR_INK },
      paragraph: { spacing: { before: 400, after: 160 }, outlineLevel: 0 },
    },
    {
      id: 'Heading2',
      name: 'Heading 2',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: { font: FONT, size: 26, bold: true, color: COLOR_GOLD },
      paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 },
    },
    {
      id: 'Heading3',
      name: 'Heading 3',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: { font: FONT, size: 22, bold: true, color: COLOR_INK },
      paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 },
    },
    {
      id: 'Eyebrow',
      name: 'Eyebrow',
      basedOn: 'Normal',
      next: 'Normal',
      run: { font: FONT, size: 18, bold: true, color: COLOR_GOLD, allCaps: true },
      paragraph: { spacing: { before: 80, after: 40 } },
    },
    {
      id: 'Caption',
      name: 'Caption',
      basedOn: 'Normal',
      next: 'Normal',
      run: { font: FONT, size: 18, color: COLOR_MUTED, italics: true },
      paragraph: { spacing: { before: 60, after: 60 } },
    },
  ],
};

const numbering = {
  config: [
    {
      reference: 'questions',
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        },
      ],
    },
    {
      reference: 'bullets',
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        },
        {
          level: 1,
          format: LevelFormat.BULLET,
          text: '◦',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
        },
      ],
    },
    {
      reference: 'clauses',
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: 'CLÁUSULA %1ª',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 0, hanging: 0 } } },
        },
      ],
    },
  ],
};

// helpers
const p = (text, opts = {}) =>
  new Paragraph({ children: [new TextRun({ text, ...opts })], ...opts.paragraph });

const h1 = (text) =>
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });

const h2 = (text) =>
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });

const h3 = (text) =>
  new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });

const eyebrow = (text) =>
  new Paragraph({ style: 'Eyebrow', children: [new TextRun(text)] });

const caption = (text) =>
  new Paragraph({ style: 'Caption', children: [new TextRun(text)] });

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, ...opts })],
  });

const bullet = (text) =>
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun(text)],
    spacing: { after: 60 },
  });

const subbullet = (text) =>
  new Paragraph({
    numbering: { reference: 'bullets', level: 1 },
    children: [new TextRun(text)],
    spacing: { after: 60 },
  });

const question = (text, hint) => {
  const children = [
    new Paragraph({
      numbering: { reference: 'questions', level: 0 },
      spacing: { before: 120, after: 60 },
      children: [new TextRun({ text, bold: true })],
    }),
  ];
  if (hint) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        indent: { left: 720 },
        children: [
          new TextRun({ text: 'Por quê: ', italics: true, color: COLOR_GOLD, bold: true }),
          new TextRun({ text: hint, italics: true, color: COLOR_MUTED }),
        ],
      })
    );
  }
  return children;
};

// Espaço pra anotação
const noteLine = () =>
  new Paragraph({
    spacing: { after: 120 },
    indent: { left: 720 },
    border: {
      bottom: { color: COLOR_BORDER, style: BorderStyle.SINGLE, size: 6, space: 6 },
    },
    children: [new TextRun({ text: ' ', size: 22 })],
  });

const noteBlock = (lines = 3) => {
  const out = [
    new Paragraph({
      spacing: { before: 80, after: 40 },
      indent: { left: 720 },
      children: [
        new TextRun({
          text: 'Resposta / observação:',
          italics: true,
          size: 18,
          color: COLOR_MUTED,
        }),
      ],
    }),
  ];
  for (let i = 0; i < lines; i++) out.push(noteLine());
  return out;
};

// Tabela 2 colunas (chave/valor)
const kvRow = (k, v, isHeader = false) => {
  const border = { color: COLOR_BORDER, style: BorderStyle.SINGLE, size: 4 };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 3120, type: WidthType.DXA },
        shading: isHeader
          ? { fill: COLOR_INK, type: ShadingType.CLEAR }
          : { fill: COLOR_BG_HEADER, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: k,
                bold: true,
                size: 20,
                color: isHeader ? 'FFFFFF' : COLOR_INK,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        borders,
        width: { size: 6240, type: WidthType.DXA },
        shading: isHeader
          ? { fill: COLOR_INK, type: ShadingType.CLEAR }
          : { fill: 'FFFFFF', type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: v,
                size: 20,
                color: isHeader ? 'FFFFFF' : COLOR_INK,
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

const kvTable = (rows) =>
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 6240],
    rows: rows.map((r) => kvRow(r[0], r[1], r[2])),
  });

// ============================================================
// DOC 1 — PERGUNTAS PARA A REUNIÃO
// ============================================================

function buildQuestionsDoc() {
  const children = [];

  // Capa
  children.push(eyebrow('Reunião · Apresentação · Negociação'));
  children.push(
    new Paragraph({
      style: 'Title',
      children: [new TextRun('Roteiro e Perguntas para a Reunião')],
    })
  );
  children.push(
    new Paragraph({
      style: 'Subtitle',
      children: [
        new TextRun(
          'Projeto Morente Academy — alinhamento comercial com Wagner e formalização do contrato.'
        ),
      ],
    })
  );

  // Resumo do acordo proposto
  children.push(h2('Resumo do acordo em discussão'));
  children.push(
    kvTable([
      ['Item', 'Condição', true],
      ['Valor de desenvolvimento', 'R$ 25.000,00 (total)'],
      ['Distribuição interna', 'R$ 8.333,33 por desenvolvedor (3 pessoas)'],
      ['Forma de pagamento (proposta)', '40% sinal · 30% marco intermediário · 30% entrega final'],
      ['Participação nos resultados', '15% sobre receita bruta de cada licença/venda'],
      ['Distribuição da participação', '5% por desenvolvedor'],
      ['Manutenção mensal (opcional)', 'R$ 2.000,00 por dev — total R$ 6.000,00/mês'],
      ['Horas inclusas (proposta)', '10h/dev/mês — excedente cobrado por hora'],
    ])
  );

  // Bloco 1 — Sobre o projeto e a venda
  children.push(h1('1. Sobre o projeto e a venda'));
  children.push(
    body(
      'Estas perguntas têm o objetivo de eliminar zonas cinzentas sobre o que está sendo vendido, para quem, e em que condições.'
    )
  );

  const block1 = [
    [
      'Quem é o comprador final? A venda já está fechada ou é uma intenção de compra?',
      'Se ainda não há compromisso firme, estamos financiando especulação. Precisamos saber se haverá receita real para acionar os 15% de participação.',
    ],
    [
      'Por qual valor o produto será vendido / licenciado para essa empresa?',
      'É a base de cálculo da nossa participação. Sem essa informação, não há como verificar se o que recebemos está correto.',
    ],
    [
      'O contrato será firmado entre nós e você (Wagner) ou entre nós e a empresa compradora?',
      'Muda a relação jurídica. Se for direto com a compradora, simplifica auditoria, suporte e propriedade intelectual.',
    ],
    [
      'O que acontece se a venda não for concretizada? O pagamento dos R$ 25.000 está condicionado à venda?',
      'Precisa estar claro: o valor de desenvolvimento é pago independentemente da venda. Se está condicionado, é outro tipo de acordo (sociedade) e exige outras garantias.',
    ],
    [
      'Após a venda, quem é responsável por bugs, suporte ao usuário e manutenção evolutiva?',
      'Sem definição, qualquer problema cai em cima de nós “de favor”. Manutenção precisa ser remunerada ou explicitamente excluída do escopo.',
    ],
    [
      'Qual a data prevista de assinatura do contrato e do pagamento do sinal?',
      'Fechar a reunião com datas concretas evita o limbo do “a gente acerta depois”.',
    ],
  ];
  block1.forEach(([q, hint]) => {
    children.push(...question(q, hint));
    children.push(...noteBlock(2));
  });

  // Bloco 2 — Os 15%
  children.push(h1('2. Sobre os 15% de participação'));
  children.push(
    body(
      'Este é o ponto mais perigoso do acordo se mal definido. “Lucro” é manipulável; “receita bruta” é objetiva. Forçar a discussão técnica aqui evita anos de divergência.'
    )
  );

  const block2 = [
    [
      'Os 15% incidem sobre receita bruta de cada venda ou sobre lucro líquido?',
      'Defendemos receita bruta — não há como manipular. Lucro líquido depende de despesas declaradas e pode ser zero na prática.',
    ],
    [
      'A participação se aplica a quais vendas? Apenas a primeira venda ou todas as vendas/licenças futuras?',
      'É a diferença entre um bônus único e um royalty recorrente. Definição é obrigatória.',
    ],
    [
      'Os 15% são para a equipe (5% por dev) ou 15% para cada um?',
      'Pelo contexto, parece ser para a equipe (5% cada). Confirmar para evitar mal-entendido posterior.',
    ],
    [
      'Por quanto tempo recebemos a participação? Vitalício enquanto o produto for comercializado, ou prazo definido (5 anos, 10 anos)?',
      'Royalties de software costumam ter prazo definido. Sem isso, fica ambíguo se um dia será cancelado unilateralmente.',
    ],
    [
      'Como será a comprovação das vendas? Relatório periódico com lista de clientes e valores?',
      'Sem relatório, recebemos o que disserem que devemos receber. É o nosso direito de saber a base de cálculo.',
    ],
    [
      'Aceita cláusula de auditoria — direito de contratar contador independente uma vez por ano para verificar os números?',
      'É padrão em contratos de royalty. Sem auditoria, a participação vira ato de fé.',
    ],
    [
      'Qual a periodicidade de pagamento da participação? Trimestral, semestral?',
      'Trimestral é o mais comum em software. Define o fluxo de caixa para todos.',
    ],
    [
      'E se a empresa compradora sublicenciar/repassar o produto a terceiros? Recebemos sobre essas vendas em cascata?',
      'Sem essa cláusula, perdemos receita assim que houver primeira revenda.',
    ],
  ];
  block2.forEach(([q, hint]) => {
    children.push(...question(q, hint));
    children.push(...noteBlock(2));
  });

  // Bloco 3 — Manutenção
  children.push(h1('3. Sobre a manutenção (R$ 2.000/dev/mês)'));
  children.push(
    body(
      'R$ 2.000 por dev por mês é um valor compatível com escopo limitado. Sem teto de horas e SLA, o serviço se torna ilimitado pelo mesmo preço.'
    )
  );

  const block3 = [
    [
      'Quantas horas por mês os R$ 2.000 cobrem? Proposta: 10h/dev/mês, excedente cobrado a R$ 250/h.',
      'Sem teto, qualquer pedido cai sobre o time. Definir piso e teto é proteção mútua.',
    ],
    [
      'O que está incluso? Bugs, ajustes pequenos de UI, atualização de dependências.',
      'O que NÃO está incluso: novas features, refatorações grandes, suporte direto ao usuário final. Estes são orçamentos à parte.',
    ],
    [
      'Qual o SLA de atendimento? Crítico (4h úteis), Alto (1 dia útil), Médio (3 dias úteis), Baixo (próxima janela).',
      'Sem SLA, “urgência” é qualquer mensagem em qualquer horário.',
    ],
    [
      'Horário comercial de atendimento? Proposta: segunda a sexta, 9h às 18h.',
      'Plantão fora do horário deve ter custo adicional ou simplesmente não existir.',
    ],
    [
      'Reajuste anual do valor da manutenção? Proposta: IPCA na data de aniversário.',
      'R$ 2.000 hoje em 5 anos vale metade. Reajuste preserva o valor real.',
    ],
    [
      'Prazo mínimo do contrato de manutenção? Proposta: 6 ou 12 meses.',
      'Para viabilizar o setup operacional. Cancelamento com aviso prévio de 30 dias.',
    ],
  ];
  block3.forEach(([q, hint]) => {
    children.push(...question(q, hint));
    children.push(...noteBlock(2));
  });

  // Bloco 4 — Contrato
  children.push(h1('4. Sobre o contrato (inegociável)'));
  children.push(
    body(
      'Sem contrato assinado, não há compromisso. Esta seção é para alinhar prazos e responsabilidades sobre a formalização.'
    )
  );

  const block4 = [
    [
      'Concorda em formalizar todos os termos discutidos hoje em contrato escrito antes do início do próximo marco de desenvolvimento?',
      'Pergunta de fechamento. Resposta “não” ou esquiva = sinal de risco grave.',
    ],
    [
      'Qual a data limite para a assinatura do contrato? Proposta: até 7 dias após esta reunião.',
      'Sem prazo, “depois” vira “nunca”.',
    ],
    [
      'Wagner contratará na pessoa física (CPF) ou via empresa (CNPJ)? Quem assina pela contratante?',
      'Define como emitimos NF e como executamos cobrança em caso de inadimplência.',
    ],
    [
      'Concorda com cessão de propriedade intelectual condicionada ao pagamento integral? Enquanto não houver pagamento total, o código é da equipe.',
      'É a nossa principal garantia. Sem isso, a parte contratante recebe o produto antes de pagar.',
    ],
    [
      'Concorda com cláusula de confidencialidade mútua (NDA)?',
      'Padrão em contratos comerciais. Protege as duas pontas.',
    ],
    [
      'Concorda com cláusulas de multa por atraso de pagamento (2% + juros 1% a.m. + correção)?',
      'Sem multa, atraso é gratuito.',
    ],
  ];
  block4.forEach(([q, hint]) => {
    children.push(...question(q, hint));
    children.push(...noteBlock(2));
  });

  // Bloco 5 — Cronograma e próximos passos
  children.push(h1('5. Cronograma e próximos passos'));
  children.push(body('Sair da reunião com cronograma escrito.'));

  children.push(h3('Para fechar nesta reunião:'));
  [
    'Data de assinatura do contrato',
    'Data de pagamento do sinal (40%)',
    'Data do próximo marco de entrega (com escopo definido)',
    'Data do marco final',
    'Pessoa responsável pela elaboração da minuta (proposta: nossa parte envia primeira versão)',
  ].forEach((t) => children.push(bullet(t)));

  children.push(h3('Linhas vermelhas — quando devemos sair da reunião:'));
  [
    'Resistência a colocar acordo em contrato escrito',
    'Recusa do sinal (40%) na assinatura',
    'Pedido de acesso ao código-fonte / repositório antes do pagamento',
    'Mudança unilateral de escopo durante a reunião sem ajuste de valor',
    'Pressão para entrega antes de pagamento estruturado',
  ].forEach((t) => children.push(bullet(t)));

  // Quadro de combinados
  children.push(h2('Combinados ao final da reunião'));
  children.push(
    kvTable([
      ['Combinado', 'Detalhe / Data', true],
      ['Assinatura do contrato', ''],
      ['Pagamento do sinal (40%)', ''],
      ['Marco intermediário', ''],
      ['Entrega final', ''],
      ['Manutenção contratada?', ''],
      ['Vigência da participação (15%)', ''],
      ['Próxima reunião / follow-up', ''],
    ])
  );

  children.push(caption('Documento preparado para uso interno da equipe técnica.'));

  return new Document({
    styles,
    numbering,
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: PAGE_H },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        children,
      },
    ],
  });
}

// ============================================================
// DOC 2 — MOCK DE CONTRATO
// ============================================================

function buildContractDoc() {
  const children = [];

  // Cabeçalho
  children.push(eyebrow('Modelo · Versão de discussão'));
  children.push(
    new Paragraph({
      style: 'Title',
      children: [
        new TextRun({
          text: 'Contrato de Prestação de Serviços de Desenvolvimento de Software',
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      style: 'Subtitle',
      children: [
        new TextRun(
          'Modelo preliminar para discussão. Recomenda-se revisão por advogado antes da assinatura.'
        ),
      ],
    })
  );

  // Qualificação das partes
  children.push(h2('Qualificação das Partes'));

  children.push(
    body(
      'CONTRATANTE: [Nome completo / Razão Social], [nacionalidade], [estado civil], inscrito(a) no CPF/CNPJ sob o nº [______________], com endereço em [endereço completo].',
      { bold: false }
    )
  );

  children.push(
    body(
      'CONTRATADOS (em conjunto, "DESENVOLVEDORES"):'
    )
  );
  children.push(
    bullet(
      '[Nome do Desenvolvedor 1], [nacionalidade], [estado civil], CPF nº [______________], endereço [______________]'
    )
  );
  children.push(
    bullet(
      '[Nome do Desenvolvedor 2], [nacionalidade], [estado civil], CPF nº [______________], endereço [______________]'
    )
  );
  children.push(
    bullet(
      '[Nome do Desenvolvedor 3], [nacionalidade], [estado civil], CPF nº [______________], endereço [______________]'
    )
  );

  children.push(
    body(
      'As partes acima qualificadas têm entre si justo e contratado o presente Contrato de Prestação de Serviços de Desenvolvimento de Software, que se regerá pelas cláusulas e condições a seguir.'
    )
  );

  // Cláusula 1 — Objeto
  children.push(h2('Cláusula 1ª — Do Objeto'));
  children.push(
    body(
      '1.1. O presente contrato tem por objeto o desenvolvimento, pelos DESENVOLVEDORES, do produto digital denominado "Morente Academy" (doravante "PRODUTO"), conforme escopo descrito no Anexo I.'
    )
  );
  children.push(
    body(
      '1.2. O PRODUTO consiste em aplicação web para desenvolvimento de liderança de representantes de propaganda médica, contemplando módulos de avaliação (PAAC), formação (Academy), missões coletivas com feed social (Athivar) e acompanhamento de evolução (Evoluthion).'
    )
  );

  // Cláusula 2 — Escopo
  children.push(h2('Cláusula 2ª — Do Escopo dos Serviços'));
  children.push(body('2.1. Estão inclusos no escopo:'));
  [
    'Desenvolvimento da aplicação conforme especificação do Anexo I;',
    'Implementação dos módulos descritos na cláusula 1.2;',
    'Entrega do código-fonte ao final, mediante pagamento integral;',
    'Documentação técnica básica (README de instalação e arquitetura).',
  ].forEach((t) => children.push(bullet(t)));

  children.push(body('2.2. NÃO estão inclusos no presente escopo:'));
  [
    'Hospedagem, infraestrutura e custos de servidor;',
    'Suporte ao usuário final;',
    'Manutenção evolutiva após a entrega final (objeto do Anexo II — opcional);',
    'Funcionalidades não constantes no Anexo I, que serão objeto de aditivo contratual.',
  ].forEach((t) => children.push(bullet(t)));

  // Cláusula 3 — Valor
  children.push(h2('Cláusula 3ª — Do Valor e da Forma de Pagamento'));
  children.push(
    body(
      '3.1. O valor total dos serviços de desenvolvimento é de R$ 25.000,00 (vinte e cinco mil reais), a ser pago pela CONTRATANTE aos DESENVOLVEDORES conforme os marcos abaixo:'
    )
  );

  children.push(
    kvTable([
      ['Marco', 'Percentual / Valor', true],
      ['Sinal — assinatura deste contrato', '40% — R$ 10.000,00, em até 5 (cinco) dias úteis após a assinatura'],
      ['Marco intermediário — entrega da v1 funcional', '30% — R$ 7.500,00, em até 5 (cinco) dias úteis após o aceite'],
      ['Entrega final — homologação e handover', '30% — R$ 7.500,00, em até 5 (cinco) dias úteis após o aceite'],
    ])
  );

  children.push(
    body(
      '3.2. Os pagamentos serão divididos em partes iguais entre os 3 (três) DESENVOLVEDORES, mediante depósito ou transferência (PIX/TED) nas contas indicadas em anexo.'
    )
  );
  children.push(
    body(
      '3.3. O atraso no pagamento de qualquer parcela acarretará multa de 2% (dois por cento) sobre o valor devido, juros de mora de 1% (um por cento) ao mês e correção monetária pelo IPCA, sem prejuízo das demais sanções previstas neste contrato.'
    )
  );
  children.push(
    body(
      '3.4. O atraso superior a 15 (quinze) dias autoriza a suspensão imediata dos serviços, sem prejuízo do direito dos DESENVOLVEDORES de pleitear rescisão contratual e cobrança das parcelas vencidas e vincendas.'
    )
  );

  // Cláusula 4 — Cronograma
  children.push(h2('Cláusula 4ª — Do Cronograma'));
  children.push(
    body(
      '4.1. O cronograma de execução é o seguinte:'
    )
  );
  children.push(
    kvTable([
      ['Etapa', 'Prazo', true],
      ['Assinatura do contrato e pagamento do sinal', '[Data]'],
      ['Entrega do marco intermediário (v1)', '[Data — sugerido: 30 dias após sinal]'],
      ['Entrega final', '[Data — sugerido: 60 a 90 dias após sinal]'],
    ])
  );
  children.push(
    body(
      '4.2. Atrasos da CONTRATANTE em fornecer informações, aprovações ou pagamentos suspendem proporcionalmente os prazos de entrega.'
    )
  );

  // Cláusula 5 — Participação nos resultados
  children.push(h2('Cláusula 5ª — Da Participação nos Resultados (Royalty)'));
  children.push(
    body(
      '5.1. Adicionalmente ao valor previsto na Cláusula 3ª, a CONTRATANTE pagará aos DESENVOLVEDORES, a título de participação, o equivalente a 15% (quinze por cento) sobre a RECEITA BRUTA auferida com o licenciamento, comercialização, cessão de uso ou qualquer forma de monetização do PRODUTO.'
    )
  );
  children.push(
    body(
      '5.2. Para os fins deste contrato, RECEITA BRUTA é o valor total recebido pela CONTRATANTE em razão de cada operação envolvendo o PRODUTO, antes de quaisquer descontos, abatimentos ou despesas, incluindo, sem limitação, vendas diretas, sublicenciamentos e contratos de assinatura.'
    )
  );
  children.push(
    body(
      '5.3. A participação será dividida em partes iguais entre os 3 (três) DESENVOLVEDORES, cabendo a cada um o equivalente a 5% (cinco por cento) da receita bruta.'
    )
  );
  children.push(
    body(
      '5.4. A participação será paga trimestralmente, até o 15º (décimo quinto) dia útil do mês subsequente ao trimestre encerrado, acompanhada de relatório contendo:'
    )
  );
  [
    'Lista de operações realizadas no trimestre;',
    'Identificação dos clientes ou licenciados;',
    'Valor bruto de cada operação;',
    'Cálculo detalhado da participação devida.',
  ].forEach((t) => children.push(bullet(t)));

  children.push(
    body(
      '5.5. Os DESENVOLVEDORES poderão, mediante aviso prévio de 30 (trinta) dias e no máximo uma vez ao ano, contratar auditoria independente para verificação dos valores. As despesas correrão por conta dos DESENVOLVEDORES, salvo se a auditoria constatar diferença superior a 5% (cinco por cento) em desfavor destes, hipótese em que a CONTRATANTE arcará integralmente com os custos da auditoria, além de pagar o valor faltante com os encargos previstos na cláusula 3.3.'
    )
  );
  children.push(
    body(
      '5.6. A participação será devida pelo prazo de 5 (cinco) anos contados da entrega final do PRODUTO, podendo ser renovada por igual período mediante acordo escrito entre as partes.'
    )
  );

  // Cláusula 6 — Manutenção
  children.push(h2('Cláusula 6ª — Da Manutenção (opcional)'));
  children.push(
    body(
      '6.1. A contratação dos serviços de manutenção é facultativa e, se contratada, seguirá os termos do Anexo II, com valor de R$ 2.000,00 (dois mil reais) por desenvolvedor por mês — total de R$ 6.000,00 (seis mil reais) mensais.'
    )
  );
  children.push(
    body(
      '6.2. Os serviços de manutenção compreendem:'
    )
  );
  [
    'Correção de erros (bugs) reportados em produção;',
    'Pequenos ajustes visuais e textuais;',
    'Atualização de dependências de segurança;',
    'Limite de 10 (dez) horas por desenvolvedor por mês — totalizando 30 (trinta) horas mensais.',
  ].forEach((t) => children.push(bullet(t)));
  children.push(
    body(
      '6.3. Não estão incluídos na manutenção: desenvolvimento de novas funcionalidades, refatorações estruturais, suporte direto ao usuário final, treinamentos, e quaisquer atividades que excedam as horas mensais contratadas. Tais atividades serão objeto de orçamento à parte, com valor-hora de R$ 250,00 (duzentos e cinquenta reais).'
    )
  );
  children.push(
    body(
      '6.4. Os SLAs de atendimento são:'
    )
  );
  children.push(
    kvTable([
      ['Severidade', 'Tempo de resposta', true],
      ['Crítica (produto fora do ar)', '4 horas úteis'],
      ['Alta (funcionalidade quebrada)', '1 dia útil'],
      ['Média (ajuste necessário)', '3 dias úteis'],
      ['Baixa (melhoria sugerida)', 'Próximo ciclo de manutenção'],
    ])
  );
  children.push(
    body(
      '6.5. O atendimento ocorrerá em dias úteis, de segunda a sexta-feira, das 9h às 18h.'
    )
  );
  children.push(
    body(
      '6.6. O contrato de manutenção terá prazo mínimo de 6 (seis) meses, com renovação automática por iguais períodos, e poderá ser rescindido por qualquer das partes mediante aviso prévio escrito de 30 (trinta) dias.'
    )
  );
  children.push(
    body(
      '6.7. Os valores da manutenção serão reajustados anualmente pelo IPCA, na data de aniversário do contrato.'
    )
  );

  // Cláusula 7 — Propriedade intelectual
  children.push(h2('Cláusula 7ª — Da Propriedade Intelectual'));
  children.push(
    body(
      '7.1. Os direitos de propriedade intelectual sobre o PRODUTO, incluindo código-fonte, documentação e ativos digitais, serão de titularidade dos DESENVOLVEDORES até o pagamento integral do valor previsto na Cláusula 3ª.'
    )
  );
  children.push(
    body(
      '7.2. Quitado integralmente o valor de desenvolvimento, os DESENVOLVEDORES cederão à CONTRATANTE, em caráter definitivo e irrevogável, os direitos patrimoniais sobre o PRODUTO, ressalvada a participação prevista na Cláusula 5ª.'
    )
  );
  children.push(
    body(
      '7.3. Enquanto não houver a quitação prevista no item 7.1, fica vedada à CONTRATANTE a utilização comercial, sublicenciamento, cessão ou disponibilização do PRODUTO a terceiros, sob pena de rescisão imediata do contrato e cobrança das parcelas vencidas e vincendas, sem prejuízo de perdas e danos.'
    )
  );
  children.push(
    body(
      '7.4. Os DESENVOLVEDORES retêm o direito de mencionar o PRODUTO em portfólios profissionais, observado o disposto na cláusula de confidencialidade.'
    )
  );

  // Cláusula 8 — Sublicenciamento
  children.push(h2('Cláusula 8ª — Do Sublicenciamento e Revenda'));
  children.push(
    body(
      '8.1. A CONTRATANTE poderá sublicenciar, revender ou ceder o uso do PRODUTO a terceiros, observadas as obrigações de pagamento da participação prevista na Cláusula 5ª.'
    )
  );
  children.push(
    body(
      '8.2. Cada operação de sublicenciamento ou revenda integra a base de cálculo da participação, devendo ser informada no relatório trimestral.'
    )
  );

  // Cláusula 9 — Confidencialidade
  children.push(h2('Cláusula 9ª — Da Confidencialidade'));
  children.push(
    body(
      '9.1. As partes obrigam-se mutuamente a manter sigilo sobre todas as informações comerciais, técnicas, financeiras e estratégicas a que tenham acesso em razão deste contrato, durante sua vigência e pelo prazo de 3 (três) anos após o término.'
    )
  );
  children.push(
    body(
      '9.2. A obrigação de confidencialidade não se aplica a informações: (i) já públicas; (ii) obtidas legitimamente de terceiros; (iii) reveladas por ordem judicial.'
    )
  );

  // Cláusula 10 — Rescisão
  children.push(h2('Cláusula 10ª — Da Rescisão'));
  children.push(
    body(
      '10.1. O presente contrato poderá ser rescindido:'
    )
  );
  [
    'Por mútuo acordo entre as partes, formalizado por escrito;',
    'Por inadimplência de qualquer das partes, observado prazo de notificação prévia de 15 (quinze) dias para sanar a falha;',
    'Por descumprimento de obrigação essencial, com efeitos imediatos.',
  ].forEach((t) => children.push(bullet(t)));
  children.push(
    body(
      '10.2. Em caso de rescisão por inadimplência da CONTRATANTE, os DESENVOLVEDORES farão jus às parcelas vencidas, à proporção do trabalho executado até a data da rescisão e à multa rescisória de 20% (vinte por cento) sobre o saldo das parcelas vincendas.'
    )
  );
  children.push(
    body(
      '10.3. A rescisão deste contrato não extingue a obrigação de pagamento da participação prevista na Cláusula 5ª, sobre as receitas geradas até a data da rescisão.'
    )
  );

  // Cláusula 11 — Disposições gerais
  children.push(h2('Cláusula 11ª — Das Disposições Gerais'));
  children.push(
    body(
      '11.1. Este contrato representa o acordo integral entre as partes, substituindo entendimentos anteriores. Alterações somente serão válidas mediante aditivo escrito.'
    )
  );
  children.push(
    body(
      '11.2. O presente contrato não estabelece vínculo empregatício, societário ou de exclusividade entre as partes.'
    )
  );
  children.push(
    body(
      '11.3. A tolerância das partes quanto a eventuais infrações não constitui novação ou renúncia a direitos.'
    )
  );
  children.push(
    body(
      '11.4. Fica eleito o foro da Comarca de [Cidade/Estado], com renúncia a qualquer outro, ainda que mais privilegiado, para dirimir quaisquer questões oriundas deste contrato.'
    )
  );

  // Local e data
  children.push(new Paragraph({ children: [new TextRun(' ')], spacing: { before: 400, after: 200 } }));
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: '[Cidade], [Data]', size: 22 })],
    })
  );

  // Assinaturas
  children.push(new Paragraph({ children: [new TextRun(' ')], spacing: { before: 600, after: 0 } }));
  children.push(h3('Assinaturas'));

  const sigBlock = (label) => [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 0 },
      border: {
        top: { color: COLOR_INK, style: BorderStyle.SINGLE, size: 6, space: 6 },
      },
      children: [new TextRun(' ')],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: label, bold: true, size: 20 })],
    }),
  ];

  sigBlock('CONTRATANTE — [Nome]').forEach((x) => children.push(x));
  sigBlock('DESENVOLVEDOR 1 — [Nome]').forEach((x) => children.push(x));
  sigBlock('DESENVOLVEDOR 2 — [Nome]').forEach((x) => children.push(x));
  sigBlock('DESENVOLVEDOR 3 — [Nome]').forEach((x) => children.push(x));

  // Página de testemunhas (opcional)
  children.push(new Paragraph({ children: [new TextRun(' ')], spacing: { before: 400 } }));
  children.push(h3('Testemunhas'));
  sigBlock('Testemunha 1 — [Nome] — CPF [______________]').forEach((x) => children.push(x));
  sigBlock('Testemunha 2 — [Nome] — CPF [______________]').forEach((x) => children.push(x));

  // Aviso final
  children.push(
    caption(
      'Este modelo é uma versão preliminar para fins de discussão. Recomenda-se revisão por advogado antes da assinatura. Cláusulas marcadas com colchetes [ ] devem ser preenchidas com os dados reais das partes.'
    )
  );

  return new Document({
    styles,
    numbering,
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: PAGE_H },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        children,
      },
    ],
  });
}

// ============================================================
// EXECUTAR
// ============================================================

(async () => {
  const q = buildQuestionsDoc();
  const c = buildContractDoc();

  const qBuf = await Packer.toBuffer(q);
  const cBuf = await Packer.toBuffer(c);

  const qPath = path.join(OUT_DIR, 'Perguntas-Reuniao-Wagner.docx');
  const cPath = path.join(OUT_DIR, 'Modelo-Contrato-Demo.docx');

  fs.writeFileSync(qPath, qBuf);
  fs.writeFileSync(cPath, cBuf);

  console.log('OK:');
  console.log(' -', qPath);
  console.log(' -', cPath);
})();
