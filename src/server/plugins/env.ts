import { defineNitroPlugin } from 'nitropack/runtime';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Load .env from project root at server startup so SIMPA_ADDRESS,
 * PASSWORD, SESSION_SECRET etc. are available in production without
 * having to export them manually in the OS environment.
 */
export default defineNitroPlugin(() => {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      // Only set if not already provided by OS environment
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env not found — rely on OS environment variables
  }
});
