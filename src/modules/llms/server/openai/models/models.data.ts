import { LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Vision } from '~/common/stores/llms/llms.types';

import type { ModelDescriptionSchema } from '../../llm.server.types';

import { _knownOpenAIChatModels } from './openai.models';
import { wireGroqModelsListOutputSchema } from '../groq.wiretypes';
import { wireOpenPipeModelOutputSchema } from '../openpipe.wiretypes';
import { wireOpenrouterModelsListOutputSchema } from '../openrouter.wiretypes';


export function azureModelToModelDescription(azureDeploymentRef: string, openAIModelIdBase: string, modelCreated: number, modelUpdated?: number): ModelDescriptionSchema {
  // if the deployment name mataches an OpenAI model prefix, use that
  const known = _knownOpenAIChatModels.find(base => azureDeploymentRef == base.idPrefix);
  return fromManualMapping(_knownOpenAIChatModels, known ? azureDeploymentRef : openAIModelIdBase, modelCreated, modelUpdated, undefined, true);
}


// [LM Studio]
export function lmStudioModelToModelDescription(modelId: string): ModelDescriptionSchema {

  // LM Studio model ID's are the file names of the model files
  function getFileName(filePath: string): string {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return normalizedPath.split('/').pop() || '';
  }

  return fromManualMapping([], modelId, undefined, undefined, {
    idPrefix: modelId,
    label: getFileName(modelId)
      .replace('.gguf', '')
      .replace('.bin', ''),
    // .replaceAll('-', ' '),
    description: `Unknown LM Studio model. File: ${modelId}`,
    contextWindow: null, // 'not provided'
    interfaces: [LLM_IF_OAI_Chat], // assume..
    chatPrice: { input: 'free', output: 'free' },
  });
}


// [LocalAI]
const _knownLocalAIChatModels: ManualMappings = [
  {
    idPrefix: 'ggml-gpt4all-j',
    label: 'GPT4All-J',
    description: 'GPT4All-J on LocalAI',
    contextWindow: 2048,
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'luna-ai-llama2',
    label: 'Luna AI Llama2 Uncensored',
    description: 'Luna AI Llama2 on LocalAI',
    contextWindow: 4096,
    interfaces: [LLM_IF_OAI_Chat],
  },
];

export function localAIModelToModelDescription(modelId: string): ModelDescriptionSchema {
  return fromManualMapping(_knownLocalAIChatModels, modelId, undefined, undefined, {
    idPrefix: modelId,
    label: modelId
      .replace('ggml-', '')
      .replace('.bin', '')
      .replaceAll('-', ' '),
    description: 'Unknown localAI model. Please update `models.data.ts` with this ID',
    contextWindow: null, // 'not provided'
    interfaces: [LLM_IF_OAI_Chat], // assume..
    chatPrice: { input: 'free', output: 'free' },
  });
}


// [Mistral] moved to own file


// [OpenPipe]

const _knownOpenPipeChatModels: ModelDescriptionSchema[] = [
  {
    id: 'openpipe:openrouter/google/gemini-flash-1.5',
    label: '💾➜ Google Gemini Flash 1.5',
    description: 'Optimized for speed and efficiency, designed for high-volume tasks at scale with extensive context handling capabilities.',
    contextWindow: 1000000,
    maxCompletionTokens: 1000000,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.075, output: 0.3 },
  },

  {
    id: 'openpipe:openrouter/nvidia/llama-3.1-nemotron-70b-instruct',
    label: '💾➜ NVIDIA Nemotron 70B Instruct',
    description: 'Advanced model optimized for improved helpfulness, capable of chat, text-to-text, and code generation tasks.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: { input: 0.35, output: 0.4 },
  },

  {
    id: 'openpipe:openrouter/openchat/openchat-7b',
    label: '💾➜ OpenChat 7B',
    description: 'Open source model that outperforms ChatGPT-3.5 on several benchmarks. Uses SFT and RLFT for alignment with human goals.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/anthracite-org/magnum-v4-72b',
    label: '💾➜ Anthracite Magnum v4 72B',
    description: 'Large-scale model designed for advanced reasoning and complex tasks.',
    contextWindow: 16384,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 1.875, output: 2.25 },
  },

  {
    id: 'openpipe:openrouter/cohere/command-r-plus',
    label: '💾➜ Cohere Command R+',
    description: 'Advanced enterprise-grade model with strong performance across various tasks.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 2.85, output: 14.25 },
  },

  {
    id: 'openpipe:openrouter/perplexity/llama-3.1-sonar-small-128k-online',
    label: '💾➜ Perplexity Sonar Small 128k',
    description: 'Part of Perplexity\'s latest Sonar model family with real-time information access capabilities.',
    contextWindow: 127000,
    maxCompletionTokens: 127000,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: { input: 1.0, output: 1.0 },
  },

  {
    id: 'openpipe:openrouter/mistralai/ministral-8b',
    label: '💾➜ Mistral Ministral 8B',
    description: 'Small-scale model suitable for edge devices with strong performance in knowledge retrieval and common-sense reasoning.',
    contextWindow: 131072,
    maxCompletionTokens: 131072,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: { input: 0.1, output: 0.1 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.2-11b-vision-instruct',
    label: '💾➜ Meta Llama 3.2 11B Vision',
    description: 'Vision-capable model optimized for fast output speed and low latency.',
    contextWindow: 130000,
    maxCompletionTokens: 130000,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.2-90b-vision-instruct',
    label: '💾➜ Meta Llama 3.2 90B Vision',
    description: 'Large vision model with high quality outputs and extensive context handling.',
    contextWindow: 130000,
    maxCompletionTokens: 130000,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.2-3b-instruct',
    label: '💾➜ Meta Llama 3.2 3B',
    description: 'Compact instruction-following model suitable for lightweight applications.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.1-405b-instruct',
    label: '💾➜ Meta Llama 3.1 405B Instruct',
    description: 'Advanced multilingual model optimized for dialogue use cases. Strong performance on MMLU, CommonSenseQA, and other benchmarks.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2023-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.1-405b-instruct:free',
    label: '💾➜ Meta Llama 3.1 405B Instruct Free',
    description: 'Free version of the Llama 3.1 405B Instruct model with same capabilities.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2023-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.1-405b',
    label: '💾➜ Meta Llama 3.1 405B',
    description: 'Base version of Meta\'s largest Llama 3.1 model with extensive multilingual capabilities.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2023-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/nousresearch/hermes-3-llama-3.1-405b',
    label: '💾➜ Hermes 3 Llama 3.1 405B',
    description: 'Generalist language model with improved capabilities over Hermes 2, featuring enhanced function calling and structured output capabilities.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  /* OpenPipe models - by default it's OpenAI models, through the proxy service. */

  // DeepSeek models
  {
    id: 'openpipe:openrouter/deepseek/deepseek-chat',
    label: '💾➜ DeepSeek V3',
    description: 'DeepSeek-V3 is the latest model from the DeepSeek team, building upon the instruction following and coding abilities of the previous versions. Pre-trained on diverse data including code, academic papers, and general knowledge.',
    contextWindow: 64000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2023-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.14, output: 0.28 },
  },

  {
    id: 'openpipe:openrouter/qwen/qvq-72b-preview',
    label: '💾➜ Qwen QvQ 72B Preview',
    description: 'Experimental research model developed by the Qwen team with 128K context window.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.25, output: 0.5 },
  },

  {
    id: 'openpipe:totalgpt/inflatebot/inflatebot-MN-12B-Mag-Mell-R1',
    label: '💾➜ InflateBot MN 12B Mag-Mell',
    description: 'Mistral-based 12B parameter model optimized for creative and fictional applications, with strong ChatML formatting capabilities.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.15, output: 0.25 },
  },

  {
    id: 'openpipe:totalgpt/sao10k/Sao10K-72B-Qwen2.5-Kunou-v1-FP8-Dynamic',
    label: '💾➜ Sao10K Qwen2.5 72B Kunou',
    description: 'Advanced 72B parameter model based on Qwen2.5 architecture with 128K context support.',
    contextWindow: 128000,
    maxCompletionTokens: 8192,
    trainingDataCutoff: '2024-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.25, output: 0.5 },
  },

  {
    id: 'openpipe:totalgpt/sao10k/Sao10K-L3.3-70B-Euryale-v2.3-FP8-Dynamic',
    label: '💾➜ Sao10K Llama 3.3 70B Euryale',
    description: 'Llama 3.3-based 70B parameter model with 128K context window and enhanced creative capabilities.',
    contextWindow: 128000,
    maxCompletionTokens: 16384,
    trainingDataCutoff: '2024-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.2, output: 0.4 },
  },

  {
    id: 'openpipe:totalgpt/meta-llama/Llama-3.3-70B-Instruct-FP8-Dynamic',
    label: '💾➜ Meta Llama 3.3 70B Instruct FP8',
    description: 'Advanced multilingual model with 128K context window, trained on over 15 trillion tokens with optimized FP8 quantization.',
    contextWindow: 128000,
    maxCompletionTokens: 2048,
    trainingDataCutoff: '2023-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.2, output: 0.4 },
  },

  {
    id: 'openpipe:totalgpt/anthracite-org/magnum-v2-72b-FP8-Dynamic',
    label: '💾➜ Anthracite Magnum v2 72B',
    description: 'High-performance 72B parameter model based on Qwen2, optimized for multilingual communication and complex reasoning. Achieves 75.60% on IFEval and 57.85% on BBH benchmarks.',
    contextWindow: 16384,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.25, output: 0.5 },
    benchmark: { cbaElo: 1250 },
  },

  {
    id: 'openpipe:totalgpt/nousresearch/Hermes-3-Llama-3.1-70B-FP8',
    label: '💾➜ NousResearch Hermes 3 70B',
    description: 'Advanced reasoning model based on Llama 3.1 architecture, optimized with FP8 quantization for efficient deployment. Features strong capabilities in structured outputs and function calling.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.2, output: 0.4 },
  },

  {
    id: 'openpipe:totalgpt/qwen/Qwen-QwQ-32B-Preview',
    label: '💾➜ Qwen QwQ 32B Preview',
    description: 'Specialized 32B parameter model with strong capabilities in mathematics, programming, and scientific reasoning. Features 32K context window and optimized attention mechanisms.',
    contextWindow: 32768,
    maxCompletionTokens: 8000,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.15, output: 0.3 },
  },

  {
    id: 'openpipe:totalgpt/infermatic/Infermatic-MN-12B-Inferor-v',
    label: '💾➜ Infermatic MN 12B Inferor',
    description: 'Mistral-based 12B parameter model optimized with BFloat16 precision, featuring advanced text generation capabilities through model merging techniques.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.1, output: 0.2 },
  },

  {
    id: 'openpipe:totalgpt/thedrummer/UnslopNemo-12B-v4.1',
    label: '💾➜ TheDrummer UnslopNemo 12B v4.1',
    description: 'General-purpose 12B parameter language model focused on text generation and processing tasks.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.1, output: 0.2 },
  },

  {
    id: 'openpipe:totalgpt/qwen/Qwen2.5-72B-Instruct-Turbo',
    label: '💾➜ Qwen 2.5 72B Instruct Turbo',
    description: 'High-performance 72B parameter model optimized for speed and efficiency. Achieves 93.1 on RULER benchmark and excels in long-text tasks with 100% accuracy in 1M length Passkey Retrieval.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-09',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.25, output: 0.5 },
    benchmark: { cbaElo: 1275 },
  },

  {
    id: 'openpipe:openrouter/nvidia/Llama-3.1-Nemotron-70B-Instruct-HF',
    label: '💾➜ NVIDIA Nemotron 70B Instruct',
    description: 'Advanced 70B parameter model based on Llama 3.1, optimized with RLHF using HelpSteer2 dataset. Achieves strong performance with 8.98 on MT-Bench.',
    contextWindow: 128000,
    maxCompletionTokens: 4000,
    trainingDataCutoff: '2023-12',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.2, output: 0.4 },
    benchmark: { cbaElo: 1267 },
  },

  {
    id: 'openpipe:totalgpt/midnight/Midnight-Miqu-70B-v1.5',
    label: '💾➜ Midnight Miqu 70B v1.5',
    description: 'Creative writing focused 70B parameter model with strong performance in storytelling and roleplaying. Achieves consistent 77+ scores on EQ-Bench.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Json],
    chatPrice: { input: 0.2, output: 0.4 },
    benchmark: { cbaElo: 1260 },
  },

  {
    id: 'openpipe:totalgpt/wizardlm/WizardLM-2-8x22B',
    label: '💾➜ WizardLM 2 8x22B',
    description: 'Advanced reasoning model with exceptional performance in technical tasks. Achieves 9.2 in reasoning, 9.4 in technical analysis, and 9.3 in language understanding benchmarks.',
    contextWindow: 65536,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.15, output: 0.3 },
    benchmark: { cbaElo: 1280 },
  },

  {
    id: 'openpipe:totalgpt/tenyx/Llama-3-TenyxChat-DaybreakStorywriter-70B-fp8-dynamic',
    label: '💾➜ TenyxChat Daybreak 70B',
    description: 'Llama 3-based storytelling model optimized with fp8 dynamic quantization for efficient deployment.',
    contextWindow: 8192,
    maxCompletionTokens: 2048,
    trainingDataCutoff: '2023-12',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.2, output: 0.4 },
  },

  {
    id: 'openpipe:totalgpt/sao10k/Sao10K-L3.1-70B-Hanami-x1',
    label: '💾➜ Sao10K Llama 3.1 70B Hanami',
    description: 'Advanced 70B parameter model based on Llama 3.1 architecture with extended context handling capabilities.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 3.0, output: 3.0 },
  },

  {
    id: 'openpipe:openrouter/mistralai/Mixtral-8x7B-Instruct-v0.1',
    label: '💾➜ Mixtral 8x7B Instruct v0.1',
    description: 'High-performance model with 32K context window, achieving 8.30 on MT-Bench. Excels in code generation and text summarization.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: { input: 0.15, output: 0.3 },
    benchmark: { cbaElo: 1270 },
  },

  {
    id: 'openpipe:openrouter/thedrummer/Rocinante-12B-v1.1',
    label: '💾➜ TheDrummer Rocinante 12B v1.1',
    description: 'Mistral-based 12B parameter model optimized for creative writing and storytelling, featuring BF16 precision and adjustable temperature settings.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.1, output: 0.2 },
  },

  {
    id: 'openpipe:openrouter/qwen/Qwen2-72B-Instruct',
    label: '💾➜ Qwen2 72B Instruct',
    description: 'Advanced 72B parameter model with multimodal capabilities, supporting vision, code, and multilingual tasks. Features 128K context window and strong performance across various benchmarks.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Vision],
    chatPrice: { input: 0.25, output: 0.5 },
    benchmark: { cbaElo: 1285 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
    label: '💾➜ Llama 3.2 11B Vision Instruct',
    description: 'Vision-optimized 11B parameter model with capabilities in visual recognition, reasoning, and captioning. Features 128K theoretical context window (8K practical limit).',
    contextWindow: 8192,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2023-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision],
    chatPrice: { input: 0.15, output: 0.3 },
  },

  {
    id: 'openpipe:openrouter/nousresearch/hermes-3-llama-3.1-70b',
    label: '💾➜ Hermes 3 70B Instruct',
    description: 'Generalist language model with improvements over Hermes 2, featuring a 131K context window.',
    contextWindow: 131000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-08',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.12, output: 0.3 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.3-70b-instruct',
    label: '💾➜ Llama 3.3 70B Instruct',
    description: 'Meta Llama 3.3 multilingual large language model with strong capabilities in finance, academia, and science. Features 131K context window.',
    contextWindow: 131072,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.12, output: 0.3 },
  },

  {
    id: 'openpipe:openrouter/perplexity/llama-3.1-sonar-huge-128k-online',
    label: '💾➜ Llama 3.1 Sonar 405B Online',
    description: 'Perplexity\'s latest Sonar model family based on Llama 3.1, featuring a 127K context window and online capabilities.',
    contextWindow: 127072,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-08',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 5.0, output: 5.0 },
  },

  {
    id: 'openpipe:openrouter/nousresearch/hermes-3-llama-3.1-405b',
    label: '💾➜ Hermes 3 405B Instruct',
    description: 'Hermes 3 405B model with improvements over Hermes 2, featuring a 131K context window and enhanced generalist capabilities.',
    contextWindow: 131072,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-08',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.8, output: 0.8 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.1-405b',
    label: '💾➜ Llama 3.1 405B (base)',
    description: 'Meta\'s latest class of model (Llama 3.1) launched with a variety of sizes & flavors. This is the base 405B model with a 32K context window.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-08',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 2.0, output: 2.0 },
  },

  {
    id: 'openpipe:openrouter/meta-llama/llama-3.2-90b-vision-instruct',
    label: '💾➜ Llama 3.2 90B Vision Instruct',
    description: 'The Llama 90B Vision model is a top-tier, 90-billion-parameter multimodal model designed for advanced vision and language tasks. Features 131K context window.',
    contextWindow: 131072,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-09',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Vision],
    chatPrice: { input: 0.9, output: 0.9 },
  },

  {
    id: 'openpipe:openrouter/nvidia/llama-3.1-nemotron-70b-instruct',
    label: '💾➜ NVIDIA Llama 3.1 Nemotron 70B Instruct',
    description: 'NVIDIA\'s Llama 3.1 Nemotron 70B is a language model designed for generating precise and high-quality text. Features 131K context window.',
    contextWindow: 131000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-10',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.12, output: 0.3 },
  },

  {
    id: 'openpipe:openrouter/anthracite-org/magnum-v4-72b',
    label: '💾➜ Magnum v4 72B',
    description: 'A series of models designed to replicate the prose quality of the Claude 3 models, featuring a 16K context window.',
    contextWindow: 16384,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-10',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 1.875, output: 2.25 },
  },

  {
    id: 'openpipe:openrouter/x-ai/grok-2-1212',
    label: '💾➜ Grok 2 1212',
    description: 'Grok 2 1212 introduces significant enhancements to accuracy, instruction adherence, and overall performance. Features 131K context window.',
    contextWindow: 131072,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 2.0, output: 10.0 },
  },

  {
    id: 'openpipe:openrouter/x-ai/grok-2-vision-1212',
    label: '💾➜ Grok 2 Vision 1212',
    description: 'Grok 2 Vision 1212 advances image-based AI with stronger visual comprehension, refined instruction adherence, and overall performance. Features 32K context window.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-12',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Vision],
    chatPrice: { input: 2.0, output: 10.0 },
  },

  {
    id: 'openpipe:openrouter/openai/chatgpt-4o-latest',
    label: '💾➜ ChatGPT-4o',
    description: 'OpenAI ChatGPT 4o is continually updated by OpenAI to point to the current version of GPT-4o. Features 128K context window.',
    contextWindow: 128000,
    maxCompletionTokens: 16384,
    trainingDataCutoff: '2024-08',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Vision],
    chatPrice: { input: 5.0, output: 15.0 },
  },

  {
    id: 'openpipe:openrouter/anthropic/claude-3.5-sonnet',
    label: '💾➜ Claude 3.5 Sonnet',
    description: 'New Claude 3.5 Sonnet delivers better-than-Opus capabilities, faster-than-Sonnet speeds, and a 200K context window.',
    contextWindow: 200000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-10',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Vision],
    chatPrice: { input: 3.0, output: 15.0 },
  },

  {
    id: 'openpipe:openrouter/qwen/qwen-2.5-coder-32b-instruct',
    label: '💾➜ Qwen2.5 Coder 32B Instruct',
    description: 'Qwen2.5-Coder is the latest series of Code-Specific Qwen large language models (formerly CodeQwen). Features 33K context window.',
    contextWindow: 33000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-11',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.07, output: 0.16 },
  },

  {
    id: 'openpipe:openrouter/google/gemma-2.0-flash-exp:free',
    label: '💾➜ Google Gemma 2.0 Flash Exp',
    description: 'Advanced experimental model with multimodal understanding, coding capabilities, and complex instruction following.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/google/gemini-exp-1206:free',
    label: '💾➜ Google Gemini Exp 1206',
    description: 'Experimental version of the Gemini model series with enhanced text processing capabilities.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/google/gemini-exp-1121:free',
    label: '💾➜ Google Gemini Exp 1121',
    description: 'Early experimental version of the Gemini model with text generation and processing capabilities.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/google/learnlm-1.5-pro-experimental:free',
    label: '💾➜ Google LearnLM 1.5 Pro Exp',
    description: 'Experimental learning-focused model with advanced text processing capabilities.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  {
    id: 'openpipe:openrouter/infermatic/mn-inferor-12b',
    label: '💾➜ Infermatic MN Inferor 12B',
    description: '12.2B parameter model optimized for advanced text generation and conversational applications using Model Stock merge method.',
    contextWindow: 32768,
    maxCompletionTokens: 4096,
    trainingDataCutoff: '2024-01',
    interfaces: [LLM_IF_OAI_Chat],
    chatPrice: { input: 0.0, output: 0.0 },
  },

  // OpenAI models: these work
  {
    id: 'gpt-4o-mini-2024-07-18',
    label: '💾➜ GPT-4o Mini (2024-07-18)',
    description: 'Affordable model for fast, lightweight tasks. GPT-4o mini is cheaper and more capable than GPT-3.5 Turbo.',
    contextWindow: 128000,
    maxCompletionTokens: 16384,
    trainingDataCutoff: 'Oct 2023',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: _knownOpenAIChatModels.find(m => m.idPrefix === 'gpt-4o-mini-2024-07-18')?.chatPrice,
    benchmark: { cbaMmlu: 82.0 },
  },
  {
    id: 'gpt-4o-2024-05-13',
    label: '💾➜ GPT-4o (2024-05-13)',
    description: 'Advanced, multimodal flagship model that\'s cheaper and faster than GPT-4 Turbo.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    trainingDataCutoff: 'Oct 2023',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
    chatPrice: _knownOpenAIChatModels.find(m => m.idPrefix === 'gpt-4o-2024-05-13')?.chatPrice,
    benchmark: { cbaElo: 1287 },
  },
  {
    id: 'gpt-3.5-turbo-1106',
    label: '💾➜ GPT-3.5 Turbo (1106)',
    description: 'GPT-3.5 Turbo model from November 2023',
    contextWindow: 16385,
    maxCompletionTokens: 4096,
    trainingDataCutoff: 'Sep 2021',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: _knownOpenAIChatModels.find(m => m.idPrefix === 'gpt-3.5-turbo-1106')?.chatPrice,
    benchmark: { cbaElo: 1072 },
  },
  {
    id: 'gpt-3.5-turbo-0125',
    label: '💾➜ GPT-3.5 Turbo (0125)',
    description: 'The latest GPT-3.5 Turbo model with higher accuracy at responding in requested formats',
    contextWindow: 16385,
    maxCompletionTokens: 4096,
    trainingDataCutoff: 'Sep 2021',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    chatPrice: _knownOpenAIChatModels.find(m => m.idPrefix === 'gpt-3.5-turbo-0125')?.chatPrice,
    benchmark: { cbaElo: 1105 },
  },

  // Not supported yet "We don't support streaming responses for chat completions with Anthropic yet. Please email us at support@openpipe.ai if this is a feature you need!"
  // {
  //   id: 'claude-3-5-sonnet-20240620',
  //   label: '💾➜ Claude 3.5 Sonnet',
  //   description: 'The most intelligent Claude model',
  //   contextWindow: 200000, // Characters
  //   maxCompletionTokens: 8192,
  //   trainingDataCutoff: 'Apr 2024',
  //   interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision],
  //   pricing: { input: 3, output: 15 },
  // },

  // Default finetune, not available at the onset
  // {
  //   id: 'mistral-ft-optimized-1227',
  //   label: 'OpenPipe · Mistral FT Optimized',
  //   description: 'OpenPipe optimized Mistral fine-tuned model',
  //   contextWindow: 32768, // Assuming similar to Mixtral, as it's Mistral-based
  //   interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn], // Assuming similar to Mixtral
  // },

  // Finetune-able models, but not present
  // {
  //   id: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
  //   label: 'Meta-Llama 3.1 · 8B Instruct',
  //   description: 'Meta-Llama 3.1 8B Instruct model',
  //   contextWindow: 128000, // Inferred from Llama 3 models in the original code
  //   maxCompletionTokens: 4096, // Inferred from Llama 3 models in the original code
  //   interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json], // Inferred from Llama 3 models
  // },
  // {
  //   id: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
  //   label: 'Meta-Llama 3.1 · 70B Instruct',
  //   description: 'Meta-Llama 3.1 70B Instruct model',
  //   contextWindow: 128000, // Inferred from Llama 3 models in the original code
  //   maxCompletionTokens: 4096, // Inferred from Llama 3 models in the original code
  //   interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json], // Inferred from Llama 3 models
  // },
  // {
  //   id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  //   label: 'Mixtral · 8x7B Instruct v0.1',
  //   description: 'Mixtral 8x7B Instruct v0.1 model',
  //   contextWindow: 32768, // Inferred from Mixtral model in the original code
  //   interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn], // Inferred from Mixtral model
  // },

];

const openPipeModelFamilyOrder = [
  'gpt-4o', 'gpt-3.5-turbo', 'mistral-ft', 'meta-llama', 'mistralai', '',
];

export function openPipeModelDescriptions() {
  return _knownOpenPipeChatModels;
}

export function openPipeModelSort(a: ModelDescriptionSchema, b: ModelDescriptionSchema): number {
  const aPrefixIndex = openPipeModelFamilyOrder.findIndex(prefix => a.id.startsWith(prefix));
  const bPrefixIndex = openPipeModelFamilyOrder.findIndex(prefix => b.id.startsWith(prefix));
  // Sort by family
  if (aPrefixIndex !== bPrefixIndex)
    return aPrefixIndex - bPrefixIndex;
  // Then by reverse label (newer versions first)
  return b.label.localeCompare(a.label);
}

export function openPipeModelToModelDescriptions(wireModel: object): ModelDescriptionSchema {
  // parse the model
  const model = wireOpenPipeModelOutputSchema.parse(wireModel);

  // note: model.id is a UUID, but when making the requests, this is the id we use
  const namedId = `openpipe:${model.name}`;

  // parse the ISO strings
  let created: number | undefined;
  let updated: number | undefined;
  try {
    created = Date.parse(model.created) || undefined;
    updated = Date.parse(model.updated) || undefined;
  } catch (e) {
    // .. prevent issues
  }

  // patch label and description based on the `.openpipe` field
  let label = 'OpenPipe · ' + model.name;
  let description = model.description || 'Fine-tuned model.';
  switch (model.openpipe?.status) {
    case 'PENDING':
      label = `🟦 ${label} (PENDING)`;
      break;
    case 'TRAINING':
      label = `🟦 ${label} (TRAINING)`;
      break;
    case 'DEPLOYED':
      label = `🟩 ${label}`;
      break;
    case 'ERROR':
      label = `🟥 ${label} (ERROR)`;
      break;
    case 'DEPRECATED':
      label = `🟨 ${label} (DEPRECATED)`;
      break;
  }

  if (model.openpipe?.baseModel)
    description += `\n\nBased on: ${model.openpipe.baseModel}`;
  if (model.openpipe?.datasetId)
    description += `\nDataset Id: ${model.openpipe.datasetId}`;
  if (model.openpipe?.errorMessage)
    description += `\n\nError: ${model.openpipe.errorMessage}\n`;
  description += `\n\nUUID: ${model.id}`;


  const manualMapping: ManualMapping = {
    idPrefix: namedId,
    label,
    description,
    contextWindow: model.contextWindow,
    maxCompletionTokens: model.maxCompletionTokens,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json],
  };

  if (model.pricing) {
    manualMapping.chatPrice = {
      input: model.pricing.chatIn,
      output: model.pricing.chatOut,
    };
  }

  return fromManualMapping([], namedId, created, updated, manualMapping);
}


// [OpenRouter]

const orOldModelIDs = [
  // Older OpenAI models
  'openai/gpt-3.5-turbo-0301', 'openai/gpt-3.5-turbo-0613', 'openai/gpt-4-0314', 'openai/gpt-4-32k-0314',
  // Older Anthropic models
  'anthropic/claude-1', 'anthropic/claude-1.2', 'anthropic/claude-instant-1.0', 'anthropic/claude-instant-1.1',
  'anthropic/claude-2', 'anthropic/claude-2:beta', 'anthropic/claude-2.0', 'anthropic/claude-2.1', 'anthropic/claude-2.0:beta',
];

const orModelFamilyOrder = [
  // Leading models/organizations (based on capabilities and popularity)
  'anthropic/', 'openai/', 'google/', 'mistralai/', 'meta-llama/',
  // Other major providers
  'x-ai/', 'amazon/', 'cohere/', 'nvidia/', 'inflection/',
  // Specialized/AI companies
  'perplexity/', 'phind/', 'qwen/', 'deepseek/',
  // Research/open models
  'microsoft/', 'nousresearch/', 'openchat/', 'huggingfaceh4/',
  // Community/other providers
  // 'gryphe/', 'thedrummer/', 'undi95/', 'cognitivecomputations/', 'sao10k/',
];

export function openRouterModelFamilySortFn(a: { id: string }, b: { id: string }): number {
  const aPrefixIndex = orModelFamilyOrder.findIndex(prefix => a.id.startsWith(prefix));
  const bPrefixIndex = orModelFamilyOrder.findIndex(prefix => b.id.startsWith(prefix));

  // If both have a prefix, sort by prefix first, and then alphabetically
  if (aPrefixIndex !== -1 && bPrefixIndex !== -1)
    return aPrefixIndex !== bPrefixIndex ? aPrefixIndex - bPrefixIndex : b.id.localeCompare(a.id);

  // If one has a prefix and the other doesn't, prioritize the one with prefix
  return aPrefixIndex !== -1 ? -1 : 1;
}

export function openRouterModelToModelDescription(wireModel: object): ModelDescriptionSchema {

  // parse the model
  const model = wireOpenrouterModelsListOutputSchema.parse(wireModel);

  // parse pricing
  const inputPrice = parseFloat(model.pricing.prompt);
  const outputPrice = parseFloat(model.pricing.completion);
  const chatPrice: ModelDescriptionSchema['chatPrice'] = {
    input: inputPrice ? inputPrice * 1000 * 1000 : 'free',
    output: outputPrice ? outputPrice * 1000 * 1000 : 'free',
    // image...
    // request...
  };
  const seemsFree = chatPrice.input === 'free' && chatPrice.output === 'free';

  // openrouter provides the fields we need as part of the model object
  let label = model.name || model.id.replace('/', ' · ');
  if (seemsFree)
    label += ' · 🎁'; // Free? Discounted?
  // label = label.replace('(self-moderated)', '🔓');

  // hidden: hide by default older models or models not in known families
  const hidden = orOldModelIDs.includes(model.id) || !orModelFamilyOrder.some(prefix => model.id.startsWith(prefix));

  return fromManualMapping([], model.id, undefined, undefined, {
    idPrefix: model.id,
    // latest: ...
    label,
    // created: ...
    // updated: ...
    description: model.description,
    contextWindow: model.context_length || 4096,
    maxCompletionTokens: model.top_provider.max_completion_tokens || undefined,
    // trainingDataCutoff: ...
    interfaces: [LLM_IF_OAI_Chat],
    // benchmark: ...
    chatPrice,
    hidden,
  });
}


// Groq - https://console.groq.com/docs/models

const _knownGroqModels: ManualMappings = [
  {
    isLatest: true,
    idPrefix: 'llama-3.1-405b-reasoning',
    label: 'Llama 3.1 · 405B',
    description: 'LLaMA 3.1 405B developed by Meta with a context window of 131,072 tokens. Supports tool use.',
    contextWindow: 131072,
    maxCompletionTokens: 8000,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
  },
  {
    isLatest: true,
    idPrefix: 'llama-3.1-70b-versatile',
    label: 'Llama 3.1 · 70B',
    description: 'LLaMA 3.1 70B developed by Meta with a context window of 131,072 tokens. Supports tool use.',
    contextWindow: 131072,
    maxCompletionTokens: 8000,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
  },
  {
    isLatest: true,
    idPrefix: 'llama-3.1-8b-instant',
    label: 'Llama 3.1 · 8B',
    description: 'LLaMA 3.1 8B developed by Meta with a context window of 131,072 tokens. Supports tool use.',
    contextWindow: 131072,
    maxCompletionTokens: 8000,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
  },
  {
    idPrefix: 'llama3-groq-70b-8192-tool-use-preview',
    label: 'Llama 3 Groq · 70B Tool Use',
    description: 'LLaMA 3 70B Tool Use developed by Groq with a context window of 8,192 tokens. Optimized for tool use.',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
  },
  {
    idPrefix: 'llama3-groq-8b-8192-tool-use-preview',
    label: 'Llama 3 Groq · 8B Tool Use',
    description: 'LLaMA 3 8B Tool Use developed by Groq with a context window of 8,192 tokens. Optimized for tool use.',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
  },
  {
    idPrefix: 'llama3-70b-8192',
    label: 'Llama 3 · 70B',
    description: 'LLaMA3 70B developed by Meta with a context window of 8,192 tokens. Supports tool use.',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    // isLegacy: true,
    hidden: true,
  },
  {
    idPrefix: 'llama3-8b-8192',
    label: 'Llama 3 · 8B',
    description: 'LLaMA3 8B developed by Meta with a context window of 8,192 tokens. Supports tool use.',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    // isLegacy: true,
    hidden: true,
  },
  {
    idPrefix: 'mixtral-8x7b-32768',
    label: 'Mixtral 8x7B',
    description: 'Mixtral 8x7B developed by Mistral with a context window of 32,768 tokens. Supports tool use.',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
  },
  {
    idPrefix: 'gemma2-9b-it',
    label: 'Gemma 2 · 9B Instruct',
    description: 'Gemma 2 9B developed by Google with a context window of 8,192 tokens. Supports tool use.',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
  },
  {
    idPrefix: 'gemma-7b-it',
    label: 'Gemma 1.1 · 7B Instruct',
    description: 'Gemma 7B developed by Google with a context window of 8,192 tokens. Supports tool use.',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat],
    hidden: true,
  },
];

export function groqModelToModelDescription(_model: unknown): ModelDescriptionSchema {
  const model = wireGroqModelsListOutputSchema.parse(_model);
  return fromManualMapping(_knownGroqModels, model.id, model.created, undefined, {
    idPrefix: model.id,
    label: model.id.replaceAll(/[_-]/g, ' '),
    description: 'New Model',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat],
    hidden: true,
  });
}

export function groqModelSortFn(a: ModelDescriptionSchema, b: ModelDescriptionSchema): number {
  // sort hidden at the end
  if (a.hidden && !b.hidden)
    return 1;
  if (!a.hidden && b.hidden)
    return -1;
  // sort as per their order in the known models
  const aIndex = _knownGroqModels.findIndex(base => a.id.startsWith(base.idPrefix));
  const bIndex = _knownGroqModels.findIndex(base => b.id.startsWith(base.idPrefix));
  if (aIndex !== -1 && bIndex !== -1)
    return aIndex - bIndex;
  return a.id.localeCompare(b.id);
}


// Helpers

export type ManualMapping = ({
  idPrefix: string,
  isLatest?: boolean,
  isPreview?: boolean,
  isLegacy?: boolean,
  symLink?: string
} & Omit<ModelDescriptionSchema, 'id' | 'created' | 'updated'>);

export type ManualMappings = ManualMapping[];

export function fromManualMapping(mappings: ManualMappings, id: string, created?: number, updated?: number, fallback?: ManualMapping, disableSymLink?: boolean): ModelDescriptionSchema {

  // find the closest known model, or fall back, or take the last
  const known = mappings.find(base => id === base.idPrefix)
    || mappings.find(base => id.startsWith(base.idPrefix))
    || fallback
    || mappings[mappings.length - 1];

  // label for symlinks
  let label = known.label;
  if (!disableSymLink && known.symLink && id === known.idPrefix)
    label = `🔗 ${known.label} → ${known.symLink/*.replace(known.idPrefix, '')*/}`;

  // check whether this is a partial map, which indicates an unknown/new variant
  const suffix = id.slice(known.idPrefix.length).trim();

  // full label
  label = label
    + (suffix ? ` [${suffix.replaceAll('-', ' ').trim()}]` : '')
    + (known.isLatest ? ' 🌟' : '')
    + (known.isLegacy ? /*' 💩'*/ ' [legacy]' : '');

  // set the date in YYYY-MM-DD format if available and requested
  // if (label.indexOf('{{Created}}') !== -1) {
  //   const targetDate = updated || created;
  //   if (targetDate)
  //     label = label.replace('{{Created}}', `(${new Date(targetDate * 1000).toISOString().slice(0, 10)})`);
  //   else
  //     label = label.replace('{{Created}}', '');
  // }

  // create the model description
  const md: ModelDescriptionSchema = {
    id,
    label,
    created: created || 0,
    updated: updated || created || 0,
    description: known.description,
    contextWindow: known.contextWindow,
    interfaces: known.interfaces,
  };

  // apply optional fields
  if (known.maxCompletionTokens)
    md.maxCompletionTokens = known.maxCompletionTokens;
  if (known.trainingDataCutoff)
    md.trainingDataCutoff = known.trainingDataCutoff;
  if (known.parameterSpecs)
    md.parameterSpecs = known.parameterSpecs;
  if (known.benchmark)
    md.benchmark = known.benchmark;
  if (known.chatPrice)
    md.chatPrice = known.chatPrice;
  if (known.hidden)
    md.hidden = true;

  return md;
}