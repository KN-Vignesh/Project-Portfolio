import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Menu, X, ArrowUpRight, FileDown, GitPullRequest } from 'lucide-react';
import { SwiftRollLabel } from './ScrollReveal';

interface NavigationProps {
  activeSection: string;
  isProjectRoute?: boolean;
  onNavigate?: (sectionId: string) => void;
  onOpenResume?: () => void;
  onOpenVero?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  isProjectRoute = false,
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
      setScrolled(y > 24);
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

  const primaryNavLinks = [
    { label: 'Work', href: '/#projects', id: 'projects', count: 9 },
    { label: '3D Lab', href: '/#3d-workbench', id: '3d-workbench' },
    {
      label: 'Capabilities',
      href: '/#stack',
      id: 'stack',
      aliases: ['ai-lab', 'ai-trends'],
    },
    {
      label: 'Approach',
      href: '/#engineering-system',
      id: 'engineering-system',
      aliases: ['about'],
    },
    {
      label: 'Experience',
      href: '/#experience',
      id: 'experience',
      aliases: ['education'],
    },
    { label: 'Contact', href: '/#contact', id: 'contact' },
  ];

  const isLinkActive = (link: (typeof primaryNavLinks)[number]) => {
    if (isProjectRoute && link.id === 'projects') return true;
    if (!isProjectRoute && activeSection === link.id) return true;
    if (!isProjectRoute && link.aliases && link.aliases.includes(activeSection))
      return true;
    return false;
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,padding,border-color] duration-200 ${
        scrolled || isProjectRoute
          ? 'bg-[#08090B]/92 backdrop-blur-xl border-b border-white/[0.08] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      {/* WCAG 2.2 AA Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#7CFF6B] focus:text-[#08090B] focus:font-bold focus:text-xs"
      >
        Skip to main content
      </a>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('hero');
          }}
          className="text-base font-bold tracking-tight text-[#F4F4F6] hover:text-[#7CFF6B] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFF6B] rounded px-1"
        >
          Vignesh K N
        </a>

        {/* Zone 2: Clean Single-Line Editorial Navigation Links */}
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
                aria-current={active ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate(link.id);
                  }
                }}
                className={`group relative py-1 flex items-center gap-1 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'text-[#F4F4F6]'
                    : 'text-[#8B8F98] hover:text-[#F4F4F6]'
                }`}
              >
                <SwiftRollLabel label={link.label} />
                {typeof link.count === 'number' && (
                  <sup className="font-mono text-[10px] text-[#7CFF6B] font-semibold -top-1.5 tabular-nums">
                    {link.count}
                  </sup>
                )}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#7CFF6B] transition-transform duration-200 origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Focused Actions */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs shrink-0">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open command palette (Cmd+K)"
              className="swift-spring-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#101216] hover:bg-[#15181D] border border-white/[0.08] hover:border-white/20 text-[#8B8F98] hover:text-[#F4F4F6] font-mono text-[11px] whitespace-nowrap shrink-0 cursor-pointer"
              title="Jump to any section or case study (Cmd+K)"
            >
              <span className="text-[#7CFF6B]">⌘K</span>
              <span className="hidden xl:inline">Index</span>
            </button>
          )}

          {onOpenResume && (
            <button
              type="button"
              onClick={onOpenResume}
              className="group swift-spring-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101216] hover:bg-[#15181D] border border-white/[0.08] hover:border-white/20 text-[#F4F4F6] font-medium whitespace-nowrap shrink-0 cursor-pointer"
              title="View & Download Curriculum Vitae (PDF)"
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
              className="group swift-spring-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#7CFF6B] text-[#08090B] font-semibold hover:bg-[#7CFF6B]/95 whitespace-nowrap shrink-0 cursor-pointer"
              title="Launch Live Vero Pull Request Intelligence Engine in a new tab"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <SwiftRollLabel label="Vero Engine" hoverLabel="Open Live App" />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          className="lg:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-white/[0.08] text-[#8B8F98] hover:text-[#F4F4F6] transition-colors"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Live 1px Scroll Progress Hairline */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[1px] bg-[#7CFF6B]/75 transition-[width] duration-150 ease-out pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Accessible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden bg-[#101216]/98 backdrop-blur-xl border-b border-white/[0.08] px-6 py-5 space-y-2 text-sm"
        >
          {primaryNavLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate(link.id);
                }}
                className={`flex items-center justify-between py-2.5 border-b border-white/[0.06] font-medium cursor-pointer ${
                  active ? 'text-[#7CFF6B]' : 'text-[#D1D5DB] hover:text-[#7CFF6B]'
                }`}
              >
                <span>{link.label}</span>
                {typeof link.count === 'number' && (
                  <span className="font-mono text-xs text-[#7CFF6B] tabular-nums">
                    {link.count} systems
                  </span>
                )}
              </a>
            );
          })}

          <div className="pt-3 flex flex-col gap-2.5 text-xs">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-lg bg-[#08090B] border border-white/[0.08] text-[#D1D5DB] font-medium flex items-center justify-between"
            >
              <span>GitHub Profile (KN-Vignesh)</span>
              <ArrowUpRight className="w-4 h-4 text-[#7CFF6B]" />
            </a>

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

            {onOpenResume && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-[#15181D] border border-white/[0.1] text-[#F4F4F6] font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-[#7CFF6B]" />
                <span>View &amp; Download Resume (PDF)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
