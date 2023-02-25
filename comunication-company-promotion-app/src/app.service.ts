import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  getStatus(): Object {
    return {
      status: 'Up!',
      uptime: process.uptime(),
      version: '0.0.4',
    };
  }
}
