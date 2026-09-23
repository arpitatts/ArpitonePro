import React, { useState, useCallback, useEffect } from 'react';
import { ArpitonModule, SupportedLanguage, ProjectItem, WatermarkSettings, ParsedScene, AppLogoSettings, FounderSettings } from './types';
import { DEFAULT_WATERMARK_SETTINGS, INITIAL_PROJECTS, SAMPLE_ECONOMICS_SCRIPT, DEFAULT_APP_LOGO_SETTINGS, DEFAULT_FOUNDER_SETTINGS } from './data/defaultData';
import { parseArpitonScript } from './services/scriptParser';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { AboutAppModal } from './components/AboutAppModal';
import { AppLogoManagerModal } from './components/AppLogoManagerModal';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TextToVoiceModule } from './components/TextToVoiceModule';
import { ScriptToVideoModule } from './components/ScriptToVideoModule';
import { Classroom3DModule } from './components/Classroom3DModule';
import { PdfToScriptModule } from './components/PdfToScriptModule';
import { ScriptBuilderModule } from './components/ScriptBuilderModule';
import { CurrentAffairsModule } from './components/CurrentAffairsModule';
import { ShortcutsModule } from './components/ShortcutsModule';
import { VideoComposerModule } from './components/VideoComposerModule';
import { WatermarkManagerModule } from './components/WatermarkManagerModule';
import { ProjectManagerModule } from './components/ProjectManagerModule';
import { UserManualModule } from './components/UserManualModule';
import { FounderModule } from './components/FounderModule';
import { SettingsModule } from './components/SettingsModule';
import { AiPromptStudioModule } from './components/AiPromptStudioModule';

export default function App() {
  const [currentModule, setCurrentModule] = useState<ArpitonModule>('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('English');
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>(DEFAULT_WATERMARK_SETTINGS);
  const [logoSettings, setLogoSettings] = useState<AppLogoSettings>(() => {
    try {
      const saved = localStorage.getItem('arpiton_logo_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_APP_LOGO_SETTINGS;
  });
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(INITIAL_PROJECTS[0]);

  // Master active scenes for presentations & video composer
  const [currentScenes, setCurrentScenes] = useState<ParsedScene[]>(() =>
    parseArpitonScript(SAMPLE_ECONOMICS_SCRIPT)
  );

  // Modals state
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isLogoManagerOpen, setIsLogoManagerOpen] = useState<boolean>(false);

  // Persist logo settings
  const handleUpdateLogoSettings = (newSettings: AppLogoSettings) => {
    setLogoSettings(newSettings);
    try {
      localStorage.setItem('arpiton_logo_settings', JSON.stringify(newSettings));
    } catch (e) {
      // storage error
    }
  };

  // Founder settings state & persistence
  const [founderSettings, setFounderSettings] = useState<FounderSettings>(() => {
    try {
      const saved = localStorage.getItem('arpiton_founder_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_FOUNDER_SETTINGS;
  });

  const handleUpdateFounderSettings = (newSettings: FounderSettings) => {
    setFounderSettings(newSettings);
    try {
      localStorage.setItem('arpiton_founder_settings', JSON.stringify(newSettings));
    } catch (e) {
      // storage error
    }
  };

  const [classroomScript, setClassroomScript] = useState<string>('');

  const handleSendToClassroom = (script: string, title?: string) => {
    setClassroomScript(script);
    setCurrentModule('classroom-3d');
    addToast('Loaded in 3D Virtual Classroom', `${title || 'Teaching Script'} ready on blackboard`, 'success');
  };

  // Toast notifications for action feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, description?: string, type: 'success' | 'info' | 'shortcut' = 'shortcut') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Quick action: Send script into Slide Studio
  const handleSendToSlideStudio = (script: string, title?: string) => {
    const parsed = parseArpitonScript(script);
    setCurrentScenes(parsed);

    // Also create or update project item
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: title || 'New Educational Masterclass',
      subject: 'Educational Masterclass',
      topic: title || 'Subject Masterclass',
      level: 'Competitive Exam (UPSC/State PSC)',
      language: currentLanguage,
      status: 'completed',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      script,
      sceneCount: parsed.length,
      totalDurationSec: parsed.reduce((acc, s) => acc + s.estimatedDurationSec, 0),
      aspectRatio: '16:9',
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    setCurrentModule('script-video');
    addToast('Script Loaded in Studio', `${parsed.length} slides synthesized`, 'success');
  };

  // Quick action: Send scenes directly into Video Composer
  const handleNavigateToComposer = (scenes: ParsedScene[]) => {
    setCurrentScenes(scenes);
    setCurrentModule('composer');
    addToast('Opened in Video Composer', `${scenes.length} scenes queued for render`, 'info');
  };

  // Open Project
  const handleOpenProject = (project: ProjectItem) => {
    setActiveProject(project);
    const parsed = parseArpitonScript(project.script);
    setCurrentScenes(parsed);
    setCurrentLanguage(project.language);
    setCurrentModule('script-video');
    addToast('Project Loaded', project.title, 'success');
  };

  // Create New Project
  const handleCreateNewProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Untitled Educational Masterclass',
      subject: 'General Studies',
      topic: 'Core Concepts Analysis',
      level: 'Class 11–12',
      language: currentLanguage,
      status: 'draft',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      script: `### SLIDE 1: Introduction to Core Concepts\n[HIGHLIGHT]\nSubject: Educational Masterclass\nTarget: High-Retention Visual Learning\n\nNarration:\nWelcome students to this ARPITON masterclass.`,
      sceneCount: 1,
      totalDurationSec: 30,
      aspectRatio: '16:9',
    };
    setProjects((prev) => [newProj, ...prev]);
    handleOpenProject(newProj);
  };

  // Duplicate Project
  const handleDuplicateProject = (project: ProjectItem) => {
    const dup: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} (Copy)`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setProjects((prev) => [dup, ...prev]);
    addToast('Project Duplicated', dup.title, 'info');
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
    addToast('Project Removed', 'Deleted from local project vault', 'info');
  };

  // Global Shortcut Handlers
  const handleShortcutSelectModule = useCallback((mod: ArpitonModule, shortcutLabel?: string) => {
    setCurrentModule(mod);
    const moduleNames: Record<ArpitonModule, string> = {
      'dashboard': 'Studio Dashboard',
      'tts': 'Text → Voice Studio',
      'script-video': 'Script → Slides + Voice',
      'classroom-3d': '3D Classroom Animation',
      'pdf-script': 'PDF → AI Teaching Script',
      'script-builder': 'AI Script Builder',
      'current-affairs': 'Current Affairs Studio',
      'ai-prompt': 'AI Prompt Studio',
      'shortcuts': 'Script Command Engine',
      'composer': 'Video Composer',
      'assets': 'Satya Gyan Watermark Manager',
      'projects': 'My Projects & Vault',
      'manual': 'User Manual & Guides',
      'founder': 'Founder & Dedication',
      'settings': 'Settings & AI Keys',
    };
    addToast(
      `Switched to ${moduleNames[mod]}`,
      shortcutLabel ? `Triggered via ${shortcutLabel}` : undefined,
      'shortcut'
    );
  }, [addToast]);

  const handleShortcutSave = useCallback(() => {
    if (activeProject) {
      const updated: ProjectItem = {
        ...activeProject,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sceneCount: currentScenes.length,
        totalDurationSec: currentScenes.reduce((acc, s) => acc + s.estimatedDurationSec, 0),
      };
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setActiveProject(updated);
      addToast('Project Saved (Ctrl+S)', `"${updated.title}" successfully saved to vault.`, 'success');
    } else {
      handleCreateNewProject();
      addToast('Draft Saved (Ctrl+S)', 'New educational draft created.', 'success');
    }
  }, [activeProject, currentScenes, addToast]);

  const handleShortcutGenerate = useCallback(() => {
    // If not in a generator module, navigate to Script Builder
    if (currentModule === 'dashboard' || currentModule === 'manual' || currentModule === 'assets') {
      setCurrentModule('script-builder');
      addToast('AI Script Builder (Ctrl+G)', 'Ready to synthesize 14-step pedagogical masterclass.', 'shortcut');
    } else {
      addToast('Triggering AI Synthesizer (Ctrl+G)', `Active in ${currentModule.toUpperCase()}`, 'shortcut');
      // Dispatch custom trigger event for active module if applicable
      window.dispatchEvent(new CustomEvent('arpiton:trigger-generate', { detail: { module: currentModule } }));
    }
  }, [currentModule, addToast]);

  const handleShortcutQuickExport = useCallback(() => {
    setCurrentModule('composer');
    addToast('Opening Video Composer (Ctrl+E)', `${currentScenes.length} scenes loaded for render.`, 'shortcut');
  }, [currentScenes.length, addToast]);

  const handleTogglePalette = useCallback(() => {
    setIsShortcutsOpen((prev) => !prev);
  }, []);

  // Register Global Keyboard Shortcuts Listener
  useGlobalShortcuts({
    onSelectModule: handleShortcutSelectModule,
    onSaveProject: handleShortcutSave,
    onTriggerGenerate: handleShortcutGenerate,
    onTogglePalette: handleTogglePalette,
    onQuickExport: handleShortcutQuickExport,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Application Header */}
      <Header
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        activeProject={activeProject}
        watermarkSettings={watermarkSettings}
        logoSettings={logoSettings}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenLogoManager={() => setIsLogoManagerOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Body with Sidebar Navigation & Module Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
        {/* Navigation Sidebar */}
        <Navigation
          currentModule={currentModule}
          onSelectModule={setCurrentModule}
        />

        {/* Dynamic Module Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950/50">
          {currentModule === 'dashboard' && (
            <Dashboard
              onSelectModule={setCurrentModule}
              projects={projects}
              watermarkSettings={watermarkSettings}
              onOpenProject={handleOpenProject}
            />
          )}

          {currentModule === 'tts' && (
            <TextToVoiceModule
              currentLanguage={currentLanguage}
              onSaveToProject={(title, text) => {
                handleSendToSlideStudio(`### SLIDE 1: Narration Script\n[HIGHLIGHT]\n${text}\n\nNarration:\n${text}`, title);
              }}
            />
          )}

          {currentModule === 'script-video' && (
            <ScriptToVideoModule
              watermarkSettings={watermarkSettings}
              currentLanguage={currentLanguage}
              onNavigateToComposer={handleNavigateToComposer}
            />
          )}

          {currentModule === 'classroom-3d' && (
            <Classroom3DModule
              watermarkSettings={watermarkSettings}
              initialScript={classroomScript}
            />
          )}

          {currentModule === 'pdf-script' && (
            <PdfToScriptModule
              currentLanguage={currentLanguage}
              onSendToSlideStudio={handleSendToSlideStudio}
            />
          )}

          {currentModule === 'script-builder' && (
            <ScriptBuilderModule
              currentLanguage={currentLanguage}
              onSendToSlideStudio={handleSendToSlideStudio}
            />
          )}

          {currentModule === 'current-affairs' && (
            <CurrentAffairsModule
              currentLanguage={currentLanguage}
              onSendToSlideStudio={handleSendToSlideStudio}
              onSendToClassroom={handleSendToClassroom}
            />
          )}

          {currentModule === 'ai-prompt' && (
        <AiPromptStudioModule
          currentLanguage={currentLanguage}
          onSendToSlideStudio={handleSendToSlideStudio}
          onSendToClassroom={handleSendToClassroom}
        />
      )}

          {currentModule === 'composer' && (
            <VideoComposerModule
              scenes={currentScenes}
              watermarkSettings={watermarkSettings}
              currentLanguage={currentLanguage}
            />
          )}

          {currentModule === 'assets' && (
            <WatermarkManagerModule
              settings={watermarkSettings}
              onUpdateSettings={setWatermarkSettings}
            />
          )}

          {currentModule === 'projects' && (
            <ProjectManagerModule
              projects={projects}
              onOpenProject={handleOpenProject}
              onCreateNewProject={handleCreateNewProject}
              onDeleteProject={handleDeleteProject}
              onDuplicateProject={handleDuplicateProject}
            />
          )}

          {currentModule === 'manual' && <UserManualModule />}

          {currentModule === 'founder' && (
            <FounderModule
              founderSettings={founderSettings}
              onUpdateFounderSettings={handleUpdateFounderSettings}
            />
          )}

          {currentModule === 'settings' && (
            <SettingsModule
              currentLanguage={currentLanguage}
              onChangeLanguage={setCurrentLanguage}
              watermarkSettings={watermarkSettings}
              onNavigateToWatermark={() => setCurrentModule('assets')}
              onOpenLogoManager={() => setIsLogoManagerOpen(true)}
              onOpenAbout={() => setIsAboutOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Keyboard Shortcut Manager Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onSelectModule={(mod) => handleShortcutSelectModule(mod, 'Command Palette')}
        onTriggerAction={(actionId) => {
          if (actionId === 'save') handleShortcutSave();
          else if (actionId === 'generate') handleShortcutGenerate();
          else if (actionId === 'escape') setIsShortcutsOpen(false);
        }}
      />

      {/* About the App Modal */}
      <AboutAppModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenSettings={() => {
          setIsAboutOpen(false);
          setCurrentModule('settings');
        }}
        onOpenClassroom={() => {
          setIsAboutOpen(false);
          setCurrentModule('classroom-3d');
        }}
      />

      {/* App & Web Logo Manager Modal */}
      <AppLogoManagerModal
        isOpen={isLogoManagerOpen}
        onClose={() => setIsLogoManagerOpen(false)}
        logoSettings={logoSettings}
        onUpdateLogoSettings={handleUpdateLogoSettings}
      />

      {/* Toast Notification Stack */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
