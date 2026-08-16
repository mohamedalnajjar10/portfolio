/* =====================================================================
   SPYDY PORTFOLIO — app.js
   Vanilla JS only. GSAP + ScrollTrigger come from CDN (loaded first).
   - Renders the 11 project cards from embedded data
   - Navbar solid-on-scroll + active link highlighting
   - Contact form -> mailto
   - Hover-to-reveal also works on tap (mobile)
   - GSAP hero intro, scroll reveals, card staggers, web parallax
   ===================================================================== */

(() => {
  "use strict";

  /* ------------------------- 1) PROJECT DATA (embedded verbatim) ------------------------- */
  const PROJECTS = [
    {
      title: "Blood Bank System",
      stack: "NestJS, MySQL, Sequelize",
      date: "01/2025",
      bullets: [
        "Architected a resilient blood bank platform; schema innovations cut blood delivery times by 20%.",
        "35% reduction in query latency via indexing and optimized SQL."
      ]
    },
    {
      title: "Gaza-Express-Project",
      stack: "Nest.js, Prisma, Jest",
      date: "01/2026",
      bullets: [
        "Modular backend with Prisma type-safe operations; reusable middleware/service layers cut dev time 30%.",
        "JWT auth with refresh token rotation, 99.9% auth reliability, -40% unauthorized access attempts."
      ]
    },
    {
      title: "Task Management System",
      stack: "NestJS",
      date: "02/2025",
      bullets: [
        "JWT + RBAC across 15+ REST endpoints, cutting auth errors by 50%.",
        "Jest unit testing raised coverage from 60% to 90%."
      ]
    },
    {
      title: "Live Sports Streaming Platform",
      stack: "Nest.js, WebSocket",
      date: "06/2025",
      bullets: [
        "Real-time streaming with WebSocket broadcasting, 1,800+ concurrent viewers, 99.7% uptime.",
        "Query optimization + caching achieved 40% latency reduction."
      ]
    },
    {
      title: "Property Booking Marketplace",
      stack: "Nest.js, Prisma, MySQL",
      date: "11/2025",
      bullets: [
        "Airbnb-inspired booking with advanced search; +10% booking conversion.",
        "Secure payments + real-time availability: 45% faster booking, +35% data retrieval efficiency."
      ]
    },
    {
      title: "Movies APIs",
      stack: "Express.js, TMDB",
      date: "06/2024",
      bullets: [
        "Sophisticated movie API; search improved 60%.",
        "Robust validation and error handling ensuring data integrity on all endpoints."
      ]
    },
    {
      title: "Care-Project",
      stack: "Nest.js, Prisma",
      date: "03/2026",
      bullets: [
        "Healthcare backend with type-safe patient records and scheduling; -25% admin processing time.",
        "RBAC + JWT refresh rotation, 100% compliance, -40% unauthorized attempts.",
        "REST endpoints with Jest testing, 88% coverage, -30% API response time under load."
      ]
    },
    {
      title: "E-Commerce Backend System",
      stack: "Express.js",
      date: "03/2024",
      bullets: [
        "Comprehensive logging and audit trails for transactions; -25% vulnerability resolution time.",
        "20% faster API response under peak load."
      ]
    },
    {
      title: "Digital Wallet System",
      stack: "Express.js",
      date: "04/2024",
      bullets: [
        "Secure wallet with tokenization; -20% transaction errors.",
        "Role-based authorization decreased unauthorized access by 35%."
      ]
    },
    {
      title: "Real-Time Chat Application",
      stack: "Nest.js, Socket.io",
      date: "02/2024",
      bullets: [
        "Scalable bidirectional messaging with MFA via JWT; -20% message latency.",
        "Fixed 5 critical vulnerabilities, RBAC, 90% unit test coverage."
      ]
    },
    {
      title: "Store",
      stack: "PHP, Laravel, Blade, MySQL, Redis",
      date: "12/2025",
      bullets: [
        "Full e-commerce backend (catalog, cart, orders); -25% response time via optimized Eloquent + Redis caching.",
        "JWT + RBAC (Admin/Customer/Vendor) across 20+ endpoints, -30% unauthorized attempts."
      ]
    }
  ];

  const GITHUB_URL = "https://github.com/mohamedalnajjar10/";

  /* ------------------------- 2) RENDER PROJECT CARDS ------------------------- */
  const grid = document.getElementById("projects-grid");

  if (grid) {
    PROJECTS.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";

      // Top row: title | date badge + external-link icon
      const top = document.createElement("div");
      top.className = "project-top";

      const title = document.createElement("h3");
      title.className = "project-title";
      title.textContent = project.title;

      const right = document.createElement("div");
      right.className = "project-top-right";

      const badge = document.createElement("span");
      badge.className = "date-badge";
      badge.textContent = project.date;

      const link = document.createElement("a");
      link.className = "project-link";
      link.href = GITHUB_URL;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", project.title + " on GitHub");
      link.innerHTML =
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 L17 7 M9 7 H17 V15"/></svg>';

      right.append(badge, link);
      top.append(title, right);

      // Bullet points
      const bullets = document.createElement("ul");
      bullets.className = "project-bullets";
      project.bullets.forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        bullets.appendChild(li);
      });

      // Tech tag chips
      const tags = document.createElement("div");
      tags.className = "project-tags";
      project.stack.split(", ").forEach((tech) => {
        const chip = document.createElement("span");
        chip.className = "tag";
        chip.textContent = tech;
        tags.appendChild(chip);
      });

      card.append(top, bullets, tags);
      grid.appendChild(card);
    });
  }

  /* ------------------------- 3) NAVBAR: SOLID AFTER SCROLL + ACTIVE LINK ------------------------- */
  const navbar = document.getElementById("navbar");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Highlight the nav link of the section currently in view
  const navSections = ["about", "skills", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  navSections.forEach((section) => observer.observe(section));

  /* ------------------------- 4) CONTACT FORM -> MAILTO ------------------------- */
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        form.classList.add("shake");
        setTimeout(() => form.classList.remove("shake"), 450);
        return;
      }

      const subject = `Portfolio Contact — ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const href =
        `mailto:mohamedalnajjar1000@gmail.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      const button = form.querySelector("button[type='submit']");
      button.textContent = "OPENING MAIL…";
      setTimeout(() => (button.textContent = "SEND MESSAGE"), 2500);

      window.location.href = href;
    });
  }

  /* ------------------------- 5) HOVER-TO-REVEAL -------------------------
     The photo lives inside an SVG clipped by a circle (#reveal-spot). Moving
     the cursor repositions the circle (cx / cy SVG attributes) so ONLY the
     part of the photo under the cursor is visible. Tap = full reveal (mobile). */
  const revealStack = document.getElementById("revealStack");
  const revealSpot = document.getElementById("reveal-spot");

  if (revealStack && revealSpot) {
    const svg = revealStack.querySelector(".photo-svg");
    const svgImage = svg ? svg.querySelector("image") : null;

    let VB_W = 400; // current SVG viewBox size, synced to the stack
    let VB_H = 500;
    let currentR = 0;
    let rafId = null;

    // The stack now sizes to image 16's natural ratio, so re-fit the SVG
    // overlay (viewBox + image size) to whatever the stack actually is.
    const syncViewBox = () => {
      if (!svg || !svgImage) return;
      const rect = revealStack.getBoundingClientRect();
      VB_W = Math.max(1, Math.round(rect.width));
      VB_H = Math.max(1, Math.round(rect.height));
      svg.setAttribute("viewBox", "0 0 " + VB_W + " " + VB_H);
      svgImage.setAttribute("width", VB_W);
      svgImage.setAttribute("height", VB_H);
    };

    syncViewBox();
    if (window.ResizeObserver) {
      new ResizeObserver(syncViewBox).observe(revealStack);
    }
    window.addEventListener("resize", syncViewBox);

    // Spotlight radius scales with the image width (~1/3 of it)
    const spotRadius = () => VB_W * 0.32;

    const animateSpot = (targetR, duration) => {
      cancelAnimationFrame(rafId);
      const startR = currentR;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        currentR = startR + (targetR - startR) * (1 - Math.pow(1 - t, 3)); // ease-out
        revealSpot.setAttribute("r", currentR);
        if (t < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    revealStack.addEventListener("mouseenter", () => {
      if (!revealStack.classList.contains("revealed")) animateSpot(spotRadius(), 220);
    });

    revealStack.addEventListener("mousemove", (event) => {
      const rect = revealStack.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * VB_W;
      const y = ((event.clientY - rect.top) / rect.height) * VB_H;
      revealSpot.setAttribute("cx", x);
      revealSpot.setAttribute("cy", y);
    });

    revealStack.addEventListener("mouseleave", () => {
      if (!revealStack.classList.contains("revealed")) animateSpot(0, 300);
    });

    // Tap on touch devices: full reveal / hide toggle
    revealStack.addEventListener("click", () => {
      if (revealStack.classList.contains("revealed")) {
        revealStack.classList.remove("revealed");
        animateSpot(0, 250);
      } else {
        revealStack.classList.add("revealed");
        animateSpot(Math.hypot(VB_W, VB_H) / 2, 350);
      }
    });
  }

  /* ------------------------- 6) GSAP + SCROLLTRIGGER ANIMATIONS -------------------------
     Progressive enhancement: if the CDN scripts fail to load (offline),
     the page simply stays fully visible without animation.                  */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero intro — the big artwork fades/zooms in on load
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .from(".hero-figure", { scale: 0.85, opacity: 0, duration: 0.9, ease: "power2.out" })
      .from(".hero-hint", { y: 8, opacity: 0, duration: 0.4 }, "-=0.2");

    // Generic fade/slide-up for every [data-reveal] element
    gsap.utils.toArray("[data-reveal]").forEach((element) => {
      gsap.from(element, {
        y: 56,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 86%", once: true }
      });
    });

    // Staggered card reveals
    gsap.from(".skill-card", {
      y: 44,
      opacity: 0,
      stagger: 0.07,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: ".skills-grid", start: "top 82%", once: true }
    });

    gsap.from(".project-card", {
      y: 44,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: ".projects-grid", start: "top 80%", once: true }
    });

    gsap.from(".cert-chip", {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: ".cert-chips", start: "top 85%", once: true }
    });

    // Subtle parallax on the fixed web decorations
    gsap.to(".web-tl", {
      yPercent: 45,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.2 }
    });

    gsap.to(".web-mr", {
      yPercent: -35,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.2 }
    });

    // Re-measure after everything (fonts, images) has settled
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
})();