import React, { useState, useEffect } from 'react';
import { Search, GitPullRequest, FileDown, Layers, Terminal, Sparkles, ExternalLink, X, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
  onOpenResume: () => void;
  onOpenVero: () => void;
}

interface CommandAction {
  id: string;
  title: string;
  subtitle: string;
  category: 'NAVIGATION' | 'ACTIONS' | 'SYSTEMS';
  icon: React.ComponentType<{ className?: string }>;
  handler: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSection,
  onOpenResume,
  onOpenVero
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape, focus input on open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions: CommandAction[] = [
    {
      id: 'nav-projects',
      title: 'Explore Engineering Projects',
      subtitle: 'Bento showcase: Vero Engine, QLoRA, RAG, and .NET Systems',
      category: 'NAVIGATION',
      icon: Layers,
      handler: () => {
        onSelectSection('projects');
        onClose();
      }
    },
    {
      id: 'open-vero',
      title: 'Launch Vero AI PR Review Workbench',
      subtitle: 'Deterministic AST Quality Gate + TypeSafe Jev System 1 Model',
      category: 'SYSTEMS',
      icon: GitPullRequest,
      handler: () => {
        onOpenVero();
        onClose();
      }
    },
    {
      id: 'download-resume',
      title: 'Download Curriculum Vitae (ATS PDF)',
      subtitle: 'Verified engineering experience (.NET 8, AI, Azure, LangChain)',
      category: 'ACTIONS',
      icon: FileDown,
      handler: () => {
        onOpenResume();
        onClose();
      }
    },
    {
      id: 'nav-architecture',
      title: 'Systems Architecture & Methodology',
      subtitle: '5-stage reproducible AI deployment pipeline',
      category: 'NAVIGATION',
      icon: Terminal,
      handler: () => {
        onSelectSection('engineering-system');
        onClose();
      }
    },
    {
      id: 'nav-trends',
      title: 'Live AI Research & Trending Models Feed',
      subtitle: 'Automated telemetry from Hugging Face & ArXiv',
      category: 'SYSTEMS',
      icon: Sparkles,
      handler: () => {
        onSelectSection('ai-trends');
        onClose();
      }
    },
    {
      id: 'nav-sonar',
      title: 'SonarCloud Quality Gate Telemetry',
      subtitle: 'Live passing badge (0 Bugs, A Reliability, 0 Security Hotspots)',
      category: 'SYSTEMS',
      icon: ShieldCheck,
      handler: () => {
        window.open('https://sonarcloud.io/dashboard?id=KN-Vignesh_Project-Portfolio', '_blank');
        onClose();
      }
    },
    {
      id: 'copy-email',
      title: 'Send Engineering Inquiry / Email',
      subtitle: PERSONAL_INFO.email,
      category: 'ACTIONS',
      icon: Mail,
      handler: () => {
        window.location.href = `mailto:${PERSONAL_INFO.email}`;
        onClose();
      }
    }
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        role="document"
        className="w-full max-w-2xl rounded-2xl border border-[#24272D] bg-[#101216] shadow-2xl overflow-hidden font-mono text-[#F2F2F2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#24272D] bg-[#08090B]">
          <Search className="w-4 h-4 text-[#7CFF6B] mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section... (e.g. Vero, Projects, Resume)"
            className="flex-1 bg-transparent text-sm text-[#F2F2F2] placeholder-[#8B8F98]/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#8B8F98] hover:text-[#F2F2F2] transition-colors"
            aria-label="Close Command Palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8B8F98]">
              No matching commands found for "{query}".
            </div>
          ) : (
            filtered.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={action.handler}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#15181D] transition-colors text-left group cursor-pointer border border-transparent hover:border-[#24272D]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#08090B] border border-[#24272D] group-hover:border-[#7CFF6B]/50 flex items-center justify-center text-[#8B8F98] group-hover:text-[#7CFF6B] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
                        {action.title}
                      </div>
                      <div className="text-[11px] text-[#8B8F98] line-clamp-1">
                        {action.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8B8F98] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard Footer Tip */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#24272D] bg-[#08090B] text-[10px] text-[#8B8F98]">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#101216] border border-[#24272D] text-[#F2F2F2]">ESC</kbd>
            <span>to exit</span>
          </div>
          <div>VIGNESH KN // SYSTEM COMMANDS</div>
        </div>
      </div>
    </div>
  );
};
