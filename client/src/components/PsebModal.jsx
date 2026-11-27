import React from 'react';
import { X, Award, CheckCircle2, ShieldCheck, MapPin, Calendar, User, BookOpen } from 'lucide-react';

export default function PsebModal({ isOpen, onClose, traineeName = "Intikhab Ahmad Shah" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-sky-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-2xl shadow-inner">
              🇵🇰
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-100 font-bold block">
                Government of Pakistan • Ministry of IT & Telecom
              </span>
              <h2 className="text-lg font-bold tracking-tight">
                Pakistan Software Export Board (PSEB)
              </h2>
              <p className="text-xs text-emerald-50">
                Official Trainee & Project Accreditation Portfolio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Official "My Cohort" Box (Exact match to official PSEB portal) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>My cohort</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Enrolled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Programme</span>
                <span className="font-semibold text-slate-900">Artificial Intelligence</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Cohort</span>
                <span className="font-semibold text-slate-900">PSEB-AI-ISB-01 (PSEB-AI-ISB-01)</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Status</span>
                <span className="font-semibold text-emerald-700">Enrolled</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Stream</span>
                <span className="font-semibold text-slate-900">AI</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Venue</span>
                <span className="font-semibold text-slate-900">Iqra University – IU, Islamabad</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Lead trainer</span>
                <span className="font-semibold text-slate-900">Mahnoor Salman</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Starts</span>
                <span className="font-semibold text-slate-900">15 Oct 2026</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Ends</span>
                <span className="font-semibold text-slate-900">31 Dec 2026</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Trainee ID</span>
                <span className="font-bold text-amber-700 font-mono">TRN-2026-000059</span>
              </div>
            </div>

            {/* Trainee Name Callout */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Trainee Name:</span>
              <span className="font-extrabold text-slate-900 text-sm tracking-wide">{traineeName}</span>
            </div>
          </div>

          {/* Assignment Submission Criteria Checklist */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Assignment Requirements Checklist
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Domain Focus:</span>
                <p className="text-slate-600 text-[11px]">
                  Civil Project Management (CPM Scheduling, FIDIC Claims, BOQ Estimation, Concrete QA/QC).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">System Prompt & Justification:</span>
                <p className="text-slate-600 text-[11px]">
                  Chartered Civil PM Persona, strict guardrails, Temperature=0.3, Max Tokens=2048.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Working Code & History:</span>
                <p className="text-slate-600 text-[11px]">
                  Multi-turn conversation history buffer, graceful error fallback, 58 notebook cells.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Deployment & Batch Files:</span>
                <p className="text-slate-600 text-[11px]">
                  Interactive 3D BIM Twin, CPM/EVM project controls suite, and verified 1-click batch files.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PSEB Assignment Accreditation Verified</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
