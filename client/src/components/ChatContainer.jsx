import React, { useRef, useEffect, useState } from 'react';
import { Send, User, Copy, Check, Download, Trash2, HardHat, Info } from 'lucide-react';

export default function ChatContainer({
  messages,
  input,
  setInput,
  onSendMessage,
  isLoading,
  onClearChat,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens
}) {
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExport = (format) => {
    let content = '';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let filename = `BuildMaster_AI_Site_Log_${timestamp}`;

    if (format === 'json') {
      content = JSON.stringify(messages, null, 2);
      filename += '.json';
    } else {
      content = `# BuildMaster AI - Civil Project Management Consultation Log\n`;
      content += `Date: ${new Date().toLocaleString()}\n`;
      content += `Domain: Civil Engineering, FIDIC, CPM, BOQ & Site Safety\n\n---\n\n`;
      messages.forEach((m) => {
        content += `### ${m.role === 'user' ? 'Civil Engineer / PM' : 'BuildMaster AI (Consultant)'}:\n`;
        content += `${m.content}\n\n`;
      });
      filename += '.md';
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const formatContent = (content) => {
    return (
      <div className="whitespace-pre-wrap leading-relaxed text-slate-800 text-xs sm:text-sm font-sans space-y-2">
        {content.split('\n\n').map((block, i) => {
          if (block.includes('|') && block.includes('---')) {
            const rows = block.trim().split('\n');
            const headers = rows[0]?.split('|').map(c => c.trim()).filter(Boolean) || [];
            const dataRows = rows.slice(2).map(r => r.split('|').map(c => c.trim()).filter(Boolean));

            return (
              <div key={i} className="overflow-x-auto my-3 rounded-lg border border-slate-200 bg-white p-2 shadow-xs">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-sky-50/70 text-sky-900">
                      {headers.map((h, hi) => (
                        <th key={hi} className="p-2 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((r, ri) => (
                      <tr key={ri} className="border-b border-slate-100 hover:bg-slate-50">
                        {r.map((cell, ci) => (
                          <td key={ci} className="p-2 text-slate-700">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          return <p key={i}>{block}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg shadow-slate-200/50">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <HardHat className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-wide">BuildMaster AI</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Chartered Civil PM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
              <span>Civil Project Controls Intelligence</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">T=0.3 | 2048 Tokens</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
            title="Adjust Hyperparameters"
          >
            <Info className="w-4 h-4 text-sky-600" />
          </button>

          <button
            onClick={() => handleExport('md')}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
            title="Export Consultation to Markdown"
          >
            <Download className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            onClick={onClearChat}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
            title="Reset Conversation Memory"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </div>

      {/* Model Hyperparameter Dropdown */}
      {showConfig && (
        <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-mono space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-slate-800 font-bold">LLM Hyperparameter Controls:</span>
            <span className="text-[10px] text-slate-500">Configured for Engineering Precision</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600">Temperature:</span>
                <span className="text-amber-800 font-bold">{temperature} (Low hallucination)</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600">Max Tokens:</span>
                <span className="text-sky-800 font-bold">{maxTokens} (Full CPM/BOQ Tables)</span>
              </div>
              <input
                type="range"
                min="512"
                max="4096"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                className="w-full accent-sky-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafbfc]">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${
                  isUser
                    ? 'bg-sky-600 text-white'
                    : 'bg-amber-100 border border-amber-300 text-amber-900'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <HardHat className="w-4 h-4" />}
              </div>

              <div
                className={`relative max-w-[85%] rounded-2xl p-4 shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                }`}
              >
                <div className={`flex items-center justify-between gap-3 mb-1.5 pb-1 border-b ${
                  isUser ? 'border-white/20' : 'border-slate-200'
                }`}>
                  <span className={`text-[10px] font-mono tracking-wider uppercase font-bold ${
                    isUser ? 'text-sky-100' : 'text-slate-500'
                  }`}>
                    {isUser ? 'Civil Engineer / PM' : 'BuildMaster AI (Senior Consultant)'}
                  </span>

                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity ${
                      isUser ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 text-slate-500'
                    }`}
                    title="Copy text"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-sans">
                    {msg.content}
                  </p>
                ) : (
                  formatContent(msg.content)
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center flex-shrink-0">
              <HardHat className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 text-xs font-mono text-sky-700 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Analyzing CPM schedule & geotechnical parameters...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Ask about CPM scheduling, FIDIC claims, BOQs, EVM metrics, concrete mix design..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-12 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 resize-none font-sans"
          />

          <button
            onClick={onSendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-sm"
            title="Send Consultation Request (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1 text-[10px] font-mono text-slate-500">
          <span>Press Enter to send • Shift + Enter for new line</span>
          <span className="text-amber-700 font-medium">Domain Guardrail: Civil Engineering & Construction PM</span>
        </div>
      </div>
    </div>
  );
}
