# SEO on-page — site da Start Cont

> Passo 4 do fluxo `/seo`, aplicado direto no código do site (`marketing/site`).
> As palavras-chave foram escolhidas pela intenção de busca (comercial e local).
> **Volume de busca não foi medido.** Validar no Google Keyword Planner ao rodar
> o passo 1 (`/seo demanda`).

## Mapa de páginas

| Página | Keyword principal | Title | H1 |
| --- | --- | --- | --- |
| `/` | contabilidade em Belo Horizonte | Contabilidade em Belo Horizonte \| Start Cont Assessoria | Contabilidade em Belo Horizonte · Simplificamos o burocrático para você… |
| `/servicos` | serviços de contabilidade BH | Serviços de Contabilidade em Belo Horizonte \| Start Cont | Serviços de contabilidade para pessoas e empresas |
| `/servicos/contabilidade-para-empresas` | escritório de contabilidade em Belo Horizonte | Escritório de Contabilidade em BH para Empresas \| Start Cont | Contabilidade que entende o seu negócio e cuida do que importa. |
| `/servicos/abertura-de-empresa` | abertura de empresa em Belo Horizonte | Abertura de Empresa em BH com Contador \| Start Cont | Abra sua empresa do jeito certo, sem dor de cabeça. |
| `/servicos/planejamento-tributario` | planejamento tributário em Belo Horizonte | Planejamento Tributário em BH e Reforma Tributária \| Start Cont | Imposto justo, dentro da lei, e sua empresa pronta para a Reforma. |
| `/servicos/departamento-pessoal` | departamento pessoal terceirizado em BH | Departamento Pessoal e Folha de Pagamento em BH \| Start Cont | Folha de pagamento em dia e equipe tranquila. |
| `/servicos/regularizacao-fiscal` | regularização de empresa em Belo Horizonte | Regularização de Empresa, MEI e CPF em BH \| Start Cont | Pendências com o fisco? A gente resolve com você. |
| `/servicos/imposto-de-renda` | contador para imposto de renda em BH | Contador para Imposto de Renda em BH \| Start Cont | Imposto de Renda feito com cuidado e sem medo da malha fina. |
| `/contabilidade-belo-horizonte` | contador em Belo Horizonte | Contador em Belo Horizonte \| Presencial e Online \| Start Cont | Um contador de verdade, perto de você — sem burocracia. |
| `/blog` | blog de contabilidade | Blog de Contabilidade e Reforma Tributária \| Start Cont | Contabilidade explicada sem complicação |
| `/blog/reforma-tributaria-simples-nacional-simples-comum-ou-hibrido` | Simples Comum ou Simples Híbrido | (título do post) | Reforma Tributária e Simples Nacional: Simples Comum ou Simples Híbrido em 2027? |

As meta descriptions (150–160 caracteres, com CTA) estão em `src/lib/site.ts`
(serviços) e no `metadata` de cada página.

## Dados estruturados (JSON-LD)

| Schema | Onde |
| --- | --- |
| `AccountingService` + `WebSite` (área atendida: 10 cidades da Grande BH + Brasil, Instagram em `sameAs`, catálogo de serviços) | todas as páginas do site e a landing page |
| `Service` + `FAQPage` + `BreadcrumbList` | cada página de serviço |
| `FAQPage` | home e landing page |
| `BlogPosting` + `BreadcrumbList` (autor como `Person`) | cada artigo |
| `ProfilePage` | página do autor |

## Checklist técnico

| Item | Status |
| --- | --- |
| URLs amigáveis em português | feito |
| Title e description únicos por página | feito |
| Canonical em todas as páginas | feito |
| Open Graph + imagem de compartilhamento (1200×630, gerada no build) | feito |
| `sitemap.xml` dinâmico (páginas fixas, serviços, posts e autores) | feito |
| `robots.txt` bloqueando `/admin` e `/api` + `X-Robots-Tag: noindex` | feito |
| `manifest.webmanifest`, favicon e apple-touch-icon | feito |
| H1 único por página, hierarquia H2/H3 | feito |
| Alt text nas imagens | feito |
| Mobile-first (formulário na 1ª dobra no celular) | feito |
| Páginas estáticas / ISR (TTFB baixo) | feito |
| Respostas diretas no topo das páginas e FAQ em formato pergunta → resposta (GEO) | feito |
| Links internos: home → serviços → serviços relacionados → blog → serviço | feito |
| Domínio próprio em `NEXT_PUBLIC_SITE_URL` | **pendente** (cliente ainda não informou o domínio) |
| Verificar o domínio no Google Search Console e enviar o sitemap | **pendente** |
| Google Meu Negócio (perfil de área de atendimento, sem endereço público) | **pendente** — rodar `/seo gmb` |
| CNPJ e CRC no rodapé e no schema (`site.cnpj`, `site.crc`) | **pendente** — dado do cliente |
| Sobrenome do Rodrigo e registro CRC no autor (painel `/admin/autores`) | **pendente** — dado do cliente |
| Fotos reais da equipe (`public/equipe/*.webp`) | **pendente** — placeholders no lugar |
| Tag do Google Ads na landing page (`NEXT_PUBLIC_GOOGLE_ADS_ID`) | pendente (quando houver campanha) |

## Próximos conteúdos sugeridos (cluster "Reforma Tributária")

1. Split Payment: como funciona e o impacto no caixa da empresa
2. IBS e CBS: o que muda para prestadores de serviço
3. MEI ou microempresa: quando vale a pena migrar
4. Como trocar de contador sem dor de cabeça
5. Checklist de documentos para o Imposto de Renda

Cada item vira artigo + carrossel + legendas com `/publicar-tema`.
