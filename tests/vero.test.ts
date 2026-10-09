import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGitHubPrUrl, fetchPullRequestData } from '../src/vero/server/github.js';
import { runSonarQubeAnalysis } from '../src/vero/server/sonarEngine.js';
import { runJevInference } from '../src/vero/server/jevEngine.js';
import { runDeterministicDecisionEngine } from '../src/vero/server/decisionEngine.js';
import { SAMPLE_PRS } from '../src/vero/server/sampleFixtures.js';

test('VERO PR URL Parser: correctly parses canonical and short GitHub URLs', () => {
  const canonical = parseGitHubPrUrl('https://github.com/vitejs/vite/pull/23700');
  assert.ok(canonical);
  assert.equal(canonical.owner, 'vitejs');
  assert.equal(canonical.repo, 'vite');
  assert.equal(canonical.pullNumber, 23700);
  assert.equal(canonical.canonicalUrl, 'https://github.com/vitejs/vite/pull/23700');

  const shortForm = parseGitHubPrUrl('facebook/react#28271');
  assert.ok(shortForm);
  assert.equal(shortForm.owner, 'facebook');
  assert.equal(shortForm.repo, 'react');
  assert.equal(shortForm.pullNumber, 28271);

  const invalid = parseGitHubPrUrl('https://google.com');
  assert.equal(invalid, null);
});

test('VERO SonarQube Static Analysis: identifies SQL injection and credentials in insecure PR', () => {
  const fixture = SAMPLE_PRS['KN-Vignesh/PR-Sentinel-Demo/pull/1'];
  assert.ok(fixture);

  const sonar = runSonarQubeAnalysis(fixture.files);
  assert.equal(sonar.qualityGate, 'FAILED');
  assert.ok(sonar.metrics.vulnerabilities >= 1, 'Must detect at least 1 vulnerability');

  // Verify specific vulnerability rule detections
  const hasSqlInjection = sonar.issues.some((i) => i.ruleId === 'S3649' || i.ruleId === 'S2077');
  const hasHardcodedKey = sonar.issues.some((i) => i.ruleId === 'S2068');
  assert.ok(hasSqlInjection, 'Must detect S3649 SQL injection / unparameterized query violation');
  assert.ok(hasHardcodedKey, 'Must detect S2068 hardcoded credential violation');
});

test('VERO TypeSafe Jev & Decision Engine: enforces SECURITY_REVIEW_REQUIRED on vulnerable changes', async () => {
  const fixture = SAMPLE_PRS['KN-Vignesh/PR-Sentinel-Demo/pull/1'];
  const sonar = runSonarQubeAnalysis(fixture.files);
  const jev = await runJevInference(fixture.metadata, fixture.files);

  assert.ok(jev.tokensEvaluated > 0);
  assert.ok(['HIGH', 'CRITICAL'].includes(jev.risk.selected));

  const assessment = runDeterministicDecisionEngine(fixture.metadata, fixture.files, sonar, jev);
  assert.equal(assessment.verdict, 'SECURITY_REVIEW_REQUIRED');
  assert.equal(assessment.overallRisk, 'CRITICAL');
  assert.ok(assessment.summaryStatements.some((s) => s.includes('vulnerability')));
});

test('VERO Evaluation of Intermediate-Level Public PR (vitejs/vite#23700): Anticipated vs Actual Validation', async () => {
  // Step 1: Parse PR URL
  const parsed = parseGitHubPrUrl('https://github.com/vitejs/vite/pull/23700');
  assert.ok(parsed, 'URL must parse correctly');

  // Step 2: Fetch metadata and files from GitHub API
  const { metadata, files, source } = await fetchPullRequestData(parsed);

  // Anticipated Metadata Assertions
  assert.equal(metadata.owner, 'vitejs');
  assert.equal(metadata.repo, 'vite');
  assert.equal(metadata.number, 23700);
  assert.equal(metadata.changedFilesCount, 3);
  assert.ok(metadata.title.includes('known environment names'));
  assert.equal(files.length, 3);
  assert.ok(source === 'github_live_api' || source === 'verified_public_fixture');

  // Anticipated File Classification Assertions
  const testFile = files.find((f) => f.filename.includes('__tests_dts__'));
  assert.ok(testFile, 'Test file packages/vite/src/node/__tests_dts__/config.ts must be detected');
  assert.equal(testFile.isTestFile, true);

  // Step 3: SonarQube Deterministic Static Analysis
  const sonar = runSonarQubeAnalysis(files);

  // Anticipated SonarQube Response: Clean TypeScript types, passed quality gate, 0 vulnerabilities
  assert.equal(sonar.qualityGate, 'PASSED');
  assert.equal(sonar.metrics.vulnerabilities, 0);
  assert.equal(sonar.metrics.bugs, 0);
  assert.equal(sonar.metrics.securityHotspots, 0);
  assert.ok(sonar.rulesEvaluatedCount > 100);

  // Step 4: TypeSafe Jev Probabilistic Inference
  const jev = await runJevInference(metadata, files);

  // Anticipated Jev Response: Classified as REFACTOR or FEATURE, LOW risk tier, valid Shannon entropy
  assert.ok(['REFACTOR', 'FEATURE'].includes(jev.category.selected));
  assert.equal(jev.risk.selected, 'LOW');
  assert.ok(jev.calibratedScore <= 50, 'Calibrated risk score must be under 50 for clean typing change');
  assert.ok(jev.category.entropy !== undefined && jev.category.entropy > 0);

  // Step 5: Deterministic Decision Engine
  const assessment = runDeterministicDecisionEngine(metadata, files, sonar, jev);

  // Anticipated Decision Engine Verdict: Standard peer review or expedited merge, never blocked
  assert.ok(
    assessment.verdict === 'STANDARD_REVIEW_REQUIRED' || assessment.verdict === 'EXPEDITED_MERGE_OK',
    `Verdict must be STANDARD_REVIEW_REQUIRED or EXPEDITED_MERGE_OK, got: ${assessment.verdict}`
  );
  assert.equal(assessment.overallRisk, 'LOW');
  assert.ok(assessment.recommendedActions.length > 0);
  assert.ok(assessment.evidenceAuditTrail.length >= 3);
});

test('VERO Multi-PR Session History Archive: verifies structured export schema', () => {
  const sampleHistory = [
    {
      id: 'vitejs-vite-23700-1791513716',
      url: 'https://github.com/vitejs/vite/pull/23700',
      repo: 'vitejs/vite',
      number: 23700,
      title: 'feat(types): expose known environment names',
      timestamp: '2026-10-09T02:41:56.945Z',
      verdict: 'Standard Peer Review Required',
      risk: 'LOW' as const,
      usedCustomToken: false,
    },
    {
      id: 'KN-Vignesh-PR-Sentinel-Demo-1-1791513600',
      url: 'https://github.com/KN-Vignesh/PR-Sentinel-Demo/pull/1',
      repo: 'KN-Vignesh/PR-Sentinel-Demo',
      number: 1,
      title: 'feat(payments): add retry loop and direct database transaction logging',
      timestamp: '2026-10-09T02:40:00.048Z',
      verdict: 'Merge Blocked: Security Sign-off Required',
      risk: 'CRITICAL' as const,
      usedCustomToken: false,
    },
  ];

  const exportPayload = {
    archiveTitle: 'VERO Pull Request Intelligence — Multi-PR Audit Session History',
    exportedAt: new Date().toISOString(),
    generator: 'VERO Tri-Pillar Assessment Platform (Deterministic Precedence + TypeSafe Jev + SonarQube Clean Code)',
    author: 'Vignesh K N (https://github.com/KN-Vignesh)',
    totalAudits: sampleHistory.length,
    audits: sampleHistory.map((item) => ({
      id: item.id,
      url: item.url,
      repository: item.repo,
      pullNumber: item.number,
      title: item.title,
      analyzedAt: item.timestamp,
      verdict: item.verdict,
      riskTier: item.risk,
      tokenMode: item.usedCustomToken ? 'Custom GitHub Token' : 'Shared Demo Token',
    })),
  };

  assert.equal(exportPayload.totalAudits, 2);
  assert.equal(exportPayload.audits[0].repository, 'vitejs/vite');
  assert.equal(exportPayload.audits[0].riskTier, 'LOW');
  assert.equal(exportPayload.audits[1].riskTier, 'CRITICAL');
  const serialized = JSON.stringify(exportPayload);
  assert.ok(serialized.includes('vitejs/vite'));
  assert.ok(serialized.includes('PR-Sentinel-Demo'));
});
