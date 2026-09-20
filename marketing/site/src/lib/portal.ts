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

/** Tipos aceitos no anexo: extrato em PDF e prints/fotos de comprovante. */
export const TIPOS_ACEITOS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];

export const TAMANHO_MAX_MB = 20;
export const TAMANHO_MAX_BYTES = TAMANHO_MAX_MB * 1024 * 1024;

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

/** "2026-09" → "Setembro de 2026" */
export function competenciaLabel(competencia: string) {
  const [ano, mes] = competencia.split("-");
  const nome = MESES[Number(mes) - 1];
  return nome ? `${nome} de ${ano}` : competencia;
}

/**
 * Meses que o cliente pode escolher no formulário, do mais recente para o mais
 * antigo. Começa no mês passado: o extrato do mês em curso ainda não fechou,
 * então é ele que o cliente manda na esmagadora maioria das vezes.
 */
export function competenciasRecentes(quantidade = 6, hoje = new Date()) {
  const opcoes: { valor: string; label: string }[] = [];
  for (let i = 1; i <= quantidade; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const valor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    opcoes.push({ valor, label: competenciaLabel(valor) });
  }
  return opcoes;
}

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
