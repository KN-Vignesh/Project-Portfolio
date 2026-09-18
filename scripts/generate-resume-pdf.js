import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

export function buildResumePdf() {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4', // 595.28 x 841.89 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Colors
  const primaryColor = [17, 24, 39]; // #111827
  const accentColor = [16, 115, 60]; // Forest green #10733C
  const grayColor = [75, 85, 99]; // #4B5563
  const darkGray = [31, 41, 55]; // #1F2937
  const ruleColor = [209, 213, 219]; // #D1D5DB

  function checkPageBreak(neededHeight) {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  function addSectionHeader(title) {
    checkPageBreak(30);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(title.toUpperCase(), margin, y);

    // Subtle line below section
    y += 4;
    doc.setDrawColor(...ruleColor);
    doc.setLineWidth(0.75);
    doc.line(margin, y, margin + contentWidth, y);
    y += 10;
  }

  // --- HEADER ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text('VIGNESH K N', margin, y);
  y += 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...accentColor);
  doc.text('AI SOFTWARE ENGINEER | MACHINE LEARNING & BACKEND SYSTEMS', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  const contactText = 'Bengaluru, India  |  +91 8861524366  |  vigneshknagaraj@outlook.com  |  vigneshkn13@gmail.com';
  doc.text(contactText, margin, y);
  y += 11;

  const linksText = 'LinkedIn: linkedin.com/in/vignesh-k-n  |  GitHub: github.com/KN-Vignesh  |  Projects: github.com/KN-Vignesh/Projects';
  doc.text(linksText, margin, y);
  y += 10;

  doc.setDrawColor(...ruleColor);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // --- PROFESSIONAL SUMMARY ---
  addSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkGray);
  const summary = 'Results-driven AI Software Engineer with 4+ years of hands-on experience in full-stack engineering, cloud automation, and high-throughput microservices, now focused on production-oriented AI, Generative AI, LLM orchestration, RAG architectures, parameter-efficient fine-tuning (LoRA/QLoRA), and containerized inference APIs. Proven track record of architecting scalable enterprise modules with .NET Core 8, Angular 18, Azure, and Python, combining rigorous software engineering standards with machine learning and agentic workflows.';
  const summaryLines = doc.splitTextToSize(summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 12 + 4;

  // --- TECHNICAL SKILLS ---
  addSectionHeader('Technical Skills');
  const skills = [
    { label: 'Languages & Core:', val: 'Python, C#, .NET Core 8, SQL, JavaScript, TypeScript, HTML5/CSS3, Git' },
    { label: 'Machine Learning & DL:', val: 'Scikit-learn, PyTorch, TensorFlow, Transformers, CNN, BERT, Decision Forests, XGBoost, Cross-Validation' },
    { label: 'Generative AI & LLMs:', val: 'Large Language Models, PEFT / LoRA, QLoRA (4-bit NF4), RAG Pipelines, Vector Search, FAISS, LangChain, Prompt Design' },
    { label: 'Cloud, APIs & Microservices:', val: 'FastAPI, ASP.NET MVC, RESTful APIs, Azure Functions, Azure Service Bus, Azure Cosmos DB, MySQL, Docker' },
    { label: 'DevOps & Engineering Practices:', val: 'CI/CD (Jenkins, GitHub Actions), Postman, Swagger, MLOps, System Design, SonarQube, Clean Architecture' }
  ];

  skills.forEach(s => {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text(s.label, margin, y);

    const labelWidth = doc.getTextWidth(s.label) + 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    const valLines = doc.splitTextToSize(s.val, contentWidth - labelWidth);
    doc.text(valLines, margin + labelWidth, y);
    y += Math.max(13, valLines.length * 12);
  });
  y += 4;

  // --- PROFESSIONAL EXPERIENCE ---
  addSectionHeader('Professional Experience');

  const experiences = [
    {
      company: 'ACL Digital',
      role: 'Software Engineer',
      period: 'Aug 2024 – Present',
      location: 'Bengaluru, India',
      highlights: [
        'Architected full-stack modules integrating Agentic AI and LLM APIs for the enterprise TLK Device Configuration App (OnePortal).',
        'Developed high-performance backend microservices using .NET Core 8 and responsive frontend user interfaces in Angular 18.',
        'Engineered database operations and optimized query patterns with Entity Framework Core and MySQL.',
        'Implemented Reinforcement Learning from Human Feedback (RLHF) strategies and Generative AI / NLP evaluation scorecards.',
        'Built automated data validation pipelines and secure client-side scanner implementation for hardware Device Registration.'
      ]
    },
    {
      company: 'Enmarq Technologies',
      role: 'Software Engineer',
      period: 'Aug 2022 – Aug 2024',
      location: 'Bengaluru, India',
      highlights: [
        'Engineered scalable serverless REST APIs using Azure Functions, Azure Service Bus, and Azure Cosmos DB.',
        'Built Vector Search data management architectures and NLP / Generative AI / RAG data ingestion pipelines.',
        'Maintained robust CI/CD and MLOps automation with Git, Jenkins, and automated testing suites.',
        'Spearheaded BeyondTrust PAM / BeyondInsight deployment for 6,000+ enterprise users with a 90-day delivery deadline.',
        'Executed Sitecore CMS upgrades from 8.3 to 10.3, Content Hub, Experience Editor, and SQL stored procedures for managed enterprise printing systems.'
      ]
    },
    {
      company: 'Enmarq Technologies',
      role: 'Intern Associate',
      period: 'Feb 2022 – Jul 2022',
      location: 'Bengaluru, India',
      highlights: [
        'Developed Python and C# scheduled background jobs for automated cloud data workflows.',
        'Extracted, sanitized, and transformed complex data structures from Cosmos DB for downstream analytics and AI workflows.',
        'Conducted thorough API validation and contract testing utilizing Postman and Swagger specifications.'
      ]
    }
  ];

  experiences.forEach(exp => {
    checkPageBreak(50);
    // Company & Role Line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(exp.role, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    const atCompany = ` |  ${exp.company}`;
    const roleWidth = doc.getTextWidth(exp.role);
    doc.text(atCompany, margin + roleWidth, y);

    // Period on right
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    const periodStr = `${exp.period}  (${exp.location})`;
    const periodWidth = doc.getTextWidth(periodStr);
    doc.text(periodStr, margin + contentWidth - periodWidth, y);
    y += 13;

    // Bullet points
    exp.highlights.forEach(hl => {
      checkPageBreak(24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...darkGray);

      // Bullet dot
      doc.text('•', margin + 6, y);

      const hlLines = doc.splitTextToSize(hl, contentWidth - 20);
      doc.text(hlLines, margin + 18, y);
      y += hlLines.length * 11 + 2;
    });
    y += 5;
  });

  // --- KEY PROJECTS ---
  addSectionHeader('Featured Engineering & AI Projects');

  const projects = [
    {
      title: 'Intelligent Customer Churn Prediction',
      stack: 'Python, Scikit-learn, XGBoost, FastAPI, Docker, Classification Pipelines',
      desc: 'End-to-end production ML pipeline analyzing telecom subscription patterns to forecast retention attrition. Features modular data validation, Scikit-learn preprocessing pipelines, multi-model evaluation, and low-latency FastAPI inference service packaged with Docker.'
    },
    {
      title: 'Qwen2.5-Coder LoRA Fine-Tuning & Quantization',
      stack: 'Python, PyTorch, Hugging Face PEFT/TRL, BitsAndBytes 4-bit, LoRA / QLoRA',
      desc: 'Parameter-Efficient Fine-Tuning (PEFT) on open-weight LLMs using rank-decomposed adapter matrices (LoRA) and 4-bit NormalFloat (NF4) quantization. Demonstrated >70% VRAM memory reduction during training with preserved coding benchmark performance.'
    },
    {
      title: 'VERO — AI Code Analysis & Pull Request Intelligence',
      stack: 'GitHub API, SonarQube, LLMs, Static Analysis, Rule Engine, TypeScript, Node.js',
      desc: 'Evidence-based GitHub Pull Request engineering analysis platform combining AST diff parsing, SonarQube static quality checks, and structured LLM signals with a deterministic rule engine to deliver automated, hallucination-free merge recommendations.'
    },
    {
      title: 'BERT Model Engineering & CNN Spatial Hierarchies',
      stack: 'PyTorch, Hugging Face Transformers, Computer Vision, WordPiece Tokenization',
      desc: 'Explored bidirectional self-attention mechanisms, token embedding representation transfer learning, and convolutional feature hierarchy learning with PyTorch training loops, learning rate scheduling, and validation scorecards.'
    }
  ];

  projects.forEach(p => {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    doc.text(p.title, margin, y);

    const titleWidth = doc.getTextWidth(p.title);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(...grayColor);
    const stackStr = ` — [${p.stack}]`;
    doc.text(doc.splitTextToSize(stackStr, contentWidth - titleWidth - 5)[0] || '', margin + titleWidth + 4, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkGray);
    const descLines = doc.splitTextToSize(p.desc, contentWidth - 6);
    doc.text(descLines, margin + 6, y);
    y += descLines.length * 10.5 + 4;
  });

  // --- CERTIFICATIONS & EDUCATION ---
  addSectionHeader('Certifications & Education');

  const certsEdu = [
    { title: 'Microsoft Certified: Azure Fundamentals (AZ-900 / DP-900)', org: 'Microsoft', period: '2024–2026' },
    { title: 'Oracle Cloud Infrastructure: Generative AI / AI Foundation', org: 'Oracle', period: '2023–2024' },
    { title: 'Bachelor of Engineering (B.E.)', org: 'KVG College of Engineering', period: 'Graduated 2019' }
  ];

  certsEdu.forEach(c => {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text(`•  ${c.title}`, margin + 4, y);

    const leftWidth = doc.getTextWidth(`•  ${c.title}`) + 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    doc.text(`—  ${c.org}`, margin + leftWidth, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const pWidth = doc.getTextWidth(c.period);
    doc.text(c.period, margin + contentWidth - pWidth, y);
    y += 13;
  });

  // Add page numbers at bottom
  const totalPages = doc.getNumberOfPages ? doc.getNumberOfPages() : (doc.internal.pages.length - 1);
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    const footerText = `Vignesh K N — Resume  |  Page ${i} of ${totalPages}`;
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 20);
  }

  return doc;
}

// Generate files in public directory
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const doc = buildResumePdf();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(path.join(publicDir, 'vignesh-k-n-resume.pdf'), pdfBuffer);
fs.writeFileSync(path.join(publicDir, 'resume.pdf'), pdfBuffer);
console.log('Successfully generated public/vignesh-k-n-resume.pdf and public/resume.pdf');
