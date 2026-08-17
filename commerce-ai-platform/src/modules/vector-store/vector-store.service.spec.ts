import { cosineSimilarity } from './vector-store.service';

describe('cosineSimilarity', () => {
  it('scores identical vectors as 1', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(1);
  });

  it('scores orthogonal vectors as 0', () => {
    expect(cosineSimilarity([1, 0, 0], [0, 1, 0])).toBeCloseTo(0);
  });

  it('handles negative correlations', () => {
    expect(cosineSimilarity([1, 0, 0], [-1, 0, 0])).toBeCloseTo(-1);
  });
});
