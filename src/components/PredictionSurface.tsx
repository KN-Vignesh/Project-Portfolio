import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  Grid,
  Box,
  Crosshair,
  Play,
  Pause,
  Eye,
  Home,
} from 'lucide-react';
import {
  HousePrice3DDataContract,
  HousePriceFeatureMeta,
  HousePriceReferencePreset,
  SurfaceEstimateResult,
} from '../types';
import { formatTargetValue } from '../services/housePriceSurfaceLoader';

interface PredictionSurfaceProps {
  data: HousePrice3DDataContract;
  estimate: SurfaceEstimateResult;
  features?: Record<string, number>;
  onSelectCoordinates?: (xVal: number, zVal: number) => void;
  onSelectPreset?: (preset: HousePriceReferencePreset) => void;
}

/**
 * Maps a normalized value t in [0, 1] to our scientific surface gradient:
 * 0.00 -> Deep Cobalt (#3B82F6)
 * 0.35 -> Teal Cyan (#06B6D4)
 * 0.70 -> Phosphor Emerald (#7CFF6B)
 * 1.00 -> Warm Amber (#FFB86B)
 */
export function sampleSurfaceColor(tNormalized: number, target?: THREE.Color): THREE.Color {
  const t = Math.max(0, Math.min(1, tNormalized));
  const out = target || new THREE.Color();

  const c0 = new THREE.Color(0x3b82f6);
  const c1 = new THREE.Color(0x06b6d4);
  const c2 = new THREE.Color(0x7cff6b);
  const c3 = new THREE.Color(0xffb86b);

  if (t < 0.35) {
    out.lerpColors(c0, c1, t / 0.35);
  } else if (t < 0.7) {
    out.lerpColors(c1, c2, (t - 0.35) / 0.35);
  } else {
    out.lerpColors(c2, c3, (t - 0.7) / 0.3);
  }
  return out;
}

export function sampleSurfaceHexCss(tNormalized: number): string {
  const c = sampleSurfaceColor(tNormalized);
  return `#${c.getHexString()}`;
}

export const PredictionSurface: React.FC<PredictionSurfaceProps> = ({
  data,
  estimate,
  features,
  onSelectCoordinates,
  onSelectPreset,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showDataCloud, setShowDataCloud] = useState<boolean>(true);
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(true);
  const [cameraAngles, setCameraAngles] = useState<{ theta: number; phi: number; radius: number }>({
    theta: 0.65,
    phi: 0.96,
    radius: 13.0,
  });

  // Mutable ref so the Three.js animation loop reads fresh target coordinates, house dimensions,
  // and camera orbit without tearing down and rebuilding the WebGL scene.
  const sceneStateRef = useRef({
    targetTheta: 0.65,
    targetPhi: 0.96,
    targetRadius: 13.0,
    currentTheta: 0.65,
    currentPhi: 0.96,
    currentRadius: 13.0,
    markerWorldX: 0,
    markerWorldY: 1,
    markerWorldZ: 0,
    surfaceWorldY: 1,
    currentMarkerX: 0,
    currentMarkerY: 1,
    currentMarkerZ: 0,
    houseScaleX: 1,
    houseScaleY: 1,
    houseScaleZ: 1,
    garageScale: 1,
    autoRotate: false,
    showDataCloud: true,
    showCrosshairs: true,
  });

  // References to Three.js geometry and objects updated in-place when slice or coordinates change
  const surfaceGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const wireGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const xCurveGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const zCurveGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const dataCloudRef = useRef<THREE.Points | null>(null);
  const crosshairsGroupRef = useRef<THREE.Group | null>(null);

  const xMeta: HousePriceFeatureMeta | undefined = data.features.find(
    (f) => f.id === data.surface.xAxisFeature
  );
  const zMeta: HousePriceFeatureMeta | undefined = data.features.find(
    (f) => f.id === data.surface.zAxisFeature
  );

  const { xValues, zValues, minPrediction, maxPrediction } = data.surface;
  const xMin = xValues[0];
  const xMax = xValues[xValues.length - 1];
  const zMin = zValues[0];
  const zMax = zValues[zValues.length - 1];
  const predSpan = Math.max(1, maxPrediction - minPrediction);

  // Spatial dimensions of the 3D diorama plinth
  const WORLD_SPAN_X = 7.2;
  const WORLD_SPAN_Z = 7.2;
  const WORLD_HEIGHT_Y = 3.8;
  const BASE_Y = -1.4;

  const toWorldX = useCallback(
    (xVal: number) => {
      const norm = (xVal - xMin) / Math.max(1, xMax - xMin);
      return (norm - 0.5) * WORLD_SPAN_X;
    },
    [xMin, xMax]
  );

  const toWorldZ = useCallback(
    (zVal: number) => {
      const norm = (zVal - zMin) / Math.max(1, zMax - zMin);
      return (0.5 - norm) * WORLD_SPAN_Z;
    },
    [zMin, zMax]
  );

  const toWorldY = useCallback(
    (priceVal: number) => {
      const norm = (priceVal - minPrediction) / predSpan;
      return BASE_Y + 0.25 + Math.max(0, Math.min(1.35, norm)) * WORLD_HEIGHT_Y;
    },
    [minPrediction, predSpan, BASE_Y]
  );

  // Helper to sample height on the active slice grid for drawing 3D crosshair curves
  const sampleSliceHeight = useCallback(
    (targetX: number, targetZ: number) => {
      const preds = estimate.activeSlice.predictions;
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

      const tx = xValues[i1] > xValues[i0] ? (cx - xValues[i0]) / (xValues[i1] - xValues[i0]) : 0;
      const tz = zValues[j1] > zValues[j0] ? (cz - zValues[j0]) / (zValues[j1] - zValues[j0]) : 0;

      const p =
        (1 - tx) * (1 - tz) * preds[j0][i0] +
        tx * (1 - tz) * preds[j0][i1] +
        (1 - tx) * tz * preds[j1][i0] +
        tx * tz * preds[j1][i1];

      return toWorldY(p);
    },
    [estimate.activeSlice.predictions, xMin, xMax, zMin, zMax, xValues, zValues, toWorldY]
  );

  // Sync marker world coordinates, 3D house model proportions, and crosshair curves
  useEffect(() => {
    const wx = toWorldX(estimate.xValue);
    const wz = toWorldZ(estimate.zValue);
    const surfWy = toWorldY(estimate.surfaceConditionalPrice ?? estimate.predictedPrice);
    const predWy = toWorldY(estimate.predictedPrice);

    sceneStateRef.current.markerWorldX = wx;
    sceneStateRef.current.markerWorldZ = wz;
    sceneStateRef.current.surfaceWorldY = surfWy;
    sceneStateRef.current.markerWorldY = predWy;

    // Proportions for the 3D miniature house sitting on the marker
    const sqftNorm = Math.max(0.65, Math.min(1.65, (estimate.xValue - 600) / 1800 + 0.7));
    const qualNorm = Math.max(0.7, Math.min(1.55, (estimate.zValue - 3) / 6 + 0.75));
    const garageVal = features?.GarageArea ?? 480;
    const garageNorm = Math.max(0.15, Math.min(1.5, garageVal / 550));

    sceneStateRef.current.houseScaleX = sqftNorm;
    sceneStateRef.current.houseScaleZ = Math.sqrt(sqftNorm);
    sceneStateRef.current.houseScaleY = qualNorm;
    sceneStateRef.current.garageScale = garageNorm;

    // Update 3D crosshair slice curves along X and Z
    if (xCurveGeoRef.current) {
      const pos = xCurveGeoRef.current.getAttribute('position') as THREE.BufferAttribute;
      if (pos && pos.count === xValues.length) {
        for (let i = 0; i < xValues.length; i++) {
          const xVal = xValues[i];
          pos.setXYZ(i, toWorldX(xVal), sampleSliceHeight(xVal, estimate.zValue) + 0.035, wz);
        }
        pos.needsUpdate = true;
      }
    }

    if (zCurveGeoRef.current) {
      const pos = zCurveGeoRef.current.getAttribute('position') as THREE.BufferAttribute;
      if (pos && pos.count === zValues.length) {
        for (let j = 0; j < zValues.length; j++) {
          const zVal = zValues[j];
          pos.setXYZ(j, wx, sampleSliceHeight(estimate.xValue, zVal) + 0.035, toWorldZ(zVal));
        }
        pos.needsUpdate = true;
      }
    }
  }, [
    estimate.xValue,
    estimate.zValue,
    estimate.surfaceConditionalPrice,
    estimate.predictedPrice,
    features,
    xValues,
    zValues,
    toWorldX,
    toWorldZ,
    toWorldY,
    sampleSliceHeight,
  ]);

  useEffect(() => {
    sceneStateRef.current.targetTheta = cameraAngles.theta;
    sceneStateRef.current.targetPhi = cameraAngles.phi;
    sceneStateRef.current.targetRadius = cameraAngles.radius;
  }, [cameraAngles]);

  useEffect(() => {
    sceneStateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    sceneStateRef.current.showDataCloud = showDataCloud;
    if (dataCloudRef.current) {
      dataCloudRef.current.visible = showDataCloud;
    }
  }, [showDataCloud]);

  useEffect(() => {
    sceneStateRef.current.showCrosshairs = showCrosshairs;
    if (crosshairsGroupRef.current) {
      crosshairsGroupRef.current.visible = showCrosshairs;
    }
  }, [showCrosshairs]);

  // Update vertex heights and colors in-place when activeSlice changes
  useEffect(() => {
    const geo = surfaceGeoRef.current;
    const wireGeo = wireGeoRef.current;
    if (!geo) return;

    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = geo.getAttribute('color') as THREE.BufferAttribute;
    if (!posAttr || !colorAttr) return;

    const predictions = estimate.activeSlice.predictions;
    const zCount = zValues.length;
    const xCount = xValues.length;
    const tempColor = new THREE.Color();

    let idx = 0;
    for (let zi = 0; zi < zCount; zi++) {
      for (let xi = 0; xi < xCount; xi++) {
        const pred = predictions[zi][xi];
        const wy = toWorldY(pred);
        posAttr.setY(idx, wy);

        const normPrice = (pred - minPrediction) / predSpan;
        sampleSurfaceColor(normPrice, tempColor);
        colorAttr.setXYZ(idx, tempColor.r, tempColor.g, tempColor.b);
        idx++;
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    geo.computeVertexNormals();

    if (wireGeo) {
      const wirePos = wireGeo.getAttribute('position') as THREE.BufferAttribute;
      if (wirePos) {
        for (let i = 0; i < posAttr.count; i++) {
          wirePos.setY(i, posAttr.getY(i) + 0.012);
        }
        wirePos.needsUpdate = true;
      }
    }
  }, [
    estimate.activeSlice,
    xValues,
    zValues,
    minPrediction,
    predSpan,
    toWorldY,
  ]);

  // Primary Three.js Scene Lifecycle Effect
  useEffect(() => {
    if (viewMode !== '3d') return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 400;

    container.querySelectorAll('canvas').forEach((c) => c.remove());

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x08090b, 1);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.outline = 'none';
      container.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      setViewMode('2d');
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.024);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    // Studio & Diorama lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 1.0);
    hemiLight.position.set(0, 12, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    keyLight.position.set(8, 14, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(-9, 6, -8);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Elevated Terrarium / Instrument Plinth Base
    const plinthThickness = 0.28;
    const plinthGeo = new THREE.BoxGeometry(
      WORLD_SPAN_X + 0.9,
      plinthThickness,
      WORLD_SPAN_Z + 0.9
    );
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x101216,
      roughness: 0.75,
      metalness: 0.2,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.set(0, BASE_Y - plinthThickness / 2 - 0.02, 0);
    rootGroup.add(plinthMesh);

    const plinthEdges = new THREE.EdgesGeometry(plinthGeo);
    const plinthLineMat = new THREE.LineBasicMaterial({
      color: 0x24272d,
      transparent: true,
      opacity: 0.9,
    });
    const plinthWire = new THREE.LineSegments(plinthEdges, plinthLineMat);
    plinthMesh.add(plinthWire);

    const gridHelper = new THREE.GridHelper(
      WORLD_SPAN_X,
      8,
      0x334155,
      0x1e293b
    );
    gridHelper.position.set(0, BASE_Y + 0.005, 0);
    rootGroup.add(gridHelper);

    // 2. Construct Indexed BufferGeometry for the Prediction Surface
    const xCount = xValues.length;
    const zCount = zValues.length;
    const vertexCount = xCount * zCount;

    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);
    const indices: number[] = [];

    const predictions = estimate.activeSlice.predictions;
    const tempColor = new THREE.Color();

    let vIdx = 0;
    for (let zi = 0; zi < zCount; zi++) {
      const wz = toWorldZ(zValues[zi]);
      for (let xi = 0; xi < xCount; xi++) {
        const wx = toWorldX(xValues[xi]);
        const pred = predictions[zi][xi];
        const wy = toWorldY(pred);

        positions[vIdx * 3] = wx;
        positions[vIdx * 3 + 1] = wy;
        positions[vIdx * 3 + 2] = wz;

        const normPrice = (pred - minPrediction) / predSpan;
        sampleSurfaceColor(normPrice, tempColor);
        colors[vIdx * 3] = tempColor.r;
        colors[vIdx * 3 + 1] = tempColor.g;
        colors[vIdx * 3 + 2] = tempColor.b;

        vIdx++;
      }
    }

    for (let zi = 0; zi < zCount - 1; zi++) {
      for (let xi = 0; xi < xCount - 1; xi++) {
        const a = zi * xCount + xi;
        const b = zi * xCount + (xi + 1);
        const c = (zi + 1) * xCount + xi;
        const d = (zi + 1) * xCount + (xi + 1);

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const surfaceGeo = new THREE.BufferGeometry();
    surfaceGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    surfaceGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    surfaceGeo.setIndex(indices);
    surfaceGeo.computeVertexNormals();
    surfaceGeoRef.current = surfaceGeo;

    const surfaceMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.36,
      metalness: 0.14,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.93,
    });
    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
    rootGroup.add(surfaceMesh);

    const wireGeo = surfaceGeo.clone();
    const wirePosAttr = wireGeo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < wirePosAttr.count; i++) {
      wirePosAttr.setY(i, wirePosAttr.getY(i) + 0.012);
    }
    wireGeoRef.current = wireGeo;

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    rootGroup.add(wireMesh);

    // 3. Interactive 3D Slice Crosshair Curves (Emerald X-curve + Blue Z-curve)
    const crosshairsGroup = new THREE.Group();
    crosshairsGroup.visible = sceneStateRef.current.showCrosshairs;
    rootGroup.add(crosshairsGroup);
    crosshairsGroupRef.current = crosshairsGroup;

    const xCurvePositions = new Float32Array(xCount * 3);
    for (let i = 0; i < xCount; i++) {
      const xv = xValues[i];
      xCurvePositions[i * 3] = toWorldX(xv);
      xCurvePositions[i * 3 + 1] = sampleSliceHeight(xv, estimate.zValue) + 0.035;
      xCurvePositions[i * 3 + 2] = toWorldZ(estimate.zValue);
    }
    const xCurveGeo = new THREE.BufferGeometry();
    xCurveGeo.setAttribute('position', new THREE.BufferAttribute(xCurvePositions, 3));
    xCurveGeoRef.current = xCurveGeo;
    const xCurveMat = new THREE.LineBasicMaterial({ color: 0x7cff6b, linewidth: 2 });
    const xCurveLine = new THREE.Line(xCurveGeo, xCurveMat);
    crosshairsGroup.add(xCurveLine);

    const zCurvePositions = new Float32Array(zCount * 3);
    for (let j = 0; j < zCount; j++) {
      const zv = zValues[j];
      zCurvePositions[j * 3] = toWorldX(estimate.xValue);
      zCurvePositions[j * 3 + 1] = sampleSliceHeight(estimate.xValue, zv) + 0.035;
      zCurvePositions[j * 3 + 2] = toWorldZ(zv);
    }
    const zCurveGeo = new THREE.BufferGeometry();
    zCurveGeo.setAttribute('position', new THREE.BufferAttribute(zCurvePositions, 3));
    zCurveGeoRef.current = zCurveGeo;
    const zCurveMat = new THREE.LineBasicMaterial({ color: 0x6ea8fe, linewidth: 2 });
    const zCurveLine = new THREE.Line(zCurveGeo, zCurveMat);
    crosshairsGroup.add(zCurveLine);

    // 4. Held-Out Real Homes 3D Point Cloud (1,458 validation houses)
    const validEvalPoints = data.evaluation.actualVsPredicted.filter(
      (pt) => typeof pt.grLivArea === 'number' && typeof pt.overallQual === 'number'
    );
    const cloudGeo = new THREE.BufferGeometry();
    const cloudPos = new Float32Array(validEvalPoints.length * 3);
    const cloudColors = new Float32Array(validEvalPoints.length * 3);

    validEvalPoints.forEach((pt, i) => {
      cloudPos[i * 3] = toWorldX(pt.grLivArea!);
      cloudPos[i * 3 + 1] = toWorldY(pt.actual);
      cloudPos[i * 3 + 2] = toWorldZ(pt.overallQual!);

      const norm = (pt.actual - minPrediction) / predSpan;
      sampleSurfaceColor(norm, tempColor);
      cloudColors[i * 3] = tempColor.r;
      cloudColors[i * 3 + 1] = tempColor.g;
      cloudColors[i * 3 + 2] = tempColor.b;
    });

    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3));
    cloudGeo.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));
    const cloudMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
    });
    const dataCloud = new THREE.Points(cloudGeo, cloudMat);
    dataCloud.visible = sceneStateRef.current.showDataCloud;
    rootGroup.add(dataCloud);
    dataCloudRef.current = dataCloud;

    // 5. Reference House Landmarks on the 3D Surface
    const refMarkerGroup = new THREE.Group();
    rootGroup.add(refMarkerGroup);

    const refPinMeshes: Array<{ mesh: THREE.Mesh; preset: HousePriceReferencePreset }> = [];
    const refSphereGeo = new THREE.SphereGeometry(0.11, 16, 16);

    data.referenceHouses.forEach((preset) => {
      const rx =
        preset.surfaceCoordinates?.xGrLivArea ??
        preset.features[data.surface.xAxisFeature] ??
        xMin;
      const rz =
        preset.surfaceCoordinates?.yOverallQual ??
        preset.features[data.surface.zAxisFeature] ??
        zMin;
      const ry =
        preset.surfaceCoordinates?.zPredictedUsd ?? preset.predictedPrice;

      const wx = toWorldX(rx);
      const wz = toWorldZ(rz);
      const wy = toWorldY(ry);

      const pinMat = new THREE.MeshStandardMaterial({
        color: 0x6ea8fe,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.55,
        roughness: 0.25,
      });
      const pinMesh = new THREE.Mesh(refSphereGeo, pinMat);
      pinMesh.position.set(wx, wy + 0.08, wz);
      refMarkerGroup.add(pinMesh);
      refPinMeshes.push({ mesh: pinMesh, preset });

      const stemGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(wx, BASE_Y, wz),
        new THREE.Vector3(wx, wy + 0.08, wz),
      ]);
      const stemMat = new THREE.LineBasicMaterial({
        color: 0x6ea8fe,
        transparent: true,
        opacity: 0.35,
      });
      refMarkerGroup.add(new THREE.Line(stemGeo, stemMat));
    });

    // 6. Active Selected Property Beacon + Dynamic 3D Miniature House Model
    const activeBeaconGroup = new THREE.Group();
    rootGroup.add(activeBeaconGroup);

    // Glowing ring on the surface
    const beaconRingGeo = new THREE.RingGeometry(0.24, 0.36, 32);
    beaconRingGeo.rotateX(-Math.PI / 2);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0x7cff6b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    activeBeaconGroup.add(beaconRing);

    // Composite 3D Miniature House Group sitting at the selected point
    const miniHouseGroup = new THREE.Group();
    activeBeaconGroup.add(miniHouseGroup);

    // Main house body
    const houseBodyGeo = new THREE.BoxGeometry(0.42, 0.32, 0.36);
    houseBodyGeo.translate(0, 0.16, 0);
    const houseBodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0x7cff6b,
      emissiveIntensity: 0.22,
      roughness: 0.3,
      metalness: 0.1,
    });
    const houseBodyMesh = new THREE.Mesh(houseBodyGeo, houseBodyMat);
    miniHouseGroup.add(houseBodyMesh);

    // Pitched Roof (4-sided pyramid cone)
    const roofGeo = new THREE.ConeGeometry(0.36, 0.24, 4);
    roofGeo.rotateY(Math.PI / 4);
    roofGeo.translate(0, 0.44, 0);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x7cff6b,
      emissive: 0x7cff6b,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.3,
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    miniHouseGroup.add(roofMesh);

    // Attached Garage Wing
    const garageGeo = new THREE.BoxGeometry(0.24, 0.22, 0.28);
    garageGeo.translate(0.31, 0.11, 0.02);
    const garageMat = new THREE.MeshStandardMaterial({
      color: 0x6ea8fe,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.3,
      roughness: 0.4,
    });
    const garageMesh = new THREE.Mesh(garageGeo, garageMat);
    miniHouseGroup.add(garageMesh);

    // Vertical laser drop-line from the active prediction down to the plinth floor
    const dropLinePositions = new Float32Array([0, BASE_Y, 0, 0, 1, 0]);
    const dropLineGeo = new THREE.BufferGeometry();
    dropLineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(dropLinePositions, 3)
    );
    const dropLineMat = new THREE.LineBasicMaterial({
      color: 0x7cff6b,
      transparent: true,
      opacity: 0.9,
    });
    const dropLine = new THREE.Line(dropLineGeo, dropLineMat);
    rootGroup.add(dropLine);

    // Initialize marker positions
    sceneStateRef.current.currentMarkerX = sceneStateRef.current.markerWorldX;
    sceneStateRef.current.currentMarkerY = sceneStateRef.current.markerWorldY;
    sceneStateRef.current.currentMarkerZ = sceneStateRef.current.markerWorldZ;

    // 7. Pointer Orbit + Surface Click/Drag Raycasting
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    let isDraggingOrbit = false;
    let isDraggingSurfacePin = false;
    let pointerDownX = 0;
    let pointerDownY = 0;
    let prevX = 0;
    let prevY = 0;

    const sampleSurfaceFromEvent = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -(((clientY - rect.top) / rect.height) * 2 + 1) + 2;

      raycaster.setFromCamera(pointerNdc, camera);

      const pinHits = raycaster.intersectObjects(
        refPinMeshes.map((p) => p.mesh)
      );
      if (pinHits.length > 0 && !isDraggingSurfacePin) {
        const hitPin = refPinMeshes.find((p) => p.mesh === pinHits[0].object);
        if (hitPin && onSelectPreset) {
          onSelectPreset(hitPin.preset);
          return true;
        }
      }

      const surfHits = raycaster.intersectObject(surfaceMesh);
      if (surfHits.length > 0 && onSelectCoordinates) {
        const pt = surfHits[0].point;
        const normX = pt.x / WORLD_SPAN_X + 0.5;
        const normZ = 0.5 - pt.z / WORLD_SPAN_Z;

        const rawXVal = xMin + normX * (xMax - xMin);
        const rawZVal = zMin + normZ * (zMax - zMin);

        const xStep = xMeta?.step || 20;
        const zStep = zMeta?.step || 1;

        const snappedX = Math.max(
          xMin,
          Math.min(xMax, Math.round(rawXVal / xStep) * xStep)
        );
        const snappedZ = Math.max(
          zMin,
          Math.min(zMax, Math.round(rawZVal / zStep) * zStep)
        );

        onSelectCoordinates(snappedX, snappedZ);
        return true;
      }
      return false;
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      pointerDownX = clientX;
      pointerDownY = clientY;
      prevX = clientX;
      prevY = clientY;

      // If Shift key is held, drag the house pin directly across the surface
      if ('shiftKey' in e && e.shiftKey) {
        isDraggingSurfacePin = true;
        sampleSurfaceFromEvent(clientX, clientY);
      } else {
        isDraggingOrbit = true;
      }
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDraggingSurfacePin) {
        sampleSurfaceFromEvent(clientX, clientY);
        return;
      }

      if (!isDraggingOrbit) return;
      const dx = clientX - prevX;
      const dy = clientY - prevY;
      prevX = clientX;
      prevY = clientY;

      sceneStateRef.current.targetTheta -= dx * 0.0075;
      sceneStateRef.current.targetPhi = Math.max(
        0.32,
        Math.min(1.42, sceneStateRef.current.targetPhi - dy * 0.0065)
      );
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if (isDraggingSurfacePin) {
        isDraggingSurfacePin = false;
        return;
      }
      if (!isDraggingOrbit) return;
      isDraggingOrbit = false;

      const clientX =
        'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY =
        'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
      const moveDist = Math.hypot(clientX - pointerDownX, clientY - pointerDownY);

      // Treat short click/tap (< 6px drag) as interactive surface/pin selection
      if (moveDist < 6) {
        sampleSurfaceFromEvent(clientX, clientY);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sceneStateRef.current.targetRadius = Math.max(
        8.0,
        Math.min(20, sceneStateRef.current.targetRadius + e.deltaY * 0.006)
      );
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh, false);
        }
      }
    });
    resizeObserver.observe(container);

    let animFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const st = sceneStateRef.current;

      if (st.autoRotate && !isDraggingOrbit && !isDraggingSurfacePin) {
        st.targetTheta += 0.0035;
      }

      // Smooth damped camera interpolation
      st.currentTheta += (st.targetTheta - st.currentTheta) * 0.12;
      st.currentPhi += (st.targetPhi - st.currentPhi) * 0.12;
      st.currentRadius += (st.targetRadius - st.currentRadius) * 0.12;

      camera.position.x =
        st.currentRadius * Math.sin(st.currentPhi) * Math.sin(st.currentTheta);
      camera.position.y = st.currentRadius * Math.cos(st.currentPhi);
      camera.position.z =
        st.currentRadius * Math.sin(st.currentPhi) * Math.cos(st.currentTheta);
      camera.lookAt(0, 0.25, 0);

      // Smooth damped active marker & 3D house position
      st.currentMarkerX += (st.markerWorldX - st.currentMarkerX) * 0.18;
      st.currentMarkerY += (st.markerWorldY - st.currentMarkerY) * 0.18;
      st.currentMarkerZ += (st.markerWorldZ - st.currentMarkerZ) * 0.18;

      activeBeaconGroup.position.set(
        st.currentMarkerX,
        st.currentMarkerY + 0.04,
        st.currentMarkerZ
      );

      // Scale 3D miniature house dynamically with Living Area, Quality, and Garage sliders
      miniHouseGroup.scale.set(
        st.houseScaleX,
        st.houseScaleY,
        st.houseScaleZ
      );
      garageMesh.scale.set(st.garageScale, 1, 1);
      garageMesh.visible = st.garageScale > 0.18;

      const pulse = 1 + Math.sin(elapsed * 3.2) * 0.12;
      beaconRing.scale.set(pulse, pulse, 1);

      const linePos = dropLine.geometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;
      linePos.setXYZ(0, st.currentMarkerX, BASE_Y, st.currentMarkerZ);
      linePos.setXYZ(
        1,
        st.currentMarkerX,
        st.currentMarkerY + 0.04,
        st.currentMarkerZ
      );
      linePos.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domEl.removeEventListener('wheel', onWheel);

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }

      surfaceGeo.dispose();
      surfaceMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      xCurveGeo.dispose();
      xCurveMat.dispose();
      zCurveGeo.dispose();
      zCurveMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      plinthGeo.dispose();
      plinthMat.dispose();
      plinthEdges.dispose();
      plinthLineMat.dispose();
      refSphereGeo.dispose();
      houseBodyGeo.dispose();
      houseBodyMat.dispose();
      roofGeo.dispose();
      roofMat.dispose();
      garageGeo.dispose();
      garageMat.dispose();
      beaconRingGeo.dispose();
      beaconRingMat.dispose();
      dropLineGeo.dispose();
      dropLineMat.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, data]);

  const handleSetCameraPreset = (preset: 'iso' | 'front' | 'top') => {
    setAutoRotate(false);
    if (preset === 'iso') {
      setCameraAngles({ theta: 0.65, phi: 0.96, radius: 13.0 });
    } else if (preset === 'front') {
      setCameraAngles({ theta: 0.05, phi: 1.18, radius: 13.2 });
    } else if (preset === 'top') {
      setCameraAngles({ theta: 0.0, phi: 0.35, radius: 14.5 });
    }
  };

  const handleZoom = (delta: number) => {
    setCameraAngles((prev) => ({
      ...prev,
      radius: Math.max(8.0, Math.min(20, prev.radius + delta)),
    }));
  };

  const handleCanvasKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCameraAngles((p) => ({ ...p, theta: p.theta - 0.14 }));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCameraAngles((p) => ({ ...p, theta: p.theta + 0.14 }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCameraAngles((p) => ({
        ...p,
        phi: Math.max(0.35, p.phi - 0.1),
      }));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCameraAngles((p) => ({
        ...p,
        phi: Math.min(1.42, p.phi + 0.1),
      }));
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      handleSetCameraPreset('iso');
    }
  };

  const deltaFromAverage = estimate.predictedPrice - estimate.baselinePrice;

  return (
    <div className="rounded-xl border border-[#24272D] bg-[#08090B] overflow-hidden flex flex-col justify-between h-full">
      {/* Top Easy-to-Use Camera & View Controls Bar */}
      <div className="px-3.5 py-2.5 bg-[#101216] border-b border-[#24272D] flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <Compass className="w-4 h-4 text-[#7CFF6B] shrink-0" />
          <span className="font-bold text-[#F2F2F2] truncate">
            3D PRICE TERRAIN &amp; HOUSE MODEL
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {webglSupported && (
            <div className="flex items-center rounded-lg bg-[#08090B] border border-[#24272D] p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === '3d'
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Box className="w-3 h-3" />
                <span>3D Terrain</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === '2d'
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Grid className="w-3 h-3" />
                <span>2D Price Grid</span>
              </button>
            </div>
          )}

          {viewMode === '3d' && (
            <>
              {/* Camera Angle Quick Buttons */}
              <div className="hidden sm:flex items-center rounded-lg bg-[#08090B] border border-[#24272D] p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleSetCameraPreset('iso')}
                  className="px-2 py-0.5 rounded text-[#D1D5DB] hover:bg-[#161920] hover:text-[#7CFF6B] cursor-pointer"
                  title="Default 3D Isometric Angle"
                >
                  3D Angle
                </button>
                <button
                  type="button"
                  onClick={() => handleSetCameraPreset('front')}
                  className="px-2 py-0.5 rounded text-[#D1D5DB] hover:bg-[#161920] hover:text-[#7CFF6B] cursor-pointer"
                  title="Side Elevation Price Slope"
                >
                  Slope View
                </button>
                <button
                  type="button"
                  onClick={() => handleSetCameraPreset('top')}
                  className="px-2 py-0.5 rounded text-[#D1D5DB] hover:bg-[#161920] hover:text-[#7CFF6B] cursor-pointer"
                  title="Top-Down Heatmap View"
                >
                  Top Map
                </button>
              </div>

              {/* Auto-Rotate Toggle */}
              <button
                type="button"
                onClick={() => setAutoRotate((p) => !p)}
                className={`px-2 py-1 rounded border flex items-center gap-1 text-[10px] cursor-pointer transition-colors ${
                  autoRotate
                    ? 'bg-[#7CFF6B]/15 border-[#7CFF6B] text-[#7CFF6B] font-bold'
                    : 'bg-[#08090B] border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
                title="Toggle automatic 3D turntable rotation"
              >
                {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{autoRotate ? 'Spinning' : 'Spin 3D'}</span>
              </button>

              {/* Show 1,458 Real Homes Cloud Toggle */}
              <button
                type="button"
                onClick={() => setShowDataCloud((p) => !p)}
                className={`px-2 py-1 rounded border flex items-center gap-1 text-[10px] cursor-pointer transition-colors ${
                  showDataCloud
                    ? 'bg-[#6EA8FE]/15 border-[#6EA8FE]/60 text-[#6EA8FE] font-bold'
                    : 'bg-[#08090B] border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
                title="Show or hide the 1,458 real Ames houses in 3D space"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden md:inline">1,458 Homes</span>
              </button>

              <button
                type="button"
                onClick={() => handleZoom(-1.5)}
                className="p-1 rounded bg-[#08090B] border border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] cursor-pointer"
                title="Zoom In"
                aria-label="Zoom in 3D surface"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(1.5)}
                className="p-1 rounded bg-[#08090B] border border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] cursor-pointer"
                title="Zoom Out"
                aria-label="Zoom out 3D surface"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Viewport: 3D WebGL Canvas OR Accessible 2D Contour Matrix */}
      {viewMode === '3d' && webglSupported ? (
        <div
          ref={mountRef}
          tabIndex={0}
          role="region"
          aria-label={`Interactive 3D House Price Prediction Surface. Selected Living Area is ${estimate.xValue} sq ft, Quality is ${estimate.zValue}/10, predicted price is ${formatTargetValue(estimate.predictedPrice, data.modelMetadata)}.`}
          onKeyDown={handleCanvasKeyDown}
          className="relative w-full h-[360px] sm:h-[430px] bg-[#08090B] cursor-grab active:cursor-grabbing focus:outline-none focus:ring-1 focus:ring-[#7CFF6B]/50 select-none"
        >
          {/* Top-Left Clear & Friendly Live Property Card */}
          <div className="pointer-events-none absolute top-3 left-3 z-10 max-w-[260px] sm:max-w-[290px] rounded-xl bg-[#08090B]/90 backdrop-blur-md border border-[#24272D] p-3 font-mono space-y-2 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#7CFF6B]">
                <Home className="w-3.5 h-3.5" />
                <span>
                  {estimate.referenceHouse
                    ? estimate.referenceHouse.name
                    : 'CUSTOM HOME CONFIG'}
                </span>
              </span>
              <span
                className={`text-[10px] font-bold tabular-nums ${
                  deltaFromAverage >= 0 ? 'text-[#7CFF6B]' : 'text-[#FFB86B]'
                }`}
              >
                {formatTargetValue(deltaFromAverage, data.modelMetadata, {
                  showPositiveSign: true,
                  compact: true,
                })}{' '}
                vs avg
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-3">
              <div>
                <span className="text-[9px] text-[#8B8F98] block uppercase">
                  PREDICTED SALE PRICE
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#7CFF6B] tabular-nums">
                  {formatTargetValue(estimate.predictedPrice, data.modelMetadata)}
                </span>
              </div>

              {estimate.referenceHouse?.actualPrice !== undefined && (
                <div className="text-right">
                  <span className="text-[9px] text-[#8B8F98] block uppercase">
                    ACTUAL SOLD
                  </span>
                  <span className="text-xs font-bold text-[#F2F2F2] tabular-nums">
                    {formatTargetValue(
                      estimate.referenceHouse.actualPrice,
                      data.modelMetadata
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-1.5 border-t border-[#24272D]/80 grid grid-cols-2 gap-2 text-[10px] text-[#D1D5DB] tabular-nums">
              <div>
                <span className="text-[#7CFF6B] block text-[9px] font-bold">
                  Living Area (X)
                </span>
                <span className="font-bold">
                  {estimate.xValue.toLocaleString()} sq ft
                </span>
              </div>
              <div>
                <span className="text-[#6EA8FE] block text-[9px] font-bold">
                  Quality Rating (Z)
                </span>
                <span className="font-bold">
                  Level {estimate.zValue} / 10
                </span>
              </div>
            </div>
          </div>

          {/* Bottom-Left Simple How-to-Interact Guide */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-lg bg-[#08090B]/90 backdrop-blur-sm border border-[#24272D] px-3 py-2 font-sans text-[11px] text-[#D1D5DB] space-y-0.5 max-w-xs">
            <div className="font-mono text-[10px] font-bold text-[#7CFF6B] uppercase">
              How to Explore in 3D:
            </div>
            <div className="text-[11px] text-[#8B8F98] leading-snug">
              • <strong className="text-[#F2F2F2]">Click anywhere on the 3D surface</strong> to move the house pin
              <br />• <strong className="text-[#F2F2F2]">Drag</strong> to rotate camera · <strong className="text-[#F2F2F2]">Scroll</strong> to zoom
            </div>
          </div>

          {/* Bottom-Right Price Color Scale Legend */}
          <div className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-lg bg-[#08090B]/90 backdrop-blur-sm border border-[#24272D] p-2.5 font-mono text-[9px] text-[#8B8F98] w-44 space-y-1">
            <div className="flex justify-between text-[#D1D5DB] font-bold">
              <span>LOWER PRICE</span>
              <span>HIGHER PRICE</span>
            </div>
            <div
              className="h-2.5 w-full rounded-sm"
              style={{
                background:
                  'linear-gradient(90deg, #3B82F6 0%, #06B6D4 35%, #7CFF6B 70%, #FFB86B 100%)',
              }}
            />
            <div className="flex justify-between tabular-nums text-[9px] text-[#D1D5DB]">
              <span>
                {formatTargetValue(minPrediction, data.modelMetadata, {
                  compact: true,
                })}
              </span>
              <span>
                {formatTargetValue(
                  (minPrediction + maxPrediction) / 2,
                  data.modelMetadata,
                  { compact: true }
                )}
              </span>
              <span>
                {formatTargetValue(maxPrediction, data.modelMetadata, {
                  compact: true,
                })}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Accessible 2D Heatmap Matrix View (Sampled to clean 10x10 readable grid) */
        <div className="p-4 bg-[#08090B] space-y-3 font-mono text-xs flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#7CFF6B] block">
                2D INTERACTIVE PRICE TABLE (CLICK ANY CELL TO SELECT)
              </span>
              <span className="text-[11px] text-[#8B8F98] font-sans">
                Rows show Overall Quality (1–10) and columns show Living Area (sq ft).
              </span>
            </div>
            <span className="px-2.5 py-1 rounded border border-[#7CFF6B]/40 bg-[#7CFF6B]/10 text-[#7CFF6B] text-xs font-bold">
              Selected: {formatTargetValue(estimate.predictedPrice, data.modelMetadata)}
            </span>
          </div>

          <div className="overflow-x-auto">
            {(() => {
              const colStep = Math.max(1, Math.floor(xValues.length / 8));
              const sampledXIndices = xValues
                .map((_, idx) => idx)
                .filter((idx) => idx % colStep === 0 || idx === xValues.length - 1);
              return (
                <table className="w-full border-collapse text-[10px] tabular-nums">
                  <thead>
                    <tr>
                      <th className="p-1.5 border border-[#24272D] bg-[#101216] text-left text-[#8B8F98]">
                        Quality \ Sq Ft
                      </th>
                      {sampledXIndices.map((xi) => (
                        <th
                          key={xValues[xi]}
                          className="p-1.5 border border-[#24272D] bg-[#101216] text-center text-[#D1D5DB]"
                        >
                          {xValues[xi].toLocaleString()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...zValues].reverse().map((zv, revIdx) => {
                      const zi = zValues.length - 1 - revIdx;
                      return (
                        <tr key={zv}>
                          <td className="p-1.5 border border-[#24272D] bg-[#101216] font-bold text-[#6EA8FE]">
                            Qual {zv}/10
                          </td>
                          {sampledXIndices.map((xi) => {
                            const xv = xValues[xi];
                            const cellVal = estimate.activeSlice.predictions[zi][xi];
                            const norm = (cellVal - minPrediction) / predSpan;
                            const bgHex = sampleSurfaceHexCss(norm);
                            const isSelected =
                              Math.abs(estimate.xValue - xv) < 180 &&
                              Math.abs(estimate.zValue - zv) < 0.6;
                            return (
                              <td key={xv} className="p-0.5 border border-[#24272D]">
                                <button
                                  type="button"
                                  onClick={() => onSelectCoordinates?.(xv, zv)}
                                  className={`w-full py-1.5 px-1 rounded text-center transition-all cursor-pointer ${
                                    isSelected
                                      ? 'ring-2 ring-white font-bold text-[#08090B]'
                                      : 'text-[#08090B] font-semibold opacity-90 hover:opacity-100'
                                  }`}
                                  style={{ backgroundColor: bgHex }}
                                >
                                  {formatTargetValue(cellVal, data.modelMetadata, {
                                    compact: true,
                                  })}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      )}

      {/* Bottom Bar: One-Click Real Reference Homes */}
      <div className="px-3.5 py-2.5 bg-[#101216] border-t border-[#24272D] flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-[#D1D5DB] font-bold">
          <Crosshair className="w-3.5 h-3.5 text-[#7CFF6B]" />
          <span>JUMP TO A REAL AMES HOME:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.referenceHouses.slice(0, 5).map((preset) => {
            const isActive = estimate.referenceHouse?.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset?.(preset)}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer tabular-nums ${
                  isActive
                    ? 'bg-[#7CFF6B] border-[#7CFF6B] text-[#08090B] font-bold'
                    : 'bg-[#08090B] border-[#24272D] text-[#D1D5DB] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/50'
                }`}
              >
                {preset.name.split('—')[0].trim()} (
                {formatTargetValue(preset.predictedPrice, data.modelMetadata, {
                  compact: true,
                })}
                )
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
