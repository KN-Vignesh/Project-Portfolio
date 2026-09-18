import { jsPDF } from 'jspdf';
import { PERSONAL_INFO, EXPERIENCES, CERTIFICATIONS } from '../data/portfolioData';

export function generateAndDownloadResumePdf(filename = 'Vignesh_K_N_Resume.pdf') {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const primaryColor: [number, number, number] = [17, 24, 39];
  const accentColor: [number, number, number] = [16, 115, 60];
  const grayColor: [number, number, number] = [75, 85, 99];
  const darkGray: [number, number, number] = [31, 41, 55];
  const ruleColor: [number, number, number] = [209, 213, 219];

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  function addSectionHeader(title: string) {
    checkPageBreak(30);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(title.toUpperCase(), margin, y);

    y += 4;
    doc.setDrawColor(...ruleColor);
    doc.setLineWidth(0.75);
    doc.line(margin, y, margin + contentWidth, y);
    y += 10;
  }

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text(PERSONAL_INFO.name, margin, y);
  y += 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...accentColor);
  doc.text('AI SOFTWARE ENGINEER | MACHINE LEARNING & BACKEND SYSTEMS', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  const contactText = `${PERSONAL_INFO.location}  |  ${PERSONAL_INFO.phone}  |  ${PERSONAL_INFO.email}  |  vigneshkn13@gmail.com`;
  doc.text(contactText, margin, y);
  y += 11;

  const linksText = `LinkedIn: ${PERSONAL_INFO.linkedin}  |  GitHub: ${PERSONAL_INFO.github}`;
  doc.text(linksText, margin, y);
  y += 10;

  doc.setDrawColor(...ruleColor);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // Professional Summary
  addSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkGray);
  const summary = 'Results-driven AI Software Engineer with 4+ years of hands-on experience in full-stack engineering, cloud automation, and high-throughput microservices, now focused on production-oriented AI, Generative AI, LLM orchestration, RAG architectures, parameter-efficient fine-tuning (LoRA/QLoRA), and containerized inference APIs. Proven track record of architecting scalable enterprise modules with .NET Core 8, Angular 18, Azure, and Python, combining rigorous software engineering standards with machine learning and agentic workflows.';
  const summaryLines = doc.splitTextToSize(summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 12 + 4;

  // Technical Skills
  addSectionHeader('Technical Skills');
  const skills = [
    { label: 'Languages & Core:', val: 'Python, C#, .NET Core 8, SQL, JavaScript, TypeScript, HTML5/CSS3, Git' },
    { label: 'Machine Learning & DL:', val: 'Scikit-learn, PyTorch, TensorFlow, Transformers, CNN, BERT, Decision Forests, XGBoost, Cross-Validation' },
    { label: 'Generative AI & LLMs:', val: 'Large Language Models, PEFT / LoRA, QLoRA (4-bit NF4), RAG Pipelines, Vector Search, FAISS, LangChain, Prompt Design' },
    { label: 'Cloud, APIs & Microservices:', val: 'FastAPI, ASP.NET MVC, RESTful APIs, Azure Functions, Azure Service Bus, Azure Cosmos DB, MySQL, Docker' },
    { label: 'DevOps & Practices:', val: 'CI/CD (Jenkins, GitHub Actions), Postman, Swagger, MLOps, System Design, SonarQube, Clean Architecture' }
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

  // Experience
  addSectionHeader('Professional Experience');
  EXPERIENCES.forEach(exp => {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(exp.role, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    const atCompany = ` |  ${exp.company}`;
    const roleWidth = doc.getTextWidth(exp.role);
    doc.text(atCompany, margin + roleWidth, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    const periodStr = `${exp.period}  (Bengaluru, India)`;
    const periodWidth = doc.getTextWidth(periodStr);
    doc.text(periodStr, margin + contentWidth - periodWidth, y);
    y += 13;

    exp.highlights.forEach(hl => {
      checkPageBreak(24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...darkGray);
      doc.text('•', margin + 6, y);

      const hlLines = doc.splitTextToSize(hl, contentWidth - 20);
      doc.text(hlLines, margin + 18, y);
      y += hlLines.length * 11 + 2;
    });
    y += 5;
  });

  // Featured Projects
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

  // Certifications & Education
  addSectionHeader('Certifications & Education');
  CERTIFICATIONS.forEach(c => {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text(`•  ${c.title}`, margin + 4, y);

    const leftWidth = doc.getTextWidth(`•  ${c.title}`) + 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    doc.text(`—  ${c.issuer}`, margin + leftWidth, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const pWidth = doc.getTextWidth(c.period);
    doc.text(c.period, margin + contentWidth - pWidth, y);
    y += 13;
  });

  const totalPages = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    const footerText = `Vignesh K N — Resume  |  Page ${i} of ${totalPages}`;
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 20);
  }

  doc.save(filename);
}

export function getPlainTextResume(): string {
  return `VIGNESH K N
AI Software Engineer | Full-Stack & Machine Learning Systems
Bengaluru, India | +91 8861524366
vigneshknagaraj@outlook.com | vigneshkn13@gmail.com
LinkedIn: https://www.linkedin.com/in/vignesh-k-n/
GitHub: https://github.com/KN-Vignesh
Portfolio: https://kn-vignesh.github.io/Projects/#/

=======================================================
PROFESSIONAL SUMMARY
=======================================================
Results-driven AI Software Engineer with 4+ years of experience in full-stack engineering, cloud automation, and API integration, now focused on production-oriented AI, Generative AI, LLM orchestration, RAG architectures, parameter-efficient fine-tuning (LoRA/QLoRA), and containerized inference APIs. Proven track record of architecting scalable enterprise modules with .NET Core 8, Angular 18, Azure, and Python, combining rigorous software engineering standards with machine learning and agentic workflows.

=======================================================
TECHNICAL SKILLS
=======================================================
- Languages & Core: Python, C#, .NET Core 8, SQL, JavaScript, TypeScript, HTML5, CSS3, Git
- Machine Learning & DL: Scikit-learn, PyTorch, TensorFlow, Transformers, CNN, BERT, Decision Forests, XGBoost, Cross-Validation
- Generative AI & LLMs: Large Language Models, PEFT / LoRA, QLoRA (4-bit NF4), RAG Pipelines, Vector Search, FAISS, LangChain, Prompt Design
- Cloud, APIs & Microservices: FastAPI, ASP.NET MVC, RESTful APIs, Azure Functions, Azure Service Bus, Azure Cosmos DB, MySQL, Docker
- DevOps & Engineering: CI/CD (Jenkins, GitHub Actions), Postman, Swagger, MLOps, System Design, SonarQube, Clean Architecture

=======================================================
PROFESSIONAL EXPERIENCE
=======================================================
Software Engineer | ACL Digital
Aug 2024 – Present | Bengaluru, India
• Architected full-stack modules integrating Agentic AI and LLM APIs for the enterprise TLK Device Configuration App (OnePortal).
• Developed high-performance backend microservices using .NET Core 8 and responsive frontend user interfaces in Angular 18.
• Engineered database operations and optimized query patterns with Entity Framework Core and MySQL.
• Implemented Reinforcement Learning from Human Feedback (RLHF) strategies and Generative AI / NLP evaluation scorecards.
• Built automated data validation pipelines and secure client-side scanner implementation for hardware Device Registration.

Software Engineer | Enmarq Technologies
Aug 2022 – Aug 2024 | Bengaluru, India
• Engineered scalable serverless REST APIs using Azure Functions, Azure Service Bus, and Azure Cosmos DB.
• Built Vector Search data management architectures and NLP / Generative AI / RAG data ingestion pipelines.
• Maintained robust CI/CD and MLOps automation with Git, Jenkins, and automated testing suites.
• Spearheaded BeyondTrust PAM / BeyondInsight deployment for 6,000+ enterprise users with a 90-day delivery deadline.
• Executed Sitecore CMS upgrades from 8.3 to 10.3, Content Hub, Experience Editor, and SQL stored procedures for managed enterprise printing systems.

Intern Associate | Enmarq Technologies
Feb 2022 – Jul 2022 | Bengaluru, India
• Developed Python and C# scheduled background jobs for automated cloud data workflows.
• Extracted, sanitized, and transformed complex data structures from Cosmos DB for downstream analytics and AI workflows.
• Conducted thorough API validation and contract testing utilizing Postman and Swagger specifications.

=======================================================
FEATURED AI & ENGINEERING PROJECTS
=======================================================
1. Intelligent Customer Churn Prediction
Stack: Python, Scikit-learn, XGBoost, FastAPI, Docker
• End-to-end production ML pipeline analyzing telecom subscription patterns to forecast retention attrition.
• Features modular data validation, Scikit-learn preprocessing pipelines, multi-model evaluation, and low-latency FastAPI inference service packaged with Docker.

2. Qwen2.5-Coder LoRA Fine-Tuning & Quantization
Stack: Python, PyTorch, Hugging Face PEFT/TRL, BitsAndBytes 4-bit, LoRA / QLoRA
• Parameter-Efficient Fine-Tuning (PEFT) on open-weight LLMs using rank-decomposed adapter matrices (LoRA) and 4-bit NormalFloat (NF4) quantization.
• Demonstrated >70% VRAM memory reduction during training with preserved coding benchmark performance.

3. VERO — AI Code Analysis & Pull Request Intelligence
Stack: GitHub API, SonarQube, LLMs, Static Analysis, Rule Engine, TypeScript, Node.js
• Evidence-based GitHub Pull Request engineering analysis platform combining AST diff parsing, SonarQube static quality checks, and structured LLM signals with a deterministic rule engine to deliver automated merge recommendations.

4. BERT Model Engineering & CNN Spatial Hierarchies
Stack: PyTorch, Hugging Face Transformers, Computer Vision
• Explored bidirectional self-attention mechanisms, token embedding representation transfer learning, and convolutional feature hierarchy learning with PyTorch training loops and validation scorecards.

=======================================================
CERTIFICATIONS & EDUCATION
=======================================================
• Microsoft Certified: Azure Fundamentals (AZ-900 / DP-900) — Microsoft (2024–2026)
• Oracle Cloud Infrastructure: Generative AI / AI Foundation — Oracle (2023–2024)
• Bachelor of Engineering (B.E.) — KVG College of Engineering (Graduated 2019)
`;
}
