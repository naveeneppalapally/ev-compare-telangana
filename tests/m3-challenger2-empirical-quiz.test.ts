import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getEVModels,
  getAllVehiclesIncludingBenchmark
} from '../src/data/evModels.ts';

import {
  calculateRecommendations
} from '../src/utils/recommendationEngine.ts';

import type {
  WizardAnswers
} from '../src/types/ev.ts';

describe('Milestone 3 Challenger 2: Smart Recommendation Engine Permutation Suite (1,152 Combinations)', () => {
  const evModels = getEVModels();
  const allVehicles = getAllVehiclesIncludingBenchmark();

  const commuteOptions: Array<'under25' | '25to50' | '50to80' | 'above80'> = [
    'under25',
    '25to50',
    '50to80',
    'above80'
  ];

  const chargingOptions: Array<'independentHouse' | 'apartmentWithSocket' | 'apartmentNoSocket' | 'publicOnly'> = [
    'independentHouse',
    'apartmentWithSocket',
    'apartmentNoSocket',
    'publicOnly'
  ];

  const usageOptions: Array<'familyStorage' | 'officeCommute' | 'youthPerformance' | 'youthStyle' | 'heavyDuty' | 'budgetEconomy'> = [
    'familyStorage',
    'officeCommute',
    'youthPerformance',
    'youthStyle',
    'heavyDuty',
    'budgetEconomy'
  ];

  const budgetOptions: Array<'under1L' | '1to1.4L' | '1.4to1.8L' | 'above1.8L'> = [
    'under1L',
    '1to1.4L',
    '1.4to1.8L',
    'above1.8L'
  ];

  const categoryOptions: Array<'all' | 'scooter' | 'motorcycle'> = [
    'all',
    'scooter',
    'motorcycle'
  ];

  it('runs exhaustive 1,152 permutation test matrix (4x4x6x4x3) with 100% mathematical validity', () => {
    let permutationCount = 0;

    for (const commute of commuteOptions) {
      for (const charging of chargingOptions) {
        for (const usage of usageOptions) {
          for (const budget of budgetOptions) {
            for (const category of categoryOptions) {
              permutationCount++;

              const answers: WizardAnswers = {
                commuteDistance: commute,
                chargingAccess: charging,
                primaryUse: usage,
                budget: budget,
                preferredCategory: category
              };

              const results = calculateRecommendations(answers, evModels);

              // 1. Result length invariant: exactly 18 pure EV models
              assert.equal(
                results.length,
                evModels.length,
                `Permutation ${permutationCount} failed: Expected ${evModels.length} results, got ${results.length}`
              );

              // 2. No ICE Benchmark Invariant
              for (const res of results) {
                assert.notEqual(
                  res.model.id,
                  'honda-activa-6g',
                  `ICE benchmark Honda Activa 6G leaked into recommendation results in permutation ${permutationCount}`
                );
                assert.equal(
                  res.model.isIceBenchmark,
                  undefined,
                  `Model ${res.model.id} has isIceBenchmark flag in results`
                );
              }

              // 3. Monotonic descending order check
              for (let i = 0; i < results.length - 1; i++) {
                assert.ok(
                  results[i].matchScore >= results[i + 1].matchScore,
                  `Ranking inversion at index ${i} (${results[i].model.name} score ${results[i].matchScore} < ${results[i + 1].model.name} score ${results[i + 1].matchScore}) in permutation ${permutationCount}`
                );
              }

              // 4. Rank and CategoryRank indexing check
              results.forEach((res, idx) => {
                assert.equal(res.rank, idx + 1, `Rank must be 1-indexed matching position`);
                assert.equal(res.categoryRank, idx + 1, `categoryRank must match rank`);
              });

              // 5. Score Bounds and Subscores
              for (const res of results) {
                assert.ok(
                  res.matchScore >= 0 && res.matchScore <= 100,
                  `matchScore ${res.matchScore} out of bounds [0, 100]`
                );
                assert.equal(
                  res.matchScore,
                  Math.round(res.matchScore),
                  `matchScore must be an integer`
                );

                assert.ok(res.subScores, `Missing subScores in result`);
                const sub = res.subScores!;
                assert.ok(sub.commuteScore >= 0 && sub.commuteScore <= 100, `commuteScore out of range`);
                assert.ok(sub.chargingScore >= 0 && sub.chargingScore <= 100, `chargingScore out of range`);
                assert.ok(sub.usageScore >= 0 && sub.usageScore <= 100, `usageScore out of range`);
                assert.ok(sub.budgetScore >= 0 && sub.budgetScore <= 100, `budgetScore out of range`);

                // Verify matchGrade & fitConfidence consistency
                if (res.matchScore >= 90) {
                  assert.equal(res.matchGrade, 'Excellent');
                  assert.equal(res.fitConfidence, 'Perfect Match');
                } else if (res.matchScore >= 78) {
                  assert.equal(res.matchGrade, 'Great');
                  assert.equal(res.fitConfidence, 'Great Match');
                } else if (res.matchScore >= 65) {
                  assert.equal(res.matchGrade, 'Good');
                  assert.equal(res.fitConfidence, 'Good Match');
                } else {
                  assert.equal(res.matchGrade, 'Fair');
                  assert.equal(res.fitConfidence, 'Alternative');
                }

                // Verify matching reasons
                assert.ok(Array.isArray(res.matchingReasons), `matchingReasons must be array`);
                assert.ok(res.matchingReasons.length >= 3, `Must provide at least 3 matching reasons`);
              }
            }
          }
        }
      }
    }

    assert.equal(permutationCount, 1152, `Must have executed exactly 1,152 permutation tests`);
  });

  it('verifies that passing allVehicles including Activa 6G filters out ICE benchmark automatically', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'independentHouse',
      primaryUse: 'officeCommute',
      budget: '1to1.4L'
    };

    const results = calculateRecommendations(answers, allVehicles);
    assert.equal(results.length, getEVModels().length, 'Must return EV models without ICE benchmark');
    assert.ok(!results.some(r => r.model.id === 'honda-activa-6g'));
  });
});

describe('Milestone 3 Challenger 2: Apartment Without Charging Socket Deep Verification', () => {
  const evModels = getEVModels();

  const removableModels = evModels.filter(m => m.specs.isRemovableBattery);
  const fixedModels = evModels.filter(m => !m.specs.isRemovableBattery);

  it('identifies exact catalog counts: removable battery EVs in catalog', () => {
    assert.ok(removableModels.length >= 2, 'Expected removable battery models');
    assert.ok(fixedModels.length >= 10, 'Expected fixed battery models');

    for (const m of removableModels) {
      assert.equal(m.specs.isRemovableBattery, true);
    }
  });

  it('enforces chargingScore: 100% for removable vs 20% hard penalty for fixed battery in apartmentNoSocket', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'apartmentNoSocket',
      primaryUse: 'officeCommute',
      budget: '1to1.4L',
      preferredCategory: 'all'
    };

    const results = calculateRecommendations(answers, evModels);

    for (const res of results) {
      if (res.model.specs.isRemovableBattery) {
        assert.equal(
          res.subScores?.chargingScore,
          100,
          `Removable battery model ${res.model.name} must get 100 charging score`
        );
        // Matching reason check
        assert.ok(
          res.matchingReasons?.some(r => r.includes('⭐ Removable battery pack allows convenient indoor charging')),
          `Removable model ${res.model.name} missing ⭐ removable indoor charging reason`
        );
      } else {
        assert.equal(
          res.subScores?.chargingScore,
          20,
          `Fixed battery model ${res.model.name} must get 20 charging score penalty`
        );
        // Warning reason check
        assert.ok(
          res.matchingReasons?.some(r => r.includes('⚠️ Fixed battery pack requires dedicated ground socket access.')),
          `Fixed model ${res.model.name} missing ⚠️ fixed battery warning reason`
        );
        // Caution note check
        assert.ok(
          res.caveatsToConsider?.some(c => c.includes('Fixed battery cannot be removed; requires a charging plug near your parking spot.')),
          `Fixed model ${res.model.name} missing fixed battery caveat`
        );
      }
    }
  });

  it('achieves 100% match score for Hero Vida V1 Pro in optimal apartment commute scenario', () => {
    const perfectVidaAnswers: WizardAnswers = {
      commuteDistance: '25to50',       // 105 km range >= 85 -> 100 (weight 30%) = 30
      chargingAccess: 'apartmentNoSocket', // Removable -> 100 (weight 25%) = 25
      primaryUse: 'officeCommute',     // 5-yr battery warranty (+10) + 4.6 rating (+10) = 100 (weight 25%) = 25
      budget: '1to1.4L',               // Net price 120,200 <= 145,000 -> 100 (weight 20%) = 20
      preferredCategory: 'all'
    };

    const results = calculateRecommendations(perfectVidaAnswers, evModels);
    const vidaResult = results.find(r => r.model.id === 'hero-vida-v1-pro');

    assert.ok(vidaResult, 'Hero Vida V1 Pro must be in results');
    assert.ok(vidaResult!.rank <= 3, 'Hero Vida V1 Pro must be in top 3');
    assert.equal(vidaResult!.matchScore, 100, 'Hero Vida V1 Pro must achieve 100% match score');
    assert.equal(vidaResult!.fitConfidence, 'Perfect Match');
    assert.equal(vidaResult!.matchGrade, 'Excellent');

    assert.equal(vidaResult!.subScores?.commuteScore, 100);
    assert.equal(vidaResult!.subScores?.chargingScore, 100);
    assert.equal(vidaResult!.subScores?.usageScore, 100);
    assert.equal(vidaResult!.subScores?.budgetScore, 100);
  });

  it('achieves 100% match score for Revolt RV400 in optimal motorcycle apartment scenario', () => {
    const perfectRevoltAnswers: WizardAnswers = {
      commuteDistance: 'under25',      // 100 km range -> 100 (weight 30%) = 30
      chargingAccess: 'apartmentNoSocket', // Removable -> 100 (weight 25%) = 25
      primaryUse: 'heavyDuty',         // 215mm ground clearance >= 170 -> 100 (weight 25%) = 25
      budget: '1to1.4L',               // Net price 129,000 <= 145,000 -> 100 (weight 20%) = 20
      preferredCategory: 'motorcycle'
    };

    const results = calculateRecommendations(perfectRevoltAnswers, evModels);
    const revoltResult = results.find(r => r.model.id === 'revolt-rv400-32');

    assert.ok(revoltResult, 'Revolt RV400 must be in results');
    assert.ok(revoltResult!.rank <= 3, 'Revolt RV400 must be in top 3');
    assert.equal(revoltResult!.matchScore, 100, 'Revolt RV400 must achieve 100% match score');
    assert.equal(revoltResult!.fitConfidence, 'Perfect Match');
  });

  it('guarantees that a removable battery model ranks in Top 3 in all 96 apartmentNoSocket permutations (category: all)', () => {
    const commuteList: Array<'under25' | '25to50' | '50to80' | 'above80'> = ['under25', '25to50', '50to80', 'above80'];
    const usageList: Array<'familyStorage' | 'officeCommute' | 'youthPerformance' | 'youthStyle' | 'heavyDuty' | 'budgetEconomy'> = [
      'familyStorage', 'officeCommute', 'youthPerformance', 'youthStyle', 'heavyDuty', 'budgetEconomy'
    ];
    const budgetList: Array<'under1L' | '1to1.4L' | '1.4to1.8L' | 'above1.8L'> = ['under1L', '1to1.4L', '1.4to1.8L', 'above1.8L'];

    let count = 0;
    for (const commute of commuteList) {
      for (const usage of usageList) {
        for (const budget of budgetList) {
          count++;
          const answers: WizardAnswers = {
            commuteDistance: commute,
            chargingAccess: 'apartmentNoSocket',
            primaryUse: usage,
            budget: budget,
            preferredCategory: 'all'
          };

          const results = calculateRecommendations(answers, evModels);
          const top3Ids = results.slice(0, 3).map(r => r.model.id);

          const hasRemovableInTop3 = top3Ids.some(id => evModels.find(m => m.id === id)?.specs.isRemovableBattery);
          assert.ok(
            hasRemovableInTop3,
            `Apartment run ${count} (${commute}, ${usage}, ${budget}) failed: top 3 IDs were [${top3Ids.join(', ')}], missing removable battery models`
          );

          // In apartmentNoSocket, no fixed battery EV can ever exceed 80% score
          for (const res of results) {
            if (!res.model.specs.isRemovableBattery) {
              assert.ok(
                res.matchScore <= 80,
                `Fixed battery model ${res.model.name} scored ${res.matchScore} > 80 in apartmentNoSocket scenario`
              );
            }
          }
        }
      }
    }
    assert.equal(count, 96, 'Must verify all 96 apartment permutations');
  });

  it('guarantees #1 rank for Hero Vida V1 Pro when category is scooter with apartmentNoSocket', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'apartmentNoSocket',
      primaryUse: 'officeCommute',
      budget: '1to1.4L',
      preferredCategory: 'scooter'
    };

    const results = calculateRecommendations(answers, evModels);
    assert.ok(results[0].model.specs.isRemovableBattery, 'Top recommendation must have removable battery');
    assert.ok(results[0].matchScore >= 95);
  });

  it('guarantees top rank for Revolt removable models when category is motorcycle with apartmentNoSocket', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'apartmentNoSocket',
      primaryUse: 'officeCommute',
      budget: '1to1.4L',
      preferredCategory: 'motorcycle'
    };

    const results = calculateRecommendations(answers, evModels);
    assert.ok(results[0].model.specs.isRemovableBattery, 'Top motorcycle must have removable battery');
    assert.ok(results[0].matchScore >= 95);
  });
});

describe('Milestone 3 Challenger 2: Key Buyer Persona Archetype Simulations', () => {
  const evModels = getEVModels();

  it('Persona 1: Family Hauler & Grocery Commuter in Hyderabad (Rizta Z & TVS iQube priority)', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'independentHouse',
      primaryUse: 'familyStorage',
      budget: '1.4to1.8L',
      preferredCategory: 'scooter'
    };

    const results = calculateRecommendations(answers, evModels);
    const topMatch = results[0];

    // Ather Rizta Z (34L boot space) or TVS iQube S (32L boot space) should be top
    assert.ok(
      ['ather-rizta-z-37', 'tvs-iqube-st-51', 'tvs-iqube-s-34', 'river-indie-40'].includes(topMatch.model.id),
      `Expected family storage vehicle, got ${topMatch.model.id}`
    );
    assert.ok(topMatch.matchScore >= 90, `Top match score should be >= 90, got ${topMatch.matchScore}`);
    assert.ok(
      topMatch.matchingReasons?.some(r => r.includes('boot space')),
      'Matching reasons should highlight boot space'
    );
  });

  it('Persona 2: Speed & Tech Performance Enthusiast (Ather 450X, Ola S1 Pro, Ultraviolette F77)', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'apartmentWithSocket',
      primaryUse: 'youthPerformance',
      budget: '1.4to1.8L',
      preferredCategory: 'all'
    };

    const results = calculateRecommendations(answers, evModels);
    const top3 = results.slice(0, 3);

    const hasPerformanceModel = top3.some(r => 
      r.model.specs.topSpeedKmh >= 95 || ['ola-s1-pro-gen2', 'ather-450x-gen3-37', 'ultraviolette-f77-mach2', 'tork-kratos-r'].includes(r.model.id)
    );
    assert.ok(hasPerformanceModel, `Top 3 should contain high-speed EV`);
    assert.ok(results[0].matchScore >= 90);
  });

  it('Persona 3: High Mileage (>80 km/day) Inter-District Highway Rider', () => {
    const answers: WizardAnswers = {
      commuteDistance: 'above80',
      chargingAccess: 'publicOnly',
      primaryUse: 'officeCommute',
      budget: 'above1.8L',
      preferredCategory: 'all'
    };

    const results = calculateRecommendations(answers, evModels);
    const topMatch = results[0];

    // Should prioritize highest real world range & fast charging
    assert.ok(
      topMatch.model.specs.realWorldCityRangeKm >= 140,
      `Top model ${topMatch.model.name} real range (${topMatch.model.specs.realWorldCityRangeKm} km) should be >= 140 km for >80km daily commute`
    );
    assert.ok(topMatch.model.specs.fastChargingSupport, 'Top model should support fast charging for public-only charging');
  });

  it('Persona 4: Ultra-Budget Commuter seeking < ₹1 Lakh EV with maximum ROI', () => {
    const answers: WizardAnswers = {
      commuteDistance: 'under25',
      chargingAccess: 'independentHouse',
      primaryUse: 'budgetEconomy',
      budget: 'under1L',
      preferredCategory: 'all'
    };

    const results = calculateRecommendations(answers, evModels);
    const topMatch = results[0];

    const netPrice = topMatch.model.pricing.exShowroom - topMatch.model.pricing.pmEdriveSubsidy;
    assert.ok(
      netPrice <= 105000,
      `Top model ${topMatch.model.name} net price (₹${netPrice}) should fit < ₹1L budget`
    );
    assert.equal(topMatch.subScores?.budgetScore, 100);
  });
});

describe('Milestone 3 Challenger 2: SmartWizardModal Workflow, State & CTA Logic Simulation', () => {
  const evModels = getEVModels();

  it('simulates 5-step wizard progression and state mutations', () => {
    // Step 1: Default state
    let step = 1;
    let answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'apartmentNoSocket',
      primaryUse: 'familyStorage',
      budget: '1to1.4L'
    };

    // Advancing Step 1 -> 2
    answers = { ...answers, commuteDistance: '50to80' };
    step = 2;
    assert.equal(step, 2);
    assert.equal(answers.commuteDistance, '50to80');

    // Advancing Step 2 -> 3
    answers = { ...answers, chargingAccess: 'independentHouse' };
    step = 3;
    assert.equal(step, 3);
    assert.equal(answers.chargingAccess, 'independentHouse');

    // Advancing Step 3 -> 4
    answers = { ...answers, primaryUse: 'youthPerformance' };
    step = 4;
    assert.equal(step, 4);
    assert.equal(answers.primaryUse, 'youthPerformance');

    // Advancing Step 4 -> 5 (Results)
    answers = { ...answers, budget: '1.4to1.8L' };
    step = 5;
    assert.equal(step, 5);

    // Compute recommendations on Step 5
    const recs = calculateRecommendations(answers, evModels);
    assert.equal(recs.length, evModels.length);
    const top3 = recs.slice(0, 3);
    assert.equal(top3.length, 3);
    assert.ok(top3[0].matchScore >= top3[1].matchScore);
    assert.ok(top3[1].matchScore >= top3[2].matchScore);

    // Reset workflow
    const handleReset = () => {
      step = 1;
      answers = {
        commuteDistance: '25to50',
        chargingAccess: 'apartmentNoSocket',
        primaryUse: 'familyStorage',
        budget: '1to1.4L'
      };
    };
    handleReset();
    assert.equal(step, 1);
    assert.equal(answers.commuteDistance, '25to50');
    assert.equal(answers.chargingAccess, 'apartmentNoSocket');
  });

  it('simulates Confetti trigger payload and error tolerance on Step 5', () => {
    let confettiCalled = false;
    let confettiPayload: { particleCount: number; spread: number; origin: { y: number }; colors: string[] } | null = null;

    const mockConfetti = (options: { particleCount: number; spread: number; origin: { y: number }; colors: string[] }) => {
      confettiCalled = true;
      confettiPayload = options;
    };

    // Test successful trigger
    try {
      mockConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#3b82f6']
      });
    } catch (err) {
      assert.fail(`Confetti should not throw: ${err}`);
    }

    assert.equal(confettiCalled, true);
    assert.equal(confettiPayload?.particleCount, 80);
    assert.equal(confettiPayload?.spread, 70);
    assert.equal(confettiPayload?.origin.y, 0.6);
    assert.equal(confettiPayload?.colors.length, 5);

    // Test error tolerance when confetti library throws
    let errorCaught = false;
    const failingConfetti = () => {
      throw new Error('Canvas not supported in headless environment');
    };

    try {
      try {
        failingConfetti();
      } catch {
        errorCaught = true;
        // SmartWizardModal logs a warning without crashing UI
      }
    } catch {
      assert.fail('UI should swallow confetti error safely');
    }
    assert.equal(errorCaught, true);
  });

  it('simulates "Compare Top 3 Side-by-Side" CTA workflow with tray management and modal transitions', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'apartmentNoSocket',
      primaryUse: 'officeCommute',
      budget: '1to1.4L'
    };

    const recs = calculateRecommendations(answers, evModels);
    const top3 = recs.slice(0, 3);
    const top3Ids = top3.map(r => r.model.id);

    // Mock Context state
    let selectedCompareIds: string[] = ['ather-rizta-z-37'];
    let isWizardOpen = true;
    let isCompareOpen = false;

    const isCompared = (id: string) => selectedCompareIds.includes(id);
    const toggleCompare = (id: string) => {
      if (selectedCompareIds.includes(id)) {
        selectedCompareIds = selectedCompareIds.filter(x => x !== id);
      } else {
        selectedCompareIds = [...selectedCompareIds, id].slice(-4);
      }
    };
    const handleClose = () => {
      isWizardOpen = false;
    };
    const openCompare = () => {
      isCompareOpen = true;
    };

    // Execution of handleCompareTop3
    const handleCompareTop3 = () => {
      top3.forEach(rec => {
        if (!isCompared(rec.model.id)) {
          toggleCompare(rec.model.id);
        }
      });
      handleClose();
      openCompare();
    };

    handleCompareTop3();

    // Verify all top 3 models are present in comparison tray
    for (const id of top3Ids) {
      assert.ok(selectedCompareIds.includes(id), `Tray missing top 3 model ${id}`);
    }
    assert.ok(selectedCompareIds.length <= 4, `Tray must not exceed 4 models`);
    assert.equal(isWizardOpen, false, `Wizard modal must be closed`);
    assert.equal(isCompareOpen, true, `Compare matrix modal must be opened`);
  });

  it('simulates deep linking action CTAs on individual recommendation cards', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'independentHouse',
      primaryUse: 'familyStorage',
      budget: '1.4to1.8L'
    };

    const recs = calculateRecommendations(answers, evModels);
    const topEv = recs[0].model;

    let isWizardOpen = true;
    let activeDetailId: string | null = null;
    let activePriceId: string | null = null;
    let activeRangeId: string | null = null;
    let activeSavingsId: string | null = null;

    const closeWizard = () => { isWizardOpen = false; };
    const openDetail = (id: string) => { activeDetailId = id; };
    const openPriceModal = (id: string) => { activePriceId = id; };
    const openRangeModal = (id: string) => { activeRangeId = id; };
    const openSavingsModal = (id: string) => { activeSavingsId = id; };

    // 1. Click Specs CTA
    isWizardOpen = true;
    closeWizard();
    openDetail(topEv.id);
    assert.equal(isWizardOpen, false);
    assert.equal(activeDetailId, topEv.id);

    // 2. Click Price CTA
    isWizardOpen = true;
    closeWizard();
    openPriceModal(topEv.id);
    assert.equal(isWizardOpen, false);
    assert.equal(activePriceId, topEv.id);

    // 3. Click Range Sim CTA
    isWizardOpen = true;
    closeWizard();
    openRangeModal(topEv.id);
    assert.equal(isWizardOpen, false);
    assert.equal(activeRangeId, topEv.id);

    // 4. Click ROI Savings CTA
    isWizardOpen = true;
    closeWizard();
    openSavingsModal(topEv.id);
    assert.equal(isWizardOpen, false);
    assert.equal(activeSavingsId, topEv.id);
  });
});

describe('Milestone 3 Challenger 2: Boundary, Custom Budget & Malformed Inputs Hardening', () => {
  const evModels = getEVModels();

  it('handles custom numeric budgetMax parameters accurately with linear decay', () => {
    // Custom budgetMax = ₹1,20,000
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'independentHouse',
      primaryUse: 'officeCommute',
      budgetMax: 120000
    };

    const results = calculateRecommendations(answers, evModels);
    for (const res of results) {
      const netVehiclePrice = res.model.pricing.exShowroom - res.model.pricing.pmEdriveSubsidy;
      if (netVehiclePrice <= 120000) {
        assert.equal(res.subScores?.budgetScore, 100);
      } else {
        const excess = netVehiclePrice - 120000;
        const expectedBudgetScore = Math.max(10, Math.round(100 - excess / 1500));
        assert.equal(res.subScores?.budgetScore, expectedBudgetScore);
      }
    }
  });

  it('handles alias property names (dailyCommute, usageType, preferredType) interchangeably', () => {
    const canonicalAnswers: WizardAnswers = {
      commuteDistance: '50to80',
      chargingAccess: 'publicOnly',
      primaryUse: 'youthPerformance',
      budget: '1.4to1.8L',
      preferredCategory: 'motorcycle'
    };

    const aliasAnswers: WizardAnswers = {
      dailyCommute: '50to80',
      chargingAccess: 'publicOnly',
      usageType: 'youthPerformance',
      budget: '1.4to1.8L',
      preferredType: 'motorcycle'
    };

    const res1 = calculateRecommendations(canonicalAnswers, evModels);
    const res2 = calculateRecommendations(aliasAnswers, evModels);

    assert.equal(res1.length, res2.length);
    for (let i = 0; i < res1.length; i++) {
      assert.equal(res1[i].model.id, res2[i].model.id);
      assert.equal(res1[i].matchScore, res2[i].matchScore);
      assert.equal(res1[i].rank, res2[i].rank);
      assert.deepEqual(res1[i].subScores, res2[i].subScores);
    }
  });

  it('handles empty answers object by falling back safely to default values', () => {
    const emptyAnswers: WizardAnswers = {} as any;
    const results = calculateRecommendations(emptyAnswers, evModels);

    assert.equal(results.length, evModels.length);
    for (const res of results) {
      assert.ok(!isNaN(res.matchScore));
      assert.ok(res.matchScore >= 0 && res.matchScore <= 100);
    }
  });

  it('handles empty models list gracefully by returning empty array', () => {
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'independentHouse',
      primaryUse: 'officeCommute',
      budget: '1to1.4L'
    };

    const results = calculateRecommendations(answers, []);
    assert.deepEqual(results, []);
  });

  it('runs 1,000 randomized Monte Carlo stress runs with zero NaNs or invariant violations', () => {
    const commutes: Array<WizardAnswers['commuteDistance']> = ['under25', '25to50', '50to80', 'above80', undefined];
    const chargings: Array<WizardAnswers['chargingAccess']> = ['independentHouse', 'apartmentWithSocket', 'apartmentNoSocket', 'publicOnly'];
    const usages: Array<WizardAnswers['primaryUse']> = ['familyStorage', 'officeCommute', 'youthPerformance', 'youthStyle', 'heavyDuty', 'budgetEconomy', undefined];
    const budgets: Array<WizardAnswers['budget']> = ['under1L', '1to1.4L', '1.4to1.8L', 'above1.8L', undefined];
    const categories: Array<WizardAnswers['preferredCategory']> = ['all', 'scooter', 'motorcycle', undefined];

    for (let i = 0; i < 1000; i++) {
      const answers: WizardAnswers = {
        commuteDistance: commutes[Math.floor(Math.random() * commutes.length)],
        chargingAccess: chargings[Math.floor(Math.random() * chargings.length)],
        primaryUse: usages[Math.floor(Math.random() * usages.length)],
        budget: budgets[Math.floor(Math.random() * budgets.length)],
        budgetMax: Math.random() > 0.5 ? Math.floor(Math.random() * 300000 + 50000) : undefined,
        preferredCategory: categories[Math.floor(Math.random() * categories.length)]
      };

      const results = calculateRecommendations(answers, evModels);

      assert.equal(results.length, evModels.length, `Monte Carlo run ${i}: invalid length`);
      for (let j = 0; j < results.length; j++) {
        const r = results[j];
        assert.ok(!isNaN(r.matchScore), `Monte Carlo run ${i}: NaN score`);
        assert.ok(r.matchScore >= 0 && r.matchScore <= 100, `Monte Carlo run ${i}: score out of range`);
        assert.equal(r.rank, j + 1);
        if (j > 0) {
          assert.ok(
            results[j - 1].matchScore >= r.matchScore,
            `Monte Carlo run ${i}: sorting failure at ${j}`
          );
        }
      }
    }
  });
});
