import { useState } from 'react';

export function useCopyAI(hook: string, benefit: string, cta: string, lang: string) {
  const [variants, setVariants] = useState<string[]>([]);

  async function generate() {
    const res = await fetch('/api/ai/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hook, benefit, cta, lang })
    });
    const reader = res.body?.getReader();
    if (reader) {
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      const text = new TextDecoder().decode(Buffer.concat(chunks));
      setVariants(JSON.parse(text));
    }
  }

  return { variants, generate };
}
