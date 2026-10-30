# Portrait Finder

Portrait Finder is a searchable directory of headshot photographers and studios serving New York City and nearby areas. The app is built with React and Vite and deployed as static assets with Cloudflare Workers.

## Features

- Search and filter by location, specialty, session setting, package, price, and retouched image count
- Sort by recommendation, price, name, image count, or package count
- Grid and list layouts, saved listings, and side-by-side comparison
- Photographer profile links, available branding imagery, and verified social links
- 21 listings per page in the interactive directory
- Pre-rendered pages for photographers, categories, and qualifying locations, with metadata, structured data, and a sitemap

## Requirements

- Node.js 20 or newer
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
$env:SITE_URL = "https://your-domain.example"
npm run build
```

Bash:

```sh
SITE_URL="https://your-domain.example" npm run build
```

The build writes the Vite app and generated SEO pages to `dist/`. If `SITE_URL` is omitted, the generator warns and uses `http://localhost:4173`; set the production URL when building for deployment.

## Preview with Cloudflare

```sh
npm run preview
```

This builds the site and starts Wrangler's local development server. The Wrangler configuration serves `dist/`, applies automatic trailing-slash handling, and uses the generated `404.html` for missing paths.

## Deploy

Authenticate Wrangler with Cloudflare, then build with the production domain and deploy:

PowerShell:

```powershell
$env:SITE_URL = "https://your-domain.example"
npm run deploy
```

Bash:

```sh
SITE_URL="https://your-domain.example" npm run deploy
```

For Cloudflare Git-based deployments, configure the build command as `npm run build`, the output directory as `dist`, and provide `SITE_URL` as a build environment variable. Attach the custom domain to the existing `headshots-directory` Worker in Cloudflare after the deployment is available.

## Photographer data

Directory records and their package details are maintained in [`src/data/photographers.js`](src/data/photographers.js). Official logo and branding overrides are in [`src/data/photographer-branding.js`](src/data/photographer-branding.js). Add or edit records in those files, keeping image, website, and social links tied to the correct photographer. Confirm pricing and availability with the photographer before booking; published rates may change.

## Project scripts

| Command | Description |
| --- | --- |
| `npm run start` | Start the Vite development server |
| `npm run build` | Build the app and generate static SEO pages |
| `npm run preview` | Build and serve locally through Wrangler |
| `npm run deploy` | Build and deploy with Wrangler |
