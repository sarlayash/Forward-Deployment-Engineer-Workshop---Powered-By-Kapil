import React, { useState, useEffect, useRef } from 'react';
import { DayCurriculum, LearnerProfile } from '../types/workshop';
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
  const [code, setCode] = useState<string>(
    learner.codeDrafts[day.id] || day.starterCode
  );

  const [leftTab, setLeftTab] = useState<'theory' | 'handsOn' | 'solution'>('handsOn');
  const [consoleTab, setConsoleTab] = useState<'tests' | 'topology' | 'logs'>('tests');

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<
    Array<{ testId: string; name: string; passed: boolean; message: string; durationMs: number }>
  >([]);
  const [hasRun, setHasRun] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="w-full flex flex-col h-[calc(100vh-65px)] bg-[#FBF8F3] text-[#24150D] overflow-hidden">
      {/* Top Day Subheader & Selector Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-[#F5EFEB] border-b border-[#E3D8C6] text-xs shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#7C3E1D] font-bold tracking-wider">
            DAY {day.id.toString().padStart(2, '0')}/15
          </span>
          <span className="text-[#C4B29A]">|</span>
          <span className="text-[#6E5644] hidden sm:inline">{day.category}</span>
          <span className="text-[#C4B29A]">|</span>
          <h1 className="text-sm font-bold text-[#24150D] truncate max-w-md">
            {day.title}
          </h1>
          {isCompleted && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2E5A27] bg-[#EAF2E8] border border-[#C5DEC0] px-2 py-0.5 rounded">
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
            className="p-1 rounded bg-[#FAF7F2] border border-[#D5C4AC] text-[#5C4535] hover:text-[#24150D] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[#6E5644] font-mono">
            {day.id} of {allDays.length}
          </span>
          <button
            disabled={day.id >= allDays.length}
            onClick={() => onSelectDay(day.id + 1)}
            className="p-1 rounded bg-[#FAF7F2] border border-[#D5C4AC] text-[#5C4535] hover:text-[#24150D] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Grid (42% Left Briefing & Theory, 58% Right IDE & Console) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: 10% Theory + 90% Hands-On Spec in Warm Cream */}
        <div className="lg:col-span-5 border-r border-[#E3D8C6] flex flex-col bg-[#FAF7F2] overflow-hidden">
          {/* Left Tabs */}
          <div className="flex items-center border-b border-[#E3D8C6] bg-[#F5EFEB] px-4 text-xs font-medium shrink-0">
            <button
              onClick={() => setLeftTab('handsOn')}
              className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                leftTab === 'handsOn'
                  ? 'border-[#7C3E1D] text-[#7C3E1D] bg-[#F2EAE0]'
                  : 'border-transparent text-[#6E5644] hover:text-[#24150D]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>90% Hands-On Mission</span>
            </button>
            <button
              onClick={() => setLeftTab('theory')}
              className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                leftTab === 'theory'
                  ? 'border-[#7C3E1D] text-[#7C3E1D] bg-[#F2EAE0]'
                  : 'border-transparent text-[#6E5644] hover:text-[#24150D]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>10% Theory & Strategy</span>
            </button>
            <button
              onClick={() => setLeftTab('solution')}
              className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                leftTab === 'solution'
                  ? 'border-[#7C3E1D] text-[#7C3E1D] bg-[#F2EAE0]'
                  : 'border-transparent text-[#6E5644] hover:text-[#24150D]'
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
                <div className="p-4 bg-[#FFFFFF] border border-[#D5C4AC] rounded-lg shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#8C4A23] uppercase tracking-wider">
                      Client Engagement Scenario
                    </span>
                    <span className="text-[#8C7360] font-mono text-[11px]">
                      {day.clientContext.industry}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#24150D]">
                    {day.clientContext.clientName}
                  </h3>
                  <p className="text-xs text-[#4A3528] leading-relaxed">
                    <strong className="text-[#24150D]">Stakes:</strong> {day.clientContext.stakes}
                  </p>
                  <p className="text-xs text-[#5C4535] leading-relaxed">
                    <strong className="text-[#3D291C]">Problem:</strong> {day.clientContext.problemSummary}
                  </p>
                </div>

                {/* Mission Objectives */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D291C] flex items-center gap-1.5">
                    <TerminalIcon className="w-3.5 h-3.5 text-[#7C3E1D]" />
                    Mission Briefing
                  </h4>
                  <p className="text-xs text-[#4A3528] leading-relaxed bg-[#FFFFFF] p-3 rounded-lg border border-[#E3D8C6]">
                    {day.handsOn90.missionBrief}
                  </p>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D291C]">
                    Engineering Objectives
                  </h4>
                  <div className="space-y-2">
                    {day.handsOn90.taskObjectives.map((task, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 bg-[#FFFFFF] rounded-lg border border-[#E3D8C6] text-xs text-[#4A3528]"
                      >
                        <span className="w-5 h-5 rounded bg-[#F2EAE0] text-[#7C3E1D] font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acceptance Criteria */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D291C]">
                    Acceptance Criteria
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#5C4535]">
                    {day.handsOn90.acceptanceCriteria.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5A27] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kapil's Field Notes */}
                <div className="p-3.5 bg-[#F5EAE0] border border-[#D5B89C] rounded-lg space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C3E1D]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kapil's Field Notes (Enterprise Wisdom)</span>
                  </div>
                  <p className="text-xs text-[#422B1E] leading-relaxed italic">
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
                    <span className="text-[11px] font-mono text-[#7C3E1D] uppercase tracking-widest block mb-1">
                      10% Core Foundation
                    </span>
                    <h3 className="text-lg font-bold text-[#24150D] tracking-tight">
                      {day.theory10.conceptTitle}
                    </h3>
                  </div>

                  <div className="p-4 bg-[#FFFFFF] border border-[#E3D8C6] rounded-lg">
                    <h4 className="text-xs font-bold text-[#3D291C] uppercase tracking-wider mb-2">
                      Underlying Mechanism
                    </h4>
                    <p className="text-xs text-[#4A3528] leading-relaxed">
                      {day.theory10.coreMechanism}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#3D291C] uppercase tracking-wider">
                      Architectural Trade-offs
                    </h4>
                    <div className="space-y-2">
                      {day.theory10.architecturalTradeoffs.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-[#FFFFFF] border border-[#E3D8C6] rounded-md text-xs text-[#4A3528] leading-relaxed"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#8C4A23] uppercase tracking-wider">
                      Enterprise Anti-Patterns to Avoid
                    </h4>
                    <div className="space-y-2">
                      {day.theory10.enterprisePitfalls.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-[#FBF0E1] border border-[#E3CAA8] rounded-md text-xs text-[#6B3A1A] leading-relaxed"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kapil's Rule */}
                  <div className="p-4 bg-gradient-to-r from-[#FAF2E8] to-[#F5E8D8] border border-[#D5B89C] rounded-lg">
                    <span className="text-[11px] font-mono font-bold text-[#7C3E1D] uppercase tracking-wider block mb-1">
                      Kapil's Inviolable Rule:
                    </span>
                    <p className="text-xs text-[#24150D] font-medium leading-relaxed">
                      "{day.theory10.kapilRule}"
                    </p>
                  </div>
                </div>
              </>
            )}

            {leftTab === 'solution' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#3D291C] uppercase tracking-wider">
                    Staff FDE Reference Solution
                  </h4>
                  <button
                    onClick={handleLoadSolution}
                    className="text-xs px-2.5 py-1 bg-[#7C3E1D] text-[#FAF6EE] hover:bg-[#663216] rounded transition-colors"
                  >
                    Load into Editor
                  </button>
                </div>
                <p className="text-xs text-[#6E5644]">
                  Inspect how a senior forward deployment engineer handles edge cases, error quarantine, and typed bounds.
                </p>
                <pre className="p-3 bg-[#1C140E] text-[#F3EDE2] rounded-lg border border-[#3D291C] text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  {day.solutionCode}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Espresso Brown Code Editor & Console */}
        <div className="lg:col-span-7 flex flex-col bg-[#1A120B] overflow-hidden">
          {/* Editor Header Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#261C14] border-b border-[#3D2C20] text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#FAF6EE] font-semibold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#E4C5A0]" />
                {day.fileName}
              </span>
              <span className="text-[#6E5644]">·</span>
              <span className="text-[#A89480] text-[11px] font-mono">
                {lineCount} lines
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetStarter}
                className="flex items-center gap-1 px-2.5 py-1 text-[#C4B29A] hover:text-[#FAF6EE] rounded border border-[#4D382B] hover:border-[#7C5A44] transition-colors"
                title="Reset to starter code"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                onClick={runTestSuite}
                disabled={isRunningTests}
                className={`flex items-center gap-1.5 px-4 py-1.5 font-bold rounded-md transition-all shadow-md ${
                  isRunningTests
                    ? 'bg-[#8F663C] opacity-60 cursor-not-allowed text-[#FAF6EE]'
                    : 'bg-[#D49E6A] hover:bg-[#BF8955] text-[#1A120B]'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningTests ? 'Executing Sandbox...' : 'Run Test Suite'}</span>
                <span className="hidden sm:inline text-[10px] font-mono opacity-80">(Ctrl+Enter)</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor Box */}
          <div className="flex-1 relative flex overflow-hidden bg-[#18100A]">
            {/* Line numbers gutter */}
            <div className="w-12 py-3 bg-[#140D08] text-right pr-3 select-none text-[11px] font-mono text-[#6E5644] border-r border-[#261C14] overflow-hidden">
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
              className="flex-1 p-3 bg-transparent font-mono text-xs text-[#FAF6EE] resize-none focus:outline-none leading-6 selection:bg-[#7C3E1D] selection:text-[#FAF6EE] overflow-auto whitespace-pre"
              placeholder="// Write your enterprise forward deployment solution here..."
            />
          </div>

          {/* Celebration Banner when all tests pass */}
          {showCelebration && (
            <div className="px-4 py-2.5 bg-gradient-to-r from-[#2C1F15] via-[#38261A] to-[#2C1F15] border-t border-b border-[#D49E6A]/50 flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 text-[#E4C5A0]">
                <CheckCircle2 className="w-4 h-4 text-[#D49E6A]" />
                <span className="font-semibold">
                  Day {day.id} Complete! +{day.xpReward} XP Earned.
                </span>
                <span className="text-[#C4B29A]">Promoted to client staging.</span>
              </div>
              {day.id < allDays.length && (
                <button
                  onClick={() => onSelectDay(day.id + 1)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#D49E6A] text-[#1A120B] font-bold rounded hover:bg-[#BF8955] transition-colors"
                >
                  <span>Proceed to Day {day.id + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Console / Output Tabs */}
          <div className="h-56 border-t border-[#3D2C20] flex flex-col bg-[#201710] shrink-0">
            <div className="flex items-center justify-between px-4 border-b border-[#3D2C20] bg-[#1A120B] text-xs shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setConsoleTab('tests')}
                  className={`py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                    consoleTab === 'tests'
                      ? 'border-[#D49E6A] text-[#E4C5A0] font-bold'
                      : 'border-transparent text-[#8F7A66] hover:text-[#FAF6EE]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Test Results</span>
                  {hasRun && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#38261B] text-[#E4C5A0]">
                      {testResults.filter((t) => t.passed).length}/{testResults.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setConsoleTab('topology')}
                  className={`py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                    consoleTab === 'topology'
                      ? 'border-[#D49E6A] text-[#E4C5A0] font-bold'
                      : 'border-transparent text-[#8F7A66] hover:text-[#FAF6EE]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Architecture Topology</span>
                </button>
                <button
                  onClick={() => setConsoleTab('logs')}
                  className={`py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                    consoleTab === 'logs'
                      ? 'border-[#D49E6A] text-[#E4C5A0] font-bold'
                      : 'border-transparent text-[#8F7A66] hover:text-[#FAF6EE]'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Client Terminal Logs</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-[#8F7A66]">
                SLA: 99.99% · Sandboxed Environment
              </div>
            </div>

            {/* Console Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
              {consoleTab === 'tests' && (
                <div className="space-y-2">
                  {!hasRun ? (
                    <div className="h-full flex flex-col items-center justify-center text-[#8F7A66] py-6 space-y-1">
                      <TerminalIcon className="w-6 h-6 text-[#6E5644] mb-1" />
                      <p>No tests executed yet.</p>
                      <p className="text-[11px] text-[#6E5644]">
                        Click "Run Test Suite" to simulate enterprise verification tests against your code.
                      </p>
                    </div>
                  ) : (
                    testResults.map((result) => (
                      <div
                        key={result.testId}
                        className={`p-2.5 rounded border flex items-start justify-between gap-3 ${
                          result.passed
                            ? 'bg-[#2A3B28]/40 border-[#4E7D48]/50 text-[#C7E6C2]'
                            : 'bg-[#4A221C]/40 border-[#8A3F33]/50 text-[#F5C2BC]'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {result.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#68B35F] shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-[#E66B59] shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-semibold text-[#FAF6EE]">
                              {result.name}
                            </div>
                            <div className="text-[11px] opacity-85 mt-0.5">
                              {result.message}
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-[#A89480] shrink-0 font-mono">
                          {result.durationMs}ms
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {consoleTab === 'topology' && (
                <div className="h-full flex items-center justify-around py-3 px-2 bg-[#1A120B] rounded border border-[#3D2C20]">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-[#2D1F16] border border-[#4D382B] flex items-center justify-center mx-auto mb-1 text-[#E4C5A0]">
                      <TerminalIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-[#C4B29A]">Client Source</span>
                  </div>

                  <div className="flex-1 max-w-[60px] h-[2px] bg-[#3D2C20] relative">
                    <div className={`h-full ${allTestsPass ? 'bg-[#D49E6A]' : 'bg-[#3D2C20]'}`} />
                  </div>

                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-1 transition-all ${
                        allTestsPass
                          ? 'bg-[#3D281A] border border-[#D49E6A] text-[#FAF6EE] shadow-lg shadow-[#D49E6A]/20'
                          : 'bg-[#2D1F16] border border-[#4D382B] text-[#8F7A66]'
                      }`}
                    >
                      <Code2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-[#FAF6EE] font-semibold">Your FDE Pipeline</span>
                  </div>

                  <div className="flex-1 max-w-[60px] h-[2px] bg-[#3D2C20] relative">
                    <div className={`h-full ${allTestsPass ? 'bg-[#D49E6A]' : 'bg-[#3D2C20]'}`} />
                  </div>

                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-1 ${
                        allTestsPass
                          ? 'bg-[#3D281A] border border-[#D49E6A] text-[#FAF6EE]'
                          : 'bg-[#2D1F16] border border-[#4D382B] text-[#8F7A66]'
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-[#C4B29A]">Ontology & SLA</span>
                  </div>
                </div>
              )}

              {consoleTab === 'logs' && (
                <div className="space-y-1 text-[#DDD0C0]">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="leading-5">
                      {log.startsWith('[FAIL]') ? (
                        <span className="text-[#E66B59]">{log}</span>
                      ) : log.startsWith('[PASS]') || log.startsWith('[SUCCESS]') ? (
                        <span className="text-[#68B35F]">{log}</span>
                      ) : log.startsWith('[CLIENT]') ? (
                        <span className="text-[#D49E6A]">{log}</span>
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
