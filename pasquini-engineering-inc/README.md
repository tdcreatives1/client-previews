# Pasquini Engineering — Site Preview

Client/lead: Pasquini Engineering, Inc. Static preview delivered 9.5.26, updated 9.15.26, SEO files added 9.30.26 by [TD Creatives](https://tdcreativesagency.com).

Live: https://tdcreatives1.github.io/client-previews/pasquini-engineering-inc/

`index.html` is a copy of `Home.dc.html` (entry point).

## Pages

| Page | File |
| --- | --- |
| Home | `Home.dc.html` |
| About Us | `About Us.dc.html` |
| Our Services | `Our Services.dc.html` |
| Service landing pages | `Service.dc.html#civil-engineering`, `#structural-engineering`, `#building-design`, `#construction-project-management`, `#planning-services`, `#surveying` |
| Projects | `Projects.dc.html` |
| Blog | `Blog.dc.html` |
| Contact Us | `Contact Us.dc.html` |
| Service Areas (hub) | `Service Areas.dc.html` |
| Altadena | `Altadena.dc.html` |
| Pacific Palisades | `Pacific Palisades.dc.html` |
| Other CA areas | `Areas.dc.html#santa-rosa`, `#paradise`, `#central-coast` |
| Other states | `States.dc.html#oregon`, `#washington`, `#nevada`, `#arizona`, `#hawaii`, `#alaska`, `#texas` |

Shared pieces used by every page: `Header.dc.html`, `Footer.dc.html`, `ChatWidget.dc.html`,
`StickyBar.dc.html`, and `support.js`. Don't rename these — the pages load them by name.

## SEO files (9.30.26)

`seo/robots.txt`, `seo/llms.txt`, `seo/ai.txt` are written for the production domain
(pasquiniengineering.com). They do nothing inside this preview. At launch, upload all three to the **site root**
(e.g. `https://pasquiniengineering.com/robots.txt`).

## Before go-live

- **Chat widget:** `ChatWidget.dc.html` is a visual mock. Replace it with your GoHighLevel
  embed script (`widgets.leadconnectorhq.com`) placed before `</body>`.
- **Missed-call text-back:** configured inside GoHighLevel; the site copy advertises it.
- **Client Reviews:** embed your Google reviews widget where the placeholder sits.
- Most photography still loads from `pasquiniengineering.com`; the hero and team photos
  are local in `uploads/`.
