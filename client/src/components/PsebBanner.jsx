import React from 'react';
import { Award, UserCheck, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

export default function PsebBanner({ onOpenModal, traineeName = "Intikhab Alam" }) {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-sky-950/60 border-b border-emerald-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: PSEB Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs tracking-wider">
            🇵🇰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-300 tracking-wide uppercase">
                Pakistan Software Export Board (PSEB)
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MoITT Certified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              IT Industry Development & AI Capacity Building Initiative • Capstone Project
            </p>
          </div>
        </div>

        {/* Center: Trainee Details Badge */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700/60 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Trainee:</span>
            <span className="text-amber-300 font-bold">{traineeName}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">Track: Civil AI & Smart PM</span>
          </div>
        </div>

        {/* Right: Portfolio Modal Trigger */}
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-all font-medium text-xs shadow-sm hover:shadow-emerald-500/10"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>PSEB Portfolio Card</span>
        </button>
      </div>
    </div>
  );
}
