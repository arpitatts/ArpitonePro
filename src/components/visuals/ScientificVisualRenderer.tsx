import React, { useState, useEffect } from 'react';
import { ScientificVisualData } from '../../types';
import { Maximize2, Minimize2, X, ZoomIn, Play, Pause, RotateCcw, Dna, FlaskConical, Activity, Sparkles, Image as ImageIcon, BookOpen } from 'lucide-react';

interface ScientificVisualRendererProps {
  data: ScientificVisualData;
  className?: string;
  revealed?: boolean;
  isEnlarged?: boolean;
  onToggleEnlarge?: () => void;
  activePointHighlight?: string;
}

export const ScientificVisualRenderer: React.FC<ScientificVisualRendererProps> = ({
  data,
  className = '',
  revealed = true,
  isEnlarged = false,
  onToggleEnlarge,
  activePointHighlight,
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const renderComponent = () => {
    // Check if interactive lab experiment is specified
    if (data.experimentType === 'titration' || data.category === 'chemistry') {
      return (
        <ChemistryTitrationExperimentView
          data={data}
          className={className}
          isEnlarged={isEnlarged}
          onToggleEnlarge={onToggleEnlarge}
        />
      );
    }

    if (data.experimentType === 'projectile') {
      return (
        <PhysicsProjectileExperimentView
          data={data}
          className={className}
          isEnlarged={isEnlarged}
          onToggleEnlarge={onToggleEnlarge}
        />
      );
    }

    if (data.category === 'biology' || data.experimentType === 'dna-helix' || data.experimentType === 'mitosis') {
      return (
        <BiologyDnaModelView
          data={data}
          className={className}
          isEnlarged={isEnlarged}
          onToggleEnlarge={onToggleEnlarge}
        />
      );
    }

    if (data.category === 'image' || data.imageData) {
      return (
        <EducationalImageView
          data={data}
          className={className}
          isEnlarged={isEnlarged}
          onToggleEnlarge={onToggleEnlarge}
        />
      );
    }

    switch (data.category) {
      case 'economics':
        return (
          <EconomicsGraphView
            data={data}
            revealed={revealed}
            className={className}
            isEnlarged={isEnlarged}
            onToggleEnlarge={onToggleEnlarge}
            activePointHighlight={activePointHighlight || data.activePointHighlight}
            onOpenZoom={() => setIsZoomed(true)}
          />
        );
      case 'physics':
        return (
          <PhysicsProjectileExperimentView
            data={data}
            className={className}
            isEnlarged={isEnlarged}
            onToggleEnlarge={onToggleEnlarge}
          />
        );
      case 'math':
        return <MathFunctionGraphView data={data} revealed={revealed} className={className} />;
      case 'statistics':
        return <StatisticsBellCurveView data={data} revealed={revealed} className={className} />;
      case 'question':
        return <QuestionCardView data={data} className={className} />;
      case 'timeline':
        return <TimelineProcessView data={data} className={className} />;
      default:
        return <GeneralConceptVisualView data={data} className={className} />;
    }
  };

  return (
    <>
      {renderComponent()}

      {/* Student High-Res Inspection Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  STUDENT HIGH-RESOLUTION VISUAL INSPECTOR (CLASS 6 TO PhD)
                </span>
                <h3 className="text-lg font-bold text-white">{data.title}</h3>
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-center justify-center min-h-[350px]">
              {data.category === 'economics' ? (
                <EconomicsGraphSvg data={data} isModal activePointHighlight={activePointHighlight} />
              ) : (
                renderComponent()
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Full mathematical precision visual render • 100% visible axes and equilibrium coordinates</span>
              <button
                onClick={() => setIsZoomed(false)}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition"
              >
                Close Fullscreen Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 1. Economics Supply & Demand Programmatic SVG
function EconomicsGraphView({
  data,
  revealed,
  className,
  isEnlarged = false,
  onToggleEnlarge,
  activePointHighlight,
  onOpenZoom,
}: {
  data: ScientificVisualData;
  revealed: boolean;
  className?: string;
  isEnlarged?: boolean;
  onToggleEnlarge?: () => void;
  activePointHighlight?: string;
  onOpenZoom?: () => void;
}) {
  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/95 rounded-xl p-3 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      {/* Header with Title, Auto-Zoom Status and Actions */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-1.5 shrink-0">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-sky-400 tracking-wide uppercase">
              Deterministic Economic Model
            </span>
            {isEnlarged && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                ENLARGED STAGE
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-slate-100 truncate mt-0.5" title={data.title}>
            {data.title}
          </h4>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleEnlarge && (
            <button
              onClick={onToggleEnlarge}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition ${
                isEnlarged
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isEnlarged ? 'Switch to Side-by-Side View' : 'Automatically Enlarge Diagram Large'}
            >
              {isEnlarged ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span>{isEnlarged ? 'Side-by-Side' : 'Enlarge Diagram'}</span>
            </button>
          )}

          {onOpenZoom && (
            <button
              onClick={onOpenZoom}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-sky-300 border border-slate-700 transition"
              title="Expand to Fullscreen High-Res Student Inspector"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* SVG Container: Generous height and 100% visible coordinates */}
      <div className="relative flex-1 min-h-[190px] w-full flex items-center justify-center p-1">
        <EconomicsGraphSvg data={data} activePointHighlight={activePointHighlight} />
      </div>

      {/* Model Parameter Badges: Crisp, high-contrast, no truncation */}
      <div className="grid grid-cols-3 gap-2 mt-1 pt-2 border-t border-slate-800/80 text-[10px] shrink-0">
        {data.keyParameters && data.keyParameters.length > 0 ? (
          data.keyParameters.slice(0, 3).map((param, i) => (
            <div key={i} className="bg-slate-950/80 rounded-lg px-2 py-1 border border-slate-800">
              <span className="text-slate-400 block text-[9px] truncate">{param.name}</span>
              <span className="font-bold text-slate-100 truncate block">{param.value}</span>
            </div>
          ))
        ) : (
          <>
            <div className="bg-slate-950/80 rounded-lg px-2 py-1 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Equilibrium P₀</span>
              <span className="font-bold text-sky-400">$50.00</span>
            </div>
            <div className="bg-slate-950/80 rounded-lg px-2 py-1 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Equilibrium Q₀</span>
              <span className="font-bold text-emerald-400">100 units</span>
            </div>
            <div className="bg-slate-950/80 rounded-lg px-2 py-1 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Condition</span>
              <span className="font-bold text-amber-300">Qd = Qs</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Dedicated Scalable Economics SVG with Guaranteed 100% visible coordinates E0, E1, P0, P1, Q0, Q1
function EconomicsGraphSvg({
  data,
  isModal = false,
  activePointHighlight,
}: {
  data: ScientificVisualData;
  isModal?: boolean;
  activePointHighlight?: string;
}) {
  const isShift = data.shiftDirection === 'right' || data.subtitle?.includes('Shift') || data.title.includes('Shift');
  const highlightE0 = activePointHighlight === 'E0' || activePointHighlight === 'P0' || activePointHighlight === 'Q0';
  const highlightE1 = activePointHighlight === 'E1' || activePointHighlight === 'P1' || activePointHighlight === 'Q1';

  return (
    <svg
      viewBox="0 0 450 250"
      className="w-full h-full object-contain overflow-visible select-none"
      style={{ maxHeight: isModal ? '100%' : '210px' }}
    >
      <defs>
        <marker id="econ-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
        </marker>
        <marker id="econ-shift-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
        </marker>
        <filter id="glow-circle" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid lines with comfortable padding */}
      <line x1="60" y1="200" x2="410" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="60" y1="130" x2="410" y2="130" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="60" y1="60" x2="410" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Y Axis (Price P) */}
      <line x1="60" y1="205" x2="60" y2="20" stroke="#94a3b8" strokeWidth="2.5" markerEnd="url(#econ-arrow)" />
      <rect x="36" y="16" width="18" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
      <text x="45" y="30" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">P</text>
      <text x="24" y="120" fill="#94a3b8" fontSize="10" fontWeight="bold" transform="rotate(-90 24,120)">Price ($)</text>

      {/* X Axis (Quantity Q) */}
      <line x1="55" y1="200" x2="425" y2="200" stroke="#94a3b8" strokeWidth="2.5" markerEnd="url(#econ-arrow)" />
      <rect x="420" y="208" width="18" height="18" rx="4" fill="#0f172a" stroke="#34d399" strokeWidth="1" />
      <text x="429" y="222" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">Q</text>
      <text x="235" y="235" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Quantity Demanded & Supplied (Units)</text>

      {/* Supply Curve (S) - Upward Sloping */}
      <line x1="80" y1="185" x2="360" y2="40" stroke="#34d399" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="365" y="30" width="22" height="20" rx="5" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
      <text x="376" y="45" fill="#6ee7b7" fontSize="12" fontWeight="bold" textAnchor="middle">S</text>

      {/* Demand Curve 1 (D1) - Downward Sloping */}
      <line x1="80" y1="40" x2="360" y2="185" stroke="#38bdf8" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="365" y="180" width="26" height="20" rx="5" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="378" y="195" fill="#7dd3fc" fontSize="12" fontWeight="bold" textAnchor="middle">D₁</text>

      {/* Shifted Demand Curve (D2) if active */}
      {isShift && (
        <>
          <line x1="135" y1="40" x2="405" y2="180" stroke="#a855f7" strokeWidth="3" strokeDasharray="5 3" />
          <rect x="408" y="175" width="26" height="20" rx="5" fill="#581c87" stroke="#c084fc" strokeWidth="1.5" />
          <text x="421" y="190" fill="#e9d5ff" fontSize="12" fontWeight="bold" textAnchor="middle">D₂</text>

          {/* Shift Arrow */}
          <line x1="205" y1="100" x2="255" y2="100" stroke="#a855f7" strokeWidth="2" markerEnd="url(#econ-shift-arrow)" />
          <rect x="202" y="80" width="62" height="17" rx="4" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1" />
          <text x="233" y="92" fill="#e9d5ff" fontSize="9" fontWeight="bold" textAnchor="middle">Shift Right</text>
        </>
      )}

      {/* Equilibrium Point E0 (Intersection of D1 and S at (220, 112)) */}
      {/* Dashed projection to P0 */}
      <line x1="60" y1="112" x2="220" y2="112" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="4 3" />
      {/* Dashed projection to Q0 */}
      <line x1="220" y1="112" x2="220" y2="200" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="4 3" />

      {/* High-Contrast P0 Badge on Y Axis */}
      <g className={highlightE0 ? 'animate-pulse' : ''}>
        <rect x="25" y="102" width="30" height="20" rx="4" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1.5" />
        <text x="40" y="116" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">P₀</text>
      </g>

      {/* High-Contrast Q0 Badge on X Axis */}
      <g className={highlightE0 ? 'animate-pulse' : ''}>
        <rect x="205" y="205" width="30" height="20" rx="4" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1.5" />
        <text x="220" y="219" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Q₀</text>
      </g>

      {/* Equilibrium Point E0 Circle & Label */}
      <circle cx="220" cy="112" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" filter="url(#glow-circle)" />
      {highlightE0 && (
        <circle cx="220" cy="112" r="12" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7" className="animate-ping" />
      )}

      {/* E0 Badge Pill */}
      <g transform="translate(230, 95)">
        <rect x="0" y="0" width="85" height="24" rx="6" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="42" y="16" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">E₀ (P₀, Q₀)</text>
      </g>

      {/* New Equilibrium E1 if Shift */}
      {isShift && (
        <>
          <line x1="60" y1="88" x2="270" y2="88" stroke="#c084fc" strokeWidth="1.6" strokeDasharray="4 3" />
          <line x1="270" y1="88" x2="270" y2="200" stroke="#c084fc" strokeWidth="1.6" strokeDasharray="4 3" />

          {/* P1 Badge */}
          <g className={highlightE1 ? 'animate-pulse' : ''}>
            <rect x="25" y="78" width="30" height="20" rx="4" fill="#7e22ce" stroke="#e9d5ff" strokeWidth="1.5" />
            <text x="40" y="92" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">P₁</text>
          </g>

          {/* Q1 Badge */}
          <g className={highlightE1 ? 'animate-pulse' : ''}>
            <rect x="255" y="205" width="30" height="20" rx="4" fill="#7e22ce" stroke="#e9d5ff" strokeWidth="1.5" />
            <text x="270" y="219" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Q₁</text>
          </g>

          {/* E1 Circle & Label */}
          <circle cx="270" cy="88" r="6" fill="#c084fc" stroke="#ffffff" strokeWidth="2" filter="url(#glow-circle)" />
          {highlightE1 && (
            <circle cx="270" cy="88" r="12" fill="none" stroke="#c084fc" strokeWidth="2" opacity="0.7" className="animate-ping" />
          )}

          {/* E1 Badge Pill */}
          <g transform="translate(280, 72)">
            <rect x="0" y="0" width="85" height="24" rx="6" fill="#581c87" stroke="#c084fc" strokeWidth="1.5" />
            <text x="42" y="16" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">E₁ (P₁, Q₁)</text>
          </g>
        </>
      )}
    </svg>
  );
}

// 2. Interactive Chemistry Lab Experiment View (Acid-Base Titration)
function ChemistryTitrationExperimentView({
  data,
  className,
  isEnlarged = false,
  onToggleEnlarge,
}: {
  data: ScientificVisualData;
  className?: string;
  isEnlarged?: boolean;
  onToggleEnlarge?: () => void;
}) {
  const [titrantVolume, setTitrantVolume] = useState<number>(20); // 0 to 50 mL
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Auto-run simulation when playing
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTitrantVolume((prev) => {
          if (prev >= 45) {
            setIsRunning(false);
            return 45;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Calculate dynamic pH based on strong acid - strong base titration
  // 25mL 0.1M HCl titrated with 0.1M NaOH (Equivalence point at 25mL)
  const calculatePh = (vol: number) => {
    if (vol < 24.5) {
      // Acidic region
      return (1.0 + (vol / 25) * 1.5).toFixed(2);
    } else if (vol >= 24.5 && vol <= 25.5) {
      // Equivalence steep jump
      return (7.0).toFixed(2);
    } else {
      // Basic region
      return (10.5 + ((vol - 25) / 25) * 2.2).toFixed(2);
    }
  };

  const currentPh = parseFloat(calculatePh(titrantVolume));
  // Color of phenolphthalein: colorless below pH 8.2, pink/magenta at pH >= 8.2
  const solutionColor =
    currentPh < 7.0
      ? 'bg-sky-200/20'
      : currentPh < 8.2
      ? 'bg-pink-400/40'
      : 'bg-rose-500/70 shadow-[0_0_20px_rgba(244,63,94,0.6)]';

  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/95 rounded-xl p-3 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-rose-400" />
          <div>
            <span className="text-[10px] font-semibold text-rose-400 tracking-wide uppercase block">
              3D Chemistry Lab Experiment (Class 6 to PhD)
            </span>
            <h4 className="text-xs font-bold text-slate-100 truncate">
              {data.title || 'Acid-Base Neutralization Titration (HCl + NaOH)'}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
              isRunning ? 'bg-amber-600 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isRunning ? 'Pause Drops' : 'Auto-Titrate'}</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTitrantVolume(10);
            }}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            title="Reset Experiment"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {onToggleEnlarge && (
            <button
              onClick={onToggleEnlarge}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              title="Toggle Large Display"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Lab Bench Simulation */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-center min-h-[190px]">
        {/* Burette & Flask Apparatus (Left 5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="relative flex flex-col items-center">
            {/* Burette Tube */}
            <div className="w-5 h-28 bg-slate-800/80 border border-slate-600 rounded-t relative overflow-hidden flex flex-col justify-end">
              <div
                className="w-full bg-sky-400/50 transition-all duration-300"
                style={{ height: `${Math.max(5, 100 - (titrantVolume / 50) * 100)}%` }}
              />
              {/* Volume Markings */}
              <div className="absolute inset-0 flex flex-col justify-between py-1 px-0.5 text-[6px] text-slate-400 font-mono pointer-events-none">
                <span>0mL</span>
                <span>25mL</span>
                <span>50mL</span>
              </div>
            </div>

            {/* Stopcock valve */}
            <div className="w-7 h-2 bg-amber-500 rounded-sm my-0.5" />

            {/* Falling Drop */}
            <div className="h-4 flex items-center justify-center">
              {isRunning && (
                <div className="w-1.5 h-2 rounded-full bg-sky-400 animate-bounce" />
              )}
            </div>

            {/* Conical Flask */}
            <div className="w-20 h-16 border-2 border-slate-600 rounded-b-3xl relative overflow-hidden flex flex-col justify-end bg-slate-900/60">
              <div
                className={`w-full transition-all duration-500 rounded-b-3xl ${solutionColor}`}
                style={{ height: `${Math.min(90, 40 + (titrantVolume / 50) * 40)}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-300 mt-1">Conical Flask (HCl + Phenolphthalein)</span>
          </div>
        </div>

        {/* Dynamic Titration Graph (Right 7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Titrant Added: <strong className="text-sky-400">{titrantVolume} mL</strong></span>
            <span className="text-slate-400">pH Level: <strong className={currentPh >= 8.2 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{currentPh}</strong></span>
          </div>

          {/* SVG pH S-Curve */}
          <div className="h-28 w-full">
            <svg viewBox="0 0 260 110" className="w-full h-full overflow-visible">
              <line x1="30" y1="95" x2="250" y2="95" stroke="#475569" strokeWidth="1.5" />
              <line x1="30" y1="95" x2="30" y2="10" stroke="#475569" strokeWidth="1.5" />
              <text x="25" y="100" fill="#94a3b8" fontSize="8">0</text>
              <text x="25" y="55" fill="#94a3b8" fontSize="8">7</text>
              <text x="20" y="18" fill="#94a3b8" fontSize="8">14</text>
              <text x="130" y="106" fill="#94a3b8" fontSize="8" textAnchor="middle">Volume of NaOH Added (mL)</text>

              {/* Equivalence Point Line at 25mL (x = 140) */}
              <line x1="140" y1="95" x2="140" y2="15" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />
              <text x="140" y="10" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle">Equivalence Pt (pH 7.0)</text>

              {/* S-Curve Path */}
              <path
                d="M 35 90 C 80 88, 125 80, 137 60 C 143 40, 190 20, 245 18"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Current Progress Indicator */}
              {(() => {
                const currentX = 35 + (titrantVolume / 50) * 210;
                const currentY = 95 - (currentPh / 14) * 80;
                return (
                  <circle cx={currentX} cy={currentY} r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                );
              })()}
            </svg>
          </div>

          {/* Manual Volume Slider */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <span className="text-[10px] text-slate-400">Adjust Titrant:</span>
            <input
              type="range"
              min={0}
              max={50}
              value={titrantVolume}
              onChange={(e) => setTitrantVolume(Number(e.target.value))}
              className="flex-1 accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Chemical Reaction Equation */}
      <div className="mt-1 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-300">
        <span className="font-mono text-emerald-300">HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) + Heat</span>
        <span className="text-slate-400">Indicator: Phenolphthalein (Colorless → Pink at pH 8.2)</span>
      </div>
    </div>
  );
}

// 3. Interactive Physics Projectile Motion Experiment View
function PhysicsProjectileExperimentView({
  data,
  className,
  isEnlarged = false,
  onToggleEnlarge,
}: {
  data: ScientificVisualData;
  className?: string;
  isEnlarged?: boolean;
  onToggleEnlarge?: () => void;
}) {
  const [angle, setAngle] = useState<number>(45); // degrees
  const [velocity, setVelocity] = useState<number>(25); // m/s
  const [timeStep, setTimeStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const g = 9.8; // m/s^2
  const rad = (angle * Math.PI) / 180;
  const timeOfFlight = (2 * velocity * Math.sin(rad)) / g;
  const maxHeight = (velocity * velocity * Math.sin(rad) * Math.sin(rad)) / (2 * g);
  const range = (velocity * velocity * Math.sin(2 * rad)) / g;

  useEffect(() => {
    let anim: any;
    if (isSimulating) {
      setTimeStep(0);
      let t = 0;
      anim = setInterval(() => {
        t += 0.05;
        if (t >= timeOfFlight) {
          setTimeStep(timeOfFlight);
          setIsSimulating(false);
        } else {
          setTimeStep(t);
        }
      }, 30);
    }
    return () => clearInterval(anim);
  }, [isSimulating, angle, velocity]);

  // SVG Scaling
  const svgWidth = 380;
  const svgHeight = 150;
  const maxSimX = 80;
  const maxSimY = 35;
  const scaleX = (svgWidth - 60) / maxSimX;
  const scaleY = (svgHeight - 40) / maxSimY;

  // Parabolic path
  const points: string[] = [];
  for (let t = 0; t <= timeOfFlight; t += timeOfFlight / 40) {
    const x = velocity * Math.cos(rad) * t;
    const y = velocity * Math.sin(rad) * t - 0.5 * g * t * t;
    const px = 40 + x * scaleX;
    const py = svgHeight - 25 - y * scaleY;
    points.push(`${px},${py}`);
  }

  // Current projectile location
  const curX = velocity * Math.cos(rad) * timeStep;
  const curY = Math.max(0, velocity * Math.sin(rad) * timeStep - 0.5 * g * timeStep * timeStep);
  const curPx = 40 + curX * scaleX;
  const curPy = svgHeight - 25 - curY * scaleY;

  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/95 rounded-xl p-3 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <div>
            <span className="text-[10px] font-semibold text-sky-400 tracking-wide uppercase block">
              3D Physics Simulator (Kinematics & Dynamics)
            </span>
            <h4 className="text-xs font-bold text-slate-100 truncate">{data.title || 'Classical Projectile Trajectory'}</h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSimulating(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
          >
            <Play className="w-3 h-3" />
            <span>Launch Cannon</span>
          </button>
          {onToggleEnlarge && (
            <button onClick={onToggleEnlarge} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white">
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Trajectory Canvas */}
      <div className="relative flex-1 min-h-[140px] w-full flex items-center justify-center bg-slate-950/70 rounded-xl border border-slate-800/80 p-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
          {/* Ground */}
          <line x1="20" y1={svgHeight - 25} x2={svgWidth - 10} y2={svgHeight - 25} stroke="#64748b" strokeWidth="2" />

          {/* Cannon base */}
          <circle cx="40" cy={svgHeight - 25} r="6" fill="#38bdf8" />
          {/* Cannon barrel */}
          <line
            x1="40"
            y1={svgHeight - 25}
            x2={40 + 16 * Math.cos(rad)}
            y2={svgHeight - 25 - 16 * Math.sin(rad)}
            stroke="#38bdf8"
            strokeWidth="4"
          />

          {/* Parabolic Trajectory */}
          <polyline points={points.join(' ')} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />

          {/* Flying Projectile Ball */}
          <circle cx={curPx} cy={curPy} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

          {/* Coordinate metrics on graph */}
          <text x={40 + (range * scaleX) / 2} y={svgHeight - 25 - maxHeight * scaleY - 6} fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
            H_max = {maxHeight.toFixed(1)} m
          </text>
          <text x={40 + range * scaleX} y={svgHeight - 10} fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
            R = {range.toFixed(1)} m
          </text>
        </svg>
      </div>

      {/* Live Sliders: Angle and Velocity */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px]">
        <div className="flex flex-col">
          <span className="text-slate-400">Launch Angle (θ): <strong className="text-white">{angle}°</strong></span>
          <input
            type="range"
            min={15}
            max={75}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="accent-sky-500 h-1.5 bg-slate-800 rounded mt-1"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-slate-400">Velocity (v₀): <strong className="text-white">{velocity} m/s</strong></span>
          <input
            type="range"
            min={10}
            max={35}
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="accent-sky-500 h-1.5 bg-slate-800 rounded mt-1"
          />
        </div>

        <div className="p-1 rounded bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-slate-400 block text-[9px]">Flight Time (T)</span>
          <span className="font-bold text-sky-400 text-[11px]">{timeOfFlight.toFixed(2)} s</span>
        </div>

        <div className="p-1 rounded bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-slate-400 block text-[9px]">Total Range (R)</span>
          <span className="font-bold text-emerald-400 text-[11px]">{range.toFixed(1)} m</span>
        </div>
      </div>
    </div>
  );
}

// 4. Interactive Biology & Zoology Model (3D DNA Double Helix Replication)
function BiologyDnaModelView({
  data,
  className,
  isEnlarged = false,
  onToggleEnlarge,
}: {
  data: ScientificVisualData;
  className?: string;
  isEnlarged?: boolean;
  onToggleEnlarge?: () => void;
}) {
  const [step, setStep] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const steps = [
    { title: '1. Intact DNA Double Helix', desc: 'Antiparallel strands (5’→3’ & 3’→5’) held by A=T (2 H-bonds) & G≡C (3 H-bonds).' },
    { title: '2. Helicase Unwinding', desc: 'DNA Helicase breaks hydrogen bonds creating the Y-shaped replication fork.' },
    { title: '3. DNA Polymerase Synthesis', desc: 'Leading strand synthesized continuously; Lagging strand formed as Okazaki fragments.' },
    { title: '4. Semiconservative Duplexes', desc: 'Two identical daughter DNA helices formed, each conserving one parental template strand.' },
  ];

  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/95 rounded-xl p-3 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[10px] font-semibold text-emerald-400 tracking-wide uppercase block">
              Biological & Molecular Genetics (Class 6 to PhD)
            </span>
            <h4 className="text-xs font-bold text-slate-100 truncate">{data.title || 'DNA Double Helix & Replication Fork'}</h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStep((prev) => (prev + 1) % steps.length)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            <Sparkles className="w-3 h-3" />
            <span>Next Phase</span>
          </button>
          {onToggleEnlarge && (
            <button onClick={onToggleEnlarge} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white">
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* SVG DNA Graphic */}
      <div className="relative flex-1 min-h-[150px] w-full flex items-center justify-center bg-slate-950/70 rounded-xl border border-slate-800/80 p-2">
        <svg viewBox="0 0 360 140" className="w-full h-full overflow-visible">
          {/* Sugar Phosphate Strands */}
          <path d="M 30 30 Q 90 90, 150 30 T 270 30 T 350 30" fill="none" stroke="#34d399" strokeWidth="4" />
          <path d="M 30 110 Q 90 50, 150 110 T 270 110 T 350 110" fill="none" stroke="#38bdf8" strokeWidth="4" />

          {/* Base Pair Rungs */}
          {[60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x, i) => {
            const isAT = i % 2 === 0;
            return (
              <g key={x}>
                <line x1={x} y1="45" x2={x} y2="95" stroke={isAT ? '#f59e0b' : '#ec4899'} strokeWidth="3" />
                <circle cx={x} cy="45" r="3.5" fill="#34d399" />
                <circle cx={x} cy="95" r="3.5" fill="#38bdf8" />
              </g>
            );
          })}

          {/* DNA Labels */}
          <text x="35" y="22" fill="#34d399" fontSize="9" fontWeight="bold">5' Strand</text>
          <text x="35" y="125" fill="#38bdf8" fontSize="9" fontWeight="bold">3' Strand</text>
          <text x="180" y="73" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" filter="url(#glow-circle)">
            {step === 0 ? 'Watson-Crick B-DNA' : step === 1 ? 'Helicase Unwinding' : step === 2 ? 'Polymerase Activity' : 'Semiconservative Duplexes'}
          </text>
        </svg>
      </div>

      {/* Step Description */}
      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-emerald-300">{steps[step].title}:</span>{' '}
          <span className="text-slate-300 text-[11px]">{steps[step].desc}</span>
        </div>
      </div>
    </div>
  );
}

// 2. Physics Vector Force Decomposition Programmatic View
function PhysicsDiagramView({ data, revealed, className }: { data: ScientificVisualData; revealed: boolean; className?: string }) {
  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/90 rounded-xl p-2.5 md:p-3 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1 shrink-0">
        <div>
          <span className="text-[10px] font-semibold text-emerald-400 tracking-wide uppercase block">Physics Mechanics</span>
          <h4 className="text-xs font-bold text-slate-100 truncate">{data.title}</h4>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
          F = m · a
        </span>
      </div>

      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 380 230" className="w-full h-full object-contain overflow-visible" style={{ maxHeight: '170px' }}>
          <defs>
            <marker id="force-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker id="comp-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
            </marker>
            <marker id="normal-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Frictionless Surface / Ground */}
          <line x1="40" y1="190" x2="350" y2="190" stroke="#64748b" strokeWidth="2.5" />
          <line x1="50" y1="195" x2="60" y2="205" stroke="#475569" strokeWidth="1" />
          <line x1="100" y1="195" x2="110" y2="205" stroke="#475569" strokeWidth="1" />
          <line x1="150" y1="195" x2="160" y2="205" stroke="#475569" strokeWidth="1" />
          <line x1="200" y1="195" x2="210" y2="205" stroke="#475569" strokeWidth="1" />
          <line x1="250" y1="195" x2="260" y2="205" stroke="#475569" strokeWidth="1" />
          <line x1="300" y1="195" x2="310" y2="205" stroke="#475569" strokeWidth="1" />

          {/* Mass Block m */}
          <rect x="90" y="130" width="70" height="60" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="115" y="165" fill="#f8fafc" fontSize="13" fontWeight="bold">m</text>
          <text x="105" y="180" fill="#94a3b8" fontSize="9">10 kg</text>

          {/* Center of Mass Point */}
          <circle cx="125" cy="160" r="4" fill="#f59e0b" />

          {/* Applied Force Vector F at angle θ */}
          <line x1="125" y1="160" x2="260" y2="80" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#force-arrow)" />
          <text x="268" y="78" fill="#38bdf8" fontSize="12" fontWeight="bold">F = 50 N</text>

          {/* Horizontal Component F_x */}
          <line x1="125" y1="160" x2="260" y2="160" stroke="#34d399" strokeWidth="2.5" strokeDasharray="5 2" markerEnd="url(#comp-arrow)" />
          <text x="210" y="180" fill="#34d399" fontSize="10" fontWeight="bold">F_x = F·cos(θ) = 43.3 N</text>

          {/* Vertical Component F_y */}
          <line x1="260" y1="160" x2="260" y2="85" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="125" y1="160" x2="125" y2="80" stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#comp-arrow)" />
          <text x="65" y="90" fill="#34d399" fontSize="10" fontWeight="bold">F_y = 25 N</text>

          {/* Angle θ Arc */}
          <path d="M 165 160 A 40 40 0 0 0 160 140" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="170" y="152" fill="#f59e0b" fontSize="10" fontWeight="bold">θ = 30°</text>

          {/* Weight mg (Downwards) */}
          <line x1="125" y1="160" x2="125" y2="230" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="135" y="225" fill="#ef4444" fontSize="10" fontWeight="bold">W = m·g (98 N)</text>

          {/* Normal Force N (Upwards) */}
          <line x1="125" y1="160" x2="125" y2="105" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#normal-arrow)" />
          <text x="135" y="115" fill="#f59e0b" fontSize="10" fontWeight="bold">N = 73 N</text>
        </svg>
      </div>

      {/* Equations bar */}
      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300">Σ F_x = m·a_x → 43.3 N = (10 kg) · a</span>
        <span className="text-emerald-400 font-bold">a = 4.33 m/s²</span>
      </div>
    </div>
  );
}

// 3. Mathematics Function Graph & Tangent View
function MathFunctionGraphView({ data, revealed, className }: { data: ScientificVisualData; revealed: boolean; className?: string }) {
  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-xl ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div>
          <span className="text-xs font-semibold text-purple-400 tracking-wide uppercase">Calculus & Analytical Geometry</span>
          <h4 className="text-sm font-bold text-slate-100">{data.title}</h4>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
          f'(x) = dy/dx
        </span>
      </div>

      <div className="relative flex-1 min-h-[220px] w-full flex items-center justify-center">
        <svg viewBox="0 0 380 240" className="w-full h-full max-h-[260px] overflow-visible">
          {/* Coordinate Grid */}
          <defs>
            <pattern id="math-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="380" height="240" fill="url(#math-grid)" />

          {/* Axes Origin at (190, 140) */}
          <line x1="20" y1="140" x2="360" y2="140" stroke="#64748b" strokeWidth="1.5" />
          <line x1="190" y1="20" x2="190" y2="220" stroke="#64748b" strokeWidth="1.5" />
          <text x="365" y="145" fill="#94a3b8" fontSize="11" fontWeight="bold">x</text>
          <text x="195" y="25" fill="#94a3b8" fontSize="11" fontWeight="bold">y</text>
          <text x="175" y="155" fill="#64748b" fontSize="10">0</text>

          {/* Parabola: y = a*(x-h)^2 + k. Vertex at (190 + 40, 140 + 30) = (230, 170) -> (x=2, y=-1) */}
          <path
            d="M 120 40 Q 230 230 340 40"
            fill="none"
            stroke="#c084fc"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="325" y="35" fill="#c084fc" fontSize="11" fontWeight="bold">f(x) = x² - 4x + 3</text>

          {/* Tangent line at vertex (horizontal slope = 0) */}
          <line x1="160" y1="170" x2="300" y2="170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="230" cy="170" r="4.5" fill="#f59e0b" />
          <text x="240" y="185" fill="#f59e0b" fontSize="10" fontWeight="bold">Vertex (2, -1): f'(2) = 0</text>

          {/* Roots where curve intersects x-axis (x=1 -> 190+20=210, x=3 -> 190+60=250) */}
          <circle cx="170" cy="140" r="4" fill="#38bdf8" />
          <text x="160" y="132" fill="#38bdf8" fontSize="10" fontWeight="bold">x = 1</text>

          <circle cx="290" cy="140" r="4" fill="#38bdf8" />
          <text x="295" y="132" fill="#38bdf8" fontSize="10" fontWeight="bold">x = 3</text>
        </svg>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-purple-300">
        <span>Roots: x = 1, 3</span>
        <span>Vertex Minimum: (2, -1)</span>
        <span>Discriminant Δ &gt; 0</span>
      </div>
    </div>
  );
}

// 4. Chemistry Reaction & Apparatus View
function ChemistryReactionView({ data, revealed, className }: { data: ScientificVisualData; revealed: boolean; className?: string }) {
  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-xl ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div>
          <span className="text-xs font-semibold text-rose-400 tracking-wide uppercase">Chemical Thermodynamics & Kinetics</span>
          <h4 className="text-sm font-bold text-slate-100">{data.title}</h4>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono">
          Stoichiometry
        </span>
      </div>

      <div className="relative flex-1 min-h-[220px] w-full flex items-center justify-center p-2">
        <div className="w-full flex flex-col items-center justify-center space-y-4">
          {/* Reaction Equation Box */}
          <div className="w-full p-3 rounded-lg bg-slate-950/80 border border-rose-500/30 text-center font-mono">
            <span className="text-lg font-bold text-slate-100 tracking-wide">
              2H₂(g) + O₂(g) → 2H₂O(l)
            </span>
            <div className="text-xs text-rose-400 mt-1 font-sans">
              Standard Enthalpy of Formation: <span className="font-mono font-bold">ΔH° = -285.8 kJ/mol (Exothermic)</span>
            </div>
          </div>

          {/* Molecular Structure Representation */}
          <div className="flex items-center justify-around w-full px-4">
            {/* Hydrogen Reactant */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] text-slate-900 font-bold">H</div>
                <div className="w-4 h-1 bg-slate-500" />
                <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] text-slate-900 font-bold">H</div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">2 × H₂ molecules</span>
            </div>

            <span className="text-xl font-bold text-slate-500">+</span>

            {/* Oxygen Reactant */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-xs text-white font-bold">O</div>
                <div className="w-4 h-1.5 bg-rose-400" />
                <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-xs text-white font-bold">O</div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">1 × O₂ (Double Bond)</span>
            </div>

            <span className="text-xl font-bold text-slate-500">→</span>

            {/* Water Product (Bent Molecule 104.5 degrees) */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-12 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-rose-500 flex items-center justify-center text-xs text-white font-bold z-10">O</div>
                <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] text-slate-900 font-bold">H</div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] text-slate-900 font-bold">H</div>
              </div>
              <span className="text-[10px] text-sky-400 mt-1">2 × H₂O (Bent 104.5°)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <span className="bg-slate-950/40 p-1.5 rounded">Conservation of Mass: 4H + 2O = 4H + 2O</span>
        <span className="bg-slate-950/40 p-1.5 rounded text-rose-300">Heat Released: Energy of Bonds Formed &gt; Broken</span>
      </div>
    </div>
  );
}

// 5. Statistics Gaussian Normal Distribution Bell Curve View
function StatisticsBellCurveView({ data, revealed, className }: { data: ScientificVisualData; revealed: boolean; className?: string }) {
  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-xl ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wide uppercase">Statistical Probability Theory</span>
          <h4 className="text-sm font-bold text-slate-100">{data.title}</h4>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
          N(μ, σ²)
        </span>
      </div>

      <div className="relative flex-1 min-h-[220px] w-full flex items-center justify-center">
        <svg viewBox="0 0 380 240" className="w-full h-full max-h-[260px] overflow-visible">
          {/* Base Axis */}
          <line x1="30" y1="200" x2="350" y2="200" stroke="#64748b" strokeWidth="2" />

          {/* Shaded Areas: 68.2% inside -1σ to +1σ */}
          <path
            d="M 125 200 Q 155 180 190 50 Q 225 180 255 200 Z"
            fill="#f59e0b"
            fillOpacity="0.25"
          />

          {/* Bell Curve Stroke */}
          <path
            d="M 50 198 Q 120 190 150 140 Q 175 60 190 50 Q 205 60 230 140 Q 260 190 330 198"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Mean (μ) Axis */}
          <line x1="190" y1="200" x2="190" y2="45" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="185" y="218" fill="#f8fafc" fontSize="12" fontWeight="bold">μ</text>

          {/* -1σ and +1σ marks */}
          <line x1="140" y1="200" x2="140" y2="155" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
          <text x="130" y="218" fill="#fbbf24" fontSize="11">-1σ</text>

          <line x1="240" y1="200" x2="240" y2="155" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
          <text x="235" y="218" fill="#fbbf24" fontSize="11">+1σ</text>

          {/* Labels for 68.2% */}
          <text x="175" y="130" fill="#fde68a" fontSize="13" fontWeight="bold">68.2%</text>
          <text x="95" y="180" fill="#94a3b8" fontSize="10">13.6%</text>
          <text x="265" y="180" fill="#94a3b8" fontSize="10">13.6%</text>
        </svg>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
        <span>μ ± 1σ = 68.2%</span>
        <span>μ ± 2σ = 95.4%</span>
        <span>μ ± 3σ = 99.7%</span>
      </div>
    </div>
  );
}

// 6. Question Card View
function QuestionCardView({ data, className }: { data: ScientificVisualData; className?: string }) {
  const q = data.questionData;
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [showExplanation, setShowExplanation] = React.useState(false);

  if (!q) return null;

  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/90 rounded-xl p-4 border border-amber-500/30 shadow-xl ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">{q.examTag || 'Competitive Exam Question'}</span>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-[11px] px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition"
        >
          {showExplanation ? 'Hide Explanation' : 'View Answer & Explanation'}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-3">
        <p className="text-sm md:text-base font-semibold text-slate-100 leading-snug">
          {q.questionText}
        </p>

        <div className="grid grid-cols-1 gap-2 pt-2">
          {q.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === q.correctIndex;
            let btnClass = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

            if (showExplanation) {
              if (isCorrect) {
                btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
              } else if (isSelected) {
                btnClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }
            } else if (isSelected) {
              btnClass = 'bg-sky-950/60 border-sky-500 text-sky-200';
            }

            return (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs md:text-sm transition flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {showExplanation && isCorrect && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    CORRECT
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
            <span className="font-bold block text-emerald-300 mb-1">Pedagogical Explanation:</span>
            {q.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

// 7. Timeline / Process View
function TimelineProcessView({ data, className }: { data: ScientificVisualData; className?: string }) {
  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-xl ${className}`}>
      <div className="border-b border-slate-800 pb-2 mb-3">
        <span className="text-xs font-semibold text-indigo-400 tracking-wide uppercase">Sequential Progression</span>
        <h4 className="text-sm font-bold text-slate-100">{data.title}</h4>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-3">
        {data.steps?.map((st, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">
              {i + 1}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">{st.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{st.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. General Concept View
function GeneralConceptVisualView({ data, className }: { data: ScientificVisualData; className?: string }) {
  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-xl ${className}`}>
      <div className="border-b border-slate-800 pb-2 mb-3">
        <span className="text-xs font-semibold text-amber-400 tracking-wide uppercase">Core Pedagogical Framework</span>
        <h4 className="text-sm font-bold text-slate-100">{data.title}</h4>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <p className="text-xs text-slate-300 max-w-xs">{data.subtitle || 'ARPITON Visual Engine: Deterministic Pedagogical Synthesis'}</p>
      </div>
    </div>
  );
}

// 9. Educational Encyclopedic Image View (Wikipedia / Wikimedia / Scientific Archive)
function EducationalImageView({
  data,
  className,
  isEnlarged,
  onToggleEnlarge,
}: {
  data: ScientificVisualData;
  className?: string;
  isEnlarged?: boolean;
  onToggleEnlarge?: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imgInfo = data.imageData;

  const defaultUrl = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80';
  const displayUrl = (!imageFailed && imgInfo?.url) ? imgInfo.url : defaultUrl;
  const caption = imgInfo?.caption || data.title || 'Encyclopedic Reference Visual';

  return (
    <div className={`flex flex-col h-full w-full bg-slate-900/95 rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative group ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/80 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <BookOpen className="w-3 h-3" />
            {imgInfo?.source === 'wikipedia' ? 'WIKIPEDIA ARCHIVE' : 'ENCYCLOPEDIC ARCHIVE'}
          </span>
          <span className="text-xs font-semibold text-slate-200 truncate">
            {imgInfo?.prompt || data.title}
          </span>
        </div>

        {onToggleEnlarge && (
          <button
            onClick={onToggleEnlarge}
            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title={isEnlarged ? 'Minimize Image View' : 'Enlarge Image View'}
          >
            {isEnlarged ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Main Image Container - Stays strictly inside container, never overlaps text */}
      <div className="flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center p-2 min-h-[140px]">
        <img
          src={displayUrl}
          alt={imgInfo?.altText || data.title}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="max-h-full max-w-full object-contain rounded-lg shadow-md border border-slate-800/60 transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* High-Resolution Overlay Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[9px] font-mono text-slate-300 shadow">
          HD ENCYCLOPEDIC
        </div>
      </div>

      {/* Caption Footnote */}
      <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800/80 shrink-0">
        <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 italic">
          <span className="font-semibold text-sky-400 not-italic mr-1">Fig.</span>
          {caption}
        </p>
      </div>
    </div>
  );
}
