"use client";

import { useState, useTransition } from "react";
import { deleteEnvio, updateEnvioStatus } from "@/app/admin/actions";
import {
  CATEGORIAS_DOCUMENTO,
  ENVIO_STATUS,
  formatarBRL,
  formatarDocumento,
  formatarTamanho,
  periodoLabel,
  protocolo,
  statusInfo,
  urlDownload,
} from "@/lib/portal";
import { DocumentIcon, DownloadIcon, TrashIcon } from "@/components/Icons";

export type EnvioCardData = {
  id: string;
  nomeCliente: string;
  documento: string;
  telefone: string | null;
  competenciaInicio: string;
  competenciaFim: string;
  faturamentoCentavos: number | null;
  semMovimento: boolean;
  observacoes: string | null;
  status: string;
  criadoEm: string;
  arquivos: {
    id: string;
    categoria: string;
    nome: string;
    url: string;
    tamanho: number;
  }[];
};

export function EnvioCard({ envio }: { envio: EnvioCardData }) {
  const [status, setStatus] = useState(envio.status);
  const [salvando, startTransition] = useTransition();
  const info = statusInfo(status);

  function mudarStatus(novo: string) {
    setStatus(novo); // otimista: o select responde na hora
    startTransition(() => {
      updateEnvioStatus(envio.id, novo);
    });
  }

  // Só as categorias que vieram com arquivo aparecem — um malote raramente
  // preenche as seis.
  const grupos = CATEGORIAS_DOCUMENTO.map((cat) => ({
    cat,
    arquivos: envio.arquivos.filter((a) => a.categoria === cat.id),
  })).filter((g) => g.arquivos.length > 0);

  return (
    <article className="rounded-2xl border border-cinza-claro bg-white p-5 shadow-suave">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-azul-escuro">
            {envio.nomeCliente}
          </h3>
          <p className="mt-0.5 text-sm text-cinza">
            {formatarDocumento(envio.documento)}
            {envio.telefone && <span> · {envio.telefone}</span>}
            <span> · enviado em {envio.criadoEm}</span>
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${info.cor}`}
        >
          {info.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="font-display text-2xl font-bold text-azul">
          {envio.semMovimento
            ? "Sem movimento"
            : envio.faturamentoCentavos !== null
              ? formatarBRL(envio.faturamentoCentavos)
              : "—"}
          <span className="ml-2 align-middle text-xs font-medium uppercase tracking-widest text-cinza">
            faturado
          </span>
        </p>
        <p className="text-sm text-cinza">
          Período{" "}
          <strong className="font-semibold text-cinza-escuro">
            {periodoLabel(envio.competenciaInicio, envio.competenciaFim)}
          </strong>
        </p>
      </div>

      {envio.observacoes && (
        <p className="mt-3 rounded-xl bg-nevoa px-4 py-3 text-sm leading-relaxed text-cinza-escuro">
          {envio.observacoes}
        </p>
      )}

      {grupos.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-cinza-claro px-4 py-3 text-sm text-cinza">
          Nenhum documento anexado neste envio.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {grupos.map(({ cat, arquivos }) => (
            <div key={cat.id}>
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cinza">
                {cat.titulo}
                <span className="rounded-full bg-nevoa px-2 py-0.5 text-[0.7rem] normal-case tracking-normal text-cinza-escuro">
                  {arquivos.length}
                </span>
              </h4>
              <ul className="mt-2 space-y-2">
                {arquivos.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-xl border border-cinza-claro px-3.5 py-2.5"
                  >
                    <DocumentIcon className="h-5 w-5 shrink-0 text-azul" />
                    <span className="min-w-0 flex-1">
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-sm font-medium text-tinta hover:text-azul hover:underline"
                      >
                        {a.nome}
                      </a>
                      <span className="text-xs text-cinza">
                        {formatarTamanho(a.tamanho)}
                      </span>
                    </span>
                    <a
                      href={urlDownload(a.url)}
                      download={a.nome}
                      aria-label={`Baixar ${a.nome}`}
                      className="shrink-0 rounded-lg p-2 text-cinza transition hover:bg-nevoa hover:text-azul"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-cinza-claro pt-4">
        <label className="flex items-center gap-2 text-sm text-cinza">
          Situação
          <select
            value={status}
            disabled={salvando}
            onChange={(e) => mudarStatus(e.target.value)}
            className="rounded-lg border border-cinza-claro bg-white px-3 py-1.5 text-sm text-tinta outline-none focus:border-azul focus:ring-2 focus:ring-azul/20 disabled:opacity-60"
          >
            {ENVIO_STATUS.map((s) => (
              <option key={s.valor} value={s.valor}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-3">
          <span className="text-xs text-cinza/70">
            {envio.arquivos.length} arquivo
            {envio.arquivos.length === 1 ? "" : "s"} · protocolo{" "}
            {protocolo(envio.id)}
          </span>
          <form action={deleteEnvio}>
            <input type="hidden" name="id" value={envio.id} />
            <ConfirmarExclusao nome={envio.nomeCliente} />
          </form>
        </div>
      </div>
    </article>
  );
}

/** Excluir apaga os anexos junto — por isso pede confirmação. */
function ConfirmarExclusao({ nome }: { nome: string }) {
  return (
    <button
      type="submit"
      aria-label={`Excluir o envio de ${nome}`}
      onClick={(e) => {
        if (
          !confirm(
            `Excluir o envio de ${nome}? Os arquivos anexados também serão removidos.`
          )
        ) {
          e.preventDefault();
        }
      }}
      className="rounded-lg p-2 text-cinza transition hover:bg-red-50 hover:text-red-600"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
