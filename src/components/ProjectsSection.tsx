import React, { useState } from 'react';
import { Play, ExternalLink, ShieldCheck, Sparkles, GitPullRequest, ArrowRight, Cpu, Database, CheckCircle2 } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  loading: boolean;
  error: Error | null;
  onSelectProject: (projectId: string) => void;
  onOpenVero?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  loading,
  error,
  onSelectProject,
  onOpenVero
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: `All Systems (${projects.length})` },
    { id: 'GENAI', label: 'Generative AI & LLMs' },
    { id: 'MODEL', label: 'Model Engineering & PEFT' },
    { id: 'SYSTEMS', label: 'Enterprise .NET & Cloud' }
  ];

  const filteredProjects = projects.filter((p) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'GENAI') {
      return p.id === 'vero' || p.id === 'qwen-lora' || p.id === 'qlora';
    }
    if (filterCategory === 'MODEL') {
      return p.id === 'bert' || p.id === 'cnn' || p.id === 'evaluation';
    }
    if (filterCategory === 'SYSTEMS') {
      return p.id === 'customer-churn' || p.id === 'house-price' || p.id === 'titanic';
    }
    return true;
  });

  return (
    <section id="projects" className="py-20 border-t border-[#24272D] bg-[#08090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase mb-1">
              ENGINEERING ARTIFACTS & PRODUCTION SYSTEMS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2F2F2]">
              SELECTED WORKS & BENCHMARKS
            </h2>
            <p className="font-mono text-xs text-[#8B8F98] mt-1.5">
              Production architectures with verified benchmarks, deterministic code quality, and live deployments.
            </p>
          </div>

          {/* Interactive Filter Segmented Tabs */}
          <div className="flex flex-wrap gap-1.5 mt-4 md:mt-0 font-mono text-xs p-1 bg-[#101216] rounded-xl border border-[#24272D]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  filterCategory === cat.id
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Bento Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Featured Bento Card 1: Vero AI PR Engine (Large Span) */}
          <div className="md:col-span-2 rounded-2xl border border-[#7CFF6B]/30 bg-[#101216] p-6 hover:border-[#7CFF6B]/60 transition-all flex flex-col justify-between group shadow-xl">
            <div>
              {/* Top Unboxed Metadata */}
              <div className="flex flex-wrap items-center justify-between font-mono text-xs text-[#8B8F98] pb-3 border-b border-[#24272D]">
                <div className="flex items-center gap-2">
                  <span className="text-[#7CFF6B] font-bold">SYSTEM 01 // CRITICAL</span>
                  <span>·</span>
                  <span>TypeSafe Jev + SonarQube</span>
                  <span>·</span>
                  <span className="text-[#6EA8FE]">Zero-Chat AST Engine</span>
                </div>
                <div className="text-[#7CFF6B] font-bold">PRODUCTION VERIFIED</div>
              </div>

              {/* Title & Narrative */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
                  Vero — AI Pull Request Reviewer & Deterministic Quality Gate
                </h3>
                <p className="text-sm text-[#D1D5DB] mt-2 leading-relaxed">
                  Engineered a zero-hallucination code review pipeline uniting AST static analysis (SonarQube Clean Code rules) with TypeSafe Jev System 1 probabilistic decision primitives. Sub-35ms latency with zero conversational chat reliance.
                </p>
              </div>

              {/* Architecture Blueprint Mockup */}
              <div className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#08090B] border border-[#24272D] font-mono text-xs text-center">
                <div className="p-2">
                  <div className="text-[10px] text-[#8B8F98]">LATENCY</div>
                  <div className="text-base font-bold text-[#7CFF6B]">&lt;35ms</div>
                  <div className="text-[10px] text-[#8B8F98]">Deterministic</div>
                </div>
                <div className="p-2 border-x border-[#24272D]">
                  <div className="text-[10px] text-[#8B8F98]">RULES ENFORCED</div>
                  <div className="text-base font-bold text-[#F2F2F2]">S2068, S3649, S3776</div>
                  <div className="text-[10px] text-[#8B8F98]">Quality Gates</div>
                </div>
                <div className="p-2">
                  <div className="text-[10px] text-[#8B8F98]">HALLUCINATION</div>
                  <div className="text-base font-bold text-[#6EA8FE]">0.0%</div>
                  <div className="text-[10px] text-[#8B8F98]">Math Bounds</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-3 border-t border-[#24272D] font-mono text-xs">
              {onOpenVero && (
                <button
                  type="button"
                  onClick={onOpenVero}
                  className="px-4 py-2 rounded-lg bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>LAUNCH VERO WORKBENCH</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onSelectProject('vero')}
                className="px-3 py-2 rounded-lg border border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] hover:border-[#7CFF6B]/50 transition-colors cursor-pointer"
              >
                Inspect Spec & Diffs
              </button>
            </div>
          </div>

          {/* Standard Bento Cards for other projects */}
          {filteredProjects.filter((p) => p.id !== 'vero').map((project: ProjectItem) => (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject(project.id);
                }
              }}
              onClick={() => onSelectProject(project.id)}
              className="rounded-2xl border border-[#24272D] bg-[#101216] p-5 flex flex-col justify-between hover:border-[#7CFF6B]/60 transition-all group hover:bg-[#12151B] cursor-pointer"
            >
              <div>
                {/* Unboxed Metadata */}
                <div className="flex items-center justify-between font-mono text-xs pb-2.5 mb-3 border-b border-[#24272D]/60 text-[#8B8F98]">
                  <span>{project.number}</span>
                  <span>·</span>
                  <span className="text-[#7CFF6B] font-semibold">{project.technologies?.[0] || 'AI System'}</span>
                  <span>·</span>
                  <span className="text-[#A1A7B5]">{project.severityTier || 'PRODUCTION'}</span>
                </div>

                <h4 className="text-base font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
                  {project.title}
                </h4>

                <p className="text-xs text-[#8B8F98] mt-2 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Key Metric Strip */}
                {project.evaluationMetrics && project.evaluationMetrics.length > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-[#08090B] border border-[#24272D]/60 font-mono text-[11px] text-[#7CFF6B]">
                    {project.evaluationMetrics[0]}
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-[#24272D]/60 flex items-center justify-between font-mono text-xs">
                <span className="text-[11px] text-[#8B8F98] group-hover:text-[#F2F2F2] transition-colors">
                  VIEW ARCHITECTURE
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8B8F98] group-hover:text-[#7CFF6B] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
