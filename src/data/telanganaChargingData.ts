/**
 * Verified Public EV Charging Stations across Hyderabad, Outer Ring Road (ORR), and Telangana Districts
 */

import type { ChargingStation } from '../types/charging';

export const TELANGANA_CHARGING_STATIONS: ChargingStation[] = [
  // =========================================================================
  // 1. HYDERABAD IT CORRIDOR & METRO HUBS
  // =========================================================================
  {
    id: 'ts-chg-gachibowli-ather',
    name: 'Ather Space Grid - Gachibowli',
    network: 'Ather Grid',
    district: 'Hyderabad Central (TG-09)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'Plot 12, Financial District Main Rd, Near Wipro Circle, Gachibowli, Hyderabad, TS 500032',
    latitude: 17.4401,
    longitude: 78.3489,
    connectors: [
      { type: 'ATHER_GRID', powerKw: 3.3, count: 4, pricePerUnit: 'Free for Ather / ₹18/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.0, count: 2, pricePerUnit: '₹15/hr' }
    ],
    maxPowerKw: 3.3,
    is24x7: true,
    amenities: ['Coffee Lounge', 'Customer Restroom', 'Wi-Fi', 'Two-Wheeler Service Bay'],
    contactPhone: '+91 80 6646 3333',
    googleMapsUrl: 'https://maps.google.com/?q=17.4401,78.3489',
    landmark: 'Opposite ICICI Regional HQ'
  },
  {
    id: 'ts-chg-hitec-ola-hyper',
    name: 'Ola Hypercharger - Hitec City Mindspace',
    network: 'Ola Hypercharger',
    district: 'Hyderabad Central (TG-09)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'Mindspace IT Park, Building 12 Parking, Madhapur, Hyderabad, TS 500081',
    latitude: 17.4435,
    longitude: 78.3772,
    connectors: [
      { type: 'OLA_HYPERCHARGER', powerKw: 15.0, count: 6, pricePerUnit: '₹21/kWh (15 min ~ 50 km)' },
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹22/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Food Court', 'ATM', 'Covered Parking', 'Security Guard'],
    contactPhone: '+91 80 3311 3311',
    googleMapsUrl: 'https://maps.google.com/?q=17.4435,78.3772',
    landmark: 'Inorbit Mall Junction'
  },
  {
    id: 'ts-chg-banjara-tata-ez',
    name: 'Tata Power EZ Charge - Banjara Hills Road No. 12',
    network: 'Tata Power EZ Charge',
    district: 'Hyderabad Central (TG-09)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'Near MLA Colony, Road No. 12, Banjara Hills, Hyderabad, TS 500034',
    latitude: 17.4156,
    longitude: 78.4358,
    connectors: [
      { type: 'CCS2_DC', powerKw: 60.0, count: 2, pricePerUnit: '₹23/kWh' },
      { type: 'TYPE_2_AC', powerKw: 7.4, count: 2, pricePerUnit: '₹16/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 2, pricePerUnit: '₹14/kWh' }
    ],
    maxPowerKw: 60.0,
    is24x7: true,
    amenities: ['Café', 'Restrooms', '24/7 Security'],
    googleMapsUrl: 'https://maps.google.com/?q=17.4156,78.4358',
    landmark: 'Next to Taj Krishna Gate'
  },
  {
    id: 'ts-chg-jubilee-kazam',
    name: 'Kazam Fast Hub - Jubilee Hills Checkpost',
    network: 'Kazam EV',
    district: 'Hyderabad Central (TG-09)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'Road No. 36, Near Jubilee Hills Checkpost Metro Station, Hyderabad, TS 500033',
    latitude: 17.4298,
    longitude: 78.4091,
    connectors: [
      { type: 'CCS2_DC', powerKw: 25.0, count: 2, pricePerUnit: '₹19/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 25.0,
    is24x7: true,
    amenities: ['Quick Refreshments', 'Tyre Pressure Station'],
    googleMapsUrl: 'https://maps.google.com/?q=17.4298,78.4091',
    landmark: 'Checkpost Metro Pillar 140'
  },
  {
    id: 'ts-chg-kukatpally-redco',
    name: 'TS REDCO EV Charging Station - Kukatpally JNTU',
    network: 'TS REDCO Public',
    district: 'Medchal-Malkajgiri (TG-08)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'JNTU Metro Station Parking, NH-65, Kukatpally, Hyderabad, TS 500072',
    latitude: 17.4947,
    longitude: 78.3924,
    connectors: [
      { type: 'BHARAT_AC001', powerKw: 3.3, count: 3, pricePerUnit: '₹12.50/kWh (Subsidized State Rate)' },
      { type: 'STANDARD_15A', powerKw: 3.0, count: 6, pricePerUnit: '₹10/hr' },
      { type: 'CCS2_DC', powerKw: 30.0, count: 1, pricePerUnit: '₹18/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Metro Rail Access', 'CCTV Surveillance', 'Water Dispenser'],
    googleMapsUrl: 'https://maps.google.com/?q=17.4947,78.3924',
    landmark: 'Under JNTU Flyover'
  },
  {
    id: 'ts-chg-secunderabad-bolt',
    name: 'Bolt.earth EV Point - Secunderabad Station East',
    network: 'Bolt.earth',
    district: 'Secunderabad (TG-10)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'Station Rd, Regimental Bazaar, Secunderabad, TS 500003',
    latitude: 17.4344,
    longitude: 78.5015,
    connectors: [
      { type: 'STANDARD_15A', powerKw: 3.3, count: 8, pricePerUnit: '₹11/hr' },
      { type: 'TYPE_2_AC', powerKw: 7.4, count: 2, pricePerUnit: '₹15/kWh' }
    ],
    maxPowerKw: 7.4,
    is24x7: true,
    amenities: ['Railway Station Proximity', '24/7 Tea Stalls', 'Luggage Cloakroom'],
    googleMapsUrl: 'https://maps.google.com/?q=17.4344,78.5015',
    landmark: 'Opposite Reservation Complex'
  },
  {
    id: 'ts-chg-uppal-ather',
    name: 'Ather Grid - Uppal Ring Road Hub',
    network: 'Ather Grid',
    district: 'Medchal-Malkajgiri (TG-08)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'Survey 45, Inner Ring Rd, Near Uppal Metro Station, Uppal, Hyderabad, TS 500039',
    latitude: 17.3984,
    longitude: 78.5582,
    connectors: [
      { type: 'ATHER_GRID', powerKw: 3.3, count: 3, pricePerUnit: 'Free for Ather / ₹18/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.0, count: 2, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 3.3,
    is24x7: true,
    amenities: ['Drive-thru Fast Food', 'Washrooms', 'Air Tower'],
    googleMapsUrl: 'https://maps.google.com/?q=17.3984,78.5582',
    landmark: 'Warangal Highway Junction'
  },
  {
    id: 'ts-chg-lbnagar-tata',
    name: 'Tata Power - LB Nagar Ring Road Central',
    network: 'Tata Power EZ Charge',
    district: 'Rangareddy (TG-07)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'Near Sagar X Roads, LB Nagar, Hyderabad, TS 500074',
    latitude: 17.3457,
    longitude: 78.5522,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹21/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹14/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Highway Diner', 'Clean Restrooms', 'Petrol Pump Adjacent'],
    googleMapsUrl: 'https://maps.google.com/?q=17.3457,78.5522',
    landmark: 'Vijayawada Highway Entry Gate'
  },
  {
    id: 'ts-chg-shamshabad-airport',
    name: 'ChargeZone Aero Express - RGIA Shamshabad',
    network: 'ChargeZone',
    district: 'Rangareddy (TG-07)',
    cityOrHighway: 'Hyderabad Airport',
    address: 'Public Parking Lot 4, Rajiv Gandhi International Airport, Shamshabad, TS 500409',
    latitude: 17.2403,
    longitude: 78.4294,
    connectors: [
      { type: 'CCS2_DC', powerKw: 60.0, count: 4, pricePerUnit: '₹24/kWh' },
      { type: 'TYPE_2_AC', powerKw: 7.4, count: 4, pricePerUnit: '₹17/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 6, pricePerUnit: '₹15/hr' }
    ],
    maxPowerKw: 60.0,
    is24x7: true,
    amenities: ['24x7 Airport Lounge', 'Food Courts', 'Luggage Trolleys', 'Washrooms'],
    googleMapsUrl: 'https://maps.google.com/?q=17.2403,78.4294',
    landmark: 'Airport Terminal Approaching Road'
  },
  {
    id: 'ts-chg-mehdipatnam-redco',
    name: 'TS REDCO - Mehdipatnam Rythu Bazar',
    network: 'TS REDCO Public',
    district: 'Hyderabad Central (TG-09)',
    cityOrHighway: 'Hyderabad Metro',
    address: 'Inner Ring Rd, Near Rythu Bazar, Mehdipatnam, Hyderabad, TS 500028',
    latitude: 17.3922,
    longitude: 78.4398,
    connectors: [
      { type: 'BHARAT_AC001', powerKw: 3.3, count: 3, pricePerUnit: '₹12.50/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.0, count: 4, pricePerUnit: '₹10/hr' }
    ],
    maxPowerKw: 3.3,
    is24x7: false,
    amenities: ['Fresh Produce Market', 'Drinking Water'],
    googleMapsUrl: 'https://maps.google.com/?q=17.3922,78.4398',
    landmark: 'Beside PVNR Expressway Pillar 45'
  },

  // =========================================================================
  // 2. HYDERABAD OUTER RING ROAD (ORR) EXPRESSWAY INTERCHANGES (158 KM)
  // =========================================================================
  {
    id: 'ts-chg-orr-gachibowli-exit',
    name: 'Jio-bp pulse - ORR Exit 1 (Financial District)',
    network: 'Jio-bp pulse',
    district: 'Rangareddy (TG-07)',
    cityOrHighway: 'ORR Expressway',
    address: 'ORR Toll Plaza Interchange 1, Nanakramguda, Hyderabad, TS 500032',
    latitude: 17.4188,
    longitude: 78.3411,
    connectors: [
      { type: 'CCS2_DC', powerKw: 60.0, count: 2, pricePerUnit: '₹22.50/kWh' },
      { type: 'TYPE_2_AC', powerKw: 7.4, count: 2, pricePerUnit: '₹16/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 2, pricePerUnit: '₹14/hr' }
    ],
    maxPowerKw: 60.0,
    is24x7: true,
    amenities: ['Wild Bean Café', 'Clean Highway Restrooms', 'Air and Water Station'],
    googleMapsUrl: 'https://maps.google.com/?q=17.4188,78.3411',
    landmark: 'Nanakramguda Rotary Toll'
  },
  {
    id: 'ts-chg-orr-shamshabad-exit',
    name: 'Zeon Fast Charging - ORR Exit 16 (Shamshabad Airport)',
    network: 'Zeon Charging',
    district: 'Rangareddy (TG-07)',
    cityOrHighway: 'ORR Expressway',
    address: 'ORR Exit 16 Service Road, Near Airport Toll Plaza, Shamshabad, TS 501218',
    latitude: 17.2514,
    longitude: 78.4112,
    connectors: [
      { type: 'CCS2_DC', powerKw: 50.0, count: 2, pricePerUnit: '₹22/kWh' },
      { type: 'TYPE_2_AC', powerKw: 11.0, count: 2, pricePerUnit: '₹17/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 2, pricePerUnit: '₹13/hr' }
    ],
    maxPowerKw: 50.0,
    is24x7: true,
    amenities: ['24/7 Restaurant', 'Restrooms', 'Air & Nitrogen'],
    googleMapsUrl: 'https://maps.google.com/?q=17.2514,78.4112',
    landmark: 'Bangalore Highway NH-44 Crossing'
  },
  {
    id: 'ts-chg-orr-pedda-amberpet',
    name: 'Tata Power - ORR Exit 11 (Pedda Amberpet / Vijayawada Hwy)',
    network: 'Tata Power EZ Charge',
    district: 'Rangareddy (TG-07)',
    cityOrHighway: 'ORR Expressway',
    address: 'ORR Exit 11 Junction, NH-65 Intersection, Pedda Amberpet, TS 501505',
    latitude: 17.3195,
    longitude: 78.6189,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹21.50/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹15/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Highway Food Court', 'Truck & Bike Bay', '24x7 Tea'],
    googleMapsUrl: 'https://maps.google.com/?q=17.3195,78.6189',
    landmark: 'Ramoji Film City Gateway'
  },
  {
    id: 'ts-chg-orr-ghatkesar-exit',
    name: 'Ather Grid & Kazam - ORR Exit 9 (Ghatkesar / Warangal Hwy)',
    network: 'Ather Grid',
    district: 'Medchal-Malkajgiri (TG-08)',
    cityOrHighway: 'ORR Expressway',
    address: 'ORR Exit 9 Toll Gate, NH-163 Warangal Highway, Ghatkesar, TS 501301',
    latitude: 17.4478,
    longitude: 78.6811,
    connectors: [
      { type: 'ATHER_GRID', powerKw: 3.3, count: 3, pricePerUnit: 'Free for Ather / ₹18/kWh' },
      { type: 'CCS2_DC', powerKw: 25.0, count: 1, pricePerUnit: '₹20/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.0, count: 2, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 25.0,
    is24x7: true,
    amenities: ['Highway Dhabas', 'Washrooms', 'Mechanic Shop'],
    googleMapsUrl: 'https://maps.google.com/?q=17.4478,78.6811',
    landmark: 'AIIMS Bibinagar Approaching Junction'
  },
  {
    id: 'ts-chg-orr-kandlakoya-exit',
    name: 'TS REDCO Fast Point - ORR Exit 6 (Kandlakoya / Medchal)',
    network: 'TS REDCO Public',
    district: 'Medchal-Malkajgiri (TG-08)',
    cityOrHighway: 'ORR Expressway',
    address: 'ORR Exit 6, NH-44 Nagpur Highway Crossing, Kandlakoya, Medchal, TS 501401',
    latitude: 17.5812,
    longitude: 78.4892,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹18/kWh' },
      { type: 'BHARAT_AC001', powerKw: 3.3, count: 3, pricePerUnit: '₹12.50/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 2, pricePerUnit: '₹10/hr' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Oxygen Park Nearby', 'Cafeteria', 'Restrooms'],
    googleMapsUrl: 'https://maps.google.com/?q=17.5812,78.4892',
    landmark: 'Kandlakoya Oxygen Park Exit'
  },
  {
    id: 'ts-chg-orr-patancheru-exit',
    name: 'Bolt.earth EV Hub - ORR Exit 3 (Patancheru / Mumbai Hwy)',
    network: 'Bolt.earth',
    district: 'Sangareddy (TG-23)',
    cityOrHighway: 'ORR Expressway',
    address: 'ORR Exit 3, NH-65 Mumbai Highway Junction, Patancheru, TS 502319',
    latitude: 17.5289,
    longitude: 78.2618,
    connectors: [
      { type: 'STANDARD_15A', powerKw: 3.3, count: 6, pricePerUnit: '₹12/hr' },
      { type: 'TYPE_2_AC', powerKw: 7.4, count: 2, pricePerUnit: '₹15/kWh' },
      { type: 'CCS2_DC', powerKw: 25.0, count: 1, pricePerUnit: '₹19/kWh' }
    ],
    maxPowerKw: 25.0,
    is24x7: true,
    amenities: ['IOCL Petrol Station', '24x7 Restaurant', 'Puncture Repair'],
    googleMapsUrl: 'https://maps.google.com/?q=17.5289,78.2618',
    landmark: 'Patancheru Industrial Area Entry'
  },

  // =========================================================================
  // 3. HYDERABAD -> WARANGAL HIGHWAY CORRIDOR (NH-163 - 148 KM)
  // =========================================================================
  {
    id: 'ts-chg-nh163-bhongir',
    name: 'Kazam Highway Fast Hub - Bhongir Fort Waypoint (KM 48)',
    network: 'Kazam EV',
    district: 'Yadadri Bhuvanagiri (TG-30)',
    cityOrHighway: 'NH-163 Warangal Highway',
    address: 'NH-163, Near Bhongir Bypass Flyover, Yadadri Bhuvanagiri, TS 508116',
    latitude: 17.5112,
    longitude: 78.8924,
    connectors: [
      { type: 'CCS2_DC', powerKw: 25.0, count: 2, pricePerUnit: '₹20/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 25.0,
    is24x7: true,
    amenities: ['Heritage Fort View Cafeteria', 'Clean Toilets', 'Covered Bike Parking'],
    googleMapsUrl: 'https://maps.google.com/?q=17.5112,78.8924',
    landmark: '5 km from Yadagirigutta Temple Ghat Rd'
  },
  {
    id: 'ts-chg-nh163-aler',
    name: 'Bolt.earth Highway Hub - Aler Milestone (KM 78)',
    network: 'Bolt.earth',
    district: 'Yadadri Bhuvanagiri (TG-30)',
    cityOrHighway: 'NH-163 Warangal Highway',
    address: 'NH-163, Beside HPCL COCO Fuel Station, Aler, TS 508101',
    latitude: 17.6521,
    longitude: 79.0514,
    connectors: [
      { type: 'STANDARD_15A', powerKw: 3.3, count: 6, pricePerUnit: '₹11/hr' },
      { type: 'TYPE_2_AC', powerKw: 7.4, count: 2, pricePerUnit: '₹15/kWh' }
    ],
    maxPowerKw: 7.4,
    is24x7: true,
    amenities: ['HPCL Fuel Station', 'Food Court', 'Drinking Water'],
    googleMapsUrl: 'https://maps.google.com/?q=17.6521,79.0514',
    landmark: 'Kolangarupally Jain Temple Junction'
  },
  {
    id: 'ts-chg-nh163-jangaon',
    name: 'Tata Power EZ Charge - Jangaon Highway Gateway (KM 92)',
    network: 'Tata Power EZ Charge',
    district: 'Jangaon (TG-27)',
    cityOrHighway: 'NH-163 Warangal Highway',
    address: 'Near RTC Bus Depot, NH-163, Jangaon, TS 506167',
    latitude: 17.7214,
    longitude: 79.1823,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹21/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹14/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Highway Dhaba', 'Restrooms', 'General Store'],
    googleMapsUrl: 'https://maps.google.com/?q=17.7214,79.1823',
    landmark: 'Jangaon Bypass Circle'
  },
  {
    id: 'ts-chg-nh163-kazipet',
    name: 'Ather Grid - Kazipet Railway Junction (KM 136)',
    network: 'Ather Grid',
    district: 'Hanamkonda (TG-03)',
    cityOrHighway: 'NH-163 Warangal Highway',
    address: 'Near Kazipet Railway Station Roundabout, Hanamkonda, TS 506003',
    latitude: 17.9741,
    longitude: 79.5218,
    connectors: [
      { type: 'ATHER_GRID', powerKw: 3.3, count: 3, pricePerUnit: 'Free for Ather / ₹18/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.0, count: 2, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 3.3,
    is24x7: true,
    amenities: ['24x7 Refreshments', 'Waiting Area', 'Air Tower'],
    googleMapsUrl: 'https://maps.google.com/?q=17.9741,79.5218',
    landmark: 'Kazipet Diesel Loco Shed Approach'
  },
  {
    id: 'ts-chg-nh163-warangal-hanamkonda',
    name: 'TS REDCO Smart Hub - Hanamkonda Warangal Central (KM 148)',
    network: 'TS REDCO Public',
    district: 'Hanamkonda / Warangal (TG-03)',
    cityOrHighway: 'Warangal City',
    address: 'Near Thousand Pillar Temple Road, Nakkalagutta, Hanamkonda, TS 506001',
    latitude: 17.9984,
    longitude: 79.5714,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹18/kWh' },
      { type: 'BHARAT_AC001', powerKw: 3.3, count: 3, pricePerUnit: '₹12.50/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹10/hr' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['NIT Warangal Proximity', 'Heritage Tourism Kiosk', 'Restrooms'],
    googleMapsUrl: 'https://maps.google.com/?q=17.9984,79.5714',
    landmark: 'Opposite Public Gardens Hanamkonda'
  },

  // =========================================================================
  // 4. HYDERABAD -> VIJAYAWADA / SURYAPET (NH-65 - 275 KM)
  // =========================================================================
  {
    id: 'ts-chg-nh65-choutuppal',
    name: 'Zeon Highway Express - Choutuppal Toll (KM 52)',
    network: 'Zeon Charging',
    district: 'Yadadri Bhuvanagiri (TG-30)',
    cityOrHighway: 'NH-65 Vijayawada Highway',
    address: 'NH-65, Beside Highway Grand Hotel, Choutuppal, TS 508252',
    latitude: 17.2489,
    longitude: 78.9012,
    connectors: [
      { type: 'CCS2_DC', powerKw: 60.0, count: 2, pricePerUnit: '₹22.50/kWh' },
      { type: 'TYPE_2_AC', powerKw: 7.4, count: 2, pricePerUnit: '₹16/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 60.0,
    is24x7: true,
    amenities: ['24x7 Multi-Cuisine Restaurant', 'Clean Washrooms', 'Coffee Shop'],
    googleMapsUrl: 'https://maps.google.com/?q=17.2489,78.9012',
    landmark: 'Choutuppal Toll Plaza Approaching 2 km'
  },
  {
    id: 'ts-chg-nh65-narketpally',
    name: 'Tata Power EZ Charge - Narketpally Kamineni (KM 85)',
    network: 'Tata Power EZ Charge',
    district: 'Nalgonda (TG-05)',
    cityOrHighway: 'NH-65 Vijayawada Highway',
    address: 'NH-65, Near Kamineni Institute of Medical Sciences, Narketpally, TS 508268',
    latitude: 17.1892,
    longitude: 79.1984,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹21/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹14/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Hospital Medical Assistance', 'Cafeteria', 'Parking Bay'],
    googleMapsUrl: 'https://maps.google.com/?q=17.1892,79.1984',
    landmark: 'Kamineni Hospital Gate'
  },
  {
    id: 'ts-chg-nh65-suryapet-7',
    name: 'Jio-bp pulse & 7-Restaurants Hub - Suryapet (KM 135)',
    network: 'Jio-bp pulse',
    district: 'Suryapet (TG-29)',
    cityOrHighway: 'NH-65 Vijayawada Highway',
    address: 'NH-65 Expressway Midway Complex, Suryapet, TS 508213',
    latitude: 17.1412,
    longitude: 79.6241,
    connectors: [
      { type: 'CCS2_DC', powerKw: 60.0, count: 4, pricePerUnit: '₹22.50/kWh' },
      { type: 'TYPE_2_AC', powerKw: 11.0, count: 2, pricePerUnit: '₹17/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 6, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 60.0,
    is24x7: true,
    amenities: ['7 Highway Brand Restaurants', 'Subway', 'KFC', 'Clean Executive Restrooms', 'Baby Care Room'],
    googleMapsUrl: 'https://maps.google.com/?q=17.1412,79.6241',
    landmark: 'Famous 7 Restaurants Midway Stop'
  },
  {
    id: 'ts-chg-nh65-kodad',
    name: 'Bolt.earth Highway Hub - Kodad Border (KM 178)',
    network: 'Bolt.earth',
    district: 'Suryapet (TG-29)',
    cityOrHighway: 'NH-65 Vijayawada Highway',
    address: 'NH-65, Near Kodad Bypass Toll Gate, Kodad, TS 508206',
    latitude: 16.9984,
    longitude: 79.9654,
    connectors: [
      { type: 'STANDARD_15A', powerKw: 3.3, count: 6, pricePerUnit: '₹11/hr' },
      { type: 'CCS2_DC', powerKw: 25.0, count: 1, pricePerUnit: '₹19/kWh' }
    ],
    maxPowerKw: 25.0,
    is24x7: true,
    amenities: ['BPCL Petrol Pump', 'Tea Stalls', 'Restrooms'],
    googleMapsUrl: 'https://maps.google.com/?q=16.9984,79.9654',
    landmark: 'Telangana-Andhra Border Checkpost'
  },

  // =========================================================================
  // 5. HYDERABAD -> KURNOOL / BENGALURU (NH-44 - 215 KM)
  // =========================================================================
  {
    id: 'ts-chg-nh44-shadnagar',
    name: 'Ola Hypercharger - Shadnagar Toll (KM 50)',
    network: 'Ola Hypercharger',
    district: 'Rangareddy (TG-07)',
    cityOrHighway: 'NH-44 Bangalore Highway',
    address: 'NH-44, Beside Highway King Restaurant, Shadnagar, TS 509216',
    latitude: 17.0689,
    longitude: 78.2012,
    connectors: [
      { type: 'OLA_HYPERCHARGER', powerKw: 15.0, count: 4, pricePerUnit: '₹21/kWh' },
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹22/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 2, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Restaurant', 'Washrooms', 'Air & Nitrogen'],
    googleMapsUrl: 'https://maps.google.com/?q=17.0689,78.2012',
    landmark: 'Near Shadnagar RTO'
  },
  {
    id: 'ts-chg-nh44-jadcherla',
    name: 'Zeon Fast Charging - Jadcherla Crossroads (KM 85)',
    network: 'Zeon Charging',
    district: 'Mahabubnagar (TG-06)',
    cityOrHighway: 'NH-44 Bangalore Highway',
    address: 'NH-44, Jadcherla Bypass Flyover Junction, Jadcherla, TS 509301',
    latitude: 16.7645,
    longitude: 78.1412,
    connectors: [
      { type: 'CCS2_DC', powerKw: 50.0, count: 2, pricePerUnit: '₹22/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 50.0,
    is24x7: true,
    amenities: ['Drive-in Dhaba', 'Restrooms', 'Pharmacy'],
    googleMapsUrl: 'https://maps.google.com/?q=16.7645,78.1412',
    landmark: 'Mahabubnagar / Raichur Diversion'
  },
  {
    id: 'ts-chg-nh44-pebber',
    name: 'Tata Power EZ Charge - Pebber Highway Midway (KM 152)',
    network: 'Tata Power EZ Charge',
    district: 'Wanaparthy (TG-33)',
    cityOrHighway: 'NH-44 Bangalore Highway',
    address: 'NH-44, Near Reliance Petrol Pump, Pebber, Wanaparthy, TS 509120',
    latitude: 16.2984,
    longitude: 77.9812,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹21.50/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹14/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Reliance Smart Point', 'Food Court', 'Clean Toilets'],
    googleMapsUrl: 'https://maps.google.com/?q=16.2984,77.9812',
    landmark: 'Krishna River Bridge Crossing 15 km ahead'
  },
  {
    id: 'ts-chg-nh44-alampur',
    name: 'TS REDCO Fast Point - Alampur Krishna River Crossing (KM 198)',
    network: 'TS REDCO Public',
    district: 'Jogulamba Gadwal (TG-32)',
    cityOrHighway: 'NH-44 Bangalore Highway',
    address: 'NH-44, Alampur X Roads, Near Tungabhadra Toll, TS 509152',
    latitude: 15.8945,
    longitude: 78.0312,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹18/kWh' },
      { type: 'BHARAT_AC001', powerKw: 3.3, count: 3, pricePerUnit: '₹12.50/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹10/hr' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Jogulamba Temple Heritage Information', 'Cafeteria', 'Restrooms'],
    googleMapsUrl: 'https://maps.google.com/?q=15.8945,78.0312',
    landmark: 'Alampur Fifth Shakti Peetha Gateway'
  },

  // =========================================================================
  // 6. HYDERABAD -> NIZAMABAD (NH-44 NORTH - 175 KM)
  // =========================================================================
  {
    id: 'ts-chg-nh44n-toopran',
    name: 'Kazam Highway Fast Hub - Toopran Waypoint (KM 52)',
    network: 'Kazam EV',
    district: 'Medak (TG-22)',
    cityOrHighway: 'NH-44 North Highway',
    address: 'NH-44, Near Toopran Toll Plaza, Medak, TS 502334',
    latitude: 17.7612,
    longitude: 78.4711,
    connectors: [
      { type: 'CCS2_DC', powerKw: 25.0, count: 2, pricePerUnit: '₹20/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 25.0,
    is24x7: true,
    amenities: ['Highway Restaurant', 'Restrooms', '24x7 Tea'],
    googleMapsUrl: 'https://maps.google.com/?q=17.7612,78.4711',
    landmark: 'Toopran Industrial Park'
  },
  {
    id: 'ts-chg-nh44n-kamareddy',
    name: 'Tata Power EZ Charge - Kamareddy Central (KM 115)',
    network: 'Tata Power EZ Charge',
    district: 'Kamareddy (TG-17)',
    cityOrHighway: 'NH-44 North Highway',
    address: 'NH-44, Kamareddy Bypass, Near Railway Overbridge, Kamareddy, TS 503111',
    latitude: 18.3184,
    longitude: 78.3412,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹21/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹14/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Multi-cuisine Diner', 'Clean Restrooms', 'Petrol Pump'],
    googleMapsUrl: 'https://maps.google.com/?q=18.3184,78.3412',
    landmark: 'Kamareddy Municipal Junction'
  },
  {
    id: 'ts-chg-nh44n-dichpally',
    name: 'Bolt.earth EV Point - Dichpally Tel. Univ (KM 155)',
    network: 'Bolt.earth',
    district: 'Nizamabad (TG-16)',
    cityOrHighway: 'NH-44 North Highway',
    address: 'NH-44, Beside Telangana University Campus, Dichpally, TS 503175',
    latitude: 18.5912,
    longitude: 78.2214,
    connectors: [
      { type: 'STANDARD_15A', powerKw: 3.3, count: 6, pricePerUnit: '₹11/hr' },
      { type: 'TYPE_2_AC', powerKw: 7.4, count: 2, pricePerUnit: '₹15/kWh' }
    ],
    maxPowerKw: 7.4,
    is24x7: true,
    amenities: ['University Canteen', 'Bookstall', 'Drinking Water'],
    googleMapsUrl: 'https://maps.google.com/?q=18.5912,78.2214',
    landmark: 'Telangana University Main Entrance'
  },
  {
    id: 'ts-chg-nh44n-nizamabad-city',
    name: 'TS REDCO Smart Station - Nizamabad Collectorate (KM 175)',
    network: 'TS REDCO Public',
    district: 'Nizamabad (TG-16)',
    cityOrHighway: 'Nizamabad City',
    address: 'Near District Collectorate Office, Kanteshwar Rd, Nizamabad, TS 503001',
    latitude: 18.6724,
    longitude: 78.0984,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹18/kWh' },
      { type: 'BHARAT_AC001', powerKw: 3.3, count: 3, pricePerUnit: '₹12.50/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹10/hr' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Government Complex Security', 'Restrooms', 'CCTV'],
    googleMapsUrl: 'https://maps.google.com/?q=18.6724,78.0984',
    landmark: 'Kanteshwar Temple Junction'
  },

  // =========================================================================
  // 7. ADDITIONAL KEY DISTRICT HEADQUARTERS
  // =========================================================================
  {
    id: 'ts-chg-karimnagar-ather',
    name: 'Ather Space Grid - Karimnagar Tower Circle',
    network: 'Ather Grid',
    district: 'Karimnagar (TG-02)',
    cityOrHighway: 'Karimnagar City',
    address: 'Collectorate Rd, Near Tower Circle, Mukarampura, Karimnagar, TS 505001',
    latitude: 18.4386,
    longitude: 79.1288,
    connectors: [
      { type: 'ATHER_GRID', powerKw: 3.3, count: 3, pricePerUnit: 'Free for Ather / ₹18/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.0, count: 2, pricePerUnit: '₹12/hr' }
    ],
    maxPowerKw: 3.3,
    is24x7: true,
    amenities: ['Customer Lounge', 'Service Center', 'Wi-Fi'],
    googleMapsUrl: 'https://maps.google.com/?q=18.4386,79.1288',
    landmark: 'Tower Circle Heart of Town'
  },
  {
    id: 'ts-chg-khammam-tata',
    name: 'Tata Power EZ Charge - Khammam Bypass',
    network: 'Tata Power EZ Charge',
    district: 'Khammam (TG-04)',
    cityOrHighway: 'Khammam City',
    address: 'Wyra Rd, Near NSP Guest House, Khammam, TS 507001',
    latitude: 17.2472,
    longitude: 80.1514,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹21/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹14/kWh' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Restrooms', 'Petrol Pump', 'Coffee Shop'],
    googleMapsUrl: 'https://maps.google.com/?q=17.2472,80.1514',
    landmark: 'Khammam Fort Road Junction'
  },
  {
    id: 'ts-chg-siddipet-redco',
    name: 'TS REDCO Green Hub - Siddipet Komati Cheruvu',
    network: 'TS REDCO Public',
    district: 'Siddipet (TG-36)',
    cityOrHighway: 'Siddipet Town',
    address: 'Komati Cheruvu Lakefront Promenade, Siddipet, TS 502103',
    latitude: 18.1012,
    longitude: 78.8521,
    connectors: [
      { type: 'CCS2_DC', powerKw: 30.0, count: 2, pricePerUnit: '₹18/kWh' },
      { type: 'BHARAT_AC001', powerKw: 3.3, count: 3, pricePerUnit: '₹12.50/kWh' },
      { type: 'STANDARD_15A', powerKw: 3.3, count: 4, pricePerUnit: '₹10/hr' }
    ],
    maxPowerKw: 30.0,
    is24x7: true,
    amenities: ['Lakefront Park Promenade', 'Children Play Area', 'Restrooms'],
    googleMapsUrl: 'https://maps.google.com/?q=18.1012,78.8521',
    landmark: 'Glow Garden Lakefront'
  }
];

export function getAllChargingStations(): ChargingStation[] {
  return TELANGANA_CHARGING_STATIONS;
}

export function getChargingStationById(id: string): ChargingStation | undefined {
  return TELANGANA_CHARGING_STATIONS.find(s => s.id === id);
}

export function getStationsByDistrict(district: string): ChargingStation[] {
  const q = district.toLowerCase();
  return TELANGANA_CHARGING_STATIONS.filter(s => s.district.toLowerCase().includes(q));
}

export function getStationsByNetwork(network: string): ChargingStation[] {
  return TELANGANA_CHARGING_STATIONS.filter(s => s.network === network);
}

export function getStationsByConnector(connectorType: string): ChargingStation[] {
  return TELANGANA_CHARGING_STATIONS.filter(s =>
    s.connectors.some(c => c.type === connectorType)
  );
}
