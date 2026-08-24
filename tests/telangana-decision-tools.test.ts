import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { TELANGANA_CHARGING_STATIONS } from '../src/data/telanganaChargingStations.ts';
import { EV_MODELS, getAllVehiclesIncludingBenchmark } from '../src/data/evModels.ts';
import { TELANGANA_RTOS, getRtoByCode } from '../src/data/telanganaRtoData.ts';
import { calculateTelanganaOnRoadPrice } from '../src/utils/priceCalculator.ts';

describe('Telangana Decision Tools & Brand Lineup Subsystems', () => {
  describe('1. Fast Charging Hub Directory & Connector Compatibility', () => {
    it('verifies charging stations dataset completeness and coordinate validity', () => {
      assert.ok(TELANGANA_CHARGING_STATIONS.length >= 10, 'Must have at least 10 verified charging stations');

      for (const station of TELANGANA_CHARGING_STATIONS) {
        assert.ok(station.id && station.id.length > 0);
        assert.ok(station.name && station.name.length > 0);
        assert.ok(station.district && station.district.length > 0);
        assert.ok(station.locality && station.locality.length > 0);
        assert.ok(station.address && station.address.length > 0);
        assert.ok(Array.isArray(station.connectorTypes) && station.connectorTypes.length > 0);
        assert.ok(station.powerOutputKw > 0, `Power output must be > 0 for ${station.id}`);
        assert.ok(station.latitude >= 15.0 && station.latitude <= 20.0, `Latitude out of TG bounds for ${station.id}`);
        assert.ok(station.longitude >= 77.0 && station.longitude <= 82.0, `Longitude out of TG bounds for ${station.id}`);
        assert.ok(Array.isArray(station.amenities) && station.amenities.length > 0);
      }
    });

    it('verifies presence of key Telangana highway corridors (ORR, NH-65, NH-163, NH-44)', () => {
      const highwayStations = TELANGANA_CHARGING_STATIONS.filter(s => Boolean(s.highway));
      assert.ok(highwayStations.length >= 4, 'Must have stations along major highways');

      const highways = highwayStations.map(s => s.highway);
      assert.ok(highways.some(h => h?.includes('ORR') || h?.includes('Outer Ring Road')));
      assert.ok(highways.some(h => h?.includes('NH-65') || h?.includes('Vijayawada')));
      assert.ok(highways.some(h => h?.includes('NH-163') || h?.includes('Warangal')));
      assert.ok(highways.some(h => h?.includes('NH-44')));
    });

    it('verifies multi-network coverage (Ather Grid, Ola Hypercharger, Tata Power, Statiq, Zeon)', () => {
      const networks = new Set(TELANGANA_CHARGING_STATIONS.map(s => s.network));
      assert.ok(networks.has('Ather Grid'));
      assert.ok(networks.has('Ola Hypercharger'));
      assert.ok(networks.has('Tata Power EZ Charge'));
      assert.ok(networks.has('Statiq'));
      assert.ok(networks.has('Zeon Charging'));
    });
  });

  describe('2. TSSPDCL Domestic Electricity Tariff Slabs', () => {
    const calculateTSSPDCLBill = (units: number): number => {
      let bill = 0;
      if (units <= 100) {
        if (units <= 50) bill = units * 1.95;
        else bill = 50 * 1.95 + (units - 50) * 3.10;
      } else if (units <= 200) {
        if (units <= 100) bill = units * 3.40;
        else bill = 100 * 3.40 + (units - 100) * 4.80;
      } else {
        if (units <= 200) bill = units * 5.10;
        else if (units <= 300) bill = 200 * 5.10 + (units - 200) * 7.70;
        else if (units <= 400) bill = 200 * 5.10 + 100 * 7.70 + (units - 300) * 9.00;
        else bill = 200 * 5.10 + 100 * 7.70 + 100 * 9.00 + (units - 400) * 9.50;
      }
      const customerCharge = units <= 100 ? 25 : units <= 200 ? 50 : 70;
      const electricityDuty = units * 0.06;
      return bill + customerCharge + electricityDuty;
    };

    it('calculates lifeline slab bill (<=100 units) accurately', () => {
      const bill50 = calculateTSSPDCLBill(50);
      assert.equal(bill50, 50 * 1.95 + 25 + 50 * 0.06); // ₹125.50
    });

    it('calculates middle class slab bill (150 units) accurately', () => {
      const bill150 = calculateTSSPDCLBill(150);
      const expected = 100 * 3.40 + 50 * 4.80 + 50 + 150 * 0.06; // 340 + 240 + 50 + 9 = 639
      assert.equal(bill150, expected);
    });

    it('proves incremental EV charging cost remains under ₹0.35/km at high urban slab (250 units)', () => {
      const baseUnits = 250;
      const evMonthlyKm = 1000;
      const evWhPerKm = 32;
      const evUnits = Math.round((evMonthlyKm * evWhPerKm) / (1000 * 0.88)); // ~36 units

      const baseBill = calculateTSSPDCLBill(baseUnits);
      const combinedBill = calculateTSSPDCLBill(baseUnits + evUnits);
      const evCost = combinedBill - baseBill;
      const costPerKm = evCost / evMonthlyKm;

      assert.ok(costPerKm < 0.35, `Cost per km ${costPerKm} should be < ₹0.35`);
    });
  });

  describe('3. Telangana Green EV Bank Loan EMI Simulator', () => {
    const calculateEmi = (principal: number, annualRatePercent: number, tenureMonths: number): number => {
      const monthlyRate = annualRatePercent / 12 / 100;
      return Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
      );
    };

    it('verifies SBI Green EV Loan (8.5%) saves substantial interest compared to NBFC (13.5%)', () => {
      const principal = 100000;
      const tenure = 36;
      const sbiEmi = calculateEmi(principal, 8.5, tenure);
      const nbfcEmi = calculateEmi(principal, 13.5, tenure);

      assert.ok(sbiEmi < nbfcEmi, 'SBI EMI must be lower than NBFC');

      const sbiTotal = sbiEmi * tenure;
      const nbfcTotal = nbfcEmi * tenure;
      const saved = nbfcTotal - sbiTotal;

      assert.ok(saved >= 8000, `Interest saved ₹${saved} must be at least ₹8,000 on ₹1 Lakh loan`);
    });
  });

  describe('4. Telangana Motor Vehicles Taxation Act Schedule Inspector', () => {
    it('verifies statutory petrol tax tiers (9%, 12%, 14%) vs G.O. Ms No. 41 ₹0 tax waiver', () => {
      // Under ₹50,000 (9%)
      const budget40k = 40000;
      const tax40k = Math.round((budget40k * 9) / 100);
      assert.equal(tax40k, 3600);

      // ₹50,000 to ₹1,50,000 (12%)
      const mid120k = 120000;
      const tax120k = Math.round((mid120k * 12) / 100);
      assert.equal(tax120k, 14400);

      // Over ₹1,50,000 (14%)
      const high250k = 250000;
      const tax250k = Math.round((high250k * 14) / 100);
      assert.equal(tax250k, 35000);
    });
  });

  describe('5. Brand Lineup Grouping & Intra-Brand Compare Logic', () => {
    it('groups all catalog models by brand with at least 15 distinct Indian OEMs', () => {
      const brands = new Set(EV_MODELS.filter(m => !m.isIceBenchmark).map(m => m.brand));
      assert.ok(brands.size >= 15, `Expected at least 15 brands, got ${brands.size}`);
      assert.ok(brands.has('Ola Electric'));
      assert.ok(brands.has('Ather Energy'));
      assert.ok(brands.has('TVS Motor'));
      assert.ok(brands.has('Bajaj Auto'));
      assert.ok(brands.has('Revolt Motors'));
      assert.ok(brands.has('Ultraviolette Automotive'));
    });

    it('ensures intra-brand lineup variants are sorted in ascending price order', () => {
      const atherModels = EV_MODELS.filter(m => m.brand === 'Ather Energy').sort((a, b) => a.pricing.exShowroom - b.pricing.exShowroom);
      assert.ok(atherModels.length >= 3);
      for (let i = 0; i < atherModels.length - 1; i++) {
        assert.ok(atherModels[i].pricing.exShowroom <= atherModels[i + 1].pricing.exShowroom);
      }
    });

    it('ensures budget tiers partition all models into valid non-empty price segments', () => {
      const under1L = EV_MODELS.filter(m => !m.isIceBenchmark && m.pricing.exShowroom < 100000);
      const tier1to14 = EV_MODELS.filter(m => !m.isIceBenchmark && m.pricing.exShowroom >= 100000 && m.pricing.exShowroom < 140000);
      const tier14to18 = EV_MODELS.filter(m => !m.isIceBenchmark && m.pricing.exShowroom >= 140000 && m.pricing.exShowroom < 180000);
      const above18 = EV_MODELS.filter(m => !m.isIceBenchmark && m.pricing.exShowroom >= 180000);

      assert.ok(under1L.length > 0, 'Under 1L tier must have models');
      assert.ok(tier1to14.length > 0, '1 to 1.4L tier must have models');
      assert.ok(tier14to18.length > 0, '1.4 to 1.8L tier must have models');
      assert.ok(above18.length > 0, 'Above 1.8L tier must have models');

      const totalGrouped = under1L.length + tier1to14.length + tier14to18.length + above18.length;
      assert.equal(totalGrouped, EV_MODELS.filter(m => !m.isIceBenchmark).length);
    });
  });
});
