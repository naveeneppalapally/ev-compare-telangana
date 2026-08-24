/**
 * 5 Major Telangana Highway Corridors with verified waypoints and charging stations
 */

import type { HighwayCorridor } from '../types/charging';

export const TELANGANA_HIGHWAY_CORRIDORS: HighwayCorridor[] = [
  // 1. Hyderabad to Warangal (NH-163 - 148 km)
  {
    id: 'corridor-hyderabad-warangal-nh163',
    name: 'Hyderabad to Warangal Heritage Corridor',
    highwayCode: 'NH-163',
    totalDistanceKm: 148,
    startLocation: 'Uppal Ring Road, Hyderabad',
    endLocation: 'Hanamkonda / Warangal Central',
    popularScenicSpots: [
      'Bhongir Fort & Rock Climbing',
      'Yadagirigutta Lakshmi Narasimha Temple',
      'Kolangarupally Jain Shrine',
      'Thousand Pillar Temple',
      'Warangal Fort Kakatiya Arch'
    ],
    waypoints: [
      {
        id: 'wp-nh163-start',
        name: 'Uppal Ring Road (Start)',
        distanceFromStartKm: 0,
        description: 'Highway start point at East Hyderabad ring junction',
        chargingStationIds: ['ts-chg-uppal-ather']
      },
      {
        id: 'wp-nh163-ghatkesar',
        name: 'Ghatkesar / ORR Exit 9',
        distanceFromStartKm: 22,
        description: 'Outer ring road transition onto four-lane expressway',
        chargingStationIds: ['ts-chg-orr-ghatkesar-exit']
      },
      {
        id: 'wp-nh163-bhongir',
        name: 'Bhongir Fort & Yadadri Gateway',
        distanceFromStartKm: 48,
        description: 'Ideal 1st charging stop with iconic monolithic fort views',
        chargingStationIds: ['ts-chg-nh163-bhongir']
      },
      {
        id: 'wp-nh163-aler',
        name: 'Aler Milestone Hub',
        distanceFromStartKm: 78,
        description: 'Midway point with 24x7 fuel station amenities',
        chargingStationIds: ['ts-chg-nh163-aler']
      },
      {
        id: 'wp-nh163-jangaon',
        name: 'Jangaon Highway Gateway',
        distanceFromStartKm: 92,
        description: 'District junction with high-speed DC charging',
        chargingStationIds: ['ts-chg-nh163-jangaon']
      },
      {
        id: 'wp-nh163-kazipet',
        name: 'Kazipet Junction',
        distanceFromStartKm: 136,
        description: 'Tri-city urban approach with Ather Grid fast hub',
        chargingStationIds: ['ts-chg-nh163-kazipet']
      },
      {
        id: 'wp-nh163-warangal',
        name: 'Hanamkonda / Warangal Central (Destination)',
        distanceFromStartKm: 148,
        description: 'Historical city center near Thousand Pillar Temple',
        chargingStationIds: ['ts-chg-nh163-warangal-hanamkonda']
      }
    ]
  },

  // 2. Hyderabad to Vijayawada / Suryapet (NH-65 - 275 km)
  {
    id: 'corridor-hyderabad-vijayawada-nh65',
    name: 'Hyderabad to Vijayawada Expressway Corridor',
    highwayCode: 'NH-65',
    totalDistanceKm: 275,
    startLocation: 'LB Nagar Ring Road, Hyderabad',
    endLocation: 'Telangana Border / Vijayawada Gateway',
    popularScenicSpots: [
      'Ramoji Film City Entry',
      'Rachakonda Fort Scenic Escarpment',
      'Suryapet 7-Restaurants Midway Plaza',
      'Musi River Bridge'
    ],
    waypoints: [
      {
        id: 'wp-nh65-start',
        name: 'LB Nagar Ring Road (Start)',
        distanceFromStartKm: 0,
        description: 'Southeast Hyderabad highway starting terminal',
        chargingStationIds: ['ts-chg-lbnagar-tata']
      },
      {
        id: 'wp-nh65-pedda-amberpet',
        name: 'Pedda Amberpet / ORR Exit 11',
        distanceFromStartKm: 18,
        description: 'ORR interchange near Ramoji Film City entrance',
        chargingStationIds: ['ts-chg-orr-pedda-amberpet']
      },
      {
        id: 'wp-nh65-choutuppal',
        name: 'Choutuppal Toll Hub',
        distanceFromStartKm: 52,
        description: 'Major highway breakfast and rapid charging plaza',
        chargingStationIds: ['ts-chg-nh65-choutuppal']
      },
      {
        id: 'wp-nh65-narketpally',
        name: 'Narketpally Medical Corridor',
        distanceFromStartKm: 85,
        description: 'Nalgonda bypass with high-power DC fast charging',
        chargingStationIds: ['ts-chg-nh65-narketpally']
      },
      {
        id: 'wp-nh65-suryapet',
        name: 'Suryapet 7-Restaurants Hub (Midway)',
        distanceFromStartKm: 135,
        description: 'Premier 24x7 midway dining and charging park in South India',
        chargingStationIds: ['ts-chg-nh65-suryapet-7']
      },
      {
        id: 'wp-nh65-kodad',
        name: 'Kodad Border Gateway',
        distanceFromStartKm: 178,
        description: 'Telangana border municipality with fast EV points',
        chargingStationIds: ['ts-chg-nh65-kodad']
      },
      {
        id: 'wp-nh65-vijayawada',
        name: 'Vijayawada Highway Gateway (Destination)',
        distanceFromStartKm: 275,
        description: 'End of expressway corridor at Krishna delta approach',
        chargingStationIds: ['ts-chg-nh65-kodad']
      }
    ]
  },

  // 3. Hyderabad to Kurnool / Bengaluru (NH-44 - 215 km)
  {
    id: 'corridor-hyderabad-kurnool-nh44',
    name: 'Hyderabad to Kurnool / Bengaluru South Corridor',
    highwayCode: 'NH-44',
    totalDistanceKm: 215,
    startLocation: 'Shamshabad Airport Rotary, Hyderabad',
    endLocation: 'Alampur / Kurnool Krishna Bridge',
    popularScenicSpots: [
      'Rajiv Gandhi International Airport (RGIA)',
      'Jadcherla Windmill Ridges',
      'Pebber Krishna River Backwaters',
      'Alampur 5th Shakti Peetha Jogulamba Temple'
    ],
    waypoints: [
      {
        id: 'wp-nh44-start',
        name: 'Shamshabad Airport Rotary (Start)',
        distanceFromStartKm: 0,
        description: 'South Hyderabad highway terminal with multi-network charging',
        chargingStationIds: ['ts-chg-shamshabad-airport', 'ts-chg-orr-shamshabad-exit']
      },
      {
        id: 'wp-nh44-shadnagar',
        name: 'Shadnagar Toll Point',
        distanceFromStartKm: 50,
        description: 'High-speed Ola and CCS2 charging point',
        chargingStationIds: ['ts-chg-nh44-shadnagar']
      },
      {
        id: 'wp-nh44-jadcherla',
        name: 'Jadcherla Crossroads Hub',
        distanceFromStartKm: 85,
        description: 'Key junction towards Mahabubnagar and Raichur',
        chargingStationIds: ['ts-chg-nh44-jadcherla']
      },
      {
        id: 'wp-nh44-pebber',
        name: 'Pebber Highway Midway',
        distanceFromStartKm: 152,
        description: 'Smooth open straight with Tata Power EZ Charge',
        chargingStationIds: ['ts-chg-nh44-pebber']
      },
      {
        id: 'wp-nh44-alampur',
        name: 'Alampur Krishna River Crossing',
        distanceFromStartKm: 198,
        description: 'Historical temple town and Krishna river bridge',
        chargingStationIds: ['ts-chg-nh44-alampur']
      },
      {
        id: 'wp-nh44-kurnool',
        name: 'Kurnool Gateway (Destination)',
        distanceFromStartKm: 215,
        description: 'State border gateway into Rayalaseema corridor',
        chargingStationIds: ['ts-chg-nh44-alampur']
      }
    ]
  },

  // 4. Hyderabad to Nizamabad / North Corridor (NH-44 North - 175 km)
  {
    id: 'corridor-hyderabad-nizamabad-nh44n',
    name: 'Hyderabad to Nizamabad North Corridor',
    highwayCode: 'NH-44 North',
    totalDistanceKm: 175,
    startLocation: 'Medchal ORR Exit 6, Hyderabad',
    endLocation: 'Nizamabad Collectorate Central',
    popularScenicSpots: [
      'Kandlakoya Oxygen Park',
      'Medak Church & Fort Diversion',
      'Pocharam Wildlife Sanctuary',
      'Ashok Sagar Lake Nizamabad'
    ],
    waypoints: [
      {
        id: 'wp-nh44n-start',
        name: 'Medchal / ORR Exit 6 (Start)',
        distanceFromStartKm: 0,
        description: 'North gateway toll with TS REDCO rapid hub',
        chargingStationIds: ['ts-chg-orr-kandlakoya-exit']
      },
      {
        id: 'wp-nh44n-toopran',
        name: 'Toopran Toll Plaza',
        distanceFromStartKm: 52,
        description: 'First highway rest stop with Kazam DC fast charger',
        chargingStationIds: ['ts-chg-nh44n-toopran']
      },
      {
        id: 'wp-nh44n-kamareddy',
        name: 'Kamareddy Central Bypass',
        distanceFromStartKm: 115,
        description: 'District headquarters with multi-cuisine dining & EV hubs',
        chargingStationIds: ['ts-chg-nh44n-kamareddy']
      },
      {
        id: 'wp-nh44n-dichpally',
        name: 'Dichpally Telangana University',
        distanceFromStartKm: 155,
        description: 'Scenic university campus approach with Bolt.earth points',
        chargingStationIds: ['ts-chg-nh44n-dichpally']
      },
      {
        id: 'wp-nh44n-nizamabad',
        name: 'Nizamabad Central (Destination)',
        distanceFromStartKm: 175,
        description: 'District collectorate hub with TS REDCO charging',
        chargingStationIds: ['ts-chg-nh44n-nizamabad-city']
      }
    ]
  },

  // 5. Hyderabad Outer Ring Road (ORR) 158 km Complete Loop
  {
    id: 'corridor-hyderabad-orr-loop-158',
    name: 'Hyderabad Outer Ring Road (ORR) 158 km Expressway Loop',
    highwayCode: 'ORR-158',
    totalDistanceKm: 158,
    startLocation: 'Gachibowli Financial District (Exit 1)',
    endLocation: 'Gachibowli Financial District (Full 360° Circuit)',
    popularScenicSpots: [
      'Gachibowli Cyber Skyline',
      'Himayat Sagar & Osman Sagar Lakes',
      'Shamshabad Aerocity',
      'Ramoji Film City Hillocks',
      'Kandlakoya Green Belt'
    ],
    waypoints: [
      {
        id: 'wp-orr-gachibowli',
        name: 'Exit 1: Gachibowli / Financial Dist (Start)',
        distanceFromStartKm: 0,
        description: 'IT hub interchange with Jio-bp pulse and Ather chargers',
        chargingStationIds: ['ts-chg-orr-gachibowli-exit', 'ts-chg-gachibowli-ather']
      },
      {
        id: 'wp-orr-shamshabad',
        name: 'Exit 16: Shamshabad Airport Rotary',
        distanceFromStartKm: 32,
        description: 'Airport approach with Zeon fast DC charging',
        chargingStationIds: ['ts-chg-orr-shamshabad-exit', 'ts-chg-shamshabad-airport']
      },
      {
        id: 'wp-orr-pedda-amberpet',
        name: 'Exit 11: Pedda Amberpet (Vijayawada Hwy)',
        distanceFromStartKm: 70,
        description: 'East ORR corridor crossing NH-65',
        chargingStationIds: ['ts-chg-orr-pedda-amberpet']
      },
      {
        id: 'wp-orr-ghatkesar',
        name: 'Exit 9: Ghatkesar (Warangal Hwy)',
        distanceFromStartKm: 92,
        description: 'Northeast ORR crossing NH-163',
        chargingStationIds: ['ts-chg-orr-ghatkesar-exit']
      },
      {
        id: 'wp-orr-kandlakoya',
        name: 'Exit 6: Kandlakoya (Nagpur Hwy)',
        distanceFromStartKm: 122,
        description: 'North ORR junction crossing NH-44',
        chargingStationIds: ['ts-chg-orr-kandlakoya-exit']
      },
      {
        id: 'wp-orr-patancheru',
        name: 'Exit 3: Patancheru (Mumbai Hwy)',
        distanceFromStartKm: 142,
        description: 'Northwest industrial junction crossing NH-65',
        chargingStationIds: ['ts-chg-orr-patancheru-exit']
      },
      {
        id: 'wp-orr-finish',
        name: 'Exit 1: Gachibowli (158 km Circuit Complete)',
        distanceFromStartKm: 158,
        description: 'Complete 360-degree high-speed expressway loop finished',
        chargingStationIds: ['ts-chg-orr-gachibowli-exit']
      }
    ]
  }
];

export function getAllHighwayCorridors(): HighwayCorridor[] {
  return TELANGANA_HIGHWAY_CORRIDORS;
}

export function getHighwayCorridorById(id: string): HighwayCorridor | undefined {
  return TELANGANA_HIGHWAY_CORRIDORS.find(c => c.id === id);
}
