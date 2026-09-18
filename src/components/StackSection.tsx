import React from 'react';
import { Terminal, Cpu, Layers, Sparkles, Bot, Code, Cloud } from 'lucide-react';
import { STACK_CATEGORIES } from '../data/portfolioData';

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
    <section id="stack" className="py-24 border-t border-[#24272D] bg-[#08090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [05] // ARCHITECTURAL TOOLCHAIN
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F2F2]">
              AI ENGINEERING STACK
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98] mt-2 sm:mt-0">
            7 ENGINEERING LAYERS // VERIFIED COMPETENCIES
          </div>
        </div>

        {/* Stack Layers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STACK_CATEGORIES.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.iconName);
            return (
              <div
                key={cat.title}
                className="rounded-xl border border-[#24272D] bg-[#101216] p-6 hover:border-[#7CFF6B]/50 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#24272D]">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded border border-[#24272D] bg-[#15181D] flex items-center justify-center text-[#7CFF6B] group-hover:bg-[#7CFF6B] group-hover:text-[#08090B] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#F2F2F2]">
                        {cat.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8B8F98]">0{idx + 1}</span>
                  </div>

                  <p className="text-xs text-[#8B8F98] leading-relaxed mb-5">
                    {cat.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded bg-[#08090B] border border-[#24272D] font-mono text-xs text-[#F2F2F2] hover:border-[#7CFF6B]/40 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#24272D] font-mono text-[10px] text-[#8B8F98] flex items-center justify-between">
                  <span>LAYER ACTIVE</span>
                  <span className="text-[#7CFF6B]">● PROVEN</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
