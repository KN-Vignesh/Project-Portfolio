import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Sliders, Home, ArrowRight } from 'lucide-react';

type QuantMode = 'FP16' | 'QLORA_NF4' | 'LORA_DECOMP';

export const ModelVisualizer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<QuantMode>('QLORA_NF4');
  const [loraRank, setLoraRank] = useState<number>(16);
  const [seqLength, setSeqLength] = useState<number>(2048);

  // Live Llama-3 8B / 7B empirical math based on user controls
  const hiddenDim = 4096;
  const numLayers = 32;
  const baseParamsB = 7.24;
  const bytesPerParam = mode === 'FP16' ? 2.0 : mode === 'LORA_DECOMP' ? 1.0 : 0.52;
  const baseWeightsGb = baseParamsB * bytesPerParam;

  const trainableParamsM =
    mode === 'FP16'
      ? 7241.0
      : Number(((4 * hiddenDim * loraRank * numLayers) / 1_000_000).toFixed(1));
  const trainablePct = ((trainableParamsM / 7241.0) * 100).toFixed(2);

  const adapterAndOptimizerGb =
    mode === 'FP16'
      ? 14.4
      : (trainableParamsM * 8.5) / 1000 + (seqLength / 2048) * 0.85;
  const totalVramGb = (baseWeightsGb + adapterAndOptimizerGb).toFixed(1);
  const vramSavedPct = Math.round((1 - Number(totalVramGb) / 28.9) * 100);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const existingCanvases = currentMount.querySelectorAll('canvas');
    existingCanvases.forEach((c) => c.remove());

    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.outline = 'none';
      currentMount.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x7cff6b, 3, 50);
    pointLight.position.set(5, 5, 8);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0x6ea8fe, 2, 50);
    secondaryLight.position.set(-6, -4, 6);
    scene.add(secondaryLight);

    const rootGroup = new THREE.Group();
    rootGroup.scale.set(0.92, 0.92, 0.92);
    scene.add(rootGroup);

    // Scale tensor blocks dynamically based on quantization mode & rank slider
    const blockScale = mode === 'QLORA_NF4' ? 0.3 : mode === 'LORA_DECOMP' ? 0.36 : 0.44;
    const adapterScale = 0.28 + (loraRank / 64) * 0.34;

    const baseBoxGeo = new THREE.BoxGeometry(blockScale, blockScale, blockScale);
    const adapterBoxGeo = new THREE.BoxGeometry(adapterScale, adapterScale, adapterScale);

    const fp16Mat = new THREE.MeshStandardMaterial({
      color: 0x6ea8fe,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85,
    });

    const nf4Mat = new THREE.MeshStandardMaterial({
      color: 0x7cff6b,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x7cff6b,
      emissiveIntensity: 0.25,
    });

    const loraMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.25,
      metalness: 0.9,
      emissive: 0xffb703,
      emissiveIntensity: 0.45,
    });

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x24272d,
      transparent: true,
      opacity: 0.5,
    });

    const gridSize = 4;
    const spacing = 1.1;
    const halfSpan = ((gridSize - 1) / 2) * spacing;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const posX = x * spacing - halfSpan;
          const posY = y * spacing - halfSpan;
          const posZ = z * spacing - halfSpan;
          const isAdapterBlock =
            mode !== 'FP16' && (x === 0 || x === gridSize - 1) && Math.abs(y - 1.5) <= 1;

          const geo = isAdapterBlock ? adapterBoxGeo : baseBoxGeo;
          const material = isAdapterBlock
            ? loraMat
            : mode === 'FP16'
            ? fp16Mat
            : mode === 'QLORA_NF4'
            ? nf4Mat
            : fp16Mat;

          const mesh = new THREE.Mesh(geo, material);
          mesh.position.set(posX, posY, posZ);
          rootGroup.add(mesh);
        }
      }
    }

    const cageSize = gridSize * spacing + 0.35;
    const cageGeo = new THREE.BoxGeometry(cageSize, cageSize, cageSize);
    const cageEdges = new THREE.EdgesGeometry(cageGeo);
    const cage = new THREE.LineSegments(cageEdges, wireMat);
    rootGroup.add(cage);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH, false);
        }
      }
    });
    resizeObserver.observe(currentMount);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        rootGroup.rotation.y += 0.004;
        rootGroup.rotation.x += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      resizeObserver.disconnect();
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      baseBoxGeo.dispose();
      adapterBoxGeo.dispose();
      cageGeo.dispose();
      cageEdges.dispose();
      fp16Mat.dispose();
      nf4Mat.dispose();
      loraMat.dispose();
      wireMat.dispose();
    };
  }, [mode, loraRank]);

  return (
    <div className="rounded-2xl border border-[#24272D] bg-[#101216] p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between font-mono text-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#24272D] z-10">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F2F2F2] uppercase tracking-wider">
              3D Tensor &amp; Quantization Explorer
            </h3>
            <p className="text-[11px] text-[#8B8F98] font-sans">
              Adjust rank &amp; precision below to see how QLoRA shrinks GPU memory
            </p>
          </div>
        </div>

        <span className="text-[10px] text-[#7CFF6B] border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-2 py-0.5 rounded font-bold">
          {mode === 'QLORA_NF4'
            ? `4-BIT NF4 (r=${loraRank})`
            : mode === 'LORA_DECOMP'
            ? `8-BIT LORA (r=${loraRank})`
            : '16-BIT FULL'}
        </span>
      </div>

      {/* 3D Canvas Area */}
      <div
        ref={mountRef}
        className="w-full h-56 sm:h-64 my-2 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden rounded-xl bg-[#08090B]/60 border border-[#24272D]/60"
      >
        <div className="absolute bottom-2 left-2.5 z-10 pointer-events-none text-[10px] text-[#8B8F98]">
          Drag to rotate 3D weights · Amber cubes = Trainable LoRA Adapters (r={loraRank})
        </div>
      </div>

      {/* Interactive Controls: Mode Buttons + Live Rank & Context Sliders */}
      <div className="space-y-2.5 py-2.5 border-t border-b border-[#24272D]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode('QLORA_NF4')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              mode === 'QLORA_NF4'
                ? 'bg-[#7CFF6B] text-[#08090B]'
                : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
            }`}
          >
            1. QLoRA (4-Bit NF4)
          </button>
          <button
            type="button"
            onClick={() => setMode('LORA_DECOMP')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              mode === 'LORA_DECOMP'
                ? 'bg-[#7CFF6B] text-[#08090B]'
                : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
            }`}
          >
            2. LoRA (8-Bit)
          </button>
          <button
            type="button"
            onClick={() => setMode('FP16')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              mode === 'FP16'
                ? 'bg-[#7CFF6B] text-[#08090B]'
                : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
            }`}
          >
            3. Full FP16
          </button>
        </div>

        {/* Interactive Rank Slider */}
        {mode !== 'FP16' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#D1D5DB] flex items-center gap-1 font-bold">
                  <Sliders className="w-3 h-3 text-[#FFB86B]" />
                  <span>Adapter Rank (r):</span>
                </span>
                <span className="text-[#FFB86B] font-bold">r = {loraRank}</span>
              </div>
              <input
                type="range"
                min={4}
                max={64}
                step={4}
                value={loraRank}
                onChange={(e) => setLoraRank(Number(e.target.value))}
                className="w-full accent-[#FFB86B] cursor-pointer"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-[#08090B] border border-[#24272D] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#D1D5DB] font-bold">Sequence Context:</span>
                <span className="text-[#6EA8FE] font-bold">{seqLength} tokens</span>
              </div>
              <input
                type="range"
                min={512}
                max={4096}
                step={512}
                value={seqLength}
                onChange={(e) => setSeqLength(Number(e.target.value))}
                className="w-full accent-[#6EA8FE] cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Live Calculated Telemetry Bar */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 text-center tabular-nums">
        <div className="bg-[#08090B] p-2 rounded-lg border border-[#24272D]">
          <div className="text-[10px] text-[#8B8F98]">GPU VRAM NEEDED</div>
          <div className="text-sm font-bold text-[#7CFF6B]">
            {totalVramGb} GB {vramSavedPct > 0 ? `(-${vramSavedPct}%)` : ''}
          </div>
        </div>
        <div className="bg-[#08090B] p-2 rounded-lg border border-[#24272D]">
          <div className="text-[10px] text-[#8B8F98]">TRAINABLE PARAMS</div>
          <div className="text-sm font-bold text-[#F2F2F2]">
            {trainableParamsM}M ({trainablePct}%)
          </div>
        </div>
        <div className="bg-[#08090B] p-2 rounded-lg border border-[#24272D]">
          <div className="text-[10px] text-[#8B8F98]">24GB GPU STATUS</div>
          <div
            className={`text-xs font-bold ${
              Number(totalVramGb) <= 24 ? 'text-[#7CFF6B]' : 'text-[#FF7B72]'
            }`}
          >
            {Number(totalVramGb) <= 24 ? '✓ Fits Single GPU' : '✗ OOM (>24GB)'}
          </div>
        </div>
      </div>

      {/* Direct Quick-Link to the Interactive 3D House Price Predictor */}
      <div className="mt-2.5 pt-2.5 border-t border-[#24272D] flex items-center justify-between">
        <span className="text-[10px] text-[#8B8F98] font-sans">
          Looking for the 3D House Price Prediction terrain?
        </span>
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#project-house-price';
          }}
          className="px-2.5 py-1 rounded-lg bg-[#7CFF6B]/15 border border-[#7CFF6B]/50 hover:bg-[#7CFF6B] text-[#7CFF6B] hover:text-[#08090B] font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Home className="w-3 h-3" />
          <span>OPEN 3D HOUSE PRICE PREDICTOR</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
