import type {
  EVModel,
  WizardAnswers,
  RecommendationResult,
  RecommendationSubScores
} from '../types/ev';

/**
 * 4-Step Multi-Criteria Recommendation Algorithm
 * 
 * Weights:
 * - Commute Distance: 30%
 * - Charging Setup: 25% (Apartment no socket hard penalty for fixed battery)
 * - Primary Use: 25%
 * - Budget: 20%
 */
export function calculateRecommendations(
  answers: WizardAnswers,
  models: EVModel[]
): RecommendationResult[] {
  // Filter out ICE benchmark vehicles from EV recommendation matches
  const evCandidates = models.filter((m) => !m.isIceBenchmark);

  const commuteKey = answers.commuteDistance || answers.dailyCommute || '25to50';
  const usageKey = answers.primaryUse || answers.usageType || 'officeCommute';
  const preferredCat = answers.preferredCategory || answers.preferredType || 'all';

  const results: RecommendationResult[] = evCandidates.map((model) => {
    // 1. Commute Distance Scoring (30% weight)
    let commuteScore = 100;
    const realRange = model.specs.realWorldCityRangeKm;

    switch (commuteKey) {
      case 'under25':
        commuteScore = 100;
        break;
      case '25to50':
        commuteScore = realRange >= 85 ? 100 : Math.max(40, Math.round((realRange / 85) * 100));
        break;
      case '50to80':
        if (realRange >= 115) commuteScore = 100;
        else if (realRange >= 95) commuteScore = 80;
        else if (realRange >= 80) commuteScore = 60;
        else commuteScore = 35;
        break;
      case 'above80':
        if (realRange >= 140) commuteScore = 100;
        else if (realRange >= 110) commuteScore = 75;
        else if (realRange >= 90) commuteScore = 50;
        else commuteScore = 20;
        break;
    }

    // 2. Charging Access Scoring (25% weight)
    let chargingScore = 100;
    switch (answers.chargingAccess) {
      case 'independentHouse':
        chargingScore = 100;
        break;
      case 'apartmentWithSocket':
        chargingScore = model.specs.fastChargingSupport ? 100 : 95;
        break;
      case 'apartmentNoSocket':
        // Explicit Rule: Removable battery gets 100%, fixed battery hard penalty to 20%
        chargingScore = model.specs.isRemovableBattery ? 100 : 20;
        break;
      case 'publicOnly':
        chargingScore = model.specs.fastChargingSupport ? 100 : 40;
        break;
    }

    // 3. Primary Use Scoring (25% weight)
    let usageScore = 80;
    switch (usageKey) {
      case 'familyStorage':
        if (model.specs.bootSpaceLiters >= 34) usageScore = 100;
        else if (model.specs.bootSpaceLiters >= 28) usageScore = 85;
        else if (model.specs.bootSpaceLiters >= 18) usageScore = 60;
        else usageScore = 30;
        break;

      case 'officeCommute':
        usageScore = 80;
        if (model.warranty.batteryYears >= 5) usageScore += 10;
        if (model.rating >= 4.6) usageScore += 10;
        usageScore = Math.min(100, usageScore);
        break;

      case 'youthPerformance':
        if (model.specs.topSpeedKmh >= 100) usageScore = 100;
        else if (model.specs.topSpeedKmh >= 85) usageScore = 85;
        else if (model.specs.topSpeedKmh >= 75) usageScore = 65;
        else usageScore = 40;
        if (model.specs.accel0To40Kmh <= 3.5) usageScore = Math.min(100, usageScore + 10);
        break;

      case 'youthStyle':
        if (model.specs.touchscreen && (model.specs.displaySizeInches || 0) >= 7.0) {
          usageScore = 100;
        } else if (model.specs.touchscreen) {
          usageScore = 85;
        } else {
          usageScore = 55;
        }
        break;

      case 'heavyDuty':
      case 'deliveryUtility':
        if (model.specs.groundClearanceMm >= 170) usageScore = 100;
        else if (model.specs.groundClearanceMm >= 165) usageScore = 90;
        else usageScore = 55;
        break;

      case 'budgetEconomy':
        const netPrice = model.pricing.exShowroom - model.pricing.pmEdriveSubsidy;
        if (netPrice <= 100000) usageScore = 100;
        else if (netPrice <= 130000) usageScore = 80;
        else usageScore = 50;
        break;
    }

    // 4. Budget Scoring (20% weight)
    let budgetScore = 100;
    let maxBudgetThreshold = 185000;

    if (answers.budgetMax && answers.budgetMax > 0) {
      maxBudgetThreshold = answers.budgetMax;
    } else if (answers.budget) {
      switch (answers.budget) {
        case 'under1L':
          maxBudgetThreshold = 105000;
          break;
        case '1to1.4L':
          maxBudgetThreshold = 145000;
          break;
        case '1.4to1.8L':
          maxBudgetThreshold = 185000;
          break;
        case 'above1.8L':
          maxBudgetThreshold = 450000;
          break;
      }
    }

    const netVehiclePrice = model.pricing.exShowroom - model.pricing.pmEdriveSubsidy;
    if (netVehiclePrice <= maxBudgetThreshold) {
      budgetScore = 100;
    } else {
      const excess = netVehiclePrice - maxBudgetThreshold;
      budgetScore = Math.max(10, Math.round(100 - excess / 1500));
    }

    // Total Weighted Score Computation
    let totalScore =
      0.30 * commuteScore +
      0.25 * chargingScore +
      0.25 * usageScore +
      0.20 * budgetScore;

    // Optional Category Preference Filter
    if (preferredCat && preferredCat !== 'all') {
      if (model.category !== preferredCat) {
        totalScore *= 0.60;
      }
    }

    const matchScore = Math.min(100, Math.max(0, Math.round(totalScore)));

    // Fit Confidence Tier
    let fitConfidence: 'Perfect Match' | 'Great Match' | 'Good Match' | 'Alternative' = 'Great Match';
    let matchGrade: 'Excellent' | 'Great' | 'Good' | 'Fair' = 'Great';

    if (matchScore >= 90) {
      fitConfidence = 'Perfect Match';
      matchGrade = 'Excellent';
    } else if (matchScore >= 78) {
      fitConfidence = 'Great Match';
      matchGrade = 'Great';
    } else if (matchScore >= 65) {
      fitConfidence = 'Good Match';
      matchGrade = 'Good';
    } else {
      fitConfidence = 'Alternative';
      matchGrade = 'Fair';
    }

    // Dynamic Matching Reasons Synthesis
    const matchingReasons: string[] = [];

    // Commute reason
    matchingReasons.push(
      `${model.specs.realWorldCityRangeKm} km true city range comfortably handles your commute requirements.`
    );

    // Charging reason
    if (answers.chargingAccess === 'apartmentNoSocket') {
      if (model.specs.isRemovableBattery) {
        matchingReasons.push(
          '⭐ Removable battery pack allows convenient indoor charging inside your apartment without a parking socket.'
        );
      } else {
        matchingReasons.push(
          '⚠️ Fixed battery pack requires dedicated ground socket access.'
        );
      }
    } else if (model.specs.fastChargingSupport) {
      matchingReasons.push(
        `Fast-charging ready (${model.specs.fastChargingRate || 'rapid network'}) for speedy top-ups.`
      );
    } else {
      matchingReasons.push(
        `Convenient home charging from 0-80% in ${model.specs.chargingTime0To80}.`
      );
    }

    // Usage reason
    if (usageKey === 'familyStorage') {
      matchingReasons.push(
        `Class-leading ${model.specs.bootSpaceLiters}L boot space provides ample storage for family needs.`
      );
    } else if (usageKey === 'youthPerformance') {
      matchingReasons.push(
        `Top speed of ${model.specs.topSpeedKmh} km/h with 0-40 km/h in ${model.specs.accel0To40Kmh}s.`
      );
    } else {
      matchingReasons.push(
        `${model.warranty.batteryYears}-year battery warranty provides long-term peace of mind in Telangana.`
      );
    }

    // Telangana Policy Benefit
    const taxSaved = Math.round(model.pricing.exShowroom * 0.12 + 785);
    matchingReasons.push(
      `Zero road tax in Telangana saves you ₹${taxSaved.toLocaleString('en-IN')} upfront.`
    );

    // Pros Alignment
    const prosAlignment = model.pros ? model.pros.slice(0, 3) : [];

    // Transparent Caveats
    const caveatsToConsider: string[] = [];
    if (answers.chargingAccess === 'apartmentNoSocket' && !model.specs.isRemovableBattery) {
      caveatsToConsider.push(
        'Fixed battery cannot be removed; requires a charging plug near your parking spot.'
      );
    }
    if (model.cons && model.cons.length > 0) {
      caveatsToConsider.push(model.cons[0]);
    }

    const subScores: RecommendationSubScores = {
      commuteScore,
      chargingScore,
      usageScore,
      budgetScore
    };

    return {
      model,
      matchScore,
      matchGrade,
      fitConfidence,
      categoryRank: 0,
      rank: 0,
      matchingReasons,
      keyMatchReasons: matchingReasons,
      prosAlignment,
      caveatsToConsider,
      cautionNotes: caveatsToConsider,
      subScores
    };
  });

  // Sort descending by match score
  results.sort((a, b) => b.matchScore - a.matchScore);

  // Assign category ranks
  return results.map((res, idx) => ({
    ...res,
    categoryRank: idx + 1,
    rank: idx + 1
  }));
}
