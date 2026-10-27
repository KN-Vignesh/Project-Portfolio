import React from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { NutshellText } from './Nutshell';

export const ExperienceSection: React.FC = () => {
  return (
    <section
      id="experience"
      className="py-28 lg:py-32 border-t border-white/[0.08] bg-[#08090B] relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Sticky Left Column + Scrolling Right Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Sticky Column: Heading & Career Trajectory */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <ScrollReveal className="space-y-4">
              <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
                06 · Professional Track Record
              </div>
              <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
                4+ Years From Enterprise Cloud to Production AI
              </h2>
              <p className="text-base text-[#8B8F98] leading-relaxed">
                Progression across enterprise .NET 8 microservices, Azure serverless automation, vector search infrastructure, and parameter-efficient LLM engineering.
              </p>
            </ScrollReveal>

            {/* Hairlined 2x2 Trajectory Matrix */}
            <div className="grid grid-cols-2 border border-white/[0.08] rounded-2xl overflow-hidden divide-x divide-y divide-white/[0.08] bg-[#101216]">
              <div className="p-4 space-y-1">
                <span className="font-mono text-xs text-[#7CFF6B] font-bold">
                  2022
                </span>
                <div className="text-sm font-bold text-[#F2F2F2]">
                  Data &amp; API Foundations
                </div>
                <p className="text-xs text-[#8B8F98] leading-relaxed">
                  Python &amp; C# ETL pipelines, REST contracts, Cosmos DB.
                </p>
              </div>

              <div className="p-4 space-y-1">
                <span className="font-mono text-xs text-[#6EA8FE] font-bold">
                  2022–2024
                </span>
                <div className="text-sm font-bold text-[#F2F2F2]">
                  Cloud &amp; MLOps Scale
                </div>
                <p className="text-xs text-[#8B8F98] leading-relaxed">
                  Azure Functions, Vector Search, PAM (6K+ users), CI/CD.
                </p>
              </div>

              <div className="p-4 space-y-1">
                <span className="font-mono text-xs text-[#FFB86B] font-bold">
                  2024–Present
                </span>
                <div className="text-sm font-bold text-[#F2F2F2]">
                  Agentic AI &amp; .NET 8
                </div>
                <p className="text-xs text-[#8B8F98] leading-relaxed">
                  .NET Core 8 &amp; Angular 18 microservices, RLHF &amp; LLM evaluation.
                </p>
              </div>

              <div className="p-4 space-y-1 bg-[#15181D]">
                <span className="font-mono text-xs text-[#7CFF6B] font-bold">
                  Current Focus
                </span>
                <div className="text-sm font-bold text-[#7CFF6B]">
                  AI Systems Engineering
                </div>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">
                  PEFT (LoRA/QLoRA), deterministic AST gates, 3D ML interpretability.
                </p>
              </div>
            </div>
          </div>

          {/* Right Scrolling Column: Experience Case Cards */}
          <div className="lg:col-span-7 space-y-6">
            {EXPERIENCES.map((exp, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.06}>
                <div className="editorial-card rounded-2xl p-6 sm:p-9 space-y-6">
                  {/* Top Unboxed Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-white/[0.08]">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#8B8F98]">
                        <span className="text-[#7CFF6B] font-semibold">
                          {exp.company}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{exp.type}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F2F2F2]">
                        {exp.role}
                      </h3>
                    </div>

                    <div className="font-mono text-xs text-[#8B8F98] tabular-nums shrink-0">
                      {exp.period}
                    </div>
                  </div>

                  {/* Narrative */}
                  <p className="text-base text-[#D1D5DB] leading-relaxed">
                    {exp.narrative}
                  </p>

                  {/* Key Deliverables */}
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[#8B8F98] uppercase tracking-wider block">
                      Key Engineering Deliverables
                    </span>
                    <ul className="space-y-2.5 text-sm sm:text-base text-[#D1D5DB]">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-3">
                          <span className="font-mono text-xs text-[#7CFF6B] mt-1 shrink-0">
                            0{hIdx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <NutshellText
                              blockId={`exp-${idx}-bullet-${hIdx}`}
                              as="span"
                              maxTriggers={2}
                              className="leading-relaxed"
                              text={h}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quiet Unboxed Stack Separator List */}
                  <div className="pt-4 border-t border-white/[0.08] font-mono text-xs text-[#8B8F98] flex flex-wrap items-center gap-x-2 gap-y-1">
                    {exp.technologies.map((t, tIdx) => (
                      <React.Fragment key={t}>
                        <span className="text-[#D1D5DB]">{t}</span>
                        {tIdx < exp.technologies.length - 1 && (
                          <span aria-hidden="true" className="text-white/20">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
