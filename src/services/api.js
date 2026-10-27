/**
 * AegisBank Chatbot API Client
 * Connects to FastAPI Backend endpoints:
 * - POST /api/v1/chat
 * - GET  /health
 * - GET  /api/v1/agents
 * - POST /api/v1/enrich
 */

// Detect default API Base URL:
// 1. Explicit environment variable: VITE_API_BASE_URL (from .env or build pipeline)
// 2. Production default: https://webappbackend-cchra4azbze9ddac.westus3-01.azurewebsites.net (Azure App Service)
// 3. Development default: '' (uses Vite local proxy to http://127.0.0.1:8000)
export const AZURE_PRODUCTION_BACKEND = 'https://webappbackend-cchra4azbze9ddac.westus3-01.azurewebsites.net';
const ENV_API_BASE = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
export const DEFAULT_API_BASE = ENV_API_BASE || (import.meta.env.PROD ? AZURE_PRODUCTION_BACKEND : '');

export const getApiBaseUrl = () => {
  const custom = localStorage.getItem('aegis_api_base');
  if (custom !== null && custom !== undefined && custom !== '') {
    return custom;
  }
  return DEFAULT_API_BASE;
};

export const setApiBaseUrl = (url) => {
  if (url && url.trim() !== '') {
    localStorage.setItem('aegis_api_base', url.trim().replace(/\/+$/, ''));
  } else {
    localStorage.removeItem('aegis_api_base');
  }
};

/**
 * Check backend health probe
 */
export async function checkBackendHealth() {
  const base = getApiBaseUrl();
  const url = `${base}/health`;
  const startTime = performance.now();

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!res.ok) {
      return {
        healthy: false,
        status: `HTTP ${res.status}`,
        latencyMs: elapsed,
      };
    }

    const data = await res.json();
    return {
      healthy: true,
      latencyMs: elapsed,
      ...data,
    };
  } catch (err) {
    return {
      healthy: false,
      status: 'offline',
      error: err.message,
      latencyMs: Math.round(performance.now() - startTime),
    };
  }
}

/**
 * Fetch Multi-Agent Topology
 */
export async function fetchAgentTopology() {
  const base = getApiBaseUrl();
  const url = `${base}/api/v1/agents`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch live agents topology:', e);
  }

  // Fallback static roadmap representation
  return {
    architecture: 'Hierarchical Multi-Agent Banking Chatbot',
    framework: 'Microsoft Agent Framework',
    total_agents: 4,
    agents: [
      {
        id: 'request_handler_agent',
        role: 'Agent 1: Triage, Domain Validation, Entity Extraction & Query Enrichment',
        status: 'ACTIVE',
        implementation: 'agent_framework.Agent',
      },
      {
        id: 'account_transaction_agent',
        role: 'Agent 2: Balance checks, domestic/wire transfers, account statements',
        status: 'PLANNED',
        target_framework: 'Microsoft Agent Framework',
      },
      {
        id: 'card_security_agent',
        role: 'Agent 3: Debit/Credit card freeze, PIN reset, fraud reporting, limits',
        status: 'PLANNED',
        target_framework: 'Microsoft Agent Framework',
      },
      {
        id: 'advisory_support_agent',
        role: 'Agent 4: Loan applications, interest rates, mortgage advice, FAQs, human handoff',
        status: 'PLANNED',
        target_framework: 'Microsoft Agent Framework',
      },
    ],
  };
}

/**
 * Send user message to Request Handler Agent
 */
export async function sendChatMessage({ message, sessionId, userId, channel = 'web', context = {} }) {
  const base = getApiBaseUrl();
  const url = `${base}/api/v1/chat`;

  const payload = {
    message,
    session_id: sessionId,
    user_id: userId,
    channel,
    context,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Backend Error (${response.status}): ${errText || response.statusText}`);
  }

  return await response.json();
}
