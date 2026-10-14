# Pasquini Engineering — Site Preview

Client/lead: Pasquini Engineering, Inc. Preview by [TD Creatives](https://tdcreativesagency.com). Delivered 9.5.26, updated 9.15.26, 9.30.26, 10.12.26 and 10.14.26 (production export).

Live preview: https://tdcreatives1.github.io/client-previews/pasquini-engineering-inc/

## About this folder (10.14.26)

This is the Hostinger production export (`hostinger/` in the zip) with one preview-only change:
every root-relative path (`/assets/...`, `/about-us/`) is prefixed with
`/client-previews/pasquini-engineering-inc/` so it works on GitHub Pages.
**Do not deploy this folder.** Deploy the original zip's `hostinger/` folder (see `DEPLOY-README.md`
for the steps, URL map and page list).

Added here: `assets/images/pasquini-engineering-logo.png` and
`assets/images/california-building-design-firm-pasquini-engineering.jpg`, recovered from the Wayback Machine.
Copy them into the production package too.

Preview limitations: the chat form posts to `api/lead.php` (PHP doesn't run on GitHub Pages, so it shows the
call/text fallback). `.htaccess` redirects do nothing here. Old blog posts and `/privacy-policy/` don't exist as static pages.
