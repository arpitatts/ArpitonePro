import { ParsedScene, VisualCommandType, ScientificVisualData, ValidationIssue } from '../types';
import { resolveEducationalImage } from './imageResolver';

const COMMAND_REGEX = /\[(IMAGE|DIAGRAM|GRAPH|EQUATION|FORMULA|TABLE|TIMELINE|MAP|FLOW|PROCESS|3D|EXPERIMENT|ECONOMICS|MICRO|MACRO|STATISTICS|MATH|PHYSICS|CHEMISTRY|BIOLOGY|QUESTION|ANSWER|EXAM|HIGHLIGHT|EXAMPLE|REALWORLD|SOURCE|PAUSE|ZOOM|FOCUS|REVEAL|COMPARE|RECAP|SUMMARY)(:[^\]]+)?\]/gi;
const IMAGE_PROMPT_REGEX = /\[IMAGE:\s*([^\]]+)\]/i;
const IMAGE_URL_REGEX = /\[IMAGE_URL:\s*([^\]]+)\]/i;

export function parseArpitonScript(rawScript: string): ParsedScene[] {
  if (!rawScript || !rawScript.trim()) {
    return [];
  }

  // Split by '###'
  const rawSections = rawScript.split(/###/g);
  const scenes: ParsedScene[] = [];
  let slideCounter = 1;

  for (let idx = 0; idx < rawSections.length; idx++) {
    const section = rawSections[idx].trim();
    if (!section) continue;

    const lines = section.split('\n');
    let title = `Scene ${slideCounter}`;
    const firstLine = lines[0].trim();

    // Check if first line has title like "SLIDE 1: Introduction to Demand"
    if (firstLine.toLowerCase().startsWith('slide') || firstLine.includes(':')) {
      title = firstLine.replace(/^slide\s*\d+\s*:\s*/i, '').trim() || firstLine;
      lines.shift();
    } else if (firstLine.length > 0 && firstLine.length < 60 && !firstLine.startsWith('[')) {
      title = firstLine;
      lines.shift();
    }

    const commands: VisualCommandType[] = [];
    const contentLines: string[] = [];
    const narrationLines: string[] = [];
    let isNarrationSection = false;
    let extractedImagePrompt: string | undefined = undefined;
    let extractedImageUrl: string | undefined = undefined;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Check for specialized [IMAGE: topic] or [IMAGE_URL: url]
      const imgPromptMatch = line.match(IMAGE_PROMPT_REGEX);
      if (imgPromptMatch) {
        extractedImagePrompt = imgPromptMatch[1].trim();
        if (!commands.includes('IMAGE')) commands.push('IMAGE');
      }

      const imgUrlMatch = line.match(IMAGE_URL_REGEX);
      if (imgUrlMatch) {
        extractedImageUrl = imgUrlMatch[1].trim();
        if (!commands.includes('IMAGE')) commands.push('IMAGE');
      }

      // Extract bracket commands
      const matchedCommands = line.match(COMMAND_REGEX);
      if (matchedCommands) {
        matchedCommands.forEach((cmd) => {
          const baseCmd = cmd.replace(/[\[\]]/g, '').split(':')[0].trim().toUpperCase() as VisualCommandType;
          if (!commands.includes(baseCmd)) {
            commands.push(baseCmd);
          }
        });
      }

      // Check for narration header
      if (line.toLowerCase().startsWith('narration:')) {
        isNarrationSection = true;
        const textAfter = line.replace(/^narration:\s*/i, '').trim();
        if (textAfter) narrationLines.push(textAfter);
        continue;
      }

      if (isNarrationSection) {
        narrationLines.push(line);
      } else {
        // Strip out the bracket commands from slide presentation display
        const displayLine = line
          .replace(COMMAND_REGEX, '')
          .replace(IMAGE_PROMPT_REGEX, '')
          .replace(IMAGE_URL_REGEX, '')
          .trim();
        if (displayLine) {
          contentLines.push(displayLine);
        }
      }
    }

    // Default narration if empty
    const narration = narrationLines.length > 0
      ? narrationLines.join(' ')
      : contentLines.join('. ');

    // Estimate speaking duration: ~2.3 words/sec + 2 sec visual inspection minimum
    const wordCount = narration.split(/\s+/).filter(Boolean).length;
    const estimatedDurationSec = Math.max(5, Math.round(wordCount / 2.3) + 2);

    // Resolve image data if [IMAGE] command or image prompt was extracted
    let sceneImageData = undefined;
    if (commands.includes('IMAGE') || extractedImagePrompt || extractedImageUrl) {
      sceneImageData = resolveEducationalImage(extractedImagePrompt || title, extractedImageUrl);
    }

    // Analyze scientific visuals from extracted commands and text
    const visualData = extractScientificVisualData(title, commands, contentLines, section);

    if (sceneImageData) {
      visualData.category = 'image';
      visualData.imageData = sceneImageData;
    }

    // Extract highlight keywords (important words, math terms, acronyms)
    const highlightWords = extractHighlights(contentLines.join(' '));

    scenes.push({
      id: `scene-${slideCounter}`,
      slideNumber: slideCounter,
      title,
      commands,
      contentLines,
      narration,
      estimatedDurationSec,
      visualData,
      animationType: commands.includes('REVEAL') ? 'progressive-reveal' : commands.includes('GRAPH') ? 'graph-draw' : 'fade',
      watermarkEnabled: true,
      highlightWords,
      imageData: sceneImageData,
    });

    slideCounter++;
  }

  // Automatic Slide Intelligence: Split dense scenes that overflow
  return applySlideIntelligence(scenes);
}

function extractScientificVisualData(
  title: string,
  commands: VisualCommandType[],
  contentLines: string[],
  fullSectionText: string
): ScientificVisualData {
  const text = (title + ' ' + contentLines.join(' ') + ' ' + fullSectionText).toLowerCase();

  // 1. Economics
  if (commands.includes('ECONOMICS') || commands.includes('MICRO') || commands.includes('MACRO') || text.includes('demand') || text.includes('supply') || text.includes('inflation') || text.includes('elasticity')) {
    const isShift = text.includes('shift') || text.includes('d1 to d2') || text.includes('substitute');
    const isContraction = text.includes('contraction') || text.includes('expansion');

    return {
      category: 'economics',
      title: title || 'Economic Model: Supply & Demand Equilibrium',
      subtitle: isShift ? 'Demand Curve Rightward Shift (D1 → D2)' : 'Market Equilibrium (E0 = P0, Q0)',
      xAxisLabel: 'Quantity (Q)',
      yAxisLabel: 'Price (P)',
      curves: [
        { label: 'Demand (D1)', type: 'downward', color: '#38bdf8' },
        ...(isShift ? [{ label: 'Shifted Demand (D2)', type: 'downward-shifted', color: '#818cf8' }] : []),
        { label: 'Supply (S)', type: 'upward', color: '#34d399' },
      ],
      equilibriumPoint: {
        label: isShift ? 'E1' : 'E0',
        x: isShift ? 65 : 50,
        y: isShift ? 60 : 50,
        price: isShift ? '$60' : '$50',
        quantity: isShift ? '130 units' : '100 units',
      },
      shiftDirection: isShift ? 'right' : 'none',
      equations: [
        'Q_d = f(P), \\quad \\frac{\\Delta Q_d}{\\Delta P} < 0',
        'E_d = \\frac{\\% \\Delta Q}{\\% \\Delta P}',
      ],
      keyParameters: [
        { name: 'Equilibrium Price', value: '$50.00' },
        { name: 'Equilibrium Quantity', value: '100 units' },
        { name: 'Elasticity |Ed|', value: '1.24 (Elastic)' },
      ],
    };
  }

  // 2. Physics
  if (commands.includes('PHYSICS') || text.includes('force') || text.includes('vector') || text.includes('acceleration') || text.includes('velocity') || text.includes('newton')) {
    return {
      category: 'physics',
      title: title || 'Physics Mechanics: Vector Force Resolution',
      subtitle: 'Orthogonal Decomposition on Cartesian Frame',
      xAxisLabel: 'Horizontal Component F_x (N)',
      yAxisLabel: 'Vertical Component F_y (N)',
      equations: [
        'F_{net} = m \\cdot a',
        'F_x = F \\cos(\\theta) = 50 \\cdot \\cos(30^\\circ) = 43.3\\text{ N}',
        'F_y = F \\sin(\\theta) = 50 \\cdot \\sin(30^\\circ) = 25.0\\text{ N}',
      ],
      keyParameters: [
        { name: 'Applied Force |F|', value: '50.0 N' },
        { name: 'Angle θ', value: '30°' },
        { name: 'Mass m', value: '10 kg' },
        { name: 'Acceleration a', value: '4.33 m/s²' },
      ],
    };
  }

  // 3. Mathematics
  if (commands.includes('MATH') || commands.includes('EQUATION') || commands.includes('FORMULA') || text.includes('parabola') || text.includes('function') || text.includes('derivative') || text.includes('slope')) {
    return {
      category: 'math',
      title: title || 'Mathematical Function & Coordinate Plot',
      subtitle: 'Polynomial Curve f(x) with Tangent Slope',
      xAxisLabel: 'Variable x',
      yAxisLabel: 'Function f(x)',
      curves: [
        { label: 'f(x) = x² - 4x + 3', type: 'quadratic', color: '#a855f7' },
        { label: "Tangent f'(x) = 2x - 4", type: 'linear-tangent', color: '#f59e0b' },
      ],
      equations: [
        'f(x) = x^2 - 4x + 3',
        "f'(x) = 2x - 4 = 0 \\implies x_{vertex} = 2",
        '\\text{Roots: } x = 1, \\quad x = 3',
      ],
      keyParameters: [
        { name: 'Vertex Point', value: '(2, -1)' },
        { name: 'Y-Intercept', value: '(0, 3)' },
        { name: 'Discriminant Δ', value: '4 (Real roots)' },
      ],
    };
  }

  // 4. Chemistry
  if (commands.includes('CHEMISTRY') || commands.includes('EXPERIMENT') || text.includes('chemical') || text.includes('reaction') || text.includes('titration') || text.includes('molecule') || text.includes('acid')) {
    return {
      category: 'chemistry',
      title: title || 'Chemical Reaction & Stoichiometric Balance',
      subtitle: 'Exothermic Synthesis & Molecular Bonding',
      equations: [
        '2H_2(g) + O_2(g) \\longrightarrow 2H_2O(l) + \\Delta H',
        '\\Delta H^\\circ = -285.8\\text{ kJ/mol}',
      ],
      keyParameters: [
        { name: 'Reactants', value: 'Hydrogen (H₂) + Oxygen (O₂)' },
        { name: 'Product', value: 'Water (H₂O)' },
        { name: 'Reaction Type', value: 'Exothermic Redox' },
      ],
    };
  }

  // 5. Statistics
  if (commands.includes('STATISTICS') || text.includes('distribution') || text.includes('gaussian') || text.includes('standard deviation') || text.includes('bell curve')) {
    return {
      category: 'statistics',
      title: title || 'Gaussian Normal Distribution',
      subtitle: 'Empirical Rule (68% - 95% - 99.7%)',
      xAxisLabel: 'Standard Deviations (σ)',
      yAxisLabel: 'Probability Density f(x)',
      equations: [
        'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2}',
      ],
      keyParameters: [
        { name: 'Mean (μ)', value: '50.0' },
        { name: 'Std Dev (σ)', value: '10.0' },
        { name: 'Confidence Interval', value: '95% within [30, 70]' },
      ],
    };
  }

  // 6. Question / Exam Discussion
  if (commands.includes('QUESTION') || commands.includes('EXAM') || text.includes('question') || text.includes('option a') || text.includes('correct answer')) {
    const qLine = contentLines.find((l) => l.toLowerCase().includes('question') || l.endsWith('?')) || title;
    const options = contentLines.filter((l) => /^[A-D]\)/i.test(l.trim()));
    const ansLine = contentLines.find((l) => l.toLowerCase().includes('correct answer') || l.toLowerCase().includes('answer:'));

    return {
      category: 'question',
      title: 'Competitive Examination Discussion',
      subtitle: 'Target Exam: UPSC CSE / State PSC / Academic',
      questionData: {
        questionText: qLine.replace(/^question(\s*\(.*?\))?:\s*/i, ''),
        options: options.length > 0 ? options : ['A) Shift rightward', 'B) Shift leftward', 'C) Movement along curve', 'D) No effect'],
        correctIndex: 1,
        explanation: ansLine ? ansLine.replace(/^(correct\s*)?answer:\s*/i, '') : 'Substitute goods cause opposite demand adjustments.',
        examTag: 'UPSC Prelims Standard',
      },
    };
  }

  // 7. General Educational Timeline / Process
  if (commands.includes('TIMELINE') || commands.includes('PROCESS') || commands.includes('FLOW')) {
    return {
      category: 'timeline',
      title: title,
      subtitle: 'Chronological & Conceptual Progression',
      steps: [
        { title: 'Stage 1: Observation', desc: 'Identify empirical phenomenon' },
        { title: 'Stage 2: Hypothesis', desc: 'Formulate predictive model' },
        { title: 'Stage 3: Verification', desc: 'Test against observable real-world data' },
        { title: 'Stage 4: Conclusion', desc: 'Formal law synthesis' },
      ],
    };
  }

  // Default General Educational Visual
  return {
    category: 'general',
    title: title || 'Concept Visualization',
    subtitle: 'ARPITON Pedagogical Breakdown',
    keyParameters: [
      { name: 'Educational Level', value: 'Advanced / Competitive' },
      { name: 'Focus', value: 'Mastery & Retention' },
    ],
  };
}

function extractHighlights(text: string): string[] {
  const highlights: string[] = [];
  const words = text.match(/\b([A-Z][a-zA-Z]{3,}|[A-Z]{2,}|\"[^\"]+\"|\'[^\']+\')\b/g);
  if (words) {
    words.forEach((w) => {
      const clean = w.replace(/[\"\'\.\,\:]/g, '');
      if (clean.length > 3 && !['SLIDE', 'AND', 'THE', 'FOR', 'WITH', 'FROM', 'THAT'].includes(clean.toUpperCase())) {
        if (!highlights.includes(clean)) highlights.push(clean);
      }
    });
  }
  return highlights.slice(0, 5);
}

// Slide Intelligence: Split dense slides to prevent visual text overflow
function applySlideIntelligence(scenes: ParsedScene[]): ParsedScene[] {
  const result: ParsedScene[] = [];
  let currentSlideNum = 1;

  for (const scene of scenes) {
    const totalChars = scene.contentLines.join(' ').length;
    const lineCount = scene.contentLines.length;

    // If slide is too crowded (> 4 lines or > 280 characters), automatically split into Part 1 and Part 2
    if ((lineCount > 4 || totalChars > 280) && !scene.commands.includes('QUESTION')) {
      const midpoint = Math.ceil(scene.contentLines.length / 2);
      const part1Lines = scene.contentLines.slice(0, midpoint);
      const part2Lines = scene.contentLines.slice(midpoint);

      result.push({
        ...scene,
        id: `scene-${currentSlideNum}`,
        slideNumber: currentSlideNum++,
        title: `${scene.title} (Part 1)`,
        contentLines: part1Lines,
        notes: 'Automatically optimized by ARPITON Slide Intelligence to prevent text overflow.',
      });

      result.push({
        ...scene,
        id: `scene-${currentSlideNum}`,
        slideNumber: currentSlideNum++,
        title: `${scene.title} (Part 2)`,
        contentLines: part2Lines,
        notes: 'Continued conceptual continuity. Interlinked diagram retained.',
      });
    } else {
      result.push({
        ...scene,
        id: `scene-${currentSlideNum}`,
        slideNumber: currentSlideNum++,
      });
    }
  }

  return result;
}

// Visual Validator Engine
export function validateScriptScenes(scenes: ParsedScene[]): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  scenes.forEach((scene) => {
    // 1. Text Overflow check
    const totalChars = scene.contentLines.join(' ').length;
    if (totalChars > 280) {
      issues.push({
        type: 'warning',
        sceneId: scene.id,
        slideNumber: scene.slideNumber,
        message: `High text density (${totalChars} characters). Strict maximum is 280 characters to ensure perfect visibility without overflow.`,
        field: 'text-overflow',
        autoFixable: true,
      });
    }

    // 2. Empty scene check
    if (scene.contentLines.length === 0 && !scene.visualData.questionData) {
      issues.push({
        type: 'error',
        sceneId: scene.id,
        slideNumber: scene.slideNumber,
        message: 'Empty slide content detected.',
        field: 'text-overflow',
        autoFixable: true,
      });
    }

    // 3. Narration presence check
    if (!scene.narration || scene.narration.trim().length < 10) {
      issues.push({
        type: 'error',
        sceneId: scene.id,
        slideNumber: scene.slideNumber,
        message: 'Missing narration audio text for synchronization.',
        field: 'narration',
        autoFixable: true,
      });
    }

    // 4. Axis labels for graphs
    if (scene.commands.includes('GRAPH') || scene.commands.includes('ECONOMICS')) {
      if (!scene.visualData.xAxisLabel || !scene.visualData.yAxisLabel) {
        issues.push({
          type: 'warning',
          sceneId: scene.id,
          slideNumber: scene.slideNumber,
          message: 'Graph is missing explicit X and Y axis labels.',
          field: 'axes',
          autoFixable: true,
        });
      }
    }
  });

  return {
    isValid: issues.filter((i) => i.type === 'error').length === 0,
    issues,
  };
}
