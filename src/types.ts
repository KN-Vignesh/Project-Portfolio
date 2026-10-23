export interface ProjectCodeFile {
  filename: string;
  language: string;
  description: string;
  sourceUrl?: string;
  code: string;
  explanation: {
    overview: string;
    keyLines: Array<{ lineNumbers: string; description: string }>;
    inputOutput: string;
    architecturalNotes: string;
  };
}

export interface ProjectArchitectureNode {
  id: string;
  name: string;
  type: string;
  description: string;
  sourceFile: string;
}

export interface ProjectFailureAnalysis {
  challenge: string;
  whatFailed: string;
  rootCause: string;
  resolution: string;
  verification: string;
  remainingLimitations: string;
}

export interface ProjectBeforeAfterLab {
  baselineMetric: string;
  solutionMetric: string;
  inputCondition: string;
  baselineOutcome: string;
  solutionOutcome: string;
  whatChanged: string;
  limitation: string;
}

export interface ProjectEngineeringStory {
  problem: string;
  baseline: string;
  constraints: string[];
  investigation: string;
  solution: string;
  architecture: string;
  personalContribution: string;
  decisionRationale: string[];
  experiment: string;
  validation: string;
  results: string[];
  limitations: string[];
  futureWork: string[];
  howItWorks?: string;
  keyTakeaway?: string;
  failureAnalysis?: ProjectFailureAnalysis;
  beforeAfterLab?: ProjectBeforeAfterLab;
  architectureNodes?: ProjectArchitectureNode[];
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  technologies: string[];
  role: string;
  severityTier?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'FOUNDATIONAL';
  severityLevel?: 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4' | 'SEV-5' | 'SEV-6';
  severityLabel?: string;
  severityImpact?: string;
  systemFlow?: string[];
  dataset?: string;
  models?: string[];
  evaluationMetrics?: string[];
  repository: string;
  projectPath?: string;
  notebookUrl?: string;
  documentationUrl?: string;
  liveAppView?: string;
  status?: string;
  sections?: {
    problem: string;
    whyApproach: string;
    dataInput: string;
    architecture: string;
    implementation: string;
    evaluation: string;
    engineeringDecisions: string[];
    limitations: string[];
    futureImprovements: string[];
  };
  story?: ProjectEngineeringStory;
  codeFiles?: ProjectCodeFile[];
  standaloneRepoInfo?: {
    repoName: string;
    cloneCommand: string;
    ciStatus: 'passing' | 'configured';
    deploymentType: string;
    entryPoint: string;
  };
  experiment?: ExperimentConfig;
  relatedProjectIds?: string[];
}

export interface ExperimentConfig {
  type: 'regression-surface' | 'cnn-explorer' | 'qlora-quantizer' | 'standard';
  componentType?: string;
  dataUrl?: string;
  fallbackFixtureUrl?: string;
  schemaVersion?: string;
}

export interface HousePriceFeatureMeta {
  id: 'GrLivArea' | 'OverallQual' | 'GarageArea' | 'YearBuilt' | 'LotArea' | string;
  label: string;
  description: string;
  unit?: string;
  type: 'continuous' | 'discrete' | 'ordinal';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  median?: number;
  mean?: number;
  q05?: number;
  q95?: number;
  isSurfaceAxis?: boolean;
  axisRole?: 'x' | 'y';
  allowedValues?: number[];
}

export interface HousePriceSurfaceSlice {
  id: string;
  label: string;
  fixedFeatures: Record<string, number>;
  /** 2D matrix [zIndex][xIndex] of precomputed model predictions */
  predictions: number[][];
  predictionsLog1p?: number[][];
}

export interface HousePriceShapContribution {
  feature: string;
  label: string;
  featureValue: number | string | null;
  unit?: string;
  shapValue: number;
  shapLog1p?: number;
}

export interface HousePriceReferencePreset {
  id: string;
  houseId?: number;
  name: string;
  summary: string;
  cvFold?: number;
  evaluationSplit?: string;
  features: Record<string, number>;
  rawFeatures?: Record<string, number | string | null>;
  engineeredFeatures?: Record<string, number | boolean>;
  predictedPrice: number;
  oofPredictedPrice?: number;
  actualPrice?: number;
  residual?: number;
  oofErrorUsd?: number;
  relativeErrorPct?: number;
  surfaceCoordinates?: {
    xGrLivArea: number;
    yOverallQual: number;
    zActualUsd: number;
    zPredictedUsd: number;
    zOofPredictedUsd: number;
  };
  shap?: {
    baseValue: number;
    baseValueLog1p?: number;
    outputValue: number;
    outputValueLog1p?: number;
    explainerType?: string;
    targetTransform?: string;
    backgroundSampleCount?: number;
    additivityVerified?: boolean;
    additivityDiscrepancyLog1p?: number;
    contributions: HousePriceShapContribution[];
    allContributions?: HousePriceShapContribution[];
  };
}

export interface HousePriceEvaluationPoint {
  id: string;
  houseId?: number;
  fold?: number;
  actual: number;
  predicted: number;
  actualLog1p?: number;
  predictedLog1p?: number;
  residualLog1p?: number;
  errorUsd?: number;
  label?: string;
  grLivArea?: number;
  overallQual?: number;
}

export interface HousePriceBaseEstimator {
  id: string;
  name: string;
  estimatorClass: string;
  hyperparameters?: Record<string, unknown>;
  metaWeight: number;
}

export interface HousePriceCvBenchmark {
  model: string;
  meanRmsle: number;
  stdRmsle: number;
  foldRmsle: number[];
  isFinalEnsemble: boolean;
}

export interface HousePriceEngineeredFeatureSpec {
  name: string;
  formula: string;
  unit: string;
  sourceColumns: string[];
}

export interface HousePrice3DDataContract {
  schemaVersion: '1.0.0';
  isSyntheticDevFixture?: boolean;
  fixtureNotice?: string;
  sourceRevision?: string;
  modelMetadata: {
    modelName: string;
    version?: string;
    algorithm: string;
    datasetName: string;
    targetName: string;
    targetUnit?: string;
    targetCurrency?: string;
    targetSymbol?: string;
    targetTransform?: string;
    inverseTransform?: string;
    evaluationSplit: string;
    cvFolds?: number;
    randomSeed?: number;
    trainingCount: number;
    rawTrainRows?: number;
    removedOutlierCount?: number;
    removedOutlierIds?: number[];
    outlierFilterRule?: string;
    rawFeatureCount?: number;
    engineeredFeatureCount?: number;
    preprocessedFeatureCount?: number;
    evaluationCount: number;
    generatedAt: string;
    artifactPath?: string;
    baseEstimators?: HousePriceBaseEstimator[];
    metaEstimator?: {
      name: string;
      estimatorClass: string;
      alpha: number;
      interceptLog1p: number;
    };
    cvBenchmarks?: HousePriceCvBenchmark[];
    engineeredFeatureSpecs?: HousePriceEngineeredFeatureSpec[];
  };
  features: HousePriceFeatureMeta[];
  surface: {
    xAxisFeature: string;
    zAxisFeature: string;
    xValues: number[];
    zValues: number[];
    minPrediction: number;
    maxPrediction: number;
    baselineFeatures?: Record<string, number | string | null>;
    baselinePredictionUsd?: number;
    baselinePredictionLog1p?: number;
    matrixIndexingConvention?: string;
    threeJsGeometryMapping?: string;
    slices: HousePriceSurfaceSlice[];
  };
  referenceHouses: HousePriceReferencePreset[];
  evaluation: {
    methodology?: string;
    metrics: {
      mae: number;
      rmse: number;
      rmseLog?: number;
      cvMeanRmsle?: number;
      cvStdRmsle?: number;
      medianAeUsd?: number;
      mapePct?: number;
      r2: number;
      r2Log1p?: number;
    };
    metricDefinitions?: Record<string, string>;
    actualVsPredicted: HousePriceEvaluationPoint[];
  };
}

export type SurfaceEstimateMode =
  | 'reference-exact'
  | 'grid-node-exact'
  | 'bilinear-interpolated';

export interface SurfaceEstimateResult {
  predictedPrice: number;
  surfaceConditionalPrice: number;
  baselinePrice: number;
  featureImpacts: Record<string, number>;
  estimateMode: SurfaceEstimateMode;
  activeSlice: HousePriceSurfaceSlice;
  xValue: number;
  zValue: number;
  referenceHouse?: HousePriceReferencePreset;
  nearestReferenceHouse?: HousePriceReferencePreset;
  nonAxisBaselineDiffs?: Array<{
    feature: string;
    label: string;
    userValue: number;
    baselineValue: number;
    unit?: string;
    priceDeltaUsd?: number;
  }>;
  interpolationDetails?: {
    x0: number;
    x1: number;
    z0: number;
    z1: number;
    tx: number;
    tz: number;
    q00: number;
    q10: number;
    q01: number;
    q11: number;
  };
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  type: string;
  narrative: string;
  highlights: string[];
  technologies: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  period: string;
  code: string;
}

export interface AILabNode {
  id: string;
  label: string;
  type: 'FOUNDATION' | 'MODEL_ENGINEERING' | 'GENERATIVE_AI' | 'SYSTEMS_APPLICATION';
  description: string;
  connections: string[];
  relatedProjectIds: string[];
  coordinates: [number, number, number]; // 3D coordinates for Three.js
}

export interface StackCategory {
  title: string;
  iconName: string;
  skills: string[];
  summary: string;
}
