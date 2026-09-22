import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Menu, X, ArrowUpRight, FileDown, GitPullRequest } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate?: (sectionId: string) => void;
  onOpenResume?: () => void;
  onOpenVero?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate, onOpenResume, onOpenVero }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'PROJECTS', href: '#projects', id: 'projects' },
    { label: 'SYSTEM', href: '#engineering-system', id: 'engineering-system' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'AI LAB', href: '#ai-lab', id: 'ai-lab' },
    { label: 'STACK', href: '#stack', id: 'stack' },
    { label: 'EXPERIENCE', href: '#experience', id: 'experience' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090B]/90 backdrop-blur-md border-b border-[#24272D] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Status */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 group focus:outline-none focus:ring-1 focus:ring-[#7CFF6B] rounded px-1"
          >
            <div className="w-2.5 h-2.5 rounded-sm bg-[#7CFF6B] group-hover:scale-125 transition-transform" />
            <span className="font-mono text-sm tracking-wider font-bold text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
              KN.VIGNESH
            </span>
          </a>

          {/* Professional Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#101216] border border-[#24272D] font-mono text-[11px] text-[#8B8F98]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B]"></span>
            <span className="text-[#D1D5DB]">AI SOFTWARE ENGINEER</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
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
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#7CFF6B] bg-[#15181D] border border-[#24272D]'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#101216]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* External Links & Resume */}
        <div className="hidden sm:flex items-center gap-2.5 font-mono text-xs">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B8F98] hover:text-[#7CFF6B] flex items-center gap-1 px-2.5 py-1 rounded border border-transparent hover:border-[#24272D] transition-colors"
          >
            <span>GITHUB</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B8F98] hover:text-[#6EA8FE] flex items-center gap-1 px-2.5 py-1 rounded border border-transparent hover:border-[#24272D] transition-colors"
          >
            <span>LINKEDIN</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* VERO Live Engine Button */}
          {onOpenVero && (
            <button
              id="nav-launch-vero-button"
              onClick={onOpenVero}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#15181D] hover:bg-[#24272D] border border-[#7CFF6B]/50 text-[#7CFF6B] font-bold transition-all shadow-sm hover:shadow-[#7CFF6B]/15 cursor-pointer"
              title="Launch Live VERO Pull Request Intelligence Engine"
            >
              <GitPullRequest className="w-3.5 h-3.5 text-[#7CFF6B]" />
              <span>VERO ENGINE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
            </button>
          )}

          {/* Download Resume Button */}
          {onOpenResume ? (
            <button
              onClick={onOpenResume}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#7CFF6B]/10 hover:bg-[#7CFF6B]/20 border border-[#7CFF6B]/40 text-[#7CFF6B] font-bold transition-all shadow-sm hover:shadow-[#7CFF6B]/15 cursor-pointer"
              title="View & Download Resume PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>RESUME</span>
            </button>
          ) : (
            <a
              href="/vignesh-k-n-resume.pdf"
              download="Vignesh_K_N_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#7CFF6B]/10 hover:bg-[#7CFF6B]/20 border border-[#7CFF6B]/40 text-[#7CFF6B] font-bold transition-all"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>RESUME</span>
            </a>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded border border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101216] border-b border-[#24272D] px-6 py-5 space-y-3 font-mono text-sm">
          {navLinks.map((link) => (
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
              className="block py-2 text-[#8B8F98] hover:text-[#7CFF6B] border-b border-[#24272D]/50 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-3 text-xs">
            {onOpenVero && (
              <button
                id="mobile-launch-vero-button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVero();
                }}
                className="w-full py-2.5 px-3 rounded bg-[#15181D] border border-[#7CFF6B]/60 text-[#7CFF6B] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <GitPullRequest className="w-4 h-4 text-[#7CFF6B]" />
                <span>LAUNCH VERO AI PR ENGINE</span>
                <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenResume) onOpenResume();
              }}
              className="w-full py-2.5 px-3 rounded bg-[#7CFF6B]/15 border border-[#7CFF6B]/50 text-[#7CFF6B] font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>DOWNLOAD RESUME (PDF)</span>
            </button>
            <div className="flex gap-4">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7CFF6B] flex items-center gap-1"
              >
                GITHUB ↗
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6EA8FE] flex items-center gap-1"
              >
                LINKEDIN ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
