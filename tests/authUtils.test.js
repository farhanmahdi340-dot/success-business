const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, comparePassword, createToken } = require('../src/utils/auth');

test('hashPassword creates a hashed password', async () => {
  const password = 'StrongPass123!';
  const hashed = await hashPassword(password);

  assert.notStrictEqual(hashed, password);
  assert.match(hashed, /\$2[aby]\$/);
});

test('comparePassword validates correct password and rejects wrong one', async () => {
  const password = 'StrongPass123!';
  const hashed = await hashPassword(password);

  assert.equal(await comparePassword(password, hashed), true);
  assert.equal(await comparePassword('WrongPassword', hashed), false);
});

test('createToken returns a non-empty JWT string', () => {
  const token = createToken({ id: '123' });

  assert.equal(typeof token, 'string');
  assert.ok(token.length > 20);
});
