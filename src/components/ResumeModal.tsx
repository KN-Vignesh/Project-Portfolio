import React, { useState } from 'react';
import { X, Download, FileText, Printer, Check, ExternalLink, ShieldAlert, Cpu, Terminal, Briefcase, GraduationCap } from 'lucide-react';
import { RESUME_DATA } from '../data/portfolioData';
import { ProjectItem } from '../types';
import { generateAndDownloadResumePdf, getPlainTextResume } from '../utils/resumeGenerator';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  projectsLoading: boolean;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, projects, projectsLoading }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [includeProjects, setIncludeProjects] = useState(true);

  if (!isOpen) return null;

  const handleDownload = (withProjects: boolean = includeProjects) => {
    setDownloading(true);
    try {
      const fileName = 'Vignesh_K_N_Resume.pdf';
      generateAndDownloadResumePdf(fileName, { includeProjects: withProjects, projects });
    } catch (err) {
      console.warn('Client-side PDF generation fallback:', err);
      const link = document.createElement('a');
      link.href = withProjects ? '/api/resume/download' : '/vignesh-k-n-resume-original.pdf';
      link.download = 'Vignesh_K_N_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleCopyText = () => {
    const text = getPlainTextResume(projects);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#08090B]/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#101216] border border-[#24272D] rounded-xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-[#24272D] bg-[#08090B]">
          <div className="flex items-center space-x-3 font-mono text-xs">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#7CFF6B]" />
            <span className="font-bold text-[#F2F2F2]">CURRICULUM VITAE // ATS FORMAT</span>
            <span className="hidden sm:inline text-[#24272D]">|</span>
            <span className="hidden sm:inline text-[#8B8F98]">VIGNESH KN</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#15181D] p-0.5 rounded border border-[#24272D] font-mono text-[11px]">
              <button
                onClick={() => setIncludeProjects(true)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  includeProjects
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
                title="Include projects fetched from GitHub ranked by severity"
              >
                WITH PROJECTS (2P)
              </button>
              <button
                onClick={() => setIncludeProjects(false)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  !includeProjects
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
                title="Exact 1-page resume matching the attached PDF"
              >
                ORIGINAL (1P)
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={() => handleDownload(includeProjects)}
              disabled={downloading}
              className="px-3.5 py-1.5 rounded bg-[#7CFF6B] text-[#08090B] font-mono text-xs font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center gap-1.5 shadow-sm shadow-[#7CFF6B]/20 cursor-pointer"
              title="Download PDF version of Resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'GENERATING...' : 'DOWNLOAD PDF'}</span>
            </button>

            {/* Direct Open PDF in New Tab */}
            <a
              href={includeProjects ? '/api/resume/view' : '/vignesh-k-n-resume-original.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-[#24272D] bg-[#15181D] text-[#8B8F98] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/40 font-mono text-xs transition-colors"
              title="Open PDF file in new browser tab"
            >
              <span>OPEN PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Print Resume */}
            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#24272D] bg-[#15181D] text-[#8B8F98] hover:text-[#F2F2F2] font-mono text-xs transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>

            {/* Copy Plain Text */}
            <button
              onClick={handleCopyText}
              className="px-2.5 py-1.5 rounded border border-[#24272D] bg-[#15181D] text-[#8B8F98] hover:text-[#F2F2F2] font-mono text-xs transition-colors flex items-center gap-1 cursor-pointer"
              title="Copy plain text for ATS screening"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#7CFF6B]" /> : <FileText className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'COPIED!' : 'TXT'}</span>
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

        {/* Scrollable Printable Resume Sheet (Formatted exactly as the attached PDF) */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-sm text-[#8B8F98] font-sans selection:bg-[#7CFF6B]/20 bg-[#0C0E12]">
          
          {/* Header matching the attached PDF format */}
          <div className="text-center pb-4 border-b border-[#24272D]">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2F2F2] uppercase">
              {RESUME_DATA.header.name}
            </h1>
            <div className="font-mono text-xs text-[#A1A7B5] mt-1.5 space-y-0.5">
              <div>
                {RESUME_DATA.header.phone} &nbsp;|&nbsp; {RESUME_DATA.header.email} &nbsp;|&nbsp; {RESUME_DATA.header.location} &nbsp;|
              </div>
              <div className="pt-0.5">
                <a href={`https://${RESUME_DATA.header.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#7CFF6B] underline">
                  {RESUME_DATA.header.linkedin}
                </a>
                &nbsp;|&nbsp;
                <a href={`https://${RESUME_DATA.header.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#7CFF6B] underline">
                  {RESUME_DATA.header.github}
                </a>
                &nbsp;|&nbsp;
                <a href={`https://${RESUME_DATA.header.projects}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#7CFF6B] underline">
                  {RESUME_DATA.header.projects}
                </a>
              </div>
            </div>
          </div>

          {/* Section: Professional Summary */}
          <div>
            <div className="pb-1 mb-2 border-b border-[#24272D]">
              <h2 className="text-sm font-bold text-[#F2F2F2] uppercase tracking-wide">
                Professional Summary
              </h2>
            </div>
            <p className="leading-relaxed text-[#D1D5DB] text-xs sm:text-sm text-justify">
              {RESUME_DATA.professionalSummary}
            </p>
          </div>

          {/* Section: Technical Skills (exact 2-column bordered table) */}
          <div>
            <div className="pb-1 mb-2 border-b border-[#24272D]">
              <h2 className="text-sm font-bold text-[#F2F2F2] uppercase tracking-wide">
                Technical Skills
              </h2>
            </div>
            <div className="border border-[#24272D] rounded-lg overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  {RESUME_DATA.technicalSkillsTable.map((row, idx) => (
                    <tr key={idx} className="border-b border-[#24272D] last:border-b-0 hover:bg-[#15181D]/50 transition-colors">
                      <td className="w-1/4 sm:w-1/5 py-2 px-3 font-bold text-[#F2F2F2] bg-[#101216] border-r border-[#24272D] align-top font-mono text-[11px]">
                        {row.category}
                      </td>
                      <td className="py-2 px-3 text-[#D1D5DB] leading-relaxed">
                        {row.skills}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Professional Experience */}
          <div>
            <div className="pb-1 mb-3 border-b border-[#24272D]">
              <h2 className="text-sm font-bold text-[#F2F2F2] uppercase tracking-wide">
                Professional Experience
              </h2>
            </div>

            <div className="space-y-4">
              {RESUME_DATA.professionalExperience.map((exp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="font-bold text-xs sm:text-sm text-[#F2F2F2]">
                      {exp.company} — <span className="font-semibold text-[#A1A7B5]">{exp.role}</span>
                    </div>
                    <div className="font-mono text-xs text-[#7CFF6B] sm:text-right font-semibold">
                      {exp.period}
                    </div>
                  </div>

                  <ul className="space-y-1 text-xs text-[#D1D5DB]">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#7CFF6B] mt-0.5 text-[10px]">●</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Certifications & Education */}
          <div>
            <div className="pb-1 mb-2 border-b border-[#24272D]">
              <h2 className="text-sm font-bold text-[#F2F2F2] uppercase tracking-wide">
                Certifications & Education
              </h2>
            </div>
            <div className="space-y-1.5 text-xs text-[#D1D5DB]">
              {RESUME_DATA.certificationsAndEducation.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#7CFF6B] text-[10px]">●</span>
                    <span className="text-[#F2F2F2] font-medium">{item.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#A1A7B5] font-semibold sm:text-right pl-4 sm:pl-0">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Projects (Ranked by Severity from GitHub) */}
          {includeProjects && (
            <div className="pt-4 border-t-2 border-dashed border-[#24272D]">
              <div className="flex items-center justify-between pb-1 mb-3 border-b border-[#24272D]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#7CFF6B]" />
                  <h2 className="text-sm font-bold text-[#F2F2F2] uppercase tracking-wide">
                    Key Engineering & AI Projects (Ranked by Project Severity)
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-[#7CFF6B]">
                  SOURCED FROM GITHUB
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                {projectsLoading ? <div className="font-mono text-xs text-[#7CFF6B]">PROJECT REGISTRY // LOADING...</div> : projects.map((p) => {
                  const isCrit = p.severityTier === 'CRITICAL';
                  const isHigh = p.severityTier === 'HIGH';

                  return (
                    <div 
                      key={p.id} 
                      className="p-3 rounded-lg bg-[#101216] border border-[#24272D] hover:border-[#7CFF6B]/50 transition-colors space-y-1.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#F2F2F2] text-xs sm:text-sm">
                            {p.title}
                          </span>
                          <span 
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                              isCrit 
                                ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                                : isHigh 
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
                                : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            {p.severityLevel} · {p.severityTier}
                          </span>
                        </div>

                        <a 
                          href={p.repository} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-mono text-[11px] text-[#6EA8FE] hover:underline flex items-center gap-1"
                        >
                          <span>Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="font-mono text-[11px] text-[#8B8F98]">
                        <span className="text-[#A1A7B5] font-semibold">Tech Stack:</span> {p.technologies.join(', ')}
                      </div>

                      <div className="font-sans text-[11px] text-[#A1A7B5] italic">
                        <span className="font-semibold text-[#F2F2F2]">Impact:</span> {p.severityImpact || p.description}
                      </div>

                      <ul className="space-y-1 pt-1 text-[#D1D5DB]">
                        {(p.sections?.engineeringDecisions || []).slice(0, 2).map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-[#7CFF6B] mt-0.5 text-[10px]">●</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#24272D] bg-[#08090B] font-mono text-xs">
          <span className="text-[#8B8F98]">
            Format: {includeProjects ? 'Full 2-Page CV (Projects Included)' : 'Original 1-Page Resume (Matches Attached PDF)'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 text-[#8B8F98] hover:text-[#F2F2F2] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>
            <button
              onClick={() => handleDownload(includeProjects)}
              className="px-4 py-2 rounded bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#7CFF6B]/20"
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
