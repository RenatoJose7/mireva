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
  const target = +counter.getAttribute("data-target");
  let start = 0;

  const duration = 1200;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const value = Math.floor(progress * target);
    counter.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  };

  requestAnimationFrame(update);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
      entry.target.classList.add("animated");
      animateCounter(entry.target);
    }
  });
}, {
  threshold: 0.5
});

counters.forEach(counter => observer.observe(counter));

// Animações genéricas sem quebrar as antigas
const revealItems = document.querySelectorAll(".reveal");

function handleRevealItems() {
  revealItems.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;

    if (itemTop < window.innerHeight - 100) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", handleRevealItems);
window.addEventListener("load", handleRevealItems);