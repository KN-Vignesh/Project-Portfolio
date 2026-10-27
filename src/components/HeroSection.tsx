import React, { useState, Suspense } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ExternalLink,
  GitPullRequest,
  Layers,
  Cpu,
  Search,
  FileDown,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { HeroPRPlayground } from './HeroPRPlayground';
import { SwiftRollLabel } from './ScrollReveal';
import { NutshellText } from './Nutshell';

const LazyModelVisualizer3D = React.lazy(() =>
  import('./ModelVisualizer3D').then((m) => ({ default: m.ModelVisualizer3D }))
);
const LazyNeuralCore3D = React.lazy(() =>
  import('./NeuralCore3D').then((m) => ({ default: m.NeuralCore3D }))
);

interface HeroSectionProps {
  onExploreProjects: () => void;
  onExploreSystem: () => void;
  onSelectProject?: (projectId: string) => void;
  onOpenResume?: () => void;
  onOpenVero?: () => void;
  onOpenCommandPalette?: () => void;
}

const HERO_ROLES = [
  'AI Software Engineer at ACL Digital',
  'QLoRA & LLM Systems Architect',
  'Enterprise .NET 8 & Azure Engineer',
  'Deterministic AI & RAG Builder',
] as const;

const HERO_TABS = ['3d-tensor', '3d-core', 'pr-playground'] as const;

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onSelectProject,
  onOpenResume,
  onOpenVero,
  onOpenCommandPalette,
}) => {
  const [heroTab, setHeroTab] = useState<'3d-tensor' | '3d-core' | 'pr-playground'>('3d-tensor');
  const [roleIndex, setRoleIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const stageParallaxY = useTransform(
    scrollYProgress,
    [0, 0.25],
    prefersReducedMotion ? [0, 0] : [0, -24]
  );

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
    }, 3400);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = HERO_TABS.indexOf(heroTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHeroTab(HERO_TABS[(currentIndex + 1) % HERO_TABS.length]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHeroTab(HERO_TABS[(currentIndex - 1 + HERO_TABS.length) % HERO_TABS.length]);
    }
  };

  const entranceVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.48,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[90vh] pt-28 pb-16 lg:pt-36 lg:pb-24 flex flex-col justify-between overflow-hidden tech-grid"
    >
      {/* Subtle Ambient Focal Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] bg-[#7CFF6B]/[0.035] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 w-full z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Identity & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Unboxed Metadata Kicker with Accessible Role Cycler & Availability */}
            <motion.div
              custom={0}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-[#8B8F98] font-medium"
            >
              <span className="text-[#7CFF6B] font-semibold">
                Vignesh K N
              </span>
              <span aria-hidden="true">·</span>
              <span
                className="text-[#F4F4F6] font-mono transition-opacity duration-200"
                aria-live="off"
              >
                {prefersReducedMotion ? HERO_ROLES[0] : HERO_ROLES[roleIndex]}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#D1D5DB]">
                Available for AI &amp; Systems Roles · Bengaluru
              </span>
            </motion.div>

            {/* Primary Editorial Headline */}
            <motion.div
              custom={0.06}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="space-y-4"
            >
              <h1
                id="hero-heading"
                className="editorial-h1 font-bold text-[#F4F4F6]"
              >
                Engineering production AI systems, fine-tuned LLMs, and deterministic backends.
              </h1>
              <NutshellText
                blockId="hero-supporting"
                as="p"
                maxTriggers={3}
                className="fluid-body text-[#D1D5DB] max-w-[62ch]"
                text="4+ years building enterprise .NET Core 8 microservices, Azure serverless :rag-architecture[RAG pipelines], :qlora[QLoRA 4-bit quantized adapters], and :jev-gate[sub-35ms AST code review gates]—documented with interactive 3D workbenches and verified holdout benchmarks."
              />
            </motion.div>

            {/* Specialization Summary Line (Unboxed Text) */}
            <motion.div
              custom={0.12}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="font-mono text-xs text-[#8B8F98] flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1"
            >
              <span className="text-[#F4F4F6] font-semibold">Focus:</span>
              <span>QLoRA &amp; PEFT</span>
              <span aria-hidden="true">·</span>
              <span>Agentic Workflows &amp; RAG</span>
              <span aria-hidden="true">·</span>
              <span>.NET Core 8 &amp; FastAPI</span>
              <span aria-hidden="true">·</span>
              <span>Azure Functions &amp; Cosmos DB</span>
            </motion.div>

            {/* Primary Action Controls (Minimum 48px Touch Target on Mobile & Desktop) */}
            <motion.div
              custom={0.18}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm"
            >
              <a
                href="/#projects"
                onClick={(e) => {
                  e.preventDefault();
                  onExploreProjects();
                }}
                className="group swift-spring-btn min-h-12 px-5 py-3 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/95 shadow-lg shadow-[#7CFF6B]/10 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SwiftRollLabel
                  label="Explore 9 Case Studies"
                  hoverLabel="View Engineering Work"
                />
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>

              {onOpenResume && (
                <button
                  type="button"
                  onClick={onOpenResume}
                  aria-label="View and download Vignesh K N Resume (PDF)"
                  className="group swift-spring-btn min-h-12 px-4 py-3 rounded-xl border border-white/[0.14] bg-[#101216] hover:border-[#7CFF6B]/50 text-[#F4F4F6] flex items-center gap-2 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-[#7CFF6B]" />
                  <SwiftRollLabel
                    label="Download Resume"
                    hoverLabel="Inspect & Export PDF"
                  />
                </button>
              )}

              <a
                href="/projects/house-price"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectProject) {
                    onSelectProject('house-price');
                  } else {
                    window.location.hash = '#project-house-price';
                  }
                }}
                className="group swift-spring-btn min-h-12 px-4 py-3 rounded-xl border border-white/[0.12] bg-[#101216] hover:border-[#7CFF6B]/50 text-[#F4F4F6] flex items-center gap-2 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#7CFF6B]" />
                <SwiftRollLabel
                  label="3D House Price Lab"
                  hoverLabel="Launch 3D Surface + SHAP"
                />
              </a>

              {onOpenVero && (
                <button
                  type="button"
                  onClick={onOpenVero}
                  title="Open Vero PR Engine (https://vero-silk-delta.vercel.app/) in a new tab"
                  className="group swift-spring-btn min-h-12 px-4 py-3 rounded-xl border border-white/[0.12] bg-[#101216] hover:border-[#7CFF6B]/50 text-[#F4F4F6] flex items-center gap-2 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <GitPullRequest className="w-4 h-4 text-[#7CFF6B]" />
                  <SwiftRollLabel
                    label="Vero PR Engine"
                    hoverLabel="Open Live Vero App"
                  />
                  <ExternalLink className="w-3.5 h-3.5 text-[#8B8F98] group-hover:text-[#7CFF6B] transition-colors" />
                </button>
              )}

              {onOpenCommandPalette && (
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  aria-label="Open command palette (Cmd+K)"
                  className="swift-spring-btn min-h-12 min-w-12 px-3.5 py-3 rounded-xl border border-white/[0.08] bg-[#101216] text-[#8B8F98] hover:text-[#F4F4F6] hover:border-white/20 flex items-center justify-center gap-1.5 font-mono text-xs whitespace-nowrap shrink-0 cursor-pointer"
                  title="Quick search & navigation (Cmd+K)"
                >
                  <Search className="w-3.5 h-3.5 text-[#7CFF6B]" />
                  <span>⌘K</span>
                </button>
              )}
            </motion.div>

            {/* Secondary Profile & Contact Links */}
            <motion.div
              custom={0.24}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#8B8F98] font-medium"
            >
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Vignesh K N on GitHub (KN-Vignesh)"
                className="min-h-11 sm:min-h-0 inline-flex items-center gap-1 hover:text-[#F4F4F6] transition-colors whitespace-nowrap"
              >
                <span>GitHub (KN-Vignesh)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Vignesh K N on LinkedIn"
                className="min-h-11 sm:min-h-0 inline-flex items-center gap-1 hover:text-[#F4F4F6] transition-colors whitespace-nowrap"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                aria-label={`Email Vignesh K N at ${PERSONAL_INFO.email}`}
                className="min-h-11 sm:min-h-0 inline-flex items-center hover:text-[#F4F4F6] transition-colors whitespace-nowrap"
              >
                {PERSONAL_INFO.email}
              </a>
            </motion.div>
          </div>

          {/* Right Column: Lazy-Loaded 3D Centerpiece with Instant Static Skeleton Fallback */}
          <motion.div
            style={{ y: stageParallaxY }}
            custom={0.1}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={entranceVariants}
            className="lg:col-span-6 flex flex-col justify-center gap-2.5 self-center w-full"
          >
            {/* Segmented Mode Switcher with Keyboard Arrow Support */}
            <div
              role="tablist"
              aria-label="Hero Interactive Stage"
              onKeyDown={handleTabKeyDown}
              className="flex items-center p-1 rounded-xl bg-[#101216] border border-white/[0.08] text-xs overflow-x-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={heroTab === '3d-tensor'}
                onClick={() => setHeroTab('3d-tensor')}
                className={`flex-1 min-h-11 sm:min-h-10 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold whitespace-nowrap ${
                  heroTab === '3d-tensor'
                    ? 'bg-[#08090B] text-[#7CFF6B] border border-white/[0.1] shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F4F4F6]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>3D QLoRA Tensors</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={heroTab === '3d-core'}
                onClick={() => setHeroTab('3d-core')}
                className={`flex-1 min-h-11 sm:min-h-10 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold whitespace-nowrap ${
                  heroTab === '3d-core'
                    ? 'bg-[#08090B] text-[#7CFF6B] border border-white/[0.1] shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F4F4F6]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Attention Graph</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={heroTab === 'pr-playground'}
                onClick={() => setHeroTab('pr-playground')}
                className={`flex-1 min-h-11 sm:min-h-10 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold whitespace-nowrap ${
                  heroTab === 'pr-playground'
                    ? 'bg-[#08090B] text-[#7CFF6B] border border-white/[0.1] shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F4F4F6]'
                }`}
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>PR Gate Sandbox</span>
              </button>
            </div>

            {/* Active Interactive Stage with Non-Blocking Suspense Fallback */}
            <Suspense
              fallback={
                <div className="w-full h-[380px] rounded-2xl border border-white/[0.08] bg-[#101216] p-6 flex flex-col items-center justify-center text-center font-mono space-y-2">
                  <div className="text-xs text-[#7CFF6B] font-bold">
                    INITIALIZING 3D TENSOR STAGE
                  </div>
                  <div className="text-[11px] text-[#8B8F98]">
                    4-Bit NF4 Quantization · Rank r=16 Adapter Lattice
                  </div>
                </div>
              }
            >
              {heroTab === '3d-tensor' && <LazyModelVisualizer3D />}
              {heroTab === '3d-core' && <LazyNeuralCore3D />}
              {heroTab === 'pr-playground' && (
                <HeroPRPlayground onOpenFullVero={onOpenVero} />
              )}
            </Suspense>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Engineering Evidence Strip Below Split */}
        <motion.div
          custom={0.3}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={entranceVariants}
          className="grid grid-cols-2 md:grid-cols-4 mt-14 lg:mt-20 border-y border-white/[0.08] divide-y md:divide-y-0 md:divide-x divide-white/[0.08]"
        >
          <div className="py-6 px-4 sm:px-6">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F4F4F6] tabular-nums">
              4+ Years
            </div>
            <div className="text-xs text-[#8B8F98] mt-1">
              Enterprise .NET 8, Azure Serverless &amp; Production AI
            </div>
          </div>
          <div className="py-6 px-4 sm:px-6">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#7CFF6B] tabular-nums">
              9 Case Studies
            </div>
            <div className="text-xs text-[#8B8F98] mt-1">
              Interactive 3D Workbenches &amp; Holdout Benchmarks
            </div>
          </div>
          <div className="py-6 px-4 sm:px-6">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F4F4F6] tabular-nums">
              &lt;35ms
            </div>
            <div className="text-xs text-[#8B8F98] mt-1">
              Vero AST + TypeSafe Jev PR Gate Latency
            </div>
          </div>
          <div className="py-6 px-4 sm:px-6">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F4F4F6] tabular-nums">
              R² = 0.898
            </div>
            <div className="text-xs text-[#8B8F98] mt-1">
              Stacking Ensemble Holdout Accuracy (1,458 Homes)
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
