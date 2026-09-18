import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NeuralCoreProps {
  reducedMotion?: boolean;
}

export const NeuralCore: React.FC<NeuralCoreProps> = ({ reducedMotion = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for rotation
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Node geometry & material
    const nodeCount = 38;
    const nodes: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    const nodeGeometry = new THREE.SphereGeometry(0.16, 12, 12);
    const primaryMaterial = new THREE.MeshBasicMaterial({ color: 0x7CFF6B }); // Accent Green
    const secondaryMaterial = new THREE.MeshBasicMaterial({ color: 0x6EA8FE }); // Accent Blue
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xF2F2F2 });

    // Generate balanced 3D distribution inside sphere volume
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 4.2 + (Math.random() - 0.5) * 1.5;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const pos = new THREE.Vector3(x, y, z);
      nodes.push(pos);

      const mat = i % 5 === 0 ? primaryMaterial : i % 3 === 0 ? secondaryMaterial : whiteMaterial;
      const mesh = new THREE.Mesh(nodeGeometry, mat);
      mesh.position.copy(pos);
      coreGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    // Connect close nodes with lines
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDistance = 3.6;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < maxDistance) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);

          // Subtle opacity/color based on index
          const isGreen = i % 4 === 0 || j % 4 === 0;
          if (isGreen) {
            lineColors.push(0.48, 1.0, 0.42, 0.35, 1.0, 0.42);
          } else {
            lineColors.push(0.43, 0.65, 0.99, 0.43, 0.65, 0.99);
          }
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x36404E,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    coreGroup.add(lineSegments);

    // Inner Central Core
    const innerCoreGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x7CFF6B,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCore);

    // Particles Cloud
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x8B8F98,
      transparent: true,
      opacity: 0.5,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.6;
      targetRotationX = -mouseY * 0.6;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!reducedMotion) {
        coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05 + 0.003;
        coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;
        coreGroup.rotation.z = Math.sin(time * 0.5) * 0.05;

        innerCore.rotation.x += 0.01;
        innerCore.rotation.y -= 0.008;

        particleSystem.rotation.y += 0.0008;

        // Subtle pulsing for nodes
        const pulse = Math.sin(time * 2) * 0.05 + 1;
        innerCore.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      id="hero-neural-core"
      ref={mountRef}
      className="relative w-full h-full min-h-[380px] md:min-h-[460px] flex items-center justify-center cursor-crosshair pointer-events-auto"
      title="Interactive AI Neural Core — Drag or move mouse to inspect nodes"
    >
      <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#8B8F98]/60 tracking-wider uppercase pointer-events-none select-none">
        CORE_LATENCY: 0.04ms · NODES: 38 ACTIVE
      </div>
    </div>
  );
};
