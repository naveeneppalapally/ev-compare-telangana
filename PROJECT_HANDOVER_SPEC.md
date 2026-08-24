# EV Compare Telangana — Complete Project Handover & Architecture Document

> **Live Production URL**: [https://ev-compare-telangana.vercel.app](https://ev-compare-telangana.vercel.app)  
> **GitHub Repository**: [https://github.com/naveeneppalapally/ev-compare-telangana](https://github.com/naveeneppalapally/ev-compare-telangana)  
> **Primary Technology Stack**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Node.js Native Test Runner  
> **Test Coverage**: 463 / 463 automated unit & empirical tests passing (100%)

---

## 1. Project Overview & Vision

**EV Compare Telangana** is an authentic, production-grade automotive comparison, financial modeling, and decision-support web application specifically tailored for Indian and Telangana two-wheeler buyers.

Unlike generic car/bike aggregators, this application was engineered from the ground up with:
1. **100% Authentic Indian EV Specifications & Genuine Assets**: No placeholder models, no synthetic filler names, and genuine manufacturer studio photos.
2. **Telangana EV Policy (G.O. Ms No. 41)**: Automatic 100% Road Tax and Registration Fee exemptions calculated across all 38 Telangana RTO zones (TG-01 to TG-38).
3. **Hyper-Localized Financial Engines**: Real-time Hyderabad petrol price (`₹109.66/L`), TSSPDCL domestic telescopic power tariffs (`₹7.50/kWh`), SBI Green Loan EMI rates (8.5%), and true 5-year Total Cost of Ownership (TCO) vs. the benchmark Honda Activa 6G.
4. **Physics-Based Range Simulation**: Accounts for Deccan plateau summer heat (>38°C–45°C), pillion loads, traffic conditions, and riding modes.
5. **Live Telangana Charging Station Hub & Highway Route Simulator**: 50+ verified fast charging stations across Hyderabad and 5 major inter-district highway corridors (Warangal, Vijayawada, Kurnool/Bengaluru, Nizamabad, and the 158 km ORR Expressway Loop).
6. **4-Pillar Interactive EV Technology Guide**: Deep engineering explanations for On-Board Chargers (OBC), LFP vs NMC battery chemistries in summer heat, liquid cooling, and gearboxes with 1-click contextual tooltips on all vehicle cards.

---

## 2. Directory Structure & Key Files

```
ev-compare-telangana/
├── public/
│   └── images/
│       └── vehicles/                  # Genuine OEM studio .jpg photos for all 54 catalog models
├── src/
│   ├── types/
│   │   ├── ev.ts                      # Core EVModel, Specs, Warranty, Pricing types
│   │   ├── charging.ts                # ChargingStation, HighwayCorridor, RoutePlan types
│   │   └── techExplainer.ts           # TechTopic, TechPillar, ComparisonRow types
│   ├── data/
│   │   ├── evModels.ts                # Master catalog of 54 vehicles (53 EVs + 1 Activa 6G)
│   │   ├── telanganaRtoData.ts        # All 38 Telangana RTO codes, district rates & localities
│   │   ├── telanganaChargingData.ts   # 50+ verified stations in Hyderabad & Telangana
│   │   ├── highwayCorridorsData.ts    # 5 major Telangana highway corridors with waypoints
│   │   └── evTechKnowledge.ts         # 4-pillar educational guide dataset
│   ├── context/
│   │   └── CompareContext.tsx         # Global state provider (Catalog, Filters, Modals, RTO)
│   ├── utils/
│   │   ├── priceCalculator.ts         # Telangana on-road price & G.O. Ms No. 41 tax waiver engine
│   │   ├── savingsEngine.ts           # Petrol vs EV monthly savings, 5-yr TCO & ROI payback
│   │   ├── rangePhysicsEngine.ts      # Temperature, pillion weight & terrain range simulator
│   │   ├── recommendationEngine.ts    # 4-step buyer recommendation scoring algorithm
│   │   ├── routePlannerEngine.ts      # Inter-district highway battery feasibility & stop scheduler
│   │   └── vehicleImagery.ts          # Image fallbacks and helper utilities
│   ├── components/
│   │   ├── Header.tsx                 # Sticky navigation, RTO picker, policy ticker & CTA triggers
│   │   ├── HeroSearch.tsx             # Hero search bar, brand strip, view switcher & filter chips
│   │   ├── VehicleGrid.tsx            # Responsive grid rendering VehicleCards
│   │   ├── VehicleCard.tsx            # Tabular spec card, range meter, tech badges & CTAs
│   │   ├── VehicleImage.tsx           # Reliable image loader with SVG fallback
│   │   ├── TechTooltip.tsx            # 1-click clickable badges opening tech explainers
│   │   ├── BrandShowcaseView.tsx      # Brand-wise grouped lineup browsing view
│   │   ├── BudgetTierView.tsx         # Budget tier category browsing view (<₹1L, ₹1L-₹1.5L, etc.)
│   │   ├── CompareMatrix.tsx          # Full-screen side-by-side comparison modal (2-4 vehicles)
│   │   ├── CompareFloatingBar.tsx     # Sticky bottom tray with selected models & compare button
│   │   ├── VehicleDetailModal.tsx     # Full modal view with specs, petrol benchmark & tech dive
│   │   ├── TelanganaPriceModal.tsx    # Itemized RTO pricing breakdown & tax waiver calculator
│   │   ├── RangeSimulatorModal.tsx    # Interactive physics range slider modal
│   │   ├── SavingsCalculatorModal.tsx # Interactive 5-year TCO & payback graph modal
│   │   ├── SmartWizardModal.tsx       # 4-step buyer quiz recommendation modal
│   │   ├── ChargingRoutePlannerModal.tsx # Dual-mode Station Explorer & Highway Route Planner
│   │   ├── EVTechExplorerModal.tsx    # 4-pillar engineering technology guide modal
│   │   ├── TSSPDCLTariffModal.tsx     # Official LT-I telescopic electricity slab calculator
│   │   ├── GreenLoanCalculatorModal.tsx # SBI Green Loan & bank EMI simulator
│   │   ├── TelanganaTaxInspectorModal.tsx # Statutory motor vehicle tax schedule inspector
│   │   └── Footer.tsx                 # Comprehensive Telangana footer with disclaimer & links
│   ├── App.tsx                        # Main application layout & modal wire-up
│   ├── main.tsx                       # React DOM entry point
│   └── index.css                      # Tailwind CSS base and utility directives
└── tests/                             # 122 test suites with 463 passing unit/boundary tests
```

---

## 3. Catalog Data Model (54 Verified Models)

### Brands Represented:
1. **Ola Electric**: Roadster Pro (16 & 8 kWh), Roadster (6, 4.5 & 3.5 kWh), Roadster X (4.5, 3.5 & 2.5 kWh), S1 Pro Gen 2, S1 Air, S1 X+, S1 X (4, 3 & 2 kWh)
2. **Ather Energy**: 450 Apex, 450X Gen 3 (3.7 & 2.9 kWh), 450S, Rizta Z (3.7 & 2.9 kWh), Rizta S (2.9 kWh)
3. **TVS Motor**: iQube ST (5.1 & 3.4 kWh), iQube S (3.4 kWh), iQube (2.2 kWh), TVS X
4. **Bajaj Auto**: Chetak Premium, Chetak Urbane / 3201, Chetak 2901, Chetak Blue 3202
5. **Revolt Motors**: RV400 Stealth/Standard, RV400 BRZ, RV1+, RV1, RV BlazeX
6. **Ultraviolette Automotive**: Concept X47 (10.3 kWh), F77 Mach 2 Recon (10.3 kWh), F77 Mach 2 Original (7.1 kWh), F99 Factory Racing Platform (90 kW)
7. **Hero Vida**: Vida V1 Pro, Vida V1 Plus
8. **River**: River Indie (SUV of scooters, 43L boot, 14-inch wheels)
9. **Oben Electric**: Oben Rorr (4.4 kWh LFP), Oben Rorr EZ (4.4, 3.4 & 2.6 kWh LFP)
10. **Matter Motor**: Matter AERA 5000+, Matter AERA 5000 (4-speed manual gearbox, liquid cooled)
11. **Raptee HV**: Raptee HV T30 (High-Voltage 240V, CCS2 car DC fast charging)
12. **Orxa Energies**: Orxa Mantis (8.9 kWh Streetfighter, aluminum honeycomb frame)
13. **Pure EV**: ecoDryft 350, ecoDryft, eTryst 350 (IIT Hyderabad incubated)
14. **Kinetic Green**: E-Luna Prime, E-Luna Standard, Zulu
15. **Ampere / Greaves**: Ampere Nexus ST, Nexus EX, Primus, Magnus EX
16. **Kabira Mobility**: KM5000 (11.6 kWh cruiser), KM3000 Mk2 (supersport), KM4000 Mk2 (streetfighter)
17. **Komaki**: Ranger (cruiser), Venice Classic
18. **Hop Electric**: Hop OXO (100 km/h commuter motorcycle)
19. **Tork Motors**: Kratos R
20. **BGauss**: RUV 350, C12i Max
21. **Bounce**: Bounce Infinity E.1+ (swappable battery)
22. **Benchmark ICE**: Honda Activa 6G (109.5cc petrol scooter)

---

## 4. Key Calculation Formulas & Physics Engines

### 1. Telangana On-Road Price Engine (`src/utils/priceCalculator.ts`)
- **Ex-Showroom Net**: `exShowroom - pmEdriveSubsidy`
- **Road Tax Exemption (G.O. Ms No. 41)**:
  - Standard petrol two-wheeler life tax in Telangana is 9% (<₹50k) to 12% (>₹50k).
  - For EVs, `roadTax = ₹0` and `registrationFee = ₹0`.
  - **Tax Waiver Savings**: `Math.round(exShowroomNet * 0.12) + ₹300 (Reg)`.
- **Net Telangana On-Road Price**:
  `exShowroomNet + 5YrInsurance + HSRPLaserFitment (₹400) + Handling (₹1,500) + OptionalCharger`

### 2. Petrol vs. EV Savings Engine (`src/utils/savingsEngine.ts`)
- **Daily Commute Distance**: `D` (km)
- **Petrol Cost**: `(D / 45 kmpl) * ₹109.66/L`
- **EV Cost**: `(D * 32 Wh/km / 1000 / 0.88 efficiency) * ₹7.50/kWh`
- **Net Daily Savings**: `Petrol Cost - EV Cost`
- **5-Year Maintenance Difference**: Petrol servicing (oil/clutch ~₹18,000) vs. EV (pad wear ~₹3,500).
- **Payback Timeline**: `(EV Net Price - Activa Net Price) / Monthly Savings`.

### 3. Highway Route Simulation Engine (`src/utils/routePlannerEngine.ts`)
- **Highway Range Factor**:
  - `Eco (55 km/h)`: `0.82 * baseCityRange`
  - `Balanced (65 km/h)`: `0.75 * baseCityRange`
  - `Expressway (75+ km/h)`: `0.68 * baseCityRange`
- **Waypoint SoC Simulation**: Iterates through corridor waypoints, tracks energy used (`Wh/km = kWh * 1000 / highwayRange`), triggers a mandatory stop if battery drops below 15% before next waypoint, and selects the optimal compatible station.

---

## 5. UI/UX Design System Guidelines

- **Theme Style**: Clean **Apple / Rivian Light-Neutral Aesthetic**
- **Surfaces**: `bg-white` main background, `bg-neutral-50` secondary card container, `border-neutral-200` crisp dividers.
- **Typography**: Clean sans-serif headings with high contrast `text-neutral-900`, neutral labels `text-neutral-500`, and monospace numbers `font-mono font-bold`.
- **Action Buttons**: `bg-neutral-900 hover:bg-neutral-800 text-white rounded-full` for primary actions; `bg-neutral-100 text-neutral-800 border border-neutral-200` for filter pills.
- **Accents**: Subtle green/emerald badge highlights for G.O. Ms No. 41 tax waiver and battery charging indicators.

---

## 6. How to Run, Test, and Deploy

### 1. Install & Run Locally
```bash
# Clone the repository
git clone https://github.com/naveeneppalapally/ev-compare-telangana.git
cd ev-compare-telangana

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Execute Automated Test Suites
```bash
# Run all 463 tests across 122 suites
npm test

# Run a specific test suite
node --test tests/charging-route-planner.test.ts
node --test tests/ev-tech-explorer.test.ts
```

### 3. Build & Deploy
```bash
# Build production bundle with TypeScript checking
npm run build

# Deploy directly to Vercel
npx vercel --prod --yes
```

---

## 7. Recommended Next Steps / Expansion Ideas for Future AI Agents

1. **Solar Rooftop TSSPDCL Net-Metering Simulator**:
   - Add a calculator showing how setting up a 1 kW / 2 kW rooftop solar setup in Hyderabad reduces EV charging cost to ₹0/month.
2. **Community Crowdsourced Station Review & Status Check**:
   - Allow users to mark station charger status (working/occupied/offline) locally or via backend.
3. **Interactive 3D / 360° Color Customizer**:
   - Add three-quarter visual rotation views for flagship models like Ultraviolette F77 Mach 2 and Ather 450 Apex.
