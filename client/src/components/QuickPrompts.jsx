import React from 'react';
import { Calendar, FileSpreadsheet, ShieldAlert, FileText, Ban, Layers, Wrench } from 'lucide-react';

export default function QuickPrompts({ onSelectPrompt }) {
  const prompts = [
    {
      icon: <Calendar className="w-3.5 h-3.5 text-sky-600" />,
      label: 'CPM Schedule',
      badge: 'Critical Path',
      text: 'Draft a Critical Path Method (CPM) milestone schedule for a 15-story reinforced concrete residential building, from deep raft foundation to structural topping-out.'
    },
    {
      icon: <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />,
      label: 'BOQ Estimation',
      badge: 'CESMM4 / NRM2',
      text: 'Provide a sample Bill of Quantities (BOQ) unit rate build-up for 500 m³ of C35/45 structural concrete, breaking down materials, labor, pumping plant, and profit.'
    },
    {
      icon: <FileText className="w-3.5 h-3.5 text-purple-600" />,
      label: 'FIDIC Claim',
      badge: 'Clause 20.1',
      text: 'How should a contractor formulate an Extension of Time (EOT) claim with time-impact analysis under FIDIC Red Book Sub-Clause 20.1 due to delayed site possession?'
    },
    {
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />,
      label: 'Site Safety / OSHA',
      badge: 'Excavation HSE',
      text: 'What are the essential OSHA safety protocols and shoring inspection requirements for a 4-meter deep excavation adjacent to existing urban structures?'
    },
    {
      icon: <Wrench className="w-3.5 h-3.5 text-cyan-600" />,
      label: 'Concrete QA/QC',
      badge: 'ACI / ASTM',
      text: 'Explain the quality control procedure for mass concrete raft pouring: slump loss mitigation, thermocouple placement, and temperature differential monitoring.'
    },
    {
      icon: <Ban className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Off-Domain Test',
      badge: 'Guardrail Filter',
      text: 'Can you teach me how to bake an Italian chocolate cake and list the top 5 Hollywood movies of the decade?'
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <Layers className="w-3.5 h-3.5 text-sky-600" /> Civil Engineering Quick Actions
        </span>
        <span className="text-[10px] text-slate-500 font-mono">1-Click Technical Inquiries</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p.text)}
            className="flex flex-col items-start p-2.5 rounded-xl bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-400 text-left transition-all group hover:scale-[1.02] shadow-xs"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="p-1 rounded-md bg-slate-100 group-hover:bg-sky-100 transition-colors">
                {p.icon}
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:text-sky-700 font-medium">
                {p.badge}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-800 group-hover:text-sky-700 transition-colors">
              {p.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
