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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C140E]/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#FDFBF7] border border-[#D5C4AC] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#24150D]">
        {/* Header Banner in Warm Cream */}
        <div className="relative px-6 py-6 border-b border-[#E3D8C6] bg-gradient-to-r from-[#FAF7F2] via-[#F5EFEB] to-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5EAE0] border border-[#D5B89C] flex items-center justify-center text-[#7C3E1D]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#24150D] tracking-tight">
                {isFirstTime ? 'Begin Your Forward Deployment Journey' : 'Edit Learner Profile'}
              </h2>
              <p className="text-xs text-[#5C4535] mt-0.5">
                15-Day Bootcamp · 10% High-Leverage Theory · 90% Hands-On Production Engineering
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-[#3D291C] uppercase tracking-wider mb-1.5">
              Your Full Name <span className="text-[#7C3E1D]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Alex Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5C4AC] rounded-lg text-sm text-[#24150D] placeholder-[#A89480] focus:outline-none focus:border-[#7C3E1D] focus:ring-1 focus:ring-[#7C3E1D] transition-colors shadow-2xs"
            />
            <p className="text-[11px] text-[#8C7360] mt-1">
              This name will be embossed onto your official verifiable Certificate of Completion.
            </p>
          </div>

          {/* Target Role Track */}
          <div>
            <label className="block text-xs font-bold text-[#3D291C] uppercase tracking-wider mb-1.5">
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
                      ? 'bg-[#FAF2E8] border-[#8C4A23] text-[#7C3E1D] font-bold shadow-2xs'
                      : 'bg-[#FFFFFF] border-[#E3D8C6] text-[#5C4535] hover:text-[#24150D] hover:border-[#D5C4AC]'
                  }`}
                >
                  <span>{role}</span>
                  {targetRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3E1D] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Current Experience Level */}
          <div>
            <label className="block text-xs font-bold text-[#3D291C] uppercase tracking-wider mb-1.5">
              Current Engineering Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {levels.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setExperienceLevel(lvl)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all border ${
                    experienceLevel === lvl
                      ? 'bg-[#7C3E1D] border-[#7C3E1D] text-[#FAF6EE] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#E3D8C6] text-[#5C4535] hover:text-[#24150D]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Value Props & Mentor Note */}
          <div className="p-3.5 bg-[#FAF7F2] border border-[#E3D8C6] rounded-lg text-xs text-[#5C4535] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#7C3E1D] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mentored by Kapil Narula:</span>
            </div>
            <p className="leading-relaxed">
              "You won't just memorize syntax. You will debug live connection leaks, build resilient CDC pipelines, traverse enterprise ontologies, and prepare for high-stakes FDE interviews."
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3D8C6]">
            {!isFirstTime && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#6E5644] hover:text-[#24150D] transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#FAF6EE] bg-[#7C3E1D] hover:bg-[#663216] rounded-lg shadow-md transition-all"
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
