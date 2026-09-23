import { readFile } from 'node:fs/promises';
import type { GuardianConfig, FailureEvidence, ProjectReference } from './types';
import { createEvidence } from './evidence';

export async function readReference(filePath: string): Promise<ProjectReference> { return JSON.parse(await readFile(filePath, 'utf8')) as ProjectReference; }
export async function detectFixtureFailure(config: GuardianConfig): Promise<FailureEvidence | null> { const reference = await readReference(config.fixturePath); const expected = await readReference(config.expectedFixturePath); if (reference.path === expected.path) return null; return createEvidence(reference, `${config.projectOwner}/${config.projectRepository}`, reference.path, expected.path); }