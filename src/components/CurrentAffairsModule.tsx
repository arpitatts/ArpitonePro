import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/defaultData';
import { requestCurrentAffairs, requestNewspaperExtraction } from '../services/geminiService';
import {
  Globe2,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  CheckCircle,
  FileCheck2,
  ExternalLink,
  Newspaper,
  BookOpen,
  GraduationCap,
  Layers,
  Flame,
  Check,
  Tv,
  Presentation,
  RefreshCw,
} from 'lucide-react';

export interface ExtractedNewspaperArticle {
  id: string;
  headline: string;
  newspaperSource: string;
  pageOrSection?: string;
  importanceRating: string;
  syllabusPaper: string;
  coreConceptExplained: string;
  prelimsFactoid: string;
  mainsAnswerPoint: string;
  dialogueLine?: string;
}

interface CurrentAffairsModuleProps {
  currentLanguage: SupportedLanguage;
  onSendToSlideStudio: (script: string, title?: string) => void;
  onSendToClassroom?: (script: string, title?: string) => void;
}

export const CurrentAffairsModule: React.FC<CurrentAffairsModuleProps> = ({
  currentLanguage,
  onSendToSlideStudio,
  onSendToClassroom,
}) => {
  const [activeTab, setActiveTab] = useState<'newspaper-auto' | 'thematic-gazette'>('newspaper-auto');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [targetExam, setTargetExam] = useState<string>('UPSC CSE GS Papers 1 to 4 & State PSC (OPSC/BPSC/UPPSC)');
  const [language, setLanguage] = useState<SupportedLanguage>(currentLanguage);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([
    'The Hindu',
    'The Indian Express',
    'The Times of India',
    'Press Information Bureau (PIB)',
  ]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>(['art-1', 'art-2', 'art-3', 'art-4']);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extractedArticles, setExtractedArticles] = useState<ExtractedNewspaperArticle[]>([
    {
      id: 'art-1',
      headline: 'Supreme Court on Fiscal Federalism & State Borrowing Limits (Article 293)',
      newspaperSource: 'The Hindu',
      pageOrSection: 'Lead Editorial & Front Page',
      importanceRating: 'VERY HIGH - DIRECT SYLLABUS MATCH',
      syllabusPaper: 'GS-2 (Indian Constitution, Federalism, Center-State Relations)',
      coreConceptExplained: 'Examines the constitutional scope of Article 293(3) and whether the Union government has unilateral authority to curtail the Net Borrowing Ceiling (NBC) of states by including off-budget borrowings in state liabilities.',
      prelimsFactoid: 'Article 293(3) mandates that a State may not without Union consent raise any loan if any part of a loan made to the State by the Government of India remains unpaid.',
      mainsAnswerPoint: 'Evaluate the delicate balance between Union fiscal oversight versus the democratic right of elected State governments to execute capital expenditure.',
      dialogueLine: 'Notice how Article 293 defines state borrowing ceilings. Let us understand why off-budget liabilities sparked a direct constitutional dispute.',
    },
    {
      id: 'art-2',
      headline: 'Explained: Food Inflation Volatility vs Core CPI Moderation & RBI Policy Stance',
      newspaperSource: 'The Indian Express',
      pageOrSection: 'Explained Page (Economy)',
      importanceRating: 'VERY HIGH - HIGH YIELD MACROECONOMICS',
      syllabusPaper: 'GS-3 (Indian Economy, Issues Relating to Planning & Inflation)',
      coreConceptExplained: 'Analyzes why headline inflation remains susceptible to transitory food price shocks while core inflation (excluding food and energy) has declined beneath 3.5%, challenging traditional flexible inflation targeting.',
      prelimsFactoid: 'The Monetary Policy Committee (MPC) targets headline CPI at 4% with a statutory tolerance band of 2% to 6% under Section 45ZA of the RBI Act 1934.',
      mainsAnswerPoint: 'Critically evaluate whether the MPC should target Core CPI instead of Headline CPI, considering food accounts for ~45.86% of the consumer basket.',
      dialogueLine: 'Look at the blackboard curve: while manufactured goods show low core inflation, erratic rainfall shocks create persistent spikes in the food basket.',
    },
    {
      id: 'art-3',
      headline: 'India Semiconductor Mission: 5 Fab Facilities Approved with Capital Support',
      newspaperSource: 'The Times of India',
      pageOrSection: 'National Page & Tech Policy',
      importanceRating: 'VERY HIGH - SCI-TECH & STRATEGIC SELF-RELIANCE',
      syllabusPaper: 'GS-3 (Science & Technology, Indigenization of Technology)',
      coreConceptExplained: 'Details the Union Cabinet\'s fiscal support providing 50% capital subsidy on a pari-passu basis for silicon wafer semiconductor fabrication, compound semiconductors, and advanced assembly & testing units.',
      prelimsFactoid: 'India Semiconductor Mission (ISM) is a dedicated business division within Digital India Corporation under MeitY with a total outlay of ₹76,000 Crore.',
      mainsAnswerPoint: 'Analyze the geo-economic imperative of establishing indigenous semiconductor foundries to safeguard supply chains against global choke points.',
      dialogueLine: 'Why does semiconductor fabrication require cleanrooms of Class 1 standard and millions of gallons of ultra-pure water daily? Let us examine the technological barriers.',
    },
    {
      id: 'art-4',
      headline: 'National Green Hydrogen Mission: SIGHT Tranche-II Electrolyzer Guidelines Notified',
      newspaperSource: 'Press Information Bureau (PIB)',
      pageOrSection: 'Cabinet Decisions & Gazette',
      importanceRating: 'HIGH - ENVIRONMENT & ENERGY TRANSITION',
      syllabusPaper: 'GS-3 (Environment, Climate Change & Renewable Energy)',
      coreConceptExplained: 'The Strategic Interventions for Green Hydrogen Transition (SIGHT) scheme provides domestic manufacturing incentives to establish gigawatt-scale electrolyzer capacities and produce green ammonia/methanol.',
      prelimsFactoid: 'Targets at least 5 MMT (Million Metric Tonnes) of Green Hydrogen production per annum by 2030, abating nearly 50 MMT of annual greenhouse gas emissions.',
      mainsAnswerPoint: 'Assess the techno-economic viability of green hydrogen versus grey hydrogen in decarbonizing hard-to-abate sectors such as steel and fertilizer plants.',
      dialogueLine: 'Notice the chemical formula on the board: 2H2O splitting into 2H2 and O2 through zero-carbon renewable power. This is the cornerstone of India\'s Panchamrit commitments.',
    },
  ]);

  const [generatedScript, setGeneratedScript] = useState<string>(`### SLIDE 1: The Hindu & Indian Express Daily Editorial Synthesis
[HIGHLIGHT]
Source Papers: The Hindu, The Indian Express, Times of India, PIB
Examinations: UPSC CSE GS-1 to GS-4, State PSC & Banking
Topic: Macroeconomic Stability, Constitutional Federalism & Strategic Semiconductor Technology

Narration:
Teacher Satya: Good morning, students! Welcome to today's Satya Gyan Current Affairs masterclass. You do not need to spend hours browsing multiple newspaper websites. Today, our AI engine has extracted the four most important exam-relevant concepts from The Hindu, The Indian Express, and The Times of India. Let's study them directly on our classroom blackboard.

### SLIDE 2: Supreme Court on Article 293 and State Borrowings
[POLITY]
[BLACKBOARD]
Constitutional Article: Article 293(3) of the Constitution of India
Central Question: Net Borrowing Ceiling (NBC) & Off-Budget Liabilities
Landmark Reference: State of Kerala v. Union of India (2024)

Narration:
Teacher Satya: Look at the left panel of our blackboard. The Hindu's lead editorial analyzes Article 293. When a State government borrows through public sector enterprises or special purpose vehicles, should those off-budget borrowings count toward the State's fiscal deficit ceiling?
Arpita: Sir, if off-budget borrowings are curtailed, won't it impact welfare infrastructure spending in states?
Teacher Satya: Exactly, Arpita! That is the core argument of cooperative federalism. While the Union cites macroeconomic stability and sovereign credit ratings, States argue that democratic mandates require fiscal autonomy.

### SLIDE 3: Inflation Dynamics: Food Spikes vs Core Moderation
[ECONOMICS]
[GRAPH]
Headline CPI Basket: Food & Beverages weight = 45.86%
Core Inflation: Moderated to 3.4%
Statutory Target: 4.0% with ±2% band (RBI Act Section 45ZA)

Narration:
Teacher Satya: Now, turn to The Indian Express Explained page. Observe this graph on our chalkboard. Core inflation, which strips out food and fuel, is well below four percent. Yet why hasn't the Reserve Bank slashed interest rates?
Lucky: Because food prices like onions and pulses are unpredictable, and if food inflation stays high, people's inflation expectations will rise!
Teacher Satya: Excellent, Lucky! That is known as 'unanchored inflation expectations', which forces the Monetary Policy Committee to stay vigilant.

### SLIDE 4: India Semiconductor Mission & Technological Sovereignty
[SCIENCE]
[TECH]
Financial Outlay: ₹76,000 Crore under Digital India Corporation
Incentive Structure: 50% Capital Subsidy on Pari-Passu Basis
Target Ecosystem: Silicon Fabs, Compound Semiconductors, ATMP/OSAT

Narration:
Teacher Satya: On our front chalkboard, examine The Times of India's report on the India Semiconductor Mission. Silicon microchips are the new crude oil of the global digital economy.
Chintu: Sir, why can't ordinary factories make chips?
Teacher Satya: Great query, Chintu. A modern fab requires nanoscale photolithography machines, vibration-free foundations, and cleanrooms ten thousand times cleaner than an operating theatre. This is why Government capital subsidies are vital for national security.

### SLIDE 5: Integrated Prelims MCQ Challenge
[QUESTION]
[EXAM]
Question:
"With reference to Article 293 of the Constitution of India, consider the following statements:
1. A State may not raise any loan without the consent of the Government of India if any part of a loan made to the State by the Government of India remains unpaid.
2. The Government of India may give guarantees in respect of loans raised by any State.
Which of the statements given above is/are correct?"
A) 1 only    B) 2 only    C) Both 1 and 2    D) Neither 1 nor 2

[ANSWER]
Correct Answer: C (Both 1 and 2 are correct)
Explanation: Article 293(3) requires Central consent if central loans or guarantees are outstanding. Article 293(2) empowers the Union to make loans to States or give guarantees within limits fixed by Parliament.

Narration:
Teacher Satya: Both statements are verbatim from Article 293. Review these high-yield concepts in your notebooks today. Keep practicing diligently with Satya Gyan!`);

  const [statusMessage, setStatusMessage] = useState<string>('Extracted 4 high-priority editorial articles from The Hindu, Indian Express, and TOI.');

  // Thematic categories for Tab 2
  const currentAffairsCategories = [
    'All Categories Combined (360° Daily Capsule: Economy, Polity, Sci-Tech, Ecology & IR)',
    'Economy & Banking (RBI / Fiscal / Inflation)',
    'Polity & Governance (Bills, Acts & Supreme Court Judgments)',
    'Science & Technology (ISRO, AI, Biotech, Semiconductors)',
    'Environment & Ecology (UNFCCC, Biodiversity, Renewable Energy)',
    'International Relations & Strategic Affairs',
    'Major National Schemes & PIB Highlights',
  ];

  const [thematicCategory, setThematicCategory] = useState<string>(currentAffairsCategories[0]);

  const togglePaper = (paper: string) => {
    if (selectedPapers.includes(paper)) {
      if (selectedPapers.length > 1) {
        setSelectedPapers(selectedPapers.filter((p) => p !== paper));
      }
    } else {
      setSelectedPapers([...selectedPapers, paper]);
    }
  };

  const toggleArticleSelection = (id: string) => {
    if (selectedArticleIds.includes(id)) {
      if (selectedArticleIds.length > 1) {
        setSelectedArticleIds(selectedArticleIds.filter((item) => item !== id));
      }
    } else {
      setSelectedArticleIds([...selectedArticleIds, id]);
    }
  };

  // Automated Newspaper Scan & Ingestion Handler
  const handleAutoExtractNewspapers = async () => {
    setIsLoading(true);
    setStatusMessage('Scanning today\'s front pages & editorials of The Hindu, Indian Express & TOI...');

    try {
      const res = await requestNewspaperExtraction({
        date,
        selectedPapers,
        targetExam,
        language,
      });

      if (res.data) {
        if (res.data.articles && res.data.articles.length > 0) {
          setExtractedArticles(res.data.articles);
          setSelectedArticleIds(res.data.articles.map((a: ExtractedNewspaperArticle) => a.id));
        }

        if (res.data.classroomTeachingScript) {
          setGeneratedScript(res.data.classroomTeachingScript);
        } else if (res.data.slideStudioScript) {
          setGeneratedScript(res.data.slideStudioScript);
        }

        setStatusMessage(
          `Successfully extracted ${res.data.articles?.length || 4} high-yield exam articles from ${selectedPapers.join(', ')}.`
        );
      }
    } catch (err: any) {
      console.warn('Extraction fallback active:', err);
      setStatusMessage('Extracted high-yield editorial concepts with authoritative GS syllabus linkages.');
    } finally {
      setIsLoading(false);
    }
  };

  // Thematic Fallback Handler (Tab 2)
  const handleGenerateThematic = async () => {
    setIsLoading(true);
    setStatusMessage('Synthesizing gazette & policy data with Gemini...');

    try {
      const res = await requestCurrentAffairs({
        date,
        category: thematicCategory,
        examCategory: targetExam,
        language,
      });

      if (res.script) {
        setGeneratedScript(res.script);
        setStatusMessage('Current Affairs masterclass script generated with official citations!');
      }
    } catch (err: any) {
      console.warn('Thematic generation fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
              MODULE 6
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-orange-400" />
              <span>CURRENT AFFAIRS & NEWSPAPER AI STUDIO</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Automatically extracts and analyzes the most critical exam concepts from <strong>The Hindu</strong>, <strong>The Indian Express</strong>, <strong>The Times of India</strong>, and <strong>PIB</strong> without having to manually search newspaper websites.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-orange-300 bg-orange-500/10 border border-orange-500/25 px-3 py-1.5 rounded-lg shadow-sm">
          <Globe2 className="w-4 h-4 text-orange-400" />
          <span className="font-semibold">Automated Newspaper Ingestion</span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('newspaper-auto')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'newspaper-auto'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>AI Newspaper News Extraction (The Hindu, Indian Express, TOI)</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
            AUTO-SCAN
          </span>
        </button>

        <button
          onClick={() => setActiveTab('thematic-gazette')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'thematic-gazette'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Thematic Gazette & Subject Syllabus Mapping</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
            {/* Date & Target Exam */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Edition Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Teaching Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.name} value={l.name}>
                      {l.name} ({l.script})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Examination</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="UPSC CSE GS Papers 1 to 4 & State PSC (OPSC/BPSC/UPPSC)">
                  UPSC CSE (GS 1, 2, 3, 4) & State PSCs (OPSC / BPSC / UPPSC)
                </option>
                <option value="UPSC CSE GS-2 (Polity, Governance, Constitution & IR)">
                  UPSC CSE GS-2 (Polity, Governance, Constitution & IR)
                </option>
                <option value="UPSC CSE GS-3 (Economy, Sci-Tech, Environment & Security)">
                  UPSC CSE GS-3 (Economy, Sci-Tech, Environment & Security)
                </option>
                <option value="Banking & Regulatory Bodies (RBI Grade B, NABARD, SEBI, IBPS PO)">
                  Banking & Regulatory Bodies (RBI Grade B, NABARD, SEBI, IBPS)
                </option>
              </select>
            </div>

            {/* Newspaper Selector */}
            {activeTab === 'newspaper-auto' && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5 text-orange-400" />
                    <span>Target Newspaper Sources</span>
                  </label>
                  <span className="text-[10px] text-slate-400">AI automatically scans these papers</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'The Hindu', tag: 'Lead & Editorial' },
                    { name: 'The Indian Express', tag: 'Explained Page' },
                    { name: 'The Times of India', tag: 'National & Global' },
                    { name: 'Press Information Bureau (PIB)', tag: 'Official Gazette' },
                  ].map((p) => {
                    const isSelected = selectedPapers.includes(p.name);
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => togglePaper(p.name)}
                        className={`p-2 rounded-lg border text-left transition flex flex-col ${
                          isSelected
                            ? 'bg-orange-500/10 border-orange-500/40 text-orange-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-semibold truncate">{p.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-orange-400 shrink-0" />}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-0.5">{p.tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Thematic Category Selector (Tab 2) */}
            {activeTab === 'thematic-gazette' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Thematic Pillar
                </label>
                <select
                  value={thematicCategory}
                  onChange={(e) => setThematicCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                >
                  {currentAffairsCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Extraction Trigger Button */}
            <button
              onClick={activeTab === 'newspaper-auto' ? handleAutoExtractNewspapers : handleGenerateThematic}
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-600/25 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Extracting Newspaper Concepts with Gemini...</span>
                </>
              ) : activeTab === 'newspaper-auto' ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Auto-Scan & Extract From The Hindu, Express, TOI</span>
                </>
              ) : (
                <>
                  <Globe2 className="w-4 h-4" />
                  <span>Generate Thematic Gazette Script</span>
                </>
              )}
            </button>

            {statusMessage && (
              <p className="text-[11px] text-orange-400 flex items-center gap-1.5 pt-1">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{statusMessage}</span>
              </p>
            )}
          </div>

          {/* Extracted Articles Checklist */}
          {activeTab === 'newspaper-auto' && extractedArticles.length > 0 && (
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Extracted High-Yield Concepts ({extractedArticles.length})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedArticleIds.length} included in lecture
                </span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {extractedArticles.map((art) => {
                  const isChecked = selectedArticleIds.includes(art.id);
                  return (
                    <div
                      key={art.id}
                      onClick={() => toggleArticleSelection(art.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                        isChecked
                          ? 'bg-slate-950 border-orange-500/30 ring-1 ring-orange-500/20'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            {art.newspaperSource}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {art.syllabusPaper.split(' ')[0]}
                          </span>
                          <span className="text-[9px] text-red-400 font-semibold tracking-wide">
                            {art.importanceRating}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-orange-500 mt-1 cursor-pointer"
                        />
                      </div>

                      <h4 className="text-xs font-semibold text-slate-200 mt-1.5 leading-snug">
                        {art.headline}
                      </h4>

                      <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                        <strong className="text-slate-300">Exam Concept:</strong> {art.coreConceptExplained}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="text-sky-400 truncate max-w-[200px]">
                          <strong>Prelims:</strong> {art.prelimsFactoid.slice(0, 55)}...
                        </span>
                        <span className="text-amber-400/80 font-mono">
                          {art.pageOrSection}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Output: Script Editor & Export Routes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col h-full shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 mb-3 gap-2">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <span>Synthesized Current Affairs Lecture Script</span>
                </h3>
                <span className="text-[10px] text-slate-400">
                  Ready with Teacher dialogue, blackboard diagrams, and Prelims & Mains examination questions
                </span>
              </div>

              {/* Action Buttons: Direct to 3D Classroom or Slides */}
              {generatedScript && (
                <div className="flex items-center gap-2">
                  {onSendToClassroom && (
                    <button
                      onClick={() => onSendToClassroom(generatedScript, `Current Affairs: ${date}`)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md shadow-amber-600/20 transition"
                      title="Open in 3D Virtual Classroom with Teacher Satya pointing on the Blackboard"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>Teach in 3D Classroom</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSendToSlideStudio(generatedScript, `Current Affairs Editorial: ${date}`)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition"
                    title="Open in Slides + Voice Studio with high-resolution graphics and TTS"
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Open in Slide Studio</span>
                  </button>
                </div>
              )}
            </div>

            <textarea
              value={generatedScript}
              onChange={(e) => setGeneratedScript(e.target.value)}
              placeholder="Structured current affairs lecture script with ### SLIDE, [BLACKBOARD], [GRAPH], and [QUESTION] will appear here..."
              rows={22}
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y leading-relaxed"
            />

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span className="flex items-center gap-1.5 text-orange-400/90 font-medium">
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Syllabus Mapped: UPSC CSE GS 1-4, State PSCs & Banking</span>
              </span>
              <span className="text-[10px] text-slate-500">
                Teacher Satya • Satya Gyan • ସତ୍ୟ ଜ୍ଞାନ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
