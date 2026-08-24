/**
 * 4-Pillar EV Technology Knowledge Base & Contextual Explainers
 */

import type { TechTopic } from '../types/techExplainer';

export const EV_TECH_TOPICS: TechTopic[] = [
  // =========================================================================
  // PILLAR 1: CHARGING ARCHITECTURES & PORTS
  // =========================================================================
  {
    id: 'tech-onboard-charger',
    pillar: 'charging_ports',
    title: 'On-Board Charger (OBC) vs Off-Board Portable Brick',
    subtitle: 'Integrated AC/DC Rectifier vs Carrying Heavy External Power Adapters',
    shortDefinition: 'An On-Board Charger (OBC) has the AC-to-DC conversion circuitry permanently built inside the vehicle chassis, allowing you to plug a standard 3-pin cable directly into any 5A/15A wall socket without carrying a heavy external adapter.',
    engineeringExplanation: [
      'In vehicles with an On-Board Charger (like Matter AERA or Raptee HV), the AC-to-DC converter is integrated into the vehicle frame with active heat dissipation. You only carry a lightweight 3-pin power cord or pull an integrated retractable cable.',
      'In off-board architectures (like Ather, Ola, or TVS), the vehicle battery accepts DC directly from a separate heavy brick charger that converts high-voltage AC from the wall socket into battery charging voltage.',
      'Having an On-Board Charger frees up valuable under-seat boot space and makes road-tripping effortless because you can charge at any roadside hotel or tea stall using standard 3-pin household outlets.'
    ],
    telanganaContextNote: 'Extremely beneficial when riding across Telangana districts (e.g. Hyderabad to Warangal or Yadagirigutta) because you can charge at any dhaba or temple guesthouse with zero extra luggage.',
    bulletPoints: [
      'Zero heavy charging bricks to carry in your backpack or boot',
      'Plugs into any standard 5A / 15A three-pin household socket in India',
      'Protected inside an IP67 waterproof aluminum chassis',
      'Integrated surge protection against voltage fluctuations common in rural power grids'
    ],
    comparison: {
      parameter: 'On-Board Charger (OBC) vs Off-Board Brick',
      optionA: {
        title: 'On-Board Charger (OBC)',
        description: 'Converter built into the vehicle chassis. Only a simple cable needed.',
        prosOrHighlights: [
          'No heavy charger brick taking up boot space',
          'Plug anywhere at any standard wall socket',
          'Weatherproof and permanently protected',
          'Ideal for interstate and rural highway touring'
        ]
      },
      optionB: {
        title: 'Off-Board Portable Brick',
        description: 'Separate external brick that must be carried in boot or left at home.',
        prosOrHighlights: [
          'Slightly lighter bike kerb weight (2-3 kg less)',
          'Cheaper to replace if charger fails',
          'Leaves vehicle electronics cooler during charging',
          'Standard on entry-level commuter scooters'
        ]
      }
    },
    idealForAudience: 'Touring riders, highway commuters, and anyone who hates carrying heavy adapter bags in their boot.',
    exampleVehicleModelIds: ['matter-aera-5000-plus', 'raptee-hv-t30'],
    badgeLabel: 'On-Board Charger (OBC)',
    iconName: 'PlugZap'
  },
  {
    id: 'tech-ccs2-fast-charging',
    pillar: 'charging_ports',
    title: 'CCS2 High-Voltage DC Fast Charging (Car Standard)',
    subtitle: 'Universal Automotive Fast Charging Standard Compatible with All Public EV Stations',
    shortDefinition: 'Combined Charging System Type 2 (CCS2) is the global automotive fast-charging standard used by electric cars (Tata Nexon EV, MG ZS EV, Hyundai Ioniq). High-voltage electric two-wheelers with CCS2 can charge at thousands of existing public car charging stations across India.',
    engineeringExplanation: [
      'Standard low-voltage scooters (48V to 72V) cannot safely plug into commercial high-power DC fast chargers designed for cars.',
      'High-voltage electric motorcycles (operating above 200V–400V, such as Raptee HV and Kabira KM5000) feature native CCS2 inlet ports, allowing them to draw 15 kW to 30 kW DC power directly.',
      'This eliminates proprietary network lock-in, granting instant access to all public highway chargers (Tata Power, Zeon, Jio-bp, TS REDCO, ChargeZone) installed along every national highway in Telangana.'
    ],
    telanganaContextNote: 'Telangana has over 400+ public CCS2 car charging guns along NH-44, NH-65, NH-163, and the Outer Ring Road. A CCS2-equipped two-wheeler can fast-charge from 20% to 80% in under 35–45 minutes at any highway food court.',
    bulletPoints: [
      'Direct compatibility with 5,000+ public DC fast chargers across India',
      'No proprietary brand lock-in (unlike closed ecosystems)',
      '0 to 80% charge in 35 to 50 minutes',
      'Standardized automotive safety interlocking protocol (ISO 15118 / DIN 70121)'
    ],
    comparison: {
      parameter: 'Universal CCS2 vs Proprietary Fast Chargers',
      optionA: {
        title: 'Universal CCS2 Automotive Standard',
        description: 'Global standard used by all EV cars & high-voltage motorcycles.',
        prosOrHighlights: [
          'Access to 100% of public highway DC chargers',
          'High charging power (up to 20-30 kW)',
          'True nationwide interstate touring capability',
          'Future-proof automotive grade safety'
        ]
      },
      optionB: {
        title: 'Proprietary Brand Fast Charging',
        description: 'Custom connectors (e.g. Ather Grid, Ola Hypercharger).',
        prosOrHighlights: [
          'Optimized exclusively for that specific brand',
          'Compact connector size on lightweight scooters',
          'Fast deployment in metro areas',
          'Often subsidized or free for brand owners'
        ]
      }
    },
    idealForAudience: 'Long-distance highway riders who need reliable fast charging at any public station across Telangana and interstate corridors.',
    exampleVehicleModelIds: ['raptee-hv-t30', 'kabira-km5000-cruiser'],
    badgeLabel: 'CCS2 Automotive Fast Charge',
    iconName: 'Zap'
  },
  {
    id: 'tech-battery-swapping',
    pillar: 'charging_ports',
    title: 'Removable / Swappable Battery Architecture',
    subtitle: 'Zero-Downtime Energy Replenishment & Apartment Charging Freedom',
    shortDefinition: 'Removable battery systems allow riders to detach lightweight battery packs (typically 8–12 kg each) and carry them indoors to charge using any regular 3-pin socket, or swap an empty pack for a fully charged one in under 60 seconds at a swap station.',
    engineeringExplanation: [
      'Fixed-pack EVs require dedicated ground-floor or basement parking charging infrastructure with 15A plugs.',
      'Removable battery systems (e.g., Hero Vida V1 with dual packs, Revolt RV400, Bounce Infinity) feature quick-release modular locks, integrated carry handles, and blind-mate IP67 connectors.',
      'This completely solves the "apartment charging dilemma" in high-rise towers where housing societies or parking lots lack charging sockets.'
    ],
    telanganaContextNote: 'Essential for residents living in high-rise gated communities across Gachibowli, Kondapur, Madhapur, and Miyapur where basement power socket permissions can take months.',
    bulletPoints: [
      'Charge anywhere on 3rd, 10th, or 20th floor apartment flats',
      'Swap to 100% battery in 60 seconds at battery swapping hubs',
      'Dual-pack redundancy: Ride on 1 pack while 2nd pack charges at home',
      'Extends battery lifespan through indoor temperature-controlled charging'
    ],
    idealForAudience: 'Apartment tenants, delivery executives riding 120+ km/day, and riders without dedicated basement parking sockets.',
    exampleVehicleModelIds: ['hero-vida-v1-pro', 'revolt-rv400-32', 'bounce-infinity-e1-plus', 'revolt-rv-blazex'],
    badgeLabel: 'Removable / Swappable Pack',
    iconName: 'BatteryCharging'
  },

  // =========================================================================
  // PILLAR 2: BATTERY CHEMISTRY & THERMAL MANAGEMENT
  // =========================================================================
  {
    id: 'tech-lfp-vs-nmc',
    pillar: 'battery_thermal',
    title: 'LFP (Lithium Iron Phosphate) vs NMC Chemistry',
    subtitle: 'Thermal Stability in Deccan Summer Heat vs Gravimetric Energy Density',
    shortDefinition: 'LFP (LiFePO4) chemistry offers superior thermal safety and withstands 2,000–3,000 charge cycles without degrading, making it virtually immune to thermal runaway in high temperatures. NMC (Nickel Manganese Cobalt) provides higher energy density for longer range in smaller, lighter packs.',
    engineeringExplanation: [
      'LFP chemical bonds (P-O bond) are exceptionally strong and do not release oxygen even above 270°C, drastically reducing thermal runaway risks during hot weather charging.',
      'LFP delivers 2,000 to 3,000 full charging cycles (equating to 7–10 years of daily usage) before reaching 80% health retention.',
      'NMC chemistry has roughly 20–30% higher volumetric energy density, allowing manufacturers (Ola, Ather, Ultraviolette) to pack 3.7 to 10.3 kWh into compact footprints for blistering acceleration and lightweight handling.'
    ],
    telanganaContextNote: 'During Telangana peak summer months (April–June) when ambient temperatures cross 42°C–45°C, LFP batteries experience significantly less thermal throttling and degradation than standard NMC packs.',
    bulletPoints: [
      'LFP: 2,000 to 3,000 charge cycles (vs 1,000 to 1,200 for NMC)',
      'LFP: Thermal runaway threshold >270°C (vs ~210°C for NMC)',
      'NMC: 20-30% lighter for the same kWh capacity',
      'LFP: Can be charged to 100% daily without accelerated cell wear'
    ],
    comparison: {
      parameter: 'LFP vs NMC Battery Chemistry',
      optionA: {
        title: 'LFP (Lithium Iron Phosphate)',
        description: 'Maximum thermal safety, long cycle life, and high heat resilience.',
        prosOrHighlights: [
          '2,000–3,000 full charge cycles (8–10 years)',
          'Extremely safe in 45°C Telangana summer heat',
          'Safe to charge to 100% daily',
          'Eco-friendly (no cobalt or nickel mining)'
        ]
      },
      optionB: {
        title: 'NMC (Nickel Manganese Cobalt)',
        description: 'Maximum energy density, compact pack volume, and lightweight.',
        prosOrHighlights: [
          'Higher energy density (lighter bike kerb weight)',
          'Sharper acceleration and higher peak discharge rates',
          'Longer range in smaller physical dimensions',
          'Dominates performance superbikes & sporty scooters'
        ]
      }
    },
    idealForAudience: 'Commercial delivery riders, long-term 8-year owners, and buyers prioritizing maximum thermal safety in hot climates.',
    exampleVehicleModelIds: ['oben-rorr-44', 'ampere-nexus-30', 'bgauss-ruv-350', 'bgauss-c12i-max', 'komaki-venice-classic'],
    badgeLabel: 'LFP Thermal Chemistry',
    iconName: 'ShieldCheck'
  },
  {
    id: 'tech-liquid-cooling',
    pillar: 'battery_thermal',
    title: 'Active Liquid Cooling vs Passive Air Cooling',
    subtitle: 'Automotive Glycol-Water Circuit for Constant Peak Power without Throttling',
    shortDefinition: 'Active liquid cooling circulates a specialized glycol-water coolant through aluminum cooling jackets around the battery cells and motor, maintaining optimal temperatures (25°C–35°C) regardless of ambient summer heat or continuous high-speed riding.',
    engineeringExplanation: [
      'Most standard electric scooters rely on passive air cooling where ambient air flows across external heatsink fins. In heavy stop-and-go traffic or 42°C ambient heat, passive heatsinks lose cooling efficiency.',
      'Active Liquid-Cooled platforms (like Matter AERA 5000+) use an electric water pump, radiator, and integrated cooling channels wrapped around the cell matrix and power inverter.',
      'This prevents "thermal throttling" (sudden loss of top speed or limp mode on flyovers) and ensures consistent peak torque and faster charging speeds.'
    ],
    telanganaContextNote: 'Maintains full 105 km/h top speed and full torque on Hyderabad flyovers and outer ring road stretches even at 2 PM in peak May summer.',
    bulletPoints: [
      'Prevents thermal power reduction (no limp mode during aggressive riding)',
      'Enables continuous fast charging without battery overheating delays',
      'Uniform cell-to-cell temperature distribution prolonging overall pack life',
      'Closed loop automotive-grade coolant system requiring zero daily maintenance'
    ],
    idealForAudience: 'Performance riders, steep gradient commuters, and riders doing long sustained highway runs in hot climates.',
    exampleVehicleModelIds: ['matter-aera-5000-plus'],
    badgeLabel: 'Active Liquid Cooled',
    iconName: 'ThermometerSnowflake'
  },

  // =========================================================================
  // PILLAR 3: MOTOR & DRIVETRAIN TECHNOLOGIES
  // =========================================================================
  {
    id: 'tech-mid-drive-vs-hub',
    pillar: 'motor_drivetrain',
    title: 'Mid-Drive PMSM vs In-Wheel BLDC Hub Motor',
    subtitle: 'Chassis Balance & Unsprung Mass vs Simple Direct Wheel Drive',
    shortDefinition: 'A Mid-Drive PMSM motor is mounted inside the central chassis frame and transfers power to the rear wheel via a carbon belt or chain, reducing unsprung weight for superior handling. A Hub motor is built directly inside the rear wheel hub for maximum simplicity and zero belt maintenance.',
    engineeringExplanation: [
      'Central motor placement in Mid-Drive setups concentrates the vehicle mass low and central, drastically improving cornering agility, suspension response over potholes, and hill-climbing torque via gear reduction.',
      'Hub motors eliminate belts, chains, and sprockets, delivering silent operation and zero drive-train wear. However, placing motor mass in the wheel increases "unsprung weight", making pothole impacts feel slightly firmer.',
      'Belt-drive mid-motors (Ather, Ola Roadster, TVS X) utilize carbon-reinforced synchronous belts that require zero oiling or messy chain lubrication.'
    ],
    telanganaContextNote: 'Mid-drive chassis balance delivers plush ride comfort over rough suburban speed breakers and potholes in expanding municipal zones.',
    bulletPoints: [
      'Mid-Drive: Lower unsprung wheel weight = plush suspension over potholes',
      'Mid-Drive: Superior hill climb torque reduction for double-riding',
      'Hub Motor: Zero belt or chain maintenance for life',
      'Hub Motor: Whisper-silent operation and lower upfront price'
    ],
    comparison: {
      parameter: 'Mid-Drive PMSM vs In-Wheel Hub Motor',
      optionA: {
        title: 'Mid-Drive PMSM (Belt/Chain)',
        description: 'Centrally mounted motor with torque multiplication.',
        prosOrHighlights: [
          'Outstanding 50:50 chassis balance and cornering agility',
          'High climbing torque for steep parking ramps & flyovers',
          'Better suspension damping over bumpy roads',
          'High thermal dissipation away from road debris'
        ]
      },
      optionB: {
        title: 'In-Wheel BLDC Hub Motor',
        description: 'Motor integrated directly inside the rear wheel rim.',
        prosOrHighlights: [
          '100% maintenance-free (no belts or chains to replace)',
          'Whisper-silent drive with zero mechanical backlash',
          'Leaves full chassis space open for massive batteries & boot',
          'Most affordable upfront cost'
        ]
      }
    },
    idealForAudience: 'Sporty riders desiring razor-sharp handling (Mid-drive) vs daily family commuters wanting zero maintenance (Hub motor).',
    exampleVehicleModelIds: ['ather-450x-gen3-37', 'ola-roadster-pro-16', 'ultraviolette-f77-mach2', 'tvs-x-44'],
    badgeLabel: 'Mid-Drive PMSM Motor',
    iconName: 'Cpu'
  },
  {
    id: 'tech-manual-gearbox-ev',
    pillar: 'motor_drivetrain',
    title: 'Multi-Speed Manual Gearbox in Electric Vehicles',
    subtitle: '4-Speed Sequential Transmission with Wet Multi-Plate Clutch on an EV',
    shortDefinition: 'A 4-speed manual gearbox on an electric motorcycle allows the rider to shift gears using a traditional foot shifter and clutch lever, providing unprecedented control over wheel torque for steep climbs and high top-speed cruising efficiency.',
    engineeringExplanation: [
      'Almost all electric two-wheelers use single-speed direct reduction drives because electric motors generate peak torque from 0 RPM.',
      'However, a multi-speed gearbox (pioneered by Matter AERA 5000+) matches the motor RPM sweet spot to vehicle velocity: 1st gear delivers explosive wheel torque (520 Nm) for climbs, while 4th gear reduces motor RPM at 105 km/h for maximum highway efficiency.',
      'Includes active stall-prevention: Even if you stop in 4th gear, the electric motor never stalls, allowing effortless take-offs in any gear.'
    ],
    telanganaContextNote: 'Perfect for traditional motorcycle riders in Telangana who love the mechanical engagement of shifting gears without paying for expensive petrol.',
    bulletPoints: [
      '4-speed sequential hyper-shift with traditional clutch lever',
      'Electric anti-stall technology: Cannot stall at traffic lights',
      'Massive 520 Nm wheel torque in 1st gear for steep gradients',
      'Lower motor electrical stress and higher efficiency at highway cruising speeds'
    ],
    idealForAudience: 'Motorcycle purists who love shifting gears, riders frequently tackling steep ghat roads or heavy pillion loads.',
    exampleVehicleModelIds: ['matter-aera-5000-plus'],
    badgeLabel: '4-Speed Manual Gearbox',
    iconName: 'Gauge'
  },

  // =========================================================================
  // PILLAR 4: SAFETY, BRAKING & ELECTRONICS
  // =========================================================================
  {
    id: 'tech-dual-channel-abs',
    pillar: 'safety_regen',
    title: 'Dual-Channel ABS vs Combined Braking System (CBS)',
    subtitle: 'Active Wheel-Slip Anti-Lock Prevention on Wet Monsoons vs Mechanical Linkage',
    shortDefinition: 'Dual-Channel ABS uses independent electronic wheel speed sensors and hydraulic ECU modulators on both front and rear wheels to prevent wheel lockup during emergency braking on wet or sandy roads. CBS mechanically links the front and rear brakes together.',
    engineeringExplanation: [
      'Combi-Brake System (CBS) mechanically applies partial front braking when the rear brake lever is pressed. While it reduces stopping distance, it cannot prevent wheel skidding on wet tarmac or sudden panic braking.',
      'Dual-Channel ABS (Bosch / Continental systems on Ultraviolette, TVS X, Oben Rorr) pulses brake hydraulic pressure 15–20 times per second when wheel slip is detected, preserving full steering control and preventing front-wheel washouts.',
      'Some high-end performance models also feature switchable Rear ABS (for off-road dirt riding) or Lean-Angle Sensitive Cornering ABS.'
    ],
    telanganaContextNote: 'Crucial for wet monsoon riding during Hyderabad torrential downpours and navigating loose gravel near ongoing road infrastructure work.',
    bulletPoints: [
      'Prevents catastrophic front-wheel lockup on wet monsoon asphalt',
      'Maintains complete steering authority during 60-0 km/h panic stops',
      'Independent hydraulic modulation on both 17/19-inch wheels',
      'Mandatory benchmark for high-speed highway touring (>90 km/h)'
    ],
    comparison: {
      parameter: 'Dual-Channel ABS vs CBS',
      optionA: {
        title: 'Dual-Channel ABS (Bosch/Continental)',
        description: 'Electronic anti-lock modulation on front & rear discs.',
        prosOrHighlights: [
          'Zero wheel lockup even under full panic grip on wet roads',
          'Preserves steering control and bike stability',
          'Shorter stopping distance on slippery surfaces',
          'Required standard for high-performance highway riding'
        ]
      },
      optionB: {
        title: 'Combined Braking System (CBS)',
        description: 'Mechanical linkage distributing force to both brakes.',
        prosOrHighlights: [
          'Simple mechanical design with lower maintenance',
          'Standard on affordable commuter scooters (< ₹1.2L)',
          'Distributes braking force between front and rear',
          'Good for low-speed (under 50 km/h) city commuting'
        ]
      }
    },
    idealForAudience: 'Highway tourers, safety-conscious riders, and anyone riding in monsoon rains or unpredictable city traffic.',
    exampleVehicleModelIds: ['ultraviolette-f77-mach2', 'ultraviolette-concept-x47', 'tvs-x-44', 'orxa-mantis-89'],
    badgeLabel: 'Dual-Channel ABS',
    iconName: 'ShieldAlert'
  },
  {
    id: 'tech-active-regen',
    pillar: 'safety_regen',
    title: 'Active Twist-Grip Throttle Regen & Dynamic Energy Recovery',
    subtitle: 'Kinetic Energy Conversion into Battery Range with 1-Pedal / 1-Grip City Riding',
    shortDefinition: 'Active Regenerative Braking converts the electric motor into a generator during deceleration, feeding kinetic energy back into the battery pack (recovering 5% to 15% city range) while smoothly slowing the vehicle down without wearing brake pads.',
    engineeringExplanation: [
      'Passive coasting regen triggers mild deceleration whenever the throttle is released.',
      'Active Reverse Twist Regen (pioneered by Ather "Magic Twist") allows riders to twist the throttle forward past the zero position to progressively modulate regenerative braking force from 0.1G to 0.4G.',
      'This enables true "1-grip city riding" where 90% of daily city deceleration is handled without touching the mechanical brake levers, drastically prolonging brake pad life to 40,000+ km.'
    ],
    telanganaContextNote: 'Recovers substantial energy during stop-and-go rush hour on the PVNR Expressway, Gachibowli flyovers, and Begumpet corridors, adding up to 12–18 km of free range per week.',
    bulletPoints: [
      'Recovers 8% to 15% additional city battery range from braking',
      'True 1-grip city riding with intuitive forward-twist deceleration',
      'Reduces mechanical brake pad wear by over 70%',
      'Smooth, progressive deceleration without vehicle pitch or dive'
    ],
    idealForAudience: 'City commuters riding in dense traffic who want maximum real-world range and reduced maintenance bills.',
    exampleVehicleModelIds: ['ather-apex-450', 'ather-rizta-z-37', 'ather-450x-gen3-37', 'ola-s1-pro-gen2'],
    badgeLabel: 'Active Twist Regen',
    iconName: 'RotateCcw'
  }
];

export function getAllTechTopics(): TechTopic[] {
  return EV_TECH_TOPICS;
}

export function getTechTopicById(id: string): TechTopic | undefined {
  return EV_TECH_TOPICS.find(t => t.id === id);
}

export function getTechTopicsByPillar(pillar: string): TechTopic[] {
  return EV_TECH_TOPICS.filter(t => t.pillar === pillar);
}
