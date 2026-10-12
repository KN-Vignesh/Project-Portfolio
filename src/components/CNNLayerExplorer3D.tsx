import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RotateCcw, Info, Sparkles, ChevronRight } from 'lucide-react';

interface CNNLayerExplorer3DProps {
  activeStage?: number;
  onSelectStage?: (stage: number) => void;
}

export const CNNLayerExplorer3D: React.FC<CNNLayerExplorer3DProps> = ({
  activeStage = 1,
  onSelectStage
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<number>(activeStage);
  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(false);
  const [walkthroughStep, setWalkthroughStep] = useState<number>(0);

  const layerSpecs = [
    {
      id: 0,
      name: 'Input Volume',
      dim: '1 × 28 × 28',
      channels: 1,
      params: 0,
      desc: 'Raw grayscale image pixel grid. Receptive field: 1×1.',
      color: 0x8b8f98
    },
    {
      id: 1,
      name: 'Conv1 + MaxPool',
      dim: '16 × 14 × 14',
      channels: 16,
      params: 160,
      desc: '16 kernels (3×3) extracting low-level edge gradients. 2×2 MaxPool reduces spatial area by 75%.',
      color: 0x7cff6b
    },
    {
      id: 2,
      name: 'Conv2 + MaxPool',
      dim: '32 × 7 × 7',
      channels: 32,
      params: 4640,
      desc: '32 kernels (3×3) synthesizing complex curves, corners, and localized textures.',
      color: 0x6ea8fe
    },
    {
      id: 3,
      name: 'Dense Representation',
      dim: '1 × 128',
      channels: 128,
      params: 200832,
      desc: 'Flattened 1,568 features projected into 128-dimensional dense latent representation.',
      color: 0xffb703
    },
    {
      id: 4,
      name: 'Output Logits',
      dim: '1 × 10',
      channels: 10,
      params: 1290,
      desc: 'Linear projection to 10 class logits normalized via Softmax.',
      color: 0xf43f5e
    }
  ];

  useEffect(() => {
    setSelectedLayer(activeStage);
  }, [activeStage]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 2, 14);

    // Purge any stale canvas instances to prevent duplicate canvases
    const existingCanvases = currentMount.querySelectorAll('canvas');
    existingCanvases.forEach((c) => c.remove());

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x7cff6b, 3, 50);
    keyLight.position.set(5, 7, 8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x6ea8fe, 2, 50);
    fillLight.position.set(-6, -4, 6);
    scene.add(fillLight);

    const cnnGroup = new THREE.Group();
    scene.add(cnnGroup);

    // Layer Mesh Definitions
    // Stage 0: Input Plane (28x28)
    const inputGeo = new THREE.BoxGeometry(2.4, 2.4, 0.2);
    const inputMat = new THREE.MeshStandardMaterial({
      color: 0x8b8f98,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: selectedLayer === 0 ? 0.95 : 0.4
    });
    const inputMesh = new THREE.Mesh(inputGeo, inputMat);
    inputMesh.position.set(-4.5, 0, 0);
    cnnGroup.add(inputMesh);

    // Stage 1: Conv1 Volume (14x14x16 channels)
    const conv1Geo = new THREE.BoxGeometry(1.6, 1.6, 0.9);
    const conv1Mat = new THREE.MeshStandardMaterial({
      color: 0x7cff6b,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x7cff6b,
      emissiveIntensity: selectedLayer === 1 ? 0.4 : 0.1,
      transparent: true,
      opacity: selectedLayer === 1 ? 0.95 : 0.4
    });
    const conv1Mesh = new THREE.Mesh(conv1Geo, conv1Mat);
    conv1Mesh.position.set(-2.0, 0, 0);
    cnnGroup.add(conv1Mesh);

    // Stage 2: Conv2 Volume (7x7x32 channels)
    const conv2Geo = new THREE.BoxGeometry(1.0, 1.0, 1.6);
    const conv2Mat = new THREE.MeshStandardMaterial({
      color: 0x6ea8fe,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x6ea8fe,
      emissiveIntensity: selectedLayer === 2 ? 0.4 : 0.1,
      transparent: true,
      opacity: selectedLayer === 2 ? 0.95 : 0.4
    });
    const conv2Mesh = new THREE.Mesh(conv2Geo, conv2Mat);
    conv2Mesh.position.set(0.5, 0, 0);
    cnnGroup.add(conv2Mesh);

    // Stage 3: Dense Representation Vector (1x128)
    const denseGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.2, 16);
    const denseMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xffb703,
      emissiveIntensity: selectedLayer === 3 ? 0.4 : 0.1,
      transparent: true,
      opacity: selectedLayer === 3 ? 0.95 : 0.4
    });
    const denseMesh = new THREE.Mesh(denseGeo, denseMat);
    denseMesh.position.set(2.8, 0, 0);
    cnnGroup.add(denseMesh);

    // Stage 4: Output Logits (10 classes)
    const outGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.4, 16);
    const outMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xf43f5e,
      emissiveIntensity: selectedLayer === 4 ? 0.5 : 0.1,
      transparent: true,
      opacity: selectedLayer === 4 ? 0.95 : 0.4
    });
    const outMesh = new THREE.Mesh(outGeo, outMat);
    outMesh.position.set(4.6, 0, 0);
    cnnGroup.add(outMesh);

    // Connecting Feature Conduits (Lines between stages)
    const lineMat = new THREE.LineBasicMaterial({ color: 0x24272d, transparent: true, opacity: 0.6 });
    const linePoints = [
      new THREE.Vector3(-4.5, 0, 0),
      new THREE.Vector3(-2.0, 0, 0),
      new THREE.Vector3(0.5, 0, 0),
      new THREE.Vector3(2.8, 0, 0),
      new THREE.Vector3(4.6, 0, 0)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const line = new THREE.Line(lineGeo, lineMat);
    cnnGroup.add(line);

    // Mouse Drag Rotation
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
      cnnGroup.rotation.y += deltaX * 0.008;
      cnnGroup.rotation.x += deltaY * 0.008;
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

    // Resize
    const onResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // Animate
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        cnnGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', onResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      inputGeo.dispose();
      conv1Geo.dispose();
      conv2Geo.dispose();
      denseGeo.dispose();
      outGeo.dispose();
      inputMat.dispose();
      conv1Mat.dispose();
      conv2Mat.dispose();
      denseMat.dispose();
      outMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, [selectedLayer]);

  const activeSpec = layerSpecs[selectedLayer] || layerSpecs[1];

  const handleSelect = (idx: number) => {
    setSelectedLayer(idx);
    onSelectStage?.(idx);
  };

  return (
    <div className="rounded-xl border border-[#24272D] bg-[#0A0C0F] p-3 sm:p-4 font-mono text-xs space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#24272D]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#7CFF6B]" />
          <span className="font-bold text-[#F2F2F2] uppercase text-[11px] tracking-wider">
            3D Spatial Tensor Volume Explorer
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowWalkthrough(!showWalkthrough)}
          className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer flex items-center gap-1 ${
            showWalkthrough ? 'bg-[#7CFF6B] text-[#08090B] font-bold' : 'text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
          }`}
        >
          <Info className="w-3 h-3" />
          <span>{showWalkthrough ? 'EXIT TOUR' : 'GUIDED TOUR'}</span>
        </button>
      </div>

      {/* 3D Canvas Area */}
      <div
        ref={mountRef}
        className="w-full h-44 sm:h-52 cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-lg bg-[#050608] border border-[#24272D]/50"
      >
        <div className="absolute bottom-1.5 left-2 pointer-events-none text-[9px] text-[#8B8F98]/60">
          * Drag to rotate spatial feature stack
        </div>
      </div>

      {/* Layer Selector Chips */}
      <div className="flex flex-wrap gap-1">
        {layerSpecs.map((layer) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => handleSelect(layer.id)}
            className={`flex-1 py-1 px-1.5 rounded text-[10px] font-semibold transition-all cursor-pointer truncate text-center ${
              selectedLayer === layer.id
                ? 'bg-[#15181D] text-[#7CFF6B] border border-[#7CFF6B]/50'
                : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
            }`}
          >
            {layer.name}
          </button>
        ))}
      </div>

      {/* Inspector Details for Selected Layer */}
      <div className="p-2.5 rounded-lg bg-[#101216] border border-[#24272D] space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#F2F2F2] font-bold">{activeSpec.name}</span>
          <span className="text-[#7CFF6B] font-mono">{activeSpec.dim}</span>
        </div>
        <p className="text-[11px] text-[#8B8F98] leading-relaxed font-sans">
          {activeSpec.desc}
        </p>
        <div className="flex items-center justify-between pt-1 text-[10px] text-[#8B8F98] border-t border-[#24272D]/60 font-mono">
          <span>Channels: <strong className="text-[#6EA8FE]">{activeSpec.channels}</strong></span>
          <span>Layer Parameters: <strong className="text-[#F2F2F2]">{activeSpec.params.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Guided Walkthrough Step if enabled */}
      {showWalkthrough && (
        <div className="p-2.5 rounded-lg bg-[#7CFF6B]/5 border border-[#7CFF6B]/30 space-y-1 animate-fadeIn">
          <div className="flex items-center justify-between text-[10px] text-[#7CFF6B] font-bold">
            <span>WALKTHROUGH: 4 KEY INSIGHTS</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => { setWalkthroughStep(step); handleSelect(step); }}
                  className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                    walkthroughStep === step ? 'bg-[#7CFF6B] text-[#08090B]' : 'bg-[#101216] text-[#8B8F98] border border-[#24272D]'
                  }`}
                >
                  {step + 1}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-[#D1D5DB] leading-normal font-sans">
            {walkthroughStep === 0 && '1. What am I looking at? A 3D volume stack showing how 2D image pixels are progressively transformed into compact, invariant feature channels.'}
            {walkthroughStep === 1 && '2. What does each volume represent? Height and width represent spatial resolution, while volume depth represents the number of learned feature filter channels.'}
            {walkthroughStep === 2 && '3. What changes during forward pass? Spatial area contracts by 75% per pooling stage, while channel depth doubles from 1 to 16 to 32 filters.'}
            {walkthroughStep === 3 && '4. Key Takeaway: Convolutional parameter sharing allows CNNs to achieve 98.6% accuracy with 97% fewer weights than an un-pooled multi-layer perceptron.'}
          </p>
        </div>
      )}
    </div>
  );
};
