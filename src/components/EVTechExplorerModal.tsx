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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Electric Two-Wheeler Technology Guide
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Engineering Deep-Dive
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Understand On-Board Chargers, LFP vs NMC chemistries, liquid cooling, and drivetrain architectures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pillar Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50 px-4 py-2 gap-2 scrollbar-none">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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
          <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 pt-1">
              Modules in this Pillar
            </h3>
            {pillarTopics.map(t => {
              const isSelected = selectedTopicId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 border cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20'
                      : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {t.shortDefinition}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Content View */}
          <div className="md:col-span-8 p-5 sm:p-7 space-y-6 overflow-y-auto">
            {/* Title Block */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Info className="w-3.5 h-3.5" />
                <span>{currentTopic.badgeLabel}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentTopic.title}
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {currentTopic.subtitle}
              </p>
            </div>

            {/* Short Definition Callout */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              💡 <span className="font-bold text-slate-900 dark:text-white">Quick Summary: </span>
              {currentTopic.shortDefinition}
            </div>

            {/* Engineering Deep-Dive Paragraphs */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>How the Engineering Works</span>
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentTopic.engineeringExplanation.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Telangana Climate Context Alert */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  Telangana Real-World Climate & Highway Context
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
                  {currentTopic.telanganaContextNote}
                </p>
              </div>
            </div>

            {/* Comparison Table / Matrix if available */}
            {currentTopic.comparison && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-cyan-500" />
                  <span>Head-to-Head Comparison: {currentTopic.comparison.parameter}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option A */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-900/60 pb-2">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        {currentTopic.comparison.optionA.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {currentTopic.comparison.optionA.description}
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                      {currentTopic.comparison.optionA.prosOrHighlights.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Option B */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {currentTopic.comparison.optionB.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {currentTopic.comparison.optionB.description}
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                      {currentTopic.comparison.optionB.prosOrHighlights.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Key Technical Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentTopic.bulletPoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalog Vehicles featuring this technology */}
            {currentTopic.exampleVehicleModelIds.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
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
                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`/images/vehicles/${vehicle.id}.jpg`}
                            alt={vehicle.name}
                            className="w-12 h-9 object-contain rounded-md bg-white p-0.5 border border-slate-100 dark:border-slate-700"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {vehicle.name}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
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
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 transition-colors text-xs font-semibold"
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
