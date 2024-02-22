import { Body, Controller, Get, Header, Post, Req, Res } from '@nestjs/common';
import { lookup } from 'geoip-lite';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { TrackerService } from './tracker.service';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  update(@Req() request, @Body() update: UpdateTrackerDto) {
    // TODO: Add to avoid bots
    // const regTest = /mozilla|chrome|safari|opera/gi;

    // if (!regTest.test(request.get('user-agent'))) {
    //   throw new HttpException('unknown agent', HttpStatus.BAD_REQUEST);
    // }

    const ip = request.headers['x-forwarded-for'] ?? '';
    // console.log(request);

    return this.trackerService.count({
      ...update,
      country: lookup(ip)?.country ?? '',
      client: request.headers['user-agent'],
      ip,
      origin: request.headers.origin ?? '',
    });
  }

  @Get('js')
  @Header('content-type', 'application/javascript')
  getScript(@Res() res) {
    return res.sendFile('tracker.js', { root: 'public' });
  }
}
