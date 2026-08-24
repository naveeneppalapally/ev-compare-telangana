import React, { useState } from 'react';
import {
  X,
  Zap,
  PlugZap,
  ShieldCheck,
  Cpu,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
  Flame,
  Layers,
  Award
} from 'lucide-react';
import { EV_TECH_TOPICS, getTechTopicById } from '../data/evTechKnowledge';
import type { TechPillar, TechTopic } from '../types/techExplainer';
import { getEVModelById } from '../data/evModels';

interface EVTechExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopicId?: string | null;
  onSelectVehicle?: (vehicleId: string) => void;
}

export const EVTechExplorerModal: React.FC<EVTechExplorerModalProps> = ({
  isOpen,
  onClose,
  initialTopicId,
  onSelectVehicle
}) => {
  const [activePillar, setActivePillar] = useState<TechPillar>('charging_ports');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || 'tech-onboard-charger'
  );

  React.useEffect(() => {
    if (initialTopicId) {
      const topic = getTechTopicById(initialTopicId);
      if (topic) {
        setActivePillar(topic.pillar);
        setSelectedTopicId(initialTopicId);
      }
    }
  }, [initialTopicId]);

  if (!isOpen) return null;

  const currentTopic: TechTopic =
    getTechTopicById(selectedTopicId) || EV_TECH_TOPICS[0];

  const pillarTopics = EV_TECH_TOPICS.filter(t => t.pillar === activePillar);

  const pillars: Array<{ id: TechPillar; label: string; icon: React.ReactNode }> = [
    {
      id: 'charging_ports',
      label: '1. Charging & Ports',
      icon: <PlugZap className="w-4 h-4" />
    },
    {
      id: 'battery_thermal',
      label: '2. Battery & Thermals',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      id: 'motor_drivetrain',
      label: '3. Motor & Drivetrain',
      icon: <Cpu className="w-4 h-4" />
    },
    {
      id: 'safety_regen',
      label: '4. Braking & Safety',
      icon: <Zap className="w-4 h-4" />
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-md animate-fadeIn text-neutral-900"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-50/90 border-b border-neutral-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                  Electric Two-Wheeler Technology Guide
                </h2>
                <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800">
                  Engineering Deep-Dive
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Understand On-Board Chargers, LFP vs NMC chemistries, liquid cooling, and drivetrain architectures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pillar Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-neutral-200 bg-neutral-100/70 p-2 gap-2 scrollbar-none">
          {pillars.map(p => {
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePillar(p.id);
                  const firstTopic = EV_TECH_TOPICS.find(t => t.pillar === p.id);
                  if (firstTopic) setSelectedTopicId(firstTopic.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/80'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Body with Sidebar + Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          {/* Subtopics List Sidebar */}
          <div className="md:col-span-4 border-r border-neutral-200 bg-neutral-50/80 p-3 space-y-1.5 overflow-y-auto">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 pt-1">
              Modules in this Pillar
            </h3>
            {pillarTopics.map(t => {
              const isSelected = selectedTopicId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`w-full text-left p-3 rounded-2xl transition flex flex-col gap-1 border cursor-pointer ${
                    isSelected
                      ? 'bg-white border-neutral-300 shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-neutral-900 font-extrabold' : 'text-neutral-800'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                    {t.shortDefinition}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Content View */}
          <div className="md:col-span-8 p-5 sm:p-6 space-y-5 overflow-y-auto bg-white">
            {/* Title Block */}
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-semibold">
                <Info className="w-3.5 h-3.5 text-neutral-600" />
                <span>{currentTopic.badgeLabel}</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                {currentTopic.title}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-neutral-600">
                {currentTopic.subtitle}
              </p>
            </div>

            {/* Short Definition Callout */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
              💡 <span className="font-bold text-neutral-900">Quick Summary: </span>
              {currentTopic.shortDefinition}
            </div>

            {/* Engineering Deep-Dive Paragraphs */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-700" />
                <span>How the Engineering Works</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {currentTopic.engineeringExplanation.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Telangana Climate Context Alert */}
            <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-start gap-3">
              <Flame className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Telangana Real-World Climate &amp; Highway Context
                </h4>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  {currentTopic.telanganaContextNote}
                </p>
              </div>
            </div>

            {/* Comparison Table / Matrix if available */}
            {currentTopic.comparison && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Head-to-Head Comparison: {currentTopic.comparison.parameter}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                    <div className="border-b border-neutral-200 pb-1.5">
                      <span className="text-xs font-bold text-neutral-900">
                        {currentTopic.comparison.optionA.title}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      {currentTopic.comparison.optionA.description}
                    </p>
                    <ul className="space-y-1 text-xs text-neutral-700">
                      {currentTopic.comparison.optionA.prosOrHighlights.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Option B */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                    <div className="border-b border-neutral-200 pb-1.5">
                      <span className="text-xs font-bold text-neutral-900">
                        {currentTopic.comparison.optionB.title}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      {currentTopic.comparison.optionB.description}
                    </p>
                    <ul className="space-y-1 text-xs text-neutral-700">
                      {currentTopic.comparison.optionB.prosOrHighlights.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Key Advantages Bullet List */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Key Technical Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentTopic.bulletPoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalog Vehicles featuring this technology */}
            {currentTopic.exampleVehicleModelIds.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Catalog Vehicles with this Technology</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTopic.exampleVehicleModelIds.map(modelId => {
                    const vehicle = getEVModelById(modelId);
                    if (!vehicle) return null;
                    return (
                      <div
                        key={modelId}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={`/images/vehicles/${vehicle.id}.jpg`}
                            alt={vehicle.name}
                            className="w-12 h-9 object-contain rounded-md bg-neutral-50 p-0.5 border border-neutral-200"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="text-xs font-bold text-neutral-900">
                              {vehicle.name}
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              {vehicle.brand} • {vehicle.specs.batteryCapacityKwh} kWh • {vehicle.specs.topSpeedKmh} km/h
                            </div>
                          </div>
                        </div>
                        {onSelectVehicle && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectVehicle(vehicle.id);
                            }}
                            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition cursor-pointer"
                            title="View Vehicle Specs"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
