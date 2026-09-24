import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Send,
  Layers,
  FileText,
  Trash2,
  Cpu,
  Globe2,
  Scale,
  TrendingUp,
  Atom,
  GraduationCap,
  Eye,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Presentation,
  Box,
  Image as ImageIcon,
} from 'lucide-react';
import { SupportedLanguage, ParsedScene } from '../types';
import { parseArpitonScript } from '../services/scriptParser';
import { clearImageMemoryCache, resolveEducationalImage } from '../services/imageResolver';

interface AiPromptStudioModuleProps {
  currentLanguage: SupportedLanguage;
  onSendToSlideStudio: (script: string, title?: string) => void;
  onSendToClassroom: (script: string, title?: string) => void;
  onSendToCurrentAffairs?: () => void;
  onClearStorageNotify?: () => void;
}

type SubjectCategory =
  | 'upsc-current-affairs'
  | 'polity'
  | 'economics'
  | 'scitech'
  | 'geography'
  | 'history'
  | 'custom';

type TargetLevel =
  | 'UPSC CSE (Prelims & Mains GS 1-4)'
  | 'PhD & Doctoral Research'
  | 'State PSC (OPSC OAS / UPPSC / BPSC)'
  | 'Postgraduate / University Level'
  | 'Class 11-12 / Foundation';

type ScriptFormatStyle =
  | 'slides-masterclass'
  | 'classroom-3d-dialogue'
  | 'newspaper-vision-ias-deepdive';

export const AiPromptStudioModule: React.FC<AiPromptStudioModuleProps> = ({
  currentLanguage,
  onSendToSlideStudio,
  onSendToClassroom,
  onSendToCurrentAffairs,
  onClearStorageNotify,
}) => {
  // Config state
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>('upsc-current-affairs');
  const [targetLevel, setTargetLevel] = useState<TargetLevel>('UPSC CSE (Prelims & Mains GS 1-4)');
  const [formatStyle, setFormatStyle] = useState<ScriptFormatStyle>('slides-masterclass');
  const [slideCount, setSlideCount] = useState<number>(6);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [includeImageInstructions, setIncludeImageInstructions] = useState<boolean>(true);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // External script validation state
  const [pastedScript, setPastedScript] = useState<string>('');
  const [validationScenes, setValidationScenes] = useState<ParsedScene[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [storageCleanCount, setStorageCleanCount] = useState<number>(0);
  const [showStorageNotice, setShowStorageNotice] = useState<boolean>(false);

  // Dynamic topic information based on subject
  const currentSubjectInfo = useMemo(() => {
    switch (selectedCategory) {
      case 'upsc-current-affairs':
        return {
          title: 'UPSC Current Affairs & Multi-Newspaper Synthesis',
          defaultTopic: 'Supreme Court Ruling on State Borrowing Powers (Article 293) & Fiscal Federalism',
          sources: 'The Hindu (Lead & Editorial), The Indian Express (Explained), Times of India, PIB, Vision IAS Monthly / PT 365',
          coreElements: 'Constitutional basis, economic indicators, inter-governmental fiscal disputes, Mains analytical framework, Prelims traps',
          defaultImagePrompt: 'Supreme Court of India & Fiscal Federalism Ledger',
        };
      case 'polity':
        return {
          title: 'Indian Polity & Constitutional Law',
          defaultTopic: 'The Golden Triangle of Fundamental Rights (Articles 14, 19, 21) & Basic Structure Doctrine',
          sources: 'Constitution of India, Landmark Judgments (Kesavananda Bharati, Maneka Gandhi, Puttaswamy), DD Basu, Laxmikanth',
          coreElements: 'Substantive due process, non-arbitrariness, transformative constitutionalism, Article 32 writs',
          defaultImagePrompt: 'Constitution of India & Golden Triangle of Fundamental Rights',
        };
      case 'economics':
        return {
          title: 'Economics & Public Finance',
          defaultTopic: 'Giffen Goods Paradox, Price Elasticity & Monetary Transmission Mechanism in India',
          sources: 'Economic Survey of India, RBI Monetary Policy Reports, Hal Varian Intermediate Microeconomics, Ramesh Singh',
          coreElements: 'Income vs. substitution effect, upward-sloping demand curve, CPI inflation basket, repo rate transmission',
          defaultImagePrompt: 'Giffen Goods Paradox & Supply Demand Equilibrium',
        };
      case 'scitech':
        return {
          title: 'Science & Advanced Technology',
          defaultTopic: 'ISRO Gaganyaan Human Spaceflight Mission & Indigenous LVM3 Cryogenic Stage',
          sources: 'ISRO Official Bulletins, Nature / Science journals, India Semiconductor Mission dossiers, PIB Science',
          coreElements: 'Orbital module (OM), environmental control life support system (ECLSS), cryogenic upper stage C25, astronaut safety abort systems',
          defaultImagePrompt: 'ISRO Gaganyaan Launch Vehicle & Orbital Module',
        };
      case 'geography':
        return {
          title: 'Physical Geography & Environment',
          defaultTopic: 'Himalayan Orogeny, Plate Tectonics & Glacial Lake Outburst Floods (GLOF) Vulnerability',
          sources: 'Geological Survey of India, IPCC Assessment Reports, NCERT Class 11 Physical Geography',
          coreElements: 'Indian-Eurasian plate convergent boundary, thrust faults (MCT, MBT, HFT), climate crisis, disaster management framework',
          defaultImagePrompt: 'Himalayan Orogeny & Continental Plate Collision Zone',
        };
      case 'history':
        return {
          title: 'Modern Indian History & Freedom Struggle',
          defaultTopic: 'Non-Cooperation to Civil Disobedience Movement: Economic Boycott, Peasant Mobilization & Constitutional Reform',
          sources: 'Bipan Chandra (India\'s Struggle for Independence), NCERT Class 12 Themes in Indian History, Government of India Act 1935',
          coreElements: 'Swaraj ideology, salt satyagraha logistics, Round Table Conferences, subaltern participation, legacy in modern democracy',
          defaultImagePrompt: 'Dandi March Salt Satyagraha and National Freedom Movement',
        };
      case 'custom':
      default:
        return {
          title: 'Custom User Topic',
          defaultTopic: customTopic || 'Advanced Research & Pedagogical Masterclass',
          sources: 'Academic peer-reviewed literature, standard reference textbooks, national archives',
          coreElements: 'Conceptual definitions, theoretical proofs, empirical evidence, pedagogical clarity',
          defaultImagePrompt: customTopic || 'Academic Masterclass Reference Visual',
        };
    }
  }, [selectedCategory, customTopic]);

  const activeTopicName = selectedCategory === 'custom' && customTopic.trim()
    ? customTopic.trim()
    : currentSubjectInfo.defaultTopic;

  // Generate Master AI Prompt
  const generatedMasterPrompt = useMemo(() => {
    let scriptArchitecturePrompt = '';

    if (formatStyle === 'slides-masterclass') {
      scriptArchitecturePrompt = `
=== OUTPUT FORMAT: ARPITON SLIDE-BASED EDUCATIONAL MASTERCLASS ===
Generate an exact ${slideCount}-slide script formatted with strict ARPITON tags.
Each slide MUST follow this exact structure:

### SLIDE <Number>: <Precise Academic Title>
[HIGHLIGHT]
[IMAGE: <Detailed realistic encyclopedic image description, e.g., "${currentSubjectInfo.defaultImagePrompt}"]
• Point 1: Definitive concept statement with high academic precision
• Point 2: Core mechanism, constitutional article, formula, or empirical data
• Point 3: Crucial analytical nuance, counter-argument, or exam insight
• Point 4: Summary takeaway or model answer synthesis

Narration:
<Write a 50-70 word engaging, clear spoken lecture script in the voice of Teacher Satya Subham Biswal. Explain the concepts clearly, pointing out details in the visual. Do not read the bullet points word-for-word; explain the insights behind them.>
`;
    } else if (formatStyle === 'classroom-3d-dialogue') {
      scriptArchitecturePrompt = `
=== OUTPUT FORMAT: 3D VIRTUAL CLASSROOM 4-CHARACTER CONVERSATIONAL SCRIPT ===
Set inside the ARPITON 3D Virtual Classroom with:
- Teacher: Satya Subham Biswal (stands at the Chinmay Blackboard with pointer stick)
- Student 1: Arpita (attentive, formal uniform, sharp questions)
- Student 2: Lucky (curious, inquisitive, asking practical real-world applications)
- Student 3: Chintu (energetic, seeking simple intuitive clarifications)

Use cinematic camera tags on new lines before speaker turns:
[CAM:WIDE], [CAM:SATYA], [CAM:ARPITA], [CAM:LUCKY], [CAM:CHINTU], [CAM:BOARD]

Sample Structure:
[CAM:WIDE]
Satya: Welcome to today's masterclass. Look at the Chinmay Blackboard as we decode ${activeTopicName}.
[CAM:BOARD]
Satya: Here is the core framework. Notice how the constitutional and empirical dynamics operate.
[CAM:ARPITA]
Arpita: Sir, how does this relate to the fundamental legal doctrine?
[CAM:SATYA]
Satya: Excellent question, Arpita. Let me demonstrate the exact mechanism...
[CAM:LUCKY]
Lucky: Sir, does this also apply during economic or constitutional crises?
`;
    } else {
      scriptArchitecturePrompt = `
=== OUTPUT FORMAT: UPSC MULTI-NEWSPAPER & VISION IAS LONG-FORM CURRENT AFFAIRS SPECIAL ===
Generate a comprehensive, high-yield ${slideCount}-part analytical lecture.
Sources explicitly analyzed:
- The Hindu Editorial & National Lead
- The Indian Express (Explained Section)
- Times of India & PIB Bulletins
- Vision IAS Monthly Magazine / PT 365

Each section MUST include:
1. Context & Headline Anchor (The Hindu / Indian Express)
2. Constitutional, Statutory & Institutional Framework
3. Economic & Statistical Indicators
4. Arguments in Favor vs. Arguments Against (Mains GS Paper 2 / 3 alignment)
5. Prelims Trap Points (Key factual nuances candidates get wrong)
6. Way Forward & Model Answer Conclusion
Format each slide with '### SLIDE N: <Title>', '[IMAGE: <Topic description>]', formatted bullet points, and 'Narration:'.
`;
    }

    const imageDirective = includeImageInstructions
      ? ` === VISUAL SEARCH INSTRUCTIONS & LAYOUT MANDATES ===
1. NO AI IMAGES: Do NOT generate automatic images. Provide an explicit search prompt for the user instead. On every slide, output exactly this format on its own line:
   [IMAGE_URL: PASTE_DRIVE_LINK_HERE] (Visual Needed: <Detailed description of the exact photo, map, or graph to search for online>)
2. LAYOUT SEPARATION: The image is rendered strictly in its own right-hand media frame. It MUST NEVER overlap text.
3. STRICT TEXT LIMITS: Absolute maximum of 3 to 4 short bullet points per slide. The total text per slide MUST NEVER exceed 250 characters.
4. LARGE CONCEPTS & ECONOMICS: To teach a large concept, DO NOT cram text into one slide. Interlink 2 or 3 consecutive slides.
5. WATERMARK SAFE ZONE: Keep all titles and points clean and unhindered.`
      : '';

    return `You are a Senior Academic Producer, Distinguished UPSC Civil Services Faculty, and Doctoral Researcher generating an educational video script for the ARPITON Educational Video Engine.

=== METADATA & PARAMETERS ===
- Topic: ${activeTopicName}
- Academic Level: ${targetLevel}
- Pedagogical Sources: ${currentSubjectInfo.sources}
- Key Core Elements: ${currentSubjectInfo.coreElements}
- Target Language: ${currentLanguage}
- Number of Slides / Scenes: ${slideCount}
- Instructor / Producer: Satya Subham Biswal
- Presentation Engine: ARPITON Educational Platform (SatyaGyana Knowledge Suite)

=== PEDAGOGICAL TONE & CRAFT DIRECTIVES ===
- Depth: Treat the student as a serious scholar (UPSC CSE / PhD level). Avoid generic fluff, superficial summaries, or robotic clichés.
- Clarity: Break complex mechanisms into clear, intuitive insights with step-by-step logic.
- Empirical Rigor: Cite specific Articles of the Constitution, Supreme Court judgments, economic curves, or empirical formulas where applicable.
${imageDirective}
${scriptArchitecturePrompt}

Begin generating the complete, production-ready script below:`;
  }, [
    activeTopicName,
    targetLevel,
    currentSubjectInfo,
    currentLanguage,
    slideCount,
    formatStyle,
    includeImageInstructions,
  ]);

  // Copy Prompt to Clipboard
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedMasterPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch (e) {
      // fallback
    }
  };

  // Parse and validate pasted external script
  const handleValidateScript = () => {
    if (!pastedScript.trim()) {
      setValidationErrors(['Please paste a script to validate.']);
      setValidationScenes([]);
      return;
    }

    const errors: string[] = [];
    const scenes = parseArpitonScript(pastedScript);

    if (scenes.length === 0) {
      errors.push('No scenes detected. Ensure each slide starts with "### SLIDE <Number>: <Title>".');
    }

    // Check for images and narration
    let imageCount = 0;
    let missingNarrationCount = 0;
    scenes.forEach((s) => {
      if (s.commands.includes('IMAGE') || s.imageData) imageCount++;
      if (!s.narration || s.narration === s.contentLines.join('. ')) missingNarrationCount++;
    });

    if (imageCount === 0) {
      errors.push('Notice: No [IMAGE: topic] tags found. Add [IMAGE: topic] to display encyclopedic visuals.');
    }

    setValidationScenes(scenes);
    setValidationErrors(errors);
    setActivePreviewIndex(0);
  };

  // Purge temporary cache & ephemeral storage for free user protection
  const handlePurgeStorage = () => {
    const cleared = clearImageMemoryCache();
    setStorageCleanCount((prev) => prev + cleared + 1);
    setShowStorageNotice(true);
    if (onClearStorageNotify) onClearStorageNotify();
    setTimeout(() => setShowStorageNotice(false), 4000);
  };

  // Quick preset sample script for instant testing
  const handleLoadSamplePastedScript = () => {
    const sample = `### SLIDE 1: Supreme Court on State Borrowing (Article 293)
[HIGHLIGHT]
[IMAGE: Supreme Court of India]
• Article 293(3): States must obtain Centre's consent for borrowing if outstanding loans exist
• Fiscal Responsibility: Net Borrowing Ceiling (NBC) capped at 3% of GSDP under FRBM
• Kerala v. Union of India (2024): SC observed public finance requires collective discipline
• Off-Budget Borrowings: Centre mandated state PSUs' debts count towards state borrowing limit

Narration:
Welcome scholars. Today we examine the landmark jurisprudence of Article 293 of the Constitution. The Supreme Court in Kerala versus Union of India underscored that while federalism is a basic structure, fiscal management is an interdependent national priority. Let us unpack the legal and economic mechanics.

### SLIDE 2: Fiscal Federalism & Inter-Governmental Dispute
[HIGHLIGHT]
[IMAGE: Fiscal Federalism & State Borrowing Controls]
• Horizontal vs. Vertical Equity: Finance Commission devolution (Article 280) vs. Article 293 curbs
• Macroeconomic Stability: Over-borrowing by sub-national entities impacts sovereign credit rating
• Article 131 Original Jurisdiction: State's right to challenge federal fiscal directives in apex court
• Prelims Alert: Borrowing from outside India (Article 292/293) is exclusive to the Central Government

Narration:
Notice the constitutional balance on this slide. Under Article 293 clause 1, executive power of a State extends to borrowing only within the territory of India upon the security of the Consolidated Fund of the State. Foreign external loans remain strictly under the Union list.

### SLIDE 3: Mains Exam Synthesis & Way Forward
[HIGHLIGHT]
[IMAGE: Constitution of India & Legal Justice]
• Cooperative Federalism: Need for an independent Fiscal Council to assess state debt sustainability
• Capital Expenditure vs. Revenue Deficit: Distinguish productive asset creation from freebies
• Model Answer Conclusion: Harmonize state developmental autonomy with national macro-prudential stability

Narration:
In Mains GS Paper 2 and Paper 3, conclude by advocating for an institutionalized Fiscal Council. This bridges technical state fiscal autonomy with national debt discipline, preserving both federalism and economic resilience.`;

    setPastedScript(sample);
    const scenes = parseArpitonScript(sample);
    setValidationScenes(scenes);
    setValidationErrors([]);
    setActivePreviewIndex(0);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Master AI Prompt Studio */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                MODULE M13 • TRANSPARENT PROMPT STUDIO
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Zero Storage Mode Active
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-7 h-7 text-indigo-400" />
              AI Prompt Studio & External Bridge
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Generate bulletproof, transparent prompts to feed into ChatGPT, Gemini, or Claude. Includes full ARPITON shortcuts, non-overlapping image layout rules, and UPSC / PhD-level depth. Paste external AI output back here to validate and launch.
            </p>
          </div>

          {/* Storage Cleanup Action for Free Producer */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={handlePurgeStorage}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-xs font-semibold text-slate-200 transition shadow-sm"
              title="Purge ephemeral image cache, Blob URLs, and temporary session drafts (Free Producer Safe)"
            >
              <Trash2 className="w-4 h-4 text-amber-400" />
              <span>Purge Session Cache (0 MB Disk)</span>
            </button>
            {showStorageNotice && (
              <span className="text-[11px] font-mono text-emerald-400 animate-in fade-in">
                ✓ Ephemeral memory wiped clean!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls & Prompt Generator | Right Bridge & Validator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dynamic Subject & Prompt Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Subject & Target Level Selection */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                1. Select Academic Subject & Depth
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Dynamic Curriculum Engine
              </span>
            </div>

            {/* Subject Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'upsc-current-affairs', label: 'UPSC Current Affairs', icon: Globe2 },
                { id: 'polity', label: 'Polity & Constitution', icon: Scale },
                { id: 'economics', label: 'Economics & Finance', icon: TrendingUp },
                { id: 'scitech', label: 'Sci-Tech & ISRO', icon: Atom },
                { id: 'geography', label: 'Geography & Ecology', icon: Layers },
                { id: 'custom', label: 'Custom Subject', icon: BookOpen },
              ].map((subj) => {
                const Icon = subj.icon;
                const isSelected = selectedCategory === subj.id;
                return (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedCategory(subj.id as SubjectCategory)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{subj.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Topic Input if 'custom' selected */}
            {selectedCategory === 'custom' && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">
                  Enter Your Custom Subject / Topic:
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Semiconductor Fabrication, Quantum Entanglement, Black Holes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Topic Details Badge */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-indigo-300">Active Topic Anchor:</span>
                <span className="font-mono text-[10px] text-slate-400">Sources: {currentSubjectInfo.sources.split(',')[0]}</span>
              </div>
              <div className="font-bold text-white text-sm">
                {activeTopicName}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300">Pedagogical Core: </span>
                {currentSubjectInfo.coreElements}
              </p>
            </div>

            {/* Parameters: Academic Level, Script Style, Slide Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Level */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Academic Depth</label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value as TargetLevel)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="UPSC CSE (Prelims & Mains GS 1-4)">UPSC CSE (Prelims & Mains)</option>
                  <option value="PhD & Doctoral Research">PhD & Doctoral Research</option>
                  <option value="State PSC (OPSC OAS / UPPSC / BPSC)">State PSC (OAS/UPPSC)</option>
                  <option value="Postgraduate / University Level">Postgraduate / University</option>
                  <option value="Class 11-12 / Foundation">Class 11-12 / Foundation</option>
                </select>
              </div>

              {/* Format Style */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Output Architecture</label>
                <select
                  value={formatStyle}
                  onChange={(e) => setFormatStyle(e.target.value as ScriptFormatStyle)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="slides-masterclass">Slide Masterclass (### SLIDE)</option>
                  <option value="classroom-3d-dialogue">3D Virtual Classroom (4 Chars)</option>
                  <option value="newspaper-vision-ias-deepdive">UPSC Multi-Newspaper + Vision IAS</option>
                </select>
              </div>

              {/* Number of Slides */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Length / Slides</label>
                <select
                  value={slideCount}
                  onChange={(e) => setSlideCount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value={4}>4 Slides (~4 mins)</option>
                  <option value={6}>6 Slides (~7 mins)</option>
                  <option value={8}>8 Slides (~10 mins)</option>
                  <option value={12}>12 Slides (~15 mins Long-Form)</option>
                </select>
              </div>
            </div>

            {/* Toggle Image Placement Instructions */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sky-400" />
                <span className="text-xs text-slate-300 font-medium">
                  Include Non-Overlapping Realistic Image Mandates ([IMAGE: topic])
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeImageInstructions}
                onChange={(e) => setIncludeImageInstructions(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Card 2: Transparent Master Prompt Display & Copy */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Generated Master Prompt (Full Transparency)</h3>
              </div>

              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                <span>{copiedPrompt ? 'Copied to Clipboard!' : 'Copy Master Prompt'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Copy this exact prompt and paste it into ChatGPT, Gemini, or Claude. It ensures external AI models follow all ARPITON syntax, image instructions, and pedagogical rules without deviation.
            </p>

            {/* Master Prompt Code Box */}
            <div className="relative">
              <textarea
                readOnly
                value={generatedMasterPrompt}
                rows={10}
                className="w-full font-mono text-[11px] leading-relaxed p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick External Launch Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Direct External Bridges:</span>
              <a
                href="https://chatgpt.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition"
              >
                <span>Open ChatGPT</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition"
              >
                <span>Open Gemini</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition"
              >
                <span>Open Claude</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Paste & Test Validator (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 3: Paste External Script & Live Validator */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                2. Paste & Test External AI Script
              </h2>
              <button
                onClick={handleLoadSamplePastedScript}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Load Sample Output
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Paste the text returned by ChatGPT or Gemini below. The validator will check formatting, verify images, and let you test the presentation immediately.
            </p>

            <textarea
              value={pastedScript}
              onChange={(e) => setPastedScript(e.target.value)}
              placeholder="Paste ChatGPT or Gemini generated script here (with ### SLIDE 1... and [IMAGE: ...])..."
              rows={8}
              className="w-full font-mono text-[11px] p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />

            {/* Validation Trigger Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleValidateScript}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Validate & Parse Script</span>
              </button>
              {pastedScript && (
                <button
                  onClick={() => {
                    setPastedScript('');
                    setValidationScenes([]);
                    setValidationErrors([]);
                  }}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
                  title="Clear Pasted Script"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Validation Results Notification */}
            {validationErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Validation Notices</span>
                </div>
                {validationErrors.map((err, idx) => (
                  <p key={idx} className="text-[11px] text-amber-200/90 leading-relaxed">
                    • {err}
                  </p>
                ))}
              </div>
            )}

            {/* Parsed Scenes Interactive Preview */}
            {validationScenes.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Parsed Slide Preview ({activePreviewIndex + 1} of {validationScenes.length})
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActivePreviewIndex((prev) => Math.max(0, prev - 1))}
                      disabled={activePreviewIndex === 0}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setActivePreviewIndex((prev) => Math.min(validationScenes.length - 1, prev + 1))}
                      disabled={activePreviewIndex === validationScenes.length - 1}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* Mini Visual Stage of Active Slide */}
                {validationScenes[activePreviewIndex] && (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white truncate max-w-[200px]">
                        {validationScenes[activePreviewIndex].title}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[9px] font-bold">
                        SLIDE {validationScenes[activePreviewIndex].slideNumber}
                      </span>
                    </div>

                    {/* Image Thumbnail & Points Side-by-side */}
                    <div className="grid grid-cols-2 gap-2 py-1 items-stretch">
                      {/* Left: Points */}
                      <div className="space-y-1 overflow-hidden text-[10px] text-slate-300">
                        {validationScenes[activePreviewIndex].contentLines.slice(0, 3).map((p, i) => (
                          <div key={i} className="line-clamp-2 leading-tight">
                            • {p.replace(/^[•\-\*]\s*/, '')}
                          </div>
                        ))}
                      </div>

                      {/* Right: Resolved Image Preview */}
                      <div className="h-20 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center relative">
                        {validationScenes[activePreviewIndex].imageData ? (
                          <img
                            src={validationScenes[activePreviewIndex].imageData?.url}
                            alt="Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] text-slate-500 font-mono">No Image Tag</span>
                        )}
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[8px] font-mono text-slate-300">
                          HD
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-[10px] text-slate-300 italic line-clamp-2">
                      Narration: {validationScenes[activePreviewIndex].narration}
                    </div>
                  </div>
                )}

                {/* 1-Click Launch Buttons to Other Modules */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Launch in Production Engines:
                  </span>

                  <button
                    onClick={() => onSendToSlideStudio(pastedScript, validationScenes[0]?.title)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition"
                  >
                    <Presentation className="w-4 h-4" />
                    <span>Send to Slide & Voice Studio (Module M2)</span>
                  </button>

                  <button
                    onClick={() => onSendToClassroom(pastedScript, validationScenes[0]?.title)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
                  >
                    <Box className="w-4 h-4" />
                    <span>Send to 3D Virtual Classroom (Module M3)</span>
                  </button>

                  {onSendToCurrentAffairs && (
                    <button
                      onClick={onSendToCurrentAffairs}
                      className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                    >
                      <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open in Current Affairs Studio (Module M6)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
