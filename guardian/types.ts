export type GuardianMode = 'dry-run' | 'prototype';
export type GuardianStatus = 'PASS' | 'DETECTED' | 'ISSUE_CREATED' | 'DIAGNOSED' | 'REPAIR_PLANNED' | 'REPAIR_REJECTED' | 'REPAIRED' | 'VALIDATION_FAILED' | 'BRANCH_CREATED' | 'PR_CREATED' | 'REQUIRES_HUMAN_REVIEW';

export interface GuardianConfig {
  mode: GuardianMode;
  projectOwner: string;
  projectRepository: string;
  projectBranch: string;
  fixturePath: string;
  expectedFixturePath: string;
  githubToken?: string;
  aiApiKey?: string;
  aiModel: string;
  aiBaseUrl: string;
  githubWrite: boolean;
}

export interface ProjectReference { id: string; title: string; repository: string; path: string; expectedPath: string; }
export interface FailureEvidence { check: string; failure: string; expected: string; actual: string; repository: string; projectPath: string; environment: string; detectedAt: string; }
export interface Diagnosis { diagnosis: string; rootCause: string; confidence: number; severity: 'low' | 'medium' | 'high' | 'critical'; recommendedAction: string; repairOperations: RepairOperation[]; validationRequired: string[]; provider: string; }
export interface RepairOperation { operation: 'replaceExactText' | 'updateProjectReference' | 'updateKnownConfiguration'; file: string; oldValue: string; newValue: string; reason: string; }
export interface RepairPlan { operations: RepairOperation[]; risk: 'low' | 'medium' | 'high'; confidence: number; validation: string[]; }
export interface ValidationResult { passed: boolean; checks: Array<{ name: string; passed: boolean; detail: string }>; }
export interface GitPlan { branch: string; diff: string; filesChanged: string[]; pullRequestTitle: string; pullRequestBody: string; }
export interface GuardianRun { runId: string; status: GuardianStatus; environment: string; commit: string; evidence?: FailureEvidence; fingerprint?: string; diagnosis?: Diagnosis; repairPlan?: RepairPlan; validation?: ValidationResult; git?: GitPlan; }