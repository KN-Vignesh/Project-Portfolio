# Vignesh K N — AI Software Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Vignesh%20K%20N-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/vignesh-k-n/)
[![GitHub](https://img.shields.io/badge/GitHub-KN--Vignesh-181717?style=flat&logo=github)](https://github.com/KN-Vignesh)
[![Portfolio](https://img.shields.io/badge/Live%20Portfolio-Projects%20Hub-7CFF6B?style=flat&logo=safari&logoColor=black)](https://kn-vignesh.github.io/Projects/#/)
[![Location](https://img.shields.io/badge/Location-Bengaluru%2C%20India-blue)](https://www.google.com/maps/place/Bengaluru)

> **Software Engineer with 4+ years of professional engineering experience** across enterprise full-stack systems, cloud automation, and API integration, specializing in **production-oriented AI, Generative AI, LLM orchestration, RAG architectures, PEFT fine-tuning, and Agentic workflows**.

---

## 📌 Professional Profile & Focus

- **Current Focus:** Architecting reproducible AI systems from foundation models to production deployment — integrating LLMs, Parameter-Efficient Fine-Tuning (LoRA/QLoRA), RAG pipelines, deterministic verification gates, and low-latency inference APIs.
- **Engineering Foundation:** 4+ years designing, building, and deploying scalable applications with C# (.NET Core), Python, TypeScript, modern cloud infrastructure (Azure Functions, Cosmos DB, Service Bus), and CI/CD / MLOps pipelines (Docker, Jenkins, GitHub Actions).
- **Core Philosophy:** "Deterministic verification over blind generation." Combining quantitative evaluation rubrics and static analysis with AI orchestration to eliminate hallucinations in production.

---

## Project Registry

Project metadata is loaded at runtime from the authoritative [Projects repository](https://github.com/KN-Vignesh/Projects/blob/main/portfolio/projects.json), with a verified local registry fallback (`/projects.json`) if the remote raw endpoint is unreachable.

Set `VITE_PROJECT_DATA_URL` to override the public registry URL during development or deployment. It defaults to `https://raw.githubusercontent.com/KN-Vignesh/Projects/main/portfolio/projects.json`.

### Interactive 3D House Price Prediction (`house_price_3d.json`)

The **House Price Tabular Regression** project (`id: "house-price"`) includes a 4-stage interactive 3D scientific workbench powered by static JSON exported from [`Projects/Data-recipe/House_Price_Prediction`](https://github.com/KN-Vignesh/Projects/tree/main/Data-recipe/House_Price_Prediction):

- **Configurable Asset URL**: Controlled via `VITE_HOUSE_PRICE_3D_DATA_URL` (defaults to `https://raw.githubusercontent.com/KN-Vignesh/Projects/main/Data-recipe/House_Price_Prediction/house_price_3d.json`).
- **Schema Validation & Labeled Dev Fixture**: Validated at runtime against `schemaVersion: "1.0.0"` (`src/services/housePriceSurfaceLoader.ts`). If the remote asset returns a 404 prior to exporter publication, the loader falls back to `/data/house_price_3d.fixture.json` and badges the UI as a **Labeled Dev Fixture** (never passing off fixture data as live model output).
- **3D Surface & Bilinear Interpolation**: Constructs an indexed Three.js `BufferGeometry` over `GrLivArea` × `OverallQual` with conditioning slices for `GarageArea`, `YearBuilt`, and `LotArea`. Strictly distinguishes **Exact Reference Predictions**, **Precomputed Grid Nodes**, and **Bilinearly Interpolated Surface Estimates**.
- **Precomputed SHAP Explanations**: Displays additive TreeSHAP attributions (`baseValue` + $\sum \phi_i$ = `outputValue`) for verified reference homes without interpolating SHAP across non-linear tree splits.

---

## 🧠 Systems Architecture & Engineering Methodology

Every system built follows a disciplined 5-stage engineering lifecycle to ensure enterprise reproducibility and operational safety:

```
[01. PROBLEM FRAMING & DATA]  ──►  [02. BASELINE & SELECTION]  ──►  [03. FINE-TUNING & RAG]
               │                                                              │
               ▼                                                              ▼
[05. PRODUCTION & MONITORING] ◄─────────────────────────────────── [04. VERIFICATION & EVAL]
```

1. **Problem Framing & Data Engineering:** Establishing data contracts, feature pipelines, synthetic edge-case generation, and clean tokenization boundaries.
2. **Baseline & Model Selection:** Benchmarking pre-trained open weights against commercial APIs; evaluating parameter efficiency, quantization viability, and memory footprint.
3. **Fine-Tuning & Orchestration:** Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA) on open models, RAG vector retrieval pipelines, and deterministic prompt guards.
4. **Verification & Evaluation:** Automated evaluation harnesses measuring latency, token usage, hallucination frequency, and strict rubric adherence.
5. **Production Deployment & Monitoring:** Low-latency REST inference endpoints, Docker containerization, cloud serverless triggers, and token budget enforcement.

---

## 🛠 Technical Skills Matrix

| Domain | Technologies & Frameworks |
| :--- | :--- |
| **AI, GenAI & LLMs** | Large Language Models (LLMs), Agentic AI Workflows, RAG Architectures, Prompt Engineering, RLHF Evaluation Frameworks, Natural Language Processing (NLP) |
| **AI Frameworks & Libraries** | PyTorch, Hugging Face (Transformers, PEFT, TRL, Datasets), LangChain, Scikit-learn, XGBoost, BitsAndBytes (4-bit NF4), FAISS Vector Search |
| **Programming Languages** | Python, C# (.NET Core, ASP.NET MVC), TypeScript, JavaScript, SQL (SSMS, MySQL, PostgreSQL), HTML5 / CSS3 |
| **Cloud & Distributed Data** | Microsoft Azure (Functions, Service Bus, Cosmos DB), Vector DBs, REST Microservices, Serverless Computing |
| **DevOps & MLOps** | Docker Containerization, Git / GitHub, Jenkins CI/CD, Postman, Swagger / OpenAPI, Unit & Integration Testing |
| **Enterprise Systems** | .NET Core 8, Angular (8–19), Entity Framework, Sitecore CMS, BeyondTrust PAM / BeyondInsight Infrastructure |

---

## 💼 Professional Experience

#### **Software Engineer** — ACL Digital
*Aug 2024 – Present | Bengaluru, India*
- Architected full-stack modules incorporating Agentic AI and LLM APIs for enterprise device configuration (OnePortal) using .NET Core 8, Angular 18, Entity Framework, and MySQL globally.
- Implemented Reinforcement Learning from Human Feedback (RLHF) strategies and engineered evaluation frameworks to optimize the accuracy, safety, and reliability of internal Generative AI and NLP workflows.
- Built automated data validation and end-to-end scanner pipelines designed specifically for client-side device registration.

#### **Software Engineer** — Enmarq Technologies
*Aug 2022 – Aug 2024 | Bengaluru, India*
- Built serverless REST APIs, Azure Functions, and Azure Service Bus triggers utilizing Azure Cosmos DB (vector search data management) and SSMS SQL, powering low-latency data ingestion for downstream NLP and Generative AI RAG pipelines.
- Managed Git and Jenkins CI/CD / MLOps pipelines to ensure continuous automated testing, version control, and containerized deployments.
- Spearheaded the automated deployment, building, and validation of BeyondTrust PAM and BeyondInsight for 6,000+ enterprise users under a strict 90-day timeline.
- Executed sequential Sitecore CMS migrations from v8.3 to v10.3, optimizing Content Hub and Experience Editor workflows.

#### **Intern Associate** — Enmarq Technologies
*Feb 2022 – Jul 2022 | Bengaluru, India*
- Developed automated Python and C# scheduled jobs to extract, transform, and clean Cosmos DB data for analytics and machine learning workflows.
- Validated microservices endpoints across backend APIs using Postman and Swagger test suites.

---

## 🎓 Education & Certifications

- **Bachelor of Engineering (B.E.)** in Computer Science & Engineering — *KVG College of Engineering*
- **Microsoft Certified:** Azure Fundamentals (AZ-900 / DP-900)
- **Oracle Cloud Infrastructure (OCI):** Generative AI / AI Foundation Certified

---

## 📬 Contact & Connect

- **Email:** [vigneshknagaraj@outlook.com](mailto:vigneshknagaraj@outlook.com)
- **Phone:** [+91 8861524366](tel:+918861524366)
- **Location:** Bengaluru - 560045, India
- **LinkedIn:** [linkedin.com/in/vignesh-k-n](https://www.linkedin.com/in/vignesh-k-n/)
- **GitHub:** [github.com/KN-Vignesh](https://github.com/KN-Vignesh)
- **Projects Hub:** [github.com/KN-Vignesh/Projects](https://github.com/KN-Vignesh/Projects)
- **Interactive Portfolio:** [kn-vignesh.github.io/Projects/#/](https://kn-vignesh.github.io/Projects/#/)
