import React, { useState, useEffect, useRef } from 'react';
import { DayCurriculum, LearnerProfile, TestCase } from '../types/workshop';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  FileText,
  Activity,
  Terminal as TerminalIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';

interface IDEWorkspaceProps {
  day: DayCurriculum;
  allDays: DayCurriculum[];
  learner: LearnerProfile;
  onSelectDay: (dayId: number) => void;
  onCompleteDay: (dayId: number, xp: number, code: string) => void;
}

export const IDEWorkspace: React.FC<IDEWorkspaceProps> = ({
  day,
  allDays,
  learner,
  onSelectDay,
  onCompleteDay,
}) => {
  // Current code editor content
  const [code, setCode] = useState<string>(
    learner.codeDrafts[day.id] || day.starterCode
  );

  // Tabs for left panel: 'theory' | 'handsOn' | 'solution'
  const [leftTab, setLeftTab] = useState<'theory' | 'handsOn' | 'solution'>('handsOn');

  // Tabs for bottom console: 'tests' | 'topology' | 'logs'
  const [consoleTab, setConsoleTab] = useState<'tests' | 'topology' | 'logs'>('tests');

  // Test execution state
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<
    Array<{ testId: string; name: string; passed: boolean; message: string; durationMs: number }>
  >([]);
  const [hasRun, setHasRun] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Reset or load saved draft on day change
  useEffect(() => {
    setCode(learner.codeDrafts[day.id] || day.starterCode);
    setHasRun(false);
    setTestResults([]);
    setShowCelebration(false);
    setTerminalLogs([
      `[INIT] Workspace initialized for Day ${day.id}: ${day.title}`,
      `[CLIENT] Target environment: ${day.clientContext.clientName}`,
      `[SLA] Target SLA requirement: <150ms latency / 0 data loss`,
      `[READY] Code loaded into ${day.fileName}. Press "Run Test Suite" to verify.`,
    ]);
  }, [day.id]);

  // Handle Tab key in code editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runTestSuite();
    }
  };

  // Run Test Suite simulation
  const runTestSuite = () => {
    setIsRunningTests(true);
    setConsoleTab('tests');

    const newLogs = [
      ...terminalLogs,
      `\n--- [TEST RUN START: ${new Date().toLocaleTimeString()}] ---`,
      `[COMPILING] Validating ${day.fileName} in isolated sandbox...`,
    ];

    setTimeout(() => {
      let allPassed = true;
      const results = day.testCases.map((test) => {
        const start = performance.now();
        const outcome = test.validator(code);
        const duration = Math.max(8, Math.round(performance.now() - start + Math.random() * 25));

        if (!outcome.passed) {
          allPassed = false;
          newLogs.push(`[FAIL] ${test.name}: ${outcome.message}`);
        } else {
          newLogs.push(`[PASS] ${test.name} (${duration}ms): ${outcome.message}`);
        }

        return {
          testId: test.id,
          name: test.name,
          passed: outcome.passed,
          message: outcome.message,
          durationMs: duration,
        };
      });

      if (allPassed) {
        newLogs.push(`[SUCCESS] All ${day.testCases.length} assertions passed! +${day.xpReward} XP awarded.`);
        newLogs.push(`[DEPLOY] Simulated deployment promoted to Stage: STAGING_VERIFIED.`);
        setShowCelebration(true);
        onCompleteDay(day.id, day.xpReward, code);
      } else {
        newLogs.push(`[ABORT] 1 or more assertions failed. Check error details below.`);
      }

      setTerminalLogs(newLogs);
      setTestResults(results);
      setIsRunningTests(false);
      setHasRun(true);
    }, 600);
  };

  const handleResetStarter = () => {
    if (window.confirm('Reset code back to original starter template?')) {
      setCode(day.starterCode);
    }
  };

  const handleLoadSolution = () => {
    if (window.confirm("Load Kapil's verified reference solution into the editor?")) {
      setCode(day.solutionCode);
    }
  };

  const isCompleted = learner.completedDays.includes(day.id);
  const lineCount = code.split('\n').length;
  const allTestsPass = hasRun && testResults.length > 0 && testResults.every((t) => t.passed);

  return (
    <div className="w-full flex flex-col h-[calc(100vh-65px)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Day Subheader & Selector Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-emerald-400 font-bold tracking-wider">
            DAY {day.id.toString().padStart(2, '0')}/15
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">{day.category}</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <h1 className="text-sm font-semibold text-white truncate max-w-md">
            {day.title}
          </h1>
          {isCompleted && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              <Check className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        {/* Day Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            disabled={day.id <= 1}
            onClick={() => onSelectDay(day.id - 1)}
            className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-400 font-mono">
            {day.id} of {allDays.length}
          </span>
          <button
            disabled={day.id >= allDays.length}
            onClick={() => onSelectDay(day.id + 1)}
            className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Grid (42% Left Briefing & Theory, 58% Right IDE & Console) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: 10% Theory + 90% Hands-On Spec */}
        <div className="lg:col-span-5 border-r border-slate-800 flex flex-col bg-slate-900/40 overflow-hidden">
          {/* Left Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/80 px-4 text-xs font-medium shrink-0">
            <button
              onClick={() => setLeftTab('handsOn')}
              className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                leftTab === 'handsOn'
                  ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>90% Hands-On Mission</span>
            </button>
            <button
              onClick={() => setLeftTab('theory')}
              className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                leftTab === 'theory'
                  ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>10% Theory & Strategy</span>
            </button>
            <button
              onClick={() => setLeftTab('solution')}
              className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                leftTab === 'solution'
                  ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Staff Reference</span>
            </button>
          </div>

          {/* Left Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
            {leftTab === 'handsOn' && (
              <>
                {/* Client Stakes Box */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-400 uppercase tracking-wider">
                      Client Engagement Scenario
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {day.clientContext.industry}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {day.clientContext.clientName}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-200">Stakes:</strong> {day.clientContext.stakes}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Problem:</strong> {day.clientContext.problemSummary}
                  </p>
                </div>

                {/* Mission Objectives */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                    Mission Briefing
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
                    {day.handsOn90.missionBrief}
                  </p>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Engineering Objectives
                  </h4>
                  <div className="space-y-2">
                    {day.handsOn90.taskObjectives.map((task, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/60 text-xs text-slate-300"
                      >
                        <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acceptance Criteria */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Acceptance Criteria
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {day.handsOn90.acceptanceCriteria.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kapil's Field Notes */}
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kapil's Field Notes (Enterprise Wisdom)</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed italic">
                    "{day.kapilFieldNotes}"
                  </p>
                </div>
              </>
            )}

            {leftTab === 'theory' && (
              <>
                {/* 10% High Leverage Theory */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                      10% Core Foundation
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {day.theory10.conceptTitle}
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Underlying Mechanism
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {day.theory10.coreMechanism}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Architectural Trade-offs
                    </h4>
                    <div className="space-y-2">
                      {day.theory10.architecturalTradeoffs.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-md text-xs text-slate-300 leading-relaxed"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Enterprise Anti-Patterns to Avoid
                    </h4>
                    <div className="space-y-2">
                      {day.theory10.enterprisePitfalls.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-amber-950/20 border border-amber-500/20 rounded-md text-xs text-amber-200/90 leading-relaxed"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kapil's Rule */}
                  <div className="p-4 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-lg">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Kapil's Inviolable Rule:
                    </span>
                    <p className="text-xs text-white font-medium leading-relaxed">
                      "{day.theory10.kapilRule}"
                    </p>
                  </div>
                </div>
              </>
            )}

            {leftTab === 'solution' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Staff FDE Reference Solution
                  </h4>
                  <button
                    onClick={handleLoadSolution}
                    className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded border border-emerald-500/40 transition-colors"
                  >
                    Load into Editor
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Inspect how a senior forward deployment engineer handles edge cases, error quarantine, and typed bounds.
                </p>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300/90 overflow-x-auto whitespace-pre leading-relaxed">
                  {day.solutionCode}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Code Editor & Multi-Tab Execution Deck */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor Header Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                {day.fileName}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500 text-[11px] font-mono">
                {lineCount} lines
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetStarter}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white rounded border border-slate-700/60 hover:border-slate-500 transition-colors"
                title="Reset to starter code"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                onClick={runTestSuite}
                disabled={isRunningTests}
                className={`flex items-center gap-1.5 px-4 py-1.5 font-semibold text-slate-950 rounded-md transition-all shadow-md ${
                  isRunningTests
                    ? 'bg-emerald-600 opacity-60 cursor-not-allowed'
                    : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningTests ? 'Executing Sandbox...' : 'Run Test Suite'}</span>
                <span className="hidden sm:inline text-[10px] font-mono opacity-80">(Ctrl+Enter)</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor Box */}
          <div className="flex-1 relative flex overflow-hidden bg-slate-950">
            {/* Line numbers gutter */}
            <div className="w-12 py-3 bg-slate-950/90 text-right pr-3 select-none text-[11px] font-mono text-slate-600 border-r border-slate-900 overflow-hidden">
              {Array.from({ length: Math.max(lineCount, 18) }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent font-mono text-xs text-slate-200 resize-none focus:outline-none leading-6 selection:bg-emerald-900/60 selection:text-white overflow-auto whitespace-pre"
              placeholder="// Write your enterprise forward deployment solution here..."
            />
          </div>

          {/* Celebration Banner when all tests pass */}
          {showCelebration && (
            <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-t border-b border-emerald-500/40 flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">
                  Day {day.id} Complete! +{day.xpReward} XP Earned.
                </span>
                <span className="text-slate-400">Promoted to client staging.</span>
              </div>
              {day.id < allDays.length && (
                <button
                  onClick={() => onSelectDay(day.id + 1)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-400 text-slate-950 font-bold rounded hover:bg-emerald-300 transition-colors"
                >
                  <span>Proceed to Day {day.id + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Console / Output Tabs */}
          <div className="h-56 border-t border-slate-800 flex flex-col bg-slate-900/80 shrink-0">
            <div className="flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/60 text-xs shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setConsoleTab('tests')}
                  className={`py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                    consoleTab === 'tests'
                      ? 'border-emerald-400 text-emerald-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Test Results</span>
                  {hasRun && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {testResults.filter((t) => t.passed).length}/{testResults.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setConsoleTab('topology')}
                  className={`py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                    consoleTab === 'topology'
                      ? 'border-emerald-400 text-emerald-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Architecture Topology</span>
                </button>
                <button
                  onClick={() => setConsoleTab('logs')}
                  className={`py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                    consoleTab === 'logs'
                      ? 'border-emerald-400 text-emerald-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Client Terminal Logs</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-500">
                SLA: 99.99% · Sandboxed Environment
              </div>
            </div>

            {/* Console Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
              {consoleTab === 'tests' && (
                <div className="space-y-2">
                  {!hasRun ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 py-6 space-y-1">
                      <TerminalIcon className="w-6 h-6 text-slate-600 mb-1" />
                      <p>No tests executed yet.</p>
                      <p className="text-[11px] text-slate-600">
                        Click "Run Test Suite" to simulate enterprise verification tests against your code.
                      </p>
                    </div>
                  ) : (
                    testResults.map((result) => (
                      <div
                        key={result.testId}
                        className={`p-2.5 rounded border flex items-start justify-between gap-3 ${
                          result.passed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {result.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-semibold text-white">
                              {result.name}
                            </div>
                            <div className="text-[11px] opacity-80 mt-0.5">
                              {result.message}
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {result.durationMs}ms
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {consoleTab === 'topology' && (
                <div className="h-full flex items-center justify-around py-3 px-2 bg-slate-950/60 rounded border border-slate-800">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-1 text-slate-300">
                      <TerminalIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-400">Client Source</span>
                  </div>

                  <div className="flex-1 max-w-[60px] h-[2px] bg-slate-700 relative">
                    <div className={`h-full ${allTestsPass ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  </div>

                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-1 transition-all ${
                        allTestsPass
                          ? 'bg-emerald-950 border border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}
                    >
                      <Code2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-300 font-semibold">Your FDE Pipeline</span>
                  </div>

                  <div className="flex-1 max-w-[60px] h-[2px] bg-slate-700 relative">
                    <div className={`h-full ${allTestsPass ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  </div>

                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-1 ${
                        allTestsPass
                          ? 'bg-emerald-950 border border-emerald-400 text-emerald-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-400">Ontology & SLA</span>
                  </div>
                </div>
              )}

              {consoleTab === 'logs' && (
                <div className="space-y-1 text-slate-300">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="leading-5">
                      {log.startsWith('[FAIL]') ? (
                        <span className="text-rose-400">{log}</span>
                      ) : log.startsWith('[PASS]') || log.startsWith('[SUCCESS]') ? (
                        <span className="text-emerald-400">{log}</span>
                      ) : log.startsWith('[CLIENT]') ? (
                        <span className="text-amber-400">{log}</span>
                      ) : (
                        <span>{log}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
