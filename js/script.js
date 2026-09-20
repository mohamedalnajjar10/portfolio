/**
 * ============================================================================
 * GloryTech Showcase Website - Main Orchestrator
 * Orchestrates and initializes all modular controllers upon DOMContentLoaded.
 * Load order: translations -> animations -> ui -> form -> i18n -> script
 * ============================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* Initialize all modules in strict dependency-safe sequence */
  if (window.I18nController) window.I18nController.init();
  if (window.ThemeController) window.ThemeController.init();
  if (window.NavigationController) window.NavigationController.init();
  if (window.CounterController) window.CounterController.init();
  if (window.ComparisonSliderController) window.ComparisonSliderController.init();
  if (window.PortfolioController) window.PortfolioController.init();
  if (window.TestimonialsController) window.TestimonialsController.init();
  if (window.FaqController) window.FaqController.init();
  if (window.ContactFormController) window.ContactFormController.init();
  if (window.GeneralController) window.GeneralController.init();
});
