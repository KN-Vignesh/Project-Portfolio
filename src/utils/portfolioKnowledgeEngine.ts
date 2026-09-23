/**
 * Resilient Portfolio Knowledge Engine
 * 
 * Provides an intelligent, client-side fallback knowledge engine with strict
 * domain boundary enforcement and anti-prompt-injection defenses.
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function generatePortfolioKnowledgeResponse(
  query: string,
  _history: ChatMessage[] = []
): string {
  const normalized = query.toLowerCase().trim();

  // 0. Anti-Prompt Injection & Jailbreak Defense
  const injectionPatterns = [
    'ignore previous',
    'ignore all instructions',
    'ignore above',
    'disregard previous',
    'disregard instructions',
    'system prompt',
    'reveal prompt',
    'show prompt',
    'what are your instructions',
    'what is your prompt',
    'developer mode',
    'dan mode',
    'jailbreak',
    'unrestricted mode',
    'pretend to be',
    'act as a',
    'act as an',
    'you are now a',
    'bypass rules',
    'override your rules',
    'repeat the text above',
    'repeat instructions'
  ];

  if (injectionPatterns.some((pattern) => normalized.includes(pattern))) {
    return `I am specifically configured to assist exclusively with questions about Vignesh K N's technical portfolio, engineering architecture, and projects (such as VERO, QLoRA fine-tuning, and Customer Churn API). I cannot modify my operating parameters or fulfill requests outside of Vignesh's technical work. How can I help you regarding his systems or engineering experience?`;
  }

  // 0.1 Explicit Out-of-Scope Guardrails (Recipes, Creative writing, Jokes, Homework, Trivia, Financial/Medical)
  const outOfScopePatterns = [
    'recipe', 'cook ', 'how to bake', 'bake a', 'joke', 'poem', 'write a song', 'sing a song',
    'tell me a story', 'weather in', 'forecast', 'horoscope', 'capital of', 'crypto', 'bitcoin',
    'stock advice', 'medical advice', 'diagnose', 'translate into french', 'translate to spanish',
    'write a letter to my', 'essay on climate', 'solve equation', 'integrate ', 'derivative of',
    'how to hack', 'write a game in c++', 'cheat sheet for history'
  ];

  if (outOfScopePatterns.some((pattern) => normalized.includes(pattern))) {
    return `I am specifically designed to assist with questions regarding Vignesh K N's technical portfolio, systems architecture, and engineering projects. I cannot assist with topics outside this portfolio scope. Please feel free to ask about his work on VERO, QLoRA fine-tuning, Customer Churn prediction, or his 4+ years of professional engineering experience!`;
  }

  // 1. Did he really build this site / authenticity / authorship
  if (
    normalized.includes('really built') ||
    normalized.includes('really build') ||
    normalized.includes('did he build') ||
    normalized.includes('did he make') ||
    normalized.includes('who built this') ||
    normalized.includes('who created this') ||
    normalized.includes('weekend') ||
    normalized.includes('fake') ||
    normalized.includes('template')
  ) {
    return `Yes, absolutely. Vignesh K N engineered this entire portfolio and all featured systems from the ground up.

Here is the technical reality behind what you see:
1. **Interactive Systems & Engine:** The site features custom interactive systems like VERO (PR-Sentinel Engine), which performs deterministic static analysis on real GitHub PR diffs, interactive parameter-efficient fine-tuning (PEFT/QLoRA) simulators, and 3D architecture visualizers.
2. **Real Repositories & Implementations:** Every project links directly to its standalone source code repository on GitHub (github.com/KN-Vignesh), featuring verified Jupyter notebooks, Dockerfiles, FastAPI endpoints, and PyTorch training scripts.
3. **Engineering Depth:** Vignesh brings 4+ years of professional software engineering experience across enterprise systems (.NET Core, Angular, Azure cloud services) and production AI/LLM pipelines at ACL Digital and Enmarq Technologies.

Every component, data pipeline, and evaluation metric shown here is an original reflection of his hands-on engineering work.`;
  }

  // 2. Greetings & Introductions
  if (
    normalized === 'hi' ||
    normalized === 'hello' ||
    normalized === 'hey' ||
    normalized.startsWith('hi ') ||
    normalized.startsWith('hello ') ||
    normalized.startsWith('hey ') ||
    normalized === 'sup' ||
    normalized === 'good morning' ||
    normalized === 'good evening' ||
    normalized === 'who are you' ||
    normalized === 'what can you do'
  ) {
    return `Hello! I am Vignesh's AI Portfolio Assistant.

I have full architectural context on Vignesh's engineering background, projects, and systems:
- **Featured Systems:** VERO (PR-Sentinel), QLoRA 4-bit fine-tuning, Qwen-2.5-Coder LoRA, Customer Churn REST API, and BERT NLP pipelines.
- **Production Experience:** 4+ years spanning ACL Digital (Agentic AI, RLHF, .NET Core 8, Angular 18) and Enmarq Technologies (Azure serverless, Cosmos DB, RAG data ingestion).
- **Resume & Links:** Download his official verified resume directly or explore source repositories.

What specific system architecture or project would you like to explore?`;
  }

  // 3. Resume / CV / Contact / Hire
  if (
    normalized.includes('resume') ||
    normalized.includes('cv') ||
    normalized.includes('download') ||
    normalized.includes('hire') ||
    normalized.includes('contact') ||
    normalized.includes('email') ||
    normalized.includes('phone')
  ) {
    return `Vignesh K N's official resume is readily available:
- **Download Resume:** Click the "DOWNLOAD RESUME" button in the navigation bar, or download directly via \`/vignesh-k-n-resume.pdf\`.
- **Email:** vigneshknagaraj@outlook.com
- **LinkedIn:** linkedin.com/in/vignesh-k-n
- **GitHub:** github.com/KN-Vignesh
- **Location:** Bengaluru, India

He is currently open to AI Software Engineer and Senior Software Engineer roles focused on Generative AI, LLMs, RAG, and production machine learning.`;
  }

  // 4. VERO / PR Sentinel / Code Review
  if (
    normalized.includes('vero') ||
    normalized.includes('pr sentinel') ||
    normalized.includes('pr-sentinel') ||
    normalized.includes('pull request') ||
    normalized.includes('code review') ||
    normalized.includes('sonar')
  ) {
    return `**VERO (PR-Sentinel)** is Vignesh's flagship AI code analysis and merge gate system:
- **Core Problem:** Raw LLMs hallucinate false positives and miss subtle boundary bugs when reviewing code diffs.
- **Architectural Solution:** A hybrid pipeline combining:
  1. *SonarQube Static Analysis Rules:* Deterministic AST evaluation for security vulnerabilities and dead code.
  2. *LLM Structured Signals (JEV Engine):* Semantic intent and architectural pattern recognition.
  3. *Deterministic Decision Gate:* A strict mathematical arbiter that enforces non-negotiable quality criteria (blocking merges if critical flaws exist, regardless of LLM confidence).
- **Try it Live:** Click the "VERO" tab in the portfolio to run live GitHub PR analyses or inspect real sample PR fixtures!`;
  }

  // 5. QLoRA / LoRA / Fine-Tuning / PEFT
  if (
    normalized.includes('qlora') ||
    normalized.includes('lora') ||
    normalized.includes('peft') ||
    normalized.includes('fine-tun') ||
    normalized.includes('finetun') ||
    normalized.includes('quantiz') ||
    normalized.includes('unsloth')
  ) {
    return `Vignesh's **Parameter-Efficient Fine-Tuning (PEFT)** pipelines demonstrate reproducible adaptation of open foundation models:
- **Qwen-2.5-Coder LoRA:** Injects low-rank decomposition matrices ($r=16, \\alpha=32$) into self-attention projection layers (\`q_proj\`, \`v_proj\`), freezing 99%+ of base weights to prevent catastrophic forgetting.
- **QLoRA 4-bit NF4 Adaptation:** Implements NormalFloat4 (NF4) quantization via BitsAndBytes with Double Quantization and paged optimizers, reducing VRAM footprint by >70% while maintaining full 16-bit inference quality.
- **Training Harness:** Utilizes Hugging Face PEFT, TRL (\`SFTTrainer\`), and Unsloth acceleration for efficient local and cloud compute.`;
  }

  // 6. Churn Prediction / Production ML / FastAPI / Docker
  if (
    normalized.includes('churn') ||
    normalized.includes('customer churn') ||
    normalized.includes('docker') ||
    normalized.includes('fastapi') ||
    normalized.includes('xgboost')
  ) {
    return `**Intelligent Customer Churn Prediction** is a production-grade ML tabular microservice:
- **Machine Learning Core:** Scikit-learn feature pipeline with SMOTE class balancing and optimized XGBoost classification, achieving a high ROC-AUC on customer retention signals.
- **Inference Server:** Packaged into a high-performance **FastAPI** REST API with strict Pydantic input validation schemas.
- **Containerization:** Self-contained **Docker** container ready for zero-downtime deployment on cloud container runtimes.
- **Repository:** Available with complete source, evaluation benchmarks, and Dockerfile at github.com/KN-Vignesh/intelligent-customer-churn-prediction.`;
  }

  // 7. Experience / Work History / ACL Digital / Enmarq
  if (
    normalized.includes('experience') ||
    normalized.includes('work') ||
    normalized.includes('acl digital') ||
    normalized.includes('enmarq') ||
    normalized.includes('company') ||
    normalized.includes('role') ||
    normalized.includes('job')
  ) {
    return `Vignesh has **4+ years of professional engineering experience**:

1. **Software Engineer @ ACL Digital** *(Aug 2024 – Present | Bengaluru, India)*
   - Architected full-stack modules incorporating Agentic AI and LLM APIs for enterprise device configuration (OnePortal) using .NET Core 8, Angular 18, and MySQL.
   - Designed Reinforcement Learning from Human Feedback (RLHF) and evaluation frameworks to optimize accuracy, safety, and reliability of internal GenAI/NLP workflows.
   - Built automated data validation and end-to-end scanner pipelines for client-side device registration.

2. **Software Engineer @ Enmarq Technologies** *(Aug 2022 – Aug 2024 | Bengaluru, India)*
   - Built serverless REST APIs, Azure Functions, and Service Bus triggers with Azure Cosmos DB (vector search management), powering low-latency data ingestion for downstream NLP and RAG pipelines.
   - Spearheaded automated deployment and building of BeyondTrust PAM and BeyondInsight for 6,000+ enterprise users under a 90-day timeline.
   - Executed sequential Sitecore CMS enterprise migrations (v8.3 to v10.3).

3. **Intern Associate @ Enmarq Technologies** *(Feb 2022 – Jul 2022)*
   - Built automated Python and C# data pipelines for cleaning Cosmos DB data used in analytics and ML workflows.`;
  }

  // 8. Skills / Tech Stack
  if (
    normalized.includes('skill') ||
    normalized.includes('stack') ||
    normalized.includes('tech') ||
    normalized.includes('python') ||
    normalized.includes('c#') ||
    normalized.includes('angular') ||
    normalized.includes('azure')
  ) {
    return `Vignesh's core technical stack spans:
- **AI & GenAI:** Large Language Models (LLMs), Agentic AI Workflows, RAG Architectures, PEFT (LoRA/QLoRA), RLHF Evaluation Frameworks, Vector DBs (FAISS, Cosmos DB Vector).
- **AI Frameworks:** PyTorch, Hugging Face (Transformers, PEFT, TRL), Scikit-learn, XGBoost, BitsAndBytes 4-bit NF4.
- **Languages:** Python, C# (.NET Core, ASP.NET), TypeScript, JavaScript, SQL.
- **Enterprise & Cloud:** Microsoft Azure (Functions, Service Bus, Cosmos DB), .NET Core 8, Angular 18, Docker, Jenkins CI/CD, REST APIs.`;
  }

  // 9. Systems Architecture & Engineering Methodology
  if (
    normalized.includes('architecture') ||
    normalized.includes('methodology') ||
    normalized.includes('pipeline') ||
    normalized.includes('system') ||
    normalized.includes('lifecycle')
  ) {
    return `Vignesh follows a disciplined **5-Stage Engineering Lifecycle**:
1. **Problem Framing & Data Contracts:** Defining input contracts, feature drift baselines, and clean tokenization boundaries.
2. **Baseline & Model Selection:** Evaluating pre-trained open weights against parameter budgets and latency thresholds.
3. **Fine-Tuning & Orchestration:** Applying LoRA/QLoRA adapters and deterministic prompt guards rather than unconstrained generation.
4. **Verification & Evaluation:** Quantitative scoring matrices measuring hallucination rate, token efficiency, and boundary safety.
5. **Production Deployment & Monitoring:** Dockerized REST inference endpoints, serverless event triggers, and observability telemetry.`;
  }

  // 10. Check if query is about other portfolio projects
  if (
    normalized.includes('bert') ||
    normalized.includes('cnn') ||
    normalized.includes('titanic') ||
    normalized.includes('house') ||
    normalized.includes('evaluation') ||
    normalized.includes('project') ||
    normalized.includes('vignesh')
  ) {
    return `Vignesh's portfolio includes 9 verified machine learning and AI engineering systems:
1. **Intelligent Customer Churn Prediction:** FastAPI + Docker + XGBoost microservice.
2. **Qwen / LoRA Adaptation:** Parameter-efficient low-rank adaptation on attention projection matrices.
3. **QLoRA 4-bit Quantization:** NF4 double quantization with BitsAndBytes.
4. **BERT Model Engineering:** Custom bidirectional encoder with classification heads.
5. **VERO (PR Sentinel):** Multi-agent PR diff intelligence with deterministic merge gates.
6. **CNN Fundamentals:** Spatial convolutions and receptive field optimization in PyTorch.
7. **Model Evaluation Framework:** Hallucination scoring and ROC-AUC benchmarking.
8. **House Price Prediction:** TensorFlow Decision Forests on tabular data.
9. **Titanic ML Baseline:** Exploratory feature engineering.

You can inspect interactive simulators and source code repositories for each project right here on this site!`;
  }

  // 11. Polite decline for non-portfolio / unrelated requests
  return `I am specifically designed to assist with questions about Vignesh K N's technical portfolio, engineering architecture, and projects (such as VERO, QLoRA, and Customer Churn API). I cannot assist with topics outside this scope. How can I help you regarding Vignesh's work or experience?`;
}
