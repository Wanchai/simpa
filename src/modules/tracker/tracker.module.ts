import { Module } from '@nestjs/common';
import { SitesModule } from '../sites/sites.module';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';

@Module({
  controllers: [TrackerController],
  providers: [TrackerService],
  imports: [SitesModule],
})
export class TrackerModule {}
