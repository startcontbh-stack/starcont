FOTOS DA EQUIPE

Para trocar uma foto, substitua o arquivo mantendo EXATAMENTE o mesmo nome:

  rodrigo.webp      -> Rodrigo Mendonça (contador / fundador)  [NO AR]

A seção "Quem cuida da sua empresa" hoje tem dois cartões: o Rodrigo e a
própria marca (que usa public/marca/logo-circular.webp). Os arquivos abaixo
NÃO aparecem no site no momento — para voltar a usá-los, acrescente o item
correspondente na lista "equipe" em src/lib/site.ts:

  equipe.webp       -> foto da equipe Start Cont               [sem uso]
  atendimento.webp  -> foto de atendimento / visita            [sem uso]

Obs.: a foto do Rodrigo veio de um selfie espelhado (o logo do polo aparecia
invertido). Ela foi desespelhada antes de entrar no site. Se mandar uma foto
nova tirada com a câmera frontal, confira se o logo está legível.

Recomendações:
  - Formato quadrado (ex.: 600x600 ou 800x800), rosto bem enquadrado e nítido.
  - Salve em .webp (qualidade ~85). Se só tiver .jpg/.png, converta antes
    ou peça pro Claude converter.

Os textos (nome, cargo e frase de cada foto) ficam em src/lib/site.ts,
na lista "equipe".

A foto do autor dos artigos do blog é trocada pelo painel:
  /admin -> Autores -> Editar -> Foto.
