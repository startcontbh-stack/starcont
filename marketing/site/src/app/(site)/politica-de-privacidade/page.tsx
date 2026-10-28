import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Start Cont coleta, usa e protege os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
  alternates: { canonical: "/politica-de-privacidade" },
  openGraph: {
    title: "Política de Privacidade | Start Cont",
    url: "/politica-de-privacidade",
  },
};

const ATUALIZACAO = "28 de outubro de 2026";

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold text-azul-escuro">{titulo}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-cinza-escuro">{children}</div>
    </section>
  );
}

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="bg-nevoa">
      <BreadcrumbJsonLd
        itens={[
          { nome: "Início", path: "/" },
          { nome: "Política de Privacidade", path: "/politica-de-privacidade" },
        ]}
      />
      <article className="mx-auto max-w-3xl px-5 py-16">
        <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
          Privacidade
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold text-azul-escuro">
          Política de Privacidade
        </h1>
        <p className="mt-4 text-cinza">Última atualização: {ATUALIZACAO}.</p>

        <Secao titulo="Quem somos">
          <p>
            A {site.nomeCompleto} (&ldquo;Start Cont&rdquo;) é uma empresa
            privada de assessoria contábil e consultoria empresarial, sem
            vínculo ou representação oficial com órgãos governamentais ou
            entidades públicas. Esta política explica como tratamos os dados
            pessoais de quem visita este site ou fala com a gente, conforme a
            Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
          </p>
        </Secao>

        <Secao titulo="Quais dados coletamos">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Formulário de contato:</strong> nome, cidade, telefone e o
              serviço de interesse, informados por você.
            </li>
            <li>
              <strong>WhatsApp, telefone e e-mail:</strong> os dados e as
              mensagens que você nos envia ao entrar em contato por esses
              canais.
            </li>
            <li>
              <strong>Área do cliente:</strong> documentos e informações que
              clientes enviam para a execução dos serviços contratados.
            </li>
            <li>
              <strong>Dados de navegação:</strong> informações técnicas como
              páginas acessadas, tipo de dispositivo e navegador, coletadas por
              cookies e tecnologias semelhantes (veja a seção de cookies).
            </li>
          </ul>
        </Secao>

        <Secao titulo="Para que usamos os dados">
          <ul className="list-disc space-y-2 pl-5">
            <li>Responder ao seu contato e enviar propostas de serviços.</li>
            <li>Prestar e administrar os serviços contábeis contratados.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
            <li>
              Medir o desempenho do site e dos nossos anúncios, e melhorar a
              sua experiência — somente com o seu consentimento, quando se
              tratar de cookies de publicidade e medição.
            </li>
          </ul>
        </Secao>

        <Secao titulo="Bases legais">
          <p>
            Tratamos dados com base no seu consentimento, na execução de
            contrato ou de procedimentos preliminares a pedido seu, no
            cumprimento de obrigação legal ou regulatória e no legítimo
            interesse da Start Cont, sempre respeitando os seus direitos e
            liberdades (art. 7º da LGPD).
          </p>
        </Secao>

        <Secao titulo="Cookies e tecnologias de medição">
          <p>
            Usamos cookies essenciais para o funcionamento do site e das áreas
            restritas. Cookies de publicidade e medição, como os do Google Ads
            e do Google Tag Manager, ficam desativados até você clicar em
            &ldquo;Aceitar&rdquo; no aviso de cookies. Você pode recusar ou
            mudar a sua escolha a qualquer momento pelo link &ldquo;Preferências
            de cookies&rdquo; no rodapé do site, e também pode apagar os
            cookies nas configurações do seu navegador.
          </p>
        </Secao>

        <Secao titulo="Com quem compartilhamos">
          <p>
            Não vendemos dados pessoais. Podemos compartilhá-los com
            prestadores que nos ajudam a operar o site e os serviços, como
            hospedagem e banco de dados, ferramentas do Google (publicidade e
            medição) e o WhatsApp para atendimento, e com autoridades quando
            houver obrigação legal. Alguns desses prestadores podem tratar
            dados fora do Brasil, com as garantias previstas na LGPD.
          </p>
        </Secao>

        <Secao titulo="Por quanto tempo guardamos">
          <p>
            Guardamos os dados pelo tempo necessário para cumprir as
            finalidades acima e as obrigações legais e contábeis aplicáveis.
            Depois disso, eles são eliminados ou anonimizados.
          </p>
        </Secao>

        <Secao titulo="Seus direitos">
          <p>
            Você pode pedir a qualquer momento: confirmação de que tratamos os
            seus dados, acesso, correção, anonimização, bloqueio ou eliminação
            de dados desnecessários, portabilidade, informação sobre
            compartilhamento e a revogação do consentimento (art. 18 da LGPD).
          </p>
        </Secao>

        <Secao titulo="Segurança">
          <p>
            Adotamos medidas técnicas e administrativas para proteger os dados
            contra acesso não autorizado, perda e uso indevido.
          </p>
        </Secao>

        <Secao titulo="Fale com a gente sobre privacidade">
          <p>
            Para exercer os seus direitos ou tirar dúvidas sobre esta política,
            escreva para{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-azul underline underline-offset-2"
            >
              {site.email}
            </a>{" "}
            ou fale pelo telefone {site.telefoneExibicao}.
          </p>
        </Secao>

        <Secao titulo="Mudanças nesta política">
          <p>
            Podemos atualizar esta política para refletir mudanças no site ou
            na lei. A data da última atualização fica sempre no topo desta
            página.
          </p>
        </Secao>
      </article>
    </div>
  );
}
