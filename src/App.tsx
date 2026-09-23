import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EngineeringSystemSection } from './components/EngineeringSystemSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AILabSection } from './components/AILabSection';
import { StackSection } from './components/StackSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationCertificationsSection } from './components/EducationCertificationsSection';
import { ContactSection } from './components/ContactSection';
import { GeminiAIAssistant } from './components/GeminiAIAssistant';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileAppDock } from './components/MobileAppDock';
import { PROJECTS } from './data/portfolioData';
import { ProjectItem } from './types';
import VeroApp from './vero/VeroApp';

export default function App() {
  const [currentView, setCurrentView] = useState<'portfolio' | 'vero'>('portfolio');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);

  // Check URL hash on initial load and navigation for direct project deep-linking or VERO engine
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === 'vero' || hash.startsWith('vero')) {
        setSelectedProjectId(null);
        setCurrentView('vero');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      setCurrentView('portfolio');
      
      if (hash.startsWith('project-')) {
        const projId = hash.replace('project-', '');
        const exists = PROJECTS.find((p) => p.id === projId);
        if (exists) {
          setSelectedProjectId(projId);
        } else {
          setSelectedProjectId(null);
        }
      } else {
        // Crucial fix: Close project modal whenever URL hash is not a project deep-link
        // This ensures mobile back button, URL editing, and dock navigation return cleanly to main page.
        setSelectedProjectId(null);
        if (hash) {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Update active section based on scroll position (when in portfolio view)
  useEffect(() => {
    if (currentView !== 'portfolio') return;

    const sections = [
      'hero',
      'projects',
      'engineering-system',
      'about',
      'ai-lab',
      'stack',
      'experience',
      'education',
      'contact'
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentView]);

  const handleNavigate = (sectionId: string) => {
    setSelectedProjectId(null);
    if (currentView !== 'portfolio') {
      setCurrentView('portfolio');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    window.location.hash = `#${sectionId}`;
  };

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    window.location.hash = `#project-${projectId}`;
  };

  const handleCloseProject = () => {
    setSelectedProjectId(null);
    if (window.location.hash.startsWith('#project-')) {
      if (window.history.length > 2) {
        window.history.back();
      } else {
        window.location.hash = '#projects';
      }
      setTimeout(() => {
        if (window.location.hash.startsWith('#project-')) {
          window.location.hash = '#projects';
        }
      }, 60);
    }
  };

  const handleOpenVero = () => {
    setCurrentView('vero');
    window.history.pushState(null, '', '#vero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortfolio = () => {
    setCurrentView('portfolio');
    window.history.pushState(null, '', '#projects');
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const currentProject: ProjectItem | null =
    PROJECTS.find((p) => p.id === selectedProjectId) || null;

  if (currentView === 'vero') {
    return (
      <div className="min-h-screen bg-[#08090B] text-[#F2F2F2] selection:bg-[#7CFF6B]/20 selection:text-[#7CFF6B]">
        <VeroApp onBackToPortfolio={handleBackToPortfolio} />
        <Analytics />
        <SpeedInsights />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F2F2F2] flex flex-col selection:bg-[#7CFF6B]/20 selection:text-[#7CFF6B]">
      {/* PWA Offline Status Banner */}
      <OfflineIndicator />

      {/* Persistent Technical Navigation Bar */}
      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenVero={handleOpenVero}
      />

      {/* Main Multi-Section Portfolio Experience with mobile dock clearance */}
      <main className="flex-grow pb-20 md:pb-0">
        {/* 01 / HERO */}
        <HeroSection
          onExploreProjects={() => handleNavigate('projects')}
          onExploreSystem={() => handleNavigate('engineering-system')}
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenVero={handleOpenVero}
        />

        {/* 02 / PROJECTS (EXPERIENCE INITIALLY) */}
        <ProjectsSection
          onSelectProject={handleOpenProject}
          onOpenVero={handleOpenVero}
        />

        {/* 03 / ENGINEERING SYSTEM */}
        <EngineeringSystemSection
          onSelectProject={handleOpenProject}
        />

        {/* 04 / ABOUT */}
        <AboutSection />

        {/* 05 / AI LAB */}
        <AILabSection
          onSelectProject={handleOpenProject}
        />

        {/* 06 / STACK */}
        <StackSection />

        {/* 07 / EXPERIENCE */}
        <ExperienceSection />

        {/* 08 / EDUCATION + CERTIFICATIONS */}
        <EducationCertificationsSection />

        {/* 09 / CONTACT */}
        <ContactSection />
      </main>

      {/* Mobile App Navigation Bottom Dock */}
      <MobileAppDock
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenVero={handleOpenVero}
      />

      {/* Standalone Project Detail View Modal */}
      <ProjectDetailModal
        project={currentProject}
        onClose={handleCloseProject}
        onSelectProject={handleOpenProject}
        onOpenVero={handleOpenVero}
      />

      {/* Full Curriculum Vitae Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Gemini AI Assistant Floating Widget */}
      <GeminiAIAssistant />

      {/* Technical Minimal Footer */}
      <Footer />

      {/* Vercel Web Analytics */}
      <Analytics />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
}
