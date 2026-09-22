import React from 'react';
import { ArpitonModule } from '../types';
import {
  LayoutDashboard,
  Mic,
  Presentation,
  Box,
  FileText,
  Wand2,
  Globe2,
  Terminal,
  Video,
  Shield,
  FolderKanban,
  HelpCircle,
  Settings,
  Heart,
} from 'lucide-react';

interface NavigationProps {
  currentModule: ArpitonModule;
  onSelectModule: (module: ArpitonModule) => void;
  className?: string;
}

interface NavItem {
  id: ArpitonModule;
  title: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  engineNumber?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentModule,
  onSelectModule,
  className = '',
}) => {
  const primaryModules: NavItem[] = [
    { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
    { id: 'tts', title: 'Text → Voice', engineNumber: 'M1', icon: Mic },
    { id: 'script-video', title: 'Script → Slides + Voice', engineNumber: 'M2', icon: Presentation },
    { id: 'classroom-3d', title: '3D Classroom', engineNumber: 'M3', icon: Box, badge: '3D' },
    { id: 'pdf-script', title: 'PDF → AI Script', engineNumber: 'M4', icon: FileText },
    { id: 'script-builder', title: 'AI Script Builder', engineNumber: 'M5', icon: Wand2 },
    { id: 'current-affairs', title: 'Current Affairs Studio', engineNumber: 'M6', icon: Globe2 },
  ];

  const studioTools: NavItem[] = [
    { id: 'founder', title: 'Founder: Satya & Arpita', badge: 'Love', icon: Heart },
    { id: 'composer', title: 'Video Composer', engineNumber: 'M8', icon: Video },
    { id: 'shortcuts', title: 'Script Commands Palette', engineNumber: 'M7', icon: Terminal },
    { id: 'assets', title: 'Satya Gyan Watermark', engineNumber: 'M9', icon: Shield },
    { id: 'projects', title: 'My Projects', engineNumber: 'M10', icon: FolderKanban },
    { id: 'manual', title: 'User Manual & Syntax', engineNumber: 'M11', icon: HelpCircle },
    { id: 'settings', title: 'Settings & AI Keys', engineNumber: 'M12', icon: Settings },
  ];

  return (
    <nav className={`w-64 bg-slate-950/70 border-r border-slate-800/80 flex flex-col p-3 overflow-y-auto shrink-0 select-none ${className}`}>
      {/* Primary Modules */}
      <div className="mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
          Core Engines
        </span>
        <div className="space-y-1">
          {primaryModules.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.engineNumber && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {item.engineNumber}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[1px] bg-slate-800/80 my-3 mx-2" />

      {/* Studio & Project Tools */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
          Studio Production & Settings
        </span>
        <div className="space-y-1">
          {studioTools.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                  <span>{item.title}</span>
                </div>
                {item.engineNumber && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {item.engineNumber}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Branding Reminder & Dedication */}
      <div className="mt-auto pt-4 px-2">
        <button
          onClick={() => onSelectModule('founder')}
          className="w-full text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-[11px] text-slate-400 transition group"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold mb-1">
            <span className="flex items-center gap-1 text-rose-300 group-hover:text-rose-200">
              <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
              Founder: Satya Subham
            </span>
            <span className="text-amber-400 font-serif">Satya Gyan</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Dedicated to <span className="text-rose-300 font-medium">Arpita Biswal</span>
            <br />
            Class 6 to PhD • 100% Free
          </p>
        </button>
      </div>
    </nav>
  );
};
