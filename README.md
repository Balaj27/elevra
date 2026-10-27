# S MAGO CPA, PC — Original Design, Updated Copy

The site uses the original captured Framer layout, typography, colors, spacing, cards, images, responsive variants, and animations. The supplied S MAGO CPA, PC logo and CPA-related copy replace the template branding. No replacement page design is active.

## Run

Use `npm install` and `npm run dev`. The default development port is 3000; the review server is http://localhost:3017. For production, use `npm run build` and `npm start`.

## Edit and regenerate

- `lib/firm-content.js`: firm facts, services, industry labels in the requested order, and supporting copy.
- `scripts/firm-copy.mjs`: applies copy and logo replacements to the original HTML while retaining its DOM elements, classes, inline styles, imagery, and responsive variants.
- `scripts/convert.mjs` / `scripts/convert-pages.mjs`: regenerate the original React components with those copy changes applied.
- `components/sections/` and `components/pages/`: active original-layout components.
- `app/design.css` and each original page's `design.css`: preserved exported styles.
- `app/copy-only.css`: logo fitting and styles for added article detail pages; does not replace the original page design.
- `components/MobileMenu.jsx`: the fullscreen mobile menu previously matched to the video reference.
- `lib/motion.js`: native animations and reduced-motion support.

The Home, About, Services, Contact, and Insights pages retain the original design. A fourth service repeats the existing service-card component. The Industries navigation goes to the original home-page industry strip. Its order is Healthcare, Construction, Real Estate, Retail/Wholesale, Restaurant & Hospitality, Professional Services, and Other Industries.

The unused `components/firm/`, `app/firm.css`, and `scripts/write-firm-pages.mjs` belong to the replaced layout prototype and are retained only as references. Do not run that prototype generator to update the active pages.

## Verification

With the preview running, `node scripts/verify-copy-only.mjs` checks original page structure, CPA copy, four services, exact industry order, logo, contact details, mobile navigation, and overflow at desktop/mobile widths. Set `PREVIEW_URL` for another server. Results and screenshots are under `verification/restored/`.

## Contact and content

Firm facts are taken from the supplied screenshots. Supporting service and editorial copy is drafted. No email address or phone number was supplied, so the template's placeholder channels were removed. Contact and newsletter forms validate fields but still need a delivery backend; they do not transmit submissions.

## SEO and sharing

`lib/seo.mjs` defines page-specific titles/descriptions, canonical URLs, Open Graph and Twitter cards, and AccountingService/WebSite/Breadcrumb/Article structured data. The default canonical origin is https://elevra-h2gy.vercel.app. Set `NEXT_PUBLIC_SITE_URL` in Vercel if the public domain changes, then rebuild and redeploy. `.env.example` documents the variable.

`app/robots.js` and `app/sitemap.js` generate crawler files. The sitemap includes canonical pages and the four article pages; the `/industries` redirect is intentionally excluded.

`public/og/s-mago-cpa-share-v1.jpg` is the 1200×630 public social-preview image used by WhatsApp/Open Graph. A lossless PNG is saved alongside it. Run `npm run generate:share` to regenerate the card from the exact supplied logo and current service names. Use a new versioned filename when replacing a previously shared image to avoid stale social caches.

Run `npm run verify:seo` against the local preview to verify crawler-visible head tags, structured data, sitemap, robots, and the image response. Results are saved in `verification/seo/results.json`.

Deploy the latest code and public assets to activate the live preview. Its image URL will be https://elevra-h2gy.vercel.app/og/s-mago-cpa-share-v1.jpg. A localhost URL cannot be fetched by public sharing crawlers. The image route must remain public, without deployment protection or authentication.

## Pexels photography

Site photographs use optimized local Pexels images, including all seven industry cards and article pages. The supplied logo, icons, typography, and layout are preserved. Photo selections and crop positions live in lib/photos.mjs; scripts/pexels-photos.mjs applies them during conversion. Run node scripts/download-pexels.mjs to restore the 480, 960, and 1600 pixel JPEG variants. Photographer credits and original source links are in PHOTO_CREDITS.md and public/photos/sources.json. Run node scripts/verify-photos.mjs against the preview to check all pages at desktop and mobile widths.
