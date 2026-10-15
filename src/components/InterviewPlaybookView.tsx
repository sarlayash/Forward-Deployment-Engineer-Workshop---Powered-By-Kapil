import React, { useState } from 'react';
import {
  INTERVIEW_STAGES,
  INTERVIEW_QUESTIONS,
  SALARY_BENCHMARKS,
} from '../data/interviewPlaybook';
import { InterviewQuestion } from '../types/workshop';
import {
  Briefcase,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Building2,
  HelpCircle,
} from 'lucide-react';

export const InterviewPlaybookView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stages' | 'simulator' | 'comp' | 'stari'>('stages');
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion>(INTERVIEW_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const isRevealed = !!revealedAnswers[selectedQuestion.id];

  const handleToggleReveal = (qId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Briefcase className="w-4 h-4" />
          <span>FDE CAREER ACCELERATOR · POWERED BY KAPIL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Forward Deployment Interview Masterclass
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Tactical playbooks, live debugging strategies, compensation benchmarks, and executive de-escalation scripts for landing L5/L6 roles at Palantir, Databricks, and Scale AI.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'stages'
              ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          The 5 Interview Stages
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'simulator'
              ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Interactive Mock Interview Arena
        </button>
        <button
          onClick={() => setActiveTab('comp')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'comp'
              ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          FDE Compensation & Levels
        </button>
        <button
          onClick={() => setActiveTab('stari')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'stari'
              ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Kapil's STAR+I Framework
        </button>
      </div>

      {/* TAB 1: The 5 Stages */}
      {activeTab === 'stages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stage Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            {INTERVIEW_STAGES.map((stage, idx) => (
              <button
                key={stage.stageNumber}
                onClick={() => setSelectedStageIndex(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedStageIndex === idx
                    ? 'bg-slate-900 border-emerald-400 shadow-md text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1">
                  <span>STAGE 0{stage.stageNumber}</span>
                  <span className="text-slate-500">{stage.interviewerRole.split('(')[1]?.replace(')', '') || '45m'}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-200">
                  {stage.stageName}
                </h3>
              </button>
            ))}
          </div>

          {/* Selected Stage Detail Card */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {(() => {
              const current = INTERVIEW_STAGES[selectedStageIndex];
              return (
                <>
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                      Stage 0{current.stageNumber} Deep Dive
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {current.stageName}
                    </h2>
                    <span className="text-xs text-slate-400 mt-1 block font-mono">
                      Interviewer Profile: {current.interviewerRole}
                    </span>
                  </div>

                  {/* What they evaluate */}
                  <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Core Evaluation Criteria
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {current.whatTheyEvaluate}
                    </p>
                  </div>

                  {/* Insider secrets */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Insider Secrets from Hiring Committees
                    </span>
                    <div className="space-y-2">
                      {current.insiderSecrets.map((secret, i) => (
                        <div
                          key={i}
                          className="p-3 bg-amber-950/10 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 leading-relaxed"
                        >
                          {secret}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kapil's Strategy */}
                  <div className="p-4 bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-500/30 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Kapil's Winning Strategy
                    </span>
                    <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                      "{current.kapilStrategy}"
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Mock Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question List */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select Real Client Scenario:
            </span>
            {INTERVIEW_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuestion(q);
                  setUserAnswer('');
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedQuestion.id === q.id
                    ? 'bg-slate-900 border-emerald-400 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-emerald-400 font-bold">{q.company}</span>
                  <span className="text-slate-500">{q.difficulty}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-2">
                  {q.question}
                </h4>
              </button>
            ))}
          </div>

          {/* Interactive Arena */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <span>{selectedQuestion.company}</span>
                <span>·</span>
                <span>{selectedQuestion.round}</span>
                <span>·</span>
                <span>{selectedQuestion.difficulty}</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">
                {selectedQuestion.question}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                <strong className="text-slate-300">Context:</strong> {selectedQuestion.context}
              </p>
            </div>

            {/* User Input Sandbox */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Your Live Response (Practice here):</span>
                <span className="text-[11px] font-normal text-slate-500">
                  Structure with clear steps
                </span>
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Walk through your exact thought process, triage sequence, and client communication strategy..."
                className="w-full h-36 p-3.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 leading-relaxed font-mono"
              />
            </div>

            {/* Reveal Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleToggleReveal(selectedQuestion.id)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>
                  {isRevealed ? 'Hide Model Answer' : "Reveal Kapil's Model Answer & Rubric"}
                </span>
              </button>
            </div>

            {/* Revealed Model Answer */}
            {isRevealed && (
              <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in duration-200">
                {/* Scoring Rubric */}
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    What Interviewers Check in Your Answer:
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-400">
                    {selectedQuestion.rubric.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kapil's Model Response */}
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Kapil's Staff-Level Response:
                  </span>
                  <pre className="text-xs text-emerald-100 font-mono whitespace-pre-wrap leading-relaxed">
                    {selectedQuestion.kapilModelAnswer}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Compensation Benchmarks */}
      {activeTab === 'comp' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="text-sm font-bold text-white">
              Forward Deployment Engineer Compensation Anatomy
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FDEs command top-of-market compensation comparable to High-Frequency Trading (HFT) and Staff AI researchers because they directly unlock and expand multi-million dollar enterprise client contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SALARY_BENCHMARKS.map((level, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    {level.level}
                  </span>
                  <div>
                    <span className="text-2xl font-extrabold text-white font-mono block">
                      {level.totalComp}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Total Annual Compensation
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Salary:</span>
                      <span className="text-white font-mono font-medium">{level.baseSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Equity Grant:</span>
                      <span className="text-white font-mono font-medium">{level.equityAnnual}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">On-Site Travel:</span>
                      <span className="text-emerald-400 font-mono">{level.travelExpectation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <strong className="text-slate-300">Role Focus:</strong> {level.focus}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STAR+I Framework */}
      {activeTab === 'stari' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
              Behavioral Mastery
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              The Forward Deployed STAR+I Framework
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Standard SWE candidates use STAR. Forward Deployment Engineers must use STAR+I (Impact on Enterprise ARR & Retention).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 font-mono block">1. SITUATION</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Describe the high-stakes client crisis (e.g. 50,000 delayed shipments or a threat to terminate a $10M agreement).
              </p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 font-mono block">2. TASK</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Specify what you personally owned under tight time constraints (e.g. 48-hour deadline with zero customer downtime).
              </p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 font-mono block">3. ACTION</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Walk through the technical implementation and stakeholder management (e.g. deployed CDC stream with idempotency locks).
              </p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 font-mono block">4. RESULT</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provide concrete quantitative metrics (e.g. P99 latency dropped from 2.4s to 45ms, zero data loss across 10M rows).
              </p>
            </div>
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-lg space-y-1.5">
              <span className="text-xs font-bold text-amber-400 font-mono block">+ IMPACT (The Key)</span>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Connect directly to business value: "The client expanded their contract from $2M to $8M ARR, citing our engineering speed."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
