import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

let aiClient: any = null;

async function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    const { GoogleGenAI } = await import("@google/genai");
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const PORT = 3000;

const SYSTEM_INSTRUCTION = `You are the AI Engineering Assistant for Vignesh K N's technical portfolio.
Vignesh K N is an AI Software Engineer with 4+ years of experience transitioning from enterprise full-stack and cloud engineering (.NET Core, Angular, Azure) into production-oriented AI, Generative AI, LLMs, RAG, PEFT (LoRA/QLoRA), and agentic systems.

Key Profile Truths:
- Current Role: Software Engineer at ACL Digital (Aug 2024 - Present), architecting full-stack modules with Agentic AI, LLM APIs, RLHF evaluation, and .NET Core 8 / Angular 18.
- Previous Roles: Enmarq Technologies (Software Engineer Aug 2022 - Aug 2024, Intern Feb 2022 - Jul 2022) focusing on serverless Azure Functions, Cosmos DB vector search, RAG pipelines, and PAM deployment for 6,000+ users.
- Education: B.E. from KVG College of Engineering (2019).
- Certifications: Microsoft Azure Fundamentals (AZ-900 / DP-900), Oracle Cloud Infrastructure Generative AI.
- Portfolio Projects:
  1. Intelligent Customer Churn Prediction (FastAPI + Docker + Scikit-learn + XGBoost)
  2. Qwen / LoRA Adaptation (PEFT, targeted adapters on q_proj/v_proj)
  3. QLoRA (4-bit NF4 quantization, BitsAndBytes, Double Quantization)
  4. BERT Model Engineering (Bidirectional encoder, CLS pooling, classification heads)
  5. VERO — AI Code Analysis (GitHub PR diffs + SonarQube static analysis + LLM structured signals + deterministic decision engine)
  6. CNN Fundamentals (Spatial convolutions, PyTorch, receptive fields)
  7. Model Evaluation (Multi-metric scorecards, ROC-AUC, Precision-Recall trade-offs)
  8. House Price Prediction (TensorFlow Decision Forests, Ames Housing)
  9. Titanic ML Baseline (Exploratory data analysis, feature engineering)

- Resume & CV: Vignesh's official resume is available for download on the portfolio site via the "RESUME" / "DOWNLOAD RESUME" buttons, directly at /vignesh-k-n-resume.pdf.

Provide technical, objective, and accurate answers about Vignesh's engineering philosophy, architecture decisions, projects, and career progression. Never invent projects or metrics.`;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, thinking = false } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const client = await getGeminiClient();
      if (!client) {
        // Safe fallback response when API key is not yet set in environment
        const lastMsg = messages[messages.length - 1]?.content || "";
        return res.json({
          reply: `[System Note: Portfolio AI Agent operating in offline knowledge mode. For full live LLM inference, configure GEMINI_API_KEY in the Secrets panel.]\n\nRegarding your query about "${lastMsg.slice(0, 60)}...": Vignesh K N is an AI Software Engineer specializing in Generative AI, PEFT (LoRA/QLoRA), RAG architectures, and production ML pipelines like Intelligent Customer Churn Prediction and VERO AI Code Intelligence.`
        });
      }

      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const modelName = thinking ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
      const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
      };

      if (thinking) {
        const { ThinkingLevel } = await import("@google/genai");
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const response = await client.models.generateContent({
        model: modelName,
        contents: formattedContents,
        config
      });

      return res.json({ reply: response.text || "No response generated" });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.status(500).json({
        error: "Failed to generate response from Gemini",
        details: err.message || "Unknown error"
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vignesh AI Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
