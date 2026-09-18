import React from 'react';
import { ExternalLink, Terminal, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#24272D] bg-[#08090B] py-12 font-mono text-xs text-[#8B8F98]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Identity & Status */}
        <div className="space-y-1 text-center md:text-left">
          <div className="font-bold text-[#F2F2F2] flex items-center justify-center md:justify-start gap-2">
            <span>{PERSONAL_INFO.name}</span>
            <span className="text-[#24272D]">|</span>
            <span className="text-[#7CFF6B]">{PERSONAL_INFO.title}</span>
          </div>
          <div className="text-[11px] text-[#8B8F98]">
            AI ENGINEERING / GENERATIVE AI / SOFTWARE
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-[11px]">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#7CFF6B] transition-colors flex items-center gap-1"
          >
            <span>GITHUB</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#6EA8FE] transition-colors flex items-center gap-1"
          >
            <span>LINKEDIN</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="hover:text-[#F2F2F2] transition-colors flex items-center gap-1"
          >
            <span>EMAIL</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={scrollToTop}
            className="p-1.5 rounded border border-[#24272D] hover:border-[#7CFF6B] text-[#8B8F98] hover:text-[#7CFF6B] transition-colors flex items-center gap-1 cursor-pointer"
            title="Back to Top"
          >
            <span>TOP</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[#8B8F98] text-center md:text-right">
          © 2026 VIGNESH K N. ALL RIGHTS RESERVED.
        </div>

      </div>
    </footer>
  );
};
