import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const NeuralCore3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFallback, setWebglFallback] = useState<boolean>(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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
    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.z = 9;

    const existingCanvases = currentMount.querySelectorAll('canvas');
    existingCanvases.forEach((c) => c.remove());

    let renderer: THREE.WebGLRenderer;
    let envTexture: THREE.Texture | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
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

    const keyLight = new THREE.PointLight(0x7cff6b, 3.2, 40);
    keyLight.position.set(5, 5, 7);
    scene.add(keyLight);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const nodeCount = 28;
    const nodePositions: THREE.Vector3[] = [];
    const baseNodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    const nodeGeometry = new THREE.SphereGeometry(0.11, 20, 20);
    const centerNodeGeometry = new THREE.SphereGeometry(0.28, 28, 28);

    const normalNodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x7cff6b,
      emissive: 0x7cff6b,
      emissiveIntensity: 0.35,
      roughness: 0.18,
      metalness: 0.85,
    });
    const blueNodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x6ea8fe,
      emissive: 0x6ea8fe,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.85,
    });
    const centerNodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x7cff6b,
      emissive: 0x7cff6b,
      emissiveIntensity: 0.55,
      roughness: 0.15,
      metalness: 0.9,
    });

    const centerNode = new THREE.Mesh(centerNodeGeometry, centerNodeMaterial);
    centerNode.position.set(0, 0, 0);
    coreGroup.add(centerNode);
    nodePositions.push(new THREE.Vector3(0, 0, 0));
    baseNodePositions.push(new THREE.Vector3(0, 0, 0));
    nodeMeshes.push(centerNode);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 1; i < nodeCount; i++) {
      const radius = 1.8 + (i % 3) * 0.9;
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos.clone());
      baseNodePositions.push(pos.clone());

      const mat = i % 4 === 0 ? blueNodeMaterial : normalNodeMaterial;
      const mesh = new THREE.Mesh(nodeGeometry, mat);
      mesh.position.copy(pos);
      coreGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x24272d,
      transparent: true,
      opacity: 0.7,
    });

    const activeLineMaterial = new THREE.LineBasicMaterial({
      color: 0x7cff6b,
      transparent: true,
      opacity: 0.45,
    });

    const linesGroup = new THREE.Group();
    coreGroup.add(linesGroup);

    const connections: [number, number, boolean][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = baseNodePositions[i].distanceTo(baseNodePositions[j]);
        if (dist < 2.3 || (i === 0 && dist < 3.2)) {
          const isHighlight = i === 0 || (i + j) % 5 === 0;
          connections.push([i, j, isHighlight]);
        }
      }
    }

    connections.forEach(([i, j, isHighlight]) => {
      const p1 = nodeMeshes[i].position;
      const p2 = nodeMeshes[j].position;
      const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(
        geometry,
        isHighlight ? activeLineMaterial : lineMaterial
      );
      linesGroup.add(line);
    });

    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePos[p] = Math.sin(p * 1.512 + 0.2) * 6;
      particlePos[p + 1] = Math.cos(p * 2.314 + 0.4) * 6;
      particlePos[p + 2] = Math.sin(p * 3.123 + 0.6) * 4;
    }
    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePos, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x8b8f98,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
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
      const elapsedTime = clock.elapsedTime;

      if (!prefersReducedMotion) {
        coreGroup.rotation.y = THREE.MathUtils.damp(
          coreGroup.rotation.y,
          coreGroup.rotation.y +
            0.18 +
            (targetRotationY - coreGroup.rotation.y) * 0.4,
          6,
          dt
        );
        coreGroup.rotation.x = THREE.MathUtils.damp(
          coreGroup.rotation.x,
          coreGroup.rotation.x +
            0.08 +
            (targetRotationX - coreGroup.rotation.x) * 0.4,
          6,
          dt
        );

        for (let i = 1; i < nodeCount; i++) {
          const mesh = nodeMeshes[i];
          const base = baseNodePositions[i];
          const offset = Math.sin(elapsedTime * 1.5 + i) * 0.06;
          mesh.position.x = base.x * (1 + offset * 0.5);
          mesh.position.y = base.y * (1 + offset * 0.5);
          mesh.position.z = base.z * (1 + offset * 0.5);
        }

        particles.rotation.y = elapsedTime * 0.02;
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
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      envTexture?.dispose();
      renderer.dispose();
      nodeGeometry.dispose();
      centerNodeGeometry.dispose();
      normalNodeMaterial.dispose();
      blueNodeMaterial.dispose();
      centerNodeMaterial.dispose();
      lineMaterial.dispose();
      activeLineMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="3D Neural Attention Graph visualization"
      className="relative w-full h-[360px] sm:h-[420px] rounded-2xl border border-white/[0.08] bg-[#101216] flex items-center justify-center overflow-hidden select-none"
    >
      <div ref={mountRef} className="w-full h-full pointer-events-auto" />
      {webglFallback && (
        <div className="p-6 text-center space-y-2 font-mono">
          <div className="text-xs text-[#7CFF6B] font-bold">
            3D NEURAL ATTENTION TOPOLOGY (STATIC FALLBACK)
          </div>
          <p className="text-[11px] text-[#8B8F98] max-w-xs mx-auto">
            28-Node Multi-Head Self-Attention Graph · Fibonacci Spherical Lattice
          </p>
        </div>
      )}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg border border-white/[0.08] bg-[#08090B] font-mono text-[11px] text-[#8B8F98] tracking-wide pointer-events-none">
        3D Neural Attention Graph · Interactive Orbit
      </div>
    </div>
  );
};
