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

export async function fetchProjects(): Promise<ProjectItem[]> {
  let response: Response;

  try {
    response = await fetch(projectDataUrl);
  } catch (error) {
    throw new Error(
      `Unable to reach the project registry at ${projectDataUrl}: ${
        error instanceof Error ? error.message : 'network request failed'
      }`
    );
  }

  if (!response.ok) {
    throw new Error(`Project registry request failed with HTTP ${response.status}.`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Project registry returned malformed JSON.');
  }

  if (!payload || typeof payload !== 'object' || !Array.isArray((payload as { projects?: unknown }).projects)) {
    throw new Error('Project registry is invalid: expected a projects array.');
  }

  const projects = (payload as { projects: unknown[] }).projects;
  if (!projects.every(isProjectItem)) {
    throw new Error('Project registry is invalid: one or more projects are malformed.');
  }

  return projects.map((project) => {
    if (project.repository) return project;
    const projectPath = project.projectPath as string;
    return {
      ...project,
      repository: `https://github.com/KN-Vignesh/Projects/tree/main/${projectPath.replace(/^\/+/, '')}`,
    };
  });
}