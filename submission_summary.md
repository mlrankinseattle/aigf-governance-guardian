# Google Startups AI Agent Challenge: Submission Summary
**Project:** A.I.G.F.™ Governance Guardian
**Version:** 2.0 (Production Stable)

## 1. Project Title
**A.I.G.F.™ Governance Guardian**

## 2. Problem to Solve
As AI development accelerates, there is a dangerous **"Governance Gap"**—startups and research labs are deploying powerful models without real-time, expert oversight. Manual compliance checks are too slow for the age of AI, leaving organizations vulnerable to the **EU AI Act**, data privacy breaches (PII), and "hallucinated" policy adherence. Researchers working on complex fields like Quantum Teleportation lack a dedicated tool that can ground their specific technical progress against global safety standards.

## 3. Our Solution
The **A.I.G.F.™ Governance Guardian** is an autonomous AI agent built on the **Google Agent Development Kit (ADK)** that provides "Dual-Grounded" oversight. 

Unlike a static checklist, the Guardian is a live agent that:
*   **Grounded Auditing:** Uses Smart Keyword Search to audit project data against private internal research (Local RAG).
*   **Regulatory Intelligence:** Cross-references project goals with live global legal requirements (EU AI Act, NIST, GDPR).
*   **Automated Risk Tiering:** Instantly classifies projects into High, Medium, or Low risk tiers and generates custom Oversight Policies.
*   **Production-Grade Observability:** Maintains a full JSON Audit Trail for every decision, ensuring institutional trust.
*   **Resilient Design:** Features a premium web interface with built-in API rate-limit protection and automated recovery logic.

---

## 4. Technical Architecture
*   **Framework:** Google Agent Development Kit (ADK)
*   **Model:** Gemini-1.5-Flash (via ADK `InMemoryRunner`)
*   **Grounding:** 
    *   **Local:** Private Markdown Knowledge Base (RAG)
    *   **Global:** Simulated live regulatory API integration
*   **UI/UX:** Premium Flask + Vanilla JS Glassmorphism Dashboard
*   **Resiliency:** Custom `HttpRetryOptions`, 60s request timeout, and frontend exponential backoff (30s → 60s → 120s).
*   **Logging:** Detailed JSON event logging for every agent thought and tool result.
*   **Security:** XSS-sanitized report rendering and strict input length validation.
*   **Monitoring:** Integrated `/api/health` endpoint for real-time status tracking.

## 5. Instructions to Run
1. Navigate to the project folder.
2. Install dependencies: `pip install flask flask-cors google-adk google-genai`.
3. Start the server: `python web_server.py`.
4. Open your browser to: `http://localhost:5050`.

---
**Created by:** AI For People (Maurice Rankin)
**Submission Date:** May 2026
