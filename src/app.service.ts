import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { MoreThan, Repository } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';
import { RefererCount, SiteDisplayCount } from './models/display-count.model';
import { Count } from './modules/sites/entities/count.entity';
import { Site } from './modules/sites/entities/site.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Site) private siteRepo: Repository<Site>,
    @InjectRepository(Count) private countRepo: Repository<Count>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  getAllDatas() {
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const source$ = forkJoin([
      this.siteRepo.find(),
      this.countRepo.find({
        where: {
          date: MoreThan(DateUtils.mixedDateToUtcDatetimeString(sixMonthAgo)),
        },
      }),
    ]).pipe(
      map(([sites, counts]: [Site[], Count[]]) => {
        return sites.map((s) => {
          return {
            ...s,
            counts: {},
            data: counts
              .filter((c) => c.siteId === s.id)
              // Sorting by date as key
              .reduce((acc, val) => {
                const date = val.date as Date;
                const key = date.toLocaleDateString();
                if (typeof acc[key] !== 'undefined') {
                  acc[key]++;
                  return acc;
                } else {
                  acc[key] = 1;
                  return acc;
                }
              }, {}),
            referers: counts
              .filter((c) => c.siteId === s.id)
              .reduce<Record<string, RefererCount>>((acc, val) => {
                const key =
                  val.referer.substring(
                    val.referer.indexOf('//') + 2,
                    val.referer.indexOf('/', val.referer.indexOf('//') + 2),
                  ) || 'None';

                if (typeof acc[key] !== 'undefined') {
                  acc[key].count++;
                  return acc;
                } else {
                  acc[key] = { count: 1, url: key };
                  return acc;
                }
              }, {}),
          } as SiteDisplayCount;
        });
      }),
      map((siteList) => {
        siteList.forEach((s) => {
          s.counts = {
            labels: Object.keys(s.data),
            data: Object.values(s.data),
          };
          s.referersCount = Object.values(s.referers);
        });
        return siteList;
      }),
    );
    return lastValueFrom(source$);
  }
}
