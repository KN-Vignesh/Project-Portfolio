import React from 'react';
import { Terminal, Cpu, Layers, Sparkles, Bot, Code, Cloud } from 'lucide-react';
import { STACK_CATEGORIES } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { NutshellText } from './Nutshell';

export const StackSection: React.FC = () => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return Terminal;
      case 'Cpu': return Cpu;
      case 'Layers': return Layers;
      case 'Sparkles': return Sparkles;
      case 'Bot': return Bot;
      case 'Code': return Code;
      case 'Cloud': return Cloud;
      default: return Terminal;
    }
  };

  return (
    <section id="stack" className="py-24 lg:py-28 border-t border-white/[0.08] bg-[#08090B] relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
              05 · Architectural Toolchain
            </div>
            <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
              Technical Capabilities &amp; Stack
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98]">
            7 Engineering Layers · Verified Production Competencies
          </div>
        </ScrollReveal>

        {/* Stack Layers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STACK_CATEGORIES.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.iconName);
            return (
              <ScrollReveal key={cat.title} delay={idx * 0.04}>
                <div className="editorial-card rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg border border-white/[0.08] bg-[#15181D] flex items-center justify-center text-[#7CFF6B] group-hover:bg-[#7CFF6B] group-hover:text-[#08090B] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-mono text-xs font-bold text-[#F2F2F2] tracking-wide uppercase">
                          {cat.title}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-[#8B8F98] tabular-nums">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="mb-6">
                      <NutshellText
                        blockId={`stack-summary-${idx}`}
                        as="p"
                        maxTriggers={2}
                        className="text-sm text-[#8B8F98] leading-relaxed"
                        text={cat.summary}
                      />
                    </div>

                    <div className="font-mono text-xs text-[#D1D5DB] flex flex-wrap items-center gap-x-2 gap-y-1.5 leading-relaxed">
                      {cat.skills.map((skill, sIdx) => (
                        <React.Fragment key={skill}>
                          <span className="text-[#F2F2F2]">{skill}</span>
                          {sIdx < cat.skills.length - 1 && (
                            <span aria-hidden="true" className="text-white/25">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/[0.08] font-mono text-[11px] text-[#8B8F98] flex items-center justify-between">
                    <span>Domain Layer 0{idx + 1}</span>
                    <span className="text-[#7CFF6B]">Production Verified</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
