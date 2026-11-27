import React from 'react';
import { Award, UserCheck, CheckCircle2, ShieldCheck, MapPin, Calendar, User, ExternalLink } from 'lucide-react';

export default function PsebFooter({ onOpenModal, traineeName = "Intikhab Ahmad Shah" }) {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto shadow-inner">
      {/* 1. Official PSEB Trainee Accreditation Bar */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-slate-50 to-sky-50/80 border-b border-emerald-100 px-4 py-3 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* PSEB & Candidate Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              🇵🇰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-emerald-800 tracking-wide uppercase text-xs">
                  Pakistan Software Export Board (PSEB)
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Enrolled
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ministry of IT & Telecom • Programme: <span className="text-slate-700 font-medium">Artificial Intelligence (Stream: AI)</span>
              </p>
            </div>
          </div>

          {/* Key Cohort & Student Info Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-slate-500">Trainee:</span>
              <span className="text-slate-900 font-bold">{traineeName}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500">ID:</span>
              <span className="text-amber-700 font-bold">TRN-2026-000059</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-xs hidden md:flex">
              <span className="text-slate-500">Cohort:</span>
              <span className="text-sky-700 font-bold">PSEB-AI-ISB-01</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-xs hidden lg:flex">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-700">Iqra University (IU), Islamabad</span>
            </div>
          </div>

          {/* Modal Button */}
          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-emerald-600/20"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>View Verified Portfolio</span>
          </button>
        </div>
      </div>

      {/* 2. Secondary Footer Credits */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
        <div>
          BuildMaster AI • Lead Trainer: <span className="text-slate-700 font-medium">Mahnoor Salman</span> • Duration: <span className="text-slate-700">15 Oct 2026 – 31 Dec 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Specialized Domain: Civil Engineering & Project Controls</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">BuildMaster AI Enterprise Edition</span>
        </div>
      </div>
    </footer>
  );
}
