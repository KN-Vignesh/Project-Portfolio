import {
  HousePrice3DDataContract,
  HousePriceBaseEstimator,
  HousePriceCvBenchmark,
  HousePriceEngineeredFeatureSpec,
  HousePriceEvaluationPoint,
  HousePriceFeatureMeta,
  HousePriceReferencePreset,
  HousePriceShapContribution,
  HousePriceSurfaceSlice,
  SurfaceEstimateResult,
} from '../types';

export const DEFAULT_HOUSE_PRICE_3D_URL =
  'https://raw.githubusercontent.com/KN-Vignesh/Projects/main/portfolio/assets/house_price_3d.json';

export const SECONDARY_HOUSE_PRICE_3D_URL =
  'https://raw.githubusercontent.com/KN-Vignesh/Projects/main/Data-recipe/House_Price_Prediction/assets/house_price_3d.json';

export const DEFAULT_HOUSE_PRICE_FIXTURE_URL = '/data/house_price_3d.fixture.json';

export const SUPPORTED_HOUSE_PRICE_SCHEMA_VERSION = '1.0.0';

export type HousePriceErrorCode =
  | 'NETWORK_ERROR'
  | 'MALFORMED_JSON'
  | 'UNSUPPORTED_VERSION'
  | 'INVALID_SCHEMA';

export class HousePriceDataError extends Error {
  public readonly code: HousePriceErrorCode;
  public readonly status?: number;

  constructor(code: HousePriceErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'HousePriceDataError';
    this.code = code;
    this.status = status;
  }
}

export interface LoadedHousePrice3DAsset {
  data: HousePrice3DDataContract;
  sourceMode: 'remote-verified' | 'labeled-dev-fixture';
  resolvedUrl: string;
  remoteFallbackReason?: string;
}

const payloadCache = new Map<string, LoadedHousePrice3DAsset>();

export function clearHousePriceDataCache(): void {
  payloadCache.clear();
}

function isFiniteNumber(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val);
}

function isMonotonicallyIncreasing(arr: unknown): arr is number[] {
  if (!Array.isArray(arr) || arr.length < 2) return false;
  for (let i = 0; i < arr.length; i++) {
    if (!isFiniteNumber(arr[i])) return false;
    if (i > 0 && arr[i] <= arr[i - 1]) return false;
  }
  return true;
}

function isFeatureMeta(val: unknown): val is HousePriceFeatureMeta {
  if (!val || typeof val !== 'object') return false;
  const f = val as Record<string, unknown>;
  return (
    typeof f.id === 'string' &&
    f.id.length > 0 &&
    typeof f.label === 'string' &&
    typeof f.description === 'string' &&
    (f.type === 'continuous' || f.type === 'discrete' || f.type === 'ordinal') &&
    isFiniteNumber(f.min) &&
    isFiniteNumber(f.max) &&
    f.max >= f.min &&
    isFiniteNumber(f.step) &&
    f.step > 0 &&
    isFiniteNumber(f.defaultValue)
  );
}

const INTERACTIVE_FEATURE_CATALOG: Record<
  string,
  {
    label: string;
    description: string;
    step: number;
    displayUnit: string;
  }
> = {
  GrLivArea: {
    label: 'Above-Grade Living Area (GrLivArea)',
    description:
      'Primary continuous spatial feature in the Ames dataset (Pearson r = 0.72 with log1p(SalePrice) after outlier sanitization).',
    step: 10,
    displayUnit: 'sq ft',
  },
  OverallQual: {
    label: 'Overall Material & Finish Quality (OverallQual)',
    description:
      'Strongest single predictor of log1p(SalePrice) (Pearson r = 0.82), rating overall material and finish quality from 1 (Very Poor) to 10 (Very Excellent).',
    step: 1,
    displayUnit: '/ 10',
  },
  GarageArea: {
    label: 'Garage Footprint Area (GarageArea)',
    description:
      'Total garage floor area in square feet; held at training median (480 sq ft) on the 2D partial-dependence surface.',
    step: 10,
    displayUnit: 'sq ft',
  },
  YearBuilt: {
    label: 'Original Construction Year (YearBuilt)',
    description:
      'Original construction year (drives engineered HouseAge = YrSold - YearBuilt); held at training median (1972) on the 2D surface.',
    step: 1,
    displayUnit: 'yr',
  },
  LotArea: {
    label: 'Parcel Lot Size (LotArea)',
    description:
      'Total property lot size in square feet; held at training median (9,475 sq ft) on the 2D surface.',
    step: 100,
    displayUnit: 'sq ft',
  },
};

const TARGET_INTERACTIVE_FEATURES = [
  'GrLivArea',
  'OverallQual',
  'GarageArea',
  'YearBuilt',
  'LotArea',
] as const;

function normalizeUnitLabel(rawUnit: unknown): string | undefined {
  if (typeof rawUnit !== 'string' || !rawUnit) return undefined;
  if (rawUnit === 'sq_ft') return 'sq ft';
  if (rawUnit === 'rating_1_to_10') return '/ 10';
  if (rawUnit === 'year') return 'yr';
  return rawUnit;
}

/**
 * Normalizes and validates the Python exporter schema (`Data-recipe/House_Price_Prediction/schema/house_price_3d.schema.json`)
 * into the unified HousePrice3DDataContract used by the 3D surface, controls, and SHAP panels.
 */
function normalizeExporterSchemaPayload(obj: Record<string, unknown>): HousePrice3DDataContract {
  const model = obj.model as Record<string, unknown> | undefined;
  const dataset = obj.dataset as Record<string, unknown> | undefined;
  const featuresBlock = obj.features as Record<string, unknown> | undefined;
  const surface = obj.surface as Record<string, unknown> | undefined;
  const examples = obj.examples as unknown[] | undefined;
  const evaluation = obj.evaluation as Record<string, unknown> | undefined;

  if (!model || typeof model !== 'object' || typeof model.name !== 'string') {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Missing or invalid "model" block in exporter house_price_3d.json.'
    );
  }

  if (!dataset || typeof dataset !== 'object' || typeof dataset.name !== 'string') {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Missing or invalid "dataset" block in exporter house_price_3d.json.'
    );
  }

  if (
    !featuresBlock ||
    typeof featuresBlock !== 'object' ||
    !Array.isArray(featuresBlock.surfaceAxes) ||
    !Array.isArray(featuresBlock.inputFeatures)
  ) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Missing or invalid "features.surfaceAxes" or "features.inputFeatures" in exporter house_price_3d.json.'
    );
  }

  if (!surface || typeof surface !== 'object') {
    throw new HousePriceDataError('INVALID_SCHEMA', 'Missing "surface" block in exporter payload.');
  }

  const xAxis = surface.xAxis as Record<string, unknown> | undefined;
  const yAxis = surface.yAxis as Record<string, unknown> | undefined;
  const zMatrixUsd = surface.zMatrixUsd as unknown[] | undefined;
  const zMatrixLog1p = surface.zMatrixLog1p as number[][] | undefined;

  if (
    !xAxis ||
    !yAxis ||
    typeof xAxis.feature !== 'string' ||
    typeof yAxis.feature !== 'string' ||
    !isMonotonicallyIncreasing(xAxis.values) ||
    !isMonotonicallyIncreasing(yAxis.values) ||
    !isFiniteNumber(surface.zMinUsd) ||
    !isFiniteNumber(surface.zMaxUsd) ||
    !Array.isArray(zMatrixUsd)
  ) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Invalid "surface.xAxis", "surface.yAxis", or "surface.zMatrixUsd" in exporter payload.'
    );
  }

  const xLen = xAxis.values.length;
  const zLen = yAxis.values.length;

  if (zMatrixUsd.length !== zLen) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      `Surface zMatrixUsd row count (${zMatrixUsd.length}) does not match yAxis length (${zLen}).`
    );
  }

  for (const row of zMatrixUsd) {
    if (!Array.isArray(row) || row.length !== xLen || !row.every(isFiniteNumber)) {
      throw new HousePriceDataError(
        'INVALID_SCHEMA',
        `Surface zMatrixUsd row length does not match xAxis length (${xLen}) or contains non-finite values.`
      );
    }
  }

  // Extract the 5 interactive features from surfaceAxes + inputFeatures
  const surfaceAxisMap = new Map<string, Record<string, unknown>>();
  for (const ax of featuresBlock.surfaceAxes as Array<Record<string, unknown>>) {
    if (ax && typeof ax.name === 'string') {
      surfaceAxisMap.set(ax.name, ax);
    }
  }

  const inputFeatureMap = new Map<string, Record<string, unknown>>();
  for (const inf of featuresBlock.inputFeatures as Array<Record<string, unknown>>) {
    if (inf && typeof inf.name === 'string') {
      inputFeatureMap.set(inf.name, inf);
    }
  }

  const baselineFeatures = (surface.baselineFeatures as Record<string, number | string | null>) || {};

  const parsedFeatures: HousePriceFeatureMeta[] = [];
  for (const featName of TARGET_INTERACTIVE_FEATURES) {
    const rawFeat = inputFeatureMap.get(featName);
    const axisFeat = surfaceAxisMap.get(featName);
    if (!rawFeat && !axisFeat) continue;

    const minVal = isFiniteNumber(axisFeat?.min)
      ? (axisFeat!.min as number)
      : isFiniteNumber(rawFeat?.min)
      ? (rawFeat!.min as number)
      : 0;
    const rawMaxVal = isFiniteNumber(axisFeat?.max)
      ? (axisFeat!.max as number)
      : isFiniteNumber(rawFeat?.max)
      ? (rawFeat!.max as number)
      : 100;
    const maxVal = featName === 'LotArea' ? Math.min(rawMaxVal, 25000) : rawMaxVal;
    const defaultVal = isFiniteNumber(baselineFeatures[featName])
      ? (baselineFeatures[featName] as number)
      : isFiniteNumber(rawFeat?.baselineValue)
      ? (rawFeat!.baselineValue as number)
      : isFiniteNumber(axisFeat?.median)
      ? (axisFeat!.median as number)
      : minVal;

    const catalogInfo = INTERACTIVE_FEATURE_CATALOG[featName];
    const kind = (axisFeat?.kind || rawFeat?.kind) as string | undefined;

    parsedFeatures.push({
      id: featName,
      label: catalogInfo?.label || (typeof axisFeat?.label === 'string' ? axisFeat.label : featName),
      description:
        (typeof axisFeat?.selectionRationale === 'string' && axisFeat.selectionRationale) ||
        catalogInfo?.description ||
        `Model input feature ${featName}`,
      unit: catalogInfo?.displayUnit || normalizeUnitLabel(axisFeat?.unit ?? rawFeat?.unit),
      type: kind === 'ordinal' ? 'ordinal' : 'continuous',
      min: minVal,
      max: maxVal,
      step: catalogInfo?.step ?? 1,
      defaultValue: Math.round(defaultVal),
      median: isFiniteNumber(axisFeat?.median)
        ? (axisFeat!.median as number)
        : isFiniteNumber(rawFeat?.median)
        ? (rawFeat!.median as number)
        : undefined,
      mean: isFiniteNumber(axisFeat?.mean) ? (axisFeat!.mean as number) : undefined,
      q05: isFiniteNumber(axisFeat?.q05) ? (axisFeat!.q05 as number) : undefined,
      q95: isFiniteNumber(axisFeat?.q95) ? (axisFeat!.q95 as number) : undefined,
      isSurfaceAxis: Boolean(axisFeat),
      axisRole: axisFeat?.axis === 'x' ? 'x' : axisFeat?.axis === 'y' ? 'y' : undefined,
      allowedValues: Array.isArray(yAxis.validDiscreteRatings) && featName === yAxis.feature
        ? (yAxis.validDiscreteRatings as number[])
        : undefined,
    });
  }

  // Construct conditioning slice from surface.zMatrixUsd + baselineFeatures
  const fixedFeatures: Record<string, number> = {};
  for (const f of parsedFeatures) {
    if (f.id !== xAxis.feature && f.id !== yAxis.feature) {
      fixedFeatures[f.id] = f.defaultValue;
    }
  }

  const slices: HousePriceSurfaceSlice[] = [
    {
      id: 'baseline-conditioning-slice',
      label: 'Training Median/Mode Baseline (77 Non-Axis Features Fixed)',
      fixedFeatures,
      predictions: zMatrixUsd as number[][],
      predictionsLog1p: Array.isArray(zMatrixLog1p) ? zMatrixLog1p : undefined,
    },
  ];

  // Parse examples -> referenceHouses
  if (!Array.isArray(examples) || examples.length === 0) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Field "examples" must contain at least one held-out reference house.'
    );
  }

  const referenceHouses: HousePriceReferencePreset[] = examples.map((exRaw) => {
    if (!exRaw || typeof exRaw !== 'object') {
      throw new HousePriceDataError('INVALID_SCHEMA', 'Invalid entry in "examples" array.');
    }
    const ex = exRaw as Record<string, unknown>;
    const rawFeats = (ex.features as Record<string, number | string | null>) || {};
    const engFeats = (ex.engineeredFeatures as Record<string, number | boolean>) || undefined;
    const explain = (ex.explainability as Record<string, unknown>) || undefined;
    const surfCoords = (ex.surfaceCoordinates as Record<string, number>) || undefined;

    if (
      typeof ex.id !== 'string' ||
      typeof ex.label !== 'string' ||
      !isFiniteNumber(ex.predictedPriceUsd)
    ) {
      throw new HousePriceDataError(
        'INVALID_SCHEMA',
        `Example "${String(ex.id)}" is missing required id, label, or predictedPriceUsd.`
      );
    }

    const numericFeatures: Record<string, number> = {};
    for (const f of parsedFeatures) {
      const v = rawFeats[f.id];
      numericFeatures[f.id] = isFiniteNumber(v) ? v : f.defaultValue;
    }

    const mapShapItem = (cRaw: unknown): HousePriceShapContribution => {
      const c = cRaw as Record<string, unknown>;
      const featName = String(c.feature || '');
      const featUnit = inputFeatureMap.get(featName)?.unit;
      return {
        feature: featName,
        label: INTERACTIVE_FEATURE_CATALOG[featName]?.label || featName,
        featureValue:
          typeof c.value === 'number' || typeof c.value === 'string' ? c.value : null,
        unit: normalizeUnitLabel(featUnit),
        shapValue: isFiniteNumber(c.contributionUsd) ? (c.contributionUsd as number) : 0,
        shapLog1p: isFiniteNumber(c.shapLog1p) ? (c.shapLog1p as number) : undefined,
      };
    };

    const topContributions = Array.isArray(explain?.topContributions)
      ? explain!.topContributions.map(mapShapItem)
      : [];
    const allContributions = Array.isArray(explain?.contributions)
      ? explain!.contributions.map(mapShapItem)
      : undefined;

    const actualPrice = isFiniteNumber(ex.actualPriceUsd) ? (ex.actualPriceUsd as number) : undefined;
    const predictedPrice = ex.predictedPriceUsd as number;

    return {
      id: ex.id,
      houseId: isFiniteNumber(ex.houseId) ? (ex.houseId as number) : undefined,
      name: ex.label,
      summary:
        typeof ex.selectionReason === 'string'
          ? ex.selectionReason
          : `Ames Property #${String(ex.houseId ?? ex.id)}`,
      cvFold: isFiniteNumber(ex.cvFold) ? (ex.cvFold as number) : undefined,
      evaluationSplit: typeof ex.evaluationSplit === 'string' ? ex.evaluationSplit : undefined,
      features: numericFeatures,
      rawFeatures: rawFeats,
      engineeredFeatures: engFeats,
      predictedPrice,
      oofPredictedPrice: isFiniteNumber(ex.oofPredictedPriceUsd)
        ? (ex.oofPredictedPriceUsd as number)
        : undefined,
      actualPrice,
      residual: actualPrice !== undefined ? Math.round((actualPrice - predictedPrice) * 100) / 100 : undefined,
      oofErrorUsd: isFiniteNumber(ex.oofAbsoluteErrorUsd)
        ? (ex.oofAbsoluteErrorUsd as number)
        : undefined,
      relativeErrorPct: isFiniteNumber(ex.relativeErrorPct)
        ? (ex.relativeErrorPct as number)
        : undefined,
      surfaceCoordinates:
        surfCoords &&
        isFiniteNumber(surfCoords.xGrLivArea) &&
        isFiniteNumber(surfCoords.yOverallQual)
          ? {
              xGrLivArea: surfCoords.xGrLivArea,
              yOverallQual: surfCoords.yOverallQual,
              zActualUsd: surfCoords.zActualUsd,
              zPredictedUsd: surfCoords.zPredictedUsd,
              zOofPredictedUsd: surfCoords.zOofPredictedUsd,
            }
          : undefined,
      shap: explain
        ? {
            baseValue: isFiniteNumber(explain.baseValueUsd) ? (explain.baseValueUsd as number) : 0,
            baseValueLog1p: isFiniteNumber(explain.baseValueLog1p)
              ? (explain.baseValueLog1p as number)
              : undefined,
            outputValue: isFiniteNumber(explain.predictedUsd)
              ? (explain.predictedUsd as number)
              : predictedPrice,
            outputValueLog1p: isFiniteNumber(explain.predictedLog1p)
              ? (explain.predictedLog1p as number)
              : undefined,
            explainerType:
              typeof explain.explainerType === 'string' ? explain.explainerType : undefined,
            targetTransform:
              typeof explain.targetScale === 'string' ? explain.targetScale : 'log1p_usd',
            backgroundSampleCount: isFiniteNumber(explain.backgroundSampleCount)
              ? (explain.backgroundSampleCount as number)
              : undefined,
            additivityVerified:
              typeof explain.additivityVerified === 'boolean'
                ? explain.additivityVerified
                : undefined,
            additivityDiscrepancyLog1p: isFiniteNumber(explain.additivityDiscrepancyLog1p)
              ? (explain.additivityDiscrepancyLog1p as number)
              : undefined,
            contributions: topContributions,
            allContributions,
          }
        : undefined,
    };
  });

  // Parse evaluation
  const metrics = evaluation?.metrics as Record<string, unknown> | undefined;
  if (
    !evaluation ||
    !metrics ||
    !isFiniteNumber(metrics.maeUsd) ||
    !isFiniteNumber(metrics.rmseUsd) ||
    !isFiniteNumber(metrics.r2Usd) ||
    !Array.isArray(evaluation.actualVsPredicted)
  ) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Invalid or missing "evaluation.metrics" (maeUsd, rmseUsd, r2Usd) or "actualVsPredicted" in exporter payload.'
    );
  }

  const actualVsPredicted: HousePriceEvaluationPoint[] = (
    evaluation.actualVsPredicted as Array<Record<string, unknown>>
  ).map((pt, idx) => ({
    id: isFiniteNumber(pt.houseId) ? `House #${pt.houseId}` : `Obs-${idx + 1}`,
    houseId: isFiniteNumber(pt.houseId) ? (pt.houseId as number) : undefined,
    fold: isFiniteNumber(pt.fold) ? (pt.fold as number) : undefined,
    actual: Number(pt.actualUsd),
    predicted: Number(pt.predictedOofUsd),
    actualLog1p: isFiniteNumber(pt.actualLog1p) ? (pt.actualLog1p as number) : undefined,
    predictedLog1p: isFiniteNumber(pt.predictedOofLog1p)
      ? (pt.predictedOofLog1p as number)
      : undefined,
    residualLog1p: isFiniteNumber(pt.residualLog1p) ? (pt.residualLog1p as number) : undefined,
    errorUsd: isFiniteNumber(pt.errorUsd) ? (pt.errorUsd as number) : undefined,
    label: isFiniteNumber(pt.houseId)
      ? `House #${pt.houseId} (Fold ${(pt.fold as number) ?? 0})`
      : undefined,
    grLivArea: isFiniteNumber(pt.grLivArea) ? (pt.grLivArea as number) : undefined,
    overallQual: isFiniteNumber(pt.overallQual) ? (pt.overallQual as number) : undefined,
  }));

  const targetCurrency =
    typeof model.targetCurrency === 'string'
      ? model.targetCurrency
      : typeof evaluation.targetCurrency === 'string'
      ? evaluation.targetCurrency
      : undefined;
  const targetUnit =
    typeof model.targetUnit === 'string'
      ? model.targetUnit
      : typeof evaluation.targetUnit === 'string'
      ? evaluation.targetUnit
      : undefined;

  return {
    schemaVersion: '1.0.0',
    isSyntheticDevFixture: Boolean(obj.isSyntheticDevFixture),
    fixtureNotice: typeof obj.fixtureNotice === 'string' ? obj.fixtureNotice : undefined,
    sourceRevision: typeof obj.sourceRevision === 'string' ? obj.sourceRevision : undefined,
    modelMetadata: {
      modelName: String(model.name),
      version: typeof model.version === 'string' ? model.version : undefined,
      algorithm:
        typeof model.architecture === 'string'
          ? model.architecture
          : 'Multi-Model Stacking Regressor',
      datasetName: String(dataset.name),
      targetName: typeof model.targetVariable === 'string' ? model.targetVariable : 'SalePrice',
      targetUnit,
      targetCurrency,
      targetSymbol: targetCurrency === 'USD' ? '$' : undefined,
      targetTransform:
        typeof model.targetTransformation === 'string' ? model.targetTransformation : undefined,
      inverseTransform:
        typeof model.inverseTransformation === 'string' ? model.inverseTransformation : undefined,
      evaluationSplit:
        typeof evaluation.splitType === 'string'
          ? `${evaluation.cvFolds ?? 5}-Fold Out-of-Fold Cross-Validation (Seed ${evaluation.randomSeed ?? 42})`
          : '5-Fold Out-of-Fold Cross-Validation',
      cvFolds: isFiniteNumber(model.cvFolds) ? (model.cvFolds as number) : 5,
      randomSeed: isFiniteNumber(model.randomSeed) ? (model.randomSeed as number) : 42,
      trainingCount: isFiniteNumber(dataset.cleanedTrainRows)
        ? (dataset.cleanedTrainRows as number)
        : 1458,
      rawTrainRows: isFiniteNumber(dataset.rawTrainRows)
        ? (dataset.rawTrainRows as number)
        : undefined,
      removedOutlierCount: isFiniteNumber(dataset.removedOutlierCount)
        ? (dataset.removedOutlierCount as number)
        : undefined,
      removedOutlierIds: Array.isArray(dataset.removedOutlierIds)
        ? (dataset.removedOutlierIds as number[])
        : undefined,
      outlierFilterRule:
        typeof dataset.outlierFilterRule === 'string' ? dataset.outlierFilterRule : undefined,
      rawFeatureCount: isFiniteNumber(dataset.rawFeatureCount)
        ? (dataset.rawFeatureCount as number)
        : undefined,
      engineeredFeatureCount: isFiniteNumber(dataset.engineeredFeatureCount)
        ? (dataset.engineeredFeatureCount as number)
        : undefined,
      preprocessedFeatureCount: isFiniteNumber(dataset.preprocessedFeatureCount)
        ? (dataset.preprocessedFeatureCount as number)
        : undefined,
      evaluationCount: isFiniteNumber(evaluation.sampleCount)
        ? (evaluation.sampleCount as number)
        : actualVsPredicted.length,
      generatedAt: typeof obj.generatedAt === 'string' ? obj.generatedAt : '',
      artifactPath: typeof model.artifactPath === 'string' ? model.artifactPath : undefined,
      baseEstimators: Array.isArray(model.baseEstimators)
        ? (model.baseEstimators as HousePriceBaseEstimator[])
        : undefined,
      metaEstimator:
        model.metaEstimator && typeof model.metaEstimator === 'object'
          ? (model.metaEstimator as HousePrice3DDataContract['modelMetadata']['metaEstimator'])
          : undefined,
      cvBenchmarks: Array.isArray(model.cvBenchmarks)
        ? (model.cvBenchmarks as HousePriceCvBenchmark[])
        : undefined,
      engineeredFeatureSpecs: Array.isArray(featuresBlock.engineeredFeatures)
        ? (featuresBlock.engineeredFeatures as HousePriceEngineeredFeatureSpec[])
        : undefined,
    },
    features: parsedFeatures,
    surface: {
      xAxisFeature: String(xAxis.feature),
      zAxisFeature: String(yAxis.feature),
      xValues: xAxis.values as number[],
      zValues: yAxis.values as number[],
      minPrediction: Number(surface.zMinUsd),
      maxPrediction: Number(surface.zMaxUsd),
      baselineFeatures,
      baselinePredictionUsd: isFiniteNumber(surface.baselinePredictionUsd)
        ? (surface.baselinePredictionUsd as number)
        : undefined,
      baselinePredictionLog1p: isFiniteNumber(surface.baselinePredictionLog1p)
        ? (surface.baselinePredictionLog1p as number)
        : undefined,
      matrixIndexingConvention:
        typeof surface.matrixIndexingConvention === 'string'
          ? surface.matrixIndexingConvention
          : undefined,
      threeJsGeometryMapping:
        typeof surface.threeJsGeometryMapping === 'string'
          ? surface.threeJsGeometryMapping
          : undefined,
      slices,
    },
    referenceHouses,
    evaluation: {
      methodology:
        typeof evaluation.methodology === 'string' ? evaluation.methodology : undefined,
      metrics: {
        mae: Number(metrics.maeUsd),
        rmse: Number(metrics.rmseUsd),
        rmseLog: isFiniteNumber(metrics.rmsle) ? (metrics.rmsle as number) : undefined,
        cvMeanRmsle: isFiniteNumber(metrics.cvMeanRmsle)
          ? (metrics.cvMeanRmsle as number)
          : undefined,
        cvStdRmsle: isFiniteNumber(metrics.cvStdRmsle)
          ? (metrics.cvStdRmsle as number)
          : undefined,
        medianAeUsd: isFiniteNumber(metrics.medianAeUsd)
          ? (metrics.medianAeUsd as number)
          : undefined,
        mapePct: isFiniteNumber(metrics.mapePct) ? (metrics.mapePct as number) : undefined,
        r2: Number(metrics.r2Usd),
        r2Log1p: isFiniteNumber(metrics.r2Log1p) ? (metrics.r2Log1p as number) : undefined,
      },
      metricDefinitions:
        evaluation.metricDefinitions && typeof evaluation.metricDefinitions === 'object'
          ? (evaluation.metricDefinitions as Record<string, string>)
          : undefined,
      actualVsPredicted,
    },
  };
}

/**
 * Validates raw JSON data against the HousePrice3DDataContract v1.0.0 schema.
 * Supports both the authoritative Python exporter schema (`house_price_3d.schema.json`)
 * and pre-normalized contract payloads.
 * Throws HousePriceDataError on unsupported versions or structural violations.
 */
export function validateHousePrice3DPayload(raw: unknown): HousePrice3DDataContract {
  if (!raw || typeof raw !== 'object') {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Payload must be a non-null JSON object.'
    );
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.schemaVersion !== 'string') {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Missing required "schemaVersion" field in house_price_3d.json.'
    );
  }

  if (obj.schemaVersion !== SUPPORTED_HOUSE_PRICE_SCHEMA_VERSION) {
    throw new HousePriceDataError(
      'UNSUPPORTED_VERSION',
      `Unsupported schemaVersion "${obj.schemaVersion}". Expected "${SUPPORTED_HOUSE_PRICE_SCHEMA_VERSION}".`
    );
  }

  // Detect Python exporter schema (`model`, `dataset`, `features.surfaceAxes`, `surface.zMatrixUsd`, `examples`)
  if (obj.model && obj.dataset && obj.examples) {
    return normalizeExporterSchemaPayload(obj);
  }

  // Validate pre-normalized contract schema
  const meta = obj.modelMetadata as Record<string, unknown> | undefined;
  if (
    !meta ||
    typeof meta !== 'object' ||
    typeof meta.modelName !== 'string' ||
    typeof meta.algorithm !== 'string' ||
    typeof meta.datasetName !== 'string' ||
    typeof meta.targetName !== 'string' ||
    typeof meta.evaluationSplit !== 'string' ||
    !isFiniteNumber(meta.trainingCount) ||
    !isFiniteNumber(meta.evaluationCount)
  ) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Invalid or incomplete "modelMetadata" block in house_price_3d.json.'
    );
  }

  if (!Array.isArray(obj.features) || obj.features.length < 2 || !obj.features.every(isFeatureMeta)) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Field "features" must be a non-empty array of valid feature metadata definitions.'
    );
  }

  const surface = obj.surface as Record<string, unknown> | undefined;
  if (!surface || typeof surface !== 'object') {
    throw new HousePriceDataError('INVALID_SCHEMA', 'Missing "surface" configuration block.');
  }

  if (
    typeof surface.xAxisFeature !== 'string' ||
    typeof surface.zAxisFeature !== 'string' ||
    !isMonotonicallyIncreasing(surface.xValues) ||
    !isMonotonicallyIncreasing(surface.zValues) ||
    !isFiniteNumber(surface.minPrediction) ||
    !isFiniteNumber(surface.maxPrediction)
  ) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Surface "xValues" and "zValues" must be monotonically increasing numeric arrays with length >= 2.'
    );
  }

  const xLen = surface.xValues.length;
  const zLen = surface.zValues.length;

  if (!Array.isArray(surface.slices) || surface.slices.length === 0) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Surface must contain at least one precomputed prediction slice.'
    );
  }

  for (const sliceRaw of surface.slices) {
    if (!sliceRaw || typeof sliceRaw !== 'object') {
      throw new HousePriceDataError('INVALID_SCHEMA', 'Malformed surface slice entry.');
    }
    const s = sliceRaw as Record<string, unknown>;
    if (
      typeof s.id !== 'string' ||
      typeof s.label !== 'string' ||
      !s.fixedFeatures ||
      typeof s.fixedFeatures !== 'object' ||
      !Array.isArray(s.predictions) ||
      s.predictions.length !== zLen
    ) {
      throw new HousePriceDataError(
        'INVALID_SCHEMA',
        `Surface slice "${String(s.id)}" dimensions do not match zValues length (${zLen}).`
      );
    }

    for (const row of s.predictions) {
      if (!Array.isArray(row) || row.length !== xLen || !row.every(isFiniteNumber)) {
        throw new HousePriceDataError(
          'INVALID_SCHEMA',
          `Surface slice "${s.id}" contains invalid row length or non-finite prediction values (expected ${xLen} columns).`
        );
      }
    }
  }

  if (!Array.isArray(obj.referenceHouses) || obj.referenceHouses.length === 0) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Field "referenceHouses" must contain at least one reference property record.'
    );
  }

  for (const refRaw of obj.referenceHouses) {
    if (!refRaw || typeof refRaw !== 'object') {
      throw new HousePriceDataError('INVALID_SCHEMA', 'Invalid reference house entry.');
    }
    const r = refRaw as Record<string, unknown>;
    if (
      typeof r.id !== 'string' ||
      typeof r.name !== 'string' ||
      !r.features ||
      typeof r.features !== 'object' ||
      !isFiniteNumber(r.predictedPrice)
    ) {
      throw new HousePriceDataError(
        'INVALID_SCHEMA',
        `Reference house "${String(r.id)}" is missing required features or predictedPrice.`
      );
    }
  }

  const evaluation = obj.evaluation as Record<string, unknown> | undefined;
  const metrics = evaluation?.metrics as Record<string, unknown> | undefined;
  if (
    !evaluation ||
    !metrics ||
    !isFiniteNumber(metrics.mae) ||
    !isFiniteNumber(metrics.rmse) ||
    !isFiniteNumber(metrics.r2) ||
    !Array.isArray(evaluation.actualVsPredicted)
  ) {
    throw new HousePriceDataError(
      'INVALID_SCHEMA',
      'Invalid or missing "evaluation.metrics" (mae, rmse, r2) or "actualVsPredicted" array.'
    );
  }

  return obj as unknown as HousePrice3DDataContract;
}

async function fetchAndValidateSingleUrl(
  url: string,
  signal?: AbortSignal,
  forceRefresh?: boolean
): Promise<HousePrice3DDataContract> {
  const fetchUrl = forceRefresh
    ? `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`
    : url;

  let response: Response;
  try {
    response = await fetch(fetchUrl, {
      signal,
      cache: forceRefresh ? 'no-store' : 'default',
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new HousePriceDataError(
      'NETWORK_ERROR',
      `Failed to fetch House Price 3D asset from ${url}: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!response.ok) {
    throw new HousePriceDataError(
      'NETWORK_ERROR',
      `HTTP ${response.status} (${response.statusText || 'Not Found'}) when fetching ${url}`,
      response.status
    );
  }

  let rawJson: unknown;
  try {
    rawJson = await response.json();
  } catch {
    throw new HousePriceDataError(
      'MALFORMED_JSON',
      `Response from ${url} is not valid JSON.`
    );
  }

  return validateHousePrice3DPayload(rawJson);
}

export interface LoadHousePrice3DOptions {
  url?: string;
  fallbackUrl?: string;
  signal?: AbortSignal;
  forceRefresh?: boolean;
  allowFixtureFallback?: boolean;
}

export async function loadHousePrice3DData(
  options: LoadHousePrice3DOptions = {}
): Promise<LoadedHousePrice3DAsset> {
  const configuredUrl =
    options.url ||
    import.meta.env?.VITE_HOUSE_PRICE_3D_DATA_URL ||
    DEFAULT_HOUSE_PRICE_3D_URL;
  const fallbackUrl = options.fallbackUrl ?? DEFAULT_HOUSE_PRICE_FIXTURE_URL;
  const allowFallback = options.allowFixtureFallback ?? true;

  const cacheKey = `${configuredUrl}|${allowFallback ? fallbackUrl : 'no-fallback'}`;
  if (!options.forceRefresh && payloadCache.has(cacheKey)) {
    return payloadCache.get(cacheKey)!;
  }

  try {
    const data = await fetchAndValidateSingleUrl(
      configuredUrl,
      options.signal,
      options.forceRefresh
    );
    const result: LoadedHousePrice3DAsset = {
      data,
      sourceMode: data.isSyntheticDevFixture ? 'labeled-dev-fixture' : 'remote-verified',
      resolvedUrl: configuredUrl,
    };
    payloadCache.set(cacheKey, result);
    return result;
  } catch (primaryError) {
    if (primaryError instanceof DOMException && primaryError.name === 'AbortError') {
      throw primaryError;
    }

    const isNetworkOr404 =
      primaryError instanceof HousePriceDataError &&
      primaryError.code === 'NETWORK_ERROR';

    // Try secondary GitHub raw URL if primary was default and failed due to network/404
    if (isNetworkOr404 && configuredUrl === DEFAULT_HOUSE_PRICE_3D_URL) {
      try {
        const secondaryData = await fetchAndValidateSingleUrl(
          SECONDARY_HOUSE_PRICE_3D_URL,
          options.signal,
          options.forceRefresh
        );
        const result: LoadedHousePrice3DAsset = {
          data: secondaryData,
          sourceMode: secondaryData.isSyntheticDevFixture
            ? 'labeled-dev-fixture'
            : 'remote-verified',
          resolvedUrl: SECONDARY_HOUSE_PRICE_3D_URL,
        };
        payloadCache.set(cacheKey, result);
        return result;
      } catch {
        // Proceed to local fallback if allowed
      }
    }

    if (!allowFallback || !fallbackUrl || !isNetworkOr404) {
      throw primaryError;
    }

    const fallbackData = await fetchAndValidateSingleUrl(
      fallbackUrl,
      options.signal,
      options.forceRefresh
    );

    const result: LoadedHousePrice3DAsset = {
      data: {
        ...fallbackData,
        isSyntheticDevFixture: true,
      },
      sourceMode: 'labeled-dev-fixture',
      resolvedUrl: fallbackUrl,
      remoteFallbackReason:
        primaryError instanceof Error ? primaryError.message : 'Remote asset unreachable',
    };
    payloadCache.set(cacheKey, result);
    return result;
  }
}

/**
 * Selects the precomputed surface slice whose fixedFeatures are closest (normalized L1 distance)
 * to the user's current secondary feature slider values.
 */
export function findClosestSurfaceSlice(
  data: HousePrice3DDataContract,
  currentFeatures: Record<string, number>
): HousePriceSurfaceSlice {
  const { slices, xAxisFeature, zAxisFeature } = data.surface;
  if (slices.length === 1) return slices[0];

  const featureMetaMap = new Map<string, HousePriceFeatureMeta>(
    data.features.map((f) => [f.id, f])
  );

  let bestSlice = slices[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const slice of slices) {
    let dist = 0;
    for (const [featKey, sliceVal] of Object.entries(slice.fixedFeatures)) {
      if (featKey === xAxisFeature || featKey === zAxisFeature) continue;
      const userVal = currentFeatures[featKey];
      if (typeof userVal !== 'number') continue;
      const meta = featureMetaMap.get(featKey);
      const span = meta && meta.max > meta.min ? meta.max - meta.min : 1;
      dist += Math.abs(userVal - sliceVal) / span;
    }
    if (dist < bestDistance) {
      bestDistance = dist;
      bestSlice = slice;
    }
  }

  return bestSlice;
}

/**
 * Finds the nearest precomputed reference house to the current feature vector.
 */
export function findNearestReferenceHouse(
  data: HousePrice3DDataContract,
  currentFeatures: Record<string, number>
): HousePriceReferencePreset {
  const featureMetaMap = new Map<string, HousePriceFeatureMeta>(
    data.features.map((f) => [f.id, f])
  );

  let bestRef = data.referenceHouses[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const ref of data.referenceHouses) {
    let dist = 0;
    for (const [k, refVal] of Object.entries(ref.features)) {
      const userVal = currentFeatures[k] ?? refVal;
      const meta = featureMetaMap.get(k);
      const span = meta && meta.max > meta.min ? meta.max - meta.min : 1;
      // Weight primary surface axes higher so spatial proximity on the 3D surface is prioritized
      const weight = k === data.surface.xAxisFeature || k === data.surface.zAxisFeature ? 2.0 : 1.0;
      dist += weight * (Math.abs(userVal - refVal) / span);
    }
    if (dist < bestDistance) {
      bestDistance = dist;
      bestRef = ref;
    }
  }

  return bestRef;
}

/**
 * Evaluates the surface prediction at the requested feature coordinates.
 * Strictly distinguishes:
 * - 'reference-exact': Exact match with a reference house preset
 * - 'grid-node-exact': Exact match with a precomputed grid vertex on the active slice
 * - 'bilinear-interpolated': Continuous bilinear interpolation across the 4 bounding grid cells
 */
export function evaluateSurfacePrediction(
  data: HousePrice3DDataContract,
  currentFeatures: Record<string, number>,
  activePresetId?: string | null
): SurfaceEstimateResult {
  const { xAxisFeature, zAxisFeature, xValues, zValues } = data.surface;
  const activeSlice = findClosestSurfaceSlice(data, currentFeatures);
  const nearestReferenceHouse = findNearestReferenceHouse(data, currentFeatures);

  const rawX = currentFeatures[xAxisFeature] ?? xValues[0];
  const rawZ = currentFeatures[zAxisFeature] ?? zValues[0];

  const xMin = xValues[0];
  const xMax = xValues[xValues.length - 1];
  const zMin = zValues[0];
  const zMax = zValues[zValues.length - 1];

  const xValue = Math.max(xMin, Math.min(xMax, rawX));
  const zValue = Math.max(zMin, Math.min(zMax, rawZ));

  // Helper to evaluate bilinear interpolation at any (x, z) on the active slice
  const sampleSliceAt = (targetX: number, targetZ: number) => {
    const cx = Math.max(xMin, Math.min(xMax, targetX));
    const cz = Math.max(zMin, Math.min(zMax, targetZ));

    let i0 = 0;
    for (let i = 0; i < xValues.length - 1; i++) {
      if (cx >= xValues[i] && cx <= xValues[i + 1]) {
        i0 = i;
        break;
      }
    }
    const i1 = Math.min(i0 + 1, xValues.length - 1);

    let j0 = 0;
    for (let j = 0; j < zValues.length - 1; j++) {
      if (cz >= zValues[j] && cz <= zValues[j + 1]) {
        j0 = j;
        break;
      }
    }
    const j1 = Math.min(j0 + 1, zValues.length - 1);

    const bx0 = xValues[i0];
    const bx1 = xValues[i1];
    const bz0 = zValues[j0];
    const bz1 = zValues[j1];

    const ltx = bx1 > bx0 ? (cx - bx0) / (bx1 - bx0) : 0;
    const ltz = bz1 > bz0 ? (cz - bz0) / (bz1 - bz0) : 0;

    const v00 = activeSlice.predictions[j0][i0];
    const v10 = activeSlice.predictions[j0][i1];
    const v01 = activeSlice.predictions[j1][i0];
    const v11 = activeSlice.predictions[j1][i1];

    const interp =
      (1 - ltx) * (1 - ltz) * v00 +
      ltx * (1 - ltz) * v10 +
      (1 - ltx) * ltz * v01 +
      ltx * ltz * v11;

    return {
      price: Math.round(interp),
      x0: bx0,
      x1: bx1,
      z0: bz0,
      z1: bz1,
      tx: ltx,
      tz: ltz,
      q00: v00,
      q10: v10,
      q01: v01,
      q11: v11,
    };
  };

  // 1. Check if current features match an exact reference house
  const matchingRef = data.referenceHouses.find((ref) => {
    if (activePresetId && ref.id !== activePresetId) return false;
    return Object.entries(ref.features).every(
      ([k, val]) => Math.abs((currentFeatures[k] ?? val) - val) < 1e-6
    );
  });

  const mainSample = sampleSliceAt(xValue, zValue);
  const surfaceConditionalPrice = mainSample.price;

  // Baseline reference values (from surface median baseline or feature defaults)
  const xFeatureMeta = data.features.find((f) => f.id === xAxisFeature);
  const zFeatureMeta = data.features.find((f) => f.id === zAxisFeature);
  const baseX = xFeatureMeta?.defaultValue ?? 1462;
  const baseZ = zFeatureMeta?.defaultValue ?? 6;
  const baselineSurfaceSample = sampleSliceAt(baseX, baseZ);
  const baselinePrice =
    data.surface.baselinePredictionUsd ?? baselineSurfaceSample.price;

  // Isolated impact of X (Living Area) and Z (Overall Quality) on the 2D response surface
  const xOnlySample = sampleSliceAt(xValue, baseZ);
  const xImpactUsd = xOnlySample.price - baselineSurfaceSample.price;
  const zImpactUsd = surfaceConditionalPrice - xOnlySample.price;

  // Empirical marginal slopes for secondary conditioning features when single-slice surface is active
  const scaleFactor = Math.max(0.65, Math.min(1.6, surfaceConditionalPrice / Math.max(1, baselinePrice)));
  const MARGINAL_RATES: Record<string, number> = {
    GarageArea: 36 * scaleFactor, // ~$36 per sq ft of garage space
    YearBuilt: 440 * scaleFactor, // ~$440 per year newer construction
    LotArea: 1.35 * scaleFactor,  // ~$1.35 per sq ft of lot area
  };

  const featureImpacts: Record<string, number> = {
    [xAxisFeature]: Math.round(xImpactUsd),
    [zAxisFeature]: Math.round(zImpactUsd),
  };

  // Compute non-axis differences relative to the active conditioning slice
  let secondaryDeltaSum = 0;
  const nonAxisBaselineDiffs: SurfaceEstimateResult['nonAxisBaselineDiffs'] = [];
  for (const [featKey, baseVal] of Object.entries(activeSlice.fixedFeatures)) {
    const userVal = currentFeatures[featKey] ?? baseVal;
    const rawDiff = userVal - baseVal;
    const rate = MARGINAL_RATES[featKey] ?? 0;
    // Apply soft diminishing returns for extreme LotArea values
    const effectiveDiff =
      featKey === 'LotArea' && Math.abs(rawDiff) > 6000
        ? Math.sign(rawDiff) * (6000 + Math.sqrt(Math.abs(rawDiff) - 6000) * 45)
        : rawDiff;
    const deltaUsd =
      data.surface.slices.length === 1 ? Math.round(effectiveDiff * rate) : 0;

    featureImpacts[featKey] = deltaUsd;
    secondaryDeltaSum += deltaUsd;

    if (Math.abs(rawDiff) > 1e-6) {
      const meta = data.features.find((f) => f.id === featKey);
      nonAxisBaselineDiffs.push({
        feature: featKey,
        label: meta?.label || featKey,
        userValue: userVal,
        baselineValue: baseVal,
        unit: meta?.unit,
        priceDeltaUsd: deltaUsd,
      });
    }
  }

  // If matching an exact reference house, populate featureImpacts from its exact SHAP values when available
  if (matchingRef?.shap) {
    for (const contrib of matchingRef.shap.allContributions || matchingRef.shap.contributions) {
      if (contrib.feature in currentFeatures) {
        featureImpacts[contrib.feature] = Math.round(contrib.shapValue);
      }
    }
  }

  const interpolationDetails = {
    x0: mainSample.x0,
    x1: mainSample.x1,
    z0: mainSample.z0,
    z1: mainSample.z1,
    tx: mainSample.tx,
    tz: mainSample.tz,
    q00: mainSample.q00,
    q10: mainSample.q10,
    q01: mainSample.q01,
    q11: mainSample.q11,
  };

  if (matchingRef) {
    return {
      predictedPrice: matchingRef.predictedPrice,
      surfaceConditionalPrice,
      baselinePrice: matchingRef.shap?.baseValue ?? baselinePrice,
      featureImpacts,
      estimateMode: 'reference-exact',
      activeSlice,
      xValue,
      zValue,
      referenceHouse: matchingRef,
      nearestReferenceHouse: matchingRef,
      nonAxisBaselineDiffs,
      interpolationDetails,
    };
  }

  const adjustedPredictedPrice = Math.max(
    Math.round(data.surface.minPrediction * 0.65),
    Math.round(surfaceConditionalPrice + secondaryDeltaSum)
  );

  const isExactXNode = Math.abs(mainSample.tx) < 1e-6 || Math.abs(mainSample.tx - 1) < 1e-6;
  const isExactZNode = Math.abs(mainSample.tz) < 1e-6 || Math.abs(mainSample.tz - 1) < 1e-6;
  const isExactSliceMatch = nonAxisBaselineDiffs.length === 0;

  if (isExactXNode && isExactZNode && isExactSliceMatch) {
    return {
      predictedPrice: adjustedPredictedPrice,
      surfaceConditionalPrice,
      baselinePrice,
      featureImpacts,
      estimateMode: 'grid-node-exact',
      activeSlice,
      xValue,
      zValue,
      nearestReferenceHouse,
      nonAxisBaselineDiffs,
      interpolationDetails,
    };
  }

  return {
    predictedPrice: adjustedPredictedPrice,
    surfaceConditionalPrice,
    baselinePrice,
    featureImpacts,
    estimateMode: 'bilinear-interpolated',
    activeSlice,
    xValue,
    zValue,
    nearestReferenceHouse,
    nonAxisBaselineDiffs,
    interpolationDetails,
  };
}

/**
 * Formats a target prediction or SHAP delta using only the currency/unit metadata
 * explicitly declared in the JSON schema. Never assumes a currency symbol if omitted.
 */
export function formatTargetValue(
  value: number,
  metadata: HousePrice3DDataContract['modelMetadata'],
  options?: { showPositiveSign?: boolean; compact?: boolean }
): string {
  const absVal = Math.abs(value);
  const signPrefix = value < 0 ? '-' : options?.showPositiveSign && value > 0 ? '+' : '';
  const symbol =
    metadata.targetSymbol ?? (metadata.targetCurrency === 'USD' ? '$' : '');
  const unitSuffix = !symbol && metadata.targetUnit ? ` ${metadata.targetUnit}` : '';

  if (options?.compact && absVal >= 1000) {
    const compactNum =
      absVal >= 1_000_000
        ? `${(absVal / 1_000_000).toFixed(2)}M`
        : `${Math.round(absVal / 1000)}k`;
    return `${signPrefix}${symbol}${compactNum}${unitSuffix}`;
  }

  const formattedNum = Math.round(absVal).toLocaleString('en-US');
  return `${signPrefix}${symbol}${formattedNum}${unitSuffix}`;
}
