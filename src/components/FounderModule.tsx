import React, { useState, useEffect, useRef } from 'react';
import { FounderSettings } from '../types';
import { DEFAULT_FOUNDER_SETTINGS } from '../data/defaultData';
import {
  Heart,
  User,
  Upload,
  Sparkles,
  Camera,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  Award,
  BookOpen,
  RefreshCw,
  Download,
  Share2,
  Atom,
  Dna,
  Edit3,
  Save,
} from 'lucide-react';

interface FounderModuleProps {
  founderSettings?: FounderSettings;
  onUpdateFounderSettings?: (settings: FounderSettings) => void;
}

export const FounderModule: React.FC<FounderModuleProps> = ({
  founderSettings = DEFAULT_FOUNDER_SETTINGS,
  onUpdateFounderSettings,
}) => {
  const [settings, setSettings] = useState<FounderSettings>(founderSettings);
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [tempNote, setTempNote] = useState<string>(settings.dedicationNote);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync with prop if changes
  useEffect(() => {
    setSettings(founderSettings);
    setTempNote(founderSettings.dedicationNote);
  }, [founderSettings]);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleUpdate = (updated: FounderSettings) => {
    setSettings(updated);
    if (onUpdateFounderSettings) {
      onUpdateFounderSettings(updated);
    }
  };

  // Handle image upload from computer
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updated: FounderSettings = {
        ...settings,
        photoUrl: base64,
        photoCaption:
          settings.photoSubject === 'arpita'
            ? 'Arpita Biswal • My Love & Inspiration'
            : settings.photoSubject === 'both'
            ? 'Satya Subham & Arpita Biswal'
            : 'Satya Subham Biswal • Founder of ARPITON',
      };
      handleUpdate(updated);
      notify('Photo uploaded and updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const updated: FounderSettings = {
      ...settings,
      photoUrl: '',
    };
    handleUpdate(updated);
    notify('Custom photo cleared. Showing default founder emblem.');
  };

  const handleSaveNote = () => {
    const updated: FounderSettings = {
      ...settings,
      dedicationNote: tempNote,
    };
    handleUpdate(updated);
    setIsEditingNote(false);
    notify('Dedication message saved!');
  };

  // Border glow styles
  const getGlowClasses = () => {
    switch (settings.borderGlow) {
      case 'rose':
        return 'ring-4 ring-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.4)] border-rose-400';
      case 'indigo':
        return 'ring-4 ring-indigo-500/60 shadow-[0_0_35px_rgba(99,102,241,0.4)] border-indigo-400';
      case 'emerald':
        return 'ring-4 ring-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.4)] border-emerald-400';
      case 'gold':
      default:
        return 'ring-4 ring-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.4)] border-amber-300';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header Banner with Love & Vision */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
              <span>Dedicated with Eternal Love & Devotion</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Satya Subham Biswal
            </h1>

            <p className="text-base sm:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200">
              "This app I am dedicated to my wife, my love Arpita Biswal."
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              ARPITON is named in heartfelt devotion to <strong className="text-rose-300 font-semibold">Arpita</strong>. Built to democratize quality education across the world—from <strong className="text-sky-300">Class 6 to Doctoral PhD</strong> research—empowering every curious mind completely free.
            </p>
          </div>

          {/* Circular Photo Card with Upload / Switch */}
          <div className="flex flex-col items-center shrink-0 space-y-3">
            <div className="relative group">
              {/* Outer Circular Ring */}
              <div
                className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-slate-900 border-2 transition-all duration-300 flex items-center justify-center relative ${getGlowClasses()}`}
              >
                {settings.photoUrl ? (
                  <img
                    src={settings.photoUrl}
                    alt={settings.photoCaption}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-lg mb-2">
                      {settings.photoSubject === 'arpita' ? 'A' : 'SB'}
                    </div>
                    <span className="text-xs font-bold text-white leading-tight">
                      {settings.photoSubject === 'arpita'
                        ? 'Arpita Biswal'
                        : settings.photoSubject === 'both'
                        ? 'Satya & Arpita'
                        : 'Satya Subham Biswal'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Click to upload photo</span>
                  </div>
                )}

                {/* Hover overlay to change photo */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2 cursor-pointer"
                  title="Upload / Change Photo"
                >
                  <Camera className="w-6 h-6 text-amber-300 animate-bounce" />
                  <span className="text-xs font-bold text-slate-100">Upload Photo</span>
                  <span className="text-[10px] text-slate-300 text-center">Satya or Arpita Photo</span>
                </button>
              </div>

              {/* Photo Subject Badge */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-950/90 border border-slate-700 px-3 py-0.5 rounded-full text-[10px] font-bold text-amber-300 shadow-md whitespace-nowrap">
                {settings.photoSubject === 'arpita'
                  ? 'Arpita Biswal (Love & Inspiration)'
                  : settings.photoSubject === 'both'
                  ? 'Satya & Arpita Biswal'
                  : 'Satya Subham Biswal (Founder)'}
              </div>
            </div>

            {/* Quick Photo Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>

              {settings.photoUrl && (
                <button
                  onClick={handleRemovePhoto}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                  title="Remove uploaded photo and revert to emblem"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Photo Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-lg text-[10px]">
              <button
                onClick={() =>
                  handleUpdate({
                    ...settings,
                    photoSubject: 'satya',
                    photoCaption: 'Satya Subham Biswal • Founder of ARPITON',
                  })
                }
                className={`px-2 py-0.5 rounded transition ${
                  settings.photoSubject === 'satya'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Satya
              </button>
              <button
                onClick={() =>
                  handleUpdate({
                    ...settings,
                    photoSubject: 'arpita',
                    photoCaption: 'Arpita Biswal • My Beloved Wife & Inspiration',
                  })
                }
                className={`px-2 py-0.5 rounded transition ${
                  settings.photoSubject === 'arpita'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Arpita
              </button>
              <button
                onClick={() =>
                  handleUpdate({
                    ...settings,
                    photoSubject: 'both',
                    photoCaption: 'Satya Subham & Arpita Biswal',
                  })
                }
                className={`px-2 py-0.5 rounded transition ${
                  settings.photoSubject === 'both'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Together
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Content Grid: Love Dedication Letter & Mission Charter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dedication Love Letter */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <h3 className="text-sm font-bold text-white">
                  The Story of ARPITON • Dedicated to Arpita Biswal
                </h3>
              </div>
              <button
                onClick={() => {
                  if (isEditingNote) {
                    handleSaveNote();
                  } else {
                    setIsEditingNote(true);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
              >
                {isEditingNote ? (
                  <>
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save Note</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Edit Dedication</span>
                  </>
                )}
              </button>
            </div>

            {isEditingNote ? (
              <div className="space-y-3">
                <textarea
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setTempNote(settings.dedicationNote);
                      setIsEditingNote(false);
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative p-5 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-serif italic space-y-3">
                <p className="text-slate-200">
                  "{settings.dedicationNote}"
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 not-italic font-sans text-[11px] text-slate-400">
                  <span>With all my love & gratitude,</span>
                  <span className="font-bold text-amber-300">Satya Subham Biswal</span>
                </div>
              </div>
            )}

            {/* Glowing Border Style Selector */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Photo Frame Halo & Aura
              </span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'gold', name: 'Golden Sun', color: 'bg-amber-500' },
                  { id: 'rose', name: 'Romantic Rose', color: 'bg-rose-500' },
                  { id: 'indigo', name: 'Celestial Indigo', color: 'bg-indigo-500' },
                  { id: 'emerald', name: 'Gyan Emerald', color: 'bg-emerald-500' },
                ].map((halo) => (
                  <button
                    key={halo.id}
                    onClick={() =>
                      handleUpdate({
                        ...settings,
                        borderGlow: halo.id as any,
                      })
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition ${
                      settings.borderGlow === halo.id
                        ? 'bg-slate-800 border-white text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${halo.color}`} />
                    <span>{halo.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Free Forever Charter & Guarantee */}
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-emerald-200">
                100% Free & Open Education Guarantee
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {settings.missionPledge}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 block mb-0.5">Zero Paywalls</span>
                <span className="text-[11px] text-slate-400">All features, 3D labs, and voice synthesis are unrestricted.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 block mb-0.5">Class 6 to PhD</span>
                <span className="text-[11px] text-slate-400">Tailored pedagogy from middle school through doctoral research.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 block mb-0.5">Personal Mission</span>
                <span className="text-[11px] text-slate-400">Crafted by Satya Subham Biswal for students everywhere.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Universal Scientific & Multidisciplinary Breadth */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">
                Universal Education: Class 6 to PhD
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ARPITON is not confined to economics. Every scientific, physical, chemical, biological, and mathematical phenomenon can be simulated and taught:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                  <Dna className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Biological & Zoological Models</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    3D DNA double helix unzipping, cellular mitosis, cardiac ventricle circulation, and biochemical ATP cycles.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 shrink-0">
                  <Atom className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Chemical Lab Experiments</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Live acid-base titrations with burette dripping, color indicator transitions, water electrolysis, and molecular bonding.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Physical Mechanics & Simulations</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Projectile motion trajectories, vector force resolution, gravity calculations, and optical refraction.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Deterministic Economics & Social Sciences</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supply-demand coordinates, market equilibrium (E0, E1), elasticity, and macro fiscal policy models.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Identity Card */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 text-xs text-slate-300 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Creator Identity & Hallmark
            </span>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Founder:</span>
              <span className="font-bold text-white">Satya Subham Biswal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Dedication:</span>
              <span className="font-bold text-rose-300">Arpita Biswal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Platform Brand:</span>
              <span className="font-bold text-indigo-400">ARPITON</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Content Hallmark:</span>
              <span className="font-bold text-amber-400">Satya Gyan</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">License:</span>
              <span className="font-bold text-emerald-400">100% Free & Open Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
