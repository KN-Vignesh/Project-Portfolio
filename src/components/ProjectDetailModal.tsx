import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  FileCode,
  FolderGit2,
  Terminal,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sliders,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Mail,
  GitPullRequest,
  UserCheck,
} from 'lucide-react';
import {
  ProjectCodeFile,
  ProjectItem,
  ProjectArchitectureNode,
} from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ProjectInteractiveExperience } from './ProjectInteractiveExperience';
import { SwiftRollLabel } from './ScrollReveal';
import { NutshellText } from './Nutshell';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  allProjects?: ProjectItem[];
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenVero?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  allProjects = [],
  onClose,
  onSelectProject,
  onNavigateSection,
  onOpenVero,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [selectedArchNode, setSelectedArchNode] =
    useState<ProjectArchitectureNode | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [experimentKey, setExperimentKey] = useState(0);
  const [showFull13StageAudit, setShowFull13StageAudit] = useState(false);
  const [caseStudyScrollProgress, setCaseStudyScrollProgress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) {
        if (document.body.dataset.surfaceMaximized === 'true') return;
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, project]);

  useEffect(() => {
    setActiveFileIndex(0);
    setExperimentKey(0);
    setShowFull13StageAudit(false);
    setCaseStudyScrollProgress(0);
    if (project?.story?.architectureNodes?.length) {
      setSelectedArchNode(project.story.architectureNodes[0]);
    } else {
      setSelectedArchNode(null);
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [project?.id]);

  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    setCaseStudyScrollProgress(
      maxScroll > 0
        ? Math.min(100, Math.max(0, (el.scrollTop / maxScroll) * 100))
        : 0
    );
  };

  const scrollToChapter = (elementId: string) => {
    const container = scrollContainerRef.current;
    const target =
      container?.querySelector(`#${elementId}`) ||
      document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const standaloneRepo = project
    ? {
        repoName: project.standaloneRepoInfo?.repoName || project.title,
        runtime:
          project.standaloneRepoInfo?.deploymentType ||
          'Verified Open-Source Architecture',
        cloneCommand:
          project.standaloneRepoInfo?.cloneCommand ||
          `git clone ${project.repository}.git`,
      }
    : null;

  const codeFiles: ProjectCodeFile[] = project?.codeFiles || [];
  const activeCodeFile = codeFiles[activeFileIndex];
  const story = project?.story;

  const currentIndex = project
    ? allProjects.findIndex((p) => p.id === project.id)
    : -1;
  const prevProject =
    allProjects.length > 1 && currentIndex !== -1
      ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]
      : null;
  const nextProject =
    allProjects.length > 1 && currentIndex !== -1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null;

  // Prefer relatedProjectIds if defined, otherwise pick 3 related projects from same/adjacent domains
  const relatedProjects = project
    ? (() => {
        const explicitIds = project.relatedProjectIds || [];
        const explicitMatches = allProjects.filter(
          (p) => p.id !== project.id && explicitIds.includes(p.id)
        );
        const fallbacks = allProjects.filter(
          (p) => p.id !== project.id && !explicitIds.includes(p.id)
        );
        return [...explicitMatches, ...fallbacks].slice(0, 3);
      })()
    : [];

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

  const handleResetExperiment = () => {
    setExperimentKey((prev) => prev + 1);
  };

  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          key={project.id}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Case Study`}
          tabIndex={-1}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 overflow-hidden bg-[#08090B] flex flex-col"
        >
          {/* ====================================================================
              STICKY CASE-STUDY ROUTE BAR WITH BREADCRUMB & CHAPTER JUMP LINKS
          ==================================================================== */}
          <header className="px-4 sm:px-6 lg:px-10 py-3.5 border-b border-white/[0.08] bg-[#101216]/95 backdrop-blur-md shrink-0 sticky top-0 z-30 relative">
            <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Left: Semantic Back-to-Projects Link + Breadcrumb Trail */}
              <div className="flex items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <a
                    href="/#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                    id="project-modal-back-btn"
                    className="swift-spring-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15181D] hover:bg-[#20242C] border border-white/[0.1] hover:border-[#7CFF6B]/50 text-[#7CFF6B] font-mono text-xs font-bold shrink-0 cursor-pointer"
                    title="Back to All Projects (Esc)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Projects</span>
                  </a>

                  {/* Semantic Breadcrumb Navigation */}
                  <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-xs min-w-0 truncate"
                  >
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                      }}
                      className="text-[#8B8F98] hover:text-[#F4F4F6] transition-colors hidden sm:inline cursor-pointer"
                    >
                      Portfolio
                    </a>
                    <span
                      aria-hidden="true"
                      className="text-white/20 hidden sm:inline"
                    >
                      /
                    </span>
                    <span className="font-mono text-[#7CFF6B] font-semibold shrink-0 tabular-nums">
                      {project.number}
                    </span>
                    <span aria-hidden="true" className="text-white/20">
                      ·
                    </span>
                    <span className="text-sm font-bold text-[#F4F4F6] truncate">
                      {project.title}
                    </span>
                  </nav>
                </div>

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden p-2 rounded-lg text-[#8B8F98] hover:text-[#F4F4F6] hover:bg-[#15181D] transition-colors shrink-0"
                  aria-label="Return to projects"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Chapter Quick-Jump Links & Action Controls */}
              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 shrink-0">
                <nav
                  aria-label="Case study chapters"
                  className="hidden xl:flex items-center gap-1 p-1 rounded-lg bg-[#08090B] border border-white/[0.06] text-[11px] font-mono"
                >
                  <button
                    type="button"
                    onClick={() => scrollToChapter('chapter-workbench')}
                    className="px-2.5 py-1 rounded text-[#D1D5DB] hover:text-[#7CFF6B] hover:bg-[#15181D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    01 Workbench
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToChapter('chapter-narrative')}
                    className="px-2.5 py-1 rounded text-[#D1D5DB] hover:text-[#7CFF6B] hover:bg-[#15181D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    02 Problem &amp; Role
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToChapter('chapter-architecture')}
                    className="px-2.5 py-1 rounded text-[#D1D5DB] hover:text-[#7CFF6B] hover:bg-[#15181D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    03 Architecture
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToChapter('chapter-benchmarks')}
                    className="px-2.5 py-1 rounded text-[#D1D5DB] hover:text-[#7CFF6B] hover:bg-[#15181D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    04 Results &amp; Debugging
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToChapter('chapter-code')}
                    className="px-2.5 py-1 rounded text-[#D1D5DB] hover:text-[#7CFF6B] hover:bg-[#15181D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    05 Source Code
                  </button>
                </nav>

                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetExperiment}
                    className="swift-spring-btn px-2.5 py-1.5 rounded-lg bg-[#08090B] border border-white/[0.08] hover:border-[#7CFF6B]/40 text-[#8B8F98] hover:text-[#7CFF6B] flex items-center gap-1.5 font-mono text-xs cursor-pointer whitespace-nowrap"
                    title="Reset interactive workbench state"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Lab</span>
                  </button>

                  {(project.id === 'vero' || project.liveAppView === 'vero') &&
                    onOpenVero && (
                      <button
                        type="button"
                        onClick={onOpenVero}
                        className="swift-spring-btn px-3 py-1.5 rounded-lg bg-[#7CFF6B] text-[#08090B] font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <GitPullRequest className="w-3.5 h-3.5" />
                        <span>Live Vero App</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group swift-spring-btn px-3 py-1.5 text-xs rounded-lg border border-white/[0.08] hover:border-[#7CFF6B]/50 text-[#D1D5DB] hover:text-[#7CFF6B] flex items-center gap-1.5 font-mono whitespace-nowrap"
                  >
                    <SwiftRollLabel label="GitHub Repo" />
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="swift-spring-btn p-1.5 rounded-lg text-[#8B8F98] hover:text-[#F4F4F6] hover:bg-[#15181D] cursor-pointer"
                    aria-label="Close case study"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 1px Live Case Study Reading Progress Hairline */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[1px] bg-[#7CFF6B] transition-[width] duration-100 ease-out pointer-events-none"
              style={{ width: `${caseStudyScrollProgress}%` }}
            />
          </header>

          {/* ====================================================================
              FULL-PAGE SEMANTIC CASE STUDY ARTICLE
          ==================================================================== */}
          <div
            ref={scrollContainerRef}
            onScroll={handleContainerScroll}
            className="flex-1 overflow-y-auto"
          >
            <article className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 space-y-16">
              {/* CASE STUDY HERO & STRUCTURED METADATA GRID */}
              <div className="space-y-8">
                <div className="max-w-4xl space-y-4">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#8B8F98]">
                    <span className="text-[#7CFF6B] font-semibold">
                      Case Study {project.number}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#D1D5DB]">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {project.status || 'Verified Production Architecture'}
                    </span>
                  </div>

                  <h1 className="editorial-h1 font-bold text-[#F4F4F6]">
                    {project.title}
                  </h1>

                  <NutshellText
                    blockId={`modal-hero-${project.id}`}
                    as="p"
                    maxTriggers={2}
                    className="text-base sm:text-xl text-[#D1D5DB] leading-relaxed max-w-[68ch]"
                    text={project.description}
                  />
                </div>

                {/* 5-Column Hairlined Metadata Spec Strip (Role, Stack, Benchmark, Contribution, Links) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-y border-white/[0.08] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] text-xs">
                  <div className="py-4 sm:pr-5">
                    <div className="font-mono text-[10px] text-[#8B8F98] uppercase">
                      ROLE &amp; OWNERSHIP
                    </div>
                    <div className="text-sm font-semibold text-[#F4F4F6] mt-1">
                      {project.role || 'AI / ML Systems Engineer'}
                    </div>
                    <div className="text-[11px] text-[#8B8F98] mt-0.5">
                      Individual End-to-End Architecture
                    </div>
                  </div>

                  <div className="py-4 sm:px-5">
                    <div className="font-mono text-[10px] text-[#8B8F98] uppercase">
                      TECHNOLOGY STACK
                    </div>
                    <div className="text-sm font-semibold text-[#F4F4F6] mt-1 leading-snug">
                      {project.technologies?.slice(0, 5).join(' · ')}
                    </div>
                  </div>

                  <div className="py-4 sm:px-5">
                    <div className="font-mono text-[10px] text-[#8B8F98] uppercase">
                      PRIMARY BENCHMARK
                    </div>
                    <div className="font-mono text-sm font-bold text-[#7CFF6B] tabular-nums mt-1">
                      {project.evaluationMetrics?.[0] ||
                        story?.results?.[0] ||
                        'Holdout Verified'}
                    </div>
                    {project.evaluationMetrics?.[1] && (
                      <div className="font-mono text-[11px] text-[#8B8F98] tabular-nums mt-0.5">
                        {project.evaluationMetrics[1]}
                      </div>
                    )}
                  </div>

                  <div className="py-4 sm:px-5">
                    <div className="font-mono text-[10px] text-[#8B8F98] uppercase">
                      STATUS &amp; RUNTIME
                    </div>
                    <div className="text-sm font-medium text-[#D1D5DB] mt-1">
                      {standaloneRepo?.runtime}
                    </div>
                    <div className="text-[11px] text-[#7CFF6B] font-mono mt-0.5">
                      CI / Holdout Verified
                    </div>
                  </div>

                  <div className="py-4 sm:pl-5 flex flex-col justify-between gap-2">
                    <div className="font-mono text-[10px] text-[#8B8F98] uppercase">
                      REPOSITORY &amp; DEMO
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-semibold text-[#7CFF6B] hover:underline inline-flex items-center gap-1"
                      >
                        <span>GitHub Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {(project.id === 'vero' ||
                        project.liveAppView === 'vero') &&
                        onOpenVero && (
                          <button
                            type="button"
                            onClick={onOpenVero}
                            className="text-xs font-mono font-semibold text-[#F4F4F6] hover:text-[#7CFF6B] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Live App</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ====================================================================
                  CHAPTER 01: FULL-WIDTH (12/12) INTERACTIVE 3D / ML WORKBENCH
              ==================================================================== */}
              <section id="chapter-workbench" className="space-y-4 scroll-mt-20">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider font-semibold">
                    01 · Interactive Simulation &amp; 3D Workbench
                  </h2>
                  <span className="font-mono text-[11px] text-[#8B8F98]">
                    Real-Time Parameter Inspection
                  </span>
                </div>

                <div className="w-full" key={experimentKey}>
                  <ProjectInteractiveExperience
                    projectId={project.id}
                    experiment={project.experiment}
                    onOpenVero={
                      project.liveAppView === 'vero' || project.id === 'vero'
                        ? () => {
                            onOpenVero?.();
                          }
                        : undefined
                    }
                  />
                </div>
              </section>

              {/* ====================================================================
                  CHAPTER 02: PROBLEM STATEMENT, GOALS & PERSONAL CONTRIBUTION
              ==================================================================== */}
              <section
                id="chapter-narrative"
                className="space-y-8 pt-10 border-t border-white/[0.08] scroll-mt-20"
              >
                <h2 className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider font-semibold">
                  02 · Problem Statement, Engineering Goals &amp; Role
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left 4 cols: Problem & Prior Baseline */}
                  <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xl font-bold text-[#F4F4F6]">
                      Problem Statement &amp; Baseline
                    </h3>
                    <NutshellText
                      blockId={`modal-problem-${project.id}`}
                      as="p"
                      maxTriggers={2}
                      className="text-base text-[#D1D5DB] leading-[1.65]"
                      text={
                        story?.problem ||
                        project.sections?.problem ||
                        project.description
                      }
                    />
                    {story?.baseline && (
                      <p className="text-sm text-[#8B8F98] leading-[1.6]">
                        <strong className="text-[#F4F4F6]">
                          Prior Baseline:{' '}
                        </strong>
                        {story.baseline}
                      </p>
                    )}
                  </div>

                  {/* Middle 4 cols: Solution & Execution Flow */}
                  <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xl font-bold text-[#F4F4F6]">
                      Solution &amp; System Architecture
                    </h3>
                    <NutshellText
                      blockId={`modal-solution-${project.id}`}
                      as="p"
                      maxTriggers={2}
                      className="text-base text-[#D1D5DB] leading-[1.65]"
                      text={
                        story?.solution ||
                        project.sections?.whyApproach ||
                        project.tagline
                      }
                    />
                    <p className="text-sm text-[#8B8F98] leading-[1.6]">
                      <strong className="text-[#F4F4F6]">
                        Execution Flow:{' '}
                      </strong>
                      {story?.howItWorks ||
                        story?.architecture ||
                        'Input → Preprocessing → Model Inference → Validated Output'}
                    </p>
                  </div>

                  {/* Right 4 cols: Specific Role & Personal Contribution */}
                  <div className="lg:col-span-4 p-6 rounded-2xl bg-[#101216] border border-white/[0.08] space-y-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#7CFF6B] font-semibold uppercase">
                      <UserCheck className="w-4 h-4" />
                      <span>My Role &amp; Specific Contribution</span>
                    </div>
                    <NutshellText
                      blockId={`modal-role-${project.id}`}
                      as="p"
                      maxTriggers={2}
                      className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed"
                      text={
                        story?.personalContribution ||
                        `Designed, implemented, and validated the end-to-end ${project.title} pipeline, including data preprocessing, model training, and evaluation contracts.`
                      }
                    />
                    {story?.validation && (
                      <p className="text-xs text-[#8B8F98] leading-relaxed pt-2 border-t border-white/[0.08]">
                        <strong className="text-[#F4F4F6]">
                          Verification Protocol:{' '}
                        </strong>
                        {story.validation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Key Takeaway Statement & Verified Results */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#101216] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#7CFF6B] uppercase">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      <span>Architectural Takeaway</span>
                    </div>
                    <p className="text-base text-[#F4F4F6] leading-relaxed">
                      &ldquo;
                      {story?.keyTakeaway ||
                        'Rigorous engineering architecture with deterministic contracts produces explainable, reproducible AI systems.'}
                      &rdquo;
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0 font-mono text-xs">
                    {(
                      story?.results ||
                      project.evaluationMetrics || ['Verified on holdout split']
                    )
                      .slice(0, 3)
                      .map((res, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-3 py-1.5 rounded-lg bg-[#08090B] border border-white/[0.08] text-[#7CFF6B] font-semibold tabular-nums"
                        >
                          ✓ {res}
                        </span>
                      ))}
                  </div>
                </div>
              </section>

              {/* ====================================================================
                  CHAPTER 03: INTERACTIVE COMPONENT DATA-FLOW DAG
              ==================================================================== */}
              {story?.architectureNodes &&
                story.architectureNodes.length > 0 && (
                  <section
                    id="chapter-architecture"
                    className="space-y-5 pt-10 border-t border-white/[0.08] scroll-mt-20"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#7CFF6B]" />
                        <h2 className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider font-semibold">
                          03 · Technical Architecture &amp; Interactive Pipeline DAG
                        </h2>
                      </div>
                      <span className="font-mono text-xs text-[#8B8F98]">
                        Select any pipeline stage below to inspect its contract &amp; source module
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {story.architectureNodes.map((node, nIdx) => {
                        const isSelected = selectedArchNode?.id === node.id;
                        return (
                          <button
                            key={node.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setSelectedArchNode(node)}
                            className={`swift-spring-btn p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#101216] border-[#7CFF6B] text-[#7CFF6B] shadow-lg shadow-[#7CFF6B]/5'
                                : 'bg-[#101216]/60 border-white/[0.08] text-[#8B8F98] hover:border-white/25 hover:text-[#F4F4F6]'
                            }`}
                          >
                            <div className="font-mono text-[10px] font-semibold uppercase opacity-80 mb-1.5 flex items-center gap-1.5 tabular-nums">
                              <span>0{nIdx + 1}</span>
                              <span>·</span>
                              <span>{node.type}</span>
                            </div>
                            <div className="text-sm font-bold text-[#F4F4F6] leading-snug">
                              {node.name}
                            </div>
                            <div className="text-[11px] text-[#8B8F98] mt-3 font-mono truncate">
                              {node.sourceFile}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {selectedArchNode && (
                      <div className="p-5 rounded-xl bg-[#101216] border border-white/[0.1] space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3 font-mono text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-[#7CFF6B]">
                              {selectedArchNode.name}
                            </span>
                            <span className="text-white/20">·</span>
                            <span className="text-[#8B8F98] uppercase">
                              {selectedArchNode.type}
                            </span>
                          </div>
                          <div className="text-[#6EA8FE]">
                            Module: <code>{selectedArchNode.sourceFile}</code>
                          </div>
                        </div>
                        <NutshellText
                          blockId={`modal-arch-${project.id}-${selectedArchNode.id}`}
                          as="p"
                          maxTriggers={2}
                          className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed max-w-[75ch]"
                          text={selectedArchNode.description}
                        />
                      </div>
                    )}
                  </section>
                )}

              {/* ====================================================================
                  CHAPTER 04: BEFORE & AFTER BENCHMARKS, RESULTS & DEBUGGING
              ==================================================================== */}
              <section
                id="chapter-benchmarks"
                className="space-y-8 pt-10 border-t border-white/[0.08] scroll-mt-20"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#7CFF6B]" />
                  <h2 className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider font-semibold">
                    04 · Before &amp; After Benchmarks, Failure Analysis &amp; Limitations
                  </h2>
                </div>

                {/* Side-by-Side Baseline vs Proposed Solution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Baseline */}
                  <div className="p-6 rounded-2xl bg-[#101216] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs text-[#8B8F98]">
                      <span>PRIOR BASELINE</span>
                      <span className="text-[#FF6B6B]">UNOPTIMIZED</span>
                    </div>
                    <div className="font-mono text-lg font-bold text-[#FF6B6B] tabular-nums">
                      {story?.beforeAfterLab?.baselineMetric ||
                        'Baseline uncalibrated heuristic'}
                    </div>
                    <p className="text-sm sm:text-base text-[#8B8F98] leading-relaxed">
                      {story?.beforeAfterLab?.baselineOutcome ||
                        'High error rates and failure to generalize.'}
                    </p>
                  </div>

                  {/* Proposed Solution */}
                  <div className="p-6 rounded-2xl bg-[#101216] border border-[#7CFF6B]/35 space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs text-[#7CFF6B]">
                      <span>ENGINEERED SOLUTION</span>
                      <span>VERIFIED OUTCOME</span>
                    </div>
                    <div className="font-mono text-lg font-bold text-[#7CFF6B] tabular-nums">
                      {story?.beforeAfterLab?.solutionMetric ||
                        'Optimized production pipeline'}
                    </div>
                    <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed">
                      {story?.beforeAfterLab?.solutionOutcome ||
                        'Target performance criteria verified on holdout set.'}
                    </p>
                  </div>
                </div>

                {/* Root Cause Failure Analysis & Key Decisions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[#101216] border border-white/[0.08] space-y-4">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#FFB86B] uppercase">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Challenging Problems &amp; Root-Cause Debugging</span>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <div>
                        <span className="font-mono text-xs text-[#8B8F98] block">
                          OBSERVED FAILURE:
                        </span>
                        <NutshellText
                          blockId={`modal-fail-obs-${project.id}`}
                          as="p"
                          maxTriggers={2}
                          className="text-[#D1D5DB] mt-0.5"
                          text={story?.failureAnalysis?.whatFailed || ''}
                        />
                      </div>
                      <div>
                        <span className="font-mono text-xs text-[#8B8F98] block">
                          IDENTIFIED ROOT CAUSE:
                        </span>
                        <NutshellText
                          blockId={`modal-fail-root-${project.id}`}
                          as="p"
                          maxTriggers={2}
                          className="text-[#D1D5DB] mt-0.5"
                          text={story?.failureAnalysis?.rootCause || ''}
                        />
                      </div>
                      <div>
                        <span className="font-mono text-xs text-[#7CFF6B] block">
                          VERIFIED FIX:
                        </span>
                        <NutshellText
                          blockId={`modal-fail-fix-${project.id}`}
                          as="p"
                          maxTriggers={2}
                          className="text-[#F4F4F6] mt-0.5"
                          text={story?.failureAnalysis?.resolution || ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#101216] border border-white/[0.08] space-y-4">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#7CFF6B] uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Architectural Design Decisions &amp; Trade-Offs</span>
                    </div>
                    <ul className="space-y-3 text-sm text-[#D1D5DB] leading-relaxed">
                      {(
                        story?.decisionRationale ||
                        project.sections?.engineeringDecisions ||
                        []
                      ).map((dec, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="font-mono text-xs text-[#7CFF6B] font-bold mt-0.5 shrink-0 tabular-nums">
                            0{idx + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <NutshellText
                              blockId={`modal-dec-${project.id}-${idx}`}
                              as="span"
                              maxTriggers={2}
                              text={dec}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Collapsible Full 13-Stage Audit (Accordion: 200ms target) */}
                <div className="rounded-xl bg-[#101216] border border-white/[0.08] overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={showFull13StageAudit}
                    onClick={() =>
                      setShowFull13StageAudit(!showFull13StageAudit)
                    }
                    className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-mono text-[#D1D5DB] hover:text-[#7CFF6B] transition-colors duration-200 cursor-pointer"
                  >
                    <span>
                      INSPECT CONSTRAINTS, KNOWN LIMITATIONS &amp; FUTURE ROADMAP
                    </span>
                    {showFull13StageAudit ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showFull13StageAudit && (
                    <div className="p-5 pt-2 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-[#08090B] border border-white/[0.06] space-y-1">
                        <span className="font-mono text-[11px] text-[#7CFF6B] uppercase font-semibold block">
                          Hard Constraints
                        </span>
                        <ul className="space-y-1 text-[#D1D5DB]">
                          {(story?.constraints || []).map((c, idx) => (
                            <li key={idx}>· {c}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-[#08090B] border border-white/[0.06] space-y-1">
                        <span className="font-mono text-[11px] text-[#7CFF6B] uppercase font-semibold block">
                          Experimental Investigation
                        </span>
                        <p className="text-[#D1D5DB]">{story?.investigation}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#08090B] border border-white/[0.06] space-y-1">
                        <span className="font-mono text-[11px] text-[#FFB86B] uppercase font-semibold block">
                          Known Boundary Limitations
                        </span>
                        <ul className="space-y-1 text-[#8B8F98]">
                          {(story?.limitations || []).map((lim, idx) => (
                            <li key={idx}>· {lim}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-[#08090B] border border-white/[0.06] space-y-1">
                        <span className="font-mono text-[11px] text-[#7CFF6B] uppercase font-semibold block">
                          Future Engineering Roadmap
                        </span>
                        <ul className="space-y-1 text-[#8B8F98]">
                          {(story?.futureWork || []).map((fw, idx) => (
                            <li key={idx}>· {fw}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* ====================================================================
                  CHAPTER 05: SOURCE CODE & LINE-BY-LINE MECHANICS
              ==================================================================== */}
              <section
                id="chapter-code"
                className="space-y-5 pt-10 border-t border-white/[0.08] scroll-mt-20"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#7CFF6B]" />
                    <h2 className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider font-semibold">
                      05 · Production Source Code &amp; Annotated Mechanics
                    </h2>
                  </div>

                  {standaloneRepo && (
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <code className="px-2.5 py-1 rounded-lg bg-[#101216] border border-white/[0.08] text-[#8B8F98] text-[11px] hidden md:inline select-all">
                        {standaloneRepo.cloneCommand}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyClone}
                        className="swift-spring-btn px-3 py-1 rounded-lg bg-[#101216] border border-white/[0.1] hover:border-[#7CFF6B]/50 text-[#D1D5DB] hover:text-[#7CFF6B] flex items-center gap-1.5 text-[11px] cursor-pointer"
                      >
                        {copiedClone ? (
                          <Check className="w-3.5 h-3.5 text-[#7CFF6B]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {copiedClone ? 'COPIED CLONE' : 'COPY CLONE'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {codeFiles.length > 0 && activeCodeFile && (
                  <div className="space-y-4">
                    {codeFiles.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {codeFiles.map((f, idx) => (
                          <button
                            key={f.filename}
                            type="button"
                            onClick={() => setActiveFileIndex(idx)}
                            className={`swift-spring-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-mono text-xs cursor-pointer ${
                              activeFileIndex === idx
                                ? 'bg-[#15181D] border-[#7CFF6B] text-[#7CFF6B] font-semibold'
                                : 'bg-[#101216] border-white/[0.08] text-[#8B8F98] hover:text-[#F4F4F6]'
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5" />
                            <span>{f.filename}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="rounded-2xl border border-white/[0.08] bg-[#050608] overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/[0.08] bg-[#101216] flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-[#7CFF6B]" />
                          <span className="font-semibold text-[#F4F4F6]">
                            {activeCodeFile.filename}
                          </span>
                          <span className="text-[11px] text-[#8B8F98]">
                            ({activeCodeFile.language})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="swift-spring-btn flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/[0.1] hover:border-[#7CFF6B]/50 text-[#D1D5DB] hover:text-[#7CFF6B] text-[11px] cursor-pointer"
                        >
                          {copiedCode ? (
                            <Check className="w-3.5 h-3.5 text-[#7CFF6B]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedCode ? 'COPIED' : 'COPY CODE'}</span>
                        </button>
                      </div>

                      <div className="p-4 overflow-x-auto max-h-[420px] font-mono text-xs leading-relaxed text-[#E6EDF3]">
                        <pre className="table w-full">
                          {activeCodeFile.code
                            .trim()
                            .split('\n')
                            .map((line, lIdx) => (
                              <div
                                key={lIdx}
                                className="table-row hover:bg-[#101216]/60"
                              >
                                <span className="table-cell pr-4 text-right text-[#484F58] select-none text-[11px] w-8 tabular-nums">
                                  {lIdx + 1}
                                </span>
                                <span className="table-cell whitespace-pre">
                                  {line}
                                </span>
                              </div>
                            ))}
                        </pre>
                      </div>
                    </div>

                    {activeCodeFile.explanation && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {activeCodeFile.explanation.keyLines.map(
                          (item, kIdx) => (
                            <div
                              key={kIdx}
                              className="p-3.5 rounded-xl bg-[#101216] border border-white/[0.08] flex items-start gap-3"
                            >
                              <span className="px-2 py-0.5 rounded bg-[#08090B] border border-[#7CFF6B]/30 font-mono text-[#7CFF6B] text-[11px] shrink-0 font-semibold tabular-nums">
                                L{item.lineNumbers}
                              </span>
                              <span className="text-[#D1D5DB] text-xs sm:text-sm leading-relaxed">
                                {item.description}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* ====================================================================
                  CHAPTER 06: PREVIOUS / NEXT NAVIGATION, RELATED PROJECTS & CONTACT CTA
              ==================================================================== */}
              <section className="space-y-8 pt-10 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider font-semibold">
                    06 · Continue Exploring Production Systems
                  </h2>
                  <a
                    href="/#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                    className="font-mono text-xs text-[#8B8F98] hover:text-[#F4F4F6] cursor-pointer"
                  >
                    ← Back to All 9 Projects
                  </a>
                </div>

                {/* Semantic Previous / Next Direct Switcher */}
                {prevProject && nextProject && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                      href={`/projects/${prevProject.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProject(prevProject.id);
                      }}
                      className="editorial-card rounded-2xl p-5 text-left group cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="font-mono text-[11px] text-[#8B8F98] flex items-center gap-1.5 tabular-nums">
                          <ArrowLeft className="w-3.5 h-3.5 text-[#7CFF6B] group-hover:-translate-x-1 transition-transform" />
                          <span>PREVIOUS · {prevProject.number}</span>
                        </div>
                        <div className="text-base font-bold text-[#F4F4F6] group-hover:text-[#7CFF6B] transition-colors truncate">
                          {prevProject.title}
                        </div>
                      </div>
                    </a>

                    <a
                      href={`/projects/${nextProject.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProject(nextProject.id);
                      }}
                      className="editorial-card rounded-2xl p-5 text-right group cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0 ml-auto">
                        <div className="font-mono text-[11px] text-[#8B8F98] flex items-center justify-end gap-1.5 tabular-nums">
                          <span>NEXT · {nextProject.number}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#7CFF6B] group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="text-base font-bold text-[#F4F4F6] group-hover:text-[#7CFF6B] transition-colors truncate">
                          {nextProject.title}
                        </div>
                      </div>
                    </a>
                  </div>
                )}

                {/* 3-Card Related Works Strip */}
                {relatedProjects.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="font-mono text-xs text-[#8B8F98]">
                      Related Case Studies
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {relatedProjects.map((rel) => (
                        <a
                          key={rel.id}
                          href={`/projects/${rel.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectProject(rel.id);
                          }}
                          className="editorial-card rounded-xl p-5 text-left group cursor-pointer flex flex-col justify-between gap-3"
                        >
                          <div className="space-y-1.5">
                            <div className="font-mono text-[11px] text-[#8B8F98] tabular-nums">
                              <span className="text-[#7CFF6B] font-semibold">
                                {rel.number}
                              </span>{' '}
                              · {rel.technologies?.[0]}
                            </div>
                            <div className="text-sm font-bold text-[#F4F4F6] group-hover:text-[#7CFF6B] transition-colors line-clamp-1">
                              {rel.title}
                            </div>
                            <p className="text-xs text-[#8B8F98] line-clamp-2">
                              {rel.description}
                            </p>
                          </div>
                          <div className="font-mono text-[11px] text-[#7CFF6B]">
                            {rel.evaluationMetrics?.[0] ||
                              'Inspect Case Study →'}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case Study Footer Contact CTA */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#101216] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1.5">
                    <div className="font-mono text-xs text-[#7CFF6B] font-semibold">
                      Interested in this architecture?
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#F4F4F6]">
                      Discuss production AI engineering or request a walkthrough
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8B8F98]">
                      Reach Vignesh K N directly at {PERSONAL_INFO.email} or explore all 9 systems.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs">
                    <a
                      href={`mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(`Inquiry regarding ${project.title}`)}`}
                      className="swift-spring-btn px-4 py-2.5 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email Vignesh</span>
                    </a>

                    <a
                      href="/#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        if (onNavigateSection) {
                          setTimeout(() => onNavigateSection('contact'), 60);
                        }
                      }}
                      className="swift-spring-btn px-4 py-2.5 rounded-xl border border-white/[0.1] bg-[#08090B] hover:border-[#7CFF6B]/50 text-[#F4F4F6] font-semibold"
                    >
                      Contact Section
                    </a>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
