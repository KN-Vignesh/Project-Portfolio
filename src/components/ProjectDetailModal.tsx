import React, { useEffect, useState } from 'react';
import {
  X,
  ExternalLink,
  Code,
  Copy,
  Check,
  FileCode,
  FolderGit2,
  Terminal,
  Activity,
  CheckCircle2,
  GitPullRequest,
  ArrowLeft
} from 'lucide-react';
import { ProjectCodeFile, ProjectItem } from '../types';
import { ProjectInteractiveExperience } from './ProjectInteractiveExperience';

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
  const [activeTab, setActiveTab] = useState<'experience' | 'code'>('experience');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setActiveTab('experience');
  }, [project?.id]);

  if (!project) return null;

  const standaloneRepo = {
    repoName: project.title,
    runtime: 'Authoritative source repository',
    cloneCommand: `git clone ${project.repository}.git`,
  };

  const codeFiles: ProjectCodeFile[] = [];
  const activeCodeFile = codeFiles[activeFileIndex];
  const handleCopyCode = async () => {
    setCopiedCode(false);
  };

  const handleCopyClone = async () => {
    if (!standaloneRepo) return;
    try {
      await navigator.clipboard.writeText(standaloneRepo.cloneCommand);
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn"
    >
      {/* Container Dialog: Full-screen on mobile with native feel, floating dialog on tablet/desktop */}
      <div className="relative w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] bg-[#08090B] border-0 sm:border sm:border-[#24272D] sm:rounded-xl shadow-2xl shadow-black overflow-hidden flex flex-col my-auto">
        
        {/* Sticky Clean Header Bar */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#24272D] bg-[#101216] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 font-mono shrink-0 sticky top-0 z-20">
          {/* Top Row: Back Button, Number, Title & Mobile-only Quick Actions */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              {/* Prominent Back Button (Always visible, extra clear on mobile) */}
              <button
                onClick={onClose}
                id="project-modal-back-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#15181D] hover:bg-[#20242C] border border-[#24272D] hover:border-[#7CFF6B]/50 text-[#7CFF6B] hover:text-[#F2F2F2] font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                aria-label="Back to all projects"
                title="Back to all projects"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>

              {/* Project Number */}
              <span className="px-2 py-0.5 rounded bg-[#08090B] border border-[#7CFF6B]/40 text-[#7CFF6B] text-xs font-bold shrink-0">
                {project.number}
              </span>

              {/* Project Title */}
              <span className="text-xs text-[#F2F2F2] font-semibold truncate max-w-[140px] xs:max-w-[200px] sm:max-w-xs" title={project.title}>
                {project.title}
              </span>
            </div>

            {/* Mobile Quick Actions (Repo + Close) */}
            <div className="flex items-center gap-1.5 sm:hidden shrink-0">
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-xs rounded border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B] transition-colors"
                title="View GitHub Repository"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#15181D] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Switcher & Desktop Action Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Simple Tab Switcher: Experience vs Code */}
            <div className="flex items-center bg-[#08090B] p-1 rounded-lg border border-[#24272D] text-xs w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'experience'
                    ? 'bg-[#15181D] text-[#7CFF6B] border border-[#7CFF6B]/40 font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>EXPERIENCE</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-[#15181D] text-[#7CFF6B] border border-[#7CFF6B]/40 font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>CODE &amp; NOTES</span>
              </button>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-xs rounded border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B] transition-colors flex items-center gap-1 font-mono"
              >
                <span>REPO</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#15181D] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm flex-1">
          
          {/* TAB 1: EXPERIENCE INITIALLY + PARALLEL EXPLANATION */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. INTERACTIVE EXPERIENCE FIRST */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-[#8B8F98]">
                  <span className="text-[#7CFF6B] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                    STEP 1: EXPERIENCE IN ACTION
                  </span>
                  <span>Interact with live parameters below</span>
                </div>

                <ProjectInteractiveExperience
                  projectId={project.id}
                  onOpenVero={project.liveAppView === 'vero' ? () => { onClose(); onOpenVero?.(); } : undefined}
                />
              </div>

              {/* 2. PARALLEL CONCISE EXPLANATION */}
              <div className="space-y-4 pt-2 border-t border-[#24272D]/60">
                <div className="font-mono text-xs text-[#7CFF6B] uppercase font-semibold">
                  STEP 2: UNDERSTAND THE ARCHITECTURE & EFFORT
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Problem & Motivation */}
                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
                    <span className="font-mono text-[11px] text-[#8B8F98] block uppercase font-bold">
                      WHAT THIS SOLVES
                    </span>
                    <p className="text-xs sm:text-sm text-[#F2F2F2] leading-relaxed">
                      {project.sections?.problem || 'Project details are maintained in the source repository.'}
                    </p>
                  </div>

                  {/* Why this engineering approach */}
                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
                    <span className="font-mono text-[11px] text-[#7CFF6B] block uppercase font-bold">
                      WHY THIS ARCHITECTURE
                    </span>
                    <p className="text-xs sm:text-sm text-[#8B8F98] leading-relaxed">
                      {project.sections?.whyApproach || 'Architecture details are maintained in the source repository.'}
                    </p>
                  </div>
                </div>

                {/* Key Metrics & Engineering Decisions */}
                <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-3">
                  <span className="font-mono text-[11px] text-[#6EA8FE] block uppercase font-bold">
                    VERIFIED RESULTS & PRODUCTION DECISIONS
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {project.evaluationMetrics?.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded bg-[#08090B] border border-[#24272D] font-mono text-xs text-[#7CFF6B]"
                      >
                        ✓ {m}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-1.5 pt-1 text-xs text-[#8B8F98]">
                    {(project.sections?.engineeringDecisions || []).slice(0, 2).map((dec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7CFF6B] shrink-0 mt-0.5" />
                        <span className="text-[#E6EDF3]">{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick toggle to inspect code */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0C0E12] border border-[#24272D] font-mono text-xs">
                  <span className="text-[#8B8F98]">Want to inspect the exact Python / TypeScript code?</span>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="px-3 py-1 rounded bg-[#15181D] hover:bg-[#24272D] border border-[#24272D] text-[#7CFF6B] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>VIEW SOURCE CODE</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLEAN SOURCE CODE & MECHANICS */}
          {activeTab === 'code' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Standalone Repo Info Bar */}
              {standaloneRepo && (
                <div className="p-3.5 rounded-xl bg-[#101216] border border-[#24272D] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#7CFF6B]" />
                    <span className="text-[#F2F2F2] font-semibold">{standaloneRepo.repoName}</span>
                    <span className="text-[10px] text-[#8B8F98]">({standaloneRepo.runtime})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-colors"
                    >
                      OPEN SOURCE REPOSITORY
                    </a>
                    <code className="px-2 py-1 rounded bg-[#08090B] border border-[#24272D] text-[#8B8F98] text-[11px] hidden sm:inline select-all">
                      {standaloneRepo.cloneCommand}
                    </code>
                    <button
                      onClick={handleCopyClone}
                      className="px-2.5 py-1 rounded bg-[#15181D] hover:bg-[#24272D] border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Copy clone command"
                    >
                      {copiedClone ? <Check className="w-3 h-3 text-[#7CFF6B]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedClone ? 'COPIED' : 'CLONE'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Code File Selector (if multiple) */}
              {codeFiles.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
                  {codeFiles.map((file, idx) => (
                    <button
                      key={file.filename}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                        activeFileIndex === idx
                          ? 'bg-[#15181D] border-[#7CFF6B] text-[#7CFF6B]'
                          : 'bg-[#101216] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{file.filename}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Code Box */}
              {activeCodeFile && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#0B0D11] border border-[#24272D] overflow-hidden">
                    <div className="px-4 py-2 bg-[#101216] border-b border-[#24272D] flex items-center justify-between font-mono text-xs">
                      <span className="text-[#F2F2F2] font-semibold">{activeCodeFile.filename}</span>
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#15181D] hover:bg-[#24272D] border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] transition-colors cursor-pointer text-[11px]"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-[#7CFF6B]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>

                    <div className="p-4 overflow-x-auto max-h-[340px] font-mono text-xs leading-relaxed text-[#E6EDF3] bg-[#050608]">
                      <pre className="table w-full">
                        {activeCodeFile.code.trim().split('\n').map((line, lIdx) => (
                          <div key={lIdx} className="table-row hover:bg-[#101216]/50">
                            <span className="table-cell pr-4 text-right text-[#484F58] select-none text-[11px] w-8">
                              {lIdx + 1}
                            </span>
                            <span className="table-cell font-mono whitespace-pre">
                              {line.startsWith('#') || line.startsWith('//') ? (
                                <span className="text-[#8B8F98] italic">{line}</span>
                              ) : line.includes('import ') || line.includes('from ') || line.includes('export ') || line.includes('class ') || line.includes('def ') || line.includes('async ') ? (
                                <span className="text-[#FF7B72]">{line}</span>
                              ) : line.includes('return ') || line.includes('if ') || line.includes('else:') || line.includes('try:') || line.includes('except ') ? (
                                <span className="text-[#D2A8FF]">{line}</span>
                              ) : (
                                line
                              )}
                            </span>
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>

                  {/* Step-by-step logic breakdown */}
                  <div className="space-y-2">
                    <span className="font-mono text-[11px] text-[#7CFF6B] uppercase font-bold block">
                      LINE-BY-LINE ENGINEERING MECHANICS
                    </span>
                    <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                      {activeCodeFile.explanation.keyLines.map((item, kIdx) => (
                        <div
                          key={kIdx}
                          className="p-3 rounded-lg bg-[#101216] border border-[#24272D] flex items-start gap-3"
                        >
                          <span className="px-2 py-0.5 rounded bg-[#08090B] border border-[#7CFF6B]/40 text-[#7CFF6B] text-[11px] shrink-0 font-bold">
                            Lines {item.lineNumbers}
                          </span>
                          <p className="text-xs text-[#E6EDF3] font-sans leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Minimal Clean Footer with Persistent Back Navigation */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-[#24272D] bg-[#101216] flex items-center justify-between gap-2 font-mono text-xs shrink-0">
          <button
            onClick={onClose}
            id="project-modal-bottom-back-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#24272D] bg-[#15181D] hover:bg-[#20242C] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/40 font-mono text-xs font-semibold transition-colors cursor-pointer active:scale-95"
            title="Back to All Projects"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#7CFF6B]" />
            <span>BACK TO PROJECTS</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[#8B8F98] text-[11px] hidden md:inline">
              TECH: <span className="text-[#F2F2F2]">{project.technologies.slice(0, 3).join(', ')}</span>
            </span>
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>GITHUB REPO</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
