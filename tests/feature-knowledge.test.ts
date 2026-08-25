import { test } from 'node:test';
import assert from 'node:assert/strict';
import { explainFeature } from '../src/data/featureKnowledge.ts';
import { getAllVehiclesIncludingBenchmark } from '../src/data/evModels.ts';

// Contract: every feature shown to buyers either explains itself (a full benefit
// sentence) or is matched to a plain-language "why it matters" explainer.
test('every short generic feature label has an explanation', () => {
  const unmatched: string[] = [];
  for (const model of getAllVehiclesIncludingBenchmark()) {
    for (const feature of model.features) {
      if (feature.length < 40 && !explainFeature(feature)) {
        unmatched.push(`${model.id}: "${feature}"`);
      }
    }
  }
  assert.deepEqual(unmatched, []);
});

test('long descriptive feature strings are treated as self-explanatory', () => {
  const long = 'Active electronic winglets that articulate based on lean angle';
  assert.equal(explainFeature(long), null);
});

test('explainFeature returns null for unknown strings instead of throwing', () => {
  assert.equal(explainFeature('Umbrella holder'), null);
  assert.equal(explainFeature(''), null);
});
