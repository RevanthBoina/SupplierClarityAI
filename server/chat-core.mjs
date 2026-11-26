/**
 * Shared chat brain for the Clarity Assistant.
 * Used by both the Express server (server/index.mjs) and the Vercel
 * serverless function (api/chat.mjs), so local and production behave alike.
 *
 * Environment variables (set in Vercel: Project Settings > Environment
 * Variables, or in a local .env file for the Express server):
 *   GROQ_API_KEY        Groq API key (https://console.groq.com)
 *   GEMINI_API_KEY      Google Gemini API key (https://aistudio.google.com/app/apikey)
 *                       Aliases also accepted: GOOGLE_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY
 *   GROQ_MODEL          Optional, default "openai/gpt-oss-120b"
 *   GEMINI_MODEL        Optional, default "gemini-2.5-flash"
 *   CHAT_PROVIDER       Optional: "groq" | "gemini" | "auto" (default "auto")
 *
 * Keys are read only on the server and never sent to the browser.
 * With no key configured, a built-in knowledge base answers instead,
 * so the chat still works in demos and during development.
 */

const SYSTEM_PROMPT = `You are the Clarity Assistant for SupplierClarity AI, a vendor product image upscaler for e-commerce and retail. Answer only questions about SupplierClarity AI. Be concise, friendly and helpful. Use US spelling and sentence case. When a page is relevant, link to it with markdown like [Try the upscaler](/enhance).

Facts you may use:
- SupplierClarity AI takes low-resolution supplier product photos and makes them catalog-ready: upscaled, sharpened and standardized, without asking vendors for reshoots.
- The live Clarity Upscaler tool is at /enhance. The visitor drops in a photo, picks an engine, a scale (2x, 3x or 4x) and a format (PNG or JPG), then compares the result in a before/after slider and downloads the file. The demo runs Real-ESRGAN on CPU, jobs queue one at a time, results are kept for two hours, and the demo accepts up to 12 MB and about 1.6 megapixels.
- Three engines: Catalog Balanced (realesrgan-x4fast, everyday workhorse, about 7 seconds per 800x600), Fast Sketch (animevideov3, smallest and fastest, great for flat art and sketches), Photo Max Detail (realesrgan-x4plus, deepest detail, about 2 minutes per 800x600).
- Products: Clarity Upscaler (/enhance), BatchForge (/products/batchforge, bulk catalog processing), PIM Connect (/products/pim-connect, sync imagery into PIM and marketplaces), ComplyCheck (/products/complycheck, marketplace compliance checks).
- Services: Image APIs (/services/image-apis, REST API with batch endpoints, webhooks and CDN delivery), Catalog data modernization (/services/catalog-data), Workflow automation (/services/workflow-automation, supplier inbox to PIM), Agentic QA (/services/agentic-qa, AI agents review images against marketplace rules).
- Industries: e-commerce and retail, marketplaces and multi-vendor, grocery and FMCG, fashion and apparel.
- Results: 3M+ supplier images enhanced, 98% catalog acceptance rate after enhancement, 40+ marketplace and PIM integrations, SOC 2 Type II certified.
- Company: founded in 2022 by Arjun Mehta. Company pages: /company/purpose-leadership, /company/framework, /company/social-initiative, /company/global-presence.
- Primary call to action: Try the upscaler at /enhance, or Book a consultation in the header.

Rules:
- Do not invent pricing, contracts or features that are not listed above. If asked about pricing, point to the live tool and the consultation CTA.
- If a question is off-topic, politely redirect to SupplierClarity AI topics and suggest the upscaler.
- Keep answers short: 2 to 5 sentences, or a short bullet list when comparing options.`;

const FALLBACK_INTENTS = [
  {
    keywords: ['upscal', 'enhanc', 'tool', 'try', 'demo', 'how'],
    answer:
      'The Clarity Upscaler is the live tool on this site. Open [Try the upscaler](/enhance), drop in a supplier photo, pick an engine, a scale (2x, 3x or 4x) and a format (PNG or JPG), then compare the result in the before and after slider and download the catalog-ready file.',
  },
  {
    keywords: ['model', 'engine', 'which', 'balanced', 'sketch', 'detail'],
    answer:
      'Three engines: Catalog Balanced is the everyday workhorse (about 7 seconds per 800x600), Fast Sketch is smallest and fastest for flat art, and Photo Max Detail restores the deepest detail (about 2 minutes per 800x600). Start with Catalog Balanced in [the upscaler](/enhance).',
  },
  {
    keywords: ['batchforge', 'bulk', 'batch'],
    answer: 'BatchForge processes entire supplier catalogs in bulk, thousands of images overnight. See [BatchForge](/products/batchforge).',
  },
  {
    keywords: ['pim', 'sync'],
    answer: 'PIM Connect syncs enhanced imagery straight into your PIM and marketplaces. See [PIM Connect](/products/pim-connect).',
  },
  {
    keywords: ['comply', 'compliance', 'rules'],
    answer: 'ComplyCheck runs automatic marketplace compliance checks before images go live. See [ComplyCheck](/products/complycheck).',
  },
  {
    keywords: ['api', 'rest', 'webhook', 'integrat'],
    answer: 'The Image APIs enhance images on demand through a REST API with batch endpoints, webhooks and CDN delivery. See [Image APIs](/services/image-apis).',
  },
  {
    keywords: ['service', 'offer', 'platform'],
    answer:
      'SupplierClarity AI offers Image APIs, Catalog data modernization, Workflow automation and Agentic QA. Ask about any one by name, or start from the Platform menu in the header.',
  },
  {
    keywords: ['product'],
    answer:
      'The products are Clarity Upscaler, BatchForge, PIM Connect and ComplyCheck. Ask about any one by name.',
  },
  {
    keywords: ['price', 'pricing', 'cost', 'consultation', 'book', 'contact'],
    answer:
      'The fastest way to see the value is the live tool at [Try the upscaler](/enhance). For a consultation about your catalog, use Book a consultation in the header.',
  },
  {
    keywords: ['company', 'about', 'founder', 'arjun', 'who'],
    answer:
      'SupplierClarity AI started in 2022 with founder Arjun Mehta: great products held back by bad photos. Learn more on the [Purpose and leadership](/company/purpose-leadership) page.',
  },
];

function localAnswer(text) {
  const lower = String(text || '').toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const intent of FALLBACK_INTENTS) {
    let score = 0;
    for (const keyword of intent.keywords) {
      if (lower.includes(keyword)) score += keyword.length > 4 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best && bestScore > 0
    ? best.answer
    : 'I can help with SupplierClarity AI topics: the upscaler, which model to pick, products, services, industries or how to book a consultation. Try [the upscaler](/enhance) to see the tool in action.';
}

function cleanHistory(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
    .slice(-12)
    .map(m => ({ role: m.role, text: m.text.slice(0, 2000) }));
}

function env(name) {
  return (process.env[name] || '').trim();
}

function groqKey() {
  return env('GROQ_API_KEY') || env('GROQ_KEY');
}

function geminiKey() {
  return env('GEMINI_API_KEY') || env('GOOGLE_API_KEY') || env('GOOGLE_GENERATIVE_AI_API_KEY') || env('GEMINI_KEY');
}

/** Public status for health checks. Never includes key material. */
export function getChatConfig() {
  const groq = Boolean(groqKey());
  const gemini = Boolean(geminiKey());
  const preferred = env('CHAT_PROVIDER').toLowerCase();
  const provider = preferred === 'groq' || preferred === 'gemini'
    ? preferred
    : groq ? 'groq' : gemini ? 'gemini' : 'local';
  return { provider, groqConfigured: groq, geminiConfigured: gemini };
}

async function fetchWithTimeout(url, options, ms = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callGroq(history) {
  const key = groqKey();
  if (!key) throw new Error('Groq key not configured');
  const model = env('GROQ_MODEL') || 'openai/gpt-oss-120b';
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 1024,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
    }),
  });
  if (!res.ok) throw new Error(`Groq request failed (${res.status})`);
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('Groq returned an empty reply');
  return { reply, provider: 'groq', model };
}

async function callGemini(history) {
  const key = geminiKey();
  if (!key) throw new Error('Gemini key not configured');
  const model = env('GEMINI_MODEL') || 'gemini-2.5-flash';
  const contents = history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini request failed (${res.status})`);
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts
    ?.map(p => p.text || '')
    .join('')
    .trim();
  if (!reply) throw new Error('Gemini returned an empty reply');
  return { reply, provider: 'gemini', model };
}

/**
 * Answer one chat turn. Tries the configured provider first, falls back to
 * the other provider, then to the built-in knowledge base. Never throws for
 * provider problems: the chat always gets a usable reply.
 */
export async function handleChat(body) {
  const history = cleanHistory(body?.messages);
  if (history.length === 0) {
    return { reply: 'Ask me about the upscaler, models, products or services.', provider: 'local', model: null };
  }
  const latest = [...history].reverse().find(m => m.role === 'user')?.text || '';

  const preferred = env('CHAT_PROVIDER').toLowerCase();
  const order = [];
  if (preferred === 'groq') order.push(['groq', callGroq]);
  else if (preferred === 'gemini') order.push(['gemini', callGemini]);
  else {
    if (groqKey()) order.push(['groq', callGroq]);
    if (geminiKey()) order.push(['gemini', callGemini]);
  }

  for (const [, call] of order) {
    try {
      return await call(history);
    } catch (err) {
      console.error('[chat] provider failed, trying next:', err?.message || err);
    }
  }

  return { reply: localAnswer(latest), provider: 'local', model: null };
}
