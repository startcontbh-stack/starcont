import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EnvioCard, type EnvioCardData } from "@/components/admin/EnvioCard";
import { competenciaLabel, formatarBRL } from "@/lib/portal";
import { senhaConfigurada } from "@/lib/auth";

export const dynamic = "force-dynamic";

const dataHora = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function EnviosPage() {
  const envios = await prisma.envio.findMany({
    orderBy: [{ competencia: "desc" }, { createdAt: "desc" }],
    include: { arquivos: { orderBy: { createdAt: "asc" } } },
  });

  // Agrupa por mês de referência mantendo a ordem da consulta (mais recente
  // primeiro), pra o contador fechar um mês de cada vez.
  const porCompetencia = new Map<string, EnvioCardData[]>();
  for (const e of envios) {
    const lista = porCompetencia.get(e.competencia) ?? [];
    lista.push({
      id: e.id,
      nomeCliente: e.nomeCliente,
      empresa: e.empresa,
      telefone: e.telefone,
      faturamentoCentavos: e.faturamentoCentavos,
      semMovimento: e.semMovimento,
      observacoes: e.observacoes,
      status: e.status,
      criadoEm: dataHora.format(e.createdAt),
      arquivos: e.arquivos.map((a) => ({
        id: a.id,
        nome: a.nome,
        url: a.url,
        tamanho: a.tamanho,
      })),
    });
    porCompetencia.set(e.competencia, lista);
  }

  const portalLiberado = senhaConfigurada("portal");

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-azul-escuro">
            Envios dos clientes
          </h1>
          <p className="mt-1 text-cinza">
            Faturamento e extratos que chegaram pela área do cliente.
          </p>
        </div>
        <Link
          href="/portal"
          target="_blank"
          className="rounded-xl border border-cinza-claro bg-white px-4 py-2.5 text-sm font-semibold text-cinza-escuro hover:bg-nevoa"
        >
          Abrir a área do cliente ↗
        </Link>
      </div>

      {!portalLiberado && (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900">
          <strong className="font-semibold">A área do cliente está fechada.</strong>{" "}
          Defina a variável de ambiente <code className="font-mono">PORTAL_PASSWORD</code>{" "}
          na Vercel (ou no arquivo <code className="font-mono">.env</code>) com a
          senha que você vai passar para os clientes.
        </p>
      )}

      {envios.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-cinza-claro bg-white px-5 py-10 text-center text-sm text-cinza">
          Nenhum envio recebido ainda.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {Array.from(porCompetencia.entries()).map(([competencia, lista]) => {
            const total = lista.reduce(
              (soma, e) => soma + (e.semMovimento ? 0 : (e.faturamentoCentavos ?? 0)),
              0
            );
            return (
              <section key={competencia}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-cinza-claro pb-3">
                  <h2 className="font-display text-lg font-semibold text-azul-escuro">
                    {competenciaLabel(competencia)}
                  </h2>
                  <p className="text-sm text-cinza">
                    {lista.length} envio{lista.length > 1 ? "s" : ""} ·{" "}
                    <span className="font-medium text-cinza-escuro">
                      {formatarBRL(total)}
                    </span>{" "}
                    no total
                  </p>
                </div>
                <div className="mt-5 space-y-5">
                  {lista.map((envio) => (
                    <EnvioCard key={envio.id} envio={envio} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
