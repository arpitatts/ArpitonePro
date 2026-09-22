export interface GenerateScriptParams {
  subject: string;
  topic: string;
  audience: string;
  language: string;
  difficulty: string;
  duration: string;
  teachingObjective?: string;
  exam?: string;
  teachingStyle?: string;
  visualIntensity?: string;
  questionCount?: number;
  customApiKey?: string;
}

export interface ProcessPdfParams {
  fileData: string; // base64
  fileName: string;
  mimeType?: string;
  language: string;
  targetLevel: string;
  teachingDepth: string;
  subject: string;
  teachingStyle: string;
  desiredDuration: string;
  examOrientation: string;
  customApiKey?: string;
}

export async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err: any) {
    return { status: 'error', error: err?.message };
  }
}

export async function testGeminiApiKey(apiKey?: string) {
  const res = await fetch('/api/settings/test-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  });
  return await res.json();
}

export async function requestGenerateScript(params: GenerateScriptParams) {
  const res = await fetch('/api/gemini/generate-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate educational script');
  }
  return await res.json();
}

export async function requestProcessPdf(params: ProcessPdfParams) {
  const res = await fetch('/api/gemini/process-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to process educational PDF');
  }
  return await res.json();
}

export async function requestCurrentAffairs(params: {
  date: string;
  category?: string;
  examCategory?: string;
  language?: string;
  customApiKey?: string;
}) {
  const res = await fetch('/api/gemini/current-affairs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze current affairs');
  }
  return await res.json();
}

export async function requestNewspaperExtraction(params: {
  date: string;
  selectedPapers?: string[];
  targetExam?: string;
  language?: string;
  format?: string;
  customApiKey?: string;
}) {
  const res = await fetch('/api/gemini/extract-newspapers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to extract newspaper articles');
  }
  return await res.json();
}

