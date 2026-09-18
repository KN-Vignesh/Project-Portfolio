import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Layers, Cpu, Database, Server, GitBranch, RefreshCw } from 'lucide-react';
import { ENGINEERING_PIPELINE_STEPS } from '../data/portfolioData';

interface EngineeringSystemSectionProps {
  onSelectProject: (projectId: string) => void;
}

export const EngineeringSystemSection: React.FC<EngineeringSystemSectionProps> = ({ onSelectProject }) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const pipelineStages = [
    { name: "PROBLEM", icon: GitBranch, projectHighlight: "customer-churn" },
    { name: "DATA", icon: Database, projectHighlight: "house-price" },
    { name: "MODEL", icon: Cpu, projectHighlight: "qwen-lora" },
    { name: "APPLICATION", icon: Layers, projectHighlight: "vero" },
    { name: "EVALUATION", icon: CheckCircle2, projectHighlight: "evaluation" },
    { name: "DEPLOYMENT", icon: Server, projectHighlight: "customer-churn" },
    { name: "ITERATION", icon: RefreshCw, projectHighlight: "qlora" },
  ];

  return (
    <section id="engineering-system" className="py-24 border-t border-[#24272D] bg-[#101216]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [02] // ENGINEERING SYSTEM & LIFECYCLE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F2F2]">
              HOW I ENGINEER INTELLIGENT SYSTEMS
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98] mt-2 sm:mt-0">
            DETERMINISTIC PIPELINE // 5 STAGES
          </div>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="mb-14 overflow-x-auto pb-4">
          <div className="flex items-center min-w-[700px] justify-between p-3 rounded-xl border border-[#24272D] bg-[#08090B]">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isLast = idx === pipelineStages.length - 1;
              return (
                <React.Fragment key={stage.name}>
                  <button
                    onClick={() => onSelectProject(stage.projectHighlight)}
                    className="flex flex-col items-center space-y-1.5 px-3 py-2 rounded group hover:bg-[#15181D] transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded border border-[#24272D] group-hover:border-[#7CFF6B] bg-[#101216] flex items-center justify-center text-[#8B8F98] group-hover:text-[#7CFF6B] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-[#F2F2F2] group-hover:text-[#7CFF6B] tracking-wider">
                      {stage.name}
                    </span>
                  </button>
                  {!isLast && (
                    <div className="text-[#24272D] flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-[#8B8F98]/50" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 5 Engineering Methodology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {ENGINEERING_PIPELINE_STEPS.map((step, idx) => {
            const isSelected = activeStage === idx;
            return (
              <div
                key={step.step}
                onMouseEnter={() => setActiveStage(idx)}
                className={`p-5 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#7CFF6B] bg-[#15181D] shadow-lg shadow-[#7CFF6B]/5'
                    : 'border-[#24272D] bg-[#101216] hover:border-[#8B8F98]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 font-mono text-xs">
                    <span className="text-[#7CFF6B] font-bold">{step.step}</span>
                    <span className="px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#8B8F98] text-[10px]">
                      {step.phase}
                    </span>
                  </div>

                  <h3 className="font-mono font-bold text-sm text-[#F2F2F2] mb-2 leading-snug">
                    {step.name}
                  </h3>

                  <p className="text-xs text-[#8B8F98] leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#24272D] font-mono text-[11px] text-[#7CFF6B] flex items-center justify-between">
                  <span>{step.associatedProjects[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Active Stage Insight Box */}
        <div className="p-6 rounded-xl border border-[#24272D] bg-[#101216] font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-[#7CFF6B]">
              PHASE {ENGINEERING_PIPELINE_STEPS[activeStage].step}: {ENGINEERING_PIPELINE_STEPS[activeStage].phase} IN ACTION
            </div>
            <div className="text-sm text-[#F2F2F2]">
              Demonstrated in: <span className="text-[#6EA8FE]">{ENGINEERING_PIPELINE_STEPS[activeStage].associatedProjects.join(' & ')}</span>
            </div>
          </div>

          <button
            onClick={() => {
              const proj = ENGINEERING_PIPELINE_STEPS[activeStage].associatedProjects[0];
              if (proj.includes('Churn')) onSelectProject('customer-churn');
              else if (proj.includes('LoRA') && !proj.includes('QLoRA')) onSelectProject('qwen-lora');
              else if (proj.includes('QLoRA')) onSelectProject('qlora');
              else if (proj.includes('VERO')) onSelectProject('vero');
              else onSelectProject('evaluation');
            }}
            className="px-4 py-2 rounded border border-[#7CFF6B]/50 bg-[#7CFF6B]/10 hover:bg-[#7CFF6B] text-[#7CFF6B] hover:text-[#08090B] font-bold text-xs transition-colors flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>INSPECT ASSOCIATED PROJECT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
