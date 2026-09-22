import React from 'react';
import { ArpitonModule, ProjectItem, WatermarkSettings } from '../types';
import {
  Mic,
  Presentation,
  Box,
  FileText,
  Wand2,
  Globe2,
  FolderKanban,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Layers,
} from 'lucide-react';

interface DashboardProps {
  onSelectModule: (module: ArpitonModule) => void;
  projects: ProjectItem[];
  watermarkSettings: WatermarkSettings;
  onOpenProject: (project: ProjectItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectModule,
  projects,
  watermarkSettings,
  onOpenProject,
}) => {
  const drafts = projects.filter((p) => p.status === 'draft');
  const processing = projects.filter((p) => p.status === 'processing');
  const completed = projects.filter((p) => p.status === 'completed');
  const failed = projects.filter((p) => p.status === 'failed');
  const exported = projects.filter((p) => p.status === 'exported');

  const engineCards = [
    {
      id: 'tts' as ArpitonModule,
      letter: 'A',
      title: 'Text to Voice',
      badge: 'Independent Audio Engine',
      description: 'Convert text into natural, clear educational speech with multi-accent pronunciation and pedagogical cadence.',
      icon: Mic,
      gradient: 'from-blue-600/20 via-sky-500/10 to-transparent',
      borderColor: 'border-sky-500/30 hover:border-sky-400',
      iconColor: 'text-sky-400',
    },
    {
      id: 'script-video' as ArpitonModule,
      letter: 'B',
      title: 'Teaching Video',
      badge: 'Core Educational Visuals',
      description: 'Convert structured teaching scripts into slides, scientific models, downloadable slide PNGs, and full Study Notes PDF with SatyaGyana watermark.',
      icon: Presentation,
      gradient: 'from-indigo-600/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/30 hover:border-indigo-400',
      iconColor: 'text-indigo-400',
    },
    {
      id: 'classroom-3d' as ArpitonModule,
      letter: 'C',
      title: '3D Classroom',
      badge: '3D WebGL Teacher-Student Engine',
      description: 'Create animated teacher-student classroom videos from structured dialogue scripts with 8 dynamic camera shot changes.',
      icon: Box,
      gradient: 'from-amber-600/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      iconColor: 'text-amber-400',
    },
    {
      id: 'pdf-script' as ArpitonModule,
      letter: 'D',
      title: 'PDF to Teaching Script',
      badge: 'Multimodal AI Document Analysis',
      description: 'Upload educational PDF material and automatically generate a structured teaching script with instant temporary file cleanup.',
      icon: FileText,
      gradient: 'from-emerald-600/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'script-builder' as ArpitonModule,
      letter: 'E',
      title: 'AI Script Builder',
      badge: 'Pedagogical Framework Sequencer',
      description: 'Generate educational scripts using Gemini following the 14-step pedagogical sequence (Hook to Real-world application & Exam Traps).',
      icon: Wand2,
      gradient: 'from-purple-600/20 via-pink-500/10 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      iconColor: 'text-purple-400',
    },
    {
      id: 'current-affairs' as ArpitonModule,
      letter: 'F',
      title: 'Current Affairs Studio',
      badge: 'PIB, RBI, Gazette & News Mapping',
      description: 'Collect permitted current-affairs information, organize by importance, map to examination syllabus, and generate teaching-ready scripts.',
      icon: Globe2,
      gradient: 'from-orange-600/20 via-amber-500/10 to-transparent',
      borderColor: 'border-orange-500/30 hover:border-orange-400',
      iconColor: 'text-orange-400',
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold tracking-wide uppercase">
              Production Studio
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Watermark: SatyaGyana • LEARN • GROW • SUCCEED</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">ARPITON</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Create high-retention educational videos, scientific diagrams, synchronized multilingual narration, and 3D animated classroom simulations for competitive exams, universities, and school learners.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800">UPSC / OPSC / State PSC</span>
            <span className="bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800">Economics & Quantitative Models</span>
            <span className="bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800">Physics, Chemistry & Biology</span>
            <span className="bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800">13+ Indian Languages & English</span>
          </div>
        </div>
      </div>

      {/* Main 6 Engine Cards (A to F) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Creation Engines</h2>
            <p className="text-xs text-slate-400">Independently usable specialized pedagogical modules</p>
          </div>
          <span className="text-xs font-mono text-slate-500">6 Core Engines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {engineCards.map((engine) => {
            const Icon = engine.icon;
            return (
              <div
                key={engine.id}
                onClick={() => onSelectModule(engine.id)}
                className={`group cursor-pointer relative overflow-hidden rounded-xl bg-slate-900/80 border ${engine.borderColor} p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${engine.gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-inner">
                        <Icon className={`w-5 h-5 ${engine.iconColor}`} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                          MODULE {engine.letter}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {engine.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-950/60 text-slate-300 border border-slate-800 mb-2">
                    {engine.badge}
                  </span>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {engine.description}
                  </p>
                </div>

                <div className="relative z-10 mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:text-indigo-300">
                  <span>Launch Engine</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module G: My Projects Status Overview */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">My Projects (Module G)</h3>
            </div>
            <p className="text-xs text-slate-400">Track and manage project lifecycle across studio stages</p>
          </div>
          <button
            onClick={() => onSelectModule('projects')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          <div
            onClick={() => onSelectModule('projects')}
            className="cursor-pointer p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">Drafts</span>
              <Layers className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <span className="text-lg font-bold text-slate-200">{drafts.length}</span>
          </div>

          <div
            onClick={() => onSelectModule('projects')}
            className="cursor-pointer p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-sky-400 mb-1">
              <span className="text-xs">Processing</span>
              <Clock className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <span className="text-lg font-bold text-sky-300">{processing.length}</span>
          </div>

          <div
            onClick={() => onSelectModule('projects')}
            className="cursor-pointer p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs">Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="text-lg font-bold text-emerald-300">{completed.length}</span>
          </div>

          <div
            onClick={() => onSelectModule('projects')}
            className="cursor-pointer p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-rose-400 mb-1">
              <span className="text-xs">Failed</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <span className="text-lg font-bold text-rose-300">{failed.length}</span>
          </div>

          <div
            onClick={() => onSelectModule('projects')}
            className="cursor-pointer p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-purple-400 mb-1">
              <span className="text-xs">Exported</span>
              <Send className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <span className="text-lg font-bold text-purple-300">{exported.length}</span>
          </div>
        </div>

        {/* Recent Projects List */}
        <div className="mt-5 space-y-2">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              onClick={() => onOpenProject(proj)}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-950 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  {proj.subject.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-semibold text-slate-200">{proj.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{proj.subject}</span>
                    <span>•</span>
                    <span>{proj.level}</span>
                    <span>•</span>
                    <span>{proj.sceneCount} Scenes</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize font-medium">
                  {proj.status}
                </span>
                <span className="text-[11px] text-indigo-400 font-medium hidden sm:inline">Open Project →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
