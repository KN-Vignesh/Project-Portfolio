import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight, Sparkles, Network, ExternalLink, Cpu, Layers } from 'lucide-react';
import { AI_LAB_NODES } from '../data/portfolioData';
import { AILabNode } from '../types';
import { ProjectItem } from '../types';

interface AILabSectionProps {
  projects: ProjectItem[];
  loading: boolean;
  onSelectProject: (projectId: string) => void;
}

export const AILabSection: React.FC<AILabSectionProps> = ({ projects, loading, onSelectProject }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('llms');
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const selectedNode = AI_LAB_NODES.find((n) => n.id === selectedNodeId) || AI_LAB_NODES[0];
  const connectedNodes = AI_LAB_NODES.filter((n) => selectedNode.connections.includes(n.id));
  const relatedProjects = projects.filter((p) => selectedNode.relatedProjectIds.includes(p.id));

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Node Meshes
    const nodeMeshes: { [key: string]: THREE.Mesh } = {};
    const nodeSpheres: { mesh: THREE.Mesh; id: string }[] = [];

    const defaultNodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const selectedNodeGeo = new THREE.SphereGeometry(0.28, 24, 24);

    AI_LAB_NODES.forEach((node) => {
      const isSelected = node.id === selectedNodeId;
      const isConnected = selectedNode.connections.includes(node.id);

      let color = 0x24272D;
      if (isSelected) color = 0x7CFF6B;
      else if (isConnected) color = 0x6EA8FE;
      else if (node.type === 'GENERATIVE_AI') color = 0x7CFF6B;
      else color = 0x8B8F98;

      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(isSelected ? selectedNodeGeo : defaultNodeGeo, mat);
      mesh.position.set(...node.coordinates);
      graphGroup.add(mesh);
      nodeMeshes[node.id] = mesh;
      nodeSpheres.push({ mesh, id: node.id });
    });

    // Connection Lines
    const linesGroup = new THREE.Group();
    graphGroup.add(linesGroup);

    AI_LAB_NODES.forEach((node) => {
      node.connections.forEach((targetId) => {
        const targetNode = AI_LAB_NODES.find((n) => n.id === targetId);
        if (targetNode) {
          const isHighlight =
            node.id === selectedNodeId ||
            targetId === selectedNodeId ||
            (selectedNode.connections.includes(node.id) && selectedNode.connections.includes(targetId));

          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...node.coordinates),
            new THREE.Vector3(...targetNode.coordinates)
          ]);
          const lineMat = new THREE.LineBasicMaterial({
            color: isHighlight ? 0x7CFF6B : 0x24272D,
            transparent: true,
            opacity: isHighlight ? 0.7 : 0.25,
          });
          linesGroup.add(new THREE.Line(lineGeo, lineMat));
        }
      });
    });

    // Raycasting for interactive click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeSpheres.map((s) => s.mesh));
      if (intersects.length > 0) {
        const hit = nodeSpheres.find((s) => s.mesh === intersects[0].object);
        if (hit) {
          setSelectedNodeId(hit.id);
        }
      }
    };

    mount.addEventListener('click', handleCanvasClick);

    // Mouse drag rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      graphGroup.rotation.y += deltaX * 0.006;
      graphGroup.rotation.x += deltaY * 0.006;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize observer
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        graphGroup.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      mount.removeEventListener('click', handleCanvasClick);
      mount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedNodeId]);

  return (
    <section id="ai-lab" className="py-24 border-t border-[#24272D] bg-[#101216]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#24272D]">
          <div>
            <div className="font-mono text-xs text-[#7CFF6B] tracking-widest uppercase mb-1">
              [04] // AI LAB CONSTELLATION
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F2F2]">
              EXPLORE THE SYSTEM CONSTELLATION
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98] mt-2 sm:mt-0">
            INTERACTIVE GRAPH // DRAG TO ROTATE
          </div>
        </div>

        {/* Constellation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 3D Visual Constellation Canvas */}
          <div className="lg:col-span-7 bg-[#08090B] border border-[#24272D] rounded-xl overflow-hidden relative shadow-2xl">
            
            {/* Top Instruction Pill */}
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded bg-[#101216]/90 border border-[#24272D] font-mono text-[11px] text-[#8B8F98] flex items-center gap-2 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
              <span>CLICK NODES OR DRAG TO ROTATE SYSTEM GRAPH</span>
            </div>

            {/* 3D Canvas Mount */}
            <div ref={canvasMountRef} className="w-full h-[400px] sm:h-[480px] cursor-grab active:cursor-grabbing" />

            {/* Node Quick Switch Buttons */}
            <div className="p-3 bg-[#101216] border-t border-[#24272D] overflow-x-auto flex gap-1.5 font-mono text-[10px]">
              {AI_LAB_NODES.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors cursor-pointer ${
                    selectedNodeId === node.id
                      ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                      : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-[#24272D]'
                  }`}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </div>

          {/* Node Inspector Card */}
          <div className="lg:col-span-5 bg-[#101216] border border-[#24272D] rounded-xl p-6 font-mono space-y-5">
            
            {/* Active Node Header */}
            <div className="pb-4 border-b border-[#24272D] space-y-1">
              <div className="text-[10px] text-[#7CFF6B] tracking-wider uppercase font-semibold">
                NODE TYPE: {selectedNode.type}
              </div>
              <h3 className="text-xl font-bold text-[#F2F2F2]">
                {selectedNode.label}
              </h3>
            </div>

            {/* Description */}
            <p className="text-xs text-[#8B8F98] leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Connected Nodes */}
            <div className="space-y-2">
              <div className="text-[11px] text-[#8B8F98] uppercase">
                INTERCONNECTED CONSTELLATION NODES:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {connectedNodes.map((conn) => (
                  <button
                    key={conn.id}
                    onClick={() => setSelectedNodeId(conn.id)}
                    className="px-2.5 py-1 rounded bg-[#08090B] border border-[#24272D] text-[#6EA8FE] hover:border-[#6EA8FE] text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{conn.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            {/* Associated Portfolio Projects */}
            <div className="space-y-2.5 pt-2 border-t border-[#24272D]">
              <div className="text-[11px] text-[#7CFF6B] uppercase font-semibold">
                IMPLEMENTED IN PORTFOLIO:
              </div>
              
              {relatedProjects.length > 0 ? (
                <div className="space-y-2">
                  {relatedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3 rounded bg-[#08090B] border border-[#24272D] hover:border-[#7CFF6B] transition-colors flex items-center justify-between group cursor-pointer"
                      onClick={() => onSelectProject(proj.id)}
                    >
                      <div>
                        <div className="text-[10px] text-[#8B8F98]">{proj.number}</div>
                        <div className="text-xs text-[#F2F2F2] font-semibold group-hover:text-[#7CFF6B]">
                          {proj.title}
                        </div>
                      </div>
                      <button className="text-[#7CFF6B] text-xs flex items-center gap-1">
                        <span>OPEN</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#8B8F98] italic">
                  Theoretical foundation grounding applied across multiple architecture pipelines.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
