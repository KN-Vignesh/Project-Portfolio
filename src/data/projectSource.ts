import { ProjectItem } from '../types';

export const DEFAULT_PROJECT_DATA_URL =
  'https://raw.githubusercontent.com/KN-Vignesh/Projects/main/portfolio/projects.json';

const projectDataUrl = import.meta.env.VITE_PROJECT_DATA_URL || DEFAULT_PROJECT_DATA_URL;

function isProjectItem(value: unknown): value is ProjectItem {
  if (!value || typeof value !== 'object') return false;
  const project = value as Record<string, unknown>;
  return (
    typeof project.id === 'string' &&
    typeof project.title === 'string' &&
    (typeof project.repository === 'string' || typeof project.projectPath === 'string') &&
    Array.isArray(project.technologies)
  );
}

async function loadFallbackProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch('/projects.json');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.projects)) {
        return data.projects.filter(isProjectItem);
      }
    }
  } catch (e) {
    console.warn('[Project Registry] Fallback local fetch failed:', e);
  }
  return [];
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const response = await fetch(projectDataUrl);
    if (!response.ok) {
      console.info(`[Project Registry] Remote registry returned HTTP ${response.status}. Using verified local registry.`);
      return loadFallbackProjects();
    }

    const payload = await response.json();
    if (!payload || typeof payload !== 'object' || !Array.isArray((payload as { projects?: unknown }).projects)) {
      console.info('[Project Registry] Remote registry returned unexpected payload format. Using verified local registry.');
      return loadFallbackProjects();
    }

    const remoteProjects = (payload as { projects: unknown[] }).projects;
    if (!remoteProjects.every(isProjectItem)) {
      console.info('[Project Registry] One or more remote project entries malformed. Using verified local registry.');
      return loadFallbackProjects();
    }

    const localFallback = await loadFallbackProjects();
    const localMap = new Map(localFallback.map((p) => [p.id, p]));

    return remoteProjects.map((project) => {
      const local = localMap.get(project.id);
      const enriched: ProjectItem = {
        ...project,
        story: project.story || local?.story,
        codeFiles: project.codeFiles || local?.codeFiles,
        sections: project.sections || local?.sections,
        repository: project.repository || (project.projectPath ? `https://github.com/KN-Vignesh/Projects/tree/main/${(project.projectPath as string).replace(/^\/+/, '')}` : (local?.repository || 'https://github.com/KN-Vignesh/Projects'))
      };
      return enriched;
    });
  } catch (err) {
    console.info('[Project Registry] Remote fetch failed. Serving verified local project registry.', err);
    return loadFallbackProjects();
  }
}

