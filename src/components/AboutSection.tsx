import React from 'react';
import { ArrowRight, Code2, Database, Network, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const careerSteps = [
    {
      title: "SOFTWARE ENGINEERING",
      subtitle: "Enterprise Foundations",
      desc: ".NET Core 8, Angular 18, MySQL, clean architecture, enterprise IAM/PAM, and production system reliability.",
      icon: Code2,
      active: true,
    },
    {
      title: "SYSTEM DESIGN & CLOUD",
      subtitle: "Scalable Infrastructure",
      desc: "Serverless Azure Functions, Cosmos DB, asynchronous Service Bus messaging, and CI/CD automation pipelines.",
      icon: Database,
      active: true,
    },
    {
      title: "MACHINE LEARNING",
      subtitle: "Statistical Modeling",
      desc: "Tabular pipelines, feature engineering, classification baselines, Scikit-learn, cross-validation, and metrics.",
      icon: Terminal,
      active: true,
    },
    {
      title: "NLP & DEEP LEARNING",
      subtitle: "Representation Learning",
      desc: "Bidirectional BERT encoders, sequence classification, token embeddings, and CNN spatial convolutions in PyTorch.",
      icon: Network,
      active: true,
    },
    {
      title: "GENERATIVE AI & PEFT",
      subtitle: "Targeted Adaptation",
      desc: "LoRA parameter-efficient adaptation, QLoRA 4-bit NF4 quantization, prompt engineering, and RAG architectures.",
      icon: Sparkles,
      active: true,
    },
    {
      title: "PRODUCTION AI SYSTEMS",
      subtitle: "End-to-End Delivery",
      desc: "Dockerized inference APIs, Agentic tool orchestration, grounded decision engines, and RLHF evaluation.",
      icon: CheckCircle2,
      active: true,
    }
  ];

  return (
    <section id="about" className="py-24 border-t border-[#24272D] relative bg-[#08090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [01] // CAREER PROGRESSION
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F2F2]">
              I BUILD INTELLIGENT SYSTEMS.
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98] mt-2 sm:mt-0">
            ENGINEERING PROFILE // ACCREDITED
          </div>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Main Editorial Text */}
          <div className="lg:col-span-7 space-y-6 text-[#8B8F98] text-base leading-relaxed">
            <p className="text-lg text-[#F2F2F2] font-medium leading-relaxed">
              Results-driven AI Software Engineer with <span className="text-[#7CFF6B]">4+ years of experience</span> in full-stack engineering, cloud automation, and API integration. Now applying this strong systems bedrock to production-oriented AI, Generative AI, LLM orchestration, RAG, and model engineering.
            </p>

            <p>
              Many developer journeys treat machine learning as an isolated research sandbox. My approach treats <span className="text-[#F2F2F2] font-medium">AI engineering as a natural extension of software engineering</span>: bridging raw model weights with strict API schemas, containerization, deterministic guardrails, and automated evaluation.
            </p>

            <p>
              Whether adapting open-weight LLMs via parameter-efficient LoRA / QLoRA fine-tuning, training tabular churn prediction models with FastAPI deployment, or synthesizing static code analysis with structured LLM review signals in VERO, the standard remains identical: <span className="text-[#F2F2F2]">verifiable metrics, reproducible pipelines, and production reliability</span>.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-[#101216] border border-[#24272D]">
                <div className="text-[#7CFF6B] font-semibold mb-1">NO "BLACK BOX" HYPE</div>
                <p className="text-[#8B8F98] text-[11px] leading-normal">
                  All models are measured with explicit scorecards (Accuracy, Precision, Recall, F1, ROC-AUC) to avoid cosmetic metrics.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#101216] border border-[#24272D]">
                <div className="text-[#6EA8FE] font-semibold mb-1">API-FIRST ARCHITECTURE</div>
                <p className="text-[#8B8F98] text-[11px] leading-normal">
                  Every pipeline terminates in callable, type-safe endpoints with Pydantic validation, ready for Docker deployment.
                </p>
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5 bg-[#101216] border border-[#24272D] rounded-xl p-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#24272D]">
              <span className="text-[#7CFF6B] font-semibold">CORE SPECIALIZATIONS</span>
              <span className="text-[10px] text-[#8B8F98]">AREAS OF IMPACT</span>
            </div>

            <ul className="space-y-2.5 text-[#8B8F98]">
              <li className="flex items-start gap-2">
                <span className="text-[#7CFF6B]">▸</span>
                <span><strong className="text-[#F2F2F2]">Generative AI & LLMs:</strong> Qwen, PEFT, LoRA, QLoRA 4-bit Quantization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7CFF6B]">▸</span>
                <span><strong className="text-[#F2F2F2]">RAG & Vector Retrieval:</strong> Dense embeddings, Cosmos DB, FAISS indexing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7CFF6B]">▸</span>
                <span><strong className="text-[#F2F2F2]">Agentic AI Workflows:</strong> Multi-turn tool execution, deterministic gate rules</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7CFF6B]">▸</span>
                <span><strong className="text-[#F2F2F2]">Model Engineering:</strong> BERT bidirectional representations, PyTorch CNNs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7CFF6B]">▸</span>
                <span><strong className="text-[#F2F2F2]">Production Backend:</strong> FastAPI, .NET Core 8, Angular 18, Docker</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7CFF6B]">▸</span>
                <span><strong className="text-[#F2F2F2]">Cloud Automation:</strong> Azure Functions, Service Bus, Cosmos DB, CI/CD</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-[#24272D] flex items-center justify-between text-[11px] text-[#8B8F98]">
              <span>LOCATION: BENGALURU, INDIA</span>
              <span className="text-[#7CFF6B]">READY TO SHIP</span>
            </div>
          </div>

        </div>

        {/* The Progression Pipeline Flow */}
        <div className="space-y-4">
          <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase">
            EVOLUTIONARY PATHWAY // SOFTWARE TO AI SYSTEMS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-lg border border-[#24272D] bg-[#101216]/70 hover:border-[#7CFF6B]/50 transition-all duration-200 group relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded border border-[#24272D] bg-[#15181D] flex items-center justify-center text-[#7CFF6B] group-hover:bg-[#7CFF6B] group-hover:text-[#08090B] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs text-[#8B8F98]">0{idx + 1}</span>
                  </div>

                  <h3 className="font-mono font-bold text-sm text-[#F2F2F2] mb-0.5">
                    {step.title}
                  </h3>
                  <div className="font-mono text-[11px] text-[#7CFF6B] mb-2">
                    {step.subtitle}
                  </div>
                  <p className="text-xs text-[#8B8F98] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
