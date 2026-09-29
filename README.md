# ClipDrop

An anonymous, stateless video downloader built with Next.js 16 (App Router), TypeScript, Tailwind v4 and shadcn/ui. No accounts, no database, no download history.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional tokens, see below
npm run dev
```

Checks: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.

## What actually downloads

ClipDrop only uses authorized mechanisms. It never scrapes, bypasses logins/DRM or fakes formats.

| Source | Metadata | Downloads |
| --- | --- | --- |
| Direct public video files (.mp4/.webm/.mov/.m4v/.ogv) | Header check through the SSRF guard | ✅ Straight from the host |
| YouTube, TikTok | Public oEmbed | ❌ No authorized third-party mechanism, so the UI says so |
| Instagram, Facebook | Meta oEmbed (needs `META_OEMBED_ACCESS_TOKEN`) | ❌ Same as above |

**Downloader API (optional).** For real downloads from those platforms, deploy the [downloader API](https://github.com/Arslan6473/clipdrop-api) (FastAPI + yt-dlp + ffmpeg) on Railway and set `DOWNLOADER_API_URL` and `DOWNLOADER_API_KEY` here. See that repo's README. Only public content is supported, and downloading from these platforms may be restricted by their terms of service.

To add a source, implement `VideoProvider` (`lib/providers/types.ts`) and register it in `lib/providers/registry.ts`. The frontend never knows how a specific platform works.

## Structure

- `app/`: pages (home, 9 tool pages, legal), `api/video/{analyze,download}`, `sitemap.ts`, `robots.ts`, OG image
- `components/downloader/`: the client-side paste → analyze → download flow
- `components/platform/`, `components/sections/`: shared page building blocks (PlatformHero, PlatformFAQ, HowItWorks, RelatedTools and more)
- `lib/content/`: all page copy and SEO text. Each tool page is one data entry.
- `lib/platforms/`: URL normalization, validation and platform detection (safe to run in the browser)
- `lib/providers/`: provider abstraction, per-platform providers, error codes
- `lib/security/`: SSRF guard (DNS checked at connect time, redirects re-validated) and an in-memory, hashed-IP rate limiter
- `lib/config/site.ts`: brand name, tagline and URL. The accent color is `--brand` in `app/globals.css`.

## Notes

- The rate limiter runs per instance. On multi-instance hosting, add a platform firewall rule (e.g. Vercel WAF) for a global limit.
- Thumbnails only load from allowlisted CDNs (`lib/config/remote-images.ts`).
