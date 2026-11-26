/**
 * Vercel serverless function: /api/chat
 *
 * Set these in Vercel (Project Settings > Environment Variables), then
 * redeploy. Keys stay on the server and are never exposed to the browser:
 *   GROQ_API_KEY     (https://console.groq.com)
 *   GEMINI_API_KEY   (https://aistudio.google.com/app/apikey)
 * Optional:
 *   GROQ_MODEL       default "llama-3.3-70b-versatile"
 *   GEMINI_MODEL     default "gemini-2.0-flash"
 *   CHAT_PROVIDER    "groq" | "gemini" | "auto" (default "auto": Groq first)
 *
 * GET /api/chat returns the public provider status (no key material).
 * With no key configured, the built-in knowledge base answers instead.
 */
import { handleChat, getChatConfig } from '../server/chat-core.mjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ ok: true, chat: getChatConfig() });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    res.status(200).json(await handleChat(body || {}));
  } catch (err) {
    console.error('[chat] handler error:', err?.message || err);
    res.status(500).json({ error: 'Chat request failed' });
  }
}
