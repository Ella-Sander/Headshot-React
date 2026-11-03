# Headshot Scout

Headshot Scout is a searchable directory of headshot photographers and studios serving New York City and nearby areas. The app is built with React and Vite and deployed as static assets with Cloudflare Workers.

## Features

- Search and filter by location, specialty, session setting, package, price, and retouched image count
- Sort by recommendation, price, name, image count, or package count
- Grid and list layouts, saved listings, and side-by-side comparison
- Photographer profile links, available branding imagery, and verified social links
- 21 listings per page in the interactive directory
- Pre-rendered pages for photographers, categories, and qualifying locations, with metadata, structured data, and a sitemap

## Requirements

- Node.js 22 or newer
- npm
- A Cloudflare account for deployment

## Local development

```sh
npm install
npm run start
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

Set `SITE_URL` to the public site origin before building so canonical URLs and the sitemap use the correct hostname. Use only the origin, without a path or trailing route.

PowerShell:

```powershell
$env:SITE_URL = "https://headshotscout.com"
npm run build
```

Bash:

```sh
SITE_URL="https://headshotscout.com" npm run build
```

The build writes the Vite app and generated SEO pages to `dist/`. If `SITE_URL` is omitted, the generator uses `https://headshotscout.com` so production canonical URLs and sitemap entries still use the correct domain.

## Preview with Cloudflare

```sh
npm run preview
```

This builds the site and starts Wrangler's local development server. The Wrangler configuration serves `dist/`, applies automatic trailing-slash handling, and uses the generated `404.html` for missing paths.

## Deploy

Authenticate Wrangler with Cloudflare, then build with the production domain and deploy:

PowerShell:

```powershell
$env:SITE_URL = "https://headshotscout.com"
npm run deploy
```

Bash:

```sh
SITE_URL="https://headshotscout.com" npm run deploy
```

The Cloudflare deployment workflow builds with `SITE_URL=https://headshotscout.com` and deploys the `headshot-react` Worker. Add a GitHub Actions secret named `CLOUDFLARE_API_TOKEN` with `Workers Scripts Write` and `Workers Routes Write` access scoped to this account and the `headshotscout.com` zone. The Wrangler configuration attaches `headshotscout.com` and `www.headshotscout.com` as custom domains while keeping the `workers.dev` address available for preview.

After the first production deployment, add `https://headshotscout.com/sitemap.xml` in Google Search Console and verify the domain property with the DNS record Google provides. Indexing and ranking take time and depend on useful, accurate listings and external discovery; no site can guarantee a top position.

## Profile submissions

The profile form saves each submission to Cloudflare D1 with `status = pending`, then emails `headshotscout.support@gmail.com` through Resend. Email delivery status is tracked separately, so a Resend failure does not discard the saved profile. The optional logo upload accepts PNG, JPG, or WebP files up to 1 MB. The image is saved as a private D1 BLOB and attached to the notification email. The Resend API key is only used by the Worker.

Create a dedicated D1 database (this does not touch other production databases), copy its ID into `wrangler.jsonc` in place of `REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID`, and apply the additive migration:

```powershell
npx wrangler d1 create headshot-scout-submissions
npx wrangler d1 migrations apply headshot-scout-submissions --remote
```

The migration uses `CREATE TABLE IF NOT EXISTS` and creates only the submissions table and its index. Configure `RESEND_API_KEY` and `RESEND_FROM` as Worker secrets (the sender must be on a verified Resend domain). Deploy only after the D1 ID and migration are in place. For local preview, put those secret values in an untracked `.dev.vars` file. A submission is acknowledged after D1 confirms it was saved; if Resend is unavailable, the record stays saved and `notification_status` is marked failed (or pending if no delivery credentials are configured).

## Photographer data

Directory records and their package details are maintained in [`src/data/photographers.js`](src/data/photographers.js). Official logo and branding overrides are in [`src/data/photographer-branding.js`](src/data/photographer-branding.js). Add or edit records in those files, keeping image, website, and social links tied to the correct photographer. Confirm pricing and availability with the photographer before booking; published rates may change.

## Project scripts

| Command | Description |
| --- | --- |
| `npm run start` | Start the Vite development server |
| `npm run build` | Build the app and generate static SEO pages |
| `npm run preview` | Build and serve locally through Wrangler |
| `npm run deploy` | Build and deploy with Wrangler |
