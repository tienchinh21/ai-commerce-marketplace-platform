export const EMBEDDING_PROVIDER = Symbol('EMBEDDING_PROVIDER');

export interface EmbedInput {
  text: string;
}

export interface EmbedResult {
  vector: number[];
  model: string;
  dimension: number;
}

export interface EmbeddingProvider {
  embed(input: EmbedInput): Promise<EmbedResult>;
}
