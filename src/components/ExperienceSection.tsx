import React from 'react';
import { Briefcase, Calendar, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-24 border-t border-[#24272D] bg-[#101216]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [06] // PROFESSIONAL TRACK RECORD
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F2F2]">
              WORK EXPERIENCE
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98] mt-2 sm:mt-0">
            4+ YEARS // ENTERPRISE TO PRODUCTION AI
          </div>
        </div>

        {/* Technical Progression Timeline Bar */}
        <div className="mb-14 p-6 rounded-xl border border-[#24272D] bg-[#08090B] font-mono">
          <div className="text-xs text-[#7CFF6B] uppercase font-bold tracking-wider mb-4">
            CHRONOLOGICAL TECHNICAL TRAJECTORY
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
              <span className="text-[#7CFF6B] font-bold text-sm">2022</span>
              <div className="text-xs text-[#F2F2F2] font-semibold">SOFTWARE / DATA FOUNDATIONS</div>
              <p className="text-[11px] text-[#8B8F98]">
                Python & C# jobs, ETL data cleaning, API contracts, Cosmos DB.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
              <span className="text-[#6EA8FE] font-bold text-sm">2022–2024</span>
              <div className="text-xs text-[#F2F2F2] font-semibold">CLOUD, APIs & MLOps</div>
              <p className="text-[11px] text-[#8B8F98]">
                Serverless Azure Functions, Vector Search, PAM deployment (6K users), Jenkins CI/CD.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
              <span className="text-[#FFB86B] font-bold text-sm">2024–PRESENT</span>
              <div className="text-xs text-[#F2F2F2] font-semibold">AGENTIC AI & LLM APIs</div>
              <p className="text-[11px] text-[#8B8F98]">
                Enterprise .NET Core 8 & Angular 18 microservices, RLHF evaluation, Agentic workflows.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#15181D] border border-[#7CFF6B]/50 space-y-1">
              <span className="text-[#7CFF6B] font-bold text-sm">NOW</span>
              <div className="text-xs text-[#7CFF6B] font-semibold">AI SOFTWARE ENGINEERING</div>
              <p className="text-[11px] text-[#8B8F98]">
                PEFT (LoRA/QLoRA), RAG architectures, model adaptation, production inference.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Experience Cards */}
        <div className="space-y-8">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#24272D] bg-[#101216] p-6 sm:p-8 hover:border-[#7CFF6B]/50 transition-colors"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#24272D]">
                <div>
                  <div className="flex items-center space-x-2 font-mono text-xs text-[#7CFF6B] mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="font-bold">{exp.company}</span>
                    <span className="text-[#24272D]">|</span>
                    <span className="text-[#8B8F98]">{exp.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F2F2F2]">
                    {exp.role}
                  </h3>
                </div>

                <div className="mt-2 sm:mt-0 font-mono text-xs text-[#8B8F98] flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Narrative */}
              <p className="text-sm text-[#8B8F98] mb-5 leading-relaxed">
                {exp.narrative}
              </p>

              {/* Verified Achievements List */}
              <div className="space-y-2.5 mb-6">
                <span className="font-mono text-xs text-[#7CFF6B] uppercase font-semibold block">
                  KEY RESPONSIBILITIES & DELIVERABLES:
                </span>
                <ul className="space-y-2 text-sm text-[#8B8F98]">
                  {exp.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5">
                      <span className="text-[#7CFF6B] mt-1 text-xs">▸</span>
                      <span className="text-[#F2F2F2] leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Used */}
              <div className="pt-4 border-t border-[#24272D] flex flex-wrap gap-1.5">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded bg-[#08090B] border border-[#24272D] font-mono text-xs text-[#8B8F98]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
