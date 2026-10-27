import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Cpu,
  Network,
  ShieldCheck,
  Database,
  Sliders,
  ArrowRight,
  Home,
} from 'lucide-react';
import { SwiftRollLabel } from './ScrollReveal';

export type ThreeDSceneType =
  | 'HOUSE_PRICE_3D'
  | 'PEFT_LORA'
  | 'MULTI_AGENT'
  | 'VERO_AST'
  | 'VECTOR_RAG';

interface Interactive3DProjectStageProps {
  initialScene?: ThreeDSceneType;
  onInspectSpec?: (scene: ThreeDSceneType) => void;
}

export const Interactive3DProjectStage: React.FC<
  Interactive3DProjectStageProps
> = ({ initialScene = 'HOUSE_PRICE_3D', onInspectSpec }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<ThreeDSceneType>(initialScene);
  const [webglFallback, setWebglFallback] = useState<boolean>(false);

  // Scene 0: House Price 3D Quick Interactive Sliders
  const [livingArea, setLivingArea] = useState<number>(1710);
  const [overallQual, setOverallQual] = useState<number>(7);

  // Scene 1: LoRA Experimentation Slider
  const [loraRank, setLoraRank] = useState<number>(16);

  // Scene 2: Selected Agent Node
  const [selectedAgentNode, setSelectedAgentNode] =
    useState<string>('Planner Agent');

  // Mutable target ref so slider drags smoothly damp in the loop without recreating WebGLRenderer
  const paramTargetRef = useRef({
    livingArea: 1710,
    overallQual: 7,
    loraRank: 16,
    scrollTilt: 0,
  });

  useEffect(() => {
    paramTargetRef.current.livingArea = livingArea;
    paramTargetRef.current.overallQual = overallQual;
    paramTargetRef.current.loraRank = loraRank;
  }, [livingArea, overallQual, loraRank]);

  const estimatedQuickPrice = Math.round(
    45000 +
      livingArea * 62 +
      Math.pow(overallQual, 2.15) * 1450 +
      (livingArea - 1200) * (overallQual - 5) * 14
  );

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const existingCanvases = currentMount.querySelectorAll('canvas');
    existingCanvases.forEach((c) => c.remove());

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const width = currentMount.clientWidth || 640;
    const height = currentMount.clientHeight || 420;

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
    camera.position.set(0, 2.6, 16.5);
    camera.lookAt(0, 0, 0);

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
      setWebglFallback(true);
      return;
    }

    const hemiLight = new THREE.HemisphereLight(0x6ea8fe, 0x08090b, 0.85);
    scene.add(hemiLight);

    const mainLight = new THREE.PointLight(0x7cff6b, 3.8, 60);
    mainLight.position.set(6, 8, 10);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(0x6ea8fe, 2.8, 60);
    accentLight.position.set(-8, -6, 8);
    scene.add(accentLight);

    const rootGroup = new THREE.Group();
    rootGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(rootGroup);

    let houseGroupRef: THREE.Group | null = null;
    let loraMeshARef: THREE.Mesh | null = null;
    let loraMeshBRef: THREE.Mesh | null = null;
    const span = 8.4;

    if (activeScene === 'HOUSE_PRICE_3D') {
      const gridN = 22;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(gridN * gridN * 3);
      const col = new Float32Array(gridN * gridN * 3);
      const indices: number[] = [];
      const cLow = new THREE.Color(0x3b82f6);
      const cMid = new THREE.Color(0x7cff6b);
      const cHigh = new THREE.Color(0xffb86b);
      const tmp = new THREE.Color();

      let k = 0;
      for (let zi = 0; zi < gridN; zi++) {
        const nz = zi / (gridN - 1);
        const wz = (0.5 - nz) * span;
        for (let xi = 0; xi < gridN; xi++) {
          const nx = xi / (gridN - 1);
          const wx = (nx - 0.5) * span;
          const normH = Math.min(
            1,
            0.12 + nx * 0.45 + Math.pow(nz, 1.6) * 0.5 + nx * nz * 0.25
          );
          const wy = -2.0 + normH * 4.2;

          pos[k * 3] = wx;
          pos[k * 3 + 1] = wy;
          pos[k * 3 + 2] = wz;

          if (normH < 0.55) {
            tmp.lerpColors(cLow, cMid, normH / 0.55);
          } else {
            tmp.lerpColors(cMid, cHigh, (normH - 0.55) / 0.45);
          }
          col[k * 3] = tmp.r;
          col[k * 3 + 1] = tmp.g;
          col[k * 3 + 2] = tmp.b;
          k++;
        }
      }

      for (let zi = 0; zi < gridN - 1; zi++) {
        for (let xi = 0; xi < gridN - 1; xi++) {
          const a = zi * gridN + xi;
          const b = zi * gridN + xi + 1;
          const c = (zi + 1) * gridN + xi;
          const d = (zi + 1) * gridN + xi + 1;
          indices.push(a, c, b, b, c, d);
        }
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const surfMesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.32,
          metalness: 0.18,
          side: THREE.DoubleSide,
        })
      );
      rootGroup.add(surfMesh);

      // Composite 6-Part Architectural 3D House Marker
      const houseGroup = new THREE.Group();
      houseGroupRef = houseGroup;

      // 1. Foundation Plinth
      const plinthMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.84, 0.08, 0.72),
        new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.7,
          metalness: 0.2,
        })
      );
      plinthMesh.position.y = 0.04;
      houseGroup.add(plinthMesh);

      // 2. Main Architectural Living Volume
      const bodyMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.66, 0.5, 0.56),
        new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          emissive: 0x7cff6b,
          emissiveIntensity: 0.18,
          roughness: 0.28,
          metalness: 0.12,
        })
      );
      bodyMesh.position.y = 0.33;
      houseGroup.add(bodyMesh);

      // 3. Pitched Roof with Overhang
      const roofGeo = new THREE.ConeGeometry(0.58, 0.38, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roofMesh = new THREE.Mesh(
        roofGeo,
        new THREE.MeshStandardMaterial({
          color: 0x7cff6b,
          emissive: 0x7cff6b,
          emissiveIntensity: 0.4,
          roughness: 0.22,
          metalness: 0.45,
        })
      );
      roofMesh.position.y = 0.77;
      houseGroup.add(roofMesh);

      // 4. Attached Garage Wing
      const garageMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.34, 0.44),
        new THREE.MeshStandardMaterial({
          color: 0x6ea8fe,
          emissive: 0x3b82f6,
          emissiveIntensity: 0.25,
          roughness: 0.42,
          metalness: 0.3,
        })
      );
      garageMesh.position.set(0.46, 0.25, 0.02);
      houseGroup.add(garageMesh);

      // 5. Illuminated Clerestory Window Band
      const windowMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.12, 0.58),
        new THREE.MeshStandardMaterial({
          color: 0xffb86b,
          emissive: 0xffb86b,
          emissiveIntensity: 0.85,
          roughness: 0.1,
          metalness: 0.9,
        })
      );
      windowMesh.position.set(0, 0.38, 0);
      houseGroup.add(windowMesh);

      // 6. Chimney Stack Accent
      const chimneyMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.28, 0.11),
        new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.65,
          metalness: 0.2,
        })
      );
      chimneyMesh.position.set(-0.18, 0.78, -0.12);
      houseGroup.add(chimneyMesh);

      rootGroup.add(houseGroup);
      rootGroup.rotation.x = 0.25;
      rootGroup.rotation.y = -0.45;
    } else if (activeScene === 'PEFT_LORA') {
      const baseGeo = new THREE.BoxGeometry(4.2, 4.2, 4.2);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.32,
        metalness: 0.82,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      rootGroup.add(baseMesh);

      const wireEdges = new THREE.EdgesGeometry(baseGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x475569 });
      const wireMesh = new THREE.LineSegments(wireEdges, wireMat);
      rootGroup.add(wireMesh);

      const unitGeo = new THREE.BoxGeometry(1, 4.2, 1.2);
      const matAMat = new THREE.MeshStandardMaterial({
        color: 0x7cff6b,
        emissive: 0x7cff6b,
        emissiveIntensity: 0.3,
        roughness: 0.18,
        metalness: 0.85,
      });
      const meshA = new THREE.Mesh(unitGeo, matAMat);
      loraMeshARef = meshA;
      rootGroup.add(meshA);

      const matBMat = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        emissive: 0xffb703,
        emissiveIntensity: 0.3,
        roughness: 0.18,
        metalness: 0.85,
      });
      const meshB = new THREE.Mesh(unitGeo, matBMat);
      loraMeshBRef = meshB;
      rootGroup.add(meshB);
    } else if (activeScene === 'MULTI_AGENT') {
      const agentPositions = [
        { name: 'Planner Agent', pos: [0, 2.8, 0], color: 0x7cff6b },
        { name: 'Tool Executor', pos: [-3, 0, 1], color: 0x6ea8fe },
        { name: 'Code Reviewer', pos: [3, 0, -1], color: 0xa855f7 },
        { name: 'Critic & Guard', pos: [0, -2.8, 0], color: 0x22d3ee },
      ];

      const nodeGeo = new THREE.SphereGeometry(0.85, 32, 32);

      agentPositions.forEach((agent) => {
        const mat = new THREE.MeshStandardMaterial({
          color: agent.color,
          emissive: agent.color,
          emissiveIntensity: 0.35,
          roughness: 0.18,
          metalness: 0.85,
        });
        const mesh = new THREE.Mesh(nodeGeo, mat);
        mesh.position.set(agent.pos[0], agent.pos[1], agent.pos[2]);
        rootGroup.add(mesh);
      });

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x7cff6b,
        transparent: true,
        opacity: 0.6,
      });
      const points = [
        new THREE.Vector3(0, 2.8, 0),
        new THREE.Vector3(-3, 0, 1),
        new THREE.Vector3(0, -2.8, 0),
        new THREE.Vector3(3, 0, -1),
        new THREE.Vector3(0, 2.8, 0),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(lineMesh);
    } else if (activeScene === 'VERO_AST') {
      const rootNodeGeo = new THREE.OctahedronGeometry(1.2);
      const rootMat = new THREE.MeshStandardMaterial({
        color: 0x7cff6b,
        emissive: 0x7cff6b,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8,
      });
      const rootMesh = new THREE.Mesh(rootNodeGeo, rootMat);
      rootMesh.position.set(0, 3.2, 0);
      rootGroup.add(rootMesh);

      const children = [
        { pos: [-3.2, 0.5, 0], pass: true },
        { pos: [-1.2, 0.5, 1], pass: true },
        { pos: [1.2, 0.5, -1], pass: false },
        { pos: [3.2, 0.5, 0], pass: true },
        { pos: [-2.2, -2.2, 0], pass: true },
        { pos: [0, -2.2, 1], pass: false },
        { pos: [2.2, -2.2, 0], pass: true },
      ];

      children.forEach((c) => {
        const geo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
        const mat = new THREE.MeshStandardMaterial({
          color: c.pass ? 0x7cff6b : 0xf43f5e,
          emissive: c.pass ? 0x7cff6b : 0xf43f5e,
          emissiveIntensity: c.pass ? 0.3 : 0.6,
          roughness: 0.25,
          metalness: 0.65,
        });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(c.pos[0], c.pos[1], c.pos[2]);
        rootGroup.add(m);

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 3.2, 0),
          new THREE.Vector3(c.pos[0], c.pos[1], c.pos[2]),
        ]);
        const line = new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ color: 0x334155 })
        );
        rootGroup.add(line);
      });
    } else if (activeScene === 'VECTOR_RAG') {
      const pointCount = 75;
      const pointsGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount * 3; i += 3) {
        positions[i] = Math.sin(i * 1.341 + 0.1) * 5;
        positions[i + 1] = Math.cos(i * 2.113 + 0.3) * 5;
        positions[i + 2] = Math.sin(i * 3.789 + 0.5) * 4;
      }
      pointsGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      const pointsMat = new THREE.PointsMaterial({
        color: 0x6ea8fe,
        size: 0.35,
        transparent: true,
        opacity: 0.8,
      });
      const points = new THREE.Points(pointsGeo, pointsMat);
      rootGroup.add(points);

      const queryGeo = new THREE.SphereGeometry(0.6, 24, 24);
      const queryMat = new THREE.MeshStandardMaterial({
        color: 0x7cff6b,
        emissive: 0x7cff6b,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.8,
      });
      const queryMesh = new THREE.Mesh(queryGeo, queryMat);
      rootGroup.add(queryMesh);
    }

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
    let isPageVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewport = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(currentMount);

    let frameId = 0;
    const clock = new THREE.Clock();

    let curLiving = paramTargetRef.current.livingArea;
    let curQual = paramTargetRef.current.overallQual;
    let curRank = paramTargetRef.current.loraRank;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (!isInViewport || !isPageVisible) {
        frameId = window.setTimeout(tick, 200);
        return;
      }

      const dt = Math.min(clock.getDelta(), 0.1);
      const targets = paramTargetRef.current;

      curLiving = THREE.MathUtils.damp(curLiving, targets.livingArea, 10, dt);
      curQual = THREE.MathUtils.damp(curQual, targets.overallQual, 10, dt);
      curRank = THREE.MathUtils.damp(curRank, targets.loraRank, 10, dt);

      if (houseGroupRef) {
        const nx = Math.max(0, Math.min(1, (curLiving - 400) / (4400 - 400)));
        const nz = Math.max(0, Math.min(1, (curQual - 1) / 9));
        const wx = (nx - 0.5) * span;
        const wz = (0.5 - nz) * span;
        const normH = Math.min(
          1,
          0.12 + nx * 0.45 + Math.pow(nz, 1.6) * 0.5 + nx * nz * 0.25
        );
        const wy = -2.0 + normH * 4.2;

        houseGroupRef.position.set(wx, wy + 0.05, wz);
        const scaleW = 0.75 + nx * 0.85;
        const scaleH = 0.75 + nz * 0.85;
        houseGroupRef.scale.set(scaleW, scaleH, scaleW);
      }

      if (loraMeshARef && loraMeshBRef) {
        const rankScale = (curRank / 64) * 1.5 + 0.3;
        loraMeshARef.scale.x = rankScale;
        loraMeshARef.position.x = 3.4 + rankScale / 2;
        loraMeshBRef.scale.x = rankScale;
        loraMeshBRef.position.x = -3.4 - rankScale / 2;
      }

      if (
        !isDragging &&
        !prefersReducedMotion &&
        activeScene !== 'HOUSE_PRICE_3D'
      ) {
        rootGroup.rotation.y += dt * 0.21;
        rootGroup.rotation.x += dt * 0.07;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    };
  }, [activeScene]);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#101216] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Top Header & Scene Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 flex items-center justify-center text-[#7CFF6B]">
            {activeScene === 'HOUSE_PRICE_3D' && <Home className="w-4 h-4" />}
            {activeScene === 'PEFT_LORA' && <Cpu className="w-4 h-4" />}
            {activeScene === 'MULTI_AGENT' && <Network className="w-4 h-4" />}
            {activeScene === 'VERO_AST' && <ShieldCheck className="w-4 h-4" />}
            {activeScene === 'VECTOR_RAG' && <Database className="w-4 h-4" />}
          </div>
          <div>
            <div className="font-mono text-[11px] text-[#8B8F98] tracking-wide">
              02 · Interactive WebGL Topology Lab
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F2F2F2]">
              3D Project Architecture Workbench
            </h2>
          </div>
        </div>

        {/* Scene Navigation Tabs */}
        <div
          role="tablist"
          aria-label="3D Architecture Scenes"
          className="flex flex-wrap gap-1 p-1 bg-[#08090B] rounded-xl border border-white/[0.08] text-xs font-medium"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeScene === 'HOUSE_PRICE_3D'}
            onClick={() => setActiveScene('HOUSE_PRICE_3D')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeScene === 'HOUSE_PRICE_3D'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            House Price 3D
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeScene === 'PEFT_LORA'}
            onClick={() => setActiveScene('PEFT_LORA')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeScene === 'PEFT_LORA'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            PEFT / LoRA
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeScene === 'MULTI_AGENT'}
            onClick={() => setActiveScene('MULTI_AGENT')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeScene === 'MULTI_AGENT'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            Multi-Agent DAG
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeScene === 'VERO_AST'}
            onClick={() => setActiveScene('VERO_AST')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeScene === 'VERO_AST'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            Vero AST
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeScene === 'VECTOR_RAG'}
            onClick={() => setActiveScene('VECTOR_RAG')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeScene === 'VECTOR_RAG'
                ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                : 'text-[#8B8F98] hover:text-[#F2F2F2]'
            }`}
          >
            Vector RAG
          </button>
        </div>
      </div>

      {/* Responsive 3D Canvas Stage */}
      <div
        ref={mountRef}
        role="img"
        aria-label={`Interactive 3D scene for ${activeScene}`}
        className="w-full h-[320px] sm:h-[400px] lg:h-[460px] my-4 cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-xl bg-[#08090B] border border-white/[0.06]"
      >
        {webglFallback && (
          <div className="p-6 text-center space-y-2 font-mono">
            <div className="text-xs text-[#7CFF6B] font-bold">
              STATIC 3D TOPOLOGY PREVIEW ({activeScene})
            </div>
            <p className="text-[11px] text-[#8B8F98] max-w-md mx-auto">
              Interactive parameter controls remain active below. Use the sliders to inspect real-time valuation and rank scaling metrics.
            </p>
          </div>
        )}
        <div className="absolute bottom-3 left-3.5 pointer-events-none font-mono text-[11px] text-[#8B8F98]">
          Drag to orbit 3D stage · Adjust sliders below for real-time damped morphing
        </div>
      </div>

      {/* Interactive Controls based on Active Scene */}
      {activeScene === 'HOUSE_PRICE_3D' && (
        <div className="space-y-4 pt-3 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="p-3.5 rounded-xl bg-[#08090B] border border-white/[0.08] space-y-2 block">
              <span className="flex items-center justify-between font-mono">
                <span className="text-[#D1D5DB] font-semibold">
                  1. Living Area (Sq Ft):
                </span>
                <span className="text-[#7CFF6B] font-bold tabular-nums">
                  {livingArea.toLocaleString()} sq ft
                </span>
              </span>
              <input
                type="range"
                aria-label="Living Area in square feet"
                min={500}
                max={4200}
                step={50}
                value={livingArea}
                onChange={(e) => setLivingArea(Number(e.target.value))}
                className="w-full accent-[#7CFF6B] cursor-pointer"
              />
            </label>

            <label className="p-3.5 rounded-xl bg-[#08090B] border border-white/[0.08] space-y-2 block">
              <span className="flex items-center justify-between font-mono">
                <span className="text-[#D1D5DB] font-semibold">
                  2. Overall Quality (1–10):
                </span>
                <span className="text-[#6EA8FE] font-bold tabular-nums">
                  Level {overallQual} / 10
                </span>
              </span>
              <input
                type="range"
                aria-label="Overall Quality rating from 1 to 10"
                min={1}
                max={10}
                step={1}
                value={overallQual}
                onChange={(e) => setOverallQual(Number(e.target.value))}
                className="w-full accent-[#6EA8FE] cursor-pointer"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#08090B] p-4 rounded-xl border border-white/[0.1]">
            <div>
              <span className="font-mono text-[10px] text-[#8B8F98] block uppercase">
                ESTIMATED VALUATION
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#7CFF6B] tabular-nums">
                ${estimatedQuickPrice.toLocaleString()}
              </span>
            </div>
            <a
              href="/projects/house-price"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#project-house-price';
              }}
              className="group swift-spring-btn px-4 py-2.5 rounded-xl bg-[#7CFF6B] text-[#08090B] font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <SwiftRollLabel
                label="Open Full 3D Workbench & SHAP Case Study"
                hoverLabel="Inspect 1,458 Holdout Homes"
              />
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {activeScene === 'PEFT_LORA' && (
        <div className="space-y-4 pt-3 border-t border-white/[0.08] font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8B8F98] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#7CFF6B]" />
              <span>
                Interactive Rank (r): <strong className="text-[#F2F2F2]">{loraRank}</strong>
              </span>
            </span>
            <span className="text-[#7CFF6B] font-bold tabular-nums">
              VRAM: {(14.2 - (64 - loraRank) * 0.16).toFixed(1)} GB (Base: 14.2 GB)
            </span>
          </div>

          <input
            type="range"
            aria-label="PEFT LoRA Rank r"
            min={4}
            max={64}
            step={4}
            value={loraRank}
            onChange={(e) => setLoraRank(Number(e.target.value))}
            className="w-full accent-[#7CFF6B] bg-[#24272D] h-1.5 rounded cursor-pointer"
          />

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-[#08090B] p-3 rounded-xl border border-white/[0.08]">
              <div className="text-[10px] text-[#8B8F98]">ADAPTER MATRICES</div>
              <div className="text-sm font-bold text-[#F2F2F2] tabular-nums mt-0.5">
                A (4096×{loraRank}) · B ({loraRank}×4096)
              </div>
            </div>
            <div className="bg-[#08090B] p-3 rounded-xl border border-white/[0.08]">
              <div className="text-[10px] text-[#8B8F98]">TRAINABLE FRACTION</div>
              <div className="text-sm font-bold text-[#7CFF6B] tabular-nums mt-0.5">
                {((loraRank / 64) * 0.5).toFixed(2)}%
              </div>
            </div>
            <div className="bg-[#08090B] p-3 rounded-xl border border-white/[0.08]">
              <div className="text-[10px] text-[#8B8F98]">QUANTIZATION</div>
              <div className="text-sm font-bold text-[#6EA8FE] mt-0.5">
                4-bit NF4 NormalFloat
              </div>
            </div>
          </div>
        </div>
      )}

      {activeScene === 'MULTI_AGENT' && (
        <div className="space-y-3 pt-3 border-t border-white/[0.08] font-mono">
          <div className="text-xs text-[#8B8F98] flex items-center justify-between">
            <span>CrewAI &amp; LangGraph State DAG</span>
            <span className="text-[#7CFF6B]">Deterministic JSON Contracts</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            {[
              'Planner Agent',
              'Tool Executor',
              'Code Reviewer',
              'Critic & Guard',
            ].map((agent) => (
              <button
                key={agent}
                type="button"
                onClick={() => setSelectedAgentNode(agent)}
                className={`p-2 rounded-lg text-[11px] transition-colors cursor-pointer ${
                  selectedAgentNode === agent
                    ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                    : 'bg-[#08090B] text-[#8B8F98] border border-white/[0.08]'
                }`}
              >
                {agent}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeScene === 'VERO_AST' && (
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <div className="space-y-0.5">
            <div className="text-[#F2F2F2] font-bold">
              SonarQube Clean Code Invariants
            </div>
            <div className="text-[11px] text-[#8B8F98]">
              Rule S3649 · S2068 · S3776
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#7CFF6B] tabular-nums">
              &lt;35ms Latency
            </div>
            <div className="text-[10px] text-[#8B8F98]">
              Zero-chat hallucination
            </div>
          </div>
        </div>
      )}

      {activeScene === 'VECTOR_RAG' && (
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <div className="space-y-0.5">
            <div className="text-[#F2F2F2] font-bold">
              Cosmos DB Vector Clustered Embeddings
            </div>
            <div className="text-[11px] text-[#8B8F98]">
              Cosine Similarity: 0.92 · P95: 84ms
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#6EA8FE] tabular-nums">
              Top-3 Recall: 94%
            </div>
            <div className="text-[10px] text-[#8B8F98]">
              Dense Representation
            </div>
          </div>
        </div>
      )}

      {onInspectSpec && activeScene !== 'HOUSE_PRICE_3D' && (
        <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between font-mono">
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
