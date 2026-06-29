/* ============================================================
   MIREVA — Script Principal Refatorado
   ============================================================ */

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const nav     = document.getElementById('nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    const spans = menuBtn.querySelectorAll('span');
    const isOpen = nav.classList.contains('active');
    if (spans[0]) spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)'  : '';
    if (spans[1]) spans[1].style.opacity   = isOpen ? '0' : '1';
    if (spans[2]) spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Fecha menu ao clicar em link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
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

// ===== PORTFOLIO CAROUSEL (JS animation) =====

// ===== PORTFOLIO CAROUSEL OTIMIZADO =====
function setupPortfolioLoop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  document.querySelectorAll('.portfolio-carousel').forEach(carousel => {
    const track = carousel.querySelector('.portfolio-track');
    const originalGroup = track?.querySelector('.portfolio-group');
    if (!track || !originalGroup || track.dataset.loopReady === '1') return;
    track.dataset.loopReady = '1';

    if (window.innerWidth <= 600 && !track.classList.contains('mobile-ready')) {
      const groupHTML = originalGroup.innerHTML;
      track.innerHTML = `<div class="portfolio-group">${groupHTML}</div><div class="portfolio-group">${groupHTML}</div>`;
      track.classList.add('mobile-ready');
    }

    const direction = carousel.classList.contains('carousel-right') ? 1 : -1;
    let x = 0;
    let width = 0;
    let raf = null;
    let active = false;
    track.style.animation = 'none';
    track.style.willChange = 'transform';

    const measure = () => {
      const group = track.querySelector('.portfolio-group');
      width = group ? group.getBoundingClientRect().width : 0;
      if (direction === 1 && x === 0) x = -width;
    };

    const frame = () => {
      if (!active || document.hidden) { raf = null; return; }
      if (!width) measure();
      const speed = window.innerWidth <= 600 ? 0.28 : 0.38;
      x += speed * direction;
      if (direction === -1 && x <= -width) x = 0;
      if (direction === 1 && x >= 0) x = -width;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (active) return;
      active = true;
      measure();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? start() : stop());
    }, { threshold: 0.05 });
    observer.observe(carousel);
    window.addEventListener('resize', measure, { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  });
}
window.addEventListener('load', setupPortfolioLoop, { once: true });

// ===== FORMULÁRIO → WHATSAPP =====
const form = document.getElementById('mirevaContactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('contactName')?.value.trim()    || '';
    const company = document.getElementById('contactCompany')?.value.trim() || '';
    const wa      = document.getElementById('contactWhatsapp')?.value.trim()|| '';
    const project = document.getElementById('contactProject')?.value         || '';
    const msg     = document.getElementById('contactMessage')?.value.trim() || '';

    const text = `Olá, Mireva! Quero iniciar um projeto.\n\n` +
      `Nome: ${name}\nEmpresa: ${company}\nWhatsApp: ${wa}\n` +
      `Tipo: ${project}\nMensagem: ${msg}`;

    window.open(`https://wa.me/5511930308149?text=${encodeURIComponent(text)}`, '_blank');

    const success = form.querySelector('.contact-success');
    if (success) {
      success.textContent = '✅ Mensagem enviada! Você será redirecionado ao WhatsApp.';
      setTimeout(() => { success.textContent = ''; }, 5000);
    }
    form.reset();
  });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== DASHBOARD SIMULATION =====
function initDashboardSimulation() {
  const bookingList = document.getElementById('dashboard-booking-list');
  const countBadge  = document.getElementById('dashboard-booking-count');
  if (!bookingList || !countBadge) return;

  let count = 14;
  const bookings = [
    { time: '14:15', name: 'Gabriel Santos',    service: 'Avaliação Capilar',  badge: 'Pendente',   cls: 'badge-pending'  },
    { time: '15:00', name: 'Letícia Ribeiro',   service: 'Coloração + Escova', badge: 'Confirmado', cls: 'badge-success'  },
    { time: '16:30', name: 'Thiago Oliveira',   service: 'Corte Masculino',    badge: 'Confirmado', cls: 'badge-success'  },
    { time: '17:45', name: 'Beatriz Sousa',     service: 'Design de Cílios',   badge: 'Pendente',   cls: 'badge-pending'  },
  ];
  let idx = 0;

  setInterval(() => {
    const d = bookings[idx];
    count++;
    countBadge.textContent = count;
    countBadge.style.transition = 'transform .3s';
    countBadge.style.transform  = 'scale(1.25)';
    setTimeout(() => { countBadge.style.transform = 'scale(1)'; }, 300);

    const item = document.createElement('div');
    item.className = 'booking-item';
    item.style.cssText = 'opacity:0;transform:translateY(15px);transition:all .4s ease';
    item.innerHTML = `
      <div class="booking-time">${d.time}</div>
      <div class="booking-info">
        <span class="booking-name">${d.name}</span>
        <span class="booking-service">${d.service}</span>
      </div>
      <span class="badge ${d.cls}">${d.badge}</span>
    `;
    bookingList.insertBefore(item, bookingList.firstChild);
    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);

    const items = bookingList.querySelectorAll('.booking-item');
    if (items.length > 3) {
      const last = items[items.length - 1];
      last.style.transition = 'all .4s ease';
      last.style.opacity = '0';
      last.style.transform = 'translateY(-10px)';
      setTimeout(() => last.remove(), 400);
    }

    idx = (idx + 1) % bookings.length;
  }, 4500);
}
window.addEventListener('load', initDashboardSimulation);

// ===== HERO PARALLAX REMOVIDO PARA PERFORMANCE =====
// O notebook não reage ao mouse. A animação fica somente no CSS.

