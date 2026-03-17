import { defineEventHandler, readBody, sendRedirect } from 'h3';
import { getAppSession } from '../../../utils/session';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ passfield?: string }>(event);
  const session = await getAppSession(event);
  const password = process.env['PASSWORD'] || 'demo';

  await session.update({ logged: body?.passfield === password });

  return sendRedirect(event, '/');
});

