import { PartialType } from '@nestjs/swagger';
import { CreateSysdiagramDto } from './create-sysdiagram.dto';

export class UpdateSysdiagramDto extends PartialType(CreateSysdiagramDto) {}
