import React from 'react';
import { WatermarkSettings } from '../../types';
import { SatyaGyanaLogo } from './SatyaGyanaLogo';

interface SatyaGyanWatermarkProps {
  settings: WatermarkSettings;
  className?: string;
  compact?: boolean;
}

export const SatyaGyanWatermark: React.FC<SatyaGyanWatermarkProps> = ({ settings, className = '', compact = false }) => {
  // Determine positioning classes with safe margins so it never covers content
  const getPositionClasses = () => {
    switch (settings.position) {
      case 'top-left':
        return 'top-3 left-3 md:top-4 md:left-4';
      case 'bottom-left':
        return 'bottom-3 left-3 md:bottom-4 md:left-4';
      case 'bottom-right':
        return 'bottom-3 right-3 md:bottom-4 md:right-4';
      case 'top-right':
      default:
        return 'top-3 right-3 md:top-4 md:right-4';
    }
  };

  const displayMode = settings.displayMode || 'both';
  const logoShape = settings.logoShape || 'circle';

  return (
    <div
      id="satya-gyan-watermark"
      className={`absolute z-30 pointer-events-none select-none transition-all duration-300 ${getPositionClasses()} ${className}`}
      style={{
        opacity: Math.max(0.2, settings.opacity),
        transform: `scale(${settings.scale || 1})`,
        transformOrigin: settings.position.includes('right') ? 'right top' : 'left top',
      }}
    >
      {/* 1. Logo Only Mode */}
      {displayMode === 'logo-only' && (
        <div
          className={`flex items-center justify-center p-1.5 bg-slate-950/80 backdrop-blur-md border border-sky-500/30 shadow-xl ${
            logoShape === 'circle' ? 'rounded-full' : 'rounded-xl'
          }`}
          title="SatyaGyana Crest (Logo Only)"
        >
          {settings.useCustomLogo && settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="SatyaGyana Logo"
              className={`w-7 h-7 md:w-8 md:h-8 object-contain shadow-sm ${logoShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <SatyaGyanaLogo size="sm" variant="icon-only" shape={logoShape} />
          )}
        </div>
      )}

      {/* 2. Text Only Mode */}
      {displayMode === 'text-only' && (
        <div className="flex flex-col px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-sky-500/25 shadow-xl text-white">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-[11px] md:text-xs tracking-tight text-white font-sans">
              Satya<span className="text-sky-400">Gyana</span>
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          </div>
          {settings.showTagline && (
            <span className="text-[7.5px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              {settings.tagline || 'LEARN • GROW • SUCCEED'}
            </span>
          )}
        </div>
      )}

      {/* 3. Both Logo & Text Mode */}
      {displayMode === 'both' && (
        <div
          className={`flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-slate-950/80 backdrop-blur-md border border-sky-500/25 shadow-xl text-white ${
            logoShape === 'circle' ? 'rounded-xl' : 'rounded-lg'
          }`}
        >
          {settings.useCustomLogo && settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="SatyaGyana Logo"
              className={`w-6 h-6 md:w-7 md:h-7 object-contain shadow-sm ${logoShape === 'circle' ? 'rounded-full' : 'rounded-md'}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <SatyaGyanaLogo size="sm" variant="icon-only" shape={logoShape} />
          )}

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-[11px] md:text-xs tracking-tight text-white font-sans">
                Satya<span className="text-sky-400">Gyana</span>
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            </div>
            {settings.showTagline && (
              <span className="text-[7.5px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                {settings.tagline || 'LEARN • GROW • SUCCEED'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

