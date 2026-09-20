/**
 * Apoio da área do cliente (/portal) e da visão do contador (/admin/envios).
 * Fica separado de site.ts porque nada disso aparece no site público.
 */

export const ENVIO_STATUS = [
  { valor: "recebido", label: "Recebido", cor: "bg-azul/10 text-azul" },
  { valor: "em_analise", label: "Em análise", cor: "bg-amber-100 text-amber-800" },
  { valor: "concluido", label: "Concluído", cor: "bg-emerald-100 text-emerald-800" },
] as const;

export type EnvioStatus = (typeof ENVIO_STATUS)[number]["valor"];

export function statusValido(v: string): v is EnvioStatus {
  return ENVIO_STATUS.some((s) => s.valor === v);
}

export function statusInfo(valor: string) {
  return ENVIO_STATUS.find((s) => s.valor === valor) ?? ENVIO_STATUS[0];
}

// ---------------------------------------------------------------------------
// Categorias de documento — a ordem definida pelo Rodrigo (itens 5 a 10)
// ---------------------------------------------------------------------------

export const CATEGORIAS_DOCUMENTO = [
  {
    id: "notas_emitidas",
    numero: 5,
    titulo: "Notas fiscais emitidas",
    ajuda: "As notas que a sua empresa emitiu no período.",
  },
  {
    id: "notas_fornecedores",
    numero: 6,
    titulo: "Notas fiscais recebidas de fornecedores",
    ajuda: "Serviços tomados e produtos adquiridos.",
  },
  {
    id: "notas_parceiros",
    numero: 7,
    titulo: "Notas fiscais dos profissionais parceiros",
    ajuda:
      "Somente para profissionais da área da beleza — as notas dos parceiros do salão.",
    apenasBeleza: true,
  },
  {
    id: "pagamentos",
    numero: 8,
    titulo: "Boletos, faturas e comprovantes de pagamento",
    ajuda: "Demais pagamentos efetuados no mês.",
  },
  {
    id: "bancario",
    numero: 9,
    titulo: "Extrato bancário e planilhas",
    ajuda:
      "Extrato do período, planilha de acompanhamento e o descritivo dos movimentos bancários.",
  },
  {
    id: "departamento_pessoal",
    numero: 10,
    titulo: "Documentos de Departamento Pessoal",
    ajuda: "Folha, admissões, férias, rescisões, atestados.",
  },
] as const;

export type CategoriaId = (typeof CATEGORIAS_DOCUMENTO)[number]["id"];

export function categoriaValida(v: string): v is CategoriaId {
  return CATEGORIAS_DOCUMENTO.some((c) => c.id === v);
}

export function categoriaInfo(id: string) {
  return CATEGORIAS_DOCUMENTO.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Arquivos aceitos
// ---------------------------------------------------------------------------

/**
 * Além de PDF e imagem, o contador recebe XML de NF-e e planilhas — e cliente
 * costuma mandar o mês inteiro num .zip.
 */
export const EXTENSOES_ACEITAS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".xml",
  ".xlsx",
  ".xls",
  ".csv",
  ".zip",
];

/**
 * O navegador nem sempre acerta o mime (um .xml vira "" no Windows, um .zip
 * vira "application/x-zip-compressed"), então a extensão é quem manda e o
 * mime serve só de reforço.
 */
export function tipoPermitido(nome: string) {
  const ext = nome.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
  return Boolean(ext && EXTENSOES_ACEITAS.includes(ext));
}

export const TAMANHO_MAX_MB = 25;
export const TAMANHO_MAX_BYTES = TAMANHO_MAX_MB * 1024 * 1024;
/** Teto por envio — são seis categorias, cada uma com vários arquivos. */
export const MAX_ARQUIVOS = 80;

// ---------------------------------------------------------------------------
// Período (competências)
// ---------------------------------------------------------------------------

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function competenciaValida(v: string) {
  if (!/^\d{4}-\d{2}$/.test(v)) return false;
  const mes = Number(v.slice(5));
  return mes >= 1 && mes <= 12;
}

/** "2026-06" → "Junho de 2026" */
export function competenciaLabel(competencia: string) {
  const [ano, mes] = competencia.split("-");
  const nome = MESES[Number(mes) - 1];
  return nome ? `${nome} de ${ano}` : competencia;
}

/** "2026-06" → "06/2026" — o formato que o Rodrigo usa. */
export function competenciaCurta(competencia: string) {
  const [ano, mes] = competencia.split("-");
  return ano && mes ? `${mes}/${ano}` : competencia;
}

/** "06/2026" para um mês só, "06/2026 a 07/2026" para um intervalo. */
export function periodoLabel(inicio: string, fim: string) {
  return inicio === fim
    ? competenciaCurta(inicio)
    : `${competenciaCurta(inicio)} a ${competenciaCurta(fim)}`;
}

/**
 * Meses oferecidos no formulário, do mais recente para o mais antigo,
 * começando no mês corrente (cliente atrasado manda meses bem anteriores).
 */
export function competenciasRecentes(quantidade = 18, hoje = new Date()) {
  const opcoes: { valor: string; label: string }[] = [];
  for (let i = 0; i < quantidade; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const valor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    opcoes.push({ valor, label: `${competenciaCurta(valor)} — ${competenciaLabel(valor)}` });
  }
  return opcoes;
}

// ---------------------------------------------------------------------------
// CPF / CNPJ
// ---------------------------------------------------------------------------

export function apenasDigitos(v: string) {
  return v.replace(/\D/g, "");
}

function cpfValido(d: string) {
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const dv = (ate: number) => {
    let soma = 0;
    for (let i = 0; i < ate; i++) soma += Number(d[i]) * (ate + 1 - i);
    return ((soma * 10) % 11) % 10;
  };
  return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
}

function cnpjValido(d: string) {
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false;
  const dv = (base: string) => {
    let peso = base.length - 7;
    let soma = 0;
    for (const digito of base) {
      soma += Number(digito) * peso--;
      if (peso < 2) peso = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return (
    dv(d.slice(0, 12)) === Number(d[12]) && dv(d.slice(0, 13)) === Number(d[13])
  );
}

/** Aceita CPF (11 dígitos) ou CNPJ (14), conferindo os dígitos verificadores. */
export function documentoValido(valor: string) {
  const d = apenasDigitos(valor);
  return d.length === 11 ? cpfValido(d) : d.length === 14 ? cnpjValido(d) : false;
}

/** Máscara progressiva: 000.000.000-00 ou 00.000.000/0000-00. */
export function formatarDocumento(valor: string) {
  const d = apenasDigitos(valor).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

// ---------------------------------------------------------------------------
// Formatação
// ---------------------------------------------------------------------------

export function formatarBRL(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Link que baixa o arquivo em vez de abrir no navegador. O Blob da Vercel
 * responde com Content-Disposition: attachment quando recebe ?download=1;
 * em dev o arquivo é local e o atributo `download` do <a> já resolve.
 */
export function urlDownload(url: string) {
  return url.startsWith("http") ? `${url}?download=1` : url;
}

/** Código curto mostrado ao cliente como comprovante do envio. */
export function protocolo(id: string) {
  return id.slice(-6).toUpperCase();
}
