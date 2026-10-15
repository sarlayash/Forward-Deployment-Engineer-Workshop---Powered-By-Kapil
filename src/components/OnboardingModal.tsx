import React, { useState } from 'react';
import { LearnerProfile } from '../types/workshop';
import { Terminal, ShieldCheck, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: LearnerProfile;
  onSaveProfile: (profile: LearnerProfile) => void;
  isFirstTime?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  isFirstTime = false,
}) => {
  const [name, setName] = useState(currentProfile.name || '');
  const [targetRole, setTargetRole] = useState(
    currentProfile.targetRole || 'Palantir Forward Deployment Engineer'
  );
  const [experienceLevel, setExperienceLevel] = useState<LearnerProfile['experienceLevel']>(
    currentProfile.experienceLevel || 'Mid-Level Software Engineer'
  );

  if (!isOpen) return null;

  const roles = [
    'Palantir Forward Deployment Engineer (FDE)',
    'Databricks Enterprise Solutions Architect',
    'Scale AI Forward Deployment Lead',
    'OpenAI Enterprise Applied AI Engineer',
    'Founding Systems & Deployment Engineer',
  ];

  const levels: LearnerProfile['experienceLevel'][] = [
    'Student / Junior Dev',
    'Mid-Level Software Engineer',
    'Senior / Staff Engineer',
    'Data / Solutions Architect',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Forward Deployed Engineer';
    const updated: LearnerProfile = {
      ...currentProfile,
      name: finalName,
      targetRole,
      experienceLevel,
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="relative px-6 py-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isFirstTime ? 'Begin Your Forward Deployment Journey' : 'Edit Learner Profile'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                15-Day Bootcamp · 10% High-Leverage Theory · 90% Hands-On Production Engineering
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Your Full Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Alex Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              This name will be embossed onto your official verifiable Certificate of Completion.
            </p>
          </div>

          {/* Target Role Track */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Career Role
            </label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setTargetRole(role)}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-left transition-all border ${
                    targetRole === role
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{role}</span>
                  {targetRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Current Experience Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Engineering Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {levels.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setExperienceLevel(lvl)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium text-center transition-all border ${
                    experienceLevel === lvl
                      ? 'bg-slate-800 border-emerald-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Value Props & Mentor Note */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mentored by Kapil Narula:</span>
            </div>
            <p className="leading-relaxed">
              "You won't just memorize syntax. You will debug live connection leaks, build resilient CDC pipelines, traverse enterprise ontologies, and prepare for high-stakes FDE interviews."
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            {!isFirstTime && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>{isFirstTime ? 'Launch Day 1 in IDE' : 'Save Changes'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
