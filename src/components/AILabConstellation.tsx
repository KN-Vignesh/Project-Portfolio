import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AI_LAB_NODES, PROJECTS } from '../data/portfolioData';
import { AILabNode } from '../types';
import { Sparkles, ArrowRight, Layers, Network, Activity } from 'lucide-react';

interface AILabConstellationProps {
  onSelectProject: (projectId: string) => void;
  reducedMotion?: boolean;
}

export const AILabConstellation: React.FC<AILabConstellationProps> = ({
  onSelectProject,
  reducedMotion = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('llms');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeNode = AI_LAB_NODES.find((n) => n.id === selectedNodeId) || AI_LAB_NODES[3];
  const relatedProjects = PROJECTS.filter((p) => activeNode.relatedProjectIds.includes(p.id));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    // Node meshes
    const nodeMeshes: { mesh: THREE.Mesh; node: AILabNode; glow: THREE.Mesh }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const glowGeo = new THREE.SphereGeometry(0.38, 16, 16);

    AI_LAB_NODES.forEach((node) => {
      const isSelected = node.id === selectedNodeId;
      const isConnected = activeNode.connections.includes(node.id);

      let color = 0x8B8F98;
      if (node.type === 'GENERATIVE_AI') color = 0x7CFF6B;
      else if (node.type === 'MODEL_ENGINEERING') color = 0x6EA8FE;
      else if (node.type === 'SYSTEMS_APPLICATION') color = 0xFFB86B;
      else color = 0xF2F2F2;

      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...node.coordinates);
      mesh.userData = { nodeId: node.id };

      const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: isSelected ? 0.45 : isConnected ? 0.25 : 0.08,
        wireframe: true,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      mesh.add(glow);

      constellationGroup.add(mesh);
      nodeMeshes.push({ mesh, node, glow });
    });

    // Draw connection lines
    const lineGroup = new THREE.Group();
    constellationGroup.add(lineGroup);

    const updateLines = () => {
      while (lineGroup.children.length > 0) {
        lineGroup.remove(lineGroup.children[0]);
      }

      AI_LAB_NODES.forEach((sourceNode) => {
        const sourceMesh = nodeMeshes.find((n) => n.node.id === sourceNode.id);
        if (!sourceMesh) return;

        sourceNode.connections.forEach((targetId) => {
          const targetMesh = nodeMeshes.find((n) => n.node.id === targetId);
          if (!targetMesh) return;

          const points = [sourceMesh.mesh.position, targetMesh.mesh.position];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

          const isDirectlyActive =
            sourceNode.id === selectedNodeId ||
            targetId === selectedNodeId ||
            (activeNode.connections.includes(sourceNode.id) &&
              activeNode.connections.includes(targetId));

          const lineMat = new THREE.LineBasicMaterial({
            color: isDirectlyActive ? 0x7CFF6B : 0x24272D,
            transparent: true,
            opacity: isDirectlyActive ? 0.75 : 0.25,
            linewidth: isDirectlyActive ? 2 : 1,
          });

          const line = new THREE.Line(lineGeo, lineMat);
          lineGroup.add(line);
        });
      });
    };

    updateLines();

    // Raycasting for node clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const nodeId = clickedMesh.userData.nodeId;
        if (nodeId) {
          setSelectedNodeId(nodeId);
        }
      }
    };

    const onPointerMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object as THREE.Mesh;
        setHoveredNodeId(hoveredMesh.userData.nodeId);
        container.style.cursor = 'pointer';
      } else {
        setHoveredNodeId(null);
        container.style.cursor = 'grab';
      }
    };

    container.addEventListener('click', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);

    // Resize handling
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

    // Animation
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!reducedMotion) {
        constellationGroup.rotation.y += 0.002;
        constellationGroup.rotation.x = Math.sin(time * 0.3) * 0.1;

        // Pulse selected node
        nodeMeshes.forEach((item) => {
          if (item.node.id === selectedNodeId) {
            const scale = 1.1 + Math.sin(time * 4) * 0.15;
            item.mesh.scale.set(scale, scale, scale);
            item.glow.scale.set(scale * 1.3, scale * 1.3, scale * 1.3);
          } else {
            item.mesh.scale.set(1, 1, 1);
            item.glow.scale.set(1, 1, 1);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('click', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedNodeId, activeNode, reducedMotion]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* 3D Canvas Area */}
      <div className="lg:col-span-7 bg-[#101216] border border-[#24272D] rounded-lg p-4 relative flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#24272D] pb-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
            <span className="font-mono text-xs text-[#F2F2F2] tracking-wider uppercase">
              INTERACTIVE AI CONSTELLATION
            </span>
          </div>
          <div className="font-mono text-[11px] text-[#8B8F98]">
            {hoveredNodeId ? `TARGET: ${hoveredNodeId.toUpperCase()}` : 'CLICK NODE TO INSPECT'}
          </div>
        </div>

        {/* 3D Mount container */}
        <div
          ref={mountRef}
          className="w-full h-[360px] md:h-[440px] relative cursor-grab active:cursor-grabbing"
          title="Click any node to inspect system relationships"
        />

        {/* Legend */}
        <div className="pt-3 border-t border-[#24272D] flex flex-wrap gap-4 text-xs font-mono text-[#8B8F98]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7CFF6B]"></span>
            <span>GENERATIVE AI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6EA8FE]"></span>
            <span>MODEL ENGINEERING</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB86B]"></span>
            <span>SYSTEMS / DEPLOYMENT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2F2F2]"></span>
            <span>FOUNDATIONS</span>
          </div>
        </div>
      </div>

      {/* Selected Node Details Inspector */}
      <div className="lg:col-span-5 bg-[#101216] border border-[#24272D] rounded-lg p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs px-2.5 py-1 bg-[#15181D] border border-[#24272D] text-[#7CFF6B] rounded">
              NODE: {activeNode.id.toUpperCase()}
            </span>
            <span className="font-mono text-xs text-[#8B8F98] uppercase">
              TYPE: {activeNode.type.replace('_', ' ')}
            </span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-[#F2F2F2] mb-3">
            {activeNode.label}
          </h3>

          <p className="text-sm text-[#8B8F98] leading-relaxed mb-6">
            {activeNode.description}
          </p>

          <div className="mb-6">
            <h4 className="font-mono text-xs text-[#8B8F98] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#6EA8FE]" />
              DIRECT TOPOLOGICAL CONNECTIONS
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeNode.connections.map((connId) => {
                const connNode = AI_LAB_NODES.find((n) => n.id === connId);
                return (
                  <button
                    key={connId}
                    onClick={() => setSelectedNodeId(connId)}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-[#15181D] border border-[#24272D] hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-colors"
                  >
                    → {connNode ? connNode.label : connId}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs text-[#8B8F98] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#7CFF6B]" />
              ASSOCIATED REPOSITORY PROJECTS
            </h4>

            {relatedProjects.length > 0 ? (
              <div className="space-y-2.5">
                {relatedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#15181D] border border-[#24272D] hover:border-[#7CFF6B]/60 rounded transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] text-[#7CFF6B]">
                        {p.number}
                      </span>
                      <span className="font-mono text-[10px] text-[#8B8F98]">
                        {p.category}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-[#F2F2F2] group-hover:text-[#7CFF6B] transition-colors">
                      {p.title}
                    </div>
                    <p className="text-xs text-[#8B8F98] line-clamp-2 mt-1 mb-2">
                      {p.tagline}
                    </p>
                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="font-mono text-xs text-[#6EA8FE] hover:text-[#7CFF6B] flex items-center gap-1 transition-colors"
                    >
                      OPEN ARCHITECTURE SPEC <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8B8F98] italic font-mono">
                Foundational architecture layer informing all system pipelines.
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-[#24272D] flex items-center justify-between text-[11px] font-mono text-[#8B8F98]">
          <span>STATUS: VERIFIED WORKFLOW</span>
          <span className="text-[#7CFF6B]">READY FOR PRODUCTION</span>
        </div>
      </div>
    </div>
  );
};
