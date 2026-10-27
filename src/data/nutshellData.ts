export interface NutshellEntry {
  id: string;
  term: string;
  category:
    | 'LLM & PEFT'
    | 'Deterministic AI'
    | 'ML & Evaluation'
    | 'Cloud & Systems';
  summary: string;
  formulaOrCode?: string;
  metrics?: string[];
  relatedProjectId?: string;
  aliases?: string[];
}

export const NUTSHELL_REGISTRY: Record<string, NutshellEntry> = {
  qlora: {
    id: 'qlora',
    term: 'QLoRA (4-Bit Quantized LoRA)',
    category: 'LLM & PEFT',
    summary:
      'Freezes base transformer weights in 4-bit :nf4[NormalFloat4 (NF4)] precision and backpropagates gradients exclusively through tiny :lora-rank[low-rank adapter matrices] with :double-quant[Double Quantization], cutting VRAM usage by 73% while preserving 99.4% FP16 task accuracy.',
    formulaOrCode:
      'W_BF16 = dequant(c1_FP32, c2_FP8, W_NF4) + (alpha / r) * B * A',
    metrics: ['VRAM Savings: 73%', 'Trainable Params: 0.6%', 'Precision: 99.4% FP16'],
    relatedProjectId: 'qlora',
    aliases: ['QLoRA 4-bit quantized adapters', 'QLoRA 4-bit NF4 quantization', 'QLoRA'],
  },
  nf4: {
    id: 'nf4',
    term: 'NormalFloat4 (NF4) Quantile Quantization',
    category: 'LLM & PEFT',
    summary:
      'An information-theoretically optimal 4-bit data type for normally distributed neural network weights N(0, sigma^2). It assigns equal probability mass to each of the 16 quantization bins using the standard normal inverse cumulative distribution function.',
    formulaOrCode: 'q_i = 0.5 * (Q_X(i / 17) + Q_X((i + 1) / 17))',
    metrics: ['Bitwidth: 4-bit', 'Bins: 16 Equal-Mass Quantiles', 'Perplexity Drift: <0.08'],
    relatedProjectId: 'qlora',
    aliases: ['NormalFloat4', '4-bit NF4', 'NF4'],
  },
  'double-quant': {
    id: 'double-quant',
    term: 'Double Quantization (DQ)',
    category: 'LLM & PEFT',
    summary:
      'Quantizes the 32-bit blockwise quantization constants (c2) themselves into 8-bit floats with a block size of 256, reducing memory overhead from 0.5 bits/parameter to 0.127 bits/parameter (~3 GB saved on a 65B model).',
    formulaOrCode: 'double_quant = True | bnb_4bit_quant_type = "nf4"',
    metrics: ['Overhead Saved: 0.373 bits/param', 'Block Size: 64 -> 256'],
    relatedProjectId: 'qlora',
    aliases: ['Double Quantization', 'double quantization'],
  },
  'lora-rank': {
    id: 'lora-rank',
    term: 'Low-Rank Decomposition (Rank r & Alpha)',
    category: 'LLM & PEFT',
    summary:
      'Decomposes weight updates Delta W into two thin matrices B (d x r) and A (r x k) where rank r << min(d, k). Scaling by alpha/r stabilizes learning rates across ranks while keeping base weights frozen.',
    formulaOrCode: 'h = W_0 x + (alpha / r) * B(Ax)  // r=8..16, alpha=16..32',
    metrics: ['Adapter Rank: r=8..16', 'Target Modules: q_proj, v_proj'],
    relatedProjectId: 'qwen-lora',
    aliases: ['low-rank matrices', 'LoRA adapters', 'rank r=16', 'rank r=8'],
  },
  peft: {
    id: 'peft',
    term: 'Parameter-Efficient Fine-Tuning (PEFT)',
    category: 'LLM & PEFT',
    summary:
      'Adapts multi-billion parameter foundation models to specialized downstream engineering tasks by updating less than 1% of total parameters via :lora-rank[LoRA] or :qlora[QLoRA], eliminating multi-GPU cluster bottlenecks.',
    formulaOrCode: 'peft_model = get_peft_model(base_model, LoraConfig(r=16, lora_alpha=32))',
    metrics: ['Trainable Ratio: <0.8%', 'Single-GPU T4 / L4 Compatible'],
    relatedProjectId: 'qwen-lora',
    aliases: ['PEFT', 'parameter-efficient model alignment'],
  },
  'jev-gate': {
    id: 'jev-gate',
    term: 'TypeSafe Jev System 1 Gate',
    category: 'Deterministic AI',
    summary:
      'Replaces slow, hallucination-prone conversational LLM prompts with a fast System 1 classifier combined with :sonar-ast[SonarQube AST static rules], executing deterministic pull-request merge verdicts in under 35ms.',
    formulaOrCode: 'Diff -> SonarAST(S2068, S3649) -> JevSystem1 -> MergeVerdict (<35ms)',
    metrics: ['P95 Latency: <35ms', 'Hallucination Rate: 0.0%', 'Reproducibility: 100%'],
    relatedProjectId: 'vero',
    aliases: ['TypeSafe Jev', 'sub-35ms AST code review gates', 'deterministic gates'],
  },
  'sonar-ast': {
    id: 'sonar-ast',
    term: 'SonarQube AST Static Analysis Rules',
    category: 'Deterministic AI',
    summary:
      'Parses source diffs into an Abstract Syntax Tree (AST) to enforce non-negotiable security and Clean Code invariants (e.g., S2068 hardcoded credentials, S3649 SQL injection, S3776 cognitive complexity) before any model inference.',
    formulaOrCode: 'ASTRuleEngine.evaluate(diff) -> [S2068: BLOCKER, S3649: CRITICAL]',
    metrics: ['False-Negative Rate: 0% on AST invariants', 'Zero Token Cost'],
    relatedProjectId: 'vero',
    aliases: ['SonarQube Clean Code static analysis', 'SonarQube AST', 'AST policies'],
  },
  shap: {
    id: 'shap',
    term: 'SHAP (Shapley Additive Explanations)',
    category: 'ML & Evaluation',
    summary:
      'Computes game-theoretic marginal contributions for every feature on each prediction, decomposing how attributes like OverallQual and GrLivArea push a property valuation above or below the dataset baseline.',
    formulaOrCode: 'f(x) = E[f(X)] + sum_i phi_i(x)',
    metrics: ['Holdout R²: 0.898', 'Local + Global Additivity'],
    relatedProjectId: 'house-price',
    aliases: ['SHAP', 'SHAP feature attribution'],
  },
  'stacking-ensemble': {
    id: 'stacking-ensemble',
    term: 'Stacking Regression Ensemble',
    category: 'ML & Evaluation',
    summary:
      'Combines out-of-fold predictions from Ridge, Lasso, Gradient Boosting, and XGBoost via a Ridge meta-learner, smoothing out individual model variance and achieving R² = 0.898 on 1,458 Ames housing properties.',
    formulaOrCode: 'y_hat = MetaRidge([OOF_XGB, OOF_GBDT, OOF_Lasso, OOF_Ridge])',
    metrics: ['Holdout R²: 0.898', 'RMSE: 0.114 (Log-Scale)'],
    relatedProjectId: 'house-price',
    aliases: ['Stacking Ensemble', 'stacking ensemble'],
  },
  'roc-auc': {
    id: 'roc-auc',
    term: 'ROC-AUC & Cost-Sensitive Thresholding',
    category: 'ML & Evaluation',
    summary:
      'Measures discriminative ranking quality across all classification thresholds while calibrating the operational decision boundary (tau = 0.45) to minimize high-cost false negatives on imbalanced datasets.',
    formulaOrCode: 'Decision(x) = 1[ P(y=1 | x) >= 0.45 ]  // ROC-AUC: 0.884',
    metrics: ['Churn ROC-AUC: 0.884', 'BERT ROC-AUC: 0.962'],
    relatedProjectId: 'evaluation',
    aliases: ['ROC-AUC', 'ROC-AUC scorecards', 'cost-sensitive 0.45 threshold'],
  },
  'class-weights': {
    id: 'class-weights',
    term: 'Class-Weighted Loss vs. SMOTE Interpolation',
    category: 'ML & Evaluation',
    summary:
      'Instead of synthesizing k-NN SMOTE rows that violate domain constraints (e.g., 0-month tenure with a 2-year contract), scaling the positive gradient loss via scale_pos_weight = 2.7 handles 73:27 class imbalance cleanly.',
    formulaOrCode: 'XGBClassifier(scale_pos_weight=2.7, eval_metric="aucpr")',
    metrics: ['Imbalance Ratio: 73:27', 'Synthetic Artifacts: 0'],
    relatedProjectId: 'customer-churn',
    aliases: ['SMOTE', 'scale_pos_weight'],
  },
  'cls-pooling': {
    id: 'cls-pooling',
    term: 'BERT [CLS] Bidirectional Self-Attention',
    category: 'LLM & PEFT',
    summary:
      'Attends across both left and right token context simultaneously across 12 transformer layers so negation cues ("not worth the hype") are captured in the final 768-d [CLS] representation prior to classification.',
    formulaOrCode: 'Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V',
    metrics: ['F1-Score: 0.928', 'ROC-AUC: 0.962', 'Max Seq: 256 tokens'],
    relatedProjectId: 'bert',
    aliases: ['Bidirectional self-attention', '[CLS] token'],
  },
  'rag-architecture': {
    id: 'rag-architecture',
    term: 'Retrieval-Augmented Generation (RAG)',
    category: 'Cloud & Systems',
    summary:
      'Grounds LLM responses in verifiable enterprise documents by indexing chunked embeddings in :cosmos-vector[Azure Cosmos DB / FAISS vector indices] and injecting top-k semantic matches into a strict citation prompt.',
    formulaOrCode: 'Context = TopK_Cosine(Embed(query), VectorIndex) -> GroundedLLM(query, Context)',
    metrics: ['Retrieval Latency: <45ms', 'Grounded Citations'],
    relatedProjectId: 'vero',
    aliases: ['RAG pipelines', 'RAG Architectures', 'RAG ingestion pipelines'],
  },
  'cosmos-vector': {
    id: 'cosmos-vector',
    term: 'Cosmos DB & FAISS Vector Indexing',
    category: 'Cloud & Systems',
    summary:
      'Stores high-dimensional dense embeddings alongside transactional document metadata in Azure Cosmos DB or Hierarchical Navigable Small World (HNSW) FAISS graphs for sub-50ms approximate nearest-neighbor search.',
    formulaOrCode: 'SELECT TOP 5 c.text, VectorDistance(c.embedding, @q) AS score FROM c',
    metrics: ['Index: HNSW / IVF', 'Metric: Cosine Similarity'],
    aliases: ['Cosmos DB vector search', 'Vector Search (Cosmos DB)', 'FAISS'],
  },
  rlhf: {
    id: 'rlhf',
    term: 'RLHF & LLM Evaluation Frameworks',
    category: 'LLM & PEFT',
    summary:
      'Aligns generative model outputs with human engineering rubrics using preference pairs, golden reference datasets, and automated faithfulness/hallucination scorecards before production rollout.',
    formulaOrCode: 'L_DPO = -E[ log sigma(beta * log(pi_theta(y_w|x)/pi_ref(y_w|x)) - ...) ]',
    metrics: ['Rubric Alignment', 'Zero-Regression Gate'],
    relatedProjectId: 'evaluation',
    aliases: ['RLHF strategies', 'RLHF Evaluation Frameworks', 'RLHF'],
  },
  'pydantic-contracts': {
    id: 'pydantic-contracts',
    term: 'Contract-First Pydantic V2 Gateways',
    category: 'Cloud & Systems',
    summary:
      'Enforces strict Rust-backed type, range, and regex constraints at the FastAPI HTTP boundary so malformed telemetry fails in <1ms with HTTP 422 rather than corrupting downstream ML inference.',
    formulaOrCode: 'tenure_months: int = Field(..., ge=0, le=120) // HTTP 422 on violation',
    metrics: ['Validation Overhead: <0.8ms', 'Unhandled Null Exceptions: 0'],
    relatedProjectId: 'customer-churn',
    aliases: ['Pydantic contracts', 'Pydantic v2 schemas', 'contract-first Pydantic schemas'],
  },
  'vanity-metrics': {
    id: 'vanity-metrics',
    term: 'Vanity Metric Bias in Imbalanced ML',
    category: 'ML & Evaluation',
    summary:
      'Raw accuracy is deceptive on skewed distributions: a naive classifier predicting "No Churn" on a 90:10 dataset scores 90% accuracy while catching 0% of actual churners. Always audit :roc-auc[ROC-AUC], PR-AUC, F1, and Brier calibration.',
    formulaOrCode: 'BrierScore = (1 / N) * sum_i (p_i - y_i)^2  // Lower is better calibrated',
    metrics: ['Multi-Metric Scorecard', 'Expected Calibration Error (ECE)'],
    relatedProjectId: 'evaluation',
    aliases: ['vanity metric bias', 'calibration reliability'],
  },
  'concept-drift': {
    id: 'concept-drift',
    term: 'Production Concept & Covariate Drift',
    category: 'ML & Evaluation',
    summary:
      'Occurs when live production feature distributions P(X) or target relationships P(Y|X) diverge from the training snapshot, requiring Population Stability Index (PSI) telemetry and scheduled retraining triggers.',
    formulaOrCode: 'PSI = sum_b (Actual_b - Expected_b) * ln(Actual_b / Expected_b)',
    metrics: ['Drift Alert Threshold: PSI > 0.20', 'Automated Retraining Gate'],
    relatedProjectId: 'customer-churn',
    aliases: ['concept drift', 'data drift'],
  },
  'pam-automation': {
    id: 'pam-automation',
    term: 'Enterprise BeyondTrust PAM Automation',
    category: 'Cloud & Systems',
    summary:
      'Automated Privileged Access Management provisioning, least-privilege policy enforcement, and credential rotation across 6,000+ enterprise accounts, eliminating manual onboarding bottlenecks.',
    metrics: ['Enterprise Scale: 6,000+ Users', 'Zero-Touch Provisioning'],
    aliases: ['BeyondTrust PAM deployment', 'BeyondTrust PAM deployments'],
  },
  'mla-moe': {
    id: 'mla-moe',
    term: 'Multi-Head Latent Attention (MLA) & Sparse MoE',
    category: 'LLM & PEFT',
    summary:
      'Compresses Key-Value (KV) attention caches into a low-rank latent vector while activating only 37B routed expert parameters out of 671B per token, slashing inference memory bandwidth.',
    formulaOrCode: 'c_t^{KV} = W^{DKV} h_t  // Low-rank joint KV compression',
    metrics: ['Active Params: 37B / 671B', 'KV Cache Reduction: ~80%'],
    aliases: ['Multi-head Latent Attention (MLA)', 'KV-cache compression'],
  },
};

export const NUTSHELL_ENTRIES_LIST: NutshellEntry[] =
  Object.values(NUTSHELL_REGISTRY);
