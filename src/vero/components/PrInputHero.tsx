import React, { useState } from 'react';
import { Search, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, GitPullRequest } from 'lucide-react';

interface PrInputHeroProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  currentUrl: string;
}

const PRESET_PRS = [
  {
    id: 'demo-payment',
    label: 'KN-Vignesh/PR-Sentinel-Demo #1',
    description: 'Payment retry + SQL concat + hardcoded token (Critical Flaws)',
    url: 'https://github.com/KN-Vignesh/PR-Sentinel-Demo/pull/1',
    tag: 'CRITICAL SECURITY',
    tagColor: 'bg-[#FF5449]/15 text-[#FF5449] border-[#FF5449]/40',
  },
  {
    id: 'demo-react',
    label: 'facebook/react #28271',
    description: 'Scheduler microtask starvation loop fix (Complex Architecture)',
    url: 'https://github.com/facebook/react/pull/28271',
    tag: 'CORE REFACTOR',
    tagColor: 'bg-[#6EA8FE]/15 text-[#6EA8FE] border-[#6EA8FE]/40',
  },
  {
    id: 'demo-flask',
    label: 'pallets/flask #5012',
    description: 'Type hint modernization & dependency bump (Low Risk)',
    url: 'https://github.com/pallets/flask/pull/5012',
    tag: 'LOW RISK / CLEAN',
    tagColor: 'bg-[#7CFF6B]/15 text-[#7CFF6B] border-[#7CFF6B]/40',
  },
];

export const PrInputHero: React.FC<PrInputHeroProps> = ({
  onAnalyze,
  isLoading,
  error,
  currentUrl,
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl || 'https://github.com/KN-Vignesh/PR-Sentinel-Demo/pull/1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isLoading) return;
    onAnalyze(inputUrl.trim());
  };

  const handleSelectPreset = (url: string) => {
    setInputUrl(url);
    onAnalyze(url);
  };

  return (
    <div className="mx-auto w-full max-w-4xl py-4">
      {/* Title & Philosophy Banner */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-3 py-1 text-xs font-mono text-[#7CFF6B]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Code computes. Static analysis detects. Jev decides.</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#F2F2F2] sm:text-3xl font-mono">
          AI PULL REQUEST ANALYSIS ENGINE
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs font-mono text-[#8B8F98]">
          Real-time GitHub PR diff ingestion, SonarQube deterministic static gates, TypeSafe Jev System 1 probabilistic choices, and auditable policy rule enforcement.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="mt-6 rounded-xl border border-[#24272D] bg-[#101216] p-4 sm:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="pr-url-input" className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8B8F98]">
              [01 / INPUT] Public GitHub Pull Request URL
            </label>
            <span className="text-[10px] font-mono text-[#5A5E67]">
              Supports public repo PR links & shorthands (owner/repo#123)
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5A5E67]">
                <Search className="h-4 w-4" />
              </div>
              <input
                id="pr-url-input"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/pull/123"
                disabled={isLoading}
                className="w-full rounded-lg border border-[#24272D] bg-[#15181D] py-3 pl-10 pr-4 text-xs font-mono text-[#F2F2F2] placeholder-[#5A5E67] focus:border-[#7CFF6B] focus:outline-none focus:ring-1 focus:ring-[#7CFF6B]"
              />
            </div>
            <button
              id="analyze-pr-button"
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7CFF6B] px-6 py-3 text-xs font-mono font-bold text-[#08090B] transition-all hover:bg-[#7CFF6B]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#08090B] border-t-transparent" />
                  <span>ANALYZING PIPELINE...</span>
                </>
              ) : (
                <>
                  <span>RUN ANALYSIS</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Preset PRs */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-[#8B8F98] mb-2 flex items-center gap-1.5">
              <GitPullRequest className="h-3 w-3 text-[#7CFF6B]" />
              <span>Verified Benchmark Fixtures:</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {PRESET_PRS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  disabled={isLoading}
                  className={`group flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
                    inputUrl === preset.url
                      ? 'border-[#7CFF6B] bg-[#15181D]'
                      : 'border-[#24272D] bg-[#101216] hover:border-[#7CFF6B]/40 hover:bg-[#15181D]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className="font-mono text-xs font-semibold text-[#F2F2F2] truncate">
                      {preset.label}
                    </span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${preset.tagColor}`}>
                      {preset.tag}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[11px] font-mono text-[#8B8F98]">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Loading Progress Stages */}
        {isLoading && (
          <div className="mt-5 rounded-lg border border-[#24272D] bg-[#15181D] p-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#7CFF6B] border-t-transparent" />
              <div className="text-xs font-mono text-[#F2F2F2]">
                Executing 4-Stage Evidence Pipeline...
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono text-[#8B8F98] sm:grid-cols-4">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7CFF6B]" />
                <span>1. GitHub Ingestion</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7CFF6B]" />
                <span>2. SonarQube Static</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7CFF6B]" />
                <span>3. Jev Decision AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7CFF6B]" />
                <span>4. Policy Rules</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#FF5449]/40 bg-[#FF5449]/10 p-4 text-xs font-mono text-[#F2F2F2]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5449]" />
            <div>
              <p className="font-semibold text-[#FF5449]">Analysis Pipeline Interrupted</p>
              <p className="mt-0.5 text-[#8B8F98]">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
