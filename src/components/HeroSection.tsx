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
            
            {/* Clean Location & Focus Banner */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded border border-[#24272D] bg-[#101216] font-mono text-xs text-[#8B8F98]">
              <span className="flex items-center gap-1.5 text-[#7CFF6B] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7CFF6B]"></span>
                AVAILABLE FOR ROLES
              </span>
              <span className="text-[#24272D]">|</span>
              <span className="tracking-normal text-[#A1A7B5]">Bengaluru, India</span>
            </div>

            {/* Main Header & Name */}
            <div className="space-y-1.5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F2F2F2]">
                {PERSONAL_INFO.name}
              </h1>

              <div className="text-xl sm:text-2xl font-mono text-[#7CFF6B] font-medium">
                {PERSONAL_INFO.title}
              </div>
            </div>

            {/* Core Summary */}
            <p className="text-base sm:text-lg text-[#D1D5DB] leading-relaxed">
              {PERSONAL_INFO.supportingText}
            </p>

            {/* Action Buttons: Simplified to primary action + repository links */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <button
                onClick={onExploreProjects}
                className="px-5 py-2.5 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-all shadow-md shadow-[#7CFF6B]/15 flex items-center space-x-2 group cursor-pointer"
              >
                <span>VIEW PROJECTS</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <a
                href={PERSONAL_INFO.projectsRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded border border-[#24272D] bg-[#101216] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/50 transition-colors flex items-center space-x-1.5"
                title="GitHub Repositories"
              >
                <span>GITHUB REPOS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 text-[#8B8F98] hover:text-[#6EA8FE] transition-colors flex items-center space-x-1.5"
                title="LinkedIn Profile"
              >
                <span>LINKEDIN</span>
                <ExternalLink className="w-3 h-3" />
              </a>
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
