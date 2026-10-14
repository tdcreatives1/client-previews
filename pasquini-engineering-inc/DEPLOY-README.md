# Pasquini Engineering, Inc. — Hostinger deployment

Upload the **contents** of this folder to `public_html/` on Hostinger (File Manager → Upload, or extract the zip there). Keep the existing WordPress files in place for now (see "WordPress fallback").

## Deploy steps
1. Back up `public_html/` (Hostinger → Files → Backups).
2. Upload and extract this zip into `public_html/`. Allow it to overwrite `.htaccess` and `index.html`. WordPress's `index.php` stays; `DirectoryIndex index.html index.php` makes the new homepage win.
3. If `.htaccess` doesn't appear in File Manager, turn on "Show hidden files". It must be at the root.
4. Edit `api/lead.php`: paste the GoHighLevel inbound-webhook URL into `GHL_WEBHOOK_URL`. Make sure `LEAD_EMAIL_FROM` is an address on this domain (create the mailbox in Hostinger → Emails, or use any existing one).
5. Copy the 11 WordPress images below into `/assets/images/` (WordPress → Media → download, rename as shown). Until then, `.htaccess` serves them from `/wp-content/uploads/`.
6. Hostinger → Advanced → Cache Manager → Purge all (LiteSpeed cache).
7. Google Search Console → Sitemaps → submit `https://pasquiniengineering.com/sitemap.xml`.
8. Test: submit the chat once and confirm the email to padmin@pasquiniengineering.com and the GHL contact.

## WordPress fallback
`.htaccess` block 6 sends any URL without a static file (old blog posts, `/privacy-policy/`, category pages) to WordPress, so nothing 404s while posts are being rebuilt. Once every post exists as `blog/<slug>/index.html`, delete that block and the WordPress files.

## URL map (old → new)
| Old URL | New URL | File / status |
|---|---|---|
| `/` | `/` | index.html |
| `/about-us/` | `/about-us/` | about-us/index.html |
| `/about-us/our-team/` | 301 → /about-us/ | (no page; team is on About Us) |
| `/our-services/` | `/our-services/` | our-services/index.html |
| `/our-services/#construction-project-management` | `/our-services/construction-project-management/` | new page (old anchor still works) |
| `/california-civil-engineering-services/` | `/california-civil-engineering-services/` | california-civil-engineering-services/index.html |
| `/california-structural-engineering-services/` | `/california-structural-engineering-services/` | california-structural-engineering-services/index.html |
| `/california-building-design-firm/` | `/california-building-design-firm/` | california-building-design-firm/index.html |
| `/california-architectural-engineering-services/` | 301 → /our-services/ | ⚠ NO MATCHING PAGE |
| `/altadena-civil-engineering-services/` | `/altadena-civil-engineering-services/` | altadena-civil-engineering-services/index.html |
| `/projects/` | `/projects/` | projects/index.html |
| `/testimonials/` | 301 → /about-us/ | ⚠ NO MATCHING PAGE |
| `/blog/` | `/blog/` | blog/index.html |
| `/blog/<post>/ and /blog/<category>/<post>/` | `unchanged` | ⚠ NOT REBUILT YET: served by WordPress via .htaccess fallback |
| `/privacy-policy/` | `unchanged` | ⚠ NO STATIC PAGE: served by WordPress via .htaccess fallback |
| `/contact-us/` | `/contact-us/` | contact-us/index.html |

New pages (no previous URL):
- `/service-areas/`
- `/pacific-palisades-fire-rebuild/`
- `/our-services/planning-services/`
- `/our-services/surveying/`
- `/service-areas/santa-rosa/`
- `/service-areas/paradise/`
- `/service-areas/central-coast/`
- `/service-areas/arizona/`
- `/service-areas/california/`
- `/service-areas/colorado/`
- `/service-areas/connecticut/`
- `/service-areas/idaho/`
- `/service-areas/nevada/`
- `/service-areas/oregon/`
- `/service-areas/texas/`
- `/service-areas/virginia/`
- `/service-areas/washington/`

Interim preview URLs (`/Home.dc.html`, `/about-us.html`, `/services/*.html`, `/states/*.html`, `/areas/*.html`) all 301 to the clean URLs.

## Images to copy from WordPress
| Save as `/assets/images/…` | Current WordPress file |
|---|---|
| `pasquini-engineering-logo.png` | `/wp-content/uploads/2020/08/pe-nav-logo@2x.png` |
| `image006.jpg` | `/wp-content/uploads/2023/11/image006.jpg` |
| `residental.jpg` | `/wp-content/uploads/2022/10/residental.jpg` |
| `commercial-project-california-pasquini-engineering-1-1.jpg` | `/wp-content/uploads/2022/10/commercial-project-california-pasquini-engineering-1-1.jpg` |
| `industrial-project-california-pasquini-engineering-3-1.jpg` | `/wp-content/uploads/2022/10/industrial-project-california-pasquini-engineering-3-1.jpg` |
| `homeowners-recovery-guide-fire-damage-pasquini-engineering-feature-400x250.jpg` | `/wp-content/uploads/2026/08/homeowners-recovery-guide-fire-damage-pasquini-engineering-feature-400x250.jpg` |
| `building-fails-sb-721-inspection-pasquini-engineering-feature-400x250.jpg` | `/wp-content/uploads/2026/06/building-fails-SB-721-inspection-pasquini-engineering-feature-400x250.jpg` |
| `multi-family-construction-california-pasquini-engineering-feature-400x250.jpg` | `/wp-content/uploads/2026/06/multi-family-construction-california-pasquini-engineering-feature-400x250.jpg` |
| `california-building-design-firm-pasquini-engineering.jpg` | `/wp-content/uploads/2022/05/california-building-design-firm-pasquini-engineering.jpg` |
| `commercial-8.jpg` | `/wp-content/uploads/2020/08/Commercial-8.jpg` |
| `professional-engineering-services-pasquini-engineering-article-2.jpg` | `/wp-content/uploads/2024/04/professional-engineering-services-pasquini-engineering-article-2.jpg` |

Convert to WebP if possible (keep the same name with `.webp` and update the reference), or upload as-is.

## Forms
- **Chat qualifier** (every page) → `POST /api/lead.php` → emails padmin@pasquiniengineering.com and forwards JSON to the GoHighLevel inbound webhook. Shows a confirmation message and summary card on success, and a call/text fallback message on failure. Fires GA4 `generate_lead`. Has a honeypot field for spam.
- **"Start Your Project" / "New Project Inquiry"** buttons link to the existing Google Forms (they submit to Google).

## Favicon & logo
`favicon.ico` (16/32/48), `favicon-32x32.png`, `apple-touch-icon.png` and the 512px icon use an interim navy/gold "PE" monogram. Replace them with versions cut from the official logo (same file names).

## Page list
| URL | Title | Meta description |
|---|---|---|
| `/` | Pasquini Engineering, Inc. | California Engineering Firm | Civil, structural and architectural engineering for homeowners and contractors since 1990. 9,000+ permitted projects, with plans prepared in-house for permit. |
| `/about-us/` | About Us | Pasquini Engineering, Inc. Family-Owned 1990 | Family-founded in Bakersfield in 1990, Pasquini Engineering, Inc. has engineered 9,000+ projects across California and the West. Meet the team and our story. |
| `/our-services/` | Engineering & Design Services | Pasquini Engineering | Civil, structural and architectural engineering, building design, construction management, planning and surveying, all under one roof at Pasquini Engineering. |
| `/service-areas/` | Service Areas & Licensed States | Pasquini Engineering | California offices in Bakersfield, Santa Rosa, Sacramento, San Jose and more, plus licensed engineering in nine states. Find your local office today. |
| `/projects/` | Projects: 9,000+ Permitted Since 1990 | Pasquini Engineering | Browse residential, commercial, industrial and fire-rebuild projects by Pasquini Engineering, Inc. Drag to compare the engineered plan with the finished build. |
| `/blog/` | Engineering News & Homeowner Guides | Pasquini Engineering | California engineering news, permitting guides and project stories from Pasquini Engineering, Inc. Read about ADUs, SB 721, SB 1211, fire rebuilds and more. |
| `/contact-us/` | Contact Us & Schedule an Appointment | Pasquini Engineering | Call (661) 328-9600, text us, or schedule an appointment with Pasquini Engineering, Inc. Find the phone number for your nearest California office in one place. |
| `/altadena-civil-engineering-services/` | Altadena Eaton Fire Rebuild Engineering | Pasquini | Permit-ready rebuild plans for Altadena contractors and homeowners after the Eaton Fire. Civil, structural and architectural engineering from Pasquini. |
| `/pacific-palisades-fire-rebuild/` | Pacific Palisades Fire Rebuild Engineering | Pasquini | Engineering and permit-ready plan sets for Pacific Palisades fire rebuilds, from like-for-like homes to hillside redesigns. Pasquini Engineering since 1990. |
| `/california-civil-engineering-services/` | California Civil Engineering Services | Pasquini Engineering | Site design, grading, drainage and utility plans that meet local codes. California civil engineering services from Pasquini Engineering, Inc. since 1990. |
| `/california-structural-engineering-services/` | California Structural Engineering | Pasquini Engineering | Structural calculations and design for new homes, additions, ADUs and commercial buildings. Permit-ready structural engineering from Pasquini Engineering, Inc. |
| `/california-building-design-firm/` | California Building Design Firm | Pasquini Engineering | Building design for homes, ADUs, additions and commercial projects, coordinated with your contractor and budget. Building design by Pasquini Engineering, Inc. |
| `/our-services/construction-project-management/` | Construction Project Management | Pasquini Engineering | Construction project management from permit through final inspection. Pasquini Engineering keeps your schedule, budget and subcontractors coordinated. |
| `/our-services/planning-services/` | Planning, Zoning & Entitlements | Pasquini Engineering | Planning and zoning support for residential and commercial projects, from feasibility and entitlements to approvals, by Pasquini Engineering in California. |
| `/our-services/surveying/` | Land & Construction Surveying | Pasquini Engineering | Boundary, topographic and construction surveys, including drone mapping, to support design and permitting. Surveying services by Pasquini Engineering, Inc. |
| `/service-areas/santa-rosa/` | Santa Rosa Engineering & Rebuilds | Pasquini Engineering | Engineering, building design and fire-rebuild plans for Santa Rosa and Sonoma County homeowners and contractors. Call the local Pasquini Engineering office. |
| `/service-areas/paradise/` | Paradise, CA Engineering & Rebuilds | Pasquini Engineering | Rebuild plans for Paradise and Butte County homeowners and contractors since the Camp Fire. Civil and structural engineering from Pasquini Engineering, Inc. |
| `/service-areas/central-coast/` | Central Coast Engineering Services | Pasquini Engineering | Engineering and building design for Central Coast homes and businesses, from coastal wind design to ADUs and additions. Call Pasquini Engineering, Inc. locally. |
| `/service-areas/arizona/` | Arizona Engineering Services | Pasquini Engineering | Licensed civil, structural and architectural engineering in Arizona. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/california/` | California Engineering Services | Pasquini Engineering | Licensed civil, structural and architectural engineering in California. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/colorado/` | Colorado Engineering Services | Pasquini Engineering | Licensed civil, structural and architectural engineering in Colorado. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/connecticut/` | Connecticut Engineering Services | Pasquini Engineering | Licensed civil, structural and architectural engineering in Connecticut. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/idaho/` | Idaho Engineering Services | Pasquini Engineering Inc | Licensed civil, structural and architectural engineering in Idaho. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/nevada/` | Nevada Engineering Services | Pasquini Engineering | Licensed civil, structural and architectural engineering in Nevada. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/oregon/` | Oregon Engineering Services | Pasquini Engineering | Licensed civil, structural and architectural engineering in Oregon. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/texas/` | Texas Engineering Services | Pasquini Engineering Inc | Licensed civil, structural and architectural engineering in Texas. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/service-areas/virginia/` | Virginia Engineering Projects | Pasquini Engineering | Projects in Virginia completed with another licensed professional. Learn how Pasquini Engineering, Inc. supports structural, civil and design work out of state. |
| `/service-areas/washington/` | Washington Engineering Services | Pasquini Engineering | Licensed civil, structural and architectural engineering in Washington. Permit-ready plans prepared in-house by Pasquini Engineering, Inc. Call (661) 328-9600. |
| `/404.html` | Page Not Found \| Pasquini Engineering, Inc. | (noindex) |
