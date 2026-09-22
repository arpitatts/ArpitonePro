import React from 'react';
import { WatermarkSettings } from '../../types';
import { BookOpen } from 'lucide-react';

interface SatyaGyanBackgroundWatermarkProps {
  settings: WatermarkSettings;
  className?: string;
  variant?: 'single-center' | 'diagonal-repeat' | 'subtle-seal';
}

export const SatyaGyanBackgroundWatermark: React.FC<SatyaGyanBackgroundWatermarkProps> = ({
  settings,
  className = '',
  variant = 'single-center',
}) => {
  if (settings.enableDocumentBackgroundWatermark === false) {
    return null;
  }

  const opacity = Math.min(0.25, Math.max(0.03, settings.documentWatermarkOpacity ?? 0.08));
  const scale = settings.documentWatermarkScale ?? 0.85;
  const angle = settings.documentWatermarkAngle ?? -22;
  const customImg = settings.documentWatermarkUrl;
  const brandText = settings.documentWatermarkText || 'Satya Gyan • सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ';

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center ${className}`}
      style={{ opacity }}
    >
      {customImg ? (
        // Custom Uploaded Watermark Image
        <div
          className="flex flex-col items-center justify-center transition-transform duration-300"
          style={{
            transform: `rotate(${angle}deg) scale(${scale})`,
          }}
        >
          <img
            src={customImg}
            alt="SatyaGyan Background Watermark"
            className="max-w-[420px] max-h-[420px] object-contain filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="mt-2 text-center text-xs font-serif font-bold tracking-[0.25em] text-slate-400 uppercase">
            {brandText}
          </div>
        </div>
      ) : variant === 'diagonal-repeat' ? (
        // Repeating Diagonal Watermark Grid across the page
        <div
          className="w-[180%] h-[180%] flex flex-col justify-around rotate-[-25deg] text-slate-300 select-none"
        >
          {Array.from({ length: 7 }).map((_, rIdx) => (
            <div key={rIdx} className="flex justify-around items-center whitespace-nowrap gap-12 font-serif font-black text-sm tracking-[0.3em] uppercase">
              {Array.from({ length: 5 }).map((_, cIdx) => (
                <div key={cIdx} className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 opacity-50" />
                  <span>Satya Gyan</span>
                  <span className="text-[10px] tracking-normal font-sans opacity-70">• सत्य ज्ञान •</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        // Master Academic Single-Center Watermark Emblem
        <div
          className="flex flex-col items-center justify-center text-center p-8 rounded-full border-[6px] border-dashed border-slate-400/25 transition-transform duration-300"
          style={{
            transform: `rotate(${angle}deg) scale(${scale})`,
            width: '440px',
            height: '440px',
          }}
        >
          <div className="w-24 h-24 rounded-full border-4 border-slate-400/40 flex items-center justify-center mb-3">
            <BookOpen className="w-14 h-14 text-slate-300 stroke-[1.5]" />
          </div>

          <div className="text-3xl font-serif font-black tracking-[0.2em] text-slate-200 uppercase">
            SATYA GYAN
          </div>

          <div className="text-sm font-sans font-bold tracking-widest text-slate-300 mt-1">
            सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ
          </div>

          <div className="mt-3 text-[11px] font-mono tracking-[0.25em] text-slate-400 uppercase border-t border-b border-slate-400/30 py-1 px-4">
            AUTHENTIC ACADEMIC RESOURCE • ARPITON
          </div>

          <div className="text-[9px] font-sans font-semibold text-slate-400/80 tracking-wider mt-2">
            LEARN • GROW • SUCCEED • FOR STUDENTS WORLDWIDE
          </div>
        </div>
      )}
    </div>
  );
};
