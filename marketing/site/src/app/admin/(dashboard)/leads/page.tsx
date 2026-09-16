import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { LeadsBoard, type KanbanLead } from "@/components/admin/LeadsKanban";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const cards: KanbanLead[] = leads.map((lead) => ({
    id: lead.id,
    nome: lead.nome,
    cidade: lead.cidade,
    telefone: lead.telefone,
    interesse: lead.interesse,
    origem: lead.origem,
    recebidoEm: formatDate(lead.createdAt),
    status: lead.status,
    profissional: lead.profissional ?? null,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-azul-escuro">
            Contatos recebidos
          </h1>
          <p className="mt-1 text-cinza">
            Arraste cada contato pelas etapas e marque quem é o responsável.
          </p>
        </div>
        <span className="rounded-full bg-azul/10 px-4 py-2 text-sm font-semibold text-azul">
          {leads.length} {leads.length === 1 ? "contato" : "contatos"}
        </span>
      </div>

      {leads.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-cinza-claro bg-white p-12 text-center text-cinza">
          Nenhum contato recebido ainda. Quando alguém preencher um formulário do
          site, aparecerá aqui na coluna “Entrou em contato”.
        </div>
      ) : (
        <LeadsBoard leads={cards} />
      )}
    </div>
  );
}
