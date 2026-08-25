// Prints the exact per-colour photo filenames the app auto-detects.
// Usage: node --experimental-strip-types scripts/list-color-assets.mjs [--missing]
import { EV_MODELS } from '../src/data/evModels.ts';

const slug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

let total = 0;
for (const m of EV_MODELS) {
  const colors = (m.colorOptions ?? []).slice(1); // colour #1 uses the primary photo
  if (colors.length === 0) continue;
  console.log(`\n${m.brand} ${m.name} (${m.id})`);
  for (const c of colors) {
    const file = `public/images/vehicles/${m.id}-${slug(c.name)}.jpg`;
    total++;
    console.log(`  ${file}   ← ${c.name}`);
  }
}
console.log(`\n${total} colour photos enable real per-colour previews.`);
