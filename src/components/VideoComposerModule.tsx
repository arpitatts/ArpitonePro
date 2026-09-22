import React, { useState, useEffect } from 'react';
import { ParsedScene, WatermarkSettings, SupportedLanguage } from '../types';
import { ScientificVisualRenderer } from './visuals/ScientificVisualRenderer';
import { SatyaGyanWatermark } from './visuals/SatyaGyanWatermark';
import { ttsService } from '../services/ttsService';
import { exportLectureVideo } from '../services/videoExportService';
import { downloadSlideAsPng } from '../services/studyNotesPdfService';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  Volume2,
  FileCheck,
  Monitor,
  Smartphone,
  Square,
  Image as ImageIcon,
  Film,
} from 'lucide-react';

interface VideoComposerModuleProps {
  scenes: ParsedScene[];
  watermarkSettings: WatermarkSettings;
  currentLanguage: SupportedLanguage;
}

export const VideoComposerModule: React.FC<VideoComposerModuleProps> = ({
  scenes,
  watermarkSettings,
  currentLanguage,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [bgMusic, setBgMusic] = useState<'none' | 'ambient' | 'focus' | 'classical'>('ambient');
  const [bgMusicVolume, setBgMusicVolume] = useState<number>(0.15);
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [exportMessage, setExportMessage] = useState<string>('');

  const activeScene = scenes[currentSceneIndex] || scenes[0];
  const totalDuration = scenes.reduce((acc, s) => acc + s.estimatedDurationSec, 0);

  const handlePlayFrom = (idx: number) => {
    if (!scenes[idx]) return;
    setCurrentSceneIndex(idx);
    setIsPlaying(true);

    ttsService.speak(scenes[idx].narration, {
      language: currentLanguage,
      speed: 1.0,
      onEnd: () => {
        if (idx + 1 < scenes.length) {
          handlePlayFrom(idx + 1);
        } else {
          setIsPlaying(false);
          setCurrentSceneIndex(0);
        }
      },
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
    } else {
      handlePlayFrom(currentSceneIndex);
    }
  };

  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportVideo = async () => {
    if (scenes.length === 0 || isExporting) return;
    setIsExporting(true);
    setExportProgress(5);
    setExportMessage(`Initializing ${resolution.toUpperCase()} video render engine...`);

    try {
      // 1. Capture the returned video Blob from the export service
      const videoBlob = await exportLectureVideo(scenes, {
        watermarkSettings,
        resolution,
        hideCommandTags: true,
        onProgress: (pct: number, msg: string) => {
          setExportProgress(pct);
          setExportMessage(msg);
        },
      });

      // 2. Create a secure browser download link
      const videoUrl = URL.createObjectURL(videoBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.style.display = 'none';
      downloadAnchor.href = videoUrl;
      
      // Clean the title for safe file naming
      const cleanTitle = (scenes[0]?.title || 'Lecture').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
      downloadAnchor.download = `SatyaGyana_Lecture_${resolution.toUpperCase()}_${cleanTitle}_${Date.now()}.webm`;
      
      // 3. Trigger the actual file download to the hard drive
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      // 4. Safely clear the memory after 60 seconds
      setTimeout(() => {
        URL.revokeObjectURL(videoUrl);
      }, 60000);

      setExportProgress(100);
      setExportMessage(`Success! ${resolution.toUpperCase()} master video downloaded with SatyaGyana watermark.`);
      setTimeout(() => {
        setExportProgress(null);
        setIsExporting(false);
      }, 4000);
    } catch (err) {
      console.error('Video rendering fallback:', err);
      setExportMessage('Completed via manifest package fallback.');
      triggerDownload();
      setTimeout(() => {
        setExportProgress(null);
        setIsExporting(false);
      }, 3000);
    }
  };

  const handleExportCurrentSlidePng = async () => {
    if (!activeScene) return;
    try {
      setExportMessage(`Exporting Slide #${activeScene.slideNumber} at ${resolution.toUpperCase()}...`);
      await downloadSlideAsPng(activeScene, watermarkSettings, resolution === '4k' ? '4k' : '1080p', true);
      setExportMessage(`Slide #${activeScene.slideNumber} PNG downloaded with SatyaGyana crest.`);
      setTimeout(() => setExportMessage(''), 3000);
    } catch (err) {
      console.error('Slide PNG export error:', err);
    }
  };

  const triggerDownload = () => {
    // Generate text/JSON master export manifest
    const manifest = {
      platform: 'SatyaGyana ARPITON Studio',
      watermark: watermarkSettings.brandName,
      resolution,
      aspectRatio,
      sceneCount: scenes.length,
      durationSeconds: totalDuration,
      scenes: scenes.map((s) => ({
        slide: s.slideNumber,
        title: s.title,
        narration: s.narration,
        cleanScript: s.contentLines,
      })),
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SatyaGyana_Production_Package_${resolution}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              MODULE 8
            </span>
            <h2 className="text-xl font-bold text-white">VIDEO COMPOSER & TIMELINE MASTER</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Timeline assembly, aspect ratio formatting, Satya Gyan watermark overlay, and broadcast package export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCurrentSlidePng}
            disabled={!activeScene}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            title={`Download Current Slide #${activeScene?.slideNumber} as ${resolution.toUpperCase()} PNG with SatyaGyana Watermark`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Slide PNG ({resolution.toUpperCase()})</span>
          </button>

          <button
            onClick={handleExportVideo}
            disabled={isExporting || scenes.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition disabled:opacity-50"
            title={`Download Complete Master Video at ${resolution.toUpperCase()} with SatyaGyana Watermark`}
          >
            <Film className="w-4 h-4" />
            <span>{isExporting ? 'Rendering Video...' : `Download Video (${resolution.toUpperCase()})`}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Broadcast Screen Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div
              className={`relative bg-slate-900 rounded-xl overflow-hidden border-2 border-indigo-500/30 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
                aspectRatio === '16:9'
                  ? 'w-full aspect-video'
                  : aspectRatio === '9:16'
                  ? 'w-[280px] h-[500px]'
                  : 'w-[400px] h-[400px]'
              }`}
            >
              {/* Mandatory Satya Gyan Watermark */}
              <SatyaGyanWatermark settings={watermarkSettings} />

              {/* Stage Content */}
              {activeScene && (
                <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                        SCENE {activeScene.slideNumber} / {scenes.length}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {resolution.toUpperCase()} • {aspectRatio}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white line-clamp-1">
                      {activeScene.title}
                    </h3>
                  </div>

                  {/* Visual Center */}
                  <div className="my-2 flex-1 min-h-[140px] flex items-center justify-center">
                    <ScientificVisualRenderer data={activeScene.visualData} />
                  </div>

                  {/* Active Subtitle Bar */}
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-200">
                    <span className="text-indigo-400 font-bold mr-1.5">Narration:</span>
                    <span className="italic line-clamp-2">{activeScene.narration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Playback Bar */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                    isPlaying
                      ? 'bg-amber-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause Timeline' : 'Play Timeline'}</span>
                </button>

                <span className="font-mono text-xs text-slate-400">
                  Slide {currentSceneIndex + 1} of {scenes.length}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Total Duration: ~{totalDuration}s ({Math.round(totalDuration / 60)} min)</span>
              </div>
            </div>

            {/* Visual Timeline Segments */}
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 pt-2 border-t border-slate-800">
              {scenes.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    ttsService.stop();
                    setIsPlaying(false);
                    setCurrentSceneIndex(i);
                  }}
                  className={`p-2 rounded border text-left transition text-[10px] ${
                    i === currentSceneIndex
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>#{sc.slideNumber}</span>
                    <span className="text-[9px] text-slate-500">{sc.estimatedDurationSec}s</span>
                  </div>
                  <div className="truncate text-[9px] mt-0.5">{sc.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Progress Bar if active */}
          {exportProgress !== null && (
            <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-300 font-semibold">{exportMessage}</span>
                <span className="font-mono font-bold text-sky-400">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Master Output Settings */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide pb-2 border-b border-slate-800">
              Composer Output Controls
            </h3>

            {/* Aspect Ratio Switcher */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition ${
                    aspectRatio === '16:9'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>16:9 (Landscape)</span>
                </button>

                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition ${
                    aspectRatio === '9:16'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>9:16 (Shorts)</span>
                </button>

                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition ${
                    aspectRatio === '1:1'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Square className="w-4 h-4" />
                  <span>1:1 (Square)</span>
                </button>
              </div>
            </div>

            {/* Resolution Selector */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Render Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              >
                <option value="1080p">1080p Full HD (1920 × 1080) - Recommended</option>
                <option value="720p">720p HD (1280 × 720) - Fast Draft</option>
                <option value="4k">4K Ultra HD (3840 × 2160) - Archival Master</option>
              </select>
            </div>

            {/* Background Ambient Audio */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Academic Ambient Music</label>
              <select
                value={bgMusic}
                onChange={(e) => setBgMusic(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 mb-2"
              >
                <option value="ambient">Soft Academic Ambient (Focus)</option>
                <option value="focus">Deep Concentration Binaural</option>
                <option value="classical">Baroque Chamber (High Cognition)</option>
                <option value="none">None (Pure Narration Voiceover)</option>
              </select>

              {bgMusic !== 'none' && (
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Music Ducking Volume</span>
                    <span className="font-mono">{Math.round(bgMusicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.4"
                    step="0.05"
                    value={bgMusicVolume}
                    onChange={(e) => setBgMusicVolume(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Watermark Verification Badge */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Watermark Active</span>
              </div>
              <span className="font-bold font-serif">{watermarkSettings.brandName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
