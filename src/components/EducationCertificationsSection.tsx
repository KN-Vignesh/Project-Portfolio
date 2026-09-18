import React from 'react';
import { Award, GraduationCap, Compass, CheckCircle, FileDown, FileText } from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';

interface EducationCertificationsSectionProps {
  onOpenResume?: () => void;
}

export const EducationCertificationsSection: React.FC<EducationCertificationsSectionProps> = ({ onOpenResume }) => {
  const directions = [
    { title: "AI SOFTWARE ENGINEER", desc: "Building bridge systems connecting deep learning models to robust enterprise web/cloud backends." },
    { title: "GENERATIVE AI ENGINEER", desc: "Fine-tuning open-weight LLMs, low-bit quantization, and orchestrating contextual RAG systems." },
    { title: "AI APPLICATIONS ENGINEER", desc: "Developing deterministic agent workflows with tool invocation, evaluation, and production monitoring." },
    { title: "ML & MODEL ENGINEER", desc: "Adapting Transformer architectures, optimizing loss convergence, and validating predictive scorecards." }
  ];

  return (
    <section id="education" className="py-24 border-t border-[#24272D] bg-[#08090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [07] // CREDENTIALS & TARGET TRAJECTORY
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F2F2]">
              EDUCATION & CERTIFICATIONS
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98] mt-2 sm:mt-0">
            OFFICIAL CERTIFIED CREDENTIALS
          </div>
        </div>

        {/* Certifications & Degrees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {CERTIFICATIONS.map((cert, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#24272D] bg-[#101216] p-6 hover:border-[#7CFF6B]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded border border-[#24272D] bg-[#15181D] flex items-center justify-center text-[#7CFF6B]">
                    {cert.title.includes('Degree') || cert.title.includes('Bachelor') ? (
                      <GraduationCap className="w-5 h-5" />
                    ) : (
                      <Award className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-[#8B8F98] px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D]">
                    {cert.code}
                  </span>
                </div>

                <h3 className="font-mono font-bold text-base text-[#F2F2F2] mb-2 leading-snug">
                  {cert.title}
                </h3>
                <div className="text-xs text-[#7CFF6B] font-mono mb-2">
                  {cert.issuer}
                </div>
              </div>

              <div className="pt-4 border-t border-[#24272D] font-mono text-xs text-[#8B8F98] flex items-center justify-between">
                <span>VALIDITY</span>
                <span className="text-[#F2F2F2]">{cert.period}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Target Engineering Direction Box */}
        <div className="rounded-xl border border-[#24272D] bg-[#101216] p-6 sm:p-8 font-mono">
          <div className="flex items-center space-x-2 text-xs text-[#7CFF6B] uppercase font-bold tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>CURRENT ENGINEERING DIRECTION & TARGET SCOPE</span>
          </div>
          <p className="text-xs text-[#8B8F98] mb-6">
            Active areas of specialization, architecture focus, and technical contribution:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {directions.map((dir, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#08090B] border border-[#24272D] hover:border-[#6EA8FE]/40 transition-colors space-y-2"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2F2F2]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#7CFF6B]" />
                  <span>{dir.title}</span>
                </div>
                <p className="text-[11px] text-[#8B8F98] leading-relaxed">
                  {dir.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Resume Download Banner */}
          <div className="mt-8 pt-6 border-t border-[#24272D] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-[#7CFF6B]/40 bg-[#7CFF6B]/10 flex items-center justify-center text-[#7CFF6B]">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-[#F2F2F2] font-bold block">COMPLETE CURRICULUM VITAE</span>
                <span className="text-[#8B8F98]">ATS-ready format with detailed engineering systems history</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {onOpenResume && (
                <button
                  onClick={onOpenResume}
                  className="flex-1 sm:flex-none px-4 py-2 rounded border border-[#24272D] bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] hover:border-[#7CFF6B] text-xs transition-colors cursor-pointer"
                >
                  PREVIEW RESUME
                </button>
              )}
              <a
                href="/vignesh-k-n-resume.pdf"
                download="Vignesh_K_N_Resume.pdf"
                className="flex-1 sm:flex-none px-4 py-2 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 text-xs transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#7CFF6B]/15"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
