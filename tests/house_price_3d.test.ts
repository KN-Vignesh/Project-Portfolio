import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  clearHousePriceDataCache,
  evaluateSurfacePrediction,
  findClosestSurfaceSlice,
  formatTargetValue,
  HousePriceDataError,
  loadHousePrice3DData,
  validateHousePrice3DPayload,
} from '../src/services/housePriceSurfaceLoader';
import { HousePrice3DDataContract } from '../src/types';

const fixturePath = path.resolve(
  process.cwd(),
  'public/data/house_price_3d.fixture.json'
);
const fixtureJson: HousePrice3DDataContract = JSON.parse(
  fs.readFileSync(fixturePath, 'utf-8')
);

test('House Price 3D Schema Validation: validates local house_price_3d.fixture.json against v1.0.0', () => {
  const validated = validateHousePrice3DPayload(fixtureJson);
  assert.equal(validated.schemaVersion, '1.0.0');
  assert.equal(validated.surface.xAxisFeature, 'GrLivArea');
  assert.equal(validated.surface.zAxisFeature, 'OverallQual');
  assert.ok(validated.surface.slices.length >= 4);
  assert.ok(validated.referenceHouses.length >= 4);
  assert.equal(validated.evaluation.metrics.r2, 0.898);
});

test('House Price 3D Schema Validation: rejects unsupported schemaVersion with UNSUPPORTED_VERSION', () => {
  const badVersion = { ...fixtureJson, schemaVersion: '2.0.0' };
  assert.throws(
    () => validateHousePrice3DPayload(badVersion),
    (err: unknown) =>
      err instanceof HousePriceDataError && err.code === 'UNSUPPORTED_VERSION'
  );
});

test('House Price 3D Schema Validation: rejects malformed payloads with mismatched surface grid dimensions', () => {
  const brokenGrid = {
    ...fixtureJson,
    surface: {
      ...fixtureJson.surface,
      xValues: [600, 1200, 1800],
    },
  };
  assert.throws(
    () => validateHousePrice3DPayload(brokenGrid),
    /contains invalid row length/i
  );
});

test('House Price 3D Loader: falls back to labeled local dev fixture when remote URL returns 404', async () => {
  clearHousePriceDataCache();
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const urlStr = String(input);
      if (urlStr.includes('raw.githubusercontent.com')) {
        return new Response('Not Found', {
          status: 404,
          statusText: 'Not Found',
        });
      }
      return new Response(JSON.stringify(fixtureJson), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    const loaded = await loadHousePrice3DData({
      url: 'https://raw.githubusercontent.com/KN-Vignesh/Projects/main/Data-recipe/House_Price_Prediction/house_price_3d.json',
      fallbackUrl: '/data/house_price_3d.fixture.json',
      allowFixtureFallback: true,
    });

    assert.equal(loaded.sourceMode, 'labeled-dev-fixture');
    assert.equal(loaded.data.isSyntheticDevFixture, true);
    assert.ok(loaded.remoteFallbackReason?.includes('HTTP 404'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('House Price 3D Loader: throws NETWORK_ERROR when allowFixtureFallback is false and remote fails', async () => {
  clearHousePriceDataCache();
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = (async () =>
      new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
      })) as typeof fetch;

    await assert.rejects(
      () =>
        loadHousePrice3DData({
          url: 'https://example.com/missing_house_price_3d.json',
          allowFixtureFallback: false,
        }),
      /HTTP 404/
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Bilinear Surface Engine: returns reference-exact mode and verified additive SHAP on reference presets', () => {
  const preset = fixtureJson.referenceHouses.find(
    (r) => r.id === 'ref-modern-suburban'
  )!;
  const result = evaluateSurfacePrediction(
    fixtureJson,
    preset.features,
    preset.id
  );

  assert.equal(result.estimateMode, 'reference-exact');
  assert.equal(result.predictedPrice, 239500);
  assert.equal(result.referenceHouse?.id, 'ref-modern-suburban');

  const shap = result.referenceHouse!.shap!;
  const sumContribs = shap.contributions.reduce(
    (acc, c) => acc + c.shapValue,
    0
  );
  assert.equal(shap.baseValue + sumContribs, shap.outputValue);
});

test('Bilinear Surface Engine: returns grid-node-exact mode on exact grid vertices and computes bilinear interpolation off-grid', () => {
  const exactNode = evaluateSurfacePrediction(fixtureJson, {
    GrLivArea: 1400,
    OverallQual: 5,
    GarageArea: 480,
    YearBuilt: 2005,
    LotArea: 9600,
  });
  assert.equal(exactNode.estimateMode, 'grid-node-exact');
  assert.equal(exactNode.predictedPrice, 148000);

  const interpolated = evaluateSurfacePrediction(fixtureJson, {
    GrLivArea: 1600,
    OverallQual: 5.5,
    GarageArea: 480,
    YearBuilt: 2005,
    LotArea: 9600,
  });
  assert.equal(interpolated.estimateMode, 'bilinear-interpolated');
  assert.equal(interpolated.predictedPrice, 173250);
});

test('Slice Selection & Target Formatting: resolves conditioning slices and respects currency metadata', () => {
  const vintageSlice = findClosestSurfaceSlice(fixtureJson, {
    GrLivArea: 1800,
    OverallQual: 6,
    GarageArea: 0,
    YearBuilt: 1950,
    LotArea: 6000,
  });
  assert.equal(vintageSlice.id, 'slice-compact-vintage');

  assert.equal(formatTargetValue(239500, fixtureJson.modelMetadata), '$239,500');
  const unitlessMeta = {
    ...fixtureJson.modelMetadata,
    targetSymbol: undefined,
    targetCurrency: undefined,
    targetUnit: undefined,
  };
  assert.equal(formatTargetValue(239500, unitlessMeta), '239,500');
});

test('Python Exporter Schema Normalization: validates and normalizes house_price_3d.schema.json format natively', () => {
  const exporterPayload = {
    schemaVersion: '1.0.0',
    generatedAt: '2026-10-20T03:51:53Z',
    sourceRevision: 'git:03cd0f07836c',
    model: {
      name: 'Ames Multi-Model Stacking Regressor',
      version: '1.0.0',
      architecture: 'StackingRegressor[7 Base Models -> Ridge]',
      targetVariable: 'SalePrice',
      targetCurrency: 'USD',
      targetUnit: 'USD',
      targetTransformation: 'log1p',
      inverseTransformation: 'expm1',
      randomSeed: 42,
      cvFolds: 5,
      baseEstimators: [
        { id: 'ridge', name: 'Ridge', estimatorClass: 'sklearn.linear_model.Ridge', metaWeight: 0.1259 },
      ],
      cvBenchmarks: [
        { model: 'Stacking Ensemble', meanRmsle: 0.10868, stdRmsle: 0.00685, foldRmsle: [0.1, 0.1, 0.1, 0.1, 0.1], isFinalEnsemble: true },
      ],
    },
    dataset: {
      name: 'Ames Housing Dataset',
      cleanedTrainRows: 1458,
      rawTrainRows: 1460,
      removedOutlierCount: 2,
      rawFeatureCount: 79,
      engineeredFeatureCount: 88,
      preprocessedFeatureCount: 325,
    },
    features: {
      surfaceAxes: [
        { axis: 'x', name: 'GrLivArea', label: 'Above-Grade Living Area', unit: 'sq_ft', kind: 'numerical', min: 334, max: 4476, median: 1462 },
        { axis: 'y', name: 'OverallQual', label: 'Overall Quality', unit: 'rating_1_to_10', kind: 'ordinal', min: 1, max: 10, median: 6 },
      ],
      engineeredFeatures: [
        { name: 'TotalSF', formula: 'TotalBsmtSF + 1stFlrSF + 2ndFlrSF', unit: 'sq_ft', sourceColumns: ['TotalBsmtSF', '1stFlrSF', '2ndFlrSF'] },
      ],
      inputFeatures: [
        { name: 'GrLivArea', kind: 'numerical', unit: 'sq_ft', baselineValue: 1462, min: 334, max: 4476, median: 1462 },
        { name: 'OverallQual', kind: 'ordinal', unit: 'rating_1_to_10', baselineValue: 6, min: 1, max: 10, median: 6 },
        { name: 'GarageArea', kind: 'numerical', unit: 'sq_ft', baselineValue: 480, min: 0, max: 1390, median: 480 },
        { name: 'YearBuilt', kind: 'numerical', unit: 'year', baselineValue: 1972, min: 1872, max: 2010, median: 1972 },
        { name: 'LotArea', kind: 'numerical', unit: 'sq_ft', baselineValue: 9475, min: 1300, max: 215245, median: 9475 },
      ],
    },
    surface: {
      gridShape: [2, 2],
      xAxis: { feature: 'GrLivArea', label: 'GrLivArea', unit: 'sq_ft', min: 800, max: 2000, size: 2, values: [800, 2000] },
      yAxis: { feature: 'OverallQual', label: 'OverallQual', unit: 'rating_1_to_10', min: 5, max: 8, size: 2, values: [5, 8] },
      zUnit: 'USD',
      zCurrency: 'USD',
      zMinUsd: 120000,
      zMaxUsd: 260000,
      zMatrixUsd: [
        [120000, 180000],
        [175000, 260000],
      ],
      baselineFeatures: { GrLivArea: 1462, OverallQual: 6, GarageArea: 480, YearBuilt: 1972, LotArea: 9475 },
      baselinePredictionUsd: 153891.88,
    },
    examples: [
      {
        id: 'ex_01_starter_budget_house_393',
        houseId: 393,
        label: 'Starter Budget Home (10th Percentile Price)',
        selectionReason: 'Representative entry-level Ames residential property.',
        cvFold: 4,
        actualPriceUsd: 106500,
        predictedPriceUsd: 106935.58,
        oofPredictedPriceUsd: 108221.53,
        features: { GrLivArea: 882, OverallQual: 5, GarageArea: 294, YearBuilt: 1959, LotArea: 8400 },
        engineeredFeatures: { TotalSF: 882, TotalBath: 1, HouseAge: 48 },
        explainability: {
          explainerType: 'ExactStackingExplainer',
          targetScale: 'log1p_usd',
          baseValueUsd: 165900.77,
          predictedUsd: 106935.58,
          additivityVerified: true,
          topContributions: [
            { feature: 'GrLivArea', value: 882, shapLog1p: -0.0529, contributionUsd: -7104.54 },
          ],
          contributions: [
            { feature: 'GrLivArea', value: 882, shapLog1p: -0.0529, contributionUsd: -7104.54 },
          ],
        },
      },
    ],
    evaluation: {
      methodology: '5-Fold Cross-Validation Out-of-Fold Evaluation',
      splitType: '5_fold_out_of_fold_cross_validation',
      cvFolds: 5,
      randomSeed: 42,
      sampleCount: 1,
      targetUnit: 'USD',
      targetCurrency: 'USD',
      metrics: {
        rmsle: 0.108899,
        cvMeanRmsle: 0.108681,
        cvStdRmsle: 0.006852,
        maeUsd: 12785.43,
        rmseUsd: 19901.48,
        medianAeUsd: 8461,
        mapePct: 7.5089,
        r2Usd: 0.937283,
        r2Log1p: 0.925723,
      },
      actualVsPredicted: [
        { houseId: 1, fold: 2, actualUsd: 208500, predictedOofUsd: 203850.86, grLivArea: 1710, overallQual: 7 },
      ],
    },
  };

  const normalized = validateHousePrice3DPayload(exporterPayload);
  assert.equal(normalized.modelMetadata.modelName, 'Ames Multi-Model Stacking Regressor');
  assert.equal(normalized.sourceRevision, 'git:03cd0f07836c');
  assert.equal(normalized.evaluation.metrics.r2, 0.937283);
  assert.equal(normalized.referenceHouses[0].houseId, 393);
  assert.equal(normalized.referenceHouses[0].shap?.additivityVerified, true);
});

