import { defineEventHandler, readBody, createError, getHeader, setResponseHeaders } from 'h3';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/index';
import { site, count } from '../../../../db/schema';
import geoip from 'geoip-lite';

export default defineEventHandler(async (event) => {
  // Allow cross-origin POSTs from any tracked website
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  const body = await readBody<{ id?: string; ref?: string; page?: string }>(event);
  if (!body?.id) {
    throw createError({ statusCode: 400, message: 'No tracker data!' });
  }

  const [siteRecord] = await db.select().from(site).where(eq(site.id, body.id));
  if (!siteRecord) {
    throw createError({ statusCode: 400, message: 'Site not found' });
  }

  const filterOrigin = process.env['FILTER_ORIGIN'] === 'true';
  if (filterOrigin) {
    const origin = getHeader(event, 'origin') || '';
    if (!origin.includes(siteRecord.url)) {
      throw createError({ statusCode: 400, message: 'Invalid origin' });
    }
  }

  const forwarded = getHeader(event, 'x-forwarded-for');
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : (event.node.req.socket?.remoteAddress ?? '');

  const geo = geoip.lookup(ip);
  const country = geo?.country ?? '';
  const client = getHeader(event, 'user-agent') ?? '';

  await db.insert(count).values({
    siteId: body.id,
    referer: body.ref ?? '',
    page: body.page ?? '',
    country,
    ip,
    client,
  });

  return 'Ok';
});
