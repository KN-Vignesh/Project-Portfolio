import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight } from 'lucide-react';
import { AI_LAB_NODES } from '../data/portfolioData';
import { ProjectItem } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { NutshellText } from './Nutshell';

interface AILabSectionProps {
  projects: ProjectItem[];
  loading: boolean;
  onSelectProject: (projectId: string) => void;
}

export const AILabSection: React.FC<AILabSectionProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('llms');
  const [webglFallback, setWebglFallback] = useState<boolean>(false);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const selectedNode =
    AI_LAB_NODES.find((n) => n.id === selectedNodeId) || AI_LAB_NODES[0];
  const connectedNodes = AI_LAB_NODES.filter((n) =>
    selectedNode.connections.includes(n.id)
  );
  const relatedProjects = projects.filter((p) =>
    selectedNode.relatedProjectIds.includes(p.id)
  );

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setWebglFallback(true);
      return;
    }

    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|Microsoft Basic Render/i.test(
      rendererStr
    );

    const afterDraw =
      isSoftwareGl && typeof (gl as WebGL2RenderingContext).fenceSync === 'function'
        ? () => {
            const gl2 = gl as WebGL2RenderingContext;
            const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
            gl2.flush();
            return new Promise<void>((resolve) => {
              function poll() {
                const status = gl2.clientWaitSync(sync!, 0, 0);
                if (
                  status === gl2.ALREADY_SIGNALED ||
                  status === gl2.CONDITION_SATISFIED ||
                  status === gl2.WAIT_FAILED
                ) {
                  gl2.deleteSync(sync);
                  resolve();
                } else {
                  setTimeout(poll, 4);
                }
              }
              setTimeout(poll, 4);
            });
          }
        : () => {
            gl.finish();
            return Promise.resolve();
          };

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    mount.appendChild(renderer.domElement);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    const nodeSpheres: { mesh: THREE.Mesh; id: string }[] = [];
    const defaultNodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const selectedNodeGeo = new THREE.SphereGeometry(0.28, 24, 24);

    AI_LAB_NODES.forEach((node) => {
      const isSelected = node.id === selectedNodeId;
      const isConnected = selectedNode.connections.includes(node.id);

      let color = 0x24272d;
      if (isSelected) color = 0x7cff6b;
      else if (isConnected) color = 0x6ea8fe;
      else if (node.type === 'GENERATIVE_AI') color = 0x7cff6b;
      else color = 0x8b8f98;

      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(
        isSelected ? selectedNodeGeo : defaultNodeGeo,
        mat
      );
      mesh.position.set(...node.coordinates);
      graphGroup.add(mesh);
      nodeSpheres.push({ mesh, id: node.id });
    });

    const linesGroup = new THREE.Group();
    graphGroup.add(linesGroup);

    AI_LAB_NODES.forEach((node) => {
      node.connections.forEach((targetId) => {
        const targetNode = AI_LAB_NODES.find((n) => n.id === targetId);
        if (targetNode) {
          const isHighlight =
            node.id === selectedNodeId ||
            targetId === selectedNodeId ||
            (selectedNode.connections.includes(node.id) &&
              selectedNode.connections.includes(targetId));

          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...node.coordinates),
            new THREE.Vector3(...targetNode.coordinates),
          ]);
          const lineMat = new THREE.LineBasicMaterial({
            color: isHighlight ? 0x7cff6b : 0x24272d,
            transparent: true,
            opacity: isHighlight ? 0.7 : 0.25,
          });
          linesGroup.add(new THREE.Line(lineGeo, lineMat));
        }
      });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        nodeSpheres.map((s) => s.mesh)
      );
      if (intersects.length > 0) {
        const hit = nodeSpheres.find((s) => s.mesh === intersects[0].object);
        if (hit) {
          setSelectedNodeId(hit.id);
        }
      }
    };

    mount.addEventListener('click', handleCanvasClick);

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

    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    let isDocumentHidden = document.hidden;
    const handleVisibilityChange = () => {
      isDocumentHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let disposed = false;
    let animId = 0;

    const tick = () => {
      if (disposed) return;
      if (!isVisible || isDocumentHidden) {
        animId = requestAnimationFrame(tick);
        return;
      }

      if (!isDragging && !prefersReducedMotion) {
        graphGroup.rotation.y += 0.002;
      }
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw().then(() => {
          if (!disposed) animId = requestAnimationFrame(tick);
        });
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mount.removeEventListener('click', handleCanvasClick);
      mount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      defaultNodeGeo.dispose();
      selectedNodeGeo.dispose();
      renderer.dispose();
    };
  }, [selectedNodeId]);

  return (
    <section
      id="ai-lab"
      className="py-24 lg:py-28 border-t border-white/[0.08] bg-[#101216]/60 relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="font-mono text-xs text-[#8B8F98] tracking-wide uppercase">
              04 · AI Architecture Constellation
            </div>
            <h2 className="editorial-h2 font-bold text-[#F2F2F2]">
              Explore the System Constellation
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8B8F98]">
            Interactive Knowledge Graph · Select Node or Drag to Rotate
          </div>
        </ScrollReveal>

        {/* Constellation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3D Visual Constellation Canvas */}
          <div className="lg:col-span-7 bg-[#08090B] border border-white/[0.08] rounded-2xl overflow-hidden relative shadow-2xl">
            {/* Top Instruction Overlay */}
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-[#101216]/90 border border-white/[0.08] font-mono text-[11px] text-[#8B8F98] pointer-events-none">
              Click nodes or use the buttons below to inspect system dependencies
            </div>

            {/* 3D Canvas Mount or Fallback */}
            {webglFallback ? (
              <div className="w-full h-[400px] sm:h-[460px] flex items-center justify-center p-6 text-center font-mono text-xs text-[#8B8F98]">
                Interactive 3D graph running in static accessible mode. Use the node selector buttons below to inspect architecture nodes.
              </div>
            ) : (
              <div
                ref={canvasMountRef}
                aria-label="Interactive 3D AI system constellation graph"
                className="w-full h-[400px] sm:h-[460px] cursor-grab active:cursor-grabbing"
              />
            )}

            {/* Accessible Keyboard Node Switch Buttons */}
            <div
              role="tablist"
              aria-label="Constellation Domain Nodes"
              className="p-3 bg-[#101216] border-t border-white/[0.08] overflow-x-auto flex gap-1.5 font-mono text-[11px]"
            >
              {AI_LAB_NODES.map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#7CFF6B] text-[#08090B] font-bold'
                        : 'bg-[#08090B] text-[#8B8F98] hover:text-[#F2F2F2] border border-white/[0.08]'
                    }`}
                  >
                    {node.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Card */}
          <div className="lg:col-span-5 bg-[#101216] border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-5">
            {/* Active Node Header */}
            <div className="pb-4 border-b border-white/[0.08] space-y-1">
              <div className="font-mono text-[11px] text-[#7CFF6B] tracking-wider uppercase font-semibold">
                Domain Node · {selectedNode.type.replace('_', ' ')}
              </div>
              <h3 className="text-xl font-bold text-[#F2F2F2]">
                {selectedNode.label}
              </h3>
            </div>

            {/* Description */}
            <NutshellText
              blockId={`ai-lab-node-${selectedNode.id}`}
              as="p"
              maxTriggers={2}
              className="text-sm text-[#D1D5DB] leading-relaxed"
              text={selectedNode.description}
            />

            {/* Connected Nodes */}
            <div className="space-y-2.5">
              <div className="font-mono text-[11px] text-[#8B8F98] uppercase tracking-wider">
                Interconnected Architecture Nodes
              </div>
              <div className="flex flex-wrap gap-2">
                {connectedNodes.map((conn) => (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => setSelectedNodeId(conn.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#08090B] border border-white/[0.08] text-[#6EA8FE] hover:border-[#6EA8FE] font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{conn.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            {/* Associated Portfolio Projects */}
            <div className="space-y-3 pt-3 border-t border-white/[0.08]">
              <div className="font-mono text-[11px] text-[#7CFF6B] uppercase tracking-wider font-semibold">
                Implemented in Portfolio Case Studies
              </div>

              {relatedProjects.length > 0 ? (
                <div className="space-y-2">
                  {relatedProjects.map((proj) => (
                    <a
                      key={proj.id}
                      href={`/projects/${proj.id}`}
                      onClick={(e) => {
                        if (
                          !e.metaKey &&
                          !e.ctrlKey &&
                          !e.shiftKey &&
                          !e.altKey
                        ) {
                          e.preventDefault();
                          onSelectProject(proj.id);
                        }
                      }}
                      className="p-3.5 rounded-xl bg-[#08090B] border border-white/[0.08] hover:border-[#7CFF6B]/60 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-mono text-[10px] text-[#8B8F98]">
                          {proj.number} · {proj.category.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-[#F2F2F2] font-semibold group-hover:text-[#7CFF6B] transition-colors mt-0.5">
                          {proj.title}
                        </div>
                      </div>
                      <span className="font-mono text-[#7CFF6B] text-xs flex items-center gap-1 shrink-0">
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#8B8F98] italic">
                  Core theoretical grounding applied across multiple engineering pipelines.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
