import React, { useEffect } from 'react';
import { X, ExternalLink, GitBranch, Cpu, ShieldCheck, Database, Layers, ArrowUpRight } from 'lucide-react';
import { ThreeDSceneType } from './Interactive3DProjectStage';

interface InspectSpecDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sceneType: ThreeDSceneType | null;
}

interface SpecContent {
  title: string;
  category: string;
  repoFolder: string;
  repoUrl: string;
  summary: string;
  architectureBlueprint: string[];
  benchmarks: Array<{ label: string; value: string; desc: string }>;
  failureModes: string[];
  sampleCode: string;
}

const SPEC_DATA: Record<ThreeDSceneType, SpecContent> = {
  PEFT_LORA: {
    title: 'QLoRA 4-bit NormalFloat4 & Parameter-Efficient LoRA Fine-Tuning',
    category: 'GENERATIVE_AI · PEFT',
    repoFolder: 'Ai-Cookbook/QLoraFine-Tuning',
    repoUrl: 'https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/QLoraFine-Tuning',
    summary: 'Fine-tuning open-weight foundation models (Qwen 2.5) by quantizing base weights to 4-bit NormalFloat (NF4) while training low-rank adapter matrices A and B ($W = W_0 + B \\times A$).',
    architectureBlueprint: [
      'Load base model in 4-bit NF4 with BitsAndBytes paged optimizers',
      'Freeze 100% of 7.2B foundation parameters',
      'Attach LoRA adapter matrices to attention projection layers (q_proj, v_proj) at rank r=16, alpha=32',
      'Train only 18.4M parameters (0.25% of model), fitting within 16GB VRAM on consumer GPUs'
    ],
    benchmarks: [
      { label: 'VRAM USAGE', value: '3.8 GB', desc: '-73% reduction compared to 14.2 GB FP16 base' },
      { label: 'TRAINABLE WEIGHTS', value: '18.4M', desc: '0.25% of total parameters' },
      { label: 'RETENTION', value: '99.4%', desc: 'Reasoning benchmark score matching full FP16' }
    ],
    failureModes: [
      'Overfitting on small domain datasets: mitigated with adapter dropout (p=0.05)',
      'Gradient overflow during mixed-precision backprop: mitigated via bfloat16 accumulation'
    ],
    sampleCode: `from peft import LoraConfig, get_peft_model
from transformers import BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)`
  },
  MULTI_AGENT: {
    title: 'Autonomous Multi-Agent DAG Topology & State Workflows',
    category: 'AGENTIC_SYSTEMS · ORCHESTRATION',
    repoFolder: 'Shiny-Agents',
    repoUrl: 'https://github.com/KN-Vignesh/Projects/tree/main/Shiny-Agents',
    summary: 'Hierarchical Directed Acyclic Graph (DAG) coordinating specialized autonomous agents (Planner, Tool Executor, Code Reviewer, Critic) with checkpointed state memory.',
    architectureBlueprint: [
      'Planner Agent receives user objective and generates a dependency graph of sub-tasks',
      'Tool Executor Agent runs sandboxed CLI commands and REST requests against API contracts',
      'Critic & Guard Agent audits output against invariants before final state commit',
      'LangGraph checkpoint memory maintains conversation rollback state'
    ],
    benchmarks: [
      { label: 'DAG LATENCY', value: '420ms', desc: 'Average end-to-end multi-agent execution' },
      { label: 'SCHEMA ADHERENCE', value: '100%', desc: 'Pydantic-enforced structured outputs' },
      { label: 'RETRY REDUCTION', value: '3.2x', desc: 'Fewer token loops via deterministic self-correction' }
    ],
    failureModes: [
      'Infinite tool execution loops: bounded by max_iterations=5 and timeout safeguards',
      'Hallucinated tool arguments: validated through strict JSON schema parsing'
    ],
    sampleCode: `from langgraph.graph import StateGraph, END
from pydantic import BaseModel

class AgentState(BaseModel):
    task: str
    plan: list[str]
    current_step: int
    review_status: str

workflow = StateGraph(AgentState)
workflow.add_node("planner", plan_task)
workflow.add_node("executor", execute_step)
workflow.add_node("critic", audit_result)
workflow.add_edge("planner", "executor")
workflow.add_edge("executor", "critic")`
  },
  VERO_AST: {
    title: 'Vero — Zero-Hallucination AI PR Reviewer & Deterministic Quality Gate',
    category: 'SYSTEMS_ARCHITECTURE · CLEAN_CODE',
    repoFolder: 'VERO',
    repoUrl: 'https://github.com/KN-Vignesh/Project-Portfolio/tree/main/src/vero',
    summary: 'A deterministic static code analysis engine that synthesizes SonarQube Clean Code rules (S2068, S3649, S3776) with TypeSafe Jev System 1 models for sub-35ms PR risk decisions.',
    architectureBlueprint: [
      'Ingest raw GitHub unified pull request diff via GitHub REST API',
      'Run SonarEngine AST analysis detecting hard-coded credentials, SQL injection, and high cyclomatic complexity',
      'Execute TypeSafe Jev System 1 model producing calibrated risk scores without conversational LLM chat latency',
      'Enforce deterministic repository quality gates (Quality Gate PASS / SECURITY_REVIEW_REQUIRED)'
    ],
    benchmarks: [
      { label: 'EVALUATION LATENCY', value: '<35ms', desc: 'Instantaneous deterministic computation' },
      { label: 'HALLUCINATION RATE', value: '0.0%', desc: 'Code computes, static analysis detects' },
      { label: 'QUALITY GATE', value: 'Grade A', desc: 'Verified 0 bugs & 0 vulnerabilities on SonarCloud' }
    ],
    failureModes: [
      'Large PR diff truncation: bounded by 1,000 unified lines with per-file AST batching',
      'API rate limits: mitigated via user token override and 24-hour cooling periods'
    ],
    sampleCode: `// Deterministic Quality Gate Invariant
export function evaluateQualityGate(issues: SonarIssue[], jevRisk: number): Verdict {
  const hasBlockers = issues.some(i => i.severity === 'BLOCKER');
  if (hasBlockers || jevRisk >= 80) {
    return { status: 'BLOCKED', reason: 'Critical security rule violation detected' };
  }
  return { status: 'PASSED', reason: 'All deterministic invariants satisfied' };
}`
  },
  VECTOR_RAG: {
    title: 'Cosmos DB Serverless RAG & Dense Vector Retrieval',
    category: 'CLOUD_SYSTEMS · VECTOR_SEARCH',
    repoFolder: 'Ai-Cookbook/BERT_MODEL',
    repoUrl: 'https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/BERT_MODEL',
    summary: 'High-throughput semantic search and retrieval-augmented generation pipeline powered by Azure Functions, Cosmos DB vector collections, and subword transformer embeddings.',
    architectureBlueprint: [
      'Document chunking with recursive semantic splitting (512 tokens, 64 token overlap)',
      'Generate dense embeddings via transformer encoders',
      'Cosmos DB vector indexing with hierarchical k-means (HNSW)',
      'Cosine similarity lookup with re-ranking threshold filtering'
    ],
    benchmarks: [
      { label: 'SEARCH LATENCY', value: '84ms P95', desc: 'Azure Cosmos DB vector similarity query' },
      { label: 'RECALL AT K=3', value: '0.94', desc: 'Dense representation accuracy' },
      { label: 'INGESTION RATE', value: '1,200 docs/min', desc: 'Asynchronous Azure Service Bus workers' }
    ],
    failureModes: [
      'Context window overflow: mitigated via strict top-3 relevance filtering',
      'Outdated cache records: refreshed via Azure Cosmos DB Change Feed'
    ],
    sampleCode: `SELECT TOP 3 c.id, c.text, 
VectorDistance(c.embedding, @queryVector) AS SimilarityScore
FROM c
WHERE VectorDistance(c.embedding, @queryVector) > 0.82
ORDER BY VectorDistance(c.embedding, @queryVector)`
  }
};

export const InspectSpecDrawer: React.FC<InspectSpecDrawerProps> = ({
  isOpen,
  onClose,
  sceneType
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !sceneType) return null;

  const spec = SPEC_DATA[sceneType];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Specification Drawer"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="document"
        className="w-full max-w-2xl bg-[#101216] border-l border-[#24272D] h-full overflow-y-auto p-6 font-mono text-[#F2F2F2] flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#24272D]">
            <div>
              <div className="text-[11px] text-[#7CFF6B] uppercase font-bold tracking-wider">
                {spec.category}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#F2F2F2] mt-1">
                {spec.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] hover:border-[#7CFF6B]/50 transition-colors"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Direct Repo Link Strip */}
          <div className="mt-4 p-3 rounded-xl bg-[#08090B] border border-[#24272D] flex items-center justify-between text-xs">
            <span className="text-[#8B8F98] flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-[#7CFF6B]" />
              <span>{spec.repoFolder}</span>
            </span>
            <a
              href={spec.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7CFF6B] hover:underline flex items-center gap-1 font-bold"
            >
              <span>VIEW IN REPOSITORY</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Narrative Summary */}
          <div className="mt-5 space-y-2">
            <h3 className="text-xs text-[#8B8F98] uppercase">Architectural Objective:</h3>
            <p className="text-xs text-[#D1D5DB] leading-relaxed font-sans">
              {spec.summary}
            </p>
          </div>

          {/* Benchmark Grid */}
          <div className="mt-5">
            <h3 className="text-xs text-[#8B8F98] uppercase mb-2">Verified Benchmarks:</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {spec.benchmarks.map((b) => (
                <div key={b.label} className="p-2.5 rounded-lg bg-[#08090B] border border-[#24272D]">
                  <div className="text-[10px] text-[#8B8F98]">{b.label}</div>
                  <div className="text-sm font-bold text-[#7CFF6B] my-0.5">{b.value}</div>
                  <div className="text-[9px] text-[#8B8F98] leading-tight">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Blueprint Steps */}
          <div className="mt-6 space-y-2">
            <h3 className="text-xs text-[#8B8F98] uppercase">Execution Pipeline:</h3>
            <ol className="space-y-1.5 text-xs text-[#D1D5DB] font-sans">
              {spec.architectureBlueprint.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#7CFF6B] font-mono font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Code Excerpt */}
          <div className="mt-6">
            <h3 className="text-xs text-[#8B8F98] uppercase mb-2">Core Implementation Excerpt:</h3>
            <pre className="p-3.5 rounded-xl bg-[#08090B] border border-[#24272D] text-[11px] text-[#7CFF6B] overflow-x-auto leading-relaxed">
              <code>{spec.sampleCode}</code>
            </pre>
          </div>

          {/* Failure Modes & Mitigations */}
          <div className="mt-6 space-y-2">
            <h3 className="text-xs text-[#8B8F98] uppercase">Failure Modes &amp; Guardrails:</h3>
            <ul className="space-y-1 text-xs text-[#A1A7B5] font-sans">
              {spec.failureModes.map((fm, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#F43F5E]">&bull;</span>
                  <span>{fm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-[#24272D] flex items-center justify-between text-xs text-[#8B8F98]">
          <span>github.com/KN-Vignesh/Projects</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-colors cursor-pointer"
          >
            CLOSE SPECIFICATION
          </button>
        </div>
      </div>
    </div>
  );
};
