import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, ArrowRight, Terminal, FileDown, FileText } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ContactSectionProps {
  onOpenResume?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenResume }) => {
  return (
    <section id="contact" className="py-24 border-t border-[#24272D] bg-[#08090B] relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#7CFF6B]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [08] // CONTACT & COLLABORATION
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F2F2F2]">
              LET'S BUILD SOMETHING INTELLIGENT.
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98] mt-2 sm:mt-0">
            CHANNELS // DIRECT RESPONSE
          </div>
        </div>

        {/* Contact Info & Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-[#8B8F98] leading-relaxed">
              Whether you are looking to deploy production-grade Large Language Models, integrate robust RAG data pipelines, fine-tune models via parameter-efficient techniques (LoRA/QLoRA), or build resilient AI microservices with 4+ years of software engineering rigor—let's connect.
            </p>

            <div className="p-5 rounded-xl border border-[#24272D] bg-[#101216] font-mono text-xs space-y-4">
              <div className="text-[#7CFF6B] font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>DIRECT VERIFIED ENDPOINTS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Email */}
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="p-3 rounded bg-[#08090B] border border-[#24272D] hover:border-[#7CFF6B] text-[#F2F2F2] hover:text-[#7CFF6B] transition-colors flex items-center space-x-3 group"
                >
                  <div className="w-8 h-8 rounded border border-[#24272D] bg-[#15181D] flex items-center justify-center text-[#7CFF6B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-[#8B8F98] block">EMAIL</span>
                    <span className="truncate block font-medium">{PERSONAL_INFO.email}</span>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="p-3 rounded bg-[#08090B] border border-[#24272D] hover:border-[#7CFF6B] text-[#F2F2F2] hover:text-[#7CFF6B] transition-colors flex items-center space-x-3 group"
                >
                  <div className="w-8 h-8 rounded border border-[#24272D] bg-[#15181D] flex items-center justify-center text-[#7CFF6B]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8F98] block">PHONE</span>
                    <span className="font-medium">{PERSONAL_INFO.phone}</span>
                  </div>
                </a>

                {/* Location */}
                <div className="p-3 rounded bg-[#08090B] border border-[#24272D] text-[#F2F2F2] flex items-center space-x-3">
                  <div className="w-8 h-8 rounded border border-[#24272D] bg-[#15181D] flex items-center justify-center text-[#6EA8FE]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8F98] block">LOCATION</span>
                    <span className="font-medium">{PERSONAL_INFO.location}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="p-3 rounded bg-[#08090B] border border-[#24272D] text-[#F2F2F2] flex items-center space-x-3">
                  <div className="w-8 h-8 rounded border border-[#24272D] bg-[#15181D] flex items-center justify-center text-[#7CFF6B]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8F98] block">STATUS</span>
                    <span className="font-medium text-[#7CFF6B]">AVAILABLE FOR IMPACT</span>
                  </div>
                </div>

                {/* Resume Download Card */}
                <div className="p-3 rounded bg-[#08090B] border border-[#7CFF6B]/30 text-[#F2F2F2] flex items-center justify-between col-span-1 sm:col-span-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded border border-[#7CFF6B]/40 bg-[#7CFF6B]/10 flex items-center justify-center text-[#7CFF6B]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7CFF6B] block font-mono font-semibold">CURRICULUM VITAE</span>
                      <span className="font-medium text-xs">Vignesh_K_N_Resume.pdf (ATS-Aligned)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onOpenResume && (
                      <button
                        onClick={onOpenResume}
                        className="px-3 py-1.5 rounded border border-[#24272D] bg-[#15181D] hover:bg-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] font-mono text-xs transition-colors cursor-pointer"
                      >
                        PREVIEW
                      </button>
                    )}
                    <a
                      href="/vignesh-k-n-resume.pdf"
                      download="Vignesh_K_N_Resume.pdf"
                      className="px-3 py-1.5 rounded bg-[#7CFF6B] text-[#08090B] font-mono text-xs font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center gap-1 shadow-sm shadow-[#7CFF6B]/20"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>DOWNLOAD</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs">
              {onOpenResume ? (
                <button
                  onClick={onOpenResume}
                  className="px-6 py-3 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center space-x-2 shadow-md shadow-[#7CFF6B]/15 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOWNLOAD RESUME (PDF)</span>
                </button>
              ) : (
                <a
                  href="/vignesh-k-n-resume.pdf"
                  download="Vignesh_K_N_Resume.pdf"
                  className="px-6 py-3 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center space-x-2 shadow-md shadow-[#7CFF6B]/15"
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOWNLOAD RESUME (PDF)</span>
                </a>
              )}

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded border border-[#24272D] bg-[#101216] text-[#F2F2F2] hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-colors flex items-center space-x-2"
              >
                <Github className="w-4 h-4" />
                <span>VIEW GITHUB</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded border border-[#6EA8FE]/40 bg-[#6EA8FE]/10 text-[#6EA8FE] hover:border-[#6EA8FE] transition-colors flex items-center space-x-2"
              >
                <Linkedin className="w-4 h-4" />
                <span>CONNECT ON LINKEDIN</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Terminal Identity Card */}
          <div className="lg:col-span-5 bg-[#101216] border border-[#24272D] rounded-xl p-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#24272D]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#FF6B6B]/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#FFB86B]/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#7CFF6B]/80 inline-block"></span>
              </div>
              <span className="text-[#8B8F98] text-[10px]">vignesh@ai-lab:~</span>
            </div>

            <div className="space-y-2 text-[#8B8F98] font-mono text-xs">
              <p className="text-[#7CFF6B]">$ cat engineering_manifesto.txt</p>
              <p className="text-[#F2F2F2]">
                1. Code without metrics is just speculation.
              </p>
              <p className="text-[#F2F2F2]">
                2. Models belong in production pipelines, not notebook graveyards.
              </p>
              <p className="text-[#F2F2F2]">
                3. Parameter efficiency is better than brute force scaling.
              </p>
              <p className="text-[#F2F2F2]">
                4. Software engineering fundamentals make AI reliable.
              </p>
              <p className="text-[#7CFF6B] pt-2">$ echo "Ready to engineer."</p>
              <p className="text-[#6EA8FE]">"Ready to engineer."</p>
            </div>

            <div className="pt-4 border-t border-[#24272D] text-[11px] text-[#8B8F98] flex items-center justify-between">
              <span>SECURITY HASH: SHA-256</span>
              <span className="text-[#7CFF6B]">VERIFIED PROFILE</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
