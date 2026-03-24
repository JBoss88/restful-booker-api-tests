import { APIRequestContext, expect } from '@playwright/test';

export async function generateToken(
  request: APIRequestContext,
): Promise<string> {
  // 1. Grab the credentials from the environment
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;

  // 2. Safety check: Fail loudly if they are missing
  if (!username || !password) {
    throw new Error(
      'Missing credentials: API_USERNAME and API_PASSWORD must be set in your .env file.',
    );
  }

  // 3. Make the request using the variables
  const response = await request.post('/auth', {
    data: { username, password },
  });

  expect(response.status()).toBe(200);

  const body: { token: string } = await response.json();
  return body.token;
}
