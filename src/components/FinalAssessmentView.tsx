import React, { useState, useEffect, useRef } from 'react';
import { FINAL_ASSESSMENT_QUESTIONS } from '../data/finalAssessmentQuestions';
import { LearnerProfile } from '../types/workshop';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  GraduationCap,
  Sparkles,
  ShieldAlert,
  Search,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';

interface FinalAssessmentViewProps {
  learner: LearnerProfile;
  onPassFinalAssessment: (score: number, attempts: number) => void;
  onFailFinalAssessment: (score: number, attempts: number) => void;
  onGoToCertificate: () => void;
}

const TOTAL_TIME_SECONDS = 120 * 60; // 120 minutes = 7200 seconds

export const FinalAssessmentView: React.FC<FinalAssessmentViewProps> = ({
  learner,
  onPassFinalAssessment,
  onFailFinalAssessment,
  onGoToCertificate,
}) => {
  const existingAttempts = learner.finalAssessmentAttempts || 0;
  const existingScore = learner.finalAssessmentScore || 0;
  const isAlreadyPassed = learner.finalAssessmentPassed || false;

  // Assessment active states
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(isAlreadyPassed);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_TIME_SECONDS);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Question navigation and responses
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    learner.finalAssessmentAnswers || {}
  );
  const [flaggedIndices, setFlaggedIndices] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'answered' | 'unanswered' | 'flagged'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect'>('all');

  // Attempt & Score
  const [attemptCount, setAttemptCount] = useState<number>(existingAttempts);
  const [finalScore, setFinalScore] = useState<number>(existingScore);

  // Timer Effect
  useEffect(() => {
    if (!isTestStarted || isSubmitted || isPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isSubmitted, isPaused]);

  // Format timer into HH:MM:SS or MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    if (attemptCount >= 2 && !isAlreadyPassed) {
      alert('You have exhausted all allowed attempts (2 of 2).');
      return;
    }
    setSecondsRemaining(TOTAL_TIME_SECONDS);
    setSelectedAnswers({});
    setFlaggedIndices([]);
    setCurrentIndex(0);
    setIsTestStarted(true);
    setIsSubmitted(false);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIdx,
    }));
  };

  const toggleFlag = (idx: number) => {
    setFlaggedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = FINAL_ASSESSMENT_QUESTIONS.length - answeredCount;

  const handleSubmitAssessment = (isAutoSubmit: boolean = false) => {
    if (!isAutoSubmit && unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered questions out of 300. Are you sure you want to finalize your submission?`
      );
      if (!confirmSubmit) return;
    }

    let correctCount = 0;
    FINAL_ASSESSMENT_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / FINAL_ASSESSMENT_QUESTIONS.length) * 100);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setFinalScore(scorePercent);
    setIsSubmitted(true);
    setIsTestStarted(false);

    if (scorePercent >= 90) {
      onPassFinalAssessment(scorePercent, newAttemptCount);
    } else {
      onFailFinalAssessment(scorePercent, newAttemptCount);
    }
  };

  const currentQ = FINAL_ASSESSMENT_QUESTIONS[currentIndex];
  const isPassed = finalScore >= 90 || isAlreadyPassed;
  const canReattempt = attemptCount < 2 && !isPassed;

  // Filtered Question list for palette
  const filteredIndices = FINAL_ASSESSMENT_QUESTIONS.map((_, idx) => idx).filter((idx) => {
    if (activeFilter === 'answered') return selectedAnswers[idx] !== undefined;
    if (activeFilter === 'unanswered') return selectedAnswers[idx] === undefined;
    if (activeFilter === 'flagged') return flaggedIndices.includes(idx);
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#24150D]">
      {/* Top Banner / Assessment Overview */}
      <div className="bg-[#FAF7F2] border-2 border-[#8C4A23] rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#7C3E1D] bg-[#F5EDE0] px-3 py-1 rounded-full border border-[#D5A872]">
                FINAL COMPREHENSIVE CERTIFICATION EXAM
              </span>
              <span className="text-xs font-mono font-bold text-[#2E5A27] bg-[#EAF2E8] px-2.5 py-1 rounded-full border border-[#C5DEC0]">
                120 MINUTES · 300 MCQS · 80% HARD
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150D] tracking-tight">
              Forward Deployment Systems Architect Examination
            </h1>
            <p className="text-xs sm:text-sm text-[#5C4535] max-w-3xl leading-relaxed">
              The capstone examination measures production-level competence across all 15 Forward Deployment modules: data ingestion, CDC idempotency, graph ontologies, vector RAG with ACLs, PII guardrails, autonomous ReAct loops, P0 incident triage, zero-trust ABAC, OpenTelemetry distributed tracing, air-gapped Kubernetes, active-active DR, and live CTO architecture defense.
            </p>
          </div>

          {/* Quick Metrics Card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 p-4 rounded-xl bg-white border border-[#D5C4AC] shadow-xs shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-mono text-[#7A6250] block">REQUIRED PASS SCORE</span>
              <span className="text-xl font-mono font-black text-[#7C3E1D]">≥ 90% (270 / 300)</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-mono text-[#7A6250] block">RE-ATTEMPT POLICY</span>
              <span className="text-xs font-mono font-bold text-[#24150D]">
                Attempts: <strong>{Math.min(2, attemptCount)} / 2</strong> (Max 1 Re-attempt)
              </span>
            </div>
          </div>
        </div>

        {/* Lock / Unlocked Status Banner */}
        <div className="mt-6 pt-6 border-t border-[#EAE0D2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isPassed ? (
              <div className="w-10 h-10 rounded-xl bg-[#EAF2E8] border border-[#2E5A27] flex items-center justify-center text-[#2E5A27]">
                <Sparkles className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#FBEFE0] border border-[#8C4A23] flex items-center justify-center text-[#8C4A23]">
                <ShieldAlert className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#24150D]">
                  {isPassed
                    ? `OFFICIALLY PASSED · SCORE: ${finalScore}%`
                    : attemptCount === 0
                    ? 'EXAMINATION NOT YET STARTED'
                    : `ATTEMPT ${attemptCount} OF 2 COMPLETED · SCORE: ${finalScore}%`}
                </span>
                {isPassed && (
                  <span className="text-[10px] font-bold text-[#2E5A27] bg-[#EAF2E8] px-2 py-0.5 rounded border border-[#C5DEC0]">
                    CERTIFICATE UNLOCKED
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6E5644] mt-0.5">
                {isPassed
                  ? 'Your Official Certificate of Engineering Excellence and Grandmaster Badge are fully unlocked and downloadable in PNG.'
                  : 'Passing this exam with ≥90% is mandatory to unlock the official FDE Certificate.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPassed && (
              <button
                onClick={onGoToCertificate}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2E5A27] hover:bg-[#23461E] rounded-xl shadow-md transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>View & Download Certificate (PNG)</span>
              </button>
            )}

            {!isTestStarted && (!isPassed || attemptCount < 2) && (
              <button
                onClick={handleStartTest}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#7C3E1D] hover:bg-[#663216] rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>
                  {attemptCount === 0
                    ? 'Start 120-Minute Exam (300 MCQs)'
                    : canReattempt
                    ? 'Start 1 Re-attempt (120 Mins)'
                    : 'Retake Practice'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Examination Workspace */}
      {isTestStarted && (
        <div className="space-y-6">
          {/* Sticky Timer & Progress Bar */}
          <div className="sticky top-[68px] z-30 bg-[#F5EDE0]/95 backdrop-blur-md border-2 border-[#8C4A23] rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Timer Pill */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm sm:text-base shadow-xs ${
                  secondsRemaining < 600
                    ? 'bg-[#FDF2F2] border-[#C53030] text-[#C53030] animate-pulse'
                    : 'bg-[#FAF7F2] border-[#8C4A23] text-[#7C3E1D]'
                }`}
              >
                <Clock className="w-5 h-5 shrink-0" />
                <span>{formatTime(secondsRemaining)}</span>
                <span className="text-[10px] text-[#7A6250] uppercase ml-1">REMAINING</span>
              </div>

              {/* Pause / Resume */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#FAF7F2] border border-[#D5C4AC] hover:border-[#7C3E1D] text-[#3D291C] transition-all cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-[#2E5A27]" /> : <Pause className="w-3.5 h-3.5 text-[#7C3E1D]" />}
                <span>{isPaused ? 'Resume Timer' : 'Pause'}</span>
              </button>
            </div>

            {/* Answered Progress Metrics */}
            <div className="flex items-center gap-6 text-xs font-mono">
              <span className="text-[#5C4535]">
                Answered:{' '}
                <strong className="text-[#24150D]">
                  {answeredCount} / {FINAL_ASSESSMENT_QUESTIONS.length}
                </strong>{' '}
                ({Math.round((answeredCount / FINAL_ASSESSMENT_QUESTIONS.length) * 100)}%)
              </span>
              <span className="text-[#7C3E1D]">
                Flagged: <strong>{flaggedIndices.length}</strong>
              </span>

              <button
                onClick={() => handleSubmitAssessment(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#7C3E1D] hover:bg-[#663216] rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Final Exam</span>
              </button>
            </div>
          </div>

          {/* Main Assessment Layout: Split Screen Question View + 300 Question Grid Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Current Question Panel */}
            <div className="lg:col-span-8 bg-white border border-[#D5C4AC] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Question Header & Meta */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#EAE0D2]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-[#7C3E1D] bg-[#F5EDE0] px-3 py-1 rounded-lg">
                    Question {currentIndex + 1} of {FINAL_ASSESSMENT_QUESTIONS.length}
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#D5C4AC] text-[#5C4535]">
                    Module {currentQ.dayRef}: {currentQ.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-extrabold ${
                      currentQ.difficulty === 'Hard'
                        ? 'bg-[#FBEFE0] text-[#8C4A23] border border-[#D5A872]'
                        : 'bg-[#EAF2E8] text-[#2E5A27] border border-[#C5DEC0]'
                    }`}
                  >
                    {currentQ.difficulty === 'Hard' ? 'HARD · 80% TIER' : 'CORE ARCHITECTURE'}
                  </span>
                </div>

                <button
                  onClick={() => toggleFlag(currentIndex)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    flaggedIndices.includes(currentIndex)
                      ? 'bg-[#FBEFE0] border border-[#8C4A23] text-[#8C4A23] font-bold'
                      : 'bg-[#FAF7F2] border border-[#D5C4AC] text-[#6E5644] hover:text-[#24150D]'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedIndices.includes(currentIndex) ? 'Flagged' : 'Flag'}</span>
                </button>
              </div>

              {/* Scenario Context Box */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] text-xs font-mono text-[#5C4535] leading-relaxed">
                {currentQ.scenario}
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-bold text-[#24150D] leading-snug">
                {currentQ.question}
              </h2>

              {/* 4 Selectable Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FBEFE0] border-[#8C4A23] text-[#24150D] font-semibold ring-2 ring-[#8C4A23]/30 shadow-xs'
                          : 'bg-[#FAF7F2] border-[#EAE0D2] text-[#3D291C] hover:border-[#8C4A23] hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-[#8C4A23] bg-[#8C4A23] text-white'
                            : 'border-[#C5B49E] bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Nav: Prev / Next */}
              <div className="pt-6 border-t border-[#EAE0D2] flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    currentIndex === 0
                      ? 'opacity-40 cursor-not-allowed bg-[#FAF7F2] border-[#EAE0D2] text-[#8C7360]'
                      : 'bg-[#FAF7F2] border-[#D5C4AC] text-[#3D291C] hover:border-[#7C3E1D] hover:bg-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-mono text-[#7A6250]">
                  Question <strong>{currentIndex + 1}</strong> of <strong>300</strong>
                </div>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(FINAL_ASSESSMENT_QUESTIONS.length - 1, prev + 1)
                    )
                  }
                  disabled={currentIndex === FINAL_ASSESSMENT_QUESTIONS.length - 1}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    currentIndex === FINAL_ASSESSMENT_QUESTIONS.length - 1
                      ? 'opacity-40 cursor-not-allowed bg-[#FAF7F2] border-[#EAE0D2] text-[#8C7360]'
                      : 'bg-[#7C3E1D] text-white hover:bg-[#663216] border-[#7C3E1D]'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right 4 Cols: 300 Question Quick Navigation Grid */}
            <div className="lg:col-span-4 bg-white border border-[#D5C4AC] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D2]">
                <h3 className="text-xs font-mono font-bold text-[#24150D] uppercase tracking-wider">
                  Question Palette (300 MCQs)
                </h3>
                <span className="text-[11px] font-mono text-[#7C3E1D] font-bold">
                  {answeredCount} Done
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-[#7C3E1D] text-white font-bold'
                      : 'bg-[#FAF7F2] text-[#6E5644] hover:text-[#24150D]'
                  }`}
                >
                  All (300)
                </button>
                <button
                  onClick={() => setActiveFilter('answered')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeFilter === 'answered'
                      ? 'bg-[#2E5A27] text-white font-bold'
                      : 'bg-[#FAF7F2] text-[#6E5644] hover:text-[#24150D]'
                  }`}
                >
                  Answered ({answeredCount})
                </button>
                <button
                  onClick={() => setActiveFilter('unanswered')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeFilter === 'unanswered'
                      ? 'bg-[#8C4A23] text-white font-bold'
                      : 'bg-[#FAF7F2] text-[#6E5644] hover:text-[#24150D]'
                  }`}
                >
                  Pending ({unansweredCount})
                </button>
                <button
                  onClick={() => setActiveFilter('flagged')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeFilter === 'flagged'
                      ? 'bg-[#D5A872] text-[#24150D] font-bold'
                      : 'bg-[#FAF7F2] text-[#6E5644] hover:text-[#24150D]'
                  }`}
                >
                  Flagged ({flaggedIndices.length})
                </button>
              </div>

              {/* The 300 Interactive Grid Buttons */}
              <div className="max-h-[460px] overflow-y-auto pr-1 grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-6 gap-1.5 pt-2">
                {filteredIndices.map((idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isFlagged = flaggedIndices.includes(idx);
                  const isCurrent = idx === currentIndex;

                  let btnClasses =
                    'h-8 text-xs font-mono font-medium rounded border transition-all flex items-center justify-center cursor-pointer ';

                  if (isCurrent) {
                    btnClasses += 'ring-2 ring-[#7C3E1D] font-bold ';
                  }

                  if (isFlagged) {
                    btnClasses += 'bg-[#FBEFE0] border-[#8C4A23] text-[#8C4A23]';
                  } else if (isAnswered) {
                    btnClasses += 'bg-[#EAF2E8] border-[#C5DEC0] text-[#2E5A27] font-semibold';
                  } else {
                    btnClasses += 'bg-[#FAF7F2] border-[#EAE0D2] text-[#8C7360] hover:text-[#24150D]';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={btnClasses}
                      title={`Jump to Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Palette Legend */}
              <div className="pt-3 border-t border-[#EAE0D2] grid grid-cols-2 gap-2 text-[10px] font-mono text-[#6E5644]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-[#EAF2E8] border border-[#C5DEC0]" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-[#FAF7F2] border border-[#EAE0D2]" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-[#FBEFE0] border border-[#8C4A23]" />
                  <span>Flagged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded ring-2 ring-[#7C3E1D] bg-white" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review & Grading Screen (Visible after submission or if already passed) */}
      {isSubmitted && !isTestStarted && (
        <div className="space-y-6">
          {/* Results Summary Card */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border-2 transition-all shadow-md ${
              isPassed
                ? 'bg-[#EAF2E8] border-[#2E5A27] text-[#2E5A27]'
                : 'bg-[#FDF2F2] border-[#C53030] text-[#C53030]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase">
                  {isPassed ? '★ DISTINCTION ACHIEVED ★' : 'THRESHOLD NOT MET'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24150D]">
                  {isPassed
                    ? `PASSED WITH DISTINCTION · FINAL SCORE: ${finalScore}%`
                    : `SCORE: ${finalScore}% (REQUIRES ≥90% TO PASS)`}
                </h2>
                <p className="text-xs sm:text-sm text-[#3D291C] max-w-2xl leading-relaxed">
                  {isPassed
                    ? `Congratulations! You scored ${finalScore}%, surpassing the rigorous 90% threshold across 300 non-repeated enterprise engineering MCQs. Your Forward Deployment Systems Architect Certification is officially UNLOCKED!`
                    : `You completed 300 MCQs with a score of ${finalScore}%. The official certification requires a minimum score of 90%. You have used ${attemptCount} of 2 allowed attempts.`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {isPassed && (
                  <button
                    onClick={onGoToCertificate}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#2E5A27] hover:bg-[#23461E] rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>View & Download Certificate (PNG)</span>
                  </button>
                )}

                {canReattempt && (
                  <button
                    onClick={handleStartTest}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#7C3E1D] hover:bg-[#663216] rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Use 1 Re-attempt (120 Mins)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Question Review Controls */}
          <div className="bg-white border border-[#D5C4AC] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE0D2]">
              <div>
                <h3 className="text-base font-bold text-[#24150D]">
                  Detailed Examination Question Breakdown
                </h3>
                <p className="text-xs text-[#6E5644] mt-0.5">
                  Review correct answers, explanations, and architectural rationales for all 300 questions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    reviewFilter === 'all'
                      ? 'bg-[#7C3E1D] text-white'
                      : 'bg-[#FAF7F2] text-[#6E5644] border border-[#D5C4AC]'
                  }`}
                >
                  All Questions (300)
                </button>
                <button
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    reviewFilter === 'incorrect'
                      ? 'bg-[#C53030] text-white'
                      : 'bg-[#FAF7F2] text-[#6E5644] border border-[#D5C4AC]'
                  }`}
                >
                  Incorrect Only
                </button>
              </div>
            </div>

            {/* Questions List Review */}
            <div className="space-y-6">
              {FINAL_ASSESSMENT_QUESTIONS.filter((_, idx) => {
                if (reviewFilter === 'incorrect') {
                  return selectedAnswers[idx] !== FINAL_ASSESSMENT_QUESTIONS[idx].correctIndex;
                }
                return true;
              }).map((q) => {
                const qIdx = q.id - 1;
                const chosenOpt = selectedAnswers[qIdx];
                const isCorrect = chosenOpt === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-xl border transition-all ${
                      isCorrect
                        ? 'bg-[#FAFDF9] border-[#C5DEC0]'
                        : 'bg-[#FFFDFD] border-[#F0C0C0]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#7C3E1D] bg-[#F5EDE0] px-2.5 py-0.5 rounded">
                          Question {q.id} of 300
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#D5C4AC] text-[#5C4535]">
                          Module {q.dayRef}: {q.category}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            q.difficulty === 'Hard'
                              ? 'bg-[#FBEFE0] text-[#8C4A23]'
                              : 'bg-[#EFE7DA] text-[#6E5644]'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-mono font-bold flex items-center gap-1 ${
                          isCorrect ? 'text-[#2E5A27]' : 'text-[#C53030]'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4" /> Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    {/* Scenario */}
                    <div className="p-3 mb-3 rounded-lg bg-[#FAF7F2] border border-[#EAE0D2] text-xs font-mono text-[#5C4535]">
                      {q.scenario}
                    </div>

                    {/* Question text */}
                    <h4 className="text-sm font-bold text-[#24150D] mb-3 leading-snug">
                      {q.question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = chosenOpt === optIdx;
                        const isTheCorrectOpt = optIdx === q.correctIndex;

                        let rowClass =
                          'p-3 rounded-lg border text-xs flex items-start gap-2.5 ';
                        if (isTheCorrectOpt) {
                          rowClass += 'bg-[#EAF2E8] border-[#2E5A27] text-[#2E5A27] font-semibold';
                        } else if (isChosen && !isTheCorrectOpt) {
                          rowClass += 'bg-[#FDF2F2] border-[#C53030] text-[#C53030] line-through';
                        } else {
                          rowClass += 'bg-[#FAF7F2] border-[#EAE0D2] text-[#8C7360] opacity-75';
                        }

                        return (
                          <div key={optIdx} className={rowClass}>
                            <span className="font-mono font-bold shrink-0">
                              {['A', 'B', 'C', 'D'][optIdx]}.
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isTheCorrectOpt && (
                              <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#2E5A27]">
                                Correct Answer
                              </span>
                            )}
                            {isChosen && !isTheCorrectOpt && (
                              <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#C53030]">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EAE0D2] text-xs text-[#5C4535] leading-relaxed">
                      <strong className="text-[#7C3E1D] font-mono block mb-0.5">
                        Forward Deployment Standard:
                      </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
