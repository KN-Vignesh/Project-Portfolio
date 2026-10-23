import React, { useState } from 'react';
import {
  Mail,
  ExternalLink,
  Github,
  Linkedin,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ScrollReveal, SwiftRollLabel } from './ScrollReveal';

interface ContactSectionProps {
  onOpenResume?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <section
      id="contact"
      className="py-28 lg:py-32 border-t border-white/[0.08] bg-[#08090B] relative overflow-hidden"
    >
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#7CFF6B]/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Editorial Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
              08 · Collaboration &amp; Engineering Inquiries
            </div>
            <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
              Let&apos;s Build Reliable AI Systems Together
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98]">
            Bengaluru, India · Direct Response
          </div>
        </ScrollReveal>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Narrative & Direct Endpoints */}
          <ScrollReveal className="lg:col-span-7 space-y-8">
            <p className="text-base sm:text-lg text-[#D1D5DB] leading-relaxed max-w-[62ch]">
              Whether you are deploying production Large Language Models, integrating RAG pipelines, fine-tuning adapters via LoRA/QLoRA, or architecting resilient .NET 8 microservices—reach out directly below.
            </p>

            {/* Hairlined 2x2 Endpoint Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border border-white/[0.08] rounded-2xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] bg-[#101216]">
              {/* Interactive Email Copy Endpoint */}
              <div className="p-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] text-[#8B8F98] uppercase block">
                    DIRECT EMAIL
                  </span>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-sm sm:text-base font-semibold text-[#F2F2F2] hover:text-[#7CFF6B] transition-colors truncate block mt-0.5"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="swift-spring-btn p-2.5 rounded-xl bg-[#08090B] border border-white/[0.08] hover:border-[#7CFF6B]/50 text-[#D1D5DB] hover:text-[#7CFF6B] shrink-0 cursor-pointer"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-[#7CFF6B]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Phone & Location Endpoint */}
              <div className="p-5 flex flex-col justify-center">
                <span className="font-mono text-[10px] text-[#8B8F98] uppercase block">
                  PHONE &amp; BASE
                </span>
                <div className="text-sm sm:text-base font-semibold text-[#F2F2F2] mt-0.5 font-mono tabular-nums">
                  {PERSONAL_INFO.phone} · {PERSONAL_INFO.location}
                </div>
              </div>
            </div>

            {/* Primary CTAs with Dual-Layer Text Roll */}
            <div className="flex flex-wrap gap-3 pt-1 text-xs sm:text-sm">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="group swift-spring-btn px-6 py-3 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/95 flex items-center gap-2 shadow-lg shadow-[#7CFF6B]/10"
              >
                <Mail className="w-4 h-4" />
                <SwiftRollLabel
                  label="Send Direct Email"
                  hoverLabel={PERSONAL_INFO.email}
                />
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group swift-spring-btn px-5 py-3 rounded-xl border border-white/[0.1] bg-[#101216] text-[#F2F2F2] hover:border-[#7CFF6B]/50 font-semibold flex items-center gap-2"
              >
                <Github className="w-4 h-4 text-[#7CFF6B]" />
                <SwiftRollLabel label="View GitHub" hoverLabel="KN-Vignesh" />
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group swift-spring-btn px-5 py-3 rounded-xl border border-white/[0.1] bg-[#101216] text-[#F2F2F2] hover:border-[#6EA8FE]/50 font-semibold flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4 text-[#6EA8FE]" />
                <SwiftRollLabel label="Connect on LinkedIn" />
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </ScrollReveal>

          {/* Right Engineering Principles Card */}
          <ScrollReveal delay={0.1} className="lg:col-span-5">
            <div className="bg-[#101216] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider font-semibold pb-3 border-b border-white/[0.08]">
                Engineering Principles
              </div>

              <ol className="space-y-3.5 text-sm sm:text-base text-[#D1D5DB] leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#7CFF6B] font-bold mt-1">
                    01
                  </span>
                  <span>Code without holdout metrics is just speculation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#7CFF6B] font-bold mt-1">
                    02
                  </span>
                  <span>
                    Models belong in deterministic production pipelines, not notebook graveyards.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#7CFF6B] font-bold mt-1">
                    03
                  </span>
                  <span>
                    Parameter efficiency (LoRA / QLoRA) beats brute-force scaling.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#7CFF6B] font-bold mt-1">
                    04
                  </span>
                  <span>
                    Software engineering rigor is what makes AI systems reliable.
                  </span>
                </li>
              </ol>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
