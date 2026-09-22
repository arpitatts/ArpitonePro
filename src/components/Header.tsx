import React from 'react';
import { ArpitonModule, SupportedLanguage, ProjectItem, WatermarkSettings, AppLogoSettings } from '../types';
import { SUPPORTED_LANGUAGES, DEFAULT_APP_LOGO_SETTINGS } from '../data/defaultData';
import {
  Sparkles,
  Settings as SettingsIcon,
  ShieldCheck,
  Video,
  BookOpen,
  Layers,
  Keyboard,
  Info,
  Palette,
  Heart,
} from 'lucide-react';

interface HeaderProps {
  currentModule: ArpitonModule;
  onSelectModule: (module: ArpitonModule) => void;
  currentLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  activeProject: ProjectItem | null;
  watermarkSettings: WatermarkSettings;
  logoSettings?: AppLogoSettings;
  onOpenShortcuts?: () => void;
  onOpenLogoManager?: () => void;
  onOpenAbout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onSelectModule,
  currentLanguage,
  onChangeLanguage,
  activeProject,
  watermarkSettings,
  logoSettings = DEFAULT_APP_LOGO_SETTINGS,
  onOpenShortcuts,
  onOpenLogoManager,
  onOpenAbout,
}) => {
  const getShapeClasses = (shape: string) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-md';
      case 'shield':
        return 'rounded-t-md rounded-b-xl';
      case 'squircle':
      default:
        return 'rounded-xl';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Platform Identity */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onSelectModule('dashboard')}
          className="flex items-center gap-3 group text-left transition"
        >
          <div
            className={`w-10 h-10 overflow-hidden bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform ${getShapeClasses(
              logoSettings.shape
            )}`}
          >
            {logoSettings.useCustom && logoSettings.logoUrl ? (
              <img
                src={logoSettings.logoUrl}
                alt={logoSettings.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">
                  {logoSettings.title ? logoSettings.title.charAt(0) : 'A'}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                {logoSettings.title || 'ARPITON'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Studio
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {logoSettings.subtitle || 'AI Educational Content Creation Studio'}
            </p>
          </div>
        </button>

        {/* Change Logo Trigger Button */}
        {onOpenLogoManager && (
          <button
            onClick={onOpenLogoManager}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-400 hover:text-indigo-300 transition"
            title="Change App and Web Logo / Crest"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Logo</span>
          </button>
        )}

        {/* Vertical divider */}
        <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />

        {/* Video Watermark Branding Badge (SatyaGyana) */}
        <div
          onClick={() => onSelectModule('assets')}
          className="cursor-pointer hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/25 hover:bg-sky-500/20 transition shadow-sm"
          title="Click to configure SatyaGyana video watermark settings"
        >
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-bold text-white font-sans">
            Watermark: Satya<span className="text-sky-400">Gyana</span>
          </span>
          <span className="text-[10px] text-slate-400 font-semibold border-l border-slate-700 pl-2 uppercase tracking-wider">
            LEARN • GROW • SUCCEED
          </span>
        </div>
      </div>

      {/* Active Project & Actions */}
      <div className="flex items-center gap-3">
        {/* Active Project Badge */}
        {activeProject && (
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Project:</span>
            <span className="text-slate-200 font-semibold max-w-[200px] truncate">
              {activeProject.title}
            </span>
          </div>
        )}

        {/* Founder & Dedication Button */}
        <button
          onClick={() => onSelectModule('founder')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition text-xs ${
            currentModule === 'founder'
              ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
              : 'bg-slate-900 border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-200'
          }`}
          title="Founder: Satya Subham Biswal • Dedicated to Arpita Biswal"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
          <span className="hidden lg:inline font-medium">Founder</span>
        </button>

        {/* About the App Button */}
        {onOpenAbout && (
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition text-xs"
            title="About ARPITON Studio (What It Does & How It Does It)"
          >
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">About App</span>
          </button>
        )}

        {/* Multilingual Selector */}
        <div className="relative">
          <select
            value={currentLanguage}
            onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
            className="text-xs bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-200 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.name} value={l.name}>
                {l.name} ({l.script})
              </option>
            ))}
          </select>
        </div>

        {/* Global Keyboard Shortcut Trigger */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition text-xs group"
            title="Global Keyboard Shortcut Manager (Ctrl+K or ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-950 text-slate-400 group-hover:text-indigo-300 border border-slate-800">
              Ctrl+K
            </span>
          </button>
        )}

        {/* Quick link to Video Composer Preview */}
        <button
          onClick={() => onSelectModule('composer')}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20 transition"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Render / Preview</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => onSelectModule('settings')}
          className={`p-2 rounded-lg border transition ${
            currentModule === 'settings'
              ? 'bg-slate-800 border-indigo-500 text-indigo-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
          title="Settings & AI Providers"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
