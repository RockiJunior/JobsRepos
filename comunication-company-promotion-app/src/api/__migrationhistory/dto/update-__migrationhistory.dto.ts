import { PartialType } from '@nestjs/swagger';
import { CreateMigrationhistoryDto } from './create-__migrationhistory.dto';

export class UpdateMigrationhistoryDto extends PartialType(CreateMigrationhistoryDto) {}
