# EV Compare Telangana

Decision-support web app for buying electric two-wheelers in Telangana, India. Compare 54 vehicles
(53 EVs across 22 brands + Honda Activa 6G petrol benchmark) with state-specific pricing, physics-based
range simulation, and total-cost-of-ownership modeling.

**Live**: https://ev-compare-telangana.vercel.app

## Features

- **Catalog & compare** — 19+ Indian EV OEM lineups with verified specs, brand/category filters, and a
  2–4 vehicle comparison matrix with diff highlighting.
- **Telangana pricing engine** — on-road price per RTO (TG-01…TG-38) implementing G.O. Ms No. 41
  (100% road tax + registration waiver) and PM E-DRIVE subsidy (`src/utils/priceCalculator.ts`).
- **Range simulator** — Hyderabad climate (42 °C), LFP/NMC thermal behavior, payload, riding mode,
  terrain (`src/utils/rangeSimulator.ts`).
- **Savings & TCO** — petrol-vs-EV daily cost, 5-year TCO, breakeven payback timeline against the
  Activa 6G benchmark (`src/utils/savingsCalculator.ts`).
- **Charging tools** — 50+ stations across Hyderabad/Telangana plus 5 highway corridor feasibility
  planner with SoC stop scheduling (`src/utils/routePlannerEngine.ts`).
- **Smart buyer quiz** — 4-step recommendation engine (`src/utils/recommendationEngine.ts`).
- **Extras** — TSSPDCL tariff slab calculator, SBI green loan EMI simulator, motor vehicle tax schedule
  inspector, 4-pillar EV tech guide.

## Tech stack

React 19 · TypeScript ~6.0 · Vite 8 · Tailwind CSS v4 · lucide-react · Node.js native test runner.

## Getting started

```bash
npm install
npm run dev        # local dev server with HMR
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm test` | 463 tests across 122 suites (`node --test`) |
| `npm run lint` | oxlint |
| `npm run preview` | Serve the production build locally |

## Project layout

```
src/
├── types/          # EVModel, ChargingStation, TechTopic contracts
├── data/           # Catalog (54 models), RTOs, stations, corridors, tech knowledge
├── context/        # CompareContext — global app state, deep links, persistence
├── utils/          # Pricing / range / savings / recommendation / route engines
├── hooks/          # Shared React hooks (useEscapeKey)
└── components/     # UI: cards, grid views, comparison dock, 11 lazy-loaded modals
public/
├── images/vehicles/    # OEM studio photos with SVG silhouette fallbacks
├── manifest.webmanifest, sw.js, og-image.png …
tests/               # Unit, boundary, empirical-stress and workload suites
```

## Deep links

App state is mirrored into the URL hash for sharing/bookmarking:

- `#m=detail&v=<model-id>` — vehicle detail modal
- `#m=compare&compare=<id1,id2>` — comparison matrix preloaded
- `#rto=TG-09` — pins the RTO/district used by every price calculation
- `#m=charging&v=<id>&c=<corridor-id>` — route planner seeded with a vehicle/corridor

Modal keys: `detail`, `price`, `range`, `savings`, `wizard`, `charging`, `tech`, `tariff`, `loan`,
`tax`, `compare`.

## Data freshness

Fuel/tariff constants carry a manual verification date
(`TELANGANA_RATES_LAST_VERIFIED` in `src/data/telanganaRtoData.ts`, surfaced in the footer).
The catalog carries `EV_CATALOG_LAST_UPDATED` in `src/data/evModels.ts`. Update both when refreshing
figures — nothing is fetched live.

## Deployment

Vercel. Push to `main` (CI runs lint + tests + build via GitHub Actions), or deploy manually:

```bash
npx vercel --prod --yes
```

## Docs

- [`PROJECT.md`](PROJECT.md) — architecture, feature inventory, milestones
- [`PROJECT_HANDOVER_SPEC.md`](PROJECT_HANDOVER_SPEC.md) — full handover spec for new contributors/AI agents
- [`TEST_READY.md`](TEST_READY.md) / [`TEST_INFRA.md`](TEST_INFRA.md) — test strategy

## Agent skills

This repo vendors two project-local agent skills under `.opencode/skills/`:

- `frontend-design` — Anthropic's design-taste guidance for building distinctive UI
- `web-design-guidelines` — Vercel Web Interface Guidelines audit (vendored snapshot, works offline)

## License

[MIT](LICENSE)
