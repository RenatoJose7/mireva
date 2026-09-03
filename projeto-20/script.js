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

const mobileCta = document.querySelector('.p20-mobile-cta');
window.addEventListener('scroll', () => mobileCta?.classList.toggle('is-visible', scrollY > 420), { passive: true });

const caseCarousel = document.getElementById('p20CaseCarousel');
if (caseCarousel) {
  const moveCases = direction => caseCarousel.scrollBy({ left: direction * Math.min(caseCarousel.clientWidth * .82, 382), behavior: 'smooth' });
  document.querySelector('.p20-case-prev')?.addEventListener('click', () => moveCases(-1));
  document.querySelector('.p20-case-next')?.addEventListener('click', () => moveCases(1));
}
