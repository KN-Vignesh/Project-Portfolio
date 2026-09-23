import { ProjectItem, ExperienceItem, CertificationItem, AILabNode, StackCategory } from '../types';

export const PERSONAL_INFO = {
  name: "VIGNESH KN",
  title: "AI SOFTWARE ENGINEER",
  subtitle: "SOFTWARE ENGINEERING → AI ENGINEERING",
  heroStatement: "Building intelligent systems from models to production.",
  supportingText: "Software engineer with 4+ years of experience in full-stack engineering, cloud automation, and API integration, now focused on production-oriented AI, Generative AI, LLM orchestration, RAG, agentic workflows, and model engineering.",
  summary: "Results-driven AI Software Engineer with 4+ years of experience in full-stack engineering, cloud automation, and API integration. Expertise in architecting production-grade Generative AI, LLM orchestration, Agentic workflows, RAG, and NLP pipelines. Skilled in enterprise .NET ecosystems, Sitecore CMS platforms, and secure IAM/PAM infrastructure deployments. Proven track record of designing, scaling, and deploying robust AI and cloud solutions on modern infrastructure.",
  email: "vigneshknagaraj@outlook.com",
  phone: "+91 8861524366",
  location: "Bengaluru - 560045, India",
  github: "https://github.com/KN-Vignesh",
  projectsRepo: "https://github.com/KN-Vignesh/Projects",
  linkedin: "https://www.linkedin.com/in/vignesh-k-n/",
  deployedPortfolio: "https://kn-vignesh.github.io/Projects/#/",
  status: "ONLINE",
  statusSubtext: "AI ENGINEERING CORE ACTIVE",
};

/**
 * Exact Resume Data extracted from the official attached PDF
 */
export const RESUME_DATA = {
  header: {
    name: "VIGNESH KN",
    phone: "+91 8861524366",
    email: "vigneshknagaraj@outlook.com",
    location: "Bengaluru - 560045",
    linkedin: "linkedin.com/in/vignesh-k-n",
    github: "github.com/KN-Vignesh",
    projects: "kn-vignesh.github.io/Projects/#/"
  },
  professionalSummary:
    "Results-driven AI Software Engineer with 4+ years of experience in full-stack engineering, cloud automation, and API integration. Expertise in architecting production-grade Generative AI, LLM orchestration, Agentic workflows, RAG, and NLP pipelines. Skilled in enterprise .NET ecosystems, Sitecore CMS platforms, and secure IAM/PAM infrastructure deployments. Proven track record of designing, scaling, and deploying robust AI and cloud solutions on modern infrastructure.",
  technicalSkillsTable: [
    {
      category: "AI, GenAI & NLP",
      skills:
        "Natural Language Processing (NLP), Generative AI (GenAI), Large Language Models (LLMs), Agentic AI Workflows, Prompt Engineering, RLHF Evaluation Frameworks, RAG Architectures"
    },
    {
      category: "AI Frameworks & Tools",
      skills: "LangChain, LLM APIs (OpenAI, Azure OpenAI), Vector Search (Cosmos DB), FAISS"
    },
    {
      category: "Languages",
      skills: "C# (.NET Core, ASP.NET MVC), Python, JavaScript, HTML, CSS, SSMS SQL"
    },
    {
      category: "Frameworks & CMS",
      skills: "Angular (8–19), Entity Framework"
    },
    {
      category: "Cloud & DevOps",
      skills: "Docker, Azure Functions, Azure Service Bus, Cosmos DB, Git, Jenkins (CI/CD / MLOps), Postman, Swagger"
    }
  ],
  professionalExperience: [
    {
      company: "ACL Digital",
      role: "Software Engineer",
      period: "Aug 2024 – Present",
      bullets: [
        "Architected full-stack modules with Agentic AI and LLM APIs for the TLK Device Configuration App (OnePortal) using .NET Core 8, Angular 18, EF, and MySQL globally.",
        "Implemented Reinforcement Learning from Human Feedback (RLHF) strategies and developed rigorous evaluation frameworks to optimize the accuracy, performance, and reliability of internal Generative AI and NLP applications.",
        "Engineered automated data validation and a secure end-to-end scanner implementation designed specifically for client-side Device Registration."
      ]
    },
    {
      company: "Enmarq Technologies",
      role: "Software Engineer",
      period: "Aug 2022 – Aug 2024",
      bullets: [
        "Built serverless REST APIs, Azure Functions, and Azure Service Bus triggers utilizing Azure Cosmos DB (Vector Search data management) and SSMS SQL to power low-latency data ingestion pipelines for downstream NLP pipelines and Generative AI RAG architectures.",
        "Managed Git and Jenkins CI/CD and MLOps pipelines to ensure seamless version control, automated testing, model deployment, and continuous cloud environment operations.",
        "Spearheaded the automated deployment, building, and testing of BeyondTrust PAM and BeyondInsight for 6,000+ users under a strict 90-day timeline.",
        "Executed seamless sequential Sitecore CMS upgrades from v8.3 to 10.3, enhancing Content Hub and Experience Editor workflows.",
        "Developed complex SQL Stored Procedures for Managed Printing Systems to automate multi-stage data integrity alerts."
      ]
    },
    {
      company: "Enmarq Technologies",
      role: "Intern Associate",
      period: "Feb 2022 – Jul 2022",
      bullets: [
        "Built automated Python and C# scheduled jobs to extract and clean Cosmos DB user data for analytics and AI workflows.",
        "Validated microservices endpoints across backend APIs using Postman and Swagger."
      ]
    }
  ],
  certificationsAndEducation: [
    {
      title: "Microsoft Certified: Azure Fundamentals (AZ-900 / DP-900)",
      period: "2024 - 2026"
    },
    {
      title: "Oracle Cloud Infrastructure (OCI): Generative AI / AI Foundation Certified",
      period: "2023 - 2024"
    },
    {
      title: "B.E. Graduate — KVG College of Engineering",
      period: "Graduated 2019"
    }
  ]
};

/**
 * Projects extracted from GitHub and structured by severity & operational impact
 */
export const RESUME_PROJECTS_BY_SEVERITY = [
  {
    id: "vero",
    severityLevel: "SEV-1",
    severityTier: "CRITICAL" as const,
    severityLabel: "Production CI/CD Merge Gate & Vulnerability Shield",
    title: "VERO — AI Code Analysis & Pull Request Intelligence",
    stack: "TypeScript, Node.js, GitHub API, SonarQube Rules, TypeSafe Jev, LLMs, Deterministic Policy Code",
    repoUrl: "https://github.com/KN-Vignesh/VERO",
    impact: "Automated merge gate eliminating LLM hallucinations and intercepting vulnerabilities before production deploy.",
    bullets: [
      "Evidence-based GitHub Pull Request engineering analysis platform combining AST diff parsing, SonarQube static quality checks, and structured LLM signals with a deterministic rule engine.",
      "Delivers automated, hallucination-free merge verdicts without repository checkouts, providing verifiable audit trails and structured Markdown review summaries."
    ]
  },
  {
    id: "customer-churn",
    severityLevel: "SEV-2",
    severityTier: "HIGH" as const,
    severityLabel: "Revenue Risk Mitigation & Production Inference API",
    title: "Intelligent Customer Churn Prediction System",
    stack: "Python, Scikit-learn, XGBoost, FastAPI, Docker, Pydantic, Tabular ML",
    repoUrl: "https://github.com/KN-Vignesh/intelligent-customer-churn-prediction",
    impact: "Forecasts telecom subscription attrition ($100k+ ARR risk) via sub-50ms REST API inference.",
    bullets: [
      "End-to-end reproducible classification pipeline transforming raw Telco records into low-latency prediction endpoints.",
      "Features isolated Scikit-learn preprocessing pipelines, multi-model evaluation (Logistic Regression, Random Forest, XGBoost), cost-sensitive threshold tuning, and Alpine Docker containerization."
    ]
  },
  {
    id: "qlora",
    severityLevel: "SEV-3",
    severityTier: "HIGH" as const,
    severityLabel: "Hardware Bottleneck & Memory-Efficient LLM Adaptation",
    title: "Qwen2.5 / LoRA & QLoRA Memory-Efficient LLM Fine-Tuning",
    stack: "Python, PyTorch, Hugging Face PEFT/TRL, BitsAndBytes 4-bit, LoRA / QLoRA, NF4",
    repoUrl: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/LoraFine-tuning",
    impact: "Slashes GPU VRAM memory overhead by >70% during training while preserving coding benchmark scores.",
    bullets: [
      "Parameter-Efficient Fine-Tuning (PEFT) on open-weight LLMs using rank-decomposed adapter matrices (LoRA r=8/16, alpha=32) and 4-bit NormalFloat (NF4) quantization.",
      "Preserves base model frozen weights while optimizing attention projection layers (q_proj, v_proj), generating isolated <50MB adapter weights."
    ]
  },
  {
    id: "bert",
    severityLevel: "SEV-4",
    severityTier: "MEDIUM" as const,
    severityLabel: "Enterprise NLP Architecture & Representation Learning",
    title: "BERT Bidirectional Model Engineering & Downstream NLP",
    stack: "PyTorch, Hugging Face Transformers, WordPiece Tokenizer, Transfer Learning, AdamW",
    repoUrl: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/BERT_MODEL",
    impact: "Transfers rich bidirectional linguistic representations to specialized classification heads with warm-up stability.",
    bullets: [
      "Adapted pretrained bidirectional Transformer encoders to downstream text classification and entity extraction.",
      "Engineered pooled CLS linear heads, custom tokenization pipelines, and AdamW linear learning rate warmup with gradient clipping (1.0)."
    ]
  },
  {
    id: "evaluation",
    severityLevel: "SEV-5",
    severityTier: "MEDIUM" as const,
    severityLabel: "Model Governance & Multi-Metric Risk Verification",
    title: "Multi-Metric Model Evaluation & Experiment Benchmarking Suite",
    stack: "Python, Scikit-learn, ROC-AUC, Precision-Recall, Calibration Curves, Bootstrap",
    repoUrl: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/Combined_metric_Calc",
    impact: "Prevents deceptive deployment approvals caused by single-metric vanity bias on imbalanced datasets.",
    bullets: [
      "Unified model comparison suite synthesizing discrimination metrics, calibration curves (Brier score), and latency metrics across experiments for evidence-based deployment justification."
    ]
  }
];

/**
 * Full project systems catalog ordered by Project Severity & Operational Impact:
 * 1. SEV-1 CRITICAL: VERO (Merge Gate & Production Vulnerability Prevention)
 * 2. SEV-2 HIGH: Customer Churn (Revenue Risk & Low-Latency API)
 * 3. SEV-3 HIGH: QLoRA & Qwen LoRA (Hardware Bottleneck & Memory Compression)
 * 4. SEV-4 MEDIUM: BERT (Enterprise NLP & Representation Learning)
 * 5. SEV-5 MEDIUM: Model Evaluation (Governance & Calibration Curves)
 * 6. SEV-6 FOUNDATIONAL: House Price, CNN Fundamentals, Titanic
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: "vero",
    number: "PROJECT_001",
    title: "VERO — AI CODE ANALYSIS & PR INTELLIGENCE",
    category: "AI APPLICATION / CODE INTELLIGENCE",
    severityTier: "CRITICAL",
    severityLevel: "SEV-1",
    severityLabel: "Production CI/CD Merge Gate & Vulnerability Shield",
    severityImpact: "Pre-merge vulnerability gate eliminating LLM hallucination and catching regressions before deployment.",
    tagline: "Evidence-based GitHub Pull Request engineering analysis platform combining static analysis with structured AI signals.",
    description: "An evidence-based GitHub Pull Request engineering analysis platform combining GitHub diff data, SonarQube static analysis, structured AI signals and deterministic decision rules. Synthesizes static code diagnostics with LLM architectural reasoning to generate engineering verdicts.",
    technologies: ["GitHub API", "SonarQube", "LLMs", "Static Analysis", "Rule Engine", "TypeScript", "Node.js"],
    role: "System Architecture & AI Application Engineering",
    systemFlow: [
      "GITHUB PULL REQUEST",
      "DIFF EXTRACTION & PARSING",
      "STATIC ANALYSIS (SONARQUBE)",
      "STRUCTURED AI SIGNAL EXTRACTION",
      "DETERMINISTIC DECISION ENGINE",
      "ENGINEERING VERDICT & PR COMMENT"
    ],
    repository: "https://github.com/KN-Vignesh/VERO",
    liveAppView: "vero",
    status: "APPLICATION_SYSTEM",
    evaluationMetrics: ["Deterministic Gate Veracity", "0% Hallucinated Vulnerabilities", "100% Audit Trail"],
    sections: {
      problem: "Engineering pull request reviews suffer from inconsistent quality, manual overhead on stylistic/static checks, and missed architectural edge cases. Pure LLM code reviews hallucinate security flaws, while pure static linters lack holistic context.",
      whyApproach: "VERO pairs deterministic static analysis (SonarQube) with structured AI prompts. By grounding LLM evaluation in verified AST diffs and static rule outputs, the system produces actionable, reproducible engineering verdicts without requiring full repository checkouts.",
      dataInput: "GitHub webhooks providing PR diff chunks, touched files, SonarQube quality gate outputs, and repository rule configurations.",
      architecture: "Pipeline pattern: GitHub webhook triggers PR fetcher -> AST parser extracts modified functions -> SonarQube runs static security/style checks -> Prompt orchestrator builds grounded context -> LLM provides structured JSON analysis -> Deterministic decision engine combines rules for final merge gate verdict.",
      implementation: "Structured schema enforcement on LLM outputs via JSON schemas. Strict rule engine preventing merge approvals if high-severity static vulnerabilities exist.",
      evaluation: "Evaluated against historical PR samples measuring false-positive review commentary rates and precision of caught bugs.",
      engineeringDecisions: [
        "Never allowed raw LLM outputs to directly approve PRs without passing deterministic static gate rules.",
        "Diff chunking strategy to keep prompt tokens within optimal attention budget without truncating critical context.",
        "Markdown automated reporting formatted with collapsible diagnostic details for developer readability."
      ],
      limitations: [
        "Requires access credentials for private repository webhooks and running SonarQube instance.",
        "Very large monorepo PRs (100+ files) require incremental commit chunking."
      ],
      futureImprovements: [
        "Interactive bot replies allowing developers to request code refactoring in-line directly from comments.",
        "Self-hosted local model option (DeepSeek-Coder / CodeLlama) for air-gapped enterprise review."
      ]
    },
    relatedProjectIds: ["customer-churn", "bert", "evaluation"]
  },
  {
    id: "ai-portfolio-guardian",
    number: "PROJECT_GUARDIAN",
    title: "AI PORTFOLIO GUARDIAN",
    category: "AI RELIABILITY / REPOSITORY AUTOMATION",
    severityTier: "HIGH",
    severityLevel: "SEV-2",
    severityLabel: "Evidence-Based Repair & Human-Reviewed Remediation",
    severityImpact: "Detects portfolio drift and prepares constrained, validated pull requests without autonomous merge.",
    tagline: "A working prototype for detecting project-reference failures, diagnosing them, and preparing safe human-reviewed repairs.",
    description: "An AI-assisted reliability system that validates this portfolio against the external KN-Vignesh/Projects repository, collects structured evidence, fingerprints failures, proposes finite repair operations, validates changes, and prepares a pull request for human review.",
    technologies: ["TypeScript", "Node.js", "GitHub API", "LLM Provider Abstraction", "Deterministic Policy Engine", "GitHub Actions"],
    role: "System Architecture, Reliability Engineering & AI Safety Boundaries",
    systemFlow: [
      "DETECT FAILURE",
      "COLLECT EVIDENCE",
      "FINGERPRINT",
      "AI DIAGNOSIS OR FALLBACK",
      "POLICY VALIDATION",
      "CONTROLLED REPAIR",
      "VALIDATE",
      "BRANCH & HUMAN-REVIEWED PR"
    ],
    repository: "https://github.com/KN-Vignesh/Project-Portfolio/tree/main/guardian",
    status: "PROTOTYPE",
    evaluationMetrics: ["Deterministic Failure Fingerprints", "Protected Repair Paths", "Validation Before PR"],
    sections: {
      problem: "Project references can drift from the external Projects repository, while unrestricted AI repair would create unacceptable repository and credential risk.",
      whyApproach: "The Guardian separates detection, evidence, diagnosis, policy, execution, validation, and Git. The AI proposes structured operations; deterministic code decides whether an exact replacement is allowed.",
      dataInput: "Portfolio project-reference fixtures, GitHub repository and Contents API responses, sanitized failure evidence, and optional structured AI diagnosis.",
      architecture: "A small TypeScript CLI runs a layered pipeline from validation to evidence, fingerprinting, optional GitHub issue, provider-backed diagnosis, policy-checked repair plan, controlled fixture repair, post-repair validation, branch push, and pull request creation.",
      implementation: "The prototype supports dry-run and explicit prototype modes, fallback diagnosis, three known repair operations, protected paths, confidence and file limits, no force push, and no auto-merge.",
      evaluation: "Automated tests cover fingerprinting, evidence normalization, fallback diagnosis, simulated repair, protected paths, and unknown operation rejection. A live read-only check validates the external Projects path.",
      engineeringDecisions: [
        "Kept the Guardian out of browser JavaScript so GitHub and AI credentials never reach visitors.",
        "Chose a finite repair operation set instead of implementing a generic autonomous coding agent.",
        "Made dry-run the default and require explicit write mode before issue, branch, or pull request actions."
      ],
      limitations: [
        "The current detector uses one controlled project-reference fixture.",
        "Rollback, sandboxed execution, distributed locks, and production deployment verification are not implemented.",
        "Real issue, branch, and PR execution requires repository credentials and human review."
      ],
      futureImprovements: [
        "Add stronger schema validation, secret scanning, policy-as-code, isolated worktrees, signed repair plans, and richer risk scoring.",
        "Add deployment-aware rollback, canary verification, multi-repository support, and a review dashboard."
      ]
    },
    relatedProjectIds: ["vero", "qlora"]
  },
  {
    id: "customer-churn",
    number: "PROJECT_002",
    title: "INTELLIGENT CUSTOMER CHURN PREDICTION",
    category: "TRADITIONAL ML / PRODUCTION API",
    severityTier: "HIGH",
    severityLevel: "SEV-2",
    severityLabel: "Revenue Risk Mitigation & Production Inference API",
    severityImpact: "Forecasts telecom subscription attrition ($100k+ ARR risk) via sub-50ms REST API inference.",
    tagline: "A reproducible customer-risk workflow that turns tabular data into an API-ready prediction system.",
    description: "End-to-end production ML pipeline analyzing telecom subscription patterns to forecast retention attrition. Features modular data validation, Scikit-learn preprocessing pipelines, multi-model evaluation, and a low-latency FastAPI inference service packaged with Docker.",
    technologies: ["Python", "Pandas", "Scikit-learn", "FastAPI", "Docker", "Classification", "XGBoost"],
    role: "ML & Backend System Engineering",
    dataset: "Telco Customer Churn",
    systemFlow: [
      "CUSTOMER DATA",
      "DATA VALIDATION",
      "PREPROCESSING",
      "FEATURE ENGINEERING",
      "MODEL COMPARISON",
      "BEST MODEL SELECTION",
      "FASTAPI SERVICE",
      "WEB INTERFACE",
      "DOCKER CONTAINER",
      "DEPLOYMENT PATH"
    ],
    models: ["Logistic Regression", "Random Forest", "XGBoost"],
    evaluationMetrics: ["Accuracy", "Precision", "Recall", "F1 Score", "ROC-AUC"],
    repository: "https://github.com/KN-Vignesh/intelligent-customer-churn-prediction",
    notebookUrl: "https://github.com/KN-Vignesh/Projects/blob/main/Customer_Churn_Prediction_with_ML.ipynb",
    status: "PRODUCTION_READY",
    sections: {
      problem: "Customer attrition impacts revenue recurring streams. The objective was designing a reproducible, end-to-end classification system capable of consuming raw user records, isolating risk indicators (contract length, payment method, monthly charges), and providing sub-50ms prediction endpoints for operational customer-success workflows.",
      whyApproach: "Tabular churn classification benefits from comparing linear baselines against non-linear tree ensembles. While Logistic Regression offers interpretable odds ratios, tree architectures (Random Forest and XGBoost) handle non-linear interactions without complex manual interaction transformations.",
      dataInput: "Telco customer demographics, service subscriptions (fiber optic, streaming, tech support), and account tenure details.",
      architecture: "Decoupled architecture: Data preprocessing pipelines transform categorical and numeric variables into standard numeric tensors. Models are serialized via Joblib, loaded into a stateless FastAPI microservice with Pydantic contract validation, and packaged in a lightweight Alpine-based Docker container.",
      implementation: "Data leakage prevention by isolating train/test transformations. Hyperparameter tuning using stratified cross-validation. REST endpoints exposed at /predict with detailed risk probability breakdowns.",
      evaluation: "Authoritative metrics generated via the reproducible training workflow across Accuracy, Precision, Recall, F1 Score, and ROC-AUC curves. Emphasis on Recall to minimize missed churners.",
      engineeringDecisions: [
        "Strict Pydantic payload schemas ensure client inputs fail fast before passing to inference transforms.",
        "Serialized preprocessor and model inside a unified sklearn Pipeline object preventing training-serving skew.",
        "Containerized with Docker to enable seamless container runtime deployment across any cloud provider."
      ],
      limitations: [
        "Static batch training requires scheduled retrains when customer behavior trends shift.",
        "Class imbalance in churn datasets requires cost-sensitive threshold adjustments depending on business costs."
      ],
      futureImprovements: [
        "Automated concept drift detection using population stability index (PSI).",
        "Integration with real-time event streaming architectures (Kafka/Event Hubs) for continuous inference."
      ]
    },
    relatedProjectIds: ["evaluation", "house-price", "vero"]
  },
  {
    id: "qlora",
    number: "PROJECT_003",
    title: "QLoRA MEMORY-EFFICIENT TRAINING",
    category: "LLM / EFFICIENT TRAINING",
    severityTier: "HIGH",
    severityLevel: "SEV-3",
    severityLabel: "Hardware Bottleneck & Memory-Efficient LLM Adaptation",
    severityImpact: "Slashes GPU VRAM memory overhead by >70% during training while preserving coding benchmark scores.",
    tagline: "Memory-efficient model adaptation using low-bit quantization and trainable LoRA adapters.",
    description: "Advanced parameter-efficient fine-tuning combining 4-bit NormalFloat (NF4) base weight quantization, Double Quantization (DQ), and Paged Optimizers with trainable FP16/BF16 LoRA adapters to adapt multi-billion parameter LLMs on consumer GPU hardware.",
    technologies: ["LLM", "4-bit", "NF4", "BitsAndBytes", "PEFT", "PyTorch", "Transformers"],
    role: "Quantized Fine-Tuning Engineering",
    systemFlow: [
      "BASE LLM WEIGHTS",
      "NF4 QUANTIZATION",
      "DOUBLE QUANTIZATION",
      "FROZEN 4-BIT WEIGHTS",
      "PAGED OPTIMIZERS",
      "LoRA ADAPTER TRAINING",
      "EVALUATION"
    ],
    repository: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/QLoraFine-Tuning",
    status: "RESEARCH_NOTEBOOK",
    evaluationMetrics: [">70% VRAM Savings", "NormalFloat 4 Precision", "Double Quantization Active"],
    sections: {
      problem: "Even with LoRA, storing full-precision base model weights in GPU VRAM limits fine-tuning to enterprise cluster setups. Democratizing adaptation to single-GPU or edge environments requires radical memory compression without degrading output quality.",
      whyApproach: "QLoRA introduces NormalFloat 4 (an information-theoretically optimal quantile quantization for normally distributed weights), Double Quantization to compress quantization constants, and Paged Optimizers to manage memory spikes during gradient updates.",
      dataInput: "Domain instructional corpora tokenized with causal language modeling masks.",
      architecture: "Base weights quantized into 4-bit NF4 using BitsAndBytes. Computations during forward/backward passes dequantize NF4 to BF16 on the fly, calculating gradients only with respect to the LoRA adapters.",
      implementation: "Configured BitsAndBytesConfig with bnb_4bit_quant_type='nf4', bnb_4bit_use_double_quant=True, and bnb_4bit_compute_dtype=torch.bfloat16.",
      evaluation: "Loss convergence curves evaluated against standard FP16 LoRA runs, verifying near-identical training dynamics at ~65% reduced memory usage.",
      engineeringDecisions: [
        "Selected BF16 compute dtype to avoid numerical underflow during adapter backpropagation.",
        "Adopted Double Quantization to save an additional 0.37 bits per parameter."
      ],
      limitations: [
        "Slightly slower training step latency due to real-time dequantization overhead on CUDA kernels.",
        "Adapter merging back into full-precision weights requires dequantization step prior to FP16 export."
      ],
      futureImprovements: [
        "AWQ/GPTQ post-training quantization pipelines for high-throughput production deployment."
      ]
    },
    relatedProjectIds: ["qwen-lora", "bert", "evaluation"]
  },
  {
    id: "qwen-lora",
    number: "PROJECT_004",
    title: "QWEN / LoRA ADAPTATION",
    category: "GENERATIVE AI / PEFT",
    severityTier: "HIGH",
    severityLevel: "SEV-3",
    severityLabel: "Model Parameter-Efficient Fine-Tuning & Weight Decoupling",
    severityImpact: "Adapts multi-billion parameter models with <50MB adapter checkpoints, bypassing monolithic 14GB+ weight re-saves.",
    tagline: "Parameter-efficient adaptation of an open-weight language model using targeted LoRA adapters.",
    description: "Implementation of Low-Rank Adaptation (LoRA) on the Qwen architecture, freezing foundational weights and optimizing low-rank decomposition matrices (A and B) in attention projection layers (q_proj, v_proj) for domain specialization without full-model computational overhead.",
    technologies: ["Qwen", "LoRA", "PEFT", "PyTorch", "Hugging Face", "LLM Fine-Tuning"],
    role: "LLM Model Adaptation & Fine-Tuning",
    systemFlow: [
      "BASE QWEN MODEL",
      "FREEZE BASE WEIGHTS",
      "INJECT LoRA ADAPTERS",
      "FORWARD & BACKWARD PASS",
      "EVALUATION LOSS",
      "ADAPTER MERGING / SERVING"
    ],
    repository: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/LoraFine-tuning",
    status: "RESEARCH_NOTEBOOK",
    evaluationMetrics: ["<50MB Adapter Artifact", "Rank r=16", "Alpha=32"],
    sections: {
      problem: "Full parameter fine-tuning of modern Large Language Models (7B+ parameters) requires immense VRAM and produces massive checkpoint artifacts (14GB+ per task). Deploying specialized agents requires agile adaptation with minimal storage footprints.",
      whyApproach: "Low-Rank Adaptation (LoRA) freezes the pre-trained weights W0 and represents the weight update delta W as the low-rank product B * A, where r << min(d, k). This reduces trainable parameters by over 99% while achieving comparable task accuracy.",
      dataInput: "Structured instruction-tuning format with prompt/response task pairs formatted for causal language modeling.",
      architecture: "PyTorch & Hugging Face PEFT integration. Targeted attention projection modules (q_proj, k_proj, v_proj, o_proj) with rank r=8 or 16 and scaling factor alpha=32. Dropout applied to adapter matrices to prevent overfitting.",
      implementation: "Gradient checkpointing enabled to minimize peak memory during backpropagation. Training executed using AdamW optimizer with cosine learning rate scheduling and warmup steps.",
      evaluation: "Validation perplexity tracking alongside task-specific sample generation evaluations against standard benchmark queries.",
      engineeringDecisions: [
        "Targeted both query and value projections to maintain expressive attention dynamics.",
        "Saved isolated adapter weights (<50MB) rather than duplicated 14GB base model checkpoints.",
        "Supported runtime adapter switching without restarting the base inference engine."
      ],
      limitations: [
        "Requires sufficient hardware for base model weights loading during gradient computation unless combined with quantization.",
        "Rank choice involves an empirical trade-off between expressiveness and memory efficiency."
      ],
      futureImprovements: [
        "Multi-LoRA dynamic multiplexing in serving engines (vLLM / SGLang).",
        "Direct Preference Optimization (DPO) applied on top of the LoRA adapter checkpoints."
      ]
    },
    relatedProjectIds: ["qlora", "bert", "evaluation"]
  },
  {
    id: "bert",
    number: "PROJECT_005",
    title: "BERT MODEL ENGINEERING & DOWNSTREAM NLP",
    category: "MODEL ENGINEERING / NLP",
    severityTier: "MEDIUM",
    severityLevel: "SEV-4",
    severityLabel: "Enterprise NLP Architecture & Representation Learning",
    severityImpact: "Transfers rich bidirectional linguistic representations to specialized classification heads with warm-up stability.",
    tagline: "Adapting bidirectional pretrained Transformer models to downstream language tasks.",
    description: "Deep exploration of encoder-based Transformer representations. Explores bidirectional masked language modeling, tokenization subword segmentation, CLS token pooling, and task-specific classification head fine-tuning for natural language understanding.",
    technologies: ["BERT", "Transformers", "NLP", "PyTorch", "Classification", "NER"],
    role: "NLP Architect & Model Engineering",
    systemFlow: [
      "RAW TEXT STREAM",
      "WORDPIECE TOKENIZER",
      "INPUT EMBEDDINGS (TOKEN+POS+SEG)",
      "12-LAYER TRANSFORMER ENCODER",
      "CLS POOLING LAYER",
      "DOWNSTREAM TASK HEAD",
      "PREDICTIONS & LOSS"
    ],
    repository: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/BERT_MODEL",
    status: "IMPLEMENTED_PIPELINE",
    evaluationMetrics: ["Macro F1 Score", "Linear Warmup", "1.0 Gradient Clipping"],
    sections: {
      problem: "Traditional recurrent architectures (LSTMs, GRUs) struggle with long-range dependencies and cannot process sequential context bidirectionally at scale. Downstream NLP tasks require semantic contextual representations tailored to classification or sequence labeling.",
      whyApproach: "BERT (Bidirectional Encoder Representations from Transformers) leverages self-attention to condition on both left and right context across all layers simultaneously. Pretraining on Masked Language Modeling allows transfer learning to downstream tasks with minimal architecture additions.",
      dataInput: "Text sequences preprocessed with BertTokenizer, utilizing subword tokenization, attention masks, and segment IDs.",
      architecture: "Pre-trained BertModel base with custom linear classification heads attached to the pooled CLS output vector with cross-entropy loss computation.",
      implementation: "PyTorch training loop with AdamW, linear warmup scheduler, and gradient clipping at 1.0 to stabilize Transformer optimization.",
      evaluation: "Validation F1 score, precision-recall curves, and confusion matrices across class labels.",
      engineeringDecisions: [
        "Used subword tokenization to mitigate Out-Of-Vocabulary (OOV) tokens.",
        "Fine-tuned top encoder layers while keeping initial embedding representations constrained to prevent catastrophic forgetting."
      ],
      limitations: [
        "Maximum sequence length constrained to 512 tokens due to O(N^2) quadratic self-attention scaling.",
        "Encoder-only structure limits BERT to understanding tasks rather than free-form autoregressive text generation."
      ],
      futureImprovements: [
        "Experimenting with DistilBERT and RoBERTa architectures for inference latency reduction."
      ]
    },
    relatedProjectIds: ["qwen-lora", "vero", "evaluation"]
  },
  {
    id: "evaluation",
    number: "PROJECT_006",
    title: "MODEL EVALUATION & METRIC CALCULATION",
    category: "ML FOUNDATIONS / EVALUATION",
    severityTier: "MEDIUM",
    severityLevel: "SEV-5",
    severityLabel: "Model Governance & Multi-Metric Risk Verification",
    severityImpact: "Prevents deceptive deployment approvals caused by single-metric vanity bias on imbalanced datasets.",
    tagline: "Combined metric calculation framework for rigorous, evidence-based model comparison.",
    description: "Systematic benchmarking framework computing multi-dimensional performance scores. Synthesizes classification metrics, ROC-AUC, precision-recall trade-offs, and computational efficiency into standardized evaluation reports for model selection.",
    technologies: ["Python", "Scikit-learn", "Statistical Metrics", "Model Selection", "Cross Validation"],
    role: "ML Evaluation & Benchmarking",
    systemFlow: [
      "CANDIDATE MODELS",
      "HELD-OUT TEST SET",
      "METRIC EXTRACTION (ACC, F1, AUC)",
      "CONFIDENCE INTERVAL CALCULATION",
      "COMBINED SCORING MATRIX",
      "DECISION JUSTIFICATION"
    ],
    repository: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/Combined_metric_Calc",
    status: "BENCHMARK_FRAMEWORK",
    evaluationMetrics: ["ROC-AUC Alignment", "Brier Reliability Calibration", "Bootstrap Intervals"],
    sections: {
      problem: "Relying on a single vanity metric (such as raw Accuracy) leads to catastrophic real-world failures, especially under severe class imbalance or asymmetric business misclassification costs.",
      whyApproach: "A multi-faceted evaluation framework standardizes comparisons across models by aggregating discrimination (ROC-AUC), calibrated probability reliability (Brier score), precision-recall trade-offs, and inference latency into unified scorecard reports.",
      dataInput: "True label vectors paired with model predicted classes and continuous prediction probability distributions.",
      architecture: "Modular Python scoring suite with functions for stratified k-fold cross validation, bootstrap confidence intervals, and automated reporting.",
      implementation: "Scikit-learn metric calculators wrapped with deterministic comparison logic and threshold optimization curves.",
      evaluation: "Verified across synthetic and real-world tabular classification problems.",
      engineeringDecisions: [
        "Evaluated models at multiple decision thresholds (0.2, 0.5, 0.8) to map business cost trade-offs.",
        "Reported macro and weighted F1 alongside ROC-AUC to guarantee visibility into minority class performance."
      ],
      limitations: [
        "Offline static evaluation must be supplemented with online A/B testing in production environments."
      ],
      futureImprovements: [
        "Adding LLM evaluation capabilities (LLM-as-a-judge, BLEU, ROUGE, and BERTScore)."
      ]
    },
    relatedProjectIds: ["customer-churn", "qwen-lora", "house-price"]
  },
  {
    id: "house-price",
    number: "PROJECT_007",
    title: "HOUSE PRICE PREDICTION (TF-DF)",
    category: "ML FOUNDATIONS / TABULAR PREDICTION",
    severityTier: "FOUNDATIONAL",
    severityLevel: "SEV-6",
    severityLabel: "Supervised Tabular Regression & Feature Imputation",
    severityImpact: "Tree ensemble modeling with TensorFlow Decision Forests on high-dimensional Ames real estate data.",
    tagline: "Structured machine-learning workflow for predicting property sale prices.",
    description: "Regression modeling pipeline applying TensorFlow Decision Forests to the Ames Housing dataset. Features extensive exploratory data analysis, numerical scaling, categorical encoding, and ensemble regression optimization.",
    technologies: ["Regression", "Tabular ML", "TensorFlow Decision Forests", "Ames Housing", "Python"],
    role: "Tabular Regression Engineering",
    systemFlow: [
      "HOUSING FEATURES (79 VARIABLES)",
      "DATA PREPARATION & IMPUTATION",
      "FEATURE SELECTION",
      "DECISION FOREST REGRESSOR",
      "LOG TRANSFORMATION TARGET",
      "PREDICTION & RESIDUAL EVALUATION"
    ],
    repository: "https://github.com/KN-Vignesh/Projects/tree/main/Data-recipe/House_Price_Prediction",
    status: "IMPLEMENTED_PIPELINE",
    evaluationMetrics: ["RMSLE Optimization", "OOB Cross Validation", "Log Target Scaling"],
    sections: {
      problem: "Real estate valuations involve high-dimensional heterogeneous feature sets (lot area, building quality, geographic zoning) with skewness and non-linear interactions.",
      whyApproach: "TensorFlow Decision Forests natively accommodate mixed categorical and numeric data with robust resistance to outliers and minimal preprocessing requirements compared to neural regressors.",
      dataInput: "Ames Housing dataset containing 79 explanatory variables describing residential homes in Ames, Iowa.",
      architecture: "Data loading via Pandas, transformation to tf.data datasets, training Random Forest and Gradient Boosted Trees models inside TensorFlow Decision Forests.",
      implementation: "Log-transformation of the skewed SalePrice target variable to normalize residuals and optimize Root Mean Squared Logarithmic Error (RMSLE).",
      evaluation: "Evaluated using RMSE on log-transformed targets and out-of-bag (OOB) error estimates.",
      engineeringDecisions: [
        "Applied log1p transformation to eliminate exponential skewness in sales prices.",
        "Utilized tree variable importance metrics to inspect dominant pricing drivers (OverallQual, GrLivArea)."
      ],
      limitations: [
        "Geographic specificity to Ames, Iowa limits direct transferability to other metropolitan markets without retraining."
      ],
      futureImprovements: [
        "Stacking ensemble combining TF-DF with Ridge regression and LightGBM."
      ]
    },
    relatedProjectIds: ["customer-churn", "titanic", "evaluation"]
  },
  {
    id: "cnn",
    number: "PROJECT_008",
    title: "CNN FUNDAMENTALS & SPATIAL CONVOLUTIONS",
    category: "MODEL ENGINEERING / COMPUTER VISION",
    severityTier: "FOUNDATIONAL",
    severityLevel: "SEV-6",
    severityLabel: "Computer Vision Representation Learning & Spatial Inductive Bias",
    severityImpact: "Spatial feature extraction, receptive field mathematics, and convolutional layer optimization in PyTorch.",
    tagline: "Visual representation learning pipeline from raw pixel normalization to spatial convolutions.",
    description: "Foundational exploration of spatial feature hierarchies in Computer Vision. Demonstrates 2D convolution kernels, pooling downsampling, activation non-linearities, spatial feature map extraction, and visual classification architectures.",
    technologies: ["Vision", "PyTorch", "CNN", "Preprocessing", "Computer Vision", "Torchvision"],
    role: "Computer Vision Foundations",
    systemFlow: [
      "RAW IMAGE TENSOR",
      "PREPROCESSING & RESIZING",
      "DATA AUGMENTATION",
      "CONVOLUTIONAL LAYERS (KERNELS)",
      "FEATURE LEARNING & POOLING",
      "FULLY CONNECTED CLASSIFIER",
      "METRICS & ACTIVATION MAPS"
    ],
    repository: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/CNN-Fundamentals",
    status: "EDUCATIONAL_SYSTEM",
    evaluationMetrics: ["Translation Equivariance", "Batch Normalization", "Spatial Receptive Fields"],
    sections: {
      problem: "Fully connected dense networks fail when applied directly to high-dimensional image tensors because they discard spatial 2D locality and suffer from parameter explosion.",
      whyApproach: "Convolutional Neural Networks (CNNs) introduce parameter sharing and translation equivariance via sliding receptive field kernels, enabling hierarchical visual abstraction from low-level edges to semantic shapes.",
      dataInput: "RGB image datasets normalized with mean and standard deviation scaling.",
      architecture: "Convolutional layers with ReLU non-linearities, batch normalization for internal covariate shift mitigation, max pooling for translational invariance, and dense linear output heads.",
      implementation: "Custom PyTorch nn.Module architecture with training loop monitoring train/val loss and top-1 accuracy.",
      evaluation: "Classification accuracy, confusion matrices, and receptive field visualization.",
      engineeringDecisions: [
        "Incorporated Batch Normalization after convolutions to stabilize gradient flow and accelerate convergence.",
        "Implemented real-time data augmentations (random horizontal flips, rotations) to prevent spatial overfitting."
      ],
      limitations: [
        "Fixed input image dimensions require rigid interpolation during inference preprocessing.",
        "CNN architectures possess localized inductive biases compared to modern Vision Transformers (ViTs) on massive data."
      ],
      futureImprovements: [
        "Benchmarking against Vision Transformer (ViT) patch tokenizers on larger dataset scales."
      ]
    },
    relatedProjectIds: ["evaluation", "bert", "house-price"]
  },
  {
    id: "titanic",
    number: "PROJECT_009",
    title: "TITANIC ML BASELINE & FEATURE ENGINEERING",
    category: "ML FOUNDATIONS / CLASSIFICATION",
    severityTier: "FOUNDATIONAL",
    severityLevel: "SEV-6",
    severityLabel: "Exploratory Data Analysis Baseline & Feature Extraction",
    severityImpact: "Systematic EDA, categorical honorific imputation, and feature importance baseline modeling.",
    tagline: "Exploratory data analysis, missing data imputation, and tabular classification baselines.",
    description: "Foundational machine learning pipeline covering rigorous data cleaning, missing value imputation strategies, categorical encoding, and baseline classification modeling on the historical passenger survival dataset.",
    technologies: ["Python", "Pandas", "Scikit-learn", "EDA", "Feature Engineering", "Classification"],
    role: "ML Foundations Baseline",
    systemFlow: [
      "RAW PASSENGER DATA",
      "EXPLORATORY DATA ANALYSIS",
      "FEATURE ENGINEERING (FAMILY SIZE, TITLES)",
      "MISSING VALUE IMPUTATION",
      "CLASSIFICATION MODELING",
      "VALIDATION & ERROR ANALYSIS"
    ],
    repository: "https://github.com/KN-Vignesh/Projects/tree/main/Data-recipe/Titanic_Model",
    status: "FOUNDATIONAL_PROJECT",
    evaluationMetrics: ["Honorific Title Imputation", "Stratified Cross-Validation", "Ensemble Baselines"],
    sections: {
      problem: "Tabular datasets in real-world scenarios arrive with significant missing entries (Age, Cabin), mixed string identifiers (Names, Tickets), and complex socio-economic correlations.",
      whyApproach: "Establishes standard exploratory data analysis (EDA) hygiene: title extraction from names, ticket grouping, and family size engineering to demonstrate structured feature extraction fundamentals.",
      dataInput: "Historical passenger records with age, class, sex, fare, and cabin attributes.",
      architecture: "Jupyter workflow detailing data distributions, bivariate survival rates, feature transformations, and scikit-learn classifiers.",
      implementation: "Imputation using median values grouped by passenger class and gender; one-hot encoding for nominal categories.",
      evaluation: "Stratified cross-validation comparing Logistic Regression, Decision Trees, and Random Forest baselines.",
      engineeringDecisions: [
        "Extracted formal honorifics (Mr, Mrs, Master, Miss) to impute missing ages with higher contextual fidelity.",
        "Engineered FamilySize and IsAlone indicators that significantly correlated with evacuation priority."
      ],
      limitations: [
        "Small dataset scale (891 training samples) prone to variance and leaderboard overfitting."
      ],
      futureImprovements: [
        "Automated feature engineering with feature-tools."
      ]
    },
    relatedProjectIds: ["house-price", "customer-churn", "evaluation"]
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    company: "ACL Digital",
    role: "Software Engineer",
    period: "Aug 2024 – Present",
    type: "Full-Time",
    narrative: "Architecting enterprise applications and integrating Agentic AI capabilities, LLM APIs, and full-stack modules into production systems globally.",
    highlights: [
      "Architected full-stack modules with Agentic AI and LLM APIs for the TLK Device Configuration App (OnePortal) using .NET Core 8, Angular 18, EF, and MySQL globally.",
      "Implemented Reinforcement Learning from Human Feedback (RLHF) strategies and developed rigorous evaluation frameworks to optimize the accuracy, performance, and reliability of internal Generative AI and NLP applications.",
      "Engineered automated data validation and a secure end-to-end scanner implementation designed specifically for client-side Device Registration."
    ],
    technologies: [".NET Core 8", "Angular 18", "Entity Framework", "MySQL", "Agentic AI", "LLM APIs", "RLHF Evaluation", "GenAI / NLP"]
  },
  {
    company: "Enmarq Technologies",
    role: "Software Engineer",
    period: "Aug 2022 – Aug 2024",
    type: "Full-Time",
    narrative: "Engineered scalable cloud automation, serverless REST APIs, vector database search pipelines, and enterprise identity management systems.",
    highlights: [
      "Built serverless REST APIs, Azure Functions, and Azure Service Bus triggers utilizing Azure Cosmos DB (Vector Search data management) and SSMS SQL to power low-latency data ingestion pipelines for downstream NLP pipelines and Generative AI RAG architectures.",
      "Managed Git and Jenkins CI/CD and MLOps pipelines to ensure seamless version control, automated testing, model deployment, and continuous cloud environment operations.",
      "Spearheaded the automated deployment, building, and testing of BeyondTrust PAM and BeyondInsight for 6,000+ users under a strict 90-day timeline.",
      "Executed seamless sequential Sitecore CMS upgrades from v8.3 to 10.3, enhancing Content Hub and Experience Editor workflows.",
      "Developed complex SQL Stored Procedures for Managed Printing Systems to automate multi-stage data integrity alerts."
    ],
    technologies: ["Azure Functions", "Azure Service Bus", "Cosmos DB", "Vector Search", "RAG Pipelines", "Jenkins CI/CD", "Sitecore CMS", "SQL Stored Procedures"]
  },
  {
    company: "Enmarq Technologies",
    role: "Intern Associate",
    period: "Feb 2022 – Jul 2022",
    type: "Internship",
    narrative: "Engineered scheduled data extraction jobs and analytics/AI preparation workflows across enterprise cloud databases.",
    highlights: [
      "Built automated Python and C# scheduled jobs to extract and clean Cosmos DB user data for analytics and AI workflows.",
      "Validated microservices endpoints across backend APIs using Postman and Swagger."
    ],
    technologies: ["Python", "C#", "Cosmos DB", "ETL Pipelines", "Postman", "Swagger", "REST APIs"]
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    title: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    period: "2024 - 2026",
    code: "AZ-900 / DP-900"
  },
  {
    title: "Oracle Cloud Infrastructure (OCI): Generative AI / AI Foundation Certified",
    issuer: "Oracle",
    period: "2023 - 2024",
    code: "OCI Generative AI"
  },
  {
    title: "B.E. Graduate — KVG College of Engineering",
    issuer: "KVG College of Engineering",
    period: "Graduated 2019",
    code: "B.E. Degree"
  }
];

export const AI_LAB_NODES: AILabNode[] = [
  {
    id: "ml-foundations",
    label: "MACHINE LEARNING",
    type: "FOUNDATION",
    description: "Statistical modeling, supervised classification, regression baselines, feature engineering, and cross-validation.",
    connections: ["deep-learning", "evaluation", "apis"],
    relatedProjectIds: ["customer-churn", "house-price", "titanic", "evaluation"],
    coordinates: [-3, -1.5, 0]
  },
  {
    id: "deep-learning",
    label: "DEEP LEARNING",
    type: "FOUNDATION",
    description: "Neural representations, convolutional feature hierarchies, backpropagation, and tensor computation in PyTorch.",
    connections: ["ml-foundations", "nlp", "evaluation"],
    relatedProjectIds: ["cnn", "bert"],
    coordinates: [-2, 0.5, 1]
  },
  {
    id: "nlp",
    label: "NLP & TRANSFORMERS",
    type: "FOUNDATION",
    description: "Bidirectional self-attention, subword tokenization, sequence encoding, and language representation transfer learning.",
    connections: ["deep-learning", "llms", "rag"],
    relatedProjectIds: ["bert", "vero"],
    coordinates: [-1.2, 2, 0.5]
  },
  {
    id: "llms",
    label: "LARGE LANGUAGE MODELS",
    type: "GENERATIVE_AI",
    description: "Open-weight foundational models, causal autoregression, prompt design, and reasoning capabilities.",
    connections: ["nlp", "fine-tuning", "rag", "agents"],
    relatedProjectIds: ["qwen-lora", "qlora", "vero"],
    coordinates: [0, 3, 0]
  },
  {
    id: "fine-tuning",
    label: "PEFT & FINE-TUNING",
    type: "MODEL_ENGINEERING",
    description: "Low-Rank Adaptation (LoRA), QLoRA 4-bit NF4 quantization, and parameter-efficient model alignment.",
    connections: ["llms", "evaluation"],
    relatedProjectIds: ["qwen-lora", "qlora"],
    coordinates: [1.8, 2.2, -0.5]
  },
  {
    id: "rag",
    label: "RAG ARCHITECTURES",
    type: "GENERATIVE_AI",
    description: "Vector embeddings, dense semantic retrieval, similarity search (FAISS, Cosmos DB), and grounded generation.",
    connections: ["llms", "applications", "nlp"],
    relatedProjectIds: ["vero"],
    coordinates: [-0.5, 1, -1.5]
  },
  {
    id: "agents",
    label: "AGENTIC WORKFLOWS",
    type: "GENERATIVE_AI",
    description: "Multi-step tool invocation, deterministic decision trees, self-correction, and structured JSON output contracts.",
    connections: ["llms", "rag", "applications"],
    relatedProjectIds: ["vero"],
    coordinates: [0.8, 0.8, -1.8]
  },
  {
    id: "evaluation",
    label: "EVALUATION & BENCHMARKING",
    type: "MODEL_ENGINEERING",
    description: "Multi-metric scorecards, ROC-AUC, calibration reliability, perplexity, and statistical hypothesis testing.",
    connections: ["ml-foundations", "fine-tuning", "applications"],
    relatedProjectIds: ["evaluation", "customer-churn", "bert"],
    coordinates: [-2.5, -0.5, -1]
  },
  {
    id: "applications",
    label: "SYSTEM INTEGRATION",
    type: "SYSTEMS_APPLICATION",
    description: "Connecting intelligence layers to enterprise backends, deterministic gates, and automated code review workflows.",
    connections: ["rag", "agents", "apis"],
    relatedProjectIds: ["vero", "customer-churn"],
    coordinates: [2, 0, 0]
  },
  {
    id: "apis",
    label: "FASTAPI & MICROSERVICES",
    type: "SYSTEMS_APPLICATION",
    description: "High-throughput asynchronous REST endpoints, FastAPI microservices, and contract-first Pydantic schemas.",
    connections: ["applications", "ml-foundations", "deployment"],
    relatedProjectIds: ["customer-churn"],
    coordinates: [0, -2, 0]
  },
  {
    id: "cloud",
    label: "CLOUD & MLOps",
    type: "SYSTEMS_APPLICATION",
    description: "Azure Functions, Service Bus, Cosmos DB, Jenkins CI/CD automation, and telemetry monitoring.",
    connections: ["deployment", "apis"],
    relatedProjectIds: ["customer-churn"],
    coordinates: [-1.8, -2.5, -0.8]
  },
  {
    id: "deployment",
    label: "DOCKER & SHIP",
    type: "SYSTEMS_APPLICATION",
    description: "Reproducible containerization, container runtimes, deployment pipelines, and operational reliability.",
    connections: ["apis", "cloud"],
    relatedProjectIds: ["customer-churn"],
    coordinates: [0.5, -3, 0.2]
  }
];

export const STACK_CATEGORIES: StackCategory[] = [
  {
    title: "AI, GenAI & NLP",
    iconName: "Sparkles",
    skills: [
      "Natural Language Processing (NLP)",
      "Generative AI (GenAI)",
      "Large Language Models (LLMs)",
      "Agentic AI Workflows",
      "Prompt Engineering",
      "RLHF Evaluation Frameworks",
      "RAG Architectures"
    ],
    summary: "Production-grade Generative AI, agentic reasoning, RAG pipelines, and rigorous RLHF evaluation frameworks."
  },
  {
    title: "AI Frameworks & Tools",
    iconName: "Bot",
    skills: ["LangChain", "LLM APIs (OpenAI, Azure OpenAI)", "Vector Search (Cosmos DB)", "FAISS"],
    summary: "Vector database orchestration, retrieval-augmented generation, and enterprise LLM API integration."
  },
  {
    title: "Languages",
    iconName: "Terminal",
    skills: ["C# (.NET Core, ASP.NET MVC)", "Python", "JavaScript", "HTML", "CSS", "SSMS SQL"],
    summary: "Strong systems programming and analytical language foundation spanning enterprise .NET and modern Python ML."
  },
  {
    title: "Frameworks & CMS",
    iconName: "Code",
    skills: ["Angular (8–19)", "Entity Framework", "Sitecore CMS (8.3 to 10.3)", "Content Hub"],
    summary: "Over 4+ years of battle-tested enterprise frontend and CMS engineering, global context management, and clean architecture."
  },
  {
    title: "Cloud & DevOps",
    iconName: "Cloud",
    skills: ["Docker", "Azure Functions", "Azure Service Bus", "Cosmos DB", "Git", "Jenkins (CI/CD / MLOps)", "Postman", "Swagger"],
    summary: "Serverless cloud automation, distributed messaging, container orchestration, and continuous integration pipelines."
  }
];

export const ENGINEERING_PIPELINE_STEPS = [
  {
    step: "01",
    phase: "UNDERSTAND",
    name: "Problem Definition & Constraints",
    desc: "Rigorous scoping of input data distribution, latency requirements, computational budget, and business failure thresholds.",
    associatedProjects: ["VERO", "Customer Churn"]
  },
  {
    step: "02",
    phase: "BUILD",
    name: "Working Implementation",
    desc: "Developing verified baseline architectures, whether Scikit-learn classification pipelines, PyTorch CNNs, or LoRA adapters.",
    associatedProjects: ["Qwen LoRA", "QLoRA", "CNN Fundamentals"]
  },
  {
    step: "03",
    phase: "EVALUATE",
    name: "Evidence, Metrics & Failure Modes",
    desc: "Multi-dimensional scorecard verification (ROC-AUC, Precision-Recall curves, perplexity) preventing vanity metric bias.",
    associatedProjects: ["Model Evaluation", "BERT"]
  },
  {
    step: "04",
    phase: "SHIP",
    name: "API, Application & Deployment",
    desc: "Packaging models into contract-validated FastAPI endpoints, containerized Docker microservices, or PR bots.",
    associatedProjects: ["VERO", "Customer Churn"]
  },
  {
    step: "05",
    phase: "ITERATE",
    name: "Decisions & Next Experiment",
    desc: "Analyzing runtime logs, concept drift, memory trade-offs, and scaling up to specialized agentic capabilities.",
    associatedProjects: ["VERO", "QLoRA"]
  }
];
