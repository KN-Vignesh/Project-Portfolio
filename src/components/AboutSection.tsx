import React from 'react';
import { Code2, Database, Sparkles, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { NutshellText } from './Nutshell';

export const AboutSection: React.FC = () => {
  const careerSteps = [
    {
      title: 'Enterprise Systems',
      subtitle: '.NET Core 8 & Angular 18',
      desc: 'Architected scalable backend APIs, enterprise MySQL schemas, and high-security :pam-automation[BeyondTrust PAM deployments] across 6,000+ corporate accounts.',
      icon: Code2,
    },
    {
      title: 'Cloud Automation',
      subtitle: 'Azure Serverless & MLOps',
      desc: 'Serverless Azure Functions, :cosmos-vector[Cosmos DB vector search] collections, distributed Service Bus queues, and automated Jenkins CI/CD deployment gates.',
      icon: Database,
    },
    {
      title: 'PEFT & Fine-Tuning',
      subtitle: 'QLoRA 4-bit NF4 Quantization',
      desc: 'Adapted open-weight LLMs (Qwen 2.5) with :lora-rank[rank r=16 low-rank matrices] and :nf4[4-bit NF4], reducing VRAM footprint by 73% while retaining 99.4% full-precision reasoning.',
      icon: Sparkles,
    },
    {
      title: 'Deterministic AI Systems',
      subtitle: 'Vero AST Review Engine',
      desc: 'Synthesized :sonar-ast[SonarQube Clean Code static analysis] with :jev-gate[TypeSafe Jev] System 1 models for sub-35ms, zero-hallucination code review automation.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      id="about"
      className="py-24 lg:py-28 border-t border-white/[0.08] relative bg-[#08090B]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
              06 · Systems Engineering Philosophy
            </div>
            <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
              Bridging Enterprise Bedrock to Production AI
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98]">
            Deterministic Architecture · Measurable Latency
          </div>
        </ScrollReveal>

        {/* Narrative & High-Impact Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Editorial Text */}
          <ScrollReveal className="lg:col-span-6 space-y-5 text-[#8B8F98] text-base leading-relaxed">
            <NutshellText
              blockId="about-philosophy-1"
              as="p"
              maxTriggers={2}
              className="text-lg text-[#F2F2F2] font-medium leading-relaxed"
              text="AI engineering is not an isolated research sandbox—it is a discipline of rigorous software engineering: combining strict :pydantic-contracts[Pydantic API contracts], containerization, :jev-gate[deterministic gates], and automated evaluation."
            />

            <NutshellText
              blockId="about-philosophy-2"
              as="p"
              maxTriggers={3}
              className="text-base text-[#8B8F98] leading-relaxed"
              text="Whether fine-tuning open-weight foundation models via :qlora[QLoRA], architecting :cosmos-vector[Cosmos DB vector search] pipelines, or building zero-hallucination PR review engines, my focus is delivering measurable latency, verifiable quality gates, and production uptime."
            />

            {/* Core Architectural Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-5 rounded-2xl bg-[#101216] border border-white/[0.08]">
                <div className="font-mono text-[#7CFF6B] font-semibold text-xs uppercase tracking-wider mb-1.5">
                  Zero-Hallucination Gates
                </div>
                <NutshellText
                  blockId="about-guarantee-ast"
                  as="p"
                  maxTriggers={1}
                  className="text-[#8B8F98] text-xs leading-relaxed"
                  text="Static analysis :sonar-ast[AST policies] enforce hard invariants before probabilistic model decisions."
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#101216] border border-white/[0.08]">
                <div className="font-mono text-[#6EA8FE] font-semibold text-xs uppercase tracking-wider mb-1.5">
                  Reproducible ML &amp; PEFT
                </div>
                <NutshellText
                  blockId="about-guarantee-peft"
                  as="p"
                  maxTriggers={1}
                  className="text-[#8B8F98] text-xs leading-relaxed"
                  text="Quantized 4-bit adapters trained with deterministic seeds, :roc-auc[ROC-AUC scorecards], and strict VRAM budgets."
                />
              </div>
            </div>
          </ScrollReveal>

          {/* 4 Career Milestone Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {careerSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={step.title} delay={idx * 0.05}>
                  <div className="editorial-card p-6 rounded-2xl h-full flex flex-col justify-between group">
                    <div>
                      <div className="h-9 w-9 rounded-xl bg-[#08090B] border border-white/[0.08] group-hover:border-[#7CFF6B]/50 flex items-center justify-center text-[#7CFF6B] mb-4 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
                        {step.title}
                      </h3>
                      <div className="text-xs font-mono text-[#6EA8FE] mt-1">
                        {step.subtitle}
                      </div>
                      <div className="mt-3">
                        <NutshellText
                          blockId={`about-step-${idx}`}
                          as="p"
                          maxTriggers={2}
                          className="text-xs text-[#8B8F98] leading-relaxed"
                          text={step.desc}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
