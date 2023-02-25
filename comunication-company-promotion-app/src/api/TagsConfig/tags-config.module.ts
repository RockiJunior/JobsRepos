import { Module } from '@nestjs/common';
import { TagsConfigService } from './tags-config.service';
import { TagsConfigController } from './tags-config.controller';

@Module({
  controllers: [TagsConfigController],
  providers: [TagsConfigService]
})
export class TagsConfigModule {}
