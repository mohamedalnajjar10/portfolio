/**
 * ============================================================================
 * GloryTech SHOWCASE WEBSITE - BILINGUAL JAVASCRIPT ENGINE
 * Vanilla ES6+ Modular Architecture:
 * 1. i18n Controller (Bilingual EN/AR, RTL/LTR, localStorage & live announcer)
 * 2. Theme Controller (Dark/Light + localStorage)
 * 3. Navigation & Mobile Drawer (Focus Trapping, Scroll Spy)
 * 4. Hero Animated Numerical Counters (IntersectionObserver)
 * 5. Interactive Before/After Comparison Slider (Bidirectional Drag, Touch & Keys)
 * 6. Dynamic Services & Process Timelines
 * 7. Filterable Portfolio Grid & Case Study Modal (Bilingual Data)
 * 8. Testimonials Carousel (Auto-play, Touch Swipe & RTL Support)
 * 9. FAQ Accordion (ARIA-compliant Smooth Expansions)
 * 10. Real-Time Validated Contact Form (Localized Error Messages & Pre-fills)
 * 11. Scroll Reveal Animations & Back-to-Top
 * ============================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. i18n CONTROLLER (INTERNATIONALIZATION)
     ========================================================================== */
  const I18nController = (() => {
    const STORAGE_KEY = "site-lang";
    let currentLang = "en";

    // References to translation dictionaries loaded from translations-en.js and translations-ar.js
    const dictionaries = {
      en: window.translationsEn || {},
      ar: window.translationsAr || {},
    };

    /**
     * Helper to safely get nested property value from dictionary
     * @param {Object} obj
     * @param {string} path - e.g. "hero.badge" or "whyUs.cards.0.title"
     * @returns {string|null}
     */
    const getNestedTranslation = (obj, path) => {
      if (!path) return null;
      return path
        .split(".")
        .reduce(
          (prev, curr) =>
            prev && prev[curr] !== undefined ? prev[curr] : null,
          obj,
        );
    };

    /**
     * Initializes language on page load
     */
    const init = () => {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && (savedLang === "en" || savedLang === "ar")) {
        currentLang = savedLang;
      } else {
        // Auto-detect Arabic browser preference
        const browserPrefersAr = (navigator.language || "")
          .toLowerCase()
          .startsWith("ar");
        currentLang = browserPrefersAr ? "ar" : "en";
      }

      applyLanguage(currentLang, false);

      // Setup toggle button event listeners
      const langToggleBtns = [
        document.getElementById("lang-toggle"),
        document.getElementById("mobile-lang-toggle"),
      ];

      langToggleBtns.forEach((btn) => {
        if (btn) {
          btn.addEventListener("click", toggleLanguage);
        }
      });
    };

    /**
     * Toggles between English and Arabic
     */
    const toggleLanguage = () => {
      const nextLang = currentLang === "en" ? "ar" : "en";
      applyLanguage(nextLang, true);
    };

    /**
     * Applies language to DOM, updates attributes, and re-renders components
     * @param {string} lang - 'en' | 'ar'
     * @param {boolean} announce - whether to announce to screen readers
     */
    const applyLanguage = (lang, announce = true) => {
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);

      const isRtl = lang === "ar";
      const root = document.documentElement;

      root.setAttribute("lang", lang);
      root.setAttribute("dir", isRtl ? "rtl" : "ltr");

      const dict = dictionaries[lang] || dictionaries.en;

      // Update Document Title and Meta
      if (dict.meta) {
        if (dict.meta.title) document.title = dict.meta.title;
        const metaDesc = document.getElementById("meta-description");
        if (metaDesc && dict.meta.description)
          metaDesc.setAttribute("content", dict.meta.description);
        const ogTitle = document.getElementById("og-title");
        if (ogTitle && dict.meta.ogTitle)
          ogTitle.setAttribute("content", dict.meta.ogTitle);
        const ogDesc = document.getElementById("og-description");
        if (ogDesc && dict.meta.ogDescription)
          ogDesc.setAttribute("content", dict.meta.ogDescription);
      }

      // 1. Translate elements with data-i18n attribute
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const translation = getNestedTranslation(dict, key);
        if (translation !== null && translation !== undefined) {
          el.innerHTML = translation;
        }
      });

      // 2. Translate elements with data-i18n-placeholder
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const translation = getNestedTranslation(dict, key);
        if (translation !== null && translation !== undefined) {
          el.setAttribute("placeholder", translation);
        }
      });

      // 3. Translate elements with data-i18n-aria-label
      document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        const key = el.getAttribute("data-i18n-aria-label");
        const translation = getNestedTranslation(dict, key);
        if (translation !== null && translation !== undefined) {
          el.setAttribute("aria-label", translation);
        }
      });

      // Re-render dynamic sections that depend on dictionary arrays
      DynamicContentController.renderServices(dict);
      DynamicContentController.renderProcess(dict);
      DynamicContentController.renderPortfolio(dict);
      DynamicContentController.renderTestimonials(dict);
      DynamicContentController.renderPricing(dict);
      DynamicContentController.renderFaq(dict);

      // Re-render service select dropdown options in contact form
      ContactFormController.updateServiceOptions(dict);
      if (ContactFormController.updateBudgetOptions) {
        ContactFormController.updateBudgetOptions(dict);
      }

      // Announce language change to screen readers
      if (announce) {
        const announcer = document.getElementById("a11y-announcer");
        if (announcer && dict.a11y && dict.a11y.langChanged) {
          announcer.textContent = dict.a11y.langChanged;
        }
      }
    };

    const getCurrentLang = () => currentLang;
    const getDictionary = () => dictionaries[currentLang] || dictionaries.en;

    return {
      init,
      toggleLanguage,
      applyLanguage,
      getCurrentLang,
      getDictionary,
      getNestedTranslation,
    };
  })();

  /* ==========================================================================
     2. THEME CONTROLLER
     ========================================================================== */
  const ThemeController = (() => {
    const STORAGE_KEY = "company_theme_preference";
    const themeToggleBtn = document.getElementById("theme-toggle");
    const root = document.documentElement;

    const init = () => {
      if (!themeToggleBtn) return;

      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setTheme(prefersDark ? "dark" : "light");
      }

      themeToggleBtn.addEventListener("click", toggleTheme);

      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem(STORAGE_KEY)) {
            setTheme(e.matches ? "dark" : "light");
          }
        });
    };

    const setTheme = (theme) => {
      root.setAttribute("data-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
      if (themeToggleBtn) {
        const isDark = theme === "dark";
        const dict = I18nController.getDictionary();
        const label = isDark
          ? dict.a11y?.themeToggleDark || "Switch to light theme"
          : dict.a11y?.themeToggleLight || "Switch to dark theme";
        themeToggleBtn.setAttribute("aria-label", label);
        themeToggleBtn.setAttribute("title", label);
      }
    };

    const toggleTheme = () => {
      const currentTheme = root.getAttribute("data-theme") || "dark";
      setTheme(currentTheme === "dark" ? "light" : "dark");
    };

    return { init };
  })();

  /* ==========================================================================
     3. NAVIGATION & MOBILE DRAWER CONTROLLER
     ========================================================================== */
  const NavigationController = (() => {
    const menuToggle = document.getElementById("menu-toggle");
    const drawerClose = document.getElementById("drawer-close");
    const mobileDrawer = document.getElementById("mobile-nav-drawer");
    const backdrop = document.getElementById("mobile-nav-backdrop");
    const navLinks = document.querySelectorAll(".desktop-nav .nav-link");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    const sections = document.querySelectorAll("section[id], main[id]");

    const init = () => {
      if (menuToggle && mobileDrawer && backdrop) {
        menuToggle.addEventListener("click", openDrawer);
        if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
        backdrop.addEventListener("click", closeDrawer);

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
            closeDrawer();
          }
        });

        mobileLinks.forEach((link) => {
          link.addEventListener("click", closeDrawer);
        });
      }

      initScrollSpy();
    };

    const openDrawer = () => {
      mobileDrawer.classList.add("open");
      backdrop.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";

      const focusableEls = mobileDrawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableEls.length) focusableEls[0].focus();
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove("open");
      backdrop.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      menuToggle.focus();
    };

    const initScrollSpy = () => {
      const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      };

      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              const href = link.getAttribute("href").replace("#", "");
              link.classList.toggle("active", href === currentId);
            });
          }
        });
      }, observerOptions);

      sections.forEach((sec) => spyObserver.observe(sec));
    };

    return { init };
  })();

  /* ==========================================================================
     4. HERO ANIMATED STAT COUNTERS
     ========================================================================== */
  const CounterController = (() => {
    const statCounters = document.querySelectorAll(".stat-counter");

    const init = () => {
      if (!statCounters.length) return;

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startCounting(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 },
      );

      statCounters.forEach((counter) => observer.observe(counter));
    };

    const startCounting = (element) => {
      const targetVal = parseFloat(
        element.getAttribute("data-val") || element.getAttribute("data-target"),
      );
      const isDecimal = element.hasAttribute("data-decimals");
      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = ease * targetVal;

        element.textContent = isDecimal
          ? currentVal.toFixed(1)
          : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          element.textContent = isDecimal ? targetVal.toFixed(1) : targetVal;
        }
      };

      requestAnimationFrame(updateCount);
    };

    return { init };
  })();

  /* ==========================================================================
     5. BEFORE / AFTER COMPARISON SLIDER (BIDIRECTIONAL LTR & RTL)
     ========================================================================== */
  const ComparisonSliderController = (() => {
    const sliderContainer = document.querySelector(".comparison-container");
    const afterView = document.getElementById("comparison-after-view");
    const handle = document.getElementById("comparison-handle");
    const rangeInput = document.getElementById("slider-range-input");

    let isDragging = false;

    const init = () => {
      if (!sliderContainer || !afterView || !handle) return;

      updatePosition(50);

      sliderContainer.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      sliderContainer.addEventListener("touchstart", onTouchStart, {
        passive: true,
      });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);

      sliderContainer.addEventListener("keydown", (e) => {
        let currentPos =
          parseFloat(sliderContainer.getAttribute("aria-valuenow")) || 50;
        const isRtl = document.documentElement.getAttribute("dir") === "rtl";

        if (e.key === "ArrowLeft") {
          e.preventDefault();
          updatePosition(
            isRtl ? Math.min(100, currentPos + 5) : Math.max(0, currentPos - 5),
          );
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          updatePosition(
            isRtl ? Math.max(0, currentPos - 5) : Math.min(100, currentPos + 5),
          );
        }
      });

      if (rangeInput) {
        rangeInput.addEventListener("input", (e) => {
          updatePosition(parseFloat(e.target.value));
        });
      }
    };

    const updatePosition = (percent) => {
      const clamped = Math.max(0, Math.min(100, percent));
      afterView.style.width = `${clamped}%`;

      const isRtl = document.documentElement.getAttribute("dir") === "rtl";
      if (isRtl) {
        handle.style.insetInlineStart = `${clamped}%`;
      } else {
        handle.style.left = `${clamped}%`;
      }

      sliderContainer.setAttribute("aria-valuenow", Math.round(clamped));
      if (rangeInput && parseFloat(rangeInput.value) !== clamped) {
        rangeInput.value = clamped;
      }
    };

    const calcPercentFromX = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      const isRtl = document.documentElement.getAttribute("dir") === "rtl";

      let offsetX;
      if (isRtl) {
        // In RTL, 0% is at the right edge, expanding toward left
        offsetX = rect.right - clientX;
      } else {
        // In LTR, 0% is at the left edge, expanding toward right
        offsetX = clientX - rect.left;
      }
      return (offsetX / rect.width) * 100;
    };

    const onMouseDown = (e) => {
      isDragging = true;
      updatePosition(calcPercentFromX(e.clientX));
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      updatePosition(calcPercentFromX(e.clientX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e) => {
      isDragging = true;
      if (e.touches.length > 0)
        updatePosition(calcPercentFromX(e.touches[0].clientX));
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        e.preventDefault();
        updatePosition(calcPercentFromX(e.touches[0].clientX));
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    return { init, updatePosition };
  })();

  /* ==========================================================================
     6. DYNAMIC CONTENT CONTROLLER (SERVICES, PROCESS, PORTFOLIO, ETC.)
     ========================================================================== */
  const DynamicContentController = (() => {
    /**
     * Service SVG icons mapped by id
     */
    const serviceIcons = {
      websites: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
      mobile: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
      erp: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM9 3v18M3 9h18M3 15h18"></path></svg>`,
      chatbots: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="9" cy="10" r="1"></circle><circle cx="15" cy="10" r="1"></circle></svg>`,
      "ai-web": `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>`,
      modernization: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
      rescue: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    };

    /**
     * Renders 7 Services Cards from active dictionary
     * @param {Object} dict
     */
    const renderServices = (dict) => {
      const container = document.getElementById("services-grid-container");
      if (!container || !dict.services || !dict.services.items) return;

      container.innerHTML = dict.services.items
        .map((s) => {
          const isHighlight = s.id === "rescue";
          const badgeClass = isHighlight
            ? "service-badge service-badge-alert"
            : "service-badge";
          const cardClass = isHighlight
            ? "service-card service-card-highlight reveal revealed"
            : "service-card reveal revealed";
          const iconSvg = serviceIcons[s.id] || serviceIcons.websites;

          const featuresHtml = s.features
            .map(
              (f) => `
          <li>
            <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${f}</span>
          </li>
        `,
            )
            .join("");

          return `
          <article class="${cardClass}" data-service="${s.id}">
            <div class="service-card-header">
              <div class="service-icon-box">${iconSvg}</div>
              <span class="${badgeClass}">${s.badge}</span>
            </div>
            <h3 class="service-title">${s.title}</h3>
            <p class="service-summary">${s.summary}</p>
            <ul class="service-feature-list">${featuresHtml}</ul>
            <div class="service-footer">
              <a href="#contact" class="service-inquire-btn" data-prefill="${s.prefill}">
                <span>${s.ctaText}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </article>
        `;
        })
        .join("");

      // Wire up inquiry click triggers
      ContactFormController.setupPreFillTriggers();
    };

    /**
     * Renders Process Timeline from active dictionary
     * @param {Object} dict
     */
    const renderProcess = (dict) => {
      const container = document.getElementById("process-timeline-container");
      if (!container || !dict.process || !dict.process.steps) return;

      container.innerHTML = dict.process.steps
        .map(
          (step) => `
        <div class="process-step reveal revealed" data-step="${step.num}">
          <div class="step-marker">
            <span class="step-num"><bdi dir="ltr">${step.num}</bdi></span>
          </div>
          <div class="step-content">
            <div class="step-badge">${step.badge}</div>
            <h3 class="step-title">${step.title}</h3>
            <p class="step-text">${step.text}</p>
            <div class="step-deliverable">
              <strong>${dict.process.deliverablePrefix || "Deliverable:"}</strong> ${step.deliverable}
            </div>
          </div>
        </div>
      `,
        )
        .join("");
    };

    /**
     * Renders Portfolio Cards from active dictionary
     * @param {Object} dict
     */
    const renderPortfolio = (dict) => {
      const container = document.getElementById("portfolio-grid-container");
      if (!container) return;

      const cases = [
        {
          key: "nexora",
          catKey: "erp",
          visualClass: "visual-erp",
          techSummary: "PostgreSQL • Fastify • React",
          metric:
            dict.lang === "ar"
              ? "+42% كفاءة تشغيلية"
              : "+42% Operational Efficiency",
          chips: ["Custom ERP", "Multi-tenant RBAC", "API Integrations"],
          en: {
            cat: "ERP • Logistics",
            title: "Nexora Global Freight & Inventory ERP",
            desc: "Replaced 18 fragmented Excel sheets and manual emails with a centralized, real-time logistics dashboard, automated customs invoicing, and barcode warehouse scanning.",
          },
          ar: {
            cat: "أنظمة ERP • الخدمات اللوجستية",
            title: "نظام Nexora لإدارة الشحن والمخازن اللوجستية",
            desc: "استبدال 18 ملف إكسل متفرق ومئات الإيميلات بنظام لوجستي مركزي موحد، وأتمتة الفواتير الجمركية ومسح الباركود في المستودعات في الوقت الفعلي.",
          },
        },
        {
          key: "lumina",
          catKey: "ai-bots",
          visualClass: "visual-ai",
          techSummary: "pgvector • OpenAI • Next.js",
          metric:
            dict.lang === "ar"
              ? "180 مللي ثانية • 500 ألف وثيقة"
              : "180ms Semantic Search",
          chips: ["Vector Search", "LLM Workflows", "High Concurrency"],
          en: {
            cat: "AI Web Platform • FinTech",
            title: "Lumina Intelligence Financial Search",
            desc: "An intelligent research portal indexing over 500,000 regulatory documents with semantic vector similarity, conversational summaries, and automated compliance alerts.",
          },
          ar: {
            cat: "منصة ويب بالذكاء الاصطناعي • قطاع المال",
            title: "منصة Lumina للبحث والتحليل المالي الذكي",
            desc: "بوابة بحث دلالي ذكية تفهرس أكثر من 500,000 وثيقة تنظيمية عبر متجهات الذكاء الاصطناعي مع ملخصات فورية وتنبيهات امتثال مؤتمتة.",
          },
        },
        {
          key: "apexpulse",
          catKey: "mobile",
          visualClass: "visual-mobile",
          techSummary: "React Native • WebRTC • HIPAA",
          metric:
            dict.lang === "ar"
              ? "تقييم 4.9 (أكثر من 60 ألف مريض)"
              : "4.9/5 Store Rating (60k+ Users)",
          chips: ["iOS & Android", "Bluetooth BLE", "HIPAA Security"],
          en: {
            cat: "Mobile App • HealthTech",
            title: "ApexPulse Telehealth & Vitals Tracker",
            desc: "Cross-platform mobile application providing HIPAA-compliant encrypted video consultations, Bluetooth medical sensor pairing, and e-prescription refills.",
          },
          ar: {
            cat: "تطبيقات الجوال • الرعاية الصحية",
            title: "تطبيق ApexPulse للاستشارات الطبية عن بعد",
            desc: "تطبيق جوال متعدد المنصات يوفر استشارات مرئية مشفرة ومتوافقة مع معايير HIPAA وربط مستشعرات البلوتوث الطبية وصرف الوصفات إلكترونياً.",
          },
        },
        {
          key: "veloce",
          catKey: "websites",
          visualClass: "visual-web",
          techSummary: "Vanilla JS • CSS Grid • Edge CDN",
          metric:
            dict.lang === "ar"
              ? "+310% زيادة المبيعات"
              : "+310% Conversion Lift",
          chips: ["Ultra-Fast Loading", "WCAG AA", "Global Edge Caching"],
          en: {
            cat: "Custom Website • Luxury Retail",
            title: "Veloce Atelier Luxury E-Commerce",
            desc: "Bespoke high-performance digital flagship store with 60fps micro-interactions, headless checkout, and 98+ Core Web Vitals on mobile and desktop.",
          },
          ar: {
            cat: "مواقع ويب مخصصة • متاجر المنتجات الفاخرة",
            title: "متجر Veloce Atelier الرقمي الفاخر",
            desc: "متجر إلكتروني فائق السرعة والأناقة بمعدل 60 إطاراً في الثانية، ودفع سريع بدون خادم، وأداء 98+ في مؤشرات Core Web Vitals للجوال والحاسوب.",
          },
        },
        {
          key: "omnia",
          catKey: "ai-bots",
          visualClass: "visual-bot",
          techSummary: "WhatsApp API • Node.js • Redis",
          metric:
            dict.lang === "ar"
              ? "أتمتة 78% من الاستفسارات"
              : "78% Automated Deflection",
          chips: ["WhatsApp Cloud", "NLP Intent Match", "Zendesk Bridge"],
          en: {
            cat: "Chatbots • Customer Support",
            title: "Omnia WhatsApp AI Customer Concierge",
            desc: "Multi-lingual intelligent customer service bot handling order status inquiries, bookings, and return claims 24/7 across WhatsApp and Web Chat.",
          },
          ar: {
            cat: "روبوتات الدردشة • خدمة العملاء",
            title: "مساعد Omnia الذكي عبر واتساب لخدمة العملاء",
            desc: "روبوت محادثة متعدد اللغات يتعامل مع استفسارات الشحن وتأكيد الحجوزات وطلبات الاسترجاع على مدار الساعة عبر واتساب والدردشة الحية.",
          },
        },
        {
          key: "finguard",
          catKey: "rescue",
          visualClass: "visual-rescue",
          techSummary: "Refactor • Docker • TypeScript",
          metric:
            dict.lang === "ar"
              ? "4.8 ثانية ← 0.4 ثانية (-91% تأخير)"
              : "4.8s → 0.4s (-91% Latency)",
          chips: [
            "Security Hardening",
            "AI Code Salvage",
            "Zero-Downtime Rollout",
          ],
          en: {
            cat: "Rescue & Modernization • FinTech",
            title: "FinGuard Legacy Architecture Overhaul",
            desc: "Rescued a buggy, security-vulnerable prototype built with a generic AI code generator. Migrated to modern TypeScript, fixed critical auth vulnerabilities, and scaled to 100k daily users.",
          },
          ar: {
            cat: "الإنقاذ والتحديث • التكنولوجيا المالية",
            title: "إنقاذ وتأهيل المنظومة البرمجية لمنصة FinGuard",
            desc: "إنقاذ نموذج أولي مليء بالثغرات تم إنشاؤه بأداة ذكاء اصطناعي، وإعادة بنائه بلغة TypeScript وتحصين الأمان لخدمة أكثر من 100 ألف مستخدم يومياً.",
          },
        },
      ];

      const isAr = I18nController.getCurrentLang() === "ar";
      const ctaLabel = dict.portfolio?.viewCaseStudy || "View Full Case Study";

      container.innerHTML = cases
        .map((c) => {
          const data = isAr ? c.ar : c.en;
          const chipsHtml = c.chips
            .map(
              (ch) =>
                `<span class="tech-chip"><bdi dir="ltr">${ch}</bdi></span>`,
            )
            .join("");

          return `
          <article class="portfolio-card reveal revealed" data-category="${c.catKey}">
            <div class="card-visual ${c.visualClass}">
              <div class="card-metric-badge">${c.metric}</div>
              <div class="visual-decor">
                <span class="code-pill">${c.techSummary}</span>
              </div>
            </div>
            <div class="card-content">
              <div class="card-cat">${data.cat}</div>
              <h3 class="card-title">${data.title}</h3>
              <p class="card-desc">${data.desc}</p>
              <div class="card-tech-chips">${chipsHtml}</div>
              <button type="button" class="btn-card-detail" data-case="${c.key}" aria-haspopup="dialog">
                <span>${ctaLabel}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </article>
        `;
        })
        .join("");

      // Wire modal click events
      PortfolioController.wireDetailButtons();
    };

    /**
     * Renders Testimonials Slider from active dictionary
     * @param {Object} dict
     */
    const renderTestimonials = (dict) => {
      const track = document.getElementById("testimonial-track");
      const dotsContainer = document.getElementById("slider-dots");
      if (!track || !dict.testimonials || !dict.testimonials.slides) return;

      track.innerHTML = dict.testimonials.slides
        .map(
          (s, idx) => `
        <div class="testimonial-slide ${idx === 0 ? "active" : ""}" role="group" aria-roledescription="slide" aria-label="${idx + 1} of ${dict.testimonials.slides.length}">
          <div class="testimonial-card">
            <div class="rating-stars" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote class="quote-text">&ldquo;${s.quote}&rdquo;</blockquote>
            <div class="author-meta">
              <div class="author-avatar-badge" aria-hidden="true">${s.initials}</div>
              <div>
                <div class="author-name">${s.name}</div>
                <div class="author-title">${s.title}</div>
              </div>
            </div>
          </div>
        </div>
      `,
        )
        .join("");

      if (dotsContainer) {
        dotsContainer.innerHTML = dict.testimonials.slides
          .map(
            (_, idx) => `
          <button type="button" class="dot ${idx === 0 ? "active" : ""}" data-slide="${idx}" role="tab" aria-selected="${idx === 0 ? "true" : "false"}" aria-label="Go to slide ${idx + 1}"></button>
        `,
          )
          .join("");
      }

      TestimonialsController.refreshSlider();
    };

    /**
     * Renders Pricing Tiers from active dictionary
     * @param {Object} dict
     */
    const renderPricing = (dict) => {
      const container = document.getElementById("pricing-cards-container");
      if (!container || !dict.pricing) return;

      const p = dict.pricing;
      const tiers = [p.tier1, p.tier2, p.tier3];

      container.innerHTML = tiers
        .map((t, idx) => {
          const isFeatured = idx === 1;
          const cardClass = isFeatured
            ? "pricing-card pricing-card-featured reveal revealed"
            : "pricing-card reveal revealed";
          const ribbon = isFeatured
            ? `<div class="featured-ribbon">${p.popularRibbon || "Most Popular"}</div>`
            : "";
          const btnClass = isFeatured
            ? "btn btn-primary btn-full plan-cta"
            : "btn btn-outline btn-full plan-cta";

          const featuresHtml = t.features
            .map(
              (f) => `
          <li>
            <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${f}</span>
          </li>
        `,
            )
            .join("");

          return `
          <div class="${cardClass}">
            ${ribbon}
            <div class="pricing-card-header">
              <h3 class="plan-name">${t.name}</h3>
              <p class="plan-desc">${t.desc}</p>
              <div class="plan-price-tag">
                <span class="price-val">${t.priceVal}</span>
                <span class="price-period">${t.pricePeriod}</span>
              </div>
            </div>
            <div class="plan-features">
              <ul>${featuresHtml}</ul>
            </div>
            <div class="plan-footer">
              <a href="#contact" class="${btnClass}" data-tier="${t.name}">${t.cta}</a>
            </div>
          </div>
        `;
        })
        .join("");

      ContactFormController.setupPreFillTriggers();
    };

    /**
     * Renders FAQ Accordion from active dictionary
     * @param {Object} dict
     */
    const renderFaq = (dict) => {
      const container = document.getElementById("faq-accordion");
      if (!container || !dict.faq || !dict.faq.items) return;

      container.innerHTML = dict.faq.items
        .map(
          (item, idx) => `
        <div class="accordion-item reveal revealed">
          <button type="button" class="accordion-header" id="faq-btn-${idx + 1}" aria-expanded="false" aria-controls="faq-content-${idx + 1}">
            <span class="faq-question">${item.q}</span>
            <span class="accordion-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </button>
          <div class="accordion-collapse" id="faq-content-${idx + 1}" role="region" aria-labelledby="faq-btn-${idx + 1}" hidden>
            <div class="accordion-body">${item.a}</div>
          </div>
        </div>
      `,
        )
        .join("");

      FaqController.rebind();
    };

    return {
      renderServices,
      renderProcess,
      renderPortfolio,
      renderTestimonials,
      renderPricing,
      renderFaq,
    };
  })();

  /* ==========================================================================
     7. FILTERABLE PORTFOLIO & CASE STUDY MODAL CONTROLLER
     ========================================================================== */
  const PortfolioController = (() => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const modalBackdrop = document.getElementById("case-study-modal-backdrop");
    const modal = document.getElementById("case-study-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalContentArea = document.getElementById("modal-content-area");

    let lastFocusedElement = null;

    const modalData = {
      en: {
        nexora: {
          category: "Custom ERP & Logistics Automation",
          title: "Nexora Global Freight & Inventory ERP",
          metric: "+42% Operational Efficiency • Zero Stockouts",
          challenge:
            "Nexora was operating across 6 regional warehouses using disparate spreadsheets, manual Slack notifications, and uncoordinated freight logistics. Human error resulted in frequent shipment delays, miscalculated duty fees, and zero executive visibility.",
          solution:
            "We architected and delivered a bespoke turnkey ERP in 10 weeks. Features include automated inventory threshold reordering, multi-tenant RBAC permissions for customs agents, real-time container GPS telemetry, and integrated Stripe/QuickBooks billing APIs.",
          results:
            "Reduced daily order processing duration from 4.5 hours to 18 minutes. Eliminated inventory stockout incidents, resulting in $2.4M saved in freight penalty fees in year one.",
          techStack: [
            "PostgreSQL",
            "Fastify",
            "TypeScript",
            "React",
            "Docker",
            "AWS ECS",
          ],
        },
        lumina: {
          category: "AI-Powered Platform & Vector Retrieval",
          title: "Lumina Intelligence Financial Search Engine",
          metric: "180ms Latency • 500k Documents Indexed",
          challenge:
            "Financial analysts were spending 15+ hours weekly manually reading dense 100-page SEC filings, press releases, and global compliance mandates to spot regulatory risk factors.",
          solution:
            "Built an enterprise vector search portal utilizing pgvector embeddings with hybrid full-text search. Engineered streaming response generation and custom fine-tuned extraction chains with deterministic citations to original PDF page numbers.",
          results:
            "Cut compliance research time by 75%. Scaled smoothly to 10,000 concurrent analyst queries with average response times under 200ms.",
          techStack: [
            "Next.js",
            "Python FastAPI",
            "pgvector",
            "OpenAI API",
            "Redis",
            "Tailored CSS",
          ],
        },
        apexpulse: {
          category: "Mobile Application (iOS & Android)",
          title: "ApexPulse Telehealth & Vitals Tracker",
          metric: "4.9/5 Store Rating • 60,000+ Active Patients",
          challenge:
            "A healthcare network required a secure patient portal for remote monitoring and video consultations that complied strictly with HIPAA regulations without lagging on low-end mobile devices.",
          solution:
            "Engineered a cross-platform React Native mobile app featuring WebRTC peer-to-peer encrypted video calls, Bluetooth BLE pairing with standard pulse oximeters and blood pressure monitors, and automated e-prescriptions.",
          results:
            "Passed third-party HIPAA security penetration audits on first attempt. Achieved 100% store approvals on Apple App Store and Google Play within 5 business days.",
          techStack: [
            "React Native",
            "TypeScript",
            "WebRTC",
            "Bluetooth Low Energy",
            "Node.js",
            "PostgreSQL",
          ],
        },
        veloce: {
          category: "High-Performance Custom E-Commerce",
          title: "Veloce Atelier Luxury Flagship Store",
          metric: "+310% Conversion Rate • 99 Core Web Vitals",
          challenge:
            "A luxury fashion brand was burdened with a sluggish template e-commerce website with 6.2s load times, layout shifting, and high cart abandonment on mobile browsers.",
          solution:
            "Built a bespoke digital flagship store with pure modular vanilla JavaScript and modern CSS grid. Implemented instantaneous client-side transitions, headless Stripe checkout, 3D product previews, and global Cloudflare Edge caching.",
          results:
            "Mobile conversion rate surged by +310%. Lighthouse scores reached 99/100 across Performance, SEO, and Accessibility.",
          techStack: [
            "Modern Vanilla JS",
            "Vanilla CSS Tokens",
            "Stripe Headless API",
            "Cloudflare Workers",
            "HTML5 WCAG",
          ],
        },
        omnia: {
          category: "Intelligent Chatbots & WhatsApp Automation",
          title: "Omnia WhatsApp AI Customer Concierge",
          metric: "78% Automated Deflection • 24/7 Availability",
          challenge:
            "Customer support teams were overwhelmed with 8,000 daily tickets asking repetitious questions regarding parcel status, refund policies, and delivery scheduling across 4 languages.",
          solution:
            "Deployed an omnichannel intelligent bot integrated with the official Meta WhatsApp Cloud API and web live-chat. Includes natural language intent resolution, live CRM lookup, and seamless handoff to human support agents when needed.",
          results:
            "Automated 78% of tier-1 support tickets without human intervention. Customer satisfaction rating increased from 3.2 to 4.8 out of 5.",
          techStack: [
            "Node.js",
            "WhatsApp Cloud API",
            "Redis Queue",
            "NLP Pipeline",
            "PostgreSQL",
            "Docker",
          ],
        },
        finguard: {
          category: "Rescue & Modernization of AI Codebase",
          title: "FinGuard Legacy & AI Architecture Overhaul",
          metric: "4.8s → 0.4s (-91% Latency) • Zero Vulnerabilities",
          challenge:
            "The client used an experimental AI prompt generator to build their financial dashboard MVP. The code was unmaintainable, leaked sensitive session cookies, contained multiple XSS vulnerabilities, and crashed under 100 active connections.",
          solution:
            "Conducted an emergency security and performance audit. Stripped away 80% of hallucinated dependencies, re-implemented strict JWT token authentication, containerized the backend with Docker, and rebuilt the UI with clean semantic standards.",
          results:
            "Eliminated all OWASP vulnerabilities. Cut latency by 91% and enabled the company to successfully close a $3.5M seed funding round with full technical diligence approval.",
          techStack: [
            "TypeScript",
            "Express",
            "Docker",
            "Redis",
            "Jest Unit Tests",
            "Security Hardening",
          ],
        },
      },
      ar: {
        nexora: {
          category: "نظام ERP مخصص وأتمتة العمليات اللوجستية",
          title: "منظومة Nexora لإدارة الشحن والمخازن اللوجستية",
          metric: "+42% زيادة الكفاءة التشغيلية • صفر نفاد مخزون",
          challenge:
            "كانت شركة Nexora تدير 6 مستودعات إقليمية عبر ملفات إكسل متفرقة ومحادثات سلاك يدوية وتنسيق شحن غير مركزي، مما تسبب في أخطاء شحن متكررة وغرامات تأخير ورؤية إدارية منعدمة.",
          solution:
            "قمنا بهندسة وتسليم نظام ERP مخصص وجاهز للتشغيل في 10 أسابيع فقط. يشمل ميزات إعادة الطلب الآلي عند انخفاض المخزون، صلاحيات متعددة لمخلصي الجمارك، تتبع الحاويات عبر GPS، والربط التلقائي مع Stripe و QuickBooks.",
          results:
            "تقليص وقت معالجة الطلبات اليومية من 4.5 ساعة إلى 18 دقيقة فقط. توفير 2.4 مليون دولار من غرامات الشحن في العام الأول.",
          techStack: [
            "PostgreSQL",
            "Fastify",
            "TypeScript",
            "React",
            "Docker",
            "AWS ECS",
          ],
        },
        lumina: {
          category: "منصة ذكاء اصطناعي وبحث دلالي متقدم",
          title: "محرك Lumina للبحث والتحليل المالي الذكي",
          metric: "استجابة في 180 مللي ثانية • 500,000 وثيقة مفهرسة",
          challenge:
            "كان المحللون الماليون يقضون أكثر من 15 ساعة أسبوعياً في قراءة ملفات هيئات الأسواق المالية والتقارير التنظيمية الضخمة يدوياً لاستخراج عوامل المخاطر.",
          solution:
            "بناء بوابة بحث دلالي عبر متجهات pgvector مدمجة مع البحث النصي الهجين، وتوليد استجابات تدفقية فائقة السرعة مع استشهادات دقيقة بأرقام صفحات مستندات PDF الأصلية.",
          results:
            "تخفيض وقت أبحاث الامتثال بنسبة 75%. القدرة على استيعاب 10,000 استفسار متزامن بزمن استجابة أقل من 200 مللي ثانية.",
          techStack: [
            "Next.js",
            "Python FastAPI",
            "pgvector",
            "OpenAI API",
            "Redis",
            "CSS معماري",
          ],
        },
        apexpulse: {
          category: "تطبيق هاتف ذكي (iOS و Android)",
          title: "تطبيق ApexPulse للاستشارات والمتابعة الصحية",
          metric: "تقييم 4.9/5 • أكثر من 60,000 مريض نشط",
          challenge:
            "احتاجت شبكة عيادات طبية إلى بوابة للمرضى تتيح الاستشارات المرئية ومراقبة المؤشرات الحيوية بامتثال صارم لقوانين الخصوصية الطبية HIPAA وبكفاءة على كافة الهواتف.",
          solution:
            "تطوير تطبيق React Native يتميز بمكالمات مرئية مشفرة عبر WebRTC، والاقتران عبر البلوتوث بمقاييس النبض وضغط الدم، وإدارة الوصفات الدوائية إلكترونياً.",
          results:
            "اجتياز الفحص الأمني لشهادة HIPAA من المرة الأولى واعتماد ونشر التطبيق على App Store و Google Play خلال 5 أيام عمل فقط.",
          techStack: [
            "React Native",
            "TypeScript",
            "WebRTC",
            "Bluetooth BLE",
            "Node.js",
            "PostgreSQL",
          ],
        },
        veloce: {
          category: "تجارة إلكترونية مخصصة وفائقة السرعة",
          title: "المتجر الرقمي الفاخر Veloce Atelier",
          metric: "+310% ارتفاع معدل التحويل • 99 درجة Core Web Vitals",
          challenge:
            "عانى متجر أزياء فاخر من بطء التحميل (6.2 ثانية) ونسب ارتداد عالية ومشاكل عرض متكررة في شاشات الهواتف مع المنصات الجاهزة.",
          solution:
            "بناء متجر رقمي متكامل بكود JavaScript نقي ومعمارية CSS Grid الحديثة مع دفع فوري وتخزين سحابي على أطراف الشبكة عبر Cloudflare Edge.",
          results:
            "ارتفاع معدل إتمام الشراء بنسبة +310% وتحقيق تقييم 99/100 في معايير Lighthouse للأداء ومحركات البحث وسهولة الوصول.",
          techStack: [
            "Modern Vanilla JS",
            "Vanilla CSS Tokens",
            "Stripe Headless API",
            "Cloudflare Workers",
            "HTML5 WCAG",
          ],
        },
        omnia: {
          category: "روبوتات المحادثة وأتمتة واتساب",
          title: "مساعد Omnia الذكي عبر واتساب لخدمة العملاء",
          metric: "78% أتمتة الردود • خدمة مستمرة 24/7",
          challenge:
            "واجه فريق خدمة العملاء ضغطاً هائلاً عبر 8,000 تذكرة يومياً تتضمن استفسارات مكررة حول الشحن وسياسات الإرجاع عبر 4 لغات مختلفة.",
          solution:
            "إطلاق روبوت ذكي مدمج مع واجهة واتساب السحابية الرسمية WhatsApp Cloud API والدردشة بالموقع مع التعرف على النوايا وتكامل الـ CRM وتسليم الحالات لموظفين بشريين بسلاسة.",
          results:
            "أتمتة 78% من التذاكر دون تدخل بشري وارتفاع رضا العملاء من 3.2 إلى 4.8 من 5.",
          techStack: [
            "Node.js",
            "WhatsApp Cloud API",
            "Redis Queue",
            "NLP Pipeline",
            "PostgreSQL",
            "Docker",
          ],
        },
        finguard: {
          category: "إنقاذ وتحديث كود الذكاء الاصطناعي",
          title: "إنقاذ وتطوير المعمارية البرمجية لمنصة FinGuard",
          metric: "من 4.8 إلى 0.4 ثانية (-91% تأخير) • حماية كاملة",
          challenge:
            "استخدم العميل أداة ذكاء اصطناعي تجريبية لإنشاء لوحة تحكم مالية، مما أسفر عن كود هش يسرب الجلسات ومليء بثغرات XSS الأمنية ويتعطل عند 100 مستخدم متزامن.",
          solution:
            "إجراء تدقيق أمني فوري، إزالة 80% من التبعيات غير الضرورية، إعادة بناء التوثيق الأمني بـ JWT، تحزيم النظام عبر Docker، وإعادة بناء الواجهات بمعايير هندسية متينة.",
          results:
            "سد كافة الثغرات الأمنية، تقليص زمن الاستجابة بنسبة 91%، ونجاح الشركة في إغلاق جولة تمويل استثمارية بقيمة 3.5 مليون دولار بعد التدقيق التقني.",
          techStack: [
            "TypeScript",
            "Express",
            "Docker",
            "Redis",
            "Jest Unit Tests",
            "Security Hardening",
          ],
        },
      },
    };

    const init = () => {
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const filter = btn.getAttribute("data-filter");
          filterButtons.forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");
          filterCards(filter);
        });
      });

      wireDetailButtons();

      if (modalCloseBtn) modalCloseBtn.addEventListener("click", () => closeModal(false));
      if (modalBackdrop) modalBackdrop.addEventListener("click", () => closeModal(false));

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && !modal.hidden) {
          closeModal(false);
        }
      });
    };

    const wireDetailButtons = () => {
      document.querySelectorAll(".btn-card-detail").forEach((btn) => {
        btn.addEventListener("click", () => {
          const caseKey = btn.getAttribute("data-case");
          const lang = I18nController.getCurrentLang();
          const data =
            (modalData[lang] && modalData[lang][caseKey]) ||
            (modalData.en && modalData.en[caseKey]);
          if (data) {
            lastFocusedElement = btn;
            openModal(data);
          }
        });
      });
    };

    const filterCards = (filter) => {
      document.querySelectorAll(".portfolio-card").forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
          card.style.opacity = "0";
          card.style.transform = "translateY(12px)";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 30);
        } else {
          card.classList.add("hidden");
        }
      });
    };

    const openModal = (data) => {
      if (!modal || !modalBackdrop || !modalContentArea) return;

      const dict = I18nController.getDictionary();
      const modalLabels = dict.portfolio?.modal || {
        challengeTitle: "The Challenge",
        solutionTitle: "Our Engineered Solution",
        impactTitle: "Verified Outcome & Impact",
        techTitle: "Technology Stack Employed",
        ctaBtn: "Discuss a Similar Project →",
      };

      const techChipsHtml = data.techStack
        .map(
          (tech) =>
            `<span class="badge-chip"><bdi dir="ltr">${tech}</bdi></span>`,
        )
        .join("");

      modalContentArea.innerHTML = `
        <div class="modal-header-meta">
          <span class="modal-case-cat">${data.category}</span>
          <span class="modal-case-metric">${data.metric}</span>
        </div>
        <h2 class="modal-title" id="modal-case-title">${data.title}</h2>
        
        <div class="modal-block">
          <h3 class="modal-block-title">${modalLabels.challengeTitle}</h3>
          <p class="modal-block-text">${data.challenge}</p>
        </div>

        <div class="modal-block">
          <h3 class="modal-block-title">${modalLabels.solutionTitle}</h3>
          <p class="modal-block-text">${data.solution}</p>
        </div>

        <div class="modal-block">
          <h3 class="modal-block-title">${modalLabels.impactTitle}</h3>
          <p class="modal-block-text"><strong>${data.results}</strong></p>
        </div>

        <div class="modal-block">
          <h3 class="modal-block-title">${modalLabels.techTitle}</h3>
          <div class="modal-chips-grid">${techChipsHtml}</div>
        </div>

        <div style="margin-top: var(--space-6); text-align: end;">
          <a href="#contact" class="btn btn-primary btn-sm modal-cta-btn">${modalLabels.ctaBtn}</a>
        </div>
      `;

      const modalCta = modalContentArea.querySelector(".modal-cta-btn");
      if (modalCta) {
        modalCta.addEventListener("click", (e) => {
          e.preventDefault();
          closeModal(true); // Close modal and DO NOT refocus back to portfolio card

          // Pre-fill service & message and smooth-scroll to contact form
          if (typeof ContactFormController !== "undefined" && ContactFormController.prefillFromCaseStudy) {
            ContactFormController.prefillFromCaseStudy(data.title, data.category);
          } else {
            const contactSection = document.getElementById("contact");
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        });
      }

      modalBackdrop.hidden = false;
      modal.hidden = false;
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        modalBackdrop.classList.add("active");
        modal.classList.add("active");
        if (modalCloseBtn) modalCloseBtn.focus();
      }, 10);
    };

    const closeModal = (skipRefocus = false) => {
      if (!modal || !modalBackdrop) return;
      modalBackdrop.classList.remove("active");
      modal.classList.remove("active");
      document.body.style.overflow = "";

      setTimeout(() => {
        modalBackdrop.hidden = true;
        modal.hidden = true;
        if (!skipRefocus && lastFocusedElement) {
          lastFocusedElement.focus();
        }
      }, 250);
    };

    return { init, wireDetailButtons };
  })();

  /* ==========================================================================
     8. TESTIMONIALS CAROUSEL SLIDER
     ========================================================================== */
  const TestimonialsController = (() => {
    let track = document.getElementById("testimonial-track");
    let slides = document.querySelectorAll(".testimonial-slide");
    let prevBtn = document.getElementById("slider-prev");
    let nextBtn = document.getElementById("slider-next");
    let dots = document.querySelectorAll("#slider-dots .dot");

    let currentIndex = 0;
    let autoPlayTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    const init = () => {
      refreshElements();
      bindEvents();
      goToSlide(0);
      startTimer();
    };

    const refreshElements = () => {
      track = document.getElementById("testimonial-track");
      slides = document.querySelectorAll(".testimonial-slide");
      prevBtn = document.getElementById("slider-prev");
      nextBtn = document.getElementById("slider-next");
      dots = document.querySelectorAll("#slider-dots .dot");
    };

    const bindEvents = () => {
      if (prevBtn)
        prevBtn.addEventListener("click", () => {
          goToPrev();
          resetTimer();
        });
      if (nextBtn)
        nextBtn.addEventListener("click", () => {
          goToNext();
          resetTimer();
        });

      dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
          goToSlide(idx);
          resetTimer();
        });
      });

      if (track) {
        track.addEventListener(
          "touchstart",
          (e) => {
            touchStartX = e.changedTouches[0].screenX;
          },
          { passive: true },
        );

        track.addEventListener(
          "touchend",
          (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
          },
          { passive: true },
        );

        track.setAttribute("tabindex", "0");
        track.addEventListener("keydown", (e) => {
          if (e.key === "ArrowLeft") {
            goToPrev();
            resetTimer();
          }
          if (e.key === "ArrowRight") {
            goToNext();
            resetTimer();
          }
        });

        track.addEventListener("mouseenter", stopTimer);
        track.addEventListener("mouseleave", startTimer);
      }
    };

    const goToSlide = (index) => {
      refreshElements();
      if (!slides.length || !track) return;

      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      slides.forEach((s, idx) => {
        const isActive = idx === currentIndex;
        s.classList.toggle("active", isActive);
        s.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      dots.forEach((d, idx) => {
        const isActive = idx === currentIndex;
        d.classList.toggle("active", isActive);
        d.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    };

    const goToNext = () => goToSlide(currentIndex + 1);
    const goToPrev = () => goToSlide(currentIndex - 1);

    const handleSwipe = () => {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goToNext();
        else goToPrev();
        resetTimer();
      }
    };

    const startTimer = () => {
      stopTimer();
      autoPlayTimer = setInterval(goToNext, 7000);
    };

    const stopTimer = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    const resetTimer = () => {
      stopTimer();
      startTimer();
    };

    const refreshSlider = () => {
      refreshElements();
      bindEvents();
      goToSlide(currentIndex);
    };

    return { init, refreshSlider };
  })();

  /* ==========================================================================
     9. FAQ ACCORDION CONTROLLER
     ========================================================================== */
  const FaqController = (() => {
    const init = () => {
      rebind();
    };

    const rebind = () => {
      const accordionHeaders = document.querySelectorAll(".accordion-header");
      accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
          const isExpanded = header.getAttribute("aria-expanded") === "true";
          const targetId = header.getAttribute("aria-controls");
          const content = document.getElementById(targetId);

          accordionHeaders.forEach((otherHeader) => {
            if (
              otherHeader !== header &&
              otherHeader.getAttribute("aria-expanded") === "true"
            ) {
              otherHeader.setAttribute("aria-expanded", "false");
              const otherContent = document.getElementById(
                otherHeader.getAttribute("aria-controls"),
              );
              if (otherContent) otherContent.hidden = true;
            }
          });

          header.setAttribute("aria-expanded", !isExpanded);
          if (content) content.hidden = isExpanded;
        });
      });
    };

    return { init, rebind };
  })();

  /* ==========================================================================
     10. CONTACT FORM CONTROLLER (FORMSUBMIT AJAX, VALIDATION & LOCALIZED STATES)
     ========================================================================== */
  const ContactFormController = (() => {
    /* CHANGE 1 & 3: FormSubmit delivery to mohamedalnajjar204@gmail.com */
    const form =
      document.getElementById("contactForm") ||
      document.getElementById("consultation-form");
    const submitBtn = document.getElementById("form-submit-btn");
    const successBanner =
      document.getElementById("formSuccess") ||
      document.getElementById("form-success-banner");
    const errorBanner = document.getElementById("formError");
    const resetBtn = document.getElementById("btn-reset-form");
    const serviceSelect = document.getElementById("form-service");
    const budgetSelect = document.getElementById("form-budget");
    const customBudgetContainer = document.getElementById(
      "custom-budget-container",
    );
    const customBudgetInput = document.getElementById("form-custom-budget");
    const customBudgetError = document.getElementById("custom-budget-error");
    const companyInput = document.getElementById("form-company");

    const nameInput = document.getElementById("form-name");
    const emailInput = document.getElementById("form-email");
    const messageInput = document.getElementById("form-message");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const serviceError = document.getElementById("service-error");
    const messageError = document.getElementById("message-error");

    const honeypotInput = form
      ? form.querySelector('input[name="website"]')
      : null;

    const EMAIL_REGEX =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    const FORMSUBMIT_ENDPOINT =
      "https://formsubmit.co/ajax/mohamedalnajjar204@gmail.com";

    /* --------------------------------------------------------------------------
       ALTERNATIVE 1 (No-JS Mailto Fallback):
       In index.html, replace the form action with:
       <form action="mailto:mohamedalnajjar204@gmail.com" method="POST" enctype="text/plain">
       
       ALTERNATIVE 2 (EmailJS Integration Snippet):
       To switch from FormSubmit to EmailJS:
       1. Include EmailJS SDK in index.html:
          <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
       2. Initialize with your public key:
          emailjs.init('YOUR_PUBLIC_KEY');
       3. Replace fetch() with:
          emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: payload.name,
            from_email: payload.email,
            company: payload.company,
            service: payload.service,
            budget: payload.budget,
            message: payload.message,
            reply_to: payload.email
          }).then(() => { ...handle success... }).catch(() => { ...handle error... });
       -------------------------------------------------------------------------- */

    // Client-side sanitization to neutralize potential HTML injection tags
    const sanitizeInput = (val) => {
      if (typeof val !== "string") return "";
      return val.trim().replace(/[<>]/g, "");
    };

    const handleBudgetChange = () => {
      if (!budgetSelect) return;
      const isCustom = budgetSelect.value === "custom";
      if (customBudgetContainer) {
        if (isCustom) {
          customBudgetContainer.hidden = false;
          if (customBudgetInput) {
            customBudgetInput.focus();
          }
        } else {
          customBudgetContainer.hidden = true;
          if (customBudgetInput) {
            customBudgetInput.value = "";
            customBudgetInput.removeAttribute("aria-invalid");
            customBudgetInput.removeAttribute("aria-describedby");
          }
          if (customBudgetError) {
            customBudgetError.textContent = "";
          }
        }
      }
    };

    const init = () => {
      if (!form) return;

      if (nameInput)
        nameInput.addEventListener("input", () =>
          validateField(nameInput, nameError, checkName),
        );
      if (emailInput)
        emailInput.addEventListener("input", () =>
          validateField(emailInput, emailError, checkEmail),
        );
      if (serviceSelect)
        serviceSelect.addEventListener("change", () =>
          validateField(serviceSelect, serviceError, checkService),
        );
      if (budgetSelect) {
        budgetSelect.addEventListener("change", handleBudgetChange);
      }
      if (customBudgetInput) {
        customBudgetInput.addEventListener("input", () => {
          if (budgetSelect && budgetSelect.value === "custom") {
            validateField(
              customBudgetInput,
              customBudgetError,
              checkCustomBudget,
            );
          }
        });
      }
      if (messageInput)
        messageInput.addEventListener("input", () =>
          validateField(messageInput, messageError, checkMessage),
        );

      setupPreFillTriggers();

      form.addEventListener("submit", handleSubmit);
      form.onsubmit = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        handleSubmit(e);
        return false;
      };

      /* CHANGE 3: Reset button handler resets form, hides success banner, and restores clean form */
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (successBanner) successBanner.hidden = true;
          if (errorBanner) {
            errorBanner.hidden = true;
            errorBanner.classList.remove("is-warning");
          }
          if (customBudgetContainer) {
            customBudgetContainer.hidden = true;
          }
          if (customBudgetInput) {
            customBudgetInput.value = "";
            customBudgetInput.removeAttribute("aria-invalid");
            customBudgetInput.removeAttribute("aria-describedby");
          }
          if (customBudgetError) {
            customBudgetError.textContent = "";
          }
          form.hidden = false;
          form.reset();

          [nameError, emailError, serviceError, messageError].forEach((el) => {
            if (el) el.textContent = "";
          });
          [nameInput, emailInput, serviceSelect, messageInput].forEach((el) => {
            if (el) {
              el.removeAttribute("aria-invalid");
              el.removeAttribute("aria-describedby");
            }
          });

          if (nameInput) nameInput.focus();
        });
      }
    };

    const setupPreFillTriggers = () => {
      document.querySelectorAll("[data-prefill]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const serviceName = btn.getAttribute("data-prefill");
          setSelectValue(serviceName);
        });
      });

      document.querySelectorAll("[data-tier]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const tierName = btn.getAttribute("data-tier");
          if (tierName.includes("Dedicated") || tierName.includes("مخصص")) {
            setSelectValue("Dedicated Agile Team");
          } else if (
            tierName.includes("Modernization") ||
            tierName.includes("صيانة")
          ) {
            setSelectValue("Legacy Modernization");
          } else {
            setSelectValue("Custom Websites");
          }
        });
      });
    };

    const setSelectValue = (val) => {
      if (!serviceSelect) return;
      for (let option of serviceSelect.options) {
        if (option.value.toLowerCase() === val.toLowerCase()) {
          option.selected = true;
          validateField(serviceSelect, serviceError, checkService);
          break;
        }
      }
    };

    const checkName = (val) => {
      const dict = I18nController.getDictionary();
      return val.trim().length >= 2
        ? null
        : dict.errors?.nameRequired ||
            "Please enter your full name (minimum 2 characters).";
    };

    const checkEmail = (val) => {
      const dict = I18nController.getDictionary();
      return EMAIL_REGEX.test(val.trim())
        ? null
        : dict.errors?.emailInvalid ||
            "Please enter a valid work email address.";
    };

    const checkService = (val) => {
      const dict = I18nController.getDictionary();
      return val
        ? null
        : dict.errors?.serviceRequired ||
            "Please select the primary service needed.";
    };

    const checkCustomBudget = (val) => {
      const dict = I18nController.getDictionary();
      return val && val.trim().length > 0
        ? null
        : dict.errors?.customBudgetRequired ||
            "Please enter your estimated budget for the project.";
    };

    const checkMessage = (val) => {
      const dict = I18nController.getDictionary();
      return val.trim().length >= 20
        ? null
        : dict.errors?.messageRequired ||
            "Please describe your project scope (minimum 20 characters).";
    };

    const validateField = (inputEl, errorEl, validatorFn) => {
      const errorMsg = validatorFn(inputEl.value);
      if (errorMsg) {
        inputEl.setAttribute("aria-invalid", "true");
        if (errorEl) {
          errorEl.textContent = errorMsg;
          inputEl.setAttribute("aria-describedby", errorEl.getAttribute("id"));
        }
        return false;
      } else {
        inputEl.removeAttribute("aria-invalid");
        if (errorEl) {
          errorEl.textContent = "";
          inputEl.removeAttribute("aria-describedby");
        }
        return true;
      }
    };

    const handleSubmit = async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (errorBanner) {
        errorBanner.hidden = true;
        errorBanner.classList.remove("is-warning");
      }

      const isNameValid = validateField(nameInput, nameError, checkName);
      const isEmailValid = validateField(emailInput, emailError, checkEmail);
      const isServiceValid = validateField(
        serviceSelect,
        serviceError,
        checkService,
      );
      const isCustomBudgetValid =
        budgetSelect && budgetSelect.value === "custom"
          ? validateField(
              customBudgetInput,
              customBudgetError,
              checkCustomBudget,
            )
          : true;
      const isMessageValid = validateField(
        messageInput,
        messageError,
        checkMessage,
      );

      if (
        !isNameValid ||
        !isEmailValid ||
        !isServiceValid ||
        !isCustomBudgetValid ||
        !isMessageValid
      ) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Honeypot spam trap: if bot filled hidden field, simulate success silently without delivering spam
      if (honeypotInput && honeypotInput.value.trim() !== "") {
        console.warn("Spam submission trapped by honeypot.");
        form.hidden = true;
        if (successBanner) {
          successBanner.hidden = false;
          successBanner.focus();
        }
        return;
      }

      setLoading(true);

      let budgetVal = "";
      if (budgetSelect) {
        if (budgetSelect.value === "custom") {
          const rawCustom = customBudgetInput
            ? customBudgetInput.value.trim()
            : "";
          const isAr = I18nController.getCurrentLang() === "ar";
          let formatted = rawCustom;
          if (
            formatted &&
            !formatted.includes("$") &&
            !formatted.includes("USD") &&
            !formatted.includes("دولار")
          ) {
            formatted = `$${formatted}`;
          }
          budgetVal = formatted
            ? `${formatted} (${isAr ? "ميزانية مخصصة" : "Custom Budget"})`
            : isAr
              ? "ميزانية مخصصة"
              : "Custom Budget";
        } else {
          budgetVal = budgetSelect.value;
        }
      }

      const payload = {
        name: sanitizeInput(nameInput.value),
        email: sanitizeInput(emailInput.value),
        company: sanitizeInput(companyInput ? companyInput.value : ""),
        service: sanitizeInput(serviceSelect ? serviceSelect.value : ""),
        budget: sanitizeInput(budgetVal),
        message: sanitizeInput(messageInput.value),
        _subject: "New Consultation Request — Website Contact Form",
        _template: "table",
        _captcha: "false",
      };

      try {
        /* CHANGE 1: FormSubmit AJAX POST fetch request */
        const response = await fetch(FORMSUBMIT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        setLoading(false);

        const isSuccess =
          response.ok &&
          (data.success === "true" ||
            data.success === true ||
            (data.message &&
              data.message.toLowerCase().includes("successfully")));
        const isActivationRequired =
          (data.message && data.message.toLowerCase().includes("activation")) ||
          (!isSuccess &&
            data.success === "false" &&
            data.message &&
            data.message.includes("Activate Form"));

        if (isSuccess) {
          /* CHANGE 3: Hide form, reveal success feedback, manage focus and polite a11y announcement */
          form.hidden = true;
          if (successBanner) {
            successBanner.hidden = false;
            successBanner.setAttribute("tabindex", "-1");
            successBanner.focus();

            const announcer = document.getElementById("a11y-announcer");
            const dict = I18nController.getDictionary();
            if (announcer) {
              announcer.textContent =
                dict.contact?.successTitle ||
                "Your request has been successfully received!";
            }
          }
        } else if (isActivationRequired) {
          /* Inform owner if form is pending FormSubmit email confirmation */
          if (errorBanner) {
            errorBanner.classList.add("is-warning");
            errorBanner.hidden = false;
            errorBanner.setAttribute("tabindex", "-1");
            errorBanner.focus();

            const dict = I18nController.getDictionary();
            const errorText = document.getElementById("form-error-text");
            if (errorText) {
              errorText.textContent =
                dict.contact?.activationNotice || data.message;
            }
            const announcer = document.getElementById("a11y-announcer");
            if (announcer) {
              announcer.textContent =
                dict.contact?.activationNotice || data.message;
            }
          }
        } else {
          throw new Error(
            data.message || "FormSubmit request returned non-OK status",
          );
        }
      } catch (err) {
        console.error("Contact form submission error:", err);
        setLoading(false);

        /* CHANGE 3: Display localized error state without losing user input */
        if (errorBanner) {
          errorBanner.classList.remove("is-warning");
          errorBanner.hidden = false;
          errorBanner.setAttribute("tabindex", "-1");
          errorBanner.focus();

          const announcer = document.getElementById("a11y-announcer");
          const dict = I18nController.getDictionary();
          const errorText = document.getElementById("form-error-text");
          if (errorText) {
            errorText.innerHTML =
              dict.contact?.errorMessageHTML ||
              dict.contact?.errorMessage ||
              'Something went wrong — please try again or email us directly at <a href="mailto:mohamedalnajjar204@gmail.com"><bdi dir="ltr">mohamedalnajjar204@gmail.com</bdi></a>';
          }
          if (announcer) {
            announcer.textContent =
              dict.contact?.errorMessage ||
              "Something went wrong — please try again.";
          }
        }
      }
    };

    const setLoading = (isLoading) => {
      if (!submitBtn) return;
      const btnText = submitBtn.querySelector(".btn-text");
      const spinner = submitBtn.querySelector(".btn-spinner");
      const dict = I18nController.getDictionary();

      submitBtn.disabled = isLoading;
      if (isLoading) {
        if (btnText)
          btnText.textContent =
            dict.contact?.submittingBtn || "Submitting your brief...";
        if (spinner) spinner.hidden = false;
      } else {
        if (btnText)
          btnText.textContent =
            dict.contact?.submitBtn || "Submit Request for Free Consultation";
        if (spinner) spinner.hidden = true;
      }
    };

    const updateServiceOptions = (dict) => {
      if (!serviceSelect) return;
      const placeholderOpt = serviceSelect.querySelector('option[value=""]');
      if (placeholderOpt && dict.contact?.servicePlaceholder) {
        placeholderOpt.textContent = dict.contact.servicePlaceholder;
      }
    };

    const updateBudgetOptions = (dict) => {
      if (!budgetSelect) return;
      const opts = dict.contact?.budgetOptions;
      if (opts) {
        const opt1 = budgetSelect.querySelector('option[value="$100 - $500"]');
        if (opt1 && opts.tier1) opt1.textContent = opts.tier1;
        const opt2 = budgetSelect.querySelector('option[value="$500 - $1,500"]');
        if (opt2 && opts.tier2) opt2.textContent = opts.tier2;
        const opt3 = budgetSelect.querySelector('option[value="$1,500 - $3,000"]');
        if (opt3 && opts.tier3) opt3.textContent = opts.tier3;
        const opt4 = budgetSelect.querySelector('option[value="$3,000 - $6,000"]');
        if (opt4 && opts.tier4) opt4.textContent = opts.tier4;
        const opt5 = budgetSelect.querySelector('option[value="$6,000 - $10,000"]');
        if (opt5 && opts.tier5) opt5.textContent = opts.tier5;
        const opt6 = budgetSelect.querySelector('option[value="$10,000+"]');
        if (opt6 && opts.tier6) opt6.textContent = opts.tier6;
        const optCustom = budgetSelect.querySelector('option[value="custom"]');
        if (optCustom && opts.custom) optCustom.textContent = opts.custom;
      }
      const placeholderOpt = budgetSelect.querySelector('option[value=""]');
      if (placeholderOpt && dict.contact?.budgetPlaceholder) {
        placeholderOpt.textContent = dict.contact.budgetPlaceholder;
      }
    };

    const prefillFromCaseStudy = (projectTitle, category) => {
      const catLower = (category || "").toLowerCase();
      const titleLower = (projectTitle || "").toLowerCase();

      let targetService = "Custom Websites";
      if (
        catLower.includes("ai") ||
        catLower.includes("ذكاء") ||
        titleLower.includes("lumina") ||
        titleLower.includes("ai")
      ) {
        targetService = "AI-Powered Websites";
      } else if (
        catLower.includes("mobile") ||
        catLower.includes("تطبيقات") ||
        catLower.includes("logistics")
      ) {
        targetService = "Mobile Applications";
      } else if (
        catLower.includes("erp") ||
        catLower.includes("saas") ||
        catLower.includes("healthcare") ||
        catLower.includes("إدارة")
      ) {
        targetService = "ERP Systems";
      } else if (
        catLower.includes("modernization") ||
        catLower.includes("صيانة") ||
        catLower.includes("تحديث")
      ) {
        targetService = "Legacy Modernization";
      }

      setSelectValue(targetService);

      // Pre-fill message field with context from the case study
      if (messageInput) {
        const isArabic =
          (I18nController.getCurrentLang &&
            I18nController.getCurrentLang() === "ar") ||
          document.documentElement.dir === "rtl";
        if (isArabic) {
          messageInput.value = `أود مناقشة وبناء حل برمجي ومواصفات تقنية مشابهة لمشروع "${projectTitle}" لصالح شركتنا.`;
        } else {
          messageInput.value = `I would like to discuss building an engineering solution similar to "${projectTitle}" for our company.`;
        }
        validateField(messageInput, messageError, checkMessage);
      }

      // Smooth scroll to the contact section with header offset
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Focus name input after scroll completes
      setTimeout(() => {
        if (nameInput) {
          nameInput.focus();
        }
      }, 450);
    };

    return {
      init,
      setupPreFillTriggers,
      updateServiceOptions,
      updateBudgetOptions,
      setSelectValue,
      prefillFromCaseStudy,
    };
  })();

  /* ==========================================================================
     11. GENERAL UTILITIES (SCROLL REVEAL, BACK TO TOP, YEAR)
     ========================================================================== */
  const GeneralController = (() => {
    const initScrollReveal = () => {
      const revealElements = document.querySelectorAll(".reveal");
      if (!revealElements.length) return;

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );

      revealElements.forEach((el) => observer.observe(el));
    };

    const initBackToTop = () => {
      const backBtn = document.getElementById("back-to-top");
      if (!backBtn) return;

      backBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    };

    const initCurrentYear = () => {
      const yearEl = document.getElementById("current-year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    };

    const init = () => {
      initScrollReveal();
      initBackToTop();
      initCurrentYear();
    };

    return { init };
  })();

  /* ==========================================================================
     INITIALIZE ALL MODULES
     ========================================================================== */
  I18nController.init();
  ThemeController.init();
  NavigationController.init();
  CounterController.init();
  ComparisonSliderController.init();
  PortfolioController.init();
  TestimonialsController.init();
  FaqController.init();
  ContactFormController.init();
  GeneralController.init();
});
