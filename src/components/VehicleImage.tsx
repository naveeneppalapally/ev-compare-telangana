import React, { useState } from 'react';
import type { EVModel } from '../types/ev';
import {
  generateVehicleSilhouetteSvg,
  getAccessibleVehicleAlt,
  getVehicleDesignSilhouette,
  getArchetypeLabel
} from '../utils/vehicleImagery';
import { Battery } from 'lucide-react';

export interface VehicleImageProps {
  model: EVModel;
  className?: string;
  imageClassName?: string;
  alt?: string;
  priority?: boolean;
  showBadge?: boolean;
  showCategoryBadge?: boolean;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  objectFit?: 'cover' | 'contain';
  onLoad?: () => void;
  onError?: () => void;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  model,
  className = '',
  imageClassName = '',
  alt,
  priority = false,
  showBadge = false,
  showCategoryBadge = false,
  aspectRatio = 'auto',
  objectFit = 'cover',
  onLoad,
  onError,
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const fallbackSvg = generateVehicleSilhouetteSvg(model);
  const accessibleAlt = alt || getAccessibleVehicleAlt(model);
  const archetype = getVehicleDesignSilhouette(model);
  const archetypeLabel = getArchetypeLabel(archetype);

  // Progressive image source ladder:
  // 1. Local downloaded high-res photo: `/images/vehicles/${model.id}.jpg`
  // 2. Direct verified OEM CDN URL: `model.imageUrl`
  // 3. Crisp SVG silhouette blueprint
  let imageSource = `/images/vehicles/${model.id}.jpg`;
  if (errorCount === 1) {
    imageSource = model.imageUrl || fallbackSvg;
  } else if (errorCount >= 2) {
    imageSource = fallbackSvg;
  }

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : '';

  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';

  const handleImageError = () => {
    setErrorCount(prev => prev + 1);
    if (onError) onError();
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 flex items-center justify-center ${aspectClass} ${className}`}
    >
      {/* Loading Skeleton Placeholder */}
      {!isLoaded && errorCount < 2 && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-400 border-t-neutral-900 animate-spin" />
        </div>
      )}

      {/* Main Authentic Vehicle Photo */}
      <img
        key={imageSource}
        src={imageSource}
        alt={accessibleAlt}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`w-full h-full ${fitClass} object-center transition-all duration-300 ${
          isLoaded || errorCount >= 2 ? 'opacity-100' : 'opacity-0'
        } ${imageClassName}`}
      />

      {/* Optional Top Category Badge */}
      {showCategoryBadge && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-md text-[10px] font-bold text-white border border-neutral-700 shadow-xs">
          <span>{model.category === 'motorcycle' ? '🏍️' : '🛵'}</span>
          <span>{archetypeLabel}</span>
        </div>
      )}

      {/* Optional Battery Badge Overlay */}
      {showBadge && (
        <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 text-[11px] font-mono font-bold text-white shadow-xs">
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {model.isIceBenchmark
              ? '109.5cc Petrol ICE'
              : `${model.specs.batteryCapacityKwh} kWh • ${model.specs.batteryChemistry}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default VehicleImage;
