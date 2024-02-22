import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  Session,
} from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  @Render('sites')
  root(@Session() session: Record<string, any>, @Res() res: any) {
    if (!session.logged) {
      res.redirect('/');
    }
    return this.sitesService.getAll().then((data) => {
      return {
        sites: data.map((s) => ({
          ...s,
          createdAt: s.createdAt.toDateString(),
        })),
        logged: true,
        host: process.env.SIMPA_ADDRESS,
      };
    });
  }

  @Post()
  create(@Body() createSiteDto: CreateSiteDto, @Res() res: any) {
    this.sitesService.create(createSiteDto).then(() => {
      res.redirect('/sites');
    });
  }
}
