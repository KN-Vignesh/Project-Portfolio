import React, { useState } from 'react';
import {
  GitPullRequest,
  ArrowUpRight,
  Layers,
  ExternalLink,
  FolderGit2,
  Search,
} from 'lucide-react';
import { ProjectItem } from '../types';
import { ScrollReveal, SwiftRollLabel } from './ScrollReveal';
import { NutshellText } from './Nutshell';

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
  onSelectProject,
  onOpenVero,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'ALL', label: `All Work (${projects.length})` },
    { id: 'GENAI', label: 'Generative AI & LLMs' },
    { id: 'MODEL', label: 'Model Engineering & 3D' },
    { id: 'SYSTEMS', label: 'Enterprise .NET & Cloud' },
  ];

  const matchesCategory = (p: ProjectItem) => {
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
  };

  const filteredProjects = projects.filter((p) => {
    if (!matchesCategory(p)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q))
    );
  });

  const featuredVero = filteredProjects.find((p) => p.id === 'vero');
  const remainingProjects = filteredProjects.filter((p) => p.id !== 'vero');

  const handleFilterKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = categories.findIndex((c) => c.id === filterCategory);
    if (currentIndex === -1) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = categories[(currentIndex + 1) % categories.length];
      setFilterCategory(next.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev =
        categories[(currentIndex - 1 + categories.length) % categories.length];
      setFilterCategory(prev.id);
    }
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section-fluid border-t border-white/[0.08] bg-[#08090B] relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Editorial Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide">
              01 · Selected Engineering Case Studies
            </div>
            <h2
              id="projects-heading"
              className="editorial-h2 font-bold text-[#F4F4F6]"
            >
              Production AI Systems &amp; Interactive Benchmarks
            </h2>
            <p className="fluid-body text-[#8B8F98]">
              Every project pairs real training or inference source code with an interactive 3D or live simulation workbench, before-and-after holdout metrics, and root-cause failure debugging.
            </p>
          </div>

          {/* Interactive Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 self-start lg:self-end w-full lg:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#8B8F98] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by stack or model..."
                aria-label="Filter projects by technology or title"
                className="w-full min-h-12 sm:min-h-10 pl-8 pr-3 py-2 rounded-xl bg-[#101216] border border-white/[0.08] focus:border-[#7CFF6B] text-xs text-[#F4F4F6] placeholder:text-[#8B8F98] font-mono outline-none transition-colors"
              />
            </div>

            <div
              role="group"
              aria-label="Filter projects by domain"
              onKeyDown={handleFilterKeyDown}
              className="flex flex-wrap gap-1 p-1 bg-[#101216] rounded-xl border border-white/[0.08] text-xs"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={filterCategory === cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`min-h-11 sm:min-h-9 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium whitespace-nowrap ${
                    filterCategory === cat.id
                      ? 'bg-[#7CFF6B] text-[#08090B] font-bold shadow-sm'
                      : 'text-[#8B8F98] hover:text-[#F4F4F6]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Screen Reader Live Filter Announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Showing {filteredProjects.length} of {projects.length} engineering case studies
        </div>

        {/* Loading Skeleton State (Only shown while async project registry loads) */}
        {loading && projects.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" aria-busy="true">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-white/[0.08] bg-[#101216] p-8 h-72 animate-pulse flex flex-col justify-between"
              >
                <div className="h-4 w-32 bg-white/[0.06] rounded" />
                <div className="space-y-3">
                  <div className="h-6 w-3/4 bg-white/[0.08] rounded" />
                  <div className="h-4 w-full bg-white/[0.05] rounded" />
                </div>
                <div className="h-4 w-1/2 bg-white/[0.06] rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty Filter State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#101216] p-10 text-center space-y-3">
            <div className="font-mono text-sm text-[#F4F4F6] font-semibold">
              No projects match &ldquo;{searchQuery}&rdquo; in this category.
            </div>
            <p className="text-xs text-[#8B8F98]">
              Reset the active search or category filter to view all 9 verified engineering systems.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterCategory('ALL');
                setSearchQuery('');
              }}
              className="swift-spring-btn min-h-12 px-5 py-2.5 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 2-Column Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flagship Case Study 01: Vero AI PR Engine (Spans 2 Columns when present in filter) */}
          {featuredVero && (
            <ScrollReveal className="lg:col-span-2">
              <article className="editorial-card rounded-2xl p-6 sm:p-9 group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Narrative Column */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8B8F98] font-mono">
                    <span className="text-[#7CFF6B] font-semibold">
                      {featuredVero.number} · Flagship System
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>TypeSafe Jev + SonarQube AST</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#D1D5DB]">Zero-Chat PR Gate</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F4F6] group-hover:text-[#7CFF6B] transition-colors">
                      <a
                        href="/projects/vero"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectProject('vero');
                        }}
                        className="focus:outline-none focus-visible:underline"
                      >
                        {featuredVero.title}
                      </a>
                    </h3>
                    <NutshellText
                      blockId="featured-vero-desc"
                      as="p"
                      maxTriggers={2}
                      className="text-base text-[#D1D5DB] leading-relaxed max-w-[62ch]"
                      text={featuredVero.description}
                    />
                  </div>

                  {/* Unboxed Technology Metadata */}
                  <div className="font-mono text-xs text-[#8B8F98] flex flex-wrap items-center gap-x-2 gap-y-1">
                    {featuredVero.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span className="text-[#D1D5DB]">{tech}</span>
                        {idx < featuredVero.technologies.length - 1 && (
                          <span aria-hidden="true" className="text-white/20">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Distinct Case Study, Live Demo, and Repository Links */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm">
                    <a
                      href="/projects/vero"
                      aria-label={`Inspect ${featuredVero.title} case study and architecture`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProject('vero');
                      }}
                      className="swift-spring-btn min-h-12 px-4 py-2.5 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                      <SwiftRollLabel
                        label="Inspect Case Study"
                        hoverLabel="Architecture & Benchmarks"
                      />
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    {onOpenVero && (
                      <button
                        type="button"
                        onClick={onOpenVero}
                        aria-label={`Launch live demo for ${featuredVero.title}`}
                        className="swift-spring-btn min-h-12 px-4 py-2.5 rounded-xl border border-white/[0.12] bg-[#08090B] hover:border-[#7CFF6B]/50 text-[#F4F4F6] font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <GitPullRequest className="w-4 h-4 text-[#7CFF6B]" />
                        <SwiftRollLabel
                          label="Live Vero Demo"
                          hoverLabel="vero-silk-delta.vercel.app"
                        />
                        <ExternalLink className="w-3.5 h-3.5 text-[#8B8F98]" />
                      </button>
                    )}

                    <a
                      href={featuredVero.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${featuredVero.title} source code on GitHub`}
                      className="swift-spring-btn min-h-12 px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#08090B] hover:border-white/25 text-[#8B8F98] hover:text-[#F4F4F6] font-mono text-xs flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-[#7CFF6B]" />
                      <span>Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Right Visual Stage Preview */}
                <a
                  href="/projects/vero"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectProject('vero');
                  }}
                  aria-label="Inspect Vero — AI Pull Request Reviewer case study"
                  className="lg:col-span-5 card-preview-stage rounded-xl bg-[#08090B] border border-white/[0.08] p-5 space-y-4 font-mono block"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#8B8F98] pb-3 border-b border-white/[0.06]">
                    <span>AST + JEV VERIFICATION STAGE</span>
                    <span className="text-[#7CFF6B]">DETERMINISTIC GATE</span>
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
                      <div className="text-sm font-bold text-[#F4F4F6] tabular-nums mt-1">
                        S2068 · S3649
                      </div>
                    </div>
                    <div className="py-3 px-2 rounded-lg bg-[#101216] border border-white/[0.06]">
                      <div className="text-[10px] text-[#8B8F98]">DRIFT</div>
                      <div className="text-lg font-bold text-[#F4F4F6] tabular-nums mt-0.5">
                        0.0%
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-[#8B8F98]">
                    <div className="flex items-center justify-between">
                      <span>GitHub Diff Parser → Sonar AST → Jev</span>
                      <span className="text-[#7CFF6B]">100% Reproducible</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#15181D] overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-[#7CFF6B] to-[#6EA8FE] rounded-full" />
                    </div>
                  </div>
                </a>
              </article>
            </ScrollReveal>
          )}

          {/* 2-Column Showcase Cards for Remaining Projects */}
          {remainingProjects.map((project: ProjectItem, index: number) => {
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
              <ScrollReveal key={project.id} delay={(index % 2) * 0.06}>
                <article className="editorial-card rounded-2xl p-6 sm:p-8 h-full flex flex-col justify-between group">
                  <div className="space-y-5">
                    {/* Top Unboxed Metadata Row */}
                    <div className="flex items-center justify-between text-xs text-[#8B8F98] font-mono pb-4 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2 min-w-0 truncate">
                        <span className="text-[#7CFF6B] font-semibold tabular-nums">
                          {project.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#D1D5DB] truncate">
                          {project.category}
                        </span>
                      </div>
                      <a
                        href={`/projects/${project.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectProject(project.id);
                        }}
                        aria-label={`Open ${project.title} case study`}
                        className="min-h-10 min-w-10 inline-flex items-center justify-end text-[#8B8F98] group-hover:text-[#7CFF6B] transition-colors shrink-0"
                      >
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>

                    {/* Clickable Visual Preview Stage */}
                    <a
                      href={`/projects/${project.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProject(project.id);
                      }}
                      aria-label={`Inspect ${project.title} interactive benchmark preview`}
                      className="card-preview-stage rounded-xl bg-[#08090B] border border-white/[0.06] p-4 space-y-3 font-mono block"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#8B8F98] uppercase flex items-center gap-1.5">
                          {project.id === 'house-price' && (
                            <Layers className="w-3.5 h-3.5 text-[#7CFF6B]" />
                          )}
                          <span>
                            {project.id === 'house-price'
                              ? '3D Regression Surface + SHAP'
                              : 'Holdout Benchmark'}
                          </span>
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
                              <div className="text-[9px] text-[#8B8F98] tabular-nums">
                                0{nIdx + 1} · {node.type}
                              </div>
                              <div className="text-[11px] text-[#F4F4F6] font-semibold truncate mt-0.5">
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
                    </a>

                    {/* Clickable Title & Concise Problem/Purpose Statement */}
                    <div className="space-y-2.5">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F4F4F6] group-hover:text-[#7CFF6B] transition-colors">
                        <a
                          href={`/projects/${project.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectProject(project.id);
                          }}
                          className="focus:outline-none focus-visible:underline"
                        >
                          {project.title}
                        </a>
                      </h3>
                      <NutshellText
                        blockId={`project-card-${project.id}`}
                        as="p"
                        maxTriggers={2}
                        className="text-sm sm:text-base text-[#8B8F98] leading-relaxed"
                        text={project.description}
                      />
                    </div>
                  </div>

                  {/* Card Footer: Unboxed Stack + Separate Case Study & Repo Links */}
                  <div className="pt-5 mt-6 border-t border-white/[0.08] space-y-3">
                    <div className="font-mono text-xs text-[#8B8F98] truncate">
                      {project.technologies?.slice(0, 5).join(' · ')}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1 text-xs font-medium">
                      <a
                        href={`/projects/${project.id}`}
                        aria-label={`Inspect ${project.title} case study`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectProject(project.id);
                        }}
                        className="min-h-11 sm:min-h-9 text-[#F4F4F6] group-hover:text-[#7CFF6B] inline-flex items-center gap-1.5 font-semibold transition-colors"
                      >
                        <SwiftRollLabel
                          label="Inspect Case Study"
                          hoverLabel="Open Workbench & Code"
                        />
                        <span aria-hidden="true">→</span>
                      </a>

                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} repository on GitHub`}
                        className="min-h-11 sm:min-h-9 text-[#8B8F98] hover:text-[#F4F4F6] font-mono inline-flex items-center gap-1 transition-colors"
                        title={`Open ${project.title} repository on GitHub`}
                      >
                        <FolderGit2 className="w-3.5 h-3.5 text-[#7CFF6B]" />
                        <span>GitHub Repo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
