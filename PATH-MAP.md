# PATH-MAP.md — File Location Reference

> Complete before → after mapping for the GloryTech codebase reorganization.
> Generated: 2026-09-20

---

## Path Convention

**Relative paths from project root** are used throughout all HTML, CSS, and JS files. This ensures the site works when opened directly via `file://` protocol (double-click `index.html`) without requiring a local web server.

Legal pages (`assets/docs/*.html`) use `../../` relative paths to reference root-level resources (CSS, favicon).

---

## File Mapping Table

| # | Current Path | Target Path | Status | Notes |
|---|---|---|---|---|
| 1 | `index.html` | `index.html` | ✅ UNCHANGED | Single-page entry |
| 2 | `favicon.ico` | `favicon.ico` | ✅ UNCHANGED | |
| 3 | `robots.txt` | `robots.txt` | ✅ UNCHANGED | |
| 4 | `sitemap.xml` | `sitemap.xml` | ✅ UNCHANGED | |
| 5 | `server.js` | `server.js` | ✅ UNCHANGED | Node.js server |
| 6 | `package.json` | `package.json` | ✅ UNCHANGED | |
| 7 | `.env` | `.env` | ✅ UNCHANGED | Gitignored |
| 8 | `.env.example` | `.env.example` | ✅ UNCHANGED | |
| 9 | `.gitignore` | `.gitignore` | ✅ UNCHANGED | |
| 10 | `css/styles.css` | `css/styles.css` | ✅ UNCHANGED | Global styles |
| 11 | `css/themes.css` | `css/themes.css` | ✅ UNCHANGED | Theme variables |
| 12 | `css/rtl.css` | `css/rtl.css` | ✅ UNCHANGED | RTL overrides |
| 13 | `js/script.js` | `js/script.js` | ✅ UNCHANGED | Main orchestrator |
| 14 | `js/i18n.js` | `js/i18n.js` | ✅ UNCHANGED | Language engine |
| 15 | `js/translations-en.js` | `js/translations-en.js` | ✅ UNCHANGED | EN dictionary |
| 16 | `js/translations-ar.js` | `js/translations-ar.js` | ✅ UNCHANGED | AR dictionary |
| 17 | `js/form.js` | `js/form.js` | ✅ UNCHANGED | Contact form |
| 18 | `js/ui.js` | `js/ui.js` | ✅ UNCHANGED | UI controllers |
| 19 | `js/animations.js` | `js/animations.js` | ✅ UNCHANGED | Scroll reveals |
| 20 | `assets/img/logo/logo.svg` | `assets/img/logo/logo.svg` | ✅ UNCHANGED | Brand logo |
| 21 | `assets/img/hero/.gitkeep` | `assets/img/hero/.gitkeep` | ✅ UNCHANGED | Placeholder |
| 22 | `assets/img/services/.gitkeep` | `assets/img/services/.gitkeep` | ✅ UNCHANGED | Placeholder |
| 23 | `assets/img/portfolio/.gitkeep` | `assets/img/portfolio/.gitkeep` | ✅ UNCHANGED | Placeholder |
| 24 | `assets/img/testimonials/.gitkeep` | `assets/img/testimonials/.gitkeep` | ✅ UNCHANGED | Placeholder |
| 25 | `assets/img/logo/.gitkeep` | `assets/img/logo/.gitkeep` | ✅ UNCHANGED | Placeholder |
| 26 | `assets/svg/.gitkeep` | `assets/svg/.gitkeep` | ✅ UNCHANGED | Placeholder |
| 27 | `assets/fonts/.gitkeep` | `assets/fonts/.gitkeep` | ✅ UNCHANGED | Placeholder |
| 28 | `assets/docs/privacy-policy.html` | `assets/docs/privacy-policy.html` | ✅ UNCHANGED | Legal page |
| 29 | `assets/docs/terms.html` | `assets/docs/terms.html` | ✅ UNCHANGED | Legal page |
| 30 | — | `README.md` | 🆕 NEW | Project documentation |
| 31 | — | `PATH-MAP.md` | 🆕 NEW | This file |

---

## Removed Files

| Path | Reason |
|---|---|
| `css/.gitkeep` | Redundant — directory contains real files (`styles.css`, `themes.css`, `rtl.css`) |
| `js/.gitkeep` | Redundant — directory contains real files (`script.js`, `i18n.js`, etc.) |

---

## Reference Paths in Source Files

### index.html References

| Line | Type | Path | Target File Exists |
|---|---|---|---|
| 51 | `<link href>` | `css/styles.css` | ✅ |
| 55 | `<link href>` | `css/themes.css` | ✅ |
| 59 | `<link href>` | `css/rtl.css` | ✅ |
| 63 | `<link href>` | `favicon.ico` | ✅ |
| 64 | `<link href>` | `assets/img/logo/logo.svg` | ✅ |
| 1403 | `<a href>` | `assets/docs/privacy-policy.html` | ✅ |
| 1406 | `<a href>` | `assets/docs/terms.html` | ✅ |
| 1425 | `<script src>` | `js/translations-en.js` | ✅ |
| 1427 | `<script src>` | `js/translations-ar.js` | ✅ |
| 1431 | `<script src>` | `js/animations.js` | ✅ |
| 1433 | `<script src>` | `js/ui.js` | ✅ |
| 1437 | `<script src>` | `js/form.js` | ✅ |
| 1441 | `<script src>` | `js/i18n.js` | ✅ |
| 1445 | `<script src>` | `js/script.js` | ✅ |

### privacy-policy.html References

| Line | Type | Path | Resolves To | Exists |
|---|---|---|---|---|
| 8 | `<link href>` | `../../favicon.ico` | `favicon.ico` | ✅ |
| 9 | `<link href>` | `../../css/styles.css` | `css/styles.css` | ✅ |
| 10 | `<link href>` | `../../css/themes.css` | `css/themes.css` | ✅ |
| 26 | `<a href>` | `../../index.html` | `index.html` | ✅ |

### terms.html References

| Line | Type | Path | Resolves To | Exists |
|---|---|---|---|---|
| 8 | `<link href>` | `../../favicon.ico` | `favicon.ico` | ✅ |
| 9 | `<link href>` | `../../css/styles.css` | `css/styles.css` | ✅ |
| 10 | `<link href>` | `../../css/themes.css` | `css/themes.css` | ✅ |
| 26 | `<a href>` | `../../index.html` | `index.html` | ✅ |

### sitemap.xml References

| Line | URL | Maps To | Exists |
|---|---|---|---|
| 5 | `https://www.glorytech.com/` | `index.html` | ✅ |
| 14 | `https://www.glorytech.com/assets/docs/privacy-policy.html` | `assets/docs/privacy-policy.html` | ✅ |
| 20 | `https://www.glorytech.com/assets/docs/terms.html` | `assets/docs/terms.html` | ✅ |

---

## External References (Not File Paths — Unchanged)

| Type | URL/Value |
|---|---|
| Google Fonts CDN | `https://fonts.googleapis.com/css2?family=Cairo:wght@...` |
| FormSubmit Endpoint | `https://formsubmit.co/ajax/mohamedalnajjar204@gmail.com` |
| WhatsApp Link | `https://wa.me/201228635405` |
| Phone Link | `tel:+201228635405` |
| Email Links | `mailto:mohamedalnajjar204@gmail.com` |
| Canonical URL | `https://www.glorytech.com/` |
| OG Image | `https://www.glorytech.com/og-image.jpg` |
