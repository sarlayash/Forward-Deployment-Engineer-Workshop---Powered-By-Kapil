import React, { useState } from 'react';
import { BADGES_DATA } from '../data/badgesData';
import { DAILY_BADGES_DATA } from '../data/dailyBadgesData';
import { LearnerProfile, DailyBadge } from '../types/workshop';
import { DailyAssessmentModal } from './DailyAssessmentModal';
import { exportDailyBadgeToPng } from '../utils/pngExport';
import {
  Award,
  CheckCircle2,
  Lock,
  Download,
  Share2,
  ShieldAlert,
  BrainCircuit,
  Network,
  DatabaseZap,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface BadgesViewProps {
  learner: LearnerProfile;
  onOpenIDEForDay: (dayId: number) => void;
  onUpdateLearner: (updated: LearnerProfile) => void;
  onGoToFinalAssessment: () => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  learner,
  onOpenIDEForDay,
  onUpdateLearner,
  onGoToFinalAssessment,
}) => {
  const [selectedDayForAssessment, setSelectedDayForAssessment] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'milestones'>('daily');
  const [exportingBadgeId, setExportingBadgeId] = useState<string | number | null>(null);

  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-6 h-6 ${isUnlocked ? 'text-[#8C4A23]' : 'text-[#8C7360]'}`;
    switch (iconName) {
      case 'DatabaseZap':
        return <DatabaseZap className={iconClass} />;
      case 'Network':
        return <Network className={iconClass} />;
      case 'BrainCircuit':
        return <BrainCircuit className={iconClass} />;
      case 'ShieldAlert':
        return <ShieldAlert className={iconClass} />;
      case 'Layers':
        return <Layers className={iconClass} />;
      case 'Award':
      default:
        return <Award className={iconClass} />;
    }
  };

  const handlePassDailyAssessment = (dayId: number, score: number, attempts: number) => {
    const currentUnlocked = learner.unlockedDailyBadges || [];
    const updatedUnlocked = currentUnlocked.includes(dayId)
      ? currentUnlocked
      : [...currentUnlocked, dayId];

    const updatedProfile: LearnerProfile = {
      ...learner,
      unlockedDailyBadges: updatedUnlocked,
      dailyAssessmentScores: {
        ...learner.dailyAssessmentScores,
        [dayId]: Math.max(score, learner.dailyAssessmentScores[dayId] || 0),
      },
      dailyAssessmentAttempts: {
        ...learner.dailyAssessmentAttempts,
        [dayId]: attempts,
      },
    };
    onUpdateLearner(updatedProfile);
  };

  const handleFailDailyAssessment = (dayId: number, score: number, attempts: number) => {
    const updatedProfile: LearnerProfile = {
      ...learner,
      dailyAssessmentScores: {
        ...learner.dailyAssessmentScores,
        [dayId]: Math.max(score, learner.dailyAssessmentScores[dayId] || 0),
      },
      dailyAssessmentAttempts: {
        ...learner.dailyAssessmentAttempts,
        [dayId]: attempts,
      },
    };
    onUpdateLearner(updatedProfile);
  };

  const handleDownloadDailyBadge = async (badge: DailyBadge) => {
    try {
      setExportingBadgeId(badge.dayId);
      const score = learner.dailyAssessmentScores[badge.dayId] || 90;
      await exportDailyBadgeToPng({
        dayId: badge.dayId,
        title: badge.title,
        subtitle: badge.subtitle,
        category: badge.category,
        learnerName: learner.name || 'Forward Deployment Engineer',
        score: score,
        certificateId: learner.certificateId,
        clientMission: badge.clientMission,
      });
    } catch (err) {
      console.error('Failed to export daily badge PNG:', err);
      alert('Error exporting PNG. Please try again.');
    } finally {
      setExportingBadgeId(null);
    }
  };

  const handleDownloadMilestoneBadge = async (badge: typeof BADGES_DATA[0]) => {
    try {
      setExportingBadgeId(badge.id);
      await exportDailyBadgeToPng({
        dayId: badge.milestoneDays[badge.milestoneDays.length - 1],
        title: badge.title,
        subtitle: badge.subtitle,
        category: badge.category,
        learnerName: learner.name || 'Forward Deployment Engineer',
        score: 100,
        certificateId: learner.certificateId,
        clientMission: badge.description,
      });
    } catch (err) {
      console.error(err);
      alert('Error exporting PNG.');
    } finally {
      setExportingBadgeId(null);
    }
  };

  const unlockedDailyCount = (learner.unlockedDailyBadges || []).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-[#FBF8F3] text-[#24150D]">
      {/* Header & Lock Rules Summary */}
      <div className="bg-[#FAF7F2] border-2 border-[#8C4A23] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7C3E1D] font-bold">
              <Award className="w-4 h-4" />
              <span>FORWARD DEPLOYMENT CREDENTIALS & BADGES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150D] tracking-tight">
              Verified Daily & Milestone Badges
            </h1>
            <p className="text-xs sm:text-sm text-[#5C4535] max-w-2xl leading-relaxed">
              Every day of the Forward Deployment Engineer curriculum awards an official competency badge. Badges are locked until passing that day's assessment with <strong>≥90% score</strong> (maximum <strong>1 re-attempt</strong> allowed). Once unlocked, you can download high-resolution PNG badges with zero cropping or formatting issues.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#D5C4AC] shadow-xs shrink-0">
            <div>
              <span className="text-[10px] font-mono text-[#7A6250] block">UNLOCKED DAILY BADGES</span>
              <span className="text-xl font-mono font-black text-[#7C3E1D]">
                {unlockedDailyCount} / 15
              </span>
            </div>
            <div className="h-8 w-px bg-[#EAE0D2]" />
            <div>
              <span className="text-[10px] font-mono text-[#7A6250] block">REQUIRED PASS SCORE</span>
              <span className="text-sm font-mono font-bold text-[#2E5A27] block">≥ 90% (1 Re-attempt)</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-6 border-t border-[#EAE0D2] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-[#7C3E1D] text-white shadow-sm'
                  : 'bg-white text-[#6E5644] hover:text-[#24150D] border border-[#D5C4AC]'
              }`}
            >
              15 Daily Badges ({unlockedDailyCount}/15 Unlocked)
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'milestones'
                  ? 'bg-[#7C3E1D] text-white shadow-sm'
                  : 'bg-white text-[#6E5644] hover:text-[#24150D] border border-[#D5C4AC]'
              }`}
            >
              Milestone & Grandmaster Badges ({BADGES_DATA.length})
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#7C3E1D]">
            <ShieldCheck className="w-4 h-4" />
            <span>High-DPI PNG Exporters Active</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: 15 DAILY BADGES */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#24150D] flex items-center gap-2">
              <span>Day 1 to Day 15 Production Badges</span>
              <span className="text-xs font-mono font-normal text-[#6E5644]">
                (Score ≥90% on each daily assessment to unlock)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAILY_BADGES_DATA.map((badge) => {
              const isUnlocked = (learner.unlockedDailyBadges || []).includes(badge.dayId);
              const score = learner.dailyAssessmentScores[badge.dayId] || 0;
              const attempts = learner.dailyAssessmentAttempts[badge.dayId] || 0;
              const hasAttemptsLeft = attempts < 2;

              return (
                <div
                  key={badge.dayId}
                  className={`rounded-2xl border-2 p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    isUnlocked
                      ? 'bg-white border-[#B87A38] shadow-md ring-1 ring-[#B87A38]/30'
                      : 'bg-[#FAF7F2] border-[#E3D8C6] opacity-90 shadow-xs'
                  }`}
                >
                  {/* Top Card Row */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                          isUnlocked
                            ? 'bg-[#FDF4E9] border-[#D5A872] shadow-xs'
                            : 'bg-[#EFE7DA] border-[#D5C4AC]'
                        }`}
                      >
                        {getIcon(badge.iconName, isUnlocked)}
                      </div>

                      {/* Status Tag */}
                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#2E5A27] bg-[#EAF2E8] border border-[#C5DEC0] px-2.5 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          UNLOCKED ({score}%)
                        </span>
                      ) : (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#8C4A23] bg-[#FBEFE0] border border-[#D5A872] px-2 py-0.5 rounded">
                            <Lock className="w-3 h-3" />
                            LOCKED (REQ ≥90%)
                          </span>
                          <span className="block text-[10px] font-mono text-[#8C7360] mt-0.5">
                            Attempts: {attempts}/2
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Day Pill */}
                    <span className="text-[11px] font-mono font-bold text-[#7C3E1D] uppercase tracking-wider block">
                      DAY {String(badge.dayId).padStart(2, '0')} · {badge.category}
                    </span>

                    {/* Badge Title */}
                    <h3 className="text-base font-extrabold text-[#24150D] tracking-tight mt-1">
                      {badge.title}
                    </h3>
                    <p className="text-xs font-mono text-[#6E5644] mt-0.5 font-medium">
                      {badge.subtitle}
                    </p>

                    {/* Core Competency */}
                    <p className="text-xs text-[#5C4535] mt-3 leading-relaxed">
                      {badge.coreCompetency}
                    </p>

                    {/* Client Mission Pill */}
                    <div className="mt-4 p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EAE0D2] text-[11px] text-[#6E5644] italic">
                      Mission: "{badge.clientMission}"
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-6 pt-4 border-t border-[#EAE0D2] flex items-center justify-between gap-3">
                    {isUnlocked ? (
                      <button
                        onClick={() => handleDownloadDailyBadge(badge)}
                        disabled={exportingBadgeId === badge.dayId}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#2E5A27] hover:bg-[#23461E] rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>
                          {exportingBadgeId === badge.dayId
                            ? 'Generating PNG...'
                            : 'Download Badge (PNG)'}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedDayForAssessment(badge.dayId)}
                        disabled={!hasAttemptsLeft}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer ${
                          hasAttemptsLeft
                            ? 'text-white bg-[#7C3E1D] hover:bg-[#663216]'
                            : 'bg-[#D5C4AC] text-[#8C7360] cursor-not-allowed'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>
                          {attempts === 0
                            ? `Take Day ${badge.dayId} Assessment`
                            : hasAttemptsLeft
                            ? `Re-attempt Assessment (${score}%)`
                            : `Re-attempts Exhausted (${score}%)`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: MILESTONES & CAPSTONE CERTIFICATION BADGE */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#24150D] flex items-center gap-2">
              <span>Domain Milestone & Grandmaster Badges</span>
              <span className="text-xs font-mono font-normal text-[#6E5644]">
                (Multi-day synthesis and final capstone)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BADGES_DATA.map((badge) => {
              const isGrandmaster = badge.id === 'badge_grandmaster';
              const isUnlocked = isGrandmaster
                ? learner.finalAssessmentPassed
                : badge.milestoneDays.every((d) => (learner.unlockedDailyBadges || []).includes(d));

              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl border-2 p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    isUnlocked
                      ? 'bg-white border-[#B87A38] shadow-md ring-1 ring-[#B87A38]/30'
                      : 'bg-[#FAF7F2] border-[#E3D8C6] opacity-85 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                          isUnlocked
                            ? 'bg-[#FDF4E9] border-[#D5A872] shadow-xs'
                            : 'bg-[#EFE7DA] border-[#D5C4AC]'
                        }`}
                      >
                        {getIcon(badge.iconName, isUnlocked)}
                      </div>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#2E5A27] bg-[#EAF2E8] border border-[#C5DEC0] px-2.5 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-[#8C7360] bg-[#EFE7DA] border border-[#D5C4AC] px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3" />
                          {isGrandmaster ? 'Req Final Exam ≥90%' : 'Milestone Locked'}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono font-bold text-[#7C3E1D] uppercase tracking-wider block">
                      {badge.category}
                    </span>

                    <h3 className="text-base font-extrabold text-[#24150D] tracking-tight mt-1">
                      {badge.title}
                    </h3>
                    <p className="text-xs font-mono text-[#6E5644] mt-0.5 font-medium">
                      {badge.subtitle}
                    </p>

                    <p className="text-xs text-[#5C4535] mt-3 leading-relaxed">
                      {badge.description}
                    </p>

                    {/* Requirements summary */}
                    <div className="mt-4 pt-3 border-t border-[#EAE0D2] text-[11px] font-mono text-[#6E5644]">
                      {isGrandmaster ? (
                        <span>Requires passing the 120-min 300 MCQ Final Exam with ≥90%.</span>
                      ) : (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>Milestone Days:</span>
                          {badge.milestoneDays.map((d) => (
                            <span
                              key={d}
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                (learner.unlockedDailyBadges || []).includes(d)
                                  ? 'bg-[#EAF2E8] text-[#2E5A27] font-bold'
                                  : 'bg-[#EFE7DA] text-[#6E5644]'
                              }`}
                            >
                              D{d} {(learner.unlockedDailyBadges || []).includes(d) ? '✓' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#EAE0D2]">
                    {isUnlocked ? (
                      <button
                        onClick={() => handleDownloadMilestoneBadge(badge)}
                        disabled={exportingBadgeId === badge.id}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#2E5A27] hover:bg-[#23461E] rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>
                          {exportingBadgeId === badge.id
                            ? 'Generating PNG...'
                            : 'Download Badge (PNG)'}
                        </span>
                      </button>
                    ) : isGrandmaster ? (
                      <button
                        onClick={onGoToFinalAssessment}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#7C3E1D] hover:bg-[#663216] rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Take Final Assessment (120 Mins)</span>
                      </button>
                    ) : (
                      <div className="text-center text-xs text-[#8C7360] py-2">
                        Complete required days with ≥90%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Assessment Modal */}
      {selectedDayForAssessment && (
        <DailyAssessmentModal
          dayId={selectedDayForAssessment}
          isOpen={true}
          onClose={() => setSelectedDayForAssessment(null)}
          learner={learner}
          onPassAssessment={handlePassDailyAssessment}
          onFailAssessment={handleFailDailyAssessment}
        />
      )}
    </div>
  );
};
