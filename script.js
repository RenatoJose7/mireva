const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});

const revealElements = document.querySelectorAll(".reveal-scroll");

const revealOnScroll = () => {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 120) {
      element.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

const cardsTrack = document.getElementById("cardsTrack");
const prevCards = document.getElementById("prevCards");
const nextCards = document.getElementById("nextCards");

nextCards.addEventListener("click", () => {
  cardsTrack.scrollBy({
    left: 290,
    behavior: "smooth"
  });
});

prevCards.addEventListener("click", () => {
  cardsTrack.scrollBy({
    left: -290,
    behavior: "smooth"
  });
});
const scrollItems = document.querySelectorAll(".scroll-reveal");

const showOnScroll = () => {
  scrollItems.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (itemTop < windowHeight - 100) {
      item.classList.add("show");
    }
  });
};

window.addEventListener("scroll", showOnScroll);
window.addEventListener("load", showOnScroll);

const solutionCards = document.querySelectorAll(".solution-card");

const showSolutionCards = () => {
  solutionCards.forEach((card) => {
    const cardTop = card.getBoundingClientRect().top;

    if (cardTop < window.innerHeight - 100) {
      card.classList.add("show");
    }
  });
};

window.addEventListener("scroll", showSolutionCards);
window.addEventListener("load", showSolutionCards);

const counters = document.querySelectorAll(".counter");

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  let current = 0;
  const duration = 1400;
  const stepTime = 16;
  const increment = target / (duration / stepTime);

  const update = () => {
    current += increment;

    if (current < target) {
      counter.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  };

  update();
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = "true";
      animateCounter(entry.target);
    }
  });
}, {
  threshold: 0.4
});

counters.forEach((counter) => {
  counterObserver.observe(counter);
});