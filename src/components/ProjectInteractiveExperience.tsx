import React, { useState, Suspense, lazy } from 'react';
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
  GitPullRequest,
  Check,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Database,
  Network
} from 'lucide-react';
import { CNNLayerExplorer3D } from './CNNLayerExplorer3D';
import { ExperimentConfig } from '../types';

const HousePriceExperiment3D = lazy(() => import('./HousePriceExperiment3D'));

interface ProjectInteractiveExperienceProps {
  projectId: string;
  experiment?: ExperimentConfig;
  onOpenVero?: () => void;
}

export const ProjectInteractiveExperience: React.FC<ProjectInteractiveExperienceProps> = ({
  projectId,
  experiment,
  onOpenVero,
}) => {
  // 01: Customer Churn Simulator State
  const [churnTenure, setChurnTenure] = useState(6);
  const [churnContract, setChurnContract] = useState<'month-to-month' | 'one-year' | 'two-year'>('month-to-month');
  const [churnCharges, setChurnCharges] = useState(85);
  const [churnTechSupport, setChurnTechSupport] = useState(false);
  const [churnThreshold, setChurnThreshold] = useState(0.45);

  // 02: Qwen LoRA Comparison State
  const [loraPromptIndex, setLoraPromptIndex] = useState(0);
  const [loraRank, setLoraRank] = useState(8);
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

  // 03: QLoRA Quantization State & PEFT VRAM Calculator
  const [qloraModelSize, setQloraModelSize] = useState<'7B' | '13B' | '70B'>('7B');
  const [qloraFormat, setQloraFormat] = useState<'fp16' | 'int8' | 'nf4'>('nf4');
  const [qloraRankInput, setQloraRankInput] = useState<number>(16);
  const [qloraTargetModules, setQloraTargetModules] = useState<'qv' | 'all-linear'>('qv');
  const [qloraSeqLength, setQloraSeqLength] = useState<number>(2048);
  const [qloraGradientCheckpointing, setQloraGradientCheckpointing] = useState<boolean>(true);
  const [qloraPagedOptimizer, setQloraPagedOptimizer] = useState<boolean>(true);

  // 04: BERT Classifier State
  const [bertInput, setBertInput] = useState('Production database connection pool exhausted during peak traffic');

  // 05: Vero Code Review Diff Presets
  const [veroPreset, setVeroPreset] = useState<'sqli' | 'secret' | 'clean'>('sqli');

  // 06: CNN Visualizer State
  const [cnnLayer, setCnnLayer] = useState<number>(1);

  // 07: Model Evaluation State
  const [evalThreshold, setEvalThreshold] = useState(0.45);

  // 08: House Price State
  const [houseSqFt, setHouseSqFt] = useState(2100);
  const [houseQuality, setHouseQuality] = useState(8);
  const [houseGarage, setHouseGarage] = useState(2);
  const [houseYear, setHouseYear] = useState(2015);

  // 09: Titanic State
  const [passengerClass, setPassengerClass] = useState<1 | 2 | 3>(1);
  const [passengerSex, setPassengerSex] = useState<'female' | 'male'>('female');
  const [passengerAge, setPassengerAge] = useState(28);
  const [passengerFamily, setPassengerFamily] = useState(1);

  /* -------------------------------------------------------------
     CALCULATED METRICS FOR EACH SIMULATOR
  ------------------------------------------------------------- */
  // 01: Churn Probability Calculation & Threshold Analysis
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
  const isChurnPredicted = churnProb >= churnThreshold;

  // Confusion matrix simulation based on threshold
  const simTotal = 500;
  const simActualPositives = 140; // ~28% churn rate
  const simActualNegatives = simTotal - simActualPositives;
  const simTP = Math.round(simActualPositives * Math.min(0.98, Math.max(0.35, 1.05 - churnThreshold * 0.75)));
  const simFN = simActualPositives - simTP;
  const simFP = Math.round(simActualNegatives * Math.max(0.04, Math.min(0.70, (1 - churnThreshold) * 0.45)));
  const simTN = simActualNegatives - simFP;
  const financialCost = simFN * 500 + simFP * 50; // $500 lost customer, $50 retention perk

  // 03: QLoRA VRAM & Parameter-Efficiency Calculation
  const getQloraStats = () => {
    const baseParamsBillions = qloraModelSize === '7B' ? 7 : qloraModelSize === '13B' ? 13 : 70;
    const hiddenDim = qloraModelSize === '7B' ? 4096 : qloraModelSize === '13B' ? 5120 : 8192;
    const numLayers = qloraModelSize === '7B' ? 32 : qloraModelSize === '13B' ? 40 : 80;

    const bytesPerParam = qloraFormat === 'fp16' ? 2 : qloraFormat === 'int8' ? 1 : 0.5;
    const baseVramGb = baseParamsBillions * bytesPerParam;

    const matrixMultiplier = qloraTargetModules === 'qv' ? 4 : 14;
    const trainableParams = matrixMultiplier * hiddenDim * qloraRankInput * numLayers;
    const trainableParamsMillion = (trainableParams / 1_000_000).toFixed(2);
    const trainablePercent = ((trainableParams / (baseParamsBillions * 1_000_000_000)) * 100).toFixed(3);

    const optimizerBytesPerParam = qloraPagedOptimizer ? 2.5 : 8;
    const adapterVramGb = (trainableParams * (6 + optimizerBytesPerParam)) / 1_000_000_000;

    const rawActivationVram = (numLayers * qloraSeqLength * hiddenDim * 16) / 1_000_000_000;
    const activationVramGb = qloraGradientCheckpointing ? rawActivationVram * 0.18 : rawActivationVram;

    const cudaOverheadGb = 0.8;
    const totalVramGb = baseVramGb + adapterVramGb + activationVramGb + cudaOverheadGb;

    let hardwareCompatibility = 'Single 16GB GPU (RTX 4080 / T4)';
    let badgeColor = 'text-[#7CFF6B] bg-[#7CFF6B]/15 border-[#7CFF6B]/30';
    if (totalVramGb > 48) {
      hardwareCompatibility = 'Multi-GPU Cluster / A100 80GB';
      badgeColor = 'text-[#FF5449] bg-[#FF5449]/15 border-[#FF5449]/30';
    } else if (totalVramGb > 24) {
      hardwareCompatibility = 'High-Memory GPU / A6000 48GB';
      badgeColor = 'text-[#FFB020] bg-[#FFB020]/15 border-[#FFB020]/30';
    } else if (totalVramGb > 15.5) {
      hardwareCompatibility = 'Single 24GB GPU (RTX 4090 / A10G)';
      badgeColor = 'text-[#6EA8FE] bg-[#6EA8FE]/15 border-[#6EA8FE]/30';
    }

    return {
      totalVram: totalVramGb.toFixed(1) + ' GB',
      baseVram: baseVramGb.toFixed(1) + ' GB',
      adapterVram: (adapterVramGb * 1024).toFixed(0) + ' MB',
      activationVram: activationVramGb.toFixed(1) + ' GB',
      cudaOverhead: cudaOverheadGb.toFixed(1) + ' GB',
      bits: qloraFormat === 'fp16' ? '16-bit Float' : qloraFormat === 'int8' ? '8-bit Int' : '4-bit NormalFloat (NF4)',
      trainableParamsMillion: trainableParamsMillion + 'M',
      trainablePercent: trainablePercent + '%',
      hardwareCompatibility,
      badgeColor,
    };
  };
  const qloraStats = getQloraStats();

  // 04: BERT Subword Tokenizer Simulation & Output
  const tokenizeBertInput = (text: string) => {
    const rawWords = text.trim().split(/\s+/);
    const tokens = ['[CLS]'];
    rawWords.forEach((word) => {
      if (word.length > 7) {
        tokens.push(word.substring(0, 4).toLowerCase());
        tokens.push('##' + word.substring(4).toLowerCase());
      } else {
        tokens.push(word.toLowerCase());
      }
    });
    tokens.push('[SEP]');
    return tokens;
  };
  const bertTokens = tokenizeBertInput(bertInput);

  const getBertOutput = () => {
    const lower = bertInput.toLowerCase();
    if (lower.includes('database') || lower.includes('exhausted') || lower.includes('error') || lower.includes('pool')) {
      return { category: 'CRITICAL INFRASTRUCTURE INCIDENT', confidence: 0.94, severity: 'High', color: '#FF7B72' };
    }
    if (lower.includes('deploy') || lower.includes('traffic') || lower.includes('canary')) {
      return { category: 'DEPLOYMENT & RUNTIME TELEMETRY', confidence: 0.88, severity: 'Medium', color: '#FFB86B' };
    }
    return { category: 'STANDARD LOG / INFORMATIONAL', confidence: 0.91, severity: 'Low', color: '#7CFF6B' };
  };
  const bertResult = getBertOutput();

  // 07: Evaluation Matrix Calculation
  const getEvalStats = () => {
    const recall = Math.min(0.98, Math.max(0.40, 1.05 - (evalThreshold * 0.65)));
    const precision = Math.min(0.96, Math.max(0.45, 0.40 + (evalThreshold * 0.55)));
    const specificity = Math.min(0.98, Math.max(0.50, 0.50 + (evalThreshold * 0.48)));
    const f1 = (2 * precision * recall) / (precision + recall);
    const mcc = Math.sqrt(precision * recall) * (specificity - 0.2);
    return { recall, precision, specificity, f1, mcc };
  };
  const evalStats = getEvalStats();

  // 08: House Price Prediction with Feature Attribution
  const getHousePriceBreakdown = () => {
    const base = 80000;
    const sqftContrib = houseSqFt * 75;
    const qualContrib = houseQuality * 16000;
    const garageContrib = houseGarage * 12000;
    const yearContrib = (houseYear - 1980) * 1100;
    const total = base + sqftContrib + qualContrib + garageContrib + yearContrib;
    return {
      base,
      sqftContrib,
      qualContrib,
      garageContrib,
      yearContrib,
      total: Math.round(total / 1000) * 1000
    };
  };
  const priceBreakdown = getHousePriceBreakdown();

  // 09: Titanic Survival Log-Odds Breakdown
  const getTitanicOdds = () => {
    let z = 0.0;
    if (passengerSex === 'female') z += 1.8;
    else z -= 1.4;
    if (passengerClass === 1) z += 1.2;
    if (passengerClass === 3) z -= 1.1;
    if (passengerAge < 14) z += 0.9;
    if (passengerAge > 60) z -= 0.6;
    if (passengerFamily >= 2 && passengerFamily <= 4) z += 0.4;
    else if (passengerFamily > 4) z -= 0.7;

    const prob = 1 / (1 + Math.exp(-z));
    return { prob: Math.max(0.04, Math.min(0.96, prob)), logOdds: z };
  };
  const titanicStats = getTitanicOdds();

  // Render the self-contained 3D House Price Workbench directly without extra nested card wrappers
  if (projectId === 'house-price' || experiment?.type === 'regression-surface') {
    return (
      <Suspense
        fallback={
          <div className="p-6 rounded-xl bg-[#08090B] border border-[#24272D] font-mono text-xs text-[#8B8F98] flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 text-[#7CFF6B] animate-pulse" />
            <span>Loading 3D House Price Prediction Surface &amp; SHAP Workbench...</span>
          </div>
        }
      >
        <HousePriceExperiment3D
          dataUrl={experiment?.dataUrl}
          fallbackFixtureUrl={experiment?.fallbackFixtureUrl}
        />
      </Suspense>
    );
  }

  return (
    <div className="rounded-xl border border-[#24272D] bg-[#0C0E12] overflow-hidden">
      {/* Header bar of interactive sandbox */}
      <div className="px-4 py-2.5 bg-[#12151B] border-b border-[#24272D] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 text-[#7CFF6B]">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="font-bold tracking-wider uppercase">INTERACTIVE ENGINEERING SIMULATOR</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#8B8F98]">
          DETERMINISTIC VERIFIABLE EXPERIMENT
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
                      type="button"
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

              {/* Parameter 4: Decision Threshold Tuning */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#101216] border border-[#24272D]">
                <div className="flex justify-between text-[#8B8F98]">
                  <span>DECISION THRESHOLD (τ):</span>
                  <span className="text-[#FFB86B] font-bold">{churnThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={churnThreshold}
                  onChange={(e) => setChurnThreshold(Number(e.target.value))}
                  className="w-full accent-[#FFB86B] cursor-pointer"
                />
                <div className="text-[10px] text-[#8B8F98]">
                  Tuning τ balances False Negatives ($500 churn) vs False Positives ($50 perk).
                </div>
              </div>
            </div>

            {/* Inference Result & Cost Trade-off Box */}
            <div className={`p-4 rounded-xl border font-mono transition-all ${
              isChurnPredicted
                ? 'bg-[#FF7B72]/10 border-[#FF7B72]/40 text-[#FF7B72]'
                : 'bg-[#7CFF6B]/10 border-[#7CFF6B]/40 text-[#7CFF6B]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                    {isChurnPredicted ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>DECISION: {isChurnPredicted ? 'CHURN INTERVENTION TRIGGERED' : 'HEALTHY ACCOUNT (RETAIN)'}</span>
                  </div>
                  <p className="text-xs text-[#E6EDF3] mt-1 font-sans">
                    {isChurnPredicted
                      ? `Probability (${(churnProb * 100).toFixed(1)}%) ≥ Threshold (${(churnThreshold * 100).toFixed(0)}%). Automated retention workflow dispatched.`
                      : `Probability (${(churnProb * 100).toFixed(1)}%) < Threshold (${(churnThreshold * 100).toFixed(0)}%). Account risk below intervention threshold.`}
                  </p>
                </div>
                <div className="text-right sm:border-l sm:border-[#24272D] sm:pl-4 shrink-0">
                  <span className="text-[10px] text-[#8B8F98] block">CHURN PROBABILITY</span>
                  <span className="text-2xl font-bold">{(churnProb * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Live Confusion Matrix & Financial Cost Matrix */}
            <div className="p-3.5 rounded-xl bg-[#101216] border border-[#24272D] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[#8B8F98] text-[11px]">
                <span>EVALUATION CONFUSION MATRIX (500-CUSTOMER VALIDATION SPLIT):</span>
                <span className="text-[#7CFF6B]">Expected Loss: ${financialCost.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-[#08090B] border border-[#24272D]">
                  <span className="text-[10px] text-[#8B8F98] block">TRUE POSITIVES (TP):</span>
                  <span className="text-sm font-bold text-[#7CFF6B]">{simTP}</span>
                  <span className="text-[9px] text-[#8B8F98] block">Churners Saved</span>
                </div>
                <div className="p-2 rounded bg-[#08090B] border border-[#24272D]">
                  <span className="text-[10px] text-[#8B8F98] block">FALSE POSITIVES (FP):</span>
                  <span className="text-sm font-bold text-[#FFB86B]">{simFP}</span>
                  <span className="text-[9px] text-[#8B8F98] block">Perks Wasted ($50/ea)</span>
                </div>
                <div className="p-2 rounded bg-[#08090B] border border-[#24272D]">
                  <span className="text-[10px] text-[#8B8F98] block">FALSE NEGATIVES (FN):</span>
                  <span className="text-sm font-bold text-[#FF7B72]">{simFN}</span>
                  <span className="text-[9px] text-[#8B8F98] block">Lost Accounts ($500/ea)</span>
                </div>
                <div className="p-2 rounded bg-[#08090B] border border-[#24272D]">
                  <span className="text-[10px] text-[#8B8F98] block">TRUE NEGATIVES (TN):</span>
                  <span className="text-sm font-bold text-[#6EA8FE]">{simTN}</span>
                  <span className="text-[9px] text-[#8B8F98] block">Retained Naturally</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 02: QWEN LORA ADAPTATION
        ==================================================================== */}
        {projectId === 'qwen-lora' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Rank & Scaling Parameter Slider */}
            <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D] space-y-2">
              <div className="flex items-center justify-between text-[#8B8F98]">
                <span>ADAPTER RANK DECOMPOSITION (r):</span>
                <span className="text-[#7CFF6B] font-bold">r = {loraRank} (α = {loraRank * 2})</span>
              </div>
              <input
                type="range"
                min="4"
                max="32"
                step="4"
                value={loraRank}
                onChange={(e) => setLoraRank(Number(e.target.value))}
                className="w-full accent-[#7CFF6B] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-[#8B8F98] pt-1 border-t border-[#24272D]/60">
                <span>Adapter Trainable Weights: <strong className="text-[#F2F2F2]">{(loraRank * 2.3).toFixed(1)}M (0.25%)</strong></span>
                <span>Serialized Checkpoint: <strong className="text-[#6EA8FE]">{(loraRank * 3).toFixed(0)}MB</strong></span>
              </div>
            </div>

            {/* Prompt Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[#8B8F98]">BENCHMARK PROMPT:</span>
              <div className="flex gap-2">
                {loraPrompts.map((p, idx) => (
                  <button
                    key={p.title}
                    type="button"
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

            {/* Prompt Text Display */}
            <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D] text-[#E6EDF3]">
              <span className="text-[#8B8F98] block text-[10px] mb-1">PROMPT:</span>
              &ldquo;{loraPrompts[loraPromptIndex].prompt}&rdquo;
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#101216] border border-[#24272D] space-y-1.5">
                <span className="text-[#8B8F98] block text-[11px] font-bold">BASE QWEN 2.5 (UN-ADAPTED)</span>
                <p className="text-xs text-[#8B8F98] font-sans leading-relaxed whitespace-pre-wrap">
                  {loraPrompts[loraPromptIndex].baseOutput}
                </p>
                <div className="pt-2 text-[10px] text-[#FF7B72] border-t border-[#24272D]">
                  Vague, lacks exponential jitter calculation
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101216] border border-[#7CFF6B]/50 space-y-1.5">
                <span className="text-[#7CFF6B] block text-[11px] font-bold">LORA ADAPTED MODEL (PEFT r={loraRank})</span>
                <pre className="text-xs text-[#7CFF6B] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  {loraPrompts[loraPromptIndex].adaptedOutput}
                </pre>
                <div className="pt-2 text-[10px] text-[#7CFF6B] border-t border-[#24272D]">
                  Strict schema adherence &amp; production error handling
                </div>
              </div>
            </div>

            <div className="text-[10px] text-[#8B8F98] italic text-center">
              * Model outputs shown are deterministic outputs recorded from the fine-tuning validation suite.
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 03: QLORA 4-BIT QUANTIZATION & VRAM BUDGET
        ==================================================================== */}
        {projectId === 'qlora' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[#8B8F98] block text-[10px]">FOUNDATION MODEL SIZE:</span>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {(['7B', '13B', '70B'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setQloraModelSize(size)}
                      className={`py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                        qloraModelSize === size
                          ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B]'
                          : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[#8B8F98] block text-[10px]">BASE QUANTIZATION FORMAT:</span>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {(['fp16', 'int8', 'nf4'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setQloraFormat(fmt)}
                      className={`py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                        qloraFormat === fmt
                          ? 'bg-[#6EA8FE]/15 border-[#6EA8FE] text-[#6EA8FE]'
                          : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#101216] border border-[#24272D]">
                <span className="text-[#8B8F98] block text-[10px]">SEQUENCE CONTEXT:</span>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {[1024, 2048, 4096].map((seq) => (
                    <button
                      key={seq}
                      type="button"
                      onClick={() => setQloraSeqLength(seq)}
                      className={`py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                        qloraSeqLength === seq
                          ? 'bg-[#FFB86B]/15 border-[#FFB86B] text-[#FFB86B]'
                          : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      {seq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Granular Memory Breakdown Cards */}
            <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#24272D]">
                <div>
                  <span className="text-[#8B8F98] block text-[10px]">TOTAL ESTIMATED VRAM:</span>
                  <span className="text-2xl font-bold text-[#7CFF6B]">{qloraStats.totalVram}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#8B8F98] block text-[10px]">HARDWARE COMPATIBILITY:</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${qloraStats.badgeColor}`}>
                    {qloraStats.hardwareCompatibility}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded bg-[#08090B] border border-[#24272D]">
                  <span className="text-[#8B8F98] block text-[10px]">BASE WEIGHTS:</span>
                  <span className="text-sm font-bold text-[#F2F2F2]">{qloraStats.baseVram}</span>
                  <span className="text-[10px] text-[#5A5E67] block">{qloraStats.bits}</span>
                </div>
                <div className="p-2 rounded bg-[#08090B] border border-[#24272D]">
                  <span className="text-[#8B8F98] block text-[10px]">ACTIVATION MEMORY:</span>
                  <span className="text-sm font-bold text-[#FFB86B]">{qloraStats.activationVram}</span>
                  <span className="text-[10px] text-[#5A5E67] block">{qloraSeqLength} tokens</span>
                </div>
                <div className="p-2 rounded bg-[#08090B] border border-[#24272D]">
                  <span className="text-[#8B8F98] block text-[10px]">ADAPTER MEMORY:</span>
                  <span className="text-sm font-bold text-[#6EA8FE]">{qloraStats.adapterVram}</span>
                  <span className="text-[10px] text-[#5A5E67] block">r={qloraRankInput} weights</span>
                </div>
                <div className="p-2 rounded bg-[#08090B] border border-[#24272D]">
                  <span className="text-[#8B8F98] block text-[10px]">TRAINABLE FRACTION:</span>
                  <span className="text-sm font-bold text-[#7CFF6B]">{qloraStats.trainablePercent}</span>
                  <span className="text-[10px] text-[#5A5E67] block">{qloraStats.trainableParamsMillion}</span>
                </div>
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
              <span className="text-[#8B8F98]">INPUT LOG OR INCIDENT FOR BIDIRECTIONAL ENCODING:</span>
              <input
                type="text"
                value={bertInput}
                onChange={(e) => setBertInput(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#101216] border border-[#24272D] text-[#F2F2F2] focus:border-[#7CFF6B] outline-none text-xs"
              />
            </div>

            {/* WordPiece Subword Tokenizer Chips */}
            <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D] space-y-1.5">
              <span className="text-[#8B8F98] text-[10px] block">WORDPIECE SUBWORD TOKENS:</span>
              <div className="flex flex-wrap gap-1">
                {bertTokens.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#08090B] border border-[#7CFF6B]/30 text-[#7CFF6B] text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Prediction Result */}
            <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#8B8F98] text-[10px]">BERT PREDICTED INCIDENT SEVERITY:</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#7CFF6B]">
                  CONFIDENCE: {(bertResult.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-base font-bold text-[#F2F2F2]" style={{ color: bertResult.color }}>
                {bertResult.category}
              </div>
              <div className="pt-2 border-t border-[#24272D] flex items-center justify-between text-[11px] text-[#8B8F98]">
                <span>TOKEN ATTENTION: 768-DIMENSIONAL [CLS] VECTOR</span>
                <span className="text-[#7CFF6B]">LATENCY: 4.8ms</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 05: VERO PULL REQUEST INTELLIGENCE
        ==================================================================== */}
        {projectId === 'vero' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Diff Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[#8B8F98]">TEST PR DIFF SCENARIO:</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'sqli', label: 'Raw SQL Injection Sink' },
                  { id: 'secret', label: 'Hardcoded Token Secret' },
                  { id: 'clean', label: 'Clean Refactored Patch' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setVeroPreset(p.id as any)}
                    className={`px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer ${
                      veroPreset === p.id
                        ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B] font-bold'
                        : 'bg-[#101216] border-[#24272D] text-[#8B8F98]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AST Rule Detection Banner */}
            <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#8B8F98] text-[10px]">SONARQUBE AST STATIC RULE:</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                  veroPreset === 'clean' ? 'text-[#7CFF6B] bg-[#7CFF6B]/15 border-[#7CFF6B]/30' : 'text-[#FF5449] bg-[#FF5449]/15 border-[#FF5449]/30'
                }`}>
                  {veroPreset === 'sqli' ? 'RULE S3649 (BLOCKER)' : veroPreset === 'secret' ? 'RULE S2068 (BLOCKER)' : 'RULE CHECK: PASSED'}
                </span>
              </div>
              <div className="text-sm font-bold text-[#F2F2F2]">
                {veroPreset === 'sqli' && 'CRITICAL: Dynamic string interpolation detected in SQL query sink.'}
                {veroPreset === 'secret' && 'BLOCKER: Hardcoded 32-character authentication credential token detected.'}
                {veroPreset === 'clean' && 'CLEAN: All AST security invariants satisfied with zero blocker violations.'}
              </div>
              <div className="pt-2 border-t border-[#24272D] flex items-center justify-between text-[11px] text-[#8B8F98]">
                <span>TYPESAFE JEV RISK: <strong className={veroPreset === 'clean' ? 'text-[#7CFF6B]' : 'text-[#FF5449]'}>{veroPreset === 'clean' ? '12/100' : '94/100'}</strong></span>
                <span className="text-[#7CFF6B]">DECISION LATENCY: &lt;35ms</span>
              </div>
            </div>

            {onOpenVero && (
              <button
                type="button"
                onClick={onOpenVero}
                className="w-full py-2 rounded-lg bg-[#7CFF6B] text-[#08090B] font-bold hover:bg-[#7CFF6B]/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>OPEN FULL VERO WORKBENCH FOR LIVE GITHUB URLS</span>
              </button>
            )}
          </div>
        )}

        {/* ====================================================================
            PROJECT 06: CNN VISION FUNDAMENTALS & 3D LAYER EXPLORER
        ==================================================================== */}
        {projectId === 'cnn' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Dedicated 3D CNN Layer Explorer */}
            <CNNLayerExplorer3D activeStage={cnnLayer} onSelectStage={(s) => setCnnLayer(s)} />

            {/* 2D Stage Breakdown Cards */}
            <div className="p-3.5 rounded-xl bg-[#101216] border border-[#24272D] space-y-2">
              <div className="text-[#7CFF6B] font-bold">
                {cnnLayer === 0 && 'STAGE 0: INPUT PIXEL ARRAY (28×28 Grayscale)'}
                {cnnLayer === 1 && 'STAGE 1: LOW-LEVEL EDGE DETECTION (Conv1: 16 Filters of 3×3)'}
                {cnnLayer === 2 && 'STAGE 2: TEXTURAL FEATURE SYNTHESIS (Conv2: 32 Filters of 3×3)'}
                {cnnLayer === 3 && 'STAGE 3: DENSE REPRESENTATION PROJECTION (128 Features)'}
                {cnnLayer === 4 && 'STAGE 4: OUTPUT CLASSIFICATION (10 Class Logits)'}
              </div>
              <p className="text-xs text-[#8B8F98] font-sans leading-relaxed">
                {cnnLayer === 0 && 'Raw normalized pixel values between 0.0 and 1.0 representing grayscale digit strokes.'}
                {cnnLayer === 1 && '16 convolutional kernels extract horizontal, vertical, and diagonal edge gradients.'}
                {cnnLayer === 2 && 'Downsampled 14×14 maps are convolved with 32 kernels, detecting compound corners and loops.'}
                {cnnLayer === 3 && 'Spatial maps are flattened and passed through dense weights with 25% dropout regularization.'}
                {cnnLayer === 4 && 'Final linear projection produces probability distribution over digits 0-9 matching 98.6% test accuracy.'}
              </p>
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 07: MODEL EVALUATION & CALIBRATION MATRIX
        ==================================================================== */}
        {projectId === 'evaluation' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D] space-y-2">
              <div className="flex justify-between text-[#8B8F98]">
                <span>OPERATING DECISION THRESHOLD (τ):</span>
                <span className="text-[#7CFF6B] font-bold">{evalThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={evalThreshold}
                onChange={(e) => setEvalThreshold(Number(e.target.value))}
                className="w-full accent-[#7CFF6B] cursor-pointer"
              />
            </div>

            {/* Multi-Metric Live Scorecard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D]">
                <span className="text-[10px] text-[#8B8F98] block">PRECISION:</span>
                <span className="text-sm font-bold text-[#7CFF6B]">{(evalStats.precision * 100).toFixed(1)}%</span>
              </div>
              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D]">
                <span className="text-[10px] text-[#8B8F98] block">RECALL (SENSITIVITY):</span>
                <span className="text-sm font-bold text-[#6EA8FE]">{(evalStats.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D]">
                <span className="text-[10px] text-[#8B8F98] block">SPECIFICITY:</span>
                <span className="text-sm font-bold text-[#FFB86B]">{(evalStats.specificity * 100).toFixed(1)}%</span>
              </div>
              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D]">
                <span className="text-[10px] text-[#8B8F98] block">F1 SCORE:</span>
                <span className="text-sm font-bold text-[#F2F2F2]">{(evalStats.f1 * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D] text-[11px] text-[#8B8F98] leading-relaxed">
              <strong>Trade-off Insight:</strong> Increasing threshold to 0.70+ maximizes Precision (eliminates false alarms), but drops Recall below 60%. Lowering threshold to 0.30 catches 95%+ of positive events at the expense of false alarms.
            </div>
          </div>
        )}

        {/* ====================================================================
            PROJECT 09: TITANIC SURVIVAL CLASSIFICATION
        ==================================================================== */}
        {projectId === 'titanic' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <span className="text-[#8B8F98] text-[10px] block">PASSENGER CLASS:</span>
                <div className="grid grid-cols-3 gap-1">
                  {([1, 2, 3] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setPassengerClass(cls)}
                      className={`py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                        passengerClass === cls
                          ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B]'
                          : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <span className="text-[#8B8F98] text-[10px] block">BIOLOGICAL SEX:</span>
                <div className="grid grid-cols-2 gap-1">
                  {(['female', 'male'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPassengerSex(s)}
                      className={`py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                        passengerSex === s
                          ? 'bg-[#6EA8FE]/15 border-[#6EA8FE] text-[#6EA8FE]'
                          : 'bg-[#08090B] border-[#24272D] text-[#8B8F98]'
                      }`}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <div className="flex justify-between text-[#8B8F98]">
                  <span className="text-[10px]">AGE:</span>
                  <span className="text-[#7CFF6B] font-bold">{passengerAge}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="80"
                  value={passengerAge}
                  onChange={(e) => setPassengerAge(Number(e.target.value))}
                  className="w-full accent-[#7CFF6B] cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded bg-[#101216] border border-[#24272D] space-y-1">
                <div className="flex justify-between text-[#8B8F98]">
                  <span className="text-[10px]">FAMILY ABOARD:</span>
                  <span className="text-[#FFB86B] font-bold">{passengerFamily}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={passengerFamily}
                  onChange={(e) => setPassengerFamily(Number(e.target.value))}
                  className="w-full accent-[#FFB86B] cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Survival Probability Output */}
            <div className={`p-4 rounded-xl border transition-all ${
              titanicStats.prob >= 0.5
                ? 'bg-[#7CFF6B]/10 border-[#7CFF6B]/40 text-[#7CFF6B]'
                : 'bg-[#FF7B72]/10 border-[#FF7B72]/40 text-[#FF7B72]'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold block">
                    PREDICTED SURVIVAL: {titanicStats.prob >= 0.5 ? 'SURVIVED' : 'PERISHED'}
                  </span>
                  <p className="text-xs text-[#E6EDF3] mt-1 font-sans">
                    Log-odds equation: z = {titanicStats.logOdds.toFixed(2)}. Historical &ldquo;women and children first&rdquo; protocol accounts for dominant weight magnitude.
                  </p>
                </div>
                <div className="text-right sm:border-l sm:border-[#24272D] sm:pl-4 shrink-0">
                  <span className="text-[10px] text-[#8B8F98] block">PROBABILITY</span>
                  <span className="text-2xl font-bold">{(titanicStats.prob * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
