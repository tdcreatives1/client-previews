# Central Coast Scan: Hostinger deployment

Upload the **contents of `public_html/`** to your Hostinger `public_html` folder. Use hPanel's File Manager, and make sure hidden files are shown so `.htaccess` gets uploaded too. Nothing outside `public_html/` belongs on the server.

## Before going live: find and replace
| Placeholder | Where | Replace with |
|---|---|---|
| `centralcoastscan.com` | all files | your final domain (no www) |
| `hello@centralcoastscan.com` | index.html, 404.html, quote.php, llms.txt | your real inbox |
| `no-reply@centralcoastscan.com` | quote.php (`$FROM`) | a mailbox created on your domain in hPanel → Emails |
| `G-XXXXXXXXXX` | `<head>` of index.html and 404.html | your GA4 ID, then remove the `<!-- -->` around the snippet |
| `SxQL3iGyoDo` | index.html (iframe) | the ID from your own Matterport share link (currently Matterport's public demo model) |
| `$450`, `$900` | index.html, pricing section | your real prices |

If you choose the **www** version of your domain, also edit the redirect rule in `.htaccess`.

## Form
- **Endpoint:** `POST /quote.php`. This is a PHP script that runs on your Hostinger plan and emails each request to `$TO` using PHP `mail()`. No third-party service is used.
- **With JavaScript:** the form submits in the background and shows the "Thanks — we've got it" panel without reloading the page.
- **Without JavaScript:** the page redirects to `/#quote-sent`, which shows the same panel.
- **Spam protection:** a hidden honeypot field, plus a limit of one submission per 30 seconds per visitor. Server-side validation checks name, email and phone.
- **Deliverability:** if messages land in spam, create the `$FROM` mailbox in hPanel and keep the domain's SPF/DKIM records enabled (Hostinger sets them by default).

## URL map
This is a brand-new site, so no old URLs carry over and **no 301 redirects** are needed. `.htaccess` has a commented line showing how to add one later.

| URL | File |
|---|---|
| `/` | `index.html` |
| `/404.html` (served for any unknown URL) | `404.html` |
| `/quote.php` (form endpoint, not a page) | `quote.php` |

All in-page navigation uses `/#section` anchors: `#example`, `#built-for`, `#deliverables`, `#process`, `#service-area`, `#founder`, `#pricing`, `#quote`.

## Pages
| URL | Title | Meta description |
|---|---|---|
| `https://centralcoastscan.com/` | Matterport 3D Scanning, Morro Bay CA \| Central Coast Scan (57 chars) | Matterport 3D scans, as-built floor plans, point clouds and Revit files for engineers, architects, contractors and homeowners on the California Central Coast. (158 chars) |
| `/404.html` (noindex) | Page Not Found – Matterport 3D Scanning \| Central Coast Scan (60 chars) | This page could not be found. Central Coast Scan provides Matterport 3D scanning, floor plans and as-built files from Morro Bay across the Central Coast. (153 chars) |

## Checklist
**1. URLs**
- [x] Clean URLs with no `.dc.html` files, no spaces, no capitals.
- [x] All links are root-relative (`/`, `/#quote`).
- [x] URL map included above.
- [x] No old URLs, so no redirects are needed.

**2. SEO**
- [x] Every page has a unique title and description within the length limits.
- [x] Canonical link, Open Graph tags, Twitter card, charset, viewport and `lang="en"` on every page.
- [x] Favicon set linked on every page: `favicon.ico` (16/32/48), `favicon-32x32.png` and `apple-touch-icon.png` (180).
- [x] OG image is 1200×630: `/assets/img/og-image.jpg`.
- [x] Schema markup:
  - Homepage: JSON-LD `ProfessionalService` (a LocalBusiness type) and `WebSite`. Includes name, PO Box address, email, logo, URL, the 5 counties served, the founder and services. No phone number is listed because none was provided; add a `"telephone"` field when you have one.
  - 404 page: `BreadcrumbList`.
  - No blog yet, so no `BlogPosting`.
- [x] Exactly one H1 per page, logical H2/H3 order, and descriptive alt text on every image (decorative duplicates use `alt=""`).

**3. Root files**
- [x] `sitemap.xml`
- [x] `robots.txt`, which allows crawling, blocks `/quote.php` and points to the sitemap.
- [x] `llms.txt`
- [x] `.htaccess`: forces HTTPS and non-www, sets the custom 404, turns off directory listing, and adds caching, gzip and security headers.
- [x] `404.html`, styled to match the site.

**4. Tracking & forms**
- [~] The GA4 snippet is in the `<head>` of every page but commented out until you have an ID. A `generate_lead` event fires on successful form submits once GA is active.
- [x] The form submits to `/quote.php` and shows a success message.

**5. File hygiene**
- [x] Fonts (IBM Plex Sans variable, IBM Plex Mono 400/500), CSS, JS and images are all stored locally under `/assets/`.
- [x] Images are compressed WebP (photos at 1400–2000px wide); the OG image is a JPG.
- [x] No editor or runtime files, no duplicate copies of the site.
- [x] The only external resource is the Matterport iframe embed, plus Google Analytics once you enable it.

**6. Notes**
- The hero animation and scroll reveals are switched off for visitors who set "reduce motion" on their device.
- After going live, submit `https://yourdomain/sitemap.xml` in Google Search Console and send a test request through the form.
