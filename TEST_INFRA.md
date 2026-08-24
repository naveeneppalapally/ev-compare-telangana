# E2E Test Infrastructure & Test Harness Architecture
## Electric Two-Wheeler Comparison & Decision Engine (Telangana Edition)

### 1. Overview & Architecture
The E2E Test Harness provides comprehensive, requirement-driven, opaque-box testing for the Electric Two-Wheeler Comparison & Decision Engine. It exercises pure data contracts, all 19 OEM manufacturer lineups, 41 vehicle models, math & physics calculation engines, visual asset and SVG fallback systems, simulated UI state flows, and realistic Telangana buyer workloads.

The test infrastructure runs natively on Node.js using `node:test` and `node:assert/strict`, enabling rapid, deterministic, zero-dependency test execution with full TypeScript support via `--experimental-strip-types`.

### 2. Test Execution Commands
- **Full Test Suite**: `npm test`
  - Equivalent direct command: `node --test --experimental-strip-types tests/**/*.test.ts`
- **E2E 19-OEM Lineup & Taxonomy**: `node --test --experimental-strip-types tests/e2e-catalog-oem-lineup.test.ts`
- **E2E Imagery Uniqueness & Fallback**: `node --test --experimental-strip-types tests/e2e-imagery-uniqueness.test.ts`
- **Tier 1 (Feature Coverage)**: `node --test --experimental-strip-types tests/tier1-feature-coverage.test.ts`
- **Tier 2 (Boundary & Corner Cases)**: `node --test --experimental-strip-types tests/tier2-boundary-corner.test.ts`
- **Tier 3 (Cross-Feature Workflows)**: `node --test --experimental-strip-types tests/tier3-cross-feature.test.ts`
- **Tier 4 (Real-World Workloads)**: `node --test --experimental-strip-types tests/tier4-real-world-workload.test.ts`
- **Build Verification**: `npm run build`
- **Lint Check**: `npm run lint`

### 3. Test Suite Directory Layout
```
ev-compare-telangana/
├── tests/
│   ├── e2e-catalog-oem-lineup.test.ts     # E2E 19 Indian EV OEMs + Benchmark, Specs, G.O. Ms No. 41
│   ├── e2e-imagery-uniqueness.test.ts     # E2E Visual Asset HTTPS, 9 Archetypes, Anti-Recycling, Fallbacks
│   ├── tier1-feature-coverage.test.ts     # Tier 1: >=5 tests per feature (Features 1-17)
│   ├── tier2-boundary-corner.test.ts      # Tier 2: >=5 boundary/corner tests per feature (Features 1-17)
│   ├── tier3-cross-feature.test.ts        # Tier 3: Cross-feature interactions & state pipelines
│   ├── tier4-real-world-workload.test.ts  # Tier 4: >=10 realistic Telangana buyer persona workloads
│   ├── m1-core-engines.test.ts            # M1 Unit & Mathematical Invariants
│   ├── m1-adversarial-challenger.test.ts  # M1 Adversarial Challenger Suite
│   ├── m1-challenger2-empirical.test.ts   # M1 Empirical Monte Carlo Matrix
│   ├── m2-ui-components.test.ts           # M2 Component Contracts & State
│   ├── m2-challenger1-empirical-stress.ts # M2 Comparison & Matrix Stress
│   ├── m2-challenger2-empirical.test.ts   # M2 Catalog & Filtering Matrix
│   ├── m3-challenger1-range-savings.test.ts # M3 Range Physics & Payback Multipliers
│   └── m3-challenger2-empirical-quiz.test.ts # M3 1,152-Permutation Quiz Engine
```

### 4. 4-Tier Methodology Implementation

#### Tier 1: Comprehensive Feature Coverage & OEM Lineups
- **19 Indian EV OEMs + Simple Energy + Honda Benchmark**: Complete brand taxonomy and active model verification across Ola, Ather, TVS, Bajaj, Revolt, Ultraviolette, Hero Vida, River, Oben, Matter, Raptee, Pure EV, Kinetic Green, Ampere, Kabira, Komaki, Hop, Tork, BGauss.
- **Categorical Partitioning**: Exact division between 23 Electric Motorcycles and 18 Scooters (17 EV + 1 ICE baseline).
- **Verified Specifications**: Battery kWh, chemistry, motor power, torque, 0-40 sprint, top speed, ARAI vs real city range, charging times, boot/ground clearance, warranties, features, pros, and cons.
- **Image URL Validity**: 100% valid HTTPS URLs parseable by URL constructor.

#### Tier 2: Boundary & Corner Cases
- **Battery Capacity Boundaries**: 2.0 kWh (Kinetic E-Luna) to 16.0 kWh (Ola Roadster Pro 16).
- **Chemistry Validation**: NMC, LFP, Dual Removable NMC, Fixed LFP, and N/A (Petrol ICE).
- **Range Calculations**: ARAI $\ge$ Real Eco $\ge$ Real City $\ge$ Real Highway.
- **PM E-DRIVE Subsidy Boundaries**: $\le ₹1.5\text{L}$ cap eligible for up to ₹10,000; $> ₹1.5\text{L}$ capped at ₹0.
- **G.O. Ms No. 41 Zero Road Tax**: ₹0 road tax and ₹0 registration fee across all 38 RTOs (TG-01 to TG-38).
- **Color Swatches**: $\ge 2$ colors per vehicle with valid `#RRGGBB` hex format.

#### Tier 3: Cross-Feature Interactions & Multi-Modal State Pipelines
- **Comparison Matrix Diffing**: 2 to 4 vehicle selection, diff calculation across specs, winner detection.
- **Range Physics Simulator**: Multi-factor model covering Eco/City/Sport/Hyper modes, Solo/Pillion/Luggage payloads, Smooth/Stop-and-Go/Highway traffic, Hyderabad 42°C summer heat (LFP 0.94x vs NMC 0.88x), and Flat/Flyover terrain.
- **5-Year TCO & Payback Engine**: Real-world TCO and fuel savings against Honda Activa 6G benchmark.
- **Floating Dock & Modal Avatars**: 4-slot FIFO dock preserving avatars, labels, and state transitions.

#### Tier 4: Real-World Telangana Buyer Workload Scenarios
1. **Hitec City IT Commuter**: High-rise apartment resident without parking socket (removable battery vs 120+ km range).
2. **Old City Delivery Executive**: Charminar/Begum Bazaar courier riding 120 km/day in peak summer with LFP durability.
3. **Secunderabad Family Household**: Dual-rider grocery runs requiring $\ge 30\text{L}$ boot space.
4. **Highway Inter-District Commuter**: Hyderabad to Warangal / Suryapet on NH-65 at 90+ km/h sustained speed.

### 5. Verification Quality Gates
- `npm run build`: Exit code 0, 0 TypeScript errors.
- `npm run lint`: 0 lint errors.
- `npm test`: 100% test pass rate across all 439 tests (108 suites).
