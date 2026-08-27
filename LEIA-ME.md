# MP Engenharia e Projetos — Landing Page

Landing page estática, responsiva e otimizada para conversão via WhatsApp.
Sem build, sem npm, sem framework: basta abrir `index.html` ou publicar a pasta.

**Stack:** HTML semântico + CSS puro + JavaScript com [GSAP](https://gsap.com)
(ScrollTrigger e SplitText) hospedado no próprio projeto.

---

## Estrutura de arquivos

```
index.html                   Todo o conteúdo e os textos da página
vercel.json                  Configuração de deploy e cache
robots.txt / sitemap.xml     SEO

assets/css/style.css         Design system, cores, tipografia, responsivo
assets/js/main.js            Animações e interações (comentado por módulo)
assets/js/vendor/            GSAP 3.13 (gsap, ScrollTrigger, SplitText)

assets/img/logo-mp.png       Monograma oficial (branco, fundo transparente)
assets/img/logo-mp-dark.png  Monograma em preto (para fundos claros)
assets/img/projeto-01..09    Fotos da galeria (1200×900)
assets/img/hero-poster.jpg   Primeiro quadro do vídeo do topo
assets/img/og-*.jpg          Imagem de compartilhamento em redes sociais

assets/video/hero-obra.mp4   Vídeo do topo (fica fixo enquanto rola)
assets/video/entrega.mp4     Vídeo da seção "A entrega" (loop contínuo)

_fontes/                     Originais enviados pelo cliente (fora do Git)
```

---

## Animações

| Onde | O que acontece |
|------|----------------|
| **Topo (hero)** | O título entra linha a linha (SplitText) e o vídeo se aproxima lentamente |
| **Vídeo do topo** | Fica **fixo na tela** enquanto o usuário rola; o texto sobe e some, e só então a próxima seção entra |
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
opção vê a página inteira, estática. Se o GSAP falhar, o conteúdo aparece
normalmente após 2,5 segundos.

---

## Como editar

### Textos
Estão todos no `index.html`, em português, com comentários marcando cada
seção (`A. HEADER`, `B. HERO`, `C. DORES`...). Procure o trecho e troque.

### Links do WhatsApp
Todos os botões seguem o formato:

```
https://wa.me/5567992142661?text=MENSAGEM
```

- `5567992142661` = 55 (Brasil) + 67 (DDD) + número, **sem espaços ou traços**
- `MENSAGEM` = texto já digitado para o cliente (`%20` = espaço, `%C3%A1` = á)

Para trocar o número no site inteiro, use **Localizar e substituir**:
procure `5567992142661`. O segundo número, `5567981270814`, aparece na seção
"Sobre" e no rodapé.

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
Substitua os arquivos em `assets/video/` **mantendo os mesmos nomes**.
Recomendado: 1920×1080, 10 a 20 segundos, **sem áudio**, até 3 MB.

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
| Credenciais do topo | O número **43 avaliações** — confira o total real no perfil do Google Meu Negócio |
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
| 1 | **Domínio real** nas tags de SEO | `index.html` → `canonical` e `og:url`; também em `robots.txt` e `sitemap.xml` |
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
3. Coloque o link na bio do Instagram [@mp_engenharia](https://www.instagram.com/mp_engenharia)

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
| LCP no celular | 4.132 ms | **~2.620 ms** | < 2.500 ms |
| Peso baixado no celular | 438 KB | **195 KB** | — |
| CLS (salto de layout) | 0,05 | **0,0008** | < 0,1 |
| Conexões a terceiros | 1 | **0** | — |

O que foi feito:

- Fontes hospedadas no projeto, em versão variável (199 KB → 86 KB)
- Fallback com métricas idênticas: a troca de fonte não desloca nada
- A abertura do topo é **CSS puro**. Antes ela dependia de 145 KB de
  JavaScript carregarem, e era isso que travava a nota
- Poster do topo virou fundo de CSS a partir de 760px: o celular deixou de
  baixar 135 KB de uma imagem que nem chega a aparecer lá
- Poster da seção de entrega ganhou versão de celular (116 KB → 30 KB)
- Logo redimensionado para o tamanho real de exibição (32 KB → 10 KB)
- Vídeos só começam a baixar depois da primeira pintura da tela
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
