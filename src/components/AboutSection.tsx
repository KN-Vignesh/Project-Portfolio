import React from 'react';
import { ArrowRight, Code2, Database, Network, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const careerSteps = [
    {
      title: "ENTERPRISE SYSTEMS",
      subtitle: ".NET Core 8 & Angular 18",
      desc: "Architected scalable backend APIs, enterprise MySQL schemas, and high-security BeyondTrust PAM deployments across 6,000+ corporate accounts.",
      icon: Code2
    },
    {
      title: "CLOUD AUTOMATION",
      subtitle: "Azure Serverless & MLOps",
      desc: "Serverless Azure Functions, Cosmos DB vector collections, distributed Service Bus queues, and automated Jenkins CI/CD deployment gates.",
      icon: Database
    },
    {
      title: "PEFT & FINE-TUNING",
      subtitle: "QLoRA 4-bit NF4 Quantization",
      desc: "Adapted open-weight LLMs (Qwen 2.5) with rank r=16 low-rank matrices, reducing VRAM footprint by 73% while retaining 99.4% full-precision reasoning.",
      icon: Sparkles
    },
    {
      title: "DETERMINISTIC AI SYSTEMS",
      subtitle: "Vero AST Review Engine",
      desc: "Synthesized SonarQube Clean Code static analysis with TypeSafe Jev System 1 models for sub-35ms, zero-hallucination code review automation.",
      icon: CheckCircle2
    }
  ];

  return (
    <section id="about" className="py-20 border-t border-[#24272D] relative bg-[#08090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase mb-1">
              SYSTEMS ENGINEERING TRAJECTORY
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2F2F2]">
              BRIDGING ENTERPRISE BEDROCK TO MODERN AI
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98] mt-2 sm:mt-0">
            PROVEN ENGINEERING PRINCIPLES
          </div>
        </div>

        {/* Narrative & High-Impact Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Main Editorial Text */}
          <div className="lg:col-span-6 space-y-4 text-[#8B8F98] text-sm leading-relaxed">
            <p className="text-base text-[#F2F2F2] font-medium leading-relaxed">
              AI engineering is not an isolated research sandbox—it is a discipline of rigorous software engineering: combining strict API contracts, containerization, deterministic gates, and automated evaluation.
            </p>

            <p>
              Whether fine-tuning open-weight foundation models via QLoRA, architecting Cosmos DB vector search pipelines, or building zero-hallucination PR review engines, my focus is delivering <span className="text-[#F2F2F2] font-medium">measurable latency, verifiable quality gates, and production uptime</span>.
            </p>

            {/* Core Architectural Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#101216] border border-[#24272D]">
                <div className="text-[#7CFF6B] font-semibold text-xs mb-1">ZERO-HALLUCINATION GATES</div>
                <p className="text-[#8B8F98] text-[11px] leading-normal">
                  Static analysis AST policies enforce hard invariants before probabilistic model decisions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#101216] border border-[#24272D]">
                <div className="text-[#6EA8FE] font-semibold text-xs mb-1">REPRODUCIBLE ML & PEFT</div>
                <p className="text-[#8B8F98] text-[11px] leading-normal">
                  Quantized 4-bit adapters trained with deterministic seeds, ROC-AUC scorecards, and VRAM budgets.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Career Milestone Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {careerSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="p-4 rounded-xl border border-[#24272D] bg-[#101216] flex flex-col justify-between hover:border-[#7CFF6B]/40 transition-colors group"
                >
                  <div>
                    <div className="h-8 w-8 rounded-lg bg-[#08090B] border border-[#24272D] group-hover:border-[#7CFF6B]/50 flex items-center justify-center text-[#7CFF6B] mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-mono font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
                      {step.title}
                    </div>
                    <div className="text-[11px] font-mono text-[#6EA8FE] mt-0.5">
                      {step.subtitle}
                    </div>
                    <p className="text-xs text-[#8B8F98] mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
