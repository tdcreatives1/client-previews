# TD Creatives — Production Static Site

The complete TD Creatives website (tdcreativesagency.com) as a pure static site: HTML, CSS, and vanilla JavaScript. No build step, no framework. Open `index.html` in a browser and it works.

## What's in each folder

```
td-creatives-website/
├── index.html                  Homepage
├── after-hours-callbot.html    After Hours CallBot landing page
├── contact.html                Project inquiry form
├── thank-you.html              Post-submit confirmation
├── 404.html                    Custom not-found page
├── industries/                 "Who we serve" index + 14 industry pages
├── blog/                       Blog index + 6 articles
├── robots.txt / sitemap.xml    SEO
├── favicon.ico / site.webmanifest
├── .htaccess                   Apache config (HTTPS, non-www, clean URLs, caching)
├── nginx.conf.sample           Equivalent Nginx server block (sample — merge, don't drop in)
└── assets/
    ├── css/styles.css          Single stylesheet: tokens in :root, then components
    ├── js/main.js              All behavior, vanilla + deferred, degrades gracefully
    ├── img/                    Optimized imagery (JPEG screenshots ~60–600 KB each)
    ├── icons/                  Favicon PNGs, apple-touch-icon, PWA icons
    └── fonts/                  Self-hosted Geist, Geist Mono (WOFF2) + Instrument Serif (TTF) with OFL licenses
```

Shared header/nav/footer markup is byte-identical across pages (only relative prefixes and the active state differ), so it converts cleanly to server-side includes later.

## Preview locally

Don't just double-click files — fonts and some paths behave differently over `file://`. Serve the folder:

```bash
cd td-creatives-website
python3 -m http.server 8000
# then open http://localhost:8000
```

(Or `npx serve .` if you prefer Node.)

## Push to GitHub

```bash
cd td-creatives-website
git init
git add -A
git commit -m "TD Creatives production static site"
git branch -M main
git remote add origin git@github.com:YOUR-ORG/td-creatives-website.git
git push -u origin main
```

## Deploy

**Apache:** copy the folder contents to the document root (e.g. `/var/www/tdcreativesagency.com/`). The included `.htaccess` handles HTTPS forcing, non-www, clean URLs (`/contact` → `contact.html`), the 404 page, compression, caching, and security headers. Requires `mod_rewrite`, `mod_headers`, `mod_expires`, `mod_deflate` (`a2enmod rewrite headers expires deflate && systemctl reload apache2`).

**Nginx:** copy the folder to e.g. `/var/www/td-creatives-website`, then merge `nginx.conf.sample` into your site config (adjust `root` and SSL certificate paths), `nginx -t`, and reload. Do not copy the sample file itself to the server root.

## Pre-launch verification checklist

- [ ] Every internal link resolves (crawl with `wget --spider -r http://localhost:8000` or a link checker)
- [ ] No console errors on any page
- [ ] Contact form works end-to-end — needs the one-time FormSubmit activation click (see wiring notes below)
- [ ] Favicon shows in the browser tab
- [ ] `/sitemap.xml` and `/robots.txt` reachable on the live domain
- [ ] HTTPS forcing works (http:// and www. both redirect)
- [ ] `/404.html` serves for a bogus URL with a 404 status
- [ ] Mobile layout checked at 320 / 375 / 768 px (nav toggle opens and closes with keyboard)
- [ ] Lighthouse run on the homepage (target: Performance 85+ mobile)

## Not included / needs wiring

- ~~**Form backend.**~~ **Wired (2026-08-06).** The contact form validates client-side, then POSTs via AJAX to FormSubmit at `https://formsubmit.co/ajax/hello@tdcreativesagency.com` and routes to `thank-you.html`. Same provider the Next.js build uses. Configure it on the `<form>` tag in `contact.html`: `data-email` changes the destination inbox, `data-endpoint` swaps providers entirely, and the `action` + `_next` hidden field are the no-JS fallback. Honeypot (`company_website_url`) blocks bots; if the request fails, the user is offered a pre-filled `mailto:` so no lead is lost. **FormSubmit requires a one-time activation:** the first submission emails a confirmation link to `hello@tdcreativesagency.com` that must be clicked.
- **Blog imagery.** Article hero/inline images and blog-card thumbnails still point at the existing WordPress uploads on `tdcreativesagency.com/wp-content/...`. They work in production because that's the same domain, but for full self-containment download them into `assets/img/` and update the `src` attributes in `blog/*.html`.
- **CallBot voice demo audio** (`after-hours-callbot.html`) streams from `afterhourscallbot.com` — external by design.
- ~~**Analytics.**~~ **Installed (2026-08-06).** Google Analytics 4 (`G-SWRC8LC9FQ`, same property as the live site) loads via `gtag.js` before `</head>` on all 28 pages. The contact form also fires a `generate_lead` event on successful submission.
- **AI website chat assistant.** The live design's floating chat assistant requires an AI backend and is not reproducible statically; it is omitted.
- **Tweaks/theme switcher.** A design-review tool, intentionally excluded from production.
- **DNS / SSL certificate** provisioning.

## Design elements approximated

- The homepage hero screenshot and industry-card tiles were interactive drag-and-drop image slots in the design tool; they export as plain `<img>` elements (drop-in replaceable).
- Scroll-reveal, counters, carousel, portfolio filter, site explorer, and the CallBot ROI calculator are reimplemented in vanilla JS (`assets/js/main.js`) and match the original behavior. All honor `prefers-reduced-motion`.

## Fonts & licenses

- **Geist / Geist Mono** — Vercel, SIL Open Font License 1.1 (`assets/fonts/LICENSE-geist-OFL.txt`). WOFF2.
- **Instrument Serif** — Instrument, SIL Open Font License 1.1 (`assets/fonts/LICENSE-instrument-serif-OFL.txt`). TTF (no official WOFF2 distribution; convert with `woff2_compress` if desired).
- All screenshots are of TD Creatives client work; client logos are used with permission of the respective businesses.
