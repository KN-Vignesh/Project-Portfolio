import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, NavTab } from './components/Navbar.js';
import { PrInputHero } from './components/PrInputHero.js';
import { SummaryCard } from './components/SummaryCard.js';
import { VerdictBanner } from './components/VerdictBanner.js';
import { SonarQubePillar } from './components/SonarQubePillar.js';
import { JevPillar } from './components/JevPillar.js';
import { DecisionEnginePillar } from './components/DecisionEnginePillar.js';
import { DiffInspector } from './components/DiffInspector.js';
import { EngineeringChapters } from './components/EngineeringChapters.js';
import { EvaluationSandbox } from './components/EvaluationSandbox.js';
import { JevArchitectureGuide } from './components/JevArchitectureGuide.js';
import { PortfolioIntegrationGuide } from './components/PortfolioIntegrationGuide.js';
import { TokenSettingsModal } from './components/TokenSettingsModal.js';
import { TrialHistoryBanner } from './components/TrialHistoryBanner.js';
import {
  AnalysisResult,
  SonarIssue,
  DeterministicPolicyRule,
  TrialStatus,
  TrialHistoryItem,
} from './types.js';

export interface VeroAppProps {
  onBackToPortfolio?: () => void;
}

export default function VeroApp({ onBackToPortfolio = () => {} }: VeroAppProps) {
  const [activeTab, setActiveTab] = useState<NavTab>('analyzer');
  const [currentUrl, setCurrentUrl] = useState<string>(
    'https://github.com/KN-Vignesh/PR-Sentinel-Demo/pull/1'
  );
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<SonarIssue | null>(null);
  const [hasCopiedMarkdown, setHasCopiedMarkdown] = useState<boolean>(false);

  // Token & Trial Management States
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [userGithubToken, setUserGithubToken] = useState<string>(() => {
    return localStorage.getItem('prs_user_github_token') || '';
  });
  const [userTypesafeKey, setUserTypesafeKey] = useState<string>(() => {
    return localStorage.getItem('prs_user_typesafe_key') || '';
  });
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [trialHistory, setTrialHistory] = useState<TrialHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('prs_trial_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Unique client session ID for browser persistence
  const [clientSessionId] = useState<string>(() => {
    let sid = localStorage.getItem('prs_client_session_id');
    if (!sid) {
      sid = 'prs_client_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('prs_client_session_id', sid);
    }
    return sid;
  });

  // Save tokens to localStorage
  const handleSaveGithubToken = (token: string) => {
    setUserGithubToken(token);
    if (token) {
      localStorage.setItem('prs_user_github_token', token);
    } else {
      localStorage.removeItem('prs_user_github_token');
    }
    fetchTrialStatus(token, userTypesafeKey);
  };

  const handleSaveTypesafeKey = (key: string) => {
    setUserTypesafeKey(key);
    if (key) {
      localStorage.setItem('prs_user_typesafe_key', key);
    } else {
      localStorage.removeItem('prs_user_typesafe_key');
    }
    fetchTrialStatus(userGithubToken, key);
  };

  // Fetch current trial quota and 24h cooling status
  const fetchTrialStatus = useCallback(
    async (ghToken?: string, tsKey?: string) => {
      try {
        const headers: Record<string, string> = {
          'x-client-session-id': clientSessionId,
        };
        const activeGh = ghToken !== undefined ? ghToken : userGithubToken;
        const activeTs = tsKey !== undefined ? tsKey : userTypesafeKey;
        if (activeGh) headers['x-user-github-token'] = activeGh;
        if (activeTs) headers['x-user-typesafe-key'] = activeTs;

        const res = await fetch('/api/trial-status', { headers });
        if (res.ok) {
          const data: TrialStatus = await res.json();
          setTrialStatus(data);
        }
      } catch (e) {
        console.error('Failed to fetch trial status:', e);
      }
    },
    [clientSessionId, userGithubToken, userTypesafeKey]
  );

  useEffect(() => {
    fetchTrialStatus();
  }, [fetchTrialStatus]);

  // Clear local browser analysis history
  const handleClearHistory = () => {
    setTrialHistory([]);
    localStorage.removeItem('prs_trial_history');
  };

  // Trigger analysis
  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentUrl(url);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-client-session-id': clientSessionId,
      };
      if (userGithubToken) headers['x-user-github-token'] = userGithubToken;
      if (userTypesafeKey) headers['x-user-typesafe-key'] = userTypesafeKey;

      const response = await fetch('/api/analyze-pr', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prUrl: url }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          // Trial quota exceeded
          if (errData.trialsUsed !== undefined) {
            setTrialStatus((prev) =>
              prev
                ? {
                    ...prev,
                    trialsUsed: errData.trialsUsed,
                    coolingResetMs: errData.coolingResetMs || prev.coolingResetMs,
                  }
                : null
            );
          }
          throw new Error(
            errData.error ||
              'Trial limit reached: 3 distinct Pull Requests have been analyzed in this 24-hour cooling period. Specify your GitHub Personal Access Token in Settings for unlimited analyses.'
          );
        }
        throw new Error(errData.error || `HTTP error ${response.status}: Failed to analyze PR`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysis(data);
      if (data.trialStatus) {
        setTrialStatus(data.trialStatus);
      }

      // Add to local browser history
      const historyItem: TrialHistoryItem = {
        id: `${data.pullRequest.owner}-${data.pullRequest.repo}-${data.pullRequest.number}-${Date.now()}`,
        url: data.pullRequest.url,
        repo: `${data.pullRequest.owner}/${data.pullRequest.repo}`,
        number: data.pullRequest.number,
        title: data.pullRequest.title,
        timestamp: new Date().toISOString(),
        verdict: data.assessment.verdictLabel,
        risk: data.assessment.overallRisk,
        usedCustomToken: Boolean(userGithubToken && userGithubToken.trim().length > 0),
      };

      setTrialHistory((prev) => {
        // Filter out prior entry of exact same PR url so latest is on top
        const filtered = prev.filter((item) => item.url.toLowerCase() !== data.pullRequest.url.toLowerCase());
        const updated = [historyItem, ...filtered].slice(0, 30);
        localStorage.setItem('prs_trial_history', JSON.stringify(updated));
        return updated;
      });

      if (activeTab !== 'analyzer') {
        setActiveTab('analyzer');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during PR analysis');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial analysis automatically on mount for immediate interactive experience
  useEffect(() => {
    handleAnalyze('https://github.com/KN-Vignesh/PR-Sentinel-Demo/pull/1');
  }, []);

  // Copy Markdown review report
  const handleCopyMarkdown = () => {
    if (!analysis) return;
    const { pullRequest, assessment, sonarQube, jev } = analysis;

    const md = `## Vero Engineering Review

**PR:** [${pullRequest.owner}/${pullRequest.repo} #${pullRequest.number}](${pullRequest.url}) - *${pullRequest.title}*
**Verdict:** **${assessment.verdictLabel}** (Risk: ${assessment.overallRisk} | Confidence: ${assessment.confidencePercent}%)

### Summary Findings
${assessment.summaryStatements.map((s) => `- ${s}`).join('\n')}

### Deterministic Quality Gate (SonarQube)
- **Status:** Quality Gate **${sonarQube.qualityGate}**
- **Vulnerabilities:** ${sonarQube.metrics.vulnerabilities}
- **Bugs:** ${sonarQube.metrics.bugs}
- **Code Smells:** ${sonarQube.metrics.codeSmells} (${sonarQube.metrics.technicalDebtMinutes}m technical debt)
- **Coverage on New Code:** ${sonarQube.metrics.coveragePercent}% (Threshold: >=80%)

### TypeSafe Jev Structured Decisions (System 1)
- **PR Category:** \`${jev.category.selected}\` (${(jev.category.confidence * 100).toFixed(0)}% confidence)
- **Calibrated Risk Score:** ${jev.calibratedScore}/100 (\`${jev.risk.selected}\`)
- **Security Concern:** \`${jev.securityConcern.selected}\` (${(jev.securityConcern.confidence * 100).toFixed(0)}%)
- **Human Review Warranted:** \`${jev.humanReviewWarranted.selected}\`

### Triggered Policy Rules
${assessment.activePolicies
  .filter((r: DeterministicPolicyRule) => r.conditionMet)
  .map((r: DeterministicPolicyRule) => `- [**${r.id}**] ${r.name} → **${r.effect}**: ${r.reason}`)
  .join('\n')}

*Generated in ${analysis.telemetry.totalMs}ms by Vero with zero LLM chat hallucination.*
`;

    navigator.clipboard.writeText(md);
    setHasCopiedMarkdown(true);
    setTimeout(() => setHasCopiedMarkdown(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F2F2F2] selection:bg-[#7CFF6B]/20 selection:text-[#7CFF6B] tech-grid">
      {/* Top Navbar with Settings Button and Back to Portfolio */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onBackToPortfolio={onBackToPortfolio}
      />

      {/* Portfolio Breadcrumb Bar */}
      <div className="border-b border-[#24272D] bg-[#101216]/90 px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#8B8F98]">
            <button
              onClick={onBackToPortfolio}
              className="hover:text-[#7CFF6B] transition-colors flex items-center gap-1.5"
            >
              <span>← PORTFOLIO</span>
            </button>
            <span className="text-[#5A5E67]">/</span>
            <span className="text-[#8B8F98]">PROJECTS</span>
            <span className="text-[#5A5E67]">/</span>
            <span className="text-[#7CFF6B] font-semibold">VERO_AI_CODE_ANALYSIS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#7CFF6B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
              <span className="hidden sm:inline">LIVE ENGINE ACTIVE</span>
            </span>
            <button
              onClick={onBackToPortfolio}
              className="rounded border border-[#24272D] bg-[#15181D] px-2.5 py-1 text-[11px] text-[#8B8F98] hover:border-[#7CFF6B]/40 hover:text-[#7CFF6B] transition-colors"
            >
              EXIT TO PORTFOLIO
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            {/* Trial Quota, Live 24h Cooling Timer & Browser History Bar */}
            <TrialHistoryBanner
              trialStatus={trialStatus}
              history={trialHistory}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onSelectPr={(url) => handleAnalyze(url)}
              onClearHistory={handleClearHistory}
              userGithubToken={userGithubToken}
              userTypesafeKey={userTypesafeKey}
            />

            {/* PR Ingestion Hero Card */}
            <PrInputHero
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              error={error}
              currentUrl={currentUrl}
            />

            {/* Analysis Results View */}
            {analysis && (
              <div className="space-y-6">
                {/* 1. Final Verdict Banner */}
                <VerdictBanner
                  assessment={analysis.assessment}
                  onCopyMarkdown={handleCopyMarkdown}
                  hasCopied={hasCopiedMarkdown}
                />

                {/* 2. PR Summary & Ingestion Metadata */}
                <SummaryCard pr={analysis.pullRequest} telemetry={analysis.telemetry} />

                {/* 3. Dual Columns: SonarQube & TypeSafe Jev */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <SonarQubePillar
                    sonar={analysis.sonarQube}
                    onSelectIssue={(issue) => {
                      setSelectedIssue(issue);
                    }}
                  />
                  <JevPillar
                    jev={analysis.jev}
                    onOpenExplainer={() => setActiveTab('architecture')}
                  />
                </div>

                {/* 4. Deterministic Decision Engine (Policy Rules & Evidence Trail) */}
                <DecisionEnginePillar
                  policies={analysis.assessment.activePolicies}
                  evidenceTrail={analysis.assessment.evidenceAuditTrail}
                />

                {/* 5. Interactive Diff & Evidence Inspector */}
                <DiffInspector
                  files={analysis.files}
                  sonarIssues={analysis.sonarQube.issues}
                  selectedIssue={selectedIssue}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'journey' && <EngineeringChapters />}

        {activeTab === 'evaluation' && <EvaluationSandbox />}

        {activeTab === 'architecture' && <JevArchitectureGuide />}

        {activeTab === 'portfolio' && <PortfolioIntegrationGuide />}
      </main>

      {/* Token & API Key Configuration Modal */}
      <TokenSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userGithubToken={userGithubToken}
        onSaveGithubToken={handleSaveGithubToken}
        userTypesafeKey={userTypesafeKey}
        onSaveTypesafeKey={handleSaveTypesafeKey}
      />

      {/* Footer */}
      <footer className="border-t border-[#24272D] bg-[#08090B] py-8 text-center text-xs font-mono text-[#8B8F98]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F2F2F2]">VERO</span>
            <span className="text-[#5A5E67]">•</span>
            <span>AI Pull Request Analysis Engine</span>
            <span className="text-[#5A5E67]">•</span>
            <span className="text-[#7CFF6B]">Live Integrated Module</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={onBackToPortfolio}
              className="rounded border border-[#24272D] bg-[#101216] px-2 py-1 text-[#8B8F98] hover:border-[#7CFF6B]/50 hover:text-[#7CFF6B]"
            >
              ← RETURN TO PORTFOLIO
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-[#8B8F98] hover:text-[#F2F2F2] underline"
            >
              Token & Key Settings
            </button>
            <span>•</span>
            <a
              href="https://github.com/KN-Vignesh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#7CFF6B] underline hover:text-[#7CFF6B]/80"
            >
              KN-Vignesh
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
