import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Info,
  ArrowRight,
  AlertCircle,
  Layers,
} from 'lucide-react';
import {
  HousePrice3DDataContract,
  HousePriceReferencePreset,
  SurfaceEstimateResult,
} from '../types';
import { formatTargetValue } from '../services/housePriceSurfaceLoader';

interface ShapExplanationPanelProps {
  data: HousePrice3DDataContract;
  estimate: SurfaceEstimateResult;
  onSelectPreset: (preset: HousePriceReferencePreset) => void;
}

export const ShapExplanationPanel: React.FC<ShapExplanationPanelProps> = ({
  data,
  estimate,
  onSelectPreset,
}) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const exactReference = estimate.referenceHouse;
  const fallbackReference =
    exactReference ||
    estimate.nearestReferenceHouse ||
    data.referenceHouses[0];

  const shapBlock = fallbackReference?.shap;
  const isExactShapMatch =
    estimate.estimateMode === 'reference-exact' && Boolean(exactReference?.shap);

  if (!shapBlock) {
    return (
      <div className="rounded-xl border border-[#24272D] bg-[#101216] p-4 font-mono text-xs text-[#8B8F98]">
        No precomputed SHAP explanations were provided in this data asset.
      </div>
    );
  }

  const allContribs = shapBlock.allContributions || shapBlock.contributions;
  const displayedSource = showAllFeatures && shapBlock.allContributions
    ? shapBlock.allContributions
    : shapBlock.contributions;

  // Sort contributions by absolute magnitude descending
  const sortedContributions = [...displayedSource].sort(
    (a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue)
  );

  const maxAbsShap = Math.max(
    1,
    ...sortedContributions.map((c) => Math.abs(c.shapValue))
  );

  const sumContributions = allContribs.reduce(
    (acc, item) => acc + item.shapValue,
    0
  );

  return (
    <div className="rounded-xl border border-[#24272D] bg-[#101216] p-4 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24272D] pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#7CFF6B]" />
          <span className="font-bold text-[#F2F2F2] uppercase tracking-wider">
            PRECOMPUTED SHAP FEATURE ATTRIBUTION WATERFALL
          </span>
        </div>

        <span
          className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
            isExactShapMatch
              ? 'bg-[#7CFF6B]/10 border-[#7CFF6B]/40 text-[#7CFF6B]'
              : 'bg-[#FFB86B]/10 border-[#FFB86B]/40 text-[#FFB86B]'
          }`}
        >
          {isExactShapMatch
            ? `EXACT SHAP RECORD: ${fallbackReference.name.toUpperCase()}`
            : `SHOWING NEAREST REFERENCE SHAP: ${fallbackReference.name.toUpperCase()}`}
        </span>
      </div>

      {/* Honest Disclosure when User Sliders are Off-Preset */}
      {!isExactShapMatch && (
        <div className="p-3 rounded-lg bg-[#FFB86B]/10 border border-[#FFB86B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
          <div className="flex items-start gap-2 text-[#E6EDF3] font-sans">
            <AlertCircle className="w-4 h-4 text-[#FFB86B] shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono text-[#FFB86B]">
                Why SHAP is locked to verified reference homes:
              </strong>{' '}
              Stacking SHAP values depend on non-linear tree split paths and linear meta-weights across all 79 tabular features and cannot be linearly interpolated between grid points. Below is the exact SHAP explanation for the nearest held-out property (
              <strong>{fallbackReference.name}</strong>).
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPreset(fallbackReference)}
            className="px-3 py-1.5 rounded-lg bg-[#FFB86B] text-[#08090B] font-mono font-bold text-[10px] shrink-0 flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span>SNAP SLIDERS TO THIS HOME</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Additive Equation Summary Strip: E[f(X)] + sum(SHAP) = f(x) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 tabular-nums">
        <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D]">
          <span className="text-[10px] text-[#8B8F98] block uppercase">
            1. BASELINE EXPECTED VALUE E[f(X)]
          </span>
          <span className="text-base font-bold text-[#F2F2F2]">
            {formatTargetValue(shapBlock.baseValue, data.modelMetadata)}
          </span>
          <span className="text-[9px] text-[#8B8F98] block mt-0.5">
            {shapBlock.baseValueLog1p !== undefined
              ? `log1p Base: ${shapBlock.baseValueLog1p.toFixed(4)} (${shapBlock.backgroundSampleCount ?? 200} bg samples)`
              : 'Training dataset mean prediction'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D]">
          <span className="text-[10px] text-[#8B8F98] block uppercase">
            2. NET SHAP ATTRIBUTION Σ(φ_i) ({allContribs.length} FEATURES)
          </span>
          <span
            className={`text-base font-bold ${
              sumContributions >= 0 ? 'text-[#7CFF6B]' : 'text-[#FF7B72]'
            }`}
          >
            {formatTargetValue(sumContributions, data.modelMetadata, {
              showPositiveSign: true,
            })}
          </span>
          <span className="text-[9px] text-[#8B8F98] block mt-0.5">
            {shapBlock.additivityVerified
              ? `Additivity Verified (Δ=${(shapBlock.additivityDiscrepancyLog1p ?? 0).toExponential(2)})`
              : 'Sum of local feature contributions'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#08090B] border border-[#7CFF6B]/40">
          <span className="text-[10px] text-[#8B8F98] block uppercase">
            3. FINAL MODEL PREDICTION f(x)
          </span>
          <span className="text-base font-bold text-[#7CFF6B]">
            {formatTargetValue(shapBlock.outputValue, data.modelMetadata)}
          </span>
          {fallbackReference.actualPrice !== undefined && (
            <span className="text-[9px] text-[#D1D5DB] block mt-0.5">
              Actual Sale:{' '}
              {formatTargetValue(
                fallbackReference.actualPrice,
                data.modelMetadata
              )}{' '}
              (Residual:{' '}
              {formatTargetValue(
                fallbackReference.actualPrice - shapBlock.outputValue,
                data.modelMetadata,
                { showPositiveSign: true }
              )}
              )
            </span>
          )}
        </div>
      </div>

      {/* Engineered Feature Readout for Selected Reference Home */}
      {fallbackReference.engineeredFeatures && (
        <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#8B8F98]">
            <span className="font-bold text-[#D1D5DB] uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#6EA8FE]" />
              <span>PIPELINE ENGINEERED FEATURES (AmesFeatureEngineer)</span>
            </span>
            {fallbackReference.houseId !== undefined && (
              <span>
                Ames Observation #{fallbackReference.houseId} · CV Fold{' '}
                {fallbackReference.cvFold ?? 0}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 text-[10px] tabular-nums">
            {Object.entries(fallbackReference.engineeredFeatures).map(([k, v]) => (
              <div
                key={k}
                className="p-1.5 rounded bg-[#101216] border border-[#24272D] text-center"
              >
                <span className="text-[9px] text-[#8B8F98] block truncate">{k}</span>
                <span className="font-bold text-[#F2F2F2]">
                  {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : Number(v).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diverging Horizontal Bar Chart */}
      <div className="p-3.5 rounded-lg bg-[#08090B] border border-[#24272D] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#8B8F98] border-b border-[#24272D] pb-1.5">
          <span>
            FEATURE &amp; OBSERVED VALUE (SHOWING {sortedContributions.length} OF{' '}
            {allContribs.length})
          </span>
          <div className="flex items-center gap-2">
            <span>
              DIRECTIONAL SHAP IMPACT ON {data.modelMetadata.targetName.toUpperCase()}
            </span>
            {shapBlock.allContributions &&
              shapBlock.allContributions.length > shapBlock.contributions.length && (
                <button
                  type="button"
                  onClick={() => setShowAllFeatures((p) => !p)}
                  className="px-2 py-0.5 rounded bg-[#101216] border border-[#24272D] hover:border-[#7CFF6B]/50 text-[#7CFF6B] font-bold cursor-pointer"
                >
                  {showAllFeatures
                    ? `SHOW TOP ${shapBlock.contributions.length}`
                    : `SHOW ALL ${shapBlock.allContributions.length} FEATURES`}
                </button>
              )}
          </div>
        </div>

        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {sortedContributions.map((item) => {
            const isPositive = item.shapValue >= 0;
            const widthPct = Math.max(
              3,
              Math.round((Math.abs(item.shapValue) / maxAbsShap) * 48)
            );

            return (
              <div
                key={item.feature}
                className="grid grid-cols-12 items-center gap-2 text-[11px] tabular-nums"
              >
                {/* Left label + feature value */}
                <div className="col-span-5 sm:col-span-4 truncate">
                  <span className="font-bold text-[#F2F2F2]">{item.label}</span>
                  <span className="text-[10px] text-[#8B8F98] block">
                    {item.feature} ={' '}
                    {item.featureValue === null ? 'None' : String(item.featureValue)}{' '}
                    {item.unit ? item.unit : ''}
                  </span>
                </div>

                {/* Center Diverging Bar Track */}
                <div className="col-span-4 sm:col-span-5 relative h-5 bg-[#101216] rounded border border-[#24272D] flex items-center">
                  {/* Zero center divider */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#475569]" />

                  {isPositive ? (
                    <div
                      className="h-3 rounded-r bg-[#7CFF6B]/85 transition-all"
                      style={{
                        marginLeft: '50%',
                        width: `${widthPct}%`,
                      }}
                    />
                  ) : (
                    <div
                      className="h-3 rounded-l bg-[#FF7B72]/85 transition-all"
                      style={{
                        marginLeft: `${50 - widthPct}%`,
                        width: `${widthPct}%`,
                      }}
                    />
                  )}
                </div>

                {/* Right numeric delta */}
                <div
                  className={`col-span-3 text-right font-bold ${
                    isPositive ? 'text-[#7CFF6B]' : 'text-[#FF7B72]'
                  }`}
                >
                  <div>
                    {formatTargetValue(item.shapValue, data.modelMetadata, {
                      showPositiveSign: true,
                    })}
                  </div>
                  {item.shapLog1p !== undefined && (
                    <div className="text-[9px] text-[#8B8F98] font-normal">
                      {item.shapLog1p >= 0 ? '+' : ''}
                      {item.shapLog1p.toFixed(4)} log1p
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scientific Methodology & Non-Causal Attribution Note */}
      <div className="p-3 rounded-lg bg-[#08090B] border border-[#24272D] flex items-start gap-2.5 text-[11px] text-[#8B8F98] font-sans leading-relaxed">
        <Info className="w-4 h-4 text-[#6EA8FE] shrink-0 mt-0.5" />
        <div>
          <strong className="font-mono text-[#D1D5DB] uppercase">
            Scientific Interpretation Note (Associative vs. Causal):
          </strong>{' '}
          {shapBlock.explainerType ? (
            <>
              Computed via <code className="text-[#7CFF6B]">{shapBlock.explainerType}</code>.{' '}
            </>
          ) : null}
          SHAP (SHapley Additive exPlanations) quantifies how each feature shifts the ensemble&apos;s prediction relative to the training baseline{' '}
          <code className="text-[#7CFF6B]">
            E[f(X)] = {formatTargetValue(shapBlock.baseValue, data.modelMetadata)}
          </code>
          . These attributions reflect observational associations learned from the Ames Housing dataset and do not imply real-world causal market effects if a property were physically renovated.
        </div>
      </div>
    </div>
  );
};
