export interface ChargingStation {
  id: string;
  name: string;
  network: 'Ather Grid' | 'Ola Hypercharger' | 'Tata Power EZ Charge' | 'Statiq' | 'Zeon Charging' | 'Jio-bp pulse';
  district: string;
  locality: string;
  address: string;
  highway?: string;
  connectorTypes: ('CCS2' | 'Type 6 (Ather)' | 'Bharat AC-001' | '15A Standard Socket')[];
  powerOutputKw: number;
  openHours: string;
  pricingPerUnit: number;
  latitude: number;
  longitude: number;
  is24x7: boolean;
  amenities: string[];
}

export const TELANGANA_CHARGING_STATIONS: ChargingStation[] = [
  // --- HYDERABAD IT & RESIDENTIAL CORRIDORS ---
  {
    id: 'ather-grid-gachibowli',
    name: 'Ather Grid — Gachibowli Flyover Hub',
    network: 'Ather Grid',
    district: 'Hyderabad / Rangareddy',
    locality: 'Gachibowli',
    address: 'Near ORR Junction, Beside DLF Cybercity, Gachibowli, Hyderabad - 500032',
    highway: 'Outer Ring Road (ORR Exit 19)',
    connectorTypes: ['Type 6 (Ather)', '15A Standard Socket'],
    powerOutputKw: 3.3,
    openHours: '24 Hours',
    pricingPerUnit: 0,
    latitude: 17.4401,
    longitude: 78.3489,
    is24x7: true,
    amenities: ['Coffee Shop', 'Restrooms', '24/7 Security', 'Covered Bay']
  },
  {
    id: 'ola-hypercharger-hitec-city',
    name: 'Ola Hypercharger — Hitec City Inorbit Hub',
    network: 'Ola Hypercharger',
    district: 'Hyderabad',
    locality: 'Madhapur',
    address: 'Inorbit Mall Cellar P2, Mindspace IT Park, Madhapur, Hyderabad - 500081',
    connectorTypes: ['CCS2', '15A Standard Socket'],
    powerOutputKw: 25.0,
    openHours: '24 Hours',
    pricingPerUnit: 14.5,
    latitude: 17.4345,
    longitude: 78.3868,
    is24x7: true,
    amenities: ['Mall Access', 'Food Court', 'ATM', 'Restrooms']
  },
  {
    id: 'tata-ez-begumpet',
    name: 'Tata Power EZ Charge — Begumpet Lifestyle Station',
    network: 'Tata Power EZ Charge',
    district: 'Hyderabad',
    locality: 'Begumpet',
    address: 'Opposite Hyderabad Airport Road, Near Begumpet Metro Station, Hyderabad - 500016',
    connectorTypes: ['CCS2', 'Bharat AC-001', '15A Standard Socket'],
    powerOutputKw: 30.0,
    openHours: '24 Hours',
    pricingPerUnit: 16.0,
    latitude: 17.4448,
    longitude: 78.4682,
    is24x7: true,
    amenities: ['Metro Walkable', 'Convenience Store', 'Air Pump']
  },
  {
    id: 'statiq-secunderabad',
    name: 'Statiq Fast Hub — Jubilee Bus Station (JBS)',
    network: 'Statiq',
    district: 'Hyderabad',
    locality: 'Secunderabad',
    address: 'Near JBS Metro Pillar 42, Picket, Secunderabad - 500009',
    connectorTypes: ['CCS2', 'Bharat AC-001', '15A Standard Socket'],
    powerOutputKw: 22.0,
    openHours: '24 Hours',
    pricingPerUnit: 15.0,
    latitude: 17.4524,
    longitude: 78.4983,
    is24x7: true,
    amenities: ['Bus Terminal', 'Metro Interchange', 'Food Stalls']
  },
  {
    id: 'ather-grid-kukatpally',
    name: 'Ather Grid — Kukatpally KPHB Colony',
    network: 'Ather Grid',
    district: 'Medchal-Malkajgiri',
    locality: 'Kukatpally',
    address: 'Road No. 1, KPHB Phase 1, Near Forum Sujana Mall, Hyderabad - 500072',
    connectorTypes: ['Type 6 (Ather)', '15A Standard Socket'],
    powerOutputKw: 3.3,
    openHours: '06:00 AM - 11:00 PM',
    pricingPerUnit: 0,
    latitude: 17.4933,
    longitude: 78.3995,
    is24x7: false,
    amenities: ['Shopping Mall', 'ATM', 'Parking Bay']
  },
  {
    id: 'ola-hypercharger-shamshabad',
    name: 'Ola Hypercharger — RGIA Shamshabad Airport Entry',
    network: 'Ola Hypercharger',
    district: 'Rangareddy',
    locality: 'Shamshabad',
    address: 'Near Airport Decathlon & Toll Plaza, NH-44, Shamshabad - 501218',
    highway: 'NH-44 Hyderabad-Bengaluru Highway',
    connectorTypes: ['CCS2', '15A Standard Socket'],
    powerOutputKw: 25.0,
    openHours: '24 Hours',
    pricingPerUnit: 15.5,
    latitude: 17.2403,
    longitude: 78.4294,
    is24x7: true,
    amenities: ['24/7 Food Court', 'Decathlon Sports', 'Restrooms', 'EV Lounge']
  },

  // --- TELANGANA HIGHWAY INTER-DISTRICT HUBS ---
  {
    id: 'zeon-warangal-nh163',
    name: 'Zeon Fast Charging Hub — Warangal Highway',
    network: 'Zeon Charging',
    district: 'Jangaon / Warangal',
    locality: 'Aler',
    address: 'Grand Swagath Food Court, NH-163 (Hyderabad - Warangal Expressway), Aler - 508101',
    highway: 'NH-163 Hyderabad-Warangal Highway',
    connectorTypes: ['CCS2', 'Bharat AC-001', '15A Standard Socket'],
    powerOutputKw: 50.0,
    openHours: '24 Hours',
    pricingPerUnit: 17.5,
    latitude: 17.6521,
    longitude: 78.9632,
    is24x7: true,
    amenities: ['Highway Food Court', 'Family Restrooms', 'Kids Play Area', '24/7 Security']
  },
  {
    id: 'tata-ez-kazipet',
    name: 'Tata Power EZ Charge — Kazipet Railway Junction Hub',
    network: 'Tata Power EZ Charge',
    district: 'Hanamkonda / Warangal',
    locality: 'Kazipet',
    address: 'Near Station Road & NIT Warangal Main Gate, Kazipet - 506004',
    connectorTypes: ['CCS2', 'Bharat AC-001', '15A Standard Socket'],
    powerOutputKw: 30.0,
    openHours: '24 Hours',
    pricingPerUnit: 16.0,
    latitude: 17.9784,
    longitude: 79.5218,
    is24x7: true,
    amenities: ['Railway Station Proximity', 'NIT Campus Access', 'Restaurants']
  },
  {
    id: 'jio-bp-suryapet-nh65',
    name: 'Jio-bp pulse — Suryapet Highway Midway Hub',
    network: 'Jio-bp pulse',
    district: 'Suryapet',
    locality: 'Suryapet',
    address: '7 Restaurant Highway Plaza, NH-65 (Hyderabad - Vijayawada Highway), Suryapet - 508213',
    highway: 'NH-65 Hyderabad-Vijayawada Highway',
    connectorTypes: ['CCS2', 'Type 6 (Ather)', 'Bharat AC-001', '15A Standard Socket'],
    powerOutputKw: 60.0,
    openHours: '24 Hours',
    pricingPerUnit: 18.0,
    latitude: 17.1439,
    longitude: 79.6239,
    is24x7: true,
    amenities: ['Highway Plaza 7', 'Multi-Cuisine Restaurants', 'Clean Restrooms', 'Tyre Pressure']
  },
  {
    id: 'statiq-karimnagar',
    name: 'Statiq Fast Station — Karimnagar Collectorate Road',
    network: 'Statiq',
    district: 'Karimnagar',
    locality: 'Karimnagar Town',
    address: 'Opposite Collectorate Complex, Collectorate Road, Karimnagar - 505001',
    connectorTypes: ['CCS2', 'Bharat AC-001', '15A Standard Socket'],
    powerOutputKw: 22.0,
    openHours: '24 Hours',
    pricingPerUnit: 15.0,
    latitude: 18.4386,
    longitude: 79.1288,
    is24x7: true,
    amenities: ['District HQ Walkable', 'Tea & Refreshments', 'CCTV Surveillance']
  },
  {
    id: 'ather-grid-nizamabad',
    name: 'Ather Grid — Nizamabad Bypass Hub',
    network: 'Ather Grid',
    district: 'Nizamabad',
    locality: 'Nizamabad City',
    address: 'Hyderabad Road, Near Khaleelwadi Junction, Nizamabad - 503001',
    connectorTypes: ['Type 6 (Ather)', '15A Standard Socket'],
    powerOutputKw: 3.3,
    openHours: '07:00 AM - 10:00 PM',
    pricingPerUnit: 0,
    latitude: 18.6725,
    longitude: 78.0941,
    is24x7: false,
    amenities: ['Main Market Access', 'Cafes']
  },
  {
    id: 'zeon-mahabubnagar-nh44',
    name: 'Zeon Highway Fast Charger — Jadcherla Junction',
    network: 'Zeon Charging',
    district: 'Mahabubnagar',
    locality: 'Jadcherla',
    address: 'NH-44 Bypass Food Plaza, Jadcherla, Mahabubnagar - 509301',
    highway: 'NH-44 Hyderabad-Kurnool Highway',
    connectorTypes: ['CCS2', 'Bharat AC-001', '15A Standard Socket'],
    powerOutputKw: 50.0,
    openHours: '24 Hours',
    pricingPerUnit: 17.0,
    latitude: 16.7725,
    longitude: 78.1408,
    is24x7: true,
    amenities: ['24/7 Food Plaza', 'Clean Washrooms', 'Security']
  }
];
