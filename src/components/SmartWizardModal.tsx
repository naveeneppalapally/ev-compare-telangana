import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { 
  WizardAnswers, 
  RecommendationResult 
} from '../types/ev';
import { useCompare } from '../context/CompareContext';
import { calculateRecommendations } from '../utils/recommendationEngine';
import { calculateTelanganaOnRoadPrice, formatINR } from '../utils/priceCalculator';
import { VehicleImage } from './VehicleImage';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Scale,
  Battery,
  Zap,
  Building,
  Home,
  Briefcase,
  Rocket,
  Palette,
  Package,
  TrendingDown,
  Gauge
} from 'lucide-react';

export interface SmartWizardModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SmartWizardModal: React.FC<SmartWizardModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose
}) => {
  const {
    isWizardOpen,
    closeWizard,
    models,
    selectedRtoCode,
    openDetail,
    openCompare,
    toggleCompare,
    isCompared
  } = useCompare();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isWizardOpen;
  const handleClose = useCallback(() => {
    if (propOnClose) propOnClose();
    else closeWizard();
  }, [propOnClose, closeWizard]);

  const [step, setStep] = useState<number>(1);

  const [answers, setAnswers] = useState<WizardAnswers>({
    commuteDistance: '25to50',
    chargingAccess: 'apartmentNoSocket',
    primaryUse: 'familyStorage',
    budget: '1to1.4L'
  });

  const handleReset = useCallback(() => {
    setStep(1);
    setAnswers({
      commuteDistance: '25to50',
      chargingAccess: 'apartmentNoSocket',
      primaryUse: 'familyStorage',
      budget: '1to1.4L'
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen && step === 5) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti animation error:', err);
      }
    }
  }, [isOpen, step]);

  const recommendations: RecommendationResult[] = useMemo(() => {
    if (!models || models.length === 0) return [];
    return calculateRecommendations(answers, models);
  }, [answers, models]);

  const top3 = useMemo(() => recommendations.slice(0, 3), [recommendations]);

  if (!isOpen) return null;

  const stepsConfig = [
    {
      stepNumber: 1,
      title: 'Daily Commute Distance',
      question: 'What is your average daily round-trip travel in Telangana?',
      description: 'Calculates necessary battery capacity with adequate safety buffer.',
      key: 'commuteDistance' as const,
      options: [
        {
          value: 'under25' as const,
          label: '< 20 km / day',
          desc: 'Neighborhood errands, local market, charging 1x per week.',
          icon: Home
        },
        {
          value: '25to50' as const,
          label: '20 – 50 km / day',
          desc: 'Standard Hyderabad daily office commute (e.g. Kukatpally to Hitec City).',
          icon: Building
        },
        {
          value: '50to80' as const,
          label: '50 – 80 km / day',
          desc: 'Cross-city travel (Secunderabad to Financial District / Airport road).',
          icon: Gauge
        },
        {
          value: 'above80' as const,
          label: '> 80 km / day',
          desc: 'Inter-district travel, delivery runs, or heavy daily field visits.',
          icon: Rocket
        }
      ]
    },
    {
      stepNumber: 2,
      title: 'Living & Charging Setup',
      question: 'What is your home parking and overnight charging arrangement?',
      description: 'Crucial for choosing between Removable battery vs Fixed monoblock battery packs.',
      key: 'chargingAccess' as const,
      options: [
        {
          value: 'independentHouse' as const,
          label: 'Independent House / Villa',
          desc: 'Dedicated 15A socket for overnight charging. Any EV works!',
          icon: Home
        },
        {
          value: 'apartmentSocket' as const,
          label: 'Apartment with EV Socket',
          desc: 'Dedicated socket at allotted cellar parking bay.',
          icon: Building
        },
        {
          value: 'apartmentNoSocket' as const,
          label: 'Apartment without Socket',
          desc: 'Requires Removable Battery to carry upstairs and charge in flat.',
          icon: Battery
        },
        {
          value: 'publicChargingOnly' as const,
          label: 'Public Fast Charging Network',
          desc: 'Relying on commercial DC fast chargers (CCS2 / OEM hubs).',
          icon: Zap
        }
      ]
    },
    {
      stepNumber: 3,
      title: 'Primary Riding Priority',
      question: 'What is your most important requirement from your EV?',
      description: 'Aligns the motor dynamics, chassis ergonomics and utility storage.',
      key: 'primaryUse' as const,
      options: [
        {
          value: 'familyStorage' as const,
          label: 'Family Utility & Big Boot Space',
          desc: 'Large seat, 30L+ boot for groceries/dual helmets (e.g. Rizta, Indie).',
          icon: Briefcase
        },
        {
          value: 'performanceSpeed' as const,
          label: 'High Speed & Sport Dynamics',
          desc: 'Rapid 0-40 sprint, 100+ km/h speed, naked motorcycle / hyper scooter.',
          icon: Rocket
        },
        {
          value: 'techFeatures' as const,
          label: 'Smart Tech & Touchscreen Maps',
          desc: 'Built-in navigation, cruise control, digital key, OTA updates.',
          icon: Sparkles
        },
        {
          value: 'maximumRange' as const,
          label: 'Maximum Highway Touring Range',
          desc: 'Large battery capacity (4+ kWh) with 150+ km real city range.',
          icon: Gauge
        }
      ]
    },
    {
      stepNumber: 4,
      title: 'Budget Range',
      question: 'What is your intended budget for the electric two-wheeler?',
      description: 'Filters models by net Telangana on-road price after G.O. Ms No. 41 tax waiver.',
      key: 'budget' as const,
      options: [
        {
          value: 'under1L' as const,
          label: 'Budget (< ₹1.00 Lakh)',
          desc: 'Entry commuter EVs (Revolt RV1, E-Luna, S1X, Chetak 2901).',
          icon: TrendingDown
        },
        {
          value: '1to1.4L' as const,
          label: 'Mid-Range (₹1.00L – ₹1.40L)',
          desc: 'Most popular segment (Ather Rizta, TVS iQube, Ola Roadster X).',
          icon: Package
        },
        {
          value: '1.4to1.8L' as const,
          label: 'Premium (₹1.40L – ₹1.80L)',
          desc: 'High-spec flagship EVs (Ather 450X 3.7, Ola S1 Pro, Chetak Premium).',
          icon: Palette
        },
        {
          value: 'above1.8L' as const,
          label: 'Performance & Luxury (> ₹1.80L)',
          desc: 'High-voltage superbikes (Ultraviolette F77, Ola Roadster Pro).',
          icon: Rocket
        }
      ]
    }
  ];

  const currentStepConfig = stepsConfig[step - 1];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto bg-stone-900/60 backdrop-blur-md animate-fadeIn text-stone-900 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:pt-4 sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-modal-title"
    >
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[100dvh] sm:max-h-[92vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-stone-50/90 border-b border-stone-200 backdrop-blur-md flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="wizard-modal-title" className="text-base sm:text-lg font-bold text-stone-900 leading-tight truncate">
                Smart Buyer Recommendation Quiz
              </h2>
              <p className="text-xs text-stone-500 font-medium truncate">
                Find your best-fit EV in 4 quick steps based on commute &amp; charging access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {step === 5 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-2.5 min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake</span>
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5">
          <div 
            className="bg-stone-900 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-6">
          {step <= 4 && currentStepConfig && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Step {step} of 4: {currentStepConfig.title}
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-1">
                  {currentStepConfig.question}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {currentStepConfig.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {currentStepConfig.options.map((opt) => {
                  const isSelected = answers[currentStepConfig.key] === opt.value;
                  const IconComponent = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setAnswers(prev => ({ ...prev, [currentStepConfig.key]: opt.value }));
                      }}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                          : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-stone-800 text-white' : 'bg-white text-stone-700 border border-stone-200'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>

                      <div>
                        <span className={`text-sm font-bold block ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] mt-1 block ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                          {opt.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Recommendation Results */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Match Complete
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">
                  Your Top Recommended Electric Two-Wheelers
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Scored based on your commute, apartment socket setup, and budget preferences in Telangana.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3.map((rec, idx) => {
                  const price = calculateTelanganaOnRoadPrice(rec.model, selectedRtoCode);
                  const compared = isCompared(rec.model.id);
                  const reasons = rec.matchingReasons || [];
                  return (
                    <div 
                      key={rec.model.id}
                      className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between relative shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-900 text-white">
                          #{idx + 1} Best Match ({rec.matchScore}%)
                        </span>
                        <span className="text-[10px] text-stone-500 uppercase font-bold">
                          {rec.model.category === 'motorcycle' ? '🏍️ Motorcycle' : '🛵 Scooter'}
                        </span>
                      </div>

                      <div className="h-32 rounded-xl overflow-hidden bg-stone-900 mb-3 flex items-center justify-center border border-stone-200">
                        <VehicleImage 
                          model={rec.model} 
                          className="w-full h-full"
                        />
                      </div>

                      <div className="mb-3">
                        <span className="text-[10px] font-bold uppercase text-stone-500">{rec.model.brand}</span>
                        <h4 className="text-sm font-bold text-stone-900 truncate">{rec.model.name}</h4>
                        <div className="text-base font-black font-mono text-stone-900 mt-1">
                          {formatINR(price.totalTelanganaOnRoadPrice)}
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {rec.model.specs.realWorldCityRangeKm} km city range • {rec.model.specs.batteryCapacityKwh} kWh
                        </span>
                      </div>

                      <div className="space-y-1 mb-4 text-[11px] text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200">
                        {reasons.slice(0, 2).map((r, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          onClick={() => {
                            openDetail(rec.model.id);
                            handleClose();
                          }}
                          className="py-2.5 min-h-[44px] px-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
                        >
                          Specs
                        </button>

                        <button
                          onClick={() => toggleCompare(rec.model.id)}
                          className={`py-2.5 min-h-[44px] px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            compared
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-900 hover:bg-stone-800 text-white'
                          }`}
                        >
                          {compared ? 'Added ✓' : '+ Compare'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:px-6 border-t border-stone-200 bg-stone-50/90 flex flex-wrap items-center justify-between gap-2">
          {step > 1 && step <= 4 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-2.5 min-h-[44px] rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          )}

          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={() => setStep(5)}
              className="ml-auto flex items-center gap-1.5 px-6 py-2.5 min-h-[44px] rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>See My Matches</span>
            </button>
          )}

          {step === 5 && (
            <button
              onClick={() => {
                openCompare();
                handleClose();
              }}
              className="ml-auto flex items-center gap-1.5 px-6 py-2.5 min-h-[44px] rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Open Comparison Matrix</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartWizardModal;
