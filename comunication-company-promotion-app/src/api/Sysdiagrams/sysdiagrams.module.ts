import { Module } from '@nestjs/common';
import { SysdiagramsService } from './sysdiagrams.service';
import { SysdiagramsController } from './sysdiagrams.controller';

@Module({
  controllers: [SysdiagramsController],
  providers: [SysdiagramsService]
})
export class SysdiagramsModule {}
