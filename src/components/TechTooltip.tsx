import React from 'react';
import { Info, Zap, ShieldCheck, Cpu, PlugZap } from 'lucide-react';
import { getTechTopicById } from '../data/evTechKnowledge';

interface TechTooltipProps {
  topicId: string;
  label?: string;
  onOpenTopicModal?: (topicId: string) => void;
  className?: string;
  variant?: 'badge' | 'inline' | 'icon-only';
}

export const TechTooltip: React.FC<TechTooltipProps> = ({
  topicId,
  label,
  onOpenTopicModal,
  className = '',
  variant = 'badge'
}) => {
  const topic = getTechTopicById(topicId);
  if (!topic) return null;

  const displayLabel = label || topic.badgeLabel;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenTopicModal) {
      onOpenTopicModal(topicId);
    }
  };

  const getIcon = () => {
    switch (topic.pillar) {
      case 'charging_ports':
        return <PlugZap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />;
      case 'battery_thermal':
        return <ShieldCheck className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />;
      case 'motor_drivetrain':
        return <Cpu className="w-3 h-3 text-amber-600 dark:text-amber-400" />;
      case 'safety_regen':
        return <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />;
      default:
        return <Info className="w-3 h-3 text-slate-500" />;
    }
  };

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={`Learn about ${topic.title}`}
        className={`inline-flex items-center justify-center p-1 rounded-full bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700 ${className}`}
      >
        {getIcon()}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Click to read engineering guide: ${topic.title}`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100/90 hover:bg-emerald-50 dark:bg-slate-800/80 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all cursor-pointer group shadow-xs ${className}`}
    >
      {getIcon()}
      <span>{displayLabel}</span>
      <Info className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5 text-emerald-600 dark:text-emerald-400" />
    </button>
  );
};
