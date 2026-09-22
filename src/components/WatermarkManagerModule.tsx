import React, { useState } from 'react';
import { WatermarkSettings, WatermarkPosition } from '../types';
import { SatyaGyanWatermark } from './visuals/SatyaGyanWatermark';
import { SatyaGyanBackgroundWatermark } from './visuals/SatyaGyanBackgroundWatermark';
import {
  Shield,
  Upload,
  RotateCcw,
  CheckCircle,
  Eye,
  Sliders,
  Layers,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  FileCode,
  BookOpen,
} from 'lucide-react';

interface WatermarkManagerModuleProps {
  settings: WatermarkSettings;
  onUpdateSettings: (newSettings: WatermarkSettings) => void;
}

export const WatermarkManagerModule: React.FC<WatermarkManagerModuleProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<WatermarkSettings>(settings);
  const [activeTab, setActiveTab] = useState<'video-corner' | 'document-background'>('document-background');
  const [sampleDocType, setSampleDocType] = useState<'pdf-page' | 'ppt-slide' | 'exam-notes'>('pdf-page');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updated: WatermarkSettings = {
        ...localSettings,
        logoUrl: result,
        useCustomLogo: true,
      };
      setLocalSettings(updated);
      onUpdateSettings(updated);
      setStatusMessage('Custom Satya Gyan logo uploaded and set as default video watermark.');
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updated: WatermarkSettings = {
        ...localSettings,
        documentWatermarkUrl: result,
        enableDocumentBackgroundWatermark: true,
      };
      setLocalSettings(updated);
      onUpdateSettings(updated);
      setStatusMessage('Custom watermark image uploaded! It will appear in the background behind text across all extracted PDF and PPT pages without affecting text visibility.');
    };
    reader.readAsDataURL(file);
  };

  const handlePositionChange = (pos: WatermarkPosition) => {
    const updated = { ...localSettings, position: pos };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleDisplayModeChange = (mode: 'both' | 'logo-only' | 'text-only') => {
    const updated: WatermarkSettings = { ...localSettings, displayMode: mode };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    setStatusMessage(`Watermark format updated to: ${mode === 'both' ? 'Logo & Text' : mode === 'logo-only' ? 'Logo Only' : 'Text Only'}`);
  };

  const handleLogoShapeChange = (shape: 'circle' | 'squircle') => {
    const updated: WatermarkSettings = { ...localSettings, logoShape: shape };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    setStatusMessage(`Logo emblem shape set to: ${shape === 'circle' ? 'Circle' : 'Squircle'}`);
  };

  const handleOpacityChange = (val: number) => {
    const updated = { ...localSettings, opacity: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleScaleChange = (val: number) => {
    const updated = { ...localSettings, scale: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleDocumentOpacityChange = (val: number) => {
    const updated = { ...localSettings, documentWatermarkOpacity: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleDocumentScaleChange = (val: number) => {
    const updated = { ...localSettings, documentWatermarkScale: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleDocumentAngleChange = (val: number) => {
    const updated = { ...localSettings, documentWatermarkAngle: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleReset = () => {
    const defaultSettings: WatermarkSettings = {
      brandName: 'SatyaGyana',
      tagline: 'LEARN • GROW • SUCCEED',
      position: 'top-right',
      opacity: 0.92,
      scale: 1.0,
      showTagline: true,
      useCustomLogo: false,
      logoUrl: '/satya-gyana-logo.svg',
      displayMode: 'both',
      logoShape: 'circle',
      documentWatermarkUrl: '',
      documentWatermarkOpacity: 0.08,
      documentWatermarkScale: 0.85,
      documentWatermarkAngle: -22,
      documentWatermarkText: 'Satya Gyan • सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ',
      enableDocumentBackgroundWatermark: true,
    };
    setLocalSettings(defaultSettings);
    onUpdateSettings(defaultSettings);
    setStatusMessage('Restored authentic SatyaGyana watermark crest and background document watermark settings.');
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              MODULE 9
            </span>
            <h2 className="text-xl font-bold text-white">SATYA GYAN WATERMARK & ASSET MANAGER</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure the official Satya Gyan video watermark identity and upload custom logo files.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default Crest</span>
        </button>
      </div>

      {/* Brand Identity Distinction Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-bold text-amber-300 text-sm">Two Distinct Architectural Brands:</span>
          <p className="text-slate-300">
            <strong>ARPITON:</strong> Platform & Studio Identity (Application navigation, UI controls, and code engine).
          </p>
          <p className="text-slate-300">
            <strong>SATYA GYAN:</strong> Educational Video & Document Watermark (Stamped on videos, and placed as a subtle background behind text on all extracted PDF/PPT resources).
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-amber-500/40 text-amber-300 font-serif font-bold text-center shrink-0">
          Satya Gyan • सत्य ज्ञान
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
        <button
          onClick={() => setActiveTab('document-background')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
            activeTab === 'document-background'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Page Background Watermark (PDF / PPT / Notes Behind Text)</span>
        </button>

        <button
          onClick={() => setActiveTab('video-corner')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
            activeTab === 'video-corner'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Video Corner Watermark (MP4 / WebM / 3D Stage)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Controls */}
        <div className="lg:col-span-5 space-y-4">
          {activeTab === 'document-background' ? (
            /* Background Watermark Controls */
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                    Document & Slide Background Watermark
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Renders behind text on PDF pages and PPT slides without affecting visibility.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enableDocumentBackgroundWatermark ?? true}
                  onChange={(e) => {
                    const updated = { ...localSettings, enableDocumentBackgroundWatermark: e.target.checked };
                    setLocalSettings(updated);
                    onUpdateSettings(updated);
                  }}
                  className="accent-amber-500 w-4 h-4 cursor-pointer"
                  title="Toggle Background Watermark"
                />
              </div>

              {/* Upload Custom Background Watermark Image */}
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                  Upload Custom Watermark Image for PPT/PDF Pages
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer bg-slate-950/60 transition">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleDocumentWatermarkUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-xs text-slate-200 font-semibold">
                      {localSettings.documentWatermarkUrl ? 'Change Custom Watermark Image' : 'Upload Watermark Image'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Upload transparent PNG/SVG or emblem image. It will appear softly in the background.
                    </span>
                  </div>
                </div>

                {localSettings.documentWatermarkUrl && (
                  <button
                    onClick={() => {
                      const updated = { ...localSettings, documentWatermarkUrl: '' };
                      setLocalSettings(updated);
                      onUpdateSettings(updated);
                      setStatusMessage('Reverted to official default Satya Gyan academic seal.');
                    }}
                    className="mt-2 text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <span>Remove uploaded image (Use official default Satya Gyan crest)</span>
                  </button>
                )}
              </div>

              {/* Background Opacity Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Background Opacity (Preserves Text Visibility)</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {Math.round((localSettings.documentWatermarkOpacity ?? 0.08) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.03"
                  max="0.22"
                  step="0.01"
                  value={localSettings.documentWatermarkOpacity ?? 0.08}
                  onChange={(e) => handleDocumentOpacityChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-mono">
                  <span>3% (Subtle watermark)</span>
                  <span className="text-amber-400 font-semibold">8% (Optimal for Reading)</span>
                  <span>22% (Prominent)</span>
                </div>
              </div>

              {/* Watermark Scale */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Watermark Scale</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {(localSettings.documentWatermarkScale ?? 0.85).toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.4"
                  step="0.05"
                  value={localSettings.documentWatermarkScale ?? 0.85}
                  onChange={(e) => handleDocumentScaleChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Watermark Rotation Angle */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Rotation Angle</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {localSettings.documentWatermarkAngle ?? -22}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={localSettings.documentWatermarkAngle ?? -22}
                  onChange={(e) => handleDocumentAngleChange(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Watermark Text string */}
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Watermark Stamp Text</label>
                <input
                  type="text"
                  value={localSettings.documentWatermarkText ?? 'Satya Gyan • सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ'}
                  onChange={(e) => {
                    const updated = { ...localSettings, documentWatermarkText: e.target.value };
                    setLocalSettings(updated);
                    onUpdateSettings(updated);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              {statusMessage && (
                <p className="text-[11px] text-amber-300 flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{statusMessage}</span>
                </p>
              )}
            </div>
          ) : (
            /* Corner Video Watermark Controls */
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide pb-2 border-b border-slate-800">
                Video Corner Watermark Controls
              </h3>

              {/* Watermark Format: Logo & Text, Logo Only, or Text Only */}
              <div>
                <label className="text-xs text-slate-300 block mb-2 font-medium">
                  Watermark Format Required
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'both', label: 'Logo & Text', desc: 'Full Crest' },
                    { id: 'logo-only', label: 'Logo Only', desc: 'Icon Emblem' },
                    { id: 'text-only', label: 'Text Only', desc: 'Typography' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleDisplayModeChange(m.id as any)}
                      className={`p-2 rounded-lg border text-left transition ${
                        (localSettings.displayMode || 'both') === m.id
                          ? 'bg-sky-600/20 border-sky-500 text-sky-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{m.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Shape: Circle vs Squircle */}
              {(localSettings.displayMode || 'both') !== 'text-only' && (
                <div>
                  <label className="text-xs text-slate-300 block mb-2 font-medium">
                    Logo Emblem Shape
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'circle', label: 'Circle (Circular Badge)', desc: 'Perfect rounded circle badge' },
                      { id: 'squircle', label: 'Squircle (Rounded Shield)', desc: 'Rounded square container' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleLogoShapeChange(s.id as any)}
                        className={`p-2 rounded-lg border text-left transition ${
                          (localSettings.logoShape || 'circle') === s.id
                            ? 'bg-sky-600/20 border-sky-500 text-sky-300 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight">{s.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Logo Upload */}
              <div>
                <label className="text-xs text-slate-300 block mb-2 font-medium">
                  Upload Satya Gyan Logo File (PNG / SVG / JPG)
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer bg-slate-950/60 transition">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-xs text-slate-200 font-semibold">
                      {localSettings.useCustomLogo ? 'Replace Custom Satya Gyan Logo' : 'Choose Logo File'}
                    </span>
                    <span className="text-[10px] text-slate-500">Transparent PNG or SVG recommended</span>
                  </div>
                </div>
              </div>

              {/* Position Selector */}
              <div>
                <label className="text-xs text-slate-300 block mb-2 font-medium">Screen Position</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'top-right', label: 'Top Right (Standard)' },
                      { id: 'top-left', label: 'Top Left' },
                      { id: 'bottom-right', label: 'Bottom Right' },
                      { id: 'bottom-left', label: 'Bottom Left' },
                    ] as { id: WatermarkPosition; label: string }[]
                  ).map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => handlePositionChange(pos.id)}
                      className={`p-2 rounded-lg border text-xs font-medium transition ${
                        localSettings.position === pos.id
                          ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Watermark Opacity</span>
                  <span className="font-mono text-amber-400 font-bold">{Math.round(localSettings.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={localSettings.opacity}
                  onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Scale Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Scale Size</span>
                  <span className="font-mono text-amber-400 font-bold">{localSettings.scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.05"
                  value={localSettings.scale}
                  onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Tagline Toggle */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Multilingual Subtitle Tagline</span>
                  <span className="text-[10px] text-slate-400">Shows "सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ" below brand</span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.showTagline}
                  onChange={(e) => {
                    const updated = { ...localSettings, showTagline: e.target.checked };
                    setLocalSettings(updated);
                    onUpdateSettings(updated);
                  }}
                  className="accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {statusMessage && (
                <p className="text-[11px] text-amber-300 flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{statusMessage}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'document-background' ? (
            /* Live Document Background Watermark Preview */
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    Live Document & PPT Watermark Preview
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Watermark rests behind the text. Notice text is 100% sharp and readable.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setSampleDocType('pdf-page')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                      sampleDocType === 'pdf-page' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PDF Page
                  </button>
                  <button
                    onClick={() => setSampleDocType('ppt-slide')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                      sampleDocType === 'ppt-slide' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PPT Slide
                  </button>
                  <button
                    onClick={() => setSampleDocType('exam-notes')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                      sampleDocType === 'exam-notes' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Exam Handout
                  </button>
                </div>
              </div>

              {/* Document Sheet Simulation */}
              <div className="relative rounded-xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl p-6 min-h-[380px] flex flex-col justify-between">
                {/* Background Watermark Layer Sitting Behind Text */}
                <SatyaGyanBackgroundWatermark settings={localSettings} />

                {/* Content Foreground (relative z-10) */}
                <div className="relative z-10 space-y-4">
                  {sampleDocType === 'pdf-page' && (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          CHAPTER 4: MACROECONOMIC EQUILIBRIUM
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">PAGE 42 OF 180</span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-tight">
                        Section 4.3: The Keynesian Investment Multiplier Mechanism
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        In John Maynard Keynes's general theory, the multiplier represents the proportional amount of increase, or decrease, in final income that results from an injection, or withdrawal, of capital.
                      </p>

                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-amber-300">
                        Multiplier (k) = ΔY / ΔI = 1 / (1 - MPC) = 1 / MPS
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Notice how the Satya Gyan watermark resides gracefully in the background, authenticating every page of the student's study resource without obscuring any equation, index, or footnote.
                      </p>
                    </>
                  )}

                  {sampleDocType === 'ppt-slide' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                          SLIDE 05: COMPETITIVE MARKETS
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">16:9 PRESENTATION CARD</span>
                      </div>

                      <h3 className="text-lg font-bold text-white">
                        Equilibrium Determination in Perfect Competition
                      </h3>

                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        <li>Price is determined strictly by aggregate supply and demand intersection.</li>
                        <li>Individual firms act as price-takers with horizontal demand curves.</li>
                        <li>Long-run economic profits equal zero (P = MC = Minimum ATC).</li>
                      </ul>

                      <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 text-xs text-sky-300">
                        Key Exam Takeaway: Normal profit includes the opportunity cost of entrepreneurial capital.
                      </div>
                    </>
                  )}

                  {sampleDocType === 'exam-notes' && (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          UPSC CSE GS-3 / STATE PSC HIGH-YIELD HANDOUT
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">MODEL QUESTION #08</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                        <p className="font-semibold text-white">
                          Q: Examine how changes in Marginal Propensity to Consume (MPC) influence fiscal policy effectiveness during an economic downturn.
                        </p>
                        <p className="text-slate-300">
                          <strong>Model Structure:</strong> 1. Define Multiplier 2. Explain MPC transmission channel 3. Empirical limits (leakages, imports, savings) 4. Conclusion.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative z-10 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Authentic Satya Gyan Certified Resource</span>
                  <span>Free Educational Distribution</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                This watermark is automatically stamped behind extracted PDF chapters, generated PPT slides, and printable study notes.
              </p>
            </div>
          ) : (
            /* Video Corner Watermark Preview */
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Live Video Watermark Preview
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Simulated 1080p Canvas</span>
              </div>

              {/* Simulated Video Frame with Live Watermark */}
              <div className="relative aspect-video w-full rounded-xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
                {/* The Live Watermark */}
                <SatyaGyanWatermark settings={localSettings} />

                {/* Sample simulated video contents */}
                <div className="max-w-md space-y-2 relative z-10">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                    SLIDE 3: Equilibrium Pricing
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Law of Supply & Demand in Competitive Markets
                  </h3>
                  <p className="text-xs text-slate-400">
                    Notice how the Satya Gyan watermark remains crisply visible without obstructing core mathematical formulas or presentation headers.
                  </p>
                </div>

                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 max-w-sm">
                  Formula: P_equilibrium = f(Quantity Demanded == Quantity Supplied)
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Watermark settings are automatically propagated to Module 2 (Slides + Voice), Module 3 (3D Classroom), and Module 8 (Video Composer).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
