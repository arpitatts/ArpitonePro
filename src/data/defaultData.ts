import { ProjectItem, WatermarkSettings, SupportedLanguage, VisualCommandType, ClassroomCharacterConfig, AppLogoSettings, FounderSettings } from '../types';

export const SUPPORTED_LANGUAGES: { name: SupportedLanguage; script: string; code: string }[] = [
  { name: 'English', script: 'English (Indian Accent)', code: 'en' },
  { name: 'Hindi', script: 'हिन्दी', code: 'hi' },
  { name: 'Odia', script: 'ଓଡ଼ିଆ', code: 'or' },
  { name: 'German (Deutsch)', script: 'Deutsch (German)', code: 'de' },
  { name: 'Bilingual (English + Hindi)', script: 'English + हिन्दी (Hinglish)', code: 'en-hi' },
  { name: 'Bilingual (English + Odia)', script: 'English + ଓଡ଼ିଆ', code: 'en-or' },
  { name: 'Bengali', script: 'বাংলা', code: 'bn' },
  { name: 'Assamese', script: 'অসমীয়া', code: 'as' },
  { name: 'Marathi', script: 'मराठी', code: 'mr' },
  { name: 'Gujarati', script: 'ગુજરાતી', code: 'gu' },
  { name: 'Punjabi', script: 'ਪੰਜਾਬੀ', code: 'pa' },
  { name: 'Tamil', script: 'தமிழ்', code: 'ta' },
  { name: 'Telugu', script: 'తెలుగు', code: 'te' },
  { name: 'Kannada', script: 'ಕನ್ನಡ', code: 'kn' },
  { name: 'Malayalam', script: 'മലയാളം', code: 'ml' },
  { name: 'Spanish', script: 'Español', code: 'es' },
  { name: 'French', script: 'Français', code: 'fr' },
  { name: 'Urdu', script: 'اردو', code: 'ur' },
];

export const CLASSROOM_CHARACTERS: Record<string, ClassroomCharacterConfig> = {
  satya: {
    id: 'satya',
    name: 'Satya',
    role: 'teacher',
    gender: 'boy',
    avatarColor: '#38bdf8',
    hairColor: '#1e293b',
    shirtColor: '#0284c7',
    skinColor: '#f6d8b8',
    voicePitch: 0.95,
    voiceRate: 0.95,
    voiceLabel: 'Satya (Teacher - Authoritative & Warm Indian Educator)',
    description: 'Teacher / Lead Educator with clear pedagogic inflection and classroom authority.',
  },
  arpita: {
    id: 'arpita',
    name: 'Arpita',
    role: 'student',
    gender: 'girl',
    avatarColor: '#f472b6',
    hairColor: '#3d2314',
    shirtColor: '#db2777',
    skinColor: '#fcd3b0',
    voicePitch: 1.25,
    voiceRate: 1.05,
    voiceLabel: 'Arpita (Girl Student - Sweet, Bright & Inquisitive)',
    description: 'Student Girl seated at Desk 1: Sweet, bright, highly inquisitive voice.',
  },
  lucky: {
    id: 'lucky',
    name: 'Lucky',
    role: 'student',
    gender: 'girl',
    avatarColor: '#34d399',
    hairColor: '#261b16',
    shirtColor: '#059669',
    skinColor: '#fbd5b5',
    voicePitch: 1.18,
    voiceRate: 0.98,
    voiceLabel: 'Lucky (Girl Student - Thoughtful, Sweet & Curious)',
    description: 'Student Girl seated at Desk 2: Thoughtful, polite, analytical perspective.',
  },
  chintu: {
    id: 'chintu',
    name: 'Chintu',
    role: 'student',
    gender: 'boy',
    avatarColor: '#fbbf24',
    hairColor: '#1e293b',
    shirtColor: '#d97706',
    skinColor: '#f7d3aa',
    voicePitch: 1.10,
    voiceRate: 1.02,
    voiceLabel: 'Chintu (Boy Student - Energetic, Quick & Enthusiastic)',
    description: 'Student Boy seated at Desk 3: Energetic, quick to ask practical questions.',
  },
};

export const DEFAULT_APP_LOGO_SETTINGS: AppLogoSettings = {
  logoUrl: '',
  title: 'ARPITON',
  subtitle: 'AI Educational Content Creation Studio',
  shape: 'squircle',
  useCustom: false,
};

export const DEFAULT_FOUNDER_SETTINGS: FounderSettings = {
  founderName: 'Satya Subham Biswal',
  founderRole: 'Founder & Lead Educational Systems Architect',
  dedicationName: 'Arpita Biswal',
  dedicationTagline: 'Dedicated to my wife, my love Arpita Biswal',
  dedicationNote:
    'ARPITON is born from deep love, lifelong devotion, and an unshakeable dream to give every child, student, and scholar on Earth free, beautiful, and world-class educational tools. To my beloved wife Arpita, you are the heartbeat behind every algorithm and every slide rendered here.',
  photoUrl: '',
  photoCaption: 'Satya Subham Biswal • Founder of ARPITON',
  photoSubject: 'satya',
  borderGlow: 'gold',
  missionPledge:
    'This platform is and will forever remain 100% free, empowering every student from Class 6 to Doctoral PhD research without commercial barriers.',
};

export const LOGO_PRESETS = [
  {
    id: 'default',
    name: 'Arpiton Cyan Crest (Default)',
    iconType: 'gradient-a',
    bg: 'from-indigo-600 via-indigo-500 to-sky-400',
    shape: 'squircle',
  },
  {
    id: 'satya-crest',
    name: 'SatyaGyana Golden Sun & Book',
    iconType: 'sun-book',
    bg: 'from-amber-600 via-orange-500 to-amber-300',
    shape: 'circle',
  },
  {
    id: 'gyan-chakra',
    name: 'Gyan Chakra Emerald Mandala',
    iconType: 'chakra',
    bg: 'from-emerald-600 via-teal-500 to-cyan-400',
    shape: 'circle',
  },
  {
    id: 'saraswati-lotus',
    name: 'Saraswati Lotus Academic Flame',
    iconType: 'lotus',
    bg: 'from-rose-600 via-pink-500 to-purple-400',
    shape: 'shield',
  },
  {
    id: 'tech-hexagon',
    name: 'Deep Tech Blue Shield',
    iconType: 'hexagon',
    bg: 'from-blue-700 via-indigo-600 to-sky-400',
    shape: 'rounded',
  },
];

export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  brandName: 'SatyaGyana',
  tagline: 'LEARN • GROW • SUCCEED',
  position: 'top-right',
  opacity: 0.92,
  scale: 1.0,
  showTagline: true,
  useCustomLogo: false,
  logoUrl: '/satya-gyana-logo.svg',
  displayMode: 'both',
  logoShape: 'circle',
  // Background Document Watermark behind text
  documentWatermarkUrl: '',
  documentWatermarkOpacity: 0.08,
  documentWatermarkScale: 0.85,
  documentWatermarkAngle: -22,
  documentWatermarkText: 'Satya Gyan • सत्य ज्ञान • ସତ୍ୟ ଜ୍ଞାନ',
  enableDocumentBackgroundWatermark: true,
};

export const SCRIPT_COMMAND_DEFINITIONS: {
  command: VisualCommandType;
  category: 'Structure' | 'Visual' | 'Science & Math' | 'Pedagogy' | 'Cinematics';
  description: string;
  example: string;
}[] = [
  { command: 'IMAGE', category: 'Visual', description: 'Inserts or synthesizes a contextually accurate educational illustration.', example: '[IMAGE] Electron microscope view of chloroplast' },
  { command: 'DIAGRAM', category: 'Visual', description: 'Creates a clean structural diagram or schematic.', example: '[DIAGRAM] Flow of electric current through a closed circuit' },
  { command: 'GRAPH', category: 'Science & Math', description: 'Renders a mathematical, economic, or statistical coordinate graph.', example: '[GRAPH] Axis X: Quantity, Axis Y: Price' },
  { command: 'EQUATION', category: 'Science & Math', description: 'Renders mathematical / scientific equations with proper superscript and subscripts.', example: '[EQUATION] E = mc^2' },
  { command: 'FORMULA', category: 'Science & Math', description: 'Displays an educational formula with highlighted variables and units.', example: '[FORMULA] MC = ΔTC / ΔQ' },
  { command: 'TABLE', category: 'Visual', description: 'Formats comparison data into a clean, readable table.', example: '[TABLE] Headers: Metric | Inflation 2025 | Inflation 2026' },
  { command: 'TIMELINE', category: 'Visual', description: 'Constructs chronological milestone visualization.', example: '[TIMELINE] 1857 -> 1920 -> 1942 -> 1947' },
  { command: 'MAP', category: 'Visual', description: 'Geographical distribution or territory schematic.', example: '[MAP] River basins of the Indian Peninsula' },
  { command: 'FLOW', category: 'Visual', description: 'Generates a logical flowchart with nodes and decision paths.', example: '[FLOW] Start -> Check Condition -> Execute -> End' },
  { command: 'PROCESS', category: 'Visual', description: 'Step-by-step sequential cycle or procedure.', example: '[PROCESS] Step 1: Ingestion -> Step 2: Digestion -> Step 3: Absorption' },
  { command: '3D', category: 'Cinematics', description: 'Requests 3D perspective visualization or links to 3D classroom scene.', example: '[3D] Rotating crystal lattice structure' },
  { command: 'EXPERIMENT', category: 'Science & Math', description: 'Renders a laboratory setup with apparatus, test tubes, or meters.', example: '[EXPERIMENT] Acid-base titration with phenolphthalein indicator' },
  { command: 'ECONOMICS', category: 'Science & Math', description: 'Invokes realistic economic curves: Supply, Demand, Equilibrium, Deadweight loss.', example: '[ECONOMICS] Supply-Demand Equilibrium E0 at P0=$40, Q0=200' },
  { command: 'MICRO', category: 'Science & Math', description: 'Microeconomic models (Indifference curve, Marginal cost, Consumer surplus).', example: '[MICRO] Budget constraint line tangent to indifference curve' },
  { command: 'MACRO', category: 'Science & Math', description: 'Macroeconomic models (IS-LM, Phillips Curve, AD-AS equilibrium).', example: '[MACRO] Shift in Aggregate Demand from AD1 to AD2' },
  { command: 'STATISTICS', category: 'Science & Math', description: 'Statistical plots (Normal bell curve, standard deviation, box plot).', example: '[STATISTICS] Gaussian distribution curve μ=50, σ=10' },
  { command: 'MATH', category: 'Science & Math', description: 'Mathematical functions, calculus slopes, and geometry coordinates.', example: '[MATH] Parabola y = x^2 - 4x + 3 with vertex at (2, -1)' },
  { command: 'PHYSICS', category: 'Science & Math', description: 'Force vectors, kinematics, circuit diagrams, and optic ray traces.', example: '[PHYSICS] Vector decomposition F = 50N at 30 degrees' },
  { command: 'CHEMISTRY', category: 'Science & Math', description: 'Balanced chemical equations, reaction mechanisms, and molecular geometry.', example: '[CHEMISTRY] 2H2 + O2 -> 2H2O with enthalpy ΔH = -285.8 kJ/mol' },
  { command: 'BIOLOGY', category: 'Science & Math', description: 'Cell biology, genetics, anatomical systems, and ecological pyramids.', example: '[BIOLOGY] Plant cell schematic with cell wall, vacuole, and chloroplasts' },
  { command: 'QUESTION', category: 'Pedagogy', description: 'Displays an interactive exam-style question card.', example: '[QUESTION] Which curve represents average variable cost?' },
  { command: 'ANSWER', category: 'Pedagogy', description: 'Reveals the step-by-step answer and conceptual explanation.', example: '[ANSWER] Option B. Explanation: AVC reaches minimum after MC intersects it.' },
  { command: 'EXAM', category: 'Pedagogy', description: 'Frames competitive exam insights (UPSC/OPSC/SSC/State PSC tips).', example: '[EXAM] High probability topic for GS-3 Paper: Monetary Policy Transmission' },
  { command: 'HIGHLIGHT', category: 'Pedagogy', description: 'Emphasizes a vital formula or definition with high-contrast frame.', example: '[HIGHLIGHT] Ceteris Paribus: All other influencing factors held constant' },
  { command: 'EXAMPLE', category: 'Pedagogy', description: 'Presents an intuitive practical example or case illustration.', example: '[EXAMPLE] If price of tickets doubles from $20 to $40...' },
  { command: 'REALWORLD', category: 'Pedagogy', description: 'Connects the theoretical formula to modern industry/government applications.', example: '[REALWORLD] How central banks calculate repo rate impact on home loan EMIs' },
  { command: 'SOURCE', category: 'Pedagogy', description: 'Displays authoritative source citations (PIB, RBI, NCERT, Nature).', example: '[SOURCE] NCERT Class 12 Macroeconomics, Chapter 3' },
  { command: 'PAUSE', category: 'Cinematics', description: 'Inserts a deliberate pedagogical reflection pause (1.5 - 3s) in narration.', example: '[PAUSE] 2s' },
  { command: 'ZOOM', category: 'Cinematics', description: 'Camera zoom instruction on specific formula or coordinate point.', example: '[ZOOM] Focus on intersection point E0' },
  { command: 'FOCUS', category: 'Cinematics', description: 'Draws a glowing focus ring on an axis or variable.', example: '[FOCUS] Price Axis Y' },
  { command: 'REVEAL', category: 'Cinematics', description: 'Progressively reveals bullet items or equations step-by-step.', example: '[REVEAL] Step 1 -> Step 2 -> Step 3' },
  { command: 'COMPARE', category: 'Visual', description: 'Side-by-side comparison matrix of two concepts.', example: '[COMPARE] Movement along curve vs. Shift of curve' },
  { command: 'RECAP', category: 'Pedagogy', description: 'Quick summary bullet capsule at conclusion.', example: '[RECAP] 3 Golden Rules of Demand Analysis' },
  { command: 'SUMMARY', category: 'Pedagogy', description: 'Final conceptual wrap-up card before outro.', example: '[SUMMARY] In our next masterclass: Elasticity of Demand' },
];

export const SAMPLE_ECONOMICS_SCRIPT = `### SLIDE 1: The Law of Demand & Market Equilibrium
[HIGHLIGHT]
ARPITON Educational Masterclass
Subject: Economics (Micro & Macro)
Target Audience: Class 11-12 & Competitive Exams (UPSC / OPSC / State PSC)
Key Concept: Price vs. Quantity Demanded

Narration:
Welcome students to this ARPITON masterclass. Today we examine one of the foundational building blocks of all economic theory: The Law of Demand, and how consumer behavior shapes equilibrium in competitive markets.

### SLIDE 2: Formal Formulation of Demand
[ECONOMICS]
[EQUATION]
Core Law:
Q_d = f(P)
ΔQ_d / ΔP < 0
Ceteris Paribus: All other determinants (consumer income, tastes, substitute prices) remain strictly unchanged.

Narration:
The Law of Demand states that, holding other factors constant, the quantity demanded of a good is inversely related to its price. When price rises, quantity demanded contracts. When price drops, quantity demanded expands.

### SLIDE 3: Realistic Demand & Supply Graph
[GRAPH]
[ECONOMICS]
Axis X: Quantity (Q in units)
Axis Y: Price (P in dollars)
Curve 1: Downward sloping Demand Curve (D)
Curve 2: Upward sloping Supply Curve (S)
Equilibrium: Point E0 at (P0 = $50, Q0 = 100 units)
Point A: High Price P1 = $75 -> Excess Supply (Surplus)
Point B: Low Price P2 = $25 -> Excess Demand (Shortage)

Narration:
Examine this programmatic graph closely. The vertical axis represents Price, and the horizontal axis represents Quantity. Where the downward-sloping demand curve intersects the upward-sloping supply curve, the market establishes equilibrium point E0 at price 50 dollars and quantity 100 units.

### SLIDE 4: Movement Along vs. Shift of Curve
[COMPARE]
[DIAGRAM]
Movement Along Curve:
• Triggered ONLY by a change in the commodity's own price
• Results in 'Expansion' or 'Contraction' of Quantity Demanded

Shift of the Entire Curve:
• Triggered by non-price factors (Consumer Income, Substitute Price, Tastes)
• Results in 'Increase' or 'Decrease' in Demand (D1 to D2)

Narration:
One of the most frequent examination mistakes is confusing a movement along the curve with a shift of the curve. Remember: a change in the product's own price causes a movement along the existing curve. Changes in consumer income or substitutes shift the entire curve.

### SLIDE 5: Real-World Policy Application
[REALWORLD]
[FORMULA]
Price Elasticity of Demand:
E_d = (% Change in Quantity Demanded) / (% Change in Price)
Case Study:
1. Inelastic Goods (|E_d| < 1): Life-saving pharmaceuticals, electricity, cooking gas.
2. Elastic Goods (|E_d| > 1): High-end electronics, luxury holiday travel.

Narration:
In government finance and tax policy, understanding price elasticity is vital. Governments impose excise duties on inelastic goods like fuels because consumer demand does not dramatically drop when taxes increase.

### SLIDE 6: Competitive Exam Question
[QUESTION]
[EXAM]
Question (UPSC CSE Prelims Standard):
"If the price of electric vehicles (EVs) decreases substantially due to battery innovation, what will happen to the demand curve for conventional petrol vehicles?"
A) Petrol vehicle demand curve shifts to the right
B) Petrol vehicle demand curve shifts to the left
C) Movement downwards along petrol vehicle demand curve
D) No change in petrol vehicle demand

[ANSWER]
Correct Answer: B (Shifts to the left)
Explanation: Electric vehicles and petrol vehicles are substitute goods. A drop in EV prices makes them more attractive, reducing demand for petrol cars at every price point.

Narration:
Let's test your conceptual grip with this competitive examination question. Because electric vehicles and petrol cars are substitutes, cheaper EVs induce consumers to switch away from petrol vehicles, shifting petrol car demand to the left.

### SLIDE 7: Master Summary & Revision Capsule
[RECAP]
[SUMMARY]
1. Law of Demand: Inverse price-quantity relationship under ceteris paribus.
2. Visual Curve: Downward sloping with negative gradient.
3. Own price = Movement; External determinants = Shift.
4. Equilibrium: Point where Quantity Demanded equals Quantity Supplied.

Narration:
To conclude today's session: remember the ceteris paribus assumption, verify whether a change is an own-price movement or an external shift, and calculate elasticity with care. Keep learning with Satya Gyan and ARPITON.`;

export const SAMPLE_PHYSICS_SCRIPT = `### SLIDE 1: Newton's Laws of Motion & Force Vectors
[HIGHLIGHT]
ARPITON Science & Engineering Engine
Subject: Physics / Mechanics
Target: Class 11-12 & JEE/NEET Aspirants
Key Principle: Vector Resolution of Applied Forces

Narration:
Welcome students to this rigorous exploration of Newtonian mechanics. Today we dissect the vector nature of forces, Newton's second law, and how to resolve forces in orthogonal Cartesian coordinates without error.

### SLIDE 2: Fundamental Formulation
[EQUATION]
[FORMULA]
Newton's Second Law:
F_net = m · a
Vector Form: Σ F_x = m · a_x   and   Σ F_y = m · a_y
Where:
• F is net unbalanced force (Newtons, N)
• m is inertial mass (kg)
• a is acceleration vector (m/s²)

Narration:
Newton's second law defines the dynamic relationship between force and acceleration. Force is a vector quantity, meaning we must evaluate magnitude and spatial direction simultaneously along both horizontal and vertical axes.

### SLIDE 3: Vector Decomposition on Cartesian Plane
[PHYSICS]
[GRAPH]
Origin: (0, 0) Mass m = 10 kg
Applied Force: F = 100 N at angle θ = 37° to horizontal
Horizontal Component: F_x = F · cos(37°) = 100 · 0.8 = 80 N
Vertical Component: F_y = F · sin(37°) = 100 · 0.6 = 60 N
Normal Reaction: N = m·g - F_y = (10 · 9.8) - 60 = 38 N

Narration:
Inspect this programmatic physics vector diagram. A 100 Newton force is applied at thirty-seven degrees. Notice how the horizontal component of eighty Newtons drives acceleration across the surface, while the vertical component of sixty Newtons reduces the normal contact force.

### SLIDE 4: Exam Trap & Free Body Diagram
[EXAM]
[QUESTION]
Question (JEE Main Standard):
"A block of mass 5 kg rests on a frictionless table. A string pulls it with tension T = 50 N directed 30° above the horizontal. What is the horizontal acceleration?"
A) 10.0 m/s²
B) 8.66 m/s²
C) 5.0 m/s²
D) 4.33 m/s²

[ANSWER]
Correct Answer: B (8.66 m/s²)
Working:
Horizontal accelerating force = T · cos(30°) = 50 · (√3 / 2) = 43.3 N
Acceleration a_x = F_x / m = 43.3 / 5 = 8.66 m/s²

Narration:
Look at the working steps. Only the horizontal vector component accelerates the block. The vertical component alters the normal force but does not contribute to horizontal motion on a flat table.

### SLIDE 5: Physics Master Recap
[RECAP]
[SUMMARY]
1. Always draw a complete Free Body Diagram (FBD).
2. Resolve inclined vectors into F·cos(θ) and F·sin(θ).
3. Apply Σ F_x = m·a_x along the direction of motion.
4. Verify units in SI standard (kg, meters, seconds, Newtons).

Narration:
Mastering vector resolution is the secret to solving ninety percent of competitive mechanics problems. Thank you for learning with Satya Gyan and ARPITON.`;

export const SAMPLE_3D_CLASSROOM_SCRIPT = `[CAM:WIDE]
Satya: "Good morning class! Welcome to our 3D interactive lecture. Today we will explore how market forces determine equilibrium price and quantity."

[CAM:ARPITA]
Arpita: "Sir, I have a doubt from yesterday's reading. Does an increase in consumer income always shift the demand curve to the right?"

[CAM:SATYA]
Satya: "Wonderful question, Arpita! It shifts right only for normal goods. For inferior goods, higher income actually reduces demand!"

[CAM:LUCKY]
Lucky: "Sir, what happens in the case of Giffen goods? Do they violate the fundamental Law of Demand?"

[CAM:BOARD]
Satya: "Spot on, Lucky! Look at the blackboard. In Giffen goods, the negative income effect outweighs the substitution effect, producing an upward-sloping demand curve!"

[CAM:CHINTU]
Chintu: "Sir, so if the price of bread skyrockets during a severe famine, poor families might buy even more bread because they can't afford meat?"

[CAM:SATYA]
Satya: "Exactly right, Chintu! That is the classic Victorian economic paradox discovered by Sir Robert Giffen. Outstanding reasoning, everyone!"`;

export const MULTILINGUAL_CLASSROOM_PRESETS: Record<string, { title: string; script: string; languageMode: string }> = {
  'only-eng': {
    title: 'English (Indian Accent) - Market Equilibrium & Elasticity',
    languageMode: 'only-eng',
    script: `[CAM:WIDE]
Satya: "Good morning Arpita, Lucky, and Chintu! Today we will examine how price elasticity impacts consumer welfare."

[CAM:ARPITA]
Arpita: "Sir, when petrol and diesel prices increase, why does demand barely drop in our cities?"

[CAM:SATYA]
Satya: "Brilliant observation, Arpita! Essential fuel has highly inelastic demand because immediate substitutes do not exist."

[CAM:LUCKY]
Lucky: "Sir, is that why governments impose excise duties on fuel and tobacco, since revenue remains stable?"

[CAM:BOARD]
Satya: "Exactly, Lucky! Observe the steep demand curve on our blackboard. Tax incidence falls heavily on consumers when demand is inelastic."

[CAM:CHINTU]
Chintu: "Sir! What if electric buses and metro networks expand rapidly? Will demand become elastic then?"

[CAM:SATYA]
Satya: "Superb insight, Chintu! With viable public transit alternatives, the price elasticity of petrol increases significantly!"`,
  },
  'only-odia': {
    title: 'Odia (ଓଡ଼ିଆ) - ଅର୍ଥନୀତି ଓ ଚାହିଦା ସୂତ୍ର (Economics & Law of Demand)',
    languageMode: 'only-odia',
    script: `[CAM:WIDE]
Satya: "ଶୁଭ ସକାଳ ପିଲାମାନେ! ଆଜି ଆମ ଶ୍ରେଣୀଗୃହରେ ଆମେ ଚାହିଦା ନିୟମ ଏବଂ ମୂଲ୍ୟ ସନ୍ତୁଳନ ବିଷୟରେ ଶିଖିବା।"

[CAM:ARPITA]
Arpita: "ସାର୍, ମୋର ଗୋଟିଏ ପ୍ରଶ୍ନ ଅଛି। ମୂଲ୍ୟ ବଢ଼ିଲେ ଚାହିଦା କାହିଁକି କମିଯାଏ?"

[CAM:SATYA]
Satya: "ବହୁତ ଭଲ ପ୍ରଶ୍ନ ଅର୍ପିତା! ଏହା ଚାହିଦା ସୂତ୍ରର ମୂଳ ନିୟମ। ଯେତେବେଳେ ଦର ବଢ଼େ, ଗ୍ରାହକ କମ୍ ପରିମାଣ କ୍ରୟ କରନ୍ତି।"

[CAM:LUCKY]
Lucky: "ସାର୍, ଗିଫେନ୍ ଦ୍ରବ୍ୟ କ୍ଷେତ୍ରରେ କ'ଣ ହୁଏ? ସେଠାରେ ନିୟମ କାମ କରେ କି?"

[CAM:BOARD]
Satya: "ଲକି, ବ୍ଲାକବୋର୍ଡକୁ ଦେଖ। ଗିଫେନ୍ ଦ୍ରବ୍ୟ ହେଉଛି ଚାହିଦା ସୂତ୍ରର ଏକ ବ୍ୟତିକ୍ରମ।"

[CAM:CHINTU]
Chintu: "ସାର୍, ଆମ ଓଡ଼ିଶାର ଚାଷୀମାନଙ୍କ ଉତ୍ପାଦନ ବଢ଼ିଲେ ବଜାର ମୂଲ୍ୟ ଉପରେ କି ପ୍ରଭାବ ପଡ଼ିବ?"

[CAM:SATYA]
Satya: "ଖୁବ୍ ସୁନ୍ଦର ଭାବନା ଚିଣ୍ଟୁ! ଯୋଗାଣ ବଢ଼ିଲେ ସାଧାରଣତଃ ଦର ସ୍ଥିର କିମ୍ବା ହ୍ରାସ ପାଏ, ଯାହା ଗ୍ରାହକଙ୍କ ପାଇଁ ଲାଭଦାୟକ!"`,
  },
  'only-hindi': {
    title: 'Hindi (हिन्दी) - मांग का नियम और बाज़ार संतुलन (Economics & Market Equilibrium)',
    languageMode: 'only-hindi',
    script: `[CAM:WIDE]
Satya: "सुप्रभात बच्चों! आज हमारी 3D कक्षा में हम अर्थशास्त्र के महत्वपूर्ण विषय—मांग का नियम और संतुलन मूल्य का अध्ययन करेंगे।"

[CAM:ARPITA]
Arpita: "सर, क्या उपभोक्ता की आय बढ़ने पर हमेशा हर वस्तु की मांग बढ़ती है?"

[CAM:SATYA]
Satya: "बहुत अच्छा सवाल, अर्पिता! सामान्य वस्तुओं की मांग बढ़ती है, लेकिन घटिया वस्तुओं की मांग आय बढ़ने पर घट जाती है।"

[CAM:LUCKY]
Lucky: "सर, अगर पेट्रोल के दाम बढ़ते हैं तो लोग गाड़ी चलाना बंद क्यों नहीं करते?"

[CAM:BOARD]
Satya: "शाबाश लकी! श्यामपट्ट पर देखें। अनिवार्य वस्तुओं की मांग बेलोचदार होती है, क्योंकि उनका कोई तुरंत विकल्प नहीं होता।"

[CAM:CHINTU]
Chintu: "सर! तो क्या सरकार टैक्स बढ़ाते समय मांग की लोच का ध्यान रखती है?"

[CAM:SATYA]
Satya: "बिल्कुल सही चिंटू! जब मांग बेलोचदार होती है, तो सरकार को राजस्व अधिक मिलता है। बहुत बढ़िया सोच!"`,
  },
  'bilingual-eng-hindi': {
    title: 'Bilingual (English + Hindi) - Hinglish Interactive Lecture',
    languageMode: 'bilingual-eng-hindi',
    script: `[CAM:WIDE]
Satya: "Good morning class! Aaj hum discuss karenge elasticity of demand aur market equilibrium."

[CAM:ARPITA]
Arpita: "Sir, when price rises, demand contract kyu hoti hai? Can you explain the real-world intuition?"

[CAM:SATYA]
Satya: "Great query, Arpita! Due to the substitution effect and income effect. Jab price badhta hai, consumers cheaper alternatives dhoondte hain."

[CAM:LUCKY]
Lucky: "Sir, what about necessities like medicines and salt? Waha pe demand inelastic rehti hai na?"

[CAM:BOARD]
Satya: "Absolutely correct, Lucky! Look at the blackboard. Necessities have steep inelastic curves because life-saving drugs ka koi substitute nahi hota."

[CAM:CHINTU]
Chintu: "Sir, agar petrol prices shoot up karein, toh electric vehicles ki demand automatically increase hogi na?"

[CAM:SATYA]
Satya: "Superb connection, Chintu! That is known as cross-price elasticity. When substitute cost rises, alternate demand shifts right!"`,
  },
  'bilingual-eng-odia': {
    title: 'Bilingual (English + Odia) - Concept Masterclass',
    languageMode: 'bilingual-eng-odia',
    script: `[CAM:WIDE]
Satya: "Good morning students! ଆଜି ଆମେ explore କରିବା Law of Demand and Market Elasticity."

[CAM:ARPITA]
Arpita: "Sir, consumer income increase ହେଲେ ସବୁ goods ର demand ବଢ଼ିବ କି?"

[CAM:SATYA]
Satya: "Very good question, Arpita! Normal goods ପାଇଁ ବଢ଼ିବ, କିନ୍ତୁ inferior goods କ୍ଷେତ୍ରରେ demand decline ହୁଏ।"

[CAM:LUCKY]
Lucky: "Sir, essential commodities କ୍ଷେତ୍ରରେ price elasticity inelastic ରହିବ ତ?"

[CAM:BOARD]
Satya: "Exactly, Lucky! Blackboard କୁ ଦେଖନ୍ତୁ। Essential goods ପାଇଁ curve steep ରହେ because immediate substitute ମିଳେନାହିଁ।"

[CAM:CHINTU]
Chintu: "Sir, ଯଦି market ରେ supply ବଢ଼ିଯାଏ, ତେବେ equilibrium price fall କରିବ କି?"

[CAM:SATYA]
Satya: "Outstanding reasoning, Chintu! Supply shift right ହେଲେ equilibrium price naturally decrease ହୁଏ!"`,
  },
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Microeconomics: Law of Demand & Supply Equilibrium',
    subject: 'Economics',
    topic: 'Supply, Demand, and Price Elasticity',
    level: 'Class 11–12',
    language: 'English',
    status: 'completed',
    updatedAt: '2026-09-21 16:30',
    script: SAMPLE_ECONOMICS_SCRIPT,
    sceneCount: 7,
    totalDurationSec: 145,
    aspectRatio: '16:9',
  },
  {
    id: 'proj-2',
    title: "Physics Mechanics: Newton's Laws & Force Vectors",
    subject: 'Physics',
    topic: 'Vector Decomposition and Free Body Diagrams',
    level: 'Competitive Exam (UPSC/State PSC)',
    language: 'English',
    status: 'completed',
    updatedAt: '2026-09-20 11:15',
    script: SAMPLE_PHYSICS_SCRIPT,
    sceneCount: 5,
    totalDurationSec: 110,
    aspectRatio: '16:9',
  },
  {
    id: 'proj-3',
    title: '3D Classroom: Why Do Prices Rise? (Inflation Dialogue)',
    subject: 'Economics / General Studies',
    topic: 'Inflation and Monetary Policy Classroom Simulation',
    level: 'Undergraduate',
    language: 'English',
    status: 'completed',
    updatedAt: '2026-09-19 14:00',
    script: SAMPLE_3D_CLASSROOM_SCRIPT,
    sceneCount: 6,
    totalDurationSec: 95,
    aspectRatio: '16:9',
  },
  {
    id: 'proj-4',
    title: 'Current Affairs: RBI Monetary Policy Committee & Repo Rate',
    subject: 'Current Affairs',
    topic: 'Monetary Stance, CPI Inflation, and Banking Regulation',
    level: 'Competitive Exam (UPSC/State PSC)',
    language: 'English',
    status: 'completed',
    updatedAt: '2026-09-22 08:30',
    script: SAMPLE_ECONOMICS_SCRIPT,
    sceneCount: 5,
    totalDurationSec: 120,
    aspectRatio: '16:9',
  },
];
