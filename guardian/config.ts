import path from 'node:path';
import type { GuardianConfig, GuardianMode } from './types';

const root = process.cwd();
export function getConfig(env: NodeJS.ProcessEnv = process.env): GuardianConfig {
  const mode = (env.GUARDIAN_MODE || 'dry-run') as GuardianMode;
  if (mode !== 'dry-run' && mode !== 'prototype') throw new Error('GUARDIAN_MODE must be dry-run or prototype');
  return {
    mode,
    projectOwner: env.GUARDIAN_PROJECT_OWNER || 'KN-Vignesh',
    projectRepository: env.GUARDIAN_PROJECT_REPOSITORY || 'Projects',
    projectBranch: env.GUARDIAN_PROJECT_BRANCH || 'main',
    fixturePath: env.GUARDIAN_FIXTURE_PATH || path.join(root, 'guardian/fixtures/project-reference.json'),
    expectedFixturePath: env.GUARDIAN_EXPECTED_FIXTURE_PATH || path.join(root, 'guardian/fixtures/project-reference.expected.json'),
    githubToken: env.GITHUB_TOKEN,
    aiApiKey: env.AI_API_KEY || env.GEMINI_API_KEY,
    aiModel: env.AI_MODEL || 'gemini-2.5-flash',
    aiBaseUrl: env.AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai',
    githubWrite: env.GUARDIAN_GITHUB_WRITE === 'true',
  };
}