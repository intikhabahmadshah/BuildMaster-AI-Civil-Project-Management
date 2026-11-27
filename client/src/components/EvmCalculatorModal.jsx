import React, { useState } from 'react';
import { X, Calculator, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';

export default function EvmCalculatorModal({ isOpen, onClose, onInjectIntoChat }) {
  const [pv, setPv] = useState(500000);
  const [ev, setEv] = useState(420000);
  const [ac, setAc] = useState(460000);
  const [bac, setBac] = useState(1000000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const calculateEVM = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/evm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plannedValue: pv,
          earnedValue: ev,
          actualCost: ac,
          budgetAtCompletion: bac
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('EVM Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToChat = () => {
    if (!result) return;
    const text = `Please analyze our current project EVM status: Planned Value (PV) = $${pv.toLocaleString()}, Earned Value (EV) = $${ev.toLocaleString()}, and Actual Cost (AC) = $${ac.toLocaleString()} with Budget at Completion (BAC) = $${bac.toLocaleString()}. The computed CPI is ${result.metrics.cpi} (${result.status.costStatus}) and SPI is ${result.metrics.spi} (${result.status.scheduleStatus}). What specific schedule recovery and cost mitigation strategies under standard Civil PM protocols do you recommend?`;
    onInjectIntoChat(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 to-sky-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Earned Value Management (EVM) Calculator
              </h2>
              <p className="text-xs text-sky-100">
                Civil Project Controls • Cost & Schedule Performance Indices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-600 font-semibold block mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-sky-600" /> Planned Value (PV):
              </label>
              <input
                type="number"
                value={pv}
                onChange={(e) => setPv(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-semibold block mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Earned Value (EV):
              </label>
              <input
                type="number"
                value={ev}
                onChange={(e) => setEv(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-semibold block mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Actual Cost (AC):
              </label>
              <input
                type="number"
                value={ac}
                onChange={(e) => setAc(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-semibold block mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-purple-600" /> Budget At Completion (BAC):
              </label>
              <input
                type="number"
                value={bac}
                onChange={(e) => setBac(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500"
              />
            </div>
          </div>

          <button
            onClick={calculateEVM}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{loading ? 'Computing EVM Metrics...' : 'Calculate Project Health Indices'}</span>
          </button>

          {/* Results Box */}
          {result && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 block">COST VARIANCE (CV)</span>
                  <span className={`text-sm font-bold ${result.metrics.cv >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ${result.metrics.cv.toLocaleString()}
                  </span>
                </div>

                <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 block">SCHEDULE VARIANCE (SV)</span>
                  <span className={`text-sm font-bold ${result.metrics.sv >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ${result.metrics.sv.toLocaleString()}
                  </span>
                </div>

                <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 block">COST INDEX (CPI)</span>
                  <span className={`text-sm font-bold ${result.metrics.cpi >= 1 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {result.metrics.cpi}
                  </span>
                </div>

                <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 block">SCHED INDEX (SPI)</span>
                  <span className={`text-sm font-bold ${result.metrics.spi >= 1 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {result.metrics.spi}
                  </span>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    result.status.costStatus === 'UNDER BUDGET' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    result.status.costStatus === 'ON BUDGET' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                    'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {result.status.costStatus}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    result.status.scheduleStatus === 'AHEAD OF SCHEDULE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    result.status.scheduleStatus === 'ON SCHEDULE' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                    'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {result.status.scheduleStatus}
                  </span>
                </div>

                <button
                  onClick={handleSendToChat}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs transition-colors shadow-xs"
                >
                  <span>Consult BuildMaster AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
