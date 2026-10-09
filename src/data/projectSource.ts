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

    return remoteProjects.map((project) => {
      if (project.repository) return project;
      const projectPath = project.projectPath as string;
      return {
        ...project,
        repository: `https://github.com/KN-Vignesh/Projects/tree/main/${projectPath.replace(/^\/+/, '')}`,
      };
    });
  } catch (err) {
    console.info('[Project Registry] Remote fetch failed. Serving verified local project registry.', err);
    return loadFallbackProjects();
  }
}

