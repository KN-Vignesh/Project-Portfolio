import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldX, Copy, Check } from 'lucide-react';
import { FinalAssessment } from '../types.js';

interface VerdictBannerProps {
  assessment: FinalAssessment;
  onCopyMarkdown: () => void;
  hasCopied: boolean;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  assessment,
  onCopyMarkdown,
  hasCopied,
}) => {
  const isBlocked =
    assessment.verdict === 'MERGE_BLOCKED' || assessment.verdict === 'SECURITY_REVIEW_REQUIRED';
  const isExpedited = assessment.verdict === 'EXPEDITED_MERGE_OK';

  return (
    <div
      className={`rounded-xl border p-5 sm:p-6 transition-all ${
        isBlocked
          ? 'border-[#FF5449]/40 bg-[#FF5449]/10 text-[#F2F2F2]'
          : isExpedited
          ? 'border-[#7CFF6B]/40 bg-[#7CFF6B]/10 text-[#F2F2F2]'
          : 'border-[#FFB020]/40 bg-[#FFB020]/10 text-[#F2F2F2]'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Verdict Title & Status */}
        <div className="flex items-start gap-3.5">
          <div
            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
              isBlocked
                ? 'bg-[#FF5449]/20 border-[#FF5449]/50 text-[#FF5449]'
                : isExpedited
                ? 'bg-[#7CFF6B]/20 border-[#7CFF6B]/50 text-[#7CFF6B]'
                : 'bg-[#FFB020]/20 border-[#FFB020]/50 text-[#FFB020]'
            }`}
          >
            {isBlocked ? (
              <ShieldX className="h-5 w-5" />
            ) : isExpedited ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold font-mono tracking-tight text-[#F2F2F2]">
                {assessment.verdictLabel}
              </h3>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                  assessment.overallRisk === 'CRITICAL'
                    ? 'bg-[#FF5449]/20 text-[#FF5449] border-[#FF5449]/40'
                    : assessment.overallRisk === 'HIGH'
                    ? 'bg-[#FFB020]/20 text-[#FFB020] border-[#FFB020]/40'
                    : assessment.overallRisk === 'MEDIUM'
                    ? 'bg-[#6EA8FE]/20 text-[#6EA8FE] border-[#6EA8FE]/40'
                    : 'bg-[#7CFF6B]/20 text-[#7CFF6B] border-[#7CFF6B]/40'
                }`}
              >
                RISK: {assessment.overallRisk}
              </span>
              <span className="rounded bg-[#15181D] border border-[#24272D] px-2 py-0.5 text-[10px] font-mono text-[#8B8F98]">
                CONFIDENCE: {assessment.confidencePercent}%
              </span>
            </div>
            <p className="mt-1 text-xs font-mono text-[#8B8F98]">
              Evaluated by Deterministic Policy Engine combining SonarQube Clean Code heuristics and TypeSafe Jev System 1 probabilities.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="shrink-0">
          <button
            id="copy-report-markdown-button"
            onClick={onCopyMarkdown}
            className="inline-flex items-center gap-2 rounded-lg border border-[#24272D] bg-[#101216] px-3.5 py-2 text-xs font-mono text-[#8B8F98] hover:border-[#7CFF6B]/40 hover:text-[#7CFF6B] transition-colors"
          >
            {hasCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#7CFF6B]" />
                <span className="text-[#7CFF6B]">COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#5A5E67]" />
                <span>COPY REVIEW MARKDOWN</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Findings */}
      {assessment.summaryStatements.length > 0 && (
        <div className="mt-4 rounded-lg bg-[#101216] border border-[#24272D] p-4">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8B8F98]">
            // AUDIT & EVIDENCE SUMMARY
          </h4>
          <ul className="mt-2 space-y-1.5 text-xs font-mono leading-relaxed text-[#F2F2F2]">
            {assessment.summaryStatements.map((statement, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7CFF6B]" />
                <span>{statement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Actions */}
      {assessment.recommendedActions.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="font-semibold text-[#8B8F98]">RECOMMENDED ACTION:</span>
          {assessment.recommendedActions.map((action, idx) => (
            <span
              key={idx}
              className="rounded bg-[#15181D] border border-[#24272D] px-2.5 py-1 text-xs text-[#F2F2F2]"
            >
              {action}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
