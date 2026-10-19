# Pasquini Engineering, Inc. — Hostinger deployment (v4, 2026-10-19)

## Final self-check (run on this package before export)
| Check | Result |
|---|---|
| HTML pages | 33 (32 indexed + 404.html) |
| Broken internal links, images, CSS/JS/font/data refs (all HTML + styles.css + scripts.js + house3d.js + map embed) | **0** |
| Sitemap URLs | 32, every one has a matching `index.html`; every page is in the sitemap |
| Unique `<title>` / unique meta description | 32 / 32 (50–60 and 140–160 chars) |
| Exactly one H1 per page | 33 / 33 |
| Images without alt text | 0 |
| GA4 `G-W750WRZJRL` in `<head>` | 33 / 33 |
| TD Creatives tracking before `</body>` (no chat widget) | 33 / 33 |
| Canonical + OG + Twitter + JSON-LD | 32 / 32 (404 is noindex) |
| References to WordPress / wp-content / preview files | 0 |
| "Eight states" / Virginia-unlicensed wording | 0 remaining |
| Outside requests | Google Analytics, TD Creatives tracking, Google Forms, Zoom, social links |

Two files are referenced but **not in this zip because you are adding them yourself**: `/assets/images/pasquini-engineering-logo.png` and `/assets/images/california-building-design-firm-pasquini-engineering.jpg`. The check treated them as present.

## What changed in v2
- WordPress fallback rules removed from `.htaccess`; package is fully self-contained.
- 9 missing images replaced with images already in the package (see table below).
- 4 new pages: 3 blog posts + Privacy Policy. **All three blog posts were written from scratch** (the original WordPress text was not available). Client should review before publishing.
- Licensed states now consistent everywhere: Arizona, California, Colorado, Connecticut, Idaho, Nevada, Oregon, Texas, Virginia, Washington (10). Map colors Virginia as licensed; legend note now covers Hawaii and Alaska only; Japan note unchanged. Homepage schema `areaServed` and `llms.txt` updated.
- Built-in chat replaced by the GoHighLevel chat widget + TD Creatives tracking script on every page.

## Deploy steps
1. Back up `public_html/`, then delete its contents (WordPress is already gone).
2. Upload and extract this zip into `public_html/`. Turn on "Show hidden files" to confirm `.htaccess` is at the root.
3. Add your two image files to `/assets/images/` using the exact names above.
4. (No chat configuration needed; the GHL widget id is already in every page.)
5. Hostinger → Advanced → Cache Manager → Purge all.
6. Google Search Console → Sitemaps → submit `https://pasquiniengineering.com/sitemap.xml`.
7. Open the live site, send a test chat message, and confirm it appears in GoHighLevel Conversations.

## Image substitutions
| Old reference | Now uses |
|---|---|
| image006.jpg (Marc Pasquini portrait, About/Home heritage) | pasquini-engineering-team.webp |
| residental.jpg | new-custom-home-pool-house-pasquini-engineering.webp |
| commercial-project-california-pasquini-engineering-1-1.jpg | office-building-design-bakersfield-pasquini-engineering.webp |
| industrial-project-california-pasquini-engineering-3-1.jpg | construction-project-management-formwork-pasquini-engineering.webp |
| commercial-8.jpg | multi-family-rebuild-paradise-pasquini-engineering.webp |
| homeowners-recovery-guide…-400x250.jpg | fire-rebuild-pacific-palisades-pasquini-engineering.webp |
| building-fails-sb-721…-400x250.jpg | structural-engineering-deck-cable-rail-pasquini-engineering.webp |
| multi-family-construction…-400x250.jpg | multi-family-rebuild-paradise-pasquini-engineering.webp |
| professional-engineering-services…-article-2.jpg | engineering-firm-california-pasquini-engineering.webp |

To swap any of these back to the original photo later, drop the file in `/assets/images/` and change the one `src`/`url()` reference.

## URL map (old WordPress → new)
| Old URL | New URL | File / note |
|---|---|---|
| `/` | `/` | index.html |
| `/about-us/` | `/about-us/` | about-us/index.html |
| `/about-us/our-team/` | 301 → /about-us/ | team is on About Us |
| `/testimonials/` | 301 → /about-us/ | testimonials are on About Us |
| `/our-services/` | `/our-services/` | our-services/index.html |
| `/california-civil-engineering-services/` | unchanged | california-civil-engineering-services/index.html |
| `/california-structural-engineering-services/` | unchanged | california-structural-engineering-services/index.html |
| `/california-building-design-firm/` | unchanged | california-building-design-firm/index.html |
| `/california-architectural-engineering-services/` | 301 → /our-services/ | service folded into Our Services |
| `/altadena-civil-engineering-services/` | unchanged | altadena-civil-engineering-services/index.html |
| `/projects/` | `/projects/` | projects/index.html |
| `/blog/` | `/blog/` | blog/index.html |
| `/blog/homeowners-guide-to-fire-damage-and-structural-risks/` | unchanged | blog/homeowners-guide-to-fire-damage-and-structural-risks/index.html |
| `/blog/if-building-fails-an-sb-721-inspection/` | unchanged | blog/if-building-fails-an-sb-721-inspection/index.html |
| `/blog/multi-family-construction-strategies-california/` | unchanged | blog/multi-family-construction-strategies-california/index.html |
| `/blog/<category>/<post>/` | 301 → /blog/<post>/ | for the three posts above; other categories/tags/feeds → /blog/ |
| `/blog/<older post>/` | ⚠ 404 | older WordPress posts were not rebuilt (no source text available); add slugs to .htaccess block 5 or send me the posts |
| `/privacy-policy/` | `/privacy-policy/` | privacy-policy/index.html |
| `/contact-us/` | `/contact-us/` | contact-us/index.html |
| `/sitemap_index.xml, /page-sitemap.xml` | 301 → /sitemap.xml |  |
| `/wp-content/uploads/…/pe-nav-logo@2x.png` | 301 → /assets/images/pasquini-engineering-logo.png |  |
| `/wp-content/*, /wp-admin/*, /wp-login.php` | 301 → / |  |

Interim preview URLs (`/Home.dc.html`, `/about-us.html`, `/services/*.html`, `/states/*.html`, `/areas/*.html`) all 301 to the clean URLs.

## Chat, tracking & forms
- **No chat widget is installed.** The client is adding their own chat separately. Paste its embed code just before `</body>` on every page.
- **Every page** ends with the TD Creatives external-tracking script (`tk_305bf3fb3e5a4d27a65db5b0bf9789f7`), placed just before `</body>` after `/assets/js/scripts.js`. **Any new page must include the same tag.** The easiest way is to duplicate an existing page.
- **"Start Your Project" / "New Project Inquiry"** buttons link to the existing Google Forms.

## Favicons
`favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-512x512.png` are an interim navy/gold "PE" monogram. Replace with versions cut from the logo (same names) when convenient.

## Page list
| URL | Title | Meta description |
|---|---|---|
| `/` | Pasquini Engineering, Inc. \| California Engineering Firm | Civil, structural and architectural engineering for homeowners and contractors since 1990. 9,000+ permitted projects, with plans prepared in-house for permit. |
| `/about-us/` | About Us \| Pasquini Engineering, Inc. Family-Owned 1990 | Family-founded in Bakersfield in 1990, Pasquini Engineering, Inc. has engineered 9,000+ projects across California and the West. Meet the team and our story. |
| `/our-services/` | Engineering & Design Services \| Pasquini Engineering | Civil, structural and architectural engineering, building design, construction management, planning and surveying, all under one roof at Pasquini Engineering. |
| `/service-areas/` | Service Areas & Licensed States \| Pasquini Engineering | California offices in Bakersfield, Santa Rosa, Sacramento, San Jose and more, plus licensed engineering in ten states. Find your local office today. |
| `/projects/` | Projects: 9,000+ Permitted Since 1990 \| Pasquini Engineering | Browse residential, commercial, industrial and fire-rebuild projects by Pasquini Engineering, Inc. Drag to compare the engineered plan with the finished build. |
| `/blog/` | Engineering News & Homeowner Guides \| Pasquini Engineering | California engineering news, permitting guides and project stories from Pasquini Engineering, Inc. Read about ADUs, SB 721, SB 1211, fire rebuilds and more. |
| `/contact-us/` | Contact Us & Schedule an Appointment \| Pasquini Engineering | Call (661) 328-9600, text us, or schedule an appointment with Pasquini Engineering, Inc. Find the phone number for your nearest California office in one place. |
| `/altadena-civil-engineering-services/` | Altadena Eaton Fire Rebuild Engineering \| Pasquini | Permit-ready rebuild plans for Altadena contractors and homeowners after the Eaton Fire. Civil, structural and architectural engineering from Pasquini. |
| `/pacific-palisades-fire-rebuild/` | Pacific Palisades Fire Rebuild Engineering \| Pasquini | Engineering and permit-ready plan sets for Pacific Palisades fire rebuilds, from like-for-like homes to hillside redesigns. Pasquini Engineering since 1990. |
| `/california-civil-engineering-services/` | California Civil Engineering Services \| Pasquini Engineering | Site design, grading, drainage and utility plans that meet local codes. California civil engineering services from Pasquini Engineering, Inc. since 1990. |
| `/california-structural-engineering-services/` | California Structural Engineering \| Pasquini Engineering | Structural calculations and design for new homes, additions, ADUs and commercial buildings. Permit-ready structural engineering from Pasquini Engineering, Inc. |
| `/california-building-design-firm/` | California Building Design Firm \| Pasquini Engineering | Building design for homes, ADUs, additions and commercial projects, coordinated with your contractor and budget. Building design by Pasquini Engineering, Inc. |
| `/our-services/construction-project-management/` | Construction Project Management \| Pasquini Engineering | Construction project management from permit through final inspection. Pasquini Engineering keeps your schedule, budget and subcontractors coordinated. |
| `/our-services/planning-services/` | Planning, Zoning & Entitlements \| Pasquini Engineering | Planning and zoning support for residential and commercial projects, from feasibility and entitlements to approvals, by Pasquini Engineering in California. |
| `/our-services/surveying/` | Land & Construction Surveying \| Pasquini Engineering | Boundary, topographic and construction surveys, including drone mapping, to support design and permitting. Surveying services by Pasquini Engineering, Inc. |
| `/service-areas/santa-rosa/` | Santa Rosa Engineering & Rebuilds \| Pasquini Engineering | Engineering, building design and fire-rebuild plans for Santa Rosa and Sonoma County homeowners and contractors. Call the local Pasquini Engineering office. |
| `/service-areas/paradise/` | Paradise, CA Engineering & Rebuilds \| Pasquini Engineering | Rebuild plans for Paradise and Butte County homeowners and contractors since the Camp Fire. Civil and structural engineering from Pasquini Engineering, Inc. |
| `/service-areas/central-coast/` | Central Coast Engineering Services \| Pasquini Engineering | Engineering and building design for Central Coast homes and businesses, from coastal wind design to ADUs and additions. Call Pasquini Engineering, Inc. locally. |
| `/service-areas/arizona/` | Arizona Engineering Services \| Pasquini Engineering | Licensed civil, structural and architectural engineering in Arizona. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/california/` | California Engineering Services \| Pasquini Engineering | Licensed civil, structural and architectural engineering in California. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/colorado/` | Colorado Engineering Services \| Pasquini Engineering | Licensed civil, structural and architectural engineering in Colorado. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/connecticut/` | Connecticut Engineering Services \| Pasquini Engineering | Licensed civil, structural and architectural engineering in Connecticut. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/idaho/` | Idaho Engineering Services \| Pasquini Engineering Inc | Licensed civil, structural and architectural engineering in Idaho. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/nevada/` | Nevada Engineering Services \| Pasquini Engineering | Licensed civil, structural and architectural engineering in Nevada. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/oregon/` | Oregon Engineering Services \| Pasquini Engineering | Licensed civil, structural and architectural engineering in Oregon. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/texas/` | Texas Engineering Services \| Pasquini Engineering Inc | Licensed civil, structural and architectural engineering in Texas. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/virginia/` | Virginia Engineering Services \| Pasquini Engineering Inc | Licensed civil, structural and architectural engineering in Virginia. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/washington/` | Washington Engineering Services \| Pasquini Engineering | Licensed civil, structural and architectural engineering in Washington. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/blog/homeowners-guide-to-fire-damage-and-structural-risks/` | Fire Damage & Structural Risks: A Homeowner's Guide \| PE | How fire damage affects a home's structure, the warning signs that matter most, and what homeowners should do before repairs or a rebuild begin. |
| `/blog/if-building-fails-an-sb-721-inspection/` | Failed SB 721 Balcony Inspection? What Happens Next \| PE | What California apartment owners must do after a failed SB 721 balcony inspection: deadlines, emergency findings, engineered repair plans and permits. |
| `/blog/multi-family-construction-strategies-california/` | Cost-Effective Multi-Family Construction In California \| PE | Ways to control multi-family construction costs in California: efficient structural systems, repeated unit plans, early entitlements, fewer plan-check cycles. |
| `/privacy-policy/` | Privacy Policy \| Pasquini Engineering, Inc. Website | How Pasquini Engineering, Inc. collects and uses information on pasquiniengineering.com: Google Analytics, the chat lead form, cookies, and your choices. |
| `/404.html` | Page Not Found \| Pasquini Engineering, Inc. | (noindex) |
