import React from 'react';
import { GitBranch, GitCommit, FileCode2, ExternalLink, Zap } from 'lucide-react';
import { PullRequestMetadata } from '../types.js';

interface SummaryCardProps {
  pr: PullRequestMetadata;
  telemetry: {
    githubApiMs: number;
    sonarAnalysisMs: number;
    jevInferenceMs: number;
    decisionEngineMs: number;
    totalMs: number;
    dataSource: string;
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ pr, telemetry }) => {
  return (
    <div className="rounded-xl border border-[#24272D] bg-[#101216] p-5 sm:p-6 shadow-sm">
      {/* Top Repo & PR Number */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24272D] pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-[#F2F2F2]">
            {pr.owner}/{pr.repo}
          </span>
          <span className="font-mono text-sm font-medium text-[#7CFF6B]">
            #{pr.number}
          </span>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${
              pr.state === 'merged'
                ? 'bg-purple-950/40 text-purple-300 border-purple-800'
                : pr.state === 'closed'
                ? 'bg-[#15181D] text-[#8B8F98] border-[#24272D]'
                : 'bg-[#7CFF6B]/15 text-[#7CFF6B] border-[#7CFF6B]/30'
            }`}
          >
            {pr.state}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded bg-[#15181D] border border-[#24272D] px-2.5 py-1 text-[11px] font-mono text-[#8B8F98]">
            <Zap className="h-3 w-3 text-[#FFB020]" />
            <span>PIPELINE: {telemetry.totalMs}ms</span>
          </span>
          <a
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#8B8F98] hover:text-[#7CFF6B] transition-colors"
          >
            <span>GITHUB PR</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* PR Title & Description */}
      <div className="mt-4">
        <h2 className="text-lg font-bold font-mono tracking-tight text-[#F2F2F2]">
          {pr.title}
        </h2>
        <p className="mt-2 text-xs font-mono leading-relaxed text-[#8B8F98]">
          {pr.description || 'No description provided.'}
        </p>
      </div>

      {/* Author & Branches */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-[#8B8F98]">
        <div className="flex items-center gap-1.5">
          <img
            src={pr.author.avatarUrl}
            alt={pr.author.login}
            className="h-5 w-5 rounded-full border border-[#24272D]"
          />
          <span className="text-[#F2F2F2]">@{pr.author.login}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <GitBranch className="h-3.5 w-3.5 text-[#5A5E67]" />
          <span className="rounded bg-[#15181D] border border-[#24272D] px-1.5 py-0.5 text-[#F2F2F2]">{pr.baseBranch}</span>
          <span className="text-[#5A5E67]">←</span>
          <span className="rounded bg-[#15181D] border border-[#24272D] px-1.5 py-0.5 text-[#7CFF6B]">{pr.headBranch}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#24272D] pt-4 sm:grid-cols-4">
        <div className="rounded-lg bg-[#15181D] border border-[#24272D] p-3">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#8B8F98]">
            Files Changed
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#F2F2F2]">
              {pr.changedFilesCount}
            </span>
            <FileCode2 className="h-4 w-4 text-[#5A5E67]" />
          </div>
        </div>

        <div className="rounded-lg bg-[#15181D] border border-[#24272D] p-3">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#8B8F98]">
            Lines Modified
          </span>
          <div className="mt-1 flex items-baseline gap-1.5 font-mono text-sm font-semibold">
            <span className="text-[#7CFF6B]">+{pr.additions}</span>
            <span className="text-[#5A5E67]">/</span>
            <span className="text-[#FF5449]">-{pr.deletions}</span>
          </div>
        </div>

        <div className="rounded-lg bg-[#15181D] border border-[#24272D] p-3">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#8B8F98]">
            Commits
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#F2F2F2]">
              {pr.commitsCount}
            </span>
            <GitCommit className="h-4 w-4 text-[#5A5E67]" />
          </div>
        </div>

        <div className="rounded-lg bg-[#15181D] border border-[#24272D] p-3">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#8B8F98]">
            Jev Latency
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#7CFF6B]">
              {telemetry.jevInferenceMs}ms
            </span>
            <span className="text-[10px] font-mono text-[#5A5E67]">System 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
