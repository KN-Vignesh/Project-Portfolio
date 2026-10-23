import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Cpu, Sliders, Home, ArrowRight } from 'lucide-react';
import { SwiftRollLabel } from './ScrollReveal';

type QuantMode = 'FP16' | 'QLORA_NF4' | 'LORA_DECOMP';

export const ModelVisualizer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<QuantMode>('QLORA_NF4');
  const [loraRank, setLoraRank] = useState<number>(16);
  const [seqLength, setSeqLength] = useState<number>(2048);

  const targetStateRef = useRef<{ mode: QuantMode; loraRank: number }>({
    mode: 'QLORA_NF4',
    loraRank: 16,
  });

  useEffect(() => {
    targetStateRef.current.mode = mode;
    targetStateRef.current.loraRank = loraRank;
  }, [mode, loraRank]);

  // Live Llama-3 8B / 7B empirical math based on user controls
  const hiddenDim = 4096;
  const numLayers = 32;
  const baseParamsB = 7.24;
  const bytesPerParam =
    mode === 'FP16' ? 2.0 : mode === 'LORA_DECOMP' ? 1.0 : 0.52;
  const baseWeightsGb = baseParamsB * bytesPerParam;

  const trainableParamsM =
    mode === 'FP16'
      ? 7241.0
      : Number(
          ((4 * hiddenDim * loraRank * numLayers) / 1_000_000).toFixed(1)
        );
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

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16.5);

    let renderer: THREE.WebGLRenderer;
    let envTexture: THREE.Texture | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.setSize(width, height);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
      );
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.outline = 'none';
      currentMount.appendChild(renderer.domElement);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      envTexture = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture;
      scene.environment = envTexture;
      pmremGenerator.dispose();
    } catch {
      return;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x7cff6b, 3.2, 50);
    pointLight.position.set(5, 5, 8);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0x6ea8fe, 2.2, 50);
    secondaryLight.position.set(-6, -4, 6);
    scene.add(secondaryLight);

    const rootGroup = new THREE.Group();
    rootGroup.scale.set(0.92, 0.92, 0.92);
    scene.add(rootGroup);

    const unitBoxGeo = new THREE.BoxGeometry(1, 1, 1);

    const fp16Mat = new THREE.MeshStandardMaterial({
      color: 0x6ea8fe,
      roughness: 0.25,
      metalness: 0.75,
      transparent: true,
      opacity: 0.88,
    });

    const nf4Mat = new THREE.MeshStandardMaterial({
      color: 0x7cff6b,
      roughness: 0.18,
      metalness: 0.85,
      emissive: 0x7cff6b,
      emissiveIntensity: 0.22,
    });

    const loraMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0xffb703,
      emissiveIntensity: 0.42,
    });

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x24272d,
      transparent: true,
      opacity: 0.5,
    });

    const gridSize = 4;
    const spacing = 1.1;
    const halfSpan = ((gridSize - 1) / 2) * spacing;

    const tensorCells: Array<{
      mesh: THREE.Mesh;
      isAdapterCandidate: boolean;
    }> = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const posX = x * spacing - halfSpan;
          const posY = y * spacing - halfSpan;
          const posZ = z * spacing - halfSpan;
          const isAdapterCandidate =
            (x === 0 || x === gridSize - 1) && Math.abs(y - 1.5) <= 1;

          const mesh = new THREE.Mesh(unitBoxGeo, nf4Mat);
          mesh.position.set(posX, posY, posZ);
          mesh.scale.setScalar(0.32);
          rootGroup.add(mesh);
          tensorCells.push({ mesh, isAdapterCandidate });
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

    let isInViewport = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewport = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(currentMount);

    let animationFrameId: number;
    const clock = new THREE.Clock();
    let curBaseScale = 0.3;
    let curAdapterScale = 0.36;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isInViewport) return;

      const dt = Math.min(clock.getDelta(), 0.1);
      const { mode: activeMode, loraRank: activeRank } = targetStateRef.current;

      const targetBaseScale =
        activeMode === 'QLORA_NF4'
          ? 0.3
          : activeMode === 'LORA_DECOMP'
          ? 0.36
          : 0.44;
      const targetAdapterScale = 0.28 + (activeRank / 64) * 0.34;

      curBaseScale = THREE.MathUtils.damp(
        curBaseScale,
        targetBaseScale,
        10,
        dt
      );
      curAdapterScale = THREE.MathUtils.damp(
        curAdapterScale,
        targetAdapterScale,
        10,
        dt
      );

      for (const cell of tensorCells) {
        const isAdapter = activeMode !== 'FP16' && cell.isAdapterCandidate;
        cell.mesh.material = isAdapter
          ? loraMat
          : activeMode === 'QLORA_NF4'
          ? nf4Mat
          : fp16Mat;
        cell.mesh.scale.setScalar(isAdapter ? curAdapterScale : curBaseScale);
      }

      if (!isDragging) {
        rootGroup.rotation.y += 0.004;
        rootGroup.rotation.x += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      resizeObserver.disconnect();
      if (
        currentMount &&
        renderer.domElement &&
        currentMount.contains(renderer.domElement)
      ) {
        currentMount.removeChild(renderer.domElement);
      }
      envTexture?.dispose();
      renderer.dispose();
      unitBoxGeo.dispose();
      cageGeo.dispose();
      cageEdges.dispose();
      fp16Mat.dispose();
      nf4Mat.dispose();
      loraMat.dispose();
      wireMat.dispose();
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#101216] p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between text-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F2F2F2] uppercase tracking-wider font-mono">
              3D Tensor &amp; Quantization Explorer
            </h3>
            <p className="text-[11px] text-[#8B8F98]">
              Adjust rank &amp; precision below to see how QLoRA shrinks GPU memory
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[#7CFF6B] border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-2 py-0.5 rounded font-bold tabular-nums">
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
        className="w-full h-56 sm:h-64 my-2.5 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden rounded-xl bg-[#08090B]/70 border border-white/[0.06]"
      >
        <div className="absolute bottom-2 left-3 z-10 pointer-events-none font-mono text-[10px] text-[#8B8F98]">
          Drag to orbit 3D weights · Amber cubes = Trainable LoRA Adapters (r=
          {loraRank})
        </div>
      </div>

      {/* Interactive Controls: Mode Buttons + Live Rank & Context Sliders */}
      <div className="space-y-2.5 py-2.5 border-t border-b border-white/[0.08] font-mono">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode('QLORA_NF4')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              mode === 'QLORA_NF4'
                ? 'bg-[#7CFF6B] text-[#08090B]'
                : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-white/[0.08]'
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
                : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-white/[0.08]'
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
                : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-white/[0.08]'
            }`}
          >
            3. Full FP16
          </button>
        </div>

        {/* Sliders for Rank (r) and Sequence Length */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-2 rounded-lg bg-[#08090B] border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8B8F98] flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#FFB86B]" />
                <span>LoRA Rank (r):</span>
              </span>
              <span className="text-[#FFB86B] font-bold tabular-nums">
                r = {loraRank}
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              step={4}
              value={loraRank}
              disabled={mode === 'FP16'}
              onChange={(e) => setLoraRank(Number(e.target.value))}
              className="w-full accent-[#FFB86B] cursor-pointer disabled:opacity-40"
            />
          </div>

          <div className="p-2 rounded-lg bg-[#08090B] border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8B8F98]">Context Window:</span>
              <span className="text-[#6EA8FE] font-bold tabular-nums">
                {seqLength} tokens
              </span>
            </div>
            <input
              type="range"
              min={512}
              max={8192}
              step={512}
              value={seqLength}
              onChange={(e) => setSeqLength(Number(e.target.value))}
              className="w-full accent-[#6EA8FE] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Live Empirical Telemetry Readout */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 text-center font-mono">
        <div className="p-2 rounded-lg bg-[#08090B] border border-white/[0.06]">
          <div className="text-[10px] text-[#8B8F98]">ESTIMATED VRAM</div>
          <div className="text-sm font-bold text-[#7CFF6B] tabular-nums">
            {totalVramGb} GB
          </div>
          <div className="text-[9px] text-[#8B8F98]">
            {vramSavedPct > 0 ? `-${vramSavedPct}% vs FP16` : 'Baseline'}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-[#08090B] border border-white/[0.06]">
          <div className="text-[10px] text-[#8B8F98]">TRAINABLE PARAMS</div>
          <div className="text-sm font-bold text-[#F2F2F2] tabular-nums">
            {trainableParamsM}M
          </div>
          <div className="text-[9px] text-[#8B8F98]">
            {trainablePct}% of 7.2B
          </div>
        </div>
        <div className="p-2 rounded-lg bg-[#08090B] border border-white/[0.06]">
          <div className="text-[10px] text-[#8B8F98]">PRECISION</div>
          <div className="text-sm font-bold text-[#6EA8FE]">
            {mode === 'QLORA_NF4'
              ? 'NF4 + FP16'
              : mode === 'LORA_DECOMP'
              ? 'INT8 + LoRA'
              : 'FP16 Dense'}
          </div>
          <div className="text-[9px] text-[#8B8F98]">99.3% Accuracy</div>
        </div>
      </div>

      {/* Quick Launch Link to Full 3D House Price Lab */}
      <button
        type="button"
        onClick={() => {
          window.location.hash = '#project-house-price';
        }}
        className="group swift-spring-btn mt-2.5 w-full py-2 px-3 rounded-lg bg-[#7CFF6B]/10 hover:bg-[#7CFF6B]/20 border border-[#7CFF6B]/35 text-[#7CFF6B] font-mono font-bold text-[11px] flex items-center justify-between transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5" />
          <SwiftRollLabel
            label="Launch 3D House Price Surface & SHAP Workbench"
            hoverLabel="Open Full-Screen 3D Terrain Lab"
          />
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
