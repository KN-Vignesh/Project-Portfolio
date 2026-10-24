import React, { useState, useEffect } from 'react';
const Analytics = () => null;
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
import { CommandPalette } from './components/CommandPalette';
import { LiveAITrendsSection } from './components/LiveAITrendsSection';
import { Interactive3DProjectStage, ThreeDSceneType } from './components/Interactive3DProjectStage';
import { InspectSpecDrawer } from './components/InspectSpecDrawer';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileAppDock } from './components/MobileAppDock';
import { ProjectItem } from './types';
import { useProjects } from './hooks/useProjects';
import { resolveCanonicalProjectId } from './data/projectSource';

export const VERO_EXTERNAL_URL = 'https://vero-silk-delta.vercel.app/';

export function openExternalVero(): void {
  const anchor = document.createElement('a');
  anchor.href = VERO_EXTERNAL_URL;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [selectedSpecScene, setSelectedSpecScene] = useState<ThreeDSceneType | null>(null);
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();

  // Global shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check URL hash on initial load and navigation for direct project deep-linking or external VERO redirect
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === 'vero' || hash.startsWith('vero')) {
        setSelectedProjectId(null);
        window.history.replaceState(null, '', '#projects');
        openExternalVero();
        return;
      }
      
      const params = new URLSearchParams(window.location.search);
      const queryProject = params.get('project');

      if (hash.startsWith('project-') || queryProject) {
        const rawProjId = queryProject || hash.replace('project-', '');
        const canonicalId = resolveCanonicalProjectId(rawProjId);
        const exists = projects.find((p) => p.id === canonicalId || p.id === rawProjId);
        if (exists) {
          setSelectedProjectId(exists.id);
        } else if (projectsLoading) {
          setSelectedProjectId(canonicalId);
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
  }, [projects, projectsLoading]);

  // Update active section based on scroll position
  useEffect(() => {
    const sections = [
      'hero',
      'projects',
      '3d-workbench',
      'ai-trends',
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
  }, []);

  const handleNavigate = (sectionId: string) => {
    setSelectedProjectId(null);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
    openExternalVero();
  };

  const currentProject: ProjectItem | null =
    projects.find((p) => p.id === selectedProjectId) || null;

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
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Multi-Section Portfolio Experience with mobile dock clearance */}
      <main className="flex-grow pb-20 md:pb-0">
        {/* 01 / HERO */}
        <HeroSection
          onExploreProjects={() => handleNavigate('projects')}
          onExploreSystem={() => handleNavigate('engineering-system')}
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenVero={handleOpenVero}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* 02 / PROJECTS (EXPERIENCE INITIALLY) */}
        <ProjectsSection
          projects={projects}
          loading={projectsLoading}
          error={projectsError}
          onSelectProject={handleOpenProject}
          onOpenVero={handleOpenVero}
        />

        {/* 02.2 / INTERACTIVE 3D MULTI-SCENE EXPERIMENTATION WORKBENCH */}
        <section id="3d-workbench" className="py-24 lg:py-28 border-t border-white/[0.08] bg-[#08090B]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <Interactive3DProjectStage
              onInspectSpec={(scene) => setSelectedSpecScene(scene)}
            />
          </div>
        </section>

        {/* 02.5 / LIVE AUTOMATED AI RESEARCH & REPOSITORY TRENDS */}
        <LiveAITrendsSection />

        {/* 03 / ENGINEERING SYSTEM */}
        <EngineeringSystemSection
          onSelectProject={handleOpenProject}
        />

        {/* 04 / ABOUT */}
        <AboutSection />

        {/* 05 / AI LAB */}
        <AILabSection
          projects={projects}
          loading={projectsLoading}
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
        allProjects={projects}
        onClose={handleCloseProject}
        onSelectProject={handleOpenProject}
        onOpenVero={handleOpenVero}
      />

      {/* Full Curriculum Vitae Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        projects={projects}
        projectsLoading={projectsLoading}
      />

      {/* Global Command Palette Dialog */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectSection={handleNavigate}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenVero={handleOpenVero}
      />

      {/* Technical Slide-Over Specification Drawer */}
      <InspectSpecDrawer
        isOpen={Boolean(selectedSpecScene)}
        onClose={() => setSelectedSpecScene(null)}
        sceneType={selectedSpecScene}
      />

      {/* Gemini AI Assistant Floating Widget */}
      <GeminiAIAssistant />

      {/* Technical Minimal Footer */}
      <Footer />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
