import test from 'node:test';
import assert from 'node:assert/strict';
import { CURATED_AI_TRENDS } from '../src/data/aiTrends';

test('AI Trends Data Contract: verifies structured telemetry feed', () => {
  assert.ok(Array.isArray(CURATED_AI_TRENDS));
  assert.ok(CURATED_AI_TRENDS.length >= 3, 'Must contain at least 3 curated trending items');

  for (const item of CURATED_AI_TRENDS) {
    assert.ok(item.id, 'Trend item must have an id');
    assert.ok(item.name, 'Trend item must have a name');
    assert.ok(item.category, 'Trend item must have a category');
    assert.ok(item.headline, 'Trend item must have a headline');
    assert.ok(item.metric, 'Trend item must have a key metric');
    assert.ok(item.architectureNotes, 'Trend item must have architectural notes');
  }
});
