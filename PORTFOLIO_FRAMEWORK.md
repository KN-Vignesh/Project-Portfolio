# PORTFOLIO ARCHITECTURE FRAMEWORK // OPTION A: POLYREPO (DEDICATED REPOSITORIES)
**Architectural Blueprint & Engineering Operating Manual**  
*Author:* Vignesh K N (`vigneshknagaraj@outlook.com`)  
*Role Focus:* Software Engineer → Production AI & Generative AI Systems  
*Architecture:* **Option A: Polyrepo (Dedicated Standalone Repositories)**

---

## 1. Executive Summary & Architectural Decision

### The Decision: Option A (Polyrepo)
After analyzing both repository archetypes from the perspectives of **Recruiter Ergonomics**, **Technical Rigor**, **Dependency Isolation**, and **Operational Feasibility**, the recommended and adopted architecture is:

> **Option A: Dedicated Standalone Repositories (Polyrepo) orchestrated by a centralized Portfolio "Story & Discovery" Engine.**

### Why Option A Beats a Monorepo for AI Engineering

| Dimension | Monorepo Pitfall in AI Portfolios | Option A (Polyrepo) Advantage |
| :--- | :--- | :--- |
| **Recruiter Discovery** | Recruiters see one generic repo (`Projects`) with mixed languages; GitHub automatically labels the repo by the highest byte count, burying Python or TypeScript. | Each project earns a direct, searchable repository with pinned GitHub language tags (`Python`, `TypeScript`, `Docker`, `CUDA`). |
| **Dependency Isolation** | Conflicting ML runtimes (`BitsAndBytes`, `TensorFlow Decision Forests`, `PyTorch 2.2`, `Transformers`, `FastAPI`) create dependency lock conflicts. | Completely isolated virtual environments (`pyproject.toml`, `requirements.txt`, Dockerfiles) per project. |
| **CI/CD Automation** | A change in a notebook triggers heavy ML test runs across all unrelated projects unless complex matrix paths are configured. | Fast, independent GitHub Actions workflows running linting, unit tests, and Docker container builds per repo. |
| **Production Realism** | Monolithic repositories with folders named `Data-recipe` look like course homework. | Standalone repos mirror real-world microservices and enterprise model repositories. |

---

## 2. The Two-Tier Portfolio Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│              CENTRAL DISCOVERY & CASE STUDY LAYER (THIS APP)            │
│  - Hosted Portfolio: https://kn-vignesh.github.io/Projects/#/           │
│  - Live Interactive Engines (VERO PR Analyzer)                          │
│  - Architecture Case Studies & Step-by-Step Code Walkthroughs           │
│  - Recruiter Fast-Paths: One-Click Resume, Tech Radar & System Flows    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  REPOS: GEN AI   │       │ REPOS: MODEL ENG │       │ REPOS: ML & PROD │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ 1. VERO          │       │ 4. BERT Encoder  │       │ 7. Churn Predict │
│ 2. Qwen LoRA     │       │ 5. CNN Vision    │       │ 8. House Price   │
│ 3. QLoRA 4-bit   │       │ 6. Eval Matrix   │       │ 9. Titanic EDA   │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

1. **Tier 1 (The Portfolio Web Application):**  
   Acts as the executive briefing room. It conveys narrative, architectural trade-offs, interactive live demos (e.g., the VERO pull request intelligence engine), and provides an instant in-popup code viewer with line-by-line mechanical explanations.
2. **Tier 2 (The Dedicated Repositories):**  
   Stand as production-ready, peer-reviewable codebases that an engineering manager or senior staff engineer can `git clone`, review git history, run tests on, and verify reproducibility.

---

## 3. Standard Repository Blueprint (For Every Project)

To ensure consistency across all dedicated repositories, every repository in Vignesh's profile follows this 8-part contract:

```
repo-name/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated linting, type-checking & test suite
├── app/ or src/                 # Core modular source code
│   ├── __init__.py
│   ├── main.py                  # Single clear entry point
│   ├── model.py                 # Core model definition / PEFT adapter
│   └── pipeline.py              # Data preprocessing transformations
├── tests/                       # Unit tests asserting logic contracts
│   └── test_inference.py
├── notebooks/                   # Reproducible research / exploration
│   └── exploratory_analysis.ipynb
├── Dockerfile                   # Reproducible containerization
├── requirements.txt             # Pinned dependency locks
├── pyproject.toml               # Modern packaging metadata
├── LICENSE                      # Open-source license (MIT/Apache-2.0)
└── README.md                    # Structured case-study README
```

---

## 4. The Standardized README Contract

Every dedicated repository README must open with an **Executive Evidence Card**:

```markdown
# [Project Name]

> **One-sentence architectural purpose statement.**

[![CI](https://github.com/KN-Vignesh/[repo]/actions/workflows/ci.yml/badge.svg)](https://github.com/KN-Vignesh/[repo]/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)

## Architecture & System Flow
\`\`\`
INPUT DATA -> PREPROCESSING -> INFERENCE / ADAPTER -> EVALUATION METRICS -> API OUTPUT
\`\`\`

## 1. Problem & Operational Motivation
[Why this project matters to a business or engineering team]

## 2. Key Engineering Decisions
- Decision 1: [Why X was chosen over Y, e.g. BF16 compute dtype instead of FP16]
- Decision 2: [Cost-sensitive decision threshold 0.45 instead of standard 0.50]

## 3. Quickstart & Reproducibility
\`\`\`bash
git clone https://github.com/KN-Vignesh/[repo].git
cd [repo]
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app/main.py
\`\`\`

## 4. Quantitative Results & Evaluation
| Metric | Baseline | This System | Target Outcome |
| :--- | :--- | :--- | :--- |
| Recall (Churn) | 0.62 | 0.81 | Minimize false negatives |
| VRAM Footprint | 14.2 GB | 5.1 GB | Single consumer GPU execution |
```

---

## 5. Vignesh's 9-Project Polyrepo Registry

| # | System ID | Dedicated Repository Name | Tech Stack | Production Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `customer-churn` | `intelligent-customer-churn-prediction` | FastAPI, Scikit-learn, XGBoost, Docker | Dockerized REST Microservice |
| **02** | `qwen-lora` | `qwen-lora-adaptation` | Qwen1.5, PEFT, PyTorch, LoRA | Checkpoint Adapter (`~25MB`) |
| **03** | `qlora` | `qlora-efficient-training` | BitsAndBytes 4-bit NF4, Mistral/Llama, PEFT | Quantized weights + BF16 Adapters |
| **04** | `bert` | `bert-model-engineering` | BERT-base, PyTorch, Transformers, Hugging Face | TorchScript / ONNX Pipeline |
| **05** | `vero` | `VERO` | TypeScript, GitHub API, SonarQube, LLM | Full-Stack PR Intelligence Engine |
| **06** | `cnn` | `cnn-fundamentals` | PyTorch, Conv2d, TorchVision | Hierarchical Feature Classifier |
| **07** | `evaluation` | `model-evaluation-matrix` | Scikit-learn, NumPy, Pandas | Multi-Metric Scoring Harness |
| **08** | `house-price` | `house-price-prediction-tfdf` | TensorFlow Decision Forests, Ames Housing | TF SavedModel Pipeline |
| **09** | `titanic` | `titanic-ml-baseline` | Pandas, Scikit-learn, Feature Engineering | Baseline Classification Pipeline |

---

## 6. Execution & Verification Checklist

- [x] **Remove "Get App" Button**: Eliminated all PWA install triggers from Desktop Navigation, Mobile Drawer, and Mobile Dock.
- [x] **In-Popup Code & Explanation Viewer**: Added interactive code tabs with syntax styling, line-numbered mechanics breakdown, input/output contracts, and architectural notes for all 9 projects.
- [x] **Polyrepo Contract Badges**: Attached standalone clone commands and repository specifications to modal popups and project grid cards.
- [x] **Zero Build Errors**: Verified strict TypeScript typings, component boundaries, and reactive event listeners.
