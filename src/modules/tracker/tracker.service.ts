import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, switchMap, tap } from 'rxjs';
import { Repository } from 'typeorm';
import { Count } from '../sites/entities/count.entity';
import { Site } from '../sites/entities/site.entity';
import { UpdateTrackerDto } from './dto/update-tracker.dto';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Site) private siteRepo: Repository<Site>,
    @InjectRepository(Count) private countRepo: Repository<Count>,
    private readonly configService: ConfigService<any>,
  ) {}

  count({ id, ref, page, country, ip, client, origin }: UpdateTrackerDto) {
    if (!id) {
      throw new HttpException('No tracker data!', HttpStatus.BAD_REQUEST);
    }

    return from(this.siteRepo.findOne({ where: { id } })).pipe(
      tap((s) => {
        if (!s) throw new HttpException('Bad site ID', HttpStatus.BAD_REQUEST);

        if (
          this.configService.get<boolean>('filterOrigin') &&
          !origin.includes(s.url)
        )
          throw new HttpException(
            "You can't send requests from that place",
            HttpStatus.BAD_REQUEST,
          );
      }),
      map((s) => {
        return this.countRepo.create({
          date: new Date(),
          referer: ref,
          siteId: s.id,
          page,
          country,
          ip,
          client,
        });
      }),
      switchMap((count) => this.countRepo.save(count)),
      map(() => 'Ok'),
    );
  }
}
