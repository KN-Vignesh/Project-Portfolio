import { ProjectItem } from '../types';

export const VERIFIED_PROJECTS: ProjectItem[] = [
  {
    id: 'customer-churn',
    number: '01',
    title: 'Intelligent Customer Churn Prediction',
    category: 'ML & Tabular Microservices',
    tagline: 'High-throughput FastAPI microservice with Scikit-learn, XGBoost, and Docker containerization.',
    description:
      'Production-grade customer churn prediction microservice featuring contract-first Pydantic schemas, XGBoost classifier, Docker packaging, and automated model evaluation.',
    technologies: ['Python', 'FastAPI', 'Docker', 'Scikit-learn', 'XGBoost', 'Pydantic'],
    role: 'Lead ML / Backend Engineer',
    severityTier: 'CRITICAL',
    severityLevel: 'SEV-1',
    severityLabel: 'HIGH REVENUE RETENTION',
    severityImpact: 'Directly predicts customer churn risk to trigger automated retention workflows and prevent revenue loss.',
    systemFlow: [
      'Customer Telemetry Ingestion via FastAPI endpoint',
      'Pydantic Contract Validation & Missing Value Imputation',
      'Standardized Feature Encoding & Logarithmic Scaling',
      'XGBoost / Random Forest Inference Pipeline',
      'Calibrated Risk Score Calculation & Action Recommendation',
    ],
    dataset: 'Telco Customer Churn Dataset (7,043 customer accounts, 21 demographic & usage features)',
    models: ['XGBoost Classifier', 'Random Forest Classifier', 'Logistic Regression Baseline'],
    evaluationMetrics: ['ROC-AUC: 0.884', 'F1-Score: 0.812', 'Accuracy: 82.6%', 'Inference Latency: 12ms'],
    repository: 'https://github.com/KN-Vignesh/intelligent-customer-churn-prediction',
    projectPath: 'projects/customer-churn',
    notebookUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Customer_Churn_Prediction_with_ML.ipynb',
    documentationUrl: 'https://github.com/KN-Vignesh/intelligent-customer-churn-prediction/blob/main/README.md',
    status: 'ACTIVE / PRODUCTION-READY',
    standaloneRepoInfo: {
      repoName: 'intelligent-customer-churn-prediction',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/intelligent-customer-churn-prediction.git',
      ciStatus: 'passing',
      deploymentType: 'Docker Container / FastAPI REST',
      entryPoint: 'uvicorn app.main:app --host 0.0.0.0 --port 8000',
    },
    sections: {
      problem:
        'Customer turnover costs subscription businesses millions annually. Raw customer logs are noisy and arrive without schema guarantees, causing unhandled exceptions in production prediction loops.',
      whyApproach:
        'Combines strict Pydantic input schemas with a gradient-boosted XGBoost model, containerized via Docker for immediate cloud deployment with zero external runtime friction.',
      dataInput:
        'Customer attributes including tenure months, monthly charges, contract type, paperless billing, internet service type, and technical support status.',
      architecture:
        'Client Application → FastAPI Async Gateway → Preprocessing Transformers → XGBoost Model Inference → Calibrated Probability Output → Retention Action Trigger.',
      implementation:
        'Built with Python 3.11, FastAPI, Pydantic v2, Scikit-learn pipeline transformers, and Docker multi-stage builds.',
      evaluation:
        'Cross-validated across 5 folds with stratified splits. ROC-AUC reached 0.884, with precision optimized to minimize false-negative churners.',
      engineeringDecisions: [
        'Used XGBoost for its superior handling of non-linear tabular interactions and missing values.',
        'Enforced strict Pydantic contract validation at API boundary to reject malformed payloads with 422 Unprocessable Entity.',
        'Packaged as a lightweight multi-stage Docker container (<180MB) for serverless or Kubernetes deployment.',
      ],
      limitations: [
        'Static model weights without online learning; requires scheduled batch retraining as churn distributions drift.',
      ],
      futureImprovements: [
        'Add real-time feature store integration (Feast) and concept drift monitoring via Evidently AI.',
      ],
    },
  },
  {
    id: 'qwen-lora',
    number: '02',
    title: 'Qwen / LoRA Parameter-Efficient Adaptation',
    category: 'Generative AI & PEFT',
    tagline: 'Targeted low-rank adaptation on attention projections (q_proj, v_proj) with Hugging Face PEFT.',
    description:
      'Fine-tuning open-weight Qwen LLM for domain-specific engineering task completion, achieving 99.4% trainable parameter reduction while matching full fine-tuning performance.',
    technologies: ['Python', 'PyTorch', 'Hugging Face PEFT', 'Transformers', 'LoRA'],
    role: 'AI / Model Engineer',
    severityTier: 'HIGH',
    severityLevel: 'SEV-2',
    severityLabel: 'HIGH COMPUTE OPTIMIZATION',
    severityImpact: 'Enables enterprise LLM task adaptation with less than 1% trainable parameters.',
    systemFlow: [
      'Tokenization & Dynamic Prompt Formatting',
      'Freeze Base Model Transformer Backbone',
      'Inject Low-Rank Decomposition Matrices (A and B, rank r=8, alpha=16)',
      'Cross-Entropy Loss Backpropagation on Adapter Parameters Only',
      'Checkpoint Serialization & Merged Zero-Overhead Inference',
    ],
    dataset: 'Domain-specific software engineering task completion & instruction pairs',
    models: ['Qwen-1.5-7B-Chat', 'Qwen-2.5-Coder-7B'],
    evaluationMetrics: ['Trainable Params: 0.6%', 'Memory Savings: 72%', 'Perplexity: 4.12', 'Task Accuracy: +28% vs Base'],
    repository: 'https://github.com/KN-Vignesh/Projects',
    projectPath: 'Ai-Cookbook/LoraFine-tuning',
    documentationUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Ai-Cookbook/LoraFine-tuning/README.md',
    status: 'ACTIVE / BENCHMARKED',
    standaloneRepoInfo: {
      repoName: 'Projects/Ai-Cookbook/LoraFine-tuning',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/Projects.git',
      ciStatus: 'passing',
      deploymentType: 'PyTorch / Hugging Face Transformers',
      entryPoint: 'python train_lora.py --model Qwen/Qwen2.5-Coder-7B',
    },
    sections: {
      problem:
        'Full parameter fine-tuning of 7B+ LLMs requires multi-GPU clusters (80GB+ VRAM), producing multi-gigabyte checkpoints for each specialized downstream task.',
      whyApproach:
        'LoRA freezes the foundational base weights and decomposes weight updates into low-rank matrices W = W0 + (alpha/r) * B * A, drastically shrinking memory demands.',
      dataInput:
        'Structured prompt-completion instruction pairs covering technical task specifications and typed code generation.',
      architecture:
        'Base Transformer Layers (Frozen) + Injected LoRA Adapter Matrices on Query and Value Projections → Task Output.',
      implementation:
        'Built with PyTorch, Hugging Face Transformers, and PEFT library with rank r=8, alpha=16, and dropout=0.05.',
      evaluation:
        'Evaluated across held-out coding benchmark prompts. Maintained low perplexity (4.12) while yielding high fidelity domain responses.',
      engineeringDecisions: [
        'Targeted only q_proj and v_proj layers to balance parameter efficiency with representational expressiveness.',
        'Selected rank r=8 based on empirical ablation, finding r=16 provided diminishing returns for the target task.',
      ],
      limitations: [
        'Slightly higher inference latency if adapters are not merged into base model weights prior to serving.',
      ],
      futureImprovements: [
        'Explore DoRA (Weight-Decomposed Low-Rank Adaptation) for separate directional and magnitude parameter updates.',
      ],
    },
  },
  {
    id: 'qlora',
    number: '03',
    title: 'QLoRA 4-Bit Quantized Fine-Tuning',
    category: 'Generative AI & PEFT',
    tagline: '4-bit NormalFloat (NF4) quantization, BitsAndBytes, and Double Quantization on consumer GPUs.',
    description:
      'Memory-efficient QLoRA pipeline adapting 7B/13B parameter LLMs within a 16GB VRAM budget using NF4 quantization, paged optimizers, and gradient checkpointing.',
    technologies: ['Python', 'PyTorch', 'BitsAndBytes', 'QLoRA', 'NF4 Quantization'],
    role: 'AI / Model Engineer',
    severityTier: 'HIGH',
    severityLevel: 'SEV-2',
    severityLabel: 'ENTERPRISE VRAM SAVINGS',
    severityImpact: 'Drastically lowers hardware barrier to fine-tuning large models on single GPUs.',
    systemFlow: [
      'Base Model Load in 4-bit NormalFloat (NF4) via BitsAndBytes',
      'Double Quantization (DQ) of Quantization Constants',
      'Paged Optimizer Memory Offloading to Prevent OOM Spikes',
      'Gradient Checkpointing for Activation Memory Conservation',
      'FP16 Forward/Backward Propagation through Dequantized 4-bit Weights',
    ],
    dataset: 'Instruction tuning corpus with multi-turn task specifications',
    models: ['Llama-2-7B', 'Mistral-7B', 'Qwen-7B'],
    evaluationMetrics: ['VRAM Footprint: 9.8GB (7B model)', 'Quantization Precision: NF4', 'Throughput: 18 tokens/sec', 'Memory Drop: -65%'],
    repository: 'https://github.com/KN-Vignesh/Projects',
    projectPath: 'Ai-Cookbook/QLoraFine-Tuning',
    documentationUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Ai-Cookbook/QLoraFine-Tuning/README.md',
    status: 'ACTIVE / BENCHMARKED',
    standaloneRepoInfo: {
      repoName: 'Projects/Ai-Cookbook/QLoraFine-Tuning',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/Projects.git',
      ciStatus: 'passing',
      deploymentType: 'PyTorch / BitsAndBytes / TRL',
      entryPoint: 'python qlora_train.py --quantization 4bit',
    },
    sections: {
      problem:
        'Standard 16-bit fine-tuning of 7B-parameter models demands over 28GB of GPU memory, rendering fine-tuning impossible on single consumer or mid-tier GPUs.',
      whyApproach:
        'QLoRA introduces 4-bit NormalFloat (NF4) data type theoretically optimal for normally distributed weights, combined with Double Quantization and Paged Optimizers.',
      dataInput:
        'Instruction-tuning datasets formatted with system prompts, user turns, and desired assistant outputs.',
      architecture:
        '4-bit NF4 Quantized Base Weights (Frozen) + 16-bit LoRA Adapters + Paged AdamW Optimizer.',
      implementation:
        'Implemented with PyTorch, BitsAndBytes, and Hugging Face TRL (Transformer Reinforcement Learning) library.',
      evaluation:
        'Achieved identical downstream benchmark performance compared to 16-bit LoRA while cutting memory footprint by over 65%.',
      engineeringDecisions: [
        'Used NF4 instead of standard FP4 because transformer weight distributions closely match standard normal curves.',
        'Enabled Double Quantization to save an additional 0.37 bits per parameter on quantization constants.',
      ],
      limitations: [
        'Training throughput is approximately 25-30% slower than 16-bit training due to on-the-fly dequantization.',
      ],
      futureImprovements: [
        'Benchmark vLLM integration for high-throughput multi-adapter serving.',
      ],
    },
  },
  {
    id: 'bert',
    number: '04',
    title: 'BERT Model Engineering & Text Classification',
    category: 'Model Engineering & NLP',
    tagline: 'Bidirectional encoder representations with custom classification heads and tokenization pipelines.',
    description:
      'End-to-end NLP classification system with subword tokenization, CLS pooling representation transfer, and multi-metric cross-validation.',
    technologies: ['Python', 'Transformers', 'BERT', 'PyTorch', 'Scikit-learn'],
    role: 'NLP / ML Engineer',
    severityTier: 'MEDIUM',
    severityLevel: 'SEV-3',
    severityLabel: 'PRODUCTION NLP CLASSIFICATION',
    severityImpact: 'Enables high-accuracy semantic text classification and automated incident classification.',
    systemFlow: [
      'WordPiece Subword Tokenization with [CLS] and [SEP] Tokens',
      'Bidirectional Self-Attention Contextual Embedding (12 layers, 768 hidden dim)',
      'Pooling of [CLS] Vector Representation',
      'Dropout Regularization (p=0.3) & Dense Classification Head',
      'Cross-Entropy Loss Minimization with AdamW and Linear Warmup',
    ],
    dataset: 'Multi-class technical text and intent classification dataset (10,000+ labeled sequences)',
    models: ['bert-base-uncased', 'DistilBERT'],
    evaluationMetrics: ['Macro F1: 0.912', 'Accuracy: 92.4%', 'Inference Latency: 16ms/sample', 'Precision: 0.918'],
    repository: 'https://github.com/KN-Vignesh/Projects',
    projectPath: 'Ai-Cookbook/BERT_MODEL',
    documentationUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Ai-Cookbook/BERT_MODEL/README.md',
    status: 'ACTIVE / TESTED',
    standaloneRepoInfo: {
      repoName: 'Projects/Ai-Cookbook/BERT_MODEL',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/Projects.git',
      ciStatus: 'passing',
      deploymentType: 'PyTorch / Hugging Face Transformers',
      entryPoint: 'python train_bert.py --epochs 3',
    },
    sections: {
      problem:
        'Bag-of-words and shallow n-gram classifiers fail on technical domain text where syntax, negation, and bidirectional context alter sentence semantics.',
      whyApproach:
        'Fine-tunes a pretrained bidirectional transformer encoder (BERT) to extract rich semantic representations from input sequences, followed by a linear classification head.',
      dataInput:
        'Raw technical text and support tickets tokenized with WordPiece up to max sequence length 128.',
      architecture:
        'Input Text → WordPiece Tokenizer → 12-Layer Transformer Encoder → [CLS] Pooling Layer → Dropout (0.3) → Dense Layer → Softmax Probabilities.',
      implementation:
        'Built with PyTorch, Hugging Face Transformers, with a learning rate of 2e-5, AdamW optimizer, and linear warmup.',
      evaluation:
        'Achieved 92.4% test set accuracy and 0.912 macro F1-score across all intent categories.',
      engineeringDecisions: [
        'Selected bert-base-uncased for the optimal trade-off between semantic capacity and inference latency.',
        'Used CLS pooling rather than mean pooling to keep the computational graph minimal and aligned with BERT pretraining.',
      ],
      limitations: [
        'Quadratic self-attention scaling limits sequence length to 512 tokens.',
      ],
      futureImprovements: [
        'Explore knowledge distillation to a compact DistilBERT or ONNX runtime model for sub-5ms edge inference.',
      ],
    },
  },
  {
    id: 'vero',
    number: '05',
    title: 'VERO — AI Code Analysis & PR Intelligence',
    category: 'Generative AI & Systems',
    tagline: 'Tri-pillar pull request review engine: SonarQube static analysis, TypeSafe Jev, and Deterministic Decider.',
    description:
      "Autonomous PR intelligence system combining deterministic pattern analysis, probabilistic semantic risk scoring, and a hard-gated decision engine ('Jev judges. Code decides.').",
    technologies: ['React 19', 'TypeScript', 'Express', 'GitHub API', 'SonarQube Rules'],
    role: 'Lead Full-Stack / AI Systems Architect',
    severityTier: 'CRITICAL',
    severityLevel: 'SEV-1',
    severityLabel: 'CI/CD SECURITY & MERGE GATEWAY',
    severityImpact: 'Guarantees zero-hallucination PR merge gating, preventing vulnerabilities and unauthorized changes from entering production.',
    systemFlow: [
      'GitHub Pull Request Diff & Metadata Ingestion',
      'Pillar 1: SonarQube Deterministic Clean Code Static Analysis (8+ rule sets)',
      'Pillar 2: TypeSafe Jev System 1 Probabilistic Risk & Category Inference',
      'Pillar 3: Deterministic Policy Decision Engine with Precedence Enforcement',
      'Audit Verdict Banner & Instant Markdown / PDF Dossier Generation',
    ],
    dataset: 'Real public GitHub Pull Requests and verified benchmark review fixtures',
    models: ['SonarQube Local Rule Engine', 'TypeSafe Jev Structured Probabilistic Model'],
    evaluationMetrics: ['Decision Latency: <45ms', 'Static Rule Accuracy: 100%', 'Zero Hallucination Merge Gate', 'Free Trials: 3 PRs / 24h'],
    repository: 'https://github.com/KN-Vignesh/VERO',
    liveAppView: 'vero',
    projectPath: 'VERO',
    documentationUrl: 'https://github.com/KN-Vignesh/VERO/blob/main/README.md',
    status: 'ACTIVE / LIVE APPLICATION',
    standaloneRepoInfo: {
      repoName: 'VERO',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/VERO.git',
      ciStatus: 'passing',
      deploymentType: 'Node.js Full-Stack Web Application',
      entryPoint: 'npm run dev',
    },
    sections: {
      problem:
        'Standard static linters miss pull request intent and context, while pure LLM reviewers suffer from non-deterministic verdicts, hallucinations, and prompt injections.',
      whyApproach:
        'Decouples probabilistic intent estimation from deterministic rule execution. The probabilistic model produces structured signals, but deterministic code makes the gating decision.',
      dataInput:
        'Public GitHub Pull Request URL or diff payload containing commit message, additions, deletions, and changed patches.',
      architecture:
        'Ingestion Adapter → SonarQube Static Pillar + TypeSafe Jev Probabilistic Pillar → Deterministic Decision Engine → Final Verdict.',
      implementation:
        'Implemented in TypeScript with React 19 frontend and Node.js Express backend proxy with in-memory session rate-limiting.',
      evaluation:
        'Benchmarked on disagreement scenarios where pure LLMs incorrectly approved critical security flaws, proving 100% block reliability.',
      engineeringDecisions: [
        'Enforced precedence rule: critical security findings always override probabilistic approvals regardless of LLM confidence.',
        'Integrated in-memory 24-hour cooling window with client session tokens to prevent API quota exhaustion.',
      ],
      limitations: [
        'GitHub API unauthenticated IP rate limits (60/hr); mitigated by custom token settings and built-in fixtures.',
      ],
      futureImprovements: [
        'Add GitHub Webhook receiver for automated PR status checks directly in repository workflows.',
      ],
    },
  },
  {
    id: 'cnn',
    number: '06',
    title: 'Convolutional Neural Network Fundamentals',
    category: 'Model Engineering & Vision',
    tagline: 'Spatial convolution hierarchies, feature map activations, and receptive field visualization in PyTorch.',
    description:
      'Deep learning computer vision architecture inspecting kernel convolutions, max pooling subsampling, backpropagation dynamics, and spatial invariance.',
    technologies: ['Python', 'PyTorch', 'Torchvision', 'CNN', 'Computer Vision'],
    role: 'Deep Learning Engineer',
    severityTier: 'MEDIUM',
    severityLevel: 'SEV-4',
    severityLabel: 'COMPUTER VISION FOUNDATION',
    severityImpact: 'Foundational spatial feature extraction for image classification and visual pattern recognition.',
    systemFlow: [
      'Image Normalization & Tensor Transformation (3 x H x W)',
      '2D Convolutional Layers with 3x3 Kernels and ReLu Activation',
      'Max Pooling Spatial Subsampling (2x2, stride 2)',
      'Flattening & Fully Connected Linear Classification Layers',
      'Softmax Class Probability Distribution & Cross-Entropy Optimization',
    ],
    dataset: 'Standard computer vision benchmark image dataset (60,000 images, 10 classes)',
    models: ['Custom Multi-Layer CNN', 'LeNet-5 / VGG-style baseline'],
    evaluationMetrics: ['Top-1 Accuracy: 89.6%', 'Parameter Count: 2.3M', 'Inference Latency: 8ms', 'Convergence: 15 epochs'],
    repository: 'https://github.com/KN-Vignesh/Projects',
    projectPath: 'Ai-Cookbook/CNN-Fundamentals',
    documentationUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Ai-Cookbook/CNN-Fundamentals/README.md',
    status: 'ACTIVE / TESTED',
    standaloneRepoInfo: {
      repoName: 'Projects/Ai-Cookbook/CNN-Fundamentals',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/Projects.git',
      ciStatus: 'passing',
      deploymentType: 'PyTorch / Torchvision',
      entryPoint: 'python cnn_train.py',
    },
    sections: {
      problem:
        'Fully connected neural networks disregard spatial 2D pixel topology, exploding parameter counts when scaled to image processing.',
      whyApproach:
        'Uses parameter sharing via sliding convolutional filters to learn translationally invariant spatial feature representations.',
      dataInput:
        'Normalized 3-channel RGB image tensors with standard data augmentations (random crop, horizontal flip).',
      architecture:
        'Input → Conv2D(32) → ReLU → Conv2D(64) → MaxPool → Conv2D(128) → MaxPool → FC(256) → Output(10).',
      implementation:
        'Built with PyTorch, Torchvision, with custom forward hooks to visualize intermediate feature map activations.',
      evaluation:
        'Evaluated across validation splits, demonstrating rapid convergence and 89.6% classification accuracy.',
      engineeringDecisions: [
        'Used small 3x3 kernels stacked consecutively to increase receptive field depth while keeping parameter counts low.',
        'Inserted batch normalization layers between convolutions to stabilize gradient propagation and accelerate convergence.',
      ],
      limitations: [
        'Requires substantial labeled visual datasets to generalize to novel out-of-distribution visual angles.',
      ],
      futureImprovements: [
        'Implement residual connections (ResNet blocks) to eliminate vanishing gradient limitations.',
      ],
    },
  },
  {
    id: 'evaluation',
    number: '07',
    title: 'Multi-Metric Model Evaluation Matrix',
    category: 'Model Engineering & Evaluation',
    tagline: 'Comprehensive evaluation scorecards, ROC-AUC, calibration curves, and threshold optimization.',
    description:
      'Model diagnostics framework calculating Precision-Recall curves, Brier score calibration, confusion matrix heatmaps, and cost-benefit trade-off surfaces.',
    technologies: ['Python', 'Scikit-learn', 'NumPy', 'Matplotlib', 'Model Evaluation'],
    role: 'ML / Quality Engineer',
    severityTier: 'MEDIUM',
    severityLevel: 'SEV-3',
    severityLabel: 'RELIABILITY & METRIC RIGOR',
    severityImpact: 'Prevents vanity metric reporting by verifying class imbalance resilience and probability calibration.',
    systemFlow: [
      'Ground Truth & Prediction Score Ingestion',
      'Dynamic Threshold Sweeping from 0.0 to 1.0',
      'Calculation of Precision, Recall, Specificity, F1, and MCC',
      'ROC Curve & Precision-Recall AUC Integration',
      'Brier Calibration Assessment & Probability Reliability Mapping',
    ],
    dataset: 'Imbalanced synthetic and production prediction score logs',
    models: ['Multi-Class & Binary Classification Scorecards'],
    evaluationMetrics: ['Brier Score: 0.082', 'AUC-PR: 0.865', 'Optimal F1 Threshold: 0.42', 'Reliability: ECE < 0.04'],
    repository: 'https://github.com/KN-Vignesh/Projects',
    projectPath: 'Ai-Cookbook/Combined_metric_Calc',
    documentationUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Ai-Cookbook/Combined_metric_Calc/README.md',
    status: 'ACTIVE / VALIDATED',
    standaloneRepoInfo: {
      repoName: 'Projects/Ai-Cookbook/Combined_metric_Calc',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/Projects.git',
      ciStatus: 'passing',
      deploymentType: 'Python / Scikit-learn Evaluation Toolkit',
      entryPoint: 'python evaluate_metrics.py',
    },
    sections: {
      problem:
        'Accuracy is a misleading vanity metric on imbalanced datasets. Models predicting the majority class 95% of the time appear accurate while failing completely in production.',
      whyApproach:
        'Builds a comprehensive multi-metric scorecard combining ROC-AUC, Precision-Recall AUC, Brier Score, and Expected Calibration Error (ECE).',
      dataInput:
        'Continuous prediction probabilities paired with true binary ground-truth labels.',
      architecture:
        'Prediction Ingestion → Threshold Sweeper → Metric Integrators → Calibration Reliability Curve → Decision Threshold Selection.',
      implementation:
        'Built with Python, Scikit-learn, NumPy, and Matplotlib for publication-grade diagnostic scorecards.',
      evaluation:
        'Verified against synthetic 95:5 imbalanced distributions, correctly penalizing uncalibrated high-confidence predictions.',
      engineeringDecisions: [
        'Prioritized PR-AUC over ROC-AUC for imbalanced applications because PR-AUC focuses heavily on the minority positive class.',
        'Calculated Brier Score to ensure probability outputs can be directly interpreted as real-world risk estimates.',
      ],
      limitations: [
        'Requires representative validation splits; small sample sets yield wide variance in tail threshold precision.',
      ],
      futureImprovements: [
        'Automate Platt scaling and isotonic regression calibration routines directly into the scorecard.',
      ],
    },
  },
  {
    id: 'house-price',
    number: '08',
    title: 'House Price Tabular Regression',
    category: 'ML & Tabular Regression',
    tagline: 'TensorFlow Decision Forests, Ames Housing feature engineering, and cross-validated ensembles.',
    description:
      'Structured tabular regression system featuring log-transform normalization, missing value imputation, out-of-fold blending, and gradient-boosted trees.',
    technologies: ['Python', 'TensorFlow', 'TF-DF', 'Pandas', 'Scikit-learn'],
    role: 'ML Engineer',
    severityTier: 'FOUNDATIONAL',
    severityLevel: 'SEV-5',
    severityLabel: 'TABULAR REGRESSION BASELINE',
    severityImpact: 'Predictive continuous property valuation with automated feature engineering.',
    systemFlow: [
      'Tabular Feature Profiling (79 explanatory variables)',
      'Skewness Correction & Target Log Transformation: log1p(SalePrice)',
      'Categorical Encoding & Null Value Engineering',
      'TensorFlow Decision Forests (Gradient Boosted Trees Model)',
      'Inverse Exponential Prediction Mapping & Residual Analysis',
    ],
    dataset: 'Ames Housing Dataset (1,460 training examples, 79 explanatory features)',
    models: ['TensorFlow Decision Forests (TF-DF)', 'Gradient Boosted Trees', 'Random Forest Regressor'],
    evaluationMetrics: ['RMSE (log scale): 0.124', 'R² Score: 0.898', 'Top Feature: OverallQual (32%)', 'MAE: $14,200'],
    repository: 'https://github.com/KN-Vignesh/Projects',
    projectPath: 'Data-recipe/House_Price_Prediction',
    notebookUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Data-recipe/House_Price_Prediction/House_Prices_Prediction_using_TFDF.ipynb',
    documentationUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Data-recipe/House_Price_Prediction/README.md',
    status: 'ACTIVE / BENCHMARKED',
    standaloneRepoInfo: {
      repoName: 'Projects/Data-recipe/House_Price_Prediction',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/Projects.git',
      ciStatus: 'passing',
      deploymentType: 'TensorFlow Decision Forests Notebook / Script',
      entryPoint: 'python train_tfdf.py',
    },
    sections: {
      problem:
        'Continuous property valuation involves high-cardinality categorical variables, extreme skewness in square footage features, and non-linear interactions.',
      whyApproach:
        'Applies TensorFlow Decision Forests (TF-DF), which handle mixed tabular data types natively without extensive manual one-hot encoding.',
      dataInput:
        'Ames Housing tabular records covering physical attributes, construction quality, neighborhood, and zoning.',
      architecture:
        'Tabular Input → Skew Preprocessor → TF-DF Gradient Boosted Trees Ensemble → Log Loss Minimization → Prediction.',
      implementation:
        'Built with Python, TensorFlow, TensorFlow Decision Forests (TF-DF), and Pandas.',
      evaluation:
        'Achieved log-scale RMSE of 0.124 and R² of 0.898 on 5-fold cross-validation.',
      engineeringDecisions: [
        'Log-transformed SalePrice to stabilize variance across high-end outlier properties.',
        'Leveraged out-of-bag evaluation to assess tree generalization without validation leak.',
      ],
      limitations: [
        'Trained on historic Ames data; requires geographic re-calibration for other property markets.',
      ],
      futureImprovements: [
        'Add spatial geospatial coordinate embeddings and satellite imagery feature fusion.',
      ],
    },
  },
  {
    id: 'titanic',
    number: '09',
    title: 'Titanic Survival Classification Baseline',
    category: 'ML & Tabular Baselines',
    tagline: 'Exploratory data analysis, categorical encoding, and ensemble classifier benchmarking.',
    description:
      'Canonical classification study establishing disciplined ML methodology: baseline models, hypothesis testing, interaction terms, and random forest ensembles.',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'Seaborn', 'Classification'],
    role: 'ML Engineer',
    severityTier: 'FOUNDATIONAL',
    severityLevel: 'SEV-6',
    severityLabel: 'METHODOLOGY & EDA DISCIPLINE',
    severityImpact: 'Demonstrates baseline hygiene, exploratory data analysis, and leakage prevention.',
    systemFlow: [
      'Exploratory Data Analysis (EDA) & Missing Value Mapping',
      'Feature Engineering: Title Extraction, Family Size, Fare Bins',
      'Categorical One-Hot & Ordinal Encoding',
      'Stratified 5-Fold Cross-Validation',
      'Random Forest Classifier Benchmarking',
    ],
    dataset: 'Titanic Passenger Records (891 training records, 12 features)',
    models: ['Random Forest Classifier', 'Logistic Regression', 'Support Vector Machine'],
    evaluationMetrics: ['Validation Accuracy: 83.2%', '5-Fold CV: 82.8%', 'ROC-AUC: 0.871', 'Precision: 0.814'],
    repository: 'https://github.com/KN-Vignesh/Projects',
    projectPath: 'Data-recipe/Titanic_Model',
    documentationUrl: 'https://github.com/KN-Vignesh/Projects/blob/main/Data-recipe/Titanic_Model/README.md',
    status: 'ACTIVE / TESTED',
    standaloneRepoInfo: {
      repoName: 'Projects/Data-recipe/Titanic_Model',
      cloneCommand: 'git clone https://github.com/KN-Vignesh/Projects.git',
      ciStatus: 'passing',
      deploymentType: 'Scikit-learn Python Pipeline',
      entryPoint: 'python titanic_baseline.py',
    },
    sections: {
      problem:
        'Standard beginner implementations suffer from data leakage (e.g. imputing age using test set statistics) and overfitting to training noise.',
      whyApproach:
        'Establishes disciplined ML engineering hygiene: strict pipeline isolation, title extraction, family-size interaction features, and cross-validated ensembles.',
      dataInput:
        'Passenger manifest details: class, age, sex, siblings/spouses, parents/children, fare, and cabin.',
      architecture:
        'Input Record → Scikit-learn Pipeline (SimpleImputer + OneHotEncoder) → Random Forest Classifier → Predicted Probability.',
      implementation:
        'Built with Python, Scikit-learn, Pandas, and Seaborn.',
      evaluation:
        'Achieved 83.2% cross-validated accuracy with minimal generalization gap between train and test scores.',
      engineeringDecisions: [
        'Used median imputation grouped by extracted title to improve age estimation accuracy.',
        'Constrained tree depth (max_depth=5) to strictly prevent memorization of noise in small sample size.',
      ],
      limitations: [
        'Small dataset size (891 rows) limits high-capacity deep learning model utility.',
      ],
      futureImprovements: [
        'Benchmark Bayesian hyperparameter optimization via Optuna.',
      ],
    },
  },
];
