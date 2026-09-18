import React from 'react';
import { ArrowDown, ExternalLink, Activity, Terminal, ShieldCheck, Cpu, FileDown, GitPullRequest, ArrowRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { NeuralCore3D } from './NeuralCore3D';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onExploreSystem: () => void;
  onOpenResume?: () => void;
  onOpenVero?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreProjects, onExploreSystem, onOpenResume, onOpenVero }) => {
  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden tech-grid">
      {/* Top subtle glow / radial backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7CFF6B]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Technical Typography & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* System Status Banner */}
            <div className="inline-flex items-center space-x-3 px-3 py-1.5 rounded border border-[#24272D] bg-[#101216]/90 backdrop-blur-sm font-mono text-xs text-[#8B8F98]">
              <span className="flex items-center gap-1.5 text-[#7CFF6B] font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CFF6B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7CFF6B]"></span>
                </span>
                SYS.ONLINE
              </span>
              <span className="text-[#24272D]">|</span>
              <span className="tracking-wide">AI ENGINEERING LAB v2.4</span>
              <span className="text-[#24272D]">|</span>
              <span className="text-[#6EA8FE] font-mono">BENGALURU, IN</span>
            </div>

            {/* Main Header & Name */}
            <div className="space-y-2">
              <div className="font-mono text-xs tracking-widest text-[#7CFF6B] uppercase font-semibold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>{PERSONAL_INFO.subtitle}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F2F2F2]">
                {PERSONAL_INFO.name}
              </h1>

              <div className="text-xl sm:text-2xl font-mono text-[#8B8F98] font-medium pt-1">
                {PERSONAL_INFO.title}
              </div>
            </div>

            {/* Core Mission Statement */}
            <p className="text-lg sm:text-xl text-[#F2F2F2] font-normal leading-relaxed border-l-2 border-[#7CFF6B] pl-4">
              "{PERSONAL_INFO.heroStatement}"
            </p>

            {/* Supporting Reality */}
            <p className="text-sm sm:text-base text-[#8B8F98] max-w-2xl leading-relaxed">
              {PERSONAL_INFO.supportingText}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 font-mono text-xs">
              <button
                onClick={onExploreProjects}
                className="px-5 py-3 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-all shadow-md shadow-[#7CFF6B]/15 flex items-center space-x-2 group cursor-pointer"
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {onOpenResume ? (
                <button
                  onClick={onOpenResume}
                  className="px-5 py-3 rounded border border-[#7CFF6B]/60 bg-[#7CFF6B]/10 text-[#7CFF6B] hover:bg-[#7CFF6B]/20 font-bold transition-all shadow-sm shadow-[#7CFF6B]/10 flex items-center space-x-2 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOWNLOAD RESUME</span>
                </button>
              ) : (
                <a
                  href="/vignesh-k-n-resume.pdf"
                  download="Vignesh_K_N_Resume.pdf"
                  className="px-5 py-3 rounded border border-[#7CFF6B]/60 bg-[#7CFF6B]/10 text-[#7CFF6B] hover:bg-[#7CFF6B]/20 font-bold transition-all shadow-sm shadow-[#7CFF6B]/10 flex items-center space-x-2"
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOWNLOAD RESUME</span>
                </a>
              )}

              <a
                href={PERSONAL_INFO.projectsRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded border border-[#24272D] bg-[#101216] text-[#F2F2F2] hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-colors flex items-center space-x-2"
              >
                <span>SOURCE REPO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded border border-[#6EA8FE]/30 bg-[#6EA8FE]/5 text-[#6EA8FE] hover:border-[#6EA8FE] transition-colors flex items-center space-x-2"
              >
                <span>LINKEDIN</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onOpenVero && (
                <button
                  id="hero-launch-vero-button"
                  onClick={onOpenVero}
                  className="px-5 py-3 rounded border border-[#7CFF6B]/50 bg-[#15181D] hover:bg-[#24272D] text-[#7CFF6B] font-bold transition-all shadow-md shadow-[#7CFF6B]/10 flex items-center space-x-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse" />
                  <span>TRY LIVE VERO PR ENGINE</span>
                </button>
              )}
            </div>

            {/* Interactive VERO Feature Callout */}
            {onOpenVero && (
              <div
                id="hero-vero-callout"
                onClick={onOpenVero}
                className="p-3.5 rounded-xl border border-[#7CFF6B]/30 bg-[#101216]/90 hover:border-[#7CFF6B] hover:bg-[#15181D] transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-[#7CFF6B]/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7CFF6B]/15 border border-[#7CFF6B]/30 text-[#7CFF6B]">
                    <GitPullRequest className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F2F2F2]">
                      <span>FLAGSHIP LIVE APPLICATION: VERO</span>
                      <span className="rounded bg-[#7CFF6B]/15 border border-[#7CFF6B]/40 px-1.5 py-0.2 text-[10px] text-[#7CFF6B]">
                        INTERACTIVE ENGINE
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#8B8F98]">
                      Deterministic SonarQube static gates + TypeSafe Jev structured signals for GitHub PRs.
                    </p>
                  </div>
                </div>
                <div className="font-mono text-xs text-[#7CFF6B] flex items-center gap-1 group-hover:translate-x-1 transition-transform pl-3">
                  <span className="hidden sm:inline">LAUNCH NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Technical Capability Badges */}
            <div className="pt-4 border-t border-[#24272D]/60 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-[#8B8F98]">
              <div className="flex items-center gap-1.5 p-2 rounded bg-[#101216]/50 border border-[#24272D]">
                <Cpu className="w-3.5 h-3.5 text-[#7CFF6B]" />
                <span>MODEL ENG</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-[#101216]/50 border border-[#24272D]">
                <Activity className="w-3.5 h-3.5 text-[#6EA8FE]" />
                <span>RAG / AGENTS</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-[#101216]/50 border border-[#24272D]">
                <Terminal className="w-3.5 h-3.5 text-[#FFB86B]" />
                <span>FASTAPI / DOCKER</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-[#101216]/50 border border-[#24272D]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7CFF6B]" />
                <span>PRODUCTION AI</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive AI Neural Core */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full relative rounded-xl border border-[#24272D] bg-[#101216]/80 p-2 overflow-hidden shadow-2xl shadow-black/60">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#7CFF6B]/60" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#7CFF6B]/60" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#7CFF6B]/60" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#7CFF6B]/60" />

              <NeuralCore3D />
            </div>

            {/* System Status Card underneath */}
            <div className="w-full mt-3 p-3 rounded-lg border border-[#24272D] bg-[#101216] font-mono text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                <span className="text-[#F2F2F2] font-semibold tracking-wider">SYSTEM STATUS: ONLINE</span>
              </div>
              <button
                onClick={onExploreSystem}
                className="text-[#7CFF6B] hover:underline text-[11px] flex items-center gap-1"
              >
                <span>VIEW PIPELINE</span>
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="w-full text-center pt-8 font-mono text-xs text-[#8B8F98] flex items-center justify-center gap-2">
        <span>SCROLL TO EXPLORE ARCHITECTURE</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#7CFF6B] animate-bounce" />
      </div>
    </section>
  );
};
