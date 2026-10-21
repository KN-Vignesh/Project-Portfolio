import React from 'react';
import { Sliders, RotateCcw, Home, Plus, Minus } from 'lucide-react';
import {
  HousePrice3DDataContract,
  HousePriceFeatureMeta,
  HousePriceReferencePreset,
  SurfaceEstimateResult,
} from '../types';
import { formatTargetValue } from '../services/housePriceSurfaceLoader';

interface HouseFeatureControlsProps {
  data: HousePrice3DDataContract;
  features: Record<string, number>;
  activePresetId: string | null;
  estimate: SurfaceEstimateResult;
  onChangeFeature: (featureId: string, value: number) => void;
  onSelectPreset: (preset: HousePriceReferencePreset) => void;
  onReset: () => void;
}

const SUPPORTED_INTERACTIVE_FEATURES = [
  'GrLivArea',
  'OverallQual',
  'GarageArea',
  'YearBuilt',
  'LotArea',
];

const QUALITY_DESCRIPTIONS: Record<number, string> = {
  1: '1/10 · Very Poor',
  2: '2/10 · Poor',
  3: '3/10 · Fair',
  4: '4/10 · Below Average',
  5: '5/10 · Average',
  6: '6/10 · Above Average',
  7: '7/10 · Good',
  8: '8/10 · Very Good',
  9: '9/10 · Excellent',
  10: '10/10 · Luxury Custom',
};

const FRIENDLY_NAMES: Record<string, { title: string; hint: string; badge: string }> = {
  GrLivArea: {
    title: '1. Living Area (Sq Ft)',
    hint: 'Moves house Left ↔ Right on 3D surface',
    badge: '3D X-Axis',
  },
  OverallQual: {
    title: '2. Construction & Finish Quality',
    hint: 'Moves house Front ↔ Back up the 3D price slope',
    badge: '3D Z-Axis',
  },
  GarageArea: {
    title: '3. Garage Size (Sq Ft)',
    hint: '0 = No Garage · 480 = 2-Car · 900+ = 3-Car',
    badge: 'Feature What-If',
  },
  YearBuilt: {
    title: '4. Year Built',
    hint: 'Newer homes command higher valuation',
    badge: 'Feature What-If',
  },
  LotArea: {
    title: '5. Lot Size (Sq Ft)',
    hint: 'Total property land area (~9,500 is typical)',
    badge: 'Feature What-If',
  },
};

export const HouseFeatureControls: React.FC<HouseFeatureControlsProps> = ({
  data,
  features,
  activePresetId,
  estimate,
  onChangeFeature,
  onSelectPreset,
  onReset,
}) => {
  const orderedFeatures: HousePriceFeatureMeta[] = SUPPORTED_INTERACTIVE_FEATURES.map((id) =>
    data.features.find((f) => f.id === id)
  ).filter((f): f is HousePriceFeatureMeta => Boolean(f));

  const stepFeature = (feat: HousePriceFeatureMeta, direction: 1 | -1) => {
    const currentVal = features[feat.id] ?? feat.defaultValue;
    const rawStep =
      feat.id === 'GrLivArea'
        ? 100
        : feat.id === 'GarageArea'
        ? 60
        : feat.id === 'YearBuilt'
        ? 5
        : feat.id === 'LotArea'
        ? 1000
        : feat.step || 1;
    const nextVal = Math.max(
      feat.min,
      Math.min(feat.max, currentVal + direction * rawStep)
    );
    onChangeFeature(feat.id, nextVal);
  };

  return (
    <div className="rounded-xl border border-[#24272D] bg-[#101216] p-4 space-y-4 font-mono text-xs h-full flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Header & Reset */}
        <div className="flex items-center justify-between gap-2 border-b border-[#24272D] pb-2.5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#7CFF6B]" />
            <div>
              <span className="font-bold text-[#F2F2F2] uppercase tracking-wider block">
                ADJUST HOME FEATURES
              </span>
              <span className="text-[10px] text-[#8B8F98] font-sans">
                Drag any slider or click +/- to change the 3D house &amp; price live
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1.5 rounded-lg bg-[#08090B] border border-[#24272D] hover:border-[#7CFF6B] text-[#D1D5DB] hover:text-[#7CFF6B] transition-colors flex items-center gap-1 text-[10px] cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* All 5 Interactive Sliders with Live Price Impact Badges */}
        <div className="space-y-2.5">
          {orderedFeatures.map((feat) => {
            const currentVal = features[feat.id] ?? feat.defaultValue;
            const impactUsd = estimate.featureImpacts?.[feat.id] ?? 0;
            const isPrimaryAxis =
              feat.id === data.surface.xAxisFeature ||
              feat.id === data.surface.zAxisFeature;
            const friendly = FRIENDLY_NAMES[feat.id] || {
              title: feat.label,
              hint: feat.description,
              badge: 'Feature',
            };
            const inputId = `house-feature-slider-${feat.id}`;

            return (
              <div
                key={feat.id}
                className={`p-3 rounded-xl bg-[#08090B] border transition-colors space-y-2 ${
                  isPrimaryAxis
                    ? 'border-[#7CFF6B]/35'
                    : 'border-[#24272D]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <label
                      htmlFor={inputId}
                      className="text-xs font-bold text-[#F2F2F2] cursor-pointer block truncate"
                    >
                      {friendly.title}
                    </label>
                    <span className="text-[10px] text-[#8B8F98] font-sans block truncate">
                      {friendly.hint}
                    </span>
                  </div>

                  {/* Live Value + Step Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => stepFeature(feat, -1)}
                      className="p-1 rounded bg-[#101216] border border-[#24272D] hover:border-[#7CFF6B] text-[#D1D5DB] cursor-pointer"
                      aria-label={`Decrease ${friendly.title}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span
                      className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded bg-[#101216] border border-[#24272D] min-w-[78px] text-center ${
                        feat.id === data.surface.xAxisFeature
                          ? 'text-[#7CFF6B]'
                          : feat.id === data.surface.zAxisFeature
                          ? 'text-[#6EA8FE]'
                          : 'text-[#F2F2F2]'
                      }`}
                    >
                      {feat.id === 'OverallQual'
                        ? QUALITY_DESCRIPTIONS[currentVal] || `${currentVal}/10`
                        : `${currentVal.toLocaleString()}${feat.unit ? ` ${feat.unit}` : ''}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => stepFeature(feat, 1)}
                      className="p-1 rounded bg-[#101216] border border-[#24272D] hover:border-[#7CFF6B] text-[#D1D5DB] cursor-pointer"
                      aria-label={`Increase ${friendly.title}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Slider Input */}
                <input
                  id={inputId}
                  type="range"
                  min={feat.min}
                  max={feat.max}
                  step={feat.step}
                  value={currentVal}
                  onChange={(e) =>
                    onChangeFeature(feat.id, Number(e.target.value))
                  }
                  className={`w-full h-2 rounded-lg cursor-pointer ${
                    feat.id === data.surface.xAxisFeature
                      ? 'accent-[#7CFF6B]'
                      : feat.id === data.surface.zAxisFeature
                      ? 'accent-[#6EA8FE]'
                      : 'accent-[#FFB86B]'
                  }`}
                />

                {/* Min / Impact vs Average / Max Footer */}
                <div className="flex items-center justify-between text-[10px] tabular-nums">
                  <span className="text-[#8B8F98]">
                    Min: {feat.min.toLocaleString()}
                  </span>
                  <span
                    className={`font-bold ${
                      impactUsd > 500
                        ? 'text-[#7CFF6B]'
                        : impactUsd < -500
                        ? 'text-[#FF7B72]'
                        : 'text-[#8B8F98]'
                    }`}
                  >
                    Impact vs Avg:{' '}
                    {formatTargetValue(impactUsd, data.modelMetadata, {
                      showPositiveSign: true,
                      compact: true,
                    })}
                  </span>
                  <span className="text-[#8B8F98]">
                    Max: {feat.max.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Preset Selector Footer */}
      <div className="pt-3 border-t border-[#24272D] space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold uppercase text-[#D1D5DB] flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-[#6EA8FE]" />
            <span>OR LOAD A REAL HELD-OUT HOUSE</span>
          </span>
          <span className="text-[#8B8F98]">1-Click Preset</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {data.referenceHouses.slice(0, 6).map((preset) => {
            const isSelected =
              activePresetId === preset.id &&
              estimate.estimateMode === 'reference-exact';
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-1 ${
                  isSelected
                    ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#F2F2F2]'
                    : 'bg-[#08090B] border-[#24272D] text-[#8B8F98] hover:border-[#6EA8FE]/50 hover:text-[#F2F2F2]'
                }`}
              >
                <span className="text-[10px] font-bold text-[#F2F2F2] truncate">
                  {preset.name.split('—')[0].trim()}
                </span>
                <span className="text-[10px] font-bold text-[#7CFF6B] tabular-nums shrink-0">
                  {formatTargetValue(preset.predictedPrice, data.modelMetadata, {
                    compact: true,
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
