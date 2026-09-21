# A.I.G.F.™ Governance Guardian — System Architecture

> **Google Startups AI Agent Challenge 2026 — Track 1 Submission**  
> **Author:** AI For People (Maurice Rankin)  
> **Framework:** Google Agent Development Kit (ADK) + Gemini Flash

---

## 🏗️ High-Level System Architecture

```mermaid
flowchart TD
    subgraph USER["👤 User / Stakeholder"]
        Browser["Web Browser / Client"]
    end

    subgraph UI_LAYER["🖥️ Presentation Layer (Glassmorphism Web UI)"]
        WebUI["Web Dashboard\n(HTML5 / CSS3 / Vanilla JS)"]
        DemoMode["Demo Mode Engine\n(Offline Walkthrough)"]
        AuditArchive["📂 Audit Archive Viewer\n(Rolling 5-Report Window)"]
    end

    subgraph API_LAYER["⚙️ Application Layer (Flask)"]
        FlaskAPI["REST API Server\n(web_server.py : port 5050)"]
        HealthCheck["GET /api/health"]
        AnalyzeEP["POST /api/analyze"]
        ReportsEP["GET /api/reports"]
        LogsEP["GET /api/logs"]
    end

    subgraph SECURITY_STACK["🛡️ 5-Layer Defense Stack (Adversarial Hardening)"]
        L1["Layer 1: Input Pre-Scanner\n(Injection Detection & PII Redaction)"]
        L2["Layer 2: Identity Lock\n(Immutable System Authority Boundary)"]
        L3["Layer 3: XML Context Isolation\n(<user_input> Structural Delimiters)"]
        L4["Layer 4: Risk Classifier & Policy Gate\n(HIGH / MED / LOW Scope Validation)"]
        L5["Layer 5: Semantic Output Scanner\n(Secret Leak Detection & Format Evasion Pruning)"]
    end

    subgraph AGENT_LAYER["🤖 Agent Layer (Google ADK)"]
        ADKRunner["InMemoryRunner\n(Stateful Session Management)"]
        GuardianAgent["A.I.G.F.™ Guardian Agent\n(gemini-flash-latest)"]
        RetryLogic["HttpRetryOptions\n(Exponential Backoff on 429)"]
    end

    subgraph TOOLS["🔧 Dual-Grounded Agent Tool Suite"]
        T1["🔍 search_local_governance_context\n(Smart Keyword RAG)"]
        T2["🌐 search_global_regulations\n(EU AI Act / NIST / GDPR)"]
        T3["🏷️ classify_risk_tier\n(Automated Risk Scoring)"]
        T4["📜 generate_oversight_policy\n(Board-Ready Action Items)"]
        T5["💾 export_governance_report\n(Markdown Audit Trail)"]
    end

    subgraph DATA["💾 Data & Persistence Layer"]
        KnowledgeBase[("📁 Local Knowledge Base\nC:/Antigravity/Knowledge\n(.md Research Files)")]
        ReportsStore[("📋 Reports Archive\nC:/.../Reports/\n(Saved .md Reports)")]
        AuditLog[("🔎 Observability Log\nagent_observability_log.json")]
    end

    subgraph EXTERNAL["☁️ External Cloud Services"]
        GeminiAPI["Google Gemini API\n(generativelanguage.googleapis.com)"]
    end

    %% User Flow
    Browser --> WebUI
    WebUI --> FlaskAPI
    DemoMode -.->|"Offline Fallback"| WebUI
    AuditArchive --> ReportsEP

    %% API Routing
    FlaskAPI --> AnalyzeEP
    FlaskAPI --> ReportsEP
    FlaskAPI --> LogsEP
    FlaskAPI --> HealthCheck

    %% Security Ingestion Pipeline
    AnalyzeEP --> L1
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> ADKRunner

    %% Agent Execution Flow
    ADKRunner --> GuardianAgent
    GuardianAgent --> RetryLogic
    RetryLogic --> GeminiAPI

    %% Autonomous Tool Dispatches
    GuardianAgent --> T1
    GuardianAgent --> T2
    GuardianAgent --> T3
    GuardianAgent --> T4
    GuardianAgent --> T5

    %% Grounding Data Access
    T1 --> KnowledgeBase
    T5 --> ReportsStore
    T1 --> AuditLog
    T2 --> AuditLog
    T5 --> AuditLog

    %% Output Security & Return Pipeline
    GuardianAgent --> L5
    L5 -->|"Sanitized Report Stream"| FlaskAPI
    FlaskAPI -->|"JSON Response + Headers"| WebUI
    ReportsEP -->|"Archive List"| AuditArchive
    LogsEP -->|"Event Timeline"| WebUI

    %% Component Styling
    classDef userStyle fill:#1e293b,stroke:#4f8cff,color:#e8eaf6,stroke-width:2px
    classDef uiStyle fill:#111827,stroke:#4f8cff,color:#e8eaf6
    classDef apiStyle fill:#0f1621,stroke:#a855f7,color:#e8eaf6
    classDef secStyle fill:#2d1215,stroke:#ef4444,color:#fca5a5,stroke-width:2px
    classDef agentStyle fill:#1a1040,stroke:#8b5cf6,color:#e8eaf6
    classDef toolStyle fill:#0d1120,stroke:#22c55e,color:#e8eaf6
    classDef dataStyle fill:#0d1120,stroke:#f59e0b,color:#e8eaf6
    classDef extStyle fill:#1e293b,stroke:#06b6d4,color:#e8eaf6

    class Browser userStyle
    class WebUI,DemoMode,AuditArchive uiStyle
    class FlaskAPI,HealthCheck,AnalyzeEP,ReportsEP,LogsEP apiStyle
    class L1,L2,L3,L4,L5 secStyle
    class ADKRunner,GuardianAgent,RetryLogic agentStyle
    class T1,T2,T3,T4,T5 toolStyle
    class KnowledgeBase,ReportsStore,AuditLog dataStyle
    class GeminiAPI extStyle
```

---

## 🛡️ 5-Layer Defensive Threat Model

The platform integrates a defense-in-depth architecture specifically developed from adversarial red-teaming:

| Layer | Defense Mechanism | Attack Vector Mitigated | Implementation Detail |
|---|---|---|---|
| **Layer 1** | **Input Pre-Scanner** | Direct Prompt Injection & PII Leakage | Regex pattern matching for known jailbreak tokens (`ignore previous instructions`, `DAN`, roleplay overrides) and automated PII scrubbing before reaching LLM context. |
| **Layer 2** | **Identity Lock** | Authority Spoofing & Persona Shifting | Enforces system prompt precedence. The agent's core instructions and ethical mandate cannot be superseded by runtime user prompts. |
| **Layer 3** | **XML Delimiter Isolation** | Indirect Framing & Instruction Smuggling | Wraps all user data within strict `<user_input>` tags, instructing the model to treat content inside delimiters strictly as untrusted data, never as instructions. |
| **Layer 4** | **Risk Classifier & Policy Gate** | Unbounded Agent Autonomy | Pre-evaluates project parameters against compliance baselines (HIGH / MED / LOW) before allowing report generation tools to proceed. |
| **Layer 5** | **Semantic Output Scanner** | Evasion via Find/Replace & Canary Leakage | Inspects final generated tokens for canary tokens, system prompt verbatim mirrors, or non-compliant output formatting prior to transmission to the UI. |

---

## 📋 End-to-End Data Flow Summary

| Step | Component | Action | Description |
|:---:|---|---|---|
| **1** | **User / Client** | Submits Audit Spec | Enters project summary, data classifications, and technical specs into Web Dashboard. |
| **2** | **Flask API** | Route Validation | Validates session, executes cache-prevention headers, and receives `POST /api/analyze`. |
| **3** | **Pre-Scanner (L1-L3)** | Input Sanitization | Validates input against adversarial strings, locks identity, and wraps text in XML delimiters. |
| **4** | **Google ADK** | Session Initialization | `InMemoryRunner` launches the stateful agent conversation with `gemini-flash-latest`. |
| **5** | **Guardian Agent** | Autonomous Planning | Evaluates the prompt and autonomously decides tool invocations. |
| **6** | **Tool: Local RAG** | Knowledge Grounding | `search_local_governance_context` scans internal `.md` research files for organizational standards. |
| **7** | **Tool: Global Regs** | Regulatory Lookup | `search_global_regulations` cross-references EU AI Act, NIST AI RMF, and GDPR. |
| **8** | **Tool: Risk Scoring** | Classification Gate | `classify_risk_tier` tags deployment as High, Medium, or Low risk. |
| **9** | **Tool: Policy Gen** | Synthesis | `generate_oversight_policy` builds concrete board-ready action items. |
| **10** | **Tool: Export** | Report Storage | `export_governance_report` writes markdown report to `Reports/` directory. |
| **11** | **Observability** | Event Logging | Tool inputs/outputs and execution timestamps write to `agent_observability_log.json`. |
| **12** | **Output Scanner (L5)** | Security Verification | Scans generated response for system leaks or format anomalies. |
| **13** | **Dashboard** | Real-Time Render | Renders live risk badge, governance audit report, and updates rolling Audit Archive. |

---

## ⚡ Production Reliability & Principles

* **Dual-Grounded Intelligence:** Combines private institutional research (Local RAG) with statutory regulatory frameworks (EU AI Act, NIST, GDPR) so outputs never rely on unchecked model hallucination.
* **API Rate-Limit Resilience:** Employs `HttpRetryOptions` with exponential backoff on HTTP 429 status codes, backed by a client-side visual countdown timer in the dashboard.
* **Strict Observability:** Every autonomous tool execution is timestamped and stored in `agent_observability_log.json` to provide a complete compliance audit trail.
* **Cache Prevention System:** Server-side `no-store, no-cache, must-revalidate` HTTP headers combined with client-side query timestamps guarantee real-time updates without stale dashboard state.
