const test = require('node:test');
const assert = require('node:assert/strict');
const { buildAiVerificationResult, extractOcrText } = require('../src/utils/verification');

test('buildAiVerificationResult returns approved when both selfie and nid files are present', () => {
  const result = buildAiVerificationResult({ selfieImageName: 'selfie.png', nidImageName: 'nid.png' });

  assert.equal(result.status, 'approved');
  assert.ok(result.score >= 80);
  assert.match(result.ocrText.toLowerCase(), /nid/);
});

test('buildAiVerificationResult rejects when one of the required images is missing', () => {
  const result = buildAiVerificationResult({ selfieImageName: 'selfie.png' });

  assert.equal(result.status, 'rejected');
  assert.equal(result.score, 0);
});

test('extractOcrText returns readable text from a filename', () => {
  const result = extractOcrText('NID-123456789');

  assert.match(result.toLowerCase(), /nid/);
  assert.match(result, /123456789/);
});
