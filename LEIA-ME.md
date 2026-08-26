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

| # | Item | Onde |
|---|------|------|
| 1 | **Domínio real** nas tags de SEO | `index.html` → `canonical` e `og:url`; também em `robots.txt` e `sitemap.xml` |
| 2 | **Link do Google Meu Negócio** no botão de avaliações | `index.html` → "Ver todas as avaliações no Google" |
| 3 | **Logo em vetor** (SVG ou PDF) | O logo atual foi extraído de um JPG de 150×150. Funciona, mas um SVG renderiza mais nítido — veja abaixo |
| 4 | Fotos dos engenheiros (opcional) | `assets/img/` |

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

O projeto já vem configurado (`vercel.json`). Como publicar:

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

## Desempenho

- Zero dependências externas em produção (nem CDN, nem Google Analytics)
- Vídeos otimizados: 10,2 MB → 3,9 MB
- O vídeo do topo **não carrega no celular** nem no modo economia de dados
- O vídeo da entrega só baixa quando está prestes a aparecer na tela
- Imagens com `lazy loading` e dimensões declaradas (evita salto de layout)
- Fontes carregadas com `display=swap`

## Acessibilidade

- Link "pular para o conteúdo", foco visível e navegação por teclado
- Textos alternativos em todas as imagens
- Contraste verificado: o verde dos botões é `#0C7A3B` (5,4:1 com texto branco).
  O verde oficial do WhatsApp (`#25D366`) tem contraste 1,9:1 e seria ilegível —
  por isso ele aparece só no pulso do botão flutuante.
- Respeita `prefers-reduced-motion`
