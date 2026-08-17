import {
  EmbedInput,
  EmbedResult,
  EmbeddingProvider,
} from './embedding-provider.interface';

export class OpenAiEmbeddingProvider implements EmbeddingProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly dimension = 64,
  ) {}

  async embed(input: EmbedInput): Promise<EmbedResult> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: input.text,
        dimensions: this.dimension,
      }),
    });

    if (!response.ok) {
      throw new Error(`Embedding provider failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      data: Array<{ embedding: number[] }>;
    };
    return {
      vector: payload.data[0]?.embedding ?? [],
      model: this.model,
      dimension: this.dimension,
    };
  }
}
