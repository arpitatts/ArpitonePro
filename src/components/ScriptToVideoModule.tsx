import React, { useState, useEffect, useRef } from 'react';
import { ParsedScene, WatermarkSettings, SupportedLanguage } from '../types';
import { parseArpitonScript, validateScriptScenes } from '../services/scriptParser';
import { SAMPLE_ECONOMICS_SCRIPT } from '../data/defaultData';
import { ScientificVisualRenderer } from './visuals/ScientificVisualRenderer';
import { SatyaGyanWatermark } from './visuals/SatyaGyanWatermark';
import { SatyaGyanBackgroundWatermark } from './visuals/SatyaGyanBackgroundWatermark';
import { ttsService } from '../services/ttsService';
import { downloadSlideAsPng, downloadStudyNotesAsPdf } from '../services/studyNotesPdfService';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Code,
  Layout,
  Volume2,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  ZoomIn,
  Check,
  Download,
  FileText,
  Image as ImageIcon,
  FileDown,
  Printer,
  CheckCircle2,
  Layers,
  ArrowUpDown,
  MoveHorizontal,
} from 'lucide-react';

interface ScriptToVideoModuleProps {
  watermarkSettings: WatermarkSettings;
  currentLanguage: SupportedLanguage;
  onNavigateToComposer?: (scenes: ParsedScene[]) => void;
}

export const ScriptToVideoModule: React.FC<ScriptToVideoModuleProps> = ({
  watermarkSettings,
  currentLanguage,
  onNavigateToComposer,
}) => {
  const [rawScript, setRawScript] = useState<string>(SAMPLE_ECONOMICS_SCRIPT);
  const [scenes, setScenes] = useState<ParsedScene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'script' | 'split'>('split');
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [validationIssues, setValidationIssues] = useState<any[]>([]);
  const [isExportingSlide, setIsExportingSlide] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [exportResolution, setExportResolution] = useState<'1080p' | '4k'>('1080p');
  const [cleanStudentMode, setCleanStudentMode] = useState<boolean>(true);

  // Auto-scroll, Adaptive fit & Diagram Auto-Zoom states
  const [isDiagramEnlarged, setIsDiagramEnlarged] = useState<boolean>(false);
  const [autoZoomDiagram, setAutoZoomDiagram] = useState<boolean>(true);
  const [autoScrollScript, setAutoScrollScript] = useState<boolean>(true);
  const [adaptiveFitNoScroll, setAdaptiveFitNoScroll] = useState<boolean>(true);
  const [activeBulletIndex, setActiveBulletIndex] = useState<number>(0);
  const [activePointHighlight, setActivePointHighlight] = useState<string>('');

  const scriptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const bulletContainerRef = useRef<HTMLDivElement>(null);

  // Parse script whenever rawScript changes
  useEffect(() => {
    const parsed = parseArpitonScript(rawScript);
    setScenes(parsed);
    const val = validateScriptScenes(parsed);
    setValidationIssues(val.issues);
    if (currentSceneIndex >= parsed.length) {
      setCurrentSceneIndex(Math.max(0, parsed.length - 1));
    }
  }, [rawScript]);

  const activeScene = scenes[currentSceneIndex] || null;

  // Auto-Scroll Script Textarea to current active slide
  useEffect(() => {
    if (!autoScrollScript || !scriptTextareaRef.current || !activeScene) return;
    const targetTag = `SLIDE ${activeScene.slideNumber}`;
    const idx = rawScript.toUpperCase().indexOf(targetTag);
    if (idx !== -1) {
      const linesBefore = rawScript.substring(0, idx).split('\n').length;
      const lineHeight = 19;
      scriptTextareaRef.current.scrollTo({
        top: Math.max(0, (linesBefore - 2) * lineHeight),
        behavior: 'smooth',
      });
    }
  }, [currentSceneIndex, autoScrollScript, activeScene, rawScript]);

  // Synchronize active bullet with spoken narration timeline
  useEffect(() => {
    if (!isPlaying || !activeScene || activeScene.contentLines.length === 0) {
      setActiveBulletIndex(0);
      return;
    }

    const bulletCount = activeScene.contentLines.length;
    const totalDurationMs = Math.max(4, activeScene.estimatedDurationSec || 8) * 1000;
    const intervalMs = Math.max(1500, totalDurationMs / bulletCount);

    const timer = setInterval(() => {
      setActiveBulletIndex((prev) => {
        const next = (prev + 1) % bulletCount;
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, activeScene]);

  // Point highlighting & Diagram Auto-Zoom triggers based on active bullet and narration
  useEffect(() => {
    if (!activeScene) return;
    const currentBullet = activeScene.contentLines[activeBulletIndex] || '';

    // Extract point coordinate tags like E0, E1, E2, P0, P1, Q0, Q1
    const match = currentBullet.match(/\b(E[0-9]|P[0-9]|Q[0-9])\b/i);
    if (match) {
      setActivePointHighlight(match[1].toUpperCase());
    } else {
      setActivePointHighlight('');
    }

    // Auto-enlarge diagram when explaining graph, curves, or equilibrium points
    if (autoZoomDiagram) {
      const lower = currentBullet.toLowerCase();
      const isDiagramFocused =
        lower.includes('equilibrium') ||
        lower.includes('graph') ||
        lower.includes('diagram') ||
        lower.includes('curve') ||
        lower.includes('shift') ||
        lower.includes('intersection') ||
        currentBullet.includes('E0') ||
        currentBullet.includes('E1') ||
        currentBullet.includes('P0') ||
        currentBullet.includes('Q0') ||
        activeScene.commands.some((cmd) => cmd.toLowerCase().includes('zoom'));

      setIsDiagramEnlarged(isDiagramFocused);
    }

    // Smooth-scroll active bullet into view if not in adaptive fit mode
    if (!adaptiveFitNoScroll && autoScrollScript && bulletContainerRef.current) {
      const activeElem = document.getElementById(`slide-bullet-${activeBulletIndex}`);
      if (activeElem) {
        activeElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeBulletIndex, activeScene, autoZoomDiagram, adaptiveFitNoScroll, autoScrollScript]);

  // Clear export feedback after 4 seconds
  useEffect(() => {
    if (exportFeedback) {
      const timer = setTimeout(() => setExportFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [exportFeedback]);

  // Export current slide as PNG
  const handleDownloadSlide = async () => {
    if (!activeScene) return;
    setIsExportingSlide(true);
    try {
      await downloadSlideAsPng(activeScene, watermarkSettings, exportResolution, cleanStudentMode);
      setExportFeedback(`Slide #${activeScene.slideNumber} exported in ${exportResolution.toUpperCase()} with SatyaGyana watermark!`);
    } catch (err) {
      console.error('Slide export error:', err);
    } finally {
      setIsExportingSlide(false);
    }
  };

  // Export study notes / script notes as PDF
  const handleDownloadStudyNotes = () => {
    if (scenes.length === 0) return;
    setIsExportingPdf(true);
    try {
      downloadStudyNotesAsPdf(
        scenes,
        watermarkSettings,
        activeScene?.title ? `${activeScene.title} & Series` : 'Economic & Scientific Masterclass'
      );
      setExportFeedback(`SatyaGyana Study Notes & Script PDF prepared with authentic crest watermark.`);
    } catch (err) {
      console.error('Study notes export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Export all slides sequentially
  const handleDownloadAllSlides = async () => {
    if (scenes.length === 0) return;
    setExportFeedback(`Exporting ${scenes.length} slides sequentially in ${exportResolution.toUpperCase()} with SatyaGyana watermark...`);
    for (let i = 0; i < scenes.length; i++) {
      await downloadSlideAsPng(scenes[i], watermarkSettings, exportResolution, cleanStudentMode);
      await new Promise((r) => setTimeout(r, 400));
    }
    setExportFeedback(`All ${scenes.length} slides exported in ${exportResolution.toUpperCase()} successfully!`);
  };

  // Slide playback & narration
  const handlePlayScene = (index: number) => {
    if (!scenes[index]) return;
    setCurrentSceneIndex(index);
    setIsPlaying(true);

    const scene = scenes[index];
    ttsService.speak(scene.narration, {
      language: currentLanguage,
      speed: 1.0,
      onEnd: () => {
        if (autoAdvance && index + 1 < scenes.length) {
          handlePlayScene(index + 1);
        } else {
          setIsPlaying(false);
        }
      },
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
    } else {
      handlePlayScene(currentSceneIndex);
    }
  };

  const handleNext = () => {
    ttsService.stop();
    setIsPlaying(false);
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    ttsService.stop();
    setIsPlaying(false);
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  // High-retention formatted bullet rendering with active speaker spotlight
  const renderFormattedBullet = (
    line: string,
    index: number,
    isActive: boolean = false,
    isCompact: boolean = false
  ) => {
    const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();

    // Check if line contains a label with a colon (e.g. "Core Law:", "Ceteris Paribus:", "Point 4:")
    const colonIdx = cleanLine.indexOf(':');
    let label = '';
    let body = cleanLine;
    if (colonIdx > 0 && colonIdx < 30) {
      label = cleanLine.slice(0, colonIdx + 1);
      body = cleanLine.slice(colonIdx + 1).trim();
    }

    // Check if line is a mathematical formulation (e.g., contains =, <, >, Δ, ^, /)
    const isMath = /(=|<|>|Δ|\^|\/|f\()/.test(cleanLine);

    return (
      <div
        key={index}
        id={`slide-bullet-${index}`}
        className={`flex items-start gap-2.5 rounded-xl transition-all duration-300 shadow-sm ${
          isCompact ? 'p-2 md:p-2.5' : 'p-3'
        } ${
          isActive
            ? 'bg-sky-950/70 border-2 border-sky-400 text-white shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/40 scale-[1.01]'
            : 'bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 text-slate-200'
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-all ${
            isActive ? 'bg-sky-400 scale-125 ring-4 ring-sky-400/30 animate-pulse' : 'bg-slate-500'
          }`}
        />
        <div className="flex-1 min-w-0">
          {label ? (
            <div className={`${isCompact ? 'text-[11px] md:text-xs' : 'text-xs md:text-sm'} leading-snug`}>
              <span className={`font-extrabold mr-1.5 ${isActive ? 'text-sky-300' : 'text-sky-400'}`}>
                {label}
              </span>
              <span className={isActive ? 'text-white font-medium' : 'text-slate-300'}>{body}</span>
            </div>
          ) : isMath ? (
            <div className={`${isCompact ? 'text-[11px] md:text-xs' : 'text-xs md:text-sm'} font-mono font-bold tracking-wide px-2 py-0.5 rounded border inline-block ${
              isActive ? 'bg-sky-900/60 border-sky-400 text-sky-200' : 'bg-sky-950/40 border-sky-800/40 text-sky-300'
            }`}>
              {cleanLine}
            </div>
          ) : (
            <div className={`${isCompact ? 'text-[11px] md:text-xs' : 'text-xs md:text-sm'} font-medium leading-snug ${
              isActive ? 'text-white' : 'text-slate-200'
            }`}>
              {cleanLine}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              MODULE 2
            </span>
            <h2 className="text-xl font-bold text-white">SCRIPT → SLIDES + VOICE ENGINE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic slide layout, scientific coordinate rendering, and synchronized pedagogical narration.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stage Preview
            </button>
            <button
              onClick={() => setViewMode('script')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === 'script' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Script
            </button>
          </div>

          {onNavigateToComposer && (
            <button
              onClick={() => onNavigateToComposer(scenes)}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
            >
              Send to Video Composer →
            </button>
          )}
        </div>
      </div>

      {/* Validation Issue Alerts if any */}
      {validationIssues.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <div className="flex-1">
            <span className="font-bold">ARPITON Visual Validator:</span> {validationIssues[0].message}
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
            {validationIssues.length} check{validationIssues.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Main Grid: Script Editor & Visual Presentation Stage */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Left: Script Editor (shown in 'split' or 'script' mode) */}
        {(viewMode === 'split' || viewMode === 'script') && (
          <div className={`space-y-4 ${viewMode === 'split' ? 'lg:col-span-5' : 'w-full'}`}>
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200">ARPITON Structured Script</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {scenes.length} Scenes Generated
                </span>
              </div>

              <textarea
                ref={scriptTextareaRef}
                value={rawScript}
                onChange={(e) => setRawScript(e.target.value)}
                rows={viewMode === 'split' ? 18 : 24}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y"
              />

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Slide breaks: <code>###</code></span>
                <span>Visual commands: <code>[ECONOMICS]</code> <code>[GRAPH]</code> <code>[ZOOM]</code></span>
              </div>
            </div>

            {/* Scene Thumbnail Strip */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Slide Navigator ({scenes.length} slides)
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {scenes.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      ttsService.stop();
                      setIsPlaying(false);
                      setCurrentSceneIndex(idx);
                    }}
                    className={`p-2 rounded-lg border text-left text-[11px] transition flex flex-col justify-between ${
                      idx === currentSceneIndex
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[10px]">#{sc.slideNumber}</span>
                    <span className="truncate text-[9px] mt-0.5">{sc.title.slice(0, 14)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right: Stage Preview (shown in 'split' or 'preview' mode) */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`space-y-4 ${viewMode === 'split' ? 'lg:col-span-7' : 'w-full'}`}>
            {/* Feedback alert after download */}
            {exportFeedback && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-semibold">{exportFeedback}</span>
              </div>
            )}

            {/* Stage Toolbar: Quick Download & Export Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Slide Stage
                </span>
                <span className="text-[11px] text-slate-400">
                  {scenes.length > 0 ? `Slide ${currentSceneIndex + 1} of ${scenes.length}` : '0 Slides'}
                </span>

                {/* Resolution Pill Selector */}
                <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] ml-1">
                  <button
                    onClick={() => setExportResolution('1080p')}
                    className={`px-2 py-0.5 rounded font-mono font-bold transition ${
                      exportResolution === '1080p'
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1080p
                  </button>
                  <button
                    onClick={() => setExportResolution('4k')}
                    className={`px-2 py-0.5 rounded font-mono font-bold transition ${
                      exportResolution === '4k'
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    4K
                  </button>
                </div>

                {/* Adaptive Fit (No Scroll) Toggle */}
                <button
                  onClick={() => setAdaptiveFitNoScroll((prev) => !prev)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                    adaptiveFitNoScroll
                      ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Ensure all points (Equilibrium etc) fit on the slide with no vertical scrollbar"
                >
                  <Layers className="w-3 h-3" />
                  {adaptiveFitNoScroll ? 'Adaptive Fit (No Scroll)' : 'Scrollable List'}
                </button>

                {/* Auto-Scroll Toggle */}
                <button
                  onClick={() => setAutoScrollScript((prev) => !prev)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                    autoScrollScript
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Automatically scroll script & slide bullets to follow current narration and slide point"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  {autoScrollScript ? 'Auto-Scroll: ON' : 'Auto-Scroll: OFF'}
                </button>

                {/* Diagram Auto-Zoom Toggle */}
                <button
                  onClick={() => {
                    setAutoZoomDiagram((prev) => !prev);
                    if (autoZoomDiagram) setIsDiagramEnlarged(false);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                    autoZoomDiagram
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Automatically enlarge diagram when explaining curves/equilibrium, and return when finished"
                >
                  <ZoomIn className="w-3 h-3" />
                  {autoZoomDiagram ? 'Auto-Zoom Diagram: ON' : 'Auto-Zoom: OFF'}
                </button>

                {/* Manual Diagram Enlarge Button */}
                <button
                  onClick={() => setIsDiagramEnlarged((prev) => !prev)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                    isDiagramEnlarged
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Toggle large prominent diagram view vs side-by-side view"
                >
                  {isDiagramEnlarged ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  {isDiagramEnlarged ? 'Diagram: Large' : 'Enlarge Diagram'}
                </button>

                {/* Clean Student Mode Toggle */}
                <button
                  onClick={() => setCleanStudentMode((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                    cleanStudentMode
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Clean Student Mode: Hide [HIGHLIGHT] and raw command tags for pristine student learning output"
                >
                  {cleanStudentMode ? '✓ Clean Student View' : 'Show Tags'}
                </button>
              </div>

              {/* Action Buttons for Slide Download & Study Notes PDF */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSlide}
                  disabled={!activeScene || isExportingSlide}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-sky-500 text-xs font-semibold transition disabled:opacity-50 shadow-sm"
                  title={`Download Current Slide #${activeScene?.slideNumber} in ${exportResolution.toUpperCase()} with SatyaGyana Watermark (PNG)`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isExportingSlide ? 'Exporting...' : `Download Slide (${exportResolution.toUpperCase()})`}</span>
                </button>

                <button
                  onClick={handleDownloadStudyNotes}
                  disabled={scenes.length === 0 || isExportingPdf}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 transition disabled:opacity-50"
                  title="Download Complete Study Notes & Script as PDF with SatyaGyana Watermark"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>{isExportingPdf ? 'Preparing Notes...' : 'Download Study Notes (PDF)'}</span>
                </button>

                <button
                  onClick={handleDownloadAllSlides}
                  disabled={scenes.length === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition disabled:opacity-50"
                  title={`Download All Slides Deck (${exportResolution.toUpperCase()} PNGs)`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* The 16:9 Educational Video Stage Container */}
            <div
              id="arpiton-slide-stage"
              className="relative aspect-video w-full rounded-2xl bg-[#070e1f] border-2 border-slate-700/80 shadow-2xl overflow-hidden flex flex-col"
              style={{
                backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
              }}
            >
              {/* Document / Slide Background Watermark rendered behind content (z-0) */}
              <SatyaGyanBackgroundWatermark settings={watermarkSettings} />

              {/* Mandatory SatyaGyana Watermark in specified corner */}
              {activeScene?.watermarkEnabled && (
                <SatyaGyanWatermark settings={watermarkSettings} />
              )}

              {/* Slide Presentation Interior */}
              {activeScene ? (
                <div className="flex-1 p-4 md:p-6 flex flex-col justify-between relative z-10">
                  {/* Top Bar inside slide: Category & Slide Title (with safe right margin for watermark) */}
                  <div className="flex items-start justify-between pr-36 md:pr-44">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-md font-mono font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm">
                          SLIDE {activeScene.slideNumber} / {scenes.length}
                        </span>
                        {cleanStudentMode ? (
                          <span className="text-[9px] px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono font-bold border border-sky-500/20">
                            STUDY MASTERCLASS
                          </span>
                        ) : (
                          activeScene.commands.map((cmd) => (
                            <span
                              key={cmd}
                              className="text-[9px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 font-mono font-semibold border border-slate-700/60"
                            >
                              [{cmd}]
                            </span>
                          ))
                        )}
                        {activePointHighlight && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40 animate-pulse">
                            POINT {activePointHighlight}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg md:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                        {activeScene.title}
                      </h2>
                    </div>
                  </div>

                  {/* Middle: Content & Scientific Visualizer with Diagram Auto-Enlarge and Zero-Hidden-Points support */}
                  {isDiagramEnlarged ? (
                    <div className="my-1 flex-1 flex flex-col md:flex-row gap-3 items-stretch relative">
                      {/* Left Compact Focused Bullet & Recap */}
                      <div className="w-full md:w-4/12 flex flex-col justify-between py-1 pr-1 space-y-2">
                        <div className="p-2.5 rounded-xl bg-sky-950/70 border border-sky-400/50 text-xs shadow-lg">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Active Explanation
                          </div>
                          <div className="text-white font-semibold leading-relaxed">
                            {activeScene.contentLines[activeBulletIndex] || activeScene.contentLines[0]}
                          </div>
                          {activePointHighlight && (
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold animate-pulse">
                              <span>Active Coordinate:</span>
                              <span className="text-emerald-200 underline">{activePointHighlight}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 max-h-[140px] overflow-hidden">
                          {activeScene.contentLines.map((line, idx) => (
                            <div
                              key={idx}
                              onClick={() => setActiveBulletIndex(idx)}
                              className={`p-1.5 rounded-lg text-[11px] truncate cursor-pointer transition ${
                                idx === activeBulletIndex
                                  ? 'bg-sky-500/25 border border-sky-400 text-sky-100 font-bold'
                                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {line.replace(/^[•\-\*]\s*/, '')}
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setIsDiagramEnlarged(false)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-300 hover:text-white transition w-fit"
                        >
                          <Minimize2 className="w-3 h-3" /> Return to Side-by-Side
                        </button>
                      </div>

                      {/* Center-Stage Enlarged Scientific Diagram */}
                      <div className="w-full md:w-8/12 h-full min-h-[250px] flex items-center justify-center animate-in zoom-in-95 duration-200">
                        <ScientificVisualRenderer
                          data={activeScene.visualData}
                          isEnlarged={true}
                          onToggleEnlarge={() => setIsDiagramEnlarged(false)}
                          activePointHighlight={activePointHighlight}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-1 grid grid-cols-1 md:grid-cols-12 gap-3.5 flex-1 items-stretch">
                      {/* Left content text bullets with Adaptive Fit so Equilibrium and all points fit 100% */}
                      <div
                        ref={bulletContainerRef}
                        className={`md:col-span-6 flex flex-col justify-around pr-1 ${
                          adaptiveFitNoScroll
                            ? 'overflow-hidden max-h-[310px] space-y-1.5'
                            : 'max-h-[300px] overflow-y-auto space-y-2'
                        }`}
                      >
                        {activeScene.contentLines.map((line, idx) =>
                          renderFormattedBullet(line, idx, idx === activeBulletIndex, adaptiveFitNoScroll)
                        )}
                      </div>

                      {/* Right: Deterministic Scientific Visualization Renderer */}
                      <div className="md:col-span-6 h-full min-h-[220px] flex items-center justify-center">
                        <ScientificVisualRenderer
                          data={activeScene.visualData}
                          isEnlarged={false}
                          onToggleEnlarge={() => setIsDiagramEnlarged(true)}
                          activePointHighlight={activePointHighlight}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bottom Subtitle / Synchronized Narration Subtitles */}
                  <div className="p-2.5 md:p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/90 flex items-center justify-between text-xs text-slate-200 shadow-lg mt-1">
                    <div className="flex items-center gap-2.5 flex-1 mr-3">
                      <Volume2 className={`w-4 h-4 shrink-0 ${isPlaying ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
                      <span className="italic line-clamp-1 font-medium">{activeScene.narration}</span>
                    </div>
                    <span className="text-[10px] text-sky-400/90 shrink-0 font-mono font-semibold px-2 py-0.5 rounded bg-sky-950/50 border border-sky-800/40">
                      ~{activeScene.estimatedDurationSec}s
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                  No scenes parsed. Enter text with ### SLIDE to generate.
                </div>
              )}
            </div>

            {/* Video Playback Controls Bar */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentSceneIndex === 0}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                  title="Previous Slide"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold shadow-lg transition ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Presentation' : 'Present Slide & Voice'}</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentSceneIndex >= scenes.length - 1}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                  title="Next Slide"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <div className="h-5 w-[1px] bg-slate-800 mx-1" />

                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    className="accent-sky-600 rounded"
                  />
                  <span>Auto-advance slides</span>
                </label>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  Estimated Lecture Runtime: ~
                  {Math.round(scenes.reduce((acc, s) => acc + s.estimatedDurationSec, 0) / 60)} min (
                  {scenes.reduce((acc, s) => acc + s.estimatedDurationSec, 0)} sec)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
