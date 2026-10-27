import React from 'react';
import { ExternalLink, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#08090B] py-12 font-mono text-xs text-[#8B8F98]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Identity & Role */}
        <div className="space-y-1 text-center md:text-left">
          <div className="font-bold text-[#F2F2F2] flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span>{PERSONAL_INFO.name}</span>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <span className="text-[#7CFF6B]">{PERSONAL_INFO.title}</span>
          </div>
          <div className="text-[11px] text-[#8B8F98]">
            Production LLMs · PEFT Fine-Tuning · Cloud &amp; .NET 8 Architecture
          </div>
        </div>

        {/* Crawlable Navigation & External Links (48px mobile touch targets) */}
        <nav
          aria-label="Footer and social links"
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px]"
        >
          <a
            href="#projects"
            aria-label="Jump to engineering case studies section"
            className="min-h-12 sm:min-h-10 px-2 inline-flex items-center hover:text-[#F2F2F2] transition-colors"
          >
            Projects
          </a>

          <a
            href="https://vero-silk-delta.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open live Vero PR Review Engine in a new tab"
            className="min-h-12 sm:min-h-10 px-2 text-[#7CFF6B] hover:underline inline-flex items-center gap-1"
          >
            <span>Vero PR Engine</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Vignesh K N on GitHub"
            className="min-h-12 sm:min-h-10 px-2 hover:text-[#7CFF6B] transition-colors inline-flex items-center gap-1"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Vignesh K N on LinkedIn"
            className="min-h-12 sm:min-h-10 px-2 hover:text-[#6EA8FE] transition-colors inline-flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            aria-label={`Send email to ${PERSONAL_INFO.email}`}
            className="min-h-12 sm:min-h-10 px-2 inline-flex items-center hover:text-[#F2F2F2] transition-colors"
          >
            Email
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            className="min-h-12 min-w-12 sm:min-h-10 px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-[#7CFF6B] text-[#8B8F98] hover:text-[#7CFF6B] transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
            title="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </nav>

        {/* Copyright */}
        <div className="text-[11px] text-[#8B8F98] text-center md:text-right">
          © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
