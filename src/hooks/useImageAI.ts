import { useState } from 'react';

export function useImageAI(brandColors: string[], logoUrl: string) {
  const [imageUrl, setImageUrl] = useState<string>('');

  async function generate() {
    const res = await fetch('/api/ai/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandColors, logoUrl })
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
      setImageUrl(JSON.parse(text).url);
    }
  }

  return { imageUrl, generate };
}
