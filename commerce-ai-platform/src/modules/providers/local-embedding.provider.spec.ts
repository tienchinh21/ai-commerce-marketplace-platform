import { LocalEmbeddingProvider } from './local-embedding.provider';

describe('LocalEmbeddingProvider', () => {
  it('returns deterministic normalized vectors', async () => {
    const provider = new LocalEmbeddingProvider(8);
    const first = await provider.embed({ text: 'kem chống nắng da dầu' });
    const second = await provider.embed({ text: 'kem chống nắng da dầu' });

    expect(first.vector).toEqual(second.vector);
    expect(first.vector).toHaveLength(8);
    expect(first.model).toBe('local-hash-embedding-v1');
  });

  it('returns similar vectors for overlapping text', async () => {
    const provider = new LocalEmbeddingProvider(16);
    const a = await provider.embed({ text: 'giày chạy bộ nhẹ' });
    const b = await provider.embed({ text: 'giày thể thao chạy bộ' });

    const dot = a.vector.reduce((sum, value, index) => sum + value * b.vector[index], 0);
    expect(dot).toBeGreaterThan(0);
  });
});
