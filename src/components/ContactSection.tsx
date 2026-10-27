import React, { useState } from 'react';
import {
  Mail,
  ExternalLink,
  Github,
  Linkedin,
  ArrowRight,
  Copy,
  Check,
  Send,
  FileText,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ScrollReveal, SwiftRollLabel } from './ScrollReveal';

interface ContactSectionProps {
  onOpenResume?: () => void;
}

const isValidEmail = (email: string): boolean => {
  if (!email || email.length > 254) return false;
  for (let i = 0; i < email.length; i++) {
    const code = email.charCodeAt(i);
    if (code <= 32 || code === 127) return false;
  }
  const atIndex = email.indexOf('@');
  if (atIndex <= 0 || atIndex !== email.lastIndexOf('@')) return false;
  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.indexOf('.');
  return dotIndex > 0 && !domain.startsWith('.') && !domain.endsWith('.') && !domain.includes('..');
};

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenResume,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('AI Systems / LLM Engineering Role');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Clipboard fallback
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = senderName.trim();
    const trimmedEmail = senderEmail.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setFormError('Please enter your name.');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setFormError('Please provide a valid email address.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setFormError('Please include a brief message (at least 10 characters).');
      return;
    }

    const subject = encodeURIComponent(
      `[Portfolio Inquiry] ${inquiryTopic} — from ${trimmedName}`
    );
    const body = encodeURIComponent(
      `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nTopic: ${inquiryTopic}\n\nMessage:\n${trimmedMessage}`
    );

    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink);

    setFormSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="py-28 lg:py-32 border-t border-white/[0.08] bg-[#08090B] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Editorial Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
              09 · Collaboration &amp; Engineering Inquiries
            </div>
            <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
              Let&apos;s Build Reliable AI Systems Together
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98]">
            Bengaluru, India · Open to AI / ML &amp; Full-Stack Systems Roles
          </div>
        </ScrollReveal>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Narrative & Direct Endpoints */}
          <ScrollReveal className="lg:col-span-6 space-y-8">
            <p className="text-base sm:text-lg text-[#D1D5DB] leading-relaxed max-w-[62ch]">
              Whether you are hiring for AI Systems Engineering, deploying production Large Language Models, fine-tuning adapters via LoRA/QLoRA, or architecting resilient .NET 8 microservices—reach out directly below.
            </p>

            {/* Hairlined 2x2 Endpoint Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border border-white/[0.08] rounded-2xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] bg-[#101216]">
              {/* Interactive Email Copy Endpoint */}
              <div className="p-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] text-[#8B8F98] uppercase block">
                    Direct Email
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
                  aria-label="Copy email address to clipboard"
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
                  Phone &amp; Base
                </span>
                <div className="text-sm sm:text-base font-semibold text-[#F2F2F2] mt-0.5 font-mono tabular-nums">
                  {PERSONAL_INFO.phone} · {PERSONAL_INFO.location}
                </div>
              </div>
            </div>

            {/* Primary CTAs */}
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
                <SwiftRollLabel label="GitHub Profile" hoverLabel="KN-Vignesh" />
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group swift-spring-btn px-5 py-3 rounded-xl border border-white/[0.1] bg-[#101216] text-[#F2F2F2] hover:border-[#6EA8FE]/50 font-semibold flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4 text-[#6EA8FE]" />
                <SwiftRollLabel label="LinkedIn" />
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onOpenResume && (
                <button
                  type="button"
                  onClick={onOpenResume}
                  className="group swift-spring-btn px-5 py-3 rounded-xl border border-white/[0.1] bg-[#101216] text-[#F2F2F2] hover:border-[#7CFF6B]/50 font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#7CFF6B]" />
                  <span>Inspect Résumé</span>
                </button>
              )}
            </div>

            {/* Engineering Principles Summary */}
            <div className="bg-[#101216] border border-white/[0.08] rounded-2xl p-6 space-y-3">
              <div className="font-mono text-xs text-[#7CFF6B] uppercase tracking-wider font-semibold">
                Core Engineering Commitments
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#D1D5DB] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[#7CFF6B] font-bold">01</span>
                  <span>Holdout evaluation before production claims.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[#7CFF6B] font-bold">02</span>
                  <span>Deterministic AST guardrails over raw prompts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[#7CFF6B] font-bold">03</span>
                  <span>Parameter efficiency (LoRA / QLoRA) first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[#7CFF6B] font-bold">04</span>
                  <span>Strict API contracts and CI quality gates.</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Right Direct Inquiry Composer Form */}
          <ScrollReveal delay={0.08} className="lg:col-span-6">
            <form
              onSubmit={handleInquirySubmit}
              noValidate
              className="bg-[#101216] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-lg font-bold text-[#F2F2F2]">
                    Direct Technical Inquiry
                  </h3>
                  <p className="text-xs text-[#8B8F98] mt-0.5">
                    Formats a structured inquiry directly to {PERSONAL_INFO.email}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-[#7CFF6B]">
                  Validated Dispatch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-sender-name"
                    className="block font-mono text-xs text-[#D1D5DB] mb-1.5"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-sender-name"
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-white/[0.1] text-sm text-[#F2F2F2] placeholder-[#8B8F98]/60 focus:border-[#7CFF6B] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-sender-email"
                    className="block font-mono text-xs text-[#D1D5DB] mb-1.5"
                  >
                    Your Email *
                  </label>
                  <input
                    id="contact-sender-email"
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-white/[0.1] text-sm text-[#F2F2F2] placeholder-[#8B8F98]/60 focus:border-[#7CFF6B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-inquiry-topic"
                  className="block font-mono text-xs text-[#D1D5DB] mb-1.5"
                >
                  Inquiry Scope
                </label>
                <select
                  id="contact-inquiry-topic"
                  value={inquiryTopic}
                  onChange={(e) => setInquiryTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-white/[0.1] text-sm text-[#F2F2F2] focus:border-[#7CFF6B] focus:outline-none transition-colors"
                >
                  <option value="AI Systems / LLM Engineering Role">
                    AI Systems / LLM Engineering Role
                  </option>
                  <option value="Full-Stack .NET 8 & Cloud Architecture">
                    Full-Stack .NET 8 &amp; Cloud Architecture
                  </option>
                  <option value="PEFT / QLoRA Fine-Tuning Collaboration">
                    PEFT / QLoRA Fine-Tuning Collaboration
                  </option>
                  <option value="General Technical Inquiry">
                    General Technical Inquiry
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs text-[#D1D5DB] mb-1.5"
                >
                  Project or Role Context *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share role details, system requirements, or architecture scope..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-white/[0.1] text-sm text-[#F2F2F2] placeholder-[#8B8F98]/60 focus:border-[#7CFF6B] focus:outline-none transition-colors resize-y"
                />
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-xs text-[#FF6B6B] font-mono"
                >
                  {formError}
                </div>
              )}

              {formSubmitted && !formError && (
                <div
                  role="status"
                  className="p-3 rounded-xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 text-xs text-[#7CFF6B] font-mono"
                >
                  Your email client has been opened with the pre-filled inquiry to {PERSONAL_INFO.email}.
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="font-mono text-[11px] text-[#8B8F98]">
                  Direct mailto dispatch · Zero third-party trackers
                </span>
                <button
                  type="submit"
                  className="swift-spring-btn px-6 py-3 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold text-xs sm:text-sm hover:bg-[#7CFF6B]/95 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Compose &amp; Send</span>
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
