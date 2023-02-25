import { Module } from '@nestjs/common';
import { MigrationhistoryService } from './__migrationhistory.service';
import { MigrationhistoryController } from './__migrationhistory.controller';

@Module({
  controllers: [MigrationhistoryController],
  providers: [MigrationhistoryService],
})
export class MigrationhistoryModule {}
