import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"
import { SpinLLM } from "./langchain/llms/spin";
import { PromptTemplate } from "langchain/prompts";

// const _decoder = new TextDecoder();
const encoder = new TextEncoder();

export const handleRequest: HandleRequest = async function (_request: HttpRequest): Promise<HttpResponse> {
    // basic batch example
    const model = new SpinLLM({
        model: "llama2-chat",
    });
    const promptTemplate = PromptTemplate.fromTemplate(
        "Tell me a joke about {topic}"
    );

    const chain = promptTemplate.pipe(model);

    const result = await chain.batch([{ topic: "bears" }, { topic: "cats" }]);

    const body = JSON.stringify({ result });
    
    return {
        status: 200,
        headers: { "Content-Type": "text/plain" },
        body: encoder.encode(body).buffer
    }
}
