# ⚖️ A.I.G.F.™ Governance Guardian
### **The Autonomous "Privacy-First" AI Governance Agent**
**Track 1: Build (Net-New Agent) | Google Startups AI Agent Challenge 2026**

---

## 🚀 The Vision: Closing the "Governance Gap"

As AI development accelerates, organizations face a dangerous gap: deploying powerful models without real-time, expert oversight. Manual compliance is too slow, and public cloud governance tools expose sensitive IP.

The **A.I.G.F.™ Governance Guardian** is an autonomous agent built on the **Google Agent Development Kit (ADK)** that provides "Dual-Grounded" oversight directly at the edge. It is designed for researchers and startups who need expert governance over sensitive data (like Quantum Teleportation or PII) without ever letting it leave their local environment.

---

## ✨ Key Features

- **🔍 Dual-Grounded Auditing**: 
  - **Local Grounding (RAG)**: Audits projects against private internal research and safety docs using a local Model Context Protocol (MCP) pattern.
  - **Global Grounding**: Cross-references goals with live global regulations (EU AI Act, NIST, GDPR).
- **🏷️ Automated Risk Tiering**: Instantly classifies projects into High, Medium, or Low risk and generates custom Board-Ready Oversight Policies.
- **📊 Production-Grade Observability**: Maintains a detailed JSON Audit Trail for every decision, ensuring full transparency and institutional trust.
- **🛡️ Enterprise Resilience**:
  - **Exponential Backoff**: Advanced 30s-120s retry logic for handling API rate limits gracefully.
  - **Request Protection**: 60s hard-timeouts and strict input sanitization.
- **💎 Premium Dashboard**: A high-end Glassmorphism UI built with Vanilla JS and CSS for a lightweight, state-of-the-art user experience.

---

## 🛠️ Technical Architecture

- **Framework**: [Google Agent Development Kit (ADK)]([https://github.com/google/adk](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk)
- **Model**: Gemini-1.5-Flash (via `InMemoryRunner`)
- **Backend**: Python / Flask (Asynchronous Agent Execution)
- **Frontend**: Glassmorphism UI (Vanilla JS/CSS)
- **Grounding Engine**: Local Markdown RAG + Regulatory Simulation API

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- A Google Gemini API Key

### Quick Start
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/aigf-governance-guardian.git
   cd aigf-governance-guardian
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment (Optional)**:
   Place your internal research markdown files in a folder named `Knowledge` in the parent directory, or set the environment variable:
   ```bash
   set AIGF_KNOWLEDGE_PATH=C:\Path\To\Your\Knowledge
   ```

4. **Launch the Guardian**:
   ```bash
   python web_server.py
   ```

5. **Access the Dashboard**:
   Open your browser to `http://localhost:5050`

---

## 🔎 Agent Observability
The Guardian is designed for transparency. Every "thought," tool call, and result is captured in `agent_observability_log.json`. You can view this live audit log directly through the "View Audit Log" button in the dashboard footer.

---

## ⚖️ License & Credits
**Created by**: AI For People (Maurice Rankin)  
**Challenge**: Google Startups AI Agent Challenge  
**Year**: 2026

*Disclaimer: This tool provides governance recommendations based on AI principles. Final accountability remains with the organization's human leadership.*
