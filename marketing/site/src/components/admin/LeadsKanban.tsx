"use client";

import { useState, useTransition } from "react";
import {
  updateLeadStatus,
  setLeadProfissional,
  deleteLead,
} from "@/app/admin/actions";
import { WhatsAppIcon } from "@/components/Icons";
import { responsaveisCrm } from "@/lib/site";

export type KanbanLead = {
  id: string;
  nome: string;
  cidade: string;
  telefone: string;
  interesse: string | null;
  origem: string;
  recebidoEm: string;
  status: string;
  profissional: string | null;
};

const COLUMNS = [
  { key: "entrou_em_contato", title: "Entrou em contato", short: "Entrou", dot: "bg-azul", head: "text-azul" },
  { key: "aguardando_fechamento", title: "Proposta enviada", short: "Proposta", dot: "bg-vermelho", head: "text-vermelho" },
  { key: "fechado", title: "Fechado", short: "Fechado", dot: "bg-emerald-500", head: "text-emerald-600" },
] as const;

// Cores alternadas para cada responsável (lista em responsaveisCrm, @/lib/site)
const CORES_RESPONSAVEL = [
  "bg-azul/10 text-azul ring-azul/30",
  "bg-vermelho/15 text-vermelho-escuro ring-vermelho/40",
  "bg-emerald-50 text-emerald-700 ring-emerald-300",
];

const PROFISSIONAIS = responsaveisCrm.map((nome, i) => ({
  nome,
  cls: CORES_RESPONSAVEL[i % CORES_RESPONSAVEL.length],
}));

/** Rótulo amigável da página de origem do contato. */
function origemLabel(origem: string) {
  if (origem.startsWith("servico-")) return `Página: ${origem.slice(8).replace(/-/g, " ")}`;
  if (origem === "lp-contabilidade-bh") return "Landing page BH";
  return origem;
}

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

/** Link do WhatsApp do contato — acrescenta o DDI 55 só quando ele não veio digitado. */
function waLink(telefone: string) {
  const d = onlyDigits(telefone);
  return `https://wa.me/${d.startsWith("55") && d.length >= 12 ? d : `55${d}`}`;
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    </svg>
  );
}

function profClass(nome: string | null) {
  return PROFISSIONAIS.find((p) => p.nome === nome)?.cls ?? "";
}

function statusMeta(key: string) {
  return COLUMNS.find((c) => c.key === key) ?? COLUMNS[0];
}

export function LeadsBoard({ leads: initial }: { leads: KanbanLead[] }) {
  const [leads, setLeads] = useState(initial);
  const [view, setView] = useState<"kanban" | "lista">("kanban");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function move(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    startTransition(() => updateLeadStatus(id, status));
  }

  function setProf(id: string, value: string | null) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, profissional: value } : l))
    );
    startTransition(() => setLeadProfissional(id, value));
  }

  function toggleProf(id: string, nome: string) {
    const next =
      leads.find((l) => l.id === id)?.profissional === nome ? null : nome;
    setProf(id, next);
  }

  function remove(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    const fd = new FormData();
    fd.set("id", id);
    startTransition(() => deleteLead(fd));
  }

  /* ---------- peças reutilizadas ---------- */

  function profTags({ lead }: { lead: KanbanLead }) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-cinza">Responsável:</span>
        {PROFISSIONAIS.map((p) => {
          const active = lead.profissional === p.nome;
          return (
            <button
              key={p.nome}
              type="button"
              onClick={() => toggleProf(lead.id, p.nome)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 transition ${
                active
                  ? p.cls
                  : "bg-white text-cinza ring-cinza-claro hover:ring-azul/40"
              }`}
            >
              {p.nome}
            </button>
          );
        })}
      </div>
    );
  }

  function whats({ telefone }: { telefone: string }) {
    return (
      <a
        href={waLink(telefone)}
        target="_blank"
        rel="noopener noreferrer"
        title="Abrir conversa no WhatsApp"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 px-2.5 py-1 text-xs font-semibold text-[#1fa855] hover:bg-[#25D366]/20"
      >
        <WhatsAppIcon className="h-4 w-4" /> Conversar
      </a>
    );
  }

  function viewToggle() {
    return (
      <div className="mt-6 inline-flex rounded-xl border border-cinza-claro bg-white p-1">
        {(["kanban", "lista"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${
              view === v
                ? "bg-azul text-white"
                : "text-cinza hover:text-azul-escuro"
            }`}
          >
            {v === "kanban" ? "Kanban" : "Lista"}
          </button>
        ))}
      </div>
    );
  }

  /* ---------- visão Kanban ---------- */

  function kanbanView() {
    return (
      <div className="mt-5 grid items-start gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = leads.filter((l) => l.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.key);
              }}
              onDragLeave={() =>
                setOverCol((c) => (c === col.key ? null : c))
              }
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) move(dragId, col.key);
                setDragId(null);
                setOverCol(null);
              }}
              className={`rounded-2xl border p-3 transition-colors ${
                overCol === col.key
                  ? "border-azul bg-azul/5"
                  : "border-cinza-claro bg-nevoa/60"
              }`}
            >
              <div className="flex items-center justify-between px-1 pb-3">
                <span className={`flex items-center gap-2 text-sm font-semibold ${col.head}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                  {col.title}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-cinza">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-cinza-claro px-3 py-6 text-center text-xs text-cinza">
                    Arraste um contato pra cá
                  </p>
                )}

                {items.map((lead) => (
                  <article
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                    className={`cursor-grab rounded-xl border border-cinza-claro bg-white p-4 shadow-suave active:cursor-grabbing ${
                      dragId === lead.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-tinta">{lead.nome}</p>
                      {lead.profissional && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${profClass(
                            lead.profissional
                          )}`}
                        >
                          {lead.profissional}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-cinza">
                      {lead.cidade} · {lead.recebidoEm}
                    </p>
                    <p className="mt-1 text-sm text-cinza-escuro">{lead.telefone}</p>
                    {lead.interesse && (
                      <p className="mt-2 inline-block rounded-md bg-vermelho/10 px-2 py-0.5 text-[11px] font-semibold text-vermelho-escuro">
                        {lead.interesse}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-cinza">
                      {origemLabel(lead.origem)}
                    </p>

                    <div className="mt-3">
                      {profTags({ lead })}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-cinza-claro/70 pt-3">
                      {whats({ telefone: lead.telefone })}
                      <button
                        type="button"
                        onClick={() => remove(lead.id)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {COLUMNS.filter((c) => c.key !== lead.status).map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => move(lead.id, c.key)}
                          className="rounded-md bg-nevoa px-2 py-0.5 text-[11px] text-cinza-escuro transition hover:bg-azul/10 hover:text-azul"
                        >
                          → {c.title}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ---------- visão Lista ---------- */

  function listaView() {
    // min-w-0 em todas as células: as colunas viram puramente proporcionais,
    // então cabeçalho e linhas (grids separados) ficam alinhados.
    const COLS =
      "lg:grid-cols-[1.5fr_1fr_1.1fr_1.2fr_1fr_5rem] lg:[&>*]:min-w-0";
    const selectCls =
      "w-full min-w-0 truncate rounded-lg border border-cinza-claro bg-white px-2.5 py-2 text-xs text-tinta outline-none focus:border-azul";

    return (
      <div className="mt-5 overflow-hidden rounded-2xl border border-cinza-claro bg-white shadow-suave">
        <div
          className={`hidden gap-4 border-b border-cinza-claro bg-nevoa px-5 py-3 text-xs font-semibold uppercase tracking-wide text-cinza lg:grid ${COLS}`}
        >
          <span>Nome</span>
          <span>Cidade</span>
          <span>Telefone</span>
          <span>Etapa</span>
          <span>Responsável</span>
          <span className="text-right">Ações</span>
        </div>
        <ul className="divide-y divide-cinza-claro">
          {leads.map((lead) => {
            const meta = statusMeta(lead.status);
            return (
              <li
                key={lead.id}
                className={`grid grid-cols-1 gap-3 px-5 py-4 text-sm lg:items-center lg:gap-4 ${COLS}`}
              >
                <div>
                  <span className="block truncate font-medium text-tinta">
                    {lead.nome}
                  </span>
                  <span className="block text-xs text-cinza">
                    {lead.recebidoEm}
                    {lead.interesse ? ` · ${lead.interesse}` : ""}
                  </span>
                </div>
                <span className="truncate text-cinza-escuro">{lead.cidade}</span>
                <span className="truncate text-cinza-escuro">
                  {lead.telefone}
                </span>

                {/* Etapa */}
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`}
                  />
                  <select
                    value={lead.status}
                    onChange={(e) => move(lead.id, e.target.value)}
                    className={selectCls}
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.short}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Responsável — mostra só o que está setado */}
                <select
                  value={lead.profissional ?? ""}
                  onChange={(e) => setProf(lead.id, e.target.value || null)}
                  className={`${selectCls} font-semibold ${
                    lead.profissional ? "text-azul-escuro" : "text-cinza"
                  }`}
                >
                  <option value="">— Definir</option>
                  {PROFISSIONAIS.map((p) => (
                    <option key={p.nome} value={p.nome}>
                      {p.nome}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5 lg:justify-end">
                  <a
                    href={waLink(lead.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Conversar no WhatsApp"
                    className="grid h-8 w-8 place-items-center rounded-lg bg-[#25D366]/10 text-[#1fa855] transition hover:bg-[#25D366]/20"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(lead.id)}
                    title="Excluir contato"
                    className="grid h-8 w-8 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {viewToggle()}
      {view === "kanban" ? kanbanView() : listaView()}
    </div>
  );
}
