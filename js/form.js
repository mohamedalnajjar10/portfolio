/**
 * GloryTech Showcase - Contact Form & Validation Module
 * Nodemailer API submission, Real-time Validation, Localized Feedback
 * Exports: window.ContactFormController
 */

"use strict";

/* ==========================================================================
   10. CONTACT FORM CONTROLLER (NODEMAILER API, VALIDATION & LOCALIZED STATES)
   ========================================================================== */
const ContactFormController = window.ContactFormController = (() => {
  /* Direct Nodemailer delivery to mohamedalnajjar204@gmail.com via /api/contact */
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

  // Endpoint resolver: targets local /api/contact (or absolute URL if previewed on LiveServer/file)
  const getContactApiEndpoint = () => {
    if (
      typeof window !== "undefined" &&
      window.location &&
      (window.location.protocol === "http:" || window.location.protocol === "https:")
    ) {
      if (window.location.port === "8085" || !window.location.port) {
        return "/api/contact";
      }
    }
    return "http://localhost:8085/api/contact";
  };

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
      website: honeypotInput ? honeypotInput.value : "",
    };

    try {
      /* Direct Nodemailer API fetch request */
      const endpoint = getContactApiEndpoint();
      const response = await fetch(endpoint, {
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
        (data.success === true ||
          data.success === "true" ||
          (data.message &&
            data.message.toLowerCase().includes("successfully")));

      if (isSuccess) {
        /* Hide form, reveal success feedback, manage focus and polite a11y announcement */
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
      } else {
        throw new Error(
          data.message || "Contact API returned non-OK status",
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

