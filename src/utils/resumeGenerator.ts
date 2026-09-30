import { jsPDF } from 'jspdf';
import { RESUME_DATA } from '../data/portfolioData';
import { ProjectItem } from '../types';

export interface ResumePdfOptions {
  includeProjects?: boolean;
  projects?: ProjectItem[];
}

export function buildResumeDoc(options: ResumePdfOptions = { includeProjects: true }): jsPDF {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4', // 595.28 x 841.89 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2; // 523.28 pt

  let y = 34;

  // Exact standard typography and colors matching the official attached PDF
  const textDark: [number, number, number] = [15, 20, 25]; // #0F1419 Deep Black / Slate
  const textMuted: [number, number, number] = [75, 85, 99]; // #4B5563 Muted Gray
  const ruleDark: [number, number, number] = [50, 55, 65]; // Section border line
  const tableBorder: [number, number, number] = [180, 185, 195]; // Table grid line
  const badgeCritical: [number, number, number] = [185, 28, 28]; // SEV-1
  const badgeHigh: [number, number, number] = [180, 83, 9]; // SEV-2 / SEV-3
  const badgeMedium: [number, number, number] = [29, 78, 216]; // SEV-4 / SEV-5

  function addSectionHeader(title: string) {
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text(title, margin, y);

    y += 3;
    doc.setDrawColor(...ruleDark);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
  }

  // ================= PAGE 1 =================
  // Header matching the exact attached PDF
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...textDark);
  const nameStr = RESUME_DATA.header.name;
  doc.text(nameStr, pageWidth / 2, y, { align: 'center' });
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  const contactLine1 = `${RESUME_DATA.header.phone} | ${RESUME_DATA.header.email} | ${RESUME_DATA.header.location} |`;
  doc.text(contactLine1, pageWidth / 2, y, { align: 'center' });
  y += 11;

  const contactLine2 = `${RESUME_DATA.header.linkedin} | ${RESUME_DATA.header.github} | ${RESUME_DATA.header.projects}`;
  doc.text(contactLine2, pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setDrawColor(...ruleDark);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + contentWidth, y);
  y += 2;

  // --- PROFESSIONAL SUMMARY ---
  addSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  const summaryLines = doc.splitTextToSize(RESUME_DATA.professionalSummary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 11 + 2;

  // --- TECHNICAL SKILLS (5-row bordered table matching the attached PDF) ---
  addSectionHeader('Technical Skills');

  const col1Width = 120;
  const col2Width = contentWidth - col1Width;

  doc.setDrawColor(...tableBorder);
  doc.setLineWidth(0.6);

  RESUME_DATA.technicalSkillsTable.forEach((row) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const catLines = doc.splitTextToSize(row.category, col1Width - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const skillLines = doc.splitTextToSize(row.skills, col2Width - 10);

    const rowHeight = Math.max(catLines.length * 10, skillLines.length * 10) + 7;

    // Draw row cell boundaries
    doc.rect(margin, y, col1Width, rowHeight);
    doc.rect(margin + col1Width, y, col2Width, rowHeight);

    // Write category in col 1
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text(catLines, margin + 5, y + 10);

    // Write skills in col 2
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    doc.text(skillLines, margin + col1Width + 5, y + 10);

    y += rowHeight;
  });
  y += 4;

  // --- PROFESSIONAL EXPERIENCE ---
  addSectionHeader('Professional Experience');

  RESUME_DATA.professionalExperience.forEach((exp) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(...textDark);
    const expTitle = `${exp.company} — ${exp.role}`;
    doc.text(expTitle, margin, y);

    const periodWidth = doc.getTextWidth(exp.period);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(exp.period, margin + contentWidth - periodWidth, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textDark);

    exp.bullets.forEach((b) => {
      doc.text('●', margin + 4, y);
      const bLines = doc.splitTextToSize(b, contentWidth - 16);
      doc.text(bLines, margin + 14, y);
      y += bLines.length * 9.5 + 1.5;
    });
    y += 2.5;
  });

  // --- CERTIFICATIONS & EDUCATION ---
  addSectionHeader('Certifications & Education');

  RESUME_DATA.certificationsAndEducation.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...textDark);
    doc.text('●', margin + 4, y);

    doc.setFont('helvetica', 'normal');
    doc.text(item.title, margin + 14, y);

    doc.setFont('helvetica', 'bold');
    const pWidth = doc.getTextWidth(item.period);
    doc.text(item.period, margin + contentWidth - pWidth, y);
    y += 10.5;
  });

  // ================= PAGE 2: PROJECTS FROM GITHUB RANKED BY SEVERITY =================
  if (options.includeProjects) {
    doc.addPage();
    y = 34;

    // Page 2 Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text('VIGNESH KN', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textMuted);
    const p2Sub = 'KEY ENGINEERING & AI PROJECTS (RANKED BY PROJECT SEVERITY)';
    const p2SubWidth = doc.getTextWidth(p2Sub);
    doc.text(p2Sub, margin + contentWidth - p2SubWidth, y);
    y += 5;

    doc.setDrawColor(...ruleDark);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4;

    addSectionHeader('Projects & System Architectures (Sourced from GitHub)');

    (options.projects || []).forEach((p) => {
      // Determine badge color
      let badgeColor = badgeMedium;
      if (p.severityTier === 'CRITICAL') badgeColor = badgeCritical;
      else if (p.severityTier === 'HIGH') badgeColor = badgeHigh;

      // Title and Severity Badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2);
      doc.setTextColor(...textDark);
      doc.text(p.title, margin, y);

      const titleWidth = doc.getTextWidth(p.title);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(...badgeColor);
      doc.text(`[${p.severityLevel} · ${p.severityTier}]`, margin + titleWidth + 6, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...textMuted);
      const repoWidth = doc.getTextWidth(p.repository);
      doc.text(p.repository, margin + contentWidth - repoWidth, y);
      y += 10.5;

      // Tech Stack line
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(...textMuted);
      const stackText = `Tech Stack: ${p.technologies.join(', ')}`;
      const stackLines = doc.splitTextToSize(stackText, contentWidth - 8);
      doc.text(stackLines, margin + 6, y);
      y += stackLines.length * 9.5;

      // Bullets
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...textDark);
      (p.sections?.engineeringDecisions || []).slice(0, 2).forEach((b) => {
        doc.text('●', margin + 6, y);
        const bLines = doc.splitTextToSize(b, contentWidth - 20);
        doc.text(bLines, margin + 16, y);
        y += bLines.length * 9.5 + 1.5;
      });

      y += 3.5;
    });

    // Page footers
    const totalPages = 2;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...textMuted);
      const footerText = `Vignesh KN — Resume | Page ${i} of ${totalPages}`;
      const footerWidth = doc.getTextWidth(footerText);
      doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 16);
    }
  }

  return doc;
}

export function generateAndDownloadResumePdf(
  filename = 'Vignesh_K_N_Resume.pdf',
  options: ResumePdfOptions = { includeProjects: true }
) {
  const doc = buildResumeDoc(options);
  doc.save(filename);
}

export function getPlainTextResume(projects: ProjectItem[] = []): string {
  return `${RESUME_DATA.header.name}
${RESUME_DATA.header.phone} | ${RESUME_DATA.header.email} | ${RESUME_DATA.header.location}
${RESUME_DATA.header.linkedin} | ${RESUME_DATA.header.github} | ${RESUME_DATA.header.projects}

=======================================================
PROFESSIONAL SUMMARY
=======================================================
${RESUME_DATA.professionalSummary}

=======================================================
TECHNICAL SKILLS
=======================================================
${RESUME_DATA.technicalSkillsTable.map((r) => `${r.category}:\n  ${r.skills}`).join('\n\n')}

=======================================================
PROFESSIONAL EXPERIENCE
=======================================================
${RESUME_DATA.professionalExperience
  .map(
    (exp) => `${exp.company} — ${exp.role} (${exp.period})
${exp.bullets.map((b) => `● ${b}`).join('\n')}`
  )
  .join('\n\n')}

=======================================================
CERTIFICATIONS & EDUCATION
=======================================================
${RESUME_DATA.certificationsAndEducation.map((c) => `● ${c.title} — ${c.period}`).join('\n')}

=======================================================
KEY ENGINEERING & AI PROJECTS (RANKED BY PROJECT SEVERITY)
=======================================================
${projects.map(
  (p) => `[${p.severityLevel} · ${p.severityTier}] ${p.title}
Repository: ${p.repository}
Tech Stack: ${p.technologies.join(', ')}
Impact: ${p.severityImpact || p.description}
${(p.sections?.engineeringDecisions || []).slice(0, 2).map((b) => `● ${b}`).join('\n')}`
).join('\n\n')}
`;
}
