import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { photographers } from '../src/data/photographers.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../dist');
const directoryPath = '/new-york/headshot-photographers/';
const pageSize = 21;
const configuredSiteUrl = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
const parsedSiteUrl = new URL(configuredSiteUrl || 'http://localhost:4173');
if (!['https:', 'http:'].includes(parsedSiteUrl.protocol) || parsedSiteUrl.username || parsedSiteUrl.password || parsedSiteUrl.pathname !== '/' || parsedSiteUrl.search || parsedSiteUrl.hash) {
  throw new Error('SITE_URL must be the public site origin only, for example https://portrait.example');
}
const siteUrl = parsedSiteUrl.origin;
if (!configuredSiteUrl) {
  console.warn('SITE_URL is unset; prerendered canonical URLs use the local preview origin. Set SITE_URL to the public production origin before deploying.');
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const cleanText = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const slug = value => cleanText(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const absolute = urlPath => `${siteUrl}${urlPath}`;
const providerPath = provider => `${directoryPath}${encodeURIComponent(provider.id)}/`;
const providerUrl = provider => absolute(providerPath(provider));
const categories = [
  { slug: '', title: 'NYC-Area Headshot Photographers', itemName: 'NYC-area headshot photographers', description: 'Compare 200 headshot photographers and studios serving New York City and its surrounding metro area. Browse actor, corporate, executive, team, and personal-brand sessions, with published prices and package details where available.', filter: () => true },
  { slug: 'actor-headshots', title: 'Actor Headshot Photographers', itemName: 'actor headshot photographers', description: 'Find actor headshot photographers serving New York City and the metro area. Compare casting-focused sessions, studio locations, retouched image counts, and published package rates.', filter: p => p.specialties.includes('Actor headshots') },
  { slug: 'business-headshots', title: 'Business & Executive Headshots', itemName: 'business and executive headshot photographers', description: 'Compare professional business and executive headshot photographers serving New York City and nearby communities. Listings include studio and on-location services, team options, and public pricing when available.', filter: p => p.specialties.includes('Business headshots') },
  { slug: 'team-headshots', title: 'Corporate & Team Headshots', itemName: 'corporate and team headshot photographers', description: 'Explore NYC-area photographers offering corporate and team headshots. Compare providers with office setups, consistent team portraits, and published group packages.', filter: p => p.specialties.includes('Team headshots') },
  { slug: 'personal-branding', title: 'Personal Branding Photographers', itemName: 'personal branding photographers', description: 'Find photographers serving New York City and the metro area for professional headshots and personal-brand portraits. Compare specialties, locations, session settings, and published rates.', filter: p => p.specialties.includes('Personal branding') },
];

const escJson = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
const breadcrumbSchema = entries => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: entries.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, name: entry.name, item: absolute(entry.path) })),
});
const schemaScript = schemas => `<script type="application/ld+json">${escJson(schemas)}</script>`;
const truncate = (value, max = 170) => {
  const text = cleanText(value);
  return text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
};

const builtIndex = await readFile(path.join(dist, 'index.html'), 'utf8');
const sharedLinks = (builtIndex.match(/<link\b[^>]*>/g) || []).filter(tag => /rel="stylesheet"|rel="preconnect"|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(tag)).join('\n    ');
const staticStyle = `<style>
  :root{font-family:'DM Sans',Arial,sans-serif;color:#242c26;background:#f7f7f4;font-synthesis:none;text-rendering:optimizeLegibility;--green:#264b3b;--line:#e8e8e1;--paper:#fff}*{box-sizing:border-box}body{margin:0;line-height:1.6}.seo-shell{max-width:1120px;margin:auto;padding:0 24px}.seo-header,.seo-footer{padding:20px 24px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center}.seo-header a,.seo-footer a{color:var(--green)}.seo-brand{font-weight:800;font-size:20px;text-decoration:none;color:#242c26!important}.seo-main{padding:44px 0 64px}.seo-main h1{font:700 clamp(32px,5vw,52px)/1.1 Manrope,Arial,sans-serif;letter-spacing:-1.5px}.seo-main h2{font:600 25px/1.2 Manrope,Arial,sans-serif}.seo-intro{max-width:760px;color:#59635b}.seo-breadcrumbs{font-size:13px;color:#6d766e}.seo-breadcrumbs a{color:var(--green)}.seo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:26px 0}.seo-card,.seo-panel{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:18px}.seo-card h2{font-size:19px;margin:0 0 5px}.seo-card a,.seo-profile-link{color:var(--green);font-weight:700}.seo-card p,.seo-muted{color:#626b63;font-size:14px}.seo-tags{display:flex;flex-wrap:wrap;gap:6px;padding:0;list-style:none}.seo-tags li{background:#f0f2ec;border-radius:999px;padding:4px 9px;font-size:12px}.seo-pagination{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0}.seo-pagination a,.seo-pagination strong{padding:8px 11px;border:1px solid #dfe3d8;border-radius:5px;color:var(--green);text-decoration:none}.seo-pagination strong{background:var(--green);color:#fff}.seo-logo{width:180px;height:110px;object-fit:contain;background:#fff;border:1px solid var(--line);border-radius:6px;padding:8px}.seo-profile-top{display:flex;gap:24px;align-items:center}.seo-package{border-top:1px solid var(--line);padding:14px 0}.seo-links{display:flex;gap:15px;flex-wrap:wrap;margin:20px 0}.seo-footer{border-top:1px solid var(--line);border-bottom:0;font-size:13px;flex-wrap:wrap}@media(max-width:720px){.seo-grid{grid-template-columns:1fr}.seo-profile-top{align-items:flex-start;flex-direction:column}.seo-header{padding:16px 24px}}
  </style>`;
const documentHtml = ({ title, description, canonical, body, schemas }) => `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f7f4"><title>${esc(title)}</title><meta name="description" content="${esc(truncate(description, 180))}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${esc(canonical)}"><meta property="og:site_name" content="Portrait"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(truncate(description, 180))}"><meta property="og:url" content="${esc(canonical)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(truncate(description, 180))}">
    ${sharedLinks}${staticStyle}${schemas.map(schemaScript).join('\n')}
  </head><body><header class="seo-header"><a class="seo-brand" href="/">portrait</a><nav aria-label="Main navigation"><a href="${directoryPath}">Browse photographers</a></nav></header><main class="seo-shell seo-main">${body}</main><footer class="seo-footer"><a href="/">Portrait</a><a href="${directoryPath}">All NYC-area headshot photographers</a><span>Public listing details are summarized from provider pages; confirm current terms with the photographer.</span></footer></body></html>`;

const makeCrumbs = (label, currentPath) => breadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'NYC-area headshot photographers', path: directoryPath },
  ...(currentPath === directoryPath ? [] : [{ name: label, path: currentPath }]),
]);
const locationCounts = new Map();
for (const provider of photographers) locationCounts.set(provider.city, (locationCounts.get(provider.city) || 0) + 1);
const locationPages = [...locationCounts.entries()].filter(([, count]) => count >= 4).map(([name]) => ({
  name,
  path: `/areas/${slug(name)}/headshot-photographers/`,
  description: `Compare headshot photographers and studios based in or serving ${name}. Browse actor, professional, corporate and personal-brand services, with publicly listed package and pricing information when available.`,
  providers: photographers.filter(provider => provider.city === name),
}));

const profileSchema = provider => ({
  '@context': 'https://schema.org', '@type': 'Organization',
  name: provider.name,
  url: provider.source,
  description: provider.description,
  areaServed: [provider.neighborhood, provider.city].filter(Boolean),
  knowsAbout: provider.specialties,
  ...(provider.instagramUrl ? { sameAs: [provider.instagramUrl] } : {}),
});
const priceText = value => value == null ? 'Contact for current pricing' : `$${Number(value).toLocaleString('en-US')}`;
const logoMarkup = provider => provider.logoUrl
  ? `<img class="seo-logo" src="${esc(provider.logoUrl)}" alt="${esc(provider.name)} official website branding" width="180" height="110" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden class="seo-muted">Official logo unavailable</span>`
  : `<span class="seo-muted">Official logo unavailable</span>`;

const providerBody = provider => {
  const pkgMarkup = provider.packages.map(pkg => `<div class="seo-package"><strong>${esc(pkg.name)}</strong> <b>· ${esc(priceText(pkg.price))}</b><p>${esc(pkg.summary || 'Ask the provider for package details.')}</p>${pkg.editedImages ? `<p>${esc(pkg.editedImages)} retouched image${pkg.editedImages === 1 ? '' : 's'} listed</p>` : ''}</div>`).join('');
  const links = [`<a href="${esc(provider.source)}" rel="nofollow noopener">Official website ↗</a>`, ...(provider.instagramUrl ? [`<a href="${esc(provider.instagramUrl)}" rel="nofollow noopener">Instagram ↗</a>`] : [])].join('');
  return `<nav class="seo-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="${directoryPath}">Photographers</a> / <span>${esc(provider.name)}</span></nav>
    <div class="seo-profile-top">${logoMarkup(provider)}<div><p class="seo-muted">${esc(provider.neighborhood)}, ${esc(provider.city)}</p><h1>${esc(provider.name)}</h1><p class="seo-muted">${esc(provider.subtitle)}</p></div></div>
    <section class="seo-panel"><h2>Headshot services</h2><p>${esc(provider.description)}</p><ul class="seo-tags">${provider.specialties.map(tag => `<li>${esc(tag)}</li>`).join('')}</ul><p><strong>Session options:</strong> ${esc(provider.settings.join(', ') || 'Ask the photographer')}</p><p><strong>Published starting price:</strong> ${esc(priceText(provider.startingPrice))}</p><div class="seo-links">${links}</div></section>
    <section class="seo-panel"><h2>Packages & session details</h2>${pkgMarkup || '<p>Contact the photographer for package information.</p>'}</section>
    <nav class="seo-links" aria-label="Related pages"><a href="${directoryPath}">Browse all NYC-area headshot photographers</a>${provider.specialties.map(specialty => { const category = categories.find(item => item.filter(provider) && item.slug && item.title.toLowerCase().includes(specialty.split(' ')[0].toLowerCase())); return category ? `<a href="${directoryPath}${category.slug}/">More ${esc(category.itemName)}</a>` : ''; }).filter(Boolean).slice(0, 2).join('')}</nav>`;
};

const allPages = [];
const renderCollectionPage = async ({ title, description, currentPath, entries, categoryLabel }) => {
  const countPages = Math.max(1, Math.ceil(entries.length / pageSize));
  for (let page = 1; page <= countPages; page++) {
    const urlPath = page === 1 ? currentPath : `${currentPath}page/${page}/`;
    const visible = entries.slice((page - 1) * pageSize, page * pageSize);
    const pageTitle = page === 1 ? `${title} | Portrait` : `${title} — Page ${page} | Portrait`;
    const pageDescription = page === 1 ? description : `${description} Page ${page} of ${countPages}, showing ${visible.length} of ${entries.length} providers.`;
    const cards = visible.map(provider => `<article class="seo-card"><h2><a href="${providerPath(provider)}">${esc(provider.name)}</a></h2><p>${esc(provider.neighborhood)}, ${esc(provider.city)} · ${esc(provider.subtitle)}</p><p>${esc(truncate(provider.description, 200))}</p><ul class="seo-tags">${provider.specialties.slice(0, 4).map(tag => `<li>${esc(tag)}</li>`).join('')}</ul><p><strong>${esc(priceText(provider.startingPrice))}</strong></p><a href="${providerPath(provider)}">View listing details</a></article>`).join('');
    const pageLinks = Array.from({ length: countPages }, (_, index) => {
      const n = index + 1;
      const target = n === 1 ? currentPath : `${currentPath}page/${n}/`;
      return n === page ? `<strong aria-current="page">${n}</strong>` : `<a href="${target}" aria-label="Page ${n}">${n}</a>`;
    }).join('');
    const prevLink = page > 1 ? `<a rel="prev" href="${page === 2 ? currentPath : `${currentPath}page/${page - 1}/`}">Previous page</a>` : '';
    const nextLink = page < countPages ? `<a rel="next" href="${currentPath}page/${page + 1}/">Next page</a>` : '';
    const body = `<nav class="seo-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>${esc(categoryLabel)}</span></nav><h1>${esc(title)}${page > 1 ? ` — Page ${page}` : ''}</h1><p class="seo-intro">${esc(description)}</p><p class="seo-muted">${entries.length} listings · ${pageSize} per page</p><section aria-label="${esc(categoryLabel)} listings"><div class="seo-grid">${cards}</div></section><nav class="seo-pagination" aria-label="Directory pages">${prevLink}${pageLinks}${nextLink}</nav>`;
    const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: title, numberOfItems: entries.length, itemListElement: visible.map((provider, index) => ({ '@type': 'ListItem', position: (page - 1) * pageSize + index + 1, name: provider.name, url: providerUrl(provider) })) };
    const target = path.join(dist, urlPath.replace(/^\//, ''), 'index.html');
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, documentHtml({ title: pageTitle, description: pageDescription, canonical: absolute(urlPath), body, schemas: [itemList, makeCrumbs(categoryLabel, urlPath)] }));
    allPages.push(urlPath);
  }
};

for (const category of categories) {
  const currentPath = category.slug ? `${directoryPath}${category.slug}/` : directoryPath;
  await renderCollectionPage({ title: category.title, description: category.description, currentPath, entries: photographers.filter(category.filter), categoryLabel: category.title });
}
for (const location of locationPages) {
  await renderCollectionPage({ title: `Headshot Photographers in ${location.name}`, description: location.description, currentPath: location.path, entries: location.providers, categoryLabel: `${location.name} headshot photographers` });
}

for (const provider of photographers) {
  const urlPath = providerPath(provider);
  const title = `${provider.name} — Headshot Photographer in ${provider.city} | Portrait`;
  const description = `${provider.name}: ${provider.subtitle}. Located in ${provider.neighborhood}, ${provider.city}. ${provider.description}`;
  const target = path.join(dist, urlPath.replace(/^\//, ''), 'index.html');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, documentHtml({ title, description, canonical: absolute(urlPath), body: providerBody(provider), schemas: [profileSchema(provider), makeCrumbs(provider.name, urlPath)] }));
  allPages.push(urlPath);
}

const rootTitle = 'NYC Headshot Photographers & Prices | Portrait';
const rootDescription = 'Compare NYC-area headshot photographers by location, specialty, package options, session settings, and published price.';
const rootLinks = photographers.slice(0, pageSize).map(provider => `<li><a href="${providerPath(provider)}">${esc(provider.name)}</a> — ${esc(provider.neighborhood)}, ${esc(provider.city)}</li>`).join('');
const rootSeo = `<section aria-label="Portrait directory search results" data-prerender-home><h1>Find your next headshot photographer.</h1><p>${esc(rootDescription)}</p><p><a href="${directoryPath}">Browse the full NYC-area photographer directory</a></p><h2>Featured headshot photographers</h2><ul>${rootLinks}</ul><p><a href="${directoryPath}page/2/">Explore more photographers on page 2</a></p></section>`;
let rootHtml = builtIndex;
rootHtml = rootHtml.replace(/<title>[^<]*<\/title>/i, `<title>${esc(rootTitle)}</title>`);
const upsertMeta = (html, attribute, key, value) => {
  const escaped = esc(value);
  const tag = attribute === 'name' ? `<meta name="${key}" content="${escaped}">` : `<meta property="${key}" content="${escaped}">`;
  const pattern = attribute === 'name' ? new RegExp(`<meta\\s+name=["']${key}["'][^>]*>`, 'i') : new RegExp(`<meta\\s+property=["']${key}["'][^>]*>`, 'i');
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
};
for (const [attribute, key, value] of [
  ['name', 'description', rootDescription], ['name', 'robots', 'index,follow,max-image-preview:large'],
  ['property', 'og:title', rootTitle], ['property', 'og:description', rootDescription], ['property', 'og:url', absolute('/')],
  ['name', 'twitter:title', rootTitle], ['name', 'twitter:description', rootDescription],
]) rootHtml = upsertMeta(rootHtml, attribute, key, value);
if (!/<link\s+rel=["']canonical["']/i.test(rootHtml)) rootHtml = rootHtml.replace('</head>', `  <link rel="canonical" href="${absolute('/')}">\n  </head>`);
else rootHtml = rootHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${absolute('/')}">`);
rootHtml = rootHtml.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
const rootSchema = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Portrait', url: absolute('/'), description: rootDescription };
const rootItemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: categories[0].title, numberOfItems: photographers.length, itemListElement: photographers.slice(0, pageSize).map((provider, index) => ({ '@type': 'ListItem', position: index + 1, name: provider.name, url: providerUrl(provider) })) };
rootHtml = rootHtml.replace('</head>', `${schemaScript(rootSchema)}\n${schemaScript(rootItemList)}\n  </head>`);
rootHtml = rootHtml.replace(/<div\s+id=["']root["']\s*>[\s\S]*?<\/div>/i, `<div id="root">${rootSeo}</div>`);
await writeFile(path.join(dist, 'index.html'), rootHtml);

const notFoundBody = `<nav class="seo-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Page not found</span></nav><h1>We couldn’t find that page.</h1><p class="seo-intro">Search the NYC-area headshot photographer directory or browse all listings.</p><form action="/" method="get" role="search"><label for="not-found-search">Search photographers</label><p><input id="not-found-search" name="q" type="search" required placeholder="Name, neighborhood, or specialty"><button type="submit">Search directory</button></p></form><p><a href="${directoryPath}">Browse all headshot photographers</a></p>`;
let notFoundHtml = documentHtml({ title: 'Page Not Found | Portrait', description: 'The page could not be found. Search the NYC-area headshot photographer directory.', canonical: absolute('/'), body: notFoundBody, schemas: [] });
notFoundHtml = notFoundHtml.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex,follow">').replace(/<link rel="canonical" href="[^"]*">/, '');
await writeFile(path.join(dist, '404.html'), notFoundHtml);

const sitemapPaths = ['/', ...allPages];
const uniquePaths = [...new Set(sitemapPaths)];
const sitemapChunkSize = 45000;
const sitemapChunks = Array.from({ length: Math.ceil(uniquePaths.length / sitemapChunkSize) }, (_, index) => uniquePaths.slice(index * sitemapChunkSize, (index + 1) * sitemapChunkSize));
const sitemapXml = urls => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${esc(absolute(url))}</loc></url>`).join('\n')}\n</urlset>\n`;
let sitemapLocation = '/sitemap.xml';
if (sitemapChunks.length <= 1) {
  await writeFile(path.join(dist, 'sitemap.xml'), sitemapXml(sitemapChunks[0] || []));
} else {
  sitemapLocation = '/sitemap-index.xml';
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapChunks.map((_, index) => `  <sitemap><loc>${esc(absolute(`/sitemap-${index + 1}.xml`))}</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`;
  await writeFile(path.join(dist, 'sitemap-index.xml'), sitemapIndex);
  await Promise.all(sitemapChunks.map((urls, index) => writeFile(path.join(dist, `sitemap-${index + 1}.xml`), sitemapXml(urls))));
}
const robotsPath = path.join(dist, 'robots.txt');
const robots = (await readFile(robotsPath, 'utf8').catch(() => 'User-agent: *\nAllow: /\n')).replace(/\n?Sitemap:\s*[^\r\n]+/gi, '').trim();
await writeFile(robotsPath, `${robots}\nSitemap: ${absolute(sitemapLocation)}\n`);
console.log(`Prerendered ${photographers.length} photographer pages, ${allPages.length - photographers.length} category/location pages, and ${uniquePaths.length} sitemap URLs.`);
