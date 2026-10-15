import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Maximize2,
  X,
  RotateCcw,
  LogOut,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import kapilLaunchPoster from '../assets/images/Kapil_launch_FDE.png';

interface FounderWelcomeViewProps {
  onAgreeAndProceed: () => void;
  onReset?: () => void;
  onSignOff?: () => void;
}

export const FounderWelcomeView: React.FC<FounderWelcomeViewProps> = ({
  onAgreeAndProceed,
  onReset,
  onSignOff,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#24150D] flex flex-col justify-between items-center py-8 px-4 sm:px-6">
      {/* Top Header Card */}
      <header className="w-full max-w-4xl bg-[#FFFFFF] border-2 border-[#D5C4AC] rounded-2xl shadow-md overflow-hidden mb-6">
        <div className="px-5 sm:px-8 py-3.5 bg-[#F5EFEB] border-b border-[#E3D8C6] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#7C3E1D] font-bold">
            <Terminal className="w-4 h-4 text-[#7C3E1D]" />
            <span>FORWARD DEPLOYMENT ACADEMY · OFFICIAL FOUNDER INITIATION</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-[#8C7360] hidden sm:inline">
              Class of 2026 · Batch 01
            </span>

            {onReset && (
              <button
                onClick={onReset}
                title="Reset Workshop Progress"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#EFE8DC] text-[#7C3E1D] font-mono font-medium border border-[#D5C4AC] transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {onSignOff && (
              <button
                onClick={onSignOff}
                title="Sign Off"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#EFE8DC] text-[#5C4535] font-mono font-medium border border-[#D5C4AC] transition cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Off</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Single Poster Presentation - Strictly Locked & Unedited */}
      <main className="w-full max-w-3xl flex flex-col items-center">
        {/* Poster Showcase Container */}
        <div className="w-full relative rounded-2xl border-2 border-[#D5C4AC] overflow-hidden shadow-2xl bg-[#1C140E]">
          {/* Top Bar of the Poster Frame with Locked Badge */}
          <div className="px-4 py-2.5 bg-[#2A1D15] border-b border-[#4A3528] flex items-center justify-between text-xs text-[#E4C5A0]">
            <div className="flex items-center gap-2 font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C98A4B]" />
              <span>OFFICIAL FOUNDER LAUNCH POSTER</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#231710] text-[#E4C5A0] text-[11px] font-mono border border-[#4A3528]">
                <Lock className="w-3 h-3 text-[#C98A4B]" />
                <span className="font-semibold">LOCKED · AUTHENTIC</span>
              </span>

              <button
                onClick={() => setIsFullscreen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#3B291D] hover:bg-[#4E3727] text-[#FAF6EE] text-[11px] font-mono border border-[#5C4535] transition cursor-pointer"
                title="View Fullscreen"
              >
                <Maximize2 className="w-3 h-3 text-[#E4C5A0]" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>
          </div>

          {/* The Poster Image (Rendered in full without cropping or artificial edits) */}
          <div className="relative w-full flex justify-center items-center bg-[#1C140E] p-2 sm:p-4">
            <img
              src={kapilLaunchPoster}
              alt="Kapil Narula - Forward Deployment Engineer Launch Poster & Founder Note"
              className="w-full h-auto max-h-[82vh] object-contain rounded-lg shadow-lg cursor-zoom-in select-none"
              onClick={() => setIsFullscreen(true)}
            />
          </div>

          {/* Bottom Verification Caption */}
          <div className="px-4 py-2.5 bg-[#1C140E] border-t border-[#3B291D] flex items-center justify-between text-[11px] font-mono text-[#A89480]">
            <span className="flex items-center gap-1.5 text-[#E4C5A0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C98A4B]" />
              <span>Kapil_launch_FDE.png · Official Founding Mentor Poster</span>
            </span>
            <span className="text-[#DDD0C0] hidden sm:inline">
              Click image to enlarge full resolution
            </span>
          </div>
        </div>

        {/* Agreement & Progression Bar */}
        <div className="w-full mt-6 bg-[#FFFFFF] border-2 border-[#D5C4AC] rounded-2xl shadow-xl p-5 sm:p-6 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#7C3E1D] border-[#D5C4AC] rounded focus:ring-[#7C3E1D] accent-[#7C3E1D] cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-[#24150D] block">
                I have read the Founder's Launch Note & Honor Code
              </span>
              <span className="text-xs text-[#5C4535] leading-relaxed block">
                I commit to rigorous production engineering standards, 90% hands-on laboratory exercises, and SLA compliance across the 15-day workshop.
              </span>
            </div>
          </label>

          <button
            disabled={!agreed}
            onClick={onAgreeAndProceed}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold rounded-xl transition-all shadow-md ${
              agreed
                ? 'bg-[#7C3E1D] hover:bg-[#663216] text-[#FAF6EE] cursor-pointer hover:shadow-lg'
                : 'bg-[#E5DDD0] text-[#A89480] cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I Agree and Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Lightbox / Fullscreen Modal */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-center items-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition cursor-pointer"
            title="Close Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl max-h-[92vh] overflow-auto rounded-xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={kapilLaunchPoster}
              alt="Founder Launch Poster Fullscreen"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
