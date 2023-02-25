import { PartialType } from '@nestjs/swagger';
import { CreateTagsConfigDto } from './create-tags-config.dto';

export class UpdateTagsConfigDto extends PartialType(CreateTagsConfigDto) {}
