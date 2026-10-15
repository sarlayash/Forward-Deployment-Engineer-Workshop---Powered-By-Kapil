import React, { useState } from 'react';
import { DayCurriculum, LearnerProfile, WorkshopCategory } from '../types/workshop';
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
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Hero Banner Section with Generated Image */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src="/src/assets/images/fde_command_center_hero_1792041458720.jpg"
            alt="Forward Deployment Command Center"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Measured Scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FORWARD DEPLOYMENT ENGINEERING WORKSHOP · POWERED BY KAPIL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              10% Strategic Theory. 90% Hands-On Production Engineering.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Master the exact technical challenges faced by Forward Deployment Engineers at Palantir, Databricks, and Scale AI: schema drift, CDC streams, ontology graphs, P0 outages, and executive defenses.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  onSelectDay(learner.currentDay || 1);
                  onOpenIDE();
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Day {learner.currentDay || 1} in IDE</span>
              </button>
              <div className="text-xs text-slate-400 font-mono">
                Learner: <span className="text-white font-semibold">{learner.name || 'Anonymous'}</span> · Track: <span className="text-emerald-400">{learner.targetRole}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="border-t border-slate-800/80 bg-slate-900/60 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[11px]">Bootcamp Progress</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-white font-bold">{progressPct}%</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Days Completed</span>
            <span className="text-base font-bold text-white mt-0.5 block">
              {completedCount} <span className="text-xs text-slate-500 font-normal">/ 15 Days</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Earned FDE XP</span>
            <span className="text-base font-bold text-amber-400 mt-0.5 block">
              {learner.xp} <span className="text-xs text-slate-500 font-normal">XP</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Milestone Badges</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">
              {learner.earnedBadges.length} <span className="text-xs text-slate-500 font-normal">/ 6 Badges</span>
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
                ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 font-semibold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 15 Days Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDays.map((dayItem) => {
          const isDone = learner.completedDays.includes(dayItem.id);
          const isCurrent = learner.currentDay === dayItem.id;

          return (
            <div
              key={dayItem.id}
              className={`rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isDone
                  ? 'bg-slate-900/80 border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                  : isCurrent
                  ? 'bg-slate-900 border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="p-5 space-y-3">
                {/* Header row: Day # & Status */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">
                    DAY {dayItem.id.toString().padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px] font-mono">
                      +{dayItem.xpReward} XP
                    </span>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {dayItem.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {dayItem.subtitle}
                  </p>
                </div>

                {/* Client Context Pill-free */}
                <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Client:</span>
                    <span className="text-slate-300 font-medium truncate max-w-[180px]">
                      {dayItem.clientContext.clientName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Language:</span>
                    <span className="font-mono text-emerald-400">
                      {dayItem.fileName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="p-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {dayItem.testCases.length} Test Assertions
                </span>
                <button
                  onClick={() => {
                    onSelectDay(dayItem.id);
                    onOpenIDE();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isDone
                      ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                      : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
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
