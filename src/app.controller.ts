import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  Session,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'hbs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService<any>,
  ) {
    Handlebars.registerHelper('json', function (context) {
      return JSON.stringify(context);
    });
  }

  @Post()
  login(
    @Session() session: Record<string, any>,
    @Body() body: any,
    @Res() res: any,
  ) {
    if (body.passfield === this.configService.get<string>('password')) {
      session.logged = true;
    }
    res.redirect('/');
  }

  @Get()
  @Render('index')
  root(@Session() session: Record<string, any>) {
    if (!session.logged) {
      return {
        logged: false,
      };
    }

    return this.appService.getAllDatas().then((data) => {
      const sites = data.map((s) => ({
        site: s,
        data: JSON.stringify({
          labels: s.counts.labels,
          datasets: [
            {
              label: 'Visits',
              data: s.counts.data,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        }),
        referers: s.referersCount.sort((a, b) => (a.count < b.count ? 1 : -1)),
      }));

      return {
        sites,
        logged: true,
      };
    });
  }
}
