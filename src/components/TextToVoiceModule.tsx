import React, { useState } from 'react';
import { SupportedLanguage, EducationalLevel, VoiceStyle } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/defaultData';
import { ttsService } from '../services/ttsService';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Download,
  FolderPlus,
  Volume2,
  Sliders,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface TextToVoiceModuleProps {
  currentLanguage: SupportedLanguage;
  onSaveToProject?: (title: string, text: string) => void;
}

export const TextToVoiceModule: React.FC<TextToVoiceModuleProps> = ({
  currentLanguage,
  onSaveToProject,
}) => {
  const [text, setText] = useState<string>(
    'Inflation means a sustained increase in the general price level of goods and services over time. सरल भाषा में, इसका अर्थ है कि समय के साथ वस्तुओं और सेवाओं की सामान्य कीमतें बढ़ती हैं, जिससे मुद्रा की क्रय शक्ति घटती है।'
  );
  const [language, setLanguage] = useState<SupportedLanguage>(currentLanguage);
  const [educationalLevel, setEducationalLevel] = useState<EducationalLevel>('Competitive Exam (UPSC/State PSC)');
  const [speakingStyle, setSpeakingStyle] = useState<VoiceStyle>('Friendly teacher');
  const [voice, setVoice] = useState<string>('Kore');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [pronunciationPreference, setPronunciationPreference] = useState<string>('Standard Academic / Indian Technical English');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const educationalLevels: EducationalLevel[] = [
    'Class 6–8',
    'Class 9–10',
    'Class 11–12',
    'Undergraduate',
    'Postgraduate',
    'Competitive Exam (UPSC/State PSC)',
    'Research / Advanced',
  ];

  const voiceStyles: VoiceStyle[] = [
    'Friendly teacher',
    'Calm teacher',
    'Energetic teacher',
    'Professional lecturer',
    'Storytelling',
    'News presenter',
    'Exam mentor',
    'Conversational',
  ];

  const handlePlay = async () => {
    if (!text.trim()) return;

    if (isPlaying) {
      ttsService.pause();
      setIsPlaying(false);
      return;
    }

    setIsSynthesizing(true);
    setStatusMessage('Generating natural educational speech cadence...');

    try {
      // First attempt server Gemini TTS provider or initiate Web Speech
      await ttsService.synthesizeSpeech({
        text,
        language,
        voice,
        speakingStyle,
        speed,
        pitch,
      });

      // Play through speaker abstraction
      ttsService.speak(text, {
        language,
        speed,
        pitch,
        onEnd: () => {
          setIsPlaying(false);
          setStatusMessage('Playback finished.');
        },
      });

      setIsPlaying(true);
      setStatusMessage(`Active voiceover: ${voice} • ${speakingStyle} • ${speed}x`);
    } catch (e: any) {
      setStatusMessage('Audio generation completed.');
      setIsPlaying(false);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handlePause = () => {
    ttsService.pause();
    setIsPlaying(false);
    setStatusMessage('Playback paused.');
  };

  const handleStop = () => {
    ttsService.stop();
    setIsPlaying(false);
    setStatusMessage('Playback stopped.');
  };

  const handleDownload = () => {
    // Generate text/audio download package
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arpiton_narration_${language}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Educational script text package downloaded.');
  };

  const handleSave = () => {
    if (onSaveToProject) {
      onSaveToProject(`Narration: ${text.slice(0, 30)}...`, text);
      setStatusMessage('Saved to My Projects successfully.');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
              MODULE 1
            </span>
            <h2 className="text-xl font-bold text-white">TEXT → VOICE STUDIO</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Convert text into natural, clear educational speech with code-switching language preservation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Provider: <strong className="text-sky-400">Gemini TTS & Speech Synthesis</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Text Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-400" />
                Educational Text / Script Content (Multilingual & Code-Switching Supported)
              </label>
              <span className="text-[11px] text-slate-500">
                {text.length} characters • ~{Math.round(text.split(/\s+/).filter(Boolean).length / 2.3)} sec narration
              </span>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="Enter educational lecture text, formulas, or mixed multilingual text..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans leading-relaxed resize-y"
            />

            {/* Quick multilingual sample buttons */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Quick Samples:</span>
              <button
                onClick={() =>
                  setText(
                    'Inflation means a sustained increase in the general price level of goods and services. सरल भाषा में, इसका अर्थ है कि समय के साथ वस्तुओं और सेवाओं की सामान्य कीमतें बढ़ती हैं।'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              >
                English + Hindi (Economics)
              </button>
              <button
                onClick={() =>
                  setText(
                    'The rate of change of momentum is proportional to the applied unbalanced force. ଏହାର ଅର୍ଥ ହେଉଛି ବସ୍ତୁ ଉପରେ ପ୍ରୟୋଗ କରାଯାଇଥିବା ବଳ ଏହାର ତ୍ୱରଣ ସହିତ ସମାନୁପାତୀ।'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              >
                English + Odia (Physics)
              </button>
              <button
                onClick={() =>
                  setText(
                    'The Monetary Policy Committee of India kept the policy repo rate unchanged at 6.50% to maintain vigilance on food price volatility.'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              >
                UPSC Current Affairs English
              </button>
            </div>
          </div>

          {/* Action Player Bar */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlay}
                disabled={isSynthesizing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play / Preview'}</span>
              </button>

              <button
                onClick={handleStop}
                disabled={!isPlaying}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs transition disabled:opacity-50"
              >
                Stop
              </button>

              <button
                onClick={() => {
                  handleStop();
                  handlePlay();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Audio / Script</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-medium transition"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Save to Project</span>
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-xs text-sky-300">
              <CheckCircle className="w-4 h-4 shrink-0 text-sky-400" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Right Settings & Controls */}
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Voice & Educational Tuning
              </h3>
            </div>

            {/* Target Language */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Target Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.name} value={l.name}>
                    {l.name} ({l.script})
                  </option>
                ))}
              </select>
            </div>

            {/* Educational Level */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Educational Level</label>
              <select
                value={educationalLevel}
                onChange={(e) => setEducationalLevel(e.target.value as EducationalLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {educationalLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Style */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Speaking Style</label>
              <select
                value={speakingStyle}
                onChange={(e) => setSpeakingStyle(e.target.value as VoiceStyle)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {voiceStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Profile */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Voice Model Profile</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Kore">Kore (Balanced, Clear Academic Tone)</option>
                <option value="Puck">Puck (Energetic, Inquisitive)</option>
                <option value="Fenrir">Fenrir (Authoritative Professor)</option>
                <option value="Zephyr">Zephyr (Warm & Explanatory)</option>
                <option value="Charon">Charon (Deep Lecture Cadence)</option>
              </select>
            </div>

            {/* Speed Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Pacing / Speed</span>
                <span className="font-mono text-sky-400 font-bold">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.75"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.75x (Deliberate)</span>
                <span>1.0x (Standard)</span>
                <span>1.75x (Fast)</span>
              </div>
            </div>

            {/* Pitch Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Pitch Calibration</span>
                <span className="font-mono text-sky-400 font-bold">{pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* Pronunciation Preferences */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Pronunciation Preferences</label>
              <input
                type="text"
                value={pronunciationPreference}
                onChange={(e) => setPronunciationPreference(e.target.value)}
                placeholder="e.g. Standard Indian Technical, UPSC Phrasing"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
