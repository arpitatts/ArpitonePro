import React, { useState } from 'react';
import { ProjectItem, ProjectStatus } from '../types';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Trash2,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface ProjectManagerModuleProps {
  projects: ProjectItem[];
  onOpenProject: (project: ProjectItem) => void;
  onCreateNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (project: ProjectItem) => void;
}

export const ProjectManagerModule: React.FC<ProjectManagerModuleProps> = ({
  projects,
  onOpenProject,
  onCreateNewProject,
  onDeleteProject,
  onDuplicateProject,
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = projects.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'processing':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1 font-semibold">
            <Clock className="w-3 h-3 animate-spin" /> Processing
          </span>
        );
      case 'draft':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 font-semibold">
            <Layers className="w-3 h-3" /> Draft
          </span>
        );
      case 'failed':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3 h-3" /> Failed
          </span>
        );
      case 'exported':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1 font-semibold">
            <Send className="w-3 h-3" /> Exported
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              MODULE 10
            </span>
            <h2 className="text-xl font-bold text-white">MY PROJECTS & MEDIA VAULT</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize drafts, monitor processing jobs, and access completed educational masterclasses.
          </p>
        </div>

        <button
          onClick={onCreateNewProject}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Educational Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by subject, title, or exam..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'completed', 'draft', 'processing', 'exported'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-mono">
                  {proj.subject}
                </span>
                {getStatusBadge(proj.status)}
              </div>

              <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 leading-snug">
                {proj.title}
              </h3>

              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                Topic: {proj.topic}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px]">Level</span>
                  <span className="text-slate-300 truncate block">{proj.level}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Scenes</span>
                  <span className="text-slate-300">{proj.sceneCount} Slides</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Duration</span>
                  <span className="text-slate-300">~{proj.totalDurationSec}s</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Language</span>
                  <span className="text-slate-300">{proj.language}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onOpenProject(proj)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <span>Open in Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDuplicateProject(proj)}
                  className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition"
                  title="Duplicate Project"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-1.5 rounded bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
