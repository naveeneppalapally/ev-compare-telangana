/**
 * Vehicle Imagery & Resilient Vector Silhouette Subsystem
 * 
 * Provides:
 * 1. Exact design silhouette archetype mapping across all Indian EV motorcycles & scooters
 * 2. Pure inline SVG vector artwork generator with brand accent styling for 100% offline fallback resilience
 * 3. Accessibility and aspect ratio metadata utilities
 */

import type { EVModel } from '../types/ev';

export type VehicleSilhouetteArchetype =
  | 'supersport'
  | 'streetfighter'
  | 'cruiser'
  | 'commuter-roadster'
  | 'sporty-scooter'
  | 'retro-metal-scooter'
  | 'family-comfort-scooter'
  | 'rugged-suv-scooter'
  | 'heavy-duty-moped'
  | 'ice-scooter';

export const SILHOUETTE_ARCHETYPES: VehicleSilhouetteArchetype[] = [
  'supersport',
  'streetfighter',
  'cruiser',
  'commuter-roadster',
  'sporty-scooter',
  'retro-metal-scooter',
  'family-comfort-scooter',
  'rugged-suv-scooter',
  'heavy-duty-moped',
  'ice-scooter'
];

/**
 * Classifies any EV model or ICE benchmark into its exact design silhouette archetype.
 */
export function getVehicleDesignSilhouette(model: EVModel): VehicleSilhouetteArchetype {
  if (model.isIceBenchmark || model.id === 'honda-activa-6g') {
    return 'ice-scooter';
  }

  const id = model.id.toLowerCase();
  const name = model.name.toLowerCase();

  if (model.category === 'motorcycle') {
    if (
      id.includes('f77') ||
      id.includes('f99') ||
      id.includes('km3000') ||
      id.includes('raptee') ||
      name.includes('f77') ||
      name.includes('f99') ||
      name.includes('km3000') ||
      name.includes('raptee')
    ) {
      return 'supersport';
    }

    if (id.includes('ranger') || name.includes('cruiser') || name.includes('ranger')) {
      return 'cruiser';
    }

    if (
      id.includes('rv400') ||
      id.includes('km4000') ||
      id.includes('aera') ||
      id.includes('kratos') ||
      id.includes('rorr') ||
      name.includes('rv400') ||
      name.includes('km4000') ||
      name.includes('aera') ||
      name.includes('kratos') ||
      name.includes('rorr')
    ) {
      return 'streetfighter';
    }

    return 'commuter-roadster';
  }

  // Scooter category
  if (id.includes('e-luna') || id.includes('zulu') || name.includes('e-luna') || name.includes('zulu')) {
    return 'heavy-duty-moped';
  }

  if (id.includes('indie') || id.includes('ruv') || name.includes('indie') || name.includes('ruv')) {
    return 'rugged-suv-scooter';
  }

  if (id.includes('chetak') || id.includes('venice') || name.includes('chetak') || name.includes('venice')) {
    return 'retro-metal-scooter';
  }

  if (
    id.includes('450') ||
    id.includes('apex') ||
    id.includes('s1-pro') ||
    id.includes('tvs-x') ||
    id.includes('simple-one') ||
    name.includes('450') ||
    name.includes('apex') ||
    name.includes('s1 pro') ||
    name.includes('tvs x') ||
    name.includes('simple one')
  ) {
    return 'sporty-scooter';
  }

  return 'family-comfort-scooter';
}

/**
 * Returns human-readable label for the archetype
 */
export function getArchetypeLabel(archetype: VehicleSilhouetteArchetype): string {
  switch (archetype) {
    case 'supersport':
      return 'Supersport Fairing';
    case 'streetfighter':
      return 'Naked Streetfighter';
    case 'cruiser':
      return 'Highway Cruiser';
    case 'commuter-roadster':
      return 'Commuter Roadster';
    case 'sporty-scooter':
      return 'Sporty Aerodynamic Scooter';
    case 'retro-metal-scooter':
      return 'Retro Metal-Body Scooter';
    case 'family-comfort-scooter':
      return 'Family Comfort Scooter';
    case 'rugged-suv-scooter':
      return 'Rugged Utility SUV Scooter';
    case 'heavy-duty-moped':
      return 'Heavy-Duty Cargo Moped';
    case 'ice-scooter':
      return 'ICE Petrol Benchmark';
  }
}

/**
 * Retrieves the primary brand theme color
 */
export function getBrandThemeColor(model: EVModel): string {
  if (model.colorOptions && model.colorOptions.length > 0 && model.colorOptions[0].hex) {
    return model.colorOptions[0].hex;
  }
  return '#10b981'; // Default Electric Emerald Green
}

/**
 * Generates WCAG 2.1 AA compliant accessible alt text
 */
export function getAccessibleVehicleAlt(model: EVModel): string {
  const categoryLabel = model.category === 'motorcycle' ? 'Electric Motorcycle' : 'Electric Scooter';
  if (model.isIceBenchmark) {
    return `${model.brand} ${model.name} (${categoryLabel}) with 109.51cc petrol engine benchmark`;
  }
  return `${model.brand} ${model.name} (${categoryLabel}) with ${model.specs.batteryCapacityKwh} kWh battery`;
}

/**
 * Helper to build archetype-specific SVG vector paths
 */
function getArchetypeVectorPaths(archetype: VehicleSilhouetteArchetype, brandColor: string): string {
  switch (archetype) {
    case 'supersport':
      return `
        <!-- Supersport Track Fairing & Low Clip-ons -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Aerodynamic windshield & front nose fairing -->
          <path d="M 220 280 L 260 210 L 320 185 L 370 195 L 430 240 L 510 245 L 610 210 L 635 220 L 585 270 L 500 285 L 440 330 L 320 335 L 250 315 Z" fill="${brandColor}" fill-opacity="0.12" />
          <!-- Aerodynamic windshield cowl -->
          <path d="M 280 200 L 335 155 L 375 185" stroke="#06b6d4" stroke-width="2.5" />
          <!-- Clip-on drop handlebars -->
          <path d="M 330 190 L 305 195" stroke="#f8fafc" stroke-width="3" />
          <!-- Tank & Stepped Racing Seat Cowl -->
          <path d="M 370 195 C 410 190, 450 215, 480 240 L 560 240 L 620 205 L 640 220 L 580 270" stroke="#f8fafc" stroke-width="3" />
          <!-- Full belly aerodynamic pan -->
          <path d="M 330 335 L 450 340 L 490 310" stroke="${brandColor}" stroke-width="3" />
          <!-- Upside Down Front Fork -->
          <line x1="330" y1="195" x2="250" y2="355" stroke="#94a3b8" stroke-width="4" />
          <!-- Rear Racing Swingarm & Mono-shock -->
          <line x1="470" y1="285" x2="570" y2="355" stroke="#94a3b8" stroke-width="4" />
          <line x1="460" y1="260" x2="490" y2="310" stroke="#f59e0b" stroke-width="3" />
        </g>
        <!-- Alloy Wheels with Disc Brake Rotors -->
        <g>
          <!-- Front Wheel -->
          <circle cx="250" cy="355" r="48" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="250" cy="355" r="30" stroke="${brandColor}" stroke-width="2" fill="none" stroke-dasharray="6,4" />
          <circle cx="250" cy="355" r="10" fill="#94a3b8" />
          <!-- Rear Wheel -->
          <circle cx="570" cy="355" r="48" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="570" cy="355" r="30" stroke="${brandColor}" stroke-width="2" fill="none" stroke-dasharray="6,4" />
          <circle cx="570" cy="355" r="10" fill="#94a3b8" />
        </g>
      `;

    case 'streetfighter':
      return `
        <!-- Naked Streetfighter Angular Shrouds & Exposed Trellis Subframe -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Minimalist aggressive headlight mask -->
          <path d="M 235 250 L 265 205 L 305 205 L 320 235 L 290 270 Z" fill="${brandColor}" fill-opacity="0.2" />
          <!-- Wide straight flat handlebar -->
          <path d="M 300 180 L 330 185 L 350 185" stroke="#f8fafc" stroke-width="3.5" />
          <!-- Muscular tank shoulder shrouds -->
          <path d="M 320 205 L 390 195 L 445 240 L 375 275 L 310 260 Z" fill="${brandColor}" fill-opacity="0.15" />
          <!-- Exposed Trellis Truss Frame -->
          <path d="M 370 235 L 430 280 M 390 220 L 415 310 M 430 240 L 460 295" stroke="#06b6d4" stroke-width="2.5" />
          <!-- Stepped seat & Sharp upswept tail -->
          <path d="M 440 238 L 490 245 L 560 215 L 590 225 L 540 270 L 465 275" stroke="#f8fafc" stroke-width="3" />
          <!-- Front USD Suspension Fork -->
          <line x1="315" y1="190" x2="250" y2="355" stroke="#94a3b8" stroke-width="4" />
          <!-- Rear Mono-shock Swingarm -->
          <line x1="450" y1="280" x2="565" y2="355" stroke="#94a3b8" stroke-width="4" />
        </g>
        <!-- Street Wheels -->
        <g>
          <circle cx="250" cy="355" r="48" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="250" cy="355" r="26" stroke="#06b6d4" stroke-width="2" fill="none" stroke-dasharray="4,4" />
          <circle cx="250" cy="355" r="10" fill="#94a3b8" />
          <circle cx="565" cy="355" r="48" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="565" cy="355" r="26" stroke="#06b6d4" stroke-width="2" fill="none" stroke-dasharray="4,4" />
          <circle cx="565" cy="355" r="10" fill="#94a3b8" />
        </g>
      `;

    case 'cruiser':
      return `
        <!-- Highway Cruiser Teardrop Battery Tank, Low Saddle & High Pullback Bars -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- High pullback ape-style handlebars -->
          <path d="M 330 220 L 310 145 L 340 145" stroke="#f8fafc" stroke-width="3.5" />
          <!-- Raked Extended Front Fork -->
          <line x1="320" y1="165" x2="220" y2="355" stroke="#94a3b8" stroke-width="4.5" />
          <!-- Teardrop fuel/battery tank -->
          <path d="M 325 210 Q 380 190, 420 235 L 350 255 Z" fill="${brandColor}" fill-opacity="0.2" />
          <!-- Deep scooped low saddle -->
          <path d="M 410 238 Q 450 265, 485 250" stroke="#f8fafc" stroke-width="4" />
          <!-- Passenger Backrest / Sissy Bar -->
          <path d="M 545 270 L 560 190" stroke="#f8fafc" stroke-width="3.5" />
          <path d="M 485 250 L 555 255 L 565 285" stroke="#f8fafc" stroke-width="3" />
          <!-- Heavy battery box & Chrome crash bars -->
          <rect x="360" y="260" width="90" height="65" rx="8" stroke="${brandColor}" stroke-width="3" fill="#0f172a" />
          <line x1="430" y1="285" x2="575" y2="355" stroke="#94a3b8" stroke-width="4" />
        </g>
        <!-- Cruiser Large Front Wheel & Fat Rear Wheel -->
        <g>
          <circle cx="220" cy="355" r="52" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="220" cy="355" r="32" stroke="${brandColor}" stroke-width="2" fill="none" stroke-dasharray="8,4" />
          <circle cx="220" cy="355" r="12" fill="#94a3b8" />
          <circle cx="575" cy="355" r="48" stroke="#f8fafc" stroke-width="8" fill="#0b1329" />
          <circle cx="575" cy="355" r="28" stroke="${brandColor}" stroke-width="2" fill="none" stroke-dasharray="8,4" />
          <circle cx="575" cy="355" r="12" fill="#94a3b8" />
        </g>
      `;

    case 'commuter-roadster':
      return `
        <!-- Balanced Commuter Roadster Ergonomics & Straight Bench -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Upright Handlebar -->
          <path d="M 315 200 L 305 165 L 325 165" stroke="#f8fafc" stroke-width="3.5" />
          <!-- Telescopic Front Fork -->
          <line x1="310" y1="180" x2="250" y2="355" stroke="#94a3b8" stroke-width="4" />
          <!-- Level Roadster Tank -->
          <path d="M 315 205 Q 365 195, 410 225 L 330 250 Z" fill="${brandColor}" fill-opacity="0.18" />
          <!-- Long Flat Commuter Bench Seat -->
          <path d="M 400 225 L 550 230 L 575 255 L 430 260 Z" fill="#334155" stroke="#f8fafc" stroke-width="3" />
          <!-- Utilitarian Pillion Grab Rail -->
          <path d="M 545 225 L 585 225 L 575 255" stroke="#06b6d4" stroke-width="3" />
          <!-- Central Battery Enclosure -->
          <rect x="345" y="255" width="95" height="70" rx="10" stroke="${brandColor}" stroke-width="3" fill="#0f172a" />
          <line x1="420" y1="285" x2="560" y2="355" stroke="#94a3b8" stroke-width="4" />
        </g>
        <!-- Commuter 17-inch Wheels -->
        <g>
          <circle cx="250" cy="355" r="48" stroke="#f8fafc" stroke-width="5" fill="#0b1329" />
          <circle cx="250" cy="355" r="28" stroke="${brandColor}" stroke-width="1.5" fill="none" stroke-dasharray="6,4" />
          <circle cx="250" cy="355" r="10" fill="#94a3b8" />
          <circle cx="560" cy="355" r="48" stroke="#f8fafc" stroke-width="5" fill="#0b1329" />
          <circle cx="560" cy="355" r="28" stroke="${brandColor}" stroke-width="1.5" fill="none" stroke-dasharray="6,4" />
          <circle cx="560" cy="355" r="10" fill="#94a3b8" />
        </g>
      `;

    case 'sporty-scooter':
      return `
        <!-- Sporty Origami Apron & Steep Upswept Tail (Ather / Simple / Ola S1 Pro) -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Handlebar Cowl with Sporty Display -->
          <path d="M 335 185 L 310 180 L 330 160 L 350 180 Z" fill="#0f172a" stroke="#f8fafc" stroke-width="3" />
          <!-- Sharp Creased Aerodynamic Front Apron -->
          <path d="M 325 185 L 290 260 L 260 290 L 305 310 L 355 240 Z" fill="${brandColor}" fill-opacity="0.2" stroke="${brandColor}" stroke-width="3.5" />
          <!-- Floorboard spine bridge -->
          <path d="M 305 310 L 415 315 L 435 285" stroke="#f8fafc" stroke-width="3.5" />
          <!-- Sharp upswept angular seat & tail section -->
          <path d="M 390 265 L 530 225 L 570 240 L 480 300 L 420 300 Z" fill="${brandColor}" fill-opacity="0.12" stroke="${brandColor}" stroke-width="3.5" />
          <!-- Sporty Step-up Seat -->
          <path d="M 375 260 L 460 250 L 545 220" stroke="#f8fafc" stroke-width="3.5" />
          <line x1="290" y1="280" x2="265" y2="360" stroke="#94a3b8" stroke-width="4" />
        </g>
        <!-- Sporty 12-inch Alloy Wheels -->
        <g>
          <circle cx="265" cy="360" r="42" stroke="#f8fafc" stroke-width="5" fill="#0b1329" />
          <circle cx="265" cy="360" r="24" stroke="#06b6d4" stroke-width="2" fill="none" stroke-dasharray="4,4" />
          <circle cx="265" cy="360" r="9" fill="#94a3b8" />
          <circle cx="535" cy="360" r="42" stroke="#f8fafc" stroke-width="5" fill="#0b1329" />
          <circle cx="535" cy="360" r="24" stroke="#06b6d4" stroke-width="2" fill="none" stroke-dasharray="4,4" />
          <circle cx="535" cy="360" r="9" fill="#94a3b8" />
        </g>
      `;

    case 'retro-metal-scooter':
      return `
        <!-- Retro Curved Metal Body Panels (Bajaj Chetak) -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Round/Horseshoe Retro Headlamp Nacelle -->
          <path d="M 330 185 Q 315 155, 345 155 Q 365 155, 350 185 Z" fill="#0f172a" stroke="#f8fafc" stroke-width="3" />
          <circle cx="330" cy="170" r="10" stroke="#f59e0b" stroke-width="2" fill="none" />
          <!-- Classic Curved Front Apron -->
          <path d="M 335 185 Q 285 240, 275 305 L 335 315 L 360 240 Z" fill="${brandColor}" fill-opacity="0.2" stroke="${brandColor}" stroke-width="3.5" />
          <!-- Flat Metal Floorboard -->
          <path d="M 330 315 L 440 315" stroke="#f8fafc" stroke-width="4" />
          <!-- Curvaceous Teardrop Side Panel (Metal cowl) -->
          <path d="M 410 270 Q 480 230, 560 260 Q 575 310, 480 320 Z" fill="${brandColor}" fill-opacity="0.25" stroke="${brandColor}" stroke-width="3.5" />
          <!-- Classic Curved Bench Seat -->
          <path d="M 380 255 Q 460 235, 540 245" stroke="#f8fafc" stroke-width="4" />
          <!-- Chrome Grab Handle -->
          <path d="M 525 240 Q 565 235, 560 260" stroke="#06b6d4" stroke-width="3" />
          <line x1="300" y1="290" x2="270" y2="360" stroke="#94a3b8" stroke-width="4" />
        </g>
        <!-- Classic 12-inch Solid Rim Wheels -->
        <g>
          <circle cx="270" cy="360" r="42" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="270" cy="360" r="22" stroke="${brandColor}" stroke-width="2" fill="none" />
          <circle cx="270" cy="360" r="9" fill="#94a3b8" />
          <circle cx="525" cy="360" r="42" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="525" cy="360" r="22" stroke="${brandColor}" stroke-width="2" fill="none" />
          <circle cx="525" cy="360" r="9" fill="#94a3b8" />
        </g>
      `;

    case 'family-comfort-scooter':
      return `
        <!-- Wide Family Seat, Spacious Flat Floorboard & Integrated Pillion Backrest (Rizta / iQube / Vida) -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Sleek Handlebar Pod -->
          <path d="M 330 180 L 305 175 L 345 160 L 360 175 Z" fill="#0f172a" stroke="#f8fafc" stroke-width="3" />
          <!-- Broad protective front apron -->
          <path d="M 330 180 L 290 250 L 275 300 L 335 315 L 360 235 Z" fill="${brandColor}" fill-opacity="0.18" stroke="${brandColor}" stroke-width="3.5" />
          <!-- Ultra-wide Flat Floorboard with Bag Hook -->
          <path d="M 325 315 L 440 315" stroke="#f8fafc" stroke-width="4.5" />
          <path d="M 365 250 L 365 265" stroke="#f59e0b" stroke-width="2.5" />
          <!-- Spacious Underseat Storage Body -->
          <path d="M 405 270 L 535 250 L 565 275 L 485 320 L 420 320 Z" fill="${brandColor}" fill-opacity="0.15" stroke="${brandColor}" stroke-width="3.5" />
          <!-- Extra-Long Family Dual Seat -->
          <path d="M 370 255 L 545 240" stroke="#f8fafc" stroke-width="4.5" />
          <!-- Integrated Passenger Backrest -->
          <path d="M 535 240 L 555 185" stroke="#f8fafc" stroke-width="4" />
          <circle cx="555" cy="185" r="7" fill="#38bdf8" />
          <line x1="295" y1="290" x2="270" y2="360" stroke="#94a3b8" stroke-width="4" />
        </g>
        <!-- Family Comfort Wheels -->
        <g>
          <circle cx="270" cy="360" r="42" stroke="#f8fafc" stroke-width="5" fill="#0b1329" />
          <circle cx="270" cy="360" r="24" stroke="${brandColor}" stroke-width="2" fill="none" stroke-dasharray="6,3" />
          <circle cx="270" cy="360" r="9" fill="#94a3b8" />
          <circle cx="530" cy="360" r="42" stroke="#f8fafc" stroke-width="5" fill="#0b1329" />
          <circle cx="530" cy="360" r="24" stroke="${brandColor}" stroke-width="2" fill="none" stroke-dasharray="6,3" />
          <circle cx="530" cy="360" r="9" fill="#94a3b8" />
        </g>
      `;

    case 'rugged-suv-scooter':
      return `
        <!-- Rugged SUV Scooter with Twin Headlights, Perimeter Crash Rails & 14" Wheels (River Indie / RUV) -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Twin Square Adventure Headlights -->
          <rect x="255" y="235" width="22" height="22" rx="4" stroke="#f59e0b" stroke-width="3" fill="#0b1329" />
          <rect x="282" y="235" width="22" height="22" rx="4" stroke="#f59e0b" stroke-width="3" fill="#0b1329" />
          <!-- Rugged Tubular External Crash Guard / Perimeter Cage -->
          <path d="M 325 185 L 250 250 L 250 310 L 335 320" stroke="#06b6d4" stroke-width="3.5" />
          <!-- Wide Utility Floorboard & Footpeg Pegs -->
          <path d="M 330 320 L 440 320" stroke="#f8fafc" stroke-width="4.5" />
          <line x1="365" y1="320" x2="365" y2="335" stroke="#f59e0b" stroke-width="3.5" />
          <!-- High-capacity rugged body with pannier rail mounts -->
          <path d="M 405 270 L 535 250 L 575 275 L 485 325 Z" fill="${brandColor}" fill-opacity="0.2" stroke="${brandColor}" stroke-width="3.5" />
          <path d="M 460 280 L 550 270" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="4,4" />
          <!-- Flat Dual Seat & Heavy Pillion Grab Bar -->
          <path d="M 370 255 L 545 240" stroke="#f8fafc" stroke-width="4" />
          <path d="M 535 240 L 575 240 L 575 275" stroke="#f8fafc" stroke-width="3.5" />
          <line x1="290" y1="285" x2="260" y2="355" stroke="#94a3b8" stroke-width="4.5" />
        </g>
        <!-- Big 14-inch Rugged All-Terrain Alloy Wheels -->
        <g>
          <circle cx="260" cy="355" r="46" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="260" cy="355" r="26" stroke="${brandColor}" stroke-width="2" fill="none" stroke-dasharray="8,4" />
          <circle cx="260" cy="355" r="10" fill="#94a3b8" />
          <circle cx="535" cy="355" r="46" stroke="#f8fafc" stroke-width="6" fill="#0b1329" />
          <circle cx="535" cy="355" r="26" stroke="${brandColor}" stroke-width="2" fill="none" stroke-dasharray="8,4" />
          <circle cx="535" cy="355" r="10" fill="#94a3b8" />
        </g>
      `;

    case 'heavy-duty-moped':
      return `
        <!-- Heavy Duty Step-Through Dual Spine Frame & Split Cargo Rack (Kinetic E-Luna) -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Upright Tubular Handlebars & Round Headlamp -->
          <path d="M 320 180 L 305 155 L 325 155" stroke="#f8fafc" stroke-width="3.5" />
          <circle cx="275" cy="220" r="14" stroke="#f59e0b" stroke-width="2.5" fill="#0b1329" />
          <!-- Heavy Dual-Tube Step-Through Spine Frame -->
          <path d="M 310 190 L 310 320 L 440 320 L 440 280" stroke="${brandColor}" stroke-width="5" />
          <path d="M 325 190 L 325 310 L 430 310" stroke="#06b6d4" stroke-width="3" />
          <!-- Rider Solo Seat -->
          <path d="M 390 250 Q 430 245, 450 270" stroke="#f8fafc" stroke-width="4.5" />
          <!-- Heavy Duty Detachable Rear Cargo Rack -->
          <path d="M 460 260 L 575 260 L 575 295 L 460 295 Z" fill="#334155" stroke="#f8fafc" stroke-width="3" />
          <!-- Dual Heavy Load Springs -->
          <line x1="475" y1="285" x2="540" y2="355" stroke="#f59e0b" stroke-width="3.5" />
          <line x1="290" y1="230" x2="250" y2="355" stroke="#94a3b8" stroke-width="4" />
        </g>
        <!-- Large High-Spoke Utility Wheels -->
        <g>
          <circle cx="250" cy="355" r="48" stroke="#f8fafc" stroke-width="4.5" fill="#0b1329" />
          <circle cx="250" cy="355" r="28" stroke="${brandColor}" stroke-width="1" fill="none" stroke-dasharray="3,3" />
          <circle cx="250" cy="355" r="8" fill="#94a3b8" />
          <circle cx="550" cy="355" r="48" stroke="#f8fafc" stroke-width="4.5" fill="#0b1329" />
          <circle cx="550" cy="355" r="28" stroke="${brandColor}" stroke-width="1" fill="none" stroke-dasharray="3,3" />
          <circle cx="550" cy="355" r="8" fill="#94a3b8" />
        </g>
      `;

    case 'ice-scooter':
      return `
        <!-- Traditional Petrol ICE Benchmark Scooter with Exhaust Muffler (Honda Activa 6G) -->
        <g stroke="${brandColor}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Traditional Single-piece Headlamp Pod -->
          <path d="M 330 180 L 305 175 L 345 160 L 360 175 Z" fill="#0f172a" stroke="#f8fafc" stroke-width="3" />
          <!-- Metal Front Fender & Apron -->
          <path d="M 330 180 L 290 250 L 275 305 L 335 315 L 360 235 Z" fill="${brandColor}" fill-opacity="0.18" stroke="${brandColor}" stroke-width="3.5" />
          <!-- Floorboard -->
          <path d="M 325 315 L 435 315" stroke="#f8fafc" stroke-width="4" />
          <!-- Metal Side Cowl -->
          <path d="M 405 270 L 535 250 L 565 275 L 485 320 Z" fill="${brandColor}" fill-opacity="0.18" stroke="${brandColor}" stroke-width="3.5" />
          <!-- Single-piece Step Seat -->
          <path d="M 370 255 L 540 245" stroke="#f8fafc" stroke-width="4" />
          <!-- Prominent Petrol Exhaust Muffler & Chrome Heat Shield -->
          <rect x="440" y="325" width="105" height="24" rx="6" stroke="#94a3b8" stroke-width="3" fill="#1e293b" />
          <line x1="455" y1="337" x2="525" y2="337" stroke="#f8fafc" stroke-width="2" />
          <line x1="295" y1="290" x2="270" y2="360" stroke="#94a3b8" stroke-width="4" />
        </g>
        <!-- Standard 10/12-inch Wheels -->
        <g>
          <circle cx="270" cy="360" r="42" stroke="#f8fafc" stroke-width="5" fill="#0b1329" />
          <circle cx="270" cy="360" r="22" stroke="#94a3b8" stroke-width="1.5" fill="none" />
          <circle cx="270" cy="360" r="9" fill="#94a3b8" />
          <circle cx="530" cy="360" r="40" stroke="#f8fafc" stroke-width="5" fill="#0b1329" />
          <circle cx="530" cy="360" r="20" stroke="#94a3b8" stroke-width="1.5" fill="none" />
          <circle cx="530" cy="360" r="9" fill="#94a3b8" />
        </g>
      `;
  }
}

/**
 * Generates clean, high-contrast, model-specific inline SVG data URI vector artwork
 * representing the exact physical design profile with brand accent styling.
 */
export function generateVehicleSilhouetteSvg(model: EVModel): string {
  const archetype = getVehicleDesignSilhouette(model);
  const brandColor = getBrandThemeColor(model);
  const archetypeLabel = getArchetypeLabel(archetype);
  const categoryIcon = model.category === 'motorcycle' ? '🏍️' : '🛵';
  
  const batteryBadgeText = model.isIceBenchmark
    ? '109.51cc Petrol ICE Benchmark'
    : `${model.specs.batteryCapacityKwh} kWh • ${model.specs.batteryChemistry}`;

  const vectorArt = getArchetypeVectorPaths(archetype, brandColor);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%" style="background:#020617;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <!-- Brand Accent Gradient -->
    <linearGradient id="brandAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${brandColor}" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <!-- Cyber Grid Pattern -->
    <pattern id="cyberGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.75" stroke-opacity="0.4" />
    </pattern>

    <!-- Subtle Radial Glow -->
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${brandColor}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="500" fill="url(#bgGrad)" rx="20" />
  <rect width="800" height="500" fill="url(#cyberGrid)" rx="20" />
  <circle cx="400" cy="260" r="240" fill="url(#centerGlow)" />

  <!-- Top Badges Bar -->
  <g transform="translate(30, 30)">
    <!-- Brand Pill -->
    <rect x="0" y="0" width="140" height="32" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="70" y="21" font-size="11" font-weight="800" fill="#f8fafc" text-anchor="middle" letter-spacing="1.5">
      ${model.brand.toUpperCase()}
    </text>

    <!-- Archetype Pill -->
    <rect x="150" y="0" width="210" height="32" rx="8" fill="#0f172a" stroke="${brandColor}" stroke-width="1" stroke-opacity="0.5" />
    <text x="255" y="21" font-size="11" font-weight="700" fill="${brandColor}" text-anchor="middle">
      ${categoryIcon} ${archetypeLabel.toUpperCase()}
    </text>
  </g>

  <!-- Top Right Battery / Spec Badge -->
  <g transform="translate(540, 30)">
    <rect x="0" y="0" width="230" height="32" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="115" y="21" font-size="11" font-weight="700" font-family="monospace" fill="#38bdf8" text-anchor="middle">
      ⚡ ${batteryBadgeText}
    </text>
  </g>

  <!-- Center Vehicle Silhouette Vector Artwork -->
  <g class="silhouette-archetype" data-archetype="${archetype}">
    <!-- Horizon Ground Shadow -->
    <ellipse cx="400" cy="405" rx="280" ry="12" fill="#000000" fill-opacity="0.6" />
    <line x1="160" y1="405" x2="640" y2="405" stroke="${brandColor}" stroke-width="1" stroke-opacity="0.3" />

    <!-- Injected Archetype Geometry -->
    ${vectorArt}
  </g>

  <!-- Bottom Information Bar -->
  <g transform="translate(30, 425)">
    <!-- Model Title -->
    <text x="0" y="20" font-size="22" font-weight="900" fill="#f8fafc" letter-spacing="-0.5">
      ${model.brand} ${model.name}
    </text>

    <!-- Spec Summary Bar -->
    <text x="0" y="44" font-size="12" font-family="monospace" fill="#94a3b8">
      Top Speed: <tspan fill="#f8fafc" font-weight="bold">${model.specs.topSpeedKmh} km/h</tspan> • Real City: <tspan fill="${brandColor}" font-weight="bold">${model.specs.realWorldCityRangeKm} km</tspan> • ARAI: <tspan fill="#38bdf8">${model.specs.araiRangeKm} km</tspan>
    </text>

    <!-- Offline Vector Fallback Watermark -->
    <text x="740" y="44" font-size="10" font-weight="600" fill="#475569" text-anchor="end">
      VECTOR SILHOUETTE PREVIEW
    </text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}
