import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Box,
  Database,
  Home,
  Layers,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import {
  HousePrice3DDataContract,
  HousePriceEvaluationPoint,
  HousePriceReferencePreset,
} from '../types';
import {
  evaluateSurfacePrediction,
  formatTargetValue,
  LoadedHousePrice3DAsset,
  loadHousePrice3DData,
} from '../services/housePriceSurfaceLoader';
import { PredictionSurface } from './PredictionSurface';
import { HouseFeatureControls } from './HouseFeatureControls';
import { ShapExplanationPanel } from './ShapExplanationPanel';

interface HousePriceExperiment3DProps {
  dataUrl?: string;
  fallbackFixtureUrl?: string;
}

type WorkbenchTab = '3d-predictor' | 'shap-why' | 'accuracy-eval' | 'all';

export const HousePriceExperiment3D: React.FC<HousePriceExperiment3DProps> = ({
  dataUrl,
  fallbackFixtureUrl,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const [asset, setAsset] = useState<LoadedHousePrice3DAsset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [strictRemoteOnly, setStrictRemoteOnly] = useState<boolean>(false);

  // Simple, clean view mode selector: defaults to 'all' so everything is accessible,
  // with side-by-side 3D + Sliders right at the top!
  const [activeView, setActiveView] = useState<WorkbenchTab>('all');

  // Interactive Feature Values & Active Reference Preset
  const [features, setFeatures] = useState<Record<string, number>>({});
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [hoveredEvalPoint, setHoveredEvalPoint] =
    useState<HousePriceEvaluationPoint | null>(null);

  const initializeDefaults = useCallback((contract: HousePrice3DDataContract) => {
    const defaultPreset =
      contract.referenceHouses.find((r) => r.id === 'ref-modern-suburban') ||
      contract.referenceHouses[2] ||
      contract.referenceHouses[0];

    if (defaultPreset) {
      setFeatures({ ...defaultPreset.features });
      setActivePresetId(defaultPreset.id);
    } else {
      const initial: Record<string, number> = {};
      for (const f of contract.features) {
        initial[f.id] = f.defaultValue;
      }
      setFeatures(initial);
      setActivePresetId(null);
    }
  }, []);

  const fetchSurfaceAsset = useCallback(
    (forceRefresh = false, remoteOnly = strictRemoteOnly) => {
      const controller = new AbortController();
      setLoading(true);
      setErrorMessage(null);

      loadHousePrice3DData({
        url: dataUrl,
        fallbackUrl: fallbackFixtureUrl,
        signal: controller.signal,
        forceRefresh,
        allowFixtureFallback: !remoteOnly,
      })
        .then((loaded) => {
          if (controller.signal.aborted) return;
          setAsset(loaded);
          initializeDefaults(loaded.data);
          setLoading(false);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          if (err instanceof DOMException && err.name === 'AbortError') return;
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to load or validate house_price_3d.json.'
          );
          setLoading(false);
        });

      return () => controller.abort();
    },
    [dataUrl, fallbackFixtureUrl, initializeDefaults, strictRemoteOnly]
  );

  useEffect(() => {
    const cleanup = fetchSurfaceAsset(false, strictRemoteOnly);
    return cleanup;
  }, [fetchSurfaceAsset, strictRemoteOnly]);

  const data = asset?.data || null;

  const estimate = useMemo(() => {
    if (!data) return null;
    return evaluateSurfacePrediction(data, features, activePresetId);
  }, [data, features, activePresetId]);

  const evalPoints = data?.evaluation.actualVsPredicted || [];
  const sampledEvalPoints = useMemo(() => {
    if (!data) return [];
    const pts = data.evaluation.actualVsPredicted;
    if (pts.length <= 220) return pts;
    const step = Math.max(1, Math.floor(pts.length / 200));
    const refHouseIds = new Set(
      data.referenceHouses.map((r) => r.houseId).filter((id): id is number => id !== undefined)
    );
    return pts.filter(
      (pt, idx) => idx % step === 0 || (pt.houseId !== undefined && refHouseIds.has(pt.houseId))
    );
  }, [data]);

  const minEvalPrice = useMemo(
    () =>
      sampledEvalPoints.length > 0
        ? Math.min(
            ...sampledEvalPoints.map((p) => Math.min(p.actual, p.predicted)),
            50000
          )
        : 50000,
    [sampledEvalPoints]
  );
  const maxEvalPrice = useMemo(
    () =>
      sampledEvalPoints.length > 0
        ? Math.max(
            ...sampledEvalPoints.map((p) => Math.max(p.actual, p.predicted)),
            620000
          )
        : 620000,
    [sampledEvalPoints]
  );
  const evalSpan = Math.max(1, maxEvalPrice - minEvalPrice);

  const handleFeatureChange = (featureId: string, value: number) => {
    setFeatures((prev) => ({
      ...prev,
      [featureId]: value,
    }));
    setActivePresetId(null);
  };

  const handleSelectCoordinates = (xVal: number, zVal: number) => {
    if (!data) return;
    setFeatures((prev) => ({
      ...prev,
      [data.surface.xAxisFeature]: xVal,
      [data.surface.zAxisFeature]: zVal,
    }));
    setActivePresetId(null);
  };

  const handleSelectPreset = (preset: HousePriceReferencePreset) => {
    setFeatures({ ...preset.features });
    setActivePresetId(preset.id);
  };

  const handleReset = () => {
    if (data) {
      initializeDefaults(data);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-[#24272D] bg-[#08090B] p-6 font-mono text-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7CFF6B]">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-bold uppercase">
              Loading Interactive 3D House Price Model...
            </span>
          </div>
          <span className="text-[10px] text-[#8B8F98]">Schema v1.0.0</span>
        </div>
        <div className="h-[260px] rounded-lg bg-[#101216] border border-[#24272D] animate-pulse flex flex-col items-center justify-center gap-2 text-[#8B8F98]">
          <Box className="w-6 h-6 text-[#6EA8FE]" />
          <span>Preparing 3D terrain &amp; interactive property controls...</span>
        </div>
      </div>
    );
  }

  // Error / Unavailable State
  if (errorMessage || !data || !estimate) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-[#FF7B72]/50 bg-[#08090B] p-5 font-mono text-xs space-y-4"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FF7B72] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#FF7B72] uppercase">
              STATIC PREDICTION ASSET UNAVAILABLE OR INVALID
            </h3>
            <p className="text-xs text-[#D1D5DB] font-sans leading-relaxed">
              {errorMessage ||
                'The house_price_3d.json data asset could not be loaded or failed schema validation.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => fetchSurfaceAsset(true, strictRemoteOnly)}
            className="px-3 py-1.5 rounded-lg bg-[#101216] border border-[#24272D] hover:border-[#7CFF6B] text-[#F2F2F2] flex items-center gap-1.5 text-[11px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#7CFF6B]" />
            <span>RETRY FETCH</span>
          </button>

          {strictRemoteOnly && (
            <button
              type="button"
              onClick={() => setStrictRemoteOnly(false)}
              className="px-3 py-1.5 rounded-lg bg-[#7CFF6B] text-[#08090B] font-bold flex items-center gap-1.5 text-[11px] cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>LOAD LABELED LOCAL DEV FIXTURE</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.18 },
      };

  const netDiffFromAvg = estimate.predictedPrice - estimate.baselinePrice;
  const pctDiffFromAvg =
    estimate.baselinePrice > 0
      ? ((netDiffFromAvg / estimate.baselinePrice) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* ====================================================================
          TOP LIVE VALUATION SCOREBOARD & SIMPLE VIEW SWITCHER
      ==================================================================== */}
      <div className="p-4 rounded-xl bg-[#101216] border border-[#24272D] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Big Live Predicted Price & Plain-English Summary */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-2.5 rounded-xl bg-[#08090B] border border-[#7CFF6B]/50">
              <span className="text-[10px] text-[#8B8F98] block uppercase font-bold">
                LIVE PREDICTED SALE PRICE
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#7CFF6B] tabular-nums">
                  {formatTargetValue(estimate.predictedPrice, data.modelMetadata)}
                </span>
                <span
                  className={`text-xs font-bold tabular-nums ${
                    netDiffFromAvg >= 0 ? 'text-[#7CFF6B]' : 'text-[#FFB86B]'
                  }`}
                >
                  ({netDiffFromAvg >= 0 ? '+' : ''}
                  {pctDiffFromAvg}% vs avg home)
                </span>
              </div>
            </div>

            <div className="space-y-1 font-sans max-w-xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#F2F2F2] flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#6EA8FE]" />
                  <span>
                    {estimate.referenceHouse
                      ? `Viewing Real Home: ${estimate.referenceHouse.name}`
                      : 'Custom Property Configuration'}
                  </span>
                </span>
                {estimate.referenceHouse?.actualPrice !== undefined && (
                  <span className="text-[#D1D5DB] bg-[#08090B] px-2 py-0.5 rounded border border-[#24272D] text-[11px]">
                    Actual Sold:{' '}
                    <strong className="text-[#7CFF6B]">
                      {formatTargetValue(
                        estimate.referenceHouse.actualPrice,
                        data.modelMetadata
                      )}
                    </strong>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8B8F98] leading-relaxed">
                Use the <strong className="text-[#F2F2F2]">5 sliders on the right</strong> or{' '}
                <strong className="text-[#F2F2F2]">click anywhere on the 3D terrain</strong> to
                change the house size, quality, garage, and age—and watch the 3D house &amp; price
                update live.
              </p>
            </div>
          </div>

          {/* Right: Simple View Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#08090B] border border-[#24272D] self-start lg:self-center">
            <button
              type="button"
              onClick={() => setActiveView('all')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                activeView === 'all'
                  ? 'bg-[#7CFF6B] text-[#08090B]'
                  : 'text-[#8B8F98] hover:text-[#F2F2F2]'
              }`}
            >
              All Panels
            </button>
            <button
              type="button"
              onClick={() => setActiveView('3d-predictor')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                activeView === '3d-predictor'
                  ? 'bg-[#7CFF6B] text-[#08090B]'
                  : 'text-[#8B8F98] hover:text-[#F2F2F2]'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>3D + Sliders</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('shap-why')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                activeView === 'shap-why'
                  ? 'bg-[#7CFF6B] text-[#08090B]'
                  : 'text-[#8B8F98] hover:text-[#F2F2F2]'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Why This Price?</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('accuracy-eval')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                activeView === 'accuracy-eval'
                  ? 'bg-[#7CFF6B] text-[#08090B]'
                  : 'text-[#8B8F98] hover:text-[#F2F2F2]'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Accuracy ({data.evaluation.actualVsPredicted.length})</span>
            </button>
          </div>
        </div>

        {/* Live Equation Breakdown Strip: Average Home + Each Feature Impact = Predicted Price */}
        <div className="pt-2.5 border-t border-[#24272D] flex flex-wrap items-center justify-between gap-2 text-[11px] tabular-nums">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#8B8F98]">How it adds up:</span>
            <span className="px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] text-[#D1D5DB]">
              Avg Home: <strong>{formatTargetValue(estimate.baselinePrice, data.modelMetadata, { compact: true })}</strong>
            </span>
            {Object.entries(estimate.featureImpacts || {}).map(([featId, delta]) => {
              const shortLabel =
                featId === 'GrLivArea'
                  ? 'Living Area'
                  : featId === 'OverallQual'
                  ? 'Quality'
                  : featId === 'GarageArea'
                  ? 'Garage'
                  : featId === 'YearBuilt'
                  ? 'Age/Year'
                  : featId === 'LotArea'
                  ? 'Lot Size'
                  : featId;
              return (
                <span
                  key={featId}
                  className={`px-2 py-0.5 rounded bg-[#08090B] border ${
                    delta > 500
                      ? 'border-[#7CFF6B]/40 text-[#7CFF6B]'
                      : delta < -500
                      ? 'border-[#FF7B72]/40 text-[#FF7B72]'
                      : 'border-[#24272D] text-[#8B8F98]'
                  }`}
                >
                  {shortLabel}:{' '}
                  <strong>
                    {formatTargetValue(delta, data.modelMetadata, {
                      showPositiveSign: true,
                      compact: true,
                    })}
                  </strong>
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#8B8F98]">
            <span>
              Source:{' '}
              {asset?.sourceMode === 'labeled-dev-fixture'
                ? 'Local Dev Fixture'
                : 'Live GitHub Model Export'}
            </span>
            <button
              type="button"
              onClick={() => fetchSurfaceAsset(true, strictRemoteOnly)}
              className="px-2 py-0.5 rounded bg-[#08090B] border border-[#24272D] hover:border-[#7CFF6B] text-[#D1D5DB] flex items-center gap-1 cursor-pointer"
              title="Reload house_price_3d.json"
            >
              <RefreshCw className="w-2.5 h-2.5 text-[#7CFF6B]" />
              <span>Reload</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          PRIMARY INTERACTIVE WORKSPACE: SIDE-BY-SIDE 3D SURFACE + SLIDERS
          Both visible together without scrolling!
      ==================================================================== */}
      {(activeView === 'all' || activeView === '3d-predictor') && (
        <motion.div
          {...motionProps}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
        >
          {/* Left 7 Columns: Interactive 3D Prediction Surface & 3D House Marker */}
          <div className="lg:col-span-7">
            <PredictionSurface
              data={data}
              estimate={estimate}
              features={features}
              onSelectCoordinates={handleSelectCoordinates}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Right 5 Columns: Easy-to-Use Sliders & Presets */}
          <div className="lg:col-span-5">
            <HouseFeatureControls
              data={data}
              features={features}
              activePresetId={activePresetId}
              estimate={estimate}
              onChangeFeature={handleFeatureChange}
              onSelectPreset={handleSelectPreset}
              onReset={handleReset}
            />
          </div>
        </motion.div>
      )}

      {/* ====================================================================
          WHY THIS PRICE? (PRECOMPUTED SHAP EXPLAINABILITY PANEL)
      ==================================================================== */}
      {(activeView === 'all' || activeView === 'shap-why') && (
        <motion.div {...motionProps}>
          <ShapExplanationPanel
            data={data}
            estimate={estimate}
            onSelectPreset={handleSelectPreset}
          />
        </motion.div>
      )}

      {/* ====================================================================
          MODEL ACCURACY & 2D ACTUAL VS PREDICTED PLOT (CLICKABLE POINTS!)
      ==================================================================== */}
      {(activeView === 'all' || activeView === 'accuracy-eval') && (
        <motion.div
          {...motionProps}
          className="rounded-xl border border-[#24272D] bg-[#101216] p-4 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24272D] pb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7CFF6B]" />
              <span className="font-bold text-[#F2F2F2] uppercase tracking-wider">
                MODEL ACCURACY ACROSS {data.modelMetadata.evaluationCount.toLocaleString()} REAL AMES HOMES
              </span>
            </div>
            <span className="text-[10px] text-[#8B8F98]">
              {data.modelMetadata.evaluationSplit} · {data.modelMetadata.modelName}
            </span>
          </div>

          {/* 4-Metric Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 tabular-nums">
            <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D]">
              <span className="text-[10px] text-[#8B8F98] block uppercase">
                ACCURACY (R² SCORE)
              </span>
              <span className="text-lg font-bold text-[#7CFF6B]">
                {(data.evaluation.metrics.r2 * 100).toFixed(1)}%
              </span>
              <span className="text-[9px] text-[#8B8F98] block mt-0.5">
                R² = {data.evaluation.metrics.r2.toFixed(4)} variance explained
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D]">
              <span className="text-[10px] text-[#8B8F98] block uppercase">
                AVERAGE ERROR (MAE)
              </span>
              <span className="text-lg font-bold text-[#6EA8FE]">
                {formatTargetValue(
                  data.evaluation.metrics.mae,
                  data.modelMetadata
                )}
              </span>
              <span className="text-[9px] text-[#8B8F98] block mt-0.5">
                {data.evaluation.metrics.medianAeUsd !== undefined
                  ? `Median Error: ${formatTargetValue(data.evaluation.metrics.medianAeUsd, data.modelMetadata)} (${data.evaluation.metrics.mapePct?.toFixed(1)}%)`
                  : 'Average dollar prediction error'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D]">
              <span className="text-[10px] text-[#8B8F98] block uppercase">
                ROOT MEAN SQUARED ERROR
              </span>
              <span className="text-lg font-bold text-[#FFB86B]">
                {formatTargetValue(
                  data.evaluation.metrics.rmse,
                  data.modelMetadata
                )}
              </span>
              <span className="text-[9px] text-[#8B8F98] block mt-0.5">
                Penalizes large outlier errors
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D]">
              <span className="text-[10px] text-[#8B8F98] block uppercase">
                LOG-SCALE RMSLE (5-FOLD)
              </span>
              <span className="text-lg font-bold text-[#F2F2F2]">
                {data.evaluation.metrics.rmseLog !== undefined
                  ? data.evaluation.metrics.rmseLog.toFixed(4)
                  : 'N/A'}
              </span>
              <span className="text-[9px] text-[#8B8F98] block mt-0.5">
                {data.evaluation.metrics.cvMeanRmsle !== undefined
                  ? `CV Mean: ${data.evaluation.metrics.cvMeanRmsle.toFixed(4)} ± ${data.evaluation.metrics.cvStdRmsle?.toFixed(4)}`
                  : 'Kaggle competition metric'}
              </span>
            </div>
          </div>

          {/* 2D Actual vs Predicted SVG Scatter Plot with Clickable Points */}
          <div className="p-3.5 rounded-lg bg-[#08090B] border border-[#24272D] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
              <span className="font-bold text-[#D1D5DB] uppercase">
                ACTUAL SOLD PRICE VS. MODEL PREDICTION (CLICK ANY DOT TO LOAD INTO 3D VIEW!)
              </span>
              {hoveredEvalPoint ? (
                <span className="text-[#7CFF6B] font-bold tabular-nums">
                  {hoveredEvalPoint.label || hoveredEvalPoint.id}: Sold for{' '}
                  {formatTargetValue(
                    hoveredEvalPoint.actual,
                    data.modelMetadata
                  )}{' '}
                  | Predicted{' '}
                  {formatTargetValue(
                    hoveredEvalPoint.predicted,
                    data.modelMetadata
                  )}
                  {hoveredEvalPoint.grLivArea
                    ? ` (${hoveredEvalPoint.grLivArea} sq ft, Q${hoveredEvalPoint.overallQual})`
                    : ''}
                </span>
              ) : (
                <span className="text-[#8B8F98]">
                  Hover or click any house dot to test it on the 3D surface above
                </span>
              )}
            </div>

            <div className="relative w-full h-52 bg-[#101216] rounded border border-[#24272D] p-2">
              <svg
                viewBox="0 0 500 180"
                className="w-full h-full overflow-visible"
                role="img"
                aria-label="Actual versus Predicted house price scatter plot"
              >
                {[0.25, 0.5, 0.75].map((tick) => (
                  <g key={tick}>
                    <line
                      x1={40}
                      y1={160 - tick * 140}
                      x2={480}
                      y2={160 - tick * 140}
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={40 + tick * 440}
                      y1={20}
                      x2={40 + tick * 440}
                      y2={160}
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                    />
                  </g>
                ))}

                <line
                  x1={40}
                  y1={160}
                  x2={480}
                  y2={160}
                  stroke="#475569"
                  strokeWidth={1.2}
                />
                <line
                  x1={40}
                  y1={20}
                  x2={40}
                  y2={160}
                  stroke="#475569"
                  strokeWidth={1.2}
                />

                {/* Ideal Parity Reference Diagonal y = y_hat */}
                <line
                  x1={40}
                  y1={160}
                  x2={480}
                  y2={20}
                  stroke="#6EA8FE"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                />

                {sampledEvalPoints.map((pt) => {
                  const nx = (pt.actual - minEvalPrice) / evalSpan;
                  const ny = (pt.predicted - minEvalPrice) / evalSpan;
                  const cx = 40 + Math.max(0, Math.min(1, nx)) * 440;
                  const cy = 160 - Math.max(0, Math.min(1, ny)) * 140;
                  const isHovered = hoveredEvalPoint?.id === pt.id;

                  return (
                    <circle
                      key={pt.id}
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 3.4}
                      fill={isHovered ? '#FFB86B' : '#7CFF6B'}
                      fillOpacity={isHovered ? 1 : 0.8}
                      stroke="#08090B"
                      strokeWidth={0.9}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredEvalPoint(pt)}
                      onMouseLeave={() => setHoveredEvalPoint(null)}
                      onClick={() => {
                        if (
                          typeof pt.grLivArea === 'number' &&
                          typeof pt.overallQual === 'number'
                        ) {
                          handleSelectCoordinates(pt.grLivArea, pt.overallQual);
                        }
                      }}
                    >
                      <title>
                        {`${pt.label || pt.id}: Sold ${formatTargetValue(
                          pt.actual,
                          data.modelMetadata
                        )} | Predicted ${formatTargetValue(
                          pt.predicted,
                          data.modelMetadata
                        )} — Click to load into 3D surface`}
                      </title>
                    </circle>
                  );
                })}

                <text x={260} y={176} fill="#8B8F98" fontSize="9" textAnchor="middle">
                  Actual Closing SalePrice ({data.modelMetadata.targetUnit || 'USD'})
                </text>
                <text
                  x={12}
                  y={90}
                  fill="#8B8F98"
                  fontSize="9"
                  textAnchor="middle"
                  transform="rotate(-90 12 90)"
                >
                  Predicted Price
                </text>
              </svg>
            </div>
          </div>

          {/* 8-Model Cross-Validation Benchmark Table */}
          {data.modelMetadata.cvBenchmarks && data.modelMetadata.cvBenchmarks.length > 0 && (
            <div className="p-3.5 rounded-lg bg-[#08090B] border border-[#24272D] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <span className="font-bold text-[#D1D5DB] uppercase">
                  HOW THE 7 BASE MODELS ARE COMBINED (STACKING ENSEMBLE WEIGHTS)
                </span>
                <span className="text-[#8B8F98]">
                  {data.modelMetadata.metaEstimator
                    ? `Meta-Learner: ${data.modelMetadata.metaEstimator.name} (α=${data.modelMetadata.metaEstimator.alpha})`
                    : '7 Base Models -> Ridge Meta-Regressor'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px] tabular-nums">
                  <thead>
                    <tr className="border-b border-[#24272D] text-[#8B8F98]">
                      <th className="py-1.5 pr-3">MODEL / ESTIMATOR</th>
                      <th className="py-1.5 px-3">5-FOLD ERROR (RMSLE)</th>
                      <th className="py-1.5 px-3">FOLD STD (±)</th>
                      <th className="py-1.5 px-3">ENSEMBLE WEIGHT</th>
                      <th className="py-1.5 pl-3 text-right">ROLE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24272D]/50">
                    {data.modelMetadata.cvBenchmarks.map((row) => {
                      const baseEst = data.modelMetadata.baseEstimators?.find(
                        (b) => b.name.toLowerCase() === row.model.toLowerCase()
                      );
                      return (
                        <tr
                          key={row.model}
                          className={
                            row.isFinalEnsemble
                              ? 'bg-[#7CFF6B]/10 text-[#7CFF6B] font-bold'
                              : 'text-[#D1D5DB]'
                          }
                        >
                          <td className="py-1.5 pr-3 font-bold">{row.model}</td>
                          <td className="py-1.5 px-3">{row.meanRmsle.toFixed(5)}</td>
                          <td className="py-1.5 px-3 text-[#8B8F98]">
                            ±{row.stdRmsle.toFixed(5)}
                          </td>
                          <td className="py-1.5 px-3">
                            {baseEst !== undefined
                              ? `${(baseEst.metaWeight * 100).toFixed(1)}%`
                              : row.isFinalEnsemble
                              ? '100% (Combined)'
                              : '—'}
                          </td>
                          <td className="py-1.5 pl-3 text-right">
                            {row.isFinalEnsemble ? 'FINAL STACKING ENSEMBLE' : 'Base Model'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HousePriceExperiment3D;
