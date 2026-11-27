# 🏗️ BuildMaster AI - Domain-Specific Chatbot for Civil Project Management
### **Pakistan Software Export Board (PSEB) — Artificial Intelligence Track**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Domain: Civil PM](https://img.shields.io/badge/Domain-Civil%20Project%20Management-amber)](https://github.com/intikhabahmadshah/BuildMaster-AI-Civil-Project-Management)

---

## 👨‍🎓 Trainee & PSEB Cohort Credentials

| Official Attribute | Verified Student & Cohort Details |
| :--- | :--- |
| **Candidate / Trainee Name** | **Intikhab Ahmad Shah** |
| **Trainee ID** | **TRN-2026-000059** |
| **Programme** | **Artificial Intelligence** |
| **Stream** | **AI** |
| **Status** | **Enrolled** (Verified Accreditation) |
| **Cohort** | **PSEB-AI-ISB-01 (PSEB-AI-ISB-01)** |
| **Venue** | **Iqra University – IU, Islamabad** |
| **Lead Trainer** | **Mahnoor Salman** |
| **Duration** | **15 Oct 2026 – 31 Dec 2026** |
| **Specialized Domain** | **Civil Engineering & Construction Project Controls** |

---

## 📌 1. Project Overview & Domain Focus

**BuildMaster AI** is an enterprise-grade domain-specific AI consultation platform designed exclusively for Civil Engineering and Construction Project Management. Its behavioral boundaries, technical authority, and mathematical precision are strictly governed by an expertly designed **System Prompt**.

### Core Competencies:
1. **Critical Path Method (CPM) Scheduling:** Milestone planning, float analysis, and logic sequencing from raft pouring to structural topping-out.
2. **Earned Value Management (EVM):** Quantitative project performance indexing ($PV, EV, AC, CV, SV, CPI, SPI, EAC, VAC$).
3. **FIDIC Contracts & Claims:** Contract administration under FIDIC Red/Yellow/Silver Books, Clause 20.1 notices, and EOT assessments.
4. **Structural & Concrete QA/QC:** Batching tolerances, ACI 211 mix designs, slump loss mitigation, and mass concrete thermal control.
5. **Site Health, Safety & Environment (HSE):** OSHA excavation shoring (29 CFR 1926 Subpart P), heavy crane lifting radii, and safety matrices.

### Strict Domain Guardrails & Polite Rejection:
Any off-topic query (cooking, movies, pop culture, non-civil homework) is firmly and politely declined using a standardized engineering redirection:
> *"I am BuildMaster AI, specialized exclusively in Civil Engineering and Construction Project Management. I cannot assist with [topic]. How may I assist you with your construction schedule, BOQ estimation, FIDIC contracts, or site engineering challenges today?"*

---

## ⚙️ 2. Hyperparameter Configuration & Technical Justifications

| Parameter | Value | Technical Justification |
| :--- | :--- | :--- |
| **Temperature** | `0.3` | Civil project management requires **high determinism and factual accuracy**. A low temperature of 0.3 minimizes creative hallucinations while retaining natural professional prose. Factual consistency is essential for CPM float calculations, slump tolerances, and contractual references. |
| **Max Tokens** | `2048` | Engineering deliverables (e.g. multi-story CPM schedules, detailed BOQ breakdown tables, FIDIC claim notices) require substantial token bandwidth. 2048 tokens guarantee un-truncated, thorough responses. |
| **Top-P** | `0.85` | Restricts sampling to high-probability tokens for consistent engineering terminology. |

---

## 💻 3. Full-Stack Architecture (MERN + Three.js + GSAP)

```
BuildMaster-AI-Civil-Project-Management/
├── Civil_Project_Management_Chatbot.ipynb    # Standalone Notebook with Full Token Usage Telemetry
├── Build a Domain-Specific Chatbot.ipynb     # Completed Course Lab Notebook
├── client/                                   # React 18 + Vite + Three.js + GSAP + Tailwind (Light Mode)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ThreeCanvas.jsx              # 3D BIM Twin (Tower Crane, Slabs, FEA Stress Modes)
│   │   │   ├── PsebFooter.jsx               # Official PSEB Trainee Accreditation Footer
│   │   │   ├── PsebModal.jsx                # "My Cohort" Official Card Replica Modal
│   │   │   ├── EvmCalculatorModal.jsx       # Quantitative EVM Calculator
│   │   │   ├── QuickPrompts.jsx             # 1-Click Domain Actions & Guardrail Tests
│   │   │   └── ChatContainer.jsx            # Multi-Turn Chat with Markdown Tables & Export
│   │   └── App.jsx                          # Main UI with GSAP Entrance Timelines
├── server/                                   # Node.js + Express API Backend
│   ├── index.js                             # REST Endpoints (/api/chat, /api/evm, /api/health)
│   └── package.json
├── api/
│   └── index.js                             # Vercel Serverless Function entrypoint
├── vercel.json                               # Vercel Deployment & Rewrites Configuration
├── run_app.bat                               # 1-Click Windows Local Launcher
├── install_dependencies.bat                  # Installs all client & server dependencies
├── start_backend.bat                         # Starts Express server on Port 5000
├── start_frontend.bat                        # Starts Vite client on Port 5173
├── verify_gemini_key.bat                     # Tests API Key connectivity
└── README.md
```

---

## 📊 4. Token Usage & Telemetry (Jupyter Notebook)

The standalone notebook [Civil_Project_Management_Chatbot.ipynb](Civil_Project_Management_Chatbot.ipynb) features real-time token tracking:

```
================================================================================
📊  BUILDMASTER AI — TOKEN USAGE & PERFORMANCE TELEMETRY DASHBOARD
================================================================================
 Turn                          Topic  Prompt Tokens  Completion Tokens  Thought Tokens  Total Tokens  Latency (s)
    1       CPM Schedule & Raft Pour            709               1220             793          2722        14.53
    2   Batching Plant Delay & FIDIC            913               1136             908          2957        14.92
    3 Out-of-Domain Guardrail Filter            675                 50             239           964         8.68
    4        EVM Quantitative Analysis            760               1154             564          2478        10.84
    5     FIDIC Silver vs Red Book Risk            705               1175             608          2488        15.02
    6   OSHA Excavation Safety Matrix            684               1256             626          2566        10.91
--------------------------------------------------------------------------------
🔹 Total Prompt Tokens Processed:      4,446 tokens
🔹 Total Completion Tokens Generated:  5,991 tokens
🔹 Total Reasoning/Thought Tokens:     3,738 tokens
🔹 Cumulative Session Tokens:          14,175 tokens
🔹 Average Turn Latency:               12.48 seconds
================================================================================
```

---

## 🚀 5. Quick Start: Local Execution (Windows)

Double-click **`run_app.bat`** or run:
```cmd
run_app.bat
```
*This script verifies dependencies, starts the backend on port 5000, starts the frontend on port 5173, and launches `http://localhost:5173` in your default browser.*

---

## ☁️ 6. Deployment to Vercel (Public Access Link)

This repository is pre-configured for instant zero-configuration deployment to **Vercel**:

1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import the GitHub repository:  
   `https://github.com/intikhabahmadshah/BuildMaster-AI-Civil-Project-Management`
3. Vercel automatically detects `vercel.json`:
   - **Build Command:** `cd client && npm install && npm run build`
   - **Output Directory:** `client/dist`
   - **Serverless API Routes:** `/api/(.*)` -> `api/index.js`
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
5. Click **Deploy**. Your application will be live on a public URL!

---

## 📄 License
This project is licensed under the MIT License.
