import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Cpu,
  Video,
  Box,
  Mic,
  FileText,
  Shield,
  Zap,
  ArrowRight,
  Globe2,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Settings,
  ExternalLink,
} from 'lucide-react';

interface AboutAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  onOpenClassroom?: () => void;
}

export const AboutAppModal: React.FC<AboutAppModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenClassroom,
}) => {
  const [activeTab, setActiveTab] = useState<'what' | 'how' | 'characters' | 'upgrade'>('what');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 text-base">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">About ARPITON Studio</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 font-bold">
                  v2.4 Production
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI Educational Content Creation Studio with SatyaGyana Hallmark & 3D WebGL Classroom
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/30 gap-2 pt-2">
          {[
            { id: 'what', label: '1. What the App Does', icon: BookOpen },
            { id: 'how', label: '2. How It Works (Engine)', icon: Cpu },
            { id: 'characters', label: '3. Characters & Indian Voices', icon: Box },
            { id: 'upgrade', label: '4. How to Upgrade & Scale', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  isActive
                    ? 'border-indigo-500 text-white bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-xs leading-relaxed">
          {/* TAB 1: WHAT IT DOES */}
          {activeTab === 'what' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-sky-950/40 border border-indigo-500/20">
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Mission & Comprehensive Capability
                </h3>
                <p className="text-slate-300">
                  <strong>ARPITON</strong> is an AI-powered educational content studio engineered specifically for educators, coaching institutes, YouTube educators, and competitive exam aspirants (UPSC, State PSC, SSC, JEE, NEET). It transforms raw concepts, textbook PDFs, or syllabus topics into broadcast-ready educational video lectures, 1080p/4K presentation slides, and real-time 3D classroom animations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold">
                    <FileText className="w-4 h-4" />
                    <span>14-Step Pedagogical Sequencer</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Enforces academic retention by structuring every lesson from hook, formal definition, scientific diagram, formulas, common student misconceptions, to UPSC exam questions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Box className="w-4 h-4" />
                    <span>3D Classroom Cinematic Engine</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Features <strong>Satya (Teacher)</strong> and students <strong>Arpita, Lucky, and Chintu</strong> in a realistic 3D classroom with authentic blackboard visuals and automatic cinematic camera shot directing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Globe2 className="w-4 h-4" />
                    <span>Indian Multilingual Voices</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Switch between <strong>Only English (Indian accent)</strong>, <strong>Only Odia</strong>, <strong>Only Hindi</strong>, or <strong>Bilingual Eng-Hindi & Eng-Odia</strong> with sweet student voices and authoritative teacher delivery.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <Video className="w-4 h-4" />
                    <span>4K & 1080p Clean Video Exports</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Export presentation videos and slides in 4K UHD (3840×2160) or 1080p FHD with <strong>Clean Student Mode</strong> that strips all internal command brackets for pristine study.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW IT WORKS */}
          {activeTab === 'how' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  The 4-Layer Processing Architecture
                </h3>
                <p className="text-slate-300">
                  ARPITON integrates a client-server pipeline where backend intelligence is mediated securely without exposing sensitive credentials:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Pedagogy & Script Compiler (Server-Side)</strong>
                      <p className="text-[11px] text-slate-400">
                        When you request a lecture or upload a PDF syllabus, Google Gemini Flash parses the educational material and outputs a deterministic script formatted with ARPITON slide delimiters (<code>###</code>) and scientific tags (<code>[GRAPH]</code>, <code>[EQUATION]</code>, <code>[QUESTION]</code>).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Cinematic Directing & Automatic Camera Tracking</strong>
                      <p className="text-[11px] text-slate-400">
                        The 3D WebGL engine continuously analyzes script dialogue. Whenever <strong>Satya</strong> speaks, the camera smoothly frames the teacher and the real chalkboard. When <strong>Arpita</strong>, <strong>Lucky</strong>, or <strong>Chintu</strong> asks a question, the camera automatically switches to their desk close-up. In-script shortcuts like <code>[CAM:SATYA]</code> or <code>[CAM:BOARD]</code> give full manual override.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-white block">Multi-Character Indian Voice Timbre Modulation</strong>
                      <p className="text-[11px] text-slate-400">
                        The audio pipeline assigns unique vocal pitch, rate, and timbre profiles to each character. Female voices are selected for Arpita and Lucky with sweet, bright student inflections; male voices are tailored for Satya (teacher) and Chintu (boy student), matched to the chosen Indian language code (<code>en-IN</code>, <code>hi-IN</code>, <code>or-IN</code>).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="w-6 h-6 rounded bg-sky-500/20 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0">4</span>
                    <div>
                      <strong className="text-white block">High-Resolution Canvas Synthesizer & Watermarking</strong>
                      <p className="text-[11px] text-slate-400">
                        Graphics are rendered using HTML5 Canvas and D3 coordinate systems. During export, the official <strong>SatyaGyana</strong> watermark or custom educator logo is stamped into the 4K/1080p stream with customizable opacity and placement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHARACTERS & VOICES */}
          {activeTab === 'characters' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Box className="w-4 h-4 text-amber-400" />
                  3D Classroom Character Cast
                </h3>
                <p className="text-slate-400 text-xs">
                  Every character has an individual anatomical model, dedicated speaking animations, and distinct vocal frequencies:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Satya */}
                <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
                        S
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">Satya (Lead Educator)</h4>
                        <span className="text-[10px] text-sky-400">Teacher • Male • Podium</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      Pitch: 0.92
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Authoritative, warm, clear pedagogic inflection. Points to blackboard and guides discussions. Automatic camera cut: <code>[CAM:SATYA]</code>.
                  </p>
                </div>

                {/* Arpita */}
                <div className="p-4 rounded-xl bg-slate-950 border border-pink-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs">
                        A
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">Arpita (Student Girl 1)</h4>
                        <span className="text-[10px] text-pink-400">Student • Girl • Desk 1</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                      Pitch: 1.26
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sweet, bright, highly inquisitive student voice. Eager to clarify doubts. Automatic camera cut: <code>[CAM:ARPITA]</code>.
                  </p>
                </div>

                {/* Lucky */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                        L
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">Lucky (Student Girl 2)</h4>
                        <span className="text-[10px] text-emerald-400">Student • Girl • Desk 2</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Pitch: 1.18
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Thoughtful, polite, analytical perspective. Connects theory to policy. Automatic camera cut: <code>[CAM:LUCKY]</code>.
                  </p>
                </div>

                {/* Chintu */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                        C
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">Chintu (Student Boy 3)</h4>
                        <span className="text-[10px] text-amber-400">Student • Boy • Desk 3</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      Pitch: 1.10
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Energetic boy student, brisk cadence, asks practical real-world questions. Automatic camera cut: <code>[CAM:CHINTU]</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UPGRADE & ROADMAP */}
          {activeTab === 'upgrade' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/20 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  How to Upgrade & Configure ARPITON
                </h3>
                <p className="text-slate-300 text-xs">
                  Here is how you can upgrade and customize your platform experience:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">1. Connect Your Gemini API Key for Unlimited AI Generation</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Navigate to <strong>Settings (Module 12)</strong> to input your Google Gemini API key. This unlocks unlimited AI generation for PDF-to-Script, Current Affairs capsules, and multi-turn student classroom debates.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">2. Customize App Logo & Video Watermarks</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Use the <strong>App Logo Customizer</strong> in the top header or <strong>Module 9 (Satya Gyan Manager)</strong> to upload your academy's logo, adjust shapes (circle, squircle, shield), and control opacity.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">3. Multi-Speaker Audio Synthesis</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      With Google Gemini TTS enabled, audio generation streams neural waveforms for each character with authentic regional phonetics in Odia, Hindi, and Indian English.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Watermarked with Satya Gyan • Learn • Grow • Succeed</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSettings && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure Settings</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-md shadow-indigo-600/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
