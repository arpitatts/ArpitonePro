import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CameraShotType, DialogueLine, WatermarkSettings, IndianVoiceLanguageMode } from '../types';
import {
  SAMPLE_3D_CLASSROOM_SCRIPT,
  MULTILINGUAL_CLASSROOM_PRESETS,
  CLASSROOM_CHARACTERS,
} from '../data/defaultData';
import { SatyaGyanWatermark } from './visuals/SatyaGyanWatermark';
import { ttsService } from '../services/ttsService';
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  Layers,
  Sparkles,
  Users,
  Video,
  Volume2,
  Globe2,
  Tv,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Film,
} from 'lucide-react';

interface Classroom3DModuleProps {
  watermarkSettings: WatermarkSettings;
  initialScript?: string;
}

interface CharacterModelRefs {
  group: THREE.Group;
  head: THREE.Group;
  mouth: THREE.Mesh | THREE.Group;
  eyelids: THREE.Mesh[];
  eyebrows: THREE.Mesh[];
  eyeballs?: THREE.Group[];
  rightArm: THREE.Group;
  pointerStick?: THREE.Mesh;
  leftArm: THREE.Group;
}

export const Classroom3DModule: React.FC<Classroom3DModuleProps> = ({ watermarkSettings, initialScript }) => {
  const [selectedLanguageMode, setSelectedLanguageMode] = useState<IndianVoiceLanguageMode>('only-eng');
  const [rawScript, setRawScript] = useState<string>(initialScript || SAMPLE_3D_CLASSROOM_SCRIPT);
  const [selectedSubject, setSelectedSubject] = useState<'current-affairs' | 'economics' | 'polity' | 'scitech'>('current-affairs');
  const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentShot, setCurrentShot] = useState<CameraShotType>('wide-classroom');
  const [speakingCharacterId, setSpeakingCharacterId] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string>('');

  const SUBJECT_PRESET_SCRIPTS = {
    'current-affairs': `[CAM:WIDE]
Satya: "Good morning Arpita, Lucky, and Chintu! Today our virtual blackboard features the critical Editorial Digest from The Hindu and Indian Express on Article 293 and Fiscal Federalism."

[CAM:ARPITA]
Arpita: "Sir, does Article 293(3) mean state governments must get Central consent for all domestic borrowing programs?"

[CAM:SATYA]
Satya: "Excellent question, Arpita! Consent of the Government of India is required ONLY if an earlier central loan or guarantee is still outstanding in the state balance sheet."

[CAM:BOARD]
Satya: "Observe our blackboard diagram! The 16th Finance Commission and FRBM ceilings balance state autonomy with national fiscal stability."

[CAM:LUCKY]
Lucky: "Sir, what about 50-year interest-free capital investment loans from the Union to states?"

[CAM:CHINTU]
Chintu: "Sir! Indian Express also reported that core inflation has moderated, helping capital borrowing costs across state projects!"

[CAM:SATYA]
Satya: "Spot on, Lucky and Chintu! That is how cooperative federalism functions in India's fiscal architecture."`,

    'economics': `[CAM:WIDE]
Satya: "Good morning class! Today we examine market equilibrium and the famous Giffen Goods Paradox on our blackboard."

[CAM:ARPITA]
Arpita: "Sir, when consumer income rises, why does demand for certain inferior staple goods actually drop?"

[CAM:SATYA]
Satya: "Look closely at the graph on the blackboard, Arpita! When staple prices rise during a famine, poor families cannot afford meat, forcing them to buy more bread despite higher prices!"

[CAM:LUCKY]
Lucky: "Sir, that means the demand curve slopes upward for Giffen goods, violating the standard law of demand!"

[CAM:BOARD]
Satya: "Precisely, Lucky! The negative income effect completely overwhelms the substitution effect, yielding an upward-sloping curve."

[CAM:CHINTU]
Chintu: "Sir, in competitive exams like UPSC CSE, is a Giffen good always an inferior good?"

[CAM:SATYA]
Satya: "Outstanding question, Chintu! All Giffen goods are inferior goods, but not all inferior goods are Giffen goods!"`,

    'polity': `[CAM:WIDE]
Satya: "Welcome students! Today our chalkboard highlights the Golden Triangle of Fundamental Rights under the Indian Constitution."

[CAM:ARPITA]
Arpita: "Sir, why are Article 14, Article 19, and Article 21 known as the Golden Triangle?"

[CAM:SATYA]
Satya: "Look at the triangle on the board, Arpita! In Maneka Gandhi (1978), the Supreme Court ruled that Article 21 must be read alongside Articles 14 and 19—the procedure must be just, fair, and reasonable!"

[CAM:LUCKY]
Lucky: "Sir, and Dr. B. R. Ambedkar called Article 32 the very heart and soul of the Constitution because it guarantees constitutional remedies!"

[CAM:BOARD]
Satya: "Exactly, Lucky! Article 32 empowers the Supreme Court to issue 5 prerogative writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto."

[CAM:CHINTU]
Chintu: "Sir, can Parliament abolish these fundamental rights using Article 368 constitutional amendments?"

[CAM:SATYA]
Satya: "Outstanding inquiry, Chintu! In Kesavananda Bharati (1973), the 13-judge bench held that Parliament cannot alter the Basic Structure of our Constitution!"`,

    'scitech': `[CAM:WIDE]
Satya: "Welcome students! Today our 3D chalkboard breaks down Photosynthesis, Cellular Energetics, and ISRO Space Bioreactors."

[CAM:ARPITA]
Arpita: "Sir, how do the light-dependent reactions in the thylakoid membrane generate oxygen?"

[CAM:SATYA]
Satya: "Notice the green thylakoid grana on our board, Arpita! Water molecules undergo photolysis, releasing oxygen gas while generating ATP and NADPH for the Calvin cycle."

[CAM:LUCKY]
Lucky: "Sir, why is RuBisCO called the most abundant enzyme on planet Earth?"

[CAM:BOARD]
Satya: "Brilliant, Lucky! RuBisCO fixes atmospheric CO2 into 3-phosphoglycerate inside the stroma during the light-independent dark reactions."

[CAM:CHINTU]
Chintu: "Sir! Can ISRO use microalgae photobioreactors to produce oxygen for astronauts during long Gaganyaan space missions?"

[CAM:SATYA]
Satya: "Terrific connection, Chintu! Algal bioreactors utilize this exact photosynthetic pathway for continuous oxygen recycling in space."`,
  };

  const handleSelectSubject = (subj: 'current-affairs' | 'economics' | 'polity' | 'scitech') => {
    setSelectedSubject(subj);
    ttsService.stop();
    setIsPlaying(false);
    setSpeakingCharacterId(null);
    setRawScript(SUBJECT_PRESET_SCRIPTS[subj]);
    setCurrentLineIndex(0);
    const labels = {
      'current-affairs': 'Current Affairs (The Hindu & Indian Express)',
      'economics': 'Economics (Market Equilibrium & Giffen Paradox)',
      'polity': 'Indian Polity (Fundamental Rights & Constitution)',
      'scitech': 'Science & Technology (Photosynthesis & Cell Biology)',
    };
    setStatusNotification(`Switched virtual classroom blackboard & lesson to: ${labels[subj]}`);
  };

  useEffect(() => {
    if (initialScript) {
      setRawScript(initialScript);
      setCurrentLineIndex(0);
      setStatusNotification('Loaded lesson script into 3D Virtual Classroom!');
    }
  }, [initialScript]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Character Mesh References for Human-like Articulation
  const teacherRefs = useRef<CharacterModelRefs | null>(null);
  const studentRefs = useRef<{ [key: string]: CharacterModelRefs }>({});

  const blackboardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const blackboardTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Parse structured dialogue with camera shortcuts
  useEffect(() => {
    const lines = parseDialogueScript(rawScript);
    setDialogueLines(lines);
    if (currentLineIndex >= lines.length) {
      setCurrentLineIndex(0);
    }
  }, [rawScript]);

  // Three.js 3D Virtual Classroom Setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth || 800;
    const height = canvasRef.current.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1120);
    scene.fog = new THREE.FogExp2(0x0a1120, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.6, 9.8);
    camera.lookAt(0, 1.8, -1.0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lighting Rig: Warm Academic Lighting with Blackboard Accent
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.95);
    scene.add(ambientLight);

    // Ceiling Main Light
    const ceilingLight = new THREE.PointLight(0xe0f2fe, 1.3, 30);
    ceilingLight.position.set(0, 6.2, 1.5);
    ceilingLight.castShadow = true;
    scene.add(ceilingLight);

    // Spotlight directly illuminating Chinmay Chalkboard
    const boardSpotlight = new THREE.SpotLight(0xfffbeb, 2.2, 22, Math.PI / 3.2, 0.35);
    boardSpotlight.position.set(0, 5.5, -2.0);
    boardSpotlight.target.position.set(0, 3.2, -5.9);
    scene.add(boardSpotlight);
    scene.add(boardSpotlight.target);

    // Teacher Key Light
    const teacherKeyLight = new THREE.PointLight(0xbae6fd, 1.1, 12);
    teacherKeyLight.position.set(-2.5, 4.0, -2.0);
    scene.add(teacherKeyLight);

    // Student Fill Light
    const studentFillLight = new THREE.PointLight(0xfef3c7, 0.9, 14);
    studentFillLight.position.set(1.5, 4.2, 3.0);
    scene.add(studentFillLight);

    // 5. Build Complete 360° Classroom Architecture (Front, Back, Sides, Windows, Chalkboard)
    buildClassroomEnvironment(scene);

    // 6. Build Realistic Human Teacher: Satya (Indian Masterji / Professor)
    // Positioned gracefully at x: -2.2, so the center & right of the chalkboard are 100% visible!
    const teacherModel = buildStylizedHumanCharacter({
      id: 'satya',
      name: 'Satya (Teacher)',
      role: 'teacher',
      gender: 'man',
      skinColor: 0xe0a980,
      hairColor: 0x1c1917,
      shirtColor: 0x0284c7, // Crisp educator shirt
      jacketColor: 0x0f172a, // Formal Nehru waistcoat / jacket
      hasGlasses: true,      // Distinctive scholarly teacher spectacles
      hasMustache: true,     // Authentic Indian teacher styling
      hasPointerStick: true, // Wooden blackboard pointer stick
      seated: false,
    });
    teacherModel.group.position.set(-2.2, 0, -3.8);
    scene.add(teacherModel.group);
    teacherRefs.current = teacherModel;

    // 7. Build Formal Students: Arpita, Lucky, Chintu (Formal School Uniforms with Badges & Ties)
    studentRefs.current = {};

    const studentDefs = [
      {
        id: 'arpita',
        name: 'Arpita',
        gender: 'girl' as const,
        x: -2.7,
        z: 2.2,
        skinColor: 0xf6cfad,
        hairColor: 0x2b1d14,
        tieColor: 0xbe123c, // Crimson school tie
        vestColor: 0x1e3a8a, // Navy school blazer/vest
        hairStyle: 'ribbon-ponytail',
      },
      {
        id: 'lucky',
        name: 'Lucky',
        gender: 'girl' as const,
        x: 0,
        z: 2.2,
        skinColor: 0xf4cbab,
        hairColor: 0x1e1b18,
        tieColor: 0x047857, // Emerald school tie
        vestColor: 0x1e293b, // Slate uniform vest
        hairStyle: 'neat-headband',
      },
      {
        id: 'chintu',
        name: 'Chintu',
        gender: 'boy' as const,
        x: 2.7,
        z: 2.2,
        skinColor: 0xf2c89f,
        hairColor: 0x18181b,
        tieColor: 0xb45309, // Amber school tie
        vestColor: 0x1e3a8a, // Navy school blazer
        hairStyle: 'short-parted',
      },
    ];

    studentDefs.forEach((s) => {
      // Realistic Student Desk & Chair with Books & Pen Holder
      const desk = buildStudentDesk();
      desk.position.set(s.x, 0, s.z);
      scene.add(desk);

      // Student Human Character in Formal Uniform
      const studentModel = buildStylizedHumanCharacter({
        id: s.id,
        name: s.name,
        role: 'student',
        gender: s.gender,
        skinColor: s.skinColor,
        hairColor: s.hairColor,
        shirtColor: 0xf8fafc, // Crisp white formal uniform shirt
        jacketColor: s.vestColor, // Uniform blazer/sweater vest
        tieColor: s.tieColor,
        hasTie: true,
        hasSchoolBadge: true,
        hairStyle: s.hairStyle,
        seated: true,
      });

      studentModel.group.position.set(s.x, 0, s.z + 0.6);
      scene.add(studentModel.group);
      studentRefs.current[s.id] = studentModel;
    });

    // Resize Handler
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Human-like Animation Loop (Blinks, Mouth Visemes, Arm Pointing & Hand Raising)
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // --- Teacher Satya Animation ---
      if (teacherRefs.current) {
        const tRefs = teacherRefs.current;
        // Natural idle breathing
        tRefs.group.position.y = Math.sin(time * 2.0) * 0.02;

        // Eye Blink Cycle: natural blinks every ~3.5s
        const blinkPhase = (time % 3.5);
        const isBlinking = blinkPhase < 0.15;
        tRefs.eyelids.forEach((lid) => {
          lid.scale.y = isBlinking ? 1.0 : 0.05;
        });

        // Eyebrows slight animation
        tRefs.eyebrows.forEach((brow) => {
          brow.position.y = 2.12 + Math.sin(time * 1.5) * 0.01;
        });

        const isTeacherSpeaking =
          speakingCharacterId === 'satya' ||
          (isPlaying && (dialogueLines[currentLineIndex]?.characterId === 'satya' || !dialogueLines[currentLineIndex]?.characterId));

        if (isTeacherSpeaking) {
          // Human-like speech visemes: mouth shapes open, wide, vowel modulation
          const mouthOpen = 0.3 + Math.abs(Math.sin(time * 14)) * 0.9;
          const mouthWide = 0.8 + Math.abs(Math.cos(time * 8)) * 0.4;
          tRefs.mouth.scale.set(mouthWide, mouthOpen, 1);

          // Head nods and gestures while explaining
          tRefs.head.rotation.y = Math.sin(time * 1.8) * 0.08 - 0.25; // looking slightly towards blackboard & students
          tRefs.head.rotation.x = Math.sin(time * 2.5) * 0.05;

          // Pointer Stick Arm Animation: Right arm points dynamically at blackboard notes!
          // Pointer points towards blackboard coordinates (right & forward)
          tRefs.rightArm.rotation.z = -0.55 + Math.sin(time * 2.2) * 0.15;
          tRefs.rightArm.rotation.x = 0.75 + Math.cos(time * 1.8) * 0.2;
          tRefs.rightArm.rotation.y = -0.4 + Math.sin(time * 1.5) * 0.15;
        } else {
          // Attentive listening pose
          tRefs.mouth.scale.set(1, 0.2, 1);
          // Turn head towards student speaking
          if (speakingCharacterId === 'arpita') {
            tRefs.head.rotation.y = 0.2;
          } else if (speakingCharacterId === 'chintu') {
            tRefs.head.rotation.y = -0.4;
          } else {
            tRefs.head.rotation.y = -0.1;
          }
          tRefs.head.rotation.x = 0.02;

          // Rest pointer stick respectfully downwards
          tRefs.rightArm.rotation.z = -0.2;
          tRefs.rightArm.rotation.x = 0.2;
          tRefs.rightArm.rotation.y = 0;
        }
      }

      // --- Formal Students Animation ---
      studentDefs.forEach((s, idx) => {
        const sModel = studentRefs.current[s.id];
        if (!sModel) return;

        // Staggered natural breathing & eye blinking
        sModel.group.position.y = Math.sin(time * 1.8 + idx) * 0.015;

        // Individual blink cycles
        const sBlink = ((time + idx * 1.1) % 3.8) < 0.14;
        sModel.eyelids.forEach((lid) => {
          lid.scale.y = sBlink ? 1.0 : 0.05;
        });

        const isThisStudentSpeaking =
          speakingCharacterId === s.id ||
          (isPlaying && dialogueLines[currentLineIndex]?.characterId === s.id);

        if (isThisStudentSpeaking) {
          // Speaking lip-sync visemes
          const sMouthOpen = 0.3 + Math.abs(Math.sin(time * 16)) * 0.85;
          sModel.mouth.scale.set(1, sMouthOpen, 1);

          // Raise right hand politely in classic classroom student doubt gesture!
          sModel.rightArm.rotation.x = -Math.PI / 2.2 + Math.sin(time * 2) * 0.08;
          sModel.rightArm.rotation.z = 0.35 + Math.sin(time * 2.5) * 0.05;
          sModel.rightArm.rotation.y = -0.15;

          // Head looks eagerly towards Teacher Satya
          sModel.head.rotation.y = (s.x > 0 ? -0.35 : 0.2) + Math.sin(time * 2.2) * 0.04;
          sModel.head.rotation.x = -0.1 + Math.sin(time * 3) * 0.03;
        } else {
          // Attentive listening: hands on desk, looking at Teacher and Blackboard
          sModel.mouth.scale.set(1, 0.2, 1);
          sModel.rightArm.rotation.x = Math.PI / 3.4;
          sModel.rightArm.rotation.z = 0.1;
          sModel.rightArm.rotation.y = 0;

          // Face the teacher and board
          sModel.head.rotation.y = (s.x > 0 ? -0.3 : 0.15) + Math.sin(time * 0.8 + idx) * 0.02;
          sModel.head.rotation.x = -0.05;
        }
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      renderer.dispose();
    };
  }, []);

  // Update Blackboard Texture dynamically whenever line or script changes
  useEffect(() => {
    updateBlackboardTexture();
  }, [currentLineIndex, dialogueLines, selectedLanguageMode]);

  // Adjust Camera when currentShot changes
  useEffect(() => {
    applyCameraShot(currentShot);
  }, [currentShot]);

  // ==========================================
  // HIGH-RESOLUTION ACADEMIC EXAMINATION BULLETIN BOARD
  // (UPSC Timetable, Daily Newspapers The Hindu / Indian Express, Mock Rankings, Pushpins)
  // ==========================================
  const buildAcademicNoticeBoard = (scene: THREE.Scene) => {
    const nCanvas = document.createElement('canvas');
    nCanvas.width = 1024;
    nCanvas.height = 512;
    const nCtx = nCanvas.getContext('2d');
    if (nCtx) {
      // 1. Dark Felt Slate Texture
      nCtx.fillStyle = '#1e293b';
      nCtx.fillRect(0, 0, 1024, 512);

      // Subtle texture speckles
      nCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let i = 0; i < 200; i++) {
        nCtx.fillRect(Math.random() * 1024, Math.random() * 512, 3, 3);
      }

      // Outer gold/slate header banner
      nCtx.fillStyle = '#0f172a';
      nCtx.fillRect(16, 16, 992, 64);
      nCtx.fillStyle = '#fbbf24';
      nCtx.font = 'bold 26px serif';
      nCtx.fillText('SATYA GYAN • UPSC & PSC ACADEMIC BULLETIN BOARD', 40, 56);

      nCtx.fillStyle = '#94a3b8';
      nCtx.font = '14px sans-serif';
      nCtx.fillText('OFFICIAL CIRCULARS • DAILY EDITORIALS • MOCK TESTS', 540, 56);

      // Card 1 (Left): UPSC CSE Timetable
      nCtx.fillStyle = '#f8fafc';
      nCtx.fillRect(40, 100, 290, 360);
      nCtx.fillStyle = '#1e3a8a';
      nCtx.fillRect(40, 100, 290, 38);
      nCtx.fillStyle = '#ffffff';
      nCtx.font = 'bold 15px sans-serif';
      nCtx.fillText('UPSC CIVIL SERVICES EXAM', 55, 125);
      nCtx.fillStyle = '#0f172a';
      nCtx.font = '13px sans-serif';
      nCtx.fillText('• Prelims: GS-I & CSAT', 55, 165);
      nCtx.fillText('• Mains: GS 1-4 & Optional', 55, 195);
      nCtx.fillText('• Focus: Conceptual Clarity', 55, 225);
      nCtx.fillText('• Revision Schedule Active', 55, 255);
      nCtx.fillStyle = '#dc2626';
      nCtx.font = 'bold 12px monospace';
      nCtx.fillText('TIMETABLE CONFIRMED', 55, 305);

      // Card 2 (Center): Daily Newspaper Editorials (The Hindu / Indian Express)
      nCtx.fillStyle = '#f8fafc';
      nCtx.fillRect(360, 100, 310, 360);
      nCtx.fillStyle = '#047857';
      nCtx.fillRect(360, 100, 310, 38);
      nCtx.fillStyle = '#ffffff';
      nCtx.font = 'bold 15px sans-serif';
      nCtx.fillText('NEWSPAPER EDITORIAL DIGEST', 375, 125);
      nCtx.fillStyle = '#0f172a';
      nCtx.font = '13px sans-serif';
      nCtx.fillText('• The Hindu: Lead Article', 375, 165);
      nCtx.fillText('  Fiscal Federalism & Art. 293', 390, 185);
      nCtx.fillText('• Indian Express: Explained', 375, 215);
      nCtx.fillText('  Core CPI vs Food Inflation', 390, 235);
      nCtx.fillText('• PIB: Green Hydrogen Mission', 375, 265);
      nCtx.fillStyle = '#2563eb';
      nCtx.font = 'bold 12px sans-serif';
      nCtx.fillText('Daily Notes Synced to Blackboard', 375, 310);

      // Card 3 (Right): Mock Test Rankings & Sticky Notes
      nCtx.fillStyle = '#f8fafc';
      nCtx.fillRect(700, 100, 280, 220);
      nCtx.fillStyle = '#7c3aed';
      nCtx.fillRect(700, 100, 280, 38);
      nCtx.fillStyle = '#ffffff';
      nCtx.font = 'bold 15px sans-serif';
      nCtx.fillText('MOCK TEST RANKINGS', 720, 125);
      nCtx.fillStyle = '#0f172a';
      nCtx.font = '13px sans-serif';
      nCtx.fillText('🥇 Rank 1: Arpita (148/200)', 720, 165);
      nCtx.fillText('🥈 Rank 2: Lucky (142/200)', 720, 195);
      nCtx.fillText('🥉 Rank 3: Chintu (136/200)', 720, 225);

      // Yellow Sticky Memo
      nCtx.fillStyle = '#fef08a';
      nCtx.fillRect(710, 340, 130, 115);
      nCtx.fillStyle = '#713f12';
      nCtx.font = 'bold 12px sans-serif';
      nCtx.fillText('KEY TIP:', 720, 365);
      nCtx.font = '11px sans-serif';
      nCtx.fillText('Revise Article', 720, 385);
      nCtx.fillText('293(3) & GSDP', 720, 405);
      nCtx.fillText('borrowing cap!', 720, 425);

      // Pink Sticky Memo
      nCtx.fillStyle = '#fbcfe8';
      nCtx.fillRect(860, 340, 120, 115);
      nCtx.fillStyle = '#831843';
      nCtx.font = 'bold 12px sans-serif';
      nCtx.fillText('SUNDAY:', 870, 365);
      nCtx.font = '11px sans-serif';
      nCtx.fillText('Classroom 3D', 870, 385);
      nCtx.fillText('Live Doubts @', 870, 405);
      nCtx.fillText('10:00 AM IST', 870, 425);

      // Pushpins drawing on canvas
      const drawPin = (px: number, py: number, color: string) => {
        nCtx.fillStyle = color;
        nCtx.beginPath();
        nCtx.arc(px, py, 7, 0, Math.PI * 2);
        nCtx.fill();
        nCtx.fillStyle = '#ffffff';
        nCtx.beginPath();
        nCtx.arc(px - 2, py - 2, 2.5, 0, Math.PI * 2);
        nCtx.fill();
      };
      drawPin(185, 106, '#ef4444');
      drawPin(515, 106, '#3b82f6');
      drawPin(840, 106, '#eab308');
      drawPin(775, 345, '#ec4899');
      drawPin(920, 345, '#8b5cf6');
    }

    const nTexture = new THREE.CanvasTexture(nCanvas);
    const noticeMat = new THREE.MeshBasicMaterial({ map: nTexture });
    const noticeFrameMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Brushed aluminum frame
      metalness: 0.8,
      roughness: 0.2,
    });

    const noticeGroup = new THREE.Group();
    noticeGroup.position.set(-3.5, 3.5, 8.5);

    // Frame
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(7.2, 3.4, 0.1), noticeFrameMat);
    const slateMesh = new THREE.Mesh(new THREE.BoxGeometry(7.0, 3.2, 0.11), noticeMat);
    noticeGroup.add(frameMesh, slateMesh);
    scene.add(noticeGroup);
  };

  // ==========================================
  // MULTI-TIER ACADEMIC LIBRARY BOOKCASE
  // (Teak Frame, 4 Rows, 45+ Realistic Hardcover Books, Gold Foil Spine Ribbons, Brass Globe)
  // ==========================================
  const buildAcademicBookshelf = (scene: THREE.Scene) => {
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(4.5, 2.3, 8.1);

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x271810, // Dark polished teak wood
      roughness: 0.45,
    });

    // 1. Outer Frame
    const back = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.6, 0.08), woodMat);
    const leftSide = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.6, 0.8), woodMat);
    leftSide.position.x = -2.75;
    const rightSide = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.6, 0.8), woodMat);
    rightSide.position.x = 2.75;
    const topBoard = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.12, 0.8), woodMat);
    topBoard.position.y = 2.25;
    const botBoard = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.12, 0.8), woodMat);
    botBoard.position.y = -2.25;
    shelfGroup.add(back, leftSide, rightSide, topBoard, botBoard);

    // 2. Intermediate Horizontal Shelves
    const shelfYPositions = [-1.15, 0.0, 1.15];
    shelfYPositions.forEach((sy) => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.08, 0.78), woodMat);
      shelf.position.y = sy;
      shelfGroup.add(shelf);
    });

    // 3. Hardcover Books with Varied Dimensions and Scholarly Gold Foils
    const bookColors = [
      0x881337, // Burgundy
      0x1e3a8a, // Navy Blue
      0x065f46, // Forest Emerald
      0xb45309, // Amber Gold
      0x581c87, // Royal Purple
      0x334155, // Slate Grey
      0x0f766e, // Deep Cyan
      0x7f1d1d, // Red Oxide
    ];

    const rowHeights = [-2.25 + 0.06, -1.15 + 0.04, 0.0 + 0.04, 1.15 + 0.04];
    rowHeights.forEach((rowY, rIdx) => {
      let currentX = -2.45;
      const numBooks = 11 + (rIdx % 3);

      for (let b = 0; b < numBooks && currentX < 2.3; b++) {
        const bWidth = 0.06 + ((b * 7) % 5) * 0.012;
        const bHeight = 0.52 + ((b * 11) % 6) * 0.035;
        const bDepth = 0.54 + ((b * 3) % 4) * 0.02;
        const color = bookColors[(b + rIdx * 3) % bookColors.length];

        const bookMat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.5,
        });

        const bookGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        const book = new THREE.Mesh(bookGeo, bookMat);
        book.position.set(currentX + bWidth / 2, rowY + bHeight / 2, 0.05);

        // Gold Foil Spine Band
        const goldBand = new THREE.Mesh(
          new THREE.BoxGeometry(bWidth * 1.02, 0.03, bDepth * 1.02),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 })
        );
        goldBand.position.y = (b % 2 === 0 ? 0.08 : -0.08);
        book.add(goldBand);

        // Slight natural leaning on the last book of the row
        if (b === numBooks - 1) {
          book.rotation.z = -0.18;
          book.position.x += 0.04;
        }

        shelfGroup.add(book);
        currentX += bWidth + 0.015;
      }
    });

    // Decorative Brass Celestial Globe on Top Shelf
    const globeBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 })
    );
    globeBase.position.set(1.8, 1.25, 0.1);
    const globeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
    );
    globeSphere.position.set(1.8, 1.62, 0.1);
    shelfGroup.add(globeBase, globeSphere);

    scene.add(shelfGroup);
  };

  // ==========================================
  // COMPLETE 360° CLASSROOM ARCHITECTURE (NO BLACK VOIDS!)
  // ==========================================
  const buildClassroomEnvironment = (scene: THREE.Scene) => {
    // 1. Polished Wood Parquet Flooring
    const floorGeo = new THREE.PlaneGeometry(28, 28);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x222838,
      roughness: 0.38,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Dark Baseboards along walls
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const bBoardFront = new THREE.Mesh(new THREE.BoxGeometry(28, 0.3, 0.1), baseboardMat);
    bBoardFront.position.set(0, 0.15, -6.0);
    scene.add(bBoardFront);

    const bBoardBack = new THREE.Mesh(new THREE.BoxGeometry(28, 0.3, 0.1), baseboardMat);
    bBoardBack.position.set(0, 0.15, 8.5);
    scene.add(bBoardBack);

    // 2. Front Blackboard Wall (z = -6.05)
    const frontWallGeo = new THREE.PlaneGeometry(28, 12);
    const frontWallMat = new THREE.MeshStandardMaterial({ color: 0x0c1322, roughness: 0.85 });
    const frontWall = new THREE.Mesh(frontWallGeo, frontWallMat);
    frontWall.position.set(0, 5.5, -6.05);
    scene.add(frontWall);

    // Front Wall Architectural Wood Wainscoting
    const wainscotGeo = new THREE.BoxGeometry(28, 2.2, 0.12);
    const wainscotMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const wainscot = new THREE.Mesh(wainscotGeo, wainscotMat);
    wainscot.position.set(0, 1.1, -6.0);
    scene.add(wainscot);

    // 3. Real Chinmay Chalkboard (Cinema-Grade Blackboard)
    // Board Frame (Rich dark walnut finish with brass corners)
    const boardFrameGeo = new THREE.BoxGeometry(10.6, 5.0, 0.22);
    const boardFrameMat = new THREE.MeshStandardMaterial({
      color: 0x241710, // Dark walnut wood
      roughness: 0.45,
    });

    // Slate Front Canvas Texture
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 1792;
    bCanvas.height = 896;
    blackboardCanvasRef.current = bCanvas;
    const bTexture = new THREE.CanvasTexture(bCanvas);
    blackboardTextureRef.current = bTexture;

    const boardScreenMat = new THREE.MeshBasicMaterial({ map: bTexture });

    const materials = [
      boardFrameMat, // right
      boardFrameMat, // left
      boardFrameMat, // top
      boardFrameMat, // bottom
      boardScreenMat, // front slate
      boardFrameMat, // back
    ];

    const chinmayBoard = new THREE.Mesh(boardFrameGeo, materials);
    chinmayBoard.position.set(0, 3.45, -5.9);
    chinmayBoard.castShadow = true;
    scene.add(chinmayBoard);

    // Authentic Chalk Tray with felt eraser & chalk sticks
    const trayGeo = new THREE.BoxGeometry(10.6, 0.12, 0.4);
    const trayMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.5 });
    const chalkTray = new THREE.Mesh(trayGeo, trayMat);
    chalkTray.position.set(0, 0.9, -5.72);
    scene.add(chalkTray);

    // Felt Eraser
    const eraserGeo = new THREE.BoxGeometry(0.55, 0.12, 0.24);
    const eraserMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const eraser = new THREE.Mesh(eraserGeo, eraserMat);
    eraser.position.set(2.2, 1.0, -5.7);
    scene.add(eraser);

    // White & Yellow Chalk Sticks
    const chalkGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.28);
    const whiteChalkMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const yellowChalkMat = new THREE.MeshStandardMaterial({ color: 0xfef08a });

    const chalk1 = new THREE.Mesh(chalkGeo, whiteChalkMat);
    chalk1.rotation.z = Math.PI / 2;
    chalk1.position.set(2.8, 0.98, -5.7);
    scene.add(chalk1);

    const chalk2 = new THREE.Mesh(chalkGeo, yellowChalkMat);
    chalk2.rotation.z = Math.PI / 2;
    chalk2.position.set(3.1, 0.98, -5.7);
    scene.add(chalk2);

    // 4. Back Wall (z = +8.6) with Academic Notice Board & Library Bookshelf (Visible in Student Closeups!)
    const backWallGeo = new THREE.PlaneGeometry(28, 12);
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 5.5, 8.6);
    backWall.rotation.y = Math.PI;
    scene.add(backWall);

    // High-Resolution Academic Examination Bulletin Board & Multi-Tier Bookshelf
    buildAcademicNoticeBoard(scene);
    buildAcademicBookshelf(scene);

    // 5. Left Wall with Tall Classroom Windows & Soft Daylight
    const leftWallGeo = new THREE.PlaneGeometry(28, 12);
    const leftWallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
    leftWall.position.set(-13.0, 5.5, 1.0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Classroom Windows (Glowing soft sky daylight)
    const winGeo = new THREE.PlaneGeometry(4.0, 5.0);
    const winMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
    const win1 = new THREE.Mesh(winGeo, winMat);
    win1.position.set(-12.9, 4.2, 0);
    win1.rotation.y = Math.PI / 2;
    scene.add(win1);

    const win2 = new THREE.Mesh(winGeo, winMat);
    win2.position.set(-12.9, 4.2, -4.5);
    win2.rotation.y = Math.PI / 2;
    scene.add(win2);

    // 6. Right Wall with Educational Wall Posters
    const rightWallGeo = new THREE.PlaneGeometry(28, 12);
    const rightWallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const rightWall = new THREE.Mesh(rightWallGeo, rightWallMat);
    rightWall.position.set(13.0, 5.5, 1.0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // 7. Teacher's Lecture Podium (positioned at x: -0.6, z: -2.8 so board is not blocked)
    const podiumGeo = new THREE.BoxGeometry(1.8, 1.25, 1.0);
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45 });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.set(-0.6, 0.625, -2.8);
    podium.castShadow = true;
    scene.add(podium);

    const pTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.08, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    pTop.position.set(-0.6, 1.28, -2.8);
    scene.add(pTop);

    // Authentic Props on Teacher's Podium:
    // Folded Newspapers (The Hindu & The Indian Express)
    const paperGeo = new THREE.BoxGeometry(0.55, 0.03, 0.42);
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.position.set(-0.85, 1.34, -2.75);
    paper.rotation.y = 0.15;
    scene.add(paper);

    // Printed Headline Band on Newspaper
    const masthead = new THREE.Mesh(
      new THREE.BoxGeometry(0.53, 0.005, 0.07),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    masthead.position.set(-0.85, 1.36, -2.88);
    masthead.rotation.y = 0.15;
    scene.add(masthead);

    // Classic Banker's Reading Lamp with Emerald Glass Shade & Brass Stand
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.11, 0.03, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 })
    );
    lampBase.position.set(-0.25, 1.33, -2.7);
    scene.add(lampBase);

    const lampArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.36),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 })
    );
    lampArm.position.set(-0.25, 1.51, -2.7);
    scene.add(lampArm);

    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.12, 0.24, 16, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.2, metalness: 0.1 })
    );
    lampShade.position.set(-0.25, 1.68, -2.7);
    lampShade.rotation.z = Math.PI / 2;
    scene.add(lampShade);

    // Ceramic Lecturer Mug with "SATYA GYAN"
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.095, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    mug.position.set(-1.25, 1.37, -2.7);
    scene.add(mug);
  };

  // ==========================================
  // DYNAMIC SCRIPT-DRIVEN BLACKBOARD DRAWING ENGINE
  // ==========================================
  const updateBlackboardTexture = () => {
    const canvas = blackboardCanvasRef.current;
    const texture = blackboardTextureRef.current;
    if (!canvas || !texture) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const activeLine = dialogueLines[currentLineIndex];
    const activeText = (activeLine?.text || '').toLowerCase();
    const activeSpeaker = (activeLine?.speaker || activeLine?.speakerName || 'Satya').toUpperCase();

    // Determine Academic Topic based on current dialogue line & script
    const isCurrentAffairs =
      selectedSubject === 'current-affairs' ||
      activeText.includes('hindu') ||
      activeText.includes('express') ||
      activeText.includes('article 293') ||
      activeText.includes('editorial') ||
      activeText.includes('borrowing') ||
      activeText.includes('newspaper') ||
      activeText.includes('gazette') ||
      activeText.includes('fiscal') ||
      activeText.includes('federalism');

    const isGiffen = activeText.includes('giffen') || activeText.includes('paradox') || activeText.includes('bread') || activeText.includes('famine');
    const isIncome = activeText.includes('income') || activeText.includes('normal good') || activeText.includes('inferior good') || activeText.includes('purchasing power');
    const isElasticity = activeText.includes('elastic') || activeText.includes('petrol') || activeText.includes('diesel') || activeText.includes('duty') || activeText.includes('tax') || activeText.includes('transit');

    // 1. Authentic deep slate green chalkboard background with grain & dust texture
    ctx.fillStyle = '#0b2017'; // Classic dark slate blackboard
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Realistic chalk dust wash
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let i = 0; i < 450; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 8 + 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Double Chalk Border Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    // Header Title: SATYA GYAN ACADEMY • 3D ACADEMIC CHALKBOARD
    ctx.fillStyle = '#fef08a'; // Chalk Yellow
    ctx.font = 'bold 32px serif';
    ctx.fillText('SATYA GYAN • 3D ACADEMIC CHALKBOARD', 60, 85);

    // Safe Zone for Top-Right Watermark (never overlap!)
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`MODE: ${selectedLanguageMode.toUpperCase()}`, canvas.width - 560, 85);

    // Chalk Divider Bar
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(60, 105);
    ctx.lineTo(canvas.width - 60, 105);
    ctx.stroke();

    // ==========================================
    // TOPIC RENDERING: DYNAMIC DIAGRAMS & FORMULAS
    // ==========================================
    if (isCurrentAffairs) {
      // --- THE HINDU & THE INDIAN EXPRESS: DAILY EDITORIAL DIGEST ---
      ctx.fillStyle = '#fde047'; // Bright chalk yellow
      ctx.font = 'bold 28px serif';
      ctx.fillText('EDITORIAL DIGEST: THE HINDU & THE INDIAN EXPRESS', 60, 155);

      // Left Side: Article 293 & Fiscal Federalism Debt Architecture
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;

      // Union Box (Top)
      ctx.strokeRect(90, 200, 440, 65);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(90, 200, 440, 65);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('UNION GOVT (Ministry of Finance)', 105, 230);
      ctx.font = '15px monospace';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('Article 292: Borrowing upon Consolidated Fund', 105, 254);

      // Downward Arrow with Consent Rule
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(310, 265);
      ctx.lineTo(310, 335);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(300, 325);
      ctx.lineTo(310, 340);
      ctx.lineTo(320, 325);
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('Article 293(3): MANDATORY CONSENT', 135, 305);

      // State Box (Bottom)
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(90, 340, 440, 85);
      ctx.fillStyle = 'rgba(52, 211, 153, 0.15)';
      ctx.fillRect(90, 340, 440, 85);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('STATE GOVERNMENTS (Sub-National Debt)', 105, 370);
      ctx.font = '15px monospace';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('Article 293(1): Borrow within territory of India', 105, 395);
      ctx.fillText('NBC Cap = 3.0% of GSDP + 0.5% Power Reforms', 105, 415);

      // Bottom Callout
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText('⚠ Off-Budget Borrowings: Counted inside Net Borrowing Ceiling!', 90, 465);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('Sources: The Hindu (Lead Editorial) & Indian Express (Explained)', 90, 500);

      // Right Side: Academic Takeaways & Exam Directives
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('UPSC CSE & STATE PSC HIGH-YIELD INSIGHTS', 580, 205);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText('• The Hindu Focus: Scope of Article 293(3) and State Financial Autonomy.', 580, 250);
      ctx.fillText('• Indian Express Explained: Core Inflation Moderation vs Food Basket (45.86%).', 580, 290);
      ctx.fillText('• Crucial Prelims Trap: Article 293(3) consent is required ONLY if an earlier', 580, 330);
      ctx.fillText('  Union loan or Central Guarantee is still outstanding in the state balance sheet!', 580, 365);
      ctx.fillText('• 16th Finance Commission Mandate: Recommend sustainable debt trajectories', 580, 405);
      ctx.fillText('  for both Union & States adhering to FRBM Act targets (60% Debt/GDP).', 580, 440);
      ctx.fillText('• Mains Stance: Balance fiscal prudence with cooperative federalism.', 580, 480);

    } else if (isGiffen) {
      // --- THE GIFFEN GOODS PARADOX (Upward Sloping Demand Anomaly) ---
      // Left Side: Upward-Sloping Demand Curve Diagram
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 28px serif';
      ctx.fillText('GIFFEN GOODS PARADOX: UPWARD-SLOPING DEMAND', 60, 155);

      // Coordinate Graph Axes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(90, 210); // Y axis top
      ctx.lineTo(90, 520); // Origin
      ctx.lineTo(540, 520); // X axis right
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Price of Staple (P)', 95, 215);
      ctx.fillText('Quantity Demanded (Q)', 340, 555);

      // Normal Law of Demand (Faded Dotted line)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(130, 260);
      ctx.lineTo(480, 500);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('Normal Demand (D_standard)', 350, 480);
      ctx.setLineDash([]);

      // GIFFEN GOODS CURVE: Upward Sloping Demand (Cyan Chalk)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(130, 490);
      ctx.lineTo(490, 250);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('D_giffen (Upward Sloping!)', 420, 240);

      // Coordinate Points P1 -> P2 and Q1 -> Q2
      ctx.strokeStyle = '#fde047';
      ctx.setLineDash([4, 4]);
      // P1, Q1
      ctx.beginPath();
      ctx.moveTo(90, 420);
      ctx.lineTo(240, 420);
      ctx.lineTo(240, 520);
      ctx.stroke();
      // P2, Q2
      ctx.beginPath();
      ctx.moveTo(90, 310);
      ctx.lineTo(400, 310);
      ctx.lineTo(400, 520);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('P1', 65, 425);
      ctx.fillText('P2 ↑', 55, 315);
      ctx.fillText('Q1', 230, 545);
      ctx.fillText('Q2 ↑ (Higher P ⇒ Higher Q!)', 360, 545);

      // Right Side: Economic Law & Scientific Proof
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('ΔQ_d / ΔP > 0  |  Violation of Law of Demand', 600, 205);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText('• Definition: Non-luxury staple with strong negative income effect.', 600, 255);
      ctx.fillText('• Condition: |Income Effect (Negative)| > |Substitution Effect|.', 600, 295);
      ctx.fillText('• Sir Robert Giffen (1837–1910): Poor staple bread paradox.', 600, 335);
      ctx.fillText('• Mechanism: Price spike cuts real purchasing power drastically;', 600, 375);
      ctx.fillText('  families sacrifice meat & buy MORE bread to survive!', 600, 410);
      ctx.fillText('• Contrast: Veblen Goods (luxury status vs survival staple).', 600, 450);

    } else if (isIncome) {
      // --- INCOME EFFECT: NORMAL vs INFERIOR GOODS ---
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 28px serif';
      ctx.fillText('INCOME SHIFTS: NORMAL GOODS vs INFERIOR GOODS', 60, 155);

      // Coordinate Graph: Shift of Demand Curve
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(90, 210);
      ctx.lineTo(90, 520);
      ctx.lineTo(540, 520);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Price (P)', 95, 215);
      ctx.fillText('Quantity Demanded (Q)', 340, 555);

      // Initial Demand D0
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(120, 270);
      ctx.lineTo(440, 490);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('D0 (Baseline)', 445, 490);

      // Normal Good Shift: D1 (Rightward Shift in Pink)
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(210, 250);
      ctx.lineTo(530, 470);
      ctx.stroke();
      ctx.fillStyle = '#f472b6';
      ctx.fillText('D1: Normal (Income ↑ ⇒ Shift Right →)', 220, 235);

      // Inferior Good Shift: D2 (Leftward Shift in Orange)
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(80, 310);
      ctx.lineTo(370, 510);
      ctx.stroke();
      ctx.fillStyle = '#fb923c';
      ctx.fillText('D2: Inferior (Income ↑ ⇒ Shift Left ←)', 120, 335);

      // Right Side Content
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('Normal Goods: ∂Q/∂Y > 0  |  Inferior Goods: ∂Q/∂Y < 0', 600, 205);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText('• Normal Goods: Higher income boosts consumption (fruits, electronics).', 600, 255);
      ctx.fillText('• Inferior Goods: Higher income REDUCES demand as consumers switch', 600, 295);
      ctx.fillText('  to higher-quality substitutes (e.g. coarse grains to basmati rice).', 600, 335);
      ctx.fillText('• Engel Curve: Upward-sloping for normal, bending back for inferior.', 600, 375);
      ctx.fillText('• Arpita\'s Query: Income increases DO NOT always shift demand right!', 600, 420);

    } else if (isElasticity) {
      // --- PRICE ELASTICITY & TAX INCIDENCE ---
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 28px serif';
      ctx.fillText('PRICE ELASTICITY OF DEMAND & TAX BURDEN', 60, 155);

      // Graph: Steep vs Flat curves
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(90, 210);
      ctx.lineTo(90, 520);
      ctx.lineTo(540, 520);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Price (P)', 95, 215);
      ctx.fillText('Quantity Demanded (Q)', 340, 555);

      // Inelastic curve (very steep - Cyan)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(250, 230);
      ctx.lineTo(310, 510);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('D_inelastic (|Ed| < 1) Fuel / Meds', 240, 220);

      // Elastic curve (flatter - Yellow)
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(110, 320);
      ctx.lineTo(500, 480);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.fillText('D_elastic (|Ed| > 1) Public Transit', 380, 465);

      // Right Side Formulas
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('E_d = (% ΔQ_d) / (% ΔP)  |  Tax Incidence Principle', 600, 205);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText('• Fuel/Petrol: Essential without immediate substitute ⇒ Inelastic demand.', 600, 255);
      ctx.fillText('• Tax Incidence: When demand is inelastic, excise tax burden falls', 600, 295);
      ctx.fillText('  predominantly on the consumer, not the supplier!', 600, 335);
      ctx.fillText('• Chintu\'s Insight: Viable public transit (Metro/EVs) introduces viable', 600, 375);
      ctx.fillText('  substitutes, shifting petrol demand curve toward greater elasticity.', 600, 415);

    } else if (selectedSubject === 'polity' || activeText.includes('polity') || activeText.includes('constitution') || activeText.includes('article 21') || activeText.includes('fundamental rights')) {
      // --- INDIAN POLITY & CONSTITUTION (UPSC / OPSC CORE) ---
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 28px serif';
      ctx.fillText('INDIAN POLITY: FUNDAMENTAL RIGHTS & BASIC STRUCTURE DOCTRINE', 60, 155);

      // Left Diagram: Constitutional Pyramid / Pillars
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(80, 210, 460, 340);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 210, 460, 340);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('TRINITY OF FUNDAMENTAL RIGHTS (Golden Triangle)', 95, 245);

      // Golden Triangle Diagram
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(310, 280); // Top: Art 14
      ctx.lineTo(160, 470); // Bottom-left: Art 19
      ctx.lineTo(460, 470); // Bottom-right: Art 21
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('Art. 14 (Equality)', 240, 275);
      ctx.fillText('Art. 19 (6 Freedoms)', 110, 495);
      ctx.fillText('Art. 21 (Life & Liberty)', 360, 495);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Maneka Gandhi Case (1978): Procedure Established by Law', 105, 530);

      // Right Side: High Yield Landmark Cases & Articles
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('CONSTITUTIONAL LANDMARKS & ARTICLES', 580, 205);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText('• Article 32: Right to Constitutional Remedies (Heart & Soul - Dr. Ambedkar).', 580, 250);
      ctx.fillText('• 5 Prerogative Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto.', 580, 290);
      ctx.fillText('• Kesavananda Bharati (1973): 13-judge bench affirmed Parliament CANNOT alter', 580, 330);
      ctx.fillText('  the Basic Structure (Secularism, Rule of Law, Federalism, Judicial Review).', 580, 365);
      ctx.fillText('• Minerva Mills (1980): Harmony between Part III (FRs) and Part IV (DPSPs).', 580, 405);
      ctx.fillText('• Arpita\'s Question: Fundamental Duties (Part IVA, Art 51A) are NON-justiciable', 580, 445);
      ctx.fillText('  in court, yet serve as constant moral guides for citizenry.', 580, 480);

    } else if (selectedSubject === 'scitech' || activeText.includes('photosynthesis') || activeText.includes('chlorophyll') || activeText.includes('isro') || activeText.includes('satellite')) {
      // --- SCIENCE & TECHNOLOGY ---
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 28px serif';
      ctx.fillText('SCIENCE & TECHNOLOGY: CELLULAR ENERGETICS & BIOCHEMICAL PATHWAYS', 60, 155);

      // Left Diagram: Chloroplast Organelle & Light Cycle
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(80, 210, 460, 340);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 210, 460, 340);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('CHLOROPLAST ULTRASTRUCTURE & LIGHT REACTIONS', 95, 245);

      // Thylakoid Membrane & Granum
      ctx.fillStyle = '#065f46';
      ctx.fillRect(120, 290, 160, 40);
      ctx.fillRect(120, 340, 160, 40);
      ctx.fillRect(120, 390, 160, 40);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(120, 290, 160, 40);
      ctx.strokeRect(120, 340, 160, 40);
      ctx.strokeRect(120, 390, 160, 40);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('Thylakoid Grana (Light Reaction: H₂O → O₂ + ATP)', 105, 455);
      ctx.fillText('Stroma (Calvin Cycle / Dark Reaction: CO₂ → Glucose)', 105, 485);

      // Chemical Equation
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('6 CO₂ + 6 H₂O + Light ➔ C₆H₁₂O₆ + 6 O₂', 105, 525);

      // Right Side: Biochemical Principles & Exam Directives
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('BIOCHEMICAL ENERGETICS & ATMOSPHERIC CYCLES', 580, 205);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText('• Photosystem II (P680) & Photosystem I (P700) drive non-cyclic photophosphorylation.', 580, 250);
      ctx.fillText('• Photolysis of Water: 2H₂O ➔ 4H⁺ + 4e⁻ + O₂ released into atmosphere.', 580, 290);
      ctx.fillText('• RuBisCO Enzyme: The most abundant protein on Earth, catalyzes CO₂ fixation.', 580, 330);
      ctx.fillText('• C3 vs C4 Plants: C4 plants (Maize, Sugarcane) minimize photorespiration via', 580, 370);
      ctx.fillText('  Kranz anatomy, maintaining high photosynthetic efficiency under heat.', 580, 405);
      ctx.fillText('• Lucky\'s Inquiry: Net ATP yield per glucose molecule in aerobic respiration is 36-38.', 580, 445);
      ctx.fillText('• Space Tech / ISRO: Algal photobioreactors studied for life support in Gaganyaan.', 580, 480);

    } else {
      // --- GENERAL MARKET EQUILIBRIUM & LAW OF DEMAND ---
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 28px serif';
      ctx.fillText('MARKET FORCES & THE LAW OF DOWNWARD-SLOPING DEMAND', 60, 155);

      // Supply and Demand Scissors Graph
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(90, 210);
      ctx.lineTo(90, 520);
      ctx.lineTo(540, 520);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Price (P)', 95, 215);
      ctx.fillText('Quantity Demanded (Q)', 340, 555);

      // Downward Demand (D1 - Cyan)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(120, 250);
      ctx.lineTo(480, 490);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Demand (D1)', 485, 485);

      // Upward Supply (S1 - Pink)
      ctx.strokeStyle = '#f472b6';
      ctx.beginPath();
      ctx.moveTo(130, 480);
      ctx.lineTo(470, 250);
      ctx.stroke();
      ctx.fillStyle = '#f472b6';
      ctx.fillText('Supply (S1)', 475, 255);

      // Equilibrium Point E0
      ctx.strokeStyle = '#fde047';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(90, 370);
      ctx.lineTo(300, 370);
      ctx.lineTo(300, 520);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(300, 370, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('E0 (Equilibrium)', 315, 365);
      ctx.fillText('P0', 60, 375);
      ctx.fillText('Q0', 290, 545);

      // Right Side Content
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('ΔQ_d / ΔP < 0  |  Ceteris Paribus (All Else Constant)', 600, 205);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText('• Substitution Effect: Higher P induces consumers toward alternatives.', 600, 255);
      ctx.fillText('• Income Effect: Purchasing power contracts as commodity price rises.', 600, 295);
      ctx.fillText('• Law of Diminishing Marginal Utility: Subsequent units yield less value.', 600, 335);
      ctx.fillText('• Market Clearing: Equilibrium exists where Supply equals Demand (Q_s = Q_d).', 600, 375);
    }

    // ==========================================
    // BOTTOM BANNER: ACTIVE CONVERSATION & SCRIPT
    // ==========================================
    if (activeLine) {
      // Glow bounding box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(60, 600, canvas.width - 120, 160);
      ctx.strokeStyle = activeSpeaker.includes('SATYA') ? '#38bdf8' : '#34d399';
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 600, canvas.width - 120, 160);

      // Speaker Tag
      ctx.fillStyle = activeSpeaker.includes('SATYA') ? '#38bdf8' : '#34d399';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`CURRENT SPEAKER: ${activeSpeaker}`, 85, 645);

      // Speech Calligraphy
      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 26px serif';
      const cleanQuote = activeLine.text.length > 115 ? activeLine.text.slice(0, 115) + '...' : activeLine.text;
      ctx.fillText(`"${cleanQuote}"`, 85, 700);
    }

    // Bottom Right Hallmark
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px serif';
    ctx.fillText('Satya Gyan • सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ', canvas.width - 360, canvas.height - 42);

    texture.needsUpdate = true;
  };

  // ==========================================
  // ARTICULATED 5-FINGER HUMAN HAND BUILDER
  // (Palm, Thenar muscle, Proximal & Distal Phalanges, Opposable Thumb)
  // ==========================================
  const buildArticulatedHumanHand = (
    skinMat: THREE.Material,
    isRight: boolean,
    isTeacher: boolean,
    hasPointerStick = false
  ) => {
    const handGroup = new THREE.Group();

    // 1. Anatomical Palm (Beveled box with rounded edges)
    const palmGeo = new THREE.BoxGeometry(0.08, 0.085, 0.034);
    const palm = new THREE.Mesh(palmGeo, skinMat);
    palm.position.y = -0.042;
    handGroup.add(palm);

    // 2. Thenar Muscle Pad (Thumb Base)
    const thenarGeo = new THREE.SphereGeometry(0.024, 10, 10);
    const thenar = new THREE.Mesh(thenarGeo, skinMat);
    thenar.position.set(isRight ? -0.034 : 0.034, -0.04, 0.01);
    handGroup.add(thenar);

    // 3. Four Articulated Fingers (Index, Middle, Ring, Pinky)
    const fingerConfigs = [
      { x: -0.027, len: 0.054, rad: 0.009 },
      { x: -0.009, len: 0.060, rad: 0.0095 },
      { x: 0.009, len: 0.055, rad: 0.009 },
      { x: 0.027, len: 0.045, rad: 0.008 },
    ];

    fingerConfigs.forEach((f) => {
      const fGroup = new THREE.Group();
      fGroup.position.set(isRight ? f.x : -f.x, -0.085, 0);

      // Proximal phalanx
      const pGeo = new THREE.CylinderGeometry(f.rad * 0.9, f.rad, f.len * 0.55, 8);
      const phalanx1 = new THREE.Mesh(pGeo, skinMat);
      phalanx1.position.y = -f.len * 0.275;

      // Distal phalanx
      const dGeo = new THREE.CylinderGeometry(f.rad * 0.65, f.rad * 0.85, f.len * 0.45, 8);
      const phalanx2 = new THREE.Mesh(dGeo, skinMat);
      phalanx2.position.y = -f.len * 0.75;

      fGroup.add(phalanx1, phalanx2);

      // Natural finger posture
      if (isTeacher && isRight && hasPointerStick) {
        fGroup.rotation.x = Math.PI / 2.7;
      } else {
        fGroup.rotation.x = Math.PI / 9;
      }
      handGroup.add(fGroup);
    });

    // 4. Opposable Thumb with Metacarpal & Phalanx
    const thumbGroup = new THREE.Group();
    thumbGroup.position.set(isRight ? -0.042 : 0.042, -0.03, 0.012);
    thumbGroup.rotation.z = isRight ? Math.PI / 4 : -Math.PI / 4;
    thumbGroup.rotation.y = isRight ? -Math.PI / 6 : Math.PI / 6;

    const thumbGeo = new THREE.CylinderGeometry(0.0085, 0.011, 0.048, 8);
    const thumbPhalanx = new THREE.Mesh(thumbGeo, skinMat);
    thumbPhalanx.position.y = -0.024;
    thumbGroup.add(thumbPhalanx);

    if (isTeacher && isRight && hasPointerStick) {
      thumbGroup.rotation.x = Math.PI / 3;
    }
    handGroup.add(thumbGroup);

    return handGroup;
  };

  // ==========================================
  // REALISTIC HUMAN-LIKE STYLIZED CHARACTER BUILDER
  // (Teacher Satya with Glasses, Mustache, Nehru Vest & Pointer Stick)
  // (Students in Formal School Uniforms with Collars, Badges & Neckties)
  // ==========================================
  const buildStylizedHumanCharacter = (opts: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
    gender: 'boy' | 'girl' | 'man';
    skinColor: number;
    hairColor: number;
    shirtColor: number;
    jacketColor?: number;
    tieColor?: number;
    hasGlasses?: boolean;
    hasMustache?: boolean;
    hasPointerStick?: boolean;
    hasTie?: boolean;
    hasSchoolBadge?: boolean;
    hairStyle?: string;
    seated: boolean;
  }): CharacterModelRefs => {
    const group = new THREE.Group();
    const baseHeight = opts.seated ? 0.95 : 1.45;

    const skinMat = new THREE.MeshStandardMaterial({
      color: opts.skinColor,
      roughness: 0.52,
      metalness: 0.05,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: opts.hairColor,
      roughness: 0.85,
    });

    // 1. Head Group
    const headGroup = new THREE.Group();
    headGroup.position.y = baseHeight + 0.58;

    // Sculpted Head Mesh with tapered jaw
    const headGeo = new THREE.SphereGeometry(0.28, 28, 28);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Anatomical Sculpted Chin & Defined Jawline
    const chinGeo = new THREE.SphereGeometry(0.095, 16, 16);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, -0.20, 0.18);
    headGroup.add(chin);

    // Defined Cheekbones (Zygomatic Arch)
    const cheekGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const lCheek = new THREE.Mesh(cheekGeo, skinMat);
    lCheek.position.set(-0.16, -0.03, 0.17);
    const rCheek = new THREE.Mesh(cheekGeo, skinMat);
    rCheek.position.set(0.16, -0.03, 0.17);
    headGroup.add(lCheek, rCheek);

    // Sculpted Ears
    const earGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 12);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(-0.27, 0.02, 0);
    leftEar.rotation.z = Math.PI / 12;
    const rightEar = new THREE.Mesh(earGeo, skinMat);
    rightEar.position.set(0.27, 0.02, 0);
    rightEar.rotation.z = -Math.PI / 12;
    headGroup.add(leftEar, rightEar);

    // 2. Eyes (Sclera + Pupil + Specular Corneal Highlight)
    const eyeScleraGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const pupilGeo = new THREE.SphereGeometry(0.03, 16, 16);
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const irisGeo = new THREE.SphereGeometry(0.042, 16, 16);
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x3d2314 });
    const corneaHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Left Eye
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.10, 0.04, 0.24);
    const leftSclera = new THREE.Mesh(eyeScleraGeo, eyeWhiteMat);
    const leftIris = new THREE.Mesh(irisGeo, irisMat);
    leftIris.position.z = 0.02;
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.z = 0.032;
    const leftHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.010, 8, 8), corneaHighlightMat);
    leftHighlight.position.set(0.012, 0.012, 0.038);
    leftEyeGroup.add(leftSclera, leftIris, leftPupil, leftHighlight);
    headGroup.add(leftEyeGroup);

    // Right Eye
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.10, 0.04, 0.24);
    const rightSclera = new THREE.Mesh(eyeScleraGeo, eyeWhiteMat);
    const rightIris = new THREE.Mesh(irisGeo, irisMat);
    rightIris.position.z = 0.02;
    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.z = 0.032;
    const rightHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.010, 8, 8), corneaHighlightMat);
    rightHighlight.position.set(0.012, 0.012, 0.038);
    rightEyeGroup.add(rightSclera, rightIris, rightPupil, rightHighlight);
    headGroup.add(rightEyeGroup);

    // 3. Animated Eyelids (Blink Down over eyes)
    const eyelidGeo = new THREE.SphereGeometry(0.058, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const leftEyelid = new THREE.Mesh(eyelidGeo, skinMat);
    leftEyelid.position.set(-0.10, 0.05, 0.245);
    leftEyelid.scale.y = 0.05;

    const rightEyelid = new THREE.Mesh(eyelidGeo, skinMat);
    rightEyelid.position.set(0.10, 0.05, 0.245);
    rightEyelid.scale.y = 0.05;

    headGroup.add(leftEyelid, rightEyelid);
    const eyelids = [leftEyelid, rightEyelid];

    // 4. Expressive Eyebrows
    const browGeo = new THREE.BoxGeometry(0.09, 0.022, 0.02);
    const leftBrow = new THREE.Mesh(browGeo, hairMat);
    leftBrow.position.set(-0.10, 0.12, 0.26);
    leftBrow.rotation.z = 0.05;

    const rightBrow = new THREE.Mesh(browGeo, hairMat);
    rightBrow.position.set(0.10, 0.12, 0.26);
    rightBrow.rotation.z = -0.05;

    headGroup.add(leftBrow, rightBrow);
    const eyebrows = [leftBrow, rightBrow];

    // 5. Anatomical Sculpted 3D Nose (Bridge, Tip, Nostrils)
    const bridgeGeo = new THREE.CylinderGeometry(0.016, 0.022, 0.10, 8);
    const bridge = new THREE.Mesh(bridgeGeo, skinMat);
    bridge.position.set(0, 0.03, 0.28);
    bridge.rotation.x = Math.PI / 10;

    const tipGeo = new THREE.SphereGeometry(0.024, 12, 12);
    const tip = new THREE.Mesh(tipGeo, skinMat);
    tip.position.set(0, -0.02, 0.31);

    const nostrilGeo = new THREE.SphereGeometry(0.013, 8, 8);
    const lNostril = new THREE.Mesh(nostrilGeo, skinMat);
    lNostril.position.set(-0.022, -0.025, 0.29);
    const rNostril = new THREE.Mesh(nostrilGeo, skinMat);
    rNostril.position.set(0.022, -0.025, 0.29);
    headGroup.add(bridge, tip, lNostril, rNostril);

    // 6. Teacher Scholarly Spectacles / Glasses (Iconic Indian Masterji look)
    if (opts.hasGlasses) {
      const glassesGroup = new THREE.Group();
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.7,
        roughness: 0.3,
      });

      // Left Frame Rim
      const rimGeo = new THREE.TorusGeometry(0.065, 0.009, 12, 24);
      const leftRim = new THREE.Mesh(rimGeo, frameMat);
      leftRim.position.set(-0.10, 0.04, 0.27);

      // Right Frame Rim
      const rightRim = new THREE.Mesh(rimGeo, frameMat);
      rightRim.position.set(0.10, 0.04, 0.27);

      // Nose Bridge Bar
      const bridgeGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.08);
      const bridge = new THREE.Mesh(bridgeGeo, frameMat);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, 0.045, 0.285);

      // Temples going back to ears
      const templeGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.28);
      const leftTemple = new THREE.Mesh(templeGeo, frameMat);
      leftTemple.position.set(-0.17, 0.04, 0.14);
      leftTemple.rotation.x = Math.PI / 2;

      const rightTemple = new THREE.Mesh(templeGeo, frameMat);
      rightTemple.position.set(0.17, 0.04, 0.14);
      rightTemple.rotation.x = Math.PI / 2;

      glassesGroup.add(leftRim, rightRim, bridge, leftTemple, rightTemple);
      headGroup.add(glassesGroup);
    }

    // 7. Teacher Mustache (Authentic Dignified Odia / Indian Educator)
    if (opts.hasMustache) {
      const mustacheGeo = new THREE.CylinderGeometry(0.018, 0.024, 0.16, 12);
      const mustache = new THREE.Mesh(mustacheGeo, hairMat);
      mustache.rotation.z = Math.PI / 2;
      mustache.position.set(0, -0.065, 0.275);
      headGroup.add(mustache);
    }

    // 8. Animated Mouth with Viseme Lip Cavity, White Teeth, and Pink Tongue
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.11, 0.26);

    const mouthCavityGeo = new THREE.BoxGeometry(0.10, 0.042, 0.035);
    const mouthCavityMat = new THREE.MeshStandardMaterial({ color: 0x4c0519 });
    const mouthMesh = new THREE.Mesh(mouthCavityGeo, mouthCavityMat);

    // Upper Teeth
    const teethGeo = new THREE.BoxGeometry(0.08, 0.012, 0.032);
    const teethMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const uTeeth = new THREE.Mesh(teethGeo, teethMat);
    uTeeth.position.set(0, 0.013, 0.005);

    // Lower Teeth
    const lTeeth = new THREE.Mesh(teethGeo, teethMat);
    lTeeth.position.set(0, -0.013, 0.005);

    // Tongue
    const tongueGeo = new THREE.SphereGeometry(0.024, 10, 10);
    const tongueMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });
    const tongue = new THREE.Mesh(tongueGeo, tongueMat);
    tongue.position.set(0, -0.014, 0.008);
    tongue.scale.set(1.2, 0.6, 1);

    // Sculpted Lips
    const lipMat = new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.5 });
    const uLip = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.013, 0.032), lipMat);
    uLip.position.y = 0.022;
    const lLip = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.014, 0.032), lipMat);
    lLip.position.y = -0.022;

    mouthGroup.add(mouthMesh, uTeeth, lTeeth, tongue, uLip, lLip);
    headGroup.add(mouthGroup);

    // 9. Hair Sculpting
    if (opts.gender === 'girl') {
      // Feminine Schoolgirl Hair with Ribbon / Headband
      const hairCrownGeo = new THREE.SphereGeometry(0.30, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.6);
      const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
      hairCrown.position.y = 0.04;
      headGroup.add(hairCrown);

      // Back ponytail / volume
      const ponytailGeo = new THREE.CylinderGeometry(0.08, 0.15, 0.45, 16);
      const ponytail = new THREE.Mesh(ponytailGeo, hairMat);
      ponytail.position.set(0, -0.12, -0.26);
      ponytail.rotation.x = Math.PI / 6;
      headGroup.add(ponytail);

      // School Ribbon / Headband
      const ribbonGeo = new THREE.TorusGeometry(0.29, 0.025, 12, 32);
      const ribbonMat = new THREE.MeshStandardMaterial({
        color: opts.id === 'arpita' ? 0xbe123c : 0x059669,
      });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.position.set(0, 0.08, 0);
      ribbon.rotation.x = Math.PI / 2;
      headGroup.add(ribbon);
    } else {
      // Educator / Boy Short Styled Hair with Side Parting
      const hairCrownGeo = new THREE.SphereGeometry(0.295, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7);
      const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
      hairCrown.position.y = 0.04;
      headGroup.add(hairCrown);

      // Side Parting Volume
      const sidePartGeo = new THREE.BoxGeometry(0.15, 0.06, 0.26);
      const sidePart = new THREE.Mesh(sidePartGeo, hairMat);
      sidePart.position.set(0.12, 0.22, 0.05);
      sidePart.rotation.z = -Math.PI / 12;
      headGroup.add(sidePart);
    }

    group.add(headGroup);

    // 10. Clothed Torso & Formal Uniform Attire
    const neckGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.22, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = baseHeight + 0.32;
    group.add(neck);

    // Formal Shirt Mesh
    const shirtMat = new THREE.MeshStandardMaterial({
      color: opts.shirtColor,
      roughness: 0.65,
    });
    const torsoGeo = new THREE.CylinderGeometry(0.30, 0.36, 0.85, 20);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = baseHeight - 0.15;
    torso.castShadow = true;
    group.add(torso);

    // White Shirt Folded Collar Tips
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const collarGeo = new THREE.TorusGeometry(0.18, 0.035, 8, 24);
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, baseHeight + 0.22, 0);
    collar.rotation.x = Math.PI / 2;
    group.add(collar);

    // Formal Uniform Necktie
    if (opts.hasTie || opts.role === 'student') {
      const tieMat = new THREE.MeshStandardMaterial({
        color: opts.tieColor || 0x1e3a8a,
        roughness: 0.5,
      });
      const tieGeo = new THREE.BoxGeometry(0.08, 0.42, 0.04);
      const tie = new THREE.Mesh(tieGeo, tieMat);
      tie.position.set(0, baseHeight + 0.02, 0.31);
      group.add(tie);
    }

    // Teacher Nehru Waistcoat / Student Uniform Vest
    if (opts.jacketColor) {
      const vestMat = new THREE.MeshStandardMaterial({
        color: opts.jacketColor,
        roughness: 0.6,
      });
      const vestGeo = new THREE.CylinderGeometry(0.32, 0.375, 0.78, 20, 1, false, 0, Math.PI * 1.6);
      const vest = new THREE.Mesh(vestGeo, vestMat);
      vest.position.set(0, baseHeight - 0.13, 0);
      vest.rotation.y = Math.PI * 0.2;
      group.add(vest);

      // Golden School Badge / Teacher Pocket Square
      const badgeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16);
      const badgeMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 0.8,
        roughness: 0.2,
      });
      const badge = new THREE.Mesh(badgeGeo, badgeMat);
      badge.rotation.x = Math.PI / 2;
      badge.position.set(0.18, baseHeight + 0.05, 0.33);
      group.add(badge);
    }

    // 11. Articulated Arms & 5-Finger Human Hands
    // Right Arm (Controls gestures, blackboard pointing, and student question raising)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.38, baseHeight + 0.18, 0);

    const armGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.68, 16);
    const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
    rightArmMesh.position.y = -0.32;
    rightArmGroup.add(rightArmMesh);

    // Anatomical 5-Finger Hand
    const rightHand = buildArticulatedHumanHand(skinMat, true, opts.role === 'teacher', opts.hasPointerStick);
    rightHand.position.y = -0.66;
    rightArmGroup.add(rightHand);

    let pointerMesh: THREE.Mesh | undefined = undefined;

    // Wooden Teacher Pointer Stick with Brass Tip
    if (opts.hasPointerStick) {
      const stickGroup = new THREE.Group();
      stickGroup.position.set(0, -0.66, 0);

      // Tapered Wooden Pointer
      const stickGeo = new THREE.CylinderGeometry(0.012, 0.022, 1.1, 12);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.4 });
      pointerMesh = new THREE.Mesh(stickGeo, woodMat);
      pointerMesh.position.set(0, -0.45, 0.45);
      pointerMesh.rotation.x = Math.PI / 3;

      // Brass Ferrule Tip
      const brassTip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.12, 12),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 })
      );
      brassTip.position.set(0, -0.92, 0.92);
      brassTip.rotation.x = Math.PI / 3;

      stickGroup.add(pointerMesh, brassTip);
      rightArmGroup.add(stickGroup);
    }

    group.add(rightArmGroup);

    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.38, baseHeight + 0.18, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
    leftArmMesh.position.y = -0.32;
    leftArmGroup.add(leftArmMesh);

    const leftHand = buildArticulatedHumanHand(skinMat, false, opts.role === 'teacher', false);
    leftHand.position.y = -0.66;
    leftArmGroup.add(leftHand);

    if (opts.seated) {
      // Resting on desk in front
      rightArmGroup.rotation.x = Math.PI / 3.4;
      leftArmGroup.rotation.x = Math.PI / 3.4;
    } else {
      // Natural lecturer posture
      rightArmGroup.rotation.z = -0.25;
      leftArmGroup.rotation.z = 0.15;
    }
    group.add(leftArmGroup);

    return {
      group,
      head: headGroup,
      mouth: mouthMesh,
      eyelids,
      eyebrows,
      rightArm: rightArmGroup,
      pointerStick: pointerMesh,
      leftArm: leftArmGroup,
    };
  };

  // ==========================================
  // REALISTIC STUDENT DESK & CHAIR BUILDER
  // ==========================================
  const buildStudentDesk = () => {
    const deskGroup = new THREE.Group();

    // Wood Desk Tabletop
    const topGeo = new THREE.BoxGeometry(1.8, 0.08, 0.95);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x52301c, // Rich teak wood
      roughness: 0.45,
    });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 0.95;
    top.castShadow = true;
    deskGroup.add(top);

    // Steel Tubular Frame Legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.95);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 });

    const legPositions = [
      [-0.78, 0.475, -0.38],
      [0.78, 0.475, -0.38],
      [-0.78, 0.475, 0.38],
      [0.78, 0.475, 0.38],
    ];

    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      deskGroup.add(leg);
    });

    // Lined Notebook on Desk
    const notebookGeo = new THREE.BoxGeometry(0.42, 0.025, 0.32);
    const notebookMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    const notebook = new THREE.Mesh(notebookGeo, notebookMat);
    notebook.position.set(-0.25, 1.0, 0.1);
    deskGroup.add(notebook);

    // Textbook
    const bookGeo = new THREE.BoxGeometry(0.45, 0.04, 0.34);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0xbe123c });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(0.32, 1.01, 0.05);
    deskGroup.add(book);

    // Pen Holder with Pens
    const holderGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16);
    const holderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const holder = new THREE.Mesh(holderGeo, holderMat);
    holder.position.set(0.65, 1.05, -0.25);
    deskGroup.add(holder);

    // Student Chair
    const seatGeo = new THREE.BoxGeometry(0.65, 0.06, 0.65);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x452312, roughness: 0.5 });
    const seat = new THREE.Mesh(seatGeo, chairMat);
    seat.position.set(0, 0.48, 0.65);
    deskGroup.add(seat);

    const backrestGeo = new THREE.BoxGeometry(0.65, 0.45, 0.05);
    const backrest = new THREE.Mesh(backrestGeo, chairMat);
    backrest.position.set(0, 0.9, 0.95);
    deskGroup.add(backrest);

    return deskGroup;
  };

  // ==========================================
  // CINEMATIC CAMERA DIRECTING ENGINE
  // ==========================================
  const applyCameraShot = (shot: CameraShotType) => {
    const camera = cameraRef.current;
    if (!camera) return;

    switch (shot) {
      case 'wide-classroom':
      case 'classroom-wide':
        // Wide view showing Teacher Satya at chalkboard on left, students in uniforms
        camera.position.set(0, 3.6, 9.8);
        camera.lookAt(0, 1.8, -1.0);
        break;

      case 'teacher-closeup':
      case 'teacher-close-up':
        // Close framing on Satya with large illuminated chalkboard prominently visible behind & beside him!
        camera.position.set(-1.0, 2.7, -1.2);
        camera.lookAt(-1.6, 2.4, -4.5);
        break;

      case 'arpita-closeup':
        // Arpita (Desk 1 on left) in formal uniform with classroom in background
        camera.position.set(-2.7, 2.1, 0.6);
        camera.lookAt(-2.7, 1.9, 2.4);
        break;

      case 'lucky-closeup':
        // Lucky (Desk 2 in center) in formal uniform with classroom library behind
        camera.position.set(0, 2.1, 0.6);
        camera.lookAt(0, 1.9, 2.4);
        break;

      case 'chintu-closeup':
        // Chintu (Desk 3 on right) in formal uniform with classroom notice board
        camera.position.set(2.7, 2.1, 0.6);
        camera.lookAt(2.7, 1.9, 2.4);
        break;

      case 'student-closeup':
      case 'student-question':
        camera.position.set(0, 2.1, 0.6);
        camera.lookAt(0, 1.9, 2.4);
        break;

      case 'teacher-reply':
        // Medium shot from student row looking towards Satya nodding and gesturing at the board
        camera.position.set(0, 2.2, 2.0);
        camera.lookAt(-1.5, 2.5, -4.0);
        break;

      case 'board-zoom':
      case 'board-view':
        // Direct zoom on the Chinmay Chalkboard diagrams & formulas, with Satya on the left pointing with stick!
        camera.position.set(1.2, 3.2, -1.6);
        camera.lookAt(1.2, 3.2, -5.8);
        break;

      case 'over-the-shoulder':
      case 'over-shoulder':
        // Looking from behind Arpita's uniform shoulder towards Satya pointing at the board
        camera.position.set(-2.4, 2.3, 3.2);
        camera.lookAt(-1.0, 2.5, -3.8);
        break;

      case 'side-angle':
        camera.position.set(-6.5, 3.8, 1.2);
        camera.lookAt(0, 2.2, -2.0);
        break;

      case 'split-view':
      case 'two-person':
        camera.position.set(3.5, 2.8, 4.0);
        camera.lookAt(-1.0, 2.3, -2.5);
        break;

      default:
        camera.position.set(0, 3.6, 9.8);
        camera.lookAt(0, 1.8, -1.0);
    }
  };

  // Automatic camera director: switches camera based on character name or in-script shortcut
  const getCameraShotForTurn = (line: DialogueLine, index: number): CameraShotType => {
    // 1. Explicit in-script camera shortcut has highest priority
    if (line.cameraShot) {
      return line.cameraShot;
    }

    // 2. Automatic directing based on character ID
    if (line.characterId === 'arpita') return 'arpita-closeup';
    if (line.characterId === 'lucky') return 'lucky-closeup';
    if (line.characterId === 'chintu') return 'chintu-closeup';
    if (line.characterId === 'satya') {
      return index % 2 === 0 ? 'teacher-closeup' : 'board-zoom';
    }

    // 3. Fallback name inspection
    const s = (line.speaker || line.speakerName || '').toLowerCase();
    if (s.includes('arpita')) return 'arpita-closeup';
    if (s.includes('lucky')) return 'lucky-closeup';
    if (s.includes('chintu')) return 'chintu-closeup';
    if (s.includes('satya') || s.includes('teacher')) return 'teacher-closeup';

    return 'wide-classroom';
  };

  // Play Turn with Character-Specific Voice Modulation
  const handlePlayDialogue = (index: number) => {
    if (!dialogueLines[index]) return;
    setCurrentLineIndex(index);
    setIsPlaying(true);

    const line = dialogueLines[index];
    const characterId = line.characterId || 'satya';
    setSpeakingCharacterId(characterId);

    // Automatic camera directing fires!
    const autoShot = getCameraShotForTurn(line, index);
    setCurrentShot(autoShot);

    // Character voice modulation via ttsService
    ttsService.speakCharacter(line.text, characterId, selectedLanguageMode, {
      onEnd: () => {
        if (index + 1 < dialogueLines.length) {
          handlePlayDialogue(index + 1);
        } else {
          setIsPlaying(false);
          setSpeakingCharacterId(null);
          setCurrentShot('wide-classroom');
        }
      },
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
      setSpeakingCharacterId(null);
    } else {
      handlePlayDialogue(currentLineIndex);
    }
  };

  // Language preset loader
  const handleSelectLanguageMode = (mode: IndianVoiceLanguageMode) => {
    setSelectedLanguageMode(mode);
    const preset = MULTILINGUAL_CLASSROOM_PRESETS[mode];
    if (preset) {
      setRawScript(preset.script);
      setCurrentLineIndex(0);
      setStatusNotification(`Loaded ${preset.title}`);
      setTimeout(() => setStatusNotification(''), 3500);
    }
  };

  // Insert helper for in-script shortcuts
  const handleInsertShortcut = (snippet: string) => {
    setRawScript((prev) => prev + '\n\n' + snippet);
    setStatusNotification(`Inserted ${snippet.split('\n')[0]}`);
    setTimeout(() => setStatusNotification(''), 2500);
  };

  // Preview character voice
  const handleTestVoice = (charId: 'satya' | 'arpita' | 'lucky' | 'chintu') => {
    const samplePhrases: Record<string, string> = {
      satya: 'Welcome students to our Satya Gyan masterclass. Today we explore market forces and demand.',
      arpita: 'Sir, does an increase in consumer income always shift the demand curve to the right?',
      lucky: 'Sir, what happens in the case of Giffen goods? Do they violate the law of demand?',
      chintu: 'Sir, if public transit expands rapidly, will petrol demand become elastic?',
    };
    ttsService.speakCharacter(samplePhrases[charId] || 'Hello!', charId, selectedLanguageMode);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              MODULE 3
            </span>
            <h2 className="text-xl font-bold text-white">3D CLASSROOM & VIRTUAL BLACKBOARD</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Featuring <strong>Teacher Satya</strong> pointing with a wooden pointer stick at the authentic <strong>Chinmay Chalkboard</strong>, with formal uniformed students <strong>Arpita</strong>, <strong>Lucky</strong>, and <strong>Chintu</strong>, real-time chalk diagrams, and YouTube-ready cinematic directing.
          </p>
        </div>

        {/* Global Language Selector for 3D Classroom */}
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <select
            value={selectedLanguageMode}
            onChange={(e) => handleSelectLanguageMode(e.target.value as IndianVoiceLanguageMode)}
            className="bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="only-eng">Only English (Indian Voice - en-IN)</option>
            <option value="only-odia">Only Odia (ଓଡ଼ିଆ - or-IN)</option>
            <option value="only-hindi">Only Hindi (हिन्दी - hi-IN)</option>
            <option value="bilingual-eng-hindi">Bilingual (English + Hindi Hinglish)</option>
            <option value="bilingual-eng-odia">Bilingual (English + Odia)</option>
          </select>
        </div>
      </div>

      {statusNotification && (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main Grid: 3D Stage Viewport (8 Cols) vs Script & Directing Controls (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Canvas Stage */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-2xl overflow-hidden group">
            {/* Non-overlapping Satya Gyan Watermark in Top Right with Safe Margins */}
            <SatyaGyanWatermark settings={watermarkSettings} compact={true} />

            {/* Three.js Canvas */}
            <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

            {/* Active Camera Badge Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 font-mono">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Camera: {currentShot.toUpperCase()}</span>
            </div>

            {/* Active Character Subtitle Banner (YouTube Friendly Conversation Bar) */}
            {dialogueLines[currentLineIndex] && (
              <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs text-white flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      dialogueLines[currentLineIndex].characterId === 'satya'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : dialogueLines[currentLineIndex].characterId === 'arpita'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                        : dialogueLines[currentLineIndex].characterId === 'lucky'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {dialogueLines[currentLineIndex].speakerName}
                  </span>
                  <p className="text-xs md:text-sm font-medium text-slate-100 italic line-clamp-2">
                    "{dialogueLines[currentLineIndex].text}"
                  </p>
                </div>
                <Volume2 className={`w-4 h-4 shrink-0 ml-2 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              </div>
            )}
          </div>

          {/* 10 Camera Shot Directing Switcher */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                Automatic Cinematic Camera Directing (Manual Override)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Auto-switches to speaker: Satya, Arpita, Lucky, Chintu
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'wide-classroom', label: '1. Wide Classroom', code: '[CAM:WIDE]' },
                { id: 'teacher-closeup', label: '2. Satya & Blackboard', code: '[CAM:SATYA]' },
                { id: 'arpita-closeup', label: '3. Arpita (Uniform)', code: '[CAM:ARPITA]' },
                { id: 'lucky-closeup', label: '4. Lucky (Uniform)', code: '[CAM:LUCKY]' },
                { id: 'chintu-closeup', label: '5. Chintu (Uniform)', code: '[CAM:CHINTU]' },
                { id: 'board-zoom', label: '6. Blackboard Zoom', code: '[CAM:BOARD]' },
                { id: 'over-the-shoulder', label: '7. Over Shoulder', code: '[CAM:OVER_SHOULDER]' },
                { id: 'split-view', label: '8. Split Two-Shot', code: '[CAM:SPLIT]' },
                { id: 'side-angle', label: '9. Side Angle', code: '[CAM:SIDE]' },
                { id: 'teacher-reply', label: '10. Podium Reply', code: '[CAM:REPLY]' },
              ].map((shot) => (
                <button
                  key={shot.id}
                  onClick={() => setCurrentShot(shot.id as CameraShotType)}
                  className={`p-2 rounded-lg border text-left text-xs font-medium transition flex flex-col justify-between gap-1 ${
                    currentShot === shot.id
                      ? 'bg-amber-600/25 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{shot.label}</span>
                  <span className="text-[9px] font-mono text-slate-500">{shot.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Character Voice Profiles & Testing Bar */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Teacher Satya & Formal Uniform Students (Pitch & Speech Modulation)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { id: 'satya', name: 'Satya (Teacher)', role: 'Educator with Pointer & Glasses', pitch: '0.92', color: 'sky' },
                { id: 'arpita', name: 'Arpita (Girl 1)', role: 'Uniform Blazer & Maroon Tie', pitch: '1.26', color: 'pink' },
                { id: 'lucky', name: 'Lucky (Girl 2)', role: 'Uniform Vest & Emerald Tie', pitch: '1.18', color: 'emerald' },
                { id: 'chintu', name: 'Chintu (Boy 3)', role: 'Uniform Shirt & Amber Tie', pitch: '1.10', color: 'amber' },
              ].map((char) => (
                <div key={char.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs text-white block">{char.name}</span>
                    <span className="text-[10px] text-slate-400 block">{char.role}</span>
                    <span className="text-[9px] text-indigo-400 font-mono">Pitch: {char.pitch}</span>
                  </div>
                  <button
                    onClick={() => handleTestVoice(char.id as any)}
                    className="w-full py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-semibold text-slate-300 transition flex items-center justify-center gap-1 border border-slate-700"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Test Voice</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dialogue Turns & In-Script Camera Shortcut Editor */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Dialogue Sequence ({dialogueLines.length} turns)
              </h3>
              <button
                onClick={handleTogglePlay}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play 3D Lecture'}</span>
              </button>
            </div>

            {/* Dialogue Turns List */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {dialogueLines.map((line, idx) => {
                const isActive = idx === currentLineIndex;
                const charId = line.characterId || 'satya';
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      ttsService.stop();
                      setIsPlaying(false);
                      setCurrentLineIndex(idx);
                      const autoShot = getCameraShotForTurn(line, idx);
                      setCurrentShot(autoShot);
                    }}
                    className={`p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                      isActive
                        ? 'bg-amber-950/40 border-amber-500 text-amber-100'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold text-[10px] ${
                            charId === 'satya'
                              ? 'text-sky-400'
                              : charId === 'arpita'
                              ? 'text-pink-400'
                              : charId === 'lucky'
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {line.speakerName}
                        </span>
                        {line.cameraShot && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                            {line.cameraShot}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">#{idx + 1}</span>
                    </div>
                    <p className="line-clamp-2 leading-tight">{line.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick In-Script Shortcut Insertion Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  In-Script Camera & Speaker Shortcuts
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleInsertShortcut('[CAM:SATYA]\nSatya: "..."')}
                  className="px-2 py-1 rounded bg-sky-950/60 border border-sky-800 hover:bg-sky-900 text-sky-300 text-[10px] font-mono"
                >
                  + Satya
                </button>
                <button
                  onClick={() => handleInsertShortcut('[CAM:ARPITA]\nArpita: "..."')}
                  className="px-2 py-1 rounded bg-pink-950/60 border border-pink-800 hover:bg-pink-900 text-pink-300 text-[10px] font-mono"
                >
                  + Arpita
                </button>
                <button
                  onClick={() => handleInsertShortcut('[CAM:LUCKY]\nLucky: "..."')}
                  className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 text-[10px] font-mono"
                >
                  + Lucky
                </button>
                <button
                  onClick={() => handleInsertShortcut('[CAM:CHINTU]\nChintu: "..."')}
                  className="px-2 py-1 rounded bg-amber-950/60 border border-amber-800 hover:bg-amber-900 text-amber-300 text-[10px] font-mono"
                >
                  + Chintu
                </button>
                <button
                  onClick={() => handleInsertShortcut('[CAM:BOARD]')}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-amber-300 text-[10px] font-mono"
                >
                  [CAM:BOARD]
                </button>
                <button
                  onClick={() => handleInsertShortcut('[CAM:WIDE]')}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-indigo-300 text-[10px] font-mono"
                >
                  [CAM:WIDE]
                </button>
              </div>
            </div>

            {/* Editable Raw Dialogue Script */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                Raw Dialogue Script (Edit or Paste)
              </label>
              <textarea
                value={rawScript}
                onChange={(e) => setRawScript(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                placeholder="Type Character: 'Dialogue' and optional [CAM:NAME] shortcut..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PARSER WITH CHARACTER NAMES & CAMERA SHORTCUTS
// ==========================================
function parseDialogueScript(text: string): DialogueLine[] {
  const lines = text.split('\n');
  const result: DialogueLine[] = [];
  let currentSpeaker = 'Satya';
  let currentCamera: CameraShotType | undefined = undefined;
  let currentSpeech: string[] = [];

  const getCharMeta = (spk: string) => {
    const s = spk.toLowerCase();
    if (s.includes('arpita') || s.includes('student 1')) {
      return { id: 'arpita', name: 'Arpita', avatar: '#f472b6', defaultShot: 'arpita-closeup' as CameraShotType };
    }
    if (s.includes('lucky') || s.includes('student 2')) {
      return { id: 'lucky', name: 'Lucky', avatar: '#34d399', defaultShot: 'lucky-closeup' as CameraShotType };
    }
    if (s.includes('chintu') || s.includes('student 3')) {
      return { id: 'chintu', name: 'Chintu', avatar: '#fbbf24', defaultShot: 'chintu-closeup' as CameraShotType };
    }
    return { id: 'satya', name: 'Satya (Teacher)', avatar: '#38bdf8', defaultShot: 'teacher-closeup' as CameraShotType };
  };

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // Check for in-script camera shortcut: [CAM:XXX]
    const camMatch = trimmed.match(/\[CAM:([A-Za-z0-9_]+)\]/i);
    if (camMatch) {
      const tag = camMatch[1].toUpperCase();
      if (tag === 'SATYA' || tag === 'TEACHER') currentCamera = 'teacher-closeup';
      else if (tag === 'ARPITA') currentCamera = 'arpita-closeup';
      else if (tag === 'LUCKY') currentCamera = 'lucky-closeup';
      else if (tag === 'CHINTU') currentCamera = 'chintu-closeup';
      else if (tag === 'BOARD') currentCamera = 'board-zoom';
      else if (tag === 'WIDE') currentCamera = 'wide-classroom';
      else if (tag === 'OVER_SHOULDER' || tag === 'OVERSHOULDER') currentCamera = 'over-the-shoulder';
      else if (tag === 'SPLIT') currentCamera = 'split-view';
      else if (tag === 'SIDE') currentCamera = 'side-angle';
      else if (tag === 'REPLY') currentCamera = 'teacher-reply';
      continue;
    }

    // Check for Character Speaker Dialogue: Satya:, Arpita:, Lucky:, Chintu:, Teacher:, Student 1:
    const speakerMatch = trimmed.match(/^(SATYA|ARPITA|LUCKY|CHINTU|TEACHER|STUDENT\s*\d*|PROFESSOR):/i);
    if (speakerMatch) {
      if (currentSpeech.length > 0) {
        const meta = getCharMeta(currentSpeaker);
        const speechContent = currentSpeech.join(' ').replace(/^["']|["']$/g, '');
        result.push({
          id: `dl-${result.length + 1}`,
          speakerId: meta.id.toUpperCase() as any,
          speakerName: meta.name,
          speaker: meta.name,
          characterId: meta.id as any,
          avatarColor: meta.avatar,
          cameraShot: currentCamera || meta.defaultShot,
          facialExpression: meta.id === 'satya' ? 'explaining' : 'curious',
          handGesture: meta.id === 'satya' ? 'pointing-board' : 'raising-hand',
          durationSec: Math.max(3, Math.round(speechContent.split(' ').length / 2.3)),
          boardContent: 'The Law of Downward-Sloping Demand',
          boardSnippet: 'The Law of Downward-Sloping Demand',
          text: speechContent,
        });
        currentSpeech = [];
        currentCamera = undefined; // reset for next turn
      }

      currentSpeaker = trimmed.replace(/:.*/, '').trim();
      const speechPart = trimmed.replace(/^[^:]+:\s*/, '');
      if (speechPart) currentSpeech.push(speechPart);
    } else {
      currentSpeech.push(trimmed);
    }
  }

  if (currentSpeech.length > 0) {
    const meta = getCharMeta(currentSpeaker);
    const speechContent = currentSpeech.join(' ').replace(/^["']|["']$/g, '');
    result.push({
      id: `dl-${result.length + 1}`,
      speakerId: meta.id.toUpperCase() as any,
      speakerName: meta.name,
      speaker: meta.name,
      characterId: meta.id as any,
      avatarColor: meta.avatar,
      cameraShot: currentCamera || meta.defaultShot,
      facialExpression: meta.id === 'satya' ? 'explaining' : 'curious',
      handGesture: meta.id === 'satya' ? 'pointing-board' : 'raising-hand',
      durationSec: Math.max(3, Math.round(speechContent.split(' ').length / 2.3)),
      boardContent: 'The Law of Downward-Sloping Demand',
      boardSnippet: 'The Law of Downward-Sloping Demand',
      text: speechContent,
    });
  }

  return result;
}
