/** Perguntas frequentes em <details> — funciona sem JavaScript e é lido pelo Google. */
export function Faq({
  perguntas,
}: {
  perguntas: { pergunta: string; resposta: string }[];
}) {
  return (
    <div className="divide-y divide-cinza-claro overflow-hidden rounded-3xl border border-cinza-claro bg-white shadow-suave">
      {perguntas.map((q) => (
        <details key={q.pergunta} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
            <h3 className="font-display text-base font-semibold text-azul-escuro md:text-lg">
              {q.pergunta}
            </h3>
            <span
              aria-hidden="true"
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-vermelho/10 text-lg leading-none text-vermelho transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-cinza-escuro">{q.resposta}</p>
        </details>
      ))}
    </div>
  );
}
