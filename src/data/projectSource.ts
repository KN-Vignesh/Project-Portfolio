import { ProjectItem } from '../types';

export const DEFAULT_PROJECT_DATA_URL =
  'https://raw.githubusercontent.com/KN-Vignesh/Projects/main/portfolio/projects.json';

const projectDataUrl = import.meta.env?.VITE_PROJECT_DATA_URL || DEFAULT_PROJECT_DATA_URL;

const REMOTE_ID_TO_LOCAL_ID: Record<string, string> = {
  'shiny-agents': 'shiny',
  'qlora-adaptation': 'qlora',
  'rag-deepeval': 'evaluation',
  'house-price-prediction': 'house-price',
  'titanic-survival': 'titanic',
  'bert-nlp': 'bert',
  'cnn-fundamentals': 'cnn',
};

export function resolveCanonicalProjectId(idOrAlias: string): string {
  return REMOTE_ID_TO_LOCAL_ID[idOrAlias] || idOrAlias;
}

interface RawRemoteProjectEntry {
  id: string;
  title: string;
  tier?: string;
  domain?: string;
  path?: string;
  projectPath?: string;
  repository?: string;
  technologies?: string[];
  stack?: string[];
  assets?: {
    housePrice3dJson?: string;
    projectLocal3dJson?: string;
    rawGitHubUrl?: string;
    rawProjectLocalGitHubUrl?: string;
  };
  [key: string]: unknown;
}

function isProjectEntry(value: unknown): value is RawRemoteProjectEntry {
  if (!value || typeof value !== 'object') return false;
  const project = value as Record<string, unknown>;
  const hasTech = Array.isArray(project.technologies) || Array.isArray(project.stack);
  const hasRepoOrPath =
    typeof project.repository === 'string' ||
    typeof project.projectPath === 'string' ||
    typeof project.path === 'string';
  return typeof project.id === 'string' && typeof project.title === 'string' && hasRepoOrPath && hasTech;
}

async function loadFallbackProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch('/projects.json');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.projects)) {
        return data.projects.filter(isProjectEntry) as unknown as ProjectItem[];
      }
    }
  } catch (e) {
    console.warn('[Project Registry] Fallback local fetch failed:', e);
  }
  return [];
}

const DEFAULT_SECTIONS: ProjectItem['sections'] = {
  problem: '',
  whyApproach: '',
  dataInput: '',
  architecture: '',
  implementation: '',
  evaluation: '',
  engineeringDecisions: [],
  limitations: [],
  futureImprovements: [],
};

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const response = await fetch(projectDataUrl);
    if (!response.ok) {
      console.info(
        `[Project Registry] Remote registry returned HTTP ${response.status}. Using verified local registry.`
      );
      return loadFallbackProjects();
    }

    const payload = await response.json();
    if (
      !payload ||
      typeof payload !== 'object' ||
      !Array.isArray((payload as { projects?: unknown }).projects)
    ) {
      console.info(
        '[Project Registry] Remote registry returned unexpected payload format. Using verified local registry.'
      );
      return loadFallbackProjects();
    }

    const remoteProjects = (payload as { projects: unknown[] }).projects;
    if (!remoteProjects.every(isProjectEntry)) {
      console.info(
        '[Project Registry] One or more remote project entries malformed. Using verified local registry.'
      );
      return loadFallbackProjects();
    }

    const localFallback = await loadFallbackProjects();
    const localMap = new Map(localFallback.map((p) => [p.id, p]));

    return remoteProjects.map((remote, index) => {
      const canonicalId = resolveCanonicalProjectId(remote.id);
      const local = localMap.get(canonicalId) || localMap.get(remote.id);
      const rawPath = (remote.projectPath || remote.path || '') as string;
      const cleanPath = rawPath.replace(/^\/+/, '');
      const resolvedRepo =
        remote.repository ||
        (cleanPath
          ? `https://github.com/KN-Vignesh/Projects/tree/main/${cleanPath}`
          : local?.repository || 'https://github.com/KN-Vignesh/Projects');

      const remoteExperimentUrl = remote.assets?.rawGitHubUrl || remote.assets?.rawProjectLocalGitHubUrl;
      const mergedExperiment =
        remoteExperimentUrl || local?.experiment
          ? {
              type: local?.experiment?.type || ('regression-surface' as const),
              dataUrl: remoteExperimentUrl || local?.experiment?.dataUrl,
              fallbackFixtureUrl:
                local?.experiment?.fallbackFixtureUrl || '/data/house_price_3d.fixture.json',
              schemaVersion: local?.experiment?.schemaVersion || '1.0.0',
            }
          : undefined;

      const enriched: ProjectItem = {
        ...(local || {}),
        ...(remote as unknown as Partial<ProjectItem>),
        id: canonicalId,
        number: local?.number || String(index + 1).padStart(2, '0'),
        title: remote.title || local?.title || canonicalId,
        category:
          (typeof remote.category === 'string' ? remote.category : undefined) ||
          local?.category ||
          remote.domain ||
          'AI & ML Engineering',
        tagline:
          (typeof remote.tagline === 'string' ? remote.tagline : undefined) ||
          local?.tagline ||
          remote.domain ||
          '',
        description:
          (typeof remote.description === 'string' ? remote.description : undefined) ||
          local?.description ||
          remote.domain ||
          '',
        role:
          (typeof remote.role === 'string' ? remote.role : undefined) ||
          local?.role ||
          'AI / ML Engineer',
        technologies: Array.isArray(remote.technologies)
          ? remote.technologies
          : Array.isArray(remote.stack)
          ? remote.stack
          : local?.technologies || [],
        evaluationMetrics: Array.isArray(remote.evaluationMetrics)
          ? (remote.evaluationMetrics as string[])
          : local?.evaluationMetrics || [],
        story: (remote.story as ProjectItem['story']) || local?.story,
        codeFiles: (remote.codeFiles as ProjectItem['codeFiles']) || local?.codeFiles,
        sections:
          (remote.sections as ProjectItem['sections']) ||
          local?.sections ||
          DEFAULT_SECTIONS,
        experiment: mergedExperiment,
        repository: resolvedRepo,
      };
      return enriched;
    });
  } catch (err) {
    console.info('[Project Registry] Remote fetch failed. Serving verified local project registry.', err);
    return loadFallbackProjects();
  }
}
