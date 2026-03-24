import { test, expect } from '@playwright/test';
import { generateToken } from './utils/auth';

test.describe('Auth', () => {
  test('Health Check - GET /ping returns 201', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('POST /auth returns a non-empty token', async ({ request }) => {
    const token = await generateToken(request);
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });
});
