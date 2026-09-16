import { servicoPath, servicos, site, type Servico } from "@/lib/site";

// Dados estruturados (Schema.org JSON-LD) — ajudam o Google e as IAs (GEO)
// a entenderem que a Start Cont é um escritório de contabilidade local, com
// área de atendimento na Grande BH e atendimento online no Brasil.

export const empresaId = `${site.url}/#empresa`;

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // "<" escapado para o JSON nunca fechar a tag <script> antes da hora
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Referência curta à empresa — usada como provider/publisher em outros schemas. */
export function empresaRef() {
  return {
    "@type": "AccountingService" as const,
    "@id": empresaId,
    name: site.nomeCompleto,
    url: site.url,
    logo: `${site.url}/logo-startcont.png`,
  };
}

function areaServed() {
  return [
    ...site.areaAtendida.map((nome) => ({
      "@type": "City",
      name: `${nome}, ${site.cidadeBase.estado}`,
    })),
    { "@type": "Country", name: "Brasil" },
  ];
}

export function EmpresaJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AccountingService",
        "@id": empresaId,
        name: site.nomeCompleto,
        alternateName: site.nome,
        url: site.url,
        logo: `${site.url}/logo-startcont.png`,
        image: `${site.url}/logo-startcont.png`,
        description: site.descricao,
        slogan: site.slogan,
        telephone: site.telefoneE164,
        email: site.email,
        ...(site.cnpj ? { taxID: site.cnpj } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: site.cidadeBase.cidade,
          addressRegion: site.cidadeBase.estado,
          addressCountry: "BR",
        },
        areaServed: areaServed(),
        sameAs: [site.instagram],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: site.telefoneE164,
          email: site.email,
          availableLanguage: "pt-BR",
          areaServed: "BR",
        },
        knowsAbout: [
          "Contabilidade empresarial",
          "Abertura de empresas",
          "Planejamento tributário",
          "Reforma Tributária (IBS e CBS)",
          "Simples Nacional",
          "Departamento pessoal e eSocial",
          "Imposto de Renda Pessoa Física",
          "Regularização fiscal",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Serviços contábeis",
          itemListElement: servicos.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.titulo,
              description: s.resumo,
              url: `${site.url}${servicoPath(s.slug)}`,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#site`,
        name: site.nomeCompleto,
        url: site.url,
        inLanguage: "pt-BR",
        publisher: { "@id": empresaId },
      },
    ],
  };

  return <JsonLd data={data} />;
}

export function FaqJsonLd({
  perguntas,
}: {
  perguntas: { pergunta: string; resposta: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: perguntas.map((q) => ({
      "@type": "Question",
      name: q.pergunta,
      acceptedAnswer: { "@type": "Answer", text: q.resposta },
    })),
  };
  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  itens,
}: {
  itens: { nome: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: `${site.url}${item.path}`,
    })),
  };
  return <JsonLd data={data} />;
}

export function ServicoJsonLd({ servico }: { servico: Servico }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}${servicoPath(servico.slug)}#servico`,
    name: servico.titulo,
    serviceType: servico.titulo,
    description: servico.intro,
    url: `${site.url}${servicoPath(servico.slug)}`,
    provider: empresaRef(),
    areaServed: areaServed(),
    audience: { "@type": "Audience", audienceType: servico.publico },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `O que está incluído — ${servico.titulo}`,
      itemListElement: servico.inclui.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  };
  return <JsonLd data={data} />;
}
