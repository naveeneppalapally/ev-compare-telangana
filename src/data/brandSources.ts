export const BRAND_OFFICIAL_SOURCES: Record<string, string> = {
  'Ola Electric': 'https://olaelectric.com',
  'Ather Energy': 'https://www.atherenergy.com',
  'TVS Motor': 'https://www.tvsmotor.com',
  'Bajaj Auto': 'https://www.bajajauto.com',
  'Revolt Motors': 'https://www.revoltmotors.com',
  'Ultraviolette Automotive': 'https://ultraviolette.com',
  'Hero MotoCorp (Vida)': 'https://vidaelectric.com',
  'River Mobility': 'https://rivermobility.com',
  'Oben Electric': 'https://obenelectric.com',
  'Matter Mobility': 'https://mattermotor.com',
  'Raptee Energy': 'https://rapteehv.com',
  'Orxa Energies': 'https://orxa.com',
  'Pure EV': 'https://pureev.in',
  'Kinetic Green': 'https://kineticgreenvehicles.com',
  'Greaves Ampere': 'https://ampere.greaveselectricmobility.com',
  'Kabira Mobility': 'https://kabiramobility.com',
  'Komaki Electric': 'https://komaki.in',
  'Hop Electric': 'https://hopelectric.in',
  'Tork Motors': 'https://torkmotors.com',
  'BGauss': 'https://bgauss.com',
  'Simple Energy': 'https://simpleenergy.in',
  'Bounce Infinity': 'https://bounceinfinity.com',
  Honda: 'https://www.honda2wheelersindia.com'
};

export function getBrandSource(brand: string): string | null {
  return BRAND_OFFICIAL_SOURCES[brand] ?? null;
}

export default getBrandSource;
