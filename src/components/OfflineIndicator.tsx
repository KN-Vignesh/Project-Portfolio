import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#15181D]/95 border border-amber-500/40 px-3.5 py-1.5 text-xs font-mono font-medium text-amber-400 shadow-xl shadow-black/60 backdrop-blur-md transition-all animate-bounce"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>Offline Mode — Cached offline assets active</span>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
    </div>
  );
};
