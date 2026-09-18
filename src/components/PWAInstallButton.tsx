import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'badge' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute public shared URL (replace ais-dev- with ais-pre- so mobile users bypass Google IAP auth)
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const isDevHost = currentHost.includes('ais-dev-');
  const sharedUrl = isDevHost
    ? window.location.href.replace('ais-dev-', 'ais-pre-')
    : typeof window !== 'undefined'
    ? window.location.href
    : 'https://ais-pre-mvjwmq6xorratqoo5k6rxe-419106617045.asia-southeast1.run.app';

  // If already running in standalone PWA mode, suppress install button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCopySharedUrl = async () => {
    try {
      await navigator.clipboard.writeText(sharedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <>
      {installSuccess ? (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#7CFF6B]/15 border border-[#7CFF6B]/40 text-[#7CFF6B] text-xs font-mono font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>App Installed</span>
        </div>
      ) : (
        <button
          id="pwa-install-trigger-button"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1 rounded border border-[#7CFF6B]/40 bg-[#15181D] hover:bg-[#24272D] text-[#7CFF6B] text-xs font-mono font-bold transition-all shadow-sm hover:shadow-[#7CFF6B]/15 cursor-pointer ${className}`}
          title="Install portfolio as mobile app"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{variant === 'compact' ? 'GET APP' : 'INSTALL APP'}</span>
          <Download className="w-3 h-3 text-[#7CFF6B]/80 ml-0.5" />
        </button>
      )}

      {/* Mobile Install & Access Guide Modal */}
      {showModal && (
        <div
          id="pwa-install-guide-modal"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#24272D] bg-[#101216] p-5 shadow-2xl text-[#F2F2F2] font-mono max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#24272D]">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#7CFF6B]/15 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#F2F2F2]">
                  {isIOS ? 'Install on iOS' : 'Install Mobile App'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-[#8B8F98] hover:text-[#F2F2F2] transition-colors cursor-pointer rounded-md hover:bg-[#1C1F26]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Public Mobile URL callout */}
            <div className="mt-3 rounded-lg border border-[#7CFF6B]/30 bg-[#7CFF6B]/5 p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#7CFF6B] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse" />
                  Public Mobile Link:
                </span>
                <button
                  onClick={handleCopySharedUrl}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#101216] border border-[#7CFF6B]/40 text-[#7CFF6B] hover:bg-[#7CFF6B]/20 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
              </div>
              <p className="text-[#8B8F98] text-[11px] leading-relaxed break-all bg-[#08090B] p-2 rounded border border-[#24272D]">
                {sharedUrl}
              </p>
              <p className="text-[10px] text-[#8B8F98]">
                <strong>Important:</strong> Always open the <strong>Public Shared URL</strong> (<code className="text-[#7CFF6B]">ais-pre</code>) on mobile phones. The private development link (<code className="text-[#8B8F98]">ais-dev</code>) requires Google developer authentication which triggers 401/400 errors on mobile browsers.
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-start gap-3 rounded-lg border border-[#24272D] bg-[#15181D] p-3">
                <div className="h-6 w-6 rounded bg-[#24272D] flex items-center justify-center shrink-0 text-[#7CFF6B]">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <span className="text-[#F2F2F2] font-bold">Step 1: </span>
                  <span className="text-[#8B8F98]">
                    Open the copied link in mobile Safari or Chrome, then tap <strong>Share</strong> (or the three dots menu).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[#24272D] bg-[#15181D] p-3">
                <div className="h-6 w-6 rounded bg-[#24272D] flex items-center justify-center shrink-0 text-[#7CFF6B]">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <span className="text-[#F2F2F2] font-bold">Step 2: </span>
                  <span className="text-[#8B8F98]">
                    Scroll and tap <strong>Add to Home Screen</strong> or <strong>Install App</strong>.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg bg-[#7CFF6B] hover:bg-[#7CFF6B]/90 text-[#08090B] font-bold py-2.5 text-xs transition-colors cursor-pointer"
              >
                GOT IT
              </button>
              {isDevHost && (
                <a
                  href={sharedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 px-3 rounded-lg border border-[#24272D] bg-[#15181D] hover:bg-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Shared</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
