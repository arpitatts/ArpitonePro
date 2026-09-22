import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  Code2,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Layers,
  Terminal,
} from 'lucide-react';

export const UserManualModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'syntax' | 'pedagogy' | 'watermark' | 'slide-intelligence'>('syntax');

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
              MODULE 11
            </span>
            <h2 className="text-xl font-bold text-white">ARPITON USER MANUAL & SCRIPT FORMAT SPECIFICATION</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative reference guide for structured educational script authoring and video orchestration.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('syntax')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'syntax' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Script Syntax & Commands
        </button>
        <button
          onClick={() => setActiveTab('pedagogy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'pedagogy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2. The 14-Step Pedagogical Sequence
        </button>
        <button
          onClick={() => setActiveTab('slide-intelligence')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'slide-intelligence' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Slide Intelligence & Density
        </button>
        <button
          onClick={() => setActiveTab('watermark')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'watermark' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Watermark vs. Platform Brand
        </button>
      </div>

      {/* Tab 1: Script Syntax */}
      {activeTab === 'syntax' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Slide Structural Rules
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every scene in ARPITON starts with a triple hash <code>###</code> delimiter followed by an optional slide number and descriptive title.
            </p>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
              <span className="text-indigo-400 font-bold">### SLIDE 1: The Law of Diminishing Marginal Utility</span><br />
              <span className="text-sky-400">[HIGHLIGHT]</span><br />
              <span className="text-emerald-400">[ECONOMICS]</span><br />
              Core Principle: As consumption of a commodity increases, marginal utility derived decreases.<br /><br />
              <span className="text-amber-400 font-bold">Narration:</span><br />
              Welcome students. Today we explore why consumer willingness to pay declines with each subsequent unit consumed.
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Visual Command Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <code className="text-sky-400 font-bold">[GRAPH]</code> / <code className="text-sky-400 font-bold">[ECONOMICS]</code>
                <p className="text-slate-400 mt-1">Triggers coordinate plane rendering with demand, supply, equilibrium, or cost curves.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <code className="text-emerald-400 font-bold">[PHYSICS]</code>
                <p className="text-slate-400 mt-1">Draws force vector resolution, free body diagrams, or kinematic trajectories.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <code className="text-purple-400 font-bold">[MATH]</code> / <code className="text-purple-400 font-bold">[EQUATION]</code>
                <p className="text-slate-400 mt-1">Renders high-contrast formulas and polynomial coordinate curves with roots and vertices.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <code className="text-amber-400 font-bold">[QUESTION]</code> & <code className="text-amber-400 font-bold">[ANSWER]</code>
                <p className="text-slate-400 mt-1">Formats interactive competitive exam multiple-choice questions with step-by-step explanations.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 14-Step Pedagogical Sequence */}
      {activeTab === 'pedagogy' && (
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            The 14-Step Pedagogical Sequencer
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            ARPITON enforces the following 14-step pedagogical sequence to maximize student retention, concept mastery, and exam performance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { num: '01', title: 'Title & Topic Introduction', desc: 'Clear academic framing and target exam orientation.' },
              { num: '02', title: 'Real-World Hook', desc: 'Why this matters in industry, government policy, or daily life.' },
              { num: '03', title: 'Core Concept Definition', desc: 'Formal definition with precise academic terminology.' },
              { num: '04', title: 'Visual Diagram / Coordinate Graph', desc: 'Deterministic visual model (supply/demand, vector forces, curves).' },
              { num: '05', title: 'Step-by-Step Breakdown', desc: 'Analytical components dissected in logical order.' },
              { num: '06', title: 'Mathematical Equation / Formula', desc: 'Explicit equation with units and variable definitions.' },
              { num: '07', title: 'Intuitive Analogy / Concrete Example', desc: 'Relatable practical situation bridging theory and practice.' },
              { num: '08', title: 'Common Traps & Misconceptions', desc: 'Common student pitfalls in exams (e.g. slope vs elasticity).' },
              { num: '09', title: 'Advanced Nuance / Edge Cases', desc: 'Exceptions (Giffen goods, extreme friction, boundary values).' },
              { num: '10', title: 'Competitive Exam Question', desc: 'UPSC / State PSC / JEE / NEET standard MCQ.' },
              { num: '11', title: 'Answer & Working Steps', desc: 'Definitive reasoning and option elimination logic.' },
              { num: '12', title: 'Real-World Policy / Case Study', desc: 'Government schemes, central bank directives, or technical application.' },
              { num: '13', title: 'Summary Capsule & Recap', desc: 'Quick 3-4 bullet memory retention capsule.' },
              { num: '14', title: 'Outro & Next Topic Teaser', desc: 'Conceptual bridge to the next masterclass.' },
            ].map((step) => (
              <div key={step.num} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="font-mono font-bold text-xs text-purple-400">{step.num}</span>
                <div>
                  <h4 className="font-semibold text-slate-200">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Slide Intelligence */}
      {activeTab === 'slide-intelligence' && (
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Slide Intelligence & Readability Guidelines
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Educational videos require strict visual discipline. If a slide contains too much text, learners become overwhelmed. ARPITON automatically enforces:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-sky-300 block mb-1">Max 5–6 Bullet Lines per Slide</span>
              <p className="text-slate-400">Slides exceeding 6 lines or 400 characters are automatically split into Part 1 and Part 2 to ensure 1080p legibility.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-sky-300 block mb-1">Narration Separation</span>
              <p className="text-slate-400">Slide visual bullet points must be concise, while full conversational explanations belong in the <code>Narration:</code> block.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-sky-300 block mb-1">130–150 Words Per Minute Cadence</span>
              <p className="text-slate-400">Narration pacing is automatically calculated at ~2.3 words per second, ensuring clear comprehension for academic learners.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Watermark vs Brand */}
      {activeTab === 'watermark' && (
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Brand Architecture: ARPITON vs. SATYA GYAN
          </h3>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed space-y-2">
            <p>
              <strong>Rule 1:</strong> <code>ARPITON</code> is the application brand name. It is the creator studio where scripts are written and videos composed.
            </p>
            <p>
              <strong>Rule 2:</strong> <code>SATYA GYAN</code> is the educational video content watermark. It is placed on all slides, videos, and exports as the educational hallmark.
            </p>
            <p>
              <strong>Rule 3:</strong> You can upload your custom Satya Gyan logo in Module 9, and the platform will automatically overlay it across all generated educational assets.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
