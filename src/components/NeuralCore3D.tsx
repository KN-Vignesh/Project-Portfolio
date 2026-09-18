import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const NeuralCore3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Neural Core Node Graph
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Nodes geometry & materials
    const nodeCount = 28;
    const nodePositions: THREE.Vector3[] = [];
    const baseNodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    const nodeGeometry = new THREE.SphereGeometry(0.09, 16, 16);
    const centerNodeGeometry = new THREE.SphereGeometry(0.22, 24, 24);

    const normalNodeMaterial = new THREE.MeshBasicMaterial({ color: 0x7CFF6B });
    const blueNodeMaterial = new THREE.MeshBasicMaterial({ color: 0x6EA8FE });
    const centerNodeMaterial = new THREE.MeshBasicMaterial({ color: 0x7CFF6B });

    // Center Core Node
    const centerNode = new THREE.Mesh(centerNodeGeometry, centerNodeMaterial);
    centerNode.position.set(0, 0, 0);
    coreGroup.add(centerNode);
    nodePositions.push(new THREE.Vector3(0, 0, 0));
    baseNodePositions.push(new THREE.Vector3(0, 0, 0));
    nodeMeshes.push(centerNode);

    // Surrounding layered nodes
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 1; i < nodeCount; i++) {
      const radius = 1.8 + (i % 3) * 0.9;
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos.clone());
      baseNodePositions.push(pos.clone());

      const mat = (i % 4 === 0) ? blueNodeMaterial : normalNodeMaterial;
      const mesh = new THREE.Mesh(nodeGeometry, mat);
      mesh.position.copy(pos);
      coreGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    // Dynamic Connections (Line Segments)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x24272D,
      transparent: true,
      opacity: 0.7,
    });

    const activeLineMaterial = new THREE.LineBasicMaterial({
      color: 0x7CFF6B,
      transparent: true,
      opacity: 0.45,
    });

    // Build connections based on distance
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

    // Line geometry builder
    const updateLines = () => {
      // Clear previous lines
      while (linesGroup.children.length > 0) {
        const obj = linesGroup.children[0];
        linesGroup.remove(obj);
        if (obj instanceof THREE.Line) {
          obj.geometry.dispose();
        }
      }

      // Draw active and standard lines
      connections.forEach(([i, j, isHighlight]) => {
        const p1 = nodeMeshes[i].position;
        const p2 = nodeMeshes[j].position;
        const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const line = new THREE.Line(geometry, isHighlight ? activeLineMaterial : lineMaterial);
        linesGroup.add(line);
      });
    };

    updateLines();

    // Floating background particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePos[p] = (Math.random() - 0.5) * 12;
      particlePos[p + 1] = (Math.random() - 0.5) * 12;
      particlePos[p + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8B8F98,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentMount);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Slow continuous rotation
        coreGroup.rotation.y += 0.003 + (targetRotationY - coreGroup.rotation.y) * 0.05;
        coreGroup.rotation.x += 0.0015 + (targetRotationX - coreGroup.rotation.x) * 0.05;

        // Subtle node breathing motion
        for (let i = 1; i < nodeCount; i++) {
          const mesh = nodeMeshes[i];
          const base = baseNodePositions[i];
          const offset = Math.sin(elapsedTime * 1.5 + i) * 0.06;
          mesh.position.x = base.x * (1 + offset * 0.5);
          mesh.position.y = base.y * (1 + offset * 0.5);
          mesh.position.z = base.z * (1 + offset * 0.5);
        }

        // Particle subtle drift
        particles.rotation.y = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
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
    <div className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] flex items-center justify-center pointer-events-none select-none">
      <div ref={mountRef} className="w-full h-full pointer-events-auto" />
      {/* Visual System Overlay Label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded border border-[#24272D] bg-[#101216]/80 backdrop-blur-sm font-mono text-[11px] text-[#8B8F98] tracking-widest flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
        <span>AI ENGINEERING CORE // INTERACTIVE</span>
      </div>
    </div>
  );
};
