import { Embeddings, EmbeddingsParams } from "langchain/embeddings/base";
import { EmbeddingModels, Llm } from "@fermyon/spin-sdk";
import chunkArray from "lodash/chunk";

export interface SpinEmbeddingsParams extends EmbeddingsParams {
    model?: EmbeddingModels | string;
    batchSize?: number;
    stripNewLines?: boolean;
}

export class SpinEmbeddings extends Embeddings {

    model: EmbeddingModels | string;

    batchSize: number;

    stripNewLines: boolean;

    constructor(params: SpinEmbeddingsParams) {
        super(params);
        this.model = params.model ?? EmbeddingModels.AllMiniLmL6V2;
        this.batchSize = params.batchSize ?? 50;
        this.stripNewLines = params.stripNewLines ?? true;
    }

    async embedDocuments(documents: string[]): Promise<number[][]> {
        const batches = chunkArray(
            this.stripNewLines ? documents.map((t) => t.replace(/\n/g, " ")) : documents,
            this.batchSize
        );

        const batchRequests = batches.map((batch) => this.runEmbedding(batch));
        const batchResponses = await Promise.all(batchRequests);
        const embeddings: number[][] = [];

        for (let i = 0; i < batchResponses.length; i += 1) {
            const batchResponse = batchResponses[i];
            for (let j = 0; j < batchResponse.length; j += 1) {
                embeddings.push(batchResponse[j]);
            }
        }

        return embeddings;
    }

    async embedQuery(document: string): Promise<number[]> {
        const data = await this.runEmbedding([
            this.stripNewLines ? document.replace(/\n/g, " ") : document,
        ]);
        return data[0];
    }

    private runEmbedding(texts: string[]): Promise<number[][]> {
        try {
            const result = Llm.generateEmbeddings(this.model, texts);
            return Promise.resolve(result.embeddings);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}