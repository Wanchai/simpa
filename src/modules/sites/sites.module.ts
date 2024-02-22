import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { HelperService } from 'src/core/helpers/helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { Count } from './entities/count.entity';
import { DayCount } from './entities/day-count.entity';

@Module({
  controllers: [SitesController],
  providers: [SitesService, HelperService],
  imports: [TypeOrmModule.forFeature([Site, Count, DayCount])],
  exports: [TypeOrmModule],
})
export class SitesModule {}
