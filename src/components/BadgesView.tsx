import React from 'react';
import { BADGES_DATA } from '../data/badgesData';
import { LearnerProfile } from '../types/workshop';
import {
  Award,
  CheckCircle2,
  Lock,
  Share2,
  ShieldAlert,
  BrainCircuit,
  Network,
  DatabaseZap,
  Layers,
  Sparkles,
} from 'lucide-react';

interface BadgesViewProps {
  learner: LearnerProfile;
  onOpenIDEForDay: (dayId: number) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ learner, onOpenIDEForDay }) => {
  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-7 h-7 ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}`;
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

  const handleShareBadge = (badgeTitle: string) => {
    navigator.clipboard?.writeText(
      `I earned the "${badgeTitle}" badge in the 15-Day Forward Deployment Engineer Workshop Powered By Kapil Narula! Verified FDE credential.`
    );
    alert(`Badge accomplishment copied to clipboard! Ready to share on LinkedIn / X.`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Award className="w-4 h-4" />
          <span>FDE COMPETENCY MILESTONES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Earnable Forward Deployment Badges
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Badges represent verified production milestones across data pipelines, graph ontologies, applied AI, zero-trust security, and high-availability architecture.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES_DATA.map((badge) => {
          const completedMilestoneCount = badge.milestoneDays.filter((d) =>
            learner.completedDays.includes(d)
          ).length;
          const isUnlocked = completedMilestoneCount === badge.milestoneDays.length;
          const progressPercent = Math.round(
            (completedMilestoneCount / badge.milestoneDays.length) * 100
          );

          return (
            <div
              key={badge.id}
              className={`rounded-xl border p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isUnlocked
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/40 shadow-xl shadow-amber-500/5'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-80'
              }`}
            >
              {/* Top Row: Icon + Status */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all ${
                      isUnlocked
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    {getIcon(badge.iconName, isUnlocked)}
                  </div>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" />
                      {completedMilestoneCount}/{badge.milestoneDays.length} Days
                    </span>
                  )}
                </div>

                {/* Badge Info */}
                <h3 className="text-base font-bold text-white tracking-tight">
                  {badge.title}
                </h3>
                <span className="text-xs font-mono text-emerald-400 block mt-0.5">
                  {badge.subtitle}
                </span>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {badge.description}
                </p>

                {/* Milestone requirements */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-500 block mb-1.5 font-mono">
                    Required Days:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {badge.milestoneDays.map((d) => {
                      const done = learner.completedDays.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => onOpenIDEForDay(d)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            done
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          Day {d} {done ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Progress & Action */}
              <div className="mt-6 pt-3 border-t border-slate-800/60">
                {isUnlocked ? (
                  <button
                    onClick={() => handleShareBadge(badge.title)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 rounded-lg transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Credential</span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
