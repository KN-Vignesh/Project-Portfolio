# Vignesh K N — AI Engineering Laboratory & Portfolio

Production-grade AI Engineering and Generative AI portfolio for **VIGNESH K N** (AI Software Engineer / Generative AI Engineer).

This portfolio communicates a high-conviction transition from **4+ years of full-stack engineering and cloud automation** into **production-oriented AI systems, LLM orchestration, PEFT fine-tuning, RAG, and agentic workflows**.

---

## 🛠 Tech Stack

- **Frontend Core**: React 19, TypeScript, Tailwind CSS v4, Motion
- **3D Interactive Visualizations**: Three.js (Hero Neural Core & Topological AI Lab Constellation)
- **AI Intelligence**: Gemini 3.5 Flash & Gemini 3.1 Pro Preview (with High Thinking Mode)
- **Backend & APIs**: Express.js microservice proxy with Vite SPA middleware
- **Architecture**: AI Engineering from Scratch editorial hierarchy + 3D interaction system

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Gemini Assistant)
```bash
cp .env.example .env
# Add your GEMINI_API_KEY in .env
```

### 3. Run Dev Server
```bash
npm run dev
```
The application runs on `http://localhost:3000`.

---

## 📦 Build & Production

```bash
# Build Vite static assets and bundle server.ts for Node.js
npm run build

# Start production server
npm start
```

---

## 🌐 GitHub Pages Deployment

To deploy this portfolio as a static site on GitHub Pages (`https://kn-vignesh.github.io/vignesh-ai-portfolio/`):

1. Set the Vite base in `vite.config.ts`:
   ```ts
   base: '/vignesh-ai-portfolio/',
   ```
2. Build the static bundle:
   ```bash
   npm run build
   ```
3. Push the `dist` folder to your `gh-pages` branch or configure GitHub Actions with standard static deployment.

---

## ➕ Adding a New Project (Extensibility Guarantee)

The portfolio data model is fully decoupled from the UI and 3D visualization layers. To add a new project, you only need to add one entry to `PROJECTS` in `src/data/portfolioData.ts`:

```typescript
{
  id: "new-project-slug",
  number: "PROJECT_010",
  title: "NEW AI PROJECT TITLE",
  category: "GENERATIVE AI / AGENTS",
  tagline: "Short engineering description",
  description: "Comprehensive technical summary...",
  technologies: ["Python", "PyTorch", "FastAPI"],
  role: "System Architecture & Engineering",
  dataset: "Dataset details",
  systemFlow: ["DATA", "PREPROCESS", "MODEL", "INFERENCE", "EVALUATION"],
  repository: "https://github.com/KN-Vignesh/...",
  notebookUrl: "https://github.com/...",
  status: "PRODUCTION_READY",
  sections: {
    problem: "...",
    whyApproach: "...",
    dataInput: "...",
    architecture: "...",
    implementation: "...",
    evaluation: "...",
    engineeringDecisions: ["Decision 1", "Decision 2"],
    limitations: ["Limitation 1"],
    futureImprovements: ["Extension 1"]
  },
  relatedProjectIds: ["customer-churn", "qwen-lora"]
}
```

The system automatically:
- Renders the project card in the **Project System** section.
- Links the project into the **AI Lab** interactive 3D constellation.
- Generates the dedicated **14-section architectural detail view** accessible via `#project/new-project-slug`.
- Connects related project suggestions without requiring any UI refactoring.
