import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHash, buildHash } from '../src/utils/urlState.ts';

test('buildHash → parseHash round-trips modal state', () => {
  const state = {
    modal: 'detail' as const,
    modelId: 'ather-rizta-z-37',
    topicId: null,
    corridorId: null,
    compareIds: ['ather-rizta-z-37', 'ola-s1-pro-gen2'],
    rtoCode: 'TG-09'
  };
  const parsed = parseHash(buildHash(state));
  assert.equal(parsed.modal, 'detail');
  assert.equal(parsed.modelId, 'ather-rizta-z-37');
  assert.deepEqual(parsed.compareIds, ['ather-rizta-z-37', 'ola-s1-pro-gen2']);
  assert.equal(parsed.rtoCode, 'TG-09');
});

test('parseHash rejects invalid model ids and malformed RTO codes', () => {
  const validIds = new Set(['ather-rizta-z-37']);
  const parsed = parseHash('#m=detail&v=bogus-id&rto=TG-999&compare=ather-rizta-z-37,bogus', validIds);
  assert.equal(parsed.modal, 'detail');
  assert.equal(parsed.modelId, null);
  assert.equal(parsed.rtoCode, null);
  assert.deepEqual(parsed.compareIds, ['ather-rizta-z-37']);
});

test('empty or bare hash parses to inert state', () => {
  for (const hash of ['', '#']) {
    const parsed = parseHash(hash);
    assert.equal(parsed.modal, null);
    assert.equal(parsed.modelId, null);
    assert.deepEqual(parsed.compareIds, []);
  }
});
