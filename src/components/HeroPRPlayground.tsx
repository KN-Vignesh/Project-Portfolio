import React, { useState } from 'react';
import { GitPullRequest, ShieldAlert, CheckCircle2, Play, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface PresetDiff {
  id: string;
  name: string;
  category: string;
  risk: 'CRITICAL' | 'HIGH' | 'LOW';
  ruleTrigger: string;
  summary: string;
}

const PRESET_DIFFS: PresetDiff[] = [
  {
    id: 'sqli',
    name: 'Raw SQL Concatenation in Ingestion Worker',
    category: 'VULNERABILITY',
    risk: 'CRITICAL',
    ruleTrigger: 'Rule S3649 (Database Injection Sink)',
    summary: 'Direct user parameter interpolated into database query without parameterization.'
  },
  {
    id: 'lora-overfit',
    name: 'QLoRA High Rank Adapter Without Dropout',
    category: 'CONFIG_ANOMALY',
    risk: 'HIGH',
    ruleTrigger: 'Rule ML-041 (Parameter Overfit Guard)',
    summary: 'LoRA rank r=128 with alpha=16 on small domain corpus causing representation collapse.'
  },
  {
    id: 'clean-patch',
    name: 'Cosmos DB Vector Search Retry Strategy',
    category: 'REFACTOR',
    risk: 'LOW',
    ruleTrigger: 'Deterministic Gate: PASSED',
    summary: 'Exponential backoff with jitter and circuit-breaker telemetry on vector similarity lookup.'
  }
];

interface HeroPRPlaygroundProps {
  onOpenFullVero?: () => void;
}

export const HeroPRPlayground: React.FC<HeroPRPlaygroundProps> = ({ onOpenFullVero }) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetDiff>(PRESET_DIFFS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<PresetDiff | null>(PRESET_DIFFS[0]);

  const handleRunAudit = (presetToAudit?: PresetDiff) => {
    const target = presetToAudit || selectedPreset;
    setIsAuditing(true);
    setTimeout(() => {
      setAuditResult(target);
      setIsAuditing(false);
    }, 450);
  };

  return (
    <div className="rounded-2xl border border-[#24272D] bg-[#101216] p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#24272D]">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B]">
            <GitPullRequest className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-[#F2F2F2] uppercase tracking-wider">
              Live AI PR Review Sandbox
            </h3>
            <p className="text-[11px] font-mono text-[#8B8F98]">
              Instant deterministic AST policy evaluation
            </p>
          </div>
        </div>

        {onOpenFullVero && (
          <button
            type="button"
            onClick={onOpenFullVero}
            className="text-[10px] font-mono font-semibold text-[#7CFF6B] hover:underline flex items-center gap-1"
          >
            <span>FULL VERO APP</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Preset Diff Buttons */}
      <div className="space-y-1.5 my-3">
        <div className="text-[10px] font-mono text-[#8B8F98] uppercase">
          Select Sample Diff or Scenario:
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {PRESET_DIFFS.map((diff) => {
            const isSelected = selectedPreset.id === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => {
                  setSelectedPreset(diff);
                  handleRunAudit(diff);
                }}
                className={`p-2 rounded-lg text-left text-xs font-mono transition-all flex items-center justify-between border ${
                  isSelected
                    ? 'border-[#7CFF6B]/60 bg-[#7CFF6B]/10 text-[#F2F2F2]'
                    : 'border-[#24272D] bg-[#08090B] text-[#8B8F98] hover:border-[#24272D]/80 hover:text-[#D1D5DB]'
                }`}
              >
                <span className="truncate pr-2">{diff.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                    diff.risk === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : diff.risk === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {diff.risk}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audit Outcome Panel */}
      <div className="rounded-xl border border-[#24272D] bg-[#08090B] p-3 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#24272D]/60 text-[11px]">
          <span className="text-[#8B8F98]">VERDICT STATUS:</span>
          {isAuditing ? (
            <span className="flex items-center gap-1.5 text-amber-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>EVALUATING AST...</span>
            </span>
          ) : auditResult?.risk === 'LOW' ? (
            <span className="flex items-center gap-1.5 text-[#7CFF6B] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>QUALITY GATE PASSED</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>GATE BLOCKED ({auditResult?.risk})</span>
            </span>
          )}
        </div>

        <div className="text-[11px] text-[#D1D5DB] leading-relaxed">
          {auditResult?.summary}
        </div>

        <div className="flex items-center justify-between pt-1 text-[10px] text-[#8B8F98]">
          <span>{auditResult?.ruleTrigger}</span>
          <span className="text-[#7CFF6B]">LATENCY: 28ms</span>
        </div>
      </div>

      {/* Run Audit Action Button */}
      <div className="pt-3 flex gap-2">
        <button
          type="button"
          onClick={() => handleRunAudit()}
          disabled={isAuditing}
          className="flex-1 py-2 px-3 rounded-lg bg-[#7CFF6B] text-[#08090B] font-mono text-xs font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#7CFF6B]/15 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isAuditing ? 'EVALUATING...' : 'RERUN AUDIT SCAN'}</span>
        </button>
      </div>
    </div>
  );
};
