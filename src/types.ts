export type ArpitonModule =
  | 'dashboard'
  | 'tts'
  | 'script-video'
  | 'classroom-3d'
  | 'pdf-script'
  | 'script-builder'
  | 'current-affairs'
  | 'ai-prompt'
  | 'shortcuts'
  | 'composer'
  | 'assets'
  | 'projects'
  | 'manual'
  | 'founder'
  | 'settings';

export type EducationalLevel =
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12'
  | 'Class 6–8'
  | 'Class 9–10'
  | 'Class 11–12'
  | 'Undergraduate'
  | 'Undergraduate (BSc/BA/BTech)'
  | 'Postgraduate'
  | 'Postgraduate (MSc/MA/MTech)'
  | 'PhD & Doctoral Research'
  | 'Competitive Exam (UPSC/State PSC)'
  | 'Competitive Exam (UPSC/State PSC/GATE/JEE/NEET)'
  | 'Research / Advanced';

export type SupportedLanguage =
  | 'English'
  | 'Hindi'
  | 'Odia'
  | 'German (Deutsch)'
  | 'Bilingual (English + Hindi)'
  | 'Bilingual (English + Odia)'
  | 'Bengali'
  | 'Assamese'
  | 'Marathi'
  | 'Gujarati'
  | 'Punjabi'
  | 'Tamil'
  | 'Telugu'
  | 'Kannada'
  | 'Malayalam'
  | 'Spanish'
  | 'French'
  | 'Urdu';

export type IndianVoiceLanguageMode =
  | 'only-eng'
  | 'only-odia'
  | 'only-hindi'
  | 'bilingual-eng-hindi'
  | 'bilingual-eng-odia';

export type ClassroomCharacterId = 'satya' | 'arpita' | 'lucky' | 'chintu';

export interface ClassroomCharacterConfig {
  id: ClassroomCharacterId;
  name: string;
  role: 'teacher' | 'student';
  gender: 'boy' | 'girl' | 'man' | 'woman';
  avatarColor: string;
  hairColor: string;
  shirtColor: string;
  skinColor: string;
  voicePitch: number;
  voiceRate: number;
  voiceLabel: string;
  description: string;
}

export interface AppLogoSettings {
  logoUrl: string;
  title: string;
  subtitle: string;
  shape: 'circle' | 'squircle' | 'rounded' | 'shield';
  useCustom: boolean;
}

export interface FounderSettings {
  founderName: string;
  founderRole: string;
  dedicationName: string;
  dedicationTagline: string;
  dedicationNote: string;
  photoUrl: string;
  photoCaption: string;
  photoSubject: 'satya' | 'arpita' | 'both';
  borderGlow: 'gold' | 'indigo' | 'rose' | 'emerald';
  missionPledge: string;
}

export type VoiceStyle =
  | 'Friendly teacher'
  | 'Calm teacher'
  | 'Energetic teacher'
  | 'Professional lecturer'
  | 'Storytelling'
  | 'News presenter'
  | 'Exam mentor'
  | 'Conversational';

export type VisualCommandType =
  | 'IMAGE'
  | 'DIAGRAM'
  | 'GRAPH'
  | 'EQUATION'
  | 'FORMULA'
  | 'TABLE'
  | 'TIMELINE'
  | 'MAP'
  | 'FLOW'
  | 'PROCESS'
  | '3D'
  | 'EXPERIMENT'
  | 'ECONOMICS'
  | 'MICRO'
  | 'MACRO'
  | 'STATISTICS'
  | 'MATH'
  | 'PHYSICS'
  | 'CHEMISTRY'
  | 'BIOLOGY'
  | 'QUESTION'
  | 'ANSWER'
  | 'EXAM'
  | 'HIGHLIGHT'
  | 'EXAMPLE'
  | 'REALWORLD'
  | 'SOURCE'
  | 'PAUSE'
  | 'ZOOM'
  | 'FOCUS'
  | 'REVEAL'
  | 'COMPARE'
  | 'RECAP'
  | 'SUMMARY';

export interface SceneImageData {
  prompt: string;
  url: string;
  caption: string;
  source: 'wikipedia' | 'wikimedia' | 'scientific' | 'custom';
  altText?: string;
}

export interface ScientificVisualData {
  category: 'economics' | 'math' | 'physics' | 'chemistry' | 'statistics' | 'biology' | 'general' | 'question' | 'timeline' | 'table' | 'image';
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  curves?: {
    label: string;
    type: string;
    color: string;
    points?: { x: number; y: number }[];
  }[];
  equilibriumPoint?: { label: string; x: number; y: number; price?: string; quantity?: string };
  shiftDirection?: 'right' | 'left' | 'up' | 'down' | 'none';
  equations?: string[];
  keyParameters?: { name: string; value: string; unit?: string }[];
  questionData?: {
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    examTag?: string;
  };
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  steps?: { title: string; desc: string }[];
  experimentType?: 'titration' | 'projectile' | 'dna-helix' | 'mitosis' | 'electrolysis' | 'none';
  activePointHighlight?: string;
  imageData?: SceneImageData;
}

export interface ParsedScene {
  id: string;
  slideNumber: number;
  title: string;
  commands: VisualCommandType[];
  contentLines: string[];
  narration: string;
  estimatedDurationSec: number;
  visualData: ScientificVisualData;
  animationType: 'fade' | 'zoom' | 'slide-left' | 'progressive-reveal' | 'graph-draw';
  watermarkEnabled: boolean;
  highlightWords: string[];
  imageData?: SceneImageData;
  notes?: string;
}

export type WatermarkPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type WatermarkDisplayMode = 'both' | 'logo-only' | 'text-only';
export type WatermarkLogoShape = 'circle' | 'squircle';

export type SubjectAtmosphereType =
  | 'chemistry'
  | 'physics'
  | 'biology'
  | 'economics'
  | 'mathematics'
  | 'current-affairs'
  | 'general';

export interface WatermarkSettings {
  brandName: string; // 'SatyaGyana'
  tagline: string;   // 'LEARN • GROW • SUCCEED'
  logoUrl?: string;
  position: WatermarkPosition;
  opacity: number;   // 0.2 to 1.0
  scale: number;     // 0.6 to 1.5
  showTagline: boolean;
  useCustomLogo: boolean;
  displayMode?: WatermarkDisplayMode; // 'both' | 'logo-only' | 'text-only'
  logoShape?: WatermarkLogoShape;     // 'circle' | 'squircle'
  // Full-Page / Slide Document Background Watermark (Behind Text)
  documentWatermarkUrl?: string;
  documentWatermarkOpacity?: number;
  documentWatermarkScale?: number;
  documentWatermarkAngle?: number;
  documentWatermarkText?: string;
  enableDocumentBackgroundWatermark?: boolean;
}

export type ProjectStatus = 'draft' | 'processing' | 'completed' | 'failed' | 'exported';

export interface ProjectItem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  level: EducationalLevel;
  language: SupportedLanguage;
  status: ProjectStatus;
  updatedAt: string;
  script: string;
  sceneCount: number;
  totalDurationSec: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
}

export type CameraShotType =
  | 'wide-classroom'
  | 'classroom-wide'
  | 'teacher-closeup'
  | 'teacher-close-up'
  | 'teacher-reply'
  | 'arpita-closeup'
  | 'lucky-closeup'
  | 'chintu-closeup'
  | 'student-closeup'
  | 'student-question'
  | 'board-view'
  | 'board-zoom'
  | 'over-shoulder'
  | 'over-the-shoulder'
  | 'two-person'
  | 'side-angle'
  | 'split-view'
  | 'group-discussion'
  | 'reaction-shot';

export interface DialogueLine {
  id: string;
  speakerId: 'TEACHER' | 'STUDENT 1' | 'STUDENT 2' | 'STUDENT 3' | 'SATYA' | 'ARPITA' | 'LUCKY' | 'CHINTU' | 'MODERATOR' | 'PANELIST';
  speaker?: string;
  speakerName: string;
  characterId?: ClassroomCharacterId;
  avatarColor: string;
  text: string;
  durationSec: number;
  cameraShot: CameraShotType;
  facialExpression: 'neutral' | 'curious' | 'smiling' | 'explaining' | 'thinking' | 'surprised';
  handGesture: 'none' | 'pointing-board' | 'raising-hand' | 'open-palms' | 'nodding';
  boardSnippet?: string;
  boardContent?: string;
}

export interface CurrentAffairsItem {
  id: string;
  date: string;
  topic: string;
  source: string;
  sourceUrl: string;
  category: string;
  importance: string;
  syllabusMapping: string;
  whyImportant: string;
  background: string;
  prelimsQuestion: string;
  answer: string;
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  sceneId: string;
  slideNumber: number;
  message: string;
  field: 'text-overflow' | 'equations' | 'axes' | 'duration' | 'narration' | 'watermark';
  autoFixable: boolean;
}
