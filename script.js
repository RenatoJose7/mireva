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

  const duration = 2200;
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

const processItems = document.querySelectorAll(
  ".process-header, .process-step, .process-line"
);

function showProcessItems() {
  processItems.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;

    if (itemTop < window.innerHeight - 120) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", showProcessItems);
window.addEventListener("load", showProcessItems);




// FAQ accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const icon = item.querySelector(".faq-icon");

  if (item.classList.contains("is-open")) {
    answer.style.maxHeight = answer.scrollHeight + "px";
  }

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((currentItem) => {
      const currentAnswer = currentItem.querySelector(".faq-answer");
      const currentButton = currentItem.querySelector(".faq-question");
      const currentIcon = currentItem.querySelector(".faq-icon");

      currentItem.classList.remove("is-open");
      currentAnswer.style.maxHeight = null;
      currentButton.setAttribute("aria-expanded", "false");
      currentIcon.textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("is-open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      button.setAttribute("aria-expanded", "true");
      icon.textContent = "−";
    }
  });
});



// Animação da section Sobre
const aboutItems = document.querySelectorAll(".about-reveal");

function showAboutItems() {
  aboutItems.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;

    if (itemTop < window.innerHeight - 120) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", showAboutItems);
window.addEventListener("load", showAboutItems);




// Animação da section Contato
const contactItems = document.querySelectorAll(".contact-reveal");

function showContactItems() {
  contactItems.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;

    if (itemTop < window.innerHeight - 120) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", showContactItems);
window.addEventListener("load", showContactItems);

// Envio do formulário para WhatsApp
const mirevaContactForm = document.getElementById("mirevaContactForm");

if (mirevaContactForm) {
  mirevaContactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const whatsapp = document.getElementById("contactWhatsapp").value.trim();
    const project = document.getElementById("contactProject").value;
    const message = document.getElementById("contactMessage").value.trim();

    const phoneNumber = "5511930308149";

    const text = `Olá, Mireva! Quero começar um projeto.

Nome: ${name}
WhatsApp: ${whatsapp}
Tipo de projeto: ${project}
Mensagem: ${message}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
    mirevaContactForm.reset();
  });
}


// Animação do footer
const footerReveal = document.querySelector(".footer-reveal");

function showFooter() {
  if (!footerReveal) return;

  const footerTop = footerReveal.getBoundingClientRect().top;

  if (footerTop < window.innerHeight - 100) {
    footerReveal.classList.add("show");
  }
}

window.addEventListener("scroll", showFooter);
window.addEventListener("load", showFooter);

// Botão voltar ao topo
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

