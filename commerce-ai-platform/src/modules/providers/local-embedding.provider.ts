import {
  EmbedInput,
  EmbedResult,
  EmbeddingProvider,
} from './embedding-provider.interface';

export class LocalEmbeddingProvider implements EmbeddingProvider {
  constructor(private readonly dimension = 64) {}

  async embed(input: EmbedInput): Promise<EmbedResult> {
    const vector = new Array<number>(this.dimension).fill(0);
    const tokens = this.tokenize(input.text);

    for (const token of tokens) {
      const hash = this.hash(token);
      vector[Math.abs(hash) % this.dimension] += hash >= 0 ? 1 : -1;
    }

    const magnitude =
      Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return {
      vector: vector.map((value) => Number((value / magnitude).toFixed(8))),
      model: 'local-hash-embedding-v1',
      dimension: this.dimension,
    };
  }

  private tokenize(text: string): string[] {
    return text
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  private hash(value: string): number {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash | 0;
  }
}
