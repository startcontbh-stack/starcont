import { equipe, site } from "@/lib/site";
import { ScrollReelTestimonials } from "./ui/scroll-reel-testimonials";

/** Carrossel da equipe — fotos em public/equipe (placeholders até o cliente enviar). */
export function EquipeReel() {
  return (
    <ScrollReelTestimonials
      autoPlay
      autoPlayMs={6000}
      testimonials={equipe.map((p) => ({
        quote: p.frase,
        author: `${p.nome} · ${p.cargo}`,
        image: p.foto,
        alt: `${p.nome} — ${p.cargo}, ${site.nome}`,
      }))}
    />
  );
}
