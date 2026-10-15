import React, { useState } from 'react';
import { LearnerProfile } from '../types/workshop';
import {
  Terminal,
  Award,
  FileCode2,
  BookOpen,
  User,
  Briefcase,
  GraduationCap,
  LogOut,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  learner: LearnerProfile;
  onOpenProfile: () => void;
  onSignOff: () => void;
  onResetProgress: () => void;
  onViewFounderNote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  learner,
  onOpenProfile,
  onSignOff,
  onResetProgress,
  onViewFounderNote,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: 'curriculum', label: 'Curriculum (15 Days)', icon: BookOpen },
    { id: 'ide', label: 'Hands-on IDE', icon: FileCode2 },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'final-assessment', label: 'Final Exam (120m)', icon: Clock },
    { id: 'certificate', label: 'Certification', icon: GraduationCap },
    { id: 'interview', label: 'Interview Vault', icon: Briefcase },
    { id: 'mentor', label: 'Mentor Kapil', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E3D8C6] bg-[#F5EFEB]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('curriculum')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EFE5D6] border border-[#D5C4AC] flex items-center justify-center text-[#7C3E1D] group-hover:border-[#7C3E1D] transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="whitespace-nowrap shrink-0">
            <span className="text-base font-bold tracking-tight text-[#24150D] block leading-none">
              Forward Deployed Academy
            </span>
            <span className="text-xs text-[#7A6250] tracking-wide mt-1 block font-mono">
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
                className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#7C3E1D] border-b-2 border-[#7C3E1D] font-bold'
                    : 'text-[#6A5342] hover:text-[#24150D]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: User Profile & Actions Dropdown */}
        <div className="relative flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#3D291C] bg-[#FAF7F2] border border-[#D5C4AC] rounded-lg hover:border-[#7C3E1D] hover:bg-white shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#7C3E1D]" />
            <span className="truncate max-w-[110px] font-semibold text-[#24150D]">
              {learner.name || 'Learner'}
            </span>
            <span className="text-[#B8A388]">·</span>
            <span className="text-[#7C3E1D] font-mono font-bold">
              {learner.completedDays.length}/15
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8C7360] transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#FFFFFF] border-2 border-[#D5C4AC] rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#EFE5D6]">
                <span className="text-[10px] uppercase font-mono text-[#8C7360] block">Signed in as</span>
                <span className="font-bold text-[#24150D] truncate block">{learner.name || 'Anonymous Learner'}</span>
                <span className="text-[11px] text-[#7C3E1D] font-mono block mt-0.5">{learner.xp} XP Earned</span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#4A3528] hover:bg-[#FAF7F2] hover:text-[#24150D] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#8C7360]" />
                  <span>Edit Profile & Track</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onViewFounderNote();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#4A3528] hover:bg-[#FAF7F2] hover:text-[#24150D] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7C3E1D]" />
                  <span>Founder's Welcome Note</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onResetProgress();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#8C4A23] hover:bg-[#FAF7F2] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Progress</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#EFE5D6]">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onSignOff();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#A14725] font-semibold hover:bg-[#FDF0EB] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Off</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav subrow */}
      <div className="lg:hidden flex items-center gap-4 px-6 py-2 overflow-x-auto border-t border-[#E3D8C6] bg-[#F5EFEB] text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`whitespace-nowrap shrink-0 py-1 ${
              currentTab === item.id
                ? 'text-[#7C3E1D] font-bold border-b-2 border-[#7C3E1D]'
                : 'text-[#6A5342]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
