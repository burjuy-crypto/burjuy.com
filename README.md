# Anton Burjuy — Personal Site

A single-page site for a Dubai real-estate broker (Inside Realty, RERA) with a
hybrid offer: brokerage for standard tickets, principal-angle for HNW
investors deploying $300K–$10M.

Pure HTML / CSS / vanilla JS. No frameworks, no build step.

```
portfolio/
├── index.html        # markup; all visible copy keyed via data-i18n
├── styles.css        # design tokens + sections + responsive
├── script.js         # i18n (EN/RU), reveal animations, form, video, Deal typedef
├── netlify.toml      # build/headers; declares SITE_URL=https://burjuy.com
├── _redirects        # 301 the netlify.app host (and www) to the apex
├── CNAME             # apex hostname (read by some platforms; harmless on Netlify)
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/           # PHOTO_HERO.jpg present; deal-card images no longer used
```

## SITE_URL — single source of truth

The canonical hostname is **`https://burjuy.com`**. It appears in:

- `netlify.toml` → `[build.environment] SITE_URL`
- `index.html` → canonical link, `og:url`, `og:image`, JSON-LD
- `sitemap.xml` → all `<loc>` and `hreflang` URLs
- `robots.txt` → sitemap pointer
- `_redirects` → destination of the netlify.app 301

If the apex changes, search-and-replace **`burjuy.com`** across all five files.

## 1. Run locally

It's a static site — open `index.html` directly, or serve it:

```bash
cd portfolio
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 2. Deploy

### Netlify (drag & drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `portfolio/` folder onto the page
3. Done. Netlify gives you a URL; add a custom domain in the dashboard.

### DNS flip — `anton-burjuy.netlify.app` → `burjuy.com`

The repo is preconfigured. Order of operations:

1. **Buy the domain** if not yet owned (`burjuy.com`). Registrar of choice.
2. **Netlify dashboard → Site → Domain management → Add custom domain**:
   add `burjuy.com` and `www.burjuy.com`.
3. **DNS at the registrar**:
   - `A` record `@` → Netlify load balancer IP (`75.2.60.5` at the time of
     writing — confirm against the value Netlify shows in the dashboard)
   - `CNAME` record `www` → `<your-site>.netlify.app`
   - Or, simpler: delegate the apex to Netlify DNS and let it manage records.
4. **Wait for propagation** (minutes to a few hours). Netlify will issue a
   Let's Encrypt certificate automatically once DNS resolves.
5. **Verify the redirect** once HTTPS is live:
   ```
   curl -sIL https://anton-burjuy.netlify.app/ | grep -i location
   # → location: https://burjuy.com/
   ```
   Rules live in `_redirects` (apex-forced), `netlify.toml` (security headers
   and `SITE_URL`).
6. **Optional**: in the Netlify dashboard mark `burjuy.com` as the primary
   domain so the dashboard reflects the canonical too.

No code change is required for the flip — every absolute URL already points
at `burjuy.com`.

### Vercel
```bash
npm i -g vercel
cd portfolio
vercel        # follow prompts; choose "other" framework
vercel --prod # promote to production
```

### Cloudflare Pages, GitHub Pages, S3 + CloudFront
All work the same way — upload the folder as static files. No build command, no
output directory (or set output directory to `.`).

## 3. Assets

| File                | Purpose                  | Recommended |
|---------------------|--------------------------|-------------|
| `PHOTO_HERO.jpg`    | Hero portrait            | 1200×1500, JPG, ≤300 KB |

The deal-memo cards in `#track` are now text-only (no images), so the old
`CASE_*.jpg` slots are gone. The video section embeds a YouTube video lazily
— click the gold play button to load the iframe. To swap videos, edit
`index.html`: find `data-yt="..."` on `#videoBox` (and the matching thumbnail
URL on `<img class="video__poster">`) and replace with a new YouTube video
ID.

## 4. Swap text content

All visible copy lives in **two places**:

1. **`index.html`** — the default English text (also what search engines see)
2. **`script.js`** — the `i18n` object, which contains both `en` and `ru`
   translations. Each text node in the HTML has a `data-i18n="..."` key that
   maps into this object.

To change a word: search for the `data-i18n` key in `script.js`, edit both
languages. Optionally update the matching default in `index.html` so the
pre-JS state still reads correctly.

## 5. TODO markers — facts Anton fills in

Two kinds of placeholder live in the copy. Both must be cleared before the
site is shared with HNW prospects.

| Marker | Meaning |
|--------|---------|
| `{{TODO_AB: …}}` | A fact Anton owns: deal count, RERA licence number, year personal investing started, aggregate USD volume. |
| `{{TODO_AB_VERIFY: …}}` | A number carried over from prior copy that must be confirmed against signed paperwork before going public (deal-memo tickets, yields, hold periods, dates). |

Find them with: `grep -RE "TODO_AB(_VERIFY)?" index.html script.js`

The Telegram, WhatsApp, email, YouTube and Instagram URLs are already filled
in (`t.me/anton_burjuy`, `wa.me/971505720537`, `a.burjuy@inside.estate`,
`@burjuy_invest`).

## 6. Set up the contact form

The form currently validates client-side and shows a success message — it does
**not** post anywhere. Two simple ways to wire it up:

### Option A — Formspree (recommended, free tier)
1. Sign up at [formspree.io](https://formspree.io) and create a new form. Copy
   the endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `index.html`, add `action` and `method` to the form:
   ```html
   <form class="form" id="contactForm"
         action="https://formspree.io/f/abcdwxyz"
         method="POST" novalidate>
   ```
3. In `script.js`, replace the success block in the form submit handler with:
   ```js
   const data = new FormData(form);
   const res  = await fetch(form.action, {
     method: 'POST', body: data, headers: { Accept: 'application/json' }
   });
   if (res.ok) { success.hidden = false; form.reset(); }
   ```
   And mark the handler `async`.

### Option B — Netlify Forms
Add `data-netlify="true"` and a `name` attribute to the `<form>` tag. Netlify
auto-detects and stores submissions in the dashboard. No JS changes needed.

```html
<form class="form" id="contactForm" name="enquiry" data-netlify="true">
  <input type="hidden" name="form-name" value="enquiry" />
  ...
</form>
```

## 7. Customise the design

All colours, type and rhythm are CSS custom properties at the top of
`styles.css`:

```css
:root {
  --ink:         #0A0E1A;
  --ink-soft:    #141A2B;
  --bone:        #F5F1E8;
  --bone-muted:  #A8A39A;
  --gold:        #C9A961;
  --gold-bright: #E0C079;
  --line:        rgba(201, 169, 97, 0.18);
  ...
}
```

Tweak these to repaint the entire site.

## 8. Performance notes

- Fonts: Inter + Playfair Display loaded from Google Fonts with `preconnect`.
  For maximum performance self-host them via `fonts.bunny.net` or
  `google-webfonts-helper`.
- Images: every `<img>` below the fold is `loading="lazy"`. Convert hero +
  case images to AVIF / WebP for further savings.
- JS: ~10 KB unminified, runs entirely on the main thread, no dependencies.
- Lighthouse: clean run on localhost should hit 95+ across the board once real
  optimised images are dropped in.

## 9. Browser support

Modern evergreens (Chrome, Edge, Safari, Firefox, iOS Safari 14+, Android
Chrome). `aspect-ratio`, CSS custom properties, `IntersectionObserver` and
`backdrop-filter` are all baseline now.

---

© 2026 Anton Burjuy. This website does not constitute investment advice or
solicitation.
