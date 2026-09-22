import { VoiceStyle, SupportedLanguage } from '../types';

export interface TtsRequest {
  text: string;
  language: SupportedLanguage;
  voice: string;
  speakingStyle: VoiceStyle;
  speed: number;
  pitch?: number;
  customApiKey?: string;
}

export interface TtsResponse {
  success: boolean;
  provider: 'gemini-tts' | 'web-speech' | 'mock-synthesis' | 'edge-tts';
  audioUrl?: string;
  message?: string;
}

class TtsService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  // Uses the FastAPI backend to generate actual MP3 files for Video Export
  public async synthesizeSpeech(req: TtsRequest): Promise<TtsResponse> {
    try {
      // Use Render URL in production, or localhost during local development
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      // Map characters to Edge TTS Neural Voices
      let edgeVoice = 'en-IN-NeerjaNeural'; // Default Female Indian English
      const charLower = (req.voice || '').toLowerCase();

      if (charLower.includes('satya') || charLower.includes('chintu')) {
        edgeVoice = 'en-IN-PrabhatNeural'; // Male Indian English
      }
      
      // Hindi fallback voices
      if (req.language.toLowerCase().includes('hindi')) {
        edgeVoice = charLower.includes('satya') ? 'hi-IN-MadhurNeural' : 'hi-IN-SwaraNeural';
      }

      // Construct request to your FastAPI main.py
      const url = new URL(`${API_BASE_URL}/generate-audio`);
      url.searchParams.append('text', req.text);
      url.searchParams.append('voice', edgeVoice);
      url.searchParams.append('rate', '0');
      url.searchParams.append('pitch', '0');
      url.searchParams.append('volume', '0');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-access-key': 'ARPITONE2026' // Access key matching main.py
        }
      });

      if (response.ok) {
        // Convert MPEG stream to playable Blob URL for videoExportService
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        return {
          success: true,
          provider: 'edge-tts',
          audioUrl,
        };
      } else {
        console.warn('Edge TTS Backend rejected request:', await response.text());
      }
    } catch (e) {
      console.warn('[TTS Provider] Server TTS request failed, using browser speech synthesis:', e);
    }

    return {
      success: false,
      provider: 'web-speech',
      message: 'Failed to generate real audio file.',
    };
  }

  // ---------------------------------------------------------
  // WEB SPEECH API (Used for live 3D Classroom Playback only)
  // ---------------------------------------------------------
  public speak(
    text: string,
    options: {
      language?: string;
      speed?: number;
      pitch?: number;
      onBoundary?: (charIndex: number) => void;
      onEnd?: () => void;
    } = {}
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported on this browser.');
      options.onEnd?.();
      return;
    }

    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.rate = Math.max(0.6, Math.min(2.0, options.speed || 1.0));
    utterance.pitch = Math.max(0.7, Math.min(1.4, options.pitch || 1.0));

    const voices = window.speechSynthesis.getVoices();
    const langCode = this.getLangCode(options.language || 'English');

    let matchedVoice: SpeechSynthesisVoice | undefined;
    if (langCode === 'en-IN' || options.language === 'English') {
      matchedVoice = voices.find((v) =>
        v.lang.toLowerCase() === 'en-in' ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('ravi') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('neerja')
      );
    }

    if (!matchedVoice) {
      matchedVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()) || v.name.toLowerCase().includes(options.language?.toLowerCase() || '')
      );
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      utterance.lang = langCode;
    }

    utterance.onboundary = (event) => {
      if (options.onBoundary) options.onBoundary(event.charIndex);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    this.isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  public speakCharacter(
    text: string,
    characterId: 'satya' | 'arpita' | 'lucky' | 'chintu' | string,
    languageMode: string = 'only-eng',
    options: {
      onBoundary?: (charIndex: number) => void;
      onEnd?: () => void;
    } = {}
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options.onEnd?.();
      return;
    }

    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const charLower = characterId.toLowerCase();
    const isSatya = charLower.includes('satya') || charLower.includes('teacher');
    const isArpita = charLower.includes('arpita') || charLower.includes('student 1');
    const isLucky = charLower.includes('lucky') || charLower.includes('student 2');
    const isChintu = charLower.includes('chintu') || charLower.includes('student 3');

    if (isSatya) {
      utterance.pitch = 0.92;
      utterance.rate = 0.95;
    } else if (isArpita) {
      utterance.pitch = 1.26;
      utterance.rate = 1.04;
    } else if (isLucky) {
      utterance.pitch = 1.18;
      utterance.rate = 0.98;
    } else if (isChintu) {
      utterance.pitch = 1.10;
      utterance.rate = 1.03;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    const voices = window.speechSynthesis.getVoices();
    const langCode = this.getLangCode(languageMode);

    const langVoices = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()) ||
      v.lang.toLowerCase().includes('in')
    );

    const pool = langVoices.length > 0 ? langVoices : voices;
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (isSatya || isChintu) {
      selectedVoice = pool.find((v) =>
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('ravi') ||
        v.name.toLowerCase().includes('hemant') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('guy') ||
        v.name.toLowerCase().includes('george')
      ) || pool[0];
    } else if (isArpita || isLucky) {
      selectedVoice = pool.find((v) =>
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('neerja') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('priya')
      ) || pool[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      utterance.lang = langCode;
    }

    utterance.onboundary = (event) => {
      if (options.onBoundary) options.onBoundary(event.charIndex);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      options.onEnd?.();
    };

    this.isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  private getLangCode(langName: string): string {
    const map: Record<string, string> = {
      English: 'en-IN',
      'only-eng': 'en-IN',
      Hindi: 'hi-IN',
      'only-hindi': 'hi-IN',
      Odia: 'or-IN',
      'only-odia': 'or-IN',
      'Bilingual (English + Hindi)': 'hi-IN',
      'bilingual-eng-hindi': 'hi-IN',
      'Bilingual (English + Odia)': 'or-IN',
      'bilingual-eng-odia': 'or-IN',
    };
    return map[langName] || 'en-IN';
  }
}

export const ttsService = new TtsService();