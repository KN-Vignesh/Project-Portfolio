import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Menu, X, ArrowUpRight, FileDown, GitPullRequest } from 'lucide-react';
import { SwiftRollLabel } from './ScrollReveal';

interface NavigationProps {
  activeSection: string;
  onNavigate?: (sectionId: string) => void;
  onOpenResume?: () => void;
  onOpenVero?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  onOpenResume,
  onOpenVero,
  onOpenCommandPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 32);
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        docHeight > 0 ? Math.min(100, Math.max(0, (y / docHeight) * 100)) : 0
      );
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Consolidated 5-anchor editorial navigation (cosmos.studio pattern)
  const primaryNavLinks = [
    { label: 'Work', href: '#projects', id: 'projects', count: 9 },
    { label: '3D Lab', href: '#3d-workbench', id: '3d-workbench' },
    {
      label: 'Architecture',
      href: '#engineering-system',
      id: 'engineering-system',
      aliases: ['ai-trends', 'ai-lab', 'stack', 'about'],
    },
    {
      label: 'Experience',
      href: '#experience',
      id: 'experience',
      aliases: ['education'],
    },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const mobileNavLinks = [
    { label: 'Selected Work (9)', href: '#projects', id: 'projects' },
    { label: '3D Architecture Lab', href: '#3d-workbench', id: '3d-workbench' },
    { label: 'Systems & Methodology', href: '#engineering-system', id: 'engineering-system' },
    { label: 'AI Research & Stack', href: '#ai-lab', id: 'ai-lab' },
    { label: 'Work Experience', href: '#experience', id: 'experience' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const isLinkActive = (link: (typeof primaryNavLinks)[number]) => {
    if (activeSection === link.id) return true;
    if (link.aliases && link.aliases.includes(activeSection)) return true;
    return false;
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090B]/90 backdrop-blur-xl border-b border-white/[0.08] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Left Zone: Brand Wordmark & Quiet Unboxed Role */}
        <div className="flex items-center gap-4">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('hero');
            }}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7CFF6B] rounded px-1"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-[#7CFF6B] group-hover:scale-125 transition-transform" />
            <SwiftRollLabel
              label="Vignesh K N"
              hoverLabel="KN.VIGNESH"
              className="text-sm font-bold tracking-tight text-[#F2F2F2] group-hover:text-[#7CFF6B]"
            />
          </a>

          <span
            aria-hidden="true"
            className="hidden md:inline text-white/20 text-xs"
          >
            /
          </span>

          <span className="hidden md:inline text-xs text-[#8B8F98] font-medium">
            AI Software Engineer
          </span>
        </div>

        {/* Center Zone: 5 Editorial Navigation Links with Dual-Layer Text Roll */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {primaryNavLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <a
                key={link.id}
                id={`nav-link-${link.id}`}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate(link.id);
                  } else {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`group relative py-1 flex items-center gap-1 transition-colors cursor-pointer ${
                  active
                    ? 'text-[#F2F2F2]'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <SwiftRollLabel label={link.label} />
                {typeof link.count === 'number' && (
                  <sup className="font-mono text-[10px] text-[#7CFF6B] font-semibold -top-1.5">
                    {link.count}
                  </sup>
                )}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#7CFF6B] transition-transform duration-300 origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Right Zone: Focused Actions */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-[#8B8F98] hover:text-[#F2F2F2] flex items-center gap-1 px-2 py-1.5 transition-colors font-medium"
          >
            <SwiftRollLabel label="GitHub" />
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8B8F98] group-hover:text-[#7CFF6B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="swift-spring-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#101216] hover:bg-[#15181D] border border-white/[0.08] hover:border-white/20 text-[#8B8F98] hover:text-[#F2F2F2] font-mono text-[11px] cursor-pointer"
              title="Jump to any section or system (Cmd+K)"
            >
              <span className="text-[#7CFF6B]">⌘K</span>
              <span className="hidden xl:inline">Index</span>
            </button>
          )}

          {onOpenResume && (
            <button
              type="button"
              onClick={onOpenResume}
              className="group swift-spring-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101216] hover:bg-[#15181D] border border-white/[0.08] hover:border-white/20 text-[#F2F2F2] font-medium cursor-pointer"
              title="View & Download Curriculum Vitae"
            >
              <FileDown className="w-3.5 h-3.5 text-[#8B8F98] group-hover:text-[#7CFF6B] transition-colors" />
              <SwiftRollLabel label="Resume" />
            </button>
          )}

          {onOpenVero && (
            <button
              id="nav-launch-vero-button"
              type="button"
              onClick={onOpenVero}
              className="group swift-spring-btn flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#7CFF6B] text-[#08090B] font-semibold shadow-sm hover:bg-[#7CFF6B]/95 cursor-pointer"
              title="Launch Live VERO Pull Request Intelligence Engine"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <SwiftRollLabel label="Vero Engine" hoverLabel="Launch PR Lab" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg border border-white/[0.08] text-[#8B8F98] hover:text-[#F2F2F2] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Live 1px Scroll Progress Hairline */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[1px] bg-[#7CFF6B]/70 transition-[width] duration-150 ease-out pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101216]/95 backdrop-blur-xl border-b border-white/[0.08] px-6 py-5 space-y-2.5 text-sm">
          {mobileNavLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (onNavigate) {
                  onNavigate(link.id);
                } else {
                  const el = document.getElementById(link.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="block py-2 text-[#D1D5DB] hover:text-[#7CFF6B] border-b border-white/[0.06] font-medium cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2.5 text-xs">
            {onOpenVero && (
              <button
                id="mobile-launch-vero-button"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVero();
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-[#7CFF6B] text-[#08090B] font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <GitPullRequest className="w-4 h-4" />
                <span>Launch Vero PR Engine</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenResume) onOpenResume();
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-[#15181D] border border-white/[0.1] text-[#F2F2F2] font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-[#7CFF6B]" />
              <span>Download Resume (PDF)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
