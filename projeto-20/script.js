/* Atualize apenas este número conforme as vagas forem preenchidas. */
const PROJECT_20_CONFIG = { totalVacancies: 20, filledVacancies: 16, whatsapp: '5511918417189' };

const remaining = Math.max(0, PROJECT_20_CONFIG.totalVacancies - PROJECT_20_CONFIG.filledVacancies);
document.querySelectorAll('[data-vacancies]').forEach(el => el.textContent = remaining);
document.querySelectorAll('[data-filled]').forEach(el => el.textContent = PROJECT_20_CONFIG.filledVacancies);
document.querySelectorAll('[data-progress]').forEach(el => el.style.width = `${(PROJECT_20_CONFIG.filledVacancies / PROJECT_20_CONFIG.totalVacancies) * 100}%`);
document.querySelectorAll('[role="progressbar"]').forEach(el => el.setAttribute('aria-valuenow', PROJECT_20_CONFIG.filledVacancies));

document.querySelectorAll('.p20-whatsapp').forEach(link => {
  link.href = `https://wa.me/${PROJECT_20_CONFIG.whatsapp}?text=${encodeURIComponent(link.dataset.message || 'Olá, Mireva! Quero saber mais sobre o Projeto 20.')}`;
  link.target = '_blank'; link.rel = 'noopener';
});

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .12, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.p20-reveal').forEach(el => revealObserver.observe(el));

const modelVideoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  const video = entry.target;
  if (entry.isIntersecting) video.play().catch(() => {});
  else video.pause();
}), { threshold: .2 });
document.querySelectorAll('.p20-model video').forEach(video => modelVideoObserver.observe(video));

const hero = document.querySelector('.p20-hero');
const particleCanvas = document.querySelector('.p20-hero-particles');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)');

if (hero && particleCanvas && !reduceMotion) {
  const context = particleCanvas.getContext('2d');
  const pointer = { x: 0, y: 0, active: false };
  let particles = [];
  let width = 0;
  let height = 0;

  const createParticles = () => {
    const count = width < 781 ? 42 : 108;
    particles = Array.from({ length: count }, () => {
      const side = Math.random() < .5 ? 0 : 1;
      const edgePosition = side ? .72 + Math.random() * .28 : Math.random() * .28;
      const x = Math.random() < .18 ? Math.random() * width : edgePosition * width;
      const y = Math.random() * height;
      return { x, y, homeX: x, homeY: y, vx: 0, vy: 0, radius: .8 + Math.random() * 1.6, phase: Math.random() * Math.PI * 2 };
    });
  };

  const resizeParticles = () => {
    const bounds = hero.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    particleCanvas.width = Math.round(width * pixelRatio);
    particleCanvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    createParticles();
  };

  const animateParticles = time => {
    context.clearRect(0, 0, width, height);
    const isCoarsePointer = coarsePointer.matches;
    particles.forEach(particle => {
      if (pointer.active && !isCoarsePointer) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = 195;
        if (distance < radius) {
          const force = (1 - distance / radius) * .58;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }

      particle.vx += (particle.homeX - particle.x) * .0018 + Math.cos(time * .0007 + particle.phase) * .002;
      particle.vy += (particle.homeY - particle.y) * .0018 + Math.sin(time * .0007 + particle.phase) * .002;
      particle.vx *= .92;
      particle.vy *= .92;
      particle.x += particle.vx;
      particle.y += particle.vy;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(131, 185, 221, .58)';
      context.fill();
    });
    requestAnimationFrame(animateParticles);
  };

  hero.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });
  window.addEventListener('resize', resizeParticles, { passive: true });
  resizeParticles();
  requestAnimationFrame(animateParticles);
}

const mobileCta = document.querySelector('.p20-mobile-cta');
window.addEventListener('scroll', () => mobileCta?.classList.toggle('is-visible', scrollY > 420), { passive: true });

const caseCarousel = document.getElementById('p20CaseCarousel');
if (caseCarousel) {
  const caseCards = Array.from(caseCarousel.children);
  const createCaseClone = card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    return clone;
  };
  const leadingClones = caseCards.map(createCaseClone);
  const trailingClones = caseCards.map(createCaseClone);
  caseCarousel.prepend(...leadingClones);
  caseCarousel.append(...trailingClones);

  let originalStart = 0;
  let cycleWidth = 0;
  const measureCaseLoop = () => {
    const firstOriginal = caseCards[0];
    const lastOriginal = caseCards.at(-1);
    if (!firstOriginal || !lastOriginal) return;
    const gap = Number.parseFloat(getComputedStyle(caseCarousel).gap) || 0;
    originalStart = firstOriginal.offsetLeft;
    cycleWidth = lastOriginal.offsetLeft + lastOriginal.offsetWidth - originalStart + gap;
    caseCarousel.scrollLeft = originalStart;
  };

  requestAnimationFrame(measureCaseLoop);
  window.addEventListener('resize', measureCaseLoop, { passive: true });
  caseCarousel.addEventListener('scroll', () => {
    if (!cycleWidth) return;
    if (caseCarousel.scrollLeft < originalStart - 1) caseCarousel.scrollLeft += cycleWidth;
    if (caseCarousel.scrollLeft > originalStart + cycleWidth + 1) caseCarousel.scrollLeft -= cycleWidth;
  }, { passive: true });

  const moveCases = direction => caseCarousel.scrollBy({ left: direction * Math.min(caseCarousel.clientWidth * .82, 382), behavior: 'smooth' });
  document.querySelector('.p20-case-prev')?.addEventListener('click', () => moveCases(-1));
  document.querySelector('.p20-case-next')?.addEventListener('click', () => moveCases(1));
}
