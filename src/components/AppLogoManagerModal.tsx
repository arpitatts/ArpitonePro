import React, { useState } from 'react';
import { AppLogoSettings } from '../types';
import { LOGO_PRESETS } from '../data/defaultData';
import {
  X,
  Upload,
  RotateCcw,
  CheckCircle,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Shield,
  Layers,
  Palette,
} from 'lucide-react';

interface AppLogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoSettings: AppLogoSettings;
  onUpdateLogoSettings: (settings: AppLogoSettings) => void;
}

export const AppLogoManagerModal: React.FC<AppLogoManagerModalProps> = ({
  isOpen,
  onClose,
  logoSettings,
  onUpdateLogoSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<AppLogoSettings>(logoSettings);
  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const [feedback, setFeedback] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const updated: AppLogoSettings = {
        ...localSettings,
        logoUrl: dataUrl,
        useCustom: true,
      };
      setLocalSettings(updated);
      onUpdateLogoSettings(updated);
      updateFavicon(dataUrl);
      setFeedback('Custom logo uploaded successfully! App and web branding updated.');
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset: (typeof LOGO_PRESETS)[0]) => {
    setSelectedPreset(preset.id);
    const updated: AppLogoSettings = {
      ...localSettings,
      logoUrl: '',
      useCustom: false,
      shape: preset.shape as any,
    };
    setLocalSettings(updated);
    onUpdateLogoSettings(updated);
    setFeedback(`Applied emblem preset: ${preset.name}`);
  };

  const handleShapeChange = (shape: 'circle' | 'squircle' | 'rounded' | 'shield') => {
    const updated: AppLogoSettings = {
      ...localSettings,
      shape,
    };
    setLocalSettings(updated);
    onUpdateLogoSettings(updated);
  };

  const handleReset = () => {
    const resetSettings: AppLogoSettings = {
      logoUrl: '',
      title: 'ARPITON',
      subtitle: 'AI Educational Content Creation Studio',
      shape: 'squircle',
      useCustom: false,
    };
    setLocalSettings(resetSettings);
    setSelectedPreset('default');
    onUpdateLogoSettings(resetSettings);
    setFeedback('Restored authentic ARPITON studio emblem branding.');
  };

  const updateFavicon = (url: string) => {
    try {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = url;
    } catch (e) {
      console.warn('Favicon update note:', e);
    }
  };

  const getShapeClasses = (shape: string) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-md';
      case 'shield':
        return 'rounded-t-lg rounded-b-2xl';
      case 'squircle':
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 ${getShapeClasses(localSettings.shape)}`}>
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">App & Web Logo Customizer</h2>
              <p className="text-xs text-slate-400">Change studio emblem, favicon, and brand identity as per your interest</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs">
          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Current Logo Preview Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 overflow-hidden flex items-center justify-center shadow-lg border border-slate-700 bg-slate-900 ${getShapeClasses(
                  localSettings.shape
                )}`}
              >
                {localSettings.useCustom && localSettings.logoUrl ? (
                  <img
                    src={localSettings.logoUrl}
                    alt="Custom App Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white font-black text-xl">
                    A
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase block">
                  Active App & Web Identity
                </span>
                <h3 className="text-sm font-bold text-white">{localSettings.title || 'ARPITON'}</h3>
                <p className="text-[11px] text-slate-400">{localSettings.subtitle || 'AI Educational Content Creation Studio'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 capitalize">
                    Shape: {localSettings.shape}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    Source: {localSettings.useCustom ? 'Custom Upload' : 'Default Preset'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Option 1: Upload Custom Logo */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              Upload Your Own Custom Logo / Institute Crest
            </h4>
            <p className="text-slate-400 text-[11px]">
              Upload a square PNG, SVG, or JPG image. It will be used in the top app navigation, headers, and browser favicon.
            </p>

            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-3.5 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl bg-slate-900/50 flex items-center justify-center gap-2 text-slate-300 hover:text-white transition">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-xs">Choose Image File (PNG, SVG, JPG)</span>
                </div>
              </label>
            </div>
          </div>

          {/* Option 2: Logo Shape Selection */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Logo Badge Shape
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'circle', label: 'Circle Emblem', shapeClass: 'rounded-full' },
                { id: 'squircle', label: 'Squircle (Curved)', shapeClass: 'rounded-xl' },
                { id: 'shield', label: 'Academic Shield', shapeClass: 'rounded-t-md rounded-b-xl' },
                { id: 'rounded', label: 'Rounded Square', shapeClass: 'rounded-md' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleShapeChange(item.id as any)}
                  className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center gap-1.5 ${
                    localSettings.shape === item.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 bg-indigo-500/40 border border-indigo-400/50 ${item.shapeClass}`} />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Option 3: Curated Educational Crest Presets */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Or Choose from Educational Crest Presets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LOGO_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id && !localSettings.useCustom;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white font-bold shrink-0 shadow`}>
                      {preset.iconType === 'gradient-a' && 'A'}
                      {preset.iconType === 'sun-book' && '☀️'}
                      {preset.iconType === 'chakra' && '☸️'}
                      {preset.iconType === 'lotus' && '🪷'}
                      {preset.iconType === 'hexagon' && '🛡️'}
                    </div>
                    <div>
                      <span className="font-bold text-xs block">{preset.name}</span>
                      <span className="text-[10px] text-slate-400 capitalize">Shape: {preset.shape}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/60">
          <span className="text-[11px] text-slate-400">Settings are instantly saved and applied across the studio.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-md shadow-indigo-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
