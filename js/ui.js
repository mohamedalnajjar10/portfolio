/**
 * GloryTech Showcase - UI Controls Module
 * Theme, Navigation, Before/After Slider, Portfolio Modals, Testimonials, FAQ
 * Exports: window.ThemeController, window.NavigationController, window.ComparisonSliderController,
 *          window.PortfolioController, window.TestimonialsController, window.FaqController
 */

"use strict";

/* ==========================================================================
   2. THEME CONTROLLER
   ========================================================================== */
const ThemeController = window.ThemeController = (() => {
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
const NavigationController = window.NavigationController = (() => {
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
   5. BEFORE / AFTER COMPARISON SLIDER (BIDIRECTIONAL LTR & RTL)
   ========================================================================== */
const ComparisonSliderController = window.ComparisonSliderController = (() => {
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
   7. FILTERABLE PORTFOLIO & CASE STUDY MODAL CONTROLLER
   ========================================================================== */
const PortfolioController = window.PortfolioController = (() => {
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
const TestimonialsController = window.TestimonialsController = (() => {
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
const FaqController = window.FaqController = (() => {
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

