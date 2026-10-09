import { jsPDF } from 'jspdf';
import { AnalysisResult, DeterministicPolicyRule, TrialHistoryItem } from '../types';

export function generateMarkdownDossier(analysis: AnalysisResult): string {
  const { pullRequest, assessment, sonarQube, jev, telemetry } = analysis;

  const triggeredPolicies = assessment.activePolicies.filter((p: DeterministicPolicyRule) => p.conditionMet);

  return `# VERO — Code Review & Pull Request Intelligence Dossier
**Generated:** ${telemetry.analyzedAt}
**Execution Engine:** VERO Tri-Pillar Architecture (Deterministic Decider + TypeSafe Jev System 1 + SonarQube Clean Code)
**Analysis Latency:** ${telemetry.totalMs}ms (${telemetry.dataSource})

---

## 1. Executive Review Verdict

- **Pull Request:** [${pullRequest.owner}/${pullRequest.repo} #${pullRequest.number}](${pullRequest.url})
- **Title:** ${pullRequest.title}
- **Author:** \`@${pullRequest.author.login}\`
- **Branch:** \`${pullRequest.headBranch}\` → \`${pullRequest.baseBranch}\`
- **Diff Metrics:** +${pullRequest.additions} / -${pullRequest.deletions} lines across ${pullRequest.changedFilesCount} files
- **FINAL VERDICT:** **${assessment.verdictLabel}** (\`${assessment.verdict}\`)
- **Overall Risk:** **${assessment.overallRisk}**
- **Confidence Rating:** **${assessment.confidencePercent}%**

### Summary Statements
${assessment.summaryStatements.map((s) => `- ${s}`).join('\n')}

### Recommended Actions
${assessment.recommendedActions.map((a) => `- ${a}`).join('\n')}

---

## 2. Deterministic Quality Gate (SonarQube Local Pillar)

- **Quality Gate:** **${sonarQube.qualityGate}**
- **Vulnerabilities:** ${sonarQube.metrics.vulnerabilities}
- **Bugs:** ${sonarQube.metrics.bugs}
- **Security Hotspots:** ${sonarQube.metrics.securityHotspots}
- **Code Smells:** ${sonarQube.metrics.codeSmells} (${sonarQube.metrics.technicalDebtMinutes} min technical debt)
- **Coverage on New Code:** ${sonarQube.metrics.coveragePercent}%
- **Duplication on New Code:** ${sonarQube.metrics.duplicatedLinesDensityPercent}%

### Flagged Issues (${sonarQube.issues.length})
${
  sonarQube.issues.length === 0
    ? '_No static code issues detected._'
    : sonarQube.issues
        .map(
          (issue) =>
            `- **[${issue.severity}]** \`${issue.ruleId}\` in \`${issue.file}:${issue.line}\`\n  *${issue.message}* (Effort: ${issue.effort})`
        )
        .join('\n')
}

---

## 3. TypeSafe Jev Structured Probabilistic Inference (System 1)

- **PR Category Classification:** \`${jev.category.selected}\` (Confidence: ${(jev.category.confidence * 100).toFixed(1)}%, Entropy: ${jev.category.entropy ?? 'N/A'})
- **Calibrated Risk Level:** \`${jev.risk.selected}\` (${jev.calibratedScore}/100)
- **Security Concern Identified:** \`${jev.securityConcern.selected}\` (Confidence: ${(jev.securityConcern.confidence * 100).toFixed(1)}%)
- **Human Review Warranted:** \`${jev.humanReviewWarranted.selected}\` (Confidence: ${(jev.humanReviewWarranted.confidence * 100).toFixed(1)}%)
- **Model Architecture:** \`${jev.model}\` (${jev.tokensEvaluated} tokens evaluated)

---

## 4. Triggered Policy Rules & Decider Evaluation

${
  triggeredPolicies.length === 0
    ? '_No blocking policy rules triggered. Standard merge criteria satisfied._'
    : triggeredPolicies
        .map(
          (r: DeterministicPolicyRule) =>
            `### Rule [${r.id}] ${r.name}
- **Severity Tier:** ${r.severity}
- **Effect:** **${r.effect}**
- **Evaluation Reason:** ${r.reason}
- **Evidence Sources:** ${r.evidenceSources.join(', ')} (${r.evidenceDetails})
`
        )
        .join('\n')
}

---

## 5. System Telemetry & Performance
- **GitHub Ingestion:** ${telemetry.githubApiMs}ms
- **SonarQube Static Analysis:** ${telemetry.sonarAnalysisMs}ms
- **Jev Probabilistic Inference:** ${telemetry.jevInferenceMs}ms
- **Decision Engine Execution:** ${telemetry.decisionEngineMs}ms
- **Total Pipeline Latency:** ${telemetry.totalMs}ms

---
*Report exported from VERO — Autonomous Code Review & PR Intelligence Platform.*
*Engineering Architecture by Vignesh K N (https://github.com/KN-Vignesh).*
`;
}

export function downloadMarkdownDossier(analysis: AnalysisResult): void {
  const md = generateMarkdownDossier(analysis);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = `${analysis.pullRequest.owner}-${analysis.pullRequest.repo}-PR${analysis.pullRequest.number}`;
  link.href = url;
  link.download = `VERO-Audit-Dossier-${safeName}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPdfDossier(analysis: AnalysisResult): void {
  const { pullRequest, assessment, sonarQube, jev, telemetry } = analysis;
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 45;

  // Header Banner
  doc.setFillColor(16, 18, 22); // #101216
  doc.rect(margin, y - 15, contentWidth, 50, 'F');
  doc.setDrawColor(36, 39, 45);
  doc.rect(margin, y - 15, contentWidth, 50, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(124, 255, 107); // #7CFF6B
  doc.text('VERO // PR INTELLIGENCE AUDIT DOSSIER', margin + 15, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(139, 143, 152);
  doc.text(`Generated: ${new Date(telemetry.analyzedAt).toLocaleString()} | Latency: ${telemetry.totalMs}ms`, margin + 15, y + 24);

  y += 55;

  // PR Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(242, 242, 242);
  doc.text(`TARGET: ${pullRequest.owner}/${pullRequest.repo} #${pullRequest.number}`, margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(`Title: ${pullRequest.title.length > 70 ? pullRequest.title.slice(0, 67) + '...' : pullRequest.title}`, margin, y);
  y += 13;

  doc.text(
    `Branch: ${pullRequest.headBranch} -> ${pullRequest.baseBranch} | Author: @${pullRequest.author.login} | Diff: +${pullRequest.additions} / -${pullRequest.deletions} (${pullRequest.changedFilesCount} files)`,
    margin,
    y
  );
  y += 20;

  // Verdict Box
  const isBlocked = assessment.verdict === 'MERGE_BLOCKED' || assessment.verdict === 'SECURITY_REVIEW_REQUIRED';
  const isExpedited = assessment.verdict === 'EXPEDITED_MERGE_OK';

  if (isBlocked) {
    doc.setFillColor(255, 84, 73);
    doc.setDrawColor(255, 84, 73);
  } else if (isExpedited) {
    doc.setFillColor(124, 255, 107);
    doc.setDrawColor(124, 255, 107);
  } else {
    doc.setFillColor(255, 176, 32);
    doc.setDrawColor(255, 176, 32);
  }

  doc.roundedRect(margin, y, contentWidth, 42, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(16, 18, 22);

  doc.text(`VERDICT: ${assessment.verdictLabel}`, margin + 12, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);
  doc.text(
    `Overall Risk: ${assessment.overallRisk}  |  Confidence: ${assessment.confidencePercent}%  |  Decided by Deterministic Precedence Engine`,
    margin + 12,
    y + 32
  );

  y += 55;

  // Section: Summary Statements
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 20, 20);
  doc.text('EVIDENCE & SUMMARY FINDINGS:', margin, y);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);

  assessment.summaryStatements.slice(0, 4).forEach((statement) => {
    const wrapped = doc.splitTextToSize(`• ${statement}`, contentWidth - 10);
    doc.text(wrapped, margin + 5, y);
    y += wrapped.length * 10 + 2;
  });

  y += 8;

  // Section: Pillar Comparison Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 20, 20);
  doc.text('ANALYTICAL PILLARS (STATIC VS PROBABILISTIC):', margin, y);
  y += 14;

  // Pillar 1: SonarQube Box
  const colWidth = (contentWidth - 15) / 2;
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(margin, y, colWidth, 95, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 20, 20);
  doc.text(`Pillar 1: SonarQube (${sonarQube.qualityGate})`, margin + 8, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 70);
  doc.text(`• Vulnerabilities: ${sonarQube.metrics.vulnerabilities}`, margin + 8, y + 28);
  doc.text(`• Bugs: ${sonarQube.metrics.bugs}`, margin + 8, y + 40);
  doc.text(`• Code Smells: ${sonarQube.metrics.codeSmells} (${sonarQube.metrics.technicalDebtMinutes}m debt)`, margin + 8, y + 52);
  doc.text(`• Coverage: ${sonarQube.metrics.coveragePercent}% (Threshold >= 80%)`, margin + 8, y + 64);
  doc.text(`• Duplication: ${sonarQube.metrics.duplicatedLinesDensityPercent}%`, margin + 8, y + 76);
  doc.text(`• Issues Flagged: ${sonarQube.issues.length}`, margin + 8, y + 88);

  // Pillar 2: TypeSafe Jev Box
  const col2X = margin + colWidth + 15;
  doc.roundedRect(col2X, y, colWidth, 95, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 20, 20);
  doc.text(`Pillar 2: TypeSafe Jev (Risk: ${jev.calibratedScore}/100)`, col2X + 8, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 70);
  doc.text(`• Category: ${jev.category.selected} (${(jev.category.confidence * 100).toFixed(0)}%)`, col2X + 8, y + 28);
  doc.text(`• Shannon Entropy: ${jev.category.entropy ?? 'N/A'}`, col2X + 8, y + 40);
  doc.text(`• Security Concern: ${jev.securityConcern.selected}`, col2X + 8, y + 52);
  doc.text(`• Human Review: ${jev.humanReviewWarranted.selected}`, col2X + 8, y + 64);
  doc.text(`• Model: ${jev.model}`, col2X + 8, y + 76);
  doc.text(`• Tokens Evaluated: ${jev.tokensEvaluated}`, col2X + 8, y + 88);

  y += 110;

  // Triggered Policy Rules
  const triggered = assessment.activePolicies.filter((p: DeterministicPolicyRule) => p.conditionMet);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 20, 20);
  doc.text(`DETERMINISTIC POLICY EVALUATION (${triggered.length} TRIGGERED):`, margin, y);
  y += 13;

  if (triggered.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text('All standard safety policies satisfied. No blocking conditions identified.', margin + 5, y);
    y += 15;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(50, 50, 50);
    triggered.slice(0, 3).forEach((r) => {
      const line = `[${r.id}] ${r.name} -> EFFECT: ${r.effect} (${r.reason})`;
      const wrapped = doc.splitTextToSize(line, contentWidth - 10);
      doc.text(wrapped, margin + 5, y);
      y += wrapped.length * 9 + 3;
    });
  }

  y += 15;

  // Footer
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, margin + contentWidth, y);
  y += 12;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'VERO Code Review & Pull Request Intelligence Platform — Engineered by Vignesh K N (https://github.com/KN-Vignesh)',
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  const safeName = `${pullRequest.owner}-${pullRequest.repo}-PR${pullRequest.number}`;
  doc.save(`VERO-Audit-Dossier-${safeName}.pdf`);
}

export function exportSessionHistoryJson(history: TrialHistoryItem[]): void {
  const exportPayload = {
    archiveTitle: 'VERO Pull Request Intelligence — Multi-PR Audit Session History',
    exportedAt: new Date().toISOString(),
    generator: 'VERO Tri-Pillar Assessment Platform (Deterministic Precedence + TypeSafe Jev + SonarQube Clean Code)',
    author: 'Vignesh K N (https://github.com/KN-Vignesh)',
    totalAudits: history.length,
    audits: history.map((item) => ({
      id: item.id,
      url: item.url,
      repository: item.repo,
      pullNumber: item.number,
      title: item.title,
      analyzedAt: item.timestamp,
      verdict: item.verdict,
      riskTier: item.risk,
      tokenMode: item.usedCustomToken ? 'Custom GitHub Token' : 'Shared Demo Token',
    })),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `VERO-Audit-History-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

