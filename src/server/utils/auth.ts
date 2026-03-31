import type { H3Event } from 'h3';
import { createError } from 'h3';
import { getAppSession } from './session';

/** Throws 401 if the request has no valid session. */
export async function requireAuth(event: H3Event): Promise<void> {
  const session = await getAppSession(event);
  if (!session.data?.logged) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
}

