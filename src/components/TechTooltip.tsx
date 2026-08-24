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
        return <PlugZap className="w-3 h-3 text-neutral-700" />;
      case 'battery_thermal':
        return <ShieldCheck className="w-3 h-3 text-neutral-700" />;
      case 'motor_drivetrain':
        return <Cpu className="w-3 h-3 text-neutral-700" />;
      case 'safety_regen':
        return <Zap className="w-3 h-3 text-neutral-700" />;
      default:
        return <Info className="w-3 h-3 text-neutral-500" />;
    }
  };

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={`Learn about ${topic.title}`}
        className={`inline-flex items-center justify-center p-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 transition border border-neutral-200 ${className}`}
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
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 hover:border-neutral-300 transition cursor-pointer group shadow-2xs ${className}`}
    >
      {getIcon()}
      <span>{displayLabel}</span>
      <Info className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 transition-opacity ml-0.5 text-neutral-500" />
    </button>
  );
};
