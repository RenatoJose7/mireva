/* ============================================================
   MIREVA — Script Principal Refatorado
   ============================================================ */

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
const heroSection = document.getElementById('inicio');
let heroExit = 60;
let headerTicking = false;
const updateHeaderState = () => {
  header?.classList.toggle('scrolled', window.scrollY > heroExit);
  headerTicking = false;
};
const measureHeroExit = () => {
  heroExit = heroSection ? heroSection.offsetTop + heroSection.offsetHeight - 92 : 60;
  updateHeaderState();
};
window.addEventListener('scroll', () => {
  if (!headerTicking) {
    window.requestAnimationFrame(updateHeaderState);
    headerTicking = true;
  }
}, { passive: true });
let headerResizeFrame = 0;
window.addEventListener('resize', () => {
  if (headerResizeFrame) return;
  headerResizeFrame = window.requestAnimationFrame(() => {
    measureHeroExit();
    headerResizeFrame = 0;
  });
}, { passive: true });
window.addEventListener('load', measureHeroExit, { once: true });
measureHeroExit();

// ===== META PIXEL — CONTATOS =====
// Registra intenção de contato apenas nos links que levam ao WhatsApp.
const trackMetaEvent = (eventName) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName);
  }
};

document.addEventListener('click', (event) => {
  const whatsappLink = event.target.closest('a[href*="wa.me/"]');
  if (whatsappLink) trackMetaEvent('Contact');
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const nav     = document.getElementById('nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    const spans = menuBtn.querySelectorAll('span');
    const isOpen = nav.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    if (spans[0]) spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)'  : '';
    if (spans[1]) spans[1].style.opacity   = isOpen ? '0' : '1';
    if (spans[2]) spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Fecha menu ao clicar em link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menu');
      menuBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    });
  });
}

// ===== FADE UP (Intersection Observer) =====
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  fadeEls.forEach(el => fadeObserver.observe(el));
}

// ===== ANIMATED COUNTERS =====
const counters = document.querySelectorAll('.counter');
const animateCounter = (counter) => {
  const target   = +counter.getAttribute('data-target');
  const duration = 2000;
  const start    = performance.now();
  const update   = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(update);
    else counter.textContent = target;
  };
  requestAnimationFrame(update);
};

if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
}

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const button = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  const icon   = item.querySelector('.faq-icon');

  // Abre o primeiro item
  if (item.classList.contains('is-open') && answer) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }

  button?.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    // Fecha todos
    faqItems.forEach(cur => {
      const curAnswer = cur.querySelector('.faq-answer');
      const curIcon   = cur.querySelector('.faq-icon');
      const curBtn    = cur.querySelector('.faq-question');
      cur.classList.remove('is-open');
      if (curAnswer) curAnswer.style.maxHeight = null;
      if (curBtn)    curBtn.setAttribute('aria-expanded', 'false');
      if (curIcon)   curIcon.textContent = '+';
    });

    if (!isOpen) {
      item.classList.add('is-open');
      if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      button.setAttribute('aria-expanded', 'true');
      if (icon) icon.textContent = '−';
    }
  });
});

// ===== PORTFOLIO CAROUSEL =====
// O carrossel agora roda por CSS. Removido requestAnimationFrame contínuo para evitar travamentos.
function setupPortfolioLoop() {
  document.querySelectorAll('.portfolio-track').forEach(track => {
    track.dataset.loopReady = '1';
    const group = track.querySelector('.portfolio-group');
    if (!group) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const shift = group.getBoundingClientRect().width + gap;
    track.style.setProperty('--portfolio-shift', `-${shift}px`);
  });
}

function setupPortfolioVisibility() {
  const sections = document.querySelectorAll('.portfolio-section');
  if (!sections.length) return;

  if (!('IntersectionObserver' in window)) {
    sections.forEach(section => section.classList.add('is-portfolio-active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-portfolio-active', entry.isIntersecting);
    });
  }, { rootMargin: '160px 0px' });

  sections.forEach(section => observer.observe(section));
}

setupPortfolioVisibility();
window.addEventListener('load', setupPortfolioLoop, { once: true });
let portfolioResizeFrame = 0;
window.addEventListener('resize', () => {
  if (portfolioResizeFrame) return;
  portfolioResizeFrame = window.requestAnimationFrame(() => {
    setupPortfolioLoop();
    portfolioResizeFrame = 0;
  });
}, { passive: true });

// ===== FORMULÁRIO → WHATSAPP =====
const form = document.getElementById('mirevaContactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return;

    const name    = document.getElementById('contactName')?.value.trim()    || '';
    const company = document.getElementById('contactCompany')?.value.trim() || '';
    const wa      = document.getElementById('contactWhatsapp')?.value.trim()|| '';
    const project = document.getElementById('contactProject')?.value         || '';
    const msg     = document.getElementById('contactMessage')?.value.trim() || '';

    const text = `Olá, Mireva! Quero iniciar um projeto.\n\n` +
      `Nome: ${name}\nEmpresa: ${company}\nWhatsApp: ${wa}\n` +
      `Tipo: ${project}\nMensagem: ${msg}`;

    // O evento só acontece depois de o formulário obrigatório estar válido.
    trackMetaEvent('Lead');
    window.open(`https://wa.me/5511918427189?text=${encodeURIComponent(text)}`, '_blank');

    const success = form.querySelector('.contact-success');
    if (success) {
      success.textContent = '✅ Tudo pronto! Conclua o envio da mensagem pelo WhatsApp.';
      setTimeout(() => { success.textContent = ''; }, 5000);
    }
    form.reset();
  });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  let backToTopTicking = false;
  window.addEventListener('scroll', () => {
    if (backToTopTicking) return;
    backToTopTicking = true;
    window.requestAnimationFrame(() => {
      backToTop.classList.toggle('show', window.scrollY > 500);
      backToTopTicking = false;
    });
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== HERO =====
// Palavra dinâmica com digitação, apagamento e parallax discreto dos projetos.
function initPremiumHero() {
  const word = document.querySelector('.hero-word');
  const projects = document.querySelector('.hero-projects');
  const cards = [...document.querySelectorAll('.project-card')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (word && !reducedMotion.matches) {
    const words = ['construir.', 'transformar.', 'escalar.'];
    const wait = duration => new Promise(resolve => window.setTimeout(resolve, duration));
    const type = async value => {
      for (let character = 1; character <= value.length; character++) {
        word.textContent = value.slice(0, character);
        await wait(92);
      }
    };
    const erase = async () => {
      for (let character = word.textContent.length - 1; character >= 0; character--) {
        word.textContent = word.textContent.slice(0, character);
        await wait(52);
      }
    };
    const cycleWords = async () => {
      let index = 0;
      word.textContent = '';
      while (true) {
        await type(words[index]);
        await wait(1650);
        await erase();
        await wait(360);
        index = (index + 1) % words.length;
      }
    };
    cycleWords();
  }

  if (!projects || !cards.length || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion.matches) return;

  let frame = 0;
  let pointerClientX = 0;
  let pointerClientY = 0;
  projects.addEventListener('pointermove', event => {
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      const bounds = projects.getBoundingClientRect();
      const x = (pointerClientX - bounds.left) / bounds.width - .5;
      const y = (pointerClientY - bounds.top) / bounds.height - .5;
      cards.forEach((card, index) => {
        const amount = [.55, .8, 1, .72, .5][index];
        card.style.setProperty('--pointer-x', `${x * amount * 15}px`);
        card.style.setProperty('--pointer-y', `${y * amount * 11}px`);
      });
      frame = 0;
    });
  });

  projects.addEventListener('pointerleave', () => {
    cards.forEach(card => {
      card.style.setProperty('--pointer-x', '0px');
      card.style.setProperty('--pointer-y', '0px');
    });
  });
}
initPremiumHero();

// ===== STATUS DO PROJETO 20 =====
function initProject20Status() {
  const config = window.PROJECT_20_CONFIG;
  if (!config) return;

  const total = Math.max(0, Number(config.totalVacancies) || 0);
  const filled = Math.min(total, Math.max(0, Number(config.filledVacancies) || 0));
  const remaining = total - filled;
  const progress = total ? (filled / total) * 100 : 0;

  document.querySelectorAll('[data-p20-vacancies]').forEach(element => { element.textContent = remaining; });
  document.querySelectorAll('[data-p20-filled]').forEach(element => { element.textContent = filled; });
  document.querySelectorAll('[data-p20-total]').forEach(element => { element.textContent = total; });
  document.querySelectorAll('[data-p20-progress]').forEach(element => { element.style.width = `${progress}%`; });
  document.querySelectorAll('[data-p20-whatsapp]').forEach(element => {
    const message = element.dataset.message || 'Olá, Mireva! Quero saber mais sobre o Projeto 20.';
    element.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  });
  document.querySelectorAll('.project20-progress[role="progressbar"]').forEach(element => {
    element.setAttribute('aria-valuemax', total);
    element.setAttribute('aria-valuenow', filled);
    element.setAttribute('aria-label', `${filled} de ${total} vagas preenchidas`);
  });
}
initProject20Status();

// ===== CARROSSEL DE CASES DO BEHANCE =====
function initBehanceCarousel() {
  const carousel = document.getElementById('behanceCarousel');
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll('.behance-card')];
  const pagination = document.getElementById('behancePagination');
  const mobileCue = document.querySelector('.behance-mobile-cue');
  const step = () => Math.min(carousel.clientWidth * .82, 382);
  document.querySelector('.behance-next')?.addEventListener('click', () => carousel.scrollBy({ left: step(), behavior: 'smooth' }));
  document.querySelector('.behance-prev')?.addEventListener('click', () => carousel.scrollBy({ left: -step(), behavior: 'smooth' }));
  mobileCue?.addEventListener('click', () => carousel.scrollBy({ left: step(), behavior: 'smooth' }));

  if (!pagination || !cards.length) return;
  const dots = cards.map((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'behance-dot';
    dot.setAttribute('aria-label', `Ir para o case ${index + 1}`);
    dot.addEventListener('click', () => {
      carousel.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    });
    pagination.appendChild(dot);
    return dot;
  });

  let scrollFrame = 0;
  const updatePagination = () => {
    scrollFrame = 0;
    let activeIndex = 0;
    let closestDistance = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - carousel.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });
    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };
  carousel.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updatePagination);
  }, { passive: true });
  updatePagination();
}
window.addEventListener('load', initBehanceCarousel, { once: true });
