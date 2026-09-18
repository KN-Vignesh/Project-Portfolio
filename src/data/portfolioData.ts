import { ProjectItem, ExperienceItem, CertificationItem, AILabNode, StackCategory } from '../types';

export const PERSONAL_INFO = {
  name: "VIGNESH K N",
  title: "AI SOFTWARE ENGINEER",
  subtitle: "SOFTWARE ENGINEERING → AI ENGINEERING",
  heroStatement: "Building intelligent systems from models to production.",
  supportingText: "Software engineer with 4+ years of experience in full-stack engineering, cloud automation and API integration, now focused on production-oriented AI, Generative AI, LLM orchestration, RAG, agentic workflows and model engineering.",
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

export const PROJECTS: ProjectItem[] = [
  {
    id: "customer-churn",
    number: "PROJECT_001",
    title: "INTELLIGENT CUSTOMER CHURN PREDICTION",
    category: "TRADITIONAL ML / PRODUCTION API",
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
    id: "qwen-lora",
    number: "PROJECT_002",
    title: "QWEN / LoRA ADAPTATION",
    category: "GENERATIVE AI / PEFT",
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
    id: "qlora",
    number: "PROJECT_003",
    title: "QLoRA EFFICIENT TRAINING",
    category: "LLM / EFFICIENT TRAINING",
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
    id: "bert",
    number: "PROJECT_004",
    title: "BERT MODEL ENGINEERING",
    category: "MODEL ENGINEERING / NLP",
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
    id: "vero",
    number: "PROJECT_005",
    title: "VERO — AI CODE ANALYSIS",
    category: "AI APPLICATION / CODE INTELLIGENCE",
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
    sections: {
      problem: "Engineering pull request reviews suffer from inconsistent quality, manual overhead on stylistic/static checks, and missed architectural edge cases. Pure LLM code reviews hallucinate security flaws, while pure static linters lack holistic context.",
      whyApproach: "VERO pairs deterministic static analysis (SonarQube) with structured AI prompts. By grounding LLM evaluation in verified AST diffs and static rule outputs, the system produces actionable, reproducible engineering verdicts.",
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
    id: "cnn",
    number: "PROJECT_006",
    title: "CNN FUNDAMENTALS",
    category: "MODEL ENGINEERING / COMPUTER VISION",
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
    id: "evaluation",
    number: "PROJECT_007",
    title: "MODEL EVALUATION & METRIC CALCULATION",
    category: "ML FOUNDATIONS / EVALUATION",
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
    repository: "https://github.com/KN-Vignesh/Projects",
    status: "BENCHMARK_FRAMEWORK",
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
    number: "PROJECT_008",
    title: "HOUSE PRICE PREDICTION",
    category: "ML FOUNDATIONS / TABULAR PREDICTION",
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
    id: "titanic",
    number: "PROJECT_009",
    title: "TITANIC ML BASELINE",
    category: "ML FOUNDATIONS / CLASSIFICATION",
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
    narrative: "Architecting enterprise applications and integrating Agentic AI capabilities, LLM APIs, and full-stack modules into production systems.",
    highlights: [
      "Architected full-stack modules with Agentic AI and LLM APIs for the TLK Device Configuration App (OnePortal).",
      "Developed high-performance backend microservices using .NET Core 8 and modern frontend interfaces in Angular 18.",
      "Engineered database operations with Entity Framework and MySQL with optimized query patterns.",
      "Implemented Reinforcement Learning from Human Feedback (RLHF) strategies and Generative AI / NLP evaluation frameworks.",
      "Built automated data validation pipelines and a secure scanner implementation for client-side Device Registration."
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
      "Engineered serverless REST APIs using Azure Functions, Azure Service Bus, and Azure Cosmos DB.",
      "Built Vector Search data management architectures and NLP / Generative AI / RAG data pipelines.",
      "Maintained robust CI/CD and MLOps automation with Git, Jenkins, and automated testing suites.",
      "Spearheaded BeyondTrust PAM / BeyondInsight deployment for 6,000+ enterprise users with a 90-day delivery timeline.",
      "Executed Sitecore CMS upgrades from 8.3 to 10.3, Content Hub, Experience Editor, and SQL stored procedures for managed printing systems."
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
      "Developed Python and C# scheduled background jobs for automated cloud data workflows.",
      "Extracted, sanitized, and transformed complex data structures from Cosmos DB for downstream analytics and AI workflows.",
      "Conducted thorough API validation and contract testing utilizing Postman and Swagger specifications."
    ],
    technologies: ["Python", "C#", "Cosmos DB", "ETL Pipelines", "Postman", "Swagger", "REST APIs"]
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    title: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    period: "2024–2026",
    code: "AZ-900 / DP-900"
  },
  {
    title: "Oracle Cloud Infrastructure: Generative AI / AI Foundation",
    issuer: "Oracle",
    period: "2023–2024",
    code: "OCI Generative AI"
  },
  {
    title: "Bachelor of Engineering (B.E.)",
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
    description: "Autonomous reasoning loops, multi-step tool invocation, deterministic decision gating, and structured schema execution.",
    connections: ["llms", "applications"],
    relatedProjectIds: ["vero"],
    coordinates: [1.2, 1.2, 1.2]
  },
  {
    id: "evaluation",
    label: "MODEL EVALUATION",
    type: "MODEL_ENGINEERING",
    description: "Multi-dimensional metric scorecards, ROC-AUC, Precision-Recall trade-offs, and RLHF evaluation methodologies.",
    connections: ["fine-tuning", "ml-foundations", "deep-learning", "applications"],
    relatedProjectIds: ["evaluation", "customer-churn"],
    coordinates: [2.5, 0, 0]
  },
  {
    id: "applications",
    label: "AI APPLICATIONS",
    type: "SYSTEMS_APPLICATION",
    description: "Production software integration combining LLM intelligence with domain rules and enterprise context.",
    connections: ["agents", "rag", "apis", "evaluation"],
    relatedProjectIds: ["vero", "customer-churn"],
    coordinates: [1.5, -1, 0.5]
  },
  {
    id: "apis",
    label: "PRODUCTION APIs",
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
    title: "FOUNDATIONS & LANGUAGES",
    iconName: "Terminal",
    skills: ["Python", "C#", ".NET Core", "SQL", "JavaScript", "HTML", "CSS", "Git"],
    summary: "Strong systems programming and analytical language foundation spanning enterprise .NET and modern Python ML ecosystems."
  },
  {
    title: "MACHINE LEARNING",
    iconName: "Cpu",
    skills: ["NumPy", "Pandas", "Scikit-learn", "PyCaret", "Classification", "Regression", "Model Evaluation", "Cross Validation"],
    summary: "Production tabular pipelines, feature engineering, exploratory data analysis, and mathematical validation."
  },
  {
    title: "DEEP LEARNING",
    iconName: "Layers",
    skills: ["PyTorch", "TensorFlow", "Transformers", "CNN", "BERT", "Torchvision", "Decision Forests"],
    summary: "Neural architectures spanning convolutional computer vision and bidirectional Transformer encoders."
  },
  {
    title: "GENERATIVE AI & LLMs",
    iconName: "Sparkles",
    skills: ["Large Language Models", "Generative AI", "Prompt Engineering", "RAG", "Embeddings", "LoRA", "QLoRA", "PEFT", "LLM APIs"],
    summary: "Parameter-efficient model adaptation, 4-bit quantization, targeted adapters, and grounded prompt synthesis."
  },
  {
    title: "AI APPLICATIONS & AGENTS",
    iconName: "Bot",
    skills: ["FastAPI", "REST APIs", "LangChain", "Agentic Workflows", "Vector Search", "FAISS", "Azure OpenAI", "Decision Engines"],
    summary: "Building deterministic application backends that orchestrate multi-step agent actions and external static analysis."
  },
  {
    title: "SOFTWARE ENGINEERING",
    iconName: "Code",
    skills: [".NET Core 8", "ASP.NET MVC", "Angular 8–18", "Entity Framework", "MySQL", "SSMS SQL", "Sitecore CMS", "System Design"],
    summary: "Over 4+ years of battle-tested enterprise software engineering, global context management, and clean architecture."
  },
  {
    title: "CLOUD & DEVOPS / MLOps",
    iconName: "Cloud",
    skills: ["Docker", "Azure Functions", "Azure Service Bus", "Cosmos DB", "Git", "Jenkins", "CI/CD", "MLOps", "Postman", "Swagger"],
    summary: "Serverless cloud automation, distributed messaging, container orchestration, and continuous integration pipelines."
  }
];

export const ENGINEERING_PIPELINE_STEPS = [
  {
    step: "01",
    phase: "UNDERSTAND",
    name: "Problem Definition & Constraints",
    desc: "Rigorous scoping of input data distribution, latency requirements, computational budget, and business failure thresholds.",
    associatedProjects: ["Customer Churn", "VERO"]
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
    associatedProjects: ["Customer Churn", "VERO"]
  },
  {
    step: "05",
    phase: "ITERATE",
    name: "Decisions & Next Experiment",
    desc: "Analyzing runtime logs, concept drift, memory trade-offs, and scaling up to specialized agentic capabilities.",
    associatedProjects: ["VERO", "QLoRA"]
  }
];
