# GloryTech — Showcase Website

> Complete, production-ready bilingual (EN/AR) static service showcase website for GloryTech software engineering agency.

---

## Overview

A single-page marketing website built with **vanilla HTML5, CSS3, and ES6+ JavaScript** — no frameworks, no bundlers, no build step required. Features bilingual internationalization (English & Arabic with full RTL support), dark/light theme persistence, animated stat counters, filterable portfolio, testimonials carousel, FAQ accordion, and a validated contact form with FormSubmit AJAX delivery.

---

## Quick Start

### Option A — Open Directly (Zero Setup)

Simply open `index.html` in any modern browser. All assets use relative paths and load without a server.

```
# Windows
start index.html

# macOS
open index.html
```

### Option B — Local Node.js Server (Recommended for Contact Form)

The included `server.js` provides a local HTTP server with a Nodemailer-powered contact API endpoint.

```bash
# 1. Install dependencies
npm install

# 2. Configure email delivery (optional)
#    Copy .env.example to .env and add your Gmail App Password
cp .env.example .env

# 3. Start the server
npm start
#    → http://localhost:8085/
```

---

## File Structure

```
project-root/
├── index.html                          Single-page entry (all sections)
├── favicon.ico                         Browser tab icon
├── robots.txt                          Search engine crawl directives
├── sitemap.xml                         SEO sitemap (3 URLs)
├── README.md                           This file
├── PATH-MAP.md                         File location mapping reference
├── server.js                           Node.js HTTP server + Nodemailer API
├── package.json                        npm manifest
├── .env                                SMTP credentials (gitignored)
├── .env.example                        Template for .env setup
├── .gitignore                          Git ignore rules
│
├── css/
│   ├── styles.css                      Design tokens, reset, layout, all components
│   ├── themes.css                      Dark/light theme CSS custom properties
│   └── rtl.css                         RTL layout & Arabic typography overrides
│
├── js/
│   ├── translations-en.js              English translation dictionary
│   ├── translations-ar.js              Arabic translation dictionary
│   ├── animations.js                   IntersectionObserver reveals & counters
│   ├── ui.js                           Navigation, sliders, modals, accordion, theme
│   ├── form.js                         Contact form validation & FormSubmit AJAX
│   ├── i18n.js                         Language switching & dynamic content engine
│   └── script.js                       Main orchestrator (DOMContentLoaded init)
│
└── assets/
    ├── img/
    │   ├── hero/                       Hero section images (add here)
    │   ├── services/                   Service card images/icons (add here)
    │   ├── portfolio/                  Portfolio/case study screenshots (add here)
    │   ├── testimonials/               Client avatar photos (add here)
    │   └── logo/
    │       └── logo.svg                Brand logo (SVG)
    ├── svg/                            Standalone SVG icons (add here)
    ├── fonts/                          Self-hosted @font-face files (add here)
    └── docs/
        ├── privacy-policy.html         Privacy Policy legal page
        └── terms.html                  Terms of Service legal page
```

---

## File Responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Single HTML entry point. Contains all semantic sections (hero, why-us, services, rescue, process, portfolio, tech-stack, testimonials, pricing, FAQ, contact, footer), SEO metadata, JSON-LD structured data, and script/style includes. |
| `css/styles.css` | Global design system: CSS custom properties (tokens), CSS reset, layout grid, and all component styles. Loaded first in the cascade. |
| `css/themes.css` | Dark and light theme variable overrides via `[data-theme="dark"]` and `[data-theme="light"]` selectors. |
| `css/rtl.css` | RTL layout overrides triggered by `[dir="rtl"]`. Arabic font family assignments (Cairo, IBM Plex Sans Arabic). |
| `js/translations-en.js` | Defines `window.TRANSLATIONS_EN` — all English UI strings, service descriptions, portfolio data, FAQ items, pricing tiers. |
| `js/translations-ar.js` | Defines `window.TRANSLATIONS_AR` — complete Arabic mirror of all translation keys. |
| `js/animations.js` | `IntersectionObserver`-based scroll reveal animations and animated stat counter logic. Exports `window.CounterController`. |
| `js/ui.js` | Navigation (sticky header, mobile drawer, active link tracking), comparison slider, testimonial carousel, FAQ accordion, theme toggle with `localStorage`, portfolio filter, case study modal. Exports multiple controllers. |
| `js/form.js` | Contact form real-time validation, honeypot anti-spam, custom budget field toggle, FormSubmit AJAX POST, success/error banner states. Exports `window.ContactFormController`. |
| `js/i18n.js` | Language detection (`localStorage` / `?lang=` param), DOM translation via `data-i18n` attributes, dynamic section rendering (services grid, process timeline, portfolio cards, pricing cards, FAQ accordion, testimonials). Exports `window.I18nController`. |
| `js/script.js` | Main orchestrator. On `DOMContentLoaded`, initializes all controllers in dependency-safe order. |
| `server.js` | Node.js HTTP server. Serves static files and handles `POST /api/contact` with Nodemailer email dispatch. |

---

## Script Load Order

Scripts are loaded with `defer` in `index.html` in this exact order:

```
1. js/translations-en.js    ← Translation dictionaries (no dependencies)
2. js/translations-ar.js    ← Must load before i18n.js
3. js/animations.js          ← IntersectionObserver setup (standalone)
4. js/ui.js                  ← UI controllers (standalone)
5. js/form.js                ← Form controller (standalone)
6. js/i18n.js                ← i18n engine (reads window.TRANSLATIONS_EN/AR)
7. js/script.js              ← Orchestrator (calls .init() on all controllers)
```

> **Critical**: Translation files (#1–2) must load before `i18n.js` (#6) since `i18n.js` reads `window.TRANSLATIONS_EN` and `window.TRANSLATIONS_AR` at initialization.

---

## CSS Load Order

```
1. css/styles.css     ← Tokens, reset, layout, all components
2. css/themes.css     ← Theme variable overrides (dark/light)
3. css/rtl.css        ← RTL overrides (must cascade after base styles)
```

---

## How to Add New Content

### Add a New Service

1. Open `js/translations-en.js` → find `services.items` array → add a new object:
   ```js
   {
     icon: "svg-markup-string",
     title: "Your Service Title",
     subtitle: "Short tagline",
     description: "Detailed description...",
     features: ["Feature 1", "Feature 2", "Feature 3"],
     prefill: "Service Name for Form"
   }
   ```
2. Add the same entry (translated) at the same index in `js/translations-ar.js` → `services.items`.
3. The service card is rendered automatically by `i18n.js`.

### Add a New Portfolio / Case Study

1. Open `js/translations-en.js` → find `portfolio.projects` array → add a new object with:
   - `title`, `category` (filter tag), `tags[]`, `challenge`, `solution`, `results`, `stats[]`, `colorAccent`
2. Mirror the entry in `js/translations-ar.js`.
3. Update the filter button count in `index.html` if needed.

### Add a New Translation String

1. Add the key in both `js/translations-en.js` and `js/translations-ar.js` under the same nested path.
2. Reference it in HTML using `data-i18n="your.key.path"`.
3. For `aria-label` translations, use `data-i18n-aria-label="your.key.path"`.
4. For `placeholder` translations, use `data-i18n-placeholder="your.key.path"`.

### Add a New FAQ Item

1. Open `js/translations-en.js` → find `faq.items` array → add `{ question: "...", answer: "..." }`.
2. Mirror in `js/translations-ar.js`.
3. Rendered automatically by `i18n.js`.

---

## Contact Form Delivery

The contact form uses **two delivery channels**:

| Channel | Mechanism | Configuration |
|---|---|---|
| **FormSubmit (Primary)** | Client-side AJAX POST to `https://formsubmit.co/ajax/mohamedalnajjar204@gmail.com` | Defined in `js/form.js` line 47–48 |
| **Nodemailer (Server)** | Server-side POST to `/api/contact` via `server.js` | SMTP credentials in `.env` |

The HTML form's `action` attribute targets FormSubmit. The form's `onsubmit="event.preventDefault()"` ensures JS handles submission.

---

## Key External Links

| Link | URL | Used In |
|---|---|---|
| WhatsApp | `https://wa.me/201228635405` | Contact section, mobile drawer |
| Phone | `tel:+201228635405` | Contact section, footer |
| Email | `mailto:mohamedalnajjar204@gmail.com` | Contact section, footer, error banners, legal pages |

---

## Deployment Notes

### Static Hosting (Netlify, Vercel, GitHub Pages, Cloudflare Pages)

1. Deploy the entire project root as-is.
2. All paths are **relative** (`css/styles.css`, not `/css/styles.css`), so the site works from any subdirectory or domain root.
3. The `server.js` / Node.js backend is **not required** for static deployment — the FormSubmit AJAX channel handles contact form delivery client-side.

### Node.js Hosting (VPS, Railway, Render)

1. `npm install` → `npm start`
2. Configure `.env` with valid Gmail App Password for Nodemailer delivery.
3. Server listens on port `8085` by default (configurable via `PORT` env var).

### SEO Files

- `robots.txt` — allows all crawlers, points to sitemap
- `sitemap.xml` — lists homepage + privacy policy + terms of service
- JSON-LD structured data is embedded in `index.html` `<head>`

---

## License

ISC
