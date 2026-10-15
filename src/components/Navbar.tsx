import React from 'react';
import { LearnerProfile } from '../types/workshop';
import { Terminal, Award, FileCode2, BookOpen, User, Briefcase, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  learner: LearnerProfile;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  learner,
  onOpenProfile,
}) => {
  const navItems = [
    { id: 'curriculum', label: 'Curriculum (15 Days)', icon: BookOpen },
    { id: 'ide', label: 'Hands-on IDE', icon: FileCode2 },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'certificate', label: 'Certification', icon: GraduationCap },
    { id: 'interview', label: 'Interview Vault', icon: Briefcase },
    { id: 'mentor', label: 'Mentor Kapil', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('curriculum')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="whitespace-nowrap shrink-0">
            <span className="text-base font-bold tracking-tight text-white block leading-none">
              Forward Deployed Academy
            </span>
            <span className="text-xs text-slate-400 tracking-wide mt-1 block font-mono">
              Powered by Kapil Narula
            </span>
          </div>
        </button>

        {/* Zone 2: Nav links, 1-2 word labels, single line */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-500 hover:text-white transition-all whitespace-nowrap shrink-0"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[120px] font-semibold">
              {learner.name || 'New Learner'}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-mono font-bold">
              {learner.completedDays.length}/15 Days
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400 font-mono font-medium">
              {learner.xp} XP
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav subrow */}
      <div className="lg:hidden flex items-center gap-4 px-6 py-2 overflow-x-auto border-t border-slate-900 bg-slate-950 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`whitespace-nowrap shrink-0 py-1 ${
              currentTab === item.id
                ? 'text-emerald-400 font-semibold border-b border-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
