import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServico, servicoPath, servicos } from "@/lib/site";
import { ServicoLanding } from "@/components/ServicoLanding";

// Páginas 100% estáticas — uma por serviço de `servicos` (@/lib/site).
export const dynamicParams = false;

export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const servico = getServico(slug);
  if (!servico) return {};
  return {
    title: servico.seoTitle,
    description: servico.seoDescription,
    keywords: [servico.keyword, servico.titulo, "Start Cont", "contabilidade BH"],
    alternates: { canonical: servicoPath(servico.slug) },
    openGraph: {
      title: `${servico.titulo} | Start Cont`,
      description: servico.seoDescription,
      url: servicoPath(servico.slug),
      type: "website",
    },
  };
}

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const servico = getServico(slug);
  if (!servico) notFound();

  return <ServicoLanding servico={servico} />;
}
