import React, { useState } from 'react';
import {
  Terminal,
  Sparkles,
  Shield,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export const MentorKapilView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<number>(0);

  const kapilRules = [
    {
      number: '01',
      title: "Solve the Client's Actual Bottleneck, Not the Theoretical One",
      description: "Junior engineers want to build complex distributed microservices when the client simply has an unindexed SQL query causing 95% of their latency. Keep it simple and fix the real bleed.",
    },
    {
      number: '02',
      title: 'Never Run Unbounded External Network Calls Inside Database Transactions',
      description: "If your code calls an external payment gateway, KYC API, or LLM while holding an open database transaction, you will exhaust your connection pool during the first traffic spike. Decouple them immediately.",
    },
    {
      number: '03',
      title: 'Client Schemas Are Untrusted by Default',
      description: "Assume upstream databases will rename fields, swap date formats, and inject string 'NULL' tokens without warning. Always establish a Dead Letter Queue (DLQ) quarantine rather than crashing the pipeline.",
    },
    {
      number: '04',
      title: 'Pre-Filter Security Access in Enterprise RAG; Never Post-Filter',
      description: "If you retrieve 10 chunks from a vector database and 9 are discarded due to security clearances, your LLM has no context. Pre-filter by tenant and clearance at the vector storage level.",
    },
    {
      number: '05',
      title: 'In a 3:00 AM P0 Outage: Mitigate First, Root-Cause Second',
      description: "When the client VP is on the phone and $10,000 is lost per minute, shed load, rollback, or restart the pod. Do not sit on the call reading 5,000 lines of git diff trying to find the single bug.",
    },
    {
      number: '06',
      title: 'Executives Do Not Buy Technology; They Buy Risk Elimination',
      description: "Never pitch an executive on 'Vector Clocks' or 'Kubernetes Operators'. Pitch them on 'Zero missing packages during peak holiday surge and $14M saved in inventory shrinkage.'",
    },
    {
      number: '07',
      title: 'An Elite Forward Deployment Engineer Is a Triple Threat',
      description: "You must be capable of writing production-grade systems code, architecting enterprise data topologies, and de-escalating an agitated Fortune 500 CTO in a live steering committee.",
    },
  ];

  const fieldQuestions = [
    {
      question: "How should an FDE navigate an angry client stakeholder who hates our company?",
      answer: "Never take it personally. Stakeholder anger is almost always driven by fear: they feel their budget or job is on the line because a project was delayed. The fastest way to turn them into an ally is to deliver one small, unassailable quick win within 48 hours and give them full credit in front of their boss.",
    },
    {
      question: "What is the key difference between a Software Engineer (SWE) and a Forward Deployment Engineer (FDE)?",
      answer: "A standard SWE builds software against clear product requirements within their own internal company cloud. An FDE builds, customizes, and deploys mission-critical software directly inside hostile, ambiguous, and heavily regulated client environments (banks, hospitals, defense networks) where requirements change hourly.",
    },
    {
      question: "When should I choose between Palantir, Scale AI, and Databricks?",
      answer: "Palantir excels at mission-critical enterprise ontologies, defense, and C-suite operational transformation. Scale AI is ideal if you want to deploy frontier autonomous AI and data annotation pipelines. Databricks is the king of massive-scale lakehouse data engineering and Spark analytics.",
    },
    {
      question: "How do I avoid burnout as an FDE with heavy travel?",
      answer: "Ruthlessly automate repetitive deployment chores. Build your own library of reusable connectors and test fixtures. And establish clear non-negotiable boundaries on post-deployment monitoring so you are not glued to Slack 24/7.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-10">
      {/* Mentor Hero Card with Generated Portrait Asset */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Portrait Column */}
          <div className="md:col-span-5 relative min-h-[320px] bg-slate-950">
            <img
              src="/src/assets/images/mentor_kapil_narula_1792041458811.jpg"
              alt="Kapil Narula - Forward Deployment Lead"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent md:hidden" />
          </div>

          {/* Bio & Intro Column */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FOUNDING MENTOR & ENTERPRISE ARCHITECT</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Kapil Narula
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Forward Deployment Leader · Enterprise Solutions Architect · Systems Strategist
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              "I built this 15-day workshop because enterprise engineering cannot be learned from generic LeetCode tutorials. Real Forward Deployment happens on the frontlines: debugging 2:00 AM connection pool deadlocks, stitching together dirty healthcare records, and deploying air-gapped AI into classified defense enclaves."
            </p>

            <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[11px]">Philosophy</span>
                <span className="text-emerald-400 font-bold">10% Theory / 90% Hands-On</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Curriculum</span>
                <span className="text-white font-bold">15 Production Modules</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Output</span>
                <span className="text-amber-400 font-bold">L5/L6 Ready FDE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 7 Inviolable Rules */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Shield className="w-4 h-4" />
            <span>THE FDE CODE OF CONDUCT</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Kapil's 7 Inviolable Rules of Forward Deployment
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kapilRules.map((rule) => (
            <div
              key={rule.number}
              className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
            >
              <span className="text-xs font-mono font-bold text-emerald-400">
                RULE {rule.number}
              </span>
              <h3 className="text-sm font-bold text-white leading-snug">
                {rule.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Field Questions & Strategic Advice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>DIRECT FIELD INTELLIGENCE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Ask Kapil: Real-World Scenarios
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Selected wisdom from high-stakes deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-2">
            {fieldQuestions.map((fq, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTopic(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedTopic === idx
                    ? 'bg-slate-800 border-emerald-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {fq.question}
              </button>
            ))}
          </div>

          <div className="md:col-span-7 p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              Kapil's Field Counsel:
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              "{fieldQuestions[selectedTopic].answer}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
