/**
 * Copy and knowledge for the Clarity Assistant (bottom-right chatbot).
 * The assistant answers only about SupplierClarity AI: the upscaler tool,
 * products, services, industries and the company. When a Groq or Gemini key
 * is configured on the server, the same facts are sent as the system prompt
 * (see server/chat-core.mjs); this file powers the instant local fallback
 * so the chat still works with no key and during `ng serve` development.
 */

export interface ChatSuggestion {
  label: string;
  prompt: string;
}

export const CHAT_GREETING =
  'Hi, I am the Clarity Assistant. Ask me about the upscaler, which model to pick, products, services or how to get started.';

export const CHAT_SUGGESTIONS: ChatSuggestion[] = [
  { label: 'Try the upscaler', prompt: 'How do I try the upscaler?' },
  { label: 'Which model should I use?', prompt: 'Which enhancement model should I use?' },
  { label: 'What services do you offer?', prompt: 'What services do you offer?' },
  { label: 'Book a consultation', prompt: 'How do I book a consultation?' },
];

interface Intent {
  /** Lowercase keywords; the intent with the most hits wins. */
  keywords: string[];
  answer: string;
}

const UPSCALER =
  'The **Clarity Upscaler** is the live tool on this site. Open [Try the upscaler](/enhance), drop in a supplier photo, pick an engine, a scale (2x, 3x or 4x) and a format (PNG or JPG), then compare the result in the before and after slider and download the catalog-ready file. The demo runs Real-ESRGAN on CPU, so jobs queue one at a time and results are kept for two hours.';

const MODELS =
  'There are three engines in the tool:\n- **Catalog Balanced** (realesrgan-x4fast) is the everyday workhorse, about 7 seconds per 800x600 image.\n- **Fast Sketch** (animevideov3) is the smallest and fastest, great for flat art and sketches.\n- **Photo Max Detail** (realesrgan-x4plus) restores the deepest detail, about 2 minutes per 800x600 image.\nFor most catalog photos, start with Catalog Balanced. Open [Try the upscaler](/enhance) to compare them on your own image.';

const INTENTS: Intent[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    answer:
      'Hello. I can help with the **Clarity Upscaler**, the products, the services or getting started. Try asking which model to use, or tap a suggestion below.',
  },
  {
    keywords: ['upscaler', 'upscale', 'enhance', 'tool', 'try', 'demo', 'how do i use', 'how to use', 'how does it work', 'start'],
    answer: UPSCALER,
  },
  {
    keywords: ['model', 'engine', 'which', 'balanced', 'sketch', 'photo max', 'detail', 'fast', 'quality', 'speed'],
    answer: MODELS,
  },
  {
    keywords: ['scale', '2x', '3x', '4x', 'format', 'png', 'jpg', 'jpeg', 'output'],
    answer:
      'In the tool you can upscale to **2x, 3x or 4x** and export as **PNG or JPG**. Use 4x for zoom-ready detail, and pick JPG when file weight matters for a marketplace. Try it on [the upscaler page](/enhance).',
  },
  {
    keywords: ['limit', 'size', 'large', 'mb', 'megapixel', 'mp', 'slow', 'long', 'queue', 'how long'],
    answer:
      'The live demo is tuned for CPU, so it accepts images up to **12 MB** and about **1.6 megapixels** (for example 1264x1264). Jobs run one at a time, results are kept for two hours, then deleted. For larger catalogs, see [BatchForge](/products/batchforge) and [Image APIs](/services/image-apis).',
  },
  {
    keywords: ['batchforge', 'bulk', 'batch', 'thousands', 'catalogs in bulk'],
    answer:
      '**BatchForge** processes entire supplier catalogs in bulk, thousands of images overnight, so a backlog clears without manual tickets. See [BatchForge](/products/batchforge).',
  },
  {
    keywords: ['pim', 'sync', 'marketplace sync', 'connect'],
    answer:
      '**PIM Connect** syncs enhanced imagery straight into your PIM and marketplaces, so the catalog-ready file lands where your team already works. See [PIM Connect](/products/pim-connect).',
  },
  {
    keywords: ['comply', 'compliance', 'check', 'rules', 'rejection', 'rejected', 'marketplace rules'],
    answer:
      '**ComplyCheck** runs automatic marketplace compliance checks before images go live, catching resolution, background, crop and file weight issues early. See [ComplyCheck](/products/complycheck).',
  },
  {
    keywords: ['api', 'rest', 'webhook', 'integration', 'integrate', 'developer', 'cdn'],
    answer:
      'The **Image APIs** enhance images on demand through a REST API with batch endpoints, webhooks and CDN delivery for every channel. See [Image APIs](/services/image-apis). If you want to try the engine first, open [the upscaler](/enhance).',
  },
  {
    keywords: ['catalog data', 'modernization', 'modernisation', 'enrich', 'clean', 'product data', 'data'],
    answer:
      '**Catalog data modernization** cleans, enriches and structures fragmented product data into a single catalog every channel can trust. See [Catalog data](/services/catalog-data).',
  },
  {
    keywords: ['automation', 'workflow', 'inbox', 'pipeline', 'automate'],
    answer:
      '**Workflow automation** takes a supplier image from inbox to PIM automatically: ingest, enhancement, QA and publishing with no manual steps. See [Workflow automation](/services/workflow-automation).',
  },
  {
    keywords: ['qa', 'agentic', 'agent', 'review', 'human'],
    answer:
      '**Agentic QA** uses AI agents to review every enhanced image against marketplace rules and flag only what needs a human. See [Agentic QA](/services/agentic-qa).',
  },
  {
    keywords: ['service', 'services', 'offer', 'platform'],
    answer:
      'SupplierClarity AI offers four services: **Image APIs**, **Catalog data modernization**, **Workflow automation** and **Agentic QA**. Start from the Platform menu in the header, or ask about any one of them by name.',
  },
  {
    keywords: ['product', 'products'],
    answer:
      'The products are **Clarity Upscaler** (the live tool at [Try the upscaler](/enhance)), **BatchForge** for bulk processing, **PIM Connect** for syncing imagery into your PIM and **ComplyCheck** for marketplace compliance. Ask about any one by name.',
  },
  {
    keywords: ['industr', 'retail', 'ecommerce', 'e-commerce', 'grocery', 'fashion', 'marketplace'],
    answer:
      'SupplierClarity AI works with **e-commerce and retail**, **marketplaces and multi-vendor sellers**, **grocery and FMCG** and **fashion and apparel**. The common thread is the same: supplier photos that need to meet marketplace image rules without reshoots.',
  },
  {
    keywords: ['price', 'pricing', 'cost', 'how much', 'plan', 'consultation', 'book', 'contact', 'talk', 'sales'],
    answer:
      'The fastest way to see the value is the live tool: open [Try the upscaler](/enhance) and enhance a real supplier photo. For a consultation about your catalog, use **Book a consultation** in the header, which opens the same tool page where the team can guide you.',
  },
  {
    keywords: ['result', 'stat', 'proof', 'how good', 'acceptance', 'images enhanced', 'soc', 'security'],
    answer:
      'The platform has enhanced **3M+ supplier images** with a **98% catalog acceptance rate** after enhancement, across **40+ marketplace and PIM integrations**. The company is **SOC 2 Type II** certified. See the case studies on the home page for the story behind those numbers.',
  },
  {
    keywords: ['company', 'about', 'founder', 'who', 'team', 'arjun', 'started', 'founded'],
    answer:
      'SupplierClarity AI started in 2022 with a simple frustration: great products held back by bad photos. Founder **Arjun Mehta** built the missing layer that makes any supplier image catalog-ready, with no reshoots. Learn more on the [Purpose and leadership](/company/purpose-leadership) page.',
  },
  {
    keywords: ['thank', 'thanks', 'great', 'helpful'],
    answer:
      'You are welcome. If you have a supplier photo handy, the best next step is [the upscaler](/enhance). I am here if you want to compare models or explore a product.',
  },
];

const FALLBACK =
  'I can help with SupplierClarity AI topics: the **upscaler**, which **model** to pick, **products**, **services**, **industries** or how to **book a consultation**. Try one of the suggestions below, or open [Try the upscaler](/enhance) to see the tool in action.';

/** Score every intent by keyword hits and return the best answer. */
export function answerLocally(input: string): string {
  const text = input.toLowerCase();
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const keyword of intent.keywords) {
      if (text.includes(keyword)) score += keyword.length > 4 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best && bestScore > 0 ? best.answer : FALLBACK;
}
