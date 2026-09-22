import React, { useState, useEffect } from 'react';
import { SupportedLanguage, EducationalLevel, WatermarkSettings } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/defaultData';
import { testGeminiApiKey, checkServerHealth } from '../services/geminiService';
import {
  Settings,
  ShieldCheck,
  Key,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface SettingsModuleProps {
  currentLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  watermarkSettings: WatermarkSettings;
  onNavigateToWatermark: () => void;
  onOpenLogoManager?: () => void;
  onOpenAbout?: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  currentLanguage,
  onChangeLanguage,
  watermarkSettings,
  onNavigateToWatermark,
  onOpenLogoManager,
  onOpenAbout,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [serverHealth, setServerHealth] = useState<{ status: string; geminiConfigured?: boolean }>({
    status: 'checking...',
  });

  useEffect(() => {
    checkServerHealth().then((res) => {
      setServerHealth(res);
    });
  }, []);

  const handleTestKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    try {
      const res = await testGeminiApiKey(apiKeyInput || undefined);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Error testing API key connection',
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700 font-bold">
              MODULE 12
            </span>
            <h2 className="text-xl font-bold text-white">SETTINGS & AI PROVIDER CONFIGURATION</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage server-side AI integrations, default educational preferences, and system security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gemini AI Integration */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Gemini AI Provider (Server-Side)
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Secure Proxy Active
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            By default, ARPITON communicates through the secure backend container endpoint using the environment's configured <code>GEMINI_API_KEY</code>. You can optionally test a specific key here.
          </p>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Custom Gemini API Key (Optional Override)
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Leave empty to use container default key"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            />
          </div>

          <button
            onClick={handleTestKey}
            disabled={isTestingKey}
            className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            {isTestingKey ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying Gemini Connection...</span>
              </>
            ) : (
              <span>Test Gemini API Connection</span>
            )}
          </button>

          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div>
                <span className="font-bold block">{testResult.success ? 'Success' : 'Connection Notice'}</span>
                <span>{testResult.message}</span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>API keys are never exposed in client browser code or network headers.</span>
          </div>
        </div>

        {/* Global Platform Defaults */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Platform Preferences
              </h3>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Default Teaching Language</label>
            <select
              value={currentLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} ({l.script})
                </option>
              ))}
            </select>
          </div>

          {/* App Logo & Brand Identity */}
          <div className="p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300">App & Web Logo / Crest:</span>
              <span className="text-xs font-bold text-white">Customizable</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Personalize the application header icon, favicon, crest shape, and institute branding.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {onOpenLogoManager && (
                <button
                  onClick={onOpenLogoManager}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                >
                  Change Logo & Crest
                </button>
              )}
              {onOpenAbout && (
                <button
                  onClick={onOpenAbout}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                >
                  About the App (What & How)
                </button>
              )}
            </div>
          </div>

          {/* Satya Gyan Watermark Status */}
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">Video Content Watermark:</span>
              <span className="text-xs font-serif font-bold text-amber-400">
                {watermarkSettings.brandName}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Active position: <strong className="text-amber-200">{watermarkSettings.position}</strong> • Opacity: <strong className="text-amber-200">{Math.round(watermarkSettings.opacity * 100)}%</strong>
            </p>
            <button
              onClick={onNavigateToWatermark}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 pt-1"
            >
              <span>Manage Satya Gyan Logo & Position (Module 9)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Privacy & PDF Lifecycle Assurance */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Temporary Document Lifecycle:</span>
            <p>
              Educational PDF files processed by Module 4 are held strictly as temporary in-memory buffers during analysis and are immediately purged from server RAM upon script completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
