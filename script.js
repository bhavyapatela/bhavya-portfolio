const cursorGlow = document.getElementById("cursorGlow");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");



// Only run cursor glow if the device has a mouse/fine pointer
if (window.matchMedia("(pointer: fine)").matches) {
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
} else if (cursorGlow) {
  // Hide glow on touch devices
  cursorGlow.style.display = "none";
}

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

// Theme Toggle Logic
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const body = document.body;

const sunIcon = `<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"></path>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

function setTheme(theme) {
  if (theme === "light") {
    body.classList.add("light-theme");
    if (themeIcon) themeIcon.innerHTML = sunIcon;
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-theme");
    if (themeIcon) themeIcon.innerHTML = moonIcon;
    localStorage.setItem("theme", "dark");
  }
}

// Check for saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = body.classList.contains("light-theme");
    setTheme(isLight ? "dark" : "light");
  });
}