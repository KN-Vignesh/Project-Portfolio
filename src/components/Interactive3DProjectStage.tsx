import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Network, ShieldCheck, Database, Sliders, ExternalLink, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export type ThreeDSceneType = 'PEFT_LORA' | 'MULTI_AGENT' | 'VERO_AST' | 'VECTOR_RAG';

interface Interactive3DProjectStageProps {
  initialScene?: ThreeDSceneType;
  onInspectSpec?: (scene: ThreeDSceneType) => void;
}

export const Interactive3DProjectStage: React.FC<Interactive3DProjectStageProps> = ({
  initialScene = 'PEFT_LORA',
  onInspectSpec
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<ThreeDSceneType>(initialScene);

  // Scene 1: LoRA Experimentation Slider
  const [loraRank, setLoraRank] = useState<number>(16);

  // Scene 2: Selected Agent Node
  const [selectedAgentNode, setSelectedAgentNode] = useState<string>('Planner Agent');

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Standard Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x7cff6b, 3.5, 60);
    mainLight.position.set(6, 8, 10);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(0x6ea8fe, 2.5, 60);
    accentLight.position.set(-8, -6, 8);
    scene.add(accentLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // BUILD ACTIVE 3D SCENE
    if (activeScene === 'PEFT_LORA') {
      // 1. Frozen Base Transformer Tensor (Large Center Cube)
      const baseGeo = new THREE.BoxGeometry(4.2, 4.2, 4.2);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.4,
        metalness: 0.8,
        wireframe: false
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      rootGroup.add(baseMesh);

      // Wireframe cage
      const wireEdges = new THREE.EdgesGeometry(baseGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x475569 });
      const wireMesh = new THREE.LineSegments(wireEdges, wireMat);
      rootGroup.add(wireMesh);

      // 2. Dynamic Rank Adapter Matrices A & B (Scaled by loraRank)
      const rankScale = (loraRank / 64) * 1.5 + 0.3;

      // Matrix A (Down-projection: 4096 -> r)
      const matAGeo = new THREE.BoxGeometry(rankScale, 4.2, 1.2);
      const matAMat = new THREE.MeshStandardMaterial({
        color: 0x7cff6b,
        emissive: 0x7cff6b,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.8
      });
      const meshA = new THREE.Mesh(matAGeo, matAMat);
      meshA.position.set(3.4 + rankScale / 2, 0, 0);
      rootGroup.add(meshA);

      // Matrix B (Up-projection: r -> 4096)
      const matBGeo = new THREE.BoxGeometry(rankScale, 4.2, 1.2);
      const matBMat = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        emissive: 0xffb703,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.8
      });
      const meshB = new THREE.Mesh(matBGeo, matBMat);
      meshB.position.set(-3.4 - rankScale / 2, 0, 0);
      rootGroup.add(meshB);
    } else if (activeScene === 'MULTI_AGENT') {
      // Directed Acyclic Graph (DAG) Agent Nodes
      const agentPositions = [
        { name: 'Planner Agent', pos: [0, 2.8, 0], color: 0x7cff6b },
        { name: 'Tool Executor', pos: [-3, 0, 1], color: 0x6ea8fe },
        { name: 'Code Reviewer', pos: [3, 0, -1], color: 0xa855f7 },
        { name: 'Critic & Guard', pos: [0, -2.8, 0], color: 0x22d3ee }
      ];

      const nodeGeo = new THREE.SphereGeometry(0.85, 32, 32);

      agentPositions.forEach((agent) => {
        const mat = new THREE.MeshStandardMaterial({
          color: agent.color,
          emissive: agent.color,
          emissiveIntensity: 0.35,
          roughness: 0.2,
          metalness: 0.8
        });
        const mesh = new THREE.Mesh(nodeGeo, mat);
        mesh.position.set(agent.pos[0], agent.pos[1], agent.pos[2]);
        rootGroup.add(mesh);
      });

      // Connecting Glowing Conduits
      const lineMat = new THREE.LineBasicMaterial({ color: 0x7cff6b, transparent: true, opacity: 0.6 });
      const points = [
        new THREE.Vector3(0, 2.8, 0),
        new THREE.Vector3(-3, 0, 1),
        new THREE.Vector3(0, -2.8, 0),
        new THREE.Vector3(3, 0, -1),
        new THREE.Vector3(0, 2.8, 0)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(lineMesh);
    } else if (activeScene === 'VERO_AST') {
      // Abstract Syntax Tree (Root + Children)
      const rootNodeGeo = new THREE.OctahedronGeometry(1.2);
      const rootMat = new THREE.MeshStandardMaterial({
        color: 0x7cff6b,
        emissive: 0x7cff6b,
        emissiveIntensity: 0.4
      });
      const rootMesh = new THREE.Mesh(rootNodeGeo, rootMat);
      rootMesh.position.set(0, 3.2, 0);
      rootGroup.add(rootMesh);

      // Child AST Nodes (Green = Clean Rules, Red = S3649/S2068 Violations)
      const children = [
        { pos: [-3.2, 0.5, 0], pass: true },
        { pos: [-1.2, 0.5, 1], pass: true },
        { pos: [1.2, 0.5, -1], pass: false }, // Security violation sink
        { pos: [3.2, 0.5, 0], pass: true },
        { pos: [-2.2, -2.2, 0], pass: true },
        { pos: [0, -2.2, 1], pass: false }, // Memory leak rule
        { pos: [2.2, -2.2, 0], pass: true }
      ];

      children.forEach((c) => {
        const geo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
        const mat = new THREE.MeshStandardMaterial({
          color: c.pass ? 0x7cff6b : 0xf43f5e,
          emissive: c.pass ? 0x7cff6b : 0xf43f5e,
          emissiveIntensity: c.pass ? 0.3 : 0.6
        });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(c.pos[0], c.pos[1], c.pos[2]);
        rootGroup.add(m);

        // Branch Line to Root
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 3.2, 0),
          new THREE.Vector3(c.pos[0], c.pos[1], c.pos[2])
        ]);
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x334155 }));
        rootGroup.add(line);
      });
    } else if (activeScene === 'VECTOR_RAG') {
      // 3D Vector Embedding Space
      const pointCount = 75;
      const pointsGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount * 3; i += 3) {
        positions[i] = Math.sin(i * 1.341 + 0.1) * 5;
        positions[i + 1] = Math.cos(i * 2.113 + 0.3) * 5;
        positions[i + 2] = Math.sin(i * 3.789 + 0.5) * 4;
      }
      pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pointsMat = new THREE.PointsMaterial({
        color: 0x6ea8fe,
        size: 0.35,
        transparent: true,
        opacity: 0.8
      });
      const points = new THREE.Points(pointsGeo, pointsMat);
      rootGroup.add(points);

      // Query Vector (Center Pulse)
      const queryGeo = new THREE.SphereGeometry(0.6, 24, 24);
      const queryMat = new THREE.MeshStandardMaterial({
        color: 0x7cff6b,
        emissive: 0x7cff6b,
        emissiveIntensity: 0.6
      });
      const queryMesh = new THREE.Mesh(queryGeo, queryMat);
      rootGroup.add(queryMesh);
    }

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
        rootGroup.rotation.y += 0.003;
        rootGroup.rotation.x += 0.001;
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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeScene, loraRank]);

  return (
    <div className="rounded-2xl border border-[#24272D] bg-[#101216] p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between font-mono">
      {/* Top Header & Scene Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24272D]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B]">
            {activeScene === 'PEFT_LORA' && <Cpu className="w-4 h-4" />}
            {activeScene === 'MULTI_AGENT' && <Network className="w-4 h-4" />}
            {activeScene === 'VERO_AST' && <ShieldCheck className="w-4 h-4" />}
            {activeScene === 'VECTOR_RAG' && <Database className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F2F2F2] uppercase tracking-wider">
              3D Project Architecture Workbench
            </h3>
            <p className="text-[11px] text-[#8B8F98]">
              Interactive WebGL parameter &amp; topology experimentation
            </p>
          </div>
        </div>

        {/* Scene Navigation Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#08090B] rounded-xl border border-[#24272D] text-[11px]">
          <button
            type="button"
            onClick={() => setActiveScene('PEFT_LORA')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeScene === 'PEFT_LORA'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            PEFT / LoRA
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('MULTI_AGENT')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeScene === 'MULTI_AGENT'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            Multi-Agent DAG
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('VERO_AST')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeScene === 'VERO_AST'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            Vero AST
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('VECTOR_RAG')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeScene === 'VECTOR_RAG'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            Vector RAG
          </button>
        </div>
      </div>

      {/* 3D Canvas Stage */}
      <div
        ref={mountRef}
        className="w-full h-72 sm:h-80 my-3 cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-xl bg-[#08090B]/50 border border-[#24272D]/50"
      >
        <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] text-[#8B8F98]/60">
          * Drag to rotate spatial perspective
        </div>
      </div>

      {/* Interactive Telemetry & Controls based on Active Scene */}
      {activeScene === 'PEFT_LORA' && (
        <div className="space-y-3 pt-2 border-t border-[#24272D]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8B8F98] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#7CFF6B]" />
              <span>Interactive Rank ($r$): <strong>{loraRank}</strong></span>
            </span>
            <span className="text-[#7CFF6B] font-bold">
              VRAM: {(14.2 - (64 - loraRank) * 0.16).toFixed(1)} GB (Base: 14.2 GB)
            </span>
          </div>

          <input
            type="range"
            min={4}
            max={64}
            step={4}
            value={loraRank}
            onChange={(e) => setLoraRank(Number(e.target.value))}
            className="w-full accent-[#7CFF6B] bg-[#24272D] h-1.5 rounded cursor-pointer"
          />

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#08090B] p-2 rounded border border-[#24272D]">
              <div className="text-[10px] text-[#8B8F98]">ADAPTER MATRICES</div>
              <div className="text-sm font-bold text-[#F2F2F2]">A (4096×{loraRank}) · B ({loraRank}×4096)</div>
            </div>
            <div className="bg-[#08090B] p-2 rounded border border-[#24272D]">
              <div className="text-[10px] text-[#8B8F98]">TRAINABLE FRACTION</div>
              <div className="text-sm font-bold text-[#7CFF6B]">{((loraRank / 64) * 0.5).toFixed(2)}%</div>
            </div>
            <div className="bg-[#08090B] p-2 rounded border border-[#24272D]">
              <div className="text-[10px] text-[#8B8F98]">QUANTIZATION</div>
              <div className="text-sm font-bold text-[#6EA8FE]">4-bit NF4 NormalFloat</div>
            </div>
          </div>
        </div>
      )}

      {activeScene === 'MULTI_AGENT' && (
        <div className="space-y-2 pt-2 border-t border-[#24272D]">
          <div className="text-xs text-[#8B8F98] flex items-center justify-between">
            <span>CrewAI &amp; LangGraph State DAG</span>
            <span className="text-[#7CFF6B]">Deterministic JSON Contracts</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs text-center">
            {['Planner Agent', 'Tool Executor', 'Code Reviewer', 'Critic & Guard'].map((agent) => (
              <button
                key={agent}
                type="button"
                onClick={() => setSelectedAgentNode(agent)}
                className={`p-1.5 rounded text-[11px] transition-colors ${
                  selectedAgentNode === agent
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                    : 'bg-[#08090B] text-[#8B8F98] border border-[#24272D]'
                }`}
              >
                {agent}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeScene === 'VERO_AST' && (
        <div className="pt-2 border-t border-[#24272D] flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="text-[#F2F2F2] font-bold">SonarQube Clean Code Invariants</div>
            <div className="text-[11px] text-[#8B8F98]">Rule S3649 &middot; S2068 &middot; S3776</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#7CFF6B]">&lt;35ms Latency</div>
            <div className="text-[10px] text-[#8B8F98]">Zero-chat hallucination</div>
          </div>
        </div>
      )}

      {activeScene === 'VECTOR_RAG' && (
        <div className="pt-2 border-t border-[#24272D] flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="text-[#F2F2F2] font-bold">Cosmos DB Vector Clustered Embeddings</div>
            <div className="text-[11px] text-[#8B8F98]">Cosine Similarity: 0.92 &middot; P95: 84ms</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#6EA8FE]">Top-3 Recall: 94%</div>
            <div className="text-[10px] text-[#8B8F98]">Dense Representation</div>
          </div>
        </div>
      )}

      {/* Direct Action Link */}
      {onInspectSpec && (
        <div className="pt-3 mt-2 border-t border-[#24272D] flex items-center justify-between">
          <span className="text-[11px] text-[#8B8F98]">
            Source: github.com/KN-Vignesh/Projects
          </span>
          <button
            type="button"
            onClick={() => onInspectSpec(activeScene)}
            className="text-xs text-[#7CFF6B] hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>INSPECT SPECIFICATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
