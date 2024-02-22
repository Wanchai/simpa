import { Global, Module } from '@nestjs/common';
import { HelperService } from './helpers/helper.service';

@Global()
@Module({ providers: [HelperService], exports: [HelperService] })
export class CoreModule {}
