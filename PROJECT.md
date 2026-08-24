# Project: EV Compare Telangana — Comprehensive Catalog Overhaul & Authentic Imagery

## Architecture
- **Framework**: React 19 + TypeScript ~6.0.2 + Vite 8 + Tailwind CSS v4
- **State & Data Flow**:
  - `src/types/ev.ts`: Strict TypeScript type definitions for `EVModel`, `EVSpecs`, `EVPrice`, `BatteryChemistry`, `VehicleCategory`, `RTOInfo`.
  - `src/data/evModels.ts`: Authoritative vehicle catalog data across all 19 Indian EV manufacturers and ICE benchmark with 41 unique, authentic model-matching image URLs.
  - `src/utils/vehicleImagery.ts`: Model-specific SVG silhouette vector artwork generator for 10 distinct styling archetypes with brand accent colors.
  - `src/components/VehicleImage.tsx`: Unified resilient vehicle image component with progressive loading and automatic fallback to model silhouette SVG.
  - `src/utils/priceCalculator.ts`: Telangana On-Road Price engine implementing G.O. Ms No. 41 (100% Road Tax & Registration waiver) and PM E-DRIVE subsidy.
  - `src/utils/rangeSimulator.ts`: Hyderabad climate (42°C heat, LFP vs NMC thermal degradation), payload, riding mode, and terrain physics simulator.
  - `src/utils/savingsCalculator.ts`: Petrol vs EV ROI payback engine with 5-year TCO against Honda Activa 6G and equivalent ICE bikes.
  - `src/utils/recommendationEngine.ts`: 4-step buyer recommendation wizard.
  - `src/components/`: Modular UI components (HeroSearch, VehicleGrid, VehicleCard, CompareMatrix, CompareFloatingBar, VehicleDetailModal, TelanganaPriceModal, RangeSimulatorModal, SavingsCalculatorModal, SmartWizardModal).

## Code Layout
- `src/types/ev.ts`: TypeScript contracts and interfaces
- `src/data/evModels.ts`: Catalog dataset containing all 19 OEM lineups with zero generic image recycling
- `src/utils/vehicleImagery.ts`: Model-specific silhouette SVG generator & archetype mappings
- `src/components/VehicleImage.tsx`: Unified image component with error fallback
- `src/components/VehicleCard.tsx`: Tabular spec card with range gauge, color swatches, EMI estimate
- `src/components/VehicleGrid.tsx`: Filterable vehicle grid with active filter chips & sorting
- `src/components/HeroSearch.tsx`: 19-brand OEM filter carousel, category segment tabs, search bar
- `src/components/CompareMatrix.tsx`: Side-by-side comparison modal (2-4 models) with diff highlight and vehicle avatars
- `src/components/CompareFloatingBar.tsx`: Sticky 4-slot bottom dock with vehicle avatars
- `src/components/VehicleDetailModal.tsx`: Comprehensive vehicle technical spec sheet
- `src/components/TelanganaPriceModal.tsx`: Itemized Telangana on-road price breakdown
- `src/components/RangeSimulatorModal.tsx`: Interactive range physics simulator
- `src/components/SavingsCalculatorModal.tsx`: 5-year TCO & payback timeline calculator
- `src/components/SmartWizardModal.tsx`: 4-step personalized recommendation quiz
- `tests/`: Node.js test runner suites covering unit, boundary, empirical, and E2E scenarios

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Complete 19 OEM Lineups | Exhaustive model coverage across Ola, Ather, TVS, Bajaj, Revolt, Ultraviolette, Hero Vida, River, Oben, Matter, Raptee, Pure EV, Kinetic Green, Ampere, Kabira, Komaki, Hop, Tork, BGauss | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Verified Technical Specifications | Accurate battery kWh, LFP/NMC chemistry, real city range, ARAI range, peak power, torque, 0-40 sprint, top speed, charging times, boot/ground clearance | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Model-Specific Authentic Imagery | Distinct, model-matching HTTPS visual assets with zero generic placeholder recycling across all models (41 unique URLs) | M2 | ORIGINAL_REQUEST §R2 |
| 4 | Distinct Design Silhouettes & Archetypes | 10 distinct body styling archetypes (Naked Streetfighter, Supersport, Cruiser, Commuter Roadster, Retro Metal Scooter, Sporty Scooter, Family Comfort Scooter, Rugged SUV Scooter, Heavy-Duty Moped, ICE Scooter) | M2 | ORIGINAL_REQUEST §R2 |
| 5 | Resilient Vector Fallback Architecture | Unified `VehicleImage` component + model-specific SVG silhouette generator for 100% offline & CDN resilience | M2 | ORIGINAL_REQUEST §R2 |
| 6 | 19-Brand OEM Filter Carousel | 1-click brand filtering across all 18+ authentic Indian manufacturers with dynamic model counts | M3 | ORIGINAL_REQUEST §R1, R3 |
| 7 | Category Segment Tabs & Quick Filters | Dynamic count badges for All, 🏍️ Motorcycles, 🛵 Scooters; quick filter toggles (Removable Battery, Fast Charging, Boot >30L, Budget <₹1L) | M3 | ORIGINAL_REQUEST §R1, R3 |
| 8 | Tabular Spec Cards & Swatches | Tabular vehicle card with brand badge, color swatches, dual-tone range gauge, 4-cell performance grid, Telangana price box | M3 | ORIGINAL_REQUEST §R2, R3 |
| 9 | Side-by-Side Comparison Matrix | Full-screen 2-4 vehicle diffing modal with diff highlight toggle, winner detection, and vehicle image thumbnails | M3 | ORIGINAL_REQUEST §R3 |
| 10 | Floating Bottom Dock | Sticky 4-slot FIFO bottom dock with vehicle avatars, remove buttons, and comparison launch | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Physics Range & Weather Simulator | Multi-factor range calculator with Hyderabad 42°C heat, LFP/NMC thermal coefficients, payload, riding modes, terrain | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Petrol vs EV ROI Payback Engine | 5-year TCO bar charts, monthly cash savings, and breakeven payback timeline against Honda Activa 6G and ICE bikes | M3 | ORIGINAL_REQUEST §R3 |
| 13 | 4-Step Smart Recommendation Wizard | 4-step buyer questionnaire matching commute distance, apartment charging access, priority, and budget | M3 | ORIGINAL_REQUEST §R3 |
| 14 | E2E Testing Suite (Tiers 1-4) | Comprehensive opaque-box test suite published via `TEST_READY.md` covering all 19 brands, specs, imagery uniqueness, and calculations | E2E Track | ORIGINAL_REQUEST §R4 |
| 15 | 100% Test Pass & Clean Build | All test suites passing cleanly with zero errors on `npm test` (442 tests) and `npm run build` | M4 | ORIGINAL_REQUEST §R4 |
| 16 | Adversarial Coverage Hardening (Tier 5) | Adversarial empirical stress testing on catalog invariants, pricing formulas, and image resilience | M4 | Project Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Suite Track | Design & implement opaque-box test suite (Tiers 1-4) deriving from requirements; publish `TEST_READY.md` | Survey | DONE |
| M1 | Catalog Data Overhaul | Expand `src/data/evModels.ts` to cover complete model lineages across all 19 OEMs with verified specs and pricing | Survey | DONE |
| M2 | Authentic Imagery & Fallback System | Implement `src/utils/vehicleImagery.ts`, `src/components/VehicleImage.tsx`, replace placeholder URLs with authentic distinct URLs | M1 | DONE |
| M3 | UI Integration & Brand Filtering | Integrate `VehicleImage` in all components, verify 19-brand carousel, category tabs, comparison matrix thumbnails, modals | M1, M2 | DONE |
| M4 | Final Milestone: 100% E2E Pass & Adversarial Hardening | Phase 1: Pass 100% E2E tests (Tiers 1-4). Phase 2: Tier 5 Adversarial Coverage Hardening with Challenger | E2E, M1, M2, M3 | DONE |

## Interface Contracts
### Vehicle Data Schema (`src/types/ev.ts` <-> `src/data/evModels.ts`)
- `EVModel`: `{ id: string, name: string, brand: string, tagline: string, category: 'scooter' | 'motorcycle', pricing: EVPrice, specs: EVSpecs, warranty: EVWarranty, features: string[], pros: string[], cons: string[], badges: string[], rating: number, reviewCount: number, imageUrl: string, colorOptions: EVColorOption[], idealFor: string, launchYear: number, madeInIndia: boolean, isIceBenchmark?: boolean, equivalentPetrolBenchmark?: EquivalentPetrolBenchmark }`
- Every `imageUrl` must be a valid HTTPS URL parseable by `new URL()`.
- Every `colorOptions` array must have $\ge 2$ colors with 6-digit hex codes (`#RRGGBB`).
- Existing model IDs (`ather-rizta-z-37`, `ola-s1-pro-gen2`, `tvs-iqube-s-34`, `bajaj-chetak-premium-32`, `hero-vida-v1-pro`, `ultraviolette-f77-mach2`, `river-indie-40`, `honda-activa-6g`) preserved verbatim.

### Vehicle Imagery & Fallback API (`src/utils/vehicleImagery.ts` <-> UI Components)
- `getVehicleDesignSilhouette(model: EVModel): VehicleSilhouetteArchetype`: Returns one of `'supersport'` | `'streetfighter'` | `'cruiser'` | `'commuter-roadster'` | `'sporty-scooter'` | `'retro-metal-scooter'` | `'family-comfort-scooter'` | `'rugged-suv-scooter'` | `'heavy-duty-moped'` | `'ice-scooter'`.
- `generateVehicleSilhouetteSvg(model: EVModel): string`: Generates an inline SVG data URI representing the exact model silhouette with brand accent coloring.
- `VehicleImage` component props: `{ model: EVModel, className?: string, alt?: string, priority?: boolean, showBadge?: boolean }`.
