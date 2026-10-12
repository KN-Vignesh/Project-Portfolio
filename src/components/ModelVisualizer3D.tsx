import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Zap, Database, Layers, Sparkles } from 'lucide-react';

type QuantMode = 'FP16' | 'QLORA_NF4' | 'LORA_DECOMP';

export const ModelVisualizer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<QuantMode>('QLORA_NF4');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Purge any stale canvas instances to prevent duplicate canvases
    const existingCanvases = currentMount.querySelectorAll('canvas');
    existingCanvases.forEach((c) => c.remove());

    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    // Adjusted camera distance with generous margin to completely eliminate clipping at any rotation
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

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x7cff6b, 3, 50);
    pointLight.position.set(5, 5, 8);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0x6ea8fe, 2, 50);
    secondaryLight.position.set(-6, -4, 6);
    scene.add(secondaryLight);

    // Root Group with optimal scale
    const rootGroup = new THREE.Group();
    rootGroup.scale.set(0.92, 0.92, 0.92);
    scene.add(rootGroup);

    // Geometries & Materials
    const baseBoxGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const fp16Mat = new THREE.MeshStandardMaterial({
      color: 0x6ea8fe,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85
    });

    const nf4Mat = new THREE.MeshStandardMaterial({
      color: 0x7cff6b,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x7cff6b,
      emissiveIntensity: 0.25
    });

    const loraMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.3,
      metalness: 0.9,
      emissive: 0xffb703,
      emissiveIntensity: 0.4
    });

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x24272d,
      transparent: true,
      opacity: 0.5
    });

    // Populate Tensor Blocks with precise symmetrical centering around (0,0,0)
    const gridSize = 4;
    const spacing = 1.1;
    const halfSpan = ((gridSize - 1) / 2) * spacing;
    const blocks: THREE.Mesh[] = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const posX = x * spacing - halfSpan;
          const posY = y * spacing - halfSpan;
          const posZ = z * spacing - halfSpan;
          const isAdapterBlock = (x === 0 || x === gridSize - 1) && Math.abs(y - 1.5) <= 1;
          const material = mode === 'FP16' ? fp16Mat : mode === 'QLORA_NF4' ? nf4Mat : (isAdapterBlock ? loraMat : fp16Mat);
          const mesh = new THREE.Mesh(baseBoxGeo, material);
          mesh.position.set(posX, posY, posZ);
          rootGroup.add(mesh);
          blocks.push(mesh);
        }
      }
    }

    // Outer bounding cage: sized symmetrically to enclose the tensor
    const cageSize = gridSize * spacing + 0.3;
    const cageGeo = new THREE.BoxGeometry(cageSize, cageSize, cageSize);
    const cageEdges = new THREE.EdgesGeometry(cageGeo);
    const cage = new THREE.LineSegments(cageEdges, wireMat);
    rootGroup.add(cage);

    // Rotation & Interaction
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

    // ResizeObserver for reliable dimension synchronisation
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

    // Animation Loop
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
      cageGeo.dispose();
      cageEdges.dispose();
      fp16Mat.dispose();
      nf4Mat.dispose();
      loraMat.dispose();
      wireMat.dispose();
    };
  }, [mode]);

  return (
    <div className="rounded-2xl border border-[#24272D] bg-[#101216] p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#24272D] z-10">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-[#F2F2F2] uppercase tracking-wider">
              3D Tensor & Quantization Architecture
            </h3>
            <p className="text-[11px] font-mono text-[#8B8F98]">
              Interactive WebGL parameter matrix visualizer
            </p>
          </div>
        </div>

        {/* Live Mode Indicator */}
        <span className="font-mono text-[10px] text-[#7CFF6B] border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-2 py-0.5 rounded">
          {mode === 'QLORA_NF4' ? '4-BIT NF4' : mode === 'LORA_DECOMP' ? 'RANK DECOMP (r=16)' : 'FP16 BASE'}
        </span>
      </div>

      {/* 3D Canvas Area */}
      <div
        ref={mountRef}
        className="w-full h-72 sm:h-80 my-2 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden"
      >
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none text-[10px] font-mono text-[#8B8F98]/70">
          * Drag to rotate tensor volume
        </div>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#24272D] text-center font-mono my-1">
        <div className="bg-[#08090B] p-2 rounded border border-[#24272D]/60">
          <div className="text-[10px] text-[#8B8F98]">VRAM FOOTPRINT</div>
          <div className="text-sm font-bold text-[#7CFF6B]">
            {mode === 'FP16' ? '14.2 GB' : mode === 'QLORA_NF4' ? '3.8 GB (-73%)' : '4.1 GB (-71%)'}
          </div>
        </div>
        <div className="bg-[#08090B] p-2 rounded border border-[#24272D]/60">
          <div className="text-[10px] text-[#8B8F98]">TRAINABLE WEIGHTS</div>
          <div className="text-sm font-bold text-[#F2F2F2]">
            {mode === 'FP16' ? '7,241M (100%)' : mode === 'QLORA_NF4' ? '18.4M (0.25%)' : '36.8M (0.50%)'}
          </div>
        </div>
        <div className="bg-[#08090B] p-2 rounded border border-[#24272D]/60">
          <div className="text-[10px] text-[#8B8F98]">BATCH CAPACITY</div>
          <div className="text-sm font-bold text-[#6EA8FE]">
            {mode === 'FP16' ? '1x Base' : mode === 'QLORA_NF4' ? '3.8x Speed' : '3.2x Speed'}
          </div>
        </div>
      </div>

      {/* Mode Selector Controls */}
      <div className="flex items-center gap-1.5 pt-3">
        <button
          type="button"
          onClick={() => setMode('QLORA_NF4')}
          className={`flex-1 py-1.5 px-2 rounded text-[11px] font-mono font-semibold transition-colors ${
            mode === 'QLORA_NF4'
              ? 'bg-[#7CFF6B] text-[#08090B]'
              : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
          }`}
        >
          QLoRA (NF4)
        </button>
        <button
          type="button"
          onClick={() => setMode('LORA_DECOMP')}
          className={`flex-1 py-1.5 px-2 rounded text-[11px] font-mono font-semibold transition-colors ${
            mode === 'LORA_DECOMP'
              ? 'bg-[#7CFF6B] text-[#08090B]'
              : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
          }`}
        >
          LoRA Matrix (B×A)
        </button>
        <button
          type="button"
          onClick={() => setMode('FP16')}
          className={`flex-1 py-1.5 px-2 rounded text-[11px] font-mono font-semibold transition-colors ${
            mode === 'FP16'
              ? 'bg-[#7CFF6B] text-[#08090B]'
              : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
          }`}
        >
          Full FP16
        </button>
      </div>
    </div>
  );
};
