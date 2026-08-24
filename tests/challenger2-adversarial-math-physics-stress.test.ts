import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  EV_MODELS,
  getEVModels,
  getAllVehiclesIncludingBenchmark,
  getEVModelById,
  getEVModelsByCategory,
  getEVModelsByBrand,
  ICE_BENCHMARK_MODEL
} from "../src/data/evModels.ts";

import {
  TELANGANA_RTOS,
  getAllRtos,
  getRtoByCode,
  TELANGANA_EV_POLICY_HIGHLIGHTS,
  TELANGANA_CURRENT_PETROL_PRICE,
  TELANGANA_AVG_ELECTRICITY_RATE,
  TSSPDCL_DOMESTIC_TARIFF_SLABS
} from "../src/data/telanganaRtoData.ts";

import {
  calculateTelanganaOnRoadPrice,
  calculate5YearInsurance,
  calculatePmEdriveSubsidy,
  calculateRoadTaxSavings,
  formatINR,
  formatLakhs,
  IRDAI_EV_TP_5YR_RATES
} from "../src/utils/priceCalculator.ts";

import {
  calculateSavings,
  calculate5YearTCO,
  calculatePaybackPeriod,
  calculateCarbonOffset,
  FINANCIAL_BENCHMARKS
} from "../src/utils/savingsCalculator.ts";

import {
  simulateRange,
  simulateRealWorldRange
} from "../src/utils/rangeSimulator.ts";

import {
  calculateRecommendations
} from "../src/utils/recommendationEngine.ts";

import type {
  WizardAnswers,
  EVModel
} from "../src/types/ev.ts";

describe("CHALLENGER 2: Adversarial Stress Test Suite", () => {
  const allEvs = getEVModels();
  const allRtos = getAllRtos();
  const allVehiclesWithBenchmark = getAllVehiclesIncludingBenchmark();

  // =========================================================================
  // TASK 2.1: On-road pricing across all 38 RTOs (TG-01 through TG-38)
  // =========================================================================
  describe("Engine 1: On-Road Pricing Invariants & 38-RTO Matrix Stress Testing", () => {
    it("verifies dataset sizes: 40 authentic EV models and exactly 38 RTOs", () => {
      assert.strictEqual(allEvs.length, 40, "Should have exactly 40 authentic EV models");
      assert.strictEqual(allRtos.length, 38, "Should have exactly 38 official Telangana RTOs");
      assert.strictEqual(allVehiclesWithBenchmark.length, 41, "Should have 41 total vehicles including Activa 6G");
      
      const rtoCodes = allRtos.map(r => r.rtoCode);
      for (let i = 1; i <= 38; i++) {
        const expectedCode = "TG-" + String(i).padStart(2, "0");
        assert.ok(rtoCodes.includes(expectedCode), "RTO list missing code: " + expectedCode);
      }
    });

    it("evaluates all 1,520 combinations (40 models * 38 RTOs) for strict statutory tax exemptions", () => {
      let calculationCount = 0;

      for (const model of allEvs) {
        for (const rto of allRtos) {
          const pricing = calculateTelanganaOnRoadPrice(model, rto.rtoCode);
          calculationCount++;

          // 1. Zero Road Tax & Reg Fee Invariants for EVs (G.O. Ms No. 41)
          assert.strictEqual(pricing.stateRoadTaxPayable, 0, model.name + " in " + rto.rtoCode + " must pay 0 road tax");
          assert.strictEqual(pricing.stateRoadTax, 0);
          assert.strictEqual(pricing.registrationFeePayable, 0, model.name + " in " + rto.rtoCode + " must pay 0 registration fee");
          assert.strictEqual(pricing.registrationAndSmartCardFee, 0);

          // 2. Standard ICE Tax calculation (12% baseline)
          const expectedTaxSavings = Math.round(model.pricing.exShowroom * 0.12);
          assert.strictEqual(pricing.stateRoadTaxStandardPetrol, expectedTaxSavings);
          assert.strictEqual(pricing.stateRoadTaxSavings, expectedTaxSavings);
          assert.strictEqual(pricing.registrationFeeSavings, 785);

          // 3. Central Subsidy logic
          const expectedSubsidy = model.pricing.pmEdriveSubsidy !== undefined
            ? model.pricing.pmEdriveSubsidy
            : calculatePmEdriveSubsidy(model.specs.batteryCapacityKwh, model.pricing.exShowroom);
          assert.strictEqual(pricing.pmEdriveSubsidy, expectedSubsidy);

          // 4. Net Price Invariant: must be finite, positive, and non-NaN
          assert.ok(pricing.totalTelanganaOnRoadPrice > 0, model.name + " total price must be > 0");
          assert.ok(Number.isFinite(pricing.totalTelanganaOnRoadPrice), model.name + " total price must be finite");
          assert.ok(!Number.isNaN(pricing.totalTelanganaOnRoadPrice), model.name + " total price must not be NaN");
          assert.strictEqual(pricing.totalTelanganaOnRoadPrice, pricing.netTelanganaOnRoadPrice);

          // 5. Upfront Savings Invariant
          const expectedTotalSavings = expectedTaxSavings + 785 + expectedSubsidy;
          assert.strictEqual(pricing.totalUpfrontSavings, expectedTotalSavings);
          assert.strictEqual(pricing.savingsFromTelanganaPolicy, expectedTaxSavings + 785);

          // 6. RTO District name resolution
          assert.ok(pricing.districtName.includes(rto.rtoCode));
          assert.strictEqual(pricing.rtoCode, rto.rtoCode);
        }
      }

      assert.strictEqual(calculationCount, 40 * 38, "Must execute exactly 1,520 pricing calculations");
    });

    it("verifies Honda Activa 6G ICE benchmark pays standard statutory fees without EV exemptions", () => {
      const activa = ICE_BENCHMARK_MODEL;
      assert.ok(activa, "Honda Activa 6G benchmark must exist");

      const pricing = calculateTelanganaOnRoadPrice(activa, "TG-09");
      const expectedTax = Math.round(activa.pricing.exShowroom * 0.12);
      
      assert.strictEqual(pricing.stateRoadTaxPayable, expectedTax, "Activa must pay 12% road tax");
      assert.strictEqual(pricing.registrationFeePayable, 785, "Activa must pay 785 registration fee");
      assert.strictEqual(pricing.pmEdriveSubsidy, 0, "Activa receives 0 subsidy");
      assert.strictEqual(pricing.savingsFromTelanganaPolicy, 0, "Activa has 0 policy savings");
      assert.strictEqual(pricing.totalUpfrontSavings, 0, "Activa has 0 total savings");
    });

    it("stress tests RTO code normalizers and fallback behavior", () => {
      const ather = getEVModelById("ather-450x-gen3-37")!;
      assert.ok(ather, "Ather 450X model must exist");
      
      // Case insensitivity and whitespace
      const resLower = calculateTelanganaOnRoadPrice(ather, "tg-07");
      assert.strictEqual(resLower.rtoCode, "tg-07");
      assert.ok(resLower.districtName.includes("Ranga Reddy"));

      const resTsLegacy = calculateTelanganaOnRoadPrice(ather, "TS-08");
      assert.ok(resTsLegacy.districtName.includes("Medchal"));

      // Unknown fallback
      const resUnknown = calculateTelanganaOnRoadPrice(ather, "TG-99");
      assert.strictEqual(resUnknown.districtName, "Hyderabad Central (TG-09)");
    });

    it("stress tests custom discount and interactive options", () => {
      const vida = getEVModelById("hero-vida-v1-pro")!;
      assert.ok(vida, "Hero Vida V1 Pro model must exist");
      
      // Standard calculation
      const standard = calculateTelanganaOnRoadPrice(vida);
      
      // With 15,000 discount, warranty (+3000), accessories (+2000), without charger
      const customized = calculateTelanganaOnRoadPrice(vida, {
        customDiscount: 15000,
        includeExtendedWarranty: true,
        includeAccessories: true,
        includeCharger: false
      });

      assert.strictEqual(customized.customDiscount, 15000);
      assert.strictEqual(customized.extendedWarrantyCost, 3000);
      assert.strictEqual(customized.accessoriesCost, 2000);
      assert.strictEqual(customized.chargerCost, 0);
      assert.strictEqual(customized.totalTelanganaOnRoadPrice, standard.totalTelanganaOnRoadPrice - 15000 + 3000 + 2000);

      // Oversized discount clamping
      const massiveDiscount = calculateTelanganaOnRoadPrice(vida, { customDiscount: 999999 });
      assert.strictEqual(massiveDiscount.netExShowroom, 0);
      assert.ok(massiveDiscount.totalTelanganaOnRoadPrice > 0, "Insurance and statutory fees still apply");
    });
  });

  // =========================================================================
  // TASK 2.2: TCO & Payback engine across boundary inputs
  // =========================================================================
  describe("Engine 2: TCO & ROI Payback Mathematical Boundary Stress Testing", () => {
    const defaultModel = getEVModelById("ather-rizta-z-37")!;

    it("handles 0 km daily commute without NaN or division by zero", () => {
      assert.ok(defaultModel, "Ather Rizta model must exist");
      const res = calculateSavings(defaultModel, { dailyKm: 0 });
      assert.ok(!Number.isNaN(res.monthlySavings), "Monthly savings must not be NaN");
      assert.ok(!Number.isNaN(res.annualSavings), "Annual savings must not be NaN");
      assert.ok(!Number.isNaN(res.paybackPeriodMonths), "Payback months must not be NaN");
      assert.strictEqual(res.monthlyKm, 35 * 26, "Fallback default distance applied");
    });

    it("handles extreme 1,000 km daily commute without overflow or precision loss", () => {
      const res = calculateSavings(defaultModel, { dailyKm: 1000, daysPerMonth: 30 });
      assert.strictEqual(res.monthlyKm, 30000);
      assert.strictEqual(res.annualKm, 360000);
      assert.ok(res.monthlySavings > 50000, "Extreme distance generates high monthly savings");
      assert.ok(res.tco.netTCOSavings > 1000000, "5-yr TCO savings scale proportionately");
      assert.ok(Number.isFinite(res.tco.netTCOSavings));
      assert.ok(!Number.isNaN(res.tco.netTCOSavings));
    });

    it("stress tests electricity rates from 0.50 to 50.00/kWh", () => {
      const lowTariff = calculateSavings(defaultModel, { electricityCostPerKwh: 0.50 });
      const normalTariff = calculateSavings(defaultModel, { electricityCostPerKwh: 7.50 });
      const highTariff = calculateSavings(defaultModel, { electricityCostPerKwh: 50.00 });

      assert.ok(lowTariff.evPowerCostPerKm < normalTariff.evPowerCostPerKm);
      assert.ok(normalTariff.evPowerCostPerKm < highTariff.evPowerCostPerKm);
      assert.ok(lowTariff.monthlySavings > normalTariff.monthlySavings);
      assert.ok(normalTariff.monthlySavings > highTariff.monthlySavings);
    });

    it("stress tests petrol prices from 20/L to 250/L and mileage from 10 to 100 km/L", () => {
      const cheapPetrol = calculateSavings(defaultModel, { petrolPricePerLiter: 50 });
      const expensivePetrol = calculateSavings(defaultModel, { petrolPricePerLiter: 200 });
      assert.ok(cheapPetrol.monthlyPetrolCost < expensivePetrol.monthlyPetrolCost);

      const gasGuzzler = calculateSavings(defaultModel, { petrolMileageKmpl: 15 });
      const hyperMiler = calculateSavings(defaultModel, { petrolMileageKmpl: 80 });
      assert.ok(gasGuzzler.petrolFuelCostPerKm > hyperMiler.petrolFuelCostPerKm);
    });

    it("verifies negative payback, immediate payback, and boundary payback strings", () => {
      // 1. EV Cheaper Upfront (e.g. Kinetic Green E-Luna at ~81k vs Activa 6G at ~100.6k)
      const eLuna = getEVModelById("kinetic-green-e-luna")!;
      assert.ok(eLuna, "E-Luna must exist");
      const eLunaSavings = calculateSavings(eLuna);
      assert.strictEqual(eLunaSavings.upfrontPriceDifference, 0);
      assert.strictEqual(eLunaSavings.paybackPeriodMonths, 0);
      assert.strictEqual(eLunaSavings.paybackFormatted, "Immediate (Cheaper Upfront)");

      // 2. Direct unit test of calculatePaybackPeriod
      const immediate = calculatePaybackPeriod(-5000, 2000);
      assert.strictEqual(immediate.formatted, "Immediate (Cheaper Upfront)");

      const zeroDiff = calculatePaybackPeriod(0, 2000);
      assert.strictEqual(zeroDiff.formatted, "Immediate (Cheaper Upfront)");

      const noSavings = calculatePaybackPeriod(50000, 0);
      assert.strictEqual(noSavings.formatted, "No Payback");
      assert.strictEqual(noSavings.months, 999);

      const negativeSavings = calculatePaybackPeriod(50000, -500);
      assert.strictEqual(negativeSavings.formatted, "No Payback");

      const shortPayback = calculatePaybackPeriod(24000, 3000);
      assert.strictEqual(shortPayback.formatted, "8 Months");

      const exactOneYear = calculatePaybackPeriod(36000, 3000);
      assert.strictEqual(exactOneYear.formatted, "1 Years");

      const multiYear = calculatePaybackPeriod(50000, 2000);
      assert.strictEqual(multiYear.formatted, "2 Yr 1 Mo");
    });

    it("empirically verifies 5-Year TCO balance equation across all 40 EV models", () => {
      for (const model of allEvs) {
        const savings = calculateSavings(model);
        const tco = savings.tco;

        // Petrol TCO math
        const expectedPetrolGross = tco.petrolInitialOnRoad + tco.petrolFuelCostTotal + tco.petrolMaintenanceTotal + tco.petrolInsuranceRenewals;
        assert.strictEqual(tco.petrolGrossTCO, expectedPetrolGross);
        assert.strictEqual(tco.petrolNetTCO, expectedPetrolGross - tco.petrolResidualResaleValue);

        // EV TCO math
        const expectedEvGross = tco.evInitialOnRoad + tco.evElectricityCostTotal + tco.evMaintenanceTotal + tco.evInsuranceRenewals;
        assert.strictEqual(tco.evGrossTCO, expectedEvGross);
        assert.strictEqual(tco.evNetTCO, expectedEvGross - tco.evResidualResaleValue);

        // Net Savings
        assert.strictEqual(tco.netTCOSavings, tco.petrolNetTCO - tco.evNetTCO);
      }
    });

    it("verifies environmental carbon offset and teak tree equivalence across distance ranges", () => {
      const c100 = calculateCarbonOffset(100);
      assert.strictEqual(c100.petrolCo2GramsPerKm, 51.3);
      assert.strictEqual(c100.evCo2GramsPerKm, 24.54);
      assert.strictEqual(c100.netCo2ReductionGramsPerKm, 26.76);
      assert.strictEqual(c100.monthlyCo2SavedKg, 3);
      assert.strictEqual(c100.annualCo2SavedKg, 32);
      assert.strictEqual(c100.fiveYearCo2SavedKg, 161);
      assert.strictEqual(c100.equivalentTeakTrees, 7);

      const c0 = calculateCarbonOffset(0);
      assert.strictEqual(c0.fiveYearCo2SavedKg, 0);
      assert.strictEqual(c0.equivalentTeakTrees, 1, "Minimum 1 tree clamp");
    });
  });

  // =========================================================================
  // TASK 2.3: Range physics engine under extreme parameters
  // =========================================================================
  describe("Engine 3: Range Physics Multiplicative Engine Stress Testing", () => {
    it("adversarially tests extreme worst-case physics scenario across all 40 EV models", () => {
      // Worst case: Hyper mode + Heavy luggage + Fast Highway + Telangana Summer Heat (45°C) + Flyovers/Hills
      for (const model of allEvs) {
        const extremeWorst = simulateRange(model, {
          mode: "hyper",
          payload: "heavy_luggage",
          traffic: "highway",
          temperature: "telangana_heat",
          terrain: "hilly",
          commuteDistanceKm: 60
        });

        // 1. Min range clamp invariant
        assert.ok(extremeWorst.estimatedRangeKm >= 10, model.name + " range must never drop below 10 km");
        assert.ok(extremeWorst.estimatedRangeKm < (model.specs.realWorldCityRangeKm || 100), "Worst case must be significantly lower than city range");

        // 2. Multiplier math check
        const isLfp = (model.specs.batteryChemistry || "").toUpperCase().includes("LFP");
        const expectedTempMultiplier = isLfp ? 0.94 : 0.88;
        const expectedCombined = 0.68 * 0.76 * 0.80 * expectedTempMultiplier * 0.90;
        
        assert.strictEqual(extremeWorst.factors.modeMultiplier, 0.68);
        assert.strictEqual(extremeWorst.factors.payloadMultiplier, 0.76);
        assert.strictEqual(extremeWorst.factors.trafficMultiplier, 0.80);
        assert.strictEqual(extremeWorst.factors.temperatureMultiplier, expectedTempMultiplier);
        assert.strictEqual(extremeWorst.factors.terrainMultiplier, 0.90);
        assert.strictEqual(extremeWorst.factors.combinedMultiplier, Math.round(expectedCombined * 1000) / 1000);

        // 3. Specific energy consumption check
        assert.ok(extremeWorst.batteryConsumptionWhPerKm > 0);
        assert.ok(Number.isFinite(extremeWorst.batteryConsumptionWhPerKm));
      }
    });

    it("adversarially tests best-case hypermiling physics scenario across all 40 EV models", () => {
      // Best case: Eco mode + Solo Light + Smooth flow + Ideal 25°C + Flat plains
      for (const model of allEvs) {
        const bestCase = simulateRange(model, {
          mode: "eco",
          payload: "solo_light",
          traffic: "smooth_flow",
          temperature: "ideal",
          terrain: "flat",
          commuteDistanceKm: 25
        });

        const expectedCombined = 1.10 * 1.05 * 1.08 * 1.00 * 1.00; // ~1.2474
        assert.strictEqual(bestCase.factors.combinedMultiplier, Math.round(expectedCombined * 1000) / 1000);
        assert.ok(bestCase.estimatedRangeKm > (model.specs.realWorldCityRangeKm || 100), "Hypermiling must exceed base city range");
      }
    });

    it("strictly compares LFP vs NMC thermal degradation under 45°C Telangana Heat", () => {
      const lfpModel = allEvs.find(m => (m.specs.batteryChemistry || "").toUpperCase().includes("LFP"))!;
      const nmcModel = allEvs.find(m => (m.specs.batteryChemistry || "").toUpperCase().includes("NMC"))!;

      assert.ok(lfpModel, "LFP EV model must exist in catalog");
      assert.ok(nmcModel, "NMC EV model must exist in catalog");

      const lfpSim = simulateRange(lfpModel, { temperature: "telangana_heat" });
      const nmcSim = simulateRange(nmcModel, { temperature: "telangana_heat" });

      assert.strictEqual(lfpSim.factors.temperatureMultiplier, 0.94, "LFP has superior 0.94x thermal multiplier");
      assert.strictEqual(nmcSim.factors.temperatureMultiplier, 0.88, "NMC suffers 0.88x thermal throttling");
    });

    it("evaluates commute feasibility state transitions across 1 km to 300 km sweeps", () => {
      const model = getEVModelById("ola-s1-pro-gen2")!; // ~143 km city range
      assert.ok(model, "Ola S1 Pro Gen 2 must exist");

      const shortCommute = simulateRange(model, { commuteDistanceKm: 20 });
      assert.strictEqual(shortCommute.rechargeFeasibilityStatus, "safe");
      assert.ok(shortCommute.batteryReserveRemainingPercent >= 35);

      const mediumCommute = simulateRange(model, { commuteDistanceKm: 100 });
      assert.strictEqual(mediumCommute.rechargeFeasibilityStatus, "moderate");
      assert.ok(mediumCommute.batteryReserveRemainingPercent < 35 && mediumCommute.batteryReserveRemainingPercent >= 15);

      const extremeCommute = simulateRange(model, { commuteDistanceKm: 135 });
      assert.strictEqual(extremeCommute.rechargeFeasibilityStatus, "critical");
      assert.ok(extremeCommute.batteryReserveRemainingPercent < 15);
    });

    it("tests backward compatibility wrapper simulateRealWorldRange", () => {
      const ather = getEVModelById("ather-450x-gen3-37")!;
      assert.ok(ather, "Ather 450X model must exist");
      const res = simulateRealWorldRange({
        model: ather,
        mode: "sport",
        load: "pillion",
        traffic: "mixed",
        weather: "telangana_heat"
      });

      assert.ok(res.estimatedRangeKm > 0);
      assert.strictEqual(res.factors.modeMultiplier, 0.82);
      assert.strictEqual(res.factors.payloadMultiplier, 0.84);
      assert.strictEqual(res.factors.trafficMultiplier, 0.92);
    });
  });

  // =========================================================================
  // TASK 2.4: Recommendation wizard across all 81 quiz permutations
  // =========================================================================
  describe("Engine 4: Recommendation Wizard 81 & 1,152 Permutation Stress Testing", () => {
    // 3^4 = 81 standard permutations
    const commuteOptions: WizardAnswers["commuteDistance"][] = ["under25", "25to50", "above80"];
    const chargingOptions: WizardAnswers["chargingAccess"][] = ["independentHouse", "apartmentWithSocket", "apartmentNoSocket"];
    const usageOptions: WizardAnswers["primaryUse"][] = ["familyStorage", "officeCommute", "youthPerformance"];
    const budgetOptions: WizardAnswers["budget"][] = ["under1L", "1to1.4L", "above1.8L"];

    it("evaluates all 81 core quiz permutations with zero crashes, zero NaNs, and complete ranking", () => {
      let count = 0;

      for (const commute of commuteOptions) {
        for (const charging of chargingOptions) {
          for (const usage of usageOptions) {
            for (const budget of budgetOptions) {
              count++;
              const answers: WizardAnswers = {
                commuteDistance: commute,
                chargingAccess: charging,
                primaryUse: usage,
                budget: budget,
                preferredCategory: "all"
              };

              const recommendations = calculateRecommendations(answers, allVehiclesWithBenchmark);

              // 1. Output count check: exactly 40 EV recommendations (ICE Activa filtered out)
              assert.strictEqual(recommendations.length, 40, "Permutation #" + count + " must return 40 EV recommendations");

              // 2. Invariant: ICE benchmark is never present
              const hasIce = recommendations.some(r => r.model.isIceBenchmark);
              assert.strictEqual(hasIce, false, "Permutation #" + count + " must never include Honda Activa 6G");

              // 3. Monotonic sorting check
              for (let i = 0; i < recommendations.length - 1; i++) {
                assert.ok(
                  recommendations[i].matchScore >= recommendations[i + 1].matchScore,
                  "Permutation #" + count + ": Sort order violation at index " + i
                );
                assert.strictEqual(recommendations[i].rank, i + 1);
                assert.strictEqual(recommendations[i].categoryRank, i + 1);
              }

              // 4. Field validation on every recommendation item
              for (const rec of recommendations) {
                assert.ok(rec.matchScore >= 0 && rec.matchScore <= 100, "matchScore out of bounds: " + rec.matchScore);
                assert.ok(rec.subScores.commuteScore >= 0 && rec.subScores.commuteScore <= 100);
                assert.ok(rec.subScores.chargingScore >= 0 && rec.subScores.chargingScore <= 100);
                assert.ok(rec.subScores.usageScore >= 0 && rec.subScores.usageScore <= 100);
                assert.ok(rec.subScores.budgetScore >= 0 && rec.subScores.budgetScore <= 100);

                assert.ok(rec.matchingReasons.length > 0, "Matching reasons must not be empty");
                assert.ok(rec.prosAlignment.length >= 0);
                assert.ok(rec.caveatsToConsider.length >= 0);

                assert.ok(["Perfect Match", "Great Match", "Good Match", "Alternative"].includes(rec.fitConfidence));
                assert.ok(["Excellent", "Great", "Good", "Fair"].includes(rec.matchGrade));
              }

              // 5. Special Rule: apartmentNoSocket charging penalty
              if (charging === "apartmentNoSocket") {
                for (const rec of recommendations) {
                  if (rec.model.specs.isRemovableBattery) {
                    assert.strictEqual(rec.subScores.chargingScore, 100, rec.model.name + " removable battery must get 100%");
                  } else {
                    assert.strictEqual(rec.subScores.chargingScore, 20, rec.model.name + " fixed battery must get 20% hard penalty");
                  }
                }
              }
            }
          }
        }
      }

      assert.strictEqual(count, 81, "Must execute exactly 81 core quiz permutations");
    });

    it("evaluates exhaustive 1,152 permutation matrix (4 commute x 4 charging x 6 use x 4 budget x 3 category)", () => {
      const allCommute: WizardAnswers["commuteDistance"][] = ["under25", "25to50", "50to80", "above80"];
      const allCharging: WizardAnswers["chargingAccess"][] = ["independentHouse", "apartmentWithSocket", "apartmentNoSocket", "publicOnly"];
      const allUse: WizardAnswers["primaryUse"][] = ["familyStorage", "officeCommute", "youthPerformance", "youthStyle", "heavyDuty", "budgetEconomy"];
      const allBudget: WizardAnswers["budget"][] = ["under1L", "1to1.4L", "1.4to1.8L", "above1.8L"];
      const allCategory: WizardAnswers["preferredCategory"][] = ["all", "scooter", "motorcycle"];

      let gridCount = 0;
      for (const commute of allCommute) {
        for (const charging of allCharging) {
          for (const usage of allUse) {
            for (const budget of allBudget) {
              for (const category of allCategory) {
                gridCount++;
                const answers: WizardAnswers = {
                  commuteDistance: commute,
                  chargingAccess: charging,
                  primaryUse: usage,
                  budget: budget,
                  preferredCategory: category
                };

                const recs = calculateRecommendations(answers, allVehiclesWithBenchmark);
                assert.strictEqual(recs.length, 40);

                // If category preference is specified, top recommendation should match category
                if (category === "scooter") {
                  assert.strictEqual(recs[0].model.category, "scooter", "Top recommendation for scooter preference should be scooter in grid #" + gridCount);
                } else if (category === "motorcycle") {
                  assert.strictEqual(recs[0].model.category, "motorcycle", "Top recommendation for motorcycle preference should be motorcycle in grid #" + gridCount);
                }
              }
            }
          }
        }
      }

      assert.strictEqual(gridCount, 1152, "Must execute exactly 1,152 expanded grid combinations");
    });

    it("tests malformed, partial, and empty answers resilience", () => {
      // Empty answers
      const emptyRecs = calculateRecommendations({}, allVehiclesWithBenchmark);
      assert.strictEqual(emptyRecs.length, 40);
      assert.ok(emptyRecs[0].matchScore > 0);

      // Alias property names
      const aliasRecs = calculateRecommendations({
        dailyCommute: "50to80",
        usageType: "familyStorage",
        preferredType: "scooter",
        chargingAccess: "independentHouse"
      } as unknown as WizardAnswers, allVehiclesWithBenchmark);
      assert.strictEqual(aliasRecs.length, 40);
      assert.strictEqual(aliasRecs[0].model.category, "scooter");

      // Empty models array
      const zeroRecs = calculateRecommendations({}, []);
      assert.strictEqual(zeroRecs.length, 0);
    });
  });
});
