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

// Blog Notification Logic (Home Page Only)
function initBlogNotification() {
  const isHomePage = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
  if (!isHomePage) return;

  const isDismissed = localStorage.getItem('blogNotificationDismissed');
  if (isDismissed) return;

  setTimeout(() => {
    const notif = document.createElement('div');
    notif.className = 'blog-notification';
    notif.innerHTML = `
      <button class="notif-close" id="notifClose" aria-label="Dismiss">&times;</button>
      <div class="notif-header">
        <span class="notif-badge">NEW</span>
      </div>
      <div class="notif-content">
        <h4>Why L Had To Die — The Tragedy of Ryuzaki</h4>
        <p>New anime storytelling article added 
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </p>
      </div>
    `;

    document.body.appendChild(notif);

    // Show after injection
    setTimeout(() => notif.classList.add('show'), 100);

    const dismissNotif = () => {
      notif.classList.remove('show');
      localStorage.setItem('blogNotificationDismissed', 'true');
      setTimeout(() => notif.remove(), 600);
    };

    // Click to navigate
    notif.addEventListener('click', (e) => {
      if (e.target.id === 'notifClose') {
        e.stopPropagation();
        dismissNotif();
        return;
      }

      // Navigate to blog
      if (typeof triggerTransition === 'function') {
        triggerTransition('pages/why-l-had-to-die.html');
      } else {
        window.location.href = 'pages/why-l-had-to-die.html';
      }
    });

    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (notif.parentElement) {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 600);
      }
    }, 8000);

  }, 2000); // Show after 2 seconds
}

document.addEventListener('DOMContentLoaded', initBlogNotification);
