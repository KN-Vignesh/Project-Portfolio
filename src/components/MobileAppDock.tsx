import React from 'react';
import { Home, FolderGit2, GitPullRequest, Cpu } from 'lucide-react';

interface MobileAppDockProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenResume?: () => void;
  onOpenVero: () => void;
}

export const MobileAppDock: React.FC<MobileAppDockProps> = ({
  activeSection,
  onNavigate,
  onOpenVero,
}) => {
  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'vero', label: 'Vero Engine', icon: GitPullRequest, isVero: true },
    { id: 'engineering-system', label: 'System', icon: Cpu },
  ];

  return (
    <nav
      id="mobile-bottom-app-dock"
      aria-label="Mobile Quick Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0E12]/95 border-t border-white/[0.08] backdrop-blur-lg px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isVero ? false : activeSection === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-dock-${item.id}`}
              type="button"
              aria-current={isActive ? 'page' : undefined}
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
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
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
      </div>
    </nav>
  );
};
