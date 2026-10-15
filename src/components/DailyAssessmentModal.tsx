import React, { useState } from 'react';
import { DAILY_ASSESSMENTS } from '../data/dailyAssessmentsData';
import { DAILY_BADGES_DATA } from '../data/dailyBadgesData';
import { LearnerProfile } from '../types/workshop';
import { exportDailyBadgeToPng } from '../utils/pngExport';
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  HelpCircle,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface DailyAssessmentModalProps {
  dayId: number;
  isOpen: boolean;
  onClose: () => void;
  learner: LearnerProfile;
  onPassAssessment: (dayId: number, score: number, attempts: number) => void;
  onFailAssessment: (dayId: number, score: number, attempts: number) => void;
}

export const DailyAssessmentModal: React.FC<DailyAssessmentModalProps> = ({
  dayId,
  isOpen,
  onClose,
  learner,
  onPassAssessment,
  onFailAssessment,
}) => {
  if (!isOpen) return null;

  const badge = DAILY_BADGES_DATA.find((b) => b.dayId === dayId) || DAILY_BADGES_DATA[0];
  const questions = DAILY_ASSESSMENTS[dayId] || [];

  const existingAttempts = learner.dailyAssessmentAttempts[dayId] || 0;
  const existingScore = learner.dailyAssessmentScores[dayId] || 0;
  const isAlreadyUnlocked = (learner.unlockedDailyBadges || []).includes(dayId);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(existingScore);
  const [attemptCount, setAttemptCount] = useState<number>(existingAttempts);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optionIdx,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      if (!window.confirm(`You have answered ${answeredCount} of ${questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const newAttemptCount = existingAttempts + 1;
    setAttemptCount(newAttemptCount);
    setCalculatedScore(scorePercent);
    setSubmitted(true);

    if (scorePercent >= 90) {
      onPassAssessment(dayId, scorePercent, newAttemptCount);
    } else {
      onFailAssessment(dayId, scorePercent, newAttemptCount);
    }
  };

  const handleReattempt = () => {
    if (attemptCount >= 2) {
      alert('You have exhausted your maximum 1 re-attempt for this assessment.');
      return;
    }
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const handleDownloadBadge = async () => {
    try {
      setIsExporting(true);
      await exportDailyBadgeToPng({
        dayId: badge.dayId,
        title: badge.title,
        subtitle: badge.subtitle,
        category: badge.category,
        learnerName: learner.name || 'Forward Deployment Engineer',
        score: Math.max(calculatedScore, 90),
        certificateId: learner.certificateId,
        clientMission: badge.clientMission,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate PNG badge. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const isPassed = calculatedScore >= 90 || isAlreadyUnlocked;
  const canReattempt = attemptCount < 2 && !isPassed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF7F2] border-2 border-[#8C4A23] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#24150D]">
        {/* Modal Header */}
        <div className="bg-[#F5EDE0] border-b border-[#D5C4AC] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#8C4A23] flex items-center justify-center text-[#7C3E1D] font-bold text-sm">
              D{dayId}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[#7C3E1D] tracking-wider uppercase">
                  DAILY COMPETENCY ASSESSMENT · DAY {dayId}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#D5C4AC] text-[#5C4535]">
                  {questions.length} MCQs
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#24150D] tracking-tight">
                {badge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono text-[#6E5644] block">
                Attempts: <strong className="text-[#24150D]">{Math.min(2, attemptCount)} / 2</strong>
              </span>
              <span className="text-[11px] font-mono text-[#7C3E1D]">
                Passing Score: <strong>≥90%</strong>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#EFE5D6] text-[#6E5644] hover:text-[#24150D] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Requirements Banner */}
        <div className="bg-[#FDF4E9] border-b border-[#D5A872]/40 px-6 py-2.5 flex items-center justify-between text-xs text-[#7C3E1D]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Lock Policy:</strong> You must score at least <strong>90%</strong> on this assessment to unlock and download the official <strong>Day {dayId} PNG Badge</strong>. Maximum <strong>1 re-attempt</strong> allowed.
            </span>
          </div>
          <span className="font-mono font-bold hidden md:inline">
            Status: {isPassed ? 'UNLOCKED (PASSED)' : existingAttempts >= 2 ? 'LOCKED (NO ATTEMPTS LEFT)' : 'LOCKED'}
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Submission Result Banner */}
          {submitted && (
            <div
              className={`p-5 rounded-xl border-2 transition-all ${
                isPassed
                  ? 'bg-[#EAF2E8] border-[#2E5A27] text-[#2E5A27]'
                  : 'bg-[#FDF2F2] border-[#C53030] text-[#C53030]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {isPassed ? (
                    <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#2E5A27] flex items-center justify-center text-[#2E5A27] shadow-sm">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#C53030] flex items-center justify-center text-[#C53030] shadow-sm">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-extrabold">
                      {isPassed
                        ? `PASSED WITH DISTINCTION · SCORE: ${calculatedScore}%`
                        : `ASSESSMENT NOT PASSED · SCORE: ${calculatedScore}%`}
                    </h3>
                    <p className="text-xs mt-1 text-[#24150D]">
                      {isPassed
                        ? `Congratulations! You scored ${calculatedScore}%, satisfying the ≥90% threshold. Day ${dayId} Badge is officially UNLOCKED!`
                        : `You scored ${calculatedScore}%. A minimum score of 90% is required to unlock this badge. (Attempts used: ${attemptCount}/2).`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPassed && (
                    <button
                      onClick={handleDownloadBadge}
                      disabled={isExporting}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2E5A27] hover:bg-[#23461E] rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'Generating PNG...' : 'Download Badge (PNG)'}</span>
                    </button>
                  )}
                  {canReattempt && (
                    <button
                      onClick={handleReattempt}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#7C3E1D] hover:bg-[#663216] rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Use 1 Re-attempt ({2 - attemptCount} left)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Already Unlocked Banner if opened after having already passed */}
          {isAlreadyUnlocked && !submitted && (
            <div className="p-4 rounded-xl bg-[#EAF2E8] border border-[#C5DEC0] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-[#2E5A27]">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>
                  <strong>Badge Unlocked!</strong> You have already passed this assessment with a score of <strong>{existingScore}%</strong>. You can download the PNG badge at any time.
                </span>
              </div>
              <button
                onClick={handleDownloadBadge}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-[#2E5A27] hover:bg-[#23461E] rounded-lg transition-all shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isCorrect = submitted && selectedOpt === q.correctIndex;
              const isWrong = submitted && selectedOpt !== undefined && selectedOpt !== q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border bg-white transition-all ${
                    submitted
                      ? isCorrect
                        ? 'border-[#2E5A27] bg-[#F7FAF6]'
                        : isWrong
                        ? 'border-[#C53030] bg-[#FFF8F8]'
                        : 'border-[#E3D8C6]'
                      : 'border-[#E3D8C6] shadow-xs'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#7C3E1D] bg-[#F5EDE0] px-2 py-0.5 rounded">
                        Q{qIdx + 1} of {questions.length}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          q.difficulty === 'Hard'
                            ? 'bg-[#FBEFE0] text-[#8C4A23] border border-[#D5A872]'
                            : 'bg-[#EFE7DA] text-[#6E5644]'
                        }`}
                      >
                        {q.difficulty.toUpperCase()}
                      </span>
                    </div>

                    {submitted && (
                      <span className="text-xs font-mono font-bold">
                        {isCorrect ? (
                          <span className="text-[#2E5A27] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-[#C53030] flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Scenario context if present */}
                  {q.scenario && (
                    <div className="p-3 mb-3 rounded-lg bg-[#FAF7F2] border border-[#EAE0D2] text-xs text-[#5C4535] leading-relaxed font-mono">
                      {q.scenario}
                    </div>
                  )}

                  {/* Question Text */}
                  <h4 className="text-sm font-bold text-[#24150D] mb-4 leading-snug">
                    {q.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {q.options.map((option, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isOptionCorrect = submitted && optIdx === q.correctIndex;
                      const isOptionChosenWrong = submitted && isChosen && optIdx !== q.correctIndex;

                      let optClasses =
                        'flex items-start gap-3 p-3 rounded-lg border text-xs transition-all cursor-pointer ';

                      if (submitted) {
                        if (isOptionCorrect) {
                          optClasses += 'bg-[#EAF2E8] border-[#2E5A27] text-[#2E5A27] font-semibold';
                        } else if (isOptionChosenWrong) {
                          optClasses += 'bg-[#FDF2F2] border-[#C53030] text-[#C53030] line-through';
                        } else {
                          optClasses += 'bg-[#FAF7F2] border-[#EAE0D2] text-[#8C7360] opacity-70';
                        }
                      } else {
                        if (isChosen) {
                          optClasses += 'bg-[#FBEFE0] border-[#8C4A23] text-[#24150D] font-semibold ring-1 ring-[#8C4A23]';
                        } else {
                          optClasses += 'bg-[#FAF7F2] border-[#EAE0D2] text-[#3D291C] hover:border-[#8C4A23] hover:bg-[#FDFBF7]';
                        }
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={optClasses}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isChosen
                                ? 'border-[#8C4A23] bg-[#8C4A23] text-white'
                                : 'border-[#C5B49E] bg-white'
                            }`}
                          >
                            {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="flex-1 leading-relaxed">{option}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation shown after submit */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-[#EAE0D2] text-xs text-[#5C4535] leading-relaxed">
                      <strong className="text-[#7C3E1D] block mb-1 font-mono">
                        Technical Rationale:
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#F5EDE0] border-t border-[#D5C4AC] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-[#6E5644] font-mono">
            {!submitted ? (
              <span>
                Answered: <strong>{answeredCount} / {questions.length}</strong> questions
              </span>
            ) : (
              <span>
                Result: <strong>{calculatedScore}%</strong> ({isPassed ? 'PASSED ≥90%' : 'LOCKED'})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isPassed && (
              <button
                onClick={handleDownloadBadge}
                disabled={isExporting}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2E5A27] hover:bg-[#23461E] rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating...' : 'Download Badge (PNG)'}</span>
              </button>
            )}

            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                  answeredCount > 0
                    ? 'text-white bg-[#7C3E1D] hover:bg-[#663216]'
                    : 'bg-[#D5C4AC] text-[#8C7360] cursor-not-allowed'
                }`}
              >
                <span>Submit Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {submitted && canReattempt && (
              <button
                onClick={handleReattempt}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#7C3E1D] hover:bg-[#663216] rounded-xl shadow-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Use 1 Re-attempt</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#5C4535] hover:text-[#24150D] bg-[#FAF7F2] border border-[#D5C4AC] rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
