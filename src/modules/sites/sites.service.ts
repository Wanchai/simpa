import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/core/helpers/helper.service';
import { Repository } from 'typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { Site } from './entities/site.entity';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site) private siteRepo: Repository<Site>,
    private readonly helpers: HelperService,
  ) {}

  create({ name, url = '' }: CreateSiteDto) {
    const site = this.siteRepo.create({
      id: this.helpers.shortID(),
      name,
      url,
    });
    return this.siteRepo.save(site);
  }

  getAll() {
    return this.siteRepo.find();
  }
}
