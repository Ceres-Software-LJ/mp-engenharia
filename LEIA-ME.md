# MP Engenharia e Projetos — Landing Page

Landing page estática, responsiva e otimizada para conversão via WhatsApp.
Sem build, sem npm, sem framework: basta abrir `index.html` ou publicar a pasta.

**Stack:** HTML semântico + CSS puro + JavaScript com [GSAP](https://gsap.com)
(ScrollTrigger) hospedado no próprio projeto.

---

## Estrutura de arquivos

```
index.html                   Todo o conteúdo e os textos da página
vercel.json                  Configuração de deploy e cache
robots.txt / sitemap.xml     SEO

assets/css/style.css         Design system, cores, tipografia, responsivo
assets/js/main.js            Animações e interações (comentado por módulo)
assets/js/vendor/            GSAP 3.13 (gsap, ScrollTrigger)

assets/img/logo-mp.png       Monograma oficial (branco, fundo transparente)
assets/img/logo-mp-dark.png  Monograma em preto (para fundos claros)
assets/img/projeto-01..09    Fotos da galeria (1200×900)
assets/img/hero-poster.jpg   Primeiro quadro do vídeo do topo
assets/img/og-*.jpg          Imagem de compartilhamento em redes sociais

assets/video/hero-obra.mp4          Vídeo do topo, 1080p (desktop)
assets/video/hero-obra-mobile.mp4   Mesmo vídeo em 720p (celular)
assets/video/entrega.mp4            Vídeo da seção "A entrega", 1080p
assets/video/entrega-mobile.mp4     Mesmo vídeo em 720p

_fontes/                     Originais enviados pelo cliente (fora do Git)
```

---

## Animações

| Onde | O que acontece |
|------|----------------|
| **Topo (hero)** | O título sobe de dentro de máscaras, linha por linha. É **CSS puro**, de propósito: se dependesse do JavaScript, a nota de velocidade do Google despencaria |
| **Vídeo do topo** | No desktop fica **fixo na tela** enquanto o usuário rola: o texto sobe e some, e só então a próxima seção entra. No celular roda normalmente, sem fixação |
| **Entrada das seções** | Blocos sobem e aparecem em cascata quando entram na tela |
| **Filetes dourados** | A linha de 1px de cada seção se desenha da esquerda para a direita |
| **Etapas** | Um trilho vertical dourado se preenche conforme você lê, e o número da etapa atual acende |
| **Galeria** | As fotos se deslocam suavemente dentro do card (paralaxe) |
| **Avaliações** | Duas fileiras correm sozinhas em sentidos opostos e pausam com o mouse em cima |
| **Vídeo da entrega** | Paralaxe vertical e loop contínuo |
| **Cartões** | Elevação e ícone que sobe ao passar o mouse |
| **Botões** | Leve efeito magnético seguindo o cursor |
| **Barra do topo** | Fio dourado indicando o progresso de leitura |

Tudo respeita **"reduzir movimento"** do sistema operacional: quem ativa essa
opção vê a página inteira, estática e sem vídeo. Se o GSAP não carregar, a
abertura do topo continua funcionando (é CSS) e o resto do conteúdo aparece
normalmente.

---

## Como editar

### Textos
Estão todos no `index.html`, em português, com comentários marcando cada
seção (`A. HEADER`, `B. HERO`, `C. DORES`...). Procure o trecho e troque.

### Links do WhatsApp
Todos os botões seguem o formato:

```
https://wa.me/5567984180026?text=MENSAGEM
```

- `5567984180026` = 55 (Brasil) + 67 (DDD) + número, **sem espaços ou traços**
- `MENSAGEM` = texto já digitado para o cliente (`%20` = espaço, `%C3%A1` = á)

Para trocar o número no site inteiro, use **Localizar e substituir**:
procure `5567984180026`. O segundo número, `5567984180024`, é o da arquiteta
e aparece na seção "Sobre", na seção "Design de interiores", no CTA do
projeto arquitetônico e no rodapé.

### Cores e fontes
Concentradas no topo do `assets/css/style.css`, no bloco `:root`:

```css
--ink:   #111111;   /* preto asfalto      */
--paper: #F9F9F9;   /* off-white          */
--line:  #CCCCCC;   /* cinza metálico     */
--gold:  #C6A662;   /* dourado champagne  */
--wa:    #0C7A3B;   /* verde dos botões   */
```

Trocar um valor ali muda a cor no site inteiro.

### Trocar os vídeos
Cada vídeo tem **duas versões**: a normal (1080p) e a `-mobile` (720p, bem mais
leve). Substitua mantendo os mesmos nomes. Recomendado: 10 a 20 segundos, **sem
áudio**. Para gerar a versão de celular a partir da normal:

```bash
ffmpeg -i assets/video/hero-obra.mp4 -vf scale=1280:720 -c:v libx264 -crf 31 \n  -preset slow -pix_fmt yuv420p -an -movflags +faststart \n  assets/video/hero-obra-mobile.mp4
```

Para gerar a imagem de fallback (exibida antes do vídeo carregar):

```bash
ffmpeg -ss 4 -i assets/video/hero-obra.mp4 -frames:v 1 -q:v 4 assets/img/hero-poster.jpg
```

### Trocar ou adicionar fotos na galeria
Copie um bloco `<figure class="shot">` e ajuste `src`, `alt` e a legenda.
Não há limite de fotos. Para preparar uma imagem no formato certo (4:3):

```bash
ffmpeg -i original.jpg -vf "scale=1200:900:force_original_aspect_ratio=increase,crop=1200:900" -q:v 4 assets/img/projeto-10.jpg
```

### Imagens da seção "Anatomia do projeto"
Cada uma das 7 peças tem um espaço de imagem já reservado. Enquanto não
houver foto, aparece uma malha técnica com o ícone da peça.

Para colocar a imagem, encontre o `<div class="anat-media">` da peça e cole
um `<img>` dentro dele, logo abaixo do comentário `IMAGEM ·`:

```html
<div class="anat-media">
  <!-- IMAGEM · cole um <img> aqui... -->
  <img src="assets/img/anat-planta-baixa.jpg" alt="Planta baixa do projeto"
       loading="lazy" width="1200" height="900">
  <svg class="anat-ico" ...>...</svg>
</div>
```

Não precisa apagar o ícone nem a malha: a imagem cobre os dois sozinha.
O formato é o mesmo da galeria, 4:3 (1200x900), e dá para preparar com o
mesmo comando do ffmpeg da seção anterior.

### Imagens da seção "Design de interiores"
Funciona igual à "Anatomia do projeto": cada um dos 6 cards já tem um espaço
de imagem reservado, que mostra uma malha dourada com o ícone enquanto não
houver foto. Encontre o `<div class="int-media">` do card e cole um `<img>`
dentro dele, logo abaixo do comentário `IMAGEM ·`:

```html
<div class="int-media">
  <!-- IMAGEM · cole um <img> aqui... -->
  <img src="assets/img/int-iluminacao.jpg" alt="Projeto de iluminação da sala"
       loading="lazy" width="1200" height="900">
  <svg class="int-ico" ...>...</svg>
</div>
```

Mesmo formato das outras: 4:3 (1200x900).

### Formações da equipe (pós-graduações)
Na seção "Sobre", cada pessoa tem uma lista `<ul class="member-edu">` com as
formações complementares. Para acrescentar uma, basta somar um item:

```html
<ul class="member-edu">
  <li>Pós-graduação em Gestão de Projetos e Análise de Obras em BIM</li>
</ul>
```

O card do **Pedro** já tem essa lista pronta, comentada, esperando o dado —
é só apagar o `<!--` e o `-->` em volta e escrever a formação.

Quem tiver uma pós-graduação nova também deve ganhar a entrada correspondente
no bloco `application/ld+json` do topo do `index.html` (campo `hasCredential`),
que é o que os buscadores leem.

### Favicons (ícone da aba e da busca do Google)
Ficam na **raiz** do site: `favicon.ico` (16/32/48), `favicon-16x16.png`,
`favicon-32x32.png`, `favicon-96x96.png` e `apple-touch-icon.png` (180x180).
Foram gerados a partir de `logo favicon.jpg`, que tem só 150x150 — por isso o
de 180 fica levemente suave. Com uma arte quadrada de 512x512 ou mais, gere de
novo (troque `ARTE.png` pelo arquivo):

```bash
for s in 16 32 96; do ffmpeg -y -i ARTE.png -vf "scale=$s:$s:flags=lanczos" favicon-${s}x${s}.png; done
ffmpeg -y -i ARTE.png -vf "scale=180:180:flags=lanczos" apple-touch-icon.png
ffmpeg -y -i ARTE.png -vf "scale=48:48:flags=lanczos" favicon-48x48.png
```

O `favicon.ico` junta 16, 32 e 48 num arquivo só. Para montá-lo, use o
ImageMagick (`magick favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico`)
ou o site realfavicongenerator.net. Em ícone de 16px texto
pequeno não é legível: para essa medida, o ideal é uma versão só com o
monograma MP.

### Adicionar uma avaliação
Copie um bloco `<figure class="quote">` inteiro para dentro de uma das
`<div class="marquee-track">` e troque o texto, o nome e a legenda.
As cópias para o efeito de laço contínuo são feitas automaticamente.

Para mudar a velocidade, edite `data-speed` na `<div class="marquee">`
(número em segundos por volta — maior = mais lento).

### Fotos dos engenheiros
Na seção "Sobre", troque:

```html
<div class="avatar" aria-hidden="true"><span>MV</span></div>
```

por:

```html
<img class="avatar" src="assets/img/eng-matheus.jpg" alt="Eng. Matheus Victor Ferreira Barbosa">
```

---

## Pendências antes de divulgar

### Números que precisam ser confirmados pela MP

Cinco trechos do site trazem números que eu **não tinha como verificar**. Estão
marcados no código com o comentário `CONFIRMAR`. Para achar todos de uma vez:

```bash
grep -n "CONFIRMAR" index.html
```

| Onde | O que confirmar |
|------|-----------------|
| Credenciais do topo | O número **74 avaliações** — confira o total real no perfil do Google Meu Negócio |
| Nota abaixo do botão | **"Respondemos em até 2 horas úteis"** — só mantenha se a MP cumprir todo dia útil. Promessa de prazo que falha destrói mais confiança do que a ausência dela |
| FAQ · preço | O **modelo de cobrança** de projeto (por m²?) e de obra (percentual?) |
| FAQ · prazo | As três **faixas de prazo**: projeto, aprovação e obra |
| FAQ · visitas | A **frequência de visita** que a equipe consegue sustentar de fato |

> As estrelas dos depoimentos estão todas como 5. As avaliações que recebi não vinham
> com a nota, só com o texto — todos elogiosos. Vale conferir no Google se alguma
> não é 5 estrelas.

### Outros itens

| # | Item | Onde |
|---|------|------|
| 1 | ✅ **Domínio real** nas tags de SEO | Feito: `https://www.mp-engenhariaarquitetura.com.br/` em `index.html`, `robots.txt`, `sitemap.xml` e `llms.txt` |
| 2 | **Link do Google Meu Negócio** | Aparece em **dois** lugares: faixa de prova social e seção de avaliações |
| 3 | **Logo em vetor** (SVG ou PDF) | O logo atual foi extraído de um JPG de 150×150. Funciona, mas um SVG renderiza mais nítido — veja abaixo |
| 4 | **Fotos dos engenheiros** | Hoje aparecem as iniciais num quadrado. Em negócio de confiança, foto de rosto converte |
| 5 | **Dados das obras da galeria** | Legendas ganham força com metragem, bairro e prazo: "Sobrado 320 m² · Carandá · entregue em 11 meses" |

### Sobre o logo
O arquivo enviado (`LOGO OFICIAL.jpg`) tinha 150×150 pixels com fundo cinza.
Ele foi recortado e teve o fundo removido para funcionar sobre o header escuro.
No tamanho em que aparece no site (40px) fica bom, mas **se a agência que criou
a marca tiver o arquivo vetorial**, peça o `.svg` e substitua:

```html
<img class="brand-mark" src="assets/img/logo-mp.svg" alt="" width="480" height="403">
```

Ele aparece em **dois lugares**: header e rodapé.

---

## Publicação no Vercel

### O que o `vercel.json` faz

O arquivo não aceita comentários — o Vercel valida o formato de forma estrita e
recusa qualquer propriedade fora do padrão. A explicação de cada regra fica aqui:

| Regra | O que faz |
|---|---|
| `/assets/(fonts\|js/vendor)/(.*)` | Cache de **1 ano**. São arquivos com nome versionado (a fonte `manrope-400-700-latin.woff2` nunca muda de conteúdo), então podem ficar guardados para sempre |
| `/assets/(.*)` | Cache de **1 dia** para fotos, vídeos, CSS e JS. Assim, quando você trocar uma foto mantendo o mesmo nome, os visitantes veem a nova versão rapidamente |
| `/(.*)` | Cabeçalhos de segurança em todas as páginas: bloqueia adivinhação de tipo de arquivo, incorporação do site em iframes de terceiros e acesso a câmera, microfone e localização |
| `cleanUrls` | URLs sem `.html` no fim |

### Como publicar

1. Acesse [vercel.com/new](https://vercel.com/new) e entre com a conta do GitHub
2. Escolha o repositório **mp-engenharia**
3. Framework Preset: **Other** · Build Command: *(deixe vazio)* · Output Directory: *(deixe vazio)*
4. Clique em **Deploy**

Pronto. A cada `git push` na branch `main`, o Vercel republica sozinho.

Para usar domínio próprio: **Settings → Domains** no painel do Vercel.

### Depois de publicar

1. Cadastre o site no [Google Search Console](https://search.google.com/search-console)
2. Vincule o perfil do **Google Meu Negócio** (é de lá que vêm as avaliações)
3. Coloque o link na bio do Instagram [@mp__engenharia](https://www.instagram.com/mp__engenharia/)

---

## Fontes

As fontes ficam em `assets/fonts/` e são declaradas no **topo do
`assets/css/style.css`**. Não há chamada para o Google: isso elimina duas
conexões a servidor externo no carregamento.

Outfit e Manrope são **variáveis** — um arquivo cobre todos os pesos. Foi o que
derrubou o peso das fontes de 199 KB para 86 KB.

Logo abaixo delas há duas famílias `... Fallback`, com `size-adjust` e
`ascent-override`. Elas fazem o Arial ocupar exatamente o mesmo espaço enquanto
a fonte real carrega — sem isso o texto "pula" na troca, o que o Google penaliza.
**Se você trocar de fonte, esses percentuais precisam ser recalculados.**

Para regenerar (só se for mudar a tipografia):

```bash
# 1. Baixe o CSS do Google com um navegador moderno na identificação
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0" \
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300..700&family=Manrope:wght@400..700&display=swap"

# 2. Baixe os .woff2 dos subsets latin e latin-ext para assets/fonts/
# 3. Cole os @font-face no topo do style.css, trocando as URLs por ../fonts/
```

---

## Desempenho

Medido em Chrome com estrangulamento de **4G lento e processador 4× mais
devagar** — de propósito, o pior caso realista de um celular no Brasil.

| Métrica | Antes | Depois | Meta do Google |
|---|---|---|---|
| LCP no celular | 4.132 ms | **~2.730 ms** | < 2.500 ms |
| Peso baixado no celular | 438 KB | **195 KB** + vídeo sob demanda | — |
| CLS (salto de layout) | 0,05 | **0,0008** | < 0,1 |
| Conexões a terceiros | 1 | **0** | — |

O que foi feito:

- Fontes hospedadas no projeto, em versão variável (199 KB → 86 KB)
- Fallback com métricas idênticas: a troca de fonte não desloca nada
- A abertura do topo é **CSS puro**. Antes ela dependia de 145 KB de
  JavaScript carregarem, e era isso que travava a nota
- Poster do topo virou fundo de CSS a partir de 760px, evitando baixar a
  imagem de 1920px em tela pequena
- Poster da seção de entrega ganhou versão de celular (116 KB → 30 KB)
- Logo redimensionado para o tamanho real de exibição (32 KB → 10 KB)
- Vídeos em duas versões: 1080p no desktop e 720p no celular (664 KB e
  540 KB). Só começam a baixar quando o navegador fica ocioso, depois da
  primeira pintura — se baixarem antes, roubam banda do texto do topo
- Sem CDN, sem analytics, sem dependência externa

**Ainda ~120 ms acima da meta no pior caso.** Fechar essa diferença exige uma
escolha de marca: trocar `font-display: swap` por `optional` no `style.css`
faz o texto nunca "trocar" de fonte, mas quem entra pela primeira vez numa
conexão ruim vê a página inteira em Arial. Em conexão média o site já passa
folgado — vale medir com dados reais no Search Console antes de decidir.

## Acessibilidade

- Link "pular para o conteúdo", foco visível e navegação por teclado
- Textos alternativos em todas as imagens
- Contraste verificado: o verde dos botões é `#0C7A3B` (5,4:1 com texto branco).
  O verde oficial do WhatsApp (`#25D366`) tem contraste 1,9:1 e seria ilegível —
  por isso ele aparece só no pulso do botão flutuante.
- Respeita `prefers-reduced-motion`

---

## SEO e buscadores com IA

### Arquivos na raiz

| Arquivo | Para que serve |
|---|---|
| `robots.txt` | Libera os buscadores tradicionais **e os robôs de IA** (ChatGPT, Gemini, Claude, Perplexity, Copilot). Bloquear esses agentes tiraria a MP das respostas geradas por IA — que é onde muita gente hoje pergunta "qual engenheiro contratar em Campo Grande?" |
| `sitemap.xml` | Uma URL (o site é de página única) e as 9 fotos de projeto declaradas, para aparecerem na busca por imagens |
| `llms.txt` | Resumo em texto simples para assistentes de IA: serviços, os dois CREA, área de atendimento e contato. Traz também uma lista do que **não** deve ser afirmado sobre a empresa, para evitar que a IA invente preço, prazo ou tempo de mercado |

### Dados estruturados

O `index.html` tem **um único bloco JSON-LD** com um grafo de 8 entidades
ligadas entre si por `@id`: empresa, site, página, imagem, logotipo, os dois
engenheiros (cada um com seu CREA registrado como credencial) e o FAQ com as
10 perguntas. É esse formato que o Google e os buscadores com IA leem melhor.

**O FAQ do schema é gerado a partir do FAQ visível na página.** Se você editar
uma pergunta no HTML, edite também no bloco JSON-LD — os dois precisam bater,
senão o Google desqualifica a marcação.

Para conferir depois de publicar:
[Teste de Resultados Ricos do Google](https://search.google.com/test/rich-results).

### O que ainda falta para o SEO local

1. **Google Meu Negócio** é o fator número um para busca local — mais do que
   qualquer coisa no site. Perfil completo, com fotos, horário e categoria
   "Engenheiro civil" ou "Empreiteiro".
2. ✅ **Endereço com rua e número** — feito: está no rodapé, no schema e no
   `llms.txt`.
3. ✅ **Domínio** — feito: `https://www.mp-engenhariaarquitetura.com.br/`.
4. **Nota das avaliações no schema: NÃO adicionar.** As avaliações são do
   Google, e as diretrizes do Google proíbem marcar com `aggregateRating`
   avaliações coletadas em outro site; além disso, empresa local não ganha
   estrelas por avaliação sobre si mesma. As estrelas aparecem sozinhas no
   perfil do Google Meu Negócio.
5. ✅ **Horário e CNPJ** — feito: `openingHoursSpecification` (seg a sex,
   08:00–18:00) e `taxID` no schema, e os dois no `llms.txt`. Se o
   atendimento incluir sábado, acrescente "Saturday" em `dayOfWeek`.

### Sobre as palavras-chave

Os termos usados no título, na descrição e nos subtítulos foram derivados dos
serviços reais e da forma como se busca por eles em português
("engenheiro civil Campo Grande", "Habite-se Campo Grande",
"regularização de imóvel Campo Grande", "financiamento FCO Mato Grosso do Sul").
**Não são validados por volume de busca** — para isso é preciso o Planejador de
Palavras-chave do Google ou ferramenta equivalente. Depois de uns dois meses no
ar, o Search Console mostra os termos reais pelos quais o site aparece, e vale
ajustar os textos com base neles.
