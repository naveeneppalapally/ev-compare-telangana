// Generates crawlable per-model landing pages into dist/bikes/<id>/ after `vite build`,
// plus a full sitemap.xml. Static content for search engines; visitors are redirected
// into the SPA deep link which opens the vehicle modal.
// Usage: node --experimental-strip-types scripts/generate-model-pages.mjs   (run after vite build)
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { EV_MODELS } from '../src/data/evModels.ts';
import { EV_CATALOG_LAST_UPDATED } from '../src/data/catalogMeta.ts';

const SITE = 'https://ev-compare-telangana.vercel.app';
const dist = new URL('../dist', import.meta.url).pathname;
const template = readFileSync(`${dist}/index.html`, 'utf8');

const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let count = 0;
for (const m of EV_MODELS) {
  const url = `${SITE}/bikes/${m.id}/`;
  const title = `${m.brand} ${m.name} On-Road Price Hyderabad — ${m.specs.realWorldCityRangeKm} km Range | EV Compare TG`;
  const desc = `${m.brand} ${m.name}: ${inr(m.pricing.exShowroom)} ex-showroom, ₹0 road tax in Telangana (G.O. Ms No. 41), ${m.specs.realWorldCityRangeKm} km real city range, ${m.specs.batteryCapacityKwh} kWh ${m.specs.batteryChemistry}. Compare with 53 other EVs.`;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${m.brand} ${m.name}`,
    brand: { '@type': 'Brand', name: m.brand },
    category: 'Electric Two-Wheeler',
    image: m.imageUrl,
    description: desc,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: Math.round(m.pricing.exShowroom),
      availability: 'https://schema.org/InStock',
      url
    }
  });

  const html = template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/>/s,
      `<meta name="description" content="${esc(desc)}" />`
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${url}" />`
    )
    .replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${esc(`${m.brand} ${m.name} — Telangana On-Road Price`)}" />`
    )
    .replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${url}" />`
    )
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${jsonLd}</script>
       <noscript><h1>${esc(`${m.brand} ${m.name}`)}</h1><p>${esc(desc)}</p>
       <p>Specifications verified against manufacturer filings, updated ${esc(EV_CATALOG_LAST_UPDATED)}.</p></noscript>`
    )
    .replace(
      '</body>',
      `<script>location.replace('/#m=detail&v=${m.id}');</script></body>`
    );

  mkdirSync(`${dist}/bikes/${m.id}`, { recursive: true });
  writeFileSync(`${dist}/bikes/${m.id}/index.html`, html);
  count++;
}

// Sitemap covering home + every model page
const urls = [
  `<url><loc>${SITE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  ...EV_MODELS.map(m =>
    `<url><loc>${SITE}/bikes/${m.id}/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  )
];
writeFileSync(
  `${dist}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);

console.log(`Generated ${count} model pages + sitemap (${EV_MODELS.length} bikes).`);
