import { useEffect } from 'react';
import { ArpitonModule } from '../types';

interface ShortcutHandlers {
  onSelectModule: (module: ArpitonModule, shortcutLabel?: string) => void;
  onSaveProject: () => void;
  onTriggerGenerate: () => void;
  onTogglePalette: () => void;
  onQuickExport: () => void;
}

export function useGlobalShortcuts({
  onSelectModule,
  onSaveProject,
  onTriggerGenerate,
  onTogglePalette,
  onQuickExport,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // 1. Modifier-based shortcuts (work even if input/textarea is focused)
      if (modKey) {
        // Ctrl+K: Open Command Palette
        if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          onTogglePalette();
          return;
        }

        // Ctrl+S: Quick Save
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          onSaveProject();
          return;
        }

        // Ctrl+G: Trigger Generate
        if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          onTriggerGenerate();
          return;
        }

        // Ctrl+E: Quick Export / Composer
        if (e.key.toLowerCase() === 'e') {
          e.preventDefault();
          onQuickExport();
          return;
        }

        // Ctrl+,: Settings
        if (e.key === ',') {
          e.preventDefault();
          onSelectModule('settings', 'Ctrl+,');
          return;
        }

        // Ctrl+Shift+W: Watermark Manager
        if (e.shiftKey && e.key.toLowerCase() === 'w') {
          e.preventDefault();
          onSelectModule('assets', 'Ctrl+Shift+W');
          return;
        }

        // Ctrl+Shift+C: Script Command Engine
        if (e.shiftKey && e.key.toLowerCase() === 'c') {
          e.preventDefault();
          onSelectModule('shortcuts', 'Ctrl+Shift+C');
          return;
        }

        // Numeric Navigation: Ctrl+1 to Ctrl+9
        const numberMap: Record<string, { mod: ArpitonModule; name: string }> = {
          '1': { mod: 'dashboard', name: 'Dashboard' },
          '2': { mod: 'tts', name: 'Text → Voice Studio' },
          '3': { mod: 'script-video', name: 'Script → Slides + Voice' },
          '4': { mod: 'classroom-3d', name: '3D Classroom' },
          '5': { mod: 'pdf-script', name: 'PDF → AI Script' },
          '6': { mod: 'script-builder', name: 'AI Script Builder' },
          '7': { mod: 'current-affairs', name: 'Current Affairs' },
          '8': { mod: 'composer', name: 'Video Composer' },
          '9': { mod: 'projects', name: 'Project Vault' },
        };

        if (numberMap[e.key]) {
          e.preventDefault();
          onSelectModule(numberMap[e.key].mod, `Ctrl+${e.key}`);
          return;
        }
      }

      // 2. Non-modifier shortcuts (ONLY when NOT focusing an input or textarea)
      if (!isInputFocused) {
        // Press '?' to open keyboard shortcuts
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          e.preventDefault();
          onTogglePalette();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSelectModule, onSaveProject, onTriggerGenerate, onTogglePalette, onQuickExport]);
}
