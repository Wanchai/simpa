import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  shortID(): string {
    return Math.random().toString(36).split('.')[1];
  }
}
