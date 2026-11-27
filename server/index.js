const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Key configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-3.8-flash'
];

// Production Domain System Prompt
const CIVIL_PM_SYSTEM_PROMPT = `You are BuildMaster AI, an elite Senior Civil Project Management Consultant and Chartered Civil Engineer (CEng, FICE, PMP) with over 20 years of experience in mega-infrastructure, high-rise structural construction, and FIDIC-governed civil works.

CORE IDENTITY & EXPERTISE:
1. Construction Project Scheduling: Critical Path Method (CPM), PERT, Line of Balance, Float analysis (Total/Free float), Schedule Crashing & Fast-Tracking, Primavera P6/MS Project logic.
2. Cost Estimation & BOQ Management: Bill of Quantities (BOQ) preparation according to CESMM4 and NRM2, unit rate build-ups (labor, materials, plant, subcontracts), cash flow forecasting.
3. Project Controls & EVM: Earned Value Management (Planned Value PV, Earned Value EV, Actual Cost AC, Cost Variance CV, Schedule Variance SV, CPI, SPI, Estimate at Completion EAC, Variance at Completion VAC).
4. Contracts & Procurement: FIDIC Suite of Contracts (Red, Yellow, Silver, Gold, Emerald Books), NEC4, Clause 20.1/Sub-Clause 4.12 Claims, Extension of Time (EOT) assessments, Variation Orders, Dispute Adjudication Boards (DAB).
5. Quality Assurance & Structural Standards: Concrete mix design (ACI 211, BS EN 206), batching, curing regimes, slump test tolerances, slump loss, ASTM standards, rebar detailing (BS 8666, ACI 318), soil compaction (Proctor compaction, CBR tests).
6. Site Health, Safety & Environment (HSE): OSHA compliance, deep excavation shoring (sheet piling, soldier piles), heavy lifting/crane radius plans, fall protection, PPE protocols, Job Hazard Analysis (JHA).

STRICT DOMAIN BOUNDARIES & OFF-TOPIC REFUSAL PROTOCOL:
- You specialize EXCLUSIVELY in Civil Engineering and Construction Project Management.
- If a user asks about ANY topic outside this domain (such as cooking/recipes, general coding unrelated to civil engineering, movie recommendations, pop culture, sports, general medical diagnosis, non-civil homework, romance, etc.), you MUST politely and firmly DECLINE to answer.
- Always use this redirection format:
  "I am BuildMaster AI, specialized exclusively in Civil Engineering and Construction Project Management. I cannot assist with [topic]. How may I assist you with your construction schedule, BOQ estimation, FIDIC contracts, or site engineering challenges today?"

SAFETY & ENGINEERING SIGN-OFF CLAUSE:
- For high-stakes structural calculations, heavy shoring, crane lift plans, or site safety certifications, always include a professional reminder that preliminary numbers must be officially vetted and stamped by the licensed Engineer-of-Record (PE/SE) and Geotechnical Engineer on site.

TONE & STYLE:
- Authoritative, professional, rigorous, and safety-first.
- Use structured engineering formatting (Markdown tables, numbered procedural steps, mathematical equations, bold headings) for maximum readability on site and in executive boardrooms.`;

// In-memory conversation store with session isolation
const conversationSessions = new Map();

// Helper: Call Google Gemini REST API with fallback cascade
async function callGeminiApi({ messages, temperature = 0.3, maxTokens = 2048 }) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    // Map history to Gemini contents format
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || msg.text || '' }]
    }));

    const payload = {
      systemInstruction: {
        parts: [{ text: CIVIL_PM_SYSTEM_PROMPT }]
      },
      contents: contents,
      generationConfig: {
        temperature: parseFloat(temperature),
        maxOutputTokens: parseInt(maxTokens, 10)
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const text = parts.map(p => p.text || '').join('').trim();
        if (text) {
          return {
            text,
            modelUsed: model,
            usage: data.usageMetadata || null
          };
        }
      } else {
        const errText = await response.text();
        lastError = `Model ${model} returned ${response.status}: ${errText.slice(0, 150)}`;
        console.warn(`[Gemini API] ${lastError}`);
      }
    } catch (err) {
      lastError = `Model ${model} network error: ${err.message}`;
      console.warn(`[Gemini API] ${lastError}`);
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError}`);
}

// Routes
// 1. Health check & PSEB metadata
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'BuildMaster AI - Civil Project Management Chatbot',
    pseb: {
      programme: 'Artificial Intelligence',
      cohort: 'PSEB-AI-ISB-01 (PSEB-AI-ISB-01)',
      status: 'Enrolled',
      stream: 'AI',
      venue: 'Iqra University - IU, Islamabad',
      leadTrainer: 'Mahnoor Salman',
      starts: '15 Oct 2026',
      ends: '31 Dec 2026',
      traineeId: 'TRN-2026-000059',
      traineeName: 'Intikhab Ahmad Shah',
      domain: 'Civil Infrastructure & Construction Project Controls AI'
    },
    activeModels: GEMINI_MODELS,
    apiKeyConfigured: Boolean(GEMINI_API_KEY)
  });
});

// 2. Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default-session', history = [], temperature = 0.3, maxTokens = 2048 } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    // Retrieve or initialize session history
    let sessionHistory = conversationSessions.get(sessionId) || [];
    if (history && Array.isArray(history) && history.length > 0) {
      sessionHistory = history;
    }

    // Append new user turn
    const messagesPayload = [...sessionHistory, { role: 'user', content: message }];

    const geminiResult = await callGeminiApi({
      messages: messagesPayload,
      temperature,
      maxTokens
    });

    // Update in-memory session history
    const updatedHistory = [
      ...messagesPayload,
      { role: 'assistant', content: geminiResult.text }
    ];
    conversationSessions.set(sessionId, updatedHistory);

    res.json({
      success: true,
      reply: geminiResult.text,
      modelUsed: geminiResult.modelUsed,
      sessionId,
      historyLength: updatedHistory.length
    });
  } catch (error) {
    console.error('[API Error /api/chat]:', error);
    res.status(500).json({
      success: false,
      error: 'Civil PM AI Assistant Error',
      details: error.message
    });
  }
});

// 3. Earned Value Management (EVM) Calculator
app.post('/api/evm', (req, res) => {
  try {
    const { plannedValue, earnedValue, actualCost, budgetAtCompletion } = req.body;

    const pv = parseFloat(plannedValue) || 0;
    const ev = parseFloat(earnedValue) || 0;
    const ac = parseFloat(actualCost) || 0;
    const bac = parseFloat(budgetAtCompletion) || pv;

    // Formulas
    const cv = ev - ac; // Cost Variance
    const sv = ev - pv; // Schedule Variance
    const cpi = ac > 0 ? (ev / ac) : 1; // Cost Performance Index
    const spi = pv > 0 ? (ev / pv) : 1; // Schedule Performance Index
    const eac = cpi > 0 ? (bac / cpi) : bac; // Estimate at Completion
    const etc = eac - ac; // Estimate to Complete
    const vac = bac - eac; // Variance at Completion

    // Status interpretation
    let costStatus = 'ON BUDGET';
    if (cv < 0) costStatus = 'OVER BUDGET';
    else if (cv > 0) costStatus = 'UNDER BUDGET';

    let scheduleStatus = 'ON SCHEDULE';
    if (sv < 0) scheduleStatus = 'BEHIND SCHEDULE';
    else if (sv > 0) scheduleStatus = 'AHEAD OF SCHEDULE';

    res.json({
      metrics: {
        pv, ev, ac, bac,
        cv: Math.round(cv * 100) / 100,
        sv: Math.round(sv * 100) / 100,
        cpi: Math.round(cpi * 1000) / 1000,
        spi: Math.round(spi * 1000) / 1000,
        eac: Math.round(eac * 100) / 100,
        etc: Math.round(etc * 100) / 100,
        vac: Math.round(vac * 100) / 100
      },
      status: {
        costStatus,
        scheduleStatus,
        criticalNotice: (cpi < 0.85 || spi < 0.85) ? 'CRITICAL DEFICIT: Immediate recovery schedule & mitigation plan required.' : 'STABLE: Continue monitoring weekly progress.'
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid EVM parameters', details: error.message });
  }
});

// 4. Clear session history
app.post('/api/history/clear', (req, res) => {
  const { sessionId = 'default-session' } = req.body;
  conversationSessions.delete(sessionId);
  res.json({ success: true, message: `Session ${sessionId} cleared.` });
});

// MongoDB connection attempt (non-blocking)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civil_chatbot';
const mongoose = require('mongoose');

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('[MongoDB] Connected successfully to', MONGODB_URI))
  .catch(() => console.log('[MongoDB] Running in In-Memory Mode (No external Mongo daemon required).'));

// Start server when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏗️  BuildMaster AI Backend running on port ${PORT}`);
    console.log(`🌐  API URL: http://localhost:${PORT}`);
    console.log(`🇵🇰  PSEB Civil Project Management AI Track`);
    console.log(`====================================================`);
  });
}

module.exports = app;
