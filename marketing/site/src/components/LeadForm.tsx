"use client";

import { useState } from "react";
import { interesses, whatsappLink } from "@/lib/site";
import { registrarConversaoContato } from "@/lib/googleAds";
import { WhatsAppIcon } from "./Icons";

export function LeadForm({
  origem,
  interessePadrao = "",
  idPrefix = "lead",
}: {
  /** De qual página veio o contato — aparece no CRM. */
  origem: string;
  /** Já deixa o campo "Do que você precisa?" preenchido (páginas de serviço). */
  interessePadrao?: string;
  /** Prefixo dos ids dos campos — obrigatório diferente se houver dois formulários na página. */
  idPrefix?: string;
}) {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState(interessePadrao);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const valido = nome.trim() && cidade.trim() && telefone.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!valido) {
      setErro("Por favor, preencha nome, cidade e telefone.");
      return;
    }

    setLoading(true);
    registrarConversaoContato();

    // Registra o lead no CRM (não bloqueia o WhatsApp se falhar)
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, telefone, interesse, origem }),
      });
    } catch {
      // segue para o WhatsApp mesmo assim
    }

    const assunto = interesse ? ` Preciso de: ${interesse}.` : "";
    const mensagem = `Olá! Meu nome é ${nome}, sou de ${cidade} (tel: ${telefone}).${assunto} Vim pelo site da Start Cont.`;
    window.open(whatsappLink(mensagem), "_blank", "noopener,noreferrer");

    setLoading(false);
  }

  const inputClass =
    "w-full rounded-xl border border-cinza-claro bg-white px-4 py-3 text-tinta outline-none transition focus:border-azul focus:ring-2 focus:ring-azul/20 md:py-3.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor={`${idPrefix}-nome`} className="sr-only">
          Nome
        </label>
        <input
          id={`${idPrefix}-nome`}
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-cidade`} className="sr-only">
          Cidade
        </label>
        <input
          id={`${idPrefix}-cidade`}
          type="text"
          placeholder="Sua cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className={inputClass}
          autoComplete="address-level2"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-telefone`} className="sr-only">
          Telefone
        </label>
        <input
          id={`${idPrefix}-telefone`}
          type="tel"
          placeholder="Seu telefone / WhatsApp"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className={inputClass}
          autoComplete="tel"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-interesse`} className="sr-only">
          Do que você precisa?
        </label>
        <select
          id={`${idPrefix}-interesse`}
          value={interesse}
          onChange={(e) => setInteresse(e.target.value)}
          className={`${inputClass} ${interesse ? "" : "text-cinza"}`}
        >
          <option value="">Do que você precisa? (opcional)</option>
          {interesses.map((i) => (
            <option key={i} value={i} className="text-tinta">
              {i}
            </option>
          ))}
        </select>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full animate-pulse-cta items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#25D366] px-4 py-3.5 text-[0.95rem] font-bold leading-none text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-all hover:scale-[1.01] hover:bg-[#1fb855] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:animate-none md:gap-2.5 md:px-6 md:py-4 md:text-lg"
      >
        <WhatsAppIcon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
        {loading ? "Abrindo WhatsApp..." : "Quero falar pelo WhatsApp"}
      </button>
      <p className="text-center text-xs text-cinza">
        Resposta rápida · Atendimento humanizado
      </p>
    </form>
  );
}
