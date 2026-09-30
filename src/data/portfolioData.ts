import { ExperienceItem, CertificationItem, AILabNode, StackCategory } from '../types';

export const PERSONAL_INFO = {
  name: 'VIGNESH KN', title: 'AI SOFTWARE ENGINEER', subtitle: 'SOFTWARE ENGINEERING → AI ENGINEERING',
  heroStatement: 'Building intelligent systems from models to production.',
  supportingText: 'Software engineer with 4+ years of experience in full-stack engineering, cloud automation, and API integration, now focused on production-oriented AI, Generative AI, LLM orchestration, RAG, agentic workflows, and model engineering.',
  summary: 'Results-driven AI Software Engineer with 4+ years of experience in full-stack engineering, cloud automation, and API integration. Expertise in architecting production-grade Generative AI, LLM orchestration, Agentic workflows, RAG, and NLP pipelines.',
  email: 'vigneshknagaraj@outlook.com', phone: '+91 8861524366', location: 'Bengaluru - 560045, India',
  github: 'https://github.com/KN-Vignesh', projectsRepo: 'https://github.com/KN-Vignesh/Projects',
  linkedin: 'https://www.linkedin.com/in/vignesh-k-n/', deployedPortfolio: 'https://kn-vignesh.github.io/Projects/#/',
  status: 'ONLINE', statusSubtext: 'AI ENGINEERING CORE ACTIVE',
};

export const RESUME_DATA = {
  header: { name: 'VIGNESH KN', phone: '+91 8861524366', email: 'vigneshknagaraj@outlook.com', location: 'Bengaluru - 560045', linkedin: 'linkedin.com/in/vignesh-k-n', github: 'github.com/KN-Vignesh', projects: 'github.com/KN-Vignesh/Projects' },
  professionalSummary: PERSONAL_INFO.summary,
  technicalSkillsTable: [
    { category: 'AI, GenAI & NLP', skills: 'Natural Language Processing (NLP), Generative AI (GenAI), Large Language Models (LLMs), Agentic AI Workflows, Prompt Engineering, RLHF Evaluation Frameworks, RAG Architectures' },
    { category: 'AI Frameworks & Tools', skills: 'LangChain, LLM APIs (OpenAI, Azure OpenAI), Vector Search (Cosmos DB), FAISS' },
    { category: 'Languages', skills: 'C# (.NET Core, ASP.NET MVC), Python, JavaScript, HTML, CSS, SSMS SQL' },
    { category: 'Frameworks & CMS', skills: 'Angular (8–19), Entity Framework, Sitecore CMS' },
    { category: 'Cloud & DevOps', skills: 'Docker, Azure Functions, Azure Service Bus, Cosmos DB, Git, Jenkins (CI/CD / MLOps), Postman, Swagger' },
  ],
  professionalExperience: [
    { company: 'ACL Digital', role: 'Software Engineer', period: 'Aug 2024 – Present', bullets: ['Architected full-stack modules with Agentic AI and LLM APIs using .NET Core 8, Angular 18, EF, and MySQL.', 'Implemented RLHF strategies and evaluation frameworks for Generative AI and NLP applications.', 'Engineered automated data validation and secure client-side device registration scanners.'] },
    { company: 'Enmarq Technologies', role: 'Software Engineer', period: 'Aug 2022 – Aug 2024', bullets: ['Built serverless REST APIs, Azure Functions, Service Bus triggers, Cosmos DB vector search, and RAG ingestion pipelines.', 'Managed Git and Jenkins CI/CD and MLOps pipelines for automated testing and deployment.', 'Automated BeyondTrust PAM deployment for 6,000+ users and delivered Sitecore CMS upgrades.'] },
    { company: 'Enmarq Technologies', role: 'Intern Associate', period: 'Feb 2022 – Jul 2022', bullets: ['Built Python and C# scheduled jobs to extract and clean Cosmos DB data for analytics and AI workflows.', 'Validated microservices endpoints with Postman and Swagger.'] },
  ],
  certificationsAndEducation: [
    { title: 'Microsoft Certified: Azure Fundamentals (AZ-900 / DP-900)', period: '2024 - 2026' },
    { title: 'Oracle Cloud Infrastructure: Generative AI / AI Foundation Certified', period: '2023 - 2024' },
    { title: 'B.E. Graduate — KVG College of Engineering', period: 'Graduated 2019' },
  ],
};

export const EXPERIENCES: ExperienceItem[] = RESUME_DATA.professionalExperience.map((item, index) => ({
  ...item,
  type: index === 2 ? 'Internship' : 'Full-Time',
  narrative: item.bullets[0],
  highlights: item.bullets,
  technologies: index === 0 ? ['.NET Core 8', 'Angular 18', 'Agentic AI', 'LLM APIs'] : index === 1 ? ['Azure Functions', 'Cosmos DB', 'RAG Pipelines', 'Jenkins CI/CD'] : ['Python', 'C#', 'Cosmos DB', 'REST APIs'],
}));

export const CERTIFICATIONS: CertificationItem[] = [
  { title: 'Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft', period: '2024 - 2026', code: 'AZ-900 / DP-900' },
  { title: 'Oracle Cloud Infrastructure: Generative AI / AI Foundation Certified', issuer: 'Oracle', period: '2023 - 2024', code: 'OCI Generative AI' },
  { title: 'B.E. Graduate — KVG College of Engineering', issuer: 'KVG College of Engineering', period: 'Graduated 2019', code: 'B.E. Degree' },
];

export const AI_LAB_NODES: AILabNode[] = [
  { id: 'ml-foundations', label: 'MACHINE LEARNING', type: 'FOUNDATION', description: 'Statistical modeling, supervised classification, regression baselines, feature engineering, and cross-validation.', connections: ['deep-learning', 'evaluation', 'apis'], relatedProjectIds: ['customer-churn', 'house-price', 'titanic', 'evaluation'], coordinates: [-3, -1.5, 0] },
  { id: 'deep-learning', label: 'DEEP LEARNING', type: 'FOUNDATION', description: 'Neural representations, convolutional feature hierarchies, backpropagation, and tensor computation in PyTorch.', connections: ['ml-foundations', 'nlp', 'evaluation'], relatedProjectIds: ['cnn', 'bert'], coordinates: [-2, 0.5, 1] },
  { id: 'nlp', label: 'NLP & TRANSFORMERS', type: 'FOUNDATION', description: 'Bidirectional self-attention, subword tokenization, sequence encoding, and language representation transfer learning.', connections: ['deep-learning', 'llms', 'rag'], relatedProjectIds: ['bert', 'vero'], coordinates: [-1.2, 2, 0.5] },
  { id: 'llms', label: 'LARGE LANGUAGE MODELS', type: 'GENERATIVE_AI', description: 'Open-weight foundational models, causal autoregression, prompt design, and reasoning capabilities.', connections: ['nlp', 'fine-tuning', 'rag', 'agents'], relatedProjectIds: ['qwen-lora', 'qlora', 'vero'], coordinates: [0, 3, 0] },
  { id: 'fine-tuning', label: 'PEFT & FINE-TUNING', type: 'MODEL_ENGINEERING', description: 'Low-Rank Adaptation (LoRA), QLoRA 4-bit NF4 quantization, and parameter-efficient model alignment.', connections: ['llms', 'evaluation'], relatedProjectIds: ['qwen-lora', 'qlora'], coordinates: [1.8, 2.2, -0.5] },
  { id: 'rag', label: 'RAG ARCHITECTURES', type: 'GENERATIVE_AI', description: 'Vector embeddings, dense semantic retrieval, similarity search, and grounded generation.', connections: ['llms', 'applications', 'nlp'], relatedProjectIds: ['vero'], coordinates: [-0.5, 1, -1.5] },
  { id: 'agents', label: 'AGENTIC WORKFLOWS', type: 'GENERATIVE_AI', description: 'Multi-step tool invocation, deterministic decision trees, self-correction, and structured JSON output contracts.', connections: ['llms', 'rag', 'applications'], relatedProjectIds: ['vero'], coordinates: [0.8, 0.8, -1.8] },
  { id: 'evaluation', label: 'EVALUATION & BENCHMARKING', type: 'MODEL_ENGINEERING', description: 'Multi-metric scorecards, ROC-AUC, calibration reliability, perplexity, and statistical hypothesis testing.', connections: ['ml-foundations', 'fine-tuning', 'applications'], relatedProjectIds: ['evaluation', 'customer-churn', 'bert'], coordinates: [-2.5, -0.5, -1] },
  { id: 'applications', label: 'SYSTEM INTEGRATION', type: 'SYSTEMS_APPLICATION', description: 'Connecting intelligence layers to enterprise backends, deterministic gates, and automated code review workflows.', connections: ['rag', 'agents', 'apis'], relatedProjectIds: ['vero', 'customer-churn'], coordinates: [2, 0, 0] },
  { id: 'apis', label: 'FASTAPI & MICROSERVICES', type: 'SYSTEMS_APPLICATION', description: 'High-throughput asynchronous REST endpoints, FastAPI microservices, and contract-first Pydantic schemas.', connections: ['applications', 'ml-foundations', 'deployment'], relatedProjectIds: ['customer-churn'], coordinates: [0, -2, 0] },
  { id: 'cloud', label: 'CLOUD & MLOps', type: 'SYSTEMS_APPLICATION', description: 'Azure Functions, Service Bus, Cosmos DB, Jenkins CI/CD automation, and telemetry monitoring.', connections: ['deployment', 'apis'], relatedProjectIds: ['customer-churn'], coordinates: [-1.8, -2.5, -0.8] },
  { id: 'deployment', label: 'DOCKER & SHIP', type: 'SYSTEMS_APPLICATION', description: 'Reproducible containerization, container runtimes, deployment pipelines, and operational reliability.', connections: ['apis', 'cloud'], relatedProjectIds: ['customer-churn'], coordinates: [0.5, -3, 0.2] },
];

export const STACK_CATEGORIES: StackCategory[] = [
  { title: 'AI, GenAI & NLP', iconName: 'Sparkles', skills: ['Natural Language Processing (NLP)', 'Generative AI (GenAI)', 'Large Language Models (LLMs)', 'Agentic AI Workflows', 'Prompt Engineering', 'RLHF Evaluation Frameworks', 'RAG Architectures'], summary: 'Production-grade Generative AI, agentic reasoning, RAG pipelines, and rigorous RLHF evaluation frameworks.' },
  { title: 'AI Frameworks & Tools', iconName: 'Bot', skills: ['LangChain', 'LLM APIs (OpenAI, Azure OpenAI)', 'Vector Search (Cosmos DB)', 'FAISS'], summary: 'Vector database orchestration, retrieval-augmented generation, and enterprise LLM API integration.' },
  { title: 'Languages', iconName: 'Terminal', skills: ['C# (.NET Core, ASP.NET MVC)', 'Python', 'JavaScript', 'HTML', 'CSS', 'SSMS SQL'], summary: 'Strong systems programming and analytical language foundation spanning enterprise .NET and modern Python ML.' },
  { title: 'Frameworks & CMS', iconName: 'Code', skills: ['Angular (8–19)', 'Entity Framework', 'Sitecore CMS (8.3 to 10.3)', 'Content Hub'], summary: 'Battle-tested enterprise frontend and CMS engineering.' },
  { title: 'Cloud & DevOps', iconName: 'Cloud', skills: ['Docker', 'Azure Functions', 'Azure Service Bus', 'Cosmos DB', 'Git', 'Jenkins (CI/CD / MLOps)', 'Postman', 'Swagger'], summary: 'Serverless cloud automation, distributed messaging, container orchestration, and continuous integration pipelines.' },
];

export const ENGINEERING_PIPELINE_STEPS = [
  { step: '01', phase: 'UNDERSTAND', name: 'Problem Definition & Constraints', desc: 'Rigorous scoping of input data distribution, latency requirements, computational budget, and business failure thresholds.', associatedProjects: ['VERO', 'Customer Churn'] },
  { step: '02', phase: 'BUILD', name: 'Working Implementation', desc: 'Developing verified baseline architectures, whether Scikit-learn classification pipelines, PyTorch CNNs, or LoRA adapters.', associatedProjects: ['Qwen LoRA', 'QLoRA', 'CNN Fundamentals'] },
  { step: '03', phase: 'EVALUATE', name: 'Evidence, Metrics & Failure Modes', desc: 'Multi-dimensional scorecard verification preventing vanity metric bias.', associatedProjects: ['Model Evaluation', 'BERT'] },
  { step: '04', phase: 'SHIP', name: 'API, Application & Deployment', desc: 'Packaging models into contract-validated endpoints, containerized services, or PR bots.', associatedProjects: ['VERO', 'Customer Churn'] },
  { step: '05', phase: 'ITERATE', name: 'Decisions & Next Experiment', desc: 'Analyzing runtime logs, concept drift, memory trade-offs, and scaling up to specialized agentic capabilities.', associatedProjects: ['VERO', 'QLoRA'] },
];
