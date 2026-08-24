import type { EVModel } from '../types/ev';

export const EV_CATALOG_LAST_UPDATED = "August 2026";

export const EV_MODELS: EVModel[] = [
  // ==========================================
  // 🏍️ ELECTRIC MOTORCYCLES (23 Indian Models)
  // ==========================================
  {
    id: 'ola-roadster-pro-16',
    name: 'Ola Roadster Pro (16.0 kWh)',
    brand: 'Ola Electric',
    tagline: "India's Hyper-Performance Electric Motorcycle — 194 km/h & 579 km IDC Range",
    category: 'motorcycle',
    pricing: {
      exShowroom: 249999,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 9500,
      handlingAndDocsEst: 2000
    },
    specs: {
      batteryCapacityKwh: 16.0,
      usableBatteryCapacityKwh: 15.2,
      batteryChemistry: 'NMC 21700',
      isRemovableBattery: false,
      araiRangeKm: 579,
      realWorldEcoRangeKm: 480,
      realWorldCityRangeKm: 410,
      realWorldHighwayRangeKm: 320,
      topSpeedKmh: 194,
      accel0To40Kmh: 1.2,
      accel0To60Kmh: 1.9,
      motorPeakPowerKw: 52.0,
      motorRatedPowerKw: 26.0,
      motorPeakTorqueNm: 105,
      driveType: 'Chain',
      chargingTime0To80: '3h 30m (Home 3kW) / 35m (Hypercharger)',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: true,
      fastChargingRate: '100 km / 10 mins on Ola Hypercharger',
      bootSpaceLiters: 0,
      frunkSpaceLiters: 8,
      ridingModes: ['Eco', 'Normal', 'Sport', 'Hyper', 'Track'],
      brakes: 'Dual Disc Front (320mm), Rear Disc (240mm) with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS + Cornering ABS',
      kerbWeightKg: 185,
      groundClearanceMm: 180,
      seatHeightMm: 810,
      wheelSizeInches: 17,
      touchscreen: true,
      displaySizeInches: 10.0,
      displayType: '10-inch Full Color Touchscreen with ADAS',
      connectivity: ['MoveOS 5', 'Level 2 ADAS (Collision Warning, ACC)', 'Kruti AI', 'Proximity Unlock', '5G Telematics']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 100000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      'Monstrous 52 kW (70 bhp) peak power motor reaching 0-40 km/h in 1.2 seconds',
      'Gigantic 16.0 kWh battery pack with 579 km IDC certified range',
      'Segment-first 10-inch touchscreen with integrated ADAS camera and radar',
      'Dual USD front forks, rear monoshock, and dual-channel cornering ABS',
      'Four dedicated track telemetry modes and customizable launch control'
    ],
    pros: [
      'Unmatched top speed (194 km/h) and acceleration in Indian two-wheeler market',
      'True 350-400+ km real-world highway touring range with zero range anxiety',
      'Massive 10-inch smart cockpit with full ADAS safety features'
    ],
    cons: [
      'Premium price point (₹2.6L on-road)',
      'Heavy kerb weight (185 kg)'
    ],
    badges: ['194 km/h Hyperbike', '16 kWh Battery', '579 km IDC', 'ADAS Level 2', '52 kW Motor'],
    rating: 4.9,
    reviewCount: 420,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/roadster-pro/source/roadster-pro68da2b23616da.jpg?model=ola-roadster-pro-16&v=2026',
    colorOptions: [
      { name: 'Stealth Carbon', hex: '#18181b' },
      { name: 'Cyber White', hex: '#f8fafc' },
      { name: 'Liquid Silver', hex: '#94a3b8' }
    ],
    idealFor: 'Performance bikers, inter-city Telangana highway tourers, track-day enthusiasts',
    launchYear: 2025,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "KTM Duke 390 (373cc)",
      "engineCc": 373,
      "petrolBhp": 43.5,
      "petrolTorqueNm": 37,
      "petrolMileageKmpl": 28,
      "petrolExShowroom": 310000,
      "petrolOnRoadTG": 372000,
      "classComparison": "390cc Performance Naked",
      "powerComparisonSummary": "EV delivers 70 bhp (52 kW) vs Duke 390's 43.5 bhp with instant 105 Nm torque"
    }
  },
  {
    id: 'ola-roadster-pro-8',
    name: 'Ola Roadster Pro (8.0 kWh)',
    brand: 'Ola Electric',
    tagline: 'Hyper-Performance Electric Naked Superbike — 154 km/h & 310 km IDC Range',
    category: 'motorcycle',
    pricing: {
      exShowroom: 199999,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 8200,
      handlingAndDocsEst: 1800
    },
    specs: {
      batteryCapacityKwh: 8.0,
      usableBatteryCapacityKwh: 7.6,
      batteryChemistry: 'NMC 21700',
      isRemovableBattery: false,
      araiRangeKm: 310,
      realWorldEcoRangeKm: 260,
      realWorldCityRangeKm: 220,
      realWorldHighwayRangeKm: 180,
      topSpeedKmh: 154,
      accel0To40Kmh: 1.6,
      accel0To60Kmh: 2.5,
      motorPeakPowerKw: 52.0,
      motorRatedPowerKw: 26.0,
      motorPeakTorqueNm: 105,
      driveType: 'Chain',
      chargingTime0To80: '2h 15m (Home 3kW) / 25m (Hypercharger)',
      chargingTime0To100: '3h 30m',
      fastChargingSupport: true,
      fastChargingRate: '100 km / 10 mins on Ola Hypercharger',
      bootSpaceLiters: 0,
      frunkSpaceLiters: 8,
      ridingModes: ['Eco', 'Normal', 'Sport', 'Hyper', 'Track'],
      brakes: 'Dual Disc Front (320mm), Rear Disc (240mm) with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS + Cornering ABS',
      kerbWeightKg: 168,
      groundClearanceMm: 180,
      seatHeightMm: 810,
      wheelSizeInches: 17,
      touchscreen: true,
      displaySizeInches: 10.0,
      displayType: '10-inch Full Color Touchscreen with ADAS',
      connectivity: ['MoveOS 5', 'Level 2 ADAS', 'Kruti AI', 'Proximity Unlock', '5G Telematics']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 100000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      'Same 52 kW peak motor as the 16 kWh variant with 0-40 km/h in 1.6 seconds',
      'Lighter 168 kg weight gives incredible flickability and rapid corner entry',
      '10-inch touchscreen with integrated ADAS safety warning system',
      'Dual USD front forks with adjustable damping'
    ],
    pros: [
      '₹50,000 more affordable with identical 52 kW peak powertrain performance',
      'Lighter weight gives sharper track handling and city agility',
      '220 km real-world city range is more than sufficient for weekly commutes'
    ],
    cons: [
      'No underseat boot storage',
      'Rear pillion seat is minimalist'
    ],
    badges: ['154 km/h Superbike', '8 kWh Battery', 'ADAS Tech', '52 kW Peak Power'],
    rating: 4.8,
    reviewCount: 290,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/roadster-pro/source/roadster-pro68da2b23616da.jpg?model=ola-roadster-pro-8&v=2026',
    colorOptions: [
      { name: 'Stealth Carbon', hex: '#18181b' },
      { name: 'Liquid Silver', hex: '#94a3b8' }
    ],
    idealFor: 'Sport riders who want superbike acceleration without the 16 kWh pack weight',
    launchYear: 2025,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "KTM Duke 390 (373cc)",
      "engineCc": 373,
      "petrolBhp": 43.5,
      "petrolTorqueNm": 37,
      "petrolMileageKmpl": 28,
      "petrolExShowroom": 310000,
      "petrolOnRoadTG": 372000,
      "classComparison": "390cc Performance Naked",
      "powerComparisonSummary": "EV delivers 70 bhp vs Duke 390's 43.5 bhp with 0-40 in 1.6s"
    }
  },
  {
    id: 'ola-roadster-60',
    name: 'Ola Roadster (6.0 kWh)',
    brand: 'Ola Electric',
    tagline: 'Modern Streetfighter Electric Motorcycle — 126 km/h & 248 km Range',
    category: 'motorcycle',
    pricing: {
      exShowroom: 139999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6100,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 6.0,
      usableBatteryCapacityKwh: 5.7,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 248,
      realWorldEcoRangeKm: 200,
      realWorldCityRangeKm: 175,
      realWorldHighwayRangeKm: 140,
      topSpeedKmh: 126,
      accel0To40Kmh: 2.2,
      motorPeakPowerKw: 13.0,
      motorRatedPowerKw: 7.0,
      motorPeakTorqueNm: 52,
      driveType: 'Chain',
      chargingTime0To80: '3h 15m (Home 15A)',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: true,
      fastChargingRate: '50 km / 15 mins on Ola Hypercharger',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'Normal', 'Sport', 'Hyper'],
      brakes: 'Front Disc (280mm), Rear Disc (220mm) with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS',
      kerbWeightKg: 145,
      groundClearanceMm: 175,
      seatHeightMm: 800,
      wheelSizeInches: 17,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Capacitive Touchscreen',
      connectivity: ['MoveOS 5', 'Turn-by-Turn Maps', 'Proximity Unlock', 'Hill Hold', 'Cruise Control']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      '13 kW peak power mid-drive motor with 126 km/h top speed',
      'Big 6.0 kWh battery pack giving true 175 km city range',
      '7-inch color touchscreen with navigation and cruise control',
      'Dual-channel ABS with diamond-cut 17-inch alloy wheels'
    ],
    pros: [
      'Outstanding price-to-battery ratio (6 kWh for under ₹1.4L ex-showroom)',
      'True 170+ km real-world city range and punchy 0-40 in 2.2s',
      '8-year battery warranty standard'
    ],
    cons: [
      'No underseat storage space',
      'Chain drive requires periodic lubrication'
    ],
    badges: ['6 kWh Big Battery', '126 km/h Speed', 'Dual-Channel ABS', '8-Yr Warranty'],
    rating: 4.7,
    reviewCount: 380,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/ola-electric-bike/source/ola-electric-bike68da2a3905058.jpg?model=ola-roadster-60&v=2026',
    colorOptions: [
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Racing Red', hex: '#dc2626' },
      { name: 'Electric Blue', hex: '#2563eb' }
    ],
    idealFor: 'Young professionals, college commuters, weekend highway riders',
    launchYear: 2025,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "TVS Apache RTR 160 4V (160cc)",
      "engineCc": 160,
      "petrolBhp": 17.55,
      "petrolTorqueNm": 14.73,
      "petrolMileageKmpl": 45,
      "petrolExShowroom": 135000,
      "petrolOnRoadTG": 162000,
      "classComparison": "160cc Streetfighter",
      "powerComparisonSummary": "EV delivers 17.4 bhp (13 kW) and 3.5x higher torque (52 Nm vs 14.7 Nm)"
    }
  },
  {
    id: 'ola-roadster-45',
    name: 'Ola Roadster (4.5 kWh)',
    brand: 'Ola Electric',
    tagline: 'Mid-Range Performance Streetfighter — 126 km/h & 190 km IDC Range',
    category: 'motorcycle',
    pricing: {
      exShowroom: 119999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5600,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 4.5,
      usableBatteryCapacityKwh: 4.2,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 190,
      realWorldEcoRangeKm: 155,
      realWorldCityRangeKm: 135,
      realWorldHighwayRangeKm: 110,
      topSpeedKmh: 126,
      accel0To40Kmh: 2.4,
      motorPeakPowerKw: 13.0,
      motorRatedPowerKw: 7.0,
      motorPeakTorqueNm: 52,
      driveType: 'Chain',
      chargingTime0To80: '2h 45m',
      chargingTime0To100: '3h 45m',
      fastChargingSupport: true,
      fastChargingRate: '50 km / 15 mins on Ola Hypercharger',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'Normal', 'Sport', 'Hyper'],
      brakes: 'Front Disc (280mm), Rear Disc (220mm) Dual ABS',
      brakingSafety: 'Dual-Channel ABS',
      kerbWeightKg: 138,
      groundClearanceMm: 175,
      seatHeightMm: 800,
      wheelSizeInches: 17,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Touchscreen',
      connectivity: ['MoveOS 5', 'Maps', 'Cruise Control', 'Proximity Unlock']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      '13 kW peak power mid-drive motor with 126 km/h top speed',
      'Dual-Channel ABS and 7-inch touch display at ₹1.2L ex-showroom',
      'Fast charging support on Ola Hypercharger network',
      'Regenerative braking with multiple ride modes'
    ],
    pros: [
      'Sweet spot price of ₹1.2L for a 126 km/h motorcycle with touchscreen and dual ABS',
      'Quick 2h 45m home recharge time',
      '8-year battery warranty'
    ],
    cons: [
      'No storage box included',
      'Exposed chain drive requires regular maintenance'
    ],
    badges: ['Dual ABS Under ₹1.2L', '126 km/h Speed', '7-inch Touchscreen', '8-Yr Warranty'],
    rating: 4.7,
    reviewCount: 310,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/ola-electric-bike/source/ola-electric-bike68da2a3905058.jpg?model=ola-roadster-45&v=2026',
    colorOptions: [
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Racing Red', hex: '#dc2626' }
    ],
    idealFor: 'Bikers wanting mid-range speed and high-tech touchscreen at low price',
    launchYear: 2025,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Bajaj Pulsar N160 (165cc)",
      "engineCc": 165,
      "petrolBhp": 16,
      "petrolTorqueNm": 14.65,
      "petrolMileageKmpl": 45,
      "petrolExShowroom": 132000,
      "petrolOnRoadTG": 158000,
      "classComparison": "160cc Streetfighter",
      "powerComparisonSummary": "EV matches 160cc power with instant torque delivery and ₹0 road tax"
    }
  },
  {
    id: 'ola-roadster-x-45',
    name: 'Ola Roadster X (4.5 kWh)',
    brand: 'Ola Electric',
    tagline: 'Affordable High-Range Commuter Motorcycle — 124 km/h & 200 km Range',
    category: 'motorcycle',
    pricing: {
      exShowroom: 99999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5200,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 4.5,
      usableBatteryCapacityKwh: 4.2,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 200,
      realWorldEcoRangeKm: 160,
      realWorldCityRangeKm: 135,
      realWorldHighwayRangeKm: 105,
      topSpeedKmh: 124,
      accel0To40Kmh: 2.8,
      motorPeakPowerKw: 11.0,
      motorRatedPowerKw: 5.5,
      motorPeakTorqueNm: 42,
      driveType: 'Hub / Chain',
      chargingTime0To80: '3h 30m',
      chargingTime0To100: '4h 45m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 750W / 15A charging',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'Normal', 'Sports'],
      brakes: 'Front Disc (240mm), Rear Drum with CBS',
      brakingSafety: 'CBS with Regenerative Braking',
      kerbWeightKg: 125,
      groundClearanceMm: 180,
      seatHeightMm: 795,
      wheelSizeInches: 18,
      touchscreen: false,
      displaySizeInches: 4.3,
      displayType: '4.3-inch Segmented Color LCD',
      connectivity: ['MoveOS 5', 'Turn-by-turn Navigation', 'Digital Key', 'Geo-Fencing']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      'Sub-₹1 Lakh price tag with massive 4.5 kWh battery',
      '124 km/h top speed with 11 kW motor',
      'Tall 18-inch front and 17-inch rear wheels for rough roads',
      'Combi-brake system with advanced regenerative stopping'
    ],
    pros: [
      'Disruptive price: 4.5 kWh pack under ₹1 Lakh ex-showroom',
      'High ground clearance (180mm) and 18-inch wheels handle Telangana rural roads effortlessly',
      'Generous 8-year / 80,000 km battery warranty'
    ],
    cons: [
      'Segmented LCD instead of full touchscreen',
      'Rear drum brake instead of disc'
    ],
    badges: ['Under ₹1 Lakh', '4.5 kWh Battery', '124 km/h Speed', '8-Yr Warranty'],
    rating: 4.6,
    reviewCount: 510,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/roadster-x/source/roadster-x68da2cbe0c5b5.jpg?model=ola-roadster-x-45&v=2026',
    colorOptions: [
      { name: 'Stealth Black', hex: '#18181b' },
      { name: 'Crimson Red', hex: '#ef4444' },
      { name: 'Silver Storm', hex: '#94a3b8' }
    ],
    idealFor: 'Commuters upgrading from 125cc-150cc petrol bikes looking for maximum value',
    launchYear: 2025,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda SP 125 / Pulsar 125 (125cc)",
      "engineCc": 125,
      "petrolBhp": 10.8,
      "petrolTorqueNm": 10.9,
      "petrolMileageKmpl": 55,
      "petrolExShowroom": 95000,
      "petrolOnRoadTG": 114000,
      "classComparison": "125cc Commuter Motorcycle",
      "powerComparisonSummary": "EV delivers 14.7 bhp vs 125cc petrol's 10.8 bhp with zero clutch fatigue"
    }
  },
  {
    id: 'ola-roadster-x-25',
    name: 'Ola Roadster X (2.5 kWh)',
    brand: 'Ola Electric',
    tagline: 'Most Affordable High-Speed Electric Motorcycle — ₹74,999 & 105 km/h Top Speed',
    category: 'motorcycle',
    pricing: {
      exShowroom: 74999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 4600,
      handlingAndDocsEst: 1300
    },
    specs: {
      batteryCapacityKwh: 2.5,
      usableBatteryCapacityKwh: 2.3,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 117,
      realWorldEcoRangeKm: 95,
      realWorldCityRangeKm: 80,
      realWorldHighwayRangeKm: 65,
      topSpeedKmh: 105,
      accel0To40Kmh: 3.3,
      motorPeakPowerKw: 7.0,
      motorRatedPowerKw: 3.5,
      motorPeakTorqueNm: 30,
      driveType: 'Hub',
      chargingTime0To80: '2h 15m',
      chargingTime0To100: '3h 15m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 15A socket',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'Normal', 'Sports'],
      brakes: 'Front Disc, Rear Drum CBS',
      brakingSafety: 'Front Disc CBS',
      kerbWeightKg: 112,
      groundClearanceMm: 180,
      seatHeightMm: 795,
      wheelSizeInches: 18,
      touchscreen: false,
      displaySizeInches: 4.3,
      displayType: '4.3-inch Digital LCD',
      connectivity: ['Digital Speedometer', 'MoveOS Connectivity', 'Digital Key', 'LED Headlamp']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      'Unbelievable ₹74,999 starting price tag',
      '105 km/h top speed beating 110cc petrol bikes',
      '18-inch front wheel for excellent stability',
      '8-year battery warranty standard'
    ],
    pros: [
      'Cheaper than a Honda Shine or Hero Splendor on-road in Telangana',
      '105 km/h top speed at entry price',
      '8-year battery warranty'
    ],
    cons: [
      '80 km real-world city range requires frequent charging',
      'No fast DC charging support'
    ],
    badges: ['Starts ₹74,999', '105 km/h Speed', '8-Yr Warranty', 'Splendor Killer'],
    rating: 4.6,
    reviewCount: 460,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/roadster-x/source/roadster-x68da2cbe0c5b5.jpg?model=ola-roadster-x-25&v=2026',
    colorOptions: [
      { name: 'Stealth Black', hex: '#18181b' },
      { name: 'Crimson Red', hex: '#ef4444' }
    ],
    idealFor: 'First-time bike buyers wanting lowest entry cost and 105 km/h speed',
    launchYear: 2025,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Hero Splendor Plus (97.2cc)",
      "engineCc": 97.2,
      "petrolBhp": 8.02,
      "petrolTorqueNm": 8.05,
      "petrolMileageKmpl": 65,
      "petrolExShowroom": 76000,
      "petrolOnRoadTG": 91000,
      "classComparison": "100cc Commuter Motorcycle",
      "powerComparisonSummary": "EV delivers nearly double the power (14.7 bhp vs 8.0 bhp) at ₹74,999"
    }
  },
  {
    id: 'revolt-rv1-plus-32',
    name: 'Revolt RV1+ (3.24 kWh Fast Charge)',
    brand: 'Revolt Motors',
    tagline: "India's Most Affordable Electric Commuter Bike — ₹99,990 & 1.5h Fast Charge",
    category: 'motorcycle',
    pricing: {
      exShowroom: 99990,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5100,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 3.24,
      usableBatteryCapacityKwh: 3.0,
      batteryChemistry: 'Removable LFP',
      isRemovableBattery: true,
      araiRangeKm: 160,
      realWorldEcoRangeKm: 130,
      realWorldCityRangeKm: 110,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 75,
      accel0To40Kmh: 4.1,
      motorPeakPowerKw: 2.8,
      motorRatedPowerKw: 2.1,
      motorPeakTorqueNm: 35,
      driveType: 'Chain',
      chargingTime0To80: '1h 30m (Fast Charger) / 3h 30m (Standard)',
      chargingTime0To100: '2h 15m (Fast Charger) / 4h 30m',
      fastChargingSupport: true,
      fastChargingRate: '0-80% in 90 mins with Revolt Fast Charger',
      bootSpaceLiters: 0,
      ridingModes: ['Eco (40 km/h)', 'City (55 km/h)', 'Sport (75 km/h)'],
      brakes: 'Front Disc (240mm), Rear Disc (240mm) with CBS',
      brakingSafety: 'Dual Disc Brakes + CBS',
      kerbWeightKg: 110,
      groundClearanceMm: 180,
      seatHeightMm: 790,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 6.0,
      displayType: '6-inch High Contrast Digital LCD',
      connectivity: ['MyRevolt App', 'Real-Time Battery Status', 'Reverse Mode', 'LED Headlamp']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 75000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Sub-₹1 Lakh price with dual disc brakes on both 17-inch wheels',
      'Fast charging capability: 0-80% in just 1 hour 30 mins',
      'High payload capacity (250 kg) engineered for daily Indian commute & deliveries',
      'Ultra-reliable LFP battery chemistry built for Telangana hot weather'
    ],
    pros: [
      'Dual disc brakes and LFP chemistry at an entry-level price point',
      'Removable battery pack is apartment-friendly',
      'Fast 90-minute charging'
    ],
    cons: [
      '75 km/h top speed (tuned for daily city utility)',
      'No artificial motorcycle exhaust sounds (exclusive to RV400)'
    ],
    badges: ['Entry Commuter ₹99k', '1.5h Fast Charge', 'Dual Disc Brakes', '250 kg Payload'],
    rating: 4.6,
    reviewCount: 390,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/revolt/rv1/source/rv169367efb328c0.jpg?model=revolt-rv1-plus-32&v=2026',
    colorOptions: [
      { name: 'Black Neon', hex: '#18181b' },
      { name: 'Cosmic Red', hex: '#dc2626' },
      { name: 'Titan White', hex: '#f8fafc' }
    ],
    idealFor: 'Daily office commuters, delivery professionals, students on a budget',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Hero Splendor Plus (97.2cc)",
      "engineCc": 97.2,
      "petrolBhp": 8.02,
      "petrolTorqueNm": 8.05,
      "petrolMileageKmpl": 65,
      "petrolExShowroom": 76000,
      "petrolOnRoadTG": 91000,
      "classComparison": "100cc Commuter Motorcycle",
      "powerComparisonSummary": "EV offers 40 Nm torque and dual disc brakes vs Splendor's drum setup"
    }
  },
  {
    id: 'revolt-rv1-22',
    name: 'Revolt RV1 (2.2 kWh)',
    brand: 'Revolt Motors',
    tagline: 'Affordable Workhorse Electric Bike — ₹84,990 & Removable Battery',
    category: 'motorcycle',
    pricing: {
      exShowroom: 84990,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 4800,
      handlingAndDocsEst: 1300
    },
    specs: {
      batteryCapacityKwh: 2.2,
      usableBatteryCapacityKwh: 2.0,
      batteryChemistry: 'Removable LFP',
      isRemovableBattery: true,
      araiRangeKm: 100,
      realWorldEcoRangeKm: 85,
      realWorldCityRangeKm: 70,
      realWorldHighwayRangeKm: 55,
      topSpeedKmh: 70,
      accel0To40Kmh: 4.5,
      motorPeakPowerKw: 2.8,
      motorRatedPowerKw: 2.1,
      motorPeakTorqueNm: 35,
      driveType: 'Chain',
      chargingTime0To80: '2h 15m',
      chargingTime0To100: '3h 30m',
      fastChargingSupport: false,
      fastChargingRate: 'Standard 15A socket',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'City', 'Sport'],
      brakes: 'Dual Disc (240mm front & rear) CBS',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 104,
      groundClearanceMm: 180,
      seatHeightMm: 790,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 6.0,
      displayType: '6-inch Digital LCD',
      connectivity: ['Digital Cluster', 'LED Headlamps', 'Reverse Mode', 'USB Charger']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 75000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Dual disc brakes standard at ₹84,990',
      'Removable LFP battery pack',
      'High payload 250 kg rating',
      'LED lighting and reverse assist'
    ],
    pros: [
      'Ultra-affordable electric bike with dual disc brakes',
      'Removable battery is easily charged inside home',
      'High payload capacity'
    ],
    cons: [
      '70 km real-world city range',
      'No fast DC charging'
    ],
    badges: ['₹84,990 Price', 'Dual Discs', 'Removable LFP', '250 kg Payload'],
    rating: 4.5,
    reviewCount: 280,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/revolt/rv1/source/rv169367efb328c0.jpg?model=revolt-rv1-22&v=2026',
    colorOptions: [
      { name: 'Black Neon', hex: '#18181b' },
      { name: 'Cosmic Red', hex: '#dc2626' }
    ],
    idealFor: 'Daily budget commuters and delivery riders needing a low entry price',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Hero HF Deluxe (97.2cc)",
      "engineCc": 97.2,
      "petrolBhp": 8.02,
      "petrolTorqueNm": 8.05,
      "petrolMileageKmpl": 65,
      "petrolExShowroom": 62000,
      "petrolOnRoadTG": 75000,
      "classComparison": "100cc Entry Commuter",
      "powerComparisonSummary": "EV gives removable battery convenience with ₹0.22/km running expense"
    }
  },
  {
    id: 'revolt-rv400-32',
    name: 'Revolt RV400 (3.24 kWh Removable)',
    brand: 'Revolt Motors',
    tagline: "India's Most Popular AI-Enabled Electric Motorcycle",
    category: 'motorcycle',
    pricing: {
      exShowroom: 139000,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6100,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 3.24,
      usableBatteryCapacityKwh: 3.0,
      batteryChemistry: 'Removable LFP',
      isRemovableBattery: true,
      araiRangeKm: 150,
      realWorldEcoRangeKm: 125,
      realWorldCityRangeKm: 100,
      realWorldHighwayRangeKm: 78,
      topSpeedKmh: 85,
      accel0To40Kmh: 3.9,
      motorPeakPowerKw: 4.1,
      motorRatedPowerKw: 3.0,
      motorPeakTorqueNm: 54,
      driveType: 'Belt',
      chargingTime0To80: '3h 30m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: false,
      fastChargingRate: 'Removable portable battery pack (15A socket)',
      bootSpaceLiters: 0,
      ridingModes: ['Eco (45 km/h)', 'Normal (65 km/h)', 'Sport (85 km/h)'],
      brakes: 'Front Disc (240mm), Rear Disc (240mm) with CBS',
      brakingSafety: 'Dual Disc Brakes with CBS',
      kerbWeightKg: 108,
      groundClearanceMm: 215,
      seatHeightMm: 814,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Digital LCD',
      connectivity: ['MyRevolt App', 'Simulated Exhaust Sounds', 'Geo-Fencing', 'Swipe to Start on App', 'Battery Swap Network']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 75000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Removable battery pack (take battery home to charge easily)',
      '4 customizable simulated motorcycle exhaust roar sounds',
      'Massive 215mm ground clearance (highest among electric 2-wheelers)',
      'Dual USD front forks and adjustable rear monoshock',
      'Full digital LCD instrument cluster with real-time range indicator'
    ],
    pros: [
      'Removable battery allows easy charging for motorcycle riders in apartments',
      'Huge 215mm ground clearance clears all flooded streets and stones',
      'Lightweight nimble motorcycle frame (108 kg)'
    ],
    cons: [
      'No storage/boot space (typical motorcycle design)',
      'Belt drive requires periodic cleaning after muddy rides'
    ],
    badges: ['Top E-Motorcycle', 'Removable Battery', '215mm High Clearance', 'Simulated Exhaust Sounds'],
    rating: 4.5,
    reviewCount: 950,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/revolt-motors/rv-400/source/rv-40069cba261aa690.jpg?model=revolt-rv400-32&v=2026',
    colorOptions: [
      { name: 'Rebel Red', hex: '#dc2626' },
      { name: 'Cosmic Black', hex: '#18181b' },
      { name: 'Stealth Grey', hex: '#52525b' }
    ],
    idealFor: 'College students, daily bike commuters, apartment dwellers wanting a motorcycle',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda Shine 125 (124cc)",
      "engineCc": 124,
      "petrolBhp": 10.74,
      "petrolTorqueNm": 11,
      "petrolMileageKmpl": 55,
      "petrolExShowroom": 82000,
      "petrolOnRoadTG": 98000,
      "classComparison": "125cc Executive Commuter",
      "powerComparisonSummary": "EV delivers 54 Nm wheel torque vs 11 Nm on 125cc petrol with swappable pack"
    }
  },
  {
    id: 'revolt-rv400-brz',
    name: 'Revolt RV400 BRZ (3.24 kWh)',
    brand: 'Revolt Motors',
    tagline: 'Pure Mechanical Essential Riding Experience — Zero Gimmicks',
    category: 'motorcycle',
    pricing: {
      exShowroom: 122950,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5700,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 3.24,
      usableBatteryCapacityKwh: 3.0,
      batteryChemistry: 'Removable LFP',
      isRemovableBattery: true,
      araiRangeKm: 150,
      realWorldEcoRangeKm: 125,
      realWorldCityRangeKm: 100,
      realWorldHighwayRangeKm: 78,
      topSpeedKmh: 85,
      accel0To40Kmh: 3.9,
      motorPeakPowerKw: 4.1,
      motorRatedPowerKw: 3.0,
      motorPeakTorqueNm: 54,
      driveType: 'Belt',
      chargingTime0To80: '3h 30m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: false,
      fastChargingRate: '15A portable home charger',
      bootSpaceLiters: 0,
      ridingModes: ['Eco (45 km/h)', 'Normal (65 km/h)', 'Sport (85 km/h)'],
      brakes: 'Front Disc (240mm), Rear Disc (240mm) CBS',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 108,
      groundClearanceMm: 215,
      seatHeightMm: 814,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Digital LCD',
      connectivity: ['Digital Speedometer', 'Battery Percentage', 'Regen Indicator', 'Side Stand Sensor']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 75000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Physical key ignition without mandatory app dependency',
      '215mm ground clearance with upside-down (USD) front suspension',
      'Dual 240mm disc brakes with regenerative stopping power',
      'Removable battery pack with portable charging dock'
    ],
    pros: [
      '₹16,000 more affordable than RV400 for identical motor & battery hardware',
      'Zero app lag or cellular eSIM connectivity hassles',
      'Removable battery pack'
    ],
    cons: [
      'No simulated exhaust sounds or app telematics',
      'No underseat luggage space'
    ],
    badges: ['Pure Commuter', 'Key Ignition', '₹16k Cheaper than RV400', '215mm Clearance'],
    rating: 4.5,
    reviewCount: 240,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/revolt/rv400-brz/source/rv400-brz69367fb461c74.jpg?model=revolt-rv400-brz&v=2026',
    colorOptions: [
      { name: 'Lunar Green', hex: '#15803d' },
      { name: 'Pacific Blue', hex: '#0284c7' },
      { name: 'Dark Silver', hex: '#475569' }
    ],
    idealFor: 'Practical buyers who prefer simple physical key operations over smartphone apps',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Hero Glamour 125 (125cc)",
      "engineCc": 125,
      "petrolBhp": 10.8,
      "petrolTorqueNm": 10.6,
      "petrolMileageKmpl": 55,
      "petrolExShowroom": 86000,
      "petrolOnRoadTG": 103000,
      "classComparison": "125cc Commuter Motorcycle",
      "powerComparisonSummary": "EV key ignition simplicity with 54 Nm electric torque"
    }
  },
  {
    id: 'oben-rorr-ez-44',
    name: 'Oben Rorr EZ (4.4 kWh LFP)',
    brand: 'Oben Electric',
    tagline: 'Neo-Classic Urban Commuter — 95 km/h & 175 km Range',
    category: 'motorcycle',
    pricing: {
      exShowroom: 109999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5500,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 4.4,
      usableBatteryCapacityKwh: 4.1,
      batteryChemistry: 'Fixed LFP',
      isRemovableBattery: false,
      araiRangeKm: 175,
      realWorldEcoRangeKm: 140,
      realWorldCityRangeKm: 120,
      realWorldHighwayRangeKm: 95,
      topSpeedKmh: 95,
      accel0To40Kmh: 3.3,
      motorPeakPowerKw: 7.5,
      motorRatedPowerKw: 3.8,
      motorPeakTorqueNm: 52,
      driveType: 'Chain',
      chargingTime0To80: '2h 00m',
      chargingTime0To100: '3h 00m',
      fastChargingSupport: true,
      fastChargingRate: 'Fast home charging in 2 hours (15A socket)',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'City', 'Havoc'],
      brakes: 'Front Disc (280mm), Rear Disc (220mm) with Driver Alert System',
      brakingSafety: 'Dual Disc CBS with DAS',
      kerbWeightKg: 128,
      groundClearanceMm: 200,
      seatHeightMm: 810,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Color LED Display',
      connectivity: ['Oben Care App', 'Predictive Maintenance', 'Geo-fencing', 'Charge Status']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 75000,
      vehicleYears: 3,
      vehicleKm: 60000,
      extendedAvailable: true
    },
    features: [
      'High-safety proprietary LFP battery capable of withstanding 50°C summer heat',
      'Rapid 2-hour home charging on regular 15A socket',
      'High 200mm ground clearance for water-wading',
      'Lightweight agile frame designed for effortless city commuting'
    ],
    pros: [
      'LFP chemistry provides outstanding thermal stability in Telangana peak summers',
      'Quick 2-hour home recharge without expensive DC chargers',
      'Strong ₹1.1L price point for 4.4 kWh battery size'
    ],
    cons: [
      'No under-seat storage',
      'No color touchscreen display'
    ],
    badges: ['LFP Heat Safe', '2-Hr Fast Home Charge', '200mm Clearance', '95 km/h Speed'],
    rating: 4.6,
    reviewCount: 190,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/oben/rorr-ez/640X309/rorr-ez672cb3fa8a51e.jpg?model=oben-rorr-ez-44&v=2026',
    colorOptions: [
      { name: 'Electro Amber', hex: '#d97706' },
      { name: 'Flux Grey', hex: '#475569' },
      { name: 'Surge Cyan', hex: '#0891b2' }
    ],
    idealFor: 'Daily city bikers seeking rapid home recharge and heat-proof LFP safety',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Yamaha FZ-S FI (149cc)",
      "engineCc": 149,
      "petrolBhp": 12.4,
      "petrolTorqueNm": 13.3,
      "petrolMileageKmpl": 48,
      "petrolExShowroom": 122000,
      "petrolOnRoadTG": 146000,
      "classComparison": "150cc Street Commuter",
      "powerComparisonSummary": "EV delivers 13.4 bhp & 52 Nm torque with 175 km real range"
    }
  },
  {
    id: 'oben-rorr-44',
    name: 'Oben Rorr (4.4 kWh LFP)',
    brand: 'Oben Electric',
    tagline: 'High-Torque Commuter Motorcycle with 100 km/h Top Speed',
    category: 'motorcycle',
    pricing: {
      exShowroom: 149999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6500,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 4.4,
      usableBatteryCapacityKwh: 4.1,
      batteryChemistry: 'LFP',
      isRemovableBattery: false,
      araiRangeKm: 187,
      realWorldEcoRangeKm: 140,
      realWorldCityRangeKm: 120,
      realWorldHighwayRangeKm: 95,
      topSpeedKmh: 100,
      accel0To40Kmh: 3.0,
      motorPeakPowerKw: 8.0,
      motorRatedPowerKw: 4.0,
      motorPeakTorqueNm: 62,
      driveType: 'Chain',
      chargingTime0To80: '2h 00m',
      chargingTime0To100: '3h 00m',
      fastChargingSupport: true,
      fastChargingRate: 'Fast home charging in 2 hours (15A socket)',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'City', 'Havoc'],
      brakes: 'Front Disc, Rear Disc (Driver Alert System)',
      brakingSafety: 'Dual Disc CBS with DAS',
      kerbWeightKg: 130,
      groundClearanceMm: 200,
      seatHeightMm: 810,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Digital Color LCD',
      connectivity: ['Oben App', 'Geo-Fencing', 'Predictive Maintenance', 'Ride Analytics', 'Charge Status Alerts']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 75000,
      vehicleYears: 3,
      vehicleKm: 60000,
      extendedAvailable: true
    },
    features: [
      'High-grade LFP battery chemistry capable of handling 50°C temperatures',
      'Havoc mode delivering 0-40 km/h in 3.0 seconds',
      'Rapid 2-hour home charging on regular 15A socket',
      'Neo-classic streetfighter muscular tank design',
      '200mm high ground clearance and water-wading depth'
    ],
    pros: [
      'Safe LFP battery pack with 2-hour fast home charging',
      'Strong 8 kW motor with exhilarating Havoc throttle punch',
      'Comfortable upright commuter motorcycle seating posture'
    ],
    cons: [
      'No under-seat storage',
      'Touchscreen absent (uses color LCD display)'
    ],
    badges: ['100 km/h Speed', '2-Hr Fast Home Charge', 'LFP Chemistry', '200mm Clearance'],
    rating: 4.6,
    reviewCount: 220,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/oben/rorr-ez/640X309/rorr-ez672cb3fa8a51e.jpg?model=oben-rorr-44&v=2026',
    colorOptions: [
      { name: 'Magnetic Black', hex: '#18181b' },
      { name: 'Voltaic Yellow', hex: '#facc15' },
      { name: 'Electric Red', hex: '#ef4444' }
    ],
    idealFor: 'Youth and office commuters wanting a fast, rugged electric motorcycle',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Bajaj Pulsar 150 (150cc)",
      "engineCc": 150,
      "petrolBhp": 14,
      "petrolTorqueNm": 13.25,
      "petrolMileageKmpl": 48,
      "petrolExShowroom": 118000,
      "petrolOnRoadTG": 142000,
      "classComparison": "150cc Sport Commuter",
      "powerComparisonSummary": "EV delivers 0-40 in 3.0s with 200mm water-wading clearance"
    }
  },
  {
    id: 'raptee-hv-t30',
    name: 'Raptee HV T30 (High-Voltage CCS2)',
    brand: 'Raptee Energy',
    tagline: "India's First High-Voltage Electric Motorcycle — Uses Universal Car CCS2 Fast Chargers",
    category: 'motorcycle',
    pricing: {
      exShowroom: 239000,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 9100,
      handlingAndDocsEst: 2000
    },
    specs: {
      batteryCapacityKwh: 5.4,
      usableBatteryCapacityKwh: 5.1,
      batteryChemistry: 'High-Voltage NMC (240V Architecture)',
      isRemovableBattery: false,
      araiRangeKm: 200,
      realWorldEcoRangeKm: 160,
      realWorldCityRangeKm: 150,
      realWorldHighwayRangeKm: 120,
      topSpeedKmh: 135,
      accel0To40Kmh: 2.4,
      accel0To60Kmh: 3.5,
      motorPeakPowerKw: 22.0,
      motorRatedPowerKw: 11.0,
      motorPeakTorqueNm: 70,
      driveType: 'Belt',
      chargingTime0To80: '20 mins on any standard Car CCS2 DC Fast Charger / 3h (Home)',
      chargingTime0To100: '35 mins (CCS2) / 4h 30m',
      fastChargingSupport: true,
      fastChargingRate: 'Direct Car CCS2 DC Fast Charging (0-80% in 20 mins across all Hyderabad public stations)',
      bootSpaceLiters: 0,
      frunkSpaceLiters: 5,
      ridingModes: ['Comfort', 'Power', 'Sprint'],
      brakes: 'Front Disc (320mm), Rear Disc (240mm) with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS',
      kerbWeightKg: 165,
      groundClearanceMm: 170,
      seatHeightMm: 800,
      wheelSizeInches: 17,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Custom Automotive OS',
      connectivity: ['RapteeOS', 'CCS2 Auto-Handshake', 'Turn-by-Turn Navigation', 'Custom Power Curves']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 100000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      'Industry-first 240V high-voltage EV architecture on an Indian two-wheeler',
      'Compatible with 9,000+ public CCS2 car fast chargers across India (Tata Power, Statiq, Zeon)',
      '0-80% charge in just 20 minutes at any roadside car EV charger',
      'IP67 battery with integrated onboard charger (no separate heavy brick needed)'
    ],
    pros: [
      'Zero charging anxiety: plugs into any car fast charging station on Hyderabad highways',
      'Ultra-fast 20-minute roadside charging',
      '22 kW punchy peak power with smooth silent belt drive'
    ],
    cons: [
      'Premium ₹2.5L on-road pricing',
      'New brand expanding showroom presence in Telangana'
    ],
    badges: ['Universal Car CCS2 Port', '20-Min Fast Charge', '135 km/h Speed', '240V High Voltage', 'Dual-Channel ABS'],
    rating: 4.8,
    reviewCount: 115,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/kabira-mobility/km-3000/source/km-3000695b8cc0ce97f.jpg?model=raptee-hv-t30&v=2026',
    colorOptions: [
      { name: 'Horizon Red', hex: '#b91c1c' },
      { name: 'Arctic White', hex: '#f8fafc' },
      { name: 'Eclipse Black', hex: '#09090b' }
    ],
    idealFor: 'Touring enthusiasts, tech innovators, highway riders who want instant 20-min car fast charging',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "KTM Duke 250 (249cc)",
      "engineCc": 249,
      "petrolBhp": 31,
      "petrolTorqueNm": 25,
      "petrolMileageKmpl": 32,
      "petrolExShowroom": 240000,
      "petrolOnRoadTG": 288000,
      "classComparison": "250cc Performance Naked",
      "powerComparisonSummary": "EV matches 250cc performance with universal car DC fast charging (0-80% in 20m)"
    }
  },
  {
    id: 'matter-aera-5000-plus',
    name: 'Matter AERA 5000+ (5.0 kWh Liquid Cooled)',
    brand: 'Matter Mobility',
    tagline: "India's First 4-Speed Geared & Liquid-Cooled Electric Bike",
    category: 'motorcycle',
    pricing: {
      exShowroom: 183999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 7400,
      handlingAndDocsEst: 1800
    },
    specs: {
      batteryCapacityKwh: 5.0,
      usableBatteryCapacityKwh: 4.7,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 170,
      realWorldEcoRangeKm: 135,
      realWorldCityRangeKm: 115,
      realWorldHighwayRangeKm: 90,
      topSpeedKmh: 105,
      accel0To40Kmh: 3.5,
      motorPeakPowerKw: 10.5,
      motorRatedPowerKw: 5.0,
      motorPeakTorqueNm: 520,
      driveType: 'Geared',
      transmission: '4-Speed HyperShift Manual Gearbox with Clutch',
      chargingTime0To80: '4h 00m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: true,
      fastChargingRate: '0-80% in 1.5h on DC fast charger',
      bootSpaceLiters: 5,
      ridingModes: ['Eco', 'City', 'Sport'],
      brakes: 'Front & Rear Disc with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS',
      kerbWeightKg: 160,
      groundClearanceMm: 180,
      seatHeightMm: 790,
      wheelSizeInches: 17,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Android Touchscreen',
      connectivity: ['7-inch Touchscreen with Android OS', '4G Internet Connectivity', 'On-board 5L glove box with charger', 'Keyless Proximity']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      '4-speed manual hyper-shift gearbox with progressive clutch feel',
      'Active liquid-cooled battery pack & powertrain for peak thermal control',
      '7-inch capacitive touchscreen with Android OS, navigation & music',
      'Dual-Channel ABS braking system standard',
      'Built-in 5-liter tank storage compartment'
    ],
    pros: [
      'Authentic motorcycling gear shifting experience with instant electric torque',
      'Active liquid cooling ensures zero power drops on hot Telangana highways',
      'Dual-channel ABS and 7-inch Android smart cockpit'
    ],
    cons: [
      'Clutch and gear shifting might not appeal to scooter convenience seekers',
      'Heavier motorcycle weight (160 kg)'
    ],
    badges: ['4-Speed Manual Gearbox', 'Active Liquid Cooled', 'Dual Channel ABS', '7-inch Touchscreen'],
    rating: 4.7,
    reviewCount: 175,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/matter-ev/matter-electric-bike/640X309/matter-electric-bike67ef8c8f19657.jpg?model=matter-aera-5000-plus&v=2026',
    colorOptions: [
      { name: 'Cosmic Black', hex: '#09090b' },
      { name: 'Glacier White', hex: '#f8fafc' },
      { name: 'Blaze Red', hex: '#dc2626' }
    ],
    idealFor: 'Enthusiast bikers who love gear-shifting with the instant punch of electric',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "TVS Apache RTR 160 4V (160cc)",
      "engineCc": 160,
      "petrolBhp": 17.55,
      "petrolTorqueNm": 14.73,
      "petrolMileageKmpl": 45,
      "petrolExShowroom": 135000,
      "petrolOnRoadTG": 162000,
      "classComparison": "160cc Manual Motorcycle",
      "powerComparisonSummary": "EV delivers genuine 4-speed manual gearbox shifting with liquid cooled motor"
    }
  },
  {
    id: 'ultraviolette-f77-mach2',
    name: 'Ultraviolette F77 Mach 2 (10.3 kWh Recon)',
    brand: 'Ultraviolette Automotive',
    tagline: 'High-Performance Electric Superbike — 323 km Range & 155 km/h',
    category: 'motorcycle',
    pricing: {
      exShowroom: 399000,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 14500,
      handlingAndDocsEst: 2500
    },
    specs: {
      batteryCapacityKwh: 10.3,
      usableBatteryCapacityKwh: 9.8,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 323,
      realWorldEcoRangeKm: 260,
      realWorldCityRangeKm: 220,
      realWorldHighwayRangeKm: 180,
      topSpeedKmh: 155,
      accel0To40Kmh: 2.1,
      accel0To60Kmh: 2.8,
      motorPeakPowerKw: 30.0,
      motorRatedPowerKw: 15.0,
      motorPeakTorqueNm: 100,
      driveType: 'Chain',
      chargingTime0To80: '5h 00m (Standard) / 2h 00m (Boost)',
      chargingTime0To100: '7h 00m / 3h 00m',
      fastChargingSupport: true,
      fastChargingRate: '35 km / 10 mins with Supernova Fast Charger',
      bootSpaceLiters: 0,
      ridingModes: ['Glide', 'Combat', 'Ballistic'],
      brakes: 'Dual-Channel Bosch ABS, 320mm Front Disc, 230mm Rear Disc',
      brakingSafety: 'Dual-Channel Bosch ABS + DSC',
      kerbWeightKg: 207,
      groundClearanceMm: 160,
      seatHeightMm: 800,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: '5-inch TFT Color Dash',
      connectivity: ['Violette AI & Telematics', 'Dynamic Regen (10 levels)', 'Delta Watch Security', 'Fall & Crash Detection', 'Lockdown Mode']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 800000,
      vehicleYears: 3,
      vehicleKm: 60000,
      extendedAvailable: true
    },
    features: [
      'Insane 30 kW (40.2 hp) peak power and 100 Nm instant torque',
      'Massive 10.3 kWh aerospace-grade sealed battery pack',
      '0 to 100 km/h in 7.7 seconds, top speed of 155 km/h',
      '10-level switchable Dynamic Regenerative Braking and DSC',
      'Unmatched 8 Lakh km / 8-year battery warranty structure'
    ],
    pros: [
      'Unmatched superbike performance, aircraft-inspired aerodynamics and styling',
      'True 200+ km real-world highway range enables inter-district Telangana road trips',
      'Bosch Dual-Channel ABS and aerospace structural integrity'
    ],
    cons: [
      'Premium superbike pricing (~₹4.1 Lakh on-road)',
      'Aggressive forward-leaning supersport clip-on riding posture'
    ],
    badges: ['155 km/h Top Speed', '323 km Range', '30 kW Superbike', 'Bosch Dual ABS', '8 Lakh km Warranty'],
    rating: 4.9,
    reviewCount: 140,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ultraviolette/f77/source/f776a01ba14b6559.jpg?model=ultraviolette-f77-mach2&v=2026',
    colorOptions: [
      { name: 'Plasma Red', hex: '#e11d48' },
      { name: 'Turbo Red / White', hex: '#f43f5e' },
      { name: 'Afterburner Yellow', hex: '#eab308' },
      { name: 'Stealth Grey', hex: '#3f3f46' }
    ],
    idealFor: 'Superbike enthusiasts, weekend highway tourers, track-day performance riders',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "KTM RC 390 (373cc)",
      "engineCc": 373,
      "petrolBhp": 43.5,
      "petrolTorqueNm": 37,
      "petrolMileageKmpl": 26,
      "petrolExShowroom": 320000,
      "petrolOnRoadTG": 384000,
      "classComparison": "400cc Supersport Track Bike",
      "powerComparisonSummary": "EV delivers 155 km/h top speed, 323 km range, and 100 Nm instant torque"
    }
  },
  {
    id: 'ultraviolette-f77-mach2-original',
    name: 'Ultraviolette F77 Mach 2 (7.1 kWh Original)',
    brand: 'Ultraviolette Automotive',
    tagline: 'Agile Electric Sportbike — 145 km/h & 211 km Range',
    category: 'motorcycle',
    pricing: {
      exShowroom: 299000,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 11500,
      handlingAndDocsEst: 2000
    },
    specs: {
      batteryCapacityKwh: 7.1,
      usableBatteryCapacityKwh: 6.8,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 211,
      realWorldEcoRangeKm: 175,
      realWorldCityRangeKm: 145,
      realWorldHighwayRangeKm: 115,
      topSpeedKmh: 145,
      accel0To40Kmh: 2.8,
      motorPeakPowerKw: 27.0,
      motorRatedPowerKw: 12.0,
      motorPeakTorqueNm: 90,
      driveType: 'Chain',
      chargingTime0To80: '3h 30m (Standard) / 1h 30m (Boost)',
      chargingTime0To100: '5h 00m / 2h 30m',
      fastChargingSupport: true,
      fastChargingRate: '35 km / 10 mins with Supernova Fast Charger',
      bootSpaceLiters: 0,
      ridingModes: ['Glide', 'Combat', 'Ballistic'],
      brakes: 'Dual-Channel Bosch ABS, 320mm Front Disc, 230mm Rear Disc',
      brakingSafety: 'Dual-Channel Bosch ABS',
      kerbWeightKg: 197,
      groundClearanceMm: 160,
      seatHeightMm: 800,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: '5-inch TFT Color Dash',
      connectivity: ['Violette AI', 'Delta Watch', 'Dynamic Regen', 'Crash Alert']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 100000,
      vehicleYears: 3,
      vehicleKm: 60000,
      extendedAvailable: true
    },
    features: [
      '27 kW (36.2 hp) peak power motor reaching 145 km/h',
      'Lighter 197 kg kerb weight for even sharper flickability',
      'Bosch Dual-Channel ABS and 10-level dynamic regenerative braking',
      'Supernova DC fast charging compatible'
    ],
    pros: [
      '₹1 Lakh more accessible than Recon variant with full superbike aerodynamics',
      'Lighter weight provides faster turn-in and cornering agility',
      '145 km real-world city range'
    ],
    cons: [
      'Clip-on supersport posture requires core wrist strength',
      'No storage compartment'
    ],
    badges: ['145 km/h Speed', '27 kW Motor', 'Bosch Dual ABS', 'Sub-₹3L Superbike'],
    rating: 4.8,
    reviewCount: 110,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ultraviolette/f77-superstreet/source/f77-superstreet6889dbb5d2215.jpg?model=ultraviolette-f77-mach2-original&v=2026',
    colorOptions: [
      { name: 'Shadow White', hex: '#f8fafc' },
      { name: 'Laser Red', hex: '#e11d48' },
      { name: 'Stealth Black', hex: '#18181b' }
    ],
    idealFor: 'Performance motorcyclists wanting pure superbike feel under ₹3 Lakhs',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "BMW G 310 R / Duke 390 (313cc)",
      "engineCc": 313,
      "petrolBhp": 34,
      "petrolTorqueNm": 28,
      "petrolMileageKmpl": 28,
      "petrolExShowroom": 290000,
      "petrolOnRoadTG": 348000,
      "classComparison": "300cc-400cc Naked Sports",
      "powerComparisonSummary": "EV delivers 36.2 bhp with Bosch 10-level regenerative braking"
    }
  },
  {
    id: 'pure-ev-etryst-350',
    name: 'Pure EV eTryst 350 (3.5 kWh)',
    brand: 'Pure EV',
    tagline: 'Hyderabad-Born Rugged Naked Street Electric Motorcycle',
    category: 'motorcycle',
    pricing: {
      exShowroom: 129999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5900,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 3.5,
      usableBatteryCapacityKwh: 3.2,
      batteryChemistry: 'Fixed NMC (Patented BMS)',
      isRemovableBattery: false,
      araiRangeKm: 140,
      realWorldEcoRangeKm: 120,
      realWorldCityRangeKm: 105,
      realWorldHighwayRangeKm: 80,
      topSpeedKmh: 85,
      accel0To40Kmh: 3.8,
      motorPeakPowerKw: 4.0,
      motorRatedPowerKw: 3.0,
      motorPeakTorqueNm: 60,
      driveType: 'Hub',
      chargingTime0To80: '3h 45m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 15A charging',
      bootSpaceLiters: 0,
      ridingModes: ['Drive (60 km/h)', 'Cross Country (75 km/h)', 'Thrilled (85 km/h)'],
      brakes: 'Front Disc, Rear Disc with CBS',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 120,
      groundClearanceMm: 195,
      seatHeightMm: 790,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 7.0,
      displayType: '7-inch LED Cluster',
      connectivity: ['Pure EV App', 'Smart BMS Health Monitor', 'Anti-theft Smart Lock', 'Regen Telemetry']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Engineered at IIT Hyderabad with patented AI-driven thermal BMS',
      'Rugged tubular steel chassis with 195mm ground clearance',
      'Regenerative braking recovering up to 8% energy in city traffic',
      'Extensive local Telangana factory service and parts availability'
    ],
    pros: [
      'Local Hyderabad manufacturer (IIT Hyderabad incubated) with rapid spare parts support',
      'Solid, proven battery thermal management for Deccan plateau climate',
      'Comfortable wide dual seat'
    ],
    cons: [
      'Hub motor layout instead of mid-drive belt',
      '85 km/h top speed'
    ],
    badges: ['Hyderabad Born (IIT-H)', '195mm Clearance', 'Dual Disc Brakes', 'Patented BMS'],
    rating: 4.4,
    reviewCount: 310,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/pure-ev/etryst-350/source/etryst-350695e0a9253d9e.jpg?model=pure-ev-etryst-350&v=2026',
    colorOptions: [
      { name: 'Tan Red', hex: '#991b1b' },
      { name: 'Punch Black', hex: '#111827' },
      { name: 'Sea Blue', hex: '#0369a1' }
    ],
    idealFor: 'Telangana local buyers who value hometown IIT-Hyderabad engineering and quick service',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda SP 125 (125cc)",
      "engineCc": 125,
      "petrolBhp": 10.8,
      "petrolTorqueNm": 10.9,
      "petrolMileageKmpl": 60,
      "petrolExShowroom": 87000,
      "petrolOnRoadTG": 104000,
      "classComparison": "125cc Executive Commuter",
      "powerComparisonSummary": "IIT-Hyderabad engineered with 85 km/h top speed and ₹0 road tax"
    }
  },
  {
    id: 'pure-ev-ecodryft-350',
    name: 'Pure EV ecoDryft 350 (3.0 kWh)',
    brand: 'Pure EV',
    tagline: 'Practical Commuter Electric Motorcycle — 171 km Range & ₹99,999',
    category: 'motorcycle',
    pricing: {
      exShowroom: 99999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5100,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 3.0,
      usableBatteryCapacityKwh: 2.8,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 171,
      realWorldEcoRangeKm: 135,
      realWorldCityRangeKm: 115,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 75,
      accel0To40Kmh: 4.3,
      motorPeakPowerKw: 3.0,
      motorRatedPowerKw: 1.5,
      motorPeakTorqueNm: 40,
      driveType: 'Hub',
      chargingTime0To80: '3h 00m',
      chargingTime0To100: '4h 00m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 15A socket',
      bootSpaceLiters: 0,
      ridingModes: ['Drive (45 km/h)', 'Cross Country (60 km/h)', 'Thrilled (75 km/h)'],
      brakes: 'Front Disc, Rear Drum with CBS',
      brakingSafety: 'Front Disc CBS',
      kerbWeightKg: 101,
      groundClearanceMm: 180,
      seatHeightMm: 795,
      wheelSizeInches: 18,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Digital LCD',
      connectivity: ['Digital Instrument Cluster', 'Battery SOC Indicator', 'Speedometer', 'Trip Meter']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Traditional 110cc commuter motorcycle stance (Hero Splendor / Honda Shine style)',
      'High 18-inch wheels for outstanding pothole and bump compliance',
      'Lightweight 101 kg curb weight for nimble city filtering',
      '171 km ARAI certified range'
    ],
    pros: [
      'Natural transition for traditional 100-110cc motorcycle riders',
      'Sub-₹1 Lakh price with genuine 115 km real-world city range',
      'Lightweight and very easy to balance in Hyderabad traffic'
    ],
    cons: [
      '75 km/h top speed',
      'Rear drum brake'
    ],
    badges: ['Splendor-Style Commuter', '171 km ARAI', '18-inch Wheels', 'Under ₹1 Lakh'],
    rating: 4.5,
    reviewCount: 420,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/pure-ev/ecodryft/source/ecodryft695e0670b7c7b.jpg?model=pure-ev-ecodryft-350&v=2026',
    colorOptions: [
      { name: 'Black Metallic', hex: '#111827' },
      { name: 'Grey Pearl', hex: '#4b5563' },
      { name: 'Blue Metallic', hex: '#1d4ed8' }
    ],
    idealFor: 'Daily office and rural commuters looking for a simple, ultra-reliable electric motorcycle',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Hero Passion Plus (100cc)",
      "engineCc": 100,
      "petrolBhp": 8.02,
      "petrolTorqueNm": 8.05,
      "petrolMileageKmpl": 65,
      "petrolExShowroom": 78000,
      "petrolOnRoadTG": 94000,
      "classComparison": "100cc Commuter Motorcycle",
      "powerComparisonSummary": "EV gives 171 km range at ₹99,999 entry pricing"
    }
  },
  {
    id: 'kabira-km3000-mk2',
    name: 'Kabira Mobility KM3000 Mk2 (4.1 kWh)',
    brand: 'Kabira Mobility',
    tagline: 'Fully-Faired Electric Supersport Motorcycle — 120 km/h & 201 km Range',
    category: 'motorcycle',
    pricing: {
      exShowroom: 162999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6900,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 4.1,
      usableBatteryCapacityKwh: 3.8,
      batteryChemistry: 'LFP (Modular Pack)',
      isRemovableBattery: false,
      araiRangeKm: 201,
      realWorldEcoRangeKm: 160,
      realWorldCityRangeKm: 130,
      realWorldHighwayRangeKm: 100,
      topSpeedKmh: 120,
      accel0To40Kmh: 2.9,
      motorPeakPowerKw: 12.0,
      motorRatedPowerKw: 5.0,
      motorPeakTorqueNm: 65,
      driveType: 'Belt / Hub',
      chargingTime0To80: '2h 00m (Boost) / 3h 20m',
      chargingTime0To100: '3h 00m (Boost) / 4h 30m',
      fastChargingSupport: true,
      fastChargingRate: '0-80% in 50 mins on public DC fast chargers',
      bootSpaceLiters: 0,
      ridingModes: ['Eco (60 km/h)', 'City (80 km/h)', 'Sports (120 km/h)'],
      brakes: 'Dual Disc Front (280mm), Rear Disc (220mm) with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS with CBS',
      kerbWeightKg: 152,
      groundClearanceMm: 175,
      seatHeightMm: 800,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: '5-inch TFT Color Dash',
      connectivity: ['Kabira Smart App', 'Turn-by-turn Navigation', 'Bluetooth Audio', 'Live Telemetry']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Aerodynamic full-fairing bodywork with twin projector LED headlamps',
      'Modular LFP battery pack with 201 km certified range',
      '12 kW peak power motor with rapid 120 km/h top speed',
      'Dual-channel ABS and inverted USD front suspension'
    ],
    pros: [
      'Sporty full-faired supersport styling turns heads on the road',
      'LFP battery pack withstands extreme summer heat safely',
      'Dual-channel ABS standard'
    ],
    cons: [
      'Committed forward riding position',
      'No underseat storage'
    ],
    badges: ['Faired Sportbike', '120 km/h Speed', 'Dual ABS', 'LFP Chemistry'],
    rating: 4.6,
    reviewCount: 160,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/kabira-mobility/km-3000/source/km-3000695b8cc0ce97f.jpg?model=kabira-km3000-mk2&v=2026',
    colorOptions: [
      { name: 'Sports Red', hex: '#dc2626' },
      { name: 'Racing Green', hex: '#15803d' },
      { name: 'Carbon Black', hex: '#09090b' }
    ],
    idealFor: 'Sportbike enthusiasts looking for faired styling and electric punch',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Yamaha R15 V4 (155cc)",
      "engineCc": 155,
      "petrolBhp": 18.4,
      "petrolTorqueNm": 14.2,
      "petrolMileageKmpl": 45,
      "petrolExShowroom": 183000,
      "petrolOnRoadTG": 220000,
      "classComparison": "155cc Faired Supersport",
      "powerComparisonSummary": "EV supersport styling with 120 km/h top speed and 201 km range"
    }
  },
  {
    id: 'kabira-km4000-mk2',
    name: 'Kabira Mobility KM4000 Mk2 (4.1 kWh)',
    brand: 'Kabira Mobility',
    tagline: 'Naked Streetfighter Electric Motorcycle — 120 km/h & Aggressive Posture',
    category: 'motorcycle',
    pricing: {
      exShowroom: 166999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 7000,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 4.1,
      usableBatteryCapacityKwh: 3.8,
      batteryChemistry: 'LFP',
      isRemovableBattery: false,
      araiRangeKm: 201,
      realWorldEcoRangeKm: 160,
      realWorldCityRangeKm: 130,
      realWorldHighwayRangeKm: 100,
      topSpeedKmh: 120,
      accel0To40Kmh: 2.8,
      motorPeakPowerKw: 12.0,
      motorRatedPowerKw: 5.0,
      motorPeakTorqueNm: 65,
      driveType: 'Hub',
      chargingTime0To80: '2h 00m (Boost)',
      chargingTime0To100: '3h 00m',
      fastChargingSupport: true,
      fastChargingRate: '0-80% in 50 mins',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'City', 'Sports'],
      brakes: 'Dual Disc Front (280mm), Rear Disc (220mm) with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS',
      kerbWeightKg: 147,
      groundClearanceMm: 175,
      seatHeightMm: 800,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: '5-inch TFT Color Dash',
      connectivity: ['Kabira Smart App', 'Turn-by-turn Navigation', 'Bluetooth Audio', 'Anti-Theft']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Aggressive naked streetfighter styling with upright wide handlebar',
      'Modular LFP battery pack with 201 km certified range',
      '12 kW peak power with 0-40 km/h in 2.8 seconds',
      'Dual-channel ABS and inverted USD front suspension'
    ],
    pros: [
      'Comfortable upright streetfighter posture compared to KM3000',
      'Punchy low-end torque and 120 km/h top speed',
      'Safe LFP chemistry'
    ],
    cons: [
      'Windblast at highway speeds above 95 km/h',
      'No underseat storage'
    ],
    badges: ['Naked Streetfighter', '120 km/h Speed', 'Dual ABS', 'LFP Battery'],
    rating: 4.6,
    reviewCount: 140,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/kabira-mobility/km-4000/source/km-4000695b8e10df064.jpg?model=kabira-km4000-mk2&v=2026',
    colorOptions: [
      { name: 'Blaze Red', hex: '#dc2626' },
      { name: 'Stealth Black', hex: '#18181b' },
      { name: 'Combat Grey', hex: '#475569' }
    ],
    idealFor: 'Naked street motorcycle lovers wanting an aggressive daily commuter',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Yamaha MT-15 V2 (155cc)",
      "engineCc": 155,
      "petrolBhp": 18.4,
      "petrolTorqueNm": 14.1,
      "petrolMileageKmpl": 45,
      "petrolExShowroom": 170000,
      "petrolOnRoadTG": 204000,
      "classComparison": "155cc Naked Streetfighter",
      "powerComparisonSummary": "EV naked streetfighter with 201 km certified range"
    }
  },
  {
    id: 'komaki-ranger-45',
    name: 'Komaki Ranger (4.5 kWh Cruiser)',
    brand: 'Komaki Electric',
    tagline: "India's First Electric Cruiser Motorcycle — Wide Footboards & Backrest",
    category: 'motorcycle',
    pricing: {
      exShowroom: 168000,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 7100,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 4.5,
      usableBatteryCapacityKwh: 4.2,
      batteryChemistry: 'Fixed LFP (Fire-Resistant Pack)',
      isRemovableBattery: false,
      araiRangeKm: 200,
      realWorldEcoRangeKm: 160,
      realWorldCityRangeKm: 135,
      realWorldHighwayRangeKm: 105,
      topSpeedKmh: 80,
      accel0To40Kmh: 4.2,
      motorPeakPowerKw: 5.0,
      motorRatedPowerKw: 4.0,
      motorPeakTorqueNm: 50,
      driveType: 'Hub',
      chargingTime0To80: '4h 00m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 15A socket',
      bootSpaceLiters: 12,
      ridingModes: ['Eco', 'Comfort', 'Sport', 'Turbo'],
      brakes: 'Front Disc, Rear Disc with CBS',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 140,
      groundClearanceMm: 170,
      seatHeightMm: 740,
      wheelSizeInches: 16,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Classic Round Chrome Digital Display',
      connectivity: ['Bluetooth Sound System', 'Cruise Control', 'Reverse Assist', 'Side Pannier Mounts']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Classic cruiser low-slung stance with relaxed forward footpegs',
      'Padded pillion backrest and wide touring dual seat',
      'Side pannier luggage boxes and twin crash guard bars',
      'Built-in Bluetooth sound system with dual speakers',
      'Cruise control for highway relaxation'
    ],
    pros: [
      'Ultra-comfortable low 740mm seat height and cruiser posture',
      'Great for relaxed weekend rides and pillion comfort',
      '4.5 kWh LFP battery provides 135 km real city range'
    ],
    cons: [
      'Cruiser weight and 80 km/h top speed limit',
      'Styling is polarising for sports bike fans'
    ],
    badges: ['First Electric Cruiser', 'Low Seat 740mm', 'Pillion Backrest', 'Built-in Sound System'],
    rating: 4.5,
    reviewCount: 210,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/komaki/ranger/640X309/ranger68f1d34e51207.jpg?model=komaki-ranger-45&v=2026',
    colorOptions: [
      { name: 'Garnet Red', hex: '#7f1d1d' },
      { name: 'Deep Blue', hex: '#1e3a8a' },
      { name: 'Jet Black', hex: '#09090b' }
    ],
    idealFor: 'Cruiser motorcycle enthusiasts, touring riders, buyers wanting relaxed low-seat comfort',
    launchYear: 2023,
    madeInIndia: true
  },
  {
    id: 'hop-oxo-37',
    name: 'Hop OXO (3.75 kWh)',
    brand: 'Hop Electric',
    tagline: 'Sleek Urban Commuter Motorcycle — 95 km/h & 150 km Range',
    category: 'motorcycle',
    pricing: {
      exShowroom: 133000,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6000,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 3.75,
      usableBatteryCapacityKwh: 3.4,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 150,
      realWorldEcoRangeKm: 130,
      realWorldCityRangeKm: 110,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 95,
      accel0To40Kmh: 3.6,
      motorPeakPowerKw: 6.2,
      motorRatedPowerKw: 3.5,
      motorPeakTorqueNm: 55,
      driveType: 'Hub',
      chargingTime0To80: '3h 45m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 15A socket',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'City', 'Power', 'Turbo'],
      brakes: 'Front Disc (240mm), Rear Disc (220mm) with CBS',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 120,
      groundClearanceMm: 180,
      seatHeightMm: 780,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: '5-inch Smart Digital Cluster',
      connectivity: ['Hop Connect App', 'Turn-by-turn Navigation', 'Live GPS Tracking', 'Speed Alerts']
    },
    warranty: {
      batteryYears: 4,
      batteryKm: 50000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Turbo mode providing instant torque surge for overtaking',
      '180mm high ground clearance and lightweight chassis',
      'Dual disc brakes with regenerative braking',
      'IP67 waterproof battery and motor pack'
    ],
    pros: [
      'Smooth power delivery and comfortable commuter ergonomics',
      'Agile 120 kg weight makes it easy to ride in heavy traffic',
      'Dual disc brakes'
    ],
    cons: [
      '4-year battery warranty (competitors offer 5 to 8 years)',
      'Hub motor layout'
    ],
    badges: ['95 km/h Top Speed', 'Dual Disc Brakes', 'Turbo Mode', '180mm Clearance'],
    rating: 4.4,
    reviewCount: 180,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/hop-electric/oxo-100/source/oxo-100695f968872a35.jpg?model=hop-oxo-37&v=2026',
    colorOptions: [
      { name: 'Candy Red', hex: '#dc2626' },
      { name: 'Twilight Blue', hex: '#1d4ed8' },
      { name: 'True Black', hex: '#0f172a' }
    ],
    idealFor: 'Daily city commuter motorcyclists looking for a lightweight 95 km/h ride',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Bajaj Pulsar 125 (125cc)",
      "engineCc": 125,
      "petrolBhp": 11.8,
      "petrolTorqueNm": 10.8,
      "petrolMileageKmpl": 52,
      "petrolExShowroom": 92000,
      "petrolOnRoadTG": 110000,
      "classComparison": "125cc Sport Commuter",
      "powerComparisonSummary": "EV sport commuter with 95 km/h top speed & 150 km range"
    }
  },
  {
    id: 'tork-kratos-r',
    name: 'Tork Kratos R (4.0 kWh Axial Flux)',
    brand: 'Tork Motors',
    tagline: 'Patented Axial Flux Motor Electric Naked Motorcycle',
    category: 'motorcycle',
    pricing: {
      exShowroom: 159999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6800,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 4.0,
      usableBatteryCapacityKwh: 3.7,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 180,
      realWorldEcoRangeKm: 135,
      realWorldCityRangeKm: 110,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 105,
      accel0To40Kmh: 3.5,
      motorPeakPowerKw: 9.0,
      motorRatedPowerKw: 4.5,
      motorPeakTorqueNm: 38,
      driveType: 'Chain',
      chargingTime0To80: '3h 30m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: true,
      fastChargingRate: '0-80% in 1 hour with T-Net fast charger',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'City', 'Sport', 'Reverse'],
      brakes: 'Front Disc (240mm), Rear Disc (200mm) CBS',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 140,
      groundClearanceMm: 165,
      seatHeightMm: 798,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Digital LCD',
      connectivity: ['Tork App', 'In-app Navigation', 'Active Hazard Warning', 'Crash Alert', 'T-Net Fast Charging Network']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Patented Axial Flux PMAC motor delivering 96% efficiency and 38 Nm torque',
      'T-Net fast charging network compatible (0-80% in 60 mins)',
      'Split trellis steel frame for sporty handling',
      'Reverse assist mode for easy parking on slopes'
    ],
    pros: [
      'Proprietary Axial Flux motor produces very low heat and consistent torque',
      'Fast DC charging capability on highway trips',
      'Sporty naked-streetfighter riding dynamics'
    ],
    cons: [
      'No underseat storage',
      'Dealer footprints in rural Telangana districts are still maturing'
    ],
    badges: ['Axial Flux Motor', 'Fast Charge 60m', '105 km/h Top Speed', 'Sporty Trellis Frame'],
    rating: 4.5,
    reviewCount: 310,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/tork/tork-electric-bike/source/tork-electric-bike65854ee4e1699.jpg?model=tork-kratos-r&v=2026',
    colorOptions: [
      { name: 'Jet Black', hex: '#09090b' },
      { name: 'Insignia Red', hex: '#dc2626' },
      { name: 'Streaking Blue', hex: '#2563eb' }
    ],
    idealFor: 'Streetfighter motorcycle fans looking for instant electric acceleration',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "TVS Apache RTR 160 4V (160cc)",
      "engineCc": 160,
      "petrolBhp": 17.55,
      "petrolTorqueNm": 14.73,
      "petrolMileageKmpl": 45,
      "petrolExShowroom": 135000,
      "petrolOnRoadTG": 162000,
      "classComparison": "160cc Streetfighter",
      "powerComparisonSummary": "EV axial flux motor delivering 96% efficiency with 38 Nm torque"
    }
  },

  // ==========================================
  // 🛵 ELECTRIC SCOOTERS (17 Indian Models)
  // ==========================================
  {
    id: 'ather-apex-450',
    name: 'Ather 450 Apex (3.7 kWh Warp+)',
    brand: 'Ather Energy',
    tagline: "Collector's Edition Super-Scooter — 100 km/h & Magic Twist Regen",
    category: 'scooter',
    pricing: {
      exShowroom: 189999,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 7800,
      handlingAndDocsEst: 1800
    },
    specs: {
      batteryCapacityKwh: 3.7,
      usableBatteryCapacityKwh: 3.4,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 157,
      realWorldEcoRangeKm: 130,
      realWorldCityRangeKm: 110,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 100,
      accel0To40Kmh: 2.9,
      accel0To60Kmh: 4.8,
      motorPeakPowerKw: 7.0,
      motorRatedPowerKw: 3.7,
      motorPeakTorqueNm: 26,
      driveType: 'Belt',
      chargingTime0To80: '4h 15m',
      chargingTime0To100: '5h 45m',
      fastChargingSupport: true,
      fastChargingRate: '15 km / 10 mins on Ather Grid',
      bootSpaceLiters: 22,
      ridingModes: ['Eco', 'SmartEco', 'Ride', 'Sport', 'Warp', 'Warp+'],
      brakes: 'Front Disc (200mm), Rear Disc (190mm) with Magic Twist',
      brakingSafety: 'Dual Disc CBS with Magic Twist Throttle Regen',
      kerbWeightKg: 111,
      groundClearanceMm: 153,
      seatHeightMm: 780,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Full Color Touchscreen',
      connectivity: ['Google Maps Live', 'Magic Twist Regenerative Braking', 'SkidControl', 'WhatsApp Preview', 'TPMS']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 5,
      vehicleKm: 60000,
      extendedAvailable: true
    },
    features: [
      'Transparent translucent side panels revealing orange trellis frame',
      'Magic Twist throttle: Twist forward to brake down to 0 km/h with zero mechanical brake wear',
      'Warp+ mode with 100 km/h top speed and 0-40 km/h in 2.9 seconds',
      'Ather Grid public charging network across Hyderabad & Telangana'
    ],
    pros: [
      'Incredible Magic Twist throttle eliminates brake pad usage in city traffic',
      'Blistering 2.9s acceleration and 100 km/h top speed',
      '5-year comprehensive vehicle warranty standard'
    ],
    cons: [
      'Premium collectible pricing (₹1.9L+ on-road)',
      '22L boot space'
    ],
    badges: ['100 km/h Warp+', 'Magic Twist Regen', 'Translucent Body', '5-Yr Vehicle Warranty'],
    rating: 4.9,
    reviewCount: 210,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ather-energy/2025-450-apex/source/2025-450-apex691c495131a74.jpg?model=ather-apex-450&v=2026',
    colorOptions: [
      { name: 'Indium Blue & Warp Orange', hex: '#1e3a8a' },
      { name: 'Indium Stealth Shadow', hex: '#1f2937' }
    ],
    idealFor: 'Tech enthusiasts, collectors, performance scooter connoisseurs',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "TVS Ntorq 125 Race XP (125cc)",
      "engineCc": 125,
      "petrolBhp": 10.2,
      "petrolTorqueNm": 10.8,
      "petrolMileageKmpl": 42,
      "petrolExShowroom": 97000,
      "petrolOnRoadTG": 116000,
      "classComparison": "125cc Sport Performance Scooter",
      "powerComparisonSummary": "EV Warp+ mode delivers 0-40 in 2.9s and 100 km/h top speed"
    }
  },
  {
    id: 'ather-rizta-z-37',
    name: 'Ather Rizta Z (3.7 kWh)',
    brand: 'Ather Energy',
    tagline: 'The Ultimate Smart Family Electric Scooter',
    category: 'scooter',
    pricing: {
      exShowroom: 144999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6450,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 3.7,
      usableBatteryCapacityKwh: 3.4,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 159,
      realWorldEcoRangeKm: 130,
      realWorldCityRangeKm: 110,
      realWorldHighwayRangeKm: 92,
      topSpeedKmh: 80,
      accel0To40Kmh: 4.7,
      motorPeakPowerKw: 4.3,
      motorRatedPowerKw: 3.3,
      motorPeakTorqueNm: 22,
      driveType: 'Belt',
      chargingTime0To80: '4h 30m',
      chargingTime0To100: '6h 10m',
      fastChargingSupport: true,
      fastChargingRate: '15 km / 10 mins on Ather Grid',
      bootSpaceLiters: 34,
      frunkSpaceLiters: 22,
      ridingModes: ['SmartEco', 'Zip'],
      brakes: 'Front Disc, Rear Drum (CBS + Regen)',
      brakingSafety: 'Front Disc CBS + SkidControl Traction Control',
      kerbWeightKg: 119,
      groundClearanceMm: 165,
      seatHeightMm: 780,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch TFT Touchscreen',
      connectivity: ['Google Maps Navigation', 'SkidControl Traction Control', 'WhatsApp on Dash', 'FallSafe', 'Tow & Theft Alerts']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Huge 34L underseat boot + optional 22L Frunk front storage',
      'Longest and widest seat (900mm) in Indian two-wheeler segment',
      'SkidControl (Traction control for wet/gravel roads)',
      'Ather Grid Fast Charging access across Hyderabad & Telangana',
      'Emergency Stop Signal (ESS) and Live location sharing'
    ],
    pros: [
      'Exceptional family comfort with best-in-class backrest and seat width',
      'Ultra-reliable thermal management in extreme Telangana summers',
      '8-year battery warranty gives complete peace of mind',
      'Deep Google Maps integration with live traffic'
    ],
    cons: [
      'Top speed capped at 80 km/h (strictly family commuter tuning)',
      'Home charging from 0-100% takes over 6 hours with standard charger'
    ],
    badges: ['Top Family Pick', '34L Boot Space', '8-Yr Warranty', 'Ather Grid Ready'],
    rating: 4.8,
    reviewCount: 342,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ather-energy/family-scooter/source/family-scooter6a02b23c2fad8.jpg?model=ather-rizta-z-37&v=2026',
    colorOptions: [
      { name: 'Cardamom Green', hex: '#637a67' },
      { name: 'Pangong Blue', hex: '#2b4c6f' },
      { name: 'Deccan Grey', hex: '#4b5563' },
      { name: 'Alphonso Yellow', hex: '#eab308' }
    ],
    idealFor: 'Families, grocery runs, daily office commutes in city traffic',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "TVS Jupiter 125 (125cc)",
      "engineCc": 125,
      "petrolBhp": 8.2,
      "petrolTorqueNm": 10.3,
      "petrolMileageKmpl": 48,
      "petrolExShowroom": 88000,
      "petrolOnRoadTG": 106000,
      "classComparison": "125cc Family Scooter",
      "powerComparisonSummary": "EV gives massive 34L boot + 22L frunk with skid control"
    }
  },
  {
    id: 'ather-rizta-s-29',
    name: 'Ather Rizta S (2.9 kWh)',
    brand: 'Ather Energy',
    tagline: 'Spacious & Practical Family Electric Scooter with 34L Boot Space',
    category: 'scooter',
    pricing: {
      exShowroom: 124999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5850,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 2.9,
      usableBatteryCapacityKwh: 2.7,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 123,
      realWorldEcoRangeKm: 105,
      realWorldCityRangeKm: 90,
      realWorldHighwayRangeKm: 75,
      topSpeedKmh: 80,
      accel0To40Kmh: 4.7,
      accel0To60Kmh: 8.6,
      motorPeakPowerKw: 4.3,
      motorRatedPowerKw: 3.3,
      motorPeakTorqueNm: 22,
      driveType: 'Belt',
      chargingTime0To80: '5h 45m',
      chargingTime0To100: '8h 30m',
      fastChargingSupport: true,
      fastChargingRate: '15 km / 10 mins on Ather Grid',
      bootSpaceLiters: 34,
      frunkSpaceLiters: 22,
      ridingModes: ['SmartEco', 'Zip'],
      brakes: 'Front Disc, Rear Drum (CBS + Regen)',
      brakingSafety: 'Front Disc CBS + AutoHold',
      kerbWeightKg: 119,
      groundClearanceMm: 165,
      seatHeightMm: 780,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 7.0,
      displayType: '7-inch DeepView Segmented LCD',
      connectivity: ['Turn-by-Turn Navigation', 'AutoHold', 'FallSafe', 'Tow & Theft Alerts', 'Bluetooth Pairing']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Massive 34L underseat boot space + optional 22L front trunk organizer',
      'Extra-long and ultra-wide 900mm family contour seat with integrated grab handle',
      'Ather DeepView 7-inch LCD instrument display with turn-by-turn navigation',
      'AutoHold hill assist and FallSafe automatic motor cutoff',
      'Ather Grid fast charging network access across Telangana'
    ],
    pros: [
      'Class-leading 34-liter boot easily fits full-face helmet and family groceries',
      'Wide, cushioned seat delivers best-in-class comfort for pillion riders',
      'Ather Grid DC fast charging compatibility across Telangana charging corridors',
      'Under ₹1.25L ex-showroom value with ₹10,000 PM E-DRIVE central subsidy'
    ],
    cons: [
      'DeepView LCD display lacks the touchscreen map interaction of the Rizta Z',
      'Home charging takes ~8.5 hours for full 0-100% top-up with standard home charger'
    ],
    badges: ['34L Boot Space', 'Family Commuter', 'Ather Grid Ready', 'PM E-DRIVE Eligible', 'AutoHold'],
    rating: 4.7,
    reviewCount: 285,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ather-energy/family-scooter/source/family-scooter6a02b23c2fad8.jpg?model=ather-rizta-s-29&v=2026',
    colorOptions: [
      { name: 'Pangong Blue', hex: '#2b4c6f' },
      { name: 'Cardamom Green', hex: '#637a67' },
      { name: 'Deccan Grey', hex: '#4b5563' },
      { name: 'Siachen White', hex: '#f8fafc' }
    ],
    idealFor: 'Daily family errands, school and market runs, value-focused city commuters',
    launchYear: 2024,
    madeInIndia: true
  },
  {
    id: 'ather-450x-gen3-37',
    name: 'Ather 450X Gen 3 (3.7 kWh)',
    brand: 'Ather Energy',
    tagline: 'High-Performance Agile Smart Electric Scooter',
    category: 'scooter',
    pricing: {
      exShowroom: 154999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6800,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 3.7,
      usableBatteryCapacityKwh: 3.4,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 150,
      realWorldEcoRangeKm: 120,
      realWorldCityRangeKm: 105,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 90,
      accel0To40Kmh: 3.3,
      motorPeakPowerKw: 6.4,
      motorRatedPowerKw: 3.3,
      motorPeakTorqueNm: 26,
      driveType: 'Belt',
      chargingTime0To80: '4h 15m',
      chargingTime0To100: '5h 45m',
      fastChargingSupport: true,
      fastChargingRate: '15 km / 10 mins on Ather Grid',
      bootSpaceLiters: 22,
      ridingModes: ['Eco', 'SmartEco', 'Ride', 'Sport', 'Warp'],
      brakes: 'Front Disc (200mm), Rear Disc (190mm) with CBS',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 111,
      groundClearanceMm: 153,
      seatHeightMm: 780,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Touchscreen',
      connectivity: ['Google Maps Nav', 'Bluetooth Music & Calls', 'AutoHold / Hill Assist', 'Tyre Pressure Monitoring System (TPMS)']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Warp mode with 0-40 km/h in 3.3 seconds',
      'Dual disc brakes with regenerative braking and AutoHold',
      'Aluminium chassis with 50:50 perfect weight distribution',
      'IP67 rated water and dust resistant battery & motor pack',
      'AtherStack 6 UI with live WhatsApp and trip analytics'
    ],
    pros: [
      'Best-in-class razor-sharp handling and cornering stability',
      'Zero thermal throttling even under continuous Warp mode riding',
      'Proven 6+ year track record on Indian roads'
    ],
    cons: [
      'Smaller 22L boot cannot fit full-face helmet with visor',
      'Firm suspension setup can feel stiff over sharp potholes'
    ],
    badges: ['Top Performance', 'Warp Mode 3.3s', 'Dual Disc Brakes'],
    rating: 4.9,
    reviewCount: 890,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ather-energy/2025-450x/source/2025-450x6a44f5f94985b.jpg?model=ather-450x-gen3-37&v=2026',
    colorOptions: [
      { name: 'Lunar Grey', hex: '#374151' },
      { name: 'Space Grey & Yellow', hex: '#1f2937' },
      { name: 'Hyper Red', hex: '#dc2626' },
      { name: 'White', hex: '#f9fafb' }
    ],
    idealFor: 'Daily tech enthusiasts, swift commuters, performance seekers',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Suzuki Avenis 125 (125cc)",
      "engineCc": 125,
      "petrolBhp": 8.7,
      "petrolTorqueNm": 10,
      "petrolMileageKmpl": 48,
      "petrolExShowroom": 92000,
      "petrolOnRoadTG": 110000,
      "classComparison": "125cc Sporty Commuter",
      "powerComparisonSummary": "EV aluminum chassis with Google Maps navigation and 26 Nm torque"
    }
  },
  {
    id: 'simple-one-50',
    name: 'Simple One (5.0 kWh Dual Battery)',
    brand: 'Simple Energy',
    tagline: 'Record-Breaking 212 km Real-World Range & 105 km/h Top Speed',
    category: 'scooter',
    pricing: {
      exShowroom: 165999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 7000,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 5.0,
      usableBatteryCapacityKwh: 4.8,
      batteryChemistry: 'Dual Battery (Fixed + Removable Pack)',
      isRemovableBattery: true,
      batteryCount: 2,
      araiRangeKm: 236,
      realWorldEcoRangeKm: 212,
      realWorldCityRangeKm: 180,
      realWorldHighwayRangeKm: 140,
      topSpeedKmh: 105,
      accel0To40Kmh: 2.77,
      motorPeakPowerKw: 8.5,
      motorRatedPowerKw: 4.5,
      motorPeakTorqueNm: 72,
      driveType: 'Belt',
      chargingTime0To80: '3h 45m (Fixed) + 2h 00m (Portable)',
      chargingTime0To100: '5h 45m',
      fastChargingSupport: true,
      fastChargingRate: '1.5 km / min on Simple Loop Fast Charger',
      bootSpaceLiters: 30,
      ridingModes: ['Eco', 'Ride', 'Dash', 'Sonic'],
      brakes: 'Front Disc (200mm), Rear Disc (190mm) with CBS',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 134,
      groundClearanceMm: 164,
      seatHeightMm: 796,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Custom Android Touchscreen',
      connectivity: ['4G LTE Telematics', 'Turn-by-Turn Maps', 'Music Control', 'Document Storage', 'Tyre Pressure Monitoring']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Massive 5.0 kWh dual battery setup (fixed pack + 1.5 kWh removable battery pack)',
      'Sonic mode delivering 0-40 km/h in 2.77 seconds and 105 km/h top speed',
      '30-liter underseat boot space accommodating full-face helmet',
      'Android OS 7-inch touchscreen with 4G navigation'
    ],
    pros: [
      'Industry-leading 212 km real-world range eliminates daily charging hassles',
      'Removable secondary battery can be charged in high-rise apartments',
      'Extreme 72 Nm wheel torque and 105 km/h highway speed'
    ],
    cons: [
      'Heavier kerb weight at 134 kg',
      'Expanding dealer footprint across Tier-2 Telangana cities'
    ],
    badges: ['212 km Real Range', '5.0 kWh Dual Battery', '105 km/h Top Speed', 'Removable Pack'],
    rating: 4.7,
    reviewCount: 190,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/simple-energy/simple-one/640X309/simple-one6964d4c37003e.jpg?model=simple-one-50&v=2026',
    colorOptions: [
      { name: 'Brazen Black', hex: '#18181b' },
      { name: 'Namma Red', hex: '#dc2626' },
      { name: 'Azure Blue', hex: '#2563eb' },
      { name: 'Grace White', hex: '#f8fafc' }
    ],
    idealFor: 'Long-distance daily commuters between Hyderabad outskirts and IT corridor',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Yamaha Aerox 155 (155cc)",
      "engineCc": 155,
      "petrolBhp": 15,
      "petrolTorqueNm": 13.9,
      "petrolMileageKmpl": 38,
      "petrolExShowroom": 150000,
      "petrolOnRoadTG": 180000,
      "classComparison": "155cc Maxi-Performance Scooter",
      "powerComparisonSummary": "EV dual battery delivers 212 km real range and 72 Nm torque"
    }
  },
  {
    id: 'kinetic-green-e-luna',
    name: 'Kinetic Green E-Luna (2.0 kWh Heavy Duty)',
    brand: 'Kinetic Green',
    tagline: "India's Iconic Multi-Utility Moped — ₹69,990 & 150 kg Payload",
    category: 'scooter',
    pricing: {
      exShowroom: 69990,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 4200,
      handlingAndDocsEst: 1200
    },
    specs: {
      batteryCapacityKwh: 2.0,
      usableBatteryCapacityKwh: 1.8,
      batteryChemistry: 'Fixed LFP',
      isRemovableBattery: false,
      araiRangeKm: 110,
      realWorldEcoRangeKm: 95,
      realWorldCityRangeKm: 80,
      realWorldHighwayRangeKm: 65,
      topSpeedKmh: 50,
      accel0To40Kmh: 6.5,
      motorPeakPowerKw: 2.2,
      motorRatedPowerKw: 1.2,
      motorPeakTorqueNm: 22,
      driveType: 'Hub',
      chargingTime0To80: '3h 00m',
      chargingTime0To100: '4h 00m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 15A / 500W charger',
      bootSpaceLiters: 15,
      ridingModes: ['Eco (35 km/h)', 'City (45 km/h)', 'Speed (50 km/h)'],
      brakes: 'Front Drum, Rear Drum with CBS',
      brakingSafety: 'Drum CBS',
      kerbWeightKg: 96,
      groundClearanceMm: 170,
      seatHeightMm: 760,
      wheelSizeInches: 16,
      touchscreen: false,
      displaySizeInches: 4.0,
      displayType: 'Digital LCD',
      connectivity: ['USB Phone Charging Port', 'Removable Rear Seat for Heavy Cargo Loading', 'Digital Speedometer', 'Side Stand Sensor']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 50000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'All-metal rugged tubular high-tensile steel frame with 150 kg cargo carrying capacity',
      'Detachable rear pillion seat converts into a flat cargo luggage loading tray',
      '16-inch large spoke wheels conquer bad rural and broken village roads',
      'Running cost of just 10 paise per km'
    ],
    pros: [
      'Most affordable electric vehicle in India (under ₹75,000 on-road in Telangana)',
      'Unmatched utility for small shopkeepers, delivery agents, and agricultural transport',
      '16-inch big wheels and tough full-steel construction'
    ],
    cons: [
      '50 km/h top speed',
      'No enclosed lockable boot storage (open flat bed rack)'
    ],
    badges: ['Iconic E-Luna', 'Most Affordable ₹69k', '150 kg Heavy Cargo', '16-inch Big Wheels'],
    rating: 4.6,
    reviewCount: 650,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/kinetic/luna-electric/640X309/luna-electric696a3a804bc61.jpg?model=kinetic-green-e-luna&v=2026',
    colorOptions: [
      { name: 'Mulberry Red', hex: '#991b1b' },
      { name: 'Ocean Blue', hex: '#1e40af' },
      { name: 'Pearl Yellow', hex: '#eab308' }
    ],
    idealFor: 'Small business owners, local village commuters, heavy cargo delivery agents',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "TVS XL100 Heavy Duty (100cc)",
      "engineCc": 100,
      "petrolBhp": 4.35,
      "petrolTorqueNm": 6.5,
      "petrolMileageKmpl": 55,
      "petrolExShowroom": 50000,
      "petrolOnRoadTG": 60000,
      "classComparison": "100cc Utility Moped",
      "powerComparisonSummary": "EV heavy duty steel chassis with 150 kg payload capacity"
    }
  },
  {
    id: 'ola-s1-pro-gen2',
    name: 'Ola S1 Pro Gen 2 (4.0 kWh)',
    brand: 'Ola Electric',
    tagline: 'Flagship Speed & Massive 195 km Certified Range',
    category: 'scooter',
    pricing: {
      exShowroom: 134999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6300,
      handlingAndDocsEst: 1800
    },
    specs: {
      batteryCapacityKwh: 4.0,
      usableBatteryCapacityKwh: 3.7,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 195,
      realWorldEcoRangeKm: 155,
      realWorldCityRangeKm: 130,
      realWorldHighwayRangeKm: 105,
      topSpeedKmh: 120,
      accel0To40Kmh: 2.6,
      motorPeakPowerKw: 11.0,
      motorRatedPowerKw: 5.5,
      motorPeakTorqueNm: 58,
      driveType: 'Belt',
      chargingTime0To80: '5h 00m',
      chargingTime0To100: '6h 30m',
      fastChargingSupport: true,
      fastChargingRate: '50 km / 15 mins on Ola Hypercharger',
      bootSpaceLiters: 34,
      ridingModes: ['Eco', 'Normal', 'Sport', 'Hyper'],
      brakes: 'Front Disc, Rear Disc (Combined Braking)',
      brakingSafety: 'Dual Disc CBS',
      kerbWeightKg: 116,
      groundClearanceMm: 160,
      seatHeightMm: 805,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Touchscreen',
      connectivity: ['MoveOS 4', 'Cruise Control', 'Proximity Unlock', 'Party Mode Speakers', 'Hill Descent Control']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      'Hyper mode with blistering 120 km/h top speed & 11 kW peak power',
      'Cruise control for Hyderabad ORR / Highway stretches',
      'Massive 34L flat underseat boot space',
      'Keyless operation via smartphone proximity and passcode',
      'Built-in stereo speakers with party mode & concert light effects'
    ],
    pros: [
      'Unmatched raw acceleration (0-40 in 2.6s) and top speed',
      'Excellent range-to-price ratio in 4 kWh segment',
      'Loaded with party tech, cruise control, and large flat floorboard'
    ],
    cons: [
      'Customer service turnaround can vary by service center in Telangana',
      'Software updates require occasional reboots'
    ],
    badges: ['Top Speed 120 km/h', '195 km ARAI', 'Cruise Control', '11 kW Motor'],
    rating: 4.5,
    reviewCount: 1450,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/2025-s1-pro/source/2025-s1-pro69c65253ccb54.jpg?model=ola-s1-pro-gen2&v=2026',
    colorOptions: [
      { name: 'Jet Black', hex: '#111827' },
      { name: 'Stellar Blue', hex: '#1e3a8a' },
      { name: 'Amethyst', hex: '#6b21a8' },
      { name: 'Porcelain White', hex: '#f3f4f6' }
    ],
    idealFor: 'Long distance commuters, highway speed lovers, gadget enthusiasts',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Yamaha Aerox 155 (155cc)",
      "engineCc": 155,
      "petrolBhp": 15,
      "petrolTorqueNm": 13.9,
      "petrolMileageKmpl": 38,
      "petrolExShowroom": 150000,
      "petrolOnRoadTG": 180000,
      "classComparison": "160cc Performance Scooter",
      "powerComparisonSummary": "EV Hyper mode delivers 120 km/h top speed with 0-40 in 2.1s"
    }
  },
  {
    id: 'ola-s1-air',
    name: 'Ola S1 Air (3.0 kWh)',
    brand: 'Ola Electric',
    tagline: 'Practical Value Scooter with Flat Floorboard',
    category: 'scooter',
    pricing: {
      exShowroom: 104999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5400,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 3.0,
      usableBatteryCapacityKwh: 2.8,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 151,
      realWorldEcoRangeKm: 120,
      realWorldCityRangeKm: 100,
      realWorldHighwayRangeKm: 80,
      topSpeedKmh: 90,
      accel0To40Kmh: 3.3,
      motorPeakPowerKw: 6.0,
      motorRatedPowerKw: 2.7,
      motorPeakTorqueNm: 33,
      driveType: 'Hub',
      chargingTime0To80: '4h 15m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: false,
      fastChargingRate: 'Not supported (Home 750W charger only)',
      bootSpaceLiters: 34,
      ridingModes: ['Eco', 'Normal', 'Sport'],
      brakes: 'Front Drum, Rear Drum (CBS)',
      brakingSafety: 'Drum CBS',
      kerbWeightKg: 108,
      groundClearanceMm: 165,
      seatHeightMm: 792,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Touchscreen',
      connectivity: ['MoveOS 4', 'Turn-by-turn Navigation', 'Proximity Unlock', 'Digital Key Sharing']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      'Twin telescopic front suspension for rough city roads',
      'Flat floorboard for carrying gas cylinders / luggage bags',
      'Spacious 34L boot space',
      '7-inch touchscreen with full digital passcode lock'
    ],
    pros: [
      'Very competitive pricing under ₹1.1 Lakh',
      'Plush suspension tuned for potholed roads',
      'Flat floorboard is super convenient for daily utility'
    ],
    cons: [
      'Drum brakes on both ends (no disc brake option)',
      'No fast charging support on public DC chargers'
    ],
    badges: ['Value For Money', 'Flat Floorboard', 'Twin Front Forks'],
    rating: 4.4,
    reviewCount: 620,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/2025-s1-air/source/2025-s1-air68da2e25d8f96.jpg?model=ola-s1-air&v=2026',
    colorOptions: [
      { name: 'Coral Red', hex: '#ef4444' },
      { name: 'Neon Mint', hex: '#10b981' },
      { name: 'Anthracite Grey', hex: '#374151' }
    ],
    idealFor: 'Budget-conscious commuters seeking modern smart features',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda Activa 6G (110cc)",
      "engineCc": 110,
      "petrolBhp": 7.8,
      "petrolTorqueNm": 8.9,
      "petrolMileageKmpl": 50,
      "petrolExShowroom": 78000,
      "petrolOnRoadTG": 94000,
      "classComparison": "110cc Commuter Scooter",
      "powerComparisonSummary": "EV gives 34L boot space and 90 km/h top speed"
    }
  },
  {
    id: 'ola-s1-x-plus-30',
    name: 'Ola S1 X+ (3.0 kWh)',
    brand: 'Ola Electric',
    tagline: 'Ultra-Affordable Smart Commuter Scooter',
    category: 'scooter',
    pricing: {
      exShowroom: 89999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 4900,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 3.0,
      usableBatteryCapacityKwh: 2.8,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 151,
      realWorldEcoRangeKm: 120,
      realWorldCityRangeKm: 100,
      realWorldHighwayRangeKm: 80,
      topSpeedKmh: 90,
      accel0To40Kmh: 3.3,
      motorPeakPowerKw: 6.0,
      motorRatedPowerKw: 2.7,
      motorPeakTorqueNm: 33,
      driveType: 'Hub',
      chargingTime0To80: '4h 15m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: false,
      fastChargingRate: '750W Home charging only',
      bootSpaceLiters: 34,
      ridingModes: ['Eco', 'Normal', 'Sports'],
      brakes: 'Front Drum, Rear Drum (CBS)',
      brakingSafety: 'Drum CBS',
      kerbWeightKg: 108,
      groundClearanceMm: 160,
      seatHeightMm: 792,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: '5-inch Segmented LCD',
      connectivity: ['5.0-inch Segmented Screen', 'MoveOS App Connectivity', 'Keyless Lock/Unlock', 'LED Headlamp']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 40000,
      extendedAvailable: true
    },
    features: [
      'Sub-₹90,000 ex-showroom price point with 3.0 kWh battery',
      '8-year / 80,000 km battery warranty included',
      'Large 34-liter boot and flat floorboard',
      'Punchy 6 kW motor reaching 90 km/h top speed'
    ],
    pros: [
      'Extremely high value for price with 3.0 kWh battery pack',
      'Long 8-year battery warranty protects resale value',
      'Roomy 34L boot space and lightweight handling'
    ],
    cons: [
      'Drum brakes and physical segmented LCD (no color touch UI)',
      'No fast charger compatibility'
    ],
    badges: ['Budget Champion < ₹90k', '8-Yr Warranty', '34L Boot', '90 km/h Speed'],
    rating: 4.4,
    reviewCount: 880,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/s1-x-plus/source/s1-x-plus68e4f4e23cf41.jpg?model=ola-s1-x-plus-30&v=2026',
    colorOptions: [
      { name: 'Red Velocity', hex: '#e11d48' },
      { name: 'Midnight Black', hex: '#18181b' },
      { name: 'Silver Starlight', hex: '#94a3b8' }
    ],
    idealFor: 'Budget-first buyers switching from 100cc/110cc petrol scooters',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda Activa 6G (110cc)",
      "engineCc": 110,
      "petrolBhp": 7.8,
      "petrolTorqueNm": 8.9,
      "petrolMileageKmpl": 50,
      "petrolExShowroom": 78000,
      "petrolOnRoadTG": 94000,
      "classComparison": "110cc Commuter Scooter",
      "powerComparisonSummary": "EV sub-₹1 Lakh pricing with 34L boot"
    }
  },
  {
    id: 'tvs-iqube-s-34',
    name: 'TVS iQube S (3.4 kWh)',
    brand: 'TVS Motor',
    tagline: 'Refined, Silent & Trusted Family Electric Commuter',
    category: 'scooter',
    pricing: {
      exShowroom: 146420,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6200,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 3.4,
      usableBatteryCapacityKwh: 3.1,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 145,
      realWorldEcoRangeKm: 115,
      realWorldCityRangeKm: 100,
      realWorldHighwayRangeKm: 80,
      topSpeedKmh: 78,
      accel0To40Kmh: 4.2,
      motorPeakPowerKw: 4.4,
      motorRatedPowerKw: 3.0,
      motorPeakTorqueNm: 33,
      driveType: 'Hub',
      chargingTime0To80: '3h 45m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: false,
      fastChargingRate: '650W/950W fast home charger options',
      bootSpaceLiters: 32,
      ridingModes: ['Eco', 'Power'],
      brakes: 'Front Disc (220mm), Rear Drum (130mm)',
      brakingSafety: 'Front Disc CBS',
      kerbWeightKg: 119,
      groundClearanceMm: 157,
      seatHeightMm: 770,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 7.0,
      displayType: '7-inch TFT Non-Touch with 5-way Joystick',
      connectivity: ['SmartXonnect App', 'Turn-by-turn Navigation', '5-way Joystick switch', 'Alexa Integration', 'Incoming Call & SMS Alerts']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 70000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Whisper-quiet Hub-mounted BLDC motor with zero belt noise',
      'Sturdy traditional metal chassis & premium TVS switchgear',
      'Q-Park reverse and forward assist for effortless parking',
      'Wide service network across every district in Telangana',
      'IP67 certified water resistance on battery and motor controller'
    ],
    pros: [
      'Legendary TVS build quality, reliable electronics & fit and finish',
      'Extensive dealership and service support in Hyderabad and districts',
      'Ultra-comfortable progressive suspension and pillion footrests'
    ],
    cons: [
      'Top speed limited to 78 km/h',
      'Non-touchscreen display controlled by handlebar 5-way joystick switch'
    ],
    badges: ['Most Reliable', 'Trusted Brand TVS', 'Whisper Quiet Motor', 'Huge Dealer Network'],
    rating: 4.7,
    reviewCount: 1120,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/tvs/iqube-electric/source/iqube-electric69f89957d2575.jpg?model=tvs-iqube-s-34&v=2026',
    colorOptions: [
      { name: 'Mint Blue', hex: '#67e8f9' },
      { name: 'Mercury Grey', hex: '#64748b' },
      { name: 'Lucid Yellow', hex: '#fde047' },
      { name: 'Copper Bronze', hex: '#b45309' }
    ],
    idealFor: 'Traditional buyers, mature riders, families seeking hassle-free ownership',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "TVS Jupiter 110 (110cc)",
      "engineCc": 110,
      "petrolBhp": 8.02,
      "petrolTorqueNm": 9.2,
      "petrolMileageKmpl": 50,
      "petrolExShowroom": 77000,
      "petrolOnRoadTG": 93000,
      "classComparison": "110cc Family Scooter",
      "powerComparisonSummary": "EV silent hub motor with TVS build quality & 7-inch TFT"
    }
  },
  {
    id: 'tvs-iqube-st-51',
    name: 'TVS iQube ST (5.1 kWh)',
    brand: 'TVS Motor',
    tagline: 'Long-Range Ultra Edition with 150 km Real Range',
    category: 'scooter',
    pricing: {
      exShowroom: 185373,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 7600,
      handlingAndDocsEst: 1800
    },
    specs: {
      batteryCapacityKwh: 5.1,
      usableBatteryCapacityKwh: 4.8,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 212,
      realWorldEcoRangeKm: 165,
      realWorldCityRangeKm: 150,
      realWorldHighwayRangeKm: 120,
      topSpeedKmh: 82,
      accel0To40Kmh: 4.0,
      motorPeakPowerKw: 4.4,
      motorRatedPowerKw: 3.0,
      motorPeakTorqueNm: 33,
      driveType: 'Hub',
      chargingTime0To80: '3h 18m (with 950W charger)',
      chargingTime0To100: '4h 18m',
      fastChargingSupport: true,
      fastChargingRate: '950W fast home charger included',
      bootSpaceLiters: 32,
      ridingModes: ['Eco', 'Power'],
      brakes: 'Front Disc, Rear Drum (CBS)',
      brakingSafety: 'Front Disc CBS',
      kerbWeightKg: 128,
      groundClearanceMm: 157,
      seatHeightMm: 770,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Capacitive Touchscreen',
      connectivity: ['7-inch Capacitive Touchscreen', 'Voice Assist', 'TPMS', 'Document Storage', 'SmartXonnect Live Telematics']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 70000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Massive 5.1 kWh battery pack delivering true 150 km city range',
      'True 7-inch vibrant capacitive full-color touchscreen',
      '950W high-speed home charger',
      'Voice assistance for navigation, calls, and songs',
      'Premium plush dual-tone split seat'
    ],
    pros: [
      'True 135-150 km real-world range without battery anxiety',
      'Full touchscreen interface combined with TVS rock-solid reliability',
      'Fast 950W home charging setup'
    ],
    cons: [
      'Priced higher than competitor 4 kWh options',
      'Heavier kerb weight at 128 kg'
    ],
    badges: ['5.1 kWh Big Battery', 'True 150 km Range', 'Touchscreen TVS'],
    rating: 4.8,
    reviewCount: 290,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/tvs/iqube-st/source/iqube-st68afe25db6df4.jpg?model=tvs-iqube-st-51&v=2026',
    colorOptions: [
      { name: 'Copper Bronze Matte', hex: '#78350f' },
      { name: 'Titanium Grey Matte', hex: '#334155' },
      { name: 'Starlight Blue', hex: '#1e40af' },
      { name: 'Pearl White', hex: '#f8fafc' }
    ],
    idealFor: 'Commuters with long daily runs across Greater Hyderabad who want top reliability',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Suzuki Access 125 (125cc)",
      "engineCc": 125,
      "petrolBhp": 8.7,
      "petrolTorqueNm": 10,
      "petrolMileageKmpl": 48,
      "petrolExShowroom": 84000,
      "petrolOnRoadTG": 101000,
      "classComparison": "125cc Premium Commuter",
      "powerComparisonSummary": "EV massive 5.1 kWh battery giving 150 km true city range"
    }
  },
  {
    id: 'bajaj-chetak-premium-32',
    name: 'Bajaj Chetak Premium (3.2 kWh)',
    brand: 'Bajaj Auto',
    tagline: 'Timeless Classic Full-Metal Body Electric Scooter',
    category: 'scooter',
    pricing: {
      exShowroom: 135463,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6300,
      handlingAndDocsEst: 1600
    },
    specs: {
      batteryCapacityKwh: 3.2,
      usableBatteryCapacityKwh: 3.0,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 126,
      realWorldEcoRangeKm: 110,
      realWorldCityRangeKm: 95,
      realWorldHighwayRangeKm: 75,
      topSpeedKmh: 73,
      accel0To40Kmh: 4.5,
      motorPeakPowerKw: 4.2,
      motorRatedPowerKw: 3.8,
      motorPeakTorqueNm: 20,
      driveType: 'Hub',
      chargingTime0To80: '3h 45m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: false,
      fastChargingRate: '800W on-board smart charger',
      bootSpaceLiters: 21,
      ridingModes: ['Eco', 'Sports'],
      brakes: 'Front Disc, Rear Drum (CBS)',
      brakingSafety: 'Front Disc CBS',
      kerbWeightKg: 134,
      groundClearanceMm: 160,
      seatHeightMm: 760,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: '5-inch Round Color LCD',
      connectivity: ['Bajaj Chetak App', 'Turn-by-turn Navigation', 'Geo-Fencing', 'Hill Hold Control', 'Reverse Mode']
    },
    warranty: {
      batteryYears: 3,
      batteryKm: 50000,
      vehicleYears: 3,
      vehicleKm: 50000,
      extendedAvailable: true
    },
    features: [
      'Full steel metal bodywork with premium automotive-grade paint',
      'Sequential LED scrolling blinkers and horseshoe DRL',
      'IP67 water-resistant battery with intelligent battery management (BMS)',
      'Built-in 800W charger with neatly integrated cable management',
      'Feather-touch glove box with soft-close mechanism'
    ],
    pros: [
      'Indestructible full-metal sheet body provides unmatched durability in city traffic',
      'Gorgeous retro-modern neo-classic design aesthetic',
      'Smooth, glitch-free throttle and regenerative braking calibration'
    ],
    cons: [
      'Heaviest scooter in class (134 kg)',
      'Smaller 21L boot space compared to Ather Rizta or Ola'
    ],
    badges: ['Full Metal Body', 'Neo-Classic Icon', '800W On-board Charger'],
    rating: 4.6,
    reviewCount: 780,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/bajaj/2022-chetak/source/2022-chetak6a018255064f1.jpg?model=bajaj-chetak-premium-32&v=2026',
    colorOptions: [
      { name: 'Brooklyn Black', hex: '#0f172a' },
      { name: 'Indigo Metallic', hex: '#1e3a8a' },
      { name: 'Hazelnut', hex: '#92400e' }
    ],
    idealFor: 'Riders prioritizing metal-body durability, classic looks, and solid build',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda Activa 125 (125cc)",
      "engineCc": 125,
      "petrolBhp": 8.3,
      "petrolTorqueNm": 10.4,
      "petrolMileageKmpl": 48,
      "petrolExShowroom": 82000,
      "petrolOnRoadTG": 98000,
      "classComparison": "125cc Metal Body Scooter",
      "powerComparisonSummary": "EV all-metal steel unibody construction with sequential LED indicators"
    }
  },
  {
    id: 'bajaj-chetak-2901',
    name: 'Bajaj Chetak 2901 (2.88 kWh Metal Body)',
    brand: 'Bajaj Auto',
    tagline: 'Affordable Solid Metal Body Electric Scooter — ₹95,998',
    category: 'scooter',
    pricing: {
      exShowroom: 95998,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5100,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 2.88,
      usableBatteryCapacityKwh: 2.7,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 123,
      realWorldEcoRangeKm: 105,
      realWorldCityRangeKm: 90,
      realWorldHighwayRangeKm: 70,
      topSpeedKmh: 63,
      accel0To40Kmh: 4.9,
      motorPeakPowerKw: 4.0,
      motorRatedPowerKw: 3.0,
      motorPeakTorqueNm: 18,
      driveType: 'Hub',
      chargingTime0To80: '4h 00m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 15A charger',
      bootSpaceLiters: 21,
      ridingModes: ['Eco', 'Sports'],
      brakes: 'Front Drum, Rear Drum CBS',
      brakingSafety: 'Drum CBS',
      kerbWeightKg: 130,
      groundClearanceMm: 160,
      seatHeightMm: 760,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 4.5,
      displayType: 'Digital Color LCD',
      connectivity: ['Bluetooth Connectivity', 'Hill Hold Assist', 'Reverse Assist', 'LED DRLs']
    },
    warranty: {
      batteryYears: 3,
      batteryKm: 50000,
      vehicleYears: 3,
      vehicleKm: 50000,
      extendedAvailable: true
    },
    features: [
      'Full steel sheet metal body under ₹1 Lakh ex-showroom',
      'Vibrant pop color options (Cyber White, Azure Blue, Lime Yellow)',
      'Hill hold assist and reverse parking assist',
      'Digital instrument cluster with Bluetooth'
    ],
    pros: [
      'Most affordable full-metal body electric scooter in India',
      'High structural impact resistance in city traffic',
      'Bajaj service network across all Telangana mandals'
    ],
    cons: [
      '63 km/h top speed',
      'Drum brakes'
    ],
    badges: ['Full Metal Body < ₹1L', 'Vibrant Pop Colors', 'Bajaj Reliability'],
    rating: 4.5,
    reviewCount: 340,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/bajaj/chetak-c2501/source/chetak-c25016971bd5606598.jpg?model=bajaj-chetak-2901&v=2026',
    colorOptions: [
      { name: 'Azure Blue', hex: '#0284c7' },
      { name: 'Lime Yellow', hex: '#eab308' },
      { name: 'Ebony Black', hex: '#0f172a' }
    ],
    idealFor: 'Buyers seeking indestructible metal body and Bajaj trust under ₹1 Lakh',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda Activa 6G (110cc)",
      "engineCc": 110,
      "petrolBhp": 7.8,
      "petrolTorqueNm": 8.9,
      "petrolMileageKmpl": 50,
      "petrolExShowroom": 78000,
      "petrolOnRoadTG": 94000,
      "classComparison": "110cc Commuter Scooter",
      "powerComparisonSummary": "EV full metal body under ₹1 Lakh ex-showroom"
    }
  },
  {
    id: 'hero-vida-v1-pro',
    name: 'Hero Vida V1 Pro (3.94 kWh Dual Removable)',
    brand: 'Hero MotoCorp (Vida)',
    tagline: 'Dual Removable Batteries — Apartment Charging Made Easy',
    category: 'scooter',
    pricing: {
      exShowroom: 130200,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5900,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 3.94,
      usableBatteryCapacityKwh: 3.6,
      batteryChemistry: 'Dual Removable NMC',
      isRemovableBattery: true,
      batteryCount: 2,
      araiRangeKm: 165,
      realWorldEcoRangeKm: 125,
      realWorldCityRangeKm: 105,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 80,
      accel0To40Kmh: 3.2,
      motorPeakPowerKw: 6.0,
      motorRatedPowerKw: 3.9,
      motorPeakTorqueNm: 25,
      driveType: 'Hub',
      chargingTime0To80: '4h 45m',
      chargingTime0To100: '5h 55m',
      fastChargingSupport: true,
      fastChargingRate: '1.2 km / min on fast DC chargers (Ather Grid compatible)',
      bootSpaceLiters: 26,
      ridingModes: ['Eco', 'Ride', 'Sport', 'Custom (100+ combinations)'],
      brakes: 'Front Disc, Rear Drum (CBS)',
      brakingSafety: 'Front Disc CBS',
      kerbWeightKg: 125,
      groundClearanceMm: 155,
      seatHeightMm: 780,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Touchscreen',
      connectivity: ['7-inch Touchscreen', 'Custom Riding Mode Tuner', 'Keyless entry', 'SOS Emergency Alert', 'Cruise Control']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 50000,
      vehicleYears: 5,
      vehicleKm: 50000,
      extendedAvailable: true
    },
    features: [
      'Two portable removable battery packs (charge in 5th floor flat easily)',
      'Split modular seat design for versatile luggage carrying',
      'Cruise control and custom mode throttle response curve adjustment',
      'Compatible with Ather Grid public fast charging protocol',
      '5-year vehicle warranty standard'
    ],
    pros: [
      'Game changer for apartment dwellers with no basement charging plug',
      'Hero MotoCorp warranty backing and 5-year vehicle coverage',
      'Can run on a single battery pack if one is left home charging'
    ],
    cons: [
      'Lifting two ~11 kg battery packs upstairs requires physical effort',
      'Boot space split around dual battery wells'
    ],
    badges: ['Dual Removable Battery', 'Apartment Friendly', 'Hero 5-Yr Warranty', 'Ather Grid Compatible'],
    rating: 4.6,
    reviewCount: 410,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/vida/vida-v2/source/vida-v26a02eb80df0c4.jpg?model=hero-vida-v1-pro&v=2026',
    colorOptions: [
      { name: 'Matte Abrax Orange', hex: '#ea580c' },
      { name: 'Matte White', hex: '#f8fafc' },
      { name: 'Matte Sports Red', hex: '#dc2626' },
      { name: 'Gloss Black', hex: '#09090b' }
    ],
    idealFor: 'Apartment owners without dedicated basement charging slots',
    launchYear: 2023,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Hero Xoom 110 (110cc)",
      "engineCc": 110,
      "petrolBhp": 8.05,
      "petrolTorqueNm": 8.7,
      "petrolMileageKmpl": 48,
      "petrolExShowroom": 76000,
      "petrolOnRoadTG": 91000,
      "classComparison": "110cc Feature Scooter",
      "powerComparisonSummary": "EV dual removable battery packs for apartment dwellers without parking plug"
    }
  },
  {
    id: 'river-indie-40',
    name: 'River Indie (4.0 kWh)',
    brand: 'River Mobility',
    tagline: 'The SUV of Scooters — 43L Boot & 55L Pannier Mounts',
    category: 'scooter',
    pricing: {
      exShowroom: 138000,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6100,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 4.0,
      usableBatteryCapacityKwh: 3.8,
      batteryChemistry: 'NMC',
      isRemovableBattery: false,
      araiRangeKm: 161,
      realWorldEcoRangeKm: 130,
      realWorldCityRangeKm: 115,
      realWorldHighwayRangeKm: 90,
      topSpeedKmh: 90,
      accel0To40Kmh: 3.9,
      motorPeakPowerKw: 6.7,
      motorRatedPowerKw: 4.5,
      motorPeakTorqueNm: 26,
      driveType: 'Belt',
      chargingTime0To80: '4h 00m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: true,
      fastChargingRate: '0-80% in 1h 20m with fast charger',
      bootSpaceLiters: 43,
      frunkSpaceLiters: 12,
      ridingModes: ['Eco', 'Ride', 'Rush'],
      brakes: 'Front Disc (240mm), Rear Disc (200mm) CBS',
      brakingSafety: 'Dual Disc CBS with 240mm Front Rotor',
      kerbWeightKg: 140,
      groundClearanceMm: 165,
      seatHeightMm: 770,
      wheelSizeInches: 14,
      touchscreen: false,
      displaySizeInches: 6.0,
      displayType: '6-inch High-contrast Color LCD',
      connectivity: ['High-contrast Color LCD', 'Dual USB Phone Charging ports', 'Crash guard pannier integration', 'Hazard light switch']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 50000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Gigantic 43-liter illuminated underseat storage (fits 2 full-face helmets)',
      '12-liter front glovebox storage + clip-on bag hooks',
      'Safeguard perimeter crash bars with clip-on pannier luggage brackets',
      'Dual 14-inch extra-wide alloy wheels (motorcycle-size grip)',
      'Dual rear twin-shock suspension and wide front foot-pegs'
    ],
    pros: [
      'Unrivalled carrying capacity: up to 55L accessories + 43L underseat',
      '14-inch wheels glide over bad Hyderabad potholes and speed breakers',
      'Solid, rugged industrial build with motorcycle-grade 240mm front disc'
    ],
    cons: [
      'Heaviest scooter at 140 kg kerb weight',
      'Dealer network currently expanding across Tier-1 Telangana hubs'
    ],
    badges: ['Largest Boot 43L', '14-inch Big Wheels', 'Dual Disc Brakes', 'SUV Scooter'],
    rating: 4.8,
    reviewCount: 195,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/river/river-electric-scooter/source/river-electric-scooter69afc11f1850b.jpg?model=river-indie-40&v=2026',
    colorOptions: [
      { name: 'Monsoon Blue', hex: '#0284c7' },
      { name: 'Summer Red', hex: '#e11d48' },
      { name: 'Spring Yellow', hex: '#ca8a04' }
    ],
    idealFor: 'Small business owners, touring lovers, riders needing maximum luggage storage',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Yamaha Aerox 155 (155cc)",
      "engineCc": 155,
      "petrolBhp": 15,
      "petrolTorqueNm": 13.9,
      "petrolMileageKmpl": 38,
      "petrolExShowroom": 150000,
      "petrolOnRoadTG": 180000,
      "classComparison": "SUV of Scooters / Maxi-Utility",
      "powerComparisonSummary": "EV 43L underseat storage + 12L glovebox + 14-inch wheels"
    }
  },
  {
    id: 'ampere-nexus-30',
    name: 'Ampere Nexus ST (3.0 kWh LFP)',
    brand: 'Greaves Ampere',
    tagline: 'Ultra-Safe LFP Battery & Modern Commuter Styling',
    category: 'scooter',
    pricing: {
      exShowroom: 109900,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5500,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 3.0,
      usableBatteryCapacityKwh: 2.8,
      batteryChemistry: 'LFP',
      isRemovableBattery: false,
      araiRangeKm: 136,
      realWorldEcoRangeKm: 110,
      realWorldCityRangeKm: 95,
      realWorldHighwayRangeKm: 75,
      topSpeedKmh: 93,
      accel0To40Kmh: 4.0,
      motorPeakPowerKw: 4.0,
      motorRatedPowerKw: 3.3,
      motorPeakTorqueNm: 25,
      driveType: 'Belt',
      chargingTime0To80: '3h 20m',
      chargingTime0To100: '4h 00m',
      fastChargingSupport: false,
      fastChargingRate: '15A standard socket fast home charger',
      bootSpaceLiters: 23,
      ridingModes: ['Eco', 'City', 'Power', 'Limphome', 'Reverse'],
      brakes: 'Front Disc, Rear Drum (CBS)',
      brakingSafety: 'Front Disc CBS',
      kerbWeightKg: 115,
      groundClearanceMm: 170,
      seatHeightMm: 765,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7-inch Touchscreen',
      connectivity: ['7-inch Touchscreen (ST variant)', 'Bluetooth Turn-by-Turn Nav', 'Auto-Day/Night Mode', 'Music Control']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Ultra-stable LFP (Lithium Iron Phosphate) chemistry for extreme hot climates',
      'High 170mm ground clearance for waterlogged monsoon streets',
      'Mid-mounted motor with direct belt drive',
      'Diamond cut alloy wheels with high-grip tubeless tyres'
    ],
    pros: [
      'LFP battery chemistry gives superior thermal safety in Hyderabad 42°C summers',
      'Generous 170mm ground clearance tackles high Telangana speed bumps',
      'Sleek modern styling with bright LED headlamp cluster'
    ],
    cons: [
      'Boot space is compact (23L)',
      'Belt drive requires periodic tension checks after 15,000 km'
    ],
    badges: ['LFP Heat Safe Battery', '170mm Ground Clearance', '7-inch Touchscreen'],
    rating: 4.5,
    reviewCount: 160,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ampere/nxg/source/nxg6a58d3a99f4ab.jpg?model=ampere-nexus-30&v=2026',
    colorOptions: [
      { name: 'Zanskar Aqua', hex: '#06b6d4' },
      { name: 'Indian Red', hex: '#b91c1c' },
      { name: 'Lunar Grey', hex: '#4b5563' },
      { name: 'Steel White', hex: '#f8fafc' }
    ],
    idealFor: 'Daily city commuters seeking safe LFP battery chemistry and tall clearance',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda Activa 6G (110cc)",
      "engineCc": 110,
      "petrolBhp": 7.8,
      "petrolTorqueNm": 8.9,
      "petrolMileageKmpl": 50,
      "petrolExShowroom": 78000,
      "petrolOnRoadTG": 94000,
      "classComparison": "110cc Family Scooter",
      "powerComparisonSummary": "EV ultra-safe LFP battery chemistry with 170mm ground clearance"
    }
  },
  {
    id: 'bgauss-ruv-350',
    name: 'BGauss RUV 350 (3.0 kWh LFP)',
    brand: 'BGauss',
    tagline: 'Rider Utility Vehicle with 16-inch Motorcycle-Grade Wheels',
    category: 'scooter',
    pricing: {
      exShowroom: 109990,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5500,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 3.0,
      usableBatteryCapacityKwh: 2.8,
      batteryChemistry: 'LFP',
      isRemovableBattery: false,
      araiRangeKm: 145,
      realWorldEcoRangeKm: 120,
      realWorldCityRangeKm: 100,
      realWorldHighwayRangeKm: 78,
      topSpeedKmh: 75,
      accel0To40Kmh: 4.3,
      motorPeakPowerKw: 3.5,
      motorRatedPowerKw: 2.5,
      motorPeakTorqueNm: 30,
      driveType: 'Hub',
      chargingTime0To80: '3h 45m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: false,
      fastChargingRate: 'Home 15A socket',
      bootSpaceLiters: 20,
      frunkSpaceLiters: 4,
      ridingModes: ['Eco', 'Ride', 'Sport'],
      brakes: 'Front Drum, Rear Drum (CBS)',
      brakingSafety: 'Drum CBS',
      kerbWeightKg: 110,
      groundClearanceMm: 160,
      seatHeightMm: 785,
      wheelSizeInches: 16,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: '5-inch High Contrast TFT',
      connectivity: ['Bluetooth Turn-by-Turn Nav', 'Roll-over Sensor', 'Fall Detection', 'Service Reminder']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 60000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      '16-inch huge wheels front and rear (largest in electric scooter market)',
      'All-metal high durability body construction',
      'LFP battery with high thermal tolerance',
      'Step-through flat floorboard with under-foot storage'
    ],
    pros: [
      '16-inch wheels roll through severe potholes and speed-breakers with zero bottoming out',
      'Full metal body with high crash resistance',
      'LFP chemistry'
    ],
    cons: [
      '75 km/h top speed',
      'Drum brakes'
    ],
    badges: ['16-inch Giant Wheels', 'Full Metal Body', 'LFP Battery', 'RUV Utility'],
    rating: 4.5,
    reviewCount: 120,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/bgauss/ruv350/source/ruv3506a85613d1710e.jpg?model=bgauss-ruv-350&v=2026',
    colorOptions: [
      { name: 'Thunder Blue', hex: '#1e40af' },
      { name: 'Sparkle Black', hex: '#18181b' },
      { name: 'Crimson Red', hex: '#dc2626' }
    ],
    idealFor: 'Riders dealing with broken roads, flyovers, and speed-breakers daily',
    launchYear: 2024,
    madeInIndia: true,
    equivalentPetrolBenchmark: {
      "modelName": "Honda Activa 6G / TVS Jupiter (110cc)",
      "engineCc": 110,
      "petrolBhp": 7.8,
      "petrolTorqueNm": 8.9,
      "petrolMileageKmpl": 50,
      "petrolExShowroom": 78000,
      "petrolOnRoadTG": 94000,
      "classComparison": "110cc Big-Wheel Scooter",
      "powerComparisonSummary": "EV segment-first 16-inch big alloy wheels for rough Telangana roads"
    }
  },

  // ==========================================
  
  // --- Ultraviolette Concept X47 (Adventure Crossover) ---
  {
    id: 'ultraviolette-concept-x47',
    name: 'Ultraviolette Concept X47 (Crossover Electric Adventure)',
    brand: 'Ultraviolette Automotive',
    tagline: 'High-Performance Electric Adventure Crossover with 323 km Range',
    category: 'motorcycle',
    badges: ['Adventure Crossover', '323 km Range', '150 km/h', '200mm Clearance'],
    rating: 4.9,
    reviewCount: 38,
    launchYear: 2025,
    madeInIndia: true,
    idealFor: 'Adventure touring enthusiasts, Deccan highway roadtrippers, and riders seeking dual-sport performance with zero fuel cost',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ultraviolette/concept-x/source/concept-x68e50f2bdcaa2.jpg?model=ultraviolette-concept-x47&v=2026',
    colorOptions: [
      { name: 'Desert Dune Camo', hex: '#b5a176' },
      { name: 'Stealth Carbon Grey', hex: '#262626' },
      { name: 'Cyberpunk Fluorescent Yellow', hex: '#eab308' }
    ],
    pricing: {
      exShowroom: 349000,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 14200,
      handlingAndDocsEst: 2000
    },
    specs: {
      batteryCapacityKwh: 10.3,
      usableBatteryCapacityKwh: 9.8,
      batteryChemistry: 'NMC SRB7',
      isRemovableBattery: false,
      araiRangeKm: 323,
      realWorldEcoRangeKm: 280,
      realWorldCityRangeKm: 240,
      realWorldHighwayRangeKm: 175,
      topSpeedKmh: 150,
      accel0To40Kmh: 2.8,
      accel0To60Kmh: 3.8,
      motorPeakPowerKw: 30.0,
      motorRatedPowerKw: 15.0,
      motorPeakTorqueNm: 100,
      wheelTorqueNm: 580,
      driveType: 'Chain',
      chargingTime0To80: '4h 30m',
      chargingTime0To100: '6h 00m',
      fastChargingSupport: true,
      fastChargingRate: '12 kW Boost Charger (0-80% in 90 min)',
      bootSpaceLiters: 15,
      ridingModes: ['Glide', 'Combat', 'Ballistic', 'Off-Road Terrain'],
      brakes: '320mm Front Disc with Radial Caliper, 230mm Rear Disc with Switchable Dual-Channel ABS',
      brakingSafety: 'Bosch Dual-Channel ABS with Off-Road Mode',
      kerbWeightKg: 198,
      groundClearanceMm: 200,
      seatHeightMm: 830,
      wheelSizeInches: 19,
      wheelSizeFront: '100/90-19',
      wheelSizeRear: '150/70-17',
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'TFT with Turn-by-Turn Navigation',
      connectivity: ['Bluetooth 5.0', 'LTE 4G Telematics', 'Crash Alert', 'Hill Hold Assist', 'Dynamic Regen']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 800000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Dual-sport adventure chassis with 200mm ground clearance for rugged Telangana terrains',
      'Massive 10.3 kWh SRB7 battery pack delivering 240 km real-world city range',
      'Bosch Dual-Channel ABS with switchable rear ABS for off-road dirt riding',
      '12 kW Boost fast-charging compatible with public CCS2 stations via adapter'
    ],
    pros: [
      'Unmatched 323 km ARAI range and commanding 200mm ground clearance',
      '30 kW peak power with relentless 100 Nm motor torque',
      'Industry-first 8-year / 8,00,000 km battery warranty'
    ],
    cons: [
      'Premium ₹3.49 Lakh pricing',
      'High 830mm seat height challenging for shorter riders'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'BMW G 310 GS / KTM 390 Adventure',
      engineCc: 373,
      petrolBhp: 43.5,
      petrolTorqueNm: 37.0,
      petrolMileageKmpl: 28,
      petrolExShowroom: 360000,
      petrolOnRoadTG: 425000,
      classComparison: '390cc Dual-Sport Adventure Tourer',
      powerComparisonSummary: 'Concept X47 generates 100 Nm instant torque vs KTM 390 Adventure\'s 37 Nm with ₹0 road tax in Telangana'
    }
  },

  // --- Ultraviolette F99 Factory Racing Platform ---
  {
    id: 'ultraviolette-f99-racing',
    name: 'Ultraviolette F99 Factory Racing Platform',
    brand: 'Ultraviolette Automotive',
    tagline: '120 bhp Active-Aerodynamic Electric Superbike (265 km/h)',
    category: 'motorcycle',
    badges: ['265 km/h Superbike', '120 bhp (90 kW)', 'Carbon Fiber', 'Active Aero'],
    rating: 5.0,
    reviewCount: 19,
    launchYear: 2025,
    madeInIndia: true,
    idealFor: 'Track-day racers, hyperbike collectors, and supersport enthusiasts demanding 265 km/h track velocity',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ultraviolette/f99/source/f996985cc438bb78.jpg?model=ultraviolette-f99-racing&v=2026',
    colorOptions: [
      { name: 'Factory Racing Rosso', hex: '#dc2626' },
      { name: 'Aviation Carbon Matte', hex: '#171717' }
    ],
    pricing: {
      exShowroom: 799000,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 28500,
      handlingAndDocsEst: 3000
    },
    specs: {
      batteryCapacityKwh: 10.3,
      usableBatteryCapacityKwh: 9.8,
      batteryChemistry: 'NMC 21700 Racing Spec',
      isRemovableBattery: false,
      araiRangeKm: 250,
      realWorldEcoRangeKm: 210,
      realWorldCityRangeKm: 180,
      realWorldHighwayRangeKm: 130,
      topSpeedKmh: 265,
      accel0To40Kmh: 1.5,
      accel0To60Kmh: 2.2,
      motorPeakPowerKw: 90.0,
      motorRatedPowerKw: 45.0,
      motorPeakTorqueNm: 200,
      wheelTorqueNm: 950,
      driveType: 'Chain',
      chargingTime0To80: '2h 30m',
      chargingTime0To100: '3h 30m',
      fastChargingSupport: true,
      fastChargingRate: 'DC Fast Charging 15 kW (0-80% in 45 min)',
      bootSpaceLiters: 0,
      ridingModes: ['Track', 'Qualifying', 'Rain', 'Supersonic'],
      brakes: 'Dual 320mm Front Brembo Monobloc Calipers, 240mm Rear Disc with Race ABS',
      brakingSafety: 'Brembo Racing Dual-Channel ABS with Lean-Angle Sensitivity',
      kerbWeightKg: 178,
      groundClearanceMm: 140,
      seatHeightMm: 810,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.5,
      displayType: 'OLED Race Telemetry Dash',
      connectivity: ['Live Track Telemetry', 'Tire Pressure/Temp Sensors', 'GPS Lap Timer', 'Lean Angle Logger']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 100000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Active electronic winglets that articulate based on lean angle and braking deceleration',
      'Ultra-lightweight aerospace carbon fiber composite fairings and structural subframe',
      '90 kW (120 bhp) peak output propelling the superbike to an astounding 265 km/h',
      'Brembo dual monobloc radial front calipers with titanium hardware'
    ],
    pros: [
      'India\'s fastest production electric motorcycle with 265 km/h top speed',
      '0-100 km/h in 3.0s with active aerodynamic downforce',
      'Full carbon fiber construction with race-ready Brembo braking'
    ],
    cons: [
      'Track-focused aggressive supersport clip-on ergonomics',
      '₹7.99 Lakh flagship price tag'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Kawasaki Ninja ZX-6R / Ducati Panigale V2',
      engineCc: 636,
      petrolBhp: 130,
      petrolTorqueNm: 69.0,
      petrolMileageKmpl: 15,
      petrolExShowroom: 1120000,
      petrolOnRoadTG: 1340000,
      classComparison: '600cc Supersport Race Track Weapon',
      powerComparisonSummary: 'F99 provides 120 bhp instant EV torque with active aero winglets at ₹0 road tax in Telangana'
    }
  },

  // --- Orxa Mantis (8.9 kWh Performance Streetfighter) ---
  {
    id: 'orxa-mantis-89',
    name: 'Orxa Mantis (8.9 kWh Streetfighter)',
    brand: 'Orxa Energies',
    tagline: 'Aerospace-Engineered All-Aluminum Streetfighter with 221 km Range',
    category: 'motorcycle',
    badges: ['8.9 kWh Battery', '135 km/h', 'All-Aluminum Frame', '221 km Range'],
    rating: 4.7,
    reviewCount: 26,
    launchYear: 2024,
    madeInIndia: true,
    idealFor: 'Urban performance riders and tech enthusiasts who want an agile, aerospace-grade naked streetfighter',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/orxa-energies/mantis/source/mantis695b75e7cb668.jpg?model=orxa-mantis-89&v=2026',
    colorOptions: [
      { name: 'Urban Black', hex: '#111827' },
      { name: 'Stealth Grey', hex: '#4b5563' }
    ],
    pricing: {
      exShowroom: 360000,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 14500,
      handlingAndDocsEst: 2000
    },
    specs: {
      batteryCapacityKwh: 8.9,
      usableBatteryCapacityKwh: 8.5,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 221,
      realWorldEcoRangeKm: 195,
      realWorldCityRangeKm: 175,
      realWorldHighwayRangeKm: 130,
      topSpeedKmh: 135,
      accel0To40Kmh: 2.7,
      accel0To60Kmh: 3.8,
      motorPeakPowerKw: 20.5,
      motorRatedPowerKw: 10.0,
      motorPeakTorqueNm: 93,
      wheelTorqueNm: 520,
      driveType: 'Chain',
      chargingTime0To80: '4h 00m',
      chargingTime0To100: '5h 00m',
      fastChargingSupport: true,
      fastChargingRate: 'Blitz Fast Charger (0-80% in 2.5h)',
      bootSpaceLiters: 10,
      ridingModes: ['Eco', 'City', 'Sport'],
      brakes: 'Front & Rear Hydraulic Discs with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS',
      kerbWeightKg: 182,
      groundClearanceMm: 180,
      seatHeightMm: 815,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Linux-Powered TFT Cockpit',
      connectivity: ['Bluetooth', 'GPS Navigation', 'Telemetry Analytics', 'Ride Diagnostics']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 100000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Aerospace-grade all-aluminum honeycomb frame for class-leading torsional rigidity',
      'Generous 8.9 kWh battery providing genuine 175 km real-world city range',
      'Dual-Channel ABS and 41mm telescopic front forks with preload-adjustable monoshock',
      'Linux-powered MantisOS instrument cluster with turn-by-turn navigation'
    ],
    pros: [
      'Extremely solid aerospace-grade aluminum chassis with zero rattles',
      'Genuine 175 km real city range with punchy 93 Nm torque',
      'Sophisticated Linux-based instrument cluster'
    ],
    cons: [
      '₹3.60 Lakh premium ex-showroom price',
      'Limited dealer footprint across Tier-2 Telangana towns'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'KTM 250 Duke / TVS Apache RTR 310',
      engineCc: 249,
      petrolBhp: 31.0,
      petrolTorqueNm: 25.0,
      petrolMileageKmpl: 32,
      petrolExShowroom: 240000,
      petrolOnRoadTG: 285000,
      classComparison: '250cc Naked Streetfighter',
      powerComparisonSummary: 'Mantis delivers 93 Nm instant torque vs 250 Duke\'s 25 Nm with zero vibration'
    }
  },

  // --- Revolt RV BlazeX ---
  {
    id: 'revolt-rv-blazex',
    name: 'Revolt RV BlazeX (3.24 kWh)',
    brand: 'Revolt Motors',
    tagline: 'Aggressive Urban Commuter with Fast Charging & 150 km Range',
    category: 'motorcycle',
    badges: ['Removable Battery', '150 km Range', '85 km/h', 'Under ₹1.2L'],
    rating: 4.4,
    reviewCount: 31,
    launchYear: 2025,
    madeInIndia: true,
    idealFor: 'Daily city commuters wanting sporty street bike looks with a removable battery for apartment charging',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/revolt/rv-blazex/source/rv-blazex68f1f09d55467.jpg?model=revolt-rv-blazex&v=2026',
    colorOptions: [
      { name: 'Blaze Red', hex: '#ef4444' },
      { name: 'Cosmic Grey', hex: '#374151' },
      { name: 'Rebel White', hex: '#f3f4f6' }
    ],
    pricing: {
      exShowroom: 114990,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5800,
      handlingAndDocsEst: 1500
    },
    specs: {
      batteryCapacityKwh: 3.24,
      usableBatteryCapacityKwh: 3.0,
      batteryChemistry: 'Removable LFP',
      isRemovableBattery: true,
      batteryCount: 1,
      araiRangeKm: 150,
      realWorldEcoRangeKm: 140,
      realWorldCityRangeKm: 120,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 85,
      accel0To40Kmh: 3.9,
      motorPeakPowerKw: 3.0,
      motorRatedPowerKw: 1.8,
      motorPeakTorqueNm: 54,
      driveType: 'Belt',
      chargingTime0To80: '3h 15m',
      chargingTime0To100: '4h 15m',
      fastChargingSupport: true,
      fastChargingRate: 'Fast Charger 0-80% in 100 min',
      bootSpaceLiters: 0,
      ridingModes: ['Eco (45 km/h)', 'Normal (65 km/h)', 'Sports (85 km/h)'],
      brakes: 'Front & Rear Disc Brakes with CBS',
      brakingSafety: 'Combined Braking System (CBS)',
      kerbWeightKg: 108,
      groundClearanceMm: 180,
      seatHeightMm: 800,
      wheelSizeInches: 17,
      touchscreen: false,
      displaySizeInches: 4.5,
      displayType: 'Digital LCD with MyRevolt App Sync',
      connectivity: ['MyRevolt App', 'Geo-Fencing', 'Battery Swap Network', 'OTA Updates']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 75000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Removable 3.24 kWh LFP battery pack easily charged in apartment homes',
      'Smooth and quiet carbon-reinforced belt drive with zero chain lube maintenance',
      'Sub-₹1.15 Lakh on-road Telangana pricing with 100% road tax exemption',
      'Sturdy 180mm ground clearance for rough Telangana city roads'
    ],
    pros: [
      'Removable battery ideal for high-rise apartment dwellers in Hyderabad',
      'Sporty street styling with comfortable upright commuter ergonomics',
      'Affordable maintenance with belt-drive system'
    ],
    cons: [
      '85 km/h top speed limited for open expressways',
      'No under-seat storage'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Honda SP125 / Hero Glamour',
      engineCc: 124,
      petrolBhp: 10.7,
      petrolTorqueNm: 10.9,
      petrolMileageKmpl: 55,
      petrolExShowroom: 90000,
      petrolOnRoadTG: 110000,
      classComparison: '125cc Premium Commuter Motorcycle',
      powerComparisonSummary: 'BlazeX provides 54 Nm instant wheel torque vs SP125\'s 10.9 Nm with zero fuel expenses'
    }
  },

  // --- TVS X (Performance Maxi-Scooter) ---
  {
    id: 'tvs-x-44',
    name: 'TVS X (4.44 kWh Performance Maxi-Scooter)',
    brand: 'TVS Motor',
    tagline: 'Futuristic Maxi-Scooter with 10.25-inch NavPro HD Display & 105 km/h',
    category: 'scooter',
    badges: ['Maxi-Scooter', '10.25" HD Display', '105 km/h', '4.44 kWh'],
    rating: 4.6,
    reviewCount: 44,
    launchYear: 2024,
    madeInIndia: true,
    idealFor: 'Enthusiasts and tech-savvy urban commuters desiring a futuristic, connected maxi-scooter with segment-leading displays',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/tvs/tvs-electric-scooter/source/tvs-electric-scooter68ce618bd4daf.jpg?model=tvs-x-44&v=2026',
    colorOptions: [
      { name: 'Hyper Silver & Red', hex: '#dc2626' },
      { name: 'Cyber Stealth Black', hex: '#18181b' }
    ],
    pricing: {
      exShowroom: 249990,
      pmEdriveSubsidy: 0,
      chargerIncluded: false,
      chargerCost: 16275,
      insuranceEst: 10800,
      handlingAndDocsEst: 2000
    },
    specs: {
      batteryCapacityKwh: 4.44,
      usableBatteryCapacityKwh: 4.1,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 140,
      realWorldEcoRangeKm: 125,
      realWorldCityRangeKm: 105,
      realWorldHighwayRangeKm: 80,
      topSpeedKmh: 105,
      accel0To40Kmh: 2.6,
      accel0To60Kmh: 4.5,
      motorPeakPowerKw: 11.0,
      motorRatedPowerKw: 7.0,
      motorPeakTorqueNm: 40,
      wheelTorqueNm: 220,
      driveType: 'Belt',
      chargingTime0To80: '3h 40m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: true,
      fastChargingRate: 'SmartX Home Rapid Charger (0-50% in 50 min)',
      bootSpaceLiters: 19,
      ridingModes: ['Xtealth', 'Xtride', 'Xsonic'],
      brakes: '220mm Front Disc with Single-Channel ABS, 195mm Rear Disc',
      brakingSafety: 'Single-Channel ABS',
      kerbWeightKg: 118,
      groundClearanceMm: 175,
      seatHeightMm: 770,
      wheelSizeInches: 12,
      touchscreen: true,
      displaySizeInches: 10.25,
      displayType: '10.25-inch HD Tilt-Adjustable Panoramic NavPro Screen',
      connectivity: ['SmartXonnect 4G', 'NavPro Maps', 'Live Weather', 'Music & Call Controls', 'Cruise Control']
    },
    warranty: {
      batteryYears: 3,
      batteryKm: 50000,
      vehicleYears: 3,
      vehicleKm: 50000,
      extendedAvailable: true
    },
    features: [
      'Segment-first 10.25-inch HD panoramic tilt-adjustable touchscreen infotainment',
      'Exoskeleton aluminum alloy spine frame providing outstanding handling agility',
      'Cruise control, reverse assist, and regenerative braking with 3 selectable levels',
      'TVS SmartXonnect live telemetry with geofencing and anti-theft immobilization'
    ],
    pros: [
      'Mind-blowing 10.25-inch high-resolution tilt-adjustable display',
      'Blistering 0-40 in 2.6s acceleration and stable 105 km/h top speed',
      'Premium build quality with aluminum exoskeleton chassis'
    ],
    cons: [
      'High ex-showroom price of ₹2.50 Lakh',
      'Modest 19L boot space'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Yamaha Aerox 155',
      engineCc: 155,
      petrolBhp: 15.0,
      petrolTorqueNm: 13.9,
      petrolMileageKmpl: 40,
      petrolExShowroom: 148000,
      petrolOnRoadTG: 180000,
      classComparison: '155cc Performance Maxi-Scooter',
      powerComparisonSummary: 'TVS X delivers instant 40 Nm motor torque and massive 10.25" screen vs Aerox\'s 13.9 Nm'
    }
  },

  // --- BGauss C12i Max ---
  {
    id: 'bgauss-c12i-max',
    name: 'BGauss C12i Max (3.2 kWh LFP Long Range)',
    brand: 'BGauss',
    tagline: 'Reliable All-Metal Family Electric Scooter with 135 km Range',
    category: 'scooter',
    badges: ['Full Metal Body', 'LFP Battery', '135 km Range', 'Waterproof IP67'],
    rating: 4.5,
    reviewCount: 36,
    launchYear: 2024,
    madeInIndia: true,
    idealFor: 'Families wanting a rugged metal body electric scooter with safe LFP thermal chemistry for Telangana summers',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/bgauss/c12i-max/source/c12i-max6a0da949da693.jpg?model=bgauss-c12i-max&v=2026',
    colorOptions: [
      { name: 'Matte Blue', hex: '#1e3a8a' },
      { name: 'Pearl White', hex: '#f8fafc' },
      { name: 'Gunmetal Grey', hex: '#334155' }
    ],
    pricing: {
      exShowroom: 126900,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 6100,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 3.2,
      usableBatteryCapacityKwh: 3.0,
      batteryChemistry: 'Fixed LFP',
      isRemovableBattery: false,
      araiRangeKm: 135,
      realWorldEcoRangeKm: 120,
      realWorldCityRangeKm: 105,
      realWorldHighwayRangeKm: 80,
      topSpeedKmh: 60,
      accel0To40Kmh: 4.8,
      motorPeakPowerKw: 2.5,
      motorRatedPowerKw: 1.5,
      motorPeakTorqueNm: 36,
      driveType: 'Hub',
      chargingTime0To80: '4h 00m',
      chargingTime0To100: '5h 30m',
      fastChargingSupport: false,
      fastChargingRate: 'Standard 15A Socket',
      bootSpaceLiters: 23,
      ridingModes: ['Eco', 'Sport', 'Reverse'],
      brakes: 'Front Disc, Rear Drum with CBS',
      brakingSafety: 'Combi Brake System (CBS)',
      kerbWeightKg: 107,
      groundClearanceMm: 165,
      seatHeightMm: 765,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 5.0,
      displayType: 'Color LCD Digital Console',
      connectivity: ['Bluetooth App', 'Battery Health Tracker', 'Distance-to-Empty', 'Service Reminder']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 75000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Robust all-metal body panels designed for rugged city durability',
      'Ultra-safe LFP battery chemistry with superior thermal tolerance for Deccan summers',
      'Wide flat floorboard with generous dual-helmet storage hook',
      'CBS braking system with front disc brake and reverse parking assist'
    ],
    pros: [
      'Heavy-duty all-metal body construction with long durability',
      'Thermally resilient LFP battery immune to summer thermal throttling',
      'Comfortable family seat and easy 765mm seat height'
    ],
    cons: [
      '60 km/h top speed tailored strictly for city limits',
      'Basic monochrome LCD dash'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'TVS Jupiter 125',
      engineCc: 124.8,
      petrolBhp: 8.1,
      petrolTorqueNm: 10.5,
      petrolMileageKmpl: 50,
      petrolExShowroom: 88000,
      petrolOnRoadTG: 108000,
      classComparison: '125cc All-Metal Family Commuter Scooter',
      powerComparisonSummary: 'C12i Max delivers silent metal-body commuting with ₹0 road tax in Telangana'
    }
  },

  // --- Bounce Infinity E.1+ ---
  {
    id: 'bounce-infinity-e1-plus',
    name: 'Bounce Infinity E.1+ (2.5 kWh Swappable)',
    brand: 'Bounce Infinity',
    tagline: 'Swappable Battery Electric Scooter with Dual Charging Flexibility',
    category: 'scooter',
    badges: ['Swappable Battery', 'Sub-₹90K', '65 km/h', 'Dual Charging'],
    rating: 4.2,
    reviewCount: 29,
    launchYear: 2024,
    madeInIndia: true,
    idealFor: 'Apartment tenants without basement sockets who want an affordable, swappable-battery scooter',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/bounce/e-scooter/source/e-scooter695f995f79bf5.jpg?model=bounce-infinity-e1-plus&v=2026',
    colorOptions: [
      { name: 'Sparkle Black', hex: '#09090b' },
      { name: 'Comet Grey', hex: '#64748b' },
      { name: 'Sporty Red', hex: '#ef4444' }
    ],
    pricing: {
      exShowroom: 89999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 4800,
      handlingAndDocsEst: 1200
    },
    specs: {
      batteryCapacityKwh: 2.5,
      usableBatteryCapacityKwh: 2.3,
      batteryChemistry: 'Removable NMC',
      isRemovableBattery: true,
      batteryCount: 1,
      araiRangeKm: 100,
      realWorldEcoRangeKm: 95,
      realWorldCityRangeKm: 85,
      realWorldHighwayRangeKm: 60,
      topSpeedKmh: 65,
      accel0To40Kmh: 4.5,
      motorPeakPowerKw: 2.2,
      motorRatedPowerKw: 1.5,
      motorPeakTorqueNm: 30,
      driveType: 'Hub',
      chargingTime0To80: '3h 30m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: false,
      fastChargingRate: 'Removable Dock Charging (15A socket)',
      bootSpaceLiters: 15,
      ridingModes: ['Eco', 'Power', 'Drag Mode', 'Reverse Mode'],
      brakes: 'Front & Rear Disc Brakes with EBS',
      brakingSafety: 'Electronic Braking System (EBS)',
      kerbWeightKg: 94,
      groundClearanceMm: 155,
      seatHeightMm: 780,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 4.5,
      displayType: 'Digital Instrument Cluster',
      connectivity: ['Bluetooth Mobile App', 'Tow Alert', 'Geofencing', 'Live Tracking']
    },
    warranty: {
      batteryYears: 3,
      batteryKm: 45000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Portable removable battery that can be carried upstairs and charged like a smartphone',
      'Unique Drag Mode that assists pushing the scooter if tyre gets punctured',
      'Dual disc brakes (front and rear) for secure stopping control',
      'Reverse parking assist and anti-theft smart key system'
    ],
    pros: [
      'Very affordable sub-₹90,000 ex-showroom price',
      'Lightweight removable battery perfect for high-floor flat owners',
      'Dual disc brakes standard at this price point'
    ],
    cons: [
      'Limited 12L boot space due to battery compartment',
      '65 km/h top speed'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Hero Pleasure Plus',
      engineCc: 110.9,
      petrolBhp: 8.0,
      petrolTorqueNm: 8.7,
      petrolMileageKmpl: 50,
      petrolExShowroom: 72000,
      petrolOnRoadTG: 88000,
      classComparison: '110cc Lightweight City Commuter Scooter',
      powerComparisonSummary: 'E.1+ offers zero emissions and portable battery charging with ₹0 road tax in Telangana'
    }
  },

  
  // --- Ola Cruiser Concept ---
  {
    id: 'ola-cruiser-concept',
    name: 'Ola Cruiser (Electric Power Cruiser)',
    brand: 'Ola Electric',
    tagline: 'Futuristic Electric Long-Haul Power Cruiser with 500 km Range',
    category: 'motorcycle',
    badges: ['Power Cruiser', '500 km Range', '16 kWh Battery', '155 km/h'],
    rating: 4.8,
    reviewCount: 42,
    launchYear: 2025,
    madeInIndia: true,
    idealFor: 'Highway cruisers, long-distance touring enthusiasts, and riders wanting relaxed foot-forward ergonomics',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/ola-cruiser/source/ola-cruiser6981e723da000.jpg?model=ola-cruiser-concept&v=2026',
    colorOptions: [
      { name: 'Titanium Matte Silver', hex: '#64748b' },
      { name: 'Obsidian Midnight Black', hex: '#0f172a' }
    ],
    pricing: {
      exShowroom: 269999,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 11800,
      handlingAndDocsEst: 1800
    },
    specs: {
      batteryCapacityKwh: 16.0,
      usableBatteryCapacityKwh: 15.0,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 500,
      realWorldEcoRangeKm: 420,
      realWorldCityRangeKm: 360,
      realWorldHighwayRangeKm: 270,
      topSpeedKmh: 155,
      accel0To40Kmh: 2.3,
      accel0To60Kmh: 3.4,
      motorPeakPowerKw: 35.0,
      motorRatedPowerKw: 18.0,
      motorPeakTorqueNm: 90,
      wheelTorqueNm: 600,
      driveType: 'Belt',
      chargingTime0To80: '5h 00m',
      chargingTime0To100: '7h 00m',
      fastChargingSupport: true,
      fastChargingRate: 'Ola Hypercharger (15 min for 100 km)',
      bootSpaceLiters: 15,
      ridingModes: ['Eco', 'Normal', 'Sports', 'Cruise Mode'],
      brakes: 'Dual 320mm Front Discs, 240mm Rear Disc with Dual-Channel ABS',
      brakingSafety: 'Dual-Channel ABS',
      kerbWeightKg: 195,
      groundClearanceMm: 165,
      seatHeightMm: 750,
      wheelSizeInches: 18,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7.0-inch 1080p Touchscreen MoveOS 5',
      connectivity: ['MoveOS 5', 'Adaptive Cruise Control', 'Proximity Unlock', 'Built-in Navigation', 'Party Mode']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Low 750mm seat height with forward-set footpegs for effortless Hyderabad-to-Warangal highway touring',
      'Massive 16 kWh battery pack providing 360 km real-world city range',
      'Quiet carbon belt-drive system eliminating chain maintenance',
      'Adaptive cruise control and full MoveOS connected ecosystem'
    ],
    pros: [
      'Unrivaled 500 km range capability for inter-district Telangana touring',
      'Relaxed low-slung cruiser posture suitable for all rider heights',
      'Huge 35 kW peak motor output with instant roll-on torque'
    ],
    cons: [
      'Heavier 195 kg curb weight in tight bumper-to-bumper city traffic',
      'Long wheelbase requires wider turning radius'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Royal Enfield Super Meteor 650',
      engineCc: 648,
      petrolBhp: 47.0,
      petrolTorqueNm: 52.3,
      petrolMileageKmpl: 24,
      petrolExShowroom: 364000,
      petrolOnRoadTG: 430000,
      classComparison: '650cc Twin-Cylinder Power Cruiser',
      powerComparisonSummary: 'Ola Cruiser delivers 90 Nm motor torque with ₹0 road tax in Telangana'
    }
  },

  // --- Ola Diamondhead (Electric Supersport Flagship) ---
  {
    id: 'ola-diamondhead',
    name: 'Ola Diamondhead (Electric Supersport Flagship)',
    brand: 'Ola Electric',
    tagline: 'Aerodynamic Halo Superbike with Diamond-Cut Monocoque & 160 km/h',
    category: 'motorcycle',
    badges: ['Halo Superbike', '160 km/h', 'Hub-Center Steering', '16 kWh'],
    rating: 4.9,
    reviewCount: 22,
    launchYear: 2025,
    madeInIndia: true,
    idealFor: 'Supersport track riders and avant-garde design collectors desiring a futuristic diamond-cut electric superbike',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/ola-diamondhead/source/ola-diamondhead6989d506d602c.jpg?model=ola-diamondhead&v=2026',
    colorOptions: [
      { name: 'Diamond Silver Monolith', hex: '#e2e8f0' },
      { name: 'Stealth Matte Black', hex: '#0a0a0a' }
    ],
    pricing: {
      exShowroom: 499999,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 18500,
      handlingAndDocsEst: 2500
    },
    specs: {
      batteryCapacityKwh: 16.0,
      usableBatteryCapacityKwh: 15.2,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 450,
      realWorldEcoRangeKm: 380,
      realWorldCityRangeKm: 320,
      realWorldHighwayRangeKm: 230,
      topSpeedKmh: 160,
      accel0To40Kmh: 1.8,
      accel0To60Kmh: 2.6,
      motorPeakPowerKw: 52.0,
      motorRatedPowerKw: 25.0,
      motorPeakTorqueNm: 105,
      wheelTorqueNm: 750,
      driveType: 'Belt',
      chargingTime0To80: '4h 30m',
      chargingTime0To100: '6h 00m',
      fastChargingSupport: true,
      fastChargingRate: 'Hypercharger 15 kW (0-80% in 35 min)',
      bootSpaceLiters: 0,
      ridingModes: ['Eco', 'Normal', 'Sport', 'Hyper Track'],
      brakes: 'Dual 320mm Front Radial Discs, 240mm Rear Disc with Cornering ABS',
      brakingSafety: 'Cornering ABS & Traction Control',
      kerbWeightKg: 188,
      groundClearanceMm: 155,
      seatHeightMm: 820,
      wheelSizeInches: 17,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: 'Concealed Retractable OLED Display',
      connectivity: ['MoveOS 5 Racing', 'Cornering Traction Control', 'Launch Control', 'Active Thermal Telemetry']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Revolutionary hub-center steering mechanism separating braking dive from steering geometry',
      'Aerodynamic diamond-cut monocoque enclosing the entire front fascia and retractable display',
      '52 kW (70 bhp) electric powertrain reaching 160 km/h with sub-2.0s 0-40 acceleration',
      'Cornering ABS and multi-level dynamic traction control'
    ],
    pros: [
      'Stunning concept-to-production diamond-cut design',
      '70 bhp peak power with fierce 105 Nm instant torque',
      'Cornering ABS and advanced hub-center front suspension'
    ],
    cons: [
      'Aggressive supersport posture suited for track and fast canyon runs',
      '₹5.00 Lakh price bracket'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Yamaha YZF-R7 / Kawasaki Ninja 650',
      engineCc: 689,
      petrolBhp: 73.4,
      petrolTorqueNm: 67.0,
      petrolMileageKmpl: 22,
      petrolExShowroom: 712000,
      petrolOnRoadTG: 835000,
      classComparison: '700cc Middleweight Supersport',
      powerComparisonSummary: 'Diamondhead matches R7 power while delivering 105 Nm instant torque at ₹0 road tax in Telangana'
    }
  },

  // --- Ola Adventure Motorcycle ---
  {
    id: 'ola-adventure',
    name: 'Ola Adventure (Electric Dual-Sport ADV)',
    brand: 'Ola Electric',
    tagline: 'Rugged Long-Travel Adventure Motorcycle with 220mm Ground Clearance',
    category: 'motorcycle',
    badges: ['ADV Dual-Sport', '220mm Clearance', '21" Spoke Wheel', '380 km Range'],
    rating: 4.8,
    reviewCount: 35,
    launchYear: 2025,
    madeInIndia: true,
    idealFor: 'Off-road explorers, trail riders, and adventure touring enthusiasts navigating unpaved roads and forest corridors',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/ola-electric/ola-electric-bike/source/ola-electric-bike68da2a3905058.jpg?model=ola-adventure&v=2026',
    colorOptions: [
      { name: 'Kalahari Safari Sand', hex: '#d97706' },
      { name: 'Forest Green Matte', hex: '#15803d' }
    ],
    pricing: {
      exShowroom: 249999,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 11200,
      handlingAndDocsEst: 1800
    },
    specs: {
      batteryCapacityKwh: 12.0,
      usableBatteryCapacityKwh: 11.4,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 380,
      realWorldEcoRangeKm: 320,
      realWorldCityRangeKm: 270,
      realWorldHighwayRangeKm: 200,
      topSpeedKmh: 140,
      accel0To40Kmh: 2.6,
      accel0To60Kmh: 3.7,
      motorPeakPowerKw: 30.0,
      motorRatedPowerKw: 15.0,
      motorPeakTorqueNm: 85,
      wheelTorqueNm: 560,
      driveType: 'Chain',
      chargingTime0To80: '4h 00m',
      chargingTime0To100: '5h 30m',
      fastChargingSupport: true,
      fastChargingRate: 'Hypercharger (15 min for 100 km)',
      bootSpaceLiters: 10,
      ridingModes: ['Eco', 'Trail', 'Sport', 'Off-Road Sand/Mud'],
      brakes: 'Front & Rear Discs with Switchable Off-Road ABS',
      brakingSafety: 'Dual-Channel ABS with Off-Road Mode',
      kerbWeightKg: 185,
      groundClearanceMm: 220,
      seatHeightMm: 840,
      wheelSizeInches: 21,
      wheelSizeFront: '90/90-21 Spoke',
      wheelSizeRear: '140/80-18 Spoke',
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7.0-inch High-Brightness Outdoor Touchscreen',
      connectivity: ['Topo Maps GPS', 'Trail Tracking', 'MoveOS 5 Outdoor', 'SOS Beacon']
    },
    warranty: {
      batteryYears: 8,
      batteryKm: 80000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      '21-inch front and 18-inch rear wire-spoked wheels with block-pattern dual-sport tyres',
      'Commanding 220mm ground clearance for extreme speed-breakers, rocks, and water wading',
      '30 kW peak electric motor delivering 85 Nm torque for steep hill climbs',
      'Switchable rear ABS for controlled rear-wheel slide on dirt trails'
    ],
    pros: [
      'Outstanding 220mm ground clearance and 21" front spoke wheel',
      'Genuine 270 km real city range with 12 kWh battery',
      'Smooth, instant low-end electric torque for off-road obstacles'
    ],
    cons: [
      'Tall 840mm saddle height requires taller rider inseam',
      'Chain drive requires periodic cleaning on dusty trails'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Royal Enfield Himalayan 450',
      engineCc: 452,
      petrolBhp: 40.0,
      petrolTorqueNm: 40.0,
      petrolMileageKmpl: 30,
      petrolExShowroom: 285000,
      petrolOnRoadTG: 340000,
      classComparison: '450cc Dual-Sport Adventure Motorcycle',
      powerComparisonSummary: 'Ola Adventure matches Himalayan 450 with 85 Nm instant torque and ₹0 road tax in Telangana'
    }
  },

  // --- Komaki Venice Classic ---
  {
    id: 'komaki-venice-classic',
    name: 'Komaki Venice Classic (3.0 kWh Retro Cruiser)',
    brand: 'Komaki Electric',
    tagline: 'Italian Vintage Retro Electric Scooter with Pillion Backrest & 120 km Range',
    category: 'scooter',
    badges: ['Vintage Retro', 'Removable LFP', '120 km Range', 'Pillion Backrest'],
    rating: 4.3,
    reviewCount: 30,
    launchYear: 2024,
    madeInIndia: true,
    idealFor: 'Commuters and senior family members wanting timeless retro curves, pillion backrest support, and reliable LFP chemistry',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/komaki/venice/source/venice6953894b5f992.jpg?model=komaki-venice-classic&v=2026',
    colorOptions: [
      { name: 'Vintage Mint Green', hex: '#86efac' },
      { name: 'Classic Cream White', hex: '#fef3c7' },
      { name: 'Ruby Metallic Wine', hex: '#991b1b' }
    ],
    pricing: {
      exShowroom: 119999,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5900,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 3.0,
      usableBatteryCapacityKwh: 2.8,
      batteryChemistry: 'Removable LFP',
      isRemovableBattery: true,
      batteryCount: 1,
      araiRangeKm: 120,
      realWorldEcoRangeKm: 110,
      realWorldCityRangeKm: 95,
      realWorldHighwayRangeKm: 70,
      topSpeedKmh: 70,
      accel0To40Kmh: 4.6,
      motorPeakPowerKw: 3.0,
      motorRatedPowerKw: 1.8,
      motorPeakTorqueNm: 35,
      driveType: 'Hub',
      chargingTime0To80: '3h 30m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: false,
      fastChargingRate: 'Standard 15A Socket',
      bootSpaceLiters: 18,
      ridingModes: ['Eco', 'Comfort', 'Sport', 'Turbo Boost', 'Reverse'],
      brakes: 'Front & Rear Dual Disc Brakes with CBS',
      brakingSafety: 'Combi Brake System (CBS)',
      kerbWeightKg: 98,
      groundClearanceMm: 160,
      seatHeightMm: 770,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 4.5,
      displayType: 'Color Digital Display with Bluetooth Sound System',
      connectivity: ['Bluetooth Sound System', 'FM Radio', 'USB Charging Port', 'Anti-Theft Alarm']
    },
    warranty: {
      batteryYears: 3,
      batteryKm: 50000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Italian classic retro curved silhouette with integrated chrome mirrors and cushioned pillion backrest',
      'Removable 3.0 kWh LFP battery suitable for home and apartment charging',
      'Dual disc brakes (front and rear) with CBS for dependable stopping safety',
      'Built-in Bluetooth music speakers and FM radio receiver for leisure rides'
    ],
    pros: [
      'Charming retro Italian aesthetic with comfortable backrest for pillion',
      'Removable LFP battery safe for hot Telangana weather',
      'Dual disc brakes and built-in music entertainment system'
    ],
    cons: [
      '70 km/h top speed',
      '18L boot space'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Vespa ZX 125',
      engineCc: 124.4,
      petrolBhp: 9.9,
      petrolTorqueNm: 9.6,
      petrolMileageKmpl: 45,
      petrolExShowroom: 118000,
      petrolOnRoadTG: 142000,
      classComparison: '125cc Retro Italian Lifestyle Scooter',
      powerComparisonSummary: 'Venice Classic matches Vespa retro charm with zero petrol bills and ₹0 road tax in Telangana'
    }
  },

  // --- Kabira Mobility KM5000 (Highway Cruiser) ---
  {
    id: 'kabira-km5000-cruiser',
    name: 'Kabira Mobility KM5000 (Electric Highway Cruiser)',
    brand: 'Kabira Mobility',
    tagline: 'High-Speed Electric Cruiser with Single-Sided Swingarm & 188 km/h',
    category: 'motorcycle',
    badges: ['188 km/h Cruiser', '11.6 kWh LFP', 'Single-Sided Swingarm', '344 km Range'],
    rating: 4.7,
    reviewCount: 18,
    launchYear: 2025,
    madeInIndia: true,
    idealFor: 'Long-distance highway riders and cruiser connoisseurs demanding high top speeds and single-sided swingarm aesthetics',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/kabira-mobility/km-5000/source/km-50006989d21c74cde.jpg?model=kabira-km5000-cruiser&v=2026',
    colorOptions: [
      { name: 'Midnight Black Chrome', hex: '#1c1917' },
      { name: 'Cobalt Blue Metallic', hex: '#1d4ed8' }
    ],
    pricing: {
      exShowroom: 315000,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 13500,
      handlingAndDocsEst: 2000
    },
    specs: {
      batteryCapacityKwh: 11.6,
      usableBatteryCapacityKwh: 11.0,
      batteryChemistry: 'Fixed LFP',
      isRemovableBattery: false,
      araiRangeKm: 344,
      realWorldEcoRangeKm: 300,
      realWorldCityRangeKm: 250,
      realWorldHighwayRangeKm: 185,
      topSpeedKmh: 188,
      accel0To40Kmh: 2.1,
      accel0To60Kmh: 3.2,
      motorPeakPowerKw: 20.0,
      motorRatedPowerKw: 12.0,
      motorPeakTorqueNm: 75,
      wheelTorqueNm: 520,
      driveType: 'Belt',
      chargingTime0To80: '3h 30m',
      chargingTime0To100: '4h 30m',
      fastChargingSupport: true,
      fastChargingRate: 'CCS2 Fast Charging (0-80% in 50 min)',
      bootSpaceLiters: 12,
      ridingModes: ['Eco', 'City', 'Sports', 'Hyper Speed'],
      brakes: 'Dual Front Discs with ABS, Single Rear Disc',
      brakingSafety: 'Dual-Channel ABS',
      kerbWeightKg: 172,
      groundClearanceMm: 170,
      seatHeightMm: 780,
      wheelSizeInches: 17,
      touchscreen: true,
      displaySizeInches: 7.0,
      displayType: '7.0-inch Touchscreen Dash with Smart Connectivity',
      connectivity: ['CCS2 Fast Charge Support', 'TPMS (Tyre Pressure Monitoring)', 'Turn-by-Turn GPS', 'Anti-Theft']
    },
    warranty: {
      batteryYears: 5,
      batteryKm: 100000,
      vehicleYears: 3,
      vehicleKm: 30000,
      extendedAvailable: true
    },
    features: [
      'Exquisite single-sided rear swingarm revealing the polished alloy wheel hub',
      'Massive 11.6 kWh LFP battery pack with exceptional 344 km range capacity',
      'Blistering 188 km/h top speed engineered for open highway expressways',
      'Integrated Tyre Pressure Monitoring System (TPMS) and standard CCS2 charging'
    ],
    pros: [
      'Fastest electric cruiser in India with 188 km/h top speed',
      'Single-sided swingarm gives breathtaking custom motorcycle presence',
      'Large 11.6 kWh LFP battery with 250 km real-world city range'
    ],
    cons: [
      '₹3.15 Lakh ex-showroom price',
      'Specialized dealer service network'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Kawasaki Vulcan S',
      engineCc: 649,
      petrolBhp: 61.0,
      petrolTorqueNm: 62.4,
      petrolMileageKmpl: 22,
      petrolExShowroom: 710000,
      petrolOnRoadTG: 830000,
      classComparison: '650cc Sport Cruiser',
      powerComparisonSummary: 'KM5000 matches 650cc performance with 188 km/h speed at ₹0 road tax in Telangana'
    }
  },

  // --- Bajaj Chetak 3202 (Blue Edition) ---
  {
    id: 'bajaj-chetak-3202',
    name: 'Bajaj Chetak 3202 (3.2 kWh Blue Edition)',
    brand: 'Bajaj Auto',
    tagline: 'Modernized Classic with 3.2 kWh Battery & 137 km Range',
    category: 'scooter',
    badges: ['Full Metal Body', '3.2 kWh Battery', '137 km Range', 'Sub-₹1.2L'],
    rating: 4.6,
    reviewCount: 52,
    launchYear: 2024,
    madeInIndia: true,
    idealFor: 'Riders looking for genuine Bajaj full metal body reliability with upgraded 3.2 kWh range at an affordable price',
    imageUrl: 'https://cdn.bikedekho.com/processedimages/bajaj/chetak-c2501/source/chetak-c25016971bd5606598.jpg?model=bajaj-chetak-3202&v=2026',
    colorOptions: [
      { name: 'Brooklyn Black', hex: '#0f172a' },
      { name: 'Indigo Metallic', hex: '#1e3a8a' },
      { name: 'Cyber White', hex: '#f8fafc' }
    ],
    pricing: {
      exShowroom: 115018,
      pmEdriveSubsidy: 10000,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5800,
      handlingAndDocsEst: 1400
    },
    specs: {
      batteryCapacityKwh: 3.2,
      usableBatteryCapacityKwh: 3.0,
      batteryChemistry: 'Fixed NMC',
      isRemovableBattery: false,
      araiRangeKm: 137,
      realWorldEcoRangeKm: 125,
      realWorldCityRangeKm: 115,
      realWorldHighwayRangeKm: 85,
      topSpeedKmh: 73,
      accel0To40Kmh: 4.0,
      motorPeakPowerKw: 4.0,
      motorRatedPowerKw: 2.8,
      motorPeakTorqueNm: 20,
      driveType: 'Hub',
      chargingTime0To80: '3h 45m',
      chargingTime0To100: '4h 45m',
      fastChargingSupport: false,
      fastChargingRate: 'Offboard Charger (15A Socket)',
      bootSpaceLiters: 18,
      ridingModes: ['Eco', 'Sports', 'Reverse'],
      brakes: 'Front Disc, Rear Drum with CBS',
      brakingSafety: 'Combined Braking System (CBS)',
      kerbWeightKg: 119,
      groundClearanceMm: 160,
      seatHeightMm: 760,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 4.5,
      displayType: 'Color LCD Digital Console',
      connectivity: ['My Chetak App', 'Turn-by-turn Navigation', 'Geo-fencing', 'OTA Updates']
    },
    warranty: {
      batteryYears: 3,
      batteryKm: 50000,
      vehicleYears: 3,
      vehicleKm: 50000,
      extendedAvailable: true
    },
    features: [
      'Full pressed-steel sheet metal body providing superior impact safety and timeless durability',
      'Upgraded 3.2 kWh NMC battery pack delivering 115 km real-world city range',
      'IP67 water-resistant electrical architecture for monsoon resilience in Hyderabad',
      'Reverse parking assist and smooth hill-hold assist'
    ],
    pros: [
      'Legendary Bajaj sheet-metal construction with superb paint finish',
      'Generous 115 km real city range with upgraded 3.2 kWh pack',
      'Sub-₹1.15 Lakh attractive pricing with ₹0 road tax in Telangana'
    ],
    cons: [
      '73 km/h top speed',
      'Modest 18L under-seat storage'
    ],
    equivalentPetrolBenchmark: {
      modelName: 'Suzuki Access 125',
      engineCc: 124,
      petrolBhp: 8.7,
      petrolTorqueNm: 10.0,
      petrolMileageKmpl: 48,
      petrolExShowroom: 84000,
      petrolOnRoadTG: 103000,
      classComparison: '125cc Metal Body Family Scooter',
      powerComparisonSummary: 'Chetak 3202 offers full sheet metal durability with zero fuel costs in Telangana'
    }
  },

  // ⛽ PETROL BASELINE (Honda Activa 6G)
  // ==========================================
  {
    id: 'honda-activa-6g',
    name: 'Honda Activa 6G (109.51cc Petrol Benchmark)',
    brand: 'Honda Motorcycle & Scooter India',
    tagline: 'Standard Indian Internal Combustion Baseline for TCO & ROI Comparison',
    category: 'scooter',
    isIceBenchmark: true,
    pricing: {
      exShowroom: 82684,
      pmEdriveSubsidy: 0,
      chargerIncluded: true,
      chargerCost: 0,
      insuranceEst: 5310,
      handlingAndDocsEst: 1200
    },
    specs: {
      batteryCapacityKwh: 0,
      usableBatteryCapacityKwh: 0,
      batteryChemistry: 'N/A (Petrol ICE)',
      isRemovableBattery: false,
      araiRangeKm: 60,
      realWorldEcoRangeKm: 50,
      realWorldCityRangeKm: 45,
      realWorldHighwayRangeKm: 48,
      topSpeedKmh: 85,
      accel0To40Kmh: 5.2,
      motorPeakPowerKw: 5.77,
      motorRatedPowerKw: 5.77,
      motorPeakTorqueNm: 8.9,
      driveType: 'CVT',
      chargingTime0To80: '2 mins (Petrol Fueling)',
      chargingTime0To100: '2 mins (5.3L Tank)',
      fastChargingSupport: false,
      fastChargingRate: 'Standard Petrol Pump Dispenser',
      bootSpaceLiters: 18,
      ridingModes: ['Standard Eco Throttle'],
      brakes: 'Front Drum (130mm), Rear Drum (130mm) with CBS',
      brakingSafety: 'Drum CBS',
      kerbWeightKg: 106,
      groundClearanceMm: 162,
      seatHeightMm: 765,
      wheelSizeInches: 12,
      touchscreen: false,
      displaySizeInches: 0,
      displayType: 'Analogue Meter',
      connectivity: ['Analogue Meter Cluster', 'Engine Start/Stop Switch']
    },
    warranty: {
      batteryYears: 0,
      batteryKm: 0,
      vehicleYears: 3,
      vehicleKm: 36000,
      extendedAvailable: true
    },
    features: [
      '109.51cc eSP (Enhanced Smart Power) PGM-FI 4-Stroke Engine',
      '5.3-liter fuel tank capacity (~238 km total range per fill)',
      'Telescopic front suspension and external fuel filler lid',
      'Silent start with ACG starter motor'
    ],
    pros: [
      'Instant 2-minute refuel at any fuel pump in Telangana',
      'Every local roadside mechanic can service and repair anywhere in India',
      'High second-hand resale value across India'
    ],
    cons: [
      'Expensive running cost (₹2.44/km fuel + ₹0.43/km maintenance = ₹2.87/km)',
      'Requires frequent engine oil replacement and CVT belt changes',
      'Pays 12% Telangana Road Tax + Registration (₹11,107 extra upfront)'
    ],
    badges: ['Petrol Baseline', '109.51cc ICE Engine', '45 km/L Mileage', '₹2.87/km Running Cost'],
    rating: 4.6,
    reviewCount: 5400,
    imageUrl: 'https://cdn.bikedekho.com/processedimages/honda/activa-6g/source/activa-6g68a6fb7b20bd3.jpg?model=honda-activa-6g&v=2026',
    colorOptions: [
      { name: 'Decent Blue Metallic', hex: '#1e3a8a' },
      { name: 'Rebel Red Metallic', hex: '#b91c1c' },
      { name: 'Pearl Precious White', hex: '#f8fafc' },
      { name: 'Black', hex: '#09090b' }
    ],
    idealFor: 'Baseline benchmark to calculate fuel savings and breakeven payback',
    launchYear: 2023,
    madeInIndia: true
  }
];

export const ICE_BENCHMARK_MODEL: EVModel = EV_MODELS.find(m => m.id === 'honda-activa-6g')!;

export function getEVModels(): EVModel[] {
  return EV_MODELS.filter(m => !m.isIceBenchmark);
}

export function getAllVehiclesIncludingBenchmark(): EVModel[] {
  return EV_MODELS;
}

export function getEVModelById(id: string): EVModel | undefined {
  return EV_MODELS.find(m => m.id === id);
}

export function getEVModelsByCategory(category: 'scooter' | 'motorcycle'): EVModel[] {
  return EV_MODELS.filter(m => !m.isIceBenchmark && m.category === category);
}

export function getEVModelsByBrand(brand: string): EVModel[] {
  return EV_MODELS.filter(m => !m.isIceBenchmark && m.brand.toLowerCase() === brand.toLowerCase());
}
