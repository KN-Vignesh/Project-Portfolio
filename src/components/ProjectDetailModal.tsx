import React, { useEffect } from 'react';
import { X, ExternalLink, BookOpen, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, Terminal, Cpu, GitPullRequest } from 'lucide-react';
import { ProjectItem } from '../types';
import { PROJECTS } from '../data/portfolioData';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onOpenVero?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
  onOpenVero,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const relatedProjects = PROJECTS.filter((p) =>
    project.relatedProjectIds.includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Container Dialog */}
      <div className="relative w-full max-w-4xl bg-[#08090B] border border-[#24272D] rounded-xl shadow-2xl shadow-black overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Sticky Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#24272D] bg-[#101216] flex items-center justify-between font-mono shrink-0">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 rounded bg-[#08090B] border border-[#7CFF6B]/40 text-[#7CFF6B] text-xs font-bold">
              {project.number}
            </span>
            <span className="text-xs text-[#8B8F98] uppercase tracking-wider hidden sm:inline">
              {project.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {project.liveAppView === 'vero' && onOpenVero && (
              <button
                id="modal-launch-vero-button"
                onClick={() => {
                  onClose();
                  onOpenVero();
                }}
                className="px-3 py-1 text-xs rounded bg-[#7CFF6B] hover:bg-[#7CFF6B]/90 text-[#08090B] font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm shadow-[#7CFF6B]/20 cursor-pointer"
                title="Open Live VERO Pull Request Intelligence Engine"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>LAUNCH LIVE ENGINE</span>
              </button>
            )}

            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs rounded border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B] transition-colors flex items-center gap-1.5"
            >
              <span>GITHUB</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {project.notebookUrl && (
              <a
                href={project.notebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs rounded border border-[#24272D] text-[#8B8F98] hover:text-[#6EA8FE] hover:border-[#6EA8FE] transition-colors flex items-center gap-1.5"
              >
                <span>NOTEBOOK</span>
                <BookOpen className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#15181D] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-[#8B8F98] text-sm">
          
          {/* Main Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F2F2F2] tracking-tight">
              {project.title}
            </h1>
            <p className="text-base text-[#7CFF6B] font-mono leading-relaxed">
              {project.tagline}
            </p>
            <p className="text-sm text-[#8B8F98] leading-relaxed">
              {project.description}
            </p>

            {/* Stack chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded bg-[#101216] border border-[#24272D] font-mono text-xs text-[#F2F2F2]"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Live Interactive Engine Banner */}
            {project.liveAppView === 'vero' && onOpenVero && (
              <div className="mt-4 p-4 rounded-xl border border-[#7CFF6B]/40 bg-[#101216] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-[#7CFF6B]/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#7CFF6B]/15 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B] shrink-0">
                    <GitPullRequest className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-[#F2F2F2] flex items-center gap-2">
                      <span>LIVE VERO ENGINE ACTIVE</span>
                      <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                    </div>
                    <p className="font-mono text-xs text-[#8B8F98]">
                      Interactive GitHub PR diff ingestion, SonarQube static gates & TypeSafe Jev model choices.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenVero();
                  }}
                  className="px-4 py-2 rounded-lg bg-[#7CFF6B] hover:bg-[#7CFF6B]/90 text-[#08090B] font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <span>LAUNCH ENGINE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 01 / PROBLEM */}
          <section className="space-y-2 border-t border-[#24272D]/60 pt-6">
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase font-semibold">
              01 // PROBLEM DEFINITION & MOTIVATION
            </div>
            <p className="text-[#F2F2F2] leading-relaxed">
              {project.sections.problem}
            </p>
          </section>

          {/* 02 / WHY THIS APPROACH */}
          <section className="space-y-2 border-t border-[#24272D]/60 pt-6">
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase font-semibold">
              02 // WHY THIS APPROACH
            </div>
            <p className="text-[#8B8F98] leading-relaxed">
              {project.sections.whyApproach}
            </p>
          </section>

          {/* 03 / DATA & INPUT SPECIFICATION */}
          <section className="space-y-2 border-t border-[#24272D]/60 pt-6">
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase font-semibold">
              03 // DATA & INPUT SPECIFICATION
            </div>
            <div className="p-3.5 rounded bg-[#101216] border border-[#24272D] font-mono text-xs text-[#F2F2F2]">
              {project.sections.dataInput}
            </div>
          </section>

          {/* 04 / SYSTEM PIPELINE ARCHITECTURE */}
          <section className="space-y-3 border-t border-[#24272D]/60 pt-6">
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase font-semibold">
              04 // SYSTEM PIPELINE ARCHITECTURE
            </div>
            <p className="text-[#8B8F98] leading-relaxed">
              {project.sections.architecture}
            </p>

            {/* Pipeline Block Sequence */}
            <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
              <span className="font-mono text-[10px] text-[#8B8F98] block uppercase">
                END-TO-END EXECUTION FLOW
              </span>
              <div className="flex flex-wrap gap-2 items-center font-mono text-xs">
                {project.systemFlow.map((stage, sIdx) => (
                  <React.Fragment key={stage}>
                    <span className="px-2.5 py-1 rounded bg-[#08090B] border border-[#24272D] text-[#7CFF6B]">
                      {stage}
                    </span>
                    {sIdx < project.systemFlow.length - 1 && (
                      <span className="text-[#8B8F98]">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* 05 / IMPLEMENTATION DETAILS */}
          <section className="space-y-2 border-t border-[#24272D]/60 pt-6">
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase font-semibold">
              05 // IMPLEMENTATION & REPRODUCIBILITY
            </div>
            <p className="text-[#8B8F98] leading-relaxed">
              {project.sections.implementation}
            </p>
          </section>

          {/* 06 / EVALUATION & METRICS */}
          <section className="space-y-2 border-t border-[#24272D]/60 pt-6">
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase font-semibold">
              06 // EVALUATION & VERIFIED METRICS
            </div>
            <div className="p-4 rounded bg-[#101216] border border-[#24272D] space-y-2 font-mono text-xs">
              <div className="text-[#F2F2F2]">
                {project.sections.evaluation}
              </div>
              {project.evaluationMetrics && (
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#6EA8FE]">
                  {project.evaluationMetrics.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D]">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 07 / KEY ENGINEERING DECISIONS */}
          <section className="space-y-3 border-t border-[#24272D]/60 pt-6">
            <div className="font-mono text-xs text-[#7CFF6B] tracking-wider uppercase font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#7CFF6B]" />
              <span>07 // KEY ENGINEERING DECISIONS</span>
            </div>
            <ul className="space-y-2 text-[#8B8F98]">
              {project.sections.engineeringDecisions.map((dec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#7CFF6B] font-mono">[{i + 1}]</span>
                  <span className="text-[#F2F2F2]">{dec}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 08 / LIMITATIONS & FUTURE IMPROVEMENTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#24272D]/60 pt-6">
            <div className="p-4 rounded-lg bg-[#101216] border border-[#24272D] space-y-2 font-mono text-xs">
              <div className="text-[#FFB86B] font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>LIMITATIONS</span>
              </div>
              <ul className="space-y-1.5 text-[#8B8F98] text-[11px]">
                {project.sections.limitations.map((lim, i) => (
                  <li key={i}>• {lim}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-[#101216] border border-[#24272D] space-y-2 font-mono text-xs">
              <div className="text-[#6EA8FE] font-bold flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>FUTURE ROADMAP</span>
              </div>
              <ul className="space-y-1.5 text-[#8B8F98] text-[11px]">
                {project.sections.futureImprovements.map((imp, i) => (
                  <li key={i}>• {imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 09 / RELATED SYSTEMS */}
          {relatedProjects.length > 0 && (
            <section className="space-y-3 border-t border-[#24272D]/60 pt-6 font-mono text-xs">
              <div className="text-[#8B8F98] uppercase">
                INTERCONNECTED ARCHITECTURES IN PORTFOLIO
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedProjects.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectProject(rel.id)}
                    className="p-3 rounded border border-[#24272D] bg-[#101216] hover:border-[#7CFF6B] text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-[#7CFF6B] text-[10px]">{rel.number}</div>
                      <div className="text-[#F2F2F2] font-semibold text-xs">{rel.title}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8B8F98] group-hover:text-[#7CFF6B] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#24272D] bg-[#101216] flex items-center justify-between font-mono text-xs shrink-0">
          <span className="text-[#8B8F98] text-[11px]">
            STATUS: <span className="text-[#7CFF6B]">{project.status}</span>
          </span>
          <div className="flex items-center space-x-3">
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-colors flex items-center gap-1.5"
            >
              <span>EXPLORE REPO ON GITHUB</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
