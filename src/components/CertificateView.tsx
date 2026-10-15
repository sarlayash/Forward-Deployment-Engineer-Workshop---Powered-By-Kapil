import React, { useRef } from 'react';
import { LearnerProfile } from '../types/workshop';
import {
  GraduationCap,
  Download,
  Share2,
  CheckCircle2,
  Award,
  Sparkles,
  ShieldCheck,
  Printer,
  Copy,
} from 'lucide-react';

interface CertificateViewProps {
  learner: LearnerProfile;
  totalDays: number;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ learner, totalDays }) => {
  const isFullyCompleted = learner.completedDays.length >= totalDays;
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyVerification = () => {
    const text = `https://fde-academy.io/verify/${learner.certificateId}`;
    navigator.clipboard?.writeText(text);
    alert(`Certificate Verification URL copied to clipboard: ${text}`);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Verifiable Professional Certification
              </h2>
              {isFullyCompleted ? (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                  OFFICIALLY ISSUED
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                  IN PROGRESS ({learner.completedDays.length}/{totalDays} DAYS)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Issued upon completion of all 15 hands-on enterprise engineering modules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyVerification}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:text-white hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy ID: {learner.certificateId}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Certificate Container */}
      <div
        ref={certificateRef}
        className="relative rounded-2xl border-4 border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-14 text-center shadow-2xl overflow-hidden print:m-0 print:border-black print:p-8"
      >
        {/* Subtle geometric background watermark lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Header */}
        <div className="space-y-2 mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            <Award className="w-4 h-4" />
            <span>FORWARD DEPLOYMENT ACADEMY · POWERED BY KAPIL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif uppercase">
            Certificate of Engineering Excellence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wider">
            FORWARD DEPLOYMENT SYSTEMS ARCHITECT · CERTIFICATION PROGRAM
          </p>
        </div>

        {/* Main Body Statement */}
        <div className="space-y-6 max-w-2xl mx-auto my-8 relative z-10">
          <p className="text-xs sm:text-sm text-slate-400 font-serif italic">
            This is to certify that
          </p>

          <div className="border-b-2 border-amber-500/60 pb-3">
            <span className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-wide font-serif">
              {learner.name || 'Forward Deployed Engineer'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            has successfully completed the intensive 15-day Forward Deployment Engineer Bootcamp with <span className="font-semibold text-white">90% hands-on laboratory implementation</span>, demonstrating verified mastery in enterprise data ingestion, knowledge graph ontologies, production AI guardrails, high-pressure P0 incident remediation, and mission-critical system design.
          </p>
        </div>

        {/* Competencies Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto py-6 border-y border-slate-800/80 text-[11px] font-mono text-slate-300 relative z-10">
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-0.5">VERIFIED</span>
            <span>Data Ingestion & CDC</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-0.5">VERIFIED</span>
            <span>Ontology & Graphs</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-0.5">VERIFIED</span>
            <span>Production AI / RAG</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-0.5">VERIFIED</span>
            <span>P0 Incident Triage</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-emerald-400 font-bold block mb-0.5">VERIFIED</span>
            <span>Air-Gapped Systems</span>
          </div>
        </div>

        {/* Golden Seal & Signatures Footer */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-8 max-w-3xl mx-auto relative z-10">
          {/* Issue Date & Hash */}
          <div className="text-left space-y-1 font-mono text-xs">
            <span className="text-slate-500 block">Date of Issue:</span>
            <span className="text-white font-semibold block">{formattedDate}</span>
            <span className="text-slate-500 block text-[10px] mt-1">Verification Hash:</span>
            <span className="text-amber-400 font-bold text-[11px] block">{learner.certificateId}</span>
          </div>

          {/* Golden Seal Generated Asset */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-xl shadow-amber-500/20 shrink-0">
            <img
              src="/src/assets/images/fde_cert_gold_emblem_1792041458799.jpg"
              alt="Engineering Excellence Golden Crest"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Mentor Signature */}
          <div className="text-right space-y-1">
            <div className="font-serif italic text-lg sm:text-xl text-amber-200 border-b border-slate-700 pb-1">
              Kapil Narula
            </div>
            <span className="text-xs text-white font-bold block">
              Kapil Narula
            </span>
            <span className="text-[11px] text-slate-400 font-mono block">
              Founding Forward Deployment Mentor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
