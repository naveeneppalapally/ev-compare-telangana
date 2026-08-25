/**
 * Mock dealer network for Telangana
 * Covers Hyderabad (TG-09, TG-10, TG-11, TG-12), Warangal TG-26, Karimnagar TG-02
 * Each dealer carries 2-4 models of its brand with colour-level stock and rolling slots.
 */

export interface DealerStockEntry {
  modelId: string;
  colours: string[];
  available: boolean;
}

export interface Dealer {
  id: string;
  brand: string;
  name: string;
  rtoCode: string; // e.g. TG-09
  district: string; // display name
  address: string;
  phone: string;
  stock: DealerStockEntry[];
  slots: string[];
}

export const DEALERS: Dealer[] = [
  // ── Hyderabad Central TG-09 (Khairatabad / Banjara Hills) ─────────────
  {
    id: 'ather-banjara-tg09',
    brand: 'Ather Energy',
    name: 'Ather Space - Banjara Hills',
    rtoCode: 'TG-09',
    district: 'Hyderabad Central',
    address: 'Road No. 12, Banjara Hills, Hyderabad - 500034 (Opp. City Center Mall)',
    phone: '040 4651 2234',
    stock: [
      { modelId: 'ather-rizta-z-37', colours: ['Cardamom Green', 'Pangong Blue'], available: true },
      { modelId: 'ather-450x-gen3-37', colours: ['Lunar Grey', 'Hyper Red'], available: true },
      { modelId: 'ather-apex-450', colours: ['Indium Blue & Warp Orange'], available: true },
      { modelId: 'ather-rizta-s-29', colours: ['Deccan Grey', 'Siachen White'], available: false },
    ],
    slots: ['Today 4:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 4:30 PM', 'Sun 11:00 AM'],
  },
  {
    id: 'ola-punjagutta-tg09',
    brand: 'Ola Electric',
    name: 'Ola Experience Centre - Punjagutta',
    rtoCode: 'TG-09',
    district: 'Hyderabad Central',
    address: 'Punjagutta Officers Colony, Nagarjuna Circle, Hyderabad - 500082',
    phone: '91234 56780',
    stock: [
      { modelId: 'ola-s1-pro-gen2', colours: ['Jet Black', 'Stellar Blue'], available: true },
      { modelId: 'ola-s1-air', colours: ['Jet Black', 'Porcelain White'], available: true },
      { modelId: 'ola-roadster-60', colours: ['Midnight Black', 'Racing Red'], available: true },
      { modelId: 'ola-roadster-x-25', colours: ['Stealth Black'], available: false },
    ],
    slots: ['Today 5:30 PM', 'Tomorrow 11:00 AM', 'Tomorrow 3:00 PM', 'Sun 10:30 AM'],
  },
  {
    id: 'tvs-ameerpet-tg09',
    brand: 'TVS Motor',
    name: 'TVS iQube Electric - Ameerpet',
    rtoCode: 'TG-09',
    district: 'Hyderabad Central',
    address: 'Ameerpet Main Road, Beside Maitrivanam, Hyderabad - 500016',
    phone: '040 4422 8890',
    stock: [
      { modelId: 'tvs-iqube-s-34', colours: ['Pearl White', 'Mint Blue'], available: true },
      { modelId: 'tvs-iqube-st-51', colours: ['Copper Bronze', 'Mercury Grey'], available: true },
      { modelId: 'tvs-x-44', colours: ['Hyper Silver & Red'], available: true },
    ],
    slots: ['Today 4:30 PM', 'Tomorrow 10:30 AM', 'Tomorrow 5:00 PM'],
  },

  // ── Hyderabad North TG-10 (Secunderabad) ───────────────────────────────
  {
    id: 'bajaj-secunderabad-tg10',
    brand: 'Bajaj Auto',
    name: 'Bajaj Chetak - Secunderabad',
    rtoCode: 'TG-10',
    district: 'Hyderabad North',
    address: 'PG Road, Paradise Circle, Secunderabad - 500003',
    phone: '040 2784 5566',
    stock: [
      { modelId: 'bajaj-chetak-premium-32', colours: ['Brooklyn Black', 'Indigo Metallic'], available: true },
      { modelId: 'bajaj-chetak-2901', colours: ['Cyber White', 'Brooklyn Black'], available: true },
      { modelId: 'bajaj-chetak-3202', colours: ['Indigo Metallic', 'Brooklyn Black'], available: false },
    ],
    slots: ['Today 3:00 PM', 'Tomorrow 9:30 AM', 'Tomorrow 4:00 PM'],
  },
  {
    id: 'revolt-trimulgherry-tg10',
    brand: 'Revolt Motors',
    name: 'Revolt Hub - Trimulgherry',
    rtoCode: 'TG-10',
    district: 'Hyderabad North',
    address: 'Plot 88, Trimulgherry Main Road, Secunderabad - 500015',
    phone: '99630 11223',
    stock: [
      { modelId: 'revolt-rv400-32', colours: ['Rebel Red', 'Cosmic Black'], available: true },
      { modelId: 'revolt-rv1-plus-32', colours: ['Black Neon', 'Titan White'], available: true },
      { modelId: 'revolt-rv-blazex', colours: ['Blaze Red', 'Cosmic Grey'], available: true },
    ],
    slots: ['Today 4:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 3:30 PM'],
  },
  {
    id: 'ola-begumpet-tg10',
    brand: 'Ola Electric',
    name: 'Ola Experience Centre - Begumpet',
    rtoCode: 'TG-10',
    district: 'Hyderabad North',
    address: 'Begumpet Road, Near Begumpet Metro, Hyderabad - 500016',
    phone: '91234 56781',
    stock: [
      { modelId: 'ola-s1-x-plus-30', colours: ['Jet Black', 'Porcelain White'], available: true },
      { modelId: 'ola-roadster-x-45', colours: ['Stealth Black', 'Crimson Red'], available: true },
      { modelId: 'ola-roadster-45', colours: ['Midnight Black', 'Racing Red'], available: false },
    ],
    slots: ['Today 6:00 PM', 'Tomorrow 11:30 AM', 'Tomorrow 5:30 PM'],
  },

  // ── Hyderabad East TG-11 (Malakpet / Dilsukhnagar) ─────────────────────
  {
    id: 'ola-dilsukhnagar-tg11',
    brand: 'Ola Electric',
    name: 'Ola Future Store - Dilsukhnagar',
    rtoCode: 'TG-11',
    district: 'Hyderabad East',
    address: 'Chaitanyapuri Main Road, Dilsukhnagar, Hyderabad - 500060',
    phone: '91234 56782',
    stock: [
      { modelId: 'ola-s1-pro-gen2', colours: ['Jet Black', 'Amethyst'], available: true },
      { modelId: 'ola-roadster-x-45', colours: ['Silver Storm'], available: true },
      { modelId: 'ola-s1-air', colours: ['Porcelain White'], available: true },
    ],
    slots: ['Today 4:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 4:00 PM'],
  },
  {
    id: 'ather-malakpet-tg11',
    brand: 'Ather Energy',
    name: 'Ather Space - Malakpet',
    rtoCode: 'TG-11',
    district: 'Hyderabad East',
    address: 'Chaderghat Road, Malakpet, Hyderabad - 500036 (Near Maheshwari Complex)',
    phone: '040 4651 2235',
    stock: [
      { modelId: 'ather-rizta-z-37', colours: ['Deccan Grey', 'Alphonso Yellow'], available: true },
      { modelId: 'ather-450x-gen3-37', colours: ['Space Grey & Yellow', 'White'], available: false },
    ],
    slots: ['Today 5:00 PM', 'Tomorrow 10:30 AM', 'Tomorrow 3:00 PM'],
  },

  // ── Hyderabad South TG-12 (Bahadurpura / Old City) ─────────────────────
  {
    id: 'bgauss-charminar-tg12',
    brand: 'BGauss',
    name: 'BGauss Electric - Charminar',
    rtoCode: 'TG-12',
    district: 'Hyderabad South',
    address: 'Charminar Road, Near Gulzar Houz, Hyderabad - 500002',
    phone: '040 2456 7788',
    stock: [
      { modelId: 'bgauss-ruv-350', colours: ['Matte Blue', 'Pearl White'], available: true },
      { modelId: 'bgauss-c12i-max', colours: ['Gunmetal Grey', 'Matte Blue'], available: true },
    ],
    slots: ['Today 4:30 PM', 'Tomorrow 10:00 AM', 'Tomorrow 4:30 PM'],
  },
  {
    id: 'pureev-falaknuma-tg12',
    brand: 'Pure EV',
    name: 'Pure EV - Falaknuma',
    rtoCode: 'TG-12',
    district: 'Hyderabad South',
    address: 'Engine Bowli, Falaknuma Road, Hyderabad - 500053',
    phone: '97012 34567',
    stock: [
      { modelId: 'pure-ev-etryst-350', colours: ['Tan Red', 'Punch Black'], available: true },
      { modelId: 'pure-ev-ecodryft-350', colours: ['Black Metallic', 'Blue Metallic'], available: true },
    ],
    slots: ['Today 3:30 PM', 'Tomorrow 11:00 AM', 'Tomorrow 5:00 PM'],
  },

  // ── Karimnagar TG-02 ───────────────────────────────────────────────────
  {
    id: 'ather-karimnagar-tg02',
    brand: 'Ather Energy',
    name: 'Ather Space - Karimnagar',
    rtoCode: 'TG-02',
    district: 'Karimnagar',
    address: 'Court Chowrasta, Karimnagar - 505001 (Opp. Collectorate)',
    phone: '0878 222 3344',
    stock: [
      { modelId: 'ather-rizta-z-37', colours: ['Cardamom Green', 'Pangong Blue'], available: true },
      { modelId: 'ather-450x-gen3-37', colours: ['Lunar Grey', 'Hyper Red'], available: true },
    ],
    slots: ['Today 4:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 3:30 PM'],
  },
  {
    id: 'ola-karimnagar-tg02',
    brand: 'Ola Electric',
    name: 'Ola Experience Centre - Karimnagar',
    rtoCode: 'TG-02',
    district: 'Karimnagar',
    address: 'Mukarampura Main Road, Karimnagar - 505001',
    phone: '91234 56783',
    stock: [
      { modelId: 'ola-s1-pro-gen2', colours: ['Jet Black', 'Stellar Blue'], available: true },
      { modelId: 'ola-roadster-60', colours: ['Midnight Black', 'Electric Blue'], available: true },
      { modelId: 'ola-s1-air', colours: ['Jet Black'], available: false },
    ],
    slots: ['Today 5:00 PM', 'Tomorrow 10:30 AM', 'Tomorrow 4:00 PM'],
  },
  {
    id: 'tvs-karimnagar-tg02',
    brand: 'TVS Motor',
    name: 'TVS iQube - Karimnagar',
    rtoCode: 'TG-02',
    district: 'Karimnagar',
    address: 'Huzurabad Road, Karimnagar - 505002',
    phone: '0878 222 5566',
    stock: [
      { modelId: 'tvs-iqube-s-34', colours: ['Pearl White', 'Shining Red'], available: true },
      { modelId: 'tvs-iqube-st-51', colours: ['Mercury Grey'], available: true },
      { modelId: 'tvs-x-44', colours: ['Cyber Stealth Black'], available: false },
    ],
    slots: ['Today 4:30 PM', 'Tomorrow 11:00 AM', 'Tomorrow 4:30 PM'],
  },

  // ── Warangal TG-26 (treated as Warangal / Hanamkonda belt) ─────────────
  {
    id: 'ola-warangal-tg26',
    brand: 'Ola Electric',
    name: 'Ola Experience Centre - Kakatiya Hills, Warangal',
    rtoCode: 'TG-26',
    district: 'Warangal',
    address: 'KUC Cross Roads, Hanamkonda, Warangal - 506001',
    phone: '91234 56784',
    stock: [
      { modelId: 'ola-s1-pro-gen2', colours: ['Jet Black', 'Porcelain White'], available: true },
      { modelId: 'ola-roadster-60', colours: ['Midnight Black', 'Racing Red'], available: true },
      { modelId: 'ola-roadster-x-45', colours: ['Crimson Red'], available: true },
    ],
    slots: ['Today 4:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 4:00 PM'],
  },
  {
    id: 'revolt-warangal-tg26',
    brand: 'Revolt Motors',
    name: 'Revolt Hub - Kazipet, Warangal',
    rtoCode: 'TG-26',
    district: 'Warangal',
    address: 'Warangal–Hyderabad NH 163, Kazipet, Warangal - 506004',
    phone: '99630 44556',
    stock: [
      { modelId: 'revolt-rv400-32', colours: ['Rebel Red', 'Cosmic Black'], available: true },
      { modelId: 'revolt-rv1-22', colours: ['Black Neon', 'Cosmic Red'], available: true },
      { modelId: 'revolt-rv1-plus-32', colours: ['Cosmic Red', 'Titan White'], available: false },
    ],
    slots: ['Today 3:00 PM', 'Tomorrow 10:30 AM', 'Tomorrow 3:30 PM'],
  },
  {
    id: 'bajaj-warangal-tg26',
    brand: 'Bajaj Auto',
    name: 'Bajaj Chetak - Warangal',
    rtoCode: 'TG-26',
    district: 'Warangal',
    address: 'Nakkalagutta, Hanamkonda, Warangal - 506001',
    phone: '0870 245 6789',
    stock: [
      { modelId: 'bajaj-chetak-premium-32', colours: ['Brooklyn Black', 'Cyber White'], available: true },
      { modelId: 'bajaj-chetak-3202', colours: ['Indigo Metallic', 'Brooklyn Black'], available: true },
    ],
    slots: ['Today 5:30 PM', 'Tomorrow 11:00 AM', 'Tomorrow 5:00 PM'],
  },
];

export function getDealersForRto(rtoCode: string): Dealer[] {
  if (!rtoCode) return [];
  const normalized = rtoCode.trim().toUpperCase().replace('TS-', 'TG-');
  return DEALERS.filter((d) => d.rtoCode === normalized);
}

export function getDealersForModelInRto(modelId: string, rtoCode: string): Dealer[] {
  return getDealersForRto(rtoCode).filter((d) => d.stock.some((s) => s.modelId === modelId));
}
