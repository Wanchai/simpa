import { defineEventHandler, getRouterParam, createError } from 'h3';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db/index';
import { site, count } from '../../../../../db/schema';
import { requireAuth } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'id is required' });
  }

  const existing = db.select().from(site).where(eq(site.id, id)).get();
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Site not found' });
  }

  db.delete(count).where(eq(count.siteId, id)).run();
  db.delete(site).where(eq(site.id, id)).run();

  return { success: true };
});
