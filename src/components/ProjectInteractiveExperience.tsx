import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Cpu,
  Layers,
  Activity,
  Sliders,
  Sparkles,
  ExternalLink,
  GitPullRequest
} from 'lucide-react';

interface ProjectInteractiveExperienceProps {
  projectId: string;
  onOpenVero?: () => void;
}

export const ProjectInteractiveExperience: React.FC<ProjectInteractiveExperienceProps> = ({
  projectId,
  onOpenVero,
}) => {
  // 01: Customer Churn Simulator State
  const [churnTenure, setChurnTenure] = useState(6);
  const [churnContract, setChurnContract] = useState<'month-to-month' | 'one-year' | 'two-year'>('month-to-month');
  const [churnCharges, setChurnCharges] = useState(85);
  const [churnTechSupport, setChurnTechSupport] = useState(false);

  // 02: Qwen LoRA Comparison State
  const [loraPromptIndex, setLoraPromptIndex] = useState(0);
  const loraPrompts = [
    {
      title: 'Async Worker Queue',
      prompt: 'Write an asynchronous worker queue in Python with exponential backoff.',
      baseOutput: 'Here is a simple loop with asyncio.sleep. You can run while True and sleep for 1 second if there is an error.',
      adaptedOutput: 'class BackoffWorker:\n    async def process_with_retry(self, task, max_retries=5):\n        for attempt in range(max_retries):\n            try:\n                return await task.execute()\n            except TransientError as e:\n                delay = min(60, (2 ** attempt) + random.uniform(0, 1))\n                await asyncio.sleep(delay)',
      latency: '24ms / token',
      vram: '24MB Adapter checkpoint'
    },
    {
      title: 'FastAPI Structured Validation',
      prompt: 'Define a typed schema for ML inference payload with range constraints.',
      baseOutput: 'You can use python dictionaries or basic classes with input parameters.',
      adaptedOutput: 'class InferencePayload(BaseModel):\n    customer_id: str = Field(..., regex=r"^CUST-[0-9]{5}$")\n    tenure_months: int = Field(..., ge=0, le=120)\n    monthly_charges: float = Field(..., gt=0.0)\n\n    @validator("monthly_charges")\n    def validate_positive(cls, v):\n        return round(v, 2)',
      latency: '22ms / token',
      vram: '24MB Adapter checkpoint'
    }
  ];

  // 03: QLoRA Quantization State
  const [qloraModelSize, setQloraModelSize] = useState<'7B' | '13B' | '70B'>('7B');
  const [qloraFormat, setQloraFormat] = useState<'fp16' | 'int8' | 'nf4'>('nf4');

  // 04: BERT Classifier State
  const [bertInput, setBertInput] = useState('Production database connection pool exhausted during peak traffic');

  // 06: CNN Visualizer State
  const [cnnLayer, setCnnLayer] = useState<1 | 2 | 3>(1);

  // 07: Model Evaluation State
  const [threshold, setThreshold] = useState(0.45);

  // 08: House Price State
  const [houseSqFt, setHouseSqFt] = useState(2100);
  const [houseQuality, setHouseQuality] = useState(8);
  const [houseGarage, setHouseGarage] = useState(2);
  const [houseYear, setHouseYear] = useState(2015);

  // 09: Titanic State
  const [passengerClass, setPassengerClass] = useState<1 | 2 | 3>(1);
  const [passengerSex, setPassengerSex] = useState<'female' | 'male'>('female');
  const [passengerAge, setPassengerAge] = useState(28);

  /* -------------------------------------------------------------
     CALCULATED METRICS FOR EACH SIMULATOR
  ------------------------------------------------------------- */
  // 01: Churn Probability Calculation
  const calculateChurn = () => {
    let score = 0.35;
    score += (72 - churnTenure) * 0.007; // shorter tenure = higher risk
    score += (churnCharges - 50) * 0.004; // higher charges = higher risk
    if (churnContract === 'month-to-month') score += 0.28;
    if (churnContract === 'two-year') score -= 0.32;
    if (!churnTechSupport) score += 0.15;
    return Math.max(0.05, Math.min(0.96, score));
  };
  const churnProb = calculateChurn();
  const isHighRisk = churnProb >= 0.45; // Cost-sensitive threshold 0.45

  // 03: QLoRA VRAM Calculation
  const getQloraStats = () => {
    const baseParams = qloraModelSize === '7B' ? 7 : qloraModelSize === '13B' ? 13 : 70;
    if (qloraFormat === 'fp16') {
      return { vram: (baseParams * 2 * 1.25).toFixed(1) + ' GB', bits: '16-bit float', fits16GB: baseParams <= 7 ? 'Needs A100' : 'Multi-GPU Only' };
    }
    if (qloraFormat === 'int8') {
      return { vram: (baseParams * 1 * 1.2).toFixed(1) + ' GB', bits: '8-bit integer', fits16GB: baseParams <= 7 ? 'Marginal' : 'Multi-GPU' };
    }
    return { vram: (baseParams * 0.5 * 1.15).toFixed(1) + ' GB', bits: '4-bit NormalFloat (NF4)', fits16GB: baseParams <= 13 ? 'Fits Single 16GB GPU' : 'Single 48GB GPU' };
  };
  const qloraStats = getQloraStats();

  // 04: BERT Inference
  const getBertOutput = () => {
    const lower = bertInput.toLowerCase();
    if (lower.includes('database') || lower.includes('exhausted') || lower.includes('error') || lower.includes('latency')) {
      return { category: 'CRITICAL INFRASTRUCTURE INCIDENT', confidence: 0.94, severity: 'High', color: '#FF7B72' };
    }
    if (lower.includes('deploy') || lower.includes('traffic') || lower.includes('update')) {
      return { category: 'DEPLOYMENT & RUNTIME TELEMETRY', confidence: 0.88, severity: 'Medium', color: '#FFB86B' };
    }
    return { category: 'STANDARD LOG / INFORMATIONAL', confidence: 0.91, severity: 'Low', color: '#7CFF6B' };
  };
  const bertResult = getBertOutput();

  // 07: Evaluation Matrix Calculation
  const getEvalStats = () => {
    const recall = Math.min(0.98, Math.max(0.40, 1.0 - (threshold * 0.55)));
    const precision = Math.min(0.95, Math.max(0.50, 0.45 + (threshold * 0.50)));
    const f1 = (2 * precision * recall) / (precision + recall);
    const falseNegatives = Math.round((1 - recall) * 200);
    const estimatedLoss = falseNegatives * 500; // $500 per lost customer
    return { recall, precision, f1, estimatedLoss };
  };
  const evalStats = getEvalStats();

  // 08: House Price Prediction
  const getHousePrice = () => {
    let base = 80000;
    base += houseSqFt * 75;
    base += houseQuality * 16000;
    base += houseGarage * 12000;
    base += (houseYear - 1980) * 1100;
    return Math.round(base / 1000) * 1000;
  };

  // 09: Titanic Survival
  const getTitanicOdds = () => {
    let p = 0.5;
    if (passengerSex === 'female') p += 0.35;
    else p -= 0.25;
    if (passengerClass === 1) p += 0.20;
    if (passengerClass === 3) p -= 0.18;
    if (passengerAge < 14) p += 0.15;
    if (passengerAge > 60) p -= 0.10;
    return Math.max(0.05, Math.min(0.95, p));
  };
  const titanicOdds = getTitanicOdds();

  return (
    <div className="rounded-xl border border-[#24272D] bg-[#0C0E12] overflow-hidden">
      {/* Header bar of interactive sandbox */}
      <div className="px-4 py-2.5 bg-[#12151B] border-b border-[#24272D] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 text-[#7CFF6B]">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="font-bold tracking-wider uppercase">INTERACTIVE SYSTEM SIMULATOR</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#8B8F98]">
          LIVE REAL-TIME INFERENCE
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* ====================================================================
            PROJECT 01: CUSTOMER CHURN PREDICTION
        ==================================================================== */}
        {projectId === 'customer-churn' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Parameter 1: Tenure */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <div className="flex justify-between text-[#8B8F98]">
                  <span>CUSTOMER TENURE:</span>
                  <span className="text-[#7CFF6B] font-bold">{churnTenure} MONTHS</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="72"
                  value={churnTenure}
                  onChange={(e) => setChurnTenure(Number(e.target.value))}
                  className="w-full accent-[#7CFF6B] cursor-pointer"
                />
              </div>

              {/* Parameter 2: Monthly Charges */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <div className="flex justify-between text-[#8B8F98]">
                  <span>MONTHLY BILL:</span>
                  <span className="text-[#6EA8FE] font-bold">${churnCharges} / MO</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="130"
                  value={churnCharges}
                  onChange={(e) => setChurnCharges(Number(e.target.value))}
                  className="w-full accent-[#6EA8FE] cursor-pointer"
                />
              </div>

              {/* Parameter 3: Contract Type */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[#8B8F98] block">CONTRACT TYPE:</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['month-to-month', 'one-year', 'two-year'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setChurnContract(c)}
                      className={`px-1.5 py-1 rounded text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                        churnContract === c
                          ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B]'
                          : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      {c.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 4: Tech Support Add-on */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#101216] border border-[#24272D] flex items-center justify-between">
                <div>
                  <span className="text-[#F2F2F2] block font-semibold">TECH SUPPORT ATTACHED</span>
                  <span className="text-[#8B8F98] text-[10px]">Reduces churn probability by ~15%</span>
                </div>
                <button
                  onClick={() => setChurnTechSupport(!churnTechSupport)}
                  className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                    churnTechSupport
                      ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B]'
                      : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                  }`}
                >
                  {churnTechSupport ? 'ENABLED' : 'NONE'}
                </button>
              </div>
            </div>

            {/* Inference Result Box */}
            <div className={`p-4 rounded-xl border font-mono transition-all ${
              isHighRisk
                ? 'bg-[#FF7B72]/10 border-[#FF7B72]/40 text-[#FF7B72]'
                : 'bg-[#7CFF6B]/10 border-[#7CFF6B]/40 text-[#7CFF6B]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                    {isHighRisk ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>MODEL DECISION: {isHighRisk ? 'HIGH CHURN RISK (INTERVENTION REQUIRED)' : 'HEALTHY ACCOUNT'}</span>
                  </div>
                  <p className="text-xs text-[#E6EDF3] mt-1 font-sans">
                    {isHighRisk
                      ? 'Probability exceeds cost-sensitive threshold (0.45). Recommendation: Dispatch automated retention discount.'
                      : 'Probability below risk threshold. Account stable, regular engagement cycle.'}
                  </p>
                </div>
                <div className="text-right sm:border-l sm:border-[#24272D] sm:pl-4 shrink-0">
                  <span className="text-[10px] text-[#8B8F98] block">CHURN PROBABILITY</span>
                  <span className="text-2xl font-bold">{(churnProb * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 02: QWEN 1.5 LORA ADAPTATION
        ==================================================================== */}
        {projectId === 'qwen-lora' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#8B8F98]">SELECT DOMAIN PROMPT:</span>
              <div className="flex gap-2">
                {loraPrompts.map((p, idx) => (
                  <button
                    key={p.title}
                    onClick={() => setLoraPromptIndex(idx)}
                    className={`px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer ${
                      loraPromptIndex === idx
                        ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B] font-bold'
                        : 'bg-[#101216] border-[#24272D] text-[#8B8F98]'
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D] font-mono text-xs text-[#E6EDF3]">
              <span className="text-[#8B8F98] block text-[10px] mb-1">PROMPT:</span>
              "{loraPrompts[loraPromptIndex].prompt}"
            </div>

            {/* Side-by-Side Model Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {/* Base Qwen */}
              <div className="p-3.5 rounded-lg bg-[#08090B] border border-[#24272D] space-y-2">
                <div className="flex items-center justify-between text-[#8B8F98] border-b border-[#24272D] pb-1.5 text-[11px]">
                  <span>BASE QWEN 1.5 (UNFINE-TUNED)</span>
                  <span className="text-[#FFB86B]">GENERIC</span>
                </div>
                <p className="text-xs text-[#8B8F98] leading-relaxed">
                  {loraPrompts[loraPromptIndex].baseOutput}
                </p>
              </div>

              {/* LoRA Adapted */}
              <div className="p-3.5 rounded-lg bg-[#101216] border border-[#7CFF6B]/50 space-y-2">
                <div className="flex items-center justify-between text-[#7CFF6B] border-b border-[#24272D] pb-1.5 text-[11px]">
                  <span className="font-bold">LORA ADAPTED (VIGNESH REPO)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#7CFF6B]/15 text-[#7CFF6B]">RANK = 16</span>
                </div>
                <pre className="text-xs text-[#E6EDF3] leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  {loraPrompts[loraPromptIndex].adaptedOutput}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-[#101216] border border-[#24272D] font-mono text-[11px] text-[#8B8F98]">
              <span>MEMORY FOOTPRINT: <strong className="text-[#7CFF6B]">24MB ADAPTER</strong> (99.2% smaller than full model checkpoint)</span>
              <span>INFERENCE LATENCY: <strong className="text-[#6EA8FE]">~23ms / token</strong></span>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 03: QLORA 4-BIT QUANTIZATION
        ==================================================================== */}
        {projectId === 'qlora' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-2 p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[#8B8F98] block">TARGET MODEL SIZE:</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['7B', '13B', '70B'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setQloraModelSize(s)}
                      className={`py-1.5 rounded font-bold border transition-colors cursor-pointer ${
                        qloraModelSize === s
                          ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B]'
                          : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[#8B8F98] block">QUANTIZATION PRECISION:</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['fp16', 'int8', 'nf4'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setQloraFormat(fmt)}
                      className={`py-1.5 rounded font-bold border transition-colors cursor-pointer text-[10px] uppercase ${
                        qloraFormat === fmt
                          ? 'bg-[#6EA8FE]/15 border-[#6EA8FE] text-[#6EA8FE]'
                          : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      {fmt === 'nf4' ? '4-Bit NF4' : fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Telemetry Card */}
            <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <span className="text-[#8B8F98] block text-[10px]">REQUIRED VRAM:</span>
                <span className="text-2xl font-bold text-[#7CFF6B]">{qloraStats.vram}</span>
              </div>
              <div>
                <span className="text-[#8B8F98] block text-[10px]">PRECISION FORMAT:</span>
                <span className="text-sm font-semibold text-[#F2F2F2]">{qloraStats.bits}</span>
              </div>
              <div>
                <span className="text-[#8B8F98] block text-[10px]">HARDWARE ACCESSIBILITY:</span>
                <span className="text-sm font-semibold text-[#6EA8FE]">{qloraStats.fits16GB}</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 04: BERT EMBEDDINGS & CLASSIFICATION
        ==================================================================== */}
        {projectId === 'bert' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <span className="text-[#8B8F98]">INPUT LOG OR SYSTEM INCIDENT FOR [CLS] ENCODING:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bertInput}
                  onChange={(e) => setBertInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-[#101216] border border-[#24272D] text-[#F2F2F2] focus:border-[#7CFF6B] outline-none text-xs"
                />
              </div>
            </div>

            {/* Live Classification Result */}
            <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#8B8F98] text-[10px]">BERT PREDICTED CLASS:</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#7CFF6B]">
                  CONFIDENCE: {(bertResult.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-base font-bold text-[#F2F2F2]" style={{ color: bertResult.color }}>
                {bertResult.category}
              </div>
              <div className="pt-2 border-t border-[#24272D] flex items-center justify-between text-[11px] text-[#8B8F98]">
                <span>TOKEN ATTENTION: 768-DIMENSIONAL CLS VECTOR</span>
                <span>LATENCY: 4.8ms</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 05: VERO PULL REQUEST INTELLIGENCE
        ==================================================================== */}
        {projectId === 'vero' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#101216] border border-[#7CFF6B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#F2F2F2]">
                  <GitPullRequest className="w-4 h-4 text-[#7CFF6B]" />
                  <span>VERO LIVE AUDIT ENGINE AVAILABLE</span>
                </div>
                <p className="text-xs text-[#8B8F98] mt-1 font-sans">
                  You can inspect live pull request diffs, automated SonarQube static gates, and AST syntax parsing directly inside the dedicated engine view.
                </p>
              </div>

              {onOpenVero && (
                <button
                  onClick={onOpenVero}
                  className="px-4 py-2 rounded-lg bg-[#7CFF6B] hover:bg-[#7CFF6B]/90 text-[#08090B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>LAUNCH FULL ENGINE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-[#08090B] border border-[#24272D]">
                <span className="text-[#8B8F98] block">STATIC GATE 01:</span>
                <span className="text-[#7CFF6B] font-bold">SQL INJECTION TRAP</span>
              </div>
              <div className="p-2.5 rounded bg-[#08090B] border border-[#24272D]">
                <span className="text-[#8B8F98] block">STATIC GATE 02:</span>
                <span className="text-[#6EA8FE] font-bold">AST LEAK CHECK</span>
              </div>
              <div className="p-2.5 rounded bg-[#08090B] border border-[#24272D]">
                <span className="text-[#8B8F98] block">LLM EVALUATION:</span>
                <span className="text-[#F2F2F2] font-bold">TYPESAFE JEV SIGNAL</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 06: CNN VISION FUNDAMENTALS
        ==================================================================== */}
        {projectId === 'cnn' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#8B8F98]">CONVNET LAYER LEVEL:</span>
              <div className="flex gap-1.5">
                {([1, 2, 3] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setCnnLayer(lvl)}
                    className={`px-3 py-1 rounded text-xs border transition-colors cursor-pointer ${
                      cnnLayer === lvl
                        ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B] font-bold'
                        : 'bg-[#101216] border-[#24272D] text-[#8B8F98]'
                    }`}
                  >
                    Layer {lvl}: {lvl === 1 ? 'Edges (3x3)' : lvl === 2 ? 'Textures (Pool)' : 'Dense FC'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
              <div className="text-[#7CFF6B] font-bold">
                {cnnLayer === 1 && 'LAYER 1: LOW-LEVEL EDGE DETECTION (Sobel / Gabor Kernels)'}
                {cnnLayer === 2 && 'LAYER 2: SPATIAL POOLING & TEXTURE SYNTHESIS (Max-Pooling 2x2)'}
                {cnnLayer === 3 && 'LAYER 3: HIGH-LEVEL OBJECT EMBEDDING & SOFTMAX (Linear Layer)'}
              </div>
              <p className="text-xs text-[#8B8F98] font-sans leading-relaxed">
                {cnnLayer === 1 && 'Extracts directional gradients and spatial high frequencies. 32 filters of 3x3 kernels.'}
                {cnnLayer === 2 && 'Reduces spatial dimensions while preserving translational invariance. Downsamples tensor by 50%.'}
                {cnnLayer === 3 && 'Flattens spatial tensor into 128-dimensional dense vector mapped to 10 categorical outputs with CrossEntropyLoss.'}
              </p>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 07: MODEL EVALUATION & CALIBRATION MATRIX
        ==================================================================== */}
        {projectId === 'evaluation' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5 p-3 rounded-lg bg-[#101216] border border-[#24272D]">
              <div className="flex justify-between text-[#8B8F98]">
                <span>DECISION THRESHOLD:</span>
                <span className="text-[#7CFF6B] font-bold">{threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-[#7CFF6B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8B8F98] pt-1">
                <span>0.10 (High Recall)</span>
                <span className="text-[#7CFF6B] font-bold">0.45 (Vignesh Tuned)</span>
                <span>0.90 (High Precision)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[10px] text-[#8B8F98] block">RECALL:</span>
                <span className="text-xl font-bold text-[#7CFF6B]">{(evalStats.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[10px] text-[#8B8F98] block">PRECISION:</span>
                <span className="text-xl font-bold text-[#6EA8FE]">{(evalStats.precision * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[10px] text-[#8B8F98] block">F1 SCORE:</span>
                <span className="text-xl font-bold text-[#F2F2F2]">{evalStats.f1.toFixed(3)}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[10px] text-[#8B8F98] block">RISK LOSS:</span>
                <span className="text-xl font-bold text-[#FFB86B]">${evalStats.estimatedLoss}</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 08: HOUSE PRICE PREDICTION (TFDF)
        ==================================================================== */}
        {projectId === 'house-price' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <div className="flex justify-between text-[#8B8F98]">
                  <span>LIVING AREA:</span>
                  <span className="text-[#7CFF6B]">{houseSqFt} SQFT</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="4000"
                  step="50"
                  value={houseSqFt}
                  onChange={(e) => setHouseSqFt(Number(e.target.value))}
                  className="w-full accent-[#7CFF6B]"
                />
              </div>

              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <div className="flex justify-between text-[#8B8F98]">
                  <span>OVERALL QUALITY:</span>
                  <span className="text-[#6EA8FE]">{houseQuality} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={houseQuality}
                  onChange={(e) => setHouseQuality(Number(e.target.value))}
                  className="w-full accent-[#6EA8FE]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#101216] border border-[#7CFF6B]/30 flex items-center justify-between">
              <div>
                <span className="text-[#8B8F98] text-[10px] block">TF-DF ESTIMATED PROPERTY VALUE:</span>
                <span className="text-2xl font-bold text-[#7CFF6B]">${getHousePrice().toLocaleString()}</span>
              </div>
              <div className="text-right text-[11px] text-[#8B8F98]">
                <span>ALGORITHM: RANDOM FOREST + GBDT</span>
                <span className="block text-[#6EA8FE]">RMSLE: 0.124</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 09: TITANIC SURVIVAL BASELINE
        ==================================================================== */}
        {projectId === 'titanic' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <span className="text-[#8B8F98] block">CLASS:</span>
                <div className="flex gap-1">
                  {([1, 2, 3] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setPassengerClass(c)}
                      className={`flex-1 py-1 rounded text-[10px] border ${
                        passengerClass === c ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B]' : 'bg-[#08090B] border-[#24272D]'
                      }`}
                    >
                      {c === 1 ? '1st' : c === 2 ? '2nd' : '3rd'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <span className="text-[#8B8F98] block">SEX:</span>
                <div className="flex gap-1">
                  {(['female', 'male'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPassengerSex(s)}
                      className={`flex-1 py-1 rounded text-[10px] uppercase border ${
                        passengerSex === s ? 'bg-[#6EA8FE]/15 border-[#6EA8FE] text-[#6EA8FE]' : 'bg-[#08090B] border-[#24272D]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <div className="flex justify-between text-[#8B8F98]">
                  <span>AGE:</span>
                  <span className="text-[#F2F2F2]">{passengerAge}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="80"
                  value={passengerAge}
                  onChange={(e) => setPassengerAge(Number(e.target.value))}
                  className="w-full accent-[#7CFF6B]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] flex items-center justify-between">
              <div>
                <span className="text-[#8B8F98] text-[10px] block">SURVIVAL PREDICTION:</span>
                <span className="text-xl font-bold text-[#F2F2F2]">
                  {titanicOdds >= 0.5 ? (
                    <span className="text-[#7CFF6B]">SURVIVED ({(titanicOdds * 100).toFixed(1)}%)</span>
                  ) : (
                    <span className="text-[#FF7B72]">PERISHED ({((1 - titanicOdds) * 100).toFixed(1)}%)</span>
                  )}
                </span>
              </div>
              <div className="text-right text-[11px] text-[#8B8F98]">
                <span>ROC-AUC: 0.84</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
