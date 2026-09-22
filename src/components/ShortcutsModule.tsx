import React, { useState } from 'react';
import { SCRIPT_COMMAND_DEFINITIONS } from '../data/defaultData';
import { VisualCommandType } from '../types';
import {
  Terminal,
  Copy,
  Check,
  Search,
  Filter,
  Code2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ShortcutsModuleProps {
  onInsertCommand?: (snippet: string) => void;
  onSendToSlideStudio?: (script: string) => void;
}

export const ShortcutsModule: React.FC<ShortcutsModuleProps> = ({
  onInsertCommand,
  onSendToSlideStudio,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [playgroundText, setPlaygroundText] = useState<string>(
    `### SLIDE 1: Kinetic Theory of Gases\n[HIGHLIGHT]\nCore Postulate: Gas molecules undergo perfectly elastic collisions.\n\n### SLIDE 2: Maxwell-Boltzmann Distribution\n[GRAPH]\n[PHYSICS]\nAxis X: Molecular Speed v (m/s)\nAxis Y: Probability Fraction f(v)\n\nNarration:\nNotice how temperature shifts the distribution peak towards higher molecular velocities.`
  );

  const categories = ['All', 'Science & Math', 'Visual', 'Pedagogy', 'Cinematics'];

  const filtered = SCRIPT_COMMAND_DEFINITIONS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.command.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.example.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, cmd: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  const handleInsertIntoPlayground = (example: string) => {
    setPlaygroundText((prev) => `${prev}\n\n${example}`);
    if (onInsertCommand) {
      onInsertCommand(example);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              MODULE 7
            </span>
            <h2 className="text-xl font-bold text-white">SCRIPT SHORTCUT & COMMAND ENGINE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete command palette for slide structural breaks, scientific visual models, and pedagogical tags.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
          <Terminal className="w-4 h-4" />
          <span>{SCRIPT_COMMAND_DEFINITIONS.length} Deterministic Commands</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Command Browser */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search commands (e.g. ECONOMICS, PHYSICS, QUESTION, GRAPH)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Commands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filtered.map((item) => (
              <div
                key={item.command}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      [{item.command}]
                    </span>
                    <span className="text-[10px] text-slate-500">{item.category}</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">{item.description}</p>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400 truncate">
                    {item.example}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(item.example, item.command)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
                  >
                    {copiedCmd === item.command ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Syntax</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleInsertIntoPlayground(item.example)}
                    className="text-[11px] px-2 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-medium transition"
                  >
                    Insert +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Script Playground */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                  Interactive Script Scratchpad
                </h3>
                <span className="text-[10px] text-slate-400">Test inserting commands & verify formatting</span>
              </div>
              {onSendToSlideStudio && (
                <button
                  onClick={() => onSendToSlideStudio(playgroundText)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  <span>Open in Slides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <textarea
              value={playgroundText}
              onChange={(e) => setPlaygroundText(e.target.value)}
              rows={18}
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y leading-relaxed"
            />

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Click "Insert +" on any command on the left to inject.</span>
              <button
                onClick={() => setPlaygroundText('')}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
