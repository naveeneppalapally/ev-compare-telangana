import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { EVModel } from '../types/ev';
import { VehicleImage } from './VehicleImage';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

export interface ColourVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: EVModel;
  initialColourIndex?: number;
}

export const ColourVisualizerModal: React.FC<ColourVisualizerModalProps> = ({
  isOpen,
  onClose,
  model,
  initialColourIndex = 0,
}) => {
  const colours = model.colorOptions ?? [];
  const hasColours = colours.length > 0;

  const [activeIndex, setActiveIndex] = useState(initialColourIndex);

  // Sync when opened or initial index changes
  useEffect(() => {
    if (isOpen) {
      const clamped = Math.max(0, Math.min(initialColourIndex ?? 0, Math.max(0, colours.length - 1)));
      setActiveIndex(clamped);
    }
  }, [isOpen, initialColourIndex, colours.length]);

  const selectedColour = hasColours ? colours[activeIndex] ?? colours[0] : null;
  const total = colours.length;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, goNext, goPrev]);

  // Lock scroll while open (detail modal already locks, but ensure for direct usage)
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || 'unset';
    };
  }, [isOpen]);

  // Swipe / drag handling
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only consider horizontal swipe if more horizontal than vertical
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    isDragging.current = false;
    dragStartX.current = null;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    dragStartX.current = null;
  };

  if (!isOpen || !model) return null;

  const fallbackHex = selectedColour?.hex ?? '#111827';
  const fallbackName = selectedColour?.name ?? 'Standard';

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md animate-fadeIn flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`${model.brand} ${model.name} colour visualizer`}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-paper border-b border-quartzite shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-5 h-5 rounded-full border border-quartzite shrink-0 shadow-xs"
            style={{ backgroundColor: fallbackHex }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-widest uppercase text-stone-500 leading-none">
              {model.brand} · {model.name}
            </p>
            <p className="text-sm font-extrabold text-ink leading-tight truncate">
              {fallbackName}
              <span className="ml-2 text-[10px] font-medium text-stone-400 bg-white border border-quartzite px-1.5 py-0.5 rounded-full align-middle">
                indicative
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {hasColours && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-ink text-white text-xs font-mono font-bold">
              {activeIndex + 1} of {total}
            </span>
          )}
          <span className="sm:hidden inline-flex items-center px-2 py-1 rounded-full bg-ink text-white text-[11px] font-mono font-bold">
            {activeIndex + 1}/{total}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white border border-quartzite text-ink hover:bg-stone-50 hover:border-stone-300 transition cursor-pointer"
            aria-label="Close colour visualizer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-12 py-6 sm:py-8 min-h-0 overflow-hidden">
        {/* Left arrow */}
        {total > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-paper border border-quartzite text-ink hover:bg-white hover:border-stone-300 shadow-lg flex items-center justify-center transition cursor-pointer z-20"
            aria-label="Previous colour"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Image container — 930×620 */}
        <div
          className="relative w-full max-w-[930px] aspect-[930/620] rounded-2xl overflow-hidden bg-white border border-quartzite shadow-2xl flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          role="img"
          aria-label={`${model.name} in ${fallbackName}`}
        >
          <VehicleImage
            model={model}
            colorName={selectedColour ? selectedColour.name : null}
            className="w-full h-full"
            objectFit="contain"
            priority
          />

          {/* Swipe hint overlay — subtle */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/80 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
            <Expand className="w-3 h-3 text-white/70" />
            <span>Drag or swipe</span>
          </div>
        </div>

        {/* Right arrow */}
        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-milestone border border-milestone text-white hover:bg-[#0077ed] shadow-lg flex items-center justify-center transition cursor-pointer z-20"
            aria-label="Next colour"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2">
            {colours.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to colour ${idx + 1} of ${total}: ${colours[idx].name}`}
                aria-current={idx === activeIndex}
                className={`transition-all cursor-pointer ${
                  idx === activeIndex
                    ? 'w-7 h-2.5 rounded-full bg-milestone'
                    : 'w-2.5 h-2.5 rounded-full bg-white/70 hover:bg-white border border-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Active colour meta under dots (mobile extra) */}
        <p className="mt-3 text-xs font-medium text-white/80 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: fallbackHex }} aria-hidden="true" />
          <span className="font-bold text-white">{fallbackName}</span>
          <span className="text-white/50">·</span>
          <span className="font-mono text-white/70">{fallbackHex.toUpperCase()}</span>
        </p>
      </div>

      {/* Bottom bar — swatches */}
      <div className="relative z-10 bg-paper border-t border-quartzite px-4 sm:px-6 py-4 shrink-0">
        <div className="max-w-[930px] mx-auto">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-[11px] font-bold tracking-widest uppercase text-stone-500">
              All colours · Tap to view
            </p>
            <p className="text-[11px] font-mono font-semibold text-ink flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-signal" aria-hidden="true" />
              {total} {total === 1 ? 'option' : 'options'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-1 no-scrollbar">
            {colours.map((c, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={`${c.name}-${idx}`}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Select ${c.name}`}
                  aria-pressed={isActive}
                  title={c.name}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-full border transition shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-ink border-ink text-white shadow-md'
                      : 'bg-white border-quartzite text-ink hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border shrink-0 transition ${
                      isActive ? 'border-white/20 ring-1 ring-white/30' : 'border-stone-200 group-hover:border-stone-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-hidden="true"
                  />
                  <span className={`text-xs font-semibold whitespace-nowrap ${isActive ? 'text-white' : 'text-ink'}`}>
                    {c.name}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-signal shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
            {!hasColours && (
              <span className="text-xs text-stone-500">No colour options available for this model.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColourVisualizerModal;
