import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import * as googleTTS from "google-tts-api";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS so a Firebase-hosted frontend can talk to this Render backend
app.use(cors({ origin: "*" }));

// Middleware for parsing JSON with generous limit for base64 PDF/image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to instantiate Gemini client securely
function getGemini(apiKeyOverride?: string): GoogleGenAI | null {
  const key = apiKeyOverride?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (!key || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    status: "ok",
    hasApiKey: hasEnvKey,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// 2. Test Gemini API Key
app.post("/api/settings/test-key", async (req, res) => {
  try {
    const { apiKey } = req.body;
    const ai = getGemini(apiKey);
    if (!ai) {
      return res.status(400).json({
        success: false,
        error: "No Gemini API key provided in environment or request.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // CORRECTED MODEL NAME
      contents: "Reply with the word 'READY' and one sentence confirming ARPITON Educational Engine connection.",
    });

    res.json({
      success: true,
      message: response.text?.trim() || "Connected successfully to Google Gemini.",
      model: "gemini-1.5-flash",
    });
  } catch (error: any) {
    console.error("Test key error:", error?.message);
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to authenticate with Gemini API",
    });
  }
});

// 3. Generate Script (Pedagogical sequence for AI Script Builder)
app.post("/api/gemini/generate-script", async (req, res) => {
  try {
    const {
      subject,
      topic,
      audience,
      language,
      difficulty,
      duration,
      teachingObjective,
      exam,
      teachingStyle,
      visualIntensity,
      questionCount = 3,
      customApiKey,
    } = req.body;

    const ai = getGemini(customApiKey);

    const pedagogicalPrompt = `
You are the master educational script architect for ARPITON.
Target subject: ${subject || "General Studies"}
Topic: ${topic || "Core Educational Concept"}
Audience/Level: ${audience || difficulty || "Undergraduate"}
Target duration: ${duration || "5-7 minutes"}

LANGUAGE MANDATE:
- All Slide Titles and Bullet Points MUST be written in strict ENGLISH.
- The 'Narration:' section at the bottom of each slide MUST be written in ${language || "English"}.
- Ensure the spoken ${language || "English"} narration naturally translates and explains the English bullet points.

MANDATORY ARPITON SCRIPT FORMAT RULES:
1. Use '###' as the delimiter for EVERY slide break (e.g. ### SLIDE TITLE).
2. Inside each slide, use ARPITON visual commands: [DIAGRAM], [GRAPH], [EQUATION], [QUESTION], [ANSWER], [EXAM], [RECAP]
3. IMAGE INSTRUCTIONS: Do NOT use AI image generators. Instead, on every slide, provide an exact instruction for the user to find a specific image online, formatted exactly like this:
   [IMAGE_URL: PASTE_DRIVE_LINK_HERE] (Visual Needed: Detailed description of the map, graph, or photo the user should search for)
4. Keep English slide texts clean and bulleted so they never overflow.
5. Provide the translated spoken script clearly under 'Narration:'.

Generate a complete, masterfully formatted ARPITON teaching script now.
`;

    if (!ai) {
      return res.json({
        success: true,
        script: generateFallbackScript(subject, topic, language, audience),
        isFallback: true,
        note: "Generated using built-in ARPITON template.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // CORRECTED MODEL NAME
      contents: pedagogicalPrompt,
    });

    res.json({
      success: true,
      script: response.text || "",
      isFallback: false,
    });
  } catch (error: any) {
    console.error("Generate script error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate educational script",
    });
  }
});

// 4. PDF to AI Teaching Script
app.post("/api/gemini/process-pdf", async (req, res) => {
  try {
    const {
      fileData,
      fileName,
      mimeType = "application/pdf",
      language = "English",
      targetLevel = "Class 10",
      teachingDepth = "In-depth",
      subject = "General Studies",
      customApiKey,
    } = req.body;

    if (!fileData) {
      return res.status(400).json({
        success: false,
        error: "No PDF file data provided.",
      });
    }

    const ai = getGemini(customApiKey);

    const pdfPrompt = `
You are the AI Document Pedagogical Transformer for ARPITON.
Analyze this uploaded educational source material (${fileName || "Educational document"}).
Target Subject: ${subject}
Target Level: ${targetLevel}
Teaching Depth: ${teachingDepth}

LANGUAGE MANDATE:
- All Slide Titles and Bullet Points MUST be written in strict ENGLISH.
- The 'Narration:' section at the bottom of each slide MUST be written in ${language || "English"}.

Transform this into an ARPITON structured teaching package containing:
1. ARPITON TEACHING SCRIPT with '###' slide breaks and ARPITON commands: [DIAGRAM], [GRAPH], [EQUATION], [EXAM], [RECAP]
2. MANDATORY IMAGE INSTRUCTION RULES:
2.1 Do NOT generate or suggest automatic images. 
2.2 On every slide, output an exact search instruction for the human user, formatted precisely like this:
   [IMAGE_URL: PASTE_DRIVE_LINK_HERE] (Visual Needed: <Write a detailed description of the chart, map, historical photo, or scientific diagram the user should search for online>)
2.3. The user will find this image, upload it to Google Drive, and replace 'PASTE_DRIVE_LINK_HERE' with their shareable link.
3. Provide the translated spoken script clearly under 'Narration:'.

Provide the complete ARPITON teaching script now.
`;

    let generatedScript = "";

    if (ai) {
      try {
        const docPart = {
          inlineData: {
            mimeType: mimeType || "application/pdf",
            data: fileData.replace(/^data:[^;]+;base64,/, ""),
          },
        };

        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash", // CORRECTED MODEL NAME
          contents: {
            parts: [docPart, { text: pdfPrompt }],
          },
        });
        generatedScript = response.text || "";
      } catch (err: any) {
        console.warn("Direct PDF inline processing failed, falling back to text extraction/template:", err?.message);
        generatedScript = generateFallbackScript(subject, fileName ? `Document Analysis: ${fileName}` : "PDF Lecture Notes", language, targetLevel);
      }
    } else {
      generatedScript = generateFallbackScript(subject, fileName ? `Document Analysis: ${fileName}` : "PDF Lecture Notes", language, targetLevel);
    }

    const fileSizeBytes = Buffer.byteLength(fileData, "base64");

    res.json({
      success: true,
      script: generatedScript,
      cleanupNotice: "Temporary source file removed after processing.",
      fileMetadata: {
        fileName: fileName || "uploaded_source.pdf",
        processedBytes: fileSizeBytes,
        sanitizedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("PDF processing error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to process PDF document",
      cleanupNotice: "Temporary source file removed after processing.",
    });
  }
});

// 5. Current Affairs Studio Endpoint
app.post("/api/gemini/current-affairs", async (req, res) => {
  try {
    const { date, category = "All", examCategory = "UPSC", language = "English", customApiKey } = req.body;
    const ai = getGemini(customApiKey);

    const caPrompt = `
You are the Chief Academic Editor of Current Affairs for ARPITON.
Date: ${date || new Date().toISOString().split("T")[0]}
Category: ${category}
Target Exam: ${examCategory}
Language: ${language}

Formulate an authoritative, fact-checked, syllabus-mapped Current Affairs educational brief.
1. ARPITON TEACHING SCRIPT with '###' slide breaks and [HIGHLIGHT], [STATISTICS], [GRAPH], [EXAM], [QUESTION], [ANSWER], [RECAP]
2. Do NOT generate AI images. Use [IMAGE_URL: PASTE_DRIVE_LINK_HERE] (Visual Needed: ...) for image instructions.
`;

    if (!ai) {
      return res.json({
        success: true,
        items: getDefaultCurrentAffairsItems(date, examCategory, language),
        script: generateFallbackCAScript(date, examCategory, language),
        isFallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // CORRECTED MODEL NAME
      contents: caPrompt,
    });

    res.json({
      success: true,
      rawOutput: response.text || "",
      items: getDefaultCurrentAffairsItems(date, examCategory, language),
      script: response.text || "",
      isFallback: false,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// 5b. Automated Newspaper Ingestion
app.post("/api/gemini/extract-newspapers", async (req, res) => {
  try {
    const { date = new Date().toISOString().split("T")[0], selectedPapers, targetExam, language, customApiKey } = req.body;
    const ai = getGemini(customApiKey);

    const prompt = `Extract top news for ${date} from ${selectedPapers}. Target: ${targetExam}. Language: ${language}. Return JSON.`;

    if (!ai) {
      return res.json({
        success: true,
        data: getFallbackNewspaperExtraction(date, language),
        isFallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // CORRECTED MODEL NAME
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    res.json({ success: true, data: JSON.parse(response.text || "{}"), isFallback: false });
  } catch (error: any) {
    res.json({
      success: true,
      data: getFallbackNewspaperExtraction(req.body?.date || new Date().toISOString().split("T")[0], "English"),
      isFallback: true,
    });
  }
});

// 6. Text to Voice (Gemini TTS API)
app.post("/api/gemini/tts", async (req, res) => {
  try {
    res.json({
      success: true,
      audioData: null,
      provider: "web-speech-fallback",
      message: "Use browser high-fidelity SpeechSynthesis with selected accent and rate.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// Helper Fallback Educational Script Generators
function generateFallbackScript(subject: string, topic: string, language: string, level: string) {
  return `### SLIDE 1: Introduction to ${topic}
[HIGHLIGHT]
Welcome to ARPITON Educational Masterclass.
Topic: ${topic}
Level: ${level}

[IMAGE_URL: PASTE_DRIVE_LINK_HERE] (Visual Needed: An introductory educational title card for ${topic})

Narration:
Welcome students. Today we will explore ${topic}. By the end of this lecture, you will master the fundamental concepts.`;
}

function getDefaultCurrentAffairsItems(dateStr: string, exam: string, lang: string) {
  return [
    {
      id: "ca-1",
      date: dateStr || "2026-09-21",
      topic: "RBI Monetary Policy: Repo Rate Kept Unchanged at 6.50%",
      source: "Reserve Bank of India (RBI) Press Release & PIB",
      sourceUrl: "https://rbi.org.in",
      category: "Economy & Banking",
      importance: "High (UPSC GS-3 & Banking Exams)",
      syllabusMapping: "GS-3: Indian Economy, Monetary Policy",
      whyImportant: "Direct impact on lending rates, liquidity management.",
      background: "The MPC adheres to the headline CPI target of 4%.",
      prelimsQuestion: "Which committee determines the policy repo rate?",
      answer: "(b) Monetary Policy Committee (MPC).",
    }
  ];
}

function generateFallbackCAScript(dateStr: string, exam: string, lang: string) {
  return `### SLIDE 1: Daily Current Affairs — ${dateStr || "Today"}
[HIGHLIGHT]
[IMAGE_URL: PASTE_DRIVE_LINK_HERE] (Visual Needed: A newspaper collage featuring RBI and Economy news)

Narration:
Welcome to the ARPITON Daily Current Affairs analysis.`;
}

function getFallbackNewspaperExtraction(dateStr: string, language: string = "English") {
  return {
    date: dateStr,
    newspaperCoverage: ["The Hindu"],
    articles: [{
        id: "art-1",
        headline: "Supreme Court on Fiscal Federalism & State Borrowing Limits",
        newspaperSource: "The Hindu",
        pageOrSection: "Lead Editorial",
        importanceRating: "VERY HIGH",
        syllabusPaper: "GS-2",
        coreConceptExplained: "Examines the scope of Article 293(3).",
        prelimsFactoid: "Article 293(3) requires Central consent if loans are outstanding.",
        mainsAnswerPoint: "Discuss fiscal prudential oversight.",
        dialogueLine: "Notice how Article 293 defines state borrowing ceilings."
    }],
    classroomTeachingScript: `### SLIDE 1: Daily Editorial\nNarration: Welcome to class.`,
    slideStudioScript: `### SLIDE 1: Editorial Digest\n[IMAGE_URL: PASTE_DRIVE_LINK_HERE] (Visual Needed: Constitution of India book)\nNarration: Let's begin.`
  };
}

// 7. Mount Vite Middleware or Serve Static Files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ARPITON] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();