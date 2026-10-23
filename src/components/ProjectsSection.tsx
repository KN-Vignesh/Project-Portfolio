import React, { useState } from 'react';
import { GitPullRequest, ArrowUpRight, Layers } from 'lucide-react';
import { ProjectItem } from '../types';
import { ScrollReveal, SwiftRollLabel } from './ScrollReveal';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  loading: boolean;
  error: Error | null;
  onSelectProject: (projectId: string) => void;
  onOpenVero?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
  onOpenVero,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: `All Work (${projects.length})` },
    { id: 'GENAI', label: 'Generative AI & LLMs' },
    { id: 'MODEL', label: 'Model Engineering & 3D' },
    { id: 'SYSTEMS', label: 'Enterprise .NET & Cloud' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'GENAI') {
      return p.id === 'vero' || p.id === 'qwen-lora' || p.id === 'qlora';
    }
    if (filterCategory === 'MODEL') {
      return (
        p.id === 'bert' ||
        p.id === 'cnn' ||
        p.id === 'evaluation' ||
        p.id === 'house-price'
      );
    }
    if (filterCategory === 'SYSTEMS') {
      return (
        p.id === 'customer-churn' ||
        p.id === 'house-price' ||
        p.id === 'titanic'
      );
    }
    return true;
  });

  return (
    <section
      id="projects"
      className="py-28 lg:py-32 border-t border-white/[0.08] bg-[#08090B] relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Editorial Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
              01 · Selected Engineering Case Studies
            </div>
            <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
              Production AI Systems &amp; Interactive Benchmarks
            </h2>
            <p className="text-base text-[#8B8F98] leading-relaxed">
              Every system pairs real training/inference code with an interactive 3D or live simulation workbench, before-and-after benchmarks, and root-cause failure analysis.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
            <button
              type="button"
              onClick={() => onSelectProject('house-price')}
              className="group swift-spring-btn px-3.5 py-2 rounded-xl bg-[#101216] hover:bg-[#15181D] border border-[#7CFF6B]/40 text-[#7CFF6B] text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <SwiftRollLabel
                label="3D House Price Surface + SHAP"
                hoverLabel="Open 3D Terrain Workbench"
              />
            </button>

            <div className="flex flex-wrap gap-1 p-1 bg-[#101216] rounded-xl border border-white/[0.08] text-xs">
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
        </ScrollReveal>

        {/* 2-Column Large-Format Showcase Grid (cosmos.studio works_list pattern) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flagship Case Study 01: Vero AI PR Engine (Spans 2 Columns) */}
          <ScrollReveal className="lg:col-span-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectProject('vero')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject('vero');
                }
              }}
              className="editorial-card rounded-2xl p-6 sm:p-9 group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Narrative Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8B8F98] font-mono">
                  <span className="text-[#7CFF6B] font-semibold">01</span>
                  <span aria-hidden="true">·</span>
                  <span>TypeSafe Jev + SonarQube AST</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#D1D5DB]">Zero-Chat PR Gate</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
                    Vero — AI Pull Request Reviewer &amp; Deterministic Quality Gate
                  </h3>
                  <p className="text-base text-[#D1D5DB] leading-relaxed max-w-[62ch]">
                    Engineered a zero-hallucination code review pipeline uniting AST static analysis (SonarQube Clean Code rules S2068, S3649, S3776) with TypeSafe Jev System 1 probabilistic decision primitives.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm">
                  {onOpenVero && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVero();
                      }}
                      className="swift-spring-btn px-4 py-2.5 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/95 flex items-center gap-2 cursor-pointer"
                    >
                      <GitPullRequest className="w-4 h-4" />
                      <SwiftRollLabel
                        label="Launch Live Vero Engine"
                        hoverLabel="Analyze GitHub PR Live"
                      />
                    </button>
                  )}

                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.1] text-[#F2F2F2] group-hover:border-[#7CFF6B]/50 font-medium transition-colors">
                    <SwiftRollLabel
                      label="Inspect Full Case Study"
                      hoverLabel="Architecture & Benchmarks"
                    />
                    <ArrowUpRight className="w-4 h-4 text-[#7CFF6B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Right Visual Stage Preview */}
              <div className="lg:col-span-5 rounded-xl bg-[#08090B] border border-white/[0.08] p-5 space-y-4 font-mono">
                <div className="flex items-center justify-between text-[11px] text-[#8B8F98] pb-3 border-b border-white/[0.06]">
                  <span>AST + JEV VERIFICATION STAGE</span>
                  <span className="text-[#7CFF6B]">VERIFIED</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="py-3 px-2 rounded-lg bg-[#101216] border border-white/[0.06]">
                    <div className="text-[10px] text-[#8B8F98]">LATENCY</div>
                    <div className="text-lg font-bold text-[#7CFF6B] tabular-nums mt-0.5">
                      &lt;35ms
                    </div>
                  </div>
                  <div className="py-3 px-2 rounded-lg bg-[#101216] border border-white/[0.06]">
                    <div className="text-[10px] text-[#8B8F98]">RULES</div>
                    <div className="text-sm font-bold text-[#F2F2F2] tabular-nums mt-1">
                      S2068 · S3649
                    </div>
                  </div>
                  <div className="py-3 px-2 rounded-lg bg-[#101216] border border-white/[0.06]">
                    <div className="text-[10px] text-[#8B8F98]">HALLUCINATION</div>
                    <div className="text-lg font-bold text-[#F2F2F2] tabular-nums mt-0.5">
                      0.0%
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#8B8F98]">
                  <div className="flex items-center justify-between">
                    <span>GitHub Diff Parser → Sonar AST</span>
                    <span className="text-[#7CFF6B]">100% Deterministic</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#15181D] overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-[#7CFF6B] to-[#6EA8FE] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 2-Column Showcase Cards for Remaining Projects */}
          {filteredProjects
            .filter((p) => p.id !== 'vero')
            .map((project: ProjectItem, index: number) => {
              const primaryMetric =
                project.evaluationMetrics?.[0] ||
                project.story?.results?.[0] ||
                'Verified Holdout Benchmark';
              const secondaryMetric =
                project.evaluationMetrics?.[1] ||
                project.story?.results?.[1] ||
                project.technologies?.slice(0, 3).join(' · ');
              const archNodes = project.story?.architectureNodes?.slice(0, 3) || [];

              return (
                <ScrollReveal key={project.id} delay={(index % 2) * 0.08}>
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectProject(project.id);
                      }
                    }}
                    onClick={() => onSelectProject(project.id)}
                    className="editorial-card rounded-2xl p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="space-y-5">
                      {/* Top Unboxed Metadata Row */}
                      <div className="flex items-center justify-between text-xs text-[#8B8F98] font-mono pb-4 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          <span className="text-[#7CFF6B] font-semibold">
                            {project.number}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#D1D5DB]">
                            {project.technologies?.[0] || 'AI System'}
                          </span>
                          {project.technologies?.[1] && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{project.technologies[1]}</span>
                            </>
                          )}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#8B8F98] group-hover:text-[#7CFF6B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>

                      {/* Visual Preview Stage inside each Showcase Card */}
                      <div className="rounded-xl bg-[#08090B] border border-white/[0.06] p-4 space-y-3 font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-[#8B8F98] uppercase">
                            {project.id === 'house-price'
                              ? '3D Regression Surface + SHAP'
                              : 'Verified Benchmark'}
                          </span>
                          <span className="text-xs font-bold text-[#7CFF6B] tabular-nums">
                            {primaryMetric}
                          </span>
                        </div>

                        {/* Mini Pipeline Topology Preview */}
                        {archNodes.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            {archNodes.map((node, nIdx) => (
                              <div
                                key={node.id}
                                className="px-2.5 py-2 rounded-lg bg-[#101216] border border-white/[0.05] truncate"
                              >
                                <div className="text-[9px] text-[#8B8F98]">
                                  0{nIdx + 1} · {node.type}
                                </div>
                                <div className="text-[11px] text-[#F2F2F2] font-semibold truncate mt-0.5">
                                  {node.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-[#D1D5DB] truncate">
                            {secondaryMetric}
                          </div>
                        )}
                      </div>

                      {/* Title & Readable Editorial Description */}
                      <div className="space-y-2.5">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm sm:text-base text-[#8B8F98] leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Action Row */}
                    <div className="pt-5 mt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-medium">
                      <span className="text-[#8B8F98] font-mono">
                        {project.technologies?.slice(0, 4).join(' · ')}
                      </span>
                      <span className="text-[#F2F2F2] group-hover:text-[#7CFF6B] inline-flex items-center gap-1 font-semibold transition-colors">
                        <SwiftRollLabel
                          label="Open Case Study"
                          hoverLabel="Launch Workbench"
                        />
                        <span>→</span>
                      </span>
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
