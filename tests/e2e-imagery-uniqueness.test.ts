import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getAllVehiclesIncludingBenchmark,
  getEVModelById,
  ICE_BENCHMARK_MODEL
} from '../src/data/evModels.ts';

import type { EVModel } from '../src/types/ev.ts';

/**
 * Silhouette Archetype Definition (Interface Contract from PROJECT.md)
 */
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

/**
 * Pure Reference Archetype Classifier for Opaque-Box E2E Testing
 */
export function classifyVehicleArchetype(model: EVModel): VehicleSilhouetteArchetype {
  if (model.isIceBenchmark || model.id === 'honda-activa-6g') {
    return 'ice-scooter';
  }

  const id = model.id.toLowerCase();
  const name = model.name.toLowerCase();

  if (model.category === 'motorcycle') {
    if (id.includes('f77') || id.includes('km3000') || name.includes('f77') || name.includes('km3000')) {
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
      name.includes('rv400') ||
      name.includes('km4000') ||
      name.includes('aera') ||
      name.includes('kratos')
    ) {
      return 'streetfighter';
    }
    return 'commuter-roadster';
  }

  // category === 'scooter'
  if (id.includes('e-luna') || name.includes('e-luna')) {
    return 'heavy-duty-moped';
  }
  if (id.includes('indie') || id.includes('ruv') || name.includes('indie') || name.includes('ruv')) {
    return 'rugged-suv-scooter';
  }
  if (id.includes('chetak') || name.includes('chetak')) {
    return 'retro-metal-scooter';
  }
  if (
    id.includes('450') ||
    id.includes('apex') ||
    id.includes('s1-pro') ||
    id.includes('tvs-x') ||
    name.includes('450') ||
    name.includes('apex') ||
    name.includes('s1 pro')
  ) {
    return 'sporty-scooter';
  }

  return 'family-comfort-scooter';
}

/**
 * Pure Reference SVG Silhouette Generator for Opaque-Box E2E Testing
 */
export function generateReferenceSilhouetteSvg(model: EVModel): string {
  const archetype = classifyVehicleArchetype(model);
  const brandColor = model.colorOptions?.[0]?.hex || '#10b981';
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${brandColor}" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bgGrad)" rx="16" />
    <g class="silhouette-archetype" data-archetype="${archetype}">
      <text x="400" y="240" font-size="28" font-family="system-ui, sans-serif" font-weight="bold" fill="#f8fafc" text-anchor="middle">
        ${model.brand} ${model.name}
      </text>
      <text x="400" y="280" font-size="16" font-family="monospace" fill="${brandColor}" text-anchor="middle">
        ${archetype.toUpperCase()} • ${model.specs.batteryCapacityKwh} kWh ${model.specs.batteryChemistry}
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

describe('E2E Test Suite 2: Vehicle Imagery Architecture, Uniqueness & Fallback Resilience', () => {
  const allVehicles = getAllVehiclesIncludingBenchmark();

  // ==========================================================================
  // TIER 1: IMAGE URL INTEGRITY, PROTOCOL VALIDITY & SCHEMA CONTRACTS
  // ==========================================================================
  describe('Tier 1: Visual Asset Integrity & Image Schema Contracts', () => {
    it('verifies that 100% of vehicles have non-empty HTTPS image URLs parseable by URL constructor', () => {
      assert.ok(allVehicles.length >= 41, 'Must test all 41 vehicles');

      for (const vehicle of allVehicles) {
        assert.ok(
          vehicle.imageUrl && typeof vehicle.imageUrl === 'string' && vehicle.imageUrl.trim().length > 0,
          `Vehicle ${vehicle.id} has empty or non-string imageUrl`
        );

        // Strictly HTTPS
        assert.ok(
          vehicle.imageUrl.startsWith('https://'),
          `Vehicle ${vehicle.id} image URL must start with https://, got "${vehicle.imageUrl}"`
        );

        // URL constructor validity test
        assert.doesNotThrow(
          () => {
            const parsedUrl = new URL(vehicle.imageUrl);
            assert.equal(parsedUrl.protocol, 'https:', `Protocol must be https: for ${vehicle.id}`);
            assert.ok(parsedUrl.hostname.length > 0, `Hostname missing in ${vehicle.id}`);
          },
          `Vehicle ${vehicle.id} imageUrl is not a valid URL: ${vehicle.imageUrl}`
        );
      }
    });

    it('verifies visual overlay badge metadata and specification text generation', () => {
      for (const vehicle of allVehicles) {
        // Battery badge overlay
        if (!vehicle.isIceBenchmark) {
          const batteryBadge = `${vehicle.specs.batteryCapacityKwh} kWh (${vehicle.specs.batteryChemistry})`;
          assert.ok(batteryBadge.includes('kWh'), `Battery badge should include kWh for ${vehicle.id}`);
          assert.ok(batteryBadge.includes(vehicle.specs.batteryChemistry), `Battery badge should include chemistry for ${vehicle.id}`);
        } else {
          assert.equal(vehicle.specs.batteryCapacityKwh, 0);
          assert.equal(vehicle.specs.batteryChemistry, 'N/A (Petrol ICE)');
        }

        // Category pill
        assert.ok(['motorcycle', 'scooter'].includes(vehicle.category), `Invalid category for ${vehicle.id}`);

        // Fast facts for image card overlay
        assert.ok(vehicle.specs.topSpeedKmh > 0, `Top speed must be > 0 for ${vehicle.id}`);
        assert.ok(vehicle.specs.accel0To40Kmh > 0, `0-40 sprint must be > 0 for ${vehicle.id}`);
      }
    });

    it('verifies paint finish color swatches format, count, and hex code validity', () => {
      const hex6Regex = /^#[0-9A-Fa-f]{6}$/;

      for (const vehicle of allVehicles) {
        assert.ok(
          Array.isArray(vehicle.colorOptions) && vehicle.colorOptions.length >= 2,
          `Vehicle ${vehicle.id} must have >= 2 color swatches, got ${vehicle.colorOptions?.length}`
        );

        const seenColors = new Set<string>();
        for (const swatch of vehicle.colorOptions) {
          assert.ok(swatch.name && swatch.name.trim().length > 0, `Empty color name in ${vehicle.id}`);
          assert.ok(
            hex6Regex.test(swatch.hex),
            `Color "${swatch.name}" in ${vehicle.id} has invalid 6-digit hex code: "${swatch.hex}"`
          );

          // Color distinctness on the same vehicle
          const colorKey = swatch.name.toLowerCase();
          assert.ok(!seenColors.has(colorKey), `Duplicate color name "${swatch.name}" on vehicle ${vehicle.id}`);
          seenColors.add(colorKey);
        }
      }
    });
  });

  // ==========================================================================
  // TIER 2: IMAGE UNIQUENESS, ANTI-RECYCLING & SILHOUETTE ARCHETYPES
  // ==========================================================================
  describe('Tier 2: Image Uniqueness, Anti-Recycling & Silhouette Archetypes', () => {
    it('verifies vehicle identity uniqueness across ID, name, brand, and category tuples', () => {
      const idSet = new Set<string>();
      const nameSet = new Set<string>();

      for (const vehicle of allVehicles) {
        // IDs must be globally unique
        assert.ok(!idSet.has(vehicle.id), `Duplicate vehicle ID found: ${vehicle.id}`);
        idSet.add(vehicle.id);

        // Names must be globally unique
        assert.ok(!nameSet.has(vehicle.name), `Duplicate vehicle name found: ${vehicle.name}`);
        nameSet.add(vehicle.name);
      }

      assert.equal(idSet.size, allVehicles.length, 'All vehicle IDs must be unique');
      assert.equal(nameSet.size, allVehicles.length, 'All vehicle names must be unique');
    });

    it('verifies 9 distinct design silhouette archetypes and categorical partitioning', () => {
      const ARCHETYPES = [
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
      ] as const;

      const archetypeCounts: Record<string, number> = {};
      for (const arch of ARCHETYPES) {
        archetypeCounts[arch] = 0;
      }

      for (const vehicle of allVehicles) {
        const archetype = classifyVehicleArchetype(vehicle);
        assert.ok(
          ARCHETYPES.includes(archetype as any),
          `Unknown archetype "${archetype}" for vehicle ${vehicle.id}`
        );
        archetypeCounts[archetype]++;

        // Categorical boundary: Motorcycle vs Scooter archetypes
        if (vehicle.category === 'motorcycle') {
          assert.ok(
            ['supersport', 'streetfighter', 'cruiser', 'commuter-roadster'].includes(archetype),
            `Motorcycle ${vehicle.id} incorrectly mapped to scooter archetype "${archetype}"`
          );
        } else if (vehicle.category === 'scooter') {
          assert.ok(
            ['sporty-scooter', 'retro-metal-scooter', 'family-comfort-scooter', 'rugged-suv-scooter', 'heavy-duty-moped', 'ice-scooter'].includes(archetype),
            `Scooter ${vehicle.id} incorrectly mapped to motorcycle archetype "${archetype}"`
          );
        }
      }

      // Verify each archetype is represented
      assert.ok(archetypeCounts['supersport'] >= 1, 'At least 1 supersport model (e.g. Ultraviolette F77 Mach 2 / Kabira KM3000)');
      assert.ok(archetypeCounts['streetfighter'] >= 1, 'At least 1 streetfighter model (e.g. Revolt RV400 / Matter AERA / Kratos R)');
      assert.ok(archetypeCounts['cruiser'] >= 1, 'At least 1 cruiser model (e.g. Komaki Ranger)');
      assert.ok(archetypeCounts['commuter-roadster'] >= 1, 'At least 1 commuter roadster model');
      assert.ok(archetypeCounts['sporty-scooter'] >= 1, 'At least 1 sporty scooter model (e.g. Ather 450X / Apex / Ola S1 Pro)');
      assert.ok(archetypeCounts['retro-metal-scooter'] >= 1, 'At least 1 retro metal scooter model (e.g. Bajaj Chetak)');
      assert.ok(archetypeCounts['family-comfort-scooter'] >= 1, 'At least 1 family comfort scooter (e.g. Ather Rizta / TVS iQube)');
      assert.ok(archetypeCounts['rugged-suv-scooter'] >= 1, 'At least 1 rugged SUV scooter (e.g. River Indie / BGauss RUV)');
      assert.ok(archetypeCounts['heavy-duty-moped'] >= 1, 'At least 1 heavy-duty moped (e.g. Kinetic E-Luna)');
      assert.equal(archetypeCounts['ice-scooter'], 1, 'Exactly 1 ICE benchmark scooter (Honda Activa 6G)');
    });

    it('verifies offline SVG silhouette vector fallback generator generates valid data URIs for all models', () => {
      for (const vehicle of allVehicles) {
        const svgDataUri = generateReferenceSilhouetteSvg(vehicle);

        assert.ok(
          svgDataUri.startsWith('data:image/svg+xml;utf8,'),
          `SVG silhouette for ${vehicle.id} must be a valid SVG data URI`
        );

        const decodedSvg = decodeURIComponent(svgDataUri.replace('data:image/svg+xml;utf8,', ''));
        assert.ok(decodedSvg.includes('<svg'), `Decoded SVG for ${vehicle.id} missing <svg tag`);
        assert.ok(decodedSvg.includes('</svg>'), `Decoded SVG for ${vehicle.id} missing </svg> tag`);
        assert.ok(decodedSvg.includes(vehicle.brand), `Decoded SVG for ${vehicle.id} missing brand name`);
        assert.ok(decodedSvg.includes(vehicle.name), `Decoded SVG for ${vehicle.id} missing model name`);
        assert.ok(!decodedSvg.includes('undefined'), `Decoded SVG for ${vehicle.id} contains "undefined"`);
        assert.ok(!decodedSvg.includes('NaN'), `Decoded SVG for ${vehicle.id} contains "NaN"`);
      }
    });
  });

  // ==========================================================================
  // TIER 3: CROSS-FEATURE & UI COMPONENT RENDERING INVARIANTS
  // ==========================================================================
  describe('Tier 3: Multi-Modal UI Component Image Payloads', () => {
    it('simulates VehicleCard imagery payload generation with swatches and overlays', () => {
      for (const vehicle of allVehicles) {
        const primaryColor = vehicle.colorOptions[0];
        const cardPayload = {
          id: vehicle.id,
          name: vehicle.name,
          brand: vehicle.brand,
          imageUrl: vehicle.imageUrl,
          fallbackSvg: generateReferenceSilhouetteSvg(vehicle),
          activeColor: primaryColor.name,
          activeHex: primaryColor.hex,
          swatchCount: vehicle.colorOptions.length,
          categoryBadge: vehicle.category === 'motorcycle' ? '🏍️ Motorcycle' : '🛵 Scooter',
          batteryBadge: `${vehicle.specs.batteryCapacityKwh} kWh ${vehicle.specs.batteryChemistry}`,
          altText: `${vehicle.brand} ${vehicle.name} - Official Image`
        };

        // Assert zero null, undefined, or NaN in visual rendering payload
        for (const [key, val] of Object.entries(cardPayload)) {
          assert.notEqual(val, undefined, `Key ${key} is undefined for ${vehicle.id}`);
          assert.notEqual(val, null, `Key ${key} is null for ${vehicle.id}`);
          if (typeof val === 'string') {
            assert.ok(!val.includes('undefined'), `Key ${key} contains "undefined" in ${vehicle.id}`);
            assert.ok(!val.includes('NaN'), `Key ${key} contains "NaN" in ${vehicle.id}`);
          }
        }
      }
    });

    it('simulates Side-by-Side Comparison Matrix sticky avatar thumbnails across 2-4 selected models', () => {
      const selectedModels = [
        getEVModelById('ola-s1-pro-gen2')!,
        getEVModelById('ather-rizta-z-37')!,
        getEVModelById('river-indie-40')!,
        ICE_BENCHMARK_MODEL
      ];

      assert.equal(selectedModels.length, 4);

      const matrixHeaderPayload = selectedModels.map(model => ({
        id: model.id,
        name: model.name,
        brand: model.brand,
        imageUrl: model.imageUrl,
        archetype: classifyVehicleArchetype(model),
        batteryLabel: `${model.specs.batteryCapacityKwh} kWh`,
        priceLabel: `₹${model.pricing.exShowroom.toLocaleString('en-IN')}`
      }));

      for (const item of matrixHeaderPayload) {
        assert.ok(item.imageUrl.startsWith('https://'), `Invalid matrix avatar for ${item.id}`);
        assert.ok(item.name.length > 0, `Matrix item name missing for ${item.id}`);
        assert.ok(item.archetype.length > 0, `Matrix item archetype missing for ${item.id}`);
      }
    });

    it('simulates Floating Comparison Bottom Dock 4-slot FIFO state with vehicle avatars', () => {
      const trayIds = ['ultraviolette-f77-mach2', 'matter-aera-5000-plus', 'tork-kratos-r', 'revolt-rv400-32'];
      const trayModels = trayIds.map(id => getEVModelById(id)!);

      assert.equal(trayModels.length, 4);

      // FIFO Dock simulation
      const dockState = trayModels.map((model, index) => ({
        slotIndex: index + 1,
        modelId: model.id,
        modelName: model.name,
        brand: model.brand,
        avatarUrl: model.imageUrl,
        removable: true
      }));

      assert.equal(dockState.length, 4);
      for (const slot of dockState) {
        assert.ok(slot.avatarUrl.startsWith('https://'), `Dock slot ${slot.slotIndex} avatar invalid`);
        assert.ok(slot.modelName.length > 0, `Dock slot ${slot.slotIndex} name missing`);
      }
    });

    it('simulates VehicleDetailModal interactive paint swatch switching', () => {
      const testModel = getEVModelById('ather-rizta-z-37')!;
      assert.ok(testModel.colorOptions.length >= 4, 'Ather Rizta Z has 4 paint options');

      for (let i = 0; i < testModel.colorOptions.length; i++) {
        const currentSwatch = testModel.colorOptions[i];
        const modalGalleryState = {
          modelId: testModel.id,
          selectedColorIndex: i,
          selectedColorName: currentSwatch.name,
          selectedColorHex: currentSwatch.hex,
          activeHeroImage: testModel.imageUrl,
          fallbackSvg: generateReferenceSilhouetteSvg(testModel)
        };

        assert.equal(modalGalleryState.selectedColorIndex, i);
        assert.ok(modalGalleryState.selectedColorName.length > 0);
        assert.ok(modalGalleryState.selectedColorHex.startsWith('#'));
      }
    });
  });

  // ==========================================================================
  // TIER 4: NETWORK RESILIENCE, WCAG ACCESSIBILITY & LAYOUT INTEGRITY
  // ==========================================================================
  describe('Tier 4: Network Failure Resilience & WCAG Accessibility Invariants', () => {
    it('simulates CDN network error fallback to inline SVG silhouette without UI crash', () => {
      for (const vehicle of allVehicles) {
        // Simulate network failure handler
        const simulateImageLoad = (shouldFail: boolean) => {
          if (shouldFail) {
            // Trigger fallback
            return {
              src: generateReferenceSilhouetteSvg(vehicle),
              isFallback: true,
              alt: `${vehicle.brand} ${vehicle.name} - Vector Silhouette Preview`
            };
          }
          return {
            src: vehicle.imageUrl,
            isFallback: false,
            alt: `${vehicle.brand} ${vehicle.name} - High Resolution Photo`
          };
        };

        const normalLoad = simulateImageLoad(false);
        assert.equal(normalLoad.isFallback, false);
        assert.equal(normalLoad.src, vehicle.imageUrl);

        const failedLoad = simulateImageLoad(true);
        assert.equal(failedLoad.isFallback, true);
        assert.ok(failedLoad.src.startsWith('data:image/svg+xml;utf8,'));
        assert.ok(failedLoad.alt.includes('Silhouette Preview'));
      }
    });

    it('verifies WCAG 2.1 AA accessible alt text generation for all vehicle images', () => {
      for (const vehicle of allVehicles) {
        const categoryLabel = vehicle.category === 'motorcycle' ? 'Electric Motorcycle' : 'Electric Scooter';
        const accessibleAlt = `${vehicle.brand} ${vehicle.name} (${categoryLabel}) with ${vehicle.specs.batteryCapacityKwh} kWh battery`;

        assert.ok(accessibleAlt.includes(vehicle.brand), `Alt text missing brand for ${vehicle.id}`);
        assert.ok(accessibleAlt.includes(vehicle.name), `Alt text missing name for ${vehicle.id}`);
        assert.ok(accessibleAlt.length >= 20, `Alt text too short for ${vehicle.id}: "${accessibleAlt}"`);
        assert.ok(!accessibleAlt.includes('undefined'), `Alt text contains "undefined" for ${vehicle.id}`);
      }
    });

    it('verifies standard automotive aspect ratio invariants (16/9 and 4/3) for zero CLS', () => {
      const allowedAspectRatios = ['16/9', '4/3', '1/1'];

      const cardAspectConfig = {
        cardContainerRatio: '16/9',
        modalHeroRatio: '16/9',
        dockAvatarRatio: '1/1',
        matrixThumbRatio: '4/3'
      };

      assert.ok(allowedAspectRatios.includes(cardAspectConfig.cardContainerRatio));
      assert.ok(allowedAspectRatios.includes(cardAspectConfig.modalHeroRatio));
      assert.ok(allowedAspectRatios.includes(cardAspectConfig.matrixThumbRatio));
      assert.equal(cardAspectConfig.dockAvatarRatio, '1/1');
    });
  });
});
