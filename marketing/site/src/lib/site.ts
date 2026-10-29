// Dados centrais da Start Cont — uma fonte de verdade pro site inteiro.
// Fonte: conversa com o Rodrigo (15/09/2026), logos e posts em
// identidade/referencias-startcont/.

/**
 * URL pública do site. Em produção defina NEXT_PUBLIC_SITE_URL com o domínio
 * próprio; enquanto ele não existir, a Vercel informa o domínio de produção
 * (VERCEL_PROJECT_PRODUCTION_URL) e os canonicals continuam corretos.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  url: resolveSiteUrl().replace(/\/$/, ""),
  nome: "Start Cont",
  nomeCompleto: "Start Cont — Assessoria Contábil",
  slogan: "Nova fase. Novos tempos. Mesmo compromisso.",
  tagline: "Simplificamos o burocrático e facilitamos o caminho do empresário.",
  descricao:
    "Assessoria contábil em Belo Horizonte com atendimento humanizado e próximo para pessoas físicas e empresas — da simples regularização ao acompanhamento mensal de grandes empresas e indústrias. Atendimento presencial na Grande BH e online em todo o Brasil.",
  responsavel: "Rodrigo",
  telefoneExibicao: "(31) 98121-1758",
  telefoneE164: "+5531981211758",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "5531981211758",
  email: "startcontbh@outlook.com",
  instagram: "https://www.instagram.com/startcontassessoria",
  instagramHandle: "@startcontassessoria",
  // Preencher quando o cliente informar (ficam ocultos enquanto vazios).
  cnpj: "",
  crc: "",
  cidadeBase: { cidade: "Belo Horizonte", estado: "MG", regiao: "Grande BH" },
  // Atendimento preferencial presencial (Grande BH) + online no Brasil inteiro.
  areaAtendida: [
    "Belo Horizonte",
    "Contagem",
    "Betim",
    "Nova Lima",
    "Sabará",
    "Santa Luzia",
    "Ribeirão das Neves",
    "Vespasiano",
    "Lagoa Santa",
    "Ibirité",
  ],
  missao:
    "Simplificar o burocrático e facilitar o caminho do empresário, com uma contabilidade próxima, humana e estratégica.",
  visao:
    "Ser a assessoria contábil de referência na Grande BH para quem busca proximidade, confiança e resultado.",
  valores: [
    { nome: "Proximidade", texto: "Estamos perto, conversamos, ouvimos e entendemos." },
    { nome: "Confiança", texto: "Transparência em cada número e em cada orientação." },
    { nome: "Inovação", texto: "Tecnologia para entregar com agilidade e segurança." },
    { nome: "Resultados", texto: "Contabilidade que ajuda a sua empresa a crescer." },
  ],
};

export const diferenciais = [
  {
    titulo: "Atendimento humanizado",
    texto:
      "Estamos próximos, conversamos, ouvimos e entendemos. Você fala com quem cuida da sua empresa.",
    icone: "users",
  },
  {
    titulo: "Vamos até você",
    texto:
      "Visitamos sua empresa, conhecemos seus processos e vivemos a sua realidade.",
    icone: "pin",
  },
  {
    titulo: "Comunicação ágil e direta",
    texto:
      "Preferimos o WhatsApp e o telefone ao e-mail. Mais rápido, mais fácil, mais humano.",
    icone: "chat",
  },
  {
    titulo: "Tecnologia que transforma",
    texto:
      "Ferramentas modernas para garantir agilidade, segurança e excelência em cada entrega.",
    icone: "bulb",
  },
] as const;

/**
 * Quem aparece na seção "Equipe": o Rodrigo e, na segunda rolagem, a própria
 * marca falando em nome da empresa. Os nomes daqui também podem ser marcados
 * como responsáveis por um contato no CRM.
 */
export const equipe = [
  {
    nome: "Rodrigo Mendonça",
    cargo: "Contador · Fundador da Start Cont",
    frase:
      "Meu trabalho é simplificar o burocrático e facilitar o caminho do empresário — de perto, com atendimento personalizado.",
    foto: "/equipe/rodrigo.webp",
  },
  {
    nome: "Start Cont",
    cargo: "Assessoria Contábil · Belo Horizonte",
    frase:
      "Mais do que contabilidade: entendemos o seu negócio para cuidar do que realmente importa — o crescimento da sua empresa.",
    foto: "/marca/logo-circular.webp",
  },
];

/** Nomes que podem ser marcados como responsáveis no CRM. */
export const responsaveisCrm = ["Rodrigo Mendonça"] as const;

// ---------------------------------------------------------------------------
// Reels do Instagram
// ---------------------------------------------------------------------------

export type Reel = {
  /** Código do reel: o trecho depois de /reel/ na URL do Instagram. */
  shortcode: string;
  titulo: string;
  /** Uma linha de contexto mostrada abaixo do vídeo. */
  descricao: string;
  /** Etiqueta curta (aparece como tag no card). */
  tag?: string;
};

/**
 * Reel em destaque — aparece na primeira dobra da home.
 * Trocar aqui muda o vídeo do topo do site.
 */
export const reelDestaque: Reel = {
  shortcode: "DcTYBwvxfcK",
  titulo: "Contabilidade para barbearias e salões",
  descricao:
    "Implantação de sistemas de gestão, registro e homologação dos contratos de parceria entre salão e profissional parceiro, e a contabilidade completa do negócio.",
  tag: "Barbearias e salões",
};

/**
 * Demais reels — viram o carrossel da seção "Start Cont no Instagram".
 * Para adicionar um vídeo, copie o link no Instagram (Compartilhar → Copiar link),
 * pegue o código depois de /reel/ e acrescente um item aqui.
 * O reel em destaque não deve se repetir nessa lista (o filtro abaixo garante isso).
 */
export const reels: Reel[] = [];

/** Reels do carrossel, já sem o vídeo que está em destaque no topo. */
export function reelsCarrossel() {
  return reels.filter((r) => r.shortcode !== reelDestaque.shortcode);
}

export function reelUrl(shortcode: string) {
  return `https://www.instagram.com/reel/${shortcode}/`;
}

/** URL oficial de embed do Instagram (funciona em iframe, sem o embed.js). */
export function reelEmbedUrl(shortcode: string) {
  return `https://www.instagram.com/reel/${shortcode}/embed/`;
}

/** Opções do campo "Do que você precisa?" dos formulários. */
export const interesses = [
  "Abrir uma empresa",
  "Contabilidade para minha empresa",
  "Trocar de contador",
  "Planejamento tributário / Reforma",
  "Departamento pessoal",
  "Regularização fiscal (empresa, CPF, MEI)",
  "Imposto de Renda (pessoa física)",
  "Certificado digital (e-CNPJ / e-CPF)",
  "Outro assunto",
] as const;

// ---------------------------------------------------------------------------
// Reforma Tributária — prazo da opção do Simples Nacional para 2027
// ---------------------------------------------------------------------------

/** Último dia (horário de Brasília) para a opção do regime de IBS/CBS do 1º sem. de 2027. */
const PRAZO_SIMPLES_2027 = new Date("2026-09-30T23:59:59-03:00");

export function prazoSimplesAberto(agora = new Date()) {
  return agora <= PRAZO_SIMPLES_2027;
}

// ---------------------------------------------------------------------------
// Planos — a tabela de preços da home (seção #planos)
// ---------------------------------------------------------------------------

export type Plano = {
  slug: string;
  nome: string;
  /** Frase curta embaixo do nome do plano. */
  promessa: string;
  icone: "pessoa" | "maleta" | "loja" | "tesoura";
  /** Valor mínimo mensal, em reais. Sempre exibido como "a partir de". */
  precoMensal: number;
  itens: string[];
  /** Fecho do card, na caixa cinza. */
  nota: string;
  /** Assunto da mensagem do WhatsApp — entra depois de "tenho interesse no". */
  interesseWhatsapp: string;
  destaque?: boolean;
};

export const planos: Plano[] = [
  {
    slug: "mei",
    nome: "MEI",
    promessa: "Sua empresa em dia, sem complicação.",
    icone: "pessoa",
    precoMensal: 70,
    itens: [
      "Orientação na abertura e regularização",
      "Emissão e controle do DAS",
      "Declaração anual (DASN-SIMEI)",
      "Emissão de notas fiscais",
      "Atendimento via WhatsApp",
    ],
    nota: "Mais tranquilidade para você focar no que realmente importa: o seu trabalho.",
    interesseWhatsapp: "plano MEI",
  },
  {
    slug: "profissionais-pj",
    nome: "Profissionais PJ",
    promessa: "Mais organização e economia para a sua rotina.",
    icone: "maleta",
    precoMensal: 300,
    itens: [
      "Contabilidade completa",
      "Elaboração e envio das obrigações",
      "Emissão de notas fiscais",
      "Planejamento tributário",
      "Atendimento consultivo via WhatsApp",
    ],
    nota: "Segurança e orientação para você crescer com tranquilidade.",
    interesseWhatsapp: "plano para Profissionais PJ",
  },
  {
    slug: "comerciantes",
    nome: "Comerciantes",
    promessa: "Gestão contábil com foco no seu crescimento.",
    icone: "loja",
    precoMensal: 500,
    itens: [
      "Contabilidade completa",
      "Apuração de impostos (fiscal e tributário)",
      "Acompanhamento de indicadores",
      "Orientação para tomada de decisão",
      "Atendimento próximo e consultivo",
    ],
    nota: "Uma contabilidade que entende o seu dia a dia e impulsiona o resultado do seu negócio.",
    interesseWhatsapp: "plano para Comerciantes",
  },
  {
    slug: "salao-e-barbearia",
    nome: "Salão de Beleza e Barbearias",
    promessa: "Regularidade e tranquilidade com a Lei do Salão Parceiro.",
    icone: "tesoura",
    precoMensal: 500,
    destaque: true,
    itens: [
      "Contabilidade completa",
      "Aplicação da Lei do Salão Parceiro",
      "Registro do contrato de parceria",
      "Apuração de impostos (fiscal e tributário)",
      "Acompanhamento de indicadores",
      "Orientação para tomada de decisão",
      "Atendimento próximo e consultivo",
    ],
    nota: "Seu negócio valorizado, com segurança jurídica e foco no crescimento.",
    interesseWhatsapp: "plano para Salão de Beleza e Barbearias",
  },
];

/** Mensagem que já vai escrita no WhatsApp quando a pessoa clica num plano. */
export function mensagemPlano(plano: Plano) {
  return `Olá! Vim pelo site e tenho interesse no ${plano.interesseWhatsapp} (a partir de R$ ${plano.precoMensal} por mês). Pode me explicar como funciona?`;
}

/** Regimes e públicos atendidos — a faixa no rodapé da seção de planos. */
export const publicosAtendidos = [
  "MEI",
  "Profissionais PJ",
  "Comércio",
  "Salão de Beleza e Barbearias",
];

export const regimesAtendidos = [
  "Simples Nacional",
  "Lucro Presumido",
  "Lucro Real",
];

// ---------------------------------------------------------------------------
// Serviços — cada um vira uma página em /servicos/[slug]
// ---------------------------------------------------------------------------

export type PrecoServico = {
  /** Nome curto do item vendido, ex.: "e-CNPJ". */
  rotulo: string;
  /** Uma linha explicando para quem é. */
  detalhe: string;
  /** Valor em reais. */
  valor: number;
  /** Como o item aparece na mensagem do WhatsApp ("quero solicitar o ..."). */
  interesseWhatsapp: string;
};

export type Servico = {
  slug: string;
  titulo: string;
  resumo: string;
  icone:
    | "rocket"
    | "chart"
    | "percent"
    | "users"
    | "shield"
    | "document"
    | "certificado";
  destaque?: boolean;
  /**
   * Serviços com preço fixo (hoje só o certificado digital). Aparecem como
   * etiquetas no card do serviço e como cartões com botão de WhatsApp na
   * página. Serviços sob proposta simplesmente não têm este campo.
   */
  precos?: PrecoServico[];
  publico: "Pessoa física" | "Pessoa jurídica" | "Pessoa física e jurídica";
  interesse: (typeof interesses)[number];
  // SEO
  keyword: string;
  seoTitle: string;
  seoDescription: string;
  // Página
  h1: string;
  h1Destaque: string;
  /** Resposta direta logo no topo — ajuda Google e IAs (GEO). */
  intro: string;
  inclui: string[];
  paraQuem: string[];
  beneficios: { titulo: string; texto: string }[];
  etapas: { titulo: string; texto: string }[];
  faq: { pergunta: string; resposta: string }[];
  relacionados: string[];
};

export const servicos: Servico[] = [
  {
    slug: "contabilidade-para-empresas",
    titulo: "Contabilidade Mensal para Empresas",
    resumo:
      "Acompanhamento contábil e fiscal completo, da pequena empresa à indústria: impostos em dia, números confiáveis e um contador que conhece o seu negócio.",
    icone: "chart",
    destaque: true,
    publico: "Pessoa jurídica",
    interesse: "Contabilidade para minha empresa",
    keyword: "escritório de contabilidade em Belo Horizonte",
    seoTitle: "Escritório de Contabilidade em BH para Empresas",
    seoDescription:
      "Contabilidade mensal para comércio, serviços e indústrias em Belo Horizonte: fiscal, contábil e obrigações em dia, com atendimento humanizado pelo WhatsApp.",
    h1: "Contabilidade que entende o seu negócio e",
    h1Destaque: "cuida do que importa.",
    intro:
      "A contabilidade mensal da Start Cont mantém sua empresa em dia com o fisco e entrega informação clara para decidir: apuração de impostos, obrigações acessórias, balancetes e acompanhamento próximo — de pequenas empresas a grandes empresas e indústrias, em Belo Horizonte e em todo o Brasil.",
    inclui: [
      "Escrituração contábil e fiscal",
      "Apuração e guias de impostos no Simples Nacional, Lucro Presumido e Lucro Real",
      "Entrega das obrigações acessórias (SPED, DCTFWeb, EFD-Reinf e demais)",
      "Balancete, balanço patrimonial e DRE",
      "Emissão de certidões negativas de débitos",
      "Conversas periódicas para analisar os números com você",
    ],
    paraQuem: [
      "Comércios e lojas",
      "Prestadores de serviço",
      "Indústrias",
      "Empresas do Simples Nacional, Lucro Presumido e Lucro Real",
      "Empresas que querem trocar de contador",
      "Negócios em crescimento que precisam de números confiáveis",
    ],
    beneficios: [
      {
        titulo: "Atendimento humanizado",
        texto:
          "Você fala direto com quem cuida da sua empresa. Sem call center e sem número de protocolo.",
      },
      {
        titulo: "Vamos até você",
        texto:
          "Visitamos sua empresa, conhecemos seus processos e vivemos a sua realidade.",
      },
      {
        titulo: "Tecnologia a favor",
        texto:
          "Ferramentas modernas garantem agilidade, segurança e entregas dentro do prazo.",
      },
    ],
    etapas: [
      { titulo: "Diagnóstico", texto: "Analisamos a situação fiscal e contábil atual da empresa." },
      {
        titulo: "Transição tranquila",
        texto: "Se você já tem contador, cuidamos da troca de documentos e acessos.",
      },
      { titulo: "Rotina mensal", texto: "Impostos, obrigações e relatórios em dia, com calendário claro." },
      { titulo: "Acompanhamento", texto: "Conversas periódicas para transformar números em decisões." },
    ],
    faq: [
      {
        pergunta: "Como funciona a troca de contador?",
        resposta:
          "É mais simples do que parece. Depois da contratação, solicitamos ao contador anterior os documentos e arquivos da empresa, revisamos a situação fiscal e assumimos a rotina sem interromper as suas atividades.",
      },
      {
        pergunta: "A Start Cont atende indústrias e empresas de grande porte?",
        resposta:
          "Sim. Atendemos desde pequenas empresas até grandes empresas e indústrias, com acompanhamento mensal adaptado à complexidade de cada operação.",
      },
      {
        pergunta: "Como é o atendimento no dia a dia?",
        resposta:
          "Preferimos o WhatsApp e o telefone: é mais rápido, mais fácil e mais humano. Quando faz sentido, vamos até a sua empresa na Grande Belo Horizonte.",
      },
      {
        pergunta: "Quanto custa a contabilidade mensal?",
        resposta:
          "O valor depende do regime tributário, do volume de notas fiscais, do número de funcionários e da complexidade da operação. Fale com a gente pelo WhatsApp para receber uma proposta sob medida.",
      },
    ],
    relacionados: ["planejamento-tributario", "departamento-pessoal"],
  },
  {
    slug: "abertura-de-empresa",
    titulo: "Abertura de Empresa",
    resumo:
      "Assessoria completa em processos de abertura, apoio em licenças e definição de regime tributário.",
    icone: "rocket",
    publico: "Pessoa jurídica",
    interesse: "Abrir uma empresa",
    keyword: "abertura de empresa em Belo Horizonte",
    seoTitle: "Abertura de Empresa em BH com Contador",
    seoDescription:
      "Planejamento e assessoria na abertura da sua empresa em Belo Horizonte: tipo de empresa, CNAE e regime tributário certos, com a Start Cont. Fale pelo WhatsApp.",
    h1: "Abra sua empresa do jeito certo,",
    h1Destaque: "sem dor de cabeça.",
    intro:
      "A Start Cont oferece planejamento e assessoria na abertura da sua empresa — da escolha do tipo de empresa e do regime tributário ao acompanhamento dos registros e licenças — com atendimento próximo em Belo Horizonte e online para todo o Brasil.",
    inclui: [
      "Análise do modelo de negócio e escolha do tipo de empresa (MEI, SLU ou LTDA)",
      "Definição das atividades (CNAE) e do regime tributário mais vantajoso",
      "Contrato social e registro na Junta Comercial",
      "Acompanhamento dos registros e inscrições necessários",
      "Orientação sobre licenças de funcionamento",
      "Transformação de MEI em microempresa (ME)",
    ],
    paraQuem: [
      "Quem vai tirar a ideia do papel e abrir o primeiro CNPJ",
      "Profissionais autônomos que querem se formalizar como PJ",
      "MEIs que passaram do limite de faturamento ou precisam crescer",
      "Sócios que vão formalizar uma sociedade",
      "Empresas de outros estados que querem abrir filial em Minas Gerais",
      "Quem precisa de CNPJ para emitir nota fiscal e fechar contratos",
    ],
    beneficios: [
      {
        titulo: "Regime certo desde o início",
        texto:
          "Uma escolha errada na abertura pode custar caro por anos. Simulamos os cenários antes de decidir.",
      },
      {
        titulo: "Sem filas nem papelada",
        texto: "Você resolve tudo pelo WhatsApp e, quando precisar, vamos até você.",
      },
      {
        titulo: "Empresa pronta para operar",
        texto: "Você sai da abertura com a rotina fiscal e contábil já organizada.",
      },
    ],
    etapas: [
      { titulo: "Conversa inicial", texto: "Entendemos o seu negócio, os sócios e os planos para os próximos anos." },
      {
        titulo: "Planejamento",
        texto: "Definimos tipo de empresa, atividades e regime tributário com simulação de impostos.",
      },
      { titulo: "Registro", texto: "Cuidamos do contrato social, da Junta Comercial, do CNPJ e das inscrições." },
      {
        titulo: "Pronto para faturar",
        texto: "Você recebe a empresa regularizada e a orientação para emitir as primeiras notas.",
      },
    ],
    faq: [
      {
        pergunta: "Quanto tempo leva para abrir uma empresa em Belo Horizonte?",
        resposta:
          "Depende do tipo de empresa, da atividade e das licenças exigidas. Negócios de baixo risco costumam ter o CNPJ liberado em poucos dias; atividades que exigem vistoria ou licença específica podem levar mais. Na conversa inicial passamos uma previsão para o seu caso.",
      },
      {
        pergunta: "Qual o melhor regime tributário para a minha empresa?",
        resposta:
          "Não existe uma resposta única. Simples Nacional, Lucro Presumido e Lucro Real têm vantagens diferentes conforme a atividade, o faturamento, a folha de pagamento e o perfil dos clientes. Por isso fazemos uma simulação antes de abrir.",
      },
      {
        pergunta: "Dá para abrir a empresa sem sair de casa?",
        resposta:
          "Sim. Todo o processo pode ser feito online, com assinatura digital. Se preferir atendimento presencial, vamos até você na Grande BH.",
      },
      {
        pergunta: "Sou MEI. Quando devo virar microempresa?",
        resposta:
          "Quando o faturamento anual passar do limite do MEI, quando você precisar de sócio ou de mais funcionários, ou quando a sua atividade não for permitida no MEI. Avaliamos o momento certo e fazemos a transição sem interromper as suas vendas.",
      },
      {
        pergunta: "Vocês abrem empresas fora de Minas Gerais?",
        resposta:
          "Sim. Atendemos preferencialmente a Grande Belo Horizonte, mas trabalhamos com empresas de todo o Brasil de forma online.",
      },
    ],
    relacionados: ["contabilidade-para-empresas", "planejamento-tributario"],
  },
  {
    slug: "planejamento-tributario",
    titulo: "Planejamento Tributário e Reforma Tributária",
    resumo:
      "Pague o imposto justo, dentro da lei. Simulamos cenários, revisamos o regime e preparamos sua empresa para o IBS, a CBS e o Split Payment.",
    icone: "percent",
    publico: "Pessoa jurídica",
    interesse: "Planejamento tributário / Reforma",
    keyword: "planejamento tributário em Belo Horizonte",
    seoTitle: "Planejamento Tributário em BH e Reforma Tributária",
    seoDescription:
      "Simples Comum ou Simples Híbrido? A Start Cont simula cenários, revisa o regime tributário e prepara sua empresa para IBS, CBS e Split Payment. Fale conosco.",
    h1: "Imposto justo, dentro da lei, e",
    h1Destaque: "sua empresa pronta para a Reforma.",
    intro:
      "O planejamento tributário da Start Cont compara regimes e cenários para que a sua empresa pague o imposto justo, dentro da lei, e se prepare para a Reforma Tributária: a CBS a partir de 2027, a escolha entre Simples Comum e Simples Híbrido e a chegada do Split Payment.",
    inclui: [
      "Simulação entre Simples Nacional, Lucro Presumido e Lucro Real",
      "Análise Simples Comum × Simples Híbrido para 2027",
      "Impacto do IBS, da CBS e do Split Payment no fluxo de caixa",
      "Revisão de enquadramento, atividades (CNAE) e benefícios fiscais",
      "Análise do perfil de clientes: consumidor final × empresas",
      "Relatório com recomendação clara e próximos passos",
    ],
    paraQuem: [
      "Empresas do Simples Nacional que vendem para outras empresas (B2B)",
      "Indústrias, atacadistas e distribuidores",
      "Empresas que sentem que pagam imposto demais",
      "Negócios que cresceram e podem ter mudado de faixa",
      "Quem precisa decidir o regime de IBS e CBS para 2027",
      "Empresas que querem proteger o capital de giro",
    ],
    beneficios: [
      { titulo: "Economia dentro da lei", texto: "Decisões baseadas em números, não em achismo." },
      {
        titulo: "Antecipação",
        texto: "Quem se planeja e se antecipa transforma a mudança em vantagem.",
      },
      {
        titulo: "Caixa protegido",
        texto: "Entendemos o efeito do Split Payment antes que ele chegue ao seu caixa.",
      },
    ],
    etapas: [
      { titulo: "Levantamento", texto: "Reunimos faturamento, custos, folha e perfil dos clientes." },
      {
        titulo: "Simulação",
        texto: "Comparamos carga tributária, créditos e impacto no caixa em cada cenário.",
      },
      { titulo: "Recomendação", texto: "Apresentamos a opção mais adequada, com explicação simples." },
      { titulo: "Implantação", texto: "Fazemos as opções e os ajustes dentro dos prazos legais." },
    ],
    faq: [
      {
        pergunta: "O que muda com a Reforma Tributária?",
        resposta:
          "O IBS vai substituir o ICMS e o ISS, e a CBS vai substituir o PIS e a Cofins. A CBS passa a valer em 2027; o ICMS e o ISS serão reduzidos gradualmente entre 2029 e 2032 e extintos em 2033. O IPI terá alíquota zero para a maioria dos produtos, com exceções.",
      },
      {
        pergunta: "Qual a diferença entre Simples Comum e Simples Híbrido?",
        resposta:
          "No Simples Comum, o IBS e a CBS continuam dentro do DAS, como já é hoje. No Simples Híbrido, o IBS e a CBS são apurados fora do DAS, pelo regime regular: a empresa pode gerar créditos para os clientes, mas passa a ter mais obrigações e entra no Split Payment.",
      },
      {
        pergunta: "Qual opção é melhor para a minha empresa?",
        resposta:
          "Em geral, o Simples Comum atende melhor quem vende para o consumidor final, e o Simples Híbrido quem vende para empresas que aproveitam créditos. Mas não existe uma escolha melhor para todas as empresas: existe a mais adequada para a sua, e ela depende de simulação.",
      },
      {
        pergunta: "Quando preciso fazer essa escolha?",
        resposta:
          "Para empresas já constituídas, a opção pelo regime regular de IBS e CBS para o 1º semestre de 2027 deve ser feita de 1º a 30 de setembro de 2026. Por isso a análise precisa começar antes do prazo.",
      },
      {
        pergunta: "O que é Split Payment?",
        resposta:
          "É o recolhimento do IBS e da CBS no momento do pagamento: o banco ou a plataforma divide o valor, envia o tributo ao governo e repassa o valor líquido à empresa. Ele será implantado de forma gradual a partir de 2027 e afeta o fluxo de caixa.",
      },
    ],
    relacionados: ["contabilidade-para-empresas", "abertura-de-empresa"],
  },
  {
    slug: "departamento-pessoal",
    titulo: "Departamento Pessoal",
    resumo:
      "Folha de pagamento, eSocial, admissões, férias e rescisões sem erro e no prazo — para você cuidar da equipe, não da papelada.",
    icone: "users",
    publico: "Pessoa jurídica",
    interesse: "Departamento pessoal",
    keyword: "departamento pessoal terceirizado em BH",
    seoTitle: "Departamento Pessoal e Folha de Pagamento em BH",
    seoDescription:
      "Terceirize o departamento pessoal com a Start Cont: folha de pagamento, eSocial, admissões, férias, rescisões e pró-labore em dia. Atendimento em BH e online.",
    h1: "Folha de pagamento em dia e",
    h1Destaque: "equipe tranquila.",
    intro:
      "O departamento pessoal da Start Cont cuida da rotina trabalhista da sua empresa — folha de pagamento, eSocial, admissões, férias, 13º salário, rescisões e pró-labore — com prazos cumpridos e orientação próxima para evitar passivos.",
    inclui: [
      "Folha de pagamento mensal e pró-labore dos sócios",
      "Envios do eSocial, FGTS Digital e DCTFWeb",
      "Admissões, férias, 13º salário e rescisões",
      "Cálculo de encargos, INSS e IRRF",
      "Orientação sobre convenção coletiva e jornada de trabalho",
      "Informe de rendimentos e obrigações anuais",
    ],
    paraQuem: [
      "Empresas com um ou mais funcionários",
      "Sócios que retiram pró-labore",
      "Empresas que vão contratar o primeiro colaborador",
      "Negócios com equipe em crescimento",
      "Empresas que querem reduzir riscos trabalhistas",
      "Quem quer terceirizar a rotina operacional de RH",
    ],
    beneficios: [
      { titulo: "Prazos cumpridos", texto: "Folha, guias e envios no calendário certo, sem multas." },
      {
        titulo: "Menos risco trabalhista",
        texto: "Orientação preventiva para admissões, jornadas e desligamentos.",
      },
      {
        titulo: "Tudo pelo WhatsApp",
        texto: "Você manda a informação, a gente resolve e dá o retorno.",
      },
    ],
    etapas: [
      { titulo: "Levantamento", texto: "Conhecemos a equipe, os contratos e a convenção coletiva." },
      { titulo: "Organização", texto: "Regularizamos cadastros e pendências no eSocial." },
      { titulo: "Rotina mensal", texto: "Folha, guias e envios dentro do prazo." },
      {
        titulo: "Suporte contínuo",
        texto: "Orientamos você antes de cada contratação ou desligamento.",
      },
    ],
    faq: [
      {
        pergunta: "Vocês fazem a folha de empresas com poucos funcionários?",
        resposta:
          "Sim. Atendemos desde a empresa que vai contratar o primeiro colaborador até operações com equipes maiores.",
      },
      {
        pergunta: "O que é o eSocial e por que ele é importante?",
        resposta:
          "O eSocial é o sistema do governo que reúne as informações trabalhistas, previdenciárias e fiscais dos empregados. Envios atrasados ou incorretos geram multas, por isso ele faz parte da nossa rotina mensal.",
      },
      {
        pergunta: "Preciso avisar antes de contratar ou demitir?",
        resposta:
          "É o ideal. Com a informação antecipada, orientamos sobre documentos, prazos e custos e evitamos erros que viram passivo trabalhista.",
      },
      {
        pergunta: "Empresa sem funcionários precisa de departamento pessoal?",
        resposta:
          "Se os sócios retiram pró-labore, sim: há folha, recolhimentos e envios ligados a ele. Avaliamos o seu caso e cuidamos dessa rotina.",
      },
    ],
    relacionados: ["contabilidade-para-empresas", "regularizacao-fiscal"],
  },
  {
    slug: "regularizacao-fiscal",
    titulo: "Regularização Fiscal (PF e PJ)",
    resumo:
      "Consultoria para análise de pendências corporativas e diagnóstico fiscal.",
    icone: "shield",
    publico: "Pessoa física e jurídica",
    interesse: "Regularização fiscal (empresa, CPF, MEI)",
    keyword: "regularização de empresa em Belo Horizonte",
    seoTitle: "Regularização de Empresa, MEI e CPF em BH",
    seoDescription:
      "Consultoria contábil para regularidade de empresas, MEI e pessoas físicas: diagnóstico de pendências, declarações em atraso e parcelamentos. Atendimento em BH e online.",
    h1: "Pendências com o fisco?",
    h1Destaque: "A gente resolve com você.",
    intro:
      "A Start Cont regulariza a situação fiscal de pessoas físicas e empresas — de uma simples declaração atrasada a débitos e parcelamentos — com diagnóstico claro e o caminho mais simples para você voltar a ficar em dia.",
    inclui: [
      "Diagnóstico de pendências na Receita Federal, no Estado e no Município",
      "Entrega de declarações em atraso (PF, PJ e MEI)",
      "Parcelamento e negociação de débitos",
      "Consultoria contábil para regularidade de empresas",
      "Emissão de certidões negativas de débitos",
      "Baixa (encerramento) de empresas",
    ],
    paraQuem: [
      "Empresas com pendências fiscais ou débitos",
      "MEIs com DAS ou declaração anual em atraso",
      "Pessoas com CPF pendente de regularização",
      "Quem precisa de certidão negativa para financiamento ou licitação",
      "Empresas que querem encerrar as atividades corretamente",
      "Quem caiu na malha fina",
    ],
    beneficios: [
      {
        titulo: "Diagnóstico claro",
        texto: "Você entende exatamente o que está pendente e o que é preciso para resolver.",
      },
      {
        titulo: "O caminho mais simples",
        texto: "Simplificamos o burocrático e facilitamos o caminho para você.",
      },
      {
        titulo: "Paz com o fisco",
        texto: "Certidões em dia para vender, contratar e conseguir crédito.",
      },
    ],
    etapas: [
      { titulo: "Consulta", texto: "Levantamos as pendências nos órgãos públicos." },
      {
        titulo: "Plano de ação",
        texto: "Mostramos as opções: pagamento, parcelamento ou retificação.",
      },
      { titulo: "Execução", texto: "Entregamos declarações e formalizamos os acordos." },
      {
        titulo: "Situação regular",
        texto: "Emitimos as certidões e orientamos para não voltar a acontecer.",
      },
    ],
    faq: [
      {
        pergunta: "Minha empresa está com pendências fiscais. Ainda dá para regularizar?",
        resposta:
          "Na maioria dos casos, sim. A situação costuma se agravar por falta de entrega de declarações. Com as obrigações pendentes entregues e os débitos tratados, é possível buscar a regularização.",
      },
      {
        pergunta: "Tenho dívidas com a Receita. Posso parcelar?",
        resposta:
          "Existem modalidades de parcelamento e, em alguns períodos, programas de negociação com descontos. Analisamos o seu caso e indicamos a opção mais vantajosa disponível.",
      },
      {
        pergunta: "A Start Cont atende pessoa física?",
        resposta:
          "Sim. Atendemos pessoas físicas e jurídicas, desde uma simples regularização até o acompanhamento mensal de empresas.",
      },
      {
        pergunta: "Quanto tempo leva para regularizar?",
        resposta:
          "Depende do tipo e da quantidade de pendências. Depois do diagnóstico, passamos um prazo realista para o seu caso.",
      },
    ],
    relacionados: ["imposto-de-renda", "abertura-de-empresa"],
  },
  {
    slug: "imposto-de-renda",
    titulo: "Imposto de Renda Pessoa Física",
    resumo:
      "Declaração completa e revisada, com as deduções aproveitadas do jeito certo, carnê-leão e ajuda para sair da malha fina.",
    icone: "document",
    publico: "Pessoa física",
    interesse: "Imposto de Renda (pessoa física)",
    keyword: "contador para imposto de renda em BH",
    seoTitle: "Contador para Imposto de Renda em BH",
    seoDescription:
      "Declaração de Imposto de Renda com contador: deduções corretas, carnê-leão, ganho de capital e malha fina. Atendimento em BH e online com a Start Cont.",
    h1: "Imposto de Renda feito com cuidado e",
    h1Destaque: "sem medo da malha fina.",
    intro:
      "A Start Cont faz a sua declaração de Imposto de Renda Pessoa Física de forma completa e revisada — rendimentos, deduções, bens, investimentos e carnê-leão — e ajuda quem caiu na malha fina a resolver a pendência.",
    inclui: [
      "Declaração anual do IRPF no modelo mais vantajoso",
      "Conferência de informes de rendimentos e deduções",
      "Carnê-leão para autônomos e rendimentos do exterior",
      "Apuração de ganho de capital na venda de bens",
      "Retificação de declarações e saída da malha fina",
      "Declarações em atraso de anos anteriores",
    ],
    paraQuem: [
      "Assalariados e aposentados obrigados a declarar",
      "Profissionais liberais e autônomos",
      "Sócios de empresas",
      "Quem vendeu imóvel, veículo ou outros bens",
      "Investidores",
      "Quem caiu na malha fina",
    ],
    beneficios: [
      { titulo: "Revisão completa", texto: "Conferimos cada informação antes de enviar." },
      {
        titulo: "Deduções aproveitadas",
        texto: "Você não paga mais do que deve, dentro da lei.",
      },
      {
        titulo: "Sem correria",
        texto: "Organizamos seus documentos com antecedência, pelo WhatsApp.",
      },
    ],
    etapas: [
      { titulo: "Documentos", texto: "Você envia informes e comprovantes pelo WhatsApp." },
      { titulo: "Conferência", texto: "Revisamos rendimentos, deduções, bens e dívidas." },
      { titulo: "Declaração", texto: "Escolhemos o modelo mais vantajoso e transmitimos." },
      { titulo: "Acompanhamento", texto: "Monitoramos o processamento e a restituição." },
    ],
    faq: [
      {
        pergunta: "Quem é obrigado a declarar o Imposto de Renda?",
        resposta:
          "As regras mudam a cada ano e consideram rendimentos, bens, operações em bolsa e atividade rural, entre outros critérios. Confira com a gente se você está obrigado na declaração deste ano.",
      },
      {
        pergunta: "Caí na malha fina. E agora?",
        resposta:
          "Primeiro identificamos o motivo da pendência no e-CAC. Se houver erro, fazemos a retificação; se a informação estiver correta, organizamos os comprovantes para apresentar à Receita Federal.",
      },
      {
        pergunta: "Posso entregar declarações de anos anteriores?",
        resposta:
          "Sim. As declarações em atraso podem ser entregues, com multa por atraso. Regularizar o quanto antes evita que o CPF fique pendente.",
      },
      {
        pergunta: "Vocês atendem fora de Belo Horizonte?",
        resposta:
          "Sim. Todo o processo pode ser feito online, com envio de documentos pelo WhatsApp, para qualquer lugar do Brasil.",
      },
    ],
    relacionados: ["regularizacao-fiscal", "planejamento-tributario"],
  },
  {
    slug: "certificado-digital",
    titulo: "Certificado Digital e-CNPJ e e-CPF",
    resumo:
      "Suporte e intermediação na emissão de e-CNPJ e e-CPF com certificadoras parceiras.",
    icone: "certificado",
    publico: "Pessoa física e jurídica",
    interesse: "Certificado digital (e-CNPJ / e-CPF)",
    precos: [
      {
        rotulo: "e-CNPJ",
        detalhe: "Para a sua empresa (pessoa jurídica)",
        valor: 180,
        interesseWhatsapp: "o certificado digital e-CNPJ",
      },
      {
        rotulo: "e-CPF",
        detalhe: "Para você (pessoa física)",
        valor: 140,
        interesseWhatsapp: "o certificado digital e-CPF",
      },
    ],
    keyword: "certificado digital em Belo Horizonte",
    seoTitle: "Certificado Digital e-CNPJ e e-CPF em BH",
    seoDescription:
      "Certificado digital e-CNPJ por R$ 180 e e-CPF por R$ 140, com suporte e intermediação junto a certificadoras parceiras. Fale com a Start Cont pelo WhatsApp.",
    h1: "Certificado digital com",
    h1Destaque: "atendimento especializado.",
    intro:
      "Suporte completo para o seu certificado digital com a Start Cont: e-CNPJ por R$ 180 para a sua empresa e e-CPF por R$ 140 para pessoa física, com intermediação junto a certificadoras parceiras e atendimento direto pelo WhatsApp.",
    inclui: [
      "Certificado e-CNPJ para a sua empresa, por R$ 180",
      "Certificado e-CPF para pessoa física, por R$ 140",
      "Intermediação junto a certificadoras parceiras",
      "Atendimento direto pelo WhatsApp, do pedido à emissão",
      "Orientação sobre os documentos necessários",
    ],
    paraQuem: [
      "Empresas que emitem notas fiscais e enviam obrigações ao fisco",
      "Quem está abrindo uma empresa e precisa do e-CNPJ",
      "Empresas que precisam renovar um certificado vencido",
      "Sócios e representantes que assinam documentos digitalmente",
      "Pessoas físicas que precisam de assinatura com validade jurídica",
      "Quem acessa serviços online da Receita Federal com certificado",
    ],
    beneficios: [
      {
        titulo: "Suporte na emissão",
        texto: "Orientamos o processo junto às certificadoras parceiras, do pedido à conclusão.",
      },
      {
        titulo: "Preço claro",
        texto: "e-CNPJ por R$ 180 e e-CPF por R$ 140. Você sabe quanto vai pagar antes de pedir.",
      },
      {
        titulo: "Atendimento humano",
        texto:
          "Você fala direto com a Start Cont pelo WhatsApp, do pedido até a emissão.",
      },
    ],
    etapas: [
      {
        titulo: "Escolha o certificado",
        texto: "e-CNPJ para a empresa ou e-CPF para pessoa física.",
      },
      {
        titulo: "Chame no WhatsApp",
        texto: "Informe os dados e receba a orientação sobre os documentos necessários.",
      },
      { titulo: "Emissão", texto: "A emissão é feita pela certificadora parceira, com o nosso acompanhamento." },
      {
        titulo: "Pronto para usar",
        texto:
          "Com o certificado em mãos, você emite notas, assina documentos e acessa os serviços da Receita.",
      },
    ],
    faq: [
      {
        pergunta: "Quanto custa o certificado digital?",
        resposta:
          "O certificado e-CNPJ custa R$ 180 e o e-CPF custa R$ 140.",
      },
      {
        pergunta: "Em quanto tempo o certificado fica pronto?",
        resposta:
          "O prazo depende da certificadora parceira e da validação dos documentos. Chame a Start Cont no WhatsApp para começar.",
      },
      {
        pergunta: "Qual a diferença entre e-CNPJ e e-CPF?",
        resposta:
          "O e-CNPJ identifica a empresa (pessoa jurídica) e é usado para emitir notas, transmitir obrigações e assinar em nome dela. O e-CPF identifica a pessoa física e serve para assinar documentos e acessar serviços da Receita Federal com validade jurídica.",
      },
      {
        pergunta: "Para que serve o certificado digital?",
        resposta:
          "Ele funciona como uma identidade digital: permite assinar documentos com validade jurídica, emitir notas fiscais eletrônicas, transmitir obrigações como SPED e eSocial e acessar serviços online do governo com segurança.",
      },
    ],
    relacionados: ["abertura-de-empresa", "contabilidade-para-empresas"],
  },
];

export function getServico(slug: string) {
  return servicos.find((s) => s.slug === slug);
}

/** "R$ 180" — valores inteiros em reais, sem centavos (como no material da marca). */
export function precoReais(valor: number) {
  return `R$ ${valor.toLocaleString("pt-BR")}`;
}

/** Mensagem que já vai escrita no WhatsApp ao clicar num preço do serviço. */
export function mensagemPreco(preco: PrecoServico) {
  return `Olá! Vim pelo site e quero solicitar ${preco.interesseWhatsapp} (${precoReais(preco.valor)}). Como funciona?`;
}

export function servicoPath(slug: string) {
  return `/servicos/${slug}`;
}

/** Perguntas gerais da home (FAQPage no JSON-LD — ajuda Google e IAs). */
export const faqGeral = [
  {
    pergunta: "A Start Cont atende pessoa física e pessoa jurídica?",
    resposta:
      "Sim. Atendemos pessoas físicas e empresas, desde uma simples regularização ou declaração de Imposto de Renda até o acompanhamento mensal de grandes empresas e indústrias.",
  },
  {
    pergunta: "Onde a Start Cont atende?",
    resposta:
      "Somos de Belo Horizonte e atendemos preferencialmente toda a Grande BH, inclusive com visitas presenciais. Também atendemos empresas e pessoas de todo o Brasil de forma online.",
  },
  {
    pergunta: "Como falo com a Start Cont?",
    resposta:
      "Pelo WhatsApp ou telefone (31) 98121-1758. Preferimos esses canais ao e-mail porque são mais rápidos, mais fáceis e mais humanos.",
  },
  {
    pergunta: "O atendimento é só online?",
    resposta:
      "Não. O atendimento é personalizado: vamos até os nossos clientes na Grande BH e também resolvemos muita coisa online, do jeito que for melhor para você.",
  },
  {
    pergunta: "O trabalho da Start Cont é só cuidar dos impostos?",
    resposta:
      "Não. Além das obrigações com o fisco, fazemos um trabalho humanizado e próximo dos empresários: entendemos o negócio, orientamos decisões e simplificamos a burocracia.",
  },
];

// Mensagem pré-preenchida para o WhatsApp
export function whatsappLink(mensagem: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const mensagemPadrao = "Olá! Vim pelo site e gostaria de falar com a Start Cont.";
