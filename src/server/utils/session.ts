import type { H3Event } from 'h3';
import { useSession } from 'h3';

export interface SessionData {
  logged?: boolean;
}

/** SESSION_SECRET must be ≥32 chars; pad if needed */
function getSecret(): string {
  const s = process.env['SESSION_SECRET'] || 'simpa-default-secret-change-me!!';
  return s.padEnd(32, '!');
}

export function getAppSession(event: H3Event) {
  return useSession<SessionData>(event, {
    password: getSecret(),
    maxAge: 60 * 60 * 24, // 24 h
    name: 'simpa.sid',
  });
}
