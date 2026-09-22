import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

export function buildResumePdf(options = { includeProjects: true }) {
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
  const textDark = [15, 20, 25]; // #0F1419 Deep Black / Slate
  const textMuted = [75, 85, 99]; // #4B5563 Muted Gray
  const ruleDark = [50, 55, 65]; // Border line color
  const tableBorder = [180, 185, 195]; // Table grid lines
  const badgeCritical = [185, 28, 28]; // SEV-1
  const badgeHigh = [180, 83, 9]; // SEV-2 / SEV-3
  const badgeMedium = [29, 78, 216]; // SEV-4 / SEV-5

  function addSectionHeader(title) {
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
  const nameStr = 'VIGNESH KN';
  doc.text(nameStr, pageWidth / 2, y, { align: 'center' });
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  const contactLine1 = '+91 8861524366 | vigneshknagaraj@outlook.com | Bengaluru - 560045 |';
  doc.text(contactLine1, pageWidth / 2, y, { align: 'center' });
  y += 11;

  const contactLine2 = 'linkedin.com/in/vignesh-k-n | github.com/KN-Vignesh | kn-vignesh.github.io/Projects/#/';
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
  const summary =
    'Results-driven AI Software Engineer with 4+ years of experience in full-stack engineering, cloud automation, and API integration. Expertise in architecting production-grade Generative AI, LLM orchestration, Agentic workflows, RAG, and NLP pipelines. Skilled in enterprise .NET ecosystems, Sitecore CMS platforms, and secure IAM/PAM infrastructure deployments. Proven track record of designing, scaling, and deploying robust AI and cloud solutions on modern infrastructure.';
  const summaryLines = doc.splitTextToSize(summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 11 + 2;

  // --- TECHNICAL SKILLS (5-row bordered table matching the attached PDF) ---
  addSectionHeader('Technical Skills');
  
  const skillsTable = [
    {
      category: 'AI, GenAI & NLP',
      skills: 'Natural Language Processing (NLP), Generative AI (GenAI), Large Language Models (LLMs), Agentic AI Workflows, Prompt Engineering, RLHF Evaluation Frameworks, RAG Architectures'
    },
    {
      category: 'AI Frameworks & Tools',
      skills: 'LangChain, LLM APIs (OpenAI, Azure OpenAI), Vector Search (Cosmos DB), FAISS'
    },
    {
      category: 'Languages',
      skills: 'C# (.NET Core, ASP.NET MVC), Python, JavaScript, HTML, CSS, SSMS SQL'
    },
    {
      category: 'Frameworks & CMS',
      skills: 'Angular (8–19), Entity Framework'
    },
    {
      category: 'Cloud & DevOps',
      skills: 'Docker, Azure Functions, Azure Service Bus, Cosmos DB, Git, Jenkins (CI/CD / MLOps), Postman, Swagger'
    }
  ];

  const col1Width = 120;
  const col2Width = contentWidth - col1Width;
  const tableStartY = y;

  doc.setDrawColor(...tableBorder);
  doc.setLineWidth(0.6);

  skillsTable.forEach((row, rIdx) => {
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

  const experiences = [
    {
      company: 'ACL Digital',
      role: 'Software Engineer',
      period: 'Aug 2024 – Present',
      bullets: [
        'Architected full-stack modules with Agentic AI and LLM APIs for the TLK Device Configuration App (OnePortal) using .NET Core 8, Angular 18, EF, and MySQL globally.',
        'Implemented Reinforcement Learning from Human Feedback (RLHF) strategies and developed rigorous evaluation frameworks to optimize the accuracy, performance, and reliability of internal Generative AI and NLP applications.',
        'Engineered automated data validation and a secure end-to-end scanner implementation designed specifically for client-side Device Registration.'
      ]
    },
    {
      company: 'Enmarq Technologies',
      role: 'Software Engineer',
      period: 'Aug 2022 – Aug 2024',
      bullets: [
        'Built serverless REST APIs, Azure Functions, and Azure Service Bus triggers utilizing Azure Cosmos DB (Vector Search data management) and SSMS SQL to power low-latency data ingestion pipelines for downstream NLP pipelines and Generative AI RAG architectures.',
        'Managed Git and Jenkins CI/CD and MLOps pipelines to ensure seamless version control, automated testing, model deployment, and continuous cloud environment operations.',
        'Spearheaded the automated deployment, building, and testing of BeyondTrust PAM and BeyondInsight for 6,000+ users under a strict 90-day timeline.',
        'Executed seamless sequential Sitecore CMS upgrades from v8.3 to 10.3, enhancing Content Hub and Experience Editor workflows.',
        'Developed complex SQL Stored Procedures for Managed Printing Systems to automate multi-stage data integrity alerts.'
      ]
    },
    {
      company: 'Enmarq Technologies',
      role: 'Intern Associate',
      period: 'Feb 2022 – Jul 2022',
      bullets: [
        'Built automated Python and C# scheduled jobs to extract and clean Cosmos DB user data for analytics and AI workflows.',
        'Validated microservices endpoints across backend APIs using Postman and Swagger.'
      ]
    }
  ];

  experiences.forEach((exp, idx) => {
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

    exp.bullets.forEach(b => {
      doc.text('●', margin + 4, y);
      const bLines = doc.splitTextToSize(b, contentWidth - 16);
      doc.text(bLines, margin + 14, y);
      y += bLines.length * 9.5 + 1.5;
    });
    y += 2.5;
  });

  // --- CERTIFICATIONS & EDUCATION ---
  addSectionHeader('Certifications & Education');

  const certEduItems = [
    {
      prefix: '● Microsoft Certified:',
      title: 'Azure Fundamentals (AZ-900 / DP-900)',
      period: '2024 - 2026'
    },
    {
      prefix: '● Oracle Cloud Infrastructure (OCI):',
      title: 'Generative AI / AI Foundation Certified',
      period: '2023 - 2024'
    },
    {
      prefix: '● B.E. Graduate —',
      title: 'KVG College of Engineering',
      period: 'Graduated 2019'
    }
  ];

  certEduItems.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...textDark);
    doc.text(item.prefix, margin + 4, y);

    const prefixWidth = doc.getTextWidth(item.prefix) + 4;
    doc.setFont('helvetica', 'normal');
    doc.text(item.title, margin + 4 + prefixWidth, y);

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

    const projectsBySeverity = [
      {
        severity: 'SEV-1 · CRITICAL',
        badgeColor: badgeCritical,
        title: 'VERO — AI Code Analysis & Pull Request Intelligence',
        stack: 'TypeScript, Node.js, GitHub API, SonarQube Rules, TypeSafe Jev, LLM Prompting, Deterministic Policy Code',
        repo: 'https://github.com/KN-Vignesh/VERO',
        impact: 'Pre-merge vulnerability gate eliminating LLM hallucination and catching regressions before deployment.',
        bullets: [
          'Evidence-based GitHub Pull Request engineering analysis platform combining AST diff parsing, SonarQube static quality checks, and structured LLM signals with a deterministic rule engine.',
          'Delivers automated, hallucination-free merge verdicts without repository checkouts, providing verifiable audit trails and structured Markdown review summaries.'
        ]
      },
      {
        severity: 'SEV-2 · HIGH',
        badgeColor: badgeHigh,
        title: 'Intelligent Customer Churn Prediction System',
        stack: 'Python, Scikit-learn, XGBoost, FastAPI, Docker, Pydantic, Tabular ML',
        repo: 'https://github.com/KN-Vignesh/intelligent-customer-churn-prediction',
        impact: 'Forecasts telecom subscription attrition ($100k+ ARR risk) via sub-50ms REST API inference.',
        bullets: [
          'End-to-end reproducible classification pipeline transforming raw Telco records into low-latency prediction endpoints.',
          'Features isolated Scikit-learn preprocessing pipelines, multi-model evaluation (Logistic Regression, Random Forest, XGBoost), cost-sensitive threshold tuning, and Alpine Docker containerization.'
        ]
      },
      {
        severity: 'SEV-3 · HIGH',
        badgeColor: badgeHigh,
        title: 'Qwen2.5 / LoRA & QLoRA Memory-Efficient LLM Fine-Tuning',
        stack: 'Python, PyTorch, Hugging Face PEFT/TRL, BitsAndBytes 4-bit, LoRA / QLoRA, NF4',
        repo: 'https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/LoraFine-tuning',
        impact: 'Slashes GPU VRAM memory overhead by >70% during training while preserving coding benchmark scores.',
        bullets: [
          'Parameter-Efficient Fine-Tuning (PEFT) on open-weight LLMs using rank-decomposed adapter matrices (LoRA r=8/16, alpha=32) and 4-bit NormalFloat (NF4) quantization.',
          'Preserves base model frozen weights while optimizing attention projection layers (q_proj, v_proj), generating isolated <50MB adapter weights.'
        ]
      },
      {
        severity: 'SEV-4 · MEDIUM',
        badgeColor: badgeMedium,
        title: 'BERT Bidirectional Model Engineering & Downstream NLP',
        stack: 'PyTorch, Hugging Face Transformers, WordPiece Tokenizer, Transfer Learning, AdamW',
        repo: 'https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/BERT_MODEL',
        impact: 'Transfers rich bidirectional linguistic representations to specialized classification heads with warm-up stability.',
        bullets: [
          'Adapted pretrained bidirectional Transformer encoders to downstream text classification and entity extraction.',
          'Engineered pooled CLS linear heads, custom tokenization pipelines, and AdamW linear learning rate warmup with gradient clipping (1.0).'
        ]
      },
      {
        severity: 'SEV-5 · MEDIUM',
        badgeColor: badgeMedium,
        title: 'Multi-Metric Model Evaluation & Experiment Benchmarking Suite',
        stack: 'Python, Scikit-learn, ROC-AUC, Precision-Recall, Calibration Curves, Bootstrap',
        repo: 'https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/Combined_metric_Calc',
        impact: 'Prevents deceptive deployment approvals caused by single-metric vanity bias on imbalanced datasets.',
        bullets: [
          'Unified model comparison suite synthesizing discrimination metrics, calibration curves (Brier score), and latency metrics across candidate models for evidence-based deployment justification.'
        ]
      }
    ];

    projectsBySeverity.forEach((p, pIdx) => {
      // Title and Severity Badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2);
      doc.setTextColor(...textDark);
      doc.text(p.title, margin, y);

      const titleWidth = doc.getTextWidth(p.title);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(...p.badgeColor);
      doc.text(`[${p.severity}]`, margin + titleWidth + 6, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...textMuted);
      const repoWidth = doc.getTextWidth(p.repo);
      doc.text(p.repo, margin + contentWidth - repoWidth, y);
      y += 10.5;

      // Tech Stack line
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(...textMuted);
      const stackText = `Tech Stack: ${p.stack}`;
      const stackLines = doc.splitTextToSize(stackText, contentWidth - 8);
      doc.text(stackLines, margin + 6, y);
      y += stackLines.length * 9.5;

      // Bullets
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...textDark);
      p.bullets.forEach(b => {
        doc.text('●', margin + 6, y);
        const bLines = doc.splitTextToSize(b, contentWidth - 20);
        doc.text(bLines, margin + 16, y);
        y += bLines.length * 9.5 + 1.5;
      });

      y += 3.5;
    });
  }

  return doc;
}

// CLI execution to generate static PDF in public directory
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate complete 2-page PDF
const fullDoc = buildResumePdf({ includeProjects: true });
const fullBuffer = Buffer.from(fullDoc.output('arraybuffer'));
fs.writeFileSync(path.join(publicDir, 'vignesh-k-n-resume.pdf'), fullBuffer);
fs.writeFileSync(path.join(publicDir, 'resume.pdf'), fullBuffer);
fs.writeFileSync(path.join(publicDir, 'Vignesh_K_N_Resume.pdf'), fullBuffer);

// Also generate exact 1-page original resume matching the attached PDF
const page1Doc = buildResumePdf({ includeProjects: false });
const page1Buffer = Buffer.from(page1Doc.output('arraybuffer'));
fs.writeFileSync(path.join(publicDir, 'vignesh-k-n-resume-original.pdf'), page1Buffer);

console.log('Successfully generated ATS-compliant Resume PDFs in public/ folder.');
