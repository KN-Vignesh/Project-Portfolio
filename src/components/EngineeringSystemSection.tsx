import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Cpu,
  Database,
  Server,
  GitBranch,
  RefreshCw,
} from 'lucide-react';
import { ENGINEERING_PIPELINE_STEPS } from '../data/portfolioData';
import { ScrollReveal, SwiftRollLabel } from './ScrollReveal';
import { NutshellText } from './Nutshell';

interface EngineeringSystemSectionProps {
  onSelectProject: (projectId: string) => void;
}

export const EngineeringSystemSection: React.FC<
  EngineeringSystemSectionProps
> = ({ onSelectProject }) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const pipelineStages = [
    { name: 'Problem', icon: GitBranch, projectHighlight: 'customer-churn' },
    { name: 'Data', icon: Database, projectHighlight: 'house-price' },
    { name: 'Model', icon: Cpu, projectHighlight: 'qwen-lora' },
    { name: 'Application', icon: Layers, projectHighlight: 'vero' },
    { name: 'Evaluation', icon: CheckCircle2, projectHighlight: 'evaluation' },
    { name: 'Deployment', icon: Server, projectHighlight: 'customer-churn' },
    { name: 'Iteration', icon: RefreshCw, projectHighlight: 'qlora' },
  ];

  const handleOpenStageProject = (projLabel: string) => {
    if (projLabel.includes('Churn')) onSelectProject('customer-churn');
    else if (projLabel.includes('LoRA') && !projLabel.includes('QLoRA'))
      onSelectProject('qwen-lora');
    else if (projLabel.includes('QLoRA')) onSelectProject('qlora');
    else if (projLabel.includes('VERO')) onSelectProject('vero');
    else onSelectProject('evaluation');
  };

  return (
    <section
      id="engineering-system"
      className="py-28 lg:py-32 border-t border-white/[0.08] bg-[#08090B] relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Sticky Left Column + Scrolling Right Column Layout (cosmos.studio .sticky-wr pattern) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Sticky Left Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <ScrollReveal className="space-y-4">
              <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
                03 · Reproducible Engineering Lifecycle
              </div>
              <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
                Systems Architecture &amp; Delivery Pipeline
              </h2>
              <NutshellText
                blockId="eng-system-intro"
                as="p"
                maxTriggers={2}
                className="text-base text-[#8B8F98] leading-relaxed"
                text="Every AI system follows a 5-stage engineering contract—from framing measurable business constraints and data validation to :peft[PEFT] fine-tuning, :jev-gate[deterministic gates], and holdout benchmarking."
              />
            </ScrollReveal>

            {/* Active Stage Inspector Card */}
            <div className="p-6 rounded-2xl bg-[#101216] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#7CFF6B] font-semibold">
                  Stage {ENGINEERING_PIPELINE_STEPS[activeStage].step} ·{' '}
                  {ENGINEERING_PIPELINE_STEPS[activeStage].phase}
                </span>
                <span className="text-[#8B8F98]">Active Focus</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#F2F2F2]">
                  {ENGINEERING_PIPELINE_STEPS[activeStage].name}
                </h3>
                <NutshellText
                  blockId={`eng-active-stage-${activeStage}`}
                  as="p"
                  maxTriggers={2}
                  className="text-sm text-[#D1D5DB] leading-relaxed"
                  text={ENGINEERING_PIPELINE_STEPS[activeStage].desc}
                />
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-mono text-[#8B8F98]">
                  Verified in:{' '}
                  <strong className="text-[#F2F2F2]">
                    {ENGINEERING_PIPELINE_STEPS[
                      activeStage
                    ].associatedProjects.join(' · ')}
                  </strong>
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleOpenStageProject(
                      ENGINEERING_PIPELINE_STEPS[activeStage]
                        .associatedProjects[0]
                    )
                  }
                  className="group swift-spring-btn px-3.5 py-2 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <SwiftRollLabel
                    label="Inspect System"
                    hoverLabel="Open Case Study"
                  />
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Stage Nodes */}
            <div className="flex flex-wrap gap-2 pt-1">
              {pipelineStages.map((stage) => {
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.name}
                    type="button"
                    onClick={() => onSelectProject(stage.projectHighlight)}
                    className="swift-spring-btn px-3 py-2 rounded-xl border border-white/[0.08] bg-[#101216] hover:border-[#7CFF6B]/50 text-xs text-[#D1D5DB] hover:text-[#7CFF6B] flex items-center gap-2 cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#7CFF6B]" />
                    <span>{stage.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrolling Right Column: 5 Stacked Methodology Cards */}
          <div className="lg:col-span-7 space-y-5">
            {ENGINEERING_PIPELINE_STEPS.map((step, idx) => {
              const isSelected = activeStage === idx;
              return (
                <ScrollReveal key={step.step} delay={idx * 0.05}>
                  <div
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setActiveStage(idx)}
                    onClick={() => {
                      setActiveStage(idx);
                      handleOpenStageProject(step.associatedProjects[0]);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveStage(idx);
                        handleOpenStageProject(step.associatedProjects[0]);
                      }
                    }}
                    className={`editorial-card rounded-2xl p-6 sm:p-8 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#7CFF6B]/50 bg-[#12151B]'
                        : 'bg-[#101216]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4 font-mono text-xs text-[#8B8F98]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#7CFF6B] font-bold">
                          {step.step}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase">{step.phase}</span>
                      </div>
                      <span className="text-[#D1D5DB]">
                        {step.associatedProjects.join(' · ')}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#F2F2F2] mb-2.5">
                      {step.name}
                    </h3>

                    <NutshellText
                      blockId={`eng-pipeline-step-${step.step}`}
                      as="p"
                      maxTriggers={2}
                      className="text-base text-[#8B8F98] leading-relaxed"
                      text={step.desc}
                    />
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
