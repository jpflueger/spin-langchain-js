import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"
import { SpinLLM } from "./langchain/llms/spin";

const decoder = new TextDecoder();
const encoder = new TextEncoder();

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
    
    const spinLLM = new SpinLLM({
        model: "llama2-chat",
    });

    const prompt = decoder.decode(request.body);

    const assistant = await spinLLM.call(prompt);

    return {
        status: 200,
        headers: { "Content-Type": "text/plain" },
        body: encoder.encode(assistant).buffer
    }
}
