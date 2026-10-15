import React, { useState } from 'react';
import { DayCurriculum, LearnerProfile } from '../types/workshop';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  Zap,
  Shield,
  Play,
  FileCode2,
} from 'lucide-react';
import heroBanner from '../assets/images/fde_command_center_hero_1792041458720.jpg';

interface CurriculumOverviewProps {
  curriculum: DayCurriculum[];
  learner: LearnerProfile;
  onSelectDay: (dayId: number) => void;
  onOpenIDE: () => void;
}

export const CurriculumOverview: React.FC<CurriculumOverviewProps> = ({
  curriculum,
  learner,
  onSelectDay,
  onOpenIDE,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All 15 Days' },
    { id: 'Ingestion & Connectors', label: 'Data Ingestion & CDC (Days 1-3)' },
    { id: 'Ontology & Graph', label: 'Ontology & Knowledge Graphs (Days 4-5)' },
    { id: 'Production AI & RAG', label: 'Production RAG & Agents (Days 6-8)' },
    { id: 'Incident & Operations', label: 'P0 Incident Triage & ABAC (Days 9-11)' },
    { id: 'Architecture & Defense', label: 'Air-Gap & Architecture (Days 12-15)' },
  ];

  const filteredDays = selectedCategory === 'All'
    ? curriculum
    : curriculum.filter((d) => d.category === selectedCategory);

  const completedCount = learner.completedDays.length;
  const progressPct = Math.round((completedCount / 15) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8 bg-[#FBF8F3] text-[#24150D]">
      {/* Hero Banner Section with Cream & Espresso Grading */}
      <div className="relative rounded-2xl overflow-hidden border border-[#D5C4AC] bg-[#231710] shadow-xl">
        <div className="relative h-64 sm:h-76 w-full overflow-hidden">
          <img
            src={heroBanner}
            alt="Forward Deployment Command Center"
            className="w-full h-full object-cover object-center opacity-45 scale-105"
          />
          {/* Measured Scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A110B] via-[#1A110B]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A110B] via-[#1A110B]/80 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#E4C5A0] mb-2 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#E4C5A0]" />
              <span>FORWARD DEPLOYMENT ENGINEERING WORKSHOP · POWERED BY KAPIL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAF6EE] tracking-tight">
              10% Strategic Theory. 90% Hands-On Production Engineering.
            </h1>
            <p className="text-xs sm:text-sm text-[#DDD0C0] mt-2 leading-relaxed">
              Master the exact technical challenges faced by Forward Deployment Engineers at Palantir, Databricks, and Scale AI: schema drift, CDC streams, ontology graphs, P0 outages, and executive defenses.
            </p>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => {
                  onSelectDay(learner.currentDay || 1);
                  onOpenIDE();
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#FAF6EE] bg-[#7C3E1D] hover:bg-[#663216] rounded-lg shadow-md transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Day {learner.currentDay || 1} in IDE</span>
              </button>
              <div className="text-xs text-[#C8B8A4] font-mono">
                Learner: <span className="text-[#FAF6EE] font-semibold">{learner.name || 'Anonymous'}</span> · Track: <span className="text-[#E4C5A0]">{learner.targetRole}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Strip in Warm Cream */}
        <div className="border-t border-[#38261B] bg-[#2A1C14] p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#A89480] block text-[11px]">Bootcamp Progress</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-[#3F2B1F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D49E6A] rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[#FAF6EE] font-bold">{progressPct}%</span>
            </div>
          </div>
          <div>
            <span className="text-[#A89480] block text-[11px]">Days Completed</span>
            <span className="text-base font-bold text-[#FAF6EE] mt-0.5 block">
              {completedCount} <span className="text-xs text-[#8F7A66] font-normal">/ 15 Days</span>
            </span>
          </div>
          <div>
            <span className="text-[#A89480] block text-[11px]">Earned FDE XP</span>
            <span className="text-base font-bold text-[#E4C5A0] mt-0.5 block">
              {learner.xp} <span className="text-xs text-[#8F7A66] font-normal">XP</span>
            </span>
          </div>
          <div>
            <span className="text-[#A89480] block text-[11px]">Milestone Badges</span>
            <span className="text-base font-bold text-[#D49E6A] mt-0.5 block">
              {learner.earnedBadges.length} <span className="text-xs text-[#8F7A66] font-normal">/ 6 Badges</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-medium">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors border ${
              selectedCategory === cat.id
                ? 'bg-[#7C3E1D] text-[#FAF6EE] border-[#7C3E1D] font-bold shadow-xs'
                : 'bg-[#FAF7F2] border-[#D5C4AC] text-[#5C4535] hover:text-[#24150D] hover:border-[#7C3E1D]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 15 Days Interactive Grid in Warm Cream and Mocha */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDays.map((dayItem) => {
          const isDone = learner.completedDays.includes(dayItem.id);
          const isCurrent = learner.currentDay === dayItem.id;

          return (
            <div
              key={dayItem.id}
              className={`rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs ${
                isDone
                  ? 'bg-[#FFFFFF] border-[#7C3E1D]/50 ring-1 ring-[#7C3E1D]/20'
                  : isCurrent
                  ? 'bg-[#FAF7F2] border-[#7C3E1D] shadow-md ring-2 ring-[#7C3E1D]/30'
                  : 'bg-[#FFFFFF] border-[#E3D8C6] hover:border-[#C4B29A]'
              }`}
            >
              <div className="p-5 space-y-3">
                {/* Header row: Day # & Status */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#7C3E1D] font-bold">
                    DAY {dayItem.id.toString().padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8C7360] text-[11px] font-mono">
                      +{dayItem.xpReward} XP
                    </span>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2E5A27] bg-[#EAF2E8] px-2 py-0.5 rounded border border-[#C5DEC0]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5A27]" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[#8C7360] text-[11px]">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-bold text-[#24150D] group-hover:text-[#7C3E1D] transition-colors leading-snug">
                    {dayItem.title}
                  </h3>
                  <p className="text-xs text-[#5C4535] mt-1 line-clamp-2">
                    {dayItem.subtitle}
                  </p>
                </div>

                {/* Client Context */}
                <div className="pt-2 border-t border-[#EFE5D6] text-[11px] text-[#5C4535] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8C7360]">Client:</span>
                    <span className="text-[#3D291C] font-medium truncate max-w-[180px]">
                      {dayItem.clientContext.clientName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8C7360]">Language:</span>
                    <span className="font-mono text-[#7C3E1D] font-semibold">
                      {dayItem.fileName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="p-3.5 bg-[#FAF7F2] border-t border-[#E3D8C6] flex items-center justify-between">
                <span className="text-[11px] text-[#8C7360] font-mono">
                  {dayItem.testCases.length} Test Assertions
                </span>
                <button
                  onClick={() => {
                    onSelectDay(dayItem.id);
                    onOpenIDE();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isDone
                      ? 'bg-[#EFE7DA] text-[#3D291C] hover:bg-[#E3D5C2]'
                      : 'bg-[#7C3E1D] text-[#FAF6EE] hover:bg-[#663216] shadow-xs'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Review Code' : 'Launch in IDE'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
