import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests/api',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'on-failure' }]],
  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
  },
});

// dotenv.config() copies the contents of your .env file into Node.js's built-in memory (process.env). This is exactly what allows your generateToken function to pull the credentials using process.env.API_USERNAME
