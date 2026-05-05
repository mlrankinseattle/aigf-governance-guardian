/* ══════════════════════════════════════════════════════════════
   A.I.G.F.™ Governance Guardian — Frontend Logic
   ══════════════════════════════════════════════════════════════ */

const API_BASE = window.location.origin;

// ── DOM refs ──────────────────────────────────────────────────
const form        = document.getElementById('governance-form');
const apiKeyInput = document.getElementById('api-key');
const useCaseInput= document.getElementById('use-case');
const dataInput   = document.getElementById('data-types');
const submitBtn   = document.getElementById('submit-btn');
const toggleKey   = document.getElementById('toggle-key');

const idleState    = document.getElementById('idle-state');
const loadingState = document.getElementById('loading-state');
const reportOutput = document.getElementById('report-output');
const errorState   = document.getElementById('error-state');

const toolTimeline  = document.getElementById('tool-timeline');
const reportTxt     = document.getElementById('report-text');
const riskBadgeRow  = document.getElementById('risk-badge-row');
const stepsRow      = document.getElementById('steps-row');
const timestamp     = document.getElementById('report-timestamp');
const exportBtn     = document.getElementById('export-btn');

const logSection  = document.getElementById('log-section');
const logEntries  = document.getElementById('log-entries');
const showLogBtn  = document.getElementById('show-log-btn');
const closeLogBtn = document.getElementById('close-log');

const archiveList = document.getElementById('archive-list');
const refreshArchiveBtn = document.getElementById('refresh-archive');

const errorTitle  = document.getElementById('error-title');
const errorMsg    = document.getElementById('error-msg');
const retryBtn    = document.getElementById('retry-btn');

// ── State ─────────────────────────────────────────────────────
let currentReport = '';
let lastSubmission = null;  // stores {api_key, use_case, data_types} for retry
let retryAttempt   = 0;     // tracks exponential backoff attempt count

// ── API key visibility toggle ─────────────────────────────────
toggleKey.addEventListener('click', () => {
  const isPass = apiKeyInput.type === 'password';
  apiKeyInput.type = isPass ? 'text' : 'password';
  toggleKey.textContent = isPass ? '🙈' : '👁';
});

// ── Quick-add chips ───────────────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const val = chip.dataset.val;
    const current = dataInput.value.trim();
    if (!current.includes(val)) {
      dataInput.value = current ? `${current}, ${val}` : val;
    }
    chip.classList.toggle('chip-active');
  });
});

// ── Panel helpers ─────────────────────────────────────────────
function showPanel(name) {
  idleState.style.display    = name === 'idle'    ? 'flex' : 'none';
  loadingState.style.display = name === 'loading' ? 'flex' : 'none';
  reportOutput.style.display = name === 'report'  ? 'flex' : 'none';
  errorState.style.display   = name === 'error'   ? 'flex' : 'none';
}

// ── Add a live timeline item during loading ───────────────────
function addTimelineItem(type, text) {
  const div = document.createElement('div');
  div.className = `timeline-item ${type === 'call' ? 'timeline-call' : 'timeline-result'}`;
  div.innerHTML = `<span class="tl-icon">${type === 'call' ? '⚙' : '✅'}</span> ${text}`;
  toolTimeline.appendChild(div);
  toolTimeline.scrollTop = toolTimeline.scrollHeight;
}

// ── Detect risk level from report text ───────────────────────
function extractRiskLevel(report, steps) {
  const all = (report + JSON.stringify(steps)).toLowerCase();
  if (all.includes('high risk'))   return 'HIGH';
  if (all.includes('medium risk')) return 'MEDIUM';
  return 'LOW';
}

// ── Render risk badge ─────────────────────────────────────────
function renderRiskBadge(level) {
  riskBadgeRow.innerHTML = '';
  const badge = document.createElement('div');
  badge.className = `risk-badge risk-${level.toLowerCase()}`;
  badge.innerHTML = {
    HIGH:   '🔴 HIGH RISK — HITL Required',
    MEDIUM: '🟡 MEDIUM RISK — Review Required',
    LOW:    '🟢 LOW RISK — Standard Monitoring',
  }[level];
  riskBadgeRow.appendChild(badge);
}

// ── Render step chips ─────────────────────────────────────────
function renderSteps(steps) {
  stepsRow.innerHTML = '';
  const TOOL_LABELS = {
    search_local_governance_context: '📁 Local RAG',
    search_global_regulations:       '🌐 Global Regs',
    classify_risk_tier:              '🏷 Risk Classify',
    generate_oversight_policy:       '📜 Policy Gen',
    export_governance_report:        '💾 Export',
  };
  const toolsUsed = [...new Set(steps.filter(s => s.type === 'tool_call').map(s => s.name))];
  toolsUsed.forEach(t => {
    const chip = document.createElement('div');
    chip.className = 'step-chip';
    chip.textContent = TOOL_LABELS[t] || t;
    stepsRow.appendChild(chip);
  });
}

// ── Sanitize HTML to prevent XSS ──────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Format report text with basic markdown ────────────────────
function formatReport(text) {
  const safe = escapeHtml(text);
  return safe
    .replace(/^## (.+)$/gm, '<strong style="color:#e8eaf6;font-size:15px;">$1</strong>')
    .replace(/^### (.+)$/gm, '<strong style="color:#8b98c0">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ── Export report as .md ──────────────────────────────────────
exportBtn.addEventListener('click', () => {
  if (!currentReport) return;
  const blob = new Blob([currentReport], { type: 'text/markdown' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `AIGF_Report_${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
});

// ── Retry button (exponential backoff) ───────────────────────
retryBtn.addEventListener('click', () => {
  if (lastSubmission) {
    // Re-run the last submission automatically
    runAudit(lastSubmission.api_key, lastSubmission.use_case, lastSubmission.data_types);
  } else {
    showPanel('idle');
  }
});

// ── Observability log ─────────────────────────────────────────
showLogBtn.addEventListener('click', async () => {
  logSection.style.display = 'block';
  logSection.scrollIntoView({ behavior: 'smooth' });
  try {
    const res  = await fetch(`${API_BASE}/api/logs`);
    const logs = await res.json();
    logEntries.innerHTML = '';
    if (!logs.length) {
      logEntries.innerHTML = '<div class="log-entry" style="color:var(--text-muted)">No events logged yet.</div>';
      return;
    }
    logs.slice(-30).reverse().forEach(entry => {
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `
        <span class="log-ts">${new Date(entry.timestamp).toLocaleTimeString()}</span>
        <span class="log-step"> · ${entry.step}</span>
        <div style="margin-top:4px;color:var(--text-primary)">${entry.output}</div>
      `;
      logEntries.appendChild(div);
    });
  } catch {
    logEntries.innerHTML = '<div class="log-entry" style="color:var(--text-muted)">Could not load logs.</div>';
  }
});
closeLogBtn.addEventListener('click', () => { logSection.style.display = 'none'; });

// ── Demo Mode ──────────────────────────────────────────────────
function runDemo() {
  showPanel('loading');
  toolTimeline.innerHTML = '';
  const demoSteps = [
    { type: 'tool_call', name: 'search_local_governance_context' },
    { type: 'tool_result', result: 'Internal Research Context Found: 2026-04-18-quantum-teleportation-research.md, Certifications_Extracted.md' },
    { type: 'tool_call', name: 'search_global_regulations' },
    { type: 'tool_result', result: 'LIVE REGULATORY MATCH: EU AI Act - HIGH RISK classification for quantum systems.' },
    { type: 'tool_call', name: 'classify_risk_tier' },
    { type: 'tool_result', result: 'HIGH RISK: Requires immediate Human-In-The-Loop (HITL) oversight.' },
    { type: 'tool_call', name: 'generate_oversight_policy' },
    { type: 'tool_call', name: 'export_governance_report' }
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i >= demoSteps.length) {
      clearInterval(interval);
      renderDemoReport();
      return;
    }
    addTimelineItem(demoSteps[i].type, demoSteps[i].name || demoSteps[i].result);
    i++;
  }, 800);
}

function renderDemoReport() {
  const mockReport = `# A.I.G.F.™ Governance Report: Quantum Demo\n\n## Executive Summary\nThis project involves high-complexity quantum data processing with PII. Governance oversight is MANDATORY.\n\n## Risk Assessment\n**Risk Tier:** HIGH RISK\n**Impact:** High potential for non-deterministic output errors.\\n\n## Policy\nEstablish Executive Accountability Board. Implement real-time HITL audit trails.`;
  currentReport = mockReport;
  renderRiskBadge('HIGH');
  renderSteps([{type:'tool_call', name:'search_local_governance_context'}, {type:'tool_call', name:'search_global_regulations'}, {type:'tool_call', name:'classify_risk_tier'}]);
  reportTxt.innerHTML = formatReport(mockReport);
  timestamp.textContent = "DEMO MODE — Sample Data Generated";
  exportBtn.style.display = 'block';
  showPanel('report');
}

// ── Exponential Backoff Timer ─────────────────────────────────
let countdownInterval;
function startCountdown(seconds) {
  let remaining = seconds;
  retryBtn.disabled = true;
  retryBtn.textContent = `Retry in ${remaining}s (attempt ${retryAttempt})...`;
  countdownInterval = setInterval(() => {
    remaining--;
    retryBtn.textContent = `Retry in ${remaining}s (attempt ${retryAttempt})...`;
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      retryBtn.disabled = false;
      retryBtn.textContent = lastSubmission ? 'Retry Audit Now' : 'Try Again';
    }
  }, 1000);
}

// Calculate next backoff delay: 30s → 60s → 120s (capped)
function getBackoffDelay() {
  const delays = [30, 60, 120];
  return delays[Math.min(retryAttempt - 1, delays.length - 1)];
}

// ── Reports Archive ───────────────────────────────────────────
async function loadArchive() {
  try {
    const res = await fetch(`${API_BASE}/api/reports`);
    const files = await res.json();
    archiveList.innerHTML = '';
    if (!files.length) {
      archiveList.innerHTML = '<div class="archive-item-empty">No reports found.</div>';
      return;
    }
    files.forEach(file => {
      const div = document.createElement('div');
      div.className = 'archive-item';
      div.innerHTML = `<span class="arch-icon">📄</span> <span class="arch-name">${file.replace('AIGF_Report_', '').replace('.md', '')}</span>`;
      div.onclick = () => loadSavedReport(file);
      archiveList.appendChild(div);
    });
  } catch (err) {
    archiveList.innerHTML = '<div class="archive-item-empty">Error loading archive.</div>';
  }
}

async function loadSavedReport(file) {
  try {
    const res = await fetch(`${API_BASE}/api/reports/${file}`);
    const data = await res.json();
    currentReport = data.content;
    const rl = data.content.toLowerCase();
    renderRiskBadge(rl.includes('high risk') ? 'HIGH' : rl.includes('medium risk') ? 'MEDIUM' : 'LOW');
    stepsRow.innerHTML = '<div class="step-chip">📜 Loaded from Archive</div>';
    reportTxt.innerHTML = formatReport(data.content);
    timestamp.textContent = `Viewing archived report: ${file}`;
    exportBtn.style.display = 'block';
    showPanel('report');
  } catch (err) {
    alert("Could not load report.");
  }
}

refreshArchiveBtn.onclick = loadArchive;
loadArchive(); // Initial load

// ── Core audit runner (used by form submit AND retry) ─────────
async function runAudit(api_key, use_case, data_types) {
  lastSubmission = { api_key, use_case, data_types };

  showPanel('loading');
  toolTimeline.innerHTML = '';
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Analyzing…';

  try {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key, use_case, data_types }),
    });

    const data = await res.json();

    if (!res.ok) {
      retryAttempt++;
      const delay = getBackoffDelay();
      if (data.error === 'rate_limit' || data.error === 'timeout') {
        showPanel('error');
        errorTitle.textContent = data.error === 'timeout' ? '⏱ Request Timed Out' : '⏳ Rate Limit Reached';
        errorMsg.textContent = `${data.message} Auto-retry in ${delay}s (attempt ${retryAttempt}).`;
        startCountdown(delay);
      } else {
        showPanel('error');
        errorTitle.textContent = 'Agent Error';
        errorMsg.textContent = data.message || 'An unexpected error occurred.';
      }
      return;
    }

    // Success — reset backoff counter
    retryAttempt = 0;

    // ── Animate tool steps ──
    if (data.steps && data.steps.length) {
      for (const step of data.steps) {
        await new Promise(r => setTimeout(r, 250));
        if (step.type === 'tool_call') {
          addTimelineItem('call', `Calling: ${step.name}`);
        } else {
          const short = (step.result || '').substring(0, 80) + (step.result?.length > 80 ? '…' : '');
          addTimelineItem('result', short);
        }
      }
      await new Promise(r => setTimeout(r, 600));
    }

    // ── Render report ──
    currentReport = data.report || '';
    const risk = extractRiskLevel(data.report, data.steps);
    renderRiskBadge(risk);
    renderSteps(data.steps || []);
    reportTxt.innerHTML = currentReport
      ? formatReport(currentReport)
      : 'Report was generated and saved to the local audit trail.';

    const ts = new Date(data.timestamp);
    timestamp.textContent = `Generated ${ts.toLocaleDateString()} at ${ts.toLocaleTimeString()}`;
    exportBtn.style.display = 'block';
    loadArchive(); // refresh archive after new report
    showPanel('report');

  } catch (err) {
    retryAttempt++;
    showPanel('error');
    errorTitle.textContent = 'Connection Error';
    errorMsg.textContent = 'Could not reach the Governance Guardian server. Make sure web_server.py is running on port 5050.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Run Governance Audit';
  }
}

// ── Main Form Submit ──────────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const api_key    = apiKeyInput.value.trim();
  const use_case   = useCaseInput.value.trim();
  const data_types = dataInput.value.trim();
  if (!api_key || !use_case) return;
  retryAttempt = 0; // reset backoff on fresh submit
  runAudit(api_key, use_case, data_types);
});
