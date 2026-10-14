import type { Metadata, Viewport } from "next";
import { Comfortaa, Inter, Montserrat } from "next/font/google";
import { site } from "@/lib/site";
import { GOOGLE_ADS_ID } from "@/lib/googleAds";
import { ConversaoWhatsApp } from "@/components/ConversaoWhatsApp";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Só para o wordmark "Start Cont" (letras arredondadas do logo)
const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Start Cont — Contabilidade em Belo Horizonte | Assessoria Contábil",
    template: "%s | Start Cont",
  },
  description:
    "Assessoria contábil em Belo Horizonte com atendimento humanizado para pessoas e empresas: abertura de empresa, contabilidade mensal, planejamento tributário, departamento pessoal e Imposto de Renda.",
  applicationName: site.nomeCompleto,
  keywords: [
    "contabilidade em Belo Horizonte",
    "escritório de contabilidade BH",
    "contador em Belo Horizonte",
    "assessoria contábil",
    "abertura de empresa BH",
    "planejamento tributário",
    "reforma tributária Simples Nacional",
    "departamento pessoal",
    "imposto de renda BH",
    "regularização de CNPJ",
  ],
  authors: [{ name: site.nomeCompleto, url: site.url }],
  creator: site.nomeCompleto,
  publisher: site.nomeCompleto,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.nomeCompleto,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Cole aqui o código do Google Search Console quando verificar o domínio.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0b1530",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${montserrat.variable} ${comfortaa.variable} h-full antialiased`}
    >
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PDHJ99F2');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Tag do Google Ads direto no HTML, como o Google pede — o verificador
            do Ads não enxerga a tag injetada depois pelo next/script. */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-branco text-tinta">
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PDHJ99F2"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {/* End Google Tag Manager (noscript) */}
        {children}
        <ConversaoWhatsApp />
      </body>
    </html>
  );
}
