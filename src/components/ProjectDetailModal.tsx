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
  Sparkles,
  Layers,
  Sliders,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { ProjectCodeFile, ProjectItem, ProjectArchitectureNode } from '../types';
import { ProjectInteractiveExperience } from './ProjectInteractiveExperience';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onOpenVero?: () => void;
}

type ModalSubTab = 'overview' | 'architecture' | 'before-after' | 'decisions' | 'story' | 'code';

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
  onOpenVero,
}) => {
  const [activeTab, setActiveTab] = useState<ModalSubTab>('overview');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [selectedArchNode, setSelectedArchNode] = useState<ProjectArchitectureNode | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [experimentKey, setExperimentKey] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setActiveTab('overview');
    setActiveFileIndex(0);
    setExperimentKey(0);
    if (project?.story?.architectureNodes?.length) {
      setSelectedArchNode(project.story.architectureNodes[0]);
    } else {
      setSelectedArchNode(null);
    }
  }, [project?.id]);

  if (!project) return null;

  const standaloneRepo = {
    repoName: project.standaloneRepoInfo?.repoName || project.title,
    runtime: project.standaloneRepoInfo?.deploymentType || 'Authoritative source repository',
    cloneCommand: project.standaloneRepoInfo?.cloneCommand || `git clone ${project.repository}.git`,
  };

  const codeFiles: ProjectCodeFile[] = project.codeFiles || [];
  const activeCodeFile = codeFiles[activeFileIndex];
  const story = project.story;

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
      {/* Container Dialog: Full-screen on mobile, wide 6xl floating dialog on tablet/desktop */}
      <div className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[94vh] bg-[#08090B] border-0 sm:border sm:border-[#24272D] sm:rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col my-auto">
        
        {/* Sticky Clean Header Bar */}
        <div className="px-4 py-3 border-b border-[#24272D] bg-[#101216] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono shrink-0 sticky top-0 z-20">
          {/* Top Row: Back Button, Number, Title */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={onClose}
                id="project-modal-back-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15181D] hover:bg-[#20242C] border border-[#24272D] hover:border-[#7CFF6B]/50 text-[#7CFF6B] hover:text-[#F2F2F2] font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                title="Return to Portfolio (Esc)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK</span>
              </button>

              <span className="px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#7CFF6B] text-[10px] font-bold shrink-0">
                {project.number}
              </span>

              <h2 className="text-xs sm:text-sm md:text-base font-bold text-[#F2F2F2] truncate tracking-tight">
                {project.title}
              </h2>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-lg text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#15181D] transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Top Action Links */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs rounded-lg border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B] transition-colors flex items-center gap-1.5 font-mono"
            >
              <span>GITHUB REPO</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#15181D] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 font-mono text-xs">

          {/* ====================================================================
              CANONICAL SECTION 1: BALANCED TWO-COLUMN OPENING VIEW
              Left: Interactive 3D Workbench / Simulator
              Right: Beginner-Friendly 4-Block Plain Explanation + Key Takeaway
          ==================================================================== */}
          <div className="rounded-2xl border border-[#24272D] bg-[#0D0F12] p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#24272D]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                <span className="font-bold text-xs text-[#7CFF6B] uppercase tracking-wider">
                  CANONICAL PROJECT WORKBENCH &amp; SIMULATOR
                </span>
                <span className="text-[#8B8F98] hidden md:inline">·</span>
                <span className="text-[#8B8F98] hidden md:inline text-[11px]">
                  Adjust parameters on the left to see cause and effect
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetExperiment}
                  className="px-2.5 py-1 rounded bg-[#101216] border border-[#24272D] hover:border-[#7CFF6B]/40 text-[#8B8F98] hover:text-[#7CFF6B] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                  title="Reset experiment parameters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
                <span className="text-[10px] text-[#6EA8FE] px-2 py-0.5 rounded bg-[#6EA8FE]/10 border border-[#6EA8FE]/30">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Full-width layout for 3D House Price Workbench, or Balanced Two-Column Split for standard simulators */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Interactive Workbench / 3D Scene */}
              <div
                className={
                  project.id === 'house-price' ||
                  project.experiment?.componentType === 'house-price-3d'
                    ? 'lg:col-span-12 space-y-3'
                    : 'lg:col-span-7 space-y-3'
                }
              >
                <div className="rounded-xl border border-[#24272D] bg-[#101216] p-3.5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#8B8F98] border-b border-[#24272D] pb-2">
                    <span className="text-[#F2F2F2] font-semibold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#7CFF6B]" />
                      <span>LIVE INTERACTIVE 3D MODEL &amp; FEATURE CONTROLS</span>
                    </span>
                    <span className="text-[#7CFF6B]">REAL-TIME INFERENCE &amp; SHAP</span>
                  </div>

                  {/* Keyed Simulator for seamless reset */}
                  <div key={experimentKey}>
                    <ProjectInteractiveExperience
                      projectId={project.id}
                      experiment={project.experiment}
                      onOpenVero={project.liveAppView === 'vero' ? () => { onClose(); onOpenVero?.(); } : undefined}
                    />
                  </div>
                </div>
              </div>

              {/* Beginner-Friendly 4-Block Explanation */}
              <div
                className={
                  project.id === 'house-price' ||
                  project.experiment?.componentType === 'house-price-3d'
                    ? 'lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans'
                    : 'lg:col-span-5 space-y-3 font-sans'
                }
              >
                
                {/* 1. THE PROBLEM */}
                <div className="p-3.5 rounded-xl bg-[#101216] border border-[#FF7B72]/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#FF7B72] uppercase">
                    <span>1. THE PROBLEM</span>
                  </div>
                  <p className="text-xs text-[#D1D5DB] leading-relaxed">
                    {story?.problem || project.sections?.problem || project.description}
                  </p>
                </div>

                {/* 2. MY APPROACH */}
                <div className="p-3.5 rounded-xl bg-[#101216] border border-[#6EA8FE]/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#6EA8FE] uppercase">
                    <span>2. MY APPROACH</span>
                  </div>
                  <p className="text-xs text-[#D1D5DB] leading-relaxed">
                    {story?.solution || project.sections?.whyApproach || project.tagline}
                  </p>
                </div>

                {/* 3. HOW IT WORKS */}
                <div className="p-3.5 rounded-xl bg-[#101216] border border-[#7CFF6B]/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#7CFF6B] uppercase">
                    <span>3. HOW IT WORKS</span>
                  </div>
                  <p className="text-xs text-[#D1D5DB] leading-relaxed">
                    {story?.howItWorks || story?.architecture || 'Input -> Preprocessing -> Model Inference -> Validated Output'}
                  </p>
                </div>

                {/* 4. THE OUTCOME */}
                <div className="p-3.5 rounded-xl bg-[#101216] border border-[#FFB86B]/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#FFB86B] uppercase">
                    <span>4. THE OUTCOME</span>
                  </div>
                  <div className="space-y-1 text-xs text-[#D1D5DB]">
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {(story?.results || project.evaluationMetrics || ['Verified on holdout split']).map((res, rIdx) => (
                        <span key={rIdx} className="px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[10px] font-mono text-[#7CFF6B]">
                          ✓ {res}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 💡 KEY TAKEAWAY STATEMENT BANNER */}
                <div
                  className={`p-3 rounded-xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/40 space-y-1 font-mono ${
                    project.id === 'house-price' ||
                    project.experiment?.componentType === 'house-price-3d'
                      ? 'sm:col-span-2 lg:col-span-4'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7CFF6B] uppercase">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>KEY TAKEAWAY</span>
                  </div>
                  <p className="text-xs text-[#F2F2F2] font-sans italic leading-relaxed">
                    &ldquo;{story?.keyTakeaway || 'Rigorous engineering architecture with deterministic contracts produces explainable, reproducible AI systems.'}&rdquo;
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* ====================================================================
              CANONICAL SECTION 2: PROGRESSIVE LEARNING SUB-NAVIGATION BAR
              Allows visitor to explore deeper technical levels at their own pace
          ==================================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#24272D] pb-2">
              <span className="text-[11px] text-[#8B8F98] uppercase tracking-wider font-bold">
                PROGRESSIVE ENGINEERING DRILL-DOWN
              </span>
              <span className="text-[10px] text-[#8B8F98]">Select a dimension to inspect</span>
            </div>

            {/* Segmented Sub-Tab Switcher */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#101216] rounded-xl border border-[#24272D] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'architecture'
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ARCHITECTURE EXPLORER</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('before-after')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'before-after'
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>BEFORE &amp; AFTER LAB</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('decisions')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'decisions'
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>DECISIONS &amp; DEBUGGING</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'story'
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>13-STAGE VERIFICATION</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                  activeTab === 'code'
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>SOURCE CODE</span>
              </button>
            </div>
          </div>

          {/* ====================================================================
              SUB-TAB CONTENT 1: PRIORITY 1 INTERACTIVE ARCHITECTURE EXPLORER
          ==================================================================== */}
          {activeTab === 'architecture' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#7CFF6B]" />
                    <span className="font-bold text-xs text-[#F2F2F2]">
                      INTERACTIVE COMPONENT DATA FLOW DAG
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8B8F98]">
                    Click any node below to inspect its data contract
                  </span>
                </div>

                {/* Visual Pipeline DAG Flow */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  {(story?.architectureNodes || []).map((node, nIdx) => {
                    const isSelected = selectedArchNode?.id === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedArchNode(node)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#7CFF6B]/10 border-[#7CFF6B] text-[#7CFF6B] shadow-md shadow-[#7CFF6B]/10'
                            : 'bg-[#08090B] border-[#24272D] text-[#8B8F98] hover:border-[#7CFF6B]/40 hover:text-[#F2F2F2]'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase opacity-80 mb-1 flex items-center gap-1.5">
                          <span>STEP {nIdx + 1}</span>
                          <span className="text-[#8B8F98] opacity-60">/</span>
                          <span>{node.type}</span>
                        </div>
                        <div className="text-xs font-bold text-[#F2F2F2] leading-tight">
                          {node.name}
                        </div>
                        <div className="text-[10px] text-[#8B8F98] mt-2 font-mono truncate">
                          {node.sourceFile}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Node Inspector Detail Card */}
                {selectedArchNode && (
                  <div className="p-4 rounded-xl bg-[#08090B] border border-[#7CFF6B]/40 space-y-2 mt-3 animate-fadeIn">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24272D] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#7CFF6B]">
                          COMPONENT SPEC: {selectedArchNode.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#101216] border border-[#24272D] text-[10px] text-[#8B8F98]">
                          TYPE: {selectedArchNode.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6EA8FE]">
                        SOURCE: <code>{selectedArchNode.sourceFile}</code>
                      </div>
                    </div>
                    <p className="text-xs text-[#D1D5DB] font-sans leading-relaxed">
                      {selectedArchNode.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================================
              SUB-TAB CONTENT 2: PRIORITY 2 BEFORE & AFTER EVIDENCE LAB
          ==================================================================== */}
          {activeTab === 'before-after' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-4">
                <div className="flex items-center justify-between border-b border-[#24272D] pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#7CFF6B]" />
                    <span className="font-bold text-xs text-[#F2F2F2]">
                      BASELINE VS PROPOSED SOLUTION COMPARISON
                    </span>
                  </div>
                  <span className="text-[10px] text-[#7CFF6B] font-bold">
                    EVALUATED UNDER IDENTICAL INPUT CONDITIONS
                  </span>
                </div>

                {/* Test Condition Card */}
                <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
                  <span className="text-[10px] text-[#8B8F98] uppercase font-bold block">
                    STANDARDIZED EVALUATION INPUT CONDITION:
                  </span>
                  <p className="text-xs text-[#E6EDF3] font-sans">
                    {story?.beforeAfterLab?.inputCondition || 'Evaluated across holdout test distribution.'}
                  </p>
                </div>

                {/* Side-by-Side Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Baseline Column */}
                  <div className="p-4 rounded-xl bg-[#08090B] border border-[#FF7B72]/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#FF7B72]">
                      <span>EXISTING BASELINE</span>
                      <span>DEFICIENT</span>
                    </div>
                    <div className="p-2 rounded bg-[#101216] border border-[#24272D] text-xs text-[#FF7B72] font-bold">
                      {story?.beforeAfterLab?.baselineMetric || 'Baseline uncalibrated heuristic'}
                    </div>
                    <p className="text-xs text-[#8B8F98] font-sans leading-relaxed">
                      {story?.beforeAfterLab?.baselineOutcome || 'High error rates and failure to generalize.'}
                    </p>
                  </div>

                  {/* Proposed Solution Column */}
                  <div className="p-4 rounded-xl bg-[#08090B] border border-[#7CFF6B]/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#7CFF6B]">
                      <span>MY PROPOSED SOLUTION</span>
                      <span>VERIFIED OUTCOME</span>
                    </div>
                    <div className="p-2 rounded bg-[#101216] border border-[#7CFF6B]/30 text-xs text-[#7CFF6B] font-bold">
                      {story?.beforeAfterLab?.solutionMetric || 'Optimized production pipeline'}
                    </div>
                    <p className="text-xs text-[#D1D5DB] font-sans leading-relaxed">
                      {story?.beforeAfterLab?.solutionOutcome || 'Target performance criteria verified.'}
                    </p>
                  </div>
                </div>

                {/* What Changed & Boundary Limitation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
                    <span className="text-[10px] text-[#7CFF6B] uppercase font-bold block">
                      ARCHITECTURAL LEVER:
                    </span>
                    <p className="text-xs text-[#D1D5DB] font-sans">
                      {story?.beforeAfterLab?.whatChanged || 'Replaced ad-hoc baseline with verified machine learning pipeline.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
                    <span className="text-[10px] text-[#FFB86B] uppercase font-bold block">
                      KNOWN BOUNDARY LIMITATION:
                    </span>
                    <p className="text-xs text-[#8B8F98] font-sans">
                      {story?.beforeAfterLab?.limitation || 'Performance subject to input distribution stability.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              SUB-TAB CONTENT 3: PRIORITY 3 FAILURE ANALYSIS & DECISION JOURNAL
          ==================================================================== */}
          {activeTab === 'decisions' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Failure Analysis & Root Cause Lab */}
              <div className="p-4 rounded-xl bg-[#101216] border border-[#FF7B72]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#FF7B72] font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ROOT CAUSE FAILURE ANALYSIS &amp; DEBUGGING LAB</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
                    <span className="text-[10px] text-[#FF7B72] uppercase font-bold block">
                      1. THE TECHNICAL CHALLENGE:
                    </span>
                    <p className="text-xs text-[#D1D5DB] font-sans">
                      {story?.failureAnalysis?.challenge || 'Handling domain variance under strict constraints.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
                    <span className="text-[10px] text-[#FF7B72] uppercase font-bold block">
                      2. INITIAL OBSERVED FAILURE:
                    </span>
                    <p className="text-xs text-[#D1D5DB] font-sans">
                      {story?.failureAnalysis?.whatFailed || 'Underperformance on boundary test conditions.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
                    <span className="text-[10px] text-[#FFB86B] uppercase font-bold block">
                      3. IDENTIFIED ROOT CAUSE:
                    </span>
                    <p className="text-xs text-[#D1D5DB] font-sans">
                      {story?.failureAnalysis?.rootCause || 'Statistical assumptions violated by sample distribution.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
                    <span className="text-[10px] text-[#7CFF6B] uppercase font-bold block">
                      4. ENGINEERING RESOLUTION &amp; VERIFICATION:
                    </span>
                    <p className="text-xs text-[#D1D5DB] font-sans">
                      {story?.failureAnalysis?.resolution || 'Refined architecture and verified with holdout evaluation.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Engineering Decision Journal */}
              <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-3">
                <div className="flex items-center gap-2 text-[#6EA8FE] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#7CFF6B]" />
                  <span>ENGINEERING DECISION JOURNAL &amp; TRADE-OFFS</span>
                </div>

                <div className="space-y-2">
                  {(story?.decisionRationale || project.sections?.engineeringDecisions || []).map((dec, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#101216] border border-[#7CFF6B]/40 text-[#7CFF6B] text-[10px] font-bold shrink-0 mt-0.5">
                        DEC {idx + 1}
                      </span>
                      <p className="text-xs text-[#D1D5DB] font-sans leading-relaxed">
                        {dec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              SUB-TAB CONTENT 4: 13-STAGE COMPLETE ENGINEERING STORY
          ==================================================================== */}
          {activeTab === 'story' && (
            <div className="space-y-4 animate-fadeIn text-xs">
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
          )}

          {/* ====================================================================
              SUB-TAB CONTENT 5: SOURCE CODE & LINE-BY-LINE MECHANICS
          ==================================================================== */}
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
                    type="button"
                    onClick={handleCopyClone}
                    className="px-2.5 py-1 rounded bg-[#15181D] hover:bg-[#24272D] border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                    title="Copy clone command"
                  >
                    {copiedClone ? <Check className="w-3 h-3 text-[#7CFF6B]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedClone ? 'COPIED' : 'CLONE'}</span>
                  </button>
                </div>
              </div>

              {codeFiles.length > 0 && activeCodeFile ? (
                <div className="space-y-4">
                  {/* File Selector Tabs */}
                  {codeFiles.length > 1 && (
                    <div className="flex flex-wrap gap-2 border-b border-[#24272D] pb-2">
                      {codeFiles.map((f, idx) => (
                        <button
                          key={f.filename}
                          type="button"
                          onClick={() => setActiveFileIndex(idx)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                            activeFileIndex === idx
                              ? 'bg-[#15181D] border-[#7CFF6B] text-[#7CFF6B] font-semibold'
                              : 'bg-[#101216] border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2]'
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>{f.filename}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Code Viewer Box */}
                  <div className="rounded-xl border border-[#24272D] bg-[#08090B] overflow-hidden shadow-inner">
                    <div className="px-4 py-2.5 border-b border-[#24272D] bg-[#101216] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-[#7CFF6B]" />
                        <span className="font-semibold text-[#F2F2F2]">{activeCodeFile.filename}</span>
                        <span className="text-[10px] text-[#8B8F98]">({activeCodeFile.language})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/40 transition-colors text-[11px]"
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
