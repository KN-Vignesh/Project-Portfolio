import React, { useState } from 'react';
import { ArrowDown, ExternalLink, GitPullRequest, Layers, Cpu, ShieldCheck, Terminal, Search } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ModelVisualizer3D } from './ModelVisualizer3D';
import { HeroPRPlayground } from './HeroPRPlayground';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onExploreSystem: () => void;
  onOpenResume?: () => void;
  onOpenVero?: () => void;
  onOpenCommandPalette?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onExploreSystem,
  onOpenResume,
  onOpenVero,
  onOpenCommandPalette
}) => {
  const [heroTab, setHeroTab] = useState<'3d-model' | 'pr-playground'>('3d-model');

  return (
    <section id="hero" className="relative min-h-[90vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden tech-grid">
      {/* Subtle Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7CFF6B]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Direct Architectural Narrative */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Unboxed Metadata Strip (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#8B8F98]">
              <span className="flex items-center gap-1.5 text-[#7CFF6B] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#7CFF6B] animate-pulse" />
                AVAILABLE FOR ROLES
              </span>
              <span>·</span>
              <span>Bengaluru, India</span>
              <span>·</span>
              <span className="text-[#6EA8FE]">SonarCloud Gate: PASSING (A)</span>
            </div>

            {/* Name & Primary Role */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F2F2F2]">
                {PERSONAL_INFO.name}
              </h1>
              <div className="text-lg sm:text-xl font-mono text-[#7CFF6B] font-medium tracking-wide">
                {PERSONAL_INFO.title}
              </div>
            </div>

            {/* Focused 2-Sentence Value Proposition */}
            <p className="text-base text-[#D1D5DB] leading-relaxed max-w-xl">
              {PERSONAL_INFO.supportingText}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={onExploreProjects}
                className="px-5 py-2.5 rounded-lg bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-all shadow-md shadow-[#7CFF6B]/15 flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE BENTO PROJECTS</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              {onOpenVero && (
                <button
                  type="button"
                  onClick={onOpenVero}
                  className="px-4 py-2.5 rounded-lg border border-[#7CFF6B]/40 bg-[#7CFF6B]/10 text-[#7CFF6B] hover:bg-[#7CFF6B]/20 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>VERO ENGINE</span>
                </button>
              )}

              {onOpenCommandPalette && (
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="px-3 py-2.5 rounded-lg border border-[#24272D] bg-[#101216] text-[#8B8F98] hover:text-[#F2F2F2] hover:border-[#7CFF6B]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Press Cmd+K"
                >
                  <Search className="w-3.5 h-3.5 text-[#7CFF6B]" />
                  <span>CMD+K</span>
                </button>
              )}
            </div>

            {/* External Links */}
            <div className="flex items-center gap-4 pt-1 font-mono text-xs text-[#8B8F98]">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#7CFF6B] transition-colors flex items-center gap-1"
              >
                <span>GitHub Repos</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>·</span>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>·</span>
              <button
                type="button"
                onClick={onOpenResume}
                className="hover:text-[#7CFF6B] transition-colors cursor-pointer"
              >
                Curriculum Vitae
              </button>
            </div>

          </div>

          {/* Right Column: Interactive 3D Model Visualizer & PR Sandbox */}
          <div className="lg:col-span-6 space-y-3">
            {/* Segmented Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-[#08090B] border border-[#24272D] font-mono text-xs">
              <button
                type="button"
                onClick={() => setHeroTab('3d-model')}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-semibold ${
                  heroTab === '3d-model'
                    ? 'bg-[#101216] text-[#7CFF6B] border border-[#7CFF6B]/30 shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>3D TENSOR & QLORA</span>
              </button>

              <button
                type="button"
                onClick={() => setHeroTab('pr-playground')}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-semibold ${
                  heroTab === 'pr-playground'
                    ? 'bg-[#101216] text-[#7CFF6B] border border-[#7CFF6B]/30 shadow-sm'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>LIVE PR REVIEW PLAYGROUND</span>
              </button>
            </div>

            {/* Active Interactive Widget */}
            {heroTab === '3d-model' ? (
              <ModelVisualizer3D />
            ) : (
              <HeroPRPlayground onOpenFullVero={onOpenVero} />
            )}
          </div>

        </div>

        {/* Quantified Engineering KPI Strip (Full-width below hero split) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14 pt-6 border-t border-[#24272D] font-mono text-center">
          <div className="p-3 rounded-xl border border-[#24272D] bg-[#101216]/60">
            <div className="text-xl sm:text-2xl font-bold text-[#7CFF6B]">4+ YEARS</div>
            <div className="text-[11px] text-[#8B8F98] mt-0.5">Enterprise & AI Engineering</div>
          </div>
          <div className="p-3 rounded-xl border border-[#24272D] bg-[#101216]/60">
            <div className="text-xl sm:text-2xl font-bold text-[#F2F2F2]">6,000+</div>
            <div className="text-[11px] text-[#8B8F98] mt-0.5">Automated PAM Accounts</div>
          </div>
          <div className="p-3 rounded-xl border border-[#24272D] bg-[#101216]/60">
            <div className="text-xl sm:text-2xl font-bold text-[#6EA8FE]">0 BUGS · A</div>
            <div className="text-[11px] text-[#8B8F98] mt-0.5">SonarCloud Quality Gate</div>
          </div>
          <div className="p-3 rounded-xl border border-[#24272D] bg-[#101216]/60">
            <div className="text-xl sm:text-2xl font-bold text-[#7CFF6B]">&lt;35ms</div>
            <div className="text-[11px] text-[#8B8F98] mt-0.5">Vero PR Decision Latency</div>
          </div>
        </div>

      </div>
    </section>
  );
};
