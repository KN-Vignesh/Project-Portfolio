import React from 'react';
import { Award, GraduationCap, Compass, CheckCircle } from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';

interface EducationCertificationsSectionProps {
  onOpenResume?: () => void;
}

export const EducationCertificationsSection: React.FC<
  EducationCertificationsSectionProps
> = () => {
  const directions = [
    {
      title: 'AI Software Engineer',
      desc: 'Building bridge systems connecting deep learning models to enterprise web and cloud backends.',
    },
    {
      title: 'Generative AI Engineer',
      desc: 'Fine-tuning open-weight LLMs, low-bit quantization, and orchestrating contextual RAG systems.',
    },
    {
      title: 'AI Applications Engineer',
      desc: 'Developing deterministic agent workflows with tool invocation, evaluation, and production monitoring.',
    },
    {
      title: 'ML & Model Engineer',
      desc: 'Adapting Transformer architectures, optimizing loss convergence, and validating predictive scorecards.',
    },
  ];

  return (
    <section
      id="education"
      className="py-24 lg:py-28 border-t border-white/[0.08] bg-[#08090B] relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
              07 · Credentials &amp; Specialization Scope
            </div>
            <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
              Education &amp; Certifications
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98]">
            Verified Academic &amp; Cloud Credentials
          </div>
        </ScrollReveal>

        {/* Certifications & Degrees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {CERTIFICATIONS.map((cert, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.05}>
              <div className="editorial-card rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-9 h-9 rounded-xl border border-white/[0.08] bg-[#15181D] flex items-center justify-center text-[#7CFF6B]">
                      {cert.title.includes('Degree') ||
                      cert.title.includes('Bachelor') ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-mono text-xs text-[#8B8F98]">
                      {cert.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-[#F2F2F2] mb-2 leading-snug">
                    {cert.title}
                  </h3>
                  <div className="text-xs text-[#7CFF6B] font-mono mb-3">
                    {cert.issuer}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] font-mono text-xs text-[#8B8F98] flex items-center justify-between">
                  <span>Issued / Period</span>
                  <span className="text-[#F2F2F2] tabular-nums">{cert.period}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Target Engineering Direction Box */}
        <ScrollReveal>
          <div className="rounded-2xl border border-white/[0.08] bg-[#101216] p-6 sm:p-8">
            <div className="flex items-center space-x-2 font-mono text-xs text-[#7CFF6B] uppercase font-bold tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Core Engineering Specializations</span>
            </div>
            <p className="text-sm text-[#8B8F98] mb-6">
              Active areas of specialization, architecture focus, and technical contribution:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {directions.map((dir, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#08090B] border border-white/[0.08] hover:border-[#6EA8FE]/40 transition-colors space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-[#F2F2F2]">
                    <CheckCircle className="w-4 h-4 text-[#7CFF6B] shrink-0" />
                    <span>{dir.title}</span>
                  </div>
                  <p className="text-xs text-[#8B8F98] leading-relaxed">
                    {dir.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
