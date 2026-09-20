"use client";

import { useActionState, useRef, useState } from "react";
import { criarEnvio } from "@/app/portal/actions";
import {
  formatarTamanho,
  TAMANHO_MAX_MB,
  TIPOS_ACEITOS,
} from "@/lib/portal";
import { DocumentIcon, TrashIcon, UploadIcon } from "@/components/Icons";

type Anexo = { nome: string; url: string; tipo: string; tamanho: number };
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
  children,
}: {
  numero: number;
  titulo: string;
  ajuda?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-cinza-claro bg-white p-5 shadow-suave sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-azul text-sm font-semibold text-white">
          {numero}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-semibold text-azul-escuro">
            {titulo}
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
   * validação (faltou o extrato, por exemplo), um campo não controlado
   * apagaria tudo que a pessoa acabou de digitar.
   */
  const [texto, setTexto] = useState({
    nomeCliente: "",
    empresa: "",
    telefone: "",
    observacoes: "",
  });
  const campo = (nome: keyof typeof texto) => ({
    value: texto[nome],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setTexto((t) => ({ ...t, [nome]: e.target.value })),
  });

  const [competencia, setCompetencia] = useState(competencias[0]?.valor ?? "");
  const [centavos, setCentavos] = useState(0);
  const [semMovimento, setSemMovimento] = useState(false);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [enviando, setEnviando] = useState(0);
  const [erroUpload, setErroUpload] = useState<string | null>(null);
  const inputArquivo = useRef<HTMLInputElement>(null);

  async function receberArquivos(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files ?? []);
    // Limpa o input já: sem isso, escolher o mesmo arquivo de novo não dispara
    // o change e o cliente acha que o anexo sumiu.
    if (inputArquivo.current) inputArquivo.current.value = "";
    if (arquivos.length === 0) return;

    setErroUpload(null);
    setEnviando((n) => n + arquivos.length);

    for (const arquivo of arquivos) {
      try {
        const fd = new FormData();
        fd.append("file", arquivo);
        fd.append("competencia", competencia);
        const res = await fetch("/api/portal/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data.ok) {
          setAnexos((lista) => [
            ...lista,
            {
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

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="arquivos" value={JSON.stringify(anexos)} />
      <input
        type="hidden"
        name="faturamentoCentavos"
        value={semMovimento ? 0 : centavos}
      />

      <Pergunta
        numero={1}
        titulo="Quem está enviando?"
        ajuda="Para o contador saber de quem é o documento."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="nomeCliente"
              className="mb-1.5 block text-sm font-medium text-cinza-escuro"
            >
              Nome e sobrenome <span className="text-vermelho">*</span>
            </label>
            <input
              id="nomeCliente"
              name="nomeCliente"
              required
              autoComplete="name"
              placeholder="Ex.: Maria Silva"
              className={campoClasses}
              {...campo("nomeCliente")}
            />
          </div>
          <div>
            <label
              htmlFor="empresa"
              className="mb-1.5 block text-sm font-medium text-cinza-escuro"
            >
              Empresa ou CNPJ
            </label>
            <input
              id="empresa"
              name="empresa"
              placeholder="Ex.: Barbearia do Zé"
              className={campoClasses}
              {...campo("empresa")}
            />
          </div>
          <div>
            <label
              htmlFor="telefone"
              className="mb-1.5 block text-sm font-medium text-cinza-escuro"
            >
              WhatsApp
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
        </div>
      </Pergunta>

      <Pergunta
        numero={2}
        titulo="De qual mês é esse envio?"
        ajuda="O mês de referência do faturamento e do extrato."
      >
        <select
          id="competencia"
          name="competencia"
          required
          value={competencia}
          onChange={(e) => setCompetencia(e.target.value)}
          className={campoClasses}
        >
          {competencias.map((c) => (
            <option key={c.valor} value={c.valor}>
              {c.label}
            </option>
          ))}
        </select>
      </Pergunta>

      <Pergunta
        numero={3}
        titulo="Qual foi o faturamento do mês?"
        ajuda="O total que entrou no período, antes de descontar despesas."
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
            aria-label="Faturamento do mês em reais"
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
            Não tive movimento nesse mês
          </span>
        </label>
      </Pergunta>

      <Pergunta
        numero={4}
        titulo="Anexe o extrato bancário"
        ajuda={`PDF do extrato do mês (o do banco mesmo). Também aceitamos fotos e prints. Até ${TAMANHO_MAX_MB} MB por arquivo.`}
      >
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cinza-claro bg-nevoa px-4 py-8 text-center transition hover:border-azul hover:bg-white">
          <input
            ref={inputArquivo}
            type="file"
            accept={TIPOS_ACEITOS.join(",")}
            multiple
            onChange={receberArquivos}
            className="hidden"
          />
          <UploadIcon className="h-7 w-7 text-azul" />
          <span className="text-sm font-medium text-azul-escuro">
            {enviando > 0
              ? `Enviando ${enviando} arquivo${enviando > 1 ? "s" : ""}...`
              : "Toque para escolher os arquivos"}
          </span>
          <span className="text-xs text-cinza">PDF, JPG ou PNG</span>
        </label>

        {erroUpload && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {erroUpload}
          </p>
        )}

        {anexos.length > 0 && (
          <ul className="mt-4 space-y-2">
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
                  onClick={() => removerAnexo(a.url)}
                  aria-label={`Remover ${a.nome}`}
                  className="shrink-0 rounded-lg p-2 text-cinza transition hover:bg-red-50 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Pergunta>

      <Pergunta
        numero={5}
        titulo="Quer avisar mais alguma coisa?"
        ajuda="Opcional — algo fora do comum no mês, uma dúvida, um aviso."
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

      {state?.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={bloqueado}
        className="w-full rounded-xl bg-vermelho px-6 py-4 font-semibold text-white shadow-card transition-colors hover:bg-vermelho-escuro disabled:opacity-60"
      >
        {pending
          ? "Enviando..."
          : enviando > 0
            ? "Aguarde os anexos terminarem..."
            : "Enviar para a Start Cont"}
      </button>
    </form>
  );
}
