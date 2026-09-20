"use client";

import { useActionState, useRef, useState } from "react";
import { criarEnvio } from "@/app/portal/actions";
import {
  apenasDigitos,
  CATEGORIAS_DOCUMENTO,
  EXTENSOES_ACEITAS,
  formatarDocumento,
  formatarTamanho,
  periodoLabel,
  TAMANHO_MAX_MB,
  type CategoriaId,
} from "@/lib/portal";
import { DocumentIcon, TrashIcon, UploadIcon } from "@/components/Icons";

type Anexo = {
  categoria: CategoriaId;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
};
type Competencia = { valor: string; label: string };

const campoClasses =
  "w-full rounded-xl border border-cinza-claro bg-white px-4 py-3 text-tinta outline-none transition focus:border-azul focus:ring-2 focus:ring-azul/20";

/** Dígitos digitados → centavos → "1.234,56" pra mostrar no campo. */
function formatarCentavos(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Pergunta({
  numero,
  titulo,
  ajuda,
  obrigatorio,
  children,
}: {
  numero: number;
  titulo: string;
  ajuda?: string;
  obrigatorio?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-cinza-claro bg-white p-5 shadow-suave sm:p-6">
      <div className="flex items-start gap-3">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold text-white ${
            obrigatorio ? "bg-vermelho" : "bg-azul"
          }`}
        >
          {numero}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-semibold text-azul-escuro">
            {titulo}
            {obrigatorio && <span className="ml-1 text-vermelho">*</span>}
          </h2>
          {ajuda && <p className="mt-1 text-sm text-cinza">{ajuda}</p>}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function EnvioForm({ competencias }: { competencias: Competencia[] }) {
  const [state, action, pending] = useActionState(criarEnvio, undefined);

  /**
   * Os campos de texto são controlados de propósito. O React limpa o
   * formulário quando a ação termina, e como a ação volta com erro de
   * validação, um campo não controlado apagaria tudo que a pessoa
   * acabou de digitar.
   */
  const [texto, setTexto] = useState({
    nomeCliente: "",
    telefone: "",
    observacoes: "",
  });
  const campo = (nome: keyof typeof texto) => ({
    value: texto[nome],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setTexto((t) => ({ ...t, [nome]: e.target.value })),
  });

  const primeiro = competencias[0]?.valor ?? "";
  const [inicio, setInicio] = useState(primeiro);
  const [fim, setFim] = useState(primeiro);
  const [documento, setDocumento] = useState("");
  const [centavos, setCentavos] = useState(0);
  const [semMovimento, setSemMovimento] = useState(false);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [enviando, setEnviando] = useState(0);
  const [erroUpload, setErroUpload] = useState<string | null>(null);

  // O mês final nunca pode ser anterior ao inicial.
  function mudarInicio(valor: string) {
    setInicio(valor);
    if (fim < valor) setFim(valor);
  }

  async function subirArquivos(categoria: CategoriaId, arquivos: File[]) {
    if (arquivos.length === 0) return;
    setErroUpload(null);
    setEnviando((n) => n + arquivos.length);

    for (const arquivo of arquivos) {
      try {
        const fd = new FormData();
        fd.append("file", arquivo);
        fd.append("competencia", inicio);
        fd.append("categoria", categoria);
        const res = await fetch("/api/portal/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data.ok) {
          setAnexos((lista) => [
            ...lista,
            {
              categoria,
              nome: data.nome,
              url: data.url,
              tipo: data.tipo,
              tamanho: data.tamanho,
            },
          ]);
        } else {
          setErroUpload(`${arquivo.name}: ${data.error ?? "erro ao enviar."}`);
        }
      } catch {
        setErroUpload(
          `${arquivo.name}: não foi possível enviar. Verifique a conexão e tente de novo.`
        );
      } finally {
        setEnviando((n) => n - 1);
      }
    }
  }

  function removerAnexo(url: string) {
    setAnexos((lista) => lista.filter((a) => a.url !== url));
  }

  const bloqueado = pending || enviando > 0;
  const totalAnexos = anexos.length;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="arquivos" value={JSON.stringify(anexos)} />
      <input
        type="hidden"
        name="faturamentoCentavos"
        value={semMovimento ? 0 : centavos}
      />
      {/* O campo visível leva a máscara; o que vai pro servidor são os dígitos. */}
      <input
        type="hidden"
        name="documento"
        value={apenasDigitos(documento)}
      />

      {/* 1 — Período */}
      <Pergunta
        numero={1}
        titulo="Período"
        ajuda="De qual mês é esse malote. Se for mais de um mês, marque o mês inicial e o final."
        obrigatorio
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="competenciaInicio"
              className="mb-1.5 block text-sm font-medium text-cinza-escuro"
            >
              Mês inicial
            </label>
            <select
              id="competenciaInicio"
              name="competenciaInicio"
              required
              value={inicio}
              onChange={(e) => mudarInicio(e.target.value)}
              className={campoClasses}
            >
              {competencias.map((c) => (
                <option key={c.valor} value={c.valor}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="competenciaFim"
              className="mb-1.5 block text-sm font-medium text-cinza-escuro"
            >
              Mês final
            </label>
            <select
              id="competenciaFim"
              name="competenciaFim"
              required
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className={campoClasses}
            >
              {competencias
                .filter((c) => c.valor >= inicio)
                .map((c) => (
                  <option key={c.valor} value={c.valor}>
                    {c.label}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <p className="mt-2 text-sm text-cinza">
          Enviando os documentos de{" "}
          <strong className="font-semibold text-azul-escuro">
            {periodoLabel(inicio, fim)}
          </strong>
          .
        </p>
      </Pergunta>

      {/* 2 — Nome */}
      <Pergunta numero={2} titulo="Nome do cliente" obrigatorio>
        <input
          id="nomeCliente"
          name="nomeCliente"
          required
          autoComplete="name"
          placeholder="Nome completo ou razão social"
          className={campoClasses}
          {...campo("nomeCliente")}
        />
      </Pergunta>

      {/* 3 — CNPJ ou CPF */}
      <Pergunta numero={3} titulo="CNPJ ou CPF" obrigatorio>
        <input
          id="documentoVisivel"
          inputMode="numeric"
          required
          value={documento}
          onChange={(e) => setDocumento(formatarDocumento(e.target.value))}
          placeholder="00.000.000/0000-00 ou 000.000.000-00"
          aria-label="CNPJ ou CPF"
          className={campoClasses}
        />
        <div className="mt-4">
          <label
            htmlFor="telefone"
            className="mb-1.5 block text-sm font-medium text-cinza-escuro"
          >
            WhatsApp <span className="font-normal text-cinza">(opcional)</span>
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(31) 9 0000-0000"
            className={campoClasses}
            {...campo("telefone")}
          />
        </div>
      </Pergunta>

      {/* 4 — Faturamento */}
      <Pergunta
        numero={4}
        titulo="Valor total faturado no período"
        ajuda="O total que entrou, antes de descontar despesas."
      >
        <div
          className={`relative transition-opacity ${
            semMovimento ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinza">
            R$
          </span>
          <input
            id="faturamento"
            inputMode="numeric"
            disabled={semMovimento}
            value={centavos === 0 ? "" : formatarCentavos(centavos)}
            onChange={(e) => {
              const digitos = e.target.value.replace(/\D/g, "").slice(0, 12);
              setCentavos(Number(digitos));
            }}
            placeholder="0,00"
            aria-label="Valor total faturado no período, em reais"
            className={`${campoClasses} pl-11 font-display text-lg`}
          />
        </div>

        <label className="mt-3 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            name="semMovimento"
            checked={semMovimento}
            onChange={(e) => setSemMovimento(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-cinza-claro text-azul focus:ring-azul"
          />
          <span className="text-sm text-cinza-escuro">
            Não tive movimento no período
          </span>
        </label>
      </Pergunta>

      {/* 5 a 10 — anexos por categoria */}
      {CATEGORIAS_DOCUMENTO.map((cat) => (
        <Pergunta
          key={cat.id}
          numero={cat.numero}
          titulo={cat.titulo}
          ajuda={cat.ajuda}
        >
          <CampoArquivos
            destacado={"apenasBeleza" in cat && cat.apenasBeleza}
            anexos={anexos.filter((a) => a.categoria === cat.id)}
            onEscolher={(arquivos) => subirArquivos(cat.id, arquivos)}
            onRemover={removerAnexo}
          />
        </Pergunta>
      ))}

      {/* 11 — observações */}
      <Pergunta
        numero={11}
        titulo="Quer avisar mais alguma coisa?"
        ajuda="Opcional — algo fora do comum no período, uma dúvida, um aviso."
      >
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          placeholder="Ex.: nesse mês recebi um valor de venda de equipamento, não é faturamento."
          className={`${campoClasses} resize-y`}
          {...campo("observacoes")}
        />
      </Pergunta>

      {erroUpload && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {erroUpload}
        </p>
      )}

      {state?.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          {state.error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-1 bg-nevoa/95 px-1 pb-1 pt-3 backdrop-blur">
        <button
          type="submit"
          disabled={bloqueado}
          className="w-full rounded-xl bg-vermelho px-6 py-4 font-semibold text-white shadow-card transition-colors hover:bg-vermelho-escuro disabled:opacity-60"
        >
          {pending
            ? "Enviando..."
            : enviando > 0
              ? "Aguarde os anexos terminarem..."
              : `Enviar para a Start Cont${totalAnexos > 0 ? ` (${totalAnexos} documento${totalAnexos > 1 ? "s" : ""})` : ""}`}
        </button>
      </div>
    </form>
  );
}

/** Uma caixa de upload com a lista dos arquivos já anexados naquele campo. */
function CampoArquivos({
  destacado,
  anexos,
  onEscolher,
  onRemover,
}: {
  destacado?: boolean;
  anexos: Anexo[];
  onEscolher: (arquivos: File[]) => void;
  onRemover: (url: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition hover:bg-white ${
          destacado
            ? "border-vermelho/40 bg-vermelho/5 hover:border-vermelho"
            : "border-cinza-claro bg-nevoa hover:border-azul"
        }`}
      >
        <input
          ref={input}
          type="file"
          accept={EXTENSOES_ACEITAS.join(",")}
          multiple
          onChange={(e) => {
            const arquivos = Array.from(e.target.files ?? []);
            // Limpa o input já: sem isso, escolher o mesmo arquivo de novo não
            // dispara o change e o cliente acha que o anexo sumiu.
            if (input.current) input.current.value = "";
            onEscolher(arquivos);
          }}
          className="hidden"
        />
        <UploadIcon className={`h-6 w-6 ${destacado ? "text-vermelho" : "text-azul"}`} />
        <span className="text-sm font-medium text-azul-escuro">
          Anexar documentos
        </span>
        <span className="text-xs text-cinza">
          Vários de uma vez · PDF, imagem, XML, planilha ou ZIP · até{" "}
          {TAMANHO_MAX_MB} MB cada
        </span>
      </label>

      {anexos.length > 0 && (
        <ul className="mt-3 space-y-2">
          {anexos.map((a) => (
            <li
              key={a.url}
              className="flex items-center gap-3 rounded-xl border border-cinza-claro bg-white px-3.5 py-2.5"
            >
              <DocumentIcon className="h-5 w-5 shrink-0 text-azul" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-tinta">
                  {a.nome}
                </span>
                <span className="text-xs text-cinza">
                  {formatarTamanho(a.tamanho)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemover(a.url)}
                aria-label={`Remover ${a.nome}`}
                className="shrink-0 rounded-lg p-2 text-cinza transition hover:bg-red-50 hover:text-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
