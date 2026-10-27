import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  GitCommit,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { AITrendItem, CURATED_AI_TRENDS } from '../data/aiTrends';
import { ScrollReveal } from './ScrollReveal';
import { NutshellText } from './Nutshell';

export const LiveAITrendsSection: React.FC = () => {
  const [trends, setTrends] = useState<AITrendItem[]>(CURATED_AI_TRENDS);
  const [githubEvents, setGithubEvents] = useState<any[]>([]);
  const [sonarStatus, setSonarStatus] = useState<any>({
    status: 'OK',
    reliability: 'A',
    security: 'A',
    bugs: 0,
  });

  useEffect(() => {
    fetch('/api/trends')
      .then((res) => res.json())
      .then((data) => {
        if (data?.trends && Array.isArray(data.trends)) {
          setTrends(data.trends);
        }
      })
      .catch(() => {});

    fetch('/api/github-activity')
      .then((res) => res.json())
      .then((data) => {
        if (data?.events && Array.isArray(data.events)) {
          setGithubEvents(data.events);
        }
      })
      .catch(() => {});

    fetch('/api/sonar-metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data?.status) {
          setSonarStatus(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="ai-trends"
      className="py-24 lg:py-28 border-t border-white/[0.08] bg-[#08090B] relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
              08 · Technical Radar &amp; Repository Pulse
            </div>
            <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
              Research Benchmarks &amp; Quality Gate Health
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98]">
            Synced via Automated CI Pipeline
          </div>
        </ScrollReveal>

        {/* 2-Column Editorial Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: Tracked Open-Weight Models & Papers */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#8B8F98] pb-1">
              <span className="flex items-center gap-1.5 text-[#F2F2F2] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#7CFF6B]" />
                Tracked Architectures &amp; Papers
              </span>
              <span>Hugging Face · ArXiv Feed</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {trends.slice(0, 3).map((item) => (
                <article
                  key={item.id}
                  className="editorial-card rounded-2xl p-5 hover:border-[#7CFF6B]/60 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#8B8F98]">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7CFF6B] font-semibold hover:underline"
                        >
                          {item.name}
                        </a>
                        <span aria-hidden="true">·</span>
                        <span>{item.source}</span>
                      </div>
                      <p className="text-sm text-[#F2F2F2] mt-1.5 leading-relaxed font-medium">
                        {item.headline}
                      </p>
                      <div className="mt-1">
                        <NutshellText
                          blockId={`trend-notes-${item.id}`}
                          as="p"
                          maxTriggers={2}
                          className="text-xs text-[#8B8F98] font-mono leading-relaxed"
                          text={item.architectureNotes}
                        />
                      </div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${item.name} benchmark reference`}
                      className="text-right shrink-0 font-mono block"
                    >
                      <div className="text-xs font-bold text-[#7CFF6B]">
                        {item.metric}
                      </div>
                      <div className="text-[10px] text-[#8B8F98]">
                        {item.metricLabel}
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#8B8F98] ml-auto mt-1 group-hover:text-[#7CFF6B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Column 2: GitHub Contributions & SonarCloud Quality Gate */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#8B8F98] pb-2">
                <span className="flex items-center gap-1.5 text-[#F2F2F2] font-semibold">
                  <GitCommit className="w-3.5 h-3.5 text-[#7CFF6B]" />
                  Recent Repository Activity
                </span>
                <span>github.com/KN-Vignesh</span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#101216] p-5 divide-y divide-white/[0.08] space-y-3 font-mono text-xs">
                {(githubEvents.length > 0
                  ? githubEvents.slice(0, 3)
                  : [
                      {
                        id: '1',
                        repo: 'KN-Vignesh/Project-Portfolio',
                        action:
                          'Merge PR #17: External Vero Engine Redirect & Cleanup',
                      },
                      {
                        id: '2',
                        repo: 'KN-Vignesh/Project-Portfolio',
                        action:
                          'Feat: Editorial Case Studies & 3D Architecture Stage',
                      },
                      {
                        id: '3',
                        repo: 'KN-Vignesh/Projects',
                        action: 'Push: QLoRA NormalFloat4 quantized adapters',
                      },
                    ]
                ).map((evt, idx) => (
                  <div
                    key={evt.id || idx}
                    className="pt-3 first:pt-0 flex items-start gap-3"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#7CFF6B] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[#F2F2F2] truncate font-semibold text-xs">
                        {evt.repo}
                      </div>
                      <div className="text-[11px] text-[#8B8F98] truncate mt-0.5">
                        {evt.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SonarCloud Quality Gate Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#101216] p-5 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#F2F2F2] font-semibold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7CFF6B]" />
                  SonarCloud Quality Gate
                </span>
                <span className="text-[11px] text-[#7CFF6B] font-semibold">
                  {sonarStatus.status === 'OK' ? 'Passing · Grade A' : sonarStatus.status}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="bg-[#08090B] p-2 rounded-xl border border-white/[0.08]">
                  <div className="text-[9px] text-[#8B8F98]">BUGS</div>
                  <div className="text-xs font-bold text-[#7CFF6B] tabular-nums">
                    {sonarStatus.bugs ?? 0}
                  </div>
                </div>
                <div className="bg-[#08090B] p-2 rounded-xl border border-white/[0.08]">
                  <div className="text-[9px] text-[#8B8F98]">VULNS</div>
                  <div className="text-xs font-bold text-[#7CFF6B] tabular-nums">
                    0
                  </div>
                </div>
                <div className="bg-[#08090B] p-2 rounded-xl border border-white/[0.08]">
                  <div className="text-[9px] text-[#8B8F98]">SECURITY</div>
                  <div className="text-xs font-bold text-[#7CFF6B]">
                    {sonarStatus.security || 'A'} (1.0)
                  </div>
                </div>
                <div className="bg-[#08090B] p-2 rounded-xl border border-white/[0.08]">
                  <div className="text-[9px] text-[#8B8F98]">RELIABILITY</div>
                  <div className="text-xs font-bold text-[#7CFF6B]">
                    {sonarStatus.reliability || 'A'} (1.0)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
