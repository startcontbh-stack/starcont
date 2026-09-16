import { mensagemPadrao, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

export function WhatsAppFloat({
  mensagem = mensagemPadrao,
}: {
  mensagem?: string;
}) {
  return (
    <a
      href={whatsappLink(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_8px_30px_-6px_rgba(37,211,102,0.6)] transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
