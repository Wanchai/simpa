import { defineEventHandler } from 'h3';
import { gte } from 'drizzle-orm';
import { db } from '../../../../db/index';
import { site, count } from '../../../../db/schema';
import { requireAuth } from '../../utils/auth';

interface RefererCount {
  url: string;
  count: number;
}

interface SiteAnalytics {
  site: typeof site.$inferSelect;
  data: string; // JSON string for Chart.js
  referers: RefererCount[];
}

export default defineEventHandler(async (event): Promise<SiteAnalytics[]> => {
  await requireAuth(event);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const sites = await db.select().from(site);
  const recentCounts = await db
    .select()
    .from(count)
    .where(gte(count.date, sixMonthsAgo.toISOString()));

  return sites.map((s) => {
    const siteCounts = recentCounts.filter((c) => c.siteId === s.id);

    // Group by day → Chart.js line chart
    const byDay: Record<string, number> = {};
    for (const c of siteCounts) {
      const day = new Date(c.date).toLocaleDateString('en-US');
      byDay[day] = (byDay[day] ?? 0) + 1;
    }
    const labels = Object.keys(byDay).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
    const chartData = {
      labels,
      datasets: [
        {
          label: s.name,
          data: labels.map((l) => byDay[l]),
          fill: false,
          tension: 0.1,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    };

    // Referrer frequency by hostname
    const refMap: Record<string, number> = {};
    for (const c of siteCounts) {
      if (c.referer) {
        try {
          const host = new URL(c.referer).hostname;
          if (host) refMap[host] = (refMap[host] ?? 0) + 1;
        } catch {
          // ignore malformed URLs
        }
      }
    }
    const referers: RefererCount[] = Object.entries(refMap)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count);

    return { site: s, data: JSON.stringify(chartData), referers };
  });
});
