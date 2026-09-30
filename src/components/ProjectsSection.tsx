import React, { useState } from 'react';
import { Play, ExternalLink, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  loading: boolean;
  error: Error | null;
  onSelectProject: (projectId: string) => void;
  onOpenVero?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, loading, error, onSelectProject, onOpenVero }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: `ALL SYSTEMS (${projects.length})` },
    { id: 'SEV_CRITICAL_HIGH', label: 'SEV-1 TO SEV-3 (HIGH / CRITICAL)' },
    { id: 'GENAI', label: 'GENERATIVE AI & PEFT' },
    { id: 'MODEL', label: 'MODEL ENGINEERING' },
    { id: 'ML', label: 'ML & TABULAR' }
  ];

  const filteredProjects = projects.filter((p) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'SEV_CRITICAL_HIGH') {
      return p.severityTier === 'CRITICAL' || p.severityTier === 'HIGH';
    }
    if (filterCategory === 'GENAI') {
      return p.id === 'qwen-lora' || p.id === 'qlora' || p.id === 'vero';
    }
    if (filterCategory === 'MODEL') {
      return p.id === 'bert' || p.id === 'cnn' || p.id === 'evaluation';
    }
    if (filterCategory === 'ML') {
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
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [03] // PRODUCTION & RESEARCH PORTFOLIO
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2F2F2]">
              EXPERIENCE THE SYSTEMS
            </h2>
            <p className="font-mono text-xs text-[#8B8F98] mt-1.5">
              Fetched from GitHub &amp; structured by project severity, real-time metrics, and verified production architectures.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0 font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold shadow-sm'
                    : 'bg-[#101216] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breathable Project Grid */}
        {loading && <div className="font-mono text-xs text-[#7CFF6B] border border-[#24272D] bg-[#101216] p-5">PROJECT REGISTRY // LOADING...</div>}
        {error && <div className="font-mono text-xs text-[#FF7B72] border border-[#FF7B72]/30 bg-[#101216] p-5">PROJECT REGISTRY UNAVAILABLE<br /><span className="text-[#8B8F98]">Project information could not be retrieved from the source repository.</span></div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project: ProjectItem) => {
            const keyMetric = project.evaluationMetrics?.[0] || 'Production Tested';
            const isCrit = project.severityTier === 'CRITICAL';
            const isHigh = project.severityTier === 'HIGH';
            const isMed = project.severityTier === 'MEDIUM';

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="rounded-xl border border-[#24272D] bg-[#101216] p-5 flex flex-col justify-between hover:border-[#7CFF6B]/60 transition-all duration-200 group hover:bg-[#12151B] cursor-pointer"
              >
                <div>
                  {/* Top Bar: Number, Severity Badge & Live tag */}
                  <div className="flex items-center justify-between font-mono text-xs pb-2.5 mb-3 border-b border-[#24272D]/60">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8B8F98] font-bold text-[11px]">{project.number}</span>
                      
                      {/* Prominent Severity Badge */}
                      {project.severityLevel && (
                        <span 
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            isCrit 
                              ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                              : isHigh 
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
                              : isMed
                              ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                          title={`Severity Rating: ${project.severityLevel} (${project.severityTier})`}
                        >
                          {project.severityLevel} · {project.severityTier}
                        </span>
                      )}

                      {project.liveAppView === 'vero' && (
                        <span className="flex items-center gap-1 text-[9px] text-[#7CFF6B] bg-[#7CFF6B]/15 border border-[#7CFF6B]/30 px-1.5 py-0.2 rounded font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                          LIVE ENGINE
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-[#8B8F98] uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors mb-1.5 leading-snug">
                    {project.title}
                  </h3>

                  {/* Severity Operational Label */}
                  {project.severityLabel && (
                    <div className="text-[11px] font-mono text-[#A1A7B5] mb-2 flex items-center gap-1">
                      <span className="text-[#7CFF6B]">▸</span>
                      <span className="font-semibold">{project.severityLabel}</span>
                    </div>
                  )}

                  {/* 1-Sentence Purpose */}
                  <p className="text-xs text-[#8B8F98] leading-relaxed mb-4 line-clamp-2">
                    {project.tagline}
                  </p>

                  {/* Key Verified Result Box */}
                  <div className="mb-4 p-2.5 rounded-lg bg-[#08090B] border border-[#24272D] font-mono text-xs flex items-center justify-between">
                    <span className="text-[10px] text-[#8B8F98] uppercase">VERIFIED RESULT:</span>
                    <span className="text-[#7CFF6B] font-semibold text-[11px] truncate max-w-[180px]">
                      {keyMetric}
                    </span>
                  </div>

                  {/* Tech Stack Pills (Clean, max 3) */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-[#15181D] border border-[#24272D] font-mono text-[10px] text-[#8B8F98]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Single Primary Action */}
                <div className="pt-3 border-t border-[#24272D]/60 flex items-center justify-between font-mono text-xs">
                  <div className="text-[#7CFF6B] group-hover:translate-x-0.5 transition-transform font-bold flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-current" />
                    <span>EXPERIENCE &amp; INSPECT</span>
                  </div>

                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#8B8F98] hover:text-[#F2F2F2] transition-colors p-1"
                    title="View GitHub Repository"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
