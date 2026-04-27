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