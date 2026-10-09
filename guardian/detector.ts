import { readFile } from 'node:fs/promises';
import type { GuardianConfig, FailureEvidence, ProjectReference } from './types';
import { createEvidence } from './evidence';
import { VERIFIED_PROJECTS } from '../src/data/defaultProjects';

export async function readReference(filePath: string): Promise<ProjectReference> {
  return JSON.parse(await readFile(filePath, 'utf8')) as ProjectReference;
}

export async function detectFixtureFailure(config: GuardianConfig): Promise<FailureEvidence | null> {
  const reference = await readReference(config.fixturePath);
  const expected = await readReference(config.expectedFixturePath);
  if (reference.path === expected.path) return null;
  return createEvidence(reference, `${config.projectOwner}/${config.projectRepository}`, reference.path, expected.path);
}

export interface ProjectRegistryScanItem {
  id: string;
  title: string;
  repository: string;
  projectPath?: string;
  isStandaloneRepo: boolean;
  status: 'VERIFIED' | 'MONOREPO_PATH';
}

export function scanPortfolioRegistry(): {
  total: number;
  standaloneRepos: number;
  monorepoPaths: number;
  projects: ProjectRegistryScanItem[];
} {
  const scanned = VERIFIED_PROJECTS.map((p) => {
    const isStandalone = !p.repository.endsWith('/Projects');
    return {
      id: p.id,
      title: p.title,
      repository: p.repository,
      projectPath: p.projectPath,
      isStandaloneRepo: isStandalone,
      status: (isStandalone ? 'VERIFIED' : 'MONOREPO_PATH') as 'VERIFIED' | 'MONOREPO_PATH',
    };
  });

  return {
    total: scanned.length,
    standaloneRepos: scanned.filter((s) => s.isStandaloneRepo).length,
    monorepoPaths: scanned.filter((s) => !s.isStandaloneRepo).length,
    projects: scanned,
  };
}
