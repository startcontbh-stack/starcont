import { LeadForm } from "./LeadForm";

export function FormCard({
  titulo = "Fale com um contador",
  subtitulo = "Preencha os dados e fale agora com a Start Cont pelo WhatsApp.",
  origem,
  interessePadrao,
  idPrefix,
}: {
  titulo?: string;
  subtitulo?: string;
  origem: string;
  interessePadrao?: string;
  idPrefix?: string;
}) {
  return (
    <div className="rounded-3xl border border-cinza-claro bg-white p-5 text-tinta shadow-card md:p-7">
      <h2 className="font-display text-lg font-bold text-azul-escuro md:text-xl">
        {titulo}
      </h2>
      <p className="mt-1.5 text-sm text-cinza">{subtitulo}</p>
      <div className="mt-4 md:mt-5">
        <LeadForm
          origem={origem}
          interessePadrao={interessePadrao}
          idPrefix={idPrefix}
        />
      </div>
    </div>
  );
}
