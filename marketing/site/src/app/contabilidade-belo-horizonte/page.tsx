import type { Metadata } from "next";
import { LandingContabilidade } from "@/components/LandingContabilidade";

export const metadata: Metadata = {
  title: "Contador em Belo Horizonte | Presencial e Online",
  description:
    "Contador em Belo Horizonte para pessoa física e empresas: assessoria na abertura de empresas, contabilidade mensal, impostos e Reforma Tributária. Fale agora pelo WhatsApp.",
  alternates: { canonical: "/contabilidade-belo-horizonte" },
  openGraph: {
    title: "Contador em Belo Horizonte | Start Cont",
    url: "/contabilidade-belo-horizonte",
  },
};

export default function Page() {
  return <LandingContabilidade />;
}
