// Vercel Serverless Function: /api/chat
const GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-3.8-flash'
];

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

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY environment variable is not configured in Vercel settings.'
    });
    return;
  }

  try {
    const { message, history = [], temperature = 0.3, maxTokens = 2048 } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const messagesPayload = [...history, { role: 'user', content: message }];
    const contents = messagesPayload.map(msg => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || msg.text || '' }]
    }));

    let lastError = null;
    for (const model of GEMINI_MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      try {
        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: CIVIL_PM_SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              temperature: parseFloat(temperature),
              maxOutputTokens: parseInt(maxTokens, 10)
            }
          })
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const parts = data.candidates?.[0]?.content?.parts || [];
          const text = parts.map(p => p.text || '').join('').trim();
          if (text) {
            res.status(200).json({
              success: true,
              reply: text,
              modelUsed: model
            });
            return;
          }
        } else {
          lastError = await geminiRes.text();
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    res.status(502).json({
      success: false,
      error: 'Failed to contact Gemini API',
      details: lastError
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
