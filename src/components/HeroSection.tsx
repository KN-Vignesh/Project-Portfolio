import React, { useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ExternalLink,
  GitPullRequest,
  Layers,
  Cpu,
  Search,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ModelVisualizer3D } from './ModelVisualizer3D';
import { NeuralCore3D } from './NeuralCore3D';
import { HeroPRPlayground } from './HeroPRPlayground';
import { SwiftRollLabel } from './ScrollReveal';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onExploreSystem: () => void;
  onOpenResume?: () => void;
  onOpenVero?: () => void;
  onOpenCommandPalette?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onOpenResume,
  onOpenVero,
  onOpenCommandPalette,
}) => {
  const [heroTab, setHeroTab] = useState<'3d-tensor' | '3d-core' | 'pr-playground'>('3d-tensor');
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const stageParallaxY = useTransform(
    scrollYProgress,
    [0, 0.25],
    prefersReducedMotion ? [0, 0] : [0, -28]
  );

  const entranceVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-32 pb-20 lg:pt-36 lg:pb-24 flex flex-col justify-between overflow-hidden tech-grid"
    >
      {/* Ambient Focal Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] bg-[#7CFF6B]/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 w-full z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-7">
            {/* Unboxed Metadata Strip (Zero-Pill Discipline) */}
            <motion.div
              custom={0}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="flex flex-wrap items-center gap-2.5 text-xs text-[#8B8F98] font-medium"
            >
              <span className="text-[#7CFF6B] font-semibold">
                Available for AI &amp; Full-Stack Roles
              </span>
              <span aria-hidden="true">·</span>
              <span>Bengaluru, India</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#D1D5DB]">
                SonarCloud Gate: Passing (A)
              </span>
            </motion.div>

            {/* Neo-Grotesque Display Headline */}
            <motion.div
              custom={0.08}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="space-y-3.5"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-[#8B8F98] tracking-wide">
                <span className="text-[#F2F2F2] font-semibold">{PERSONAL_INFO.name}</span>
                <span aria-hidden="true">·</span>
                <span>{PERSONAL_INFO.title}</span>
              </div>
              <h1 className="editorial-h1 font-bold text-[#F2F2F2]">
                I build AI systems. Explore the problems, experiments, and engineering behind them.
              </h1>
            </motion.div>

            {/* Readable 16px-18px Body Prose */}
            <motion.p
              custom={0.16}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="text-base sm:text-lg text-[#D1D5DB] leading-[1.6] max-w-[62ch]"
            >
              Engineering scalable .NET 8 backends, PEFT fine-tuned LLMs, and deterministic AST code security—each documented with interactive 3D experiments and verified benchmarks.
            </motion.p>

            {/* Primary Action Controls with Dual-Layer Text Roll */}
            <motion.div
              custom={0.24}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-sm"
            >
              <button
                type="button"
                onClick={onExploreProjects}
                className="group swift-spring-btn px-5 py-3 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/95 shadow-lg shadow-[#7CFF6B]/10 flex items-center gap-2 cursor-pointer"
              >
                <SwiftRollLabel
                  label="Explore 9 Systems"
                  hoverLabel="View Case Studies"
                />
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#project-house-price';
                }}
                className="group swift-spring-btn px-4 py-3 rounded-xl border border-white/[0.12] bg-[#101216] hover:border-[#7CFF6B]/50 text-[#F2F2F2] flex items-center gap-2 font-semibold cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#7CFF6B]" />
                <SwiftRollLabel
                  label="3D House Price Lab"
                  hoverLabel="Launch 3D Terrain"
                />
              </button>

              {onOpenVero && (
                <button
                  type="button"
                  onClick={onOpenVero}
                  className="group swift-spring-btn px-4 py-3 rounded-xl border border-white/[0.12] bg-[#101216] hover:border-[#7CFF6B]/50 text-[#F2F2F2] flex items-center gap-2 font-semibold cursor-pointer"
                >
                  <GitPullRequest className="w-4 h-4 text-[#7CFF6B]" />
                  <SwiftRollLabel
                    label="Vero PR Engine"
                    hoverLabel="Analyze GitHub PR"
                  />
                </button>
              )}

              {onOpenCommandPalette && (
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="swift-spring-btn px-3.5 py-3 rounded-xl border border-white/[0.08] bg-[#101216] text-[#8B8F98] hover:text-[#F2F2F2] hover:border-white/20 flex items-center gap-1.5 font-mono text-xs cursor-pointer"
                  title="Press Cmd+K"
                >
                  <Search className="w-3.5 h-3.5 text-[#7CFF6B]" />
                  <span>⌘K</span>
                </button>
              )}
            </motion.div>

            {/* Quiet External Links */}
            <motion.div
              custom={0.32}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={entranceVariants}
              className="flex items-center gap-4 pt-1 text-xs text-[#8B8F98] font-medium"
            >
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F2F2F2] transition-colors flex items-center gap-1"
              >
                <span>GitHub Repositories</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F2F2F2] transition-colors flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onOpenResume}
                className="hover:text-[#7CFF6B] transition-colors cursor-pointer"
              >
                Curriculum Vitae
              </button>
            </motion.div>
          </div>

          {/* Right Column: Scroll-Linked Interactive 3D Stage & PR Sandbox */}
          <motion.div
            style={{ y: stageParallaxY }}
            custom={0.14}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={entranceVariants}
            className="lg:col-span-6 space-y-3"
          >
            {/* Segmented Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-[#101216] border border-white/[0.08] text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setHeroTab('3d-tensor')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold whitespace-nowrap ${
                  heroTab === '3d-tensor'
                    ? 'bg-[#08090B] text-[#7CFF6B] border border-white/[0.1] shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>3D Tensors</span>
              </button>

              <button
                type="button"
                onClick={() => setHeroTab('3d-core')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold whitespace-nowrap ${
                  heroTab === '3d-core'
                    ? 'bg-[#08090B] text-[#7CFF6B] border border-white/[0.1] shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Neural Graph</span>
              </button>

              <button
                type="button"
                onClick={() => setHeroTab('pr-playground')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold whitespace-nowrap ${
                  heroTab === 'pr-playground'
                    ? 'bg-[#08090B] text-[#7CFF6B] border border-white/[0.1] shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>PR Sandbox</span>
              </button>
            </div>

            {/* Active Interactive Stage */}
            {heroTab === '3d-tensor' && <ModelVisualizer3D />}
            {heroTab === '3d-core' && <NeuralCore3D />}
            {heroTab === 'pr-playground' && (
              <HeroPRPlayground onOpenFullVero={onOpenVero} />
            )}
          </motion.div>
        </div>

        {/* Hairlined 4-Column Trust & Engineering KPI Strip (.dx-trust pattern) */}
        <motion.div
          custom={0.38}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={entranceVariants}
          className="grid grid-cols-2 md:grid-cols-4 mt-16 lg:mt-20 border-y border-white/[0.08] divide-y md:divide-y-0 md:divide-x divide-white/[0.08]"
        >
          <div className="py-6 px-4 sm:px-6">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F2F2F2] tabular-nums">
              4+ Years
            </div>
            <div className="text-xs text-[#8B8F98] mt-1">
              Enterprise .NET &amp; AI Systems Engineering
            </div>
          </div>
          <div className="py-6 px-4 sm:px-6">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#7CFF6B] tabular-nums">
              9 Systems
            </div>
            <div className="text-xs text-[#8B8F98] mt-1">
              Interactive 3D &amp; ML Production Workbenches
            </div>
          </div>
          <div className="py-6 px-4 sm:px-6">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F2F2F2] tabular-nums">
              &lt;35ms
            </div>
            <div className="text-xs text-[#8B8F98] mt-1">
              Deterministic AST &amp; Jev Gate Latency
            </div>
          </div>
          <div className="py-6 px-4 sm:px-6">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F2F2F2] tabular-nums">
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
