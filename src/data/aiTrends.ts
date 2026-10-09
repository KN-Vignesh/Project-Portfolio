export interface AITrendItem {
  id: string;
  name: string;
  category: 'FOUNDATIONAL_LLM' | 'PEFT_QUANTIZATION' | 'AGENTIC_REASONING' | 'RESEARCH_PAPER';
  headline: string;
  source: string;
  metric: string;
  metricLabel: string;
  date: string;
  url: string;
  architectureNotes: string;
}

export interface GitHubActivityItem {
  id: string;
  type: string;
  repo: string;
  message: string;
  date: string;
}

export const CURATED_AI_TRENDS: AITrendItem[] = [
  {
    id: 'qwen-2.5-coder',
    name: 'Qwen 2.5 Coder 32B',
    category: 'FOUNDATIONAL_LLM',
    headline: 'State-of-the-art open weights coding foundation matching GPT-4o on HumanEval.',
    source: 'Hugging Face / Alibaba Cloud',
    metric: '92.7%',
    metricLabel: 'HumanEval Pass@1',
    date: 'Updated Daily',
    url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct',
    architectureNotes: 'Native 128k context window, RoPE positional embedding, dense multi-head attention optimized for code generation and refactoring pipelines.'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3 MoE Architecture',
    category: 'AGENTIC_REASONING',
    headline: 'Multi-head Latent Attention (MLA) and DeepSeekMoE with 256 routed experts.',
    source: 'ArXiv cs.CL / DeepSeek AI',
    metric: '671B / 37B',
    metricLabel: 'Total / Active Params',
    date: 'Updated Weekly',
    url: 'https://arxiv.org/abs/2412.19437',
    architectureNotes: 'Drastic KV-cache compression through low-rank key-value joint compression, enabling high-throughput inference at 1/5th traditional compute cost.'
  },
  {
    id: 'qlora-nf4-v2',
    name: 'QLoRA NormalFloat4 Quantization',
    category: 'PEFT_QUANTIZATION',
    headline: 'Information-theoretically optimal quantile quantization for normal distributions.',
    source: 'NeurIPS / Dettmers et al.',
    metric: '75%',
    metricLabel: 'VRAM Footprint Reduction',
    date: 'Reference Standard',
    url: 'https://arxiv.org/abs/2305.14314',
    architectureNotes: 'Double quantization with page-aware gradient optimizers. Retains 99.4% full FP16 performance on 4-bit weights with rank r=16 low-rank adapter matrices.'
  },
  {
    id: 'agentic-verifiable-eval',
    name: 'Deterministic Quality Gates for Agentic Code Review',
    category: 'RESEARCH_PAPER',
    headline: 'Combining static analysis AST rules (SonarQube) with typed probabilistic classification.',
    source: 'Vero System 1 Architecture',
    metric: '<35ms',
    metricLabel: 'Decision Latency',
    date: 'Vero Core',
    url: 'https://github.com/KN-Vignesh/Project-Portfolio',
    architectureNotes: 'Code computes, static analysis detects, Jev judges, deterministic code enforces. Zero conversational LLM chat latency or hallucination.'
  }
];
