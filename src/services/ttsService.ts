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
  private onEndCallbacks: (() => void)[] = [];

  // Provider abstraction: calls server Gemini TTS or falls back to Web Speech
  public async synthesizeSpeech(req: TtsRequest): Promise<TtsResponse> {
    try {
      // Select an authentic neural voice based on language
      const voice = req.language.toLowerCase().includes('hindi') ? 'hi-IN-MadhurNeural' : 'en-IN-PrabhatNeural';
      
      // Request audio stream from Python Render API
      const apiUrl = `https://https://arpita-studio-backend.onrender.com/generate-audio?text=${encodeURIComponent(req.text)}&voice=${voice}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'x-access-key': 'ARPITONE2026' }
      });

      if (response.ok) {
        // Convert the streamed MP3 directly into a playable Blob URL for the Video Recorder
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        
        return {
          success: true,
          provider: 'edge-tts',
          audioUrl,
        };
      }
    } catch (e) {
      console.warn('[TTS Provider] Python server request failed, using browser synthesis:', e);
    }

    return {
      success: true,
      provider: 'web-speech',
      message: 'Active browser speech synthesis engine ready.',
    };
  }

  // Play using Web Speech API with language, speed, and pitch control
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

    // Rate & Pitch
    utterance.rate = Math.max(0.6, Math.min(2.0, options.speed || 1.0));
    utterance.pitch = Math.max(0.7, Math.min(1.4, options.pitch || 1.0));

    // Language selection
    const voices = window.speechSynthesis.getVoices();
    const langCode = this.getLangCode(options.language || 'English');

    // Prefer Indian accent voices for English (en-IN)
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

    if (!matchedVoice && (langCode.startsWith('or') || options.language?.toLowerCase().includes('odia'))) {
      // If native Odia voice is unavailable in OS, fallback to Indian English or Hindi synth voice for natural subcontinent phonetics
      matchedVoice = voices.find((v) => v.lang.toLowerCase().includes('in') || v.lang.toLowerCase().includes('hi'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      utterance.lang = langCode;
    }

    utterance.onboundary = (event) => {
      if (options.onBoundary) {
        options.onBoundary(event.charIndex);
      }
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

    // Pitch & Rate tuning for sweet student voices vs teacher-like Satya
    if (isSatya) {
      utterance.pitch = 0.92;
      utterance.rate = 0.95;
    } else if (isArpita) {
      utterance.pitch = 1.26; // Sweet girl student
      utterance.rate = 1.04;
    } else if (isLucky) {
      utterance.pitch = 1.18; // Sweet thoughtful girl student
      utterance.rate = 0.98;
    } else if (isChintu) {
      utterance.pitch = 1.10; // Energetic boy student
      utterance.rate = 1.03;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    const voices = window.speechSynthesis.getVoices();
    const langCode = this.getLangCode(languageMode);

    // Filter by language first
    const langVoices = voices.filter((v) => 
      v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()) ||
      v.lang.toLowerCase().includes('in')
    );
    const pool = langVoices.length > 0 ? langVoices : voices;

    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (isSatya || isChintu) {
      // Prefer male timbre
      selectedVoice = pool.find((v) => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('ravi') || 
        v.name.toLowerCase().includes('hemant') || 
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('guy') ||
        v.name.toLowerCase().includes('george')
      ) || pool[0];
    } else if (isArpita || isLucky) {
      // Sweet female timbre for Arpita & Lucky
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
      Bengali: 'bn-IN',
      Assamese: 'as-IN',
      Marathi: 'mr-IN',
      Gujarati: 'gu-IN',
      Punjabi: 'pa-IN',
      Tamil: 'ta-IN',
      Telugu: 'te-IN',
      Kannada: 'kn-IN',
      Malayalam: 'ml-IN',
      Urdu: 'ur-IN',
    };
    return map[langName] || 'en-IN';
  }

  private pcmBase64ToAudioUrl(base64: string): string {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }
}

export const ttsService = new TtsService();
