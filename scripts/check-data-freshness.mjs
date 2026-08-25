// Fails when any data freshness date is older than STALE_DAYS.
// Usage: node scripts/check-data-freshness.mjs
import { readFileSync } from 'node:fs';

const STALE_DAYS = 45;
const fresh = JSON.parse(readFileSync(new URL('../src/data/freshness.json', import.meta.url), 'utf8'));
const now = Date.now();
const stale = [];

for (const [key, date] of Object.entries(fresh)) {
  if (key.startsWith('_')) continue;
  const age = (now - new Date(date).getTime()) / 86_400_000;
  if (age > STALE_DAYS) stale.push(`${key}: verified ${date} (${Math.round(age)} days ago)`);
}

if (stale.length > 0) {
  console.error('STALE DATA — re-verify and update src/data/freshness.json:');
  for (const s of stale) console.error(`  ✖ ${s}`);
  process.exit(1);
}
console.log(`All ${Object.keys(fresh).filter(k => !k.startsWith('_')).length} data freshness dates within ${STALE_DAYS} days.`);
