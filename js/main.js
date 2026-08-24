(() => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const yearEl = document.querySelector("[data-year]");
  const amountButtons = document.querySelectorAll("[data-amount]");
  const customAmount = document.querySelector("#custom-amount");
  const donateLinks = document.querySelectorAll("[data-kitabisa]");
  const KITABISA_URL = "https://kitabisa.com";

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  navToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", Boolean(open));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      nav.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      if (href.startsWith("#")) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", href);
        });
      }
    });
  });

  let selectedAmount = 150000;

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const setSelected = (value) => {
    selectedAmount = value;
    amountButtons.forEach((btn) => {
      btn.classList.toggle("is-selected", Number(btn.dataset.amount) === value);
    });
    const label = document.querySelector("[data-selected-amount]");
    if (label) label.textContent = formatRupiah(value);
  };

  amountButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (customAmount) customAmount.value = "";
      setSelected(Number(btn.dataset.amount));
    });
  });

  customAmount?.addEventListener("input", () => {
    const raw = Number(String(customAmount.value).replace(/[^\d]/g, ""));
    if (!raw) return;
    amountButtons.forEach((btn) => btn.classList.remove("is-selected"));
    selectedAmount = raw;
    const label = document.querySelector("[data-selected-amount]");
    if (label) label.textContent = formatRupiah(raw);
  });

  donateLinks.forEach((link) => {
    link.addEventListener("click", () => {
      link.setAttribute("href", KITABISA_URL);
    });
  });

  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    const format = el.dataset.format === "rp";
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = format
        ? formatRupiah(value).replace("Rp", "").trim()
        : value.toLocaleString("en-US");
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  const bars = document.querySelectorAll("[data-bar]");
  if ("IntersectionObserver" in window) {
    const bio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = `${bar.dataset.bar}%`;
            bio.unobserve(bar);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((el) => bio.observe(el));
  }

  setSelected(150000);
})();
