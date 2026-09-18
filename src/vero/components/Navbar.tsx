import React from 'react';
import {
  GitPullRequest,
  BookOpen,
  BarChart3,
  Cpu,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Key,
  ArrowLeft,
} from 'lucide-react';

export type NavTab = 'analyzer' | 'journey' | 'evaluation' | 'architecture' | 'portfolio';

export interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSettings?: () => void;
  onBackToPortfolio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onBackToPortfolio,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#24272D] bg-[#08090B]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Side: Return to Portfolio & Brand */}
        <div className="flex items-center gap-3">
          {onBackToPortfolio && (
            <button
              id="vero-back-to-portfolio"
              type="button"
              onClick={onBackToPortfolio}
              className="group flex items-center gap-2 rounded-lg border border-[#24272D] bg-[#101216] px-3 py-1.5 text-xs font-mono text-[#8B8F98] hover:border-[#7CFF6B]/50 hover:text-[#7CFF6B] hover:bg-[#15181D] transition-colors"
              title="Return to Main Portfolio"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="inline sm:hidden">BACK</span>
              <span className="hidden sm:inline">PORTFOLIO</span>
            </button>
          )}

          <div
            onClick={() => setActiveTab('analyzer')}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7CFF6B]/15 border border-[#7CFF6B]/30 text-[#7CFF6B]">
              <GitPullRequest className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-[#F2F2F2] font-mono text-sm">
                  VERO
                </span>
                <span className="rounded border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-1.5 py-0.5 text-[10px] font-mono text-[#7CFF6B]">
                  LIVE ENGINE
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-mono text-[#8B8F98]">
                Deterministic Static Analysis + Probabilistic Jev Signal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <button
            id="nav-tab-analyzer"
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              activeTab === 'analyzer'
                ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30 font-semibold'
                : 'text-[#8B8F98] hover:bg-[#15181D] hover:text-[#F2F2F2] border border-transparent'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            PR ANALYZER
          </button>
          <button
            id="nav-tab-journey"
            onClick={() => setActiveTab('journey')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              activeTab === 'journey'
                ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30 font-semibold'
                : 'text-[#8B8F98] hover:bg-[#15181D] hover:text-[#F2F2F2] border border-transparent'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            JOURNEY (11 CH)
          </button>
          <button
            id="nav-tab-evaluation"
            onClick={() => setActiveTab('evaluation')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              activeTab === 'evaluation'
                ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30 font-semibold'
                : 'text-[#8B8F98] hover:bg-[#15181D] hover:text-[#F2F2F2] border border-transparent'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            BENCHMARKS
          </button>
          <button
            id="nav-tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              activeTab === 'architecture'
                ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30 font-semibold'
                : 'text-[#8B8F98] hover:bg-[#15181D] hover:text-[#F2F2F2] border border-transparent'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            JEV ARCHITECTURE
          </button>
          <button
            id="nav-tab-portfolio"
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              activeTab === 'portfolio'
                ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30 font-semibold'
                : 'text-[#8B8F98] hover:bg-[#15181D] hover:text-[#F2F2F2] border border-transparent'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            SYSTEM SPECS
          </button>
        </nav>

        {/* Settings & External Links */}
        <div className="flex items-center gap-2 text-xs">
          {onOpenSettings && (
            <button
              id="navbar-open-token-settings"
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 rounded-lg border border-[#24272D] bg-[#101216] px-2.5 py-1.5 font-mono text-[#8B8F98] hover:border-[#7CFF6B]/40 hover:text-[#7CFF6B] transition-colors"
              title="Configure GitHub Token & TypeSafe API Key"
            >
              <Key className="h-3.5 w-3.5 text-[#7CFF6B]" />
              <span className="hidden sm:inline">KEYS & TOKENS</span>
            </button>
          )}
          <a
            id="vero-github-repo-link"
            href="https://github.com/KN-Vignesh/VERO"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#24272D] bg-[#101216] px-3 py-1.5 font-mono text-[#8B8F98] hover:border-[#24272D]/80 hover:text-[#F2F2F2] transition-colors"
          >
            <span className="hidden sm:inline">GITHUB</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#5A5E67]" />
          </a>
        </div>
      </div>

      {/* Mobile Navigation Tabs Bar */}
      <div className="flex border-t border-[#24272D] px-2 py-1.5 md:hidden overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-mono ${
            activeTab === 'analyzer'
              ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30'
              : 'text-[#8B8F98]'
          }`}
        >
          ANALYZER
        </button>
        <button
          onClick={() => setActiveTab('journey')}
          className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-mono ${
            activeTab === 'journey'
              ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30'
              : 'text-[#8B8F98]'
          }`}
        >
          JOURNEY (11 CH)
        </button>
        <button
          onClick={() => setActiveTab('evaluation')}
          className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-mono ${
            activeTab === 'evaluation'
              ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30'
              : 'text-[#8B8F98]'
          }`}
        >
          BENCHMARKS
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-mono ${
            activeTab === 'architecture'
              ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30'
              : 'text-[#8B8F98]'
          }`}
        >
          JEV ARCHITECTURE
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-mono ${
            activeTab === 'portfolio'
              ? 'bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30'
              : 'text-[#8B8F98]'
          }`}
        >
          SPECS
        </button>
      </div>
    </header>
  );
};
