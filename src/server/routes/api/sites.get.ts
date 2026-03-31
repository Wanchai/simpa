import { defineEventHandler } from 'h3';
import { db } from '../../../../db/index';
import { site } from '../../../../db/schema';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  return db.select().from(site);
});
