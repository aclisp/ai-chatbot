import { openai } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

type FetchFunction = typeof globalThis.fetch;
const logFetch: FetchFunction = async (url, options): Promise<Response> => {
  // @ts-ignore
  const { method = 'GET', headers = {}, body = null } = options;
  console.log(`==> ${method} ${url}`);
  console.log('==> (Headers) %o', headers);

  if (body) {
    if (
      typeof body === 'string' &&
      headers['Content-Type'] === 'application/json'
    ) {
      console.log('==> (Body) %o', JSON.parse(body));
    } else {
      console.log('==> (Body) %o', body);
    }
  }

  const response = await fetch(url, options);
  console.log(`<== ${response.status} ${response.statusText}`);
  return response;
};

const ali = createOpenAICompatible({
  name: 'Alibaba Cloud',
  apiKey: process.env.ALI_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  fetch: logFetch,
});

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

export const myProvider = customProvider({
  languageModels: {
    'chat-model-small': ali('qwen-plus'),
    'chat-model-large': ali('qwen-max'),
    'chat-model-reasoning': wrapLanguageModel({
      model: ali('deepseek-r1'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': ali('qwen-turbo'),
    'artifact-model': ali('qwen-plus'),
  },
  imageModels: {
    'small-model': openai.image('dall-e-2'),
    'large-model': openai.image('dall-e-3'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'Small model',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];
