import React from 'react';

interface SatyaGyanaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'text-only' | 'badge';
  shape?: 'circle' | 'squircle';
  className?: string;
  showTagline?: boolean;
}

export const SatyaGyanaLogo: React.FC<SatyaGyanaLogoProps> = ({
  size = 'md',
  variant = 'full',
  shape = 'circle',
  className = '',
  showTagline = true,
}) => {
  // Dimensions mapping
  const sizeMap = {
    sm: { icon: 28, text: 'text-xs', sub: 'text-[7px]' },
    md: { icon: 40, text: 'text-sm', sub: 'text-[9px]' },
    lg: { icon: 56, text: 'text-lg', sub: 'text-[11px]' },
    xl: { icon: 84, text: 'text-2xl', sub: 'text-xs' },
  };

  const { icon, text, sub } = sizeMap[size];

  // Pure SVG reproduction of the exact SatyaGyana logo uploaded by the user:
  // - Dark rounded squircle or perfect circle background
  // - Open book with white layered pages
  // - Electric blue circuit traces with circular nodes
  // - Vertical glowing cyan arrow pointing up from spine
  // - White "Satya" + Cyan "Gyana"
  // - "— LEARN • GROW • SUCCEED —"
  const renderIconSvg = () => (
    <svg
      width={icon}
      height={icon}
      viewBox="0 0 192 192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-md select-none ${shape === 'circle' ? 'rounded-full' : 'rounded-2xl'}`}
    >
      <defs>
        {/* Background dark navy gradient */}
        <linearGradient id="bg-grad" x1="0" y1="0" x2="192" y2="192" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#08142c" />
          <stop offset="50%" stopColor="#040b18" />
          <stop offset="100%" stopColor="#02050e" />
        </linearGradient>

        {/* Upward arrow cyan glow */}
        <radialGradient id="arrow-glow" cx="96" cy="70" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00b4d8" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#0077b6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#03045e" stopOpacity="0" />
        </radialGradient>

        {/* Arrow gradient */}
        <linearGradient id="arrow-grad" x1="96" y1="120" x2="96" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0077b6" />
          <stop offset="50%" stopColor="#00b4d8" />
          <stop offset="100%" stopColor="#90e0ef" />
        </linearGradient>

        {/* Page shadow gradient */}
        <linearGradient id="page-depth" x1="96" y1="130" x2="96" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Circuit electric blue */}
        <linearGradient id="circuit-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00c2ff" />
          <stop offset="100%" stopColor="#0072ff" />
        </linearGradient>
      </defs>

      {/* Container with border: Circle or Squircle */}
      {shape === 'circle' ? (
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="url(#bg-grad)"
          stroke="#1e293b"
          strokeWidth="2.5"
        />
      ) : (
        <rect
          x="6"
          y="6"
          width="180"
          height="180"
          rx="46"
          fill="url(#bg-grad)"
          stroke="#1e293b"
          strokeWidth="2.5"
        />
      )}

      {/* Arrow Ambient Glow behind book */}
      <circle cx="96" cy="68" r="42" fill="url(#arrow-glow)" />

      {/* 3D Bottom Page Layers (Grey pages edge) */}
      <path
        d="M 36 122 C 55 120 78 126 96 134 C 114 126 137 120 156 122 L 152 114 C 134 112 114 118 96 126 C 78 118 58 112 40 114 Z"
        fill="#64748b"
        opacity="0.8"
      />
      <path
        d="M 40 115 C 58 113 78 119 96 127 C 114 119 134 113 152 115 L 148 107 C 132 105 113 111 96 119 C 79 111 60 105 44 107 Z"
        fill="#94a3b8"
        opacity="0.9"
      />

      {/* Left White Book Page */}
      <path
        d="M 94 123 C 78 115 58 110 42 112 L 48 58 C 64 58 80 64 94 72 Z"
        fill="#ffffff"
      />
      {/* Right White Book Page */}
      <path
        d="M 98 123 C 114 115 134 110 150 112 L 144 58 C 128 58 112 64 98 72 Z"
        fill="#ffffff"
      />

      {/* Center Spine Shadow Divider */}
      <path d="M 95 68 L 95 124 L 97 124 L 97 68 Z" fill="#cbd5e1" />

      {/* Left Page Electric Blue Circuit Traces */}
      {/* Trace 1 */}
      <path
        d="M 88 115 C 80 110 72 105 70 94 L 70 78"
        stroke="#0084ff"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="70" cy="76" r="3.6" fill="#0084ff" />

      {/* Trace 2 */}
      <path
        d="M 82 118 C 68 112 60 104 58 92"
        stroke="#0084ff"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="58" cy="90" r="3.6" fill="#0084ff" />

      {/* Right Page Electric Blue Circuit Traces */}
      {/* Trace 1 */}
      <path
        d="M 104 115 C 112 110 120 105 122 94 L 122 78"
        stroke="#0084ff"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="122" cy="76" r="3.6" fill="#0084ff" />

      {/* Trace 2 */}
      <path
        d="M 110 118 C 124 112 132 104 134 92"
        stroke="#0084ff"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="134" cy="90" r="3.6" fill="#0084ff" />

      {/* Upward Growth Arrow (Spine to Sky) */}
      {/* Arrow Shaft */}
      <rect x="93" y="52" width="6" height="74" rx="2" fill="url(#arrow-grad)" />
      {/* Arrow Head */}
      <path
        d="M 96 36 L 109 54 L 83 54 Z"
        fill="#00b4d8"
        stroke="#90e0ef"
        strokeWidth="1.2"
      />

      {/* Small inner spine glow dot */}
      <circle cx="96" cy="122" r="2.5" fill="#38bdf8" />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{renderIconSvg()}</div>;
  }

  if (variant === 'text-only') {
    return (
      <div className={`inline-flex flex-col select-none text-left ${className}`}>
        <div className="flex items-center tracking-tight leading-none">
          <span className={`font-black text-white ${text} font-sans`}>Satya</span>
          <span className={`font-black text-sky-400 ${text} font-sans ml-[1px]`}>Gyana</span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-2.5 h-[1px] bg-slate-600 inline-block" />
            <span className={`font-bold uppercase tracking-wider text-slate-400 ${sub} font-sans`}>
              LEARN <span className="text-sky-400">•</span> GROW <span className="text-sky-400">•</span> SUCCEED
            </span>
            <span className="w-2.5 h-[1px] bg-slate-600 inline-block" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {renderIconSvg()}

      <div className="flex flex-col select-none text-left">
        <div className="flex items-center tracking-tight leading-none">
          <span className={`font-black text-white ${text} font-sans`}>Satya</span>
          <span className={`font-black text-sky-400 ${text} font-sans ml-[1px]`}>Gyana</span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-2.5 h-[1px] bg-slate-600 inline-block" />
            <span className={`font-bold uppercase tracking-wider text-slate-400 ${sub} font-sans`}>
              LEARN <span className="text-sky-400">•</span> GROW <span className="text-sky-400">•</span> SUCCEED
            </span>
            <span className="w-2.5 h-[1px] bg-slate-600 inline-block" />
          </div>
        )}
      </div>
    </div>
  );
};
