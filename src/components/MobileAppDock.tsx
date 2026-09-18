import React from 'react';
import { Home, FolderGit2, GitPullRequest, Cpu, FileText, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileAppDockProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
  onOpenVero: () => void;
}

export const MobileAppDock: React.FC<MobileAppDockProps> = ({
  activeSection,
  onNavigate,
  onOpenResume,
  onOpenVero,
}) => {
  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      const pwaBtn = document.getElementById('pwa-install-trigger-button');
      if (pwaBtn) pwaBtn.click();
    }
  };

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'vero', label: 'VERO', icon: GitPullRequest, isVero: true },
    { id: 'engineering-system', label: 'System', icon: Cpu },
  ];

  return (
    <nav
      id="mobile-bottom-app-dock"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0E12]/95 border-t border-[#24272D]/90 backdrop-blur-lg px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isVero ? false : activeSection === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-dock-${item.id}`}
              onClick={() => {
                if (item.isVero) {
                  onOpenVero();
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[46px] ${
                isActive
                  ? 'text-[#7CFF6B]'
                  : item.isVero
                  ? 'text-[#7CFF6B]/90 hover:text-[#7CFF6B]'
                  : 'text-[#8B8F98] hover:text-[#F2F2F2]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.isVero && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse ring-2 ring-[#0C0E12]" />
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-[#7CFF6B]" />
                )}
              </div>
              <span className="text-[10px] font-mono tracking-tight mt-1 font-medium">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Resume Quick Trigger */}
        <button
          id="mobile-dock-resume"
          onClick={onOpenResume}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-[#8B8F98] hover:text-[#F2F2F2] transition-all cursor-pointer min-h-[46px]"
        >
          <FileText className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-mono tracking-tight mt-1 font-medium">Resume</span>
        </button>

        {/* If not installed, show Install prompt tab in dock */}
        {!isInstalled && (
          <button
            id="mobile-dock-install"
            onClick={handleInstallClick}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-[#7CFF6B] bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 hover:bg-[#7CFF6B]/20 transition-all cursor-pointer min-h-[46px]"
            title="Install App"
          >
            <Smartphone className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-mono tracking-tight mt-1 font-bold">App</span>
          </button>
        )}
      </div>
    </nav>
  );
};
