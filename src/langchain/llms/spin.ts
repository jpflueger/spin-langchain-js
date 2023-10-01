import { LLM, BaseLLMParams } from "langchain/llms/base";
import { InferencingModels, InferencingOptions, Llm as SpinSdkLLM } from "@fermyon/spin-sdk"

export interface SpinLLMParams extends BaseLLMParams {
    model: InferencingModels | string;
    options?: InferencingOptions | undefined;
};

export class SpinLLM extends LLM {

    model: InferencingModels | string;
    options?: InferencingOptions | undefined;

    constructor(params: SpinLLMParams) {
        super(params ?? {});

        if (!params.model) {
            throw new Error('Please pass a "model" parameter to the SpinLLM constructor.');
        }

        this.model = params.model;
        this.options = params.options;
    }

    _call(
        prompt: string
    ): Promise<string> {
        try {
            const result = SpinSdkLLM.infer(this.model, prompt, this.options);

            //TODO: implement BaseLLM so we can better format the output

            return Promise.resolve(result.text);
        } catch (e: any) {
            return Promise.reject(e);
        }
    }
    _llmType(): string {
        return `spin-${this.model}`;
    }
}
