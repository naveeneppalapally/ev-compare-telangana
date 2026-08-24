/**
 * Type definitions for EV Technology Guide & Contextual Explainers
 */

export type TechPillar =
  | 'charging_ports'
  | 'battery_thermal'
  | 'motor_drivetrain'
  | 'safety_regen';

export interface TechComparisonRow {
  parameter: string;
  optionA: {
    title: string;
    description: string;
    prosOrHighlights: string[];
  };
  optionB: {
    title: string;
    description: string;
    prosOrHighlights: string[];
  };
}

export interface TechTopic {
  id: string;
  pillar: TechPillar;
  title: string;
  subtitle: string;
  shortDefinition: string;
  engineeringExplanation: string[];
  telanganaContextNote: string;
  bulletPoints: string[];
  comparison?: TechComparisonRow;
  idealForAudience: string;
  exampleVehicleModelIds: string[];
  badgeLabel: string;
  iconName: string;
}
