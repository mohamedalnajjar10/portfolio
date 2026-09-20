/**
 * GloryTech Showcase - Internationalization & Dynamic Content Module
 * Bilingual EN/AR switching, dynamic DOM translation, metadata update
 * Exports: window.DynamicContentController, window.I18nController
 */

"use strict";

/* ==========================================================================
   6. DYNAMIC CONTENT CONTROLLER (SERVICES, PROCESS, PORTFOLIO, ETC.)
   ========================================================================== */
const DynamicContentController = window.DynamicContentController = (() => {
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
   1. i18n CONTROLLER (INTERNATIONALIZATION)
   ========================================================================== */
const I18nController = window.I18nController = (() => {
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

