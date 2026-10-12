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
  ArrowLeft,
  BookOpen,
  Cpu,
  ShieldCheck,
  Zap,
  Sparkles
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
  const [activeTab, setActiveTab] = useState<'experience' | 'story' | 'code'>('experience');
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
    setActiveFileIndex(0);
  }, [project?.id]);

  if (!project) return null;

  const standaloneRepo = {
    repoName: project.standaloneRepoInfo?.repoName || project.title,
    runtime: project.standaloneRepoInfo?.deploymentType || 'Authoritative source repository',
    cloneCommand: project.standaloneRepoInfo?.cloneCommand || `git clone ${project.repository}.git`,
  };

  const codeFiles: ProjectCodeFile[] = project.codeFiles || [];
  const activeCodeFile = codeFiles[activeFileIndex];

  const handleCopyCode = async () => {
    if (!activeCodeFile) return;
    try {
      await navigator.clipboard.writeText(activeCodeFile.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
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

  const story = project.story;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project Details Modal"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn"
    >
      {/* Container Dialog: Full-screen on mobile with native feel, floating dialog on tablet/desktop */}
      <div className="relative w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] bg-[#08090B] border-0 sm:border sm:border-[#24272D] sm:rounded-xl shadow-2xl shadow-black overflow-hidden flex flex-col my-auto">
        
        {/* Sticky Clean Header Bar */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#24272D] bg-[#101216] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 font-mono shrink-0 sticky top-0 z-20">
          {/* Top Row: Back Button, Number, Title */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={onClose}
                id="project-modal-back-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#15181D] hover:bg-[#20242C] border border-[#24272D] hover:border-[#7CFF6B]/50 text-[#7CFF6B] hover:text-[#F2F2F2] font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                title="Return to Portfolio (Esc)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">BACK</span>
              </button>

              <span className="px-1.5 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#7CFF6B] text-[10px] font-bold shrink-0">
                {project.number}
              </span>

              <h2 className="text-xs sm:text-sm font-bold text-[#F2F2F2] truncate tracking-tight">
                {project.title}
              </h2>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-lg text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#15181D] transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher & Desktop Action Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* 3 Tab Switcher: Experience vs Story vs Code */}
            <div className="flex items-center bg-[#08090B] p-1 rounded-lg border border-[#24272D] text-xs w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'experience'
                    ? 'bg-[#15181D] text-[#7CFF6B] border border-[#7CFF6B]/40 font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>EXPERIMENT</span>
              </button>

              <button
                onClick={() => setActiveTab('story')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'story'
                    ? 'bg-[#15181D] text-[#7CFF6B] border border-[#7CFF6B]/40 font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ENGINEERING STORY</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'code'
                    ? 'bg-[#15181D] text-[#7CFF6B] border border-[#7CFF6B]/40 font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>CODE &amp; ARCH</span>
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm flex-1 font-mono">
          
          {/* TAB 1: INTERACTIVE SIMULATOR */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8B8F98]">
                  <span className="text-[#7CFF6B] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                    INTERACTIVE EXPERIMENT IN ACTION
                  </span>
                  <span>Interact with live parameters below</span>
                </div>

                <ProjectInteractiveExperience
                  projectId={project.id}
                  onOpenVero={project.liveAppView === 'vero' ? () => { onClose(); onOpenVero?.(); } : undefined}
                />
              </div>

              {/* Parallel Quick Summary */}
              <div className="space-y-4 pt-2 border-t border-[#24272D]/60">
                <div className="text-xs text-[#7CFF6B] uppercase font-semibold">
                  CORE ENGINEERING PROPOSITION
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
                    <span className="text-[11px] text-[#8B8F98] block uppercase font-bold">
                      THE PROBLEM
                    </span>
                    <p className="text-xs sm:text-sm text-[#F2F2F2] leading-relaxed font-sans">
                      {project.story?.problem || project.sections?.problem || project.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
                    <span className="text-[11px] text-[#7CFF6B] block uppercase font-bold">
                      THE SOLUTION
                    </span>
                    <p className="text-xs sm:text-sm text-[#8B8F98] leading-relaxed font-sans">
                      {project.story?.solution || project.sections?.whyApproach || project.tagline}
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-3">
                  <span className="text-[11px] text-[#6EA8FE] block uppercase font-bold">
                    VERIFIED BENCHMARKS &amp; OUTCOMES
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {project.evaluationMetrics?.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded bg-[#08090B] border border-[#24272D] text-xs text-[#7CFF6B]"
                      >
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED 13-POINT ENGINEERING STORY */}
          {activeTab === 'story' && (
            <div className="space-y-6 animate-fadeIn text-xs">
              <div className="p-4 rounded-xl bg-[#101216] border border-[#7CFF6B]/30 space-y-2">
                <div className="text-xs text-[#7CFF6B] uppercase font-bold">
                  PROJECT SPECIFICATION: {project.title}
                </div>
                <p className="text-[#D1D5DB] leading-relaxed font-sans text-xs sm:text-sm">
                  {project.story?.solution || project.description}
                </p>
              </div>

              {/* 13 Engineering Dimensions Grid */}
              <div className="space-y-4">
                {/* 1. Problem & 2. Baseline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                    <span className="text-[11px] text-[#FF7B72] uppercase font-bold block">
                      1. PROBLEM DEFINITION
                    </span>
                    <p className="text-[#D1D5DB] leading-relaxed font-sans">
                      {story?.problem || project.sections?.problem || 'Problem context maintained in repository.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                    <span className="text-[11px] text-[#FFB86B] uppercase font-bold block">
                      2. EXISTING BASELINE &amp; DEFICIENCIES
                    </span>
                    <p className="text-[#D1D5DB] leading-relaxed font-sans">
                      {story?.baseline || 'Manual baseline without automated pipeline.'}
                    </p>
                  </div>
                </div>

                {/* 3. Constraints & 4. Investigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                    <span className="text-[11px] text-[#6EA8FE] uppercase font-bold block">
                      3. HARD TECHNICAL CONSTRAINTS
                    </span>
                    <ul className="space-y-1 text-[#D1D5DB] font-sans">
                      {(story?.constraints || ['Latency < 50ms', 'Bounded memory envelope']).map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#6EA8FE]">&bull;</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                    <span className="text-[11px] text-[#7CFF6B] uppercase font-bold block">
                      4. EXPERIMENTAL INVESTIGATION
                    </span>
                    <p className="text-[#D1D5DB] leading-relaxed font-sans">
                      {story?.investigation || 'Exploratory data analysis and model comparison.'}
                    </p>
                  </div>
                </div>

                {/* 5. Solution & 6. Architecture Flow */}
                <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
                  <span className="text-[11px] text-[#7CFF6B] uppercase font-bold block">
                    5. ARCHITECTURE &amp; DATA FLOW PIPELINE
                  </span>
                  <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] text-[#7CFF6B] text-[11px] leading-relaxed">
                    {story?.architecture || project.sections?.architecture || 'Input -> Preprocessing -> Model -> Output'}
                  </div>
                </div>

                {/* 7. Personal Contribution & 8. Decision Rationale */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                    <span className="text-[11px] text-[#F2F2F2] uppercase font-bold block">
                      7. VERIFIED PERSONAL CONTRIBUTION
                    </span>
                    <p className="text-[#D1D5DB] leading-relaxed font-sans">
                      {story?.personalContribution || 'Architected the pipeline, authored codebase, and ran validation experiments.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                    <span className="text-[11px] text-[#6EA8FE] uppercase font-bold block">
                      8. KEY ENGINEERING DECISIONS
                    </span>
                    <ul className="space-y-1 text-[#D1D5DB] font-sans">
                      {(story?.decisionRationale || project.sections?.engineeringDecisions || []).map((dec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7CFF6B] shrink-0 mt-0.5" />
                          <span>{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 9. Experiment & 10. Validation & 11. Results */}
                <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
                  <span className="text-[11px] text-[#7CFF6B] uppercase font-bold block">
                    10. EMPIRICAL VALIDATION &amp; RESULTS
                  </span>
                  <p className="text-[#D1D5DB] font-sans">
                    {story?.validation || 'Cross-validated against held-out validation split.'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    {(story?.results || project.evaluationMetrics || []).map((r, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#08090B] border border-[#24272D] text-[#7CFF6B] font-bold">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 12. Limitations & 13. Future Work */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                    <span className="text-[11px] text-[#FFB86B] uppercase font-bold block">
                      12. KNOWN LIMITATIONS
                    </span>
                    <ul className="space-y-1 text-[#8B8F98] font-sans">
                      {(story?.limitations || project.sections?.limitations || ['Batch-trained weights requiring periodic retraining']).map((lim, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#FFB86B]">&bull;</span>
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                    <span className="text-[11px] text-[#7CFF6B] uppercase font-bold block">
                      13. FUTURE ENGINEERING IMPROVEMENTS
                    </span>
                    <ul className="space-y-1 text-[#8B8F98] font-sans">
                      {(story?.futureWork || project.sections?.futureImprovements || ['Automated drift monitoring']).map((fw, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#7CFF6B]">&bull;</span>
                          <span>{fw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOURCE CODE & LINE-BY-LINE MECHANICS */}
          {activeTab === 'code' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Standalone Repo Info Bar */}
              <div className="p-3.5 rounded-xl bg-[#101216] border border-[#24272D] flex flex-wrap items-center justify-between gap-3 text-xs">
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
                    OPEN REPOSITORY
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

              {/* Code File Selector */}
              {codeFiles.length > 0 ? (
                <div className="space-y-4">
                  {codeFiles.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
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
                        <div className="px-4 py-2 bg-[#101216] border-b border-[#24272D] flex items-center justify-between text-xs">
                          <span className="text-[#F2F2F2] font-semibold">{activeCodeFile.filename}</span>
                          <button
                            onClick={handleCopyCode}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#15181D] hover:bg-[#24272D] border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] transition-colors cursor-pointer text-[11px]"
                          >
                            {copiedCode ? <Check className="w-3 h-3 text-[#7CFF6B]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
                          </button>
                        </div>

                        <div className="p-4 overflow-x-auto max-h-[380px] text-xs leading-relaxed text-[#E6EDF3] bg-[#050608]">
                          <pre className="table w-full">
                            {activeCodeFile.code.trim().split('\n').map((line, lIdx) => (
                              <div key={lIdx} className="table-row hover:bg-[#101216]/50">
                                <span className="table-cell pr-4 text-right text-[#484F58] select-none text-[11px] w-8">
                                  {lIdx + 1}
                                </span>
                                <span className="table-cell whitespace-pre">
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
                      {activeCodeFile.explanation && (
                        <div className="space-y-2">
                          <span className="text-[11px] text-[#7CFF6B] uppercase font-bold block">
                            LINE-BY-LINE ENGINEERING MECHANICS
                          </span>
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            {activeCodeFile.explanation.keyLines.map((item, kIdx) => (
                              <div
                                key={kIdx}
                                className="p-3 rounded-lg bg-[#101216] border border-[#24272D] flex items-start gap-3"
                              >
                                <span className="px-2 py-0.5 rounded bg-[#08090B] border border-[#7CFF6B]/40 text-[#7CFF6B] text-[11px] shrink-0 font-bold">
                                  Lines {item.lineNumbers}
                                </span>
                                <span className="text-[#D1D5DB] font-sans text-xs">
                                  {item.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
                  <p className="text-xs text-[#8B8F98]">
                    Full repository source code is maintained on GitHub.
                  </p>
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7CFF6B] text-[#08090B] font-bold text-xs"
                  >
                    <span>BROWSE REPOSITORY ON GITHUB</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
