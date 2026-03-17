import { defineEventHandler, readBody, sendRedirect, createError } from 'h3';
import { db } from '../../../../db/index';
import { site } from '../../../../db/schema';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const body = await readBody<{ name?: string; url?: string }>(event);
  if (!body?.name || !body?.url) {
    throw createError({ statusCode: 400, message: 'name and url are required' });
  }

  const id = Math.random().toString(36).split('.')[1];
  await db.insert(site).values({ id, name: body.name, url: body.url });

  return sendRedirect(event, '/sites');
});
