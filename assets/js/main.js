/* ==========================================================================
   MP ENGENHARIA E PROJETOS · Scripts da landing page
   --------------------------------------------------------------------------
   Animações com GSAP + ScrollTrigger.
   Se o GSAP não carregar, a página continua legível e navegável: todos os
   conteúdos ficam visíveis e os links de WhatsApp seguem funcionando.

   Módulos:
   01. Base e detecção de recursos
   02. Header fixo, menu mobile e navegação
   03. Barra de progresso de leitura
   04. Hero: vídeo fixo durante a rolagem (a abertura é feita em CSS)
   05. Revelação das seções ao rolar
   06. Linhas técnicas que se desenham
   07. Etapas: linha do tempo com progresso
   08. Paralaxe da galeria e do vídeo de entrega
   09. Carrosséis automáticos de avaliações
   10. Galeria de projetos (setas + toque)
   11. Interações de mouse (hover, botão magnético)
   12. FAQ em accordion
   13. Vídeos: carregamento sob demanda e economia de bateria
   14. Ano atual no rodapé
   ========================================================================== */
(function () {
  'use strict';

  /* ========================================================================
     01. BASE E DETECÇÃO DE RECURSOS
     ======================================================================== */
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasScrollTrigger = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DESKTOP = '(min-width: 861px)';
  var MOBILE = '(max-width: 860px)';

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return (root || document).querySelectorAll(sel); }

  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });
    // Marca o documento para que o CSS esconda os elementos que serão animados
    document.documentElement.classList.add('gsap-ready');
  }

  /* ========================================================================
     02. HEADER FIXO, MENU MOBILE E NAVEGAÇÃO
     ======================================================================== */
  var header = $('.site-header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav-principal');

  // Fundo sólido no header assim que sai do topo
  if (header && hasScrollTrigger) {
    ScrollTrigger.create({
      start: 'top -40',
      end: 99999,
      toggleClass: { targets: header, className: 'is-stuck' }
    });
  } else if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    }, { passive: true });
  }

  function setMenu(open) {
    if (!burger || !nav) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('is-locked', open);

    // Entrada escalonada dos itens do menu
    if (open && hasGsap && !reduceMotion) {
      gsap.fromTo(nav.children,
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out', clearProps: 'all' });
    }
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  // Link ativo conforme a seção visível
  var navLinks = nav ? Array.prototype.slice.call($$('a[href^="#"]', nav)) : [];
  var sections = navLinks
    .map(function (link) { return $(link.getAttribute('href')); })
    .filter(Boolean);

  if (hasScrollTrigger && sections.length) {
    sections.forEach(function (section) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: function (self) {
          if (!self.isActive) return;
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + section.id);
          });
        }
      });
    });
  }

  /* ========================================================================
     03. BARRA DE PROGRESSO DE LEITURA
     ======================================================================== */
  var progressBar = $('.scroll-progress span');
  if (progressBar && hasScrollTrigger && !reduceMotion) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
  }

  /* ========================================================================
     04. HERO · VÍDEO FIXO DURANTE A ROLAGEM
     ======================================================================== */
  var hero = document.getElementById('hero');

  if (hero && hasGsap) {

    // A abertura do topo é feita em CSS (assets/css/style.css).
    // Aqui fica só o efeito de vídeo fixo durante a rolagem.

    // -- Vídeo fixo enquanto rola, depois libera a próxima seção -----------
    if (hasScrollTrigger) {
      var mm = gsap.matchMedia();

      mm.add({ isDesktop: DESKTOP, isMobile: MOBILE, reduce: '(prefers-reduced-motion: reduce)' },
        function (context) {
          var isDesktop = context.conditions.isDesktop;
          var reduce = context.conditions.reduce;
          if (reduce) return;

          // No celular o vídeo não carrega (economia de dados), então fixar a tela
          // só atrasaria o primeiro conteúdo. O efeito fica só no desktop.
          if (!isDesktop) return;

          var pinLength = '+=95%';

          var pinTl = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: pinLength,
              pin: true,
              pinSpacing: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          });

          // Anima os filhos do hero — nunca o elemento fixado em si
          pinTl
            .to('.hero-inner', { yPercent: -14, autoAlpha: 0, ease: 'power1.in' }, 0)
            .to('.hero-video', { scale: 1.16, ease: 'none' }, 0)
            .to('.hero-overlay', { opacity: 1, ease: 'none' }, 0)
            .to('.hero-grid', { autoAlpha: 0, ease: 'none' }, 0)
            .to('.scroll-cue', { autoAlpha: 0, duration: 0.2, ease: 'none' }, 0);

        });
    }
  }

  /* ========================================================================
     05. REVELAÇÃO DAS SEÇÕES AO ROLAR
     Um lote por tipo de elemento, com escalonamento suave.
     ======================================================================== */
  var grupos = [
    { sel: '.section-head > *', y: 22, stagger: 0.08 },
    { sel: '.proof-quotes li', y: 18, stagger: 0.09 },
    { sel: '.pain', y: 30, stagger: 0.09 },
    { sel: '.svc', y: 34, stagger: 0.08 },
    { sel: '.svc-cta', y: 22, stagger: 0 },
    { sel: '.about-copy > *', y: 22, stagger: 0.07 },
    { sel: '.member, .team-note', y: 26, stagger: 0.1 },
    { sel: '.diff', y: 30, stagger: 0.08 },
    { sel: '.faq-item', y: 18, stagger: 0.05 },
    { sel: '.faq-cta', y: 20, stagger: 0 },
    { sel: '.video-band-inner > *', y: 26, stagger: 0.1 },
    { sel: '.cta-inner > *', y: 26, stagger: 0.1 },
    { sel: '.foot-brand, .foot-col', y: 22, stagger: 0.08 }
  ];

  if (hasScrollTrigger && !reduceMotion) {
    grupos.forEach(function (grupo) {
      var alvos = $$(grupo.sel);
      if (!alvos.length) return;

      gsap.set(alvos, { y: grupo.y, autoAlpha: 0 });

      ScrollTrigger.batch(alvos, {
        start: 'top 88%',
        once: true,
        onEnter: function (lote) {
          gsap.to(lote, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: grupo.stagger,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'transform'
          });
        }
      });
    });
  }

  /* ========================================================================
     06. LINHAS TÉCNICAS QUE SE DESENHAM
     A assinatura visual do projeto: os filetes de 1px crescem da
     esquerda para a direita quando a seção entra na tela.
     ======================================================================== */
  if (hasScrollTrigger && !reduceMotion) {
    each($$('.section-paper, .section-ink, .faq, .timeline'), function (el) {
      var linha = document.createElement('span');
      linha.className = 'rule-draw';
      linha.setAttribute('aria-hidden', 'true');
      el.appendChild(linha);

      gsap.fromTo(linha, { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.3,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });
  }

  /* ========================================================================
     07. ETAPAS · LINHA DO TEMPO COM PROGRESSO
     ======================================================================== */
  var timeline = $('.timeline');
  if (timeline && hasScrollTrigger && !reduceMotion) {
    var trilho = document.createElement('span');
    trilho.className = 'timeline-progress';
    trilho.setAttribute('aria-hidden', 'true');
    timeline.appendChild(trilho);

    gsap.fromTo(trilho, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: 0.5
      }
    });

    // Cada número acende quando a etapa chega ao centro da tela
    each($$('.step'), function (step) {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 65%',
        end: 'bottom 45%',
        toggleClass: { targets: step, className: 'is-current' }
      });
    });
  }

  /* ========================================================================
     08. PARALAXE DA GALERIA E DO VÍDEO DE ENTREGA
     ======================================================================== */
  if (hasScrollTrigger && !reduceMotion) {
    var bandVideo = $('.band-video');
    if (bandVideo) {
      gsap.fromTo(bandVideo, { yPercent: -8 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.video-band', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    // Deslocamento sutil dentro de cada card da galeria
    gsap.matchMedia().add(DESKTOP, function () {
      each($$('.shot img'), function (img) {
        gsap.fromTo(img, { yPercent: -4 }, {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.shot'), start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    });
  }

  /* ========================================================================
     09. CARROSSÉIS AUTOMÁTICOS DE AVALIAÇÕES
     Duas fileiras que correm sozinhas em sentidos opostos.
     data-marquee="ltr"  → da esquerda para a direita
     data-marquee="rtl"  → da direita para a esquerda
     data-speed          → segundos para completar uma volta
     ======================================================================== */
  each($$('.marquee'), function (marquee) {
    var track = $('.marquee-track', marquee);
    if (!track || !track.children.length) return;

    // Duplica o conteúdo para que o laço não tenha emenda visível
    var original = Array.prototype.slice.call(track.children);
    original.forEach(function (item) {
      var copia = item.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      track.appendChild(copia);
    });

    if (!hasGsap || reduceMotion) {
      // Sem animação: vira uma faixa rolável pelo toque
      marquee.classList.add('is-static');
      return;
    }

    var paraDireita = marquee.getAttribute('data-marquee') === 'ltr';
    var duracao = parseFloat(marquee.getAttribute('data-speed')) || 90;

    var loop = gsap.fromTo(track,
      { xPercent: paraDireita ? -50 : 0 },
      {
        xPercent: paraDireita ? 0 : -50,
        duration: duracao,
        ease: 'none',
        repeat: -1
      });

    // Pausa ao passar o mouse ou ao focar por teclado
    function desacelerar() { gsap.to(loop, { timeScale: 0, duration: 0.4, overwrite: true }); }
    function retomar() { gsap.to(loop, { timeScale: 1, duration: 0.6, overwrite: true }); }

    marquee.addEventListener('mouseenter', desacelerar);
    marquee.addEventListener('mouseleave', retomar);
    marquee.addEventListener('focusin', desacelerar);
    marquee.addEventListener('focusout', retomar);

    // Não gasta processamento enquanto a seção está fora da tela
    if (hasScrollTrigger) {
      ScrollTrigger.create({
        trigger: marquee,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: function (self) { self.isActive ? loop.play() : loop.pause(); }
      });
    }
  });

  /* ========================================================================
     10. GALERIA DE PROJETOS · setas no desktop, toque no celular
     ======================================================================== */
  (function setupGallery() {
    var track = document.getElementById('gallery');
    if (!track) return;

    var buttons = $$('[data-gallery]');
    if (!buttons.length) return;

    function passo() {
      var card = track.firstElementChild;
      return card ? card.getBoundingClientRect().width + 1 : track.clientWidth * 0.8;
    }

    function atualizar() {
      var maxScroll = track.scrollWidth - track.clientWidth - 2;
      each(buttons, function (button) {
        var isPrev = button.getAttribute('data-gallery') === 'prev';
        button.disabled = isPrev ? track.scrollLeft <= 2 : track.scrollLeft >= maxScroll;
      });
    }

    each(buttons, function (button) {
      button.addEventListener('click', function () {
        var direcao = button.getAttribute('data-gallery') === 'prev' ? -1 : 1;
        track.scrollBy({ left: passo() * direcao, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    track.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
  })();

  /* ========================================================================
     11. INTERAÇÕES DE MOUSE
     Só em dispositivos com ponteiro fino (mouse), nunca no toque.
     ======================================================================== */
  if (hasGsap && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

    // -- Cards de serviço: ícone sobe e o card ganha leve elevação --------
    each($$('.svc'), function (card) {
      var icone = $('.svc-ico', card);
      var entrar = gsap.timeline({ paused: true })
        .to(card, { y: -6, duration: 0.4, ease: 'power2.out' }, 0)
        .to(icone, { y: -5, scale: 1.08, duration: 0.45, ease: 'back.out(2)' }, 0);

      card.addEventListener('mouseenter', function () { entrar.play(); });
      card.addEventListener('mouseleave', function () { entrar.reverse(); });
    });

    // -- Cards de diferenciais e dores: elevação sutil --------------------
    each($$('.diff, .pain'), function (card) {
      card.addEventListener('mouseenter', function () {
        gsap.to(card, { y: -4, duration: 0.35, ease: 'power2.out', overwrite: true });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { y: 0, duration: 0.45, ease: 'power2.out', overwrite: true });
      });
    });

    // -- Botões principais: leve efeito magnético ------------------------
    each($$('.btn-wa, .btn-dark, .arrow'), function (botao) {
      var xTo = gsap.quickTo(botao, 'x', { duration: 0.5, ease: 'power3.out' });
      var yTo = gsap.quickTo(botao, 'y', { duration: 0.5, ease: 'power3.out' });

      botao.addEventListener('mousemove', function (event) {
        var area = botao.getBoundingClientRect();
        xTo((event.clientX - area.left - area.width / 2) * 0.22);
        yTo((event.clientY - area.top - area.height / 2) * 0.3);
      });
      botao.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });

    // -- Botão flutuante do WhatsApp -------------------------------------
    var waFloat = $('.wa-float');
    if (waFloat) {
      waFloat.addEventListener('mouseenter', function () {
        gsap.to(waFloat, { scale: 1.06, duration: 0.35, ease: 'back.out(2.5)' });
      });
      waFloat.addEventListener('mouseleave', function () {
        gsap.to(waFloat, { scale: 1, duration: 0.4, ease: 'power2.out' });
      });
    }
  }

  /* ========================================================================
     12. FAQ EM ACCORDION · abre um item por vez
     ======================================================================== */
  var faqItems = $$('.faq-item');
  each(faqItems, function (item) {
    var corpo = $('.faq-body', item);

    item.addEventListener('toggle', function () {
      if (item.open) {
        each(faqItems, function (outro) {
          if (outro !== item) outro.open = false;
        });
        if (hasGsap && !reduceMotion && corpo) {
          gsap.from(corpo, { height: 0, autoAlpha: 0, duration: 0.45, ease: 'power2.out' });
        }
      }
    });
  });

  /* ========================================================================
     13. VÍDEOS · carregamento sob demanda, com suporte a iPhone
     ------------------------------------------------------------------------
     O iOS só toca vídeo sem o usuário mandar se ele estiver com os
     atributos "muted" e "playsinline". Mesmo assim o play() pode ser
     recusado se o arquivo
     ainda não tem dados suficientes — por isso tentamos de novo quando o
     vídeo avisa que já dá para tocar, e uma última vez ao primeiro toque
     na tela (cobre o Modo de Baixo Consumo, que bloqueia autoplay).
     ======================================================================== */
  var connection = navigator.connection || {};
  var economizarDados = connection.saveData === true;
  var ehCelular = window.matchMedia('(max-width: 759px)').matches;

  function tocar(video) {
    var tentativa = video.play();
    if (tentativa && tentativa.catch) tentativa.catch(function () {});
  }

  function prepararVideo(video, opcoes) {
    if (!video) return null;

    // Sem vídeo para quem pediu menos movimento ou está economizando dados:
    // o poster (definido no CSS) continua aparecendo no lugar.
    if (reduceMotion || economizarDados) { video.remove(); return null; }

    // Reforça os atributos que o iOS exige, caso o HTML seja editado depois
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    var fonte = (ehCelular && video.getAttribute('data-lazy-video-mobile')) ||
                video.getAttribute('data-lazy-video');

    function carregar() {
      if (video.src || !fonte) return;
      video.src = fonte;
      video.load();
      tocar(video);
    }

    // Se o play for recusado por falta de dados, tenta de novo quando houver
    video.addEventListener('canplay', function () { if (video.paused) tocar(video); });
    // Último recurso: primeiro toque do usuário na página
    document.addEventListener('touchstart', function reTocar() {
      if (video.src && video.paused) tocar(video);
      document.removeEventListener('touchstart', reTocar);
    }, { passive: true, once: true });

    // No celular esperamos o navegador ficar ocioso antes de puxar o vídeo.
    // Baixá-lo cedo demais rouba banda da fonte e do texto do topo, e é
    // justamente o texto do topo que o Google cronometra. O poster fica
    // visível nesse intervalo, então não há buraco na tela.
    function agendar() {
      if (!ehCelular) return setTimeout(carregar, 150);
      if (window.requestIdleCallback) return requestIdleCallback(carregar, { timeout: 2500 });
      setTimeout(carregar, 1500);
    }

    if (opcoes.aoCarregar) {
      if (document.readyState === 'complete') agendar();
      else window.addEventListener('load', agendar);
    }

    return { video: video, carregar: carregar };
  }

  // -- Vídeo do topo: começa logo após a primeira pintura --------------------
  var heroCtrl = prepararVideo($('.hero-video'), { aoCarregar: true });

  if (heroCtrl && hasScrollTrigger) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: function (self) {
        if (!heroCtrl.video.src) return;
        self.isActive ? tocar(heroCtrl.video) : heroCtrl.video.pause();
      }
    });
  }

  // -- Vídeo da entrega: só baixa quando está chegando na tela ---------------
  var bandaCtrl = prepararVideo($('.band-video'), { aoCarregar: false });

  if (bandaCtrl && 'IntersectionObserver' in window) {
    var obsBanda = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          bandaCtrl.carregar();
          tocar(bandaCtrl.video);
        } else if (bandaCtrl.video.src) {
          bandaCtrl.video.pause();
        }
      });
    }, { rootMargin: '400px 0px' });
    obsBanda.observe(bandaCtrl.video);
  }

  /* ========================================================================
     14. ANO ATUAL NO RODAPÉ
     ======================================================================== */
  var yearEl = document.getElementById('ano');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ========================================================================
     Recalcula as posições depois que imagens e fontes terminam de carregar
     ======================================================================== */
  if (hasScrollTrigger) {
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }

})();
