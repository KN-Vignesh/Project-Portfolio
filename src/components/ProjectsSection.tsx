import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Filter, Terminal, BookOpen } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectProject }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'ALL PROJECTS (9)' },
    { id: 'GENAI', label: 'GENERATIVE AI & PEFT (3)' },
    { id: 'MODEL', label: 'MODEL ENGINEERING (3)' },
    { id: 'ML', label: 'ML & PRODUCTION (3)' }
  ];

  const filteredProjects = PROJECTS.filter((p) => {
    if (filterCategory === 'ALL') return true;
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
    <section id="projects" className="py-24 border-t border-[#24272D] bg-[#08090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [03] // PRODUCTION & RESEARCH REPOSITORY
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F2F2]">
              SELECTED PROJECT SYSTEMS
            </h2>
            <p className="font-mono text-xs text-[#8B8F98] mt-2">
              Architectures across Generative AI, PEFT parameter adaptation, NLP Transformers, and production ML microservices.
            </p>
          </div>

          {/* Filter Pills */}
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

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: ProjectItem) => {
            return (
              <div
                key={project.id}
                className="rounded-xl border border-[#24272D] bg-[#101216] p-6 flex flex-col justify-between hover:border-[#7CFF6B]/60 transition-all duration-300 group hover:shadow-xl hover:shadow-black/60 relative overflow-hidden"
              >
                {/* Top status bar */}
                <div>
                  <div className="flex items-center justify-between font-mono text-xs pb-3 mb-4 border-b border-[#24272D]">
                    <span className="text-[#7CFF6B] font-bold">{project.number}</span>
                    <span className="text-[10px] text-[#8B8F98] tracking-wider uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors mb-2 leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-[#8B8F98] leading-relaxed mb-5">
                    {project.tagline}
                  </p>

                  {/* Dataset or Core Subject if applicable */}
                  {project.dataset && (
                    <div className="mb-4 p-2.5 rounded bg-[#08090B] border border-[#24272D] font-mono text-[11px]">
                      <span className="text-[#8B8F98] block text-[10px] uppercase">DATASET / INPUT</span>
                      <span className="text-[#F2F2F2] font-medium">{project.dataset}</span>
                    </div>
                  )}

                  {/* System Architecture Flow Diagram */}
                  <div className="mb-5 p-3 rounded bg-[#08090B] border border-[#24272D] font-mono text-[11px] space-y-1.5">
                    <span className="text-[10px] text-[#7CFF6B] block uppercase font-semibold">
                      SYSTEM PIPELINE FLOW
                    </span>
                    <div className="text-[#8B8F98] text-[11px] leading-relaxed flex flex-wrap gap-1 items-center">
                      {project.systemFlow.slice(0, 4).map((stage, sIdx) => (
                        <React.Fragment key={stage}>
                          <span className="text-[#F2F2F2] bg-[#15181D] px-1.5 py-0.5 rounded border border-[#24272D]">
                            {stage}
                          </span>
                          {sIdx < 3 && <span className="text-[#7CFF6B]">→</span>}
                        </React.Fragment>
                      ))}
                      {project.systemFlow.length > 4 && (
                        <span className="text-[#8B8F98] text-[10px]">+{project.systemFlow.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-[#15181D] border border-[#24272D] font-mono text-[10px] text-[#8B8F98]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-[#8B8F98] font-mono">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Links */}
                <div className="pt-4 border-t border-[#24272D] flex items-center justify-between font-mono text-xs">
                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="text-[#7CFF6B] hover:text-[#7CFF6B]/80 font-bold flex items-center space-x-1 group/btn cursor-pointer"
                  >
                    <span>EXPLORE SYSTEM</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center space-x-2">
                    {project.notebookUrl && (
                      <a
                        href={project.notebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded border border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] hover:border-[#8B8F98] transition-colors"
                        title="View Notebook on GitHub"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B] transition-colors flex items-center gap-1"
                      title="View Source on GitHub"
                    >
                      <span className="text-[10px]">REPO</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
