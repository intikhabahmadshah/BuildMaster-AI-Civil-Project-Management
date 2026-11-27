import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { HardHat, Calculator, Award, RotateCcw } from 'lucide-react';
import ThreeCanvas from './components/ThreeCanvas.jsx';
import PsebFooter from './components/PsebFooter.jsx';
import PsebModal from './components/PsebModal.jsx';
import EvmCalculatorModal from './components/EvmCalculatorModal.jsx';
import QuickPrompts from './components/QuickPrompts.jsx';
import ChatContainer from './components/ChatContainer.jsx';

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `### Welcome to BuildMaster AI 🏗️\nI am your **Senior Civil Project Management Consultant** & Chartered Civil Engineer (CEng, FICE, PMP).\n\nI specialize strictly in:\n- **Project Scheduling & Controls:** Critical Path Method (CPM), PERT, Fast-Tracking & Float Analysis\n- **Cost & BOQ Estimating:** CESMM4 / NRM2 unit rate build-ups\n- **Project Contracts:** FIDIC (Red, Yellow, Silver Books), NEC4, Sub-Clause 20.1 Claims & EOT\n- **Site HSE & Safety:** OSHA deep excavation shoring, heavy lifting plans\n- **Structural QA/QC:** Mass concrete mix design, ACI 211, slump loss, compaction tests\n\n*Select a Quick Action below or enter your technical construction inquiry to begin.*`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(`session-${Date.now()}`);
  const [traineeName, setTraineeName] = useState('Intikhab Ahmad Shah');
  const [isPsebModalOpen, setIsPsebModalOpen] = useState(false);
  const [isEvmModalOpen, setIsEvmModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('blueprint');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(2048);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const threeRef = useRef(null);
  const chatRef = useRef(null);

  // GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(headerRef.current, {
        y: -25,
        opacity: 0,
        duration: 0.7
      })
      .from(threeRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.8
      }, '-=0.3')
      .from(chatRef.current, {
        x: 30,
        opacity: 0,
        duration: 0.8
      }, '-=0.6');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Send message to backend API
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          sessionId,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          temperature,
          maxTokens
        })
      });

      const data = await response.json();

      if (data.success && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

        if (userText.toLowerCase().includes('evm') || userText.toLowerCase().includes('boq')) {
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.85 } });
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `**[System Communication Alert]** Unable to complete request: ${data.details || 'Connection error'}. Please verify your API key and network connection.`
          }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `**[Network Error]** Could not reach backend server at \`/api/chat\`. Ensure the Node.js backend is running on port 5000.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await fetch('/api/history/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    } catch (e) {
      console.warn('Clear session error:', e);
    }

    setMessages([
      {
        role: 'assistant',
        content: `Conversation memory reset. Ready for your next Civil Engineering consultation.`
      }
    ]);
  };

  const handleInjectIntoChat = (text) => {
    setInput(text);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] flex flex-col blueprint-grid text-slate-800">
      {/* 1. Header (Clean Light Architectural Bar - No top PSEB clutter) */}
      <header
        ref={headerRef}
        className="glass-panel border-b border-slate-200/90 px-4 py-3 sticky top-0 z-30 shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center">
              <HardHat className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                  BuildMaster <span className="text-sky-600 font-mono">AI</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  CIVIL PM DOMAIN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono hidden sm:block">
                Senior Civil Project Controls & Construction Engineering Consultant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EVM Calculator Modal Trigger */}
            <button
              onClick={() => setIsEvmModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-mono font-bold transition-all shadow-xs"
            >
              <Calculator className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">EVM Calculator</span>
            </button>

            {/* PSEB Accreditation Details Modal Trigger */}
            <button
              onClick={() => setIsPsebModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold transition-all shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">PSEB Cohort Info</span>
            </button>

            {/* Reset Chat */}
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shadow-xs"
              title="Reset Chat Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace: Split View (3D BIM Canvas + Chat Assistant) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col gap-3">
        {/* Quick Action Prompts Bar */}
        <QuickPrompts onSelectPrompt={(text) => handleInjectIntoChat(text)} />

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[560px]">
          {/* Left Column: Interactive 3D BIM Civil Site (5 cols) */}
          <div ref={threeRef} className="lg:col-span-5 h-[340px] lg:h-full flex flex-col">
            <ThreeCanvas
              currentMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

          {/* Right Column: Chat Consultation Container (7 cols) */}
          <div ref={chatRef} className="lg:col-span-7 h-[580px] lg:h-full flex flex-col">
            <ChatContainer
              messages={messages}
              input={input}
              setInput={setInput}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onClearChat={handleClearChat}
              temperature={temperature}
              setTemperature={setTemperature}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
            />
          </div>
        </div>
      </main>

      {/* 3. Official PSEB Trainee Accreditation Footer (Placed in Footer as requested!) */}
      <PsebFooter
        traineeName={traineeName}
        onOpenModal={() => setIsPsebModalOpen(true)}
      />

      {/* Modals */}
      <PsebModal
        isOpen={isPsebModalOpen}
        onClose={() => setIsPsebModalOpen(false)}
        traineeName={traineeName}
      />

      <EvmCalculatorModal
        isOpen={isEvmModalOpen}
        onClose={() => setIsEvmModalOpen(false)}
        onInjectIntoChat={handleInjectIntoChat}
      />
    </div>
  );
}
