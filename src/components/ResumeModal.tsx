import React, { useState } from 'react';
import { X, Download, FileText, Printer, Check, ExternalLink, Terminal, Briefcase, GraduationCap, Award, Cpu } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES, CERTIFICATIONS, STACK_CATEGORIES } from '../data/portfolioData';
import { generateAndDownloadResumePdf, getPlainTextResume } from '../utils/resumeGenerator';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    try {
      // First try direct download link to public PDF
      const link = document.createElement('a');
      link.href = '/vignesh-k-n-resume.pdf';
      link.download = 'Vignesh_K_N_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback to client-side jsPDF generator
      generateAndDownloadResumePdf('Vignesh_K_N_Resume.pdf');
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleCopyText = () => {
    const text = getPlainTextResume();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#08090B]/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#101216] border border-[#24272D] rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#24272D] bg-[#08090B]">
          <div className="flex items-center space-x-3 font-mono text-xs">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#7CFF6B]" />
            <span className="font-bold text-[#F2F2F2]">CURRICULUM VITAE // ATS-ALIGNED</span>
            <span className="hidden sm:inline text-[#24272D]">|</span>
            <span className="hidden sm:inline text-[#8B8F98]">VIGNESH K N (AI SOFTWARE ENGINEER)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-3.5 py-1.5 rounded bg-[#7CFF6B] text-[#08090B] font-mono text-xs font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center gap-1.5 shadow-sm shadow-[#7CFF6B]/20 cursor-pointer"
              title="Download PDF version of Resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'GENERATING...' : 'DOWNLOAD PDF'}</span>
            </button>

            {/* Direct Link to PDF */}
            <a
              href="/vignesh-k-n-resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded border border-[#24272D] bg-[#15181D] text-[#8B8F98] hover:text-[#7CFF6B] font-mono text-xs transition-colors"
              title="Open raw PDF file in new tab"
            >
              <span>OPEN PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Copy Plain Text */}
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded border border-[#24272D] bg-[#15181D] text-[#8B8F98] hover:text-[#F2F2F2] font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy plain text for ATS screening / paste"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#7CFF6B]" /> : <FileText className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'COPIED!' : 'COPY TXT'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded border border-[#24272D] bg-[#15181D] text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#24272D] transition-colors ml-1 cursor-pointer"
              aria-label="Close resume dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Resume Sheet Preview */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-sm text-[#8B8F98] font-sans selection:bg-[#7CFF6B]/20">
          
          {/* Header */}
          <div className="pb-6 border-b border-[#24272D]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2F2F2]">
                  {PERSONAL_INFO.name}
                </h1>
                <p className="font-mono text-xs sm:text-sm text-[#7CFF6B] font-semibold mt-1">
                  AI SOFTWARE ENGINEER | MACHINE LEARNING & BACKEND SYSTEMS
                </p>
              </div>
              <div className="font-mono text-xs text-[#8B8F98] text-left sm:text-right space-y-0.5">
                <div>{PERSONAL_INFO.location}</div>
                <div>{PERSONAL_INFO.phone}</div>
                <div>{PERSONAL_INFO.email}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-[#24272D]/50 font-mono text-xs">
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#6EA8FE] hover:underline flex items-center gap-1">
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[#24272D]">•</span>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="text-[#7CFF6B] hover:underline flex items-center gap-1">
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[#24272D]">•</span>
              <a href={PERSONAL_INFO.projectsRepo} target="_blank" rel="noopener noreferrer" className="text-[#8B8F98] hover:text-[#F2F2F2] flex items-center gap-1">
                <span>Projects Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Section: Professional Summary */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#24272D]">
              <Terminal className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F2F2F2]">
                Professional Summary
              </h2>
            </div>
            <p className="leading-relaxed text-[#D1D5DB] text-sm">
              Results-driven AI Software Engineer with <strong className="text-[#F2F2F2]">4+ years of hands-on experience</strong> in full-stack engineering, cloud automation, and high-throughput microservices, now focused on production-oriented AI, Generative AI, LLM orchestration, RAG architectures, parameter-efficient fine-tuning (LoRA/QLoRA), and containerized inference APIs. Proven track record of architecting scalable enterprise modules with .NET Core 8, Angular 18, Azure, and Python, combining rigorous software engineering standards with machine learning and agentic workflows.
            </p>
          </div>

          {/* Section: Technical Skills */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#24272D]">
              <Cpu className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F2F2F2]">
                Technical Skills & Expertise
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[#08090B] border border-[#24272D]">
                <span className="font-mono text-[#7CFF6B] block font-semibold mb-1">LANGUAGES & CORE</span>
                <span className="text-[#D1D5DB]">Python, C#, .NET Core 8, SQL, JavaScript, TypeScript, HTML5, CSS3, Git</span>
              </div>
              <div className="p-3 rounded bg-[#08090B] border border-[#24272D]">
                <span className="font-mono text-[#7CFF6B] block font-semibold mb-1">MACHINE LEARNING & DEEP LEARNING</span>
                <span className="text-[#D1D5DB]">Scikit-learn, PyTorch, TensorFlow, Transformers, CNN, BERT, Decision Forests, XGBoost, Cross-Validation</span>
              </div>
              <div className="p-3 rounded bg-[#08090B] border border-[#24272D]">
                <span className="font-mono text-[#6EA8FE] block font-semibold mb-1">GENERATIVE AI & LLMs</span>
                <span className="text-[#D1D5DB]">Large Language Models, PEFT / LoRA, QLoRA (4-bit NF4), RAG Pipelines, Vector Search, FAISS, LangChain, Prompt Design</span>
              </div>
              <div className="p-3 rounded bg-[#08090B] border border-[#24272D]">
                <span className="font-mono text-[#6EA8FE] block font-semibold mb-1">CLOUD, APIS & BACKEND</span>
                <span className="text-[#D1D5DB]">FastAPI, ASP.NET MVC, RESTful APIs, Azure Functions, Azure Service Bus, Azure Cosmos DB, MySQL, Docker</span>
              </div>
            </div>
          </div>

          {/* Section: Professional Experience */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#24272D]">
              <Briefcase className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F2F2F2]">
                Work Experience
              </h2>
            </div>

            <div className="space-y-6">
              {EXPERIENCES.map((exp, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-[#F2F2F2]">{exp.role}</span>
                      <span className="text-[#7CFF6B] font-medium ml-2">— {exp.company}</span>
                    </div>
                    <span className="font-mono text-xs text-[#8B8F98]">{exp.period} | Bengaluru, India</span>
                  </div>

                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#D1D5DB]">
                    {exp.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#8B8F98]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Featured Projects */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#24272D]">
              <Award className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F2F2F2]">
                Selected Engineering & AI Projects
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded bg-[#08090B] border border-[#24272D]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#F2F2F2]">Intelligent Customer Churn Prediction</span>
                  <span className="font-mono text-[10px] text-[#7CFF6B]">FastAPI • Docker • Scikit-learn</span>
                </div>
                <p className="text-[#8B8F98] leading-relaxed">
                  End-to-end production ML pipeline analyzing telecom subscription patterns to forecast retention attrition. Features modular data validation, Scikit-learn preprocessing pipelines, multi-model evaluation, and low-latency FastAPI inference service packaged with Docker.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#08090B] border border-[#24272D]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#F2F2F2]">Qwen2.5-Coder LoRA Fine-Tuning & Quantization</span>
                  <span className="font-mono text-[10px] text-[#7CFF6B]">PyTorch • PEFT • LoRA / QLoRA</span>
                </div>
                <p className="text-[#8B8F98] leading-relaxed">
                  Parameter-Efficient Fine-Tuning (PEFT) on open-weight LLMs using rank-decomposed adapter matrices (LoRA) and 4-bit NormalFloat (NF4) quantization. Demonstrated &gt;70% VRAM memory reduction during training with preserved coding benchmark performance.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#08090B] border border-[#24272D]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#F2F2F2]">VERO — AI Code Analysis & Pull Request Intelligence</span>
                  <span className="font-mono text-[10px] text-[#7CFF6B]">GitHub API • SonarQube • Rule Engine</span>
                </div>
                <p className="text-[#8B8F98] leading-relaxed">
                  Evidence-based GitHub Pull Request engineering analysis platform combining AST diff parsing, SonarQube static quality checks, and structured LLM signals with a deterministic rule engine to deliver automated merge recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Education & Certifications */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#24272D]">
              <GraduationCap className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F2F2F2]">
                Education & Certifications
              </h2>
            </div>
            <div className="space-y-2 text-xs">
              {CERTIFICATIONS.map((cert, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <div>
                    <span className="font-medium text-[#F2F2F2]">{cert.title}</span>
                    <span className="text-[#8B8F98] ml-2">— {cert.issuer}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#7CFF6B]">{cert.period}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#24272D] bg-[#08090B] font-mono text-xs">
          <span className="text-[#8B8F98]">Format: Standard ATS 2-Page PDF</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 text-[#8B8F98] hover:text-[#F2F2F2] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD RESUME PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
