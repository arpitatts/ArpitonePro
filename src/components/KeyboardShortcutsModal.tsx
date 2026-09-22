import React, { useState } from 'react';
import { ArpitonModule } from '../types';
import {
  Keyboard,
  X,
  Search,
  ArrowRight,
  Zap,
  Save,
  Play,
  Layers,
  Settings,
  Shield,
  Video,
  FileText,
  Sparkles,
} from 'lucide-react';

export interface ShortcutItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Playback & Studio';
  label: string;
  description: string;
  keys: string[];
  moduleTarget?: ArpitonModule;
  actionId?: string;
}

export const GLOBAL_SHORTCUTS: ShortcutItem[] = [
  // Actions
  {
    id: 'cmd-palette',
    category: 'Actions',
    label: 'Command Palette / Shortcuts',
    description: 'Toggle this keyboard shortcut manager and quick launcher',
    keys: ['Ctrl', 'K'],
    actionId: 'palette',
  },
  {
    id: 'save-project',
    category: 'Actions',
    label: 'Quick Save Project',
    description: 'Save current active project and slide state to Vault',
    keys: ['Ctrl', 'S'],
    actionId: 'save',
  },
  {
    id: 'trigger-generate',
    category: 'Actions',
    label: 'Trigger AI Generate',
    description: 'Synthesize script, voice, or process document in active module',
    keys: ['Ctrl', 'G'],
    actionId: 'generate',
  },
  {
    id: 'quick-export',
    category: 'Actions',
    label: 'Open Video Composer',
    description: 'Jump directly to video rendering and broadcast composer',
    keys: ['Ctrl', 'E'],
    moduleTarget: 'composer',
  },

  // Navigation
  {
    id: 'nav-dashboard',
    category: 'Navigation',
    label: 'Go to Studio Dashboard',
    description: 'Overview of modules, recent projects, and quick starts',
    keys: ['Ctrl', '1'],
    moduleTarget: 'dashboard',
  },
  {
    id: 'nav-tts',
    category: 'Navigation',
    label: 'Text → Voice Studio',
    description: 'Indian multilingual narration and speech synthesizer',
    keys: ['Ctrl', '2'],
    moduleTarget: 'tts',
  },
  {
    id: 'nav-slides',
    category: 'Navigation',
    label: 'Script → Slides + Voice',
    description: 'Structured pedagogical slides with scientific visual models',
    keys: ['Ctrl', '3'],
    moduleTarget: 'script-video',
  },
  {
    id: 'nav-3d',
    category: 'Navigation',
    label: '3D Classroom Animation',
    description: 'Three.js virtual classroom with 8 camera shots',
    keys: ['Ctrl', '4'],
    moduleTarget: 'classroom-3d',
  },
  {
    id: 'nav-pdf',
    category: 'Navigation',
    label: 'PDF → AI Teaching Script',
    description: 'Curriculum-aligned multimodal document extraction',
    keys: ['Ctrl', '5'],
    moduleTarget: 'pdf-script',
  },
  {
    id: 'nav-script-builder',
    category: 'Navigation',
    label: 'AI Script Builder',
    description: '14-step pedagogical sequence generator',
    keys: ['Ctrl', '6'],
    moduleTarget: 'script-builder',
  },
  {
    id: 'nav-current-affairs',
    category: 'Navigation',
    label: 'Current Affairs Studio',
    description: 'PIB & RBI exam syllabus-mapped script generator',
    keys: ['Ctrl', '7'],
    moduleTarget: 'current-affairs',
  },
  {
    id: 'nav-composer',
    category: 'Navigation',
    label: 'Video Composer & Timeline',
    description: '16:9 / 9:16 aspect ratios, audio ducking, and MP4 packaging',
    keys: ['Ctrl', '8'],
    moduleTarget: 'composer',
  },
  {
    id: 'nav-projects',
    category: 'Navigation',
    label: 'My Projects & Vault',
    description: 'Manage drafts, completed masterclasses, and exports',
    keys: ['Ctrl', '9'],
    moduleTarget: 'projects',
  },
  {
    id: 'nav-watermark',
    category: 'Navigation',
    label: 'Satya Gyan Watermark Manager',
    description: 'Upload custom logo, position, and opacity settings',
    keys: ['Ctrl', 'Shift', 'W'],
    moduleTarget: 'assets',
  },
  {
    id: 'nav-settings',
    category: 'Navigation',
    label: 'Settings & AI Keys',
    description: 'Gemini server proxy status and language preferences',
    keys: ['Ctrl', ','],
    moduleTarget: 'settings',
  },
  {
    id: 'nav-shortcuts',
    category: 'Navigation',
    label: 'Script Command Engine',
    description: 'Explore all 34 deterministic visual commands',
    keys: ['Ctrl', 'Shift', 'C'],
    moduleTarget: 'shortcuts',
  },

  // Playback & Studio
  {
    id: 'toggle-play',
    category: 'Playback & Studio',
    label: 'Play / Pause Narration',
    description: 'Toggle speech synthesis or scene playback in Studio',
    keys: ['Space'],
    actionId: 'toggle-playback',
  },
  {
    id: 'close-modal',
    category: 'Playback & Studio',
    label: 'Close Overlays / Esc',
    description: 'Dismiss open dialogs or palettes',
    keys: ['Esc'],
    actionId: 'escape',
  },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: ArpitonModule) => void;
  onTriggerAction: (actionId: string) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  onTriggerAction,
}) => {
  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Actions', 'Navigation', 'Playback & Studio'];

  const filtered = GLOBAL_SHORTCUTS.filter((sc) => {
    const matchesCat = activeCategory === 'All' || sc.category === activeCategory;
    const matchesSearch =
      sc.label.toLowerCase().includes(search.toLowerCase()) ||
      sc.description.toLowerCase().includes(search.toLowerCase()) ||
      sc.keys.some((k) => k.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleExecute = (shortcut: ShortcutItem) => {
    onClose();
    if (shortcut.moduleTarget) {
      onSelectModule(shortcut.moduleTarget);
    } else if (shortcut.actionId) {
      onTriggerAction(shortcut.actionId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  GLOBAL SHORTCUT MANAGER
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/20 text-indigo-300 font-semibold">
                  POWER USER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Navigate modules and trigger actions from anywhere with keystrokes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/30 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shortcuts (e.g. Save, Slides, Ctrl+G, Voice)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[50vh]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No keyboard shortcuts match your search.
            </div>
          ) : (
            filtered.map((sc) => (
              <div
                key={sc.id}
                onClick={() => handleExecute(sc)}
                className="group p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 cursor-pointer transition flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition">
                      {sc.label}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-500 font-mono">
                      {sc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {sc.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {sc.keys.map((k, i) => (
                    <kbd
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700/80 text-[10px] font-mono text-indigo-300 shadow-sm font-semibold"
                    >
                      {k}
                    </kbd>
                  ))}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all ml-1" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Listener Active</span>
            </span>
            <span>• Press <kbd className="font-mono text-slate-300">Esc</kbd> anytime to dismiss</span>
          </div>

          <div className="hidden sm:block text-slate-500 font-mono text-[10px]">
            ARPITON Keyboard Core v1.2
          </div>
        </div>
      </div>
    </div>
  );
};
