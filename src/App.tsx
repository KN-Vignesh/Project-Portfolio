import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass, FolderGit2 } from 'lucide-react';
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
import {
  Interactive3DProjectStage,
  ThreeDSceneType,
} from './components/Interactive3DProjectStage';
import { InspectSpecDrawer } from './components/InspectSpecDrawer';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileAppDock } from './components/MobileAppDock';
import { ProjectItem } from './types';
import { useProjects } from './hooks/useProjects';
import { resolveCanonicalProjectId } from './data/projectSource';
import { applyRouteMetadata } from './utils/seoMetadata';
import { NutshellProvider } from './components/Nutshell';

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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isNotFoundRoute, setIsNotFoundRoute] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] =
    useState<boolean>(false);
  const [selectedSpecScene, setSelectedSpecScene] =
    useState<ThreeDSceneType | null>(null);
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

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

  // Unified URL Router: supports clean History API paths (/projects/:id), legacy hashes (#project-:id), and 404 detection
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      const params = new URLSearchParams(window.location.search);
      const queryProject = params.get('project');

      // 1. External Vero redirect (#vero or /vero)
      if (
        hash === 'vero' ||
        hash.startsWith('vero') ||
        pathname === '/vero' ||
        pathname.startsWith('/vero/')
      ) {
        setSelectedProjectId(null);
        setIsNotFoundRoute(false);
        window.history.replaceState(null, '', '/#projects');
        openExternalVero();
        return;
      }

      // 2. Clean path route: /projects/:slug
      const pathProjectMatch = pathname.match(/^\/projects\/([^/]+)\/?$/);
      if (pathProjectMatch) {
        const rawSlug = decodeURIComponent(pathProjectMatch[1]);
        const canonicalId = resolveCanonicalProjectId(rawSlug);
        const exists = projects.find(
          (p) => p.id === canonicalId || p.id === rawSlug
        );
        if (exists) {
          setIsNotFoundRoute(false);
          setSelectedProjectId(exists.id);
        } else if (projectsLoading) {
          setIsNotFoundRoute(false);
          setSelectedProjectId(canonicalId);
        } else {
          setSelectedProjectId(null);
          setIsNotFoundRoute(true);
        }
        return;
      }

      // 3. Legacy hash route (#project-:id) or ?project=:id query parameter
      if (hash.startsWith('project-') || queryProject) {
        const rawProjId = queryProject || hash.replace('project-', '');
        const canonicalId = resolveCanonicalProjectId(rawProjId);
        const exists = projects.find(
          (p) => p.id === canonicalId || p.id === rawProjId
        );
        if (exists) {
          setIsNotFoundRoute(false);
          setSelectedProjectId(exists.id);
        } else if (projectsLoading) {
          setIsNotFoundRoute(false);
          setSelectedProjectId(canonicalId);
        } else {
          setSelectedProjectId(null);
          setIsNotFoundRoute(true);
        }
        return;
      }

      // 4. Unknown non-root path -> 404 Not Found state
      if (pathname !== '/' && pathname !== '/index.html') {
        setSelectedProjectId(null);
        setIsNotFoundRoute(true);
        return;
      }

      // 5. Standard home route + optional section anchor scroll
      setIsNotFoundRoute(false);
      setSelectedProjectId(null);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
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

  const currentProject: ProjectItem | null =
    projects.find((p) => p.id === selectedProjectId) || null;

  // Sync dynamic document title, description, canonical link, and OpenGraph tags
  useEffect(() => {
    applyRouteMetadata({
      project: currentProject,
      isNotFound: isNotFoundRoute,
    });
  }, [currentProject, isNotFoundRoute]);

  // Update active section based on scroll position
  useEffect(() => {
    const sections = [
      'hero',
      'projects',
      '3d-workbench',
      'engineering-system',
      'stack',
      'ai-lab',
      'about',
      'experience',
      'education',
      'ai-trends',
      'contact',
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
  }, [isNotFoundRoute]);

  const handleNavigate = (sectionId: string) => {
    setSelectedProjectId(null);
    setIsNotFoundRoute(false);
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', `/#${sectionId}`);
    } else {
      window.location.hash = `#${sectionId}`;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenProject = (projectId: string) => {
    const canonicalId = resolveCanonicalProjectId(projectId);
    setIsNotFoundRoute(false);
    setSelectedProjectId(canonicalId);
    window.history.pushState(
      { projectId: canonicalId },
      '',
      `/projects/${canonicalId}`
    );
  };

  const handleCloseProject = () => {
    setSelectedProjectId(null);
    setIsNotFoundRoute(false);
    window.history.pushState(null, '', '/#projects');
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenVero = () => {
    openExternalVero();
  };

  return (
    <NutshellProvider onSelectProject={handleOpenProject}>
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

        {/* Main Content Area with Skip-Link Target */}
        <main id="main-content" className="flex-grow pb-20 md:pb-0">
          {isNotFoundRoute ? (
            <section className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-10 py-28">
              <div className="max-w-xl w-full bg-[#101216] border border-white/[0.08] rounded-2xl p-8 sm:p-10 text-center space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B] mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider">
                    HTTP 404 · Route Not Found
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#F2F2F2]">
                    Requested Architecture Route Does Not Exist
                  </h1>
                  <p className="text-sm text-[#8B8F98] leading-relaxed">
                    The URL <code className="text-[#D1D5DB] font-mono">{window.location.pathname}</code> could not be matched to an active section or verified case study.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotFoundRoute(false);
                      window.history.pushState(null, '', '/');
                    }}
                    className="swift-spring-btn px-5 py-2.5 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Homepage</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('projects')}
                    className="swift-spring-btn px-5 py-2.5 rounded-xl border border-white/[0.1] bg-[#08090B] text-[#F2F2F2] hover:border-[#7CFF6B]/50 font-semibold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <FolderGit2 className="w-4 h-4 text-[#7CFF6B]" />
                    <span>Browse Case Studies</span>
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* 01 · HERO INTRODUCTION */}
              <HeroSection
                onExploreProjects={() => handleNavigate('projects')}
                onExploreSystem={() => handleNavigate('engineering-system')}
                onSelectProject={handleOpenProject}
                onOpenResume={() => setIsResumeOpen(true)}
                onOpenVero={handleOpenVero}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              />

              {/* 02 · FEATURED & SELECTED PROJECTS */}
              <ProjectsSection
                projects={projects}
                loading={projectsLoading}
                error={projectsError}
                onSelectProject={handleOpenProject}
                onOpenVero={handleOpenVero}
              />

              {/* 02.5 · INTERACTIVE 3D MULTI-SCENE EXPERIMENTATION WORKBENCH */}
              <section
                id="3d-workbench"
                className="py-24 lg:py-28 border-t border-white/[0.08] bg-[#08090B]"
              >
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
                  <Interactive3DProjectStage
                    onInspectSpec={(scene) => setSelectedSpecScene(scene)}
                  />
                </div>
              </section>

              {/* 03 · REPRODUCIBLE ENGINEERING LIFECYCLE */}
              <EngineeringSystemSection onSelectProject={handleOpenProject} />

              {/* 04 · TECHNICAL CAPABILITIES & ARCHITECTURAL STACK */}
              <StackSection />

              {/* 05 · AI LAB CONSTELLATION */}
              <AILabSection
                projects={projects}
                loading={projectsLoading}
                onSelectProject={handleOpenProject}
              />

              {/* 06 · SYSTEMS ENGINEERING APPROACH & PERSONAL INTRODUCTION */}
              <AboutSection />

              {/* 07 · PROFESSIONAL EXPERIENCE */}
              <ExperienceSection />

              {/* 08 · CREDENTIALS & SPECIALIZATION SCOPE */}
              <EducationCertificationsSection
                onOpenResume={() => setIsResumeOpen(true)}
              />

              {/* 09 · LIVE RESEARCH & REPOSITORY PULSE */}
              <LiveAITrendsSection />

              {/* 10 · CONTACT CALL TO ACTION */}
              <ContactSection onOpenResume={() => setIsResumeOpen(true)} />
            </>
          )}
        </main>

        {/* Mobile App Navigation Bottom Dock */}
        <MobileAppDock
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenVero={handleOpenVero}
        />

        {/* Full-Screen Case Study Detail Route View */}
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
    </NutshellProvider>
  );
}
