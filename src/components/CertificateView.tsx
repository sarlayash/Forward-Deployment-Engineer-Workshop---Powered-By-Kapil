import React, { useRef, useState } from 'react';
import { LearnerProfile } from '../types/workshop';
import { exportCertificateToPng } from '../utils/pngExport';
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
  Lock,
  Play,
  AlertTriangle,
} from 'lucide-react';
import goldEmblem from '../assets/images/fde_cert_gold_emblem_1792041458799.jpg';

interface CertificateViewProps {
  learner: LearnerProfile;
  totalDays: number;
  onGoToFinalAssessment: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  learner,
  totalDays,
  onGoToFinalAssessment,
}) => {
  const isPassed = learner.finalAssessmentPassed;
  const score = learner.finalAssessmentScore || 0;
  const attempts = learner.finalAssessmentAttempts || 0;

  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleDownloadPng = async () => {
    if (!isPassed) {
      alert('Certificate is locked. You must complete the Final Assessment with ≥90% score first.');
      return;
    }
    try {
      setIsExporting(true);
      await exportCertificateToPng({
        learnerName: learner.name || 'Forward Deployment Engineer',
        certificateId: learner.certificateId,
        score: Math.max(score, 90),
      });
    } catch (err) {
      console.error('PNG export failed:', err);
      alert('Failed to generate PNG certificate. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!isPassed) {
      alert('Certificate is locked until passing the 120-minute Final Assessment with ≥90% score.');
      return;
    }
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
    <div className="w-full max-w-5xl mx-auto px-6 py-8 space-y-8 bg-[#FBF8F3] text-[#24150D]">
      {/* Top Lock / Issuance Status Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 shadow-xs transition-all ${
          isPassed
            ? 'bg-[#FAF7F2] border-[#2E5A27]'
            : 'bg-[#FDF6ED] border-[#8C4A23]'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
              isPassed
                ? 'bg-[#EAF2E8] border border-[#2E5A27] text-[#2E5A27]'
                : 'bg-[#FBEFE0] border border-[#8C4A23] text-[#8C4A23]'
            }`}
          >
            {isPassed ? <GraduationCap className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#24150D]">
                {isPassed
                  ? 'Verifiable Professional Certification · Officially Issued'
                  : 'Official FDE Certification · Locked'}
              </h2>
              {isPassed ? (
                <span className="text-[10px] font-bold text-[#2E5A27] bg-[#EAF2E8] px-2.5 py-0.5 rounded-full border border-[#C5DEC0]">
                  PASSED ({score}%)
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-[#8C4A23] bg-[#FBEFE0] px-2 py-0.5 rounded border border-[#D5A872]">
                  LOCKED (REQ FINAL EXAM ≥90%)
                </span>
              )}
            </div>
            <p className="text-xs text-[#5C4535] mt-0.5">
              {isPassed
                ? 'Passed the 120-minute, 300 MCQ Final Examination with distinction. Verifiable worldwide.'
                : `Requires ≥90% score on the 120-minute Final Assessment (300 MCQs). Attempts used: ${attempts}/2 (Max 1 re-attempt).`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {!isPassed ? (
            <button
              onClick={onGoToFinalAssessment}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#7C3E1D] hover:bg-[#663216] rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Take Final Exam (120m / 300 MCQs)</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCopyVerification}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#3D291C] bg-[#FAF7F2] hover:bg-white rounded-lg border border-[#D5C4AC] hover:border-[#7C3E1D] transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ID: {learner.certificateId}</span>
              </button>
              <button
                onClick={handleDownloadPng}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#FAF6EE] bg-[#2E5A27] hover:bg-[#23461E] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Generating PNG...' : 'Download Certificate (PNG)'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#3D291C] bg-white border border-[#D5C4AC] hover:border-[#7C3E1D] rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* The Printable Certificate Container in Luxury Warm Parchment */}
      <div className="relative rounded-2xl border-4 border-[#8C4A23] bg-gradient-to-b from-[#FDFBF7] via-[#F9F5EC] to-[#FDFBF7] p-8 sm:p-14 text-center shadow-xl overflow-hidden print:m-0 print:border-black print:p-8">
        {/* Subtle geometric background watermark lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#8C4A23_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Locked Watermark Overlay if not yet passed */}
        {!isPassed && (
          <div className="absolute inset-0 z-30 bg-[#FAF7F2]/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border-2 border-[#8C4A23] flex items-center justify-center text-[#7C3E1D] shadow-lg mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#24150D] tracking-tight">
              Official Credential Locked
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4535] max-w-lg mt-2 leading-relaxed">
              This certificate is locked until you complete the <strong>120-Minute Final Assessment</strong> (300 MCQs, 80% Hard) with a score of <strong>90% or higher</strong>.
            </p>
            <div className="mt-2 text-xs font-mono text-[#7C3E1D]">
              Current Status: {attempts === 0 ? 'Not yet attempted' : `Score: ${score}% (Attempts: ${attempts}/2)`}
            </div>
            <button
              onClick={onGoToFinalAssessment}
              className="mt-6 flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-[#7C3E1D] hover:bg-[#663216] rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Take 120-Minute Final Assessment</span>
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="space-y-2 mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#7C3E1D] uppercase">
            <Award className="w-4 h-4" />
            <span>FORWARD DEPLOYMENT ACADEMY · POWERED BY KAPIL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#24150D] tracking-tight font-serif uppercase">
            Certificate of Engineering Excellence
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6250] font-mono tracking-wider">
            FORWARD DEPLOYMENT SYSTEMS ARCHITECT · CERTIFICATION PROGRAM
          </p>
        </div>

        {/* Main Body Statement */}
        <div className="space-y-6 max-w-2xl mx-auto my-8 relative z-10">
          <p className="text-xs sm:text-sm text-[#5C4535] font-serif italic">
            This is to certify that
          </p>

          <div className="border-b-2 border-[#8C4A23] pb-3">
            <span className="text-2xl sm:text-4xl font-extrabold text-[#3A1E0D] tracking-wide font-serif">
              {learner.name || 'Forward Deployed Engineer'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#3D291C] leading-relaxed font-sans">
            has successfully completed the intensive 15-day Forward Deployment Engineer Bootcamp and passed the 120-Minute Comprehensive Architecture Examination with a verified score of <span className="font-bold text-[#24150D]">{score || 90}%</span>, demonstrating certified mastery in enterprise dirty data ingestion, knowledge graph ontologies, production AI guardrails, high-pressure P0 incident remediation, and mission-critical system design.
          </p>
        </div>

        {/* Competencies Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto py-6 border-y border-[#D5C4AC] text-[11px] font-mono text-[#3D291C] relative z-10">
          <div className="p-2 bg-[#FFFFFF] rounded border border-[#E3D8C6] shadow-2xs">
            <span className="text-[#2E5A27] font-bold block mb-0.5">VERIFIED</span>
            <span>Data Ingestion & CDC</span>
          </div>
          <div className="p-2 bg-[#FFFFFF] rounded border border-[#E3D8C6] shadow-2xs">
            <span className="text-[#2E5A27] font-bold block mb-0.5">VERIFIED</span>
            <span>Ontology & Graphs</span>
          </div>
          <div className="p-2 bg-[#FFFFFF] rounded border border-[#E3D8C6] shadow-2xs">
            <span className="text-[#2E5A27] font-bold block mb-0.5">VERIFIED</span>
            <span>Production AI / RAG</span>
          </div>
          <div className="p-2 bg-[#FFFFFF] rounded border border-[#E3D8C6] shadow-2xs">
            <span className="text-[#2E5A27] font-bold block mb-0.5">VERIFIED</span>
            <span>P0 Incident Triage</span>
          </div>
          <div className="p-2 bg-[#FFFFFF] rounded border border-[#E3D8C6] shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[#2E5A27] font-bold block mb-0.5">VERIFIED</span>
            <span>Air-Gapped Systems</span>
          </div>
        </div>

        {/* Golden Seal & Signatures Footer */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-8 max-w-3xl mx-auto relative z-10">
          {/* Issue Date & Hash */}
          <div className="text-left space-y-1 font-mono text-xs">
            <span className="text-[#7A6250] block">Date of Issue:</span>
            <span className="text-[#24150D] font-bold block">{formattedDate}</span>
            <span className="text-[#7A6250] block text-[10px] mt-1">Verification Hash:</span>
            <span className="text-[#7C3E1D] font-bold text-[11px] block">{learner.certificateId}</span>
          </div>

          {/* Golden Seal Generated Asset */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#8C4A23] shadow-lg shadow-[#8C4A23]/20 shrink-0">
            <img
              src={goldEmblem}
              alt="Engineering Excellence Golden Crest"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mentor Signature */}
          <div className="text-right space-y-1">
            <div className="font-serif italic text-lg sm:text-xl text-[#3A1E0D] border-b border-[#D5C4AC] pb-1">
              Kapil Narula
            </div>
            <span className="text-xs text-[#24150D] font-bold block">
              Kapil Narula
            </span>
            <span className="text-[11px] text-[#7A6250] font-mono block">
              Founding Forward Deployment Mentor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
