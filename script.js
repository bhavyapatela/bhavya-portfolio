const cursorGlow = document.getElementById("cursorGlow");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

window.addEventListener("mousemove", (e) => {
  if (!cursorGlow) return;

  cursorGlow.animate(
    {
      left: `${e.clientX}px`,
      top: `${e.clientY}px`
    },
    {
      duration: 700,
      fill: "forwards",
      easing: "ease-out"
    }
  );
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.14
  }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    const headerOffset = 20;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (formNote) {
      formNote.textContent = "Thanks — your message has been captured in this demo form.";
    }

    contactForm.reset();
  });
}