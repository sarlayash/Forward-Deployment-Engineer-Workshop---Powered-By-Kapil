import React, { useState } from 'react';
import { LearnerProfile } from '../types/workshop';
import { Terminal, Shield, ArrowRight, CheckCircle2, RotateCcw, User, Sparkles } from 'lucide-react';

interface LoginPageProps {
  currentProfile: LearnerProfile;
  onLogin: (updatedProfile: LearnerProfile) => void;
  onBackToFounderNote: () => void;
  onReset: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentProfile,
  onLogin,
  onBackToFounderNote,
  onReset,
}) => {
  const [name, setName] = useState(currentProfile.name || '');
  const [targetRole, setTargetRole] = useState(
    currentProfile.targetRole || 'Palantir Forward Deployment Engineer (FDE)'
  );
  const [experienceLevel, setExperienceLevel] = useState<LearnerProfile['experienceLevel']>(
    currentProfile.experienceLevel || 'Mid-Level Software Engineer'
  );

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
      isAuthenticated: true,
      hasAgreedToFounderNote: true,
    };
    onLogin(updated);
  };

  const hasExistingProgress = currentProfile.completedDays.length > 0;

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#24150D] flex flex-col justify-center items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-lg bg-[#FFFFFF] border-2 border-[#D5C4AC] rounded-2xl shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#F5EFEB] border-b border-[#E3D8C6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#EFE5D6] border border-[#D5C4AC] flex items-center justify-center text-[#7C3E1D]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#24150D] tracking-tight">
                Learner Terminal Login
              </h2>
              <span className="text-[11px] font-mono text-[#7A6250]">
                Forward Deployed Studio v2026.1
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToFounderNote}
            className="text-xs font-semibold text-[#7C3E1D] hover:underline"
          >
            Founder's Note
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {hasExistingProgress && (
            <div className="p-3 bg-[#FAF2E8] border border-[#D5B89C] rounded-lg text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-[#7C3E1D] block">Welcome back, {currentProfile.name}!</span>
                <span className="text-[#5C4535]">You have completed {currentProfile.completedDays.length}/15 days ({currentProfile.xp} XP).</span>
              </div>
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-[#A14725] hover:underline font-mono shrink-0 ml-2"
                title="Reset all progress and start fresh"
              >
                Reset Progress
              </button>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-[#3D291C] uppercase tracking-wider mb-1.5">
              Enter Your Full Name <span className="text-[#7C3E1D]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g., Alex Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C4AC] rounded-lg text-sm text-[#24150D] placeholder-[#A89480] focus:outline-none focus:border-[#7C3E1D] focus:ring-1 focus:ring-[#7C3E1D] transition-colors"
              />
              <User className="w-4 h-4 text-[#8C7360] absolute right-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#8C7360] mt-1">
              Your name will appear on your verified Certificate of Completion & milestone credentials.
            </p>
          </div>

          {/* Target Role Track */}
          <div>
            <label className="block text-xs font-bold text-[#3D291C] uppercase tracking-wider mb-1.5">
              Select Your Target Career Track
            </label>
            <div className="space-y-1.5">
              {roles.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setTargetRole(role)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-left transition-all border ${
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

          {/* Engineering Experience Level */}
          <div>
            <label className="block text-xs font-bold text-[#3D291C] uppercase tracking-wider mb-1.5">
              Experience Level
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

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-[#FAF6EE] bg-[#7C3E1D] hover:bg-[#663216] rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Enter Forward Deployment Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Reset System Option */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E3D8C6] text-xs text-[#8C7360]">
            <button
              type="button"
              onClick={onBackToFounderNote}
              className="hover:text-[#24150D] transition-colors"
            >
              ← Back to Founder Note
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 hover:text-[#A14725] transition-colors font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset & Clear Cache</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
