// Plain-language "why this matters" explainers for manufacturer feature strings.
// Matching is keyword-based so the 223 distinct marketing strings in the catalog
// resolve without an entry each. First matching rule wins.

interface FeatureRule {
  keywords: RegExp;
  why: string;
}

const RULES: FeatureRule[] = [
  { keywords: /removable|portable battery|take.{0,4}home/i, why: 'The pack lifts out, so you can charge it from any wall socket at home — no dedicated parking or charger installation needed.' },
  { keywords: /fast charg|rapid charg|ccs2|dc charg/i, why: 'Refills the battery to about 80% in under an hour at public fast-charging stations — practical for long rides.' },
  { keywords: /on[- ]?board charg/i, why: 'Converts AC power inside the vehicle, so you can charge anywhere a normal plug point reaches.' },
  { keywords: /regen|regenerative/i, why: 'Recovers braking energy back into the battery and extends real-world city range, especially in stop-and-go traffic.' },
  { keywords: /cruise control/i, why: 'Locks your speed without holding the throttle — reduces wrist fatigue on longer highway stretches.' },
  { keywords: /reverse (mode|assist)/i, why: 'Lets the motor back the scooter out of tight parking spots instead of muscle-pushing a heavy vehicle.' },
  { keywords: /hill (hold|assist)|hold assist/i, why: 'Prevents the vehicle from rolling backwards when you release the brake on a slope — useful in ghat sections and flyovers.' },
  { keywords: /\babs\b/i, why: 'Stops the wheels from locking under hard braking, so you keep steering control during emergency stops.' },
  { keywords: /disc brake/i, why: 'Stronger, more consistent stopping than drum brakes — especially in rain and after repeated braking.' },
  { keywords: /comb|\bcbs\b|linked brake|integrated brak/i, why: 'Applying one lever brakes both wheels, shortening stopping distance for less experienced riders.' },
  { keywords: /riding mode|sport mode|eco mode|economy mode|smartbrake|multi.?mode/i, why: 'Switches between efficiency and performance profiles — stretch your range in Eco, unlock full power when needed.' },
  { keywords: /keyless|smart key/i, why: 'Starts the vehicle with the key fob in your pocket — no key barrel to fumble with in traffic.' },
  { keywords: /geofence|geo-fence/i, why: 'Alerts you if the vehicle leaves a boundary you set — a theft deterrent and a way to keep track of family riders.' },
  { keywords: /theft|anti[- ]?theft|motion alert|tow alert/i, why: 'Notifies you of tampering or movement when parked, so you can respond before a theft completes.' },
  { keywords: /tyre pressure|tpms/i, why: 'Warns you about low pressure before it flattens the battery range or causes a blowout.' },
  { keywords: /tubeless/i, why: 'A puncture deflates slowly instead of bursting, letting you ride safely to a repair shop.' },
  { keywords: /alloy wheel|alloys?/i, why: 'Lighter than spoked wheels and never need spoke tightening — better handling with less maintenance.' },
  { keywords: /telescopic|upside.?down|\bufd\b/i, why: 'Absorbs bumps more smoothly than basic front suspension, keeping control over broken city roads.' },
  { keywords: /mono.?shock|rear susp|spring load/i, why: 'Keeps the rear wheel planted over potholes for comfort, even with a pillion on board.' },
  { keywords: /liquid.?cool|liquid cool/i, why: 'Keeps battery and motor temperatures stable in Telangana summer heat, protecting range and component life.' },
  { keywords: /\bbelt\b/i, why: 'Runs quieter and needs no chain lubrication — cleaner and cheaper to maintain than a chain drive.' },
  { keywords: /gearbox|\bgears?\b(?!less)|manual gear/i, why: 'Gears let the motor work in its efficient band — sportier acceleration and better highway efficiency for enthusiasts.' },
  { keywords: /app|bluetooth|connect|telematic|iot|sim/i, why: 'Pairs with your phone for charge status, ride stats, navigation and remote alerts.' },
  { keywords: /navigat|turn.by.turn/i, why: 'Shows directions on the dash, so you are not glancing at a phone mount while riding.' },
  { keywords: /music|call|voice/i, why: 'Handle calls and media from the dash or handlebar so your phone stays in your pocket.' },
  { keywords: /\bled\b|projector|drl/i, why: 'Brighter, whiter light than halogen with far lower power draw — see and be seen after dark.' },
  { keywords: /boot|storage|underseat|luggage|carrying/i, why: 'Swallows a full-face helmet plus groceries — replaces short car trips for daily errands.' },
  { keywords: /flat floor|footboard|flat floorboard/i, why: 'A flat floor lets you carry LPG cylinders, sacks or a child standing between your feet.' },
  { keywords: /pillion|long seat|family|two helmet/i, why: 'Designed to carry two adults comfortably with space for their helmets too.' },
  { keywords: /swappable|battery swap/i, why: 'Swap a drained pack for a full one at exchange stations in minutes instead of waiting to charge.' },
  { keywords: /ip6[78]|ip rated|waterproof|wading/i, why: 'Sealed against dust and heavy monsoon water — safe through flooded streets and pressure washes.' },
  { keywords: /traction/i, why: 'Detects wheel slip on wet or gravelly roads and cuts power momentarily to keep you upright.' },
  { keywords: /\b4g\b|lte|ota|over.the.air/i, why: 'Connected over mobile networks, receiving feature updates and remote tracking without visiting a service centre.' },
  { keywords: /charge@|charg(e|ing) time|0.to.80|fast.home/i, why: 'Overnight charging on a domestic socket covers a typical day commute with margin to spare.' },
  { keywords: /arai|icat|certified/i, why: 'Independently tested and certified figures, not just manufacturer claims.' },
  { keywords: /made in india|local/i, why: 'Locally manufactured — easier service support and stable spare-parts supply.' },
  { keywords: /top speed|\bkm\/h\b/i, why: 'Higher top speed keeps highway and flyover cruising relaxed instead of flat-out.' },
  { keywords: /price|₹|lakh/i, why: 'Aggressive pricing brings a full-featured electric into reach of first-time buyers.' },
  { keywords: /warranty/i, why: 'Long coverage means battery or motor problems in this window cost you nothing.' },
  { keywords: /payload/i, why: 'Rated to carry heavy loads without stressing the frame, motor or suspension.' },
  { keywords: /\bmode\b|0.to.40|warp|sonic|havoc|hyper|turbo/i, why: 'Performance modes trade range for sharper acceleration when you need it.' },
  { keywords: /running cost|paise|per km/i, why: 'Per-kilometre energy cost is a fraction of petrol — savings compound every single day.' },
  { keywords: /home charg|\bw\b charger|950w|800w/i, why: 'Faster home charging from a regular socket — full overnight even after a long day.' },
  { keywords: /seat/i, why: 'A wider, plusher seat matters on daily rides — less fatigue for you and your pillion.' },
  { keywords: /lfp|thermal|hot climate|summer/i, why: 'LFP chemistry tolerates Telangana summer heat far better than NMC, protecting battery life.' },
  { keywords: /silent|acg|quiet/i, why: 'No engine noise or vibration at start-up and idle — quieter streets and stress-free commutes.' }
] as FeatureRule[];

export function explainFeature(feature: string): string | null {
  // Long catalog strings already state their own benefit ("Active winglets that
  // articulate on lean angle…") — no second explanation needed.
  if (feature.length >= 40) return null;
  const rule = RULES.find(r => r.keywords.test(feature));
  return rule ? rule.why : null;
}

export default explainFeature;
